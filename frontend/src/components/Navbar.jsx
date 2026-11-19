import React, { useState } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  FileCheck2,
  LayoutDashboard,
  History,
  User,
  LogOut,
  Sparkles,
  Menu,
  X,
  UploadCloud,
} from 'lucide-react';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    navigate('/');
  };

  const closeMenu = () => setMobileMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar-container">
        {/* Brand Logo */}
        <div
          className="brand-logo"
          onClick={() => {
            navigate(isAuthenticated ? '/dashboard' : '/');
            closeMenu();
          }}
        >
          <div className="logo-icon-bg">
            <FileCheck2 size={22} className="logo-icon" />
          </div>
          <span className="logo-text">
            ResumeGrader<span className="logo-accent">.AI</span>
          </span>
        </div>

        {/* Desktop Navigation Links */}
        <div className="nav-menu desktop-only">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/dashboard"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <LayoutDashboard size={17} />
                <span>Dashboard</span>
              </NavLink>

              <NavLink
                to="/analyze"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <UploadCloud size={17} />
                <span>Resume Analyzer</span>
              </NavLink>

              <NavLink
                to="/history"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <History size={17} />
                <span>History</span>
              </NavLink>

              <NavLink
                to="/profile"
                className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}
              >
                <User size={17} />
                <span>Profile</span>
              </NavLink>
            </>
          ) : (
            <>
              <a href="#features" className="nav-link" onClick={closeMenu}>
                Features
              </a>
              <a href="#how-it-works" className="nav-link" onClick={closeMenu}>
                How It Works
              </a>
              <a href="#benefits" className="nav-link" onClick={closeMenu}>
                Benefits
              </a>
              <a href="#faq" className="nav-link" onClick={closeMenu}>
                FAQ
              </a>
            </>
          )}
        </div>

        {/* Action Controls / Auth Buttons */}
        <div className="nav-actions desktop-only">
          {isAuthenticated ? (
            <div className="user-profile-menu">
              <div className="user-pill" onClick={() => navigate('/profile')}>
                <div className="user-avatar-sm">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="user-name-text">{user?.name || 'My Account'}</span>
              </div>
              <button
                onClick={handleLogout}
                className="btn-nav-logout"
                title="Log out of your account"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          ) : (
            <div className="auth-buttons-group">
              <button
                onClick={() => navigate('/login')}
                className="btn-nav-login"
              >
                Sign In
              </button>
              <button
                onClick={() => navigate('/register')}
                className="btn-nav-register"
              >
                <Sparkles size={15} />
                <span>Create Free Account</span>
              </button>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          className="mobile-toggle-btn"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
        >
          {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="mobile-drawer">
          <div className="mobile-drawer-links">
            {isAuthenticated ? (
              <>
                <NavLink
                  to="/dashboard"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
                >
                  <LayoutDashboard size={18} />
                  <span>Dashboard</span>
                </NavLink>

                <NavLink
                  to="/analyze"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
                >
                  <UploadCloud size={18} />
                  <span>Resume Analyzer</span>
                </NavLink>

                <NavLink
                  to="/history"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
                >
                  <History size={18} />
                  <span>History</span>
                </NavLink>

                <NavLink
                  to="/profile"
                  onClick={closeMenu}
                  className={({ isActive }) => (isActive ? 'mobile-nav-item active' : 'mobile-nav-item')}
                >
                  <User size={18} />
                  <span>Profile</span>
                </NavLink>

                <div className="mobile-divider"></div>

                <button onClick={handleLogout} className="mobile-nav-item logout-btn">
                  <LogOut size={18} />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <a href="#features" className="mobile-nav-item" onClick={closeMenu}>
                  Features
                </a>
                <a href="#how-it-works" className="mobile-nav-item" onClick={closeMenu}>
                  How It Works
                </a>
                <a href="#benefits" className="mobile-nav-item" onClick={closeMenu}>
                  Benefits
                </a>
                <a href="#faq" className="mobile-nav-item" onClick={closeMenu}>
                  FAQ
                </a>

                <div className="mobile-divider"></div>

                <div className="mobile-auth-actions">
                  <button
                    onClick={() => {
                      closeMenu();
                      navigate('/login');
                    }}
                    className="btn-mobile-login"
                  >
                    Sign In
                  </button>
                  <button
                    onClick={() => {
                      closeMenu();
                      navigate('/register');
                    }}
                    className="btn-mobile-register"
                  >
                    Create Free Account
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
