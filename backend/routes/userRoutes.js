const express = require('express');
const router = express.Router();

const isAuthenticated = require('../middlewares/isAuthenticated');
const authorizeRoles = require('../middlewares/authorizeRoles');

const userController = require('../controllers/userController');
const { ROLES } = require('../constants/roles');

router.post(
  '/update-status',
  isAuthenticated,
  authorizeRoles(ROLES.DOCTOR),
  userController.updatePatientStatus
);

router.get(
  '/history',
  isAuthenticated,
  authorizeRoles(ROLES.PATIENT),
  userController.getPatientHistory
);

router.get(
  '/patients',
  isAuthenticated,
  authorizeRoles(ROLES.DOCTOR),
  userController.getAllPatients
);

router.get('/patient-info', isAuthenticated, authorizeRoles(ROLES.PATIENT), async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(404).json({ msg: 'Patient profile not found' });
    
    res.json({ uid: patient.uid });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;