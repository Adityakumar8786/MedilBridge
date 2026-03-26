const LabReport = require("../models/LabReport");
const Diagnosis = require("../models/Diagnosis");
const User = require("../models/User");
const PatientProfile = require("../models/PatientProfile");

const getAggregatedStats = async (req, res) => {
  try {
    const totalPatients = await User.countDocuments({ role: "patient" });
    const totalReports = await LabReport.countDocuments();
    const totalDiagnoses = await Diagnosis.countDocuments();

    const diseaseAgg = await Diagnosis.aggregate([
      { $group: { _id: "$findings", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const stateAgg = await PatientProfile.aggregate([
      { $group: { _id: "$currentState", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);

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

    res.json({
      totalPatients,
      totalReports,
      totalDiagnoses,
      diseaseFrequency: diseaseAgg,
      reportsByState: stateAgg,
      monthlyTrend,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getAggregatedStats };