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
    // Core diagnosis
    findings: { type: String, required: true },
    diseaseName: { type: String, default: "" },
    prescription: { type: String, default: "" },
    followUpDate: { type: Date },

    // NEW: Viral & Quarantine fields
    isViral: { type: Boolean, default: false },
    quarantineRequired: { type: Boolean, default: false },
    quarantineDays: { type: Number, default: 0 },
    quarantineType: {
      type: String,
      enum: ["home", "hospital", "quarantine_center", "none"],
      default: "none",
    },

    // NEW: Further tests
    furtherTestsRequired: { type: Boolean, default: false },
    recommendedTests: [{ type: String }],

    // NEW: Severity
    severity: {
      type: String,
      enum: ["mild", "moderate", "severe", "critical"],
      default: "mild",
    },

    // NEW: Status tracking
    status: {
      type: String,
      enum: ["active", "recovering", "recovered", "deceased"],
      default: "active",
    },

    diagnosedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Diagnosis", diagnosisSchema);