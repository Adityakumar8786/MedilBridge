import React, { useState } from 'react';
import { useNavigate, Navigate,Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState('patient');
  const [otp, setOtp] = useState('');
  const { user, loading, registerSendOTP, registerVerifyOTP } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (user) return <Navigate to={user.role === 'patient' ? '/dashboard' : user.role === 'doctor' ? '/doctor-dashboard' : '/govt-dashboard'} />;

  const handleSendOTP = async (e) => {
    e.preventDefault();
    try {
      await registerSendOTP({ name, email, password, phone, role });
      setStep(2);
    } catch (err) {
      alert('Error sending OTP');
    }
  };

  const handleVerifyOTP = async (e) => {
    e.preventDefault();
    try {
      await registerVerifyOTP(otp);
      // navigate handled in context
    } catch (err) {
      alert('Invalid OTP');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card max-w-md w-full">
        <h2 className="page-title">Create Your Account</h2>

        {step === 1 ? (
          <form onSubmit={handleSendOTP}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input value={name} onChange={e => setName(e.target.value)} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Email</label>
              <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Phone Number</label>
              <input value={phone} onChange={e => setPhone(e.target.value)} className="form-input" required />
            </div>
            <div className="form-group">
              <label className="form-label">Register As</label>
              <select value={role} onChange={e => setRole(e.target.value)} className="form-select">
                <option value="patient">Patient</option>
                <option value="doctor">Doctor</option>
                <option value="govt">Government Official</option>
              </select>
            </div>
            <button type="submit" className="btn btn-solid w-full mt-4">Send OTP</button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP}>
            <div className="form-group">
              <label className="form-label">Enter OTP</label>
              <input value={otp} onChange={e => setOtp(e.target.value)} className="form-input" required />
            </div>
            <button type="submit" className="btn btn-solid w-full mt-4">Verify & Register</button>
          </form>
        )}

        <p className="text-center mt-6 text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 font-medium">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;