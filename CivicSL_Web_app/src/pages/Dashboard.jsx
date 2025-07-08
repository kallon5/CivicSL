import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProgressService } from '../services/userProgressService';
import { LearningStreaksService } from '../services/userProgressService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, 
  faQuestionCircle, 
  faTrophy, 
  faComments,
  faChartLine,
  faUserGraduate,
  faCertificate,
  faFire,
  faSpinner,
  faCheckCircle
} from '@fortawesome/free-solid-svg-icons';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard() {
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState(null);
  const [userStreak, setUserStreak] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [streakLeaderboard, setStreakLeaderboard] = useState([]);
  const [bestStreakLeaderboard, setBestStreakLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load user data on component mount
  useEffect(() => {
    const loadDashboardData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const [progress, streak, topUsers] = await Promise.all([
          UserProgressService.getUserProgress(currentUser.uid, currentUser.displayName),
          LearningStreaksService.getUserStreak(currentUser.uid),
          UserProgressService.getLeaderboard(5), // Top 5 users
          LearningStreaksService.getStreakLeaderboard('current', 5),
          LearningStreaksService.getStreakLeaderboard('best', 5)
        ]);

        setUserProgress(progress);
        setUserStreak(streak);
        setLeaderboard(topUsers);
        setStreakLeaderboard(streakLeaderboard);
        setBestStreakLeaderboard(bestStreakLeaderboard);
      } catch (err) {
        console.error('Error loading dashboard data:', err);
        setError('Failed to load dashboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [currentUser]);

  const stats = [
    {
      icon: faCheckCircle,
      title: 'Lessons Completed',
      value: userProgress?.totalLessonsCompleted || 0,
      color: '#10b981'
    },
    {
      icon: faQuestionCircle,
      title: 'Quizzes Taken',
      value: userProgress?.totalQuizzesTaken || 0,
      color: '#764ba2'
    },
    {
      icon: faTrophy,
      title: 'Points Earned',
      value: userProgress?.xp || 0,
      color: '#f59e0b'
    },
    {
      icon: faFire,
      title: 'Day Streak',
      value: userStreak?.currentStreak || 0,
      color: '#ef4444'
    }
  ];

  const quickActions = [
    {
      icon: faBookOpen,
      title: 'Continue Learning',
      description: 'Pick up where you left off',
      link: '/learning',
      color: '#667eea'
    },
    {
      icon: faQuestionCircle,
      title: 'Take Quiz',
      description: 'Test your knowledge',
      link: '/quizzes',
      color: '#764ba2'
    },
    {
      icon: faTrophy,
      title: 'Leaderboard',
      description: 'See your ranking',
      link: '/leaderboard',
      color: '#f59e0b'
    },
    {
      icon: faComments,
      title: 'Discussion',
      description: 'Connect with others',
      link: '/discuss',
      color: '#10b981'
    }
  ];

  // Get user's rank in leaderboard
  const getUserRank = () => {
    if (!userProgress || !leaderboard.length) return 'N/A';
    const userIndex = leaderboard.findIndex(user => user.userId === currentUser?.uid);
    return userIndex >= 0 ? userIndex + 1 : 'N/A';
  };

  // Get next level to unlock
  const getNextLevel = () => {
    if (!userProgress) return 1;
    for (let i = 0; i < userProgress.progress.length; i++) {
      if (userProgress.progress[i] < 100) {
        return i + 1;
      }
    }
    return 4; // All levels completed
  };

  // Helper function to get user initials
  const getUserInitials = (displayName) => {
    if (!displayName) return '?';
    const names = displayName.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  };

  if (loading) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin />
            <p>Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard">
        <div className="dashboard-container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <div className="dashboard-container">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1>Welcome back, {userProgress?.displayName || 'Student'}!</h1>
            <p>Continue your civic education journey</p>
            {userStreak && userStreak.currentStreak > 0 && (
              <div className="streak-badge">
                <FontAwesomeIcon icon={faFire} />
                <span>{userStreak.currentStreak}-day streak! 🔥</span>
              </div>
            )}
          </div>
          <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', fontWeight: 700, fontSize: '1.5rem', width: 60, height: 60, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {getUserInitials(userProgress?.displayName || 'Student')}
          </div>
        </div>

        <div className="stats-grid">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card">
              <div className="stat-icon" style={{ backgroundColor: stat.color }}>
                <FontAwesomeIcon icon={stat.icon} />
              </div>
              <div className="stat-content">
                <h3>{stat.value.toLocaleString()}</h3>
                <p>{stat.title}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-actions">
          <h2>Quick Actions</h2>
          <div className="actions-grid">
            {quickActions.map((action, index) => (
              <Link key={index} to={action.link} className="action-card">
                <div className="action-icon" style={{ backgroundColor: action.color }}>
                  <FontAwesomeIcon icon={action.icon} />
                </div>
                <div className="action-content">
                  <h3>{action.title}</h3>
                  <p>{action.description}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="progress-section">
          <h2>Your Progress</h2>
          <div className="progress-cards">
            {[1, 2, 3, 4].map((level) => {
              const progress = userProgress ? userProgress.progress[level - 1] || 0 : 0;
              const isUnlocked = level === 1 || (userProgress && userProgress.progress[level - 2] >= 100);
              
              return (
                <div key={level} className={`progress-card ${!isUnlocked ? 'locked' : ''}`}>
                  <h3>Level {level}: {getLevelTitle(level)}</h3>
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${progress}%` }}></div>
                  </div>
                  <p>{progress}% Complete</p>
                  {!isUnlocked && <small>Complete previous level to unlock</small>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Leaderboard Preview */}
        {leaderboard.length > 0 && (
          <div className="leaderboard-preview">
            <h2>Top Learners</h2>
            <div className="leaderboard-list">
              {leaderboard.slice(0, 5).map((user, index) => (
                <div key={user.userId} className={`leaderboard-item ${user.userId === currentUser?.uid ? 'current-user' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem 1.5rem', borderRadius: '15px', background: user.userId === currentUser?.uid ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa', color: user.userId === currentUser?.uid ? 'white' : '#222', marginBottom: '1rem', boxShadow: user.userId === currentUser?.uid ? '0 4px 20px rgba(102, 126, 234, 0.10)' : 'none' }}>
                  <div className="rank" style={{ fontWeight: 700, fontSize: '1.2rem', minWidth: 40, color: user.userId === currentUser?.uid ? 'white' : '#667eea' }}>#{index + 1}</div>
                  <div className="user-avatar" style={{ background: user.userId === currentUser?.uid ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: user.userId === currentUser?.uid ? '#333' : 'white', fontWeight: 700, fontSize: '1.1rem', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getUserInitials(user.displayName || `User ${user.userId.slice(0, 8)}`)}
                  </div>
                  <div className="user-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <div className="user-name" style={{ fontWeight: 700, fontSize: '1.1rem', color: user.userId === currentUser?.uid ? 'white' : '#222' }}>
                      {user.userId === currentUser?.uid ? (user.displayName || 'You') : (user.displayName || `User ${user.userId.slice(0, 8)}`)}
                    </div>
                    <div className="user-xp" style={{ fontSize: '0.95rem', color: user.userId === currentUser?.uid ? 'white' : '#666' }}>{user.xp || 0} XP</div>
                  </div>
                  {index < 3 && (
                    <div className="medal">
                      <FontAwesomeIcon icon={faTrophy} style={{ color: '#FFD700', fontSize: '1.3rem' }} />
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="user-rank">
              <p>Your rank: <strong>#{getUserRank()}</strong></p>
            </div>
          </div>
        )}

        {/* Next Goal */}
        <div className="next-goal">
          <h2>Next Goal</h2>
          <div className="goal-card">
            {userProgress && userProgress.progress && userProgress.progress.every(p => p === 100) ? (
              <>
                <FontAwesomeIcon icon={faTrophy} className="goal-icon" />
                <div className="goal-content">
                  <h3>Congratulations! You've completed all levels!</h3>
                  <p>Here are some things you can do next:</p>
                  <ul className="goal-suggestions">
                    <li><Link to="/certificate">Claim your Certificate</Link></li>
                    <li><Link to="/quizzes">Take More Quizzes</Link></li>
                    <li><Link to="/discuss">Join the Discussion Forum</Link></li>
                    <li><Link to="/leaderboard">Check the Leaderboard</Link></li>
                  </ul>
                </div>
              </>
            ) : (
              <>
                <FontAwesomeIcon icon={faBookOpen} className="goal-icon" />
                <div className="goal-content">
                  <h3>Complete Level {getNextLevel()}</h3>
                  <p>Keep learning to unlock new content and earn more XP!</p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Certificate Section at the bottom */}
        <div className="certificate-section">
          <div className="certificate-card">
            <FontAwesomeIcon icon={faCertificate} className="certificate-icon" />
            <h3>Your Certificate is close</h3>
            <p>You are doing great! Keep learning to unlock your certificate.</p>
            {(userProgress && userProgress.progress && userProgress.progress.every(p => p === 100)) ? (
              <Link to="/certificate" className="claim-certificate-btn">
                Claim Certificate
              </Link>
            ) : (
              <button
                className="claim-certificate-btn"
                disabled
              >
                Claim Certificate
              </button>
            )}
          </div>
        </div>

        {/* Streak Leaderboard */}
        {streakLeaderboard.length > 0 && (
          <div className="streak-leaderboard">
            <h2>Top Daily Streaks</h2>
            <ol>
              {streakLeaderboard.map((user, i) => (
                <li key={user.userId} className={user.userId === currentUser?.uid ? 'current-user' : ''}>
                  <span className="rank">#{i + 1}</span> {user.displayName || `User ${user.userId.slice(0, 8)}`} - {user.currentStreak} days
                </li>
              ))}
            </ol>
            <h2>Top Best Streaks</h2>
            <ol>
              {bestStreakLeaderboard.map((user, i) => (
                <li key={user.userId} className={user.userId === currentUser?.uid ? 'current-user' : ''}>
                  <span className="rank">#{i + 1}</span> {user.displayName || `User ${user.userId.slice(0, 8)}`} - {user.bestStreak} days
                </li>
              ))}
            </ol>
          </div>
        )}
      </div>
    </div>
  );
}

// Helper function to get level titles
function getLevelTitle(level) {
  const titles = {
    1: 'Basic Rights',
    2: 'Civic Responsibilities', 
    3: 'Government Structure',
    4: 'Active Citizenship'
  };
  return titles[level] || 'Unknown Level';
}

export default Dashboard; 