import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
const AuthContext = createContext();
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    checkUser();
  }, []);
  const checkUser = async () => {
    try {
      const res = await axios.get('/api/auth/current', { withCredentials: true });
      setUser(res.data);
    } catch (err) {
      setUser(null);
    }
  setLoading(false);
  };
  const login = async (email, password) => {
    try {
      const res = await axios.post('/api/auth/login', { email, password }, { withCredentials: true });
      setUser(res.data.user);
      return res.data.user.role;
    } catch (err) {
      throw err;
    }
  };
  const logout = async () => {
    await axios.get('/api/auth/logout', { withCredentials: true });
    setUser(null);
  };
  const registerSendOTP = async (data) => {
    await axios.post('/api/register/send-otp', data, { withCredentials: true });
  };
  const registerVerifyOTP = async (otp) => {
    const res = await axios.post('/api/register/verify-otp', { otp }, { withCredentials: true });
    setUser(res.data.user);
    return res.data.user.role;
  };
  return (
    <AuthContext.Provider value={{ user, loading, login, logout, registerSendOTP, registerVerifyOTP }}>
      {children}
    </AuthContext.Provider>
  );
};
export const useAuth = () => React.useContext(AuthContext);