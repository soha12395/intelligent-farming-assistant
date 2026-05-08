const Crop = require('../models/Crop');
const FarmProfile = require('../models/FarmProfile');

const getRecommendations = (req, res) => {
  const { season } = req.body;
  const farmer_id = req.farmer_id;

  FarmProfile.findByFarmerId(farmer_id, (err, data) => {
    if (err || data.length === 0) return res.json({ Error: 'Farm profile not found' });

    const { profile_id, region, soil_type, water_availability } = data[0];

    Crop.getRecommended(region, soil_type, season, water_availability, (err, crops) => {
      if (err) return res.json({ Error: 'Error getting recommendations' });
      if (crops.length === 0) return res.json({ Error: 'No matching crops found' });

      const saves = crops.map(crop => ({
        profile_id,
        crop_id: crop.crop_id,
        season,
        recommended_at: new Date()
      }));

      saves.forEach(save => Crop.saveRecommendation(save, () => {}));

      return res.json({ Status: 'Success', crops });
    });
  });
};

const getSavedRecommendations = (req, res) => {
  const farmer_id = req.farmer_id;

  FarmProfile.findByFarmerId(farmer_id, (err, data) => {
    if (err || data.length === 0) return res.json({ Error: 'Farm profile not found' });

    Crop.getByProfile(data[0].profile_id, (err, crops) => {
      if (err) return res.json({ Error: 'Error getting saved recommendations' });
      return res.json({ Status: 'Success', crops });
    });
  });
};

const getHistory = (req, res) => {
  FarmProfile.findByFarmerId(req.farmer_id, (err, data) => {
    if (err || data.length === 0) return res.json({ Error: 'Farm profile not found' });
    Crop.getHistoryByFarmer(data[0].profile_id, (err, crops) => {
      if (err) return res.json({ Error: 'Error getting history' });
      return res.json({ Status: 'Success', history: crops });
    });
  });
};

module.exports = { getRecommendations, getSavedRecommendations, getHistory };

