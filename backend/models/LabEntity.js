const mongoose = require("mongoose");

const labEntitySchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    labName: { type: String, required: true },
    registrationNumber: { type: String, required: true, unique: true },
    city: { type: String },
    state: { type: String },
    isVerified: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model("LabEntity", labEntitySchema);