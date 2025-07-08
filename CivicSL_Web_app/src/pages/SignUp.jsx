import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faGraduationCap, 
  faEnvelope, 
  faLock, 
  faEye, 
  faEyeSlash,
  faUserPlus,
  faSpinner,
  faTimes,
  faCheckCircle,
  faUser
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './SignUp.css';

function SignUp() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      await signup(formData.email, formData.password, formData.fullName);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to create account. ' + error.message);
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    <div className="signup-page">
      <main>
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-illustration">
              <div className="illustration-content">
                <FontAwesomeIcon icon={faGraduationCap} className="illustration-icon" />
                <h2>Join CivicSL Today!</h2>
                <p>Start your journey in civic education</p>
                <div className="illustration-features">
                  <div className="feature-item">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Free access to all content</span>
                  </div>
                  <div className="feature-item">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Interactive learning experience</span>
                  </div>
                  <div className="feature-item">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Earn certificates</span>
                  </div>
                </div>
              </div>
            </div>

            <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
              <Link to="/" className="close-x" title="Back to Home">
                <FontAwesomeIcon icon={faTimes} />
              </Link>

              <div className="form-header">
                <h2>Create Your Account</h2>
                <p>Join thousands of students learning civic education</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="input-group">
                <label htmlFor="fullName">
                  <FontAwesomeIcon icon={faUser} />
                  Full Name
                </label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="fullName"
                    name="fullName"
                    required
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={handleChange}
                  />
                  <FontAwesomeIcon icon={faUser} className="input-icon" />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="email">
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="password">
                  <FontAwesomeIcon icon={faLock} />
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    placeholder="Create a password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={togglePasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="confirmPassword">
                  <FontAwesomeIcon icon={faLock} />
                  Confirm Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    placeholder="Confirm your password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                  />
                  <FontAwesomeIcon icon={faLock} className="input-icon" />
                  <button 
                    type="button" 
                    className="password-toggle" 
                    onClick={toggleConfirmPasswordVisibility}
                  >
                    <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                  </button>
                </div>
              </div>

              <button type="submit" className="btn get-started" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Creating Account...
                  </span>
                ) : (
                  <span className="btn-text">
                    <FontAwesomeIcon icon={faUserPlus} />
                    Create Account
                  </span>
                )}
              </button>

              <div className="divider">
                <span>or</span>
              </div>

              <div className="social-login">
                <button type="button" className="social-btn google-btn">
                  <FontAwesomeIcon icon={faGoogle} />
                  Continue with Google
                </button>
              </div>

              <p className="auth-link">
                Already have an account? 
                <Link to="/login">
                  <FontAwesomeIcon icon={faUser} />
                  Login
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default SignUp; 