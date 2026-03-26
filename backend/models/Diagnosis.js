const mongoose = require("mongoose");

const diagnosisSchema = new mongoose.Schema(
  {
    labReportId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LabReport",
      required: true,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    findings: { type: String, required: true },
    prescription: { type: String },
    followUpDate: { type: Date },
    diagnosedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


module.exports = mongoose.model("Diagnosis", diagnosisSchema);