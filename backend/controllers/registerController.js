const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/User');
const Patient = require('../models/Patient');
const { ROLES } = require('../constants/roles');

// ────────────────────────────────────────────────────────────────
//   IMPORTANT: Twilio is commented out to prevent credential errors
//   We're using console.log for OTP during development instead
// ────────────────────────────────────────────────────────────────
// const twilio = require('twilio');
// const client = new twilio(process.env.TWILIO_SID, process.env.TWILIO_AUTH_TOKEN);

exports.sendOTP = async (req, res) => {
  const { name, email, password, phone, role } = req.body;

  try {
    // Check for existing user
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'Email already exists' });
    }

    user = await User.findOne({ phone });
    if (user) {
      return res.status(400).json({ msg: 'Phone already exists' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // DEVELOPMENT MODE: Show OTP in console
    console.log('╔════════════════════════════════════════════╗');
    console.log('║             DEVELOPMENT OTP                 ║');
    console.log(`║ Phone : ${phone.padEnd(30)} ║`);
    console.log(`║ OTP   : ${otp}                              ║`);
    console.log('╚════════════════════════════════════════════╝');

    // Save temporary data in session
    req.session.tempUser = {
      name,
      email,
      password: await bcrypt.hash(password, 10),
      phone,
      role
    };
    req.session.otp = otp;

    // Tell frontend everything is ok
    res.status(200).json({ msg: 'OTP sent' });

  } catch (err) {
    console.error('Error in sendOTP:', err);
    res.status(500).json({ msg: 'Server error while sending OTP' });
  }
};

exports.verifyOTP = async (req, res) => {
  const { otp } = req.body;

  if (!req.session.otp || req.session.otp !== otp) {
    return res.status(400).json({ msg: 'Invalid or expired OTP' });
  }

  try {
    const { name, email, password, phone, role } = req.session.tempUser;

    const user = new User({ name, email, password, phone, role });
    await user.save();

    if (role === ROLES.PATIENT) {
      const patient = new Patient({
        userId: user._id,
        uid: uuidv4(),
        reports: []
      });
      await patient.save();
    }

    // Clean up session data
    delete req.session.tempUser;
    delete req.session.otp;

    // Automatically log the user in
    req.login(user, (err) => {
      if (err) {
        console.error('Auto-login error:', err);
        return res.status(500).json({ msg: 'Error during auto-login' });
      }
      res.status(200).json({ user });
    });

  } catch (err) {
    console.error('Error in verifyOTP:', err);
    res.status(500).json({ msg: 'Server error during verification' });
  }
};