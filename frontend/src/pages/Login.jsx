import React, { useState } from 'react';
import { useNavigate, Navigate,Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { user, loading, login } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="text-center py-20">Loading...</div>;
  if (user) return <Navigate to={user.role === 'patient' ? '/dashboard' : user.role === 'doctor' ? '/doctor-dashboard' : '/govt-dashboard'} />;

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      // navigate handled in AuthContext
    } catch (err) {
      alert('Login failed – check credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="card max-w-md w-full">
        <h2 className="page-title">Login to MediBridge</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="form-input"
              required
            />
          </div>
          <button type="submit" className="btn btn-solid w-full mt-4">
            Sign In
          </button>
        </form>
        <p className="text-center mt-6 text-gray-600">
          Don't have an account? <Link to="/register" className="text-blue-600 font-medium">Register</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;