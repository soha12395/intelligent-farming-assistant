const db = require('../config/db');

const Disease = {
  saveDetection: (data, cb) => {
    db.query('INSERT INTO disease_detection SET ?', data, cb);
  },

  getDetectionsByProfile: (profile_id, cb) => {
    db.query(`
      SELECT dd.*, di.disease_name, di.plant_name, di.treatment, di.urgency
      FROM disease_detection dd
      LEFT JOIN disease_info di ON dd.disease_id = di.disease_id
      WHERE dd.profile_id = ?
      ORDER BY dd.detected_at DESC
    `, [profile_id], cb);
  },

  getDetectionsByFarmer: (profile_id, cb) => {
    db.query(`
      SELECT dd.*, di.disease_name, di.plant_name, di.treatment, di.urgency
      FROM disease_detection dd
      LEFT JOIN disease_info di ON dd.disease_id = di.disease_id
      WHERE dd.profile_id = ?
      ORDER BY dd.detected_at DESC
    `, [profile_id], cb);
  },

  findByKey: (disease_key, cb) => {
    db.query('SELECT * FROM disease_info WHERE disease_key = ?', [disease_key], cb);
  }
};

module.exports = Disease;