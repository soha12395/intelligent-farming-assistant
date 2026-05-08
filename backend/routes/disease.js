const express = require('express');
const router = express.Router();
const { upload, detectDisease, getDetections, getHistory } = require('../controllers/diseaseController');
const verifyToken = require('../middleware/auth');

router.post('/detect', verifyToken, upload.single('image'), detectDisease);
router.get('/list', verifyToken, getDetections);
router.get('/history', verifyToken, getHistory);

module.exports = router;