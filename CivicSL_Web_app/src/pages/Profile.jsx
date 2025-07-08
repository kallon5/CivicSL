import { useAuth } from '../contexts/AuthContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import './shared.css';
import { useState, useEffect } from 'react';
import { UserProgressService } from '../services/userProgressService';
import { useNavigate } from 'react-router-dom';

function Profile(props) {
  const { currentUser, updateDisplayName, resetPassword } = useAuth();
  const [editName, setEditName] = useState(currentUser?.displayName || '');
  const [nameStatus, setNameStatus] = useState('');
  const [resetStatus, setResetStatus] = useState('');
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchProgress() {
      if (currentUser) {
        try {
          const data = await UserProgressService.getUserProgress(currentUser.uid, currentUser.displayName);
          setProgress(data);
        } catch {
          setProgress(null);
        }
      }
    }
    fetchProgress();
  }, [currentUser]);

  const handleNameUpdate = async (e) => {
    e.preventDefault();
    setNameStatus('');
    setLoading(true);
    try {
      await updateDisplayName(editName);
      setNameStatus('Display name updated!');
    } catch (err) {
      setNameStatus('Failed to update name.');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    setResetStatus('');
    setLoading(true);
    try {
      await resetPassword(currentUser.email);
      setResetStatus('Password reset email sent!');
    } catch (err) {
      setResetStatus('Failed to send reset email.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    navigate(-1);
  };

  // Streak milestone badges
  const streakMilestones = [3, 7, 14, 30];
  const badges = currentUser?.userStreak ? streakMilestones.filter(m => currentUser.userStreak.bestStreak >= m) : [];

  return (
    <div className="profile">
      <div className="profile-container">
        <button className="profile-close-btn" onClick={handleClose} title="Close Profile">&times;</button>
        <div className="profile-header">
          <FontAwesomeIcon icon={faUser} className="profile-avatar-large" />
          <div>
            <h1>{currentUser?.displayName || 'Your Profile'}</h1>
            <p className="profile-email">{currentUser?.email}</p>
          </div>
        </div>
        <div className="profile-sections">
          <div className="profile-section profile-info">
            <h2>Account Info</h2>
            <form onSubmit={handleNameUpdate} className="profile-form">
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={editName}
                onChange={e => setEditName(e.target.value)}
                disabled={loading}
              />
              <button type="submit" className="btn" disabled={loading || !editName || editName === currentUser?.displayName}>
                Update Name
              </button>
              {nameStatus && <div className="status-message">{nameStatus}</div>}
            </form>
            <button className="btn btn-secondary" onClick={handlePasswordReset} disabled={loading}>
              Send Password Reset Email
            </button>
            {resetStatus && <div className="status-message">{resetStatus}</div>}
          </div>
          <div className="profile-section profile-progress-card">
            <h2>Your Progress</h2>
            {progress ? (
              <div className="progress-visuals">
                <div className="progress-bars">
                  {progress.progress && progress.progress.map((p, i) => (
                    <div className="level-progress-row" key={i}>
                      <span className="level-label">Level {i+1}</span>
                      <div className="progress-bar-bg">
                        <div className="progress-bar-fill" style={{width: `${p}%`}}></div>
                      </div>
                      <span className="progress-percent">{p}%</span>
                    </div>
                  ))}
                </div>
                <div className="progress-stats">
                  <div className="stat-card">
                    <div className="stat-label">Total XP</div>
                    <div className="stat-value">{progress.xp || 0}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Lessons Completed</div>
                    <div className="stat-value">{progress.totalLessonsCompleted || 0}</div>
                  </div>
                  <div className="stat-card">
                    <div className="stat-label">Quizzes Taken</div>
                    <div className="stat-value">{progress.totalQuizzesTaken || 0}</div>
                  </div>
                </div>
                {badges.length > 0 && (
                  <div className="streak-badges">
                    {badges.map(m => (
                      <span key={m} className="streak-badge">🏅 {m}-day streak</span>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <p>Progress data not available.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile; 