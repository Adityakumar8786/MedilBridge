const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
router.post('/login', authController.login, authController.loginSuccess);
router.get('/fail', authController.loginFail);
router.get('/logout', authController.logout);
router.get('/current', authController.getCurrentUser);
module.exports = router;