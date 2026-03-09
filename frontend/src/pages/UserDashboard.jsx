import React from 'react';
import { useState, useEffect } from 'react';
import axios from 'axios' ;

const UserDashboard = () => {
  const [history, setHistory] = useState([]);
  const [patientInfo, setPatientInfo] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData  = async () => {
    try {
      const resHistory = await axios.get('/api/user/history' , { withCredentials: true });
      setHistory(resHistory.data);
      const resInfo = await axios.get('/api/user/patient-info', { withCredentials: true });
      setPatientInfo(resInfo.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1 className="header">Patient Dashboard</h1>

      {patientInfo && (
        <div className="card bg-yellow-100">
          <h2 className="text-xl font-semibold mb-2">Your Secret Patient ID</h2>
          <p className="text-2xl font-mono text-center">{patientInfo.uid}</p>
          <p className="text-sm text-gray-700 mt-3">Share this ID with the hospital/lab. Do not share your email or name.</p>
        </div>
      )}

      <h2 className="text-2xl font-semibold mb-4">Medical History</h2>
      {history.length === 0 ? (
        <p>No reports yet.</p>
      ) : (
        history.map((report, index) => (
          <div key={index} className="card">
            <p><strong>Date:</strong> {new Date(report.date).toLocaleDateString()}</p>
            <p><strong>Disease:</strong> {report.disease || 'N/A'}</p>
            <p><strong>Viral:</strong> {report.viral ? 'Yes' : 'No'}</p>
            <p><strong>Quarantine:</strong> {report.quarantine ? 'Yes' : 'No'}</p>
            <p><strong>Blood Group:</strong> {report.bloodGroup || 'N/A'}</p>
            <p><strong>Other:</strong> {report.other || 'N/A'}</p>
          </div>
        ))
      )}
    </div>
  );
};

export default  UserDashboard;