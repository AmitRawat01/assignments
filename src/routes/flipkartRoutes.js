const express = require('express');
const { fetchFlipkartMobiles, fetchFlipkartMobilesFull } = require('../controllers/flipkartController');

const router = express.Router();

router.get('/mobile', fetchFlipkartMobiles);
router.get('/mobile/full', fetchFlipkartMobilesFull);

module.exports = router;
