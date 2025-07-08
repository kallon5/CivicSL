import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import './shared.css';
import { useAuth } from '../contexts/AuthContext';

function Account() {
  const { currentUser } = useAuth();
  return (
    <div className="account">
      <div className="account-container">
        <div className="account-header">
          <h1>Account Settings</h1>
          <p>Manage your account preferences</p>
        </div>
        <div className="account-actions">
          <div className="account-action-card">
            <h3>Change Email</h3>
            <p>Current: <strong>{currentUser?.email}</strong></p>
            <button className="btn" disabled>Change Email (Coming Soon)</button>
          </div>
          <div className="account-action-card">
            <h3>Change Password</h3>
            <p>Set a new password directly (feature coming soon).<br />
            For now, use the <strong>Profile</strong> page to send a password reset email.</p>
            <button className="btn" disabled>Change Password (Coming Soon)</button>
          </div>
          <div className="account-action-card danger">
            <h3>Delete Account</h3>
            <p>Permanently delete your account and all data.</p>
            <button className="btn danger" disabled>Delete Account (Coming Soon)</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Account; 