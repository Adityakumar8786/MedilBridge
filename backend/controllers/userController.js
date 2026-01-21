// backend/controllers/userController.js

const Patient = require('../models/Patient');
const User = require('../models/User');

exports.updatePatientStatus = async (req, res) => {
  const { patientUid, disease, viral, quarantine, bloodGroup, other } = req.body;

 
  console.log('Doctor update request received:');
  console.log('patientUid:', patientUid);
  console.log('Full body:', req.body);

  if (!patientUid) {
    return res.status(400).json({ msg: 'Patient UID is required' });
  }

  try {
    // Find patient by UID (this is the correct way)
    const patient = await Patient.findOne({ uid: patientUid.trim() });

    if (!patient) {
      console.log(`No patient found for UID: "${patientUid}"`);
      return res.status(404).json({ msg: 'Patient not found with this UID' });
    }

    // Create new report
    const report = {
      date: new Date(),
      disease: disease || 'N/A',
      viral: !!viral,
      quarantine: !!quarantine,
      bloodGroup: bloodGroup || 'N/A',
      other: other || 'N/A',
      doctorId: req.user._id
    };

    // Add report and save
    patient.reports.push(report);
    await patient.save();

    console.log(`Report added successfully for patient UID: ${patientUid}`);
    res.json({ msg: 'Status updated successfully' });

  } catch (err) {
    console.error('Error in updatePatientStatus:', err.message);
    res.status(500).json({ msg: 'Server error while updating patient status' });
  }
};

exports.getPatientHistory = async (req, res) => {
  try {
    const patient = await Patient.findOne({ userId: req.user._id });
    if (!patient) return res.status(404).json({ msg: 'Patient not found' });
    res.json(patient.reports);
  } catch (err) {
    console.error('Error in getPatientHistory:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const patients = await Patient.find().populate('userId', 'name email phone');
    res.json(patients);
  } catch (err) {
    console.error('Error in getAllPatients:', err.message);
    res.status(500).json({ msg: 'Server error' });
  }
};