const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const Disease = require("../models/Disease");
const FarmProfile = require("../models/FarmProfile");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const detectDisease = async (req, res) => {
  try {
    const imagePath = req.file.path;

    // 1. Send image to Hugging Face API
    const imageBuffer = fs.readFileSync(imagePath);

    const mlResponse = await axios.post(
      'https://router.huggingface.co/hf-inference/models/linkanjarad/mobilenet_v2_1.0_224-plant-disease-identification',
      imageBuffer,
      {
        headers: {
          'Authorization': `Bearer ${process.env.HF_API_KEY}`,
          'Content-Type': 'application/octet-stream',
        }
      }
    );

    const predictions = mlResponse.data;

    // 2. Handle cold start — model still loading
    if (!Array.isArray(predictions)) {
      return res.json({ Error: 'Model is warming up, please try again in 20 seconds' });
    }

    const topPrediction   = predictions[0];
    const disease_key     = topPrediction.label;
    const disease_name    = disease_key.replace('___', ' - ').replace(/_/g, ' ');
    const confidence_score = Math.round(topPrediction.score * 100);

    const confidence = confidence_score > 70 ? 'High'
                     : confidence_score > 40 ? 'Medium'
                     : 'Low';

    // 3. Look up disease in database using disease_key
    Disease.findByKey(disease_key, (err, data) => {
      if (err || !data || data.length === 0) {
        // Disease not found in DB — return basic result
        return res.json({
          Status: "Success",
          result: {
            disease_name,
            confidence_score,
            confidence,
            treatment: 'Consult a local agricultural expert for treatment advice.',
          },
        });
      }

      const disease = data[0];

      // 4. Get farmer's farm profile
      FarmProfile.findByFarmerId(req.farmer_id, (err, farmData) => {
        if (err || !farmData || farmData.length === 0) {
          // No farm profile — return disease info without saving
          return res.json({
            Status: "Success",
            result: buildResult(disease, confidence_score, confidence),
          });
        }

        // 5. Save detection to database
        const detection = {
          profile_id: farmData[0].profile_id,
          disease_id: disease.disease_id,
          image_path: imagePath,
          confidence,
        };

        Disease.saveDetection(detection, (err) => {
          if (err) console.error("Error saving detection:", err);
          return res.json({
            Status: "Success",
            result: buildResult(disease, confidence_score, confidence),
          });
        });
      });
    });

  } catch (error) {
    console.error("Disease detection error:", error.message);
    return res.json({ Error: "Error running AI model: " + error.message });
  }
};

// Helper — build clean result object
const buildResult = (disease, confidence_score, confidence) => ({
  plant_name:    disease.plant_name,
  disease_name:  disease.disease_name,
  is_healthy:    disease.is_healthy === 1,
  confidence,
  confidence_score,
  description:   disease.description,
  symptoms:      disease.symptoms,
  cause:         disease.cause,
  treatment:     disease.treatment,
  chemical_name: disease.chemical_name,
  chemical_type: disease.chemical_type,
  dosage:        disease.dosage,
  prevention:    disease.prevention,
  urgency:       disease.urgency,
});

const getDetections = (req, res) => {
  FarmProfile.findByFarmerId(req.farmer_id, (err, farmData) => {
    if (err || !farmData || farmData.length === 0)
      return res.json({ Error: "Farm profile not found" });
    Disease.getDetectionsByProfile(farmData[0].profile_id, (err, data) => {
      if (err) return res.json({ Error: "Error getting detections" });
      return res.json({ Status: "Success", detections: data });
    });
  });
};

const getHistory = (req, res) => {
  FarmProfile.findByFarmerId(req.farmer_id, (err, farmData) => {
    if (err || !farmData || farmData.length === 0)
      return res.json({ Error: "Farm profile not found" });
    Disease.getDetectionsByProfile(farmData[0].profile_id, (err, data) => {
      if (err) return res.json({ Error: "Error getting history" });
      return res.json({ Status: "Success", history: data });
    });
  });
};

module.exports = { upload, detectDisease, getDetections, getHistory };