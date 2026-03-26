const LabReport = require("../models/LabReport");
const Diagnosis = require("../models/Diagnosis");
const auditLog = require("../utils/auditLogger");

const viewLabReports = async (req, res) => {
  try {
    const reports = await LabReport.find()
      .populate("patientId", "name email")
      .populate("labId", "name")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const addDiagnosis = async (req, res) => {
  try {
    const { labReportId, findings, prescription, followUpDate } = req.body;

    const report = await LabReport.findById(labReportId);
    if (!report) return res.status(404).json({ message: "Lab report not found" });

    const diagnosis = await Diagnosis.create({
      labReportId,
      patientId: report.patientId,
      doctorId: req.user._id,
      findings,
      prescription,
      followUpDate,
    });

    await auditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "DIAGNOSIS_ADDED",
      targetModel: "Diagnosis",
      targetId: diagnosis._id,
      newValue: { labReportId, findings },
      ipAddress: req.ip,
    });

    res.status(201).json({ message: "Diagnosis added.", diagnosis });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyDiagnoses = async (req, res) => {
  try {
    const diagnoses = await Diagnosis.find({ doctorId: req.user._id })
      .populate("labReportId")
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });
    res.json(diagnoses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { viewLabReports, addDiagnosis, getMyDiagnoses };