const db = require('../config/db');

const Crop = {
  getRecommended: (region, soil_type, season, water, cb) => {
    db.query(`
      SELECT * FROM crop 
      WHERE suitable_region LIKE ? 
      AND suitable_soil LIKE ? 
      AND suitable_season LIKE ? 
      AND suitable_water LIKE ?
    `, [`%${region}%`, `%${soil_type}%`, `%${season}%`, `%${water}%`], cb);
  },

  saveRecommendation: (data, cb) => {
    db.query('INSERT INTO recommended_crop SET ?', data, cb);
  },

  getByProfile: (profile_id, cb) => {
    db.query(`
      SELECT rc.*, c.crop_name, c.description, c.suitable_season 
      FROM recommended_crop rc
      JOIN crop c ON rc.crop_id = c.crop_id
      WHERE rc.profile_id = ?
    `, [profile_id], cb);
  },

  getHistoryByFarmer: (profile_id, cb) => {
    db.query(`
      SELECT rc.*, c.crop_name, c.description, c.suitable_season, c.suitable_soil, c.suitable_water
      FROM recommended_crop rc
      JOIN crop c ON rc.crop_id = c.crop_id
      WHERE rc.profile_id = ?
      ORDER BY rc.recommended_at DESC
    `, [profile_id], cb);
  }
};

module.exports = Crop;