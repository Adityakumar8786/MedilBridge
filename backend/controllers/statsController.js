const Patient = require('../models/Patient');
exports.getStats = async (req, res) => {
  try {
    const patients = await Patient.find();
    const totalPatients = patients.length;
    const viralCount = patients.reduce((acc, p) => acc + p.reports.filter(r => r.viral).length, 0);
    const quarantineCount = patients.reduce((acc, p) => acc + p.reports.filter(r => r.quarantine).length, 0);
    const diseases = {};
    patients.forEach(p => {
      p.reports.forEach(r => {
        if (r.disease) {
          diseases[r.disease] = (diseases[r.disease] || 0) + 1;
        }
      });
    });
    res.json({
      totalPatients,
      viralCount,
      quarantineCount,
      diseases
    });
  } catch (err) {
    res.status(500).json({ msg: 'Server error' });
  }
};