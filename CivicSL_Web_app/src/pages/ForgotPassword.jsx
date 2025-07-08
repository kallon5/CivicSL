import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faSpinner, faTimes } from '@fortawesome/free-solid-svg-icons';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await resetPassword(email);
      setSuccess(true);
    } catch (error) {
      setError('Failed to send reset email. Please check your email address.');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <main>
        <section className="auth-section">
          <div className="auth-container">
            <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
              <Link to="/" className="close-x" title="Back to Home">
                <FontAwesomeIcon icon={faTimes} />
              </Link>

              <div className="form-header">
                <h2>Reset Password</h2>
                <p>Enter your email to receive a password reset link</p>
              </div>

              {error && <div className="error-message">{error}</div>}
              {success && (
                <div className="success-message">
                  Password reset email sent! Check your inbox.
                </div>
              )}

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
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <FontAwesomeIcon icon={faEnvelope} className="input-icon" />
                </div>
              </div>

              <button type="submit" className="btn get-started" disabled={loading}>
                {loading ? (
                  <span className="btn-loading">
                    <FontAwesomeIcon icon={faSpinner} spin />
                    Sending...
                  </span>
                ) : (
                  <span className="btn-text">
                    <FontAwesomeIcon icon={faEnvelope} />
                    Send Reset Link
                  </span>
                )}
              </button>

              <p className="auth-link">
                Remember your password? 
                <Link to="/login">
                  Back to Login
                </Link>
              </p>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}

export default ForgotPassword; 