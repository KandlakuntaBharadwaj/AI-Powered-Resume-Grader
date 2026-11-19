import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, History, User, LogOut } from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  // Navigation is only visible after login
  if (!isAuthenticated) return null;

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
          ResumeGrader<span className="dot">.AI</span>
        </div>
        <div className="nav-links">
          <NavLink to="/" end className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <LayoutDashboard size={18} />
            <span>Dashboard</span>
          </NavLink>
          <NavLink to="/history" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <History size={18} />
            <span>History</span>
          </NavLink>
          <NavLink to="/profile" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
            <User size={18} />
            <span>Profile</span>
          </NavLink>
          <button onClick={handleLogout} className="btn-logout">
            <LogOut size={18} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
