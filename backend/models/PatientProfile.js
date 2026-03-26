const mongoose = require("mongoose");

const patientProfileSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    age: { type: Number },
    gender: { type: String, enum: ["male", "female", "other"] },
    bloodGroup: { type: String },
    address: { type: String },
    migrantState: { type: String }, // where they migrated FROM
    currentState: { type: String }, // where they currently are
    govId: { type: String }, // Aadhaar / Voter ID reference (no OTP)
  },
  { timestamps: true }
);

module.exports = mongoose.model("PatientProfile", patientProfileSchema);