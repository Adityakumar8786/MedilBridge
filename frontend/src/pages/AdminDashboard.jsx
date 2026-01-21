import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Pie } from 'react-chartjs-2';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  BarElement
);

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get('/api/stats/', { withCredentials: true });
      setStats(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  if (!stats) return <div className="text-center p-8">Loading...</div>;

  // Pie chart – disease distribution
  const pieData = {
    labels: Object.keys(stats.diseases || {}),
    datasets: [{
      data: Object.values(stats.diseases || {}),
      backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40'],
    }]
  };

  // Bar chart – number of hospitals vs number of patients
  // Placeholder values – replace with real data once you track hospitals
  const barData = {
    labels: ['Hospitals', 'Patients'],
    datasets: [{
      label: 'Count',
      data: [15, stats.totalPatients || 0], // example: 15 hospitals, real patient count
      backgroundColor: ['#4CAF50', '#2196F3'],
      borderColor: ['#388E3C', '#1976D2'],
      borderWidth: 1,
    }]
  };

  const barOptions = {
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: 'Number' }
      }
    },
    plugins: {
      legend: { display: false }
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Government Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">Total Patients</h3>
          <p className="text-4xl font-bold text-blue-600 mt-2">{stats.totalPatients || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">Viral Cases</h3>
          <p className="text-4xl font-bold text-red-600 mt-2">{stats.viralCount || 0}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow text-center">
          <h3 className="text-lg font-semibold text-gray-700">Quarantine Cases</h3>
          <p className="text-4xl font-bold text-purple-600 mt-2">{stats.quarantineCount || 0}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Disease Distribution */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">Disease Distribution</h2>
          <div className="chart-container mx-auto" style={{ maxWidth: '500px' }}>
            <Pie data={pieData} />
          </div>
        </div>

        {/* Hospitals vs Patients */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-center">Hospitals vs Patients</h2>
          <div className="chart-container mx-auto" style={{ maxWidth: '500px' }}>
            <Bar data={barData} options={barOptions} />
          </div>
          <p className="text-sm text-gray-500 mt-4 text-center italic">
            Note: Hospital count is currently static. Add hospital tracking to make this dynamic.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;