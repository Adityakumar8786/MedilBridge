const mongoose = require('mongoose');
const ReportSchema = new mongoose.Schema({
  date: {
    type: Date,
    default: Date.now
  },
  disease: String,
  viral: Boolean,
  quarantine: Boolean,
  bloodGroup: String,
  other: String,
  doctorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});
const PatientSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    unique: true
  },
  uid: {
    type: String,
    unique: true
  },
  reports: [ReportSchema]
});
module.exports = mongoose.model('Patient', PatientSchema);