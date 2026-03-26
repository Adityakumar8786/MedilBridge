const AuditLog = require("../models/AuditLog");

const auditLog = async ({ userId, role, action, targetModel, targetId, oldValue, newValue, ipAddress }) => {
  try {
    await AuditLog.create({
      userId,
      role,
      action,
      targetModel,
      targetId,
      oldValue: oldValue || null,
      newValue: newValue || null,
      ipAddress: ipAddress || "unknown",
    });
  } catch (err) {
    console.error("Audit log error:", err.message);
  }
};

module.exports = auditLog;