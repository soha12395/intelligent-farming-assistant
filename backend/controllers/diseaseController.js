const multer = require("multer");
const { exec } = require("child_process");
const path = require("path");
const Disease = require("../models/Disease");
const FarmProfile = require("../models/FarmProfile");
const fs = require("fs");

const uploadDir = path.join(__dirname, "../uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir);

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = path.join(__dirname, "../uploads");
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});

const upload = multer({ storage });

const detectDisease = (req, res) => {
  const imagePath = req.file.path;
  const scriptPath = path.join(
    __dirname,
    "../../ai-models/disease-detection/predict.py",
  );
  exec(
    `py -3.11 "${scriptPath}" "${imagePath}" "${req.body.plant}"`,
    (err, stdout, stderr) => {
      if (err) return res.json({ Error: "Error running AI model" });

      const prediction = JSON.parse(stdout);
      const disease_key = prediction.label;
      const selectedPlant = req.body.plant;

      const score = prediction.score;

      Disease.findByKey(disease_key, (err, data) => {
        if (err || data.length === 0)
          return res.json({ Error: "Disease not found in database" });

        const disease = data[0];

        FarmProfile.findByFarmerId(req.farmer_id, (err, farmData) => {
          if (err || farmData.length === 0)
            return res.json({ Error: "Farm profile not found" });

          const detection = {
            profile_id: farmData[0].profile_id,
            disease_id: disease.disease_id,
            image_path: imagePath,
            confidence: score > 0.7 ? "High" : score > 0.4 ? "Medium" : "Low",
          };

          Disease.saveDetection(detection, (err) => {
            if (err) return res.json({ Error: "Error saving detection" });
            return res.json({ Status: "Success", result: disease });
          });
        });
      });
    },
  );
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
