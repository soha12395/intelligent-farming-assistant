const db = require('../config/db');

const FarmProfile = {
  create: (data, cb) => {
    db.query('INSERT INTO farm_profile SET ?', data, cb);
  },

  findByFarmerId: (farmer_id, cb) => {
    db.query('SELECT * FROM farm_profile WHERE farmer_id = ?', [farmer_id], cb);
  },

  update: (data, farmer_id, cb) => {
    db.query('UPDATE farm_profile SET ? WHERE farmer_id = ?', [data, farmer_id], cb);
  },

  delete: (farmer_id, cb) => {
    db.query('DELETE FROM farm_profile WHERE farmer_id = ?', [farmer_id], cb);
  }
};

module.exports = FarmProfile;