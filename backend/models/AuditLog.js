const mongoose = require("mongoose");

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    role: {
      type: String,
      enum: ["patient", "doctor", "lab", "government"],
      required: true,
    },
    action: { type: String, required: true }, 
    targetModel: { type: String }, 
    targetId: { type: mongoose.Schema.Types.ObjectId },
    oldValue: { type: mongoose.Schema.Types.Mixed, default: null },
    newValue: { type: mongoose.Schema.Types.Mixed, default: null },
    ipAddress: { type: String },
    timestamp: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: "timestamp", updatedAt: false },
  }
);

auditLogSchema.pre(
  ["updateOne", "findOneAndUpdate", "updateMany", "findOneAndDelete", "deleteMany", "remove"],
  function (next) {
    const err = new Error("AuditLog is append-only. Mutations are not allowed.");
    err.status = 403;
    return next(err);
  }
);

module.exports = mongoose.model("AuditLog", auditLogSchema);