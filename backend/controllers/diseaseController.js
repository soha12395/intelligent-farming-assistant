const multer = require("multer");
const path = require("path");
const fs = require("fs");
const axios = require("axios");
const FormData = require("form-data");
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

    // Send image to ML service via HTTP
    const formData = new FormData();
    formData.append("image", fs.createReadStream(imagePath));

    const mlResponse = await axios.post(
      `${process.env.ML_SERVICE_URL}/predict/disease`,
      formData,
      { headers: formData.getHeaders() }
    );

    const { disease_name, confidence_score, treatment } = mlResponse.data;

    // Look up disease in database
    Disease.findByKey(disease_name, (err, data) => {
      if (err || !data || data.length === 0) {
        // Disease not in DB, return ML result directly
        return res.json({
          Status: "Success",
          result: {
            disease_name,
            confidence_score,
            treatment,
          },
        });
      }

      const disease = data[0];

      FarmProfile.findByFarmerId(req.farmer_id, (err, farmData) => {
        if (err || !farmData || farmData.length === 0) {
          return res.json({
            Status: "Success",
            result: {
              disease_name,
              confidence_score,
              treatment: disease.treatment || treatment,
            },
          });
        }

        const detection = {
          profile_id: farmData[0].profile_id,
          disease_id: disease.disease_id,
          image_path: imagePath,
          confidence:
            confidence_score > 70
              ? "High"
              : confidence_score > 40
              ? "Medium"
              : "Low",
        };

        Disease.saveDetection(detection, (err) => {
          if (err) console.error("Error saving detection:", err);
          return res.json({
            Status: "Success",
            result: {
              disease_name,
              confidence_score,
              treatment: disease.treatment || treatment,
            },
          });
        });
      });
    });
  } catch (error) {
    console.error("Disease detection error:", error.message);
    return res.json({ Error: "Error running AI model: " + error.message });
  }
};

const getDetections = (req, res) => {
  const profile_id = req.body.profile_id;
  Disease.getDetectionsByProfile(profile_id, (err, data) => {
    if (err) return res.json({ Error: "Error getting detections" });
    return res.json({ Status: "Success", detections: data });
  });
};

const getHistory = (req, res) => {
  FarmProfile.findByFarmerId(req.farmer_id, (err, farmData) => {
    if (err || farmData.length === 0)
      return res.json({ Error: "Farm profile not found" });
    Disease.getDetectionsByFarmer(farmData[0].profile_id, (err, data) => {
      if (err) return res.json({ Error: "Error getting history" });
      return res.json({ Status: "Success", history: data });
    });
  });
};

module.exports = { upload, detectDisease, getDetections, getHistory };