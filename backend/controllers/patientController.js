const LabReport = require("../models/LabReport");
const Diagnosis = require("../models/Diagnosis");

const getTimeline = async (req, res) => {
  try {
    const reports = await LabReport.find({ patientId: req.user._id })
      .populate("labId", "name")
      .sort({ testDate: -1 });

    const timeline = await Promise.all(
      reports.map(async (report) => {
        const diagnoses = await Diagnosis.find({ labReportId: report._id })
          .populate("doctorId", "name")
          .sort({ diagnosedAt: 1 });

        return {
          type: "lab_report",
          id: report._id,
          lab: report.labId?.name || "Unknown Lab",
          testName: report.testName,
          testDate: report.testDate,
          results: report.results,      
          notes: report.notes,
          isLocked: report.isLocked,
          diagnoses: diagnoses.map((d) => ({
            id: d._id,
            doctor: d.doctorId?.name,
            findings: d.findings,       
            prescription: d.prescription,
            followUpDate: d.followUpDate,
            diagnosedAt: d.diagnosedAt,
          })),
        };
      })
    );

    res.json(timeline);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getTimeline };