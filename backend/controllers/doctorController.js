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
    const {
      labReportId,
      findings,
      diseaseName,
      prescription,
      followUpDate,
      isViral,
      quarantineRequired,
      quarantineDays,
      quarantineType,
      furtherTestsRequired,
      recommendedTests,
      severity,
      status,
    } = req.body;

    const report = await LabReport.findById(labReportId);
    if (!report) return res.status(404).json({ message: "Lab report not found" });

    const diagnosis = await Diagnosis.create({
      labReportId,
      patientId: report.patientId,
      doctorId: req.user._id,
      findings,
      diseaseName: diseaseName || "",
      prescription: prescription || "",
      followUpDate: followUpDate || null,
      isViral: isViral || false,
      quarantineRequired: quarantineRequired || false,
      quarantineDays: quarantineRequired ? (quarantineDays || 0) : 0,
      quarantineType: quarantineRequired ? (quarantineType || "home") : "none",
      furtherTestsRequired: furtherTestsRequired || false,
      recommendedTests: furtherTestsRequired ? (recommendedTests || []) : [],
      severity: severity || "mild",
      status: status || "active",
    });

    await auditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "DIAGNOSIS_ADDED",
      targetModel: "Diagnosis",
      targetId: diagnosis._id,
      newValue: { labReportId, findings, diseaseName, isViral, quarantineRequired },
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