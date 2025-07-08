import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faSignInAlt, 
  faUserPlus, 
  faSignOutAlt,
  faUser,
  faBars,
  faTimes
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';
import NotificationBell from './NotificationBell';
import './Navbar.css';

function Navbar() {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error('Failed to log out:', error);
    }
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand" style={{cursor: 'default'}}>
          <FontAwesomeIcon icon={faGraduationCap} />
          <span>CivicSL</span>
        </div>

        <button className="mobile-menu-btn" onClick={toggleMenu}>
          <FontAwesomeIcon icon={isMenuOpen ? faTimes : faBars} />
        </button>

        <nav className={`navbar-nav ${isMenuOpen ? 'active' : ''}`}>
          {currentUser ? (
            <>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/learning" className="nav-link">Learning</Link>
              <Link to="/quizzes" className="nav-link">Quizzes</Link>
              <Link to="/leaderboard" className="nav-link">Leaderboard</Link>
              <Link to="/discuss" className="nav-link">Discuss</Link>
              <Link to="/resource" className="nav-link">Resources</Link>
              <NotificationBell />
              <div className="nav-dropdown">
                <button className="nav-link dropdown-toggle">
                  <FontAwesomeIcon icon={faUser} />
                  <span>{currentUser.displayName || currentUser.email}</span>
                </button>
                <div className="dropdown-menu">
                  <Link to="/profile" className="dropdown-item">Profile</Link>
                  <Link to="/account" className="dropdown-item">Account</Link>
                  {currentUser.email === 'admin@civicsl.com' && (
                    <Link to="/admin" className="dropdown-item">Admin</Link>
                  )}
                  <button onClick={handleLogout} className="dropdown-item">
                    <FontAwesomeIcon icon={faSignOutAlt} />
                    Logout
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">
                <FontAwesomeIcon icon={faSignInAlt} />
                Login
              </Link>
              <Link to="/signup" className="nav-link">
                <FontAwesomeIcon icon={faUserPlus} />
                Sign Up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Navbar; 