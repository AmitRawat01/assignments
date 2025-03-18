const express = require('express');
const { fetchSnapdealTShirts } = require('../controllers/snapdealController');

const router = express.Router();

router.get('/t-shirt', fetchSnapdealTShirts);

module.exports = router;
