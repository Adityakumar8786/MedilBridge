import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('patient');
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');

  const { registerSendOTP, registerVerifyOTP } = useAuth();
  const navigate = useNavigate();

  const handleSendOTP = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerSendOTP({ name, email, password, phone, role });
      setStep(2);
    } catch (err) {
      setError(err.response?.data?.msg || 'Failed to send OTP');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    setError('');
    try {
      await registerVerifyOTP(otp);
      // Navigation is handled inside AuthContext
    } catch (err) {
      setError(err.response?.data?.msg || 'Invalid OTP');
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '40px 20px' }}>
      <div style={{ maxWidth: '420px', margin: '0 auto', background: 'white', padding: '40px 30px', borderRadius: '12px', boxShadow: '0 10px 30px rgba(0,0,0,0.1)' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '30px', color: '#1e293b' }}>Create Account</h2>

        {error && <p style={{ color: 'red', textAlign: 'center', marginBottom: '15px' }}>{error}</p>}

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full Name" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Password" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone Number" style={{ width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '6px', border: '1px solid #ccc' }} required />
            
            <select value={role} onChange={e => setRole(e.target.value)} style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc' }}>
              <option value="patient">Patient</option>
              <option value="doctor">Doctor</option>
              <option value="lab">Lab</option>
              <option value="government">Government</option>
            </select>

            <button type="submit" style={{ width: '100%', padding: '14px', background: '#10b981', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem' }}>
              Send OTP
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <input 
              value={otp} 
              onChange={e => setOtp(e.target.value)} 
              placeholder="Enter 6-digit OTP" 
              style={{ width: '100%', padding: '12px', marginBottom: '20px', borderRadius: '6px', border: '1px solid #ccc', textAlign: 'center', fontSize: '1.3rem', letterSpacing: '8px' }} 
              maxLength={6}
              required 
            />
            <button type="submit" style={{ width: '100%', padding: '14px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontSize: '1.1rem' }}>
              Verify OTP
            </button>
          </form>
        )}
      </div>
    </div>
  );
};

export default Register;