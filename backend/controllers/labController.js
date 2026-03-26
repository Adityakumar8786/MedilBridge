const LabReport = require("../models/LabReport");
const auditLog = require("../utils/auditLogger");

const submitReport = async (req, res) => {
  try {
    const { patientId, testName, testDate, results, notes } = req.body;

    const report = await LabReport.create({
      patientId,
      labId: req.user._id,
      testName,
      testDate,
      results,
      notes,
      isLocked: true,
    });

    await auditLog({
      userId: req.user._id,
      role: req.user.role,
      action: "LAB_REPORT_CREATED",
      targetModel: "LabReport",
      targetId: report._id,
      newValue: { patientId, testName, testDate },
      ipAddress: req.ip,
    });

    res.status(201).json({ message: "Lab report submitted and locked.", report });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getMyReports = async (req, res) => {
  try {
    const reports = await LabReport.find({ labId: req.user._id })
      .populate("patientId", "name email")
      .sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { submitReport, getMyReports };