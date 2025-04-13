const express = require('express');
const router = express.Router();
const reportController = require('../controllers/ReportController');
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');

router.get('/daily-revenue', [auth, admin], reportController.getDailyRevenue);

router.get('/top-spenders', [auth, admin], reportController.getTopSpenders);

router.get('/sales-by-category', [auth, admin], reportController.getSalesByCategory);

module.exports = router;