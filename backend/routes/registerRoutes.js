// backend/routes/registerRoutes.js

const express = require('express');
const router = express.Router();

const registerController = require('../controllers/registerController');

// POST routes for registration flow
router.post('/send-otp', registerController.sendOTP);
router.post('/verify-otp', registerController.verifyOTP);

module.exports = router;