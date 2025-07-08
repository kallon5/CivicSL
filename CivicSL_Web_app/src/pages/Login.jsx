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
  faSignInAlt,
  faSpinner,
  faTimes,
  faCheckCircle,
  faKey
} from '@fortawesome/free-solid-svg-icons';
import { faGoogle } from '@fortawesome/free-brands-svg-icons';
import './Login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      setError('Failed to log in. Please check your credentials.');
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="login-page">
      <main>
        <section className="auth-section">
          <div className="auth-container">
            <div className="auth-illustration">
              <div className="illustration-content">
                <FontAwesomeIcon icon={faGraduationCap} className="illustration-icon" />
                <h2>Welcome Back!</h2>
                <p>Continue your civic education journey</p>
                <div className="illustration-features">
                  <div className="feature-item">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Access your progress</span>
                  </div>
                  <div className="feature-item">
                    <FontAwesomeIcon icon={faCheckCircle} />
                    <span>Complete lessons</span>
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
                <h2>Login to Your Account</h2>
                <p>Enter your credentials to access your learning dashboard</p>
              </div>

              {error && <div className="error-message">{error}</div>}

              <div className="input-group">
                <label htmlFor="login-identifier">
                  <FontAwesomeIcon icon={faEnvelope} />
                  Email Address
                </label>
                <div className="input-wrapper">
                  <input
                    type="email"
                    id="login-identifier"
                    name="identifier"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                </div>
              </div>

              <div className="input-group">
                <label htmlFor="login-password">
                  <FontAwesomeIcon icon={faLock} />
                  Password
                </label>
                <div className="input-wrapper">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="login-password"
                    name="password"
                    required
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="form-options">
                <label className="checkbox-wrapper">
                  <input 
                    type="checkbox" 
                    id="remember-me"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  <span className="checkmark"></span>
                  Remember me
                </label>
                <Link to="/forgot-password" className="forgot-link">
                  <FontAwesomeIcon icon={faKey} />
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="btn get-started" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Logging in...
                  </span>
                ) : (
                  <span className="btn-text">
                    <FontAwesomeIcon icon={faSignInAlt} />
                    Login to Account
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
                Don't have an account? 
                <Link to="/signup">
                  <FontAwesomeIcon icon={faSignInAlt} />
                  Create Account
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default Login; 