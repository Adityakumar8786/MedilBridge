const mongoose = require("mongoose");

const labReportSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    labId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    testName: { type: String, required: true },
    testDate: { type: Date, required: true },
    results: [
      {
        parameter: { type: String, required: true },
        value: { type: String, required: true },
        unit: { type: String },
        normalRange: { type: String },
      },
    ],
    notes: { type: String },
    isLocked: { type: Boolean, default: true }, 
    submittedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

labReportSchema.pre(["updateOne", "findOneAndUpdate", "updateMany"], function (next) {
  const err = new Error("LabReport is immutable. Updates are not allowed.");
  err.status = 403;
  return next(err);
});

labReportSchema.pre("remove", function (next) {
  const err = new Error("LabReport cannot be deleted.");
  err.status = 403;
  return next(err);
});

labReportSchema.pre("findOneAndDelete", function (next) {
  const err = new Error("LabReport cannot be deleted.");
  err.status = 403;
  return next(err);
});

module.exports = mongoose.model("LabReport", labReportSchema);