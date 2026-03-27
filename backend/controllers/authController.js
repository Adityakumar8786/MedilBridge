const User = require("../models/User");
const PatientProfile = require("../models/PatientProfile");
const LabEntity = require("../models/LabEntity");
const jwt = require("jsonwebtoken");

const generateToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || "7d" });

const register = async (req, res) => {
  try {
    const { name, email, password, role, age, gender, bloodGroup, govId, labName, registrationNumber, city, state } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({ message: "Name, email, password and role are required" });
    }

    const validRoles = ["patient", "doctor", "lab", "government"];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ message: "Invalid role" });
    }

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: "Email already registered" });

    // Create user — password hashing happens in model pre-save hook
    const user = new User({ name, email, password, role });
    await user.save();

    // Create role-specific profile
    if (role === "patient") {
      await PatientProfile.create({
        userId: user._id,
        age: age || null,
        gender: gender || null,
        bloodGroup: bloodGroup || null,
        govId: govId || null,
      });
    }

    if (role === "lab") {
      await LabEntity.create({
        userId: user._id,
        labName: labName || name,
        registrationNumber: registrationNumber || `LAB-${Date.now()}`,
        city: city || null,
        state: state || null,
      });
    }

    // Log manually without importing auditLogger (to isolate the bug)
    try {
      const AuditLog = require("../models/AuditLog");
      await AuditLog.create({
        userId: user._id,
        role,
        action: "USER_REGISTERED",
        targetModel: "User",
        targetId: user._id,
        newValue: { name, email, role },
        ipAddress: req.ip || "unknown",
      });
    } catch (auditErr) {
      console.error("Audit log failed (non-fatal):", auditErr.message);
    }

    return res.status(201).json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error("REGISTER ERROR:", err); // <-- this prints full error in terminal
    return res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(401).json({ message: "Invalid credentials" });

    if (!user.isActive) return res.status(403).json({ message: "Account deactivated" });

    try {
      const AuditLog = require("../models/AuditLog");
      await AuditLog.create({
        userId: user._id,
        role: user.role,
        action: "USER_LOGIN",
        targetModel: "User",
        targetId: user._id,
        ipAddress: req.ip || "unknown",
      });
    } catch (auditErr) {
      console.error("Audit log failed (non-fatal):", auditErr.message);
    }

    return res.json({
      token: generateToken(user._id),
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });

  } catch (err) {
    console.error("LOGIN ERROR:", err);
    return res.status(500).json({ message: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, getMe };