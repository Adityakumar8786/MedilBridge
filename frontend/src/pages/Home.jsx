import React from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Home = () => {
  const { user } = useAuth();

  if (user) {
    const path = user.role === 'patient' ? '/dashboard' :
                 user.role === 'doctor' ? '/doctor-dashboard' :
                 '/govt-dashboard';
    return <Navigate to={path} />;
  }

  return (
    <div className="home-hero">
      <div className="container text-center">
        <h2 className="page-title" style={{ color: '#1e293b', marginTop: '4rem' }}>
          Digital Health Records for Migrant Workers
        </h2>

        <p style={{ fontSize: '1.3rem', color: '#475569', margin: '1.5rem 0 3rem' }}>
          Secure • Anonymous • Multi-language • AI-guided
        </p>

        <ul className="stats-list">
          <li><span className="emoji">😷</span> Over 70% migrant workers lack medical records</li>
          <li><span className="emoji">⚰️</span> More than 1000+ deaths daily from preventable diseases</li>
          <li><span className="emoji">🩺</span> Delayed diagnosis increases mortality by 60%</li>
          <li><span className="emoji">📄</span> Paper records fail during migration and emergencies</li>
          <li><span className="emoji">❤️</span> Instant access to history saves lives</li>
        </ul>

        <Link to="/register" className="btn btn-solid" style={{ fontSize: '1.3rem', padding: '1rem 3rem' }}>
          Get Started Free
        </Link>
      </div>
    </div>
  );
};

export default Home;