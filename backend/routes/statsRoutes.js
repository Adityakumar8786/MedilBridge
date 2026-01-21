const express = require('express');
const router = express.Router();
const  isAuthenticated  = require('../middlewares/isAuthenticated');
const  authorizeRoles  = require('../middlewares/authorizeRoles');
const statsController = require('../controllers/statsController');
const { ROLES } = require('../constants/roles');
router.get('/', isAuthenticated, authorizeRoles(ROLES.GOVT), statsController.getStats);
module.exports = router;