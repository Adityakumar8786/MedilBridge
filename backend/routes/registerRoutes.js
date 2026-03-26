
const express = require('express');
const router = express.Router();

const registerController = require('../controllers/registerController');

router.post('/send-otp', registerController.sendOTP);
router.post('/verify-otp', registerController.verifyOTP);

module.exports = router;