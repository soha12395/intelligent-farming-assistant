const label_map = {
  // Tomato
  'Tomato with Target Spot': 'Tomato___Target_Spot',
  'Tomato with Tomato Yellow Leaf Curl Virus': 'Tomato___Tomato_Yellow_Leaf_Curl_Virus',
  'Tomato with Tomato Mosaic Virus': 'Tomato___Tomato_mosaic_virus',
  'Tomato with Bacterial Spot': 'Tomato___Bacterial_spot',
  'Tomato with Early Blight': 'Tomato___Early_blight',
  'Tomato with Late Blight': 'Tomato___Late_blight',
  'Tomato with Leaf Mold': 'Tomato___Leaf_Mold',
  'Tomato with Septoria Leaf Spot': 'Tomato___Septoria_leaf_spot',
  'Tomato with Spider Mites': 'Tomato___Spider_mites Two-spotted_spider_mite',
  'Tomato healthy': 'Tomato___healthy',
  // Potato
  'Potato with Early Blight': 'Potato___Early_blight',
  'Potato with Late Blight': 'Potato___Late_blight',
  'Potato healthy': 'Potato___healthy',
  // Pepper
  'Pepper, bell with Bacterial Spot': 'Pepper,_bell___Bacterial_spot',
  'Pepper, bell healthy': 'Pepper,_bell___healthy',
  'Bell Pepper with Bacterial Spot': 'Pepper,_bell___Bacterial_spot',
  'Healthy Bell Pepper Plant': 'Pepper,_bell___healthy',
  // Corn
  'Corn (Maize) with Cercospora Leaf Spot': 'Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot',
  'Corn (Maize) with Common Rust': 'Corn_(maize)___Common_rust_',
  'Corn (Maize) with Northern Leaf Blight': 'Corn_(maize)___Northern_Leaf_Blight',
  'Corn (Maize) healthy': 'Corn_(maize)___healthy',
  // Grape
  'Grape with Black Rot': 'Grape___Black_rot',
  'Grape with Esca': 'Grape___Esca_(Black_Measles)',
  'Grape with Esca (Black Measles)': 'Grape___Esca_(Black_Measles)',
  'Grape with Leaf Blight': 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape with Leaf Blight (Isariopsis Leaf Spot)': 'Grape___Leaf_blight_(Isariopsis_Leaf_Spot)',
  'Grape healthy': 'Grape___healthy',
  // Apple
  'Apple with Apple Scab': 'Apple___Apple_scab',
  'Apple with Black Rot': 'Apple___Black_rot',
  'Apple with Cedar Apple Rust': 'Apple___Cedar_apple_rust',
  'Apple healthy': 'Apple___healthy',
  // Cherry
  'Cherry with Powdery Mildew': 'Cherry_(including_sour)___Powdery_mildew',
  'Cherry (including sour) with Powdery Mildew': 'Cherry_(including_sour)___Powdery_mildew',
  'Cherry healthy': 'Cherry_(including_sour)___healthy',
  // Peach
  'Peach with Bacterial Spot': 'Peach___Bacterial_spot',
  'Peach healthy': 'Peach___healthy',
  // Strawberry
  'Strawberry with Leaf Scorch': 'Strawberry___Leaf_scorch',
  'Strawberry healthy': 'Strawberry___healthy',
  // Raspberry
  'Raspberry healthy': 'Raspberry___healthy',
  // Healthy variants
  'Healthy Potato Plant': 'Potato___healthy',
  'Healthy Tomato Plant': 'Tomato___healthy',
  'Healthy Corn Plant': 'Corn_(maize)___healthy',
  'Healthy Grape Plant': 'Grape___healthy',
  'Healthy Apple Plant': 'Apple___healthy',
  'Healthy Cherry Plant': 'Cherry_(including_sour)___healthy',
  'Healthy Peach Plant': 'Peach___healthy',
  'Healthy Strawberry Plant': 'Strawberry___healthy',
  'Healthy Raspberry Plant': 'Raspberry___healthy',
  'Healthy Pepper Plant': 'Pepper,_bell___healthy',
};




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
    const disease_key     = label_map[topPrediction.label] || topPrediction.label;
    console.log('disease_key from HF:', disease_key);

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