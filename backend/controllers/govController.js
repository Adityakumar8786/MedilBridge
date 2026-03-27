const LabReport = require("../models/LabReport");
const Diagnosis = require("../models/Diagnosis");
const User = require("../models/User");
const PatientProfile = require("../models/PatientProfile");
const QuarantineCenter = require("../models/QuarantineCenter");

const getAggregatedStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalDoctors = await User.countDocuments({ role: "doctor" });
    const totalLabs = await User.countDocuments({ role: "lab" });
    const totalReports = await LabReport.countDocuments();
    const totalDiagnoses = await Diagnosis.countDocuments();
    const totalQuarantineActive = await Diagnosis.countDocuments({ quarantineRequired: true, status: { $in: ["active", "recovering"] } });
    const totalViral = await Diagnosis.countDocuments({ isViral: true });

    // Disease frequency
    const diseaseFrequency = await Diagnosis.aggregate([
      { $match: { diseaseName: { $ne: "" } } },
      { $group: { _id: "$diseaseName", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    // Severity breakdown
    const severityBreakdown = await Diagnosis.aggregate([
      { $group: { _id: "$severity", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Quarantine type breakdown
    const quarantineBreakdown = await Diagnosis.aggregate([
      { $match: { quarantineRequired: true } },
      { $group: { _id: "$quarantineType", count: { $sum: 1 } } },
    ]);

    // Status breakdown (active/recovering/recovered)
    const statusBreakdown = await Diagnosis.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    // Viral vs non-viral
    const viralBreakdown = await Diagnosis.aggregate([
      { $group: { _id: "$isViral", count: { $sum: 1 } } },
    ]);

    // Monthly report trend
    const monthlyTrend = await LabReport.aggregate([
      {
        $group: {
          _id: { year: { $year: "$testDate" }, month: { $month: "$testDate" } },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1 } },
      { $limit: 12 },
    ]);

    // Reports by state
    const reportsByState = await PatientProfile.aggregate([
      { $group: { _id: "$currentState", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

    // Quarantine centers
    const quarantineCenters = await QuarantineCenter.find()
      .select("name type city state totalBeds occupiedBeds status")
      .lean();

    res.json({
      summary: {
        totalPatients,
        totalDoctors,
        totalLabs,
        totalReports,
        totalDiagnoses,
        totalQuarantineActive,
        totalViral,
        totalCenters: quarantineCenters.length,
      },
      diseaseFrequency,
      severityBreakdown,
      quarantineBreakdown,
      statusBreakdown,
      viralBreakdown,
      monthlyTrend,
      reportsByState,
      quarantineCenters,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAggregatedStats };