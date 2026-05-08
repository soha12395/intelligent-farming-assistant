const express = require('express');
const router = express.Router();
const { addFarm, getFarm, updateFarm, deleteFarm } = require('../controllers/farmController');
const verifyToken = require('../middleware/auth');

router.post('/add', verifyToken, addFarm);
router.get('/get', verifyToken, getFarm);
router.put('/update', verifyToken, updateFarm);
router.delete('/delete', verifyToken, deleteFarm);


module.exports = router;