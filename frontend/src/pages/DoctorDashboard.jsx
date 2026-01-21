import React, { useState } from 'react';
import axios from 'axios';

const DoctorDashboard = () => {
  const [patientUid, setPatientUid] = useState('');
  const [disease, setDisease] = useState('');
  const [viral, setViral] = useState(false);
  const [quarantine, setQuarantine] = useState(false);
  const [bloodGroup, setBloodGroup] = useState('');
  const [other, setOther] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/user/update-status', {
        patientUid,
        disease,
        viral,
        quarantine,
        bloodGroup,
        other
      }, { withCredentials: true });
      setMessage('Status updated successfully!');
    } catch (err) {
      setMessage('Error: ' + (err.response?.data?.msg || 'Something went wrong'));
    }
  };

  return (
    <div className="container">
      <h1 className="header">Doctor Dashboard</h1>
      <form onSubmit={handleSubmit} className="card">
        <label className="block mb-2">Patient Secret ID (UID)</label>
        <input value={patientUid} onChange={(e) => setPatientUid(e.target.value)} className="form-input" required />

        <label className="block mb-2">Disease</label>
        <input value={disease} onChange={(e) => setDisease(e.target.value)} className="form-input" />

        <label className="flex items-center mb-2">
          <input type="checkbox" checked={viral} onChange={(e) => setViral(e.target.checked)} />
          <span className="ml-2">Viral Disease</span>
        </label>

        <label className="flex items-center mb-2">
          <input type="checkbox" checked={quarantine} onChange={(e) => setQuarantine(e.target.checked)} />
          <span className="ml-2">Quarantine Required</span>
        </label>

        <label className="block mb-2">Blood Group</label>
        <select value={bloodGroup} onChange={(e) => setBloodGroup(e.target.value)} className="form-input">
          <option value="">Select</option>
          <option value="A+">A+</option>
          <option value="A-">A-</option>
          <option value="B+">B+</option>
          <option value="B-">B-</option>
          <option value="O+">O+</option>
          <option value="O-">O-</option>
          <option value="AB+">AB+</option>
          <option value="AB-">AB-</option>
        </select>

        <label className="block mb-2">Other Notes</label>
        <textarea value={other} onChange={(e) => setOther(e.target.value)} className="form-input" rows="3" />

        <button type="submit" className="btn w-full mt-4">Update Status</button>
      </form>
      {message && <p className={message.startsWith('Error') ? 'alert-error' : 'alert-success'}>{message}</p>}
    </div>
  );
};

export default DoctorDashboard;