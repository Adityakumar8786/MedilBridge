const mongoose = require("mongoose");

const quarantineCenterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    type: {
      type: String,
      enum: ["hospital", "quarantine_center", "clinic"],
      required: true,
    },
    city: { type: String },
    state: { type: String },
    totalBeds: { type: Number, default: 0 },
    occupiedBeds: { type: Number, default: 0 },
    doctors: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    status: {
      type: String,
      enum: ["operational", "full", "closed"],
      default: "operational",
    },
    contactNumber: { type: String },
    registeredBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("QuarantineCenter", quarantineCenterSchema);