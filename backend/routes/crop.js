const express = require('express');
const router = express.Router();
const { getRecommendations, getSavedRecommendations, getHistory } = require('../controllers/cropController');
const verifyToken = require('../middleware/auth');

router.post('/recommend', verifyToken, getRecommendations);
router.get('/saved', verifyToken, getSavedRecommendations);
router.get('/history', verifyToken, getHistory);

module.exports = router;