// frontend/src/components/NavBar.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const NavBar = () => {
  const { user, logout } = useAuth();

  return (
    <div className="topbar">
      <div className="topbar-inner container">
        <Link to="/" className="topbar-logo">MediBridge</Link>

        <div className="topbar-buttons">
          {user ? (
            <button onClick={logout} className="btn btn-solid">
              Logout
            </button>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline">
                Login
              </Link>
              <Link to="/register" className="btn btn-solid">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default NavBar;