const FarmProfile = require('../models/FarmProfile');

const addFarm = (req, res) => {
  const { region, soil_type, farm_size, water_availability } = req.body;
  const farmer_id = req.farmer_id;

  const data = { farmer_id, region, soil_type, farm_size, water_availability };

  FarmProfile.create(data, (err, result) => {
    if (err) return res.json({ Error: 'Error creating farm profile' });
    return res.json({ Status: 'Success' });
  });
};

const getFarm = (req, res) => {
  FarmProfile.findByFarmerId(req.farmer_id, (err, data) => {
    if (err) return res.json({ Error: 'Error getting farm profile' });
    return res.json({ Status: 'Success', farm: data[0] });
  });
};

const updateFarm = (req, res) => {
  const { region, soil_type, farm_size, water_availability } = req.body;
  const data = { region, soil_type, farm_size, water_availability };

  FarmProfile.update(data, req.farmer_id, (err, result) => {
    if (err) return res.json({ Error: 'Error updating farm profile' });
    return res.json({ Status: 'Success' });
  });
};

const deleteFarm = (req, res) => {
  FarmProfile.delete(req.farmer_id, (err, result) => {
    if (err) return res.json({ Error: 'Error deleting farm profile' });
    return res.json({ Status: 'Success' });
  });
};

module.exports = { addFarm, getFarm, updateFarm, deleteFarm };