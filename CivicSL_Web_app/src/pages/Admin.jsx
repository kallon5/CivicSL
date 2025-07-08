import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShieldAlt } from '@fortawesome/free-solid-svg-icons';

function Admin() {
  const { currentUser } = useAuth();

  // Check if user is admin
  if (currentUser?.email !== 'admin@civicsl.com') {
    return (
      <div className="admin">
        <div className="admin-container">
          <div className="admin-content">
            <div className="admin-card">
              <FontAwesomeIcon icon={faShieldAlt} className="admin-icon" />
              <h3>Access Denied</h3>
              <p>You don't have permission to access the admin panel.</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="admin">
      <div className="admin-container">
        <div className="admin-header">
          <h1>Admin Panel</h1>
          <p>Manage the CivicSL platform</p>
        </div>
        <div className="admin-content">
          <div className="admin-card">
            <FontAwesomeIcon icon={faShieldAlt} className="admin-icon" />
            <h3>Admin Features</h3>
            <p>Admin panel features are being developed. Check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Admin; 