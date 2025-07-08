import { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProgressService, LearningStreaksService } from '../services/userProgressService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTrophy, 
  faMedal, 
  faCrown,
  faFire,
  faUserGraduate,
  faSpinner,
  faChartLine
} from '@fortawesome/free-solid-svg-icons';
import './Leaderboard.css';

function Leaderboard() {
  const { currentUser } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [userRank, setUserRank] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Load leaderboard data on component mount
  useEffect(() => {
    const loadLeaderboardData = async () => {
      try {
        setLoading(true);
        const [topUsers, stats] = await Promise.all([
          UserProgressService.getLeaderboard(50), // Top 50 users
          LearningStreaksService.getGlobalStreakStats()
        ]);

        setLeaderboard(topUsers);
        setGlobalStats(stats);

        // Find user's rank
        if (currentUser) {
          const userIndex = topUsers.findIndex(user => user.userId === currentUser.uid);
          setUserRank(userIndex >= 0 ? userIndex + 1 : null);
          
          // Update current user's display name in their progress document
          if (currentUser.displayName) {
            await UserProgressService.getUserProgress(currentUser.uid, currentUser.displayName);
          }
        }
      } catch (err) {
        console.error('Error loading leaderboard data:', err);
        setError('Failed to load leaderboard data. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboardData();
  }, [currentUser]);

  const getRankIcon = (rank) => {
    if (rank === 1) return <FontAwesomeIcon icon={faCrown} className="rank-icon gold" />;
    if (rank === 2) return <FontAwesomeIcon icon={faMedal} className="rank-icon silver" />;
    if (rank === 3) return <FontAwesomeIcon icon={faMedal} className="rank-icon bronze" />;
    return null;
  };

  const getRankBadge = (rank) => {
    if (rank === 1) return '🥇';
    if (rank === 2) return '🥈';
    if (rank === 3) return '🥉';
    return `#${rank}`;
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

  // Helper function to get display name
  const getDisplayName = (user) => {
    if (user.userId === currentUser?.uid) {
      return 'You';
    }
    return user.displayName || `User ${user.userId.slice(0, 8)}`;
  };

  // Helper function to get user initials for avatar
  const getUserAvatarInitials = (user) => {
    if (user.userId === currentUser?.uid) {
      return getUserInitials(currentUser.displayName);
    }
    return getUserInitials(user.displayName);
  };

  if (loading) {
    return (
      <div className="leaderboard">
        <div className="leaderboard-container">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faSpinner} spin />
            <p>Loading leaderboard...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard">
        <div className="leaderboard-container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard">
      <div className="leaderboard-container">
        <div className="leaderboard-header">
          <h1>Leaderboard</h1>
          <p>Top learners in civic education</p>
        </div>

        {/* Top 3 Podium */}
        {leaderboard.length >= 3 && (
          <div className="podium-section">
            <h2>Top Performers</h2>
            <div className="podium">
              {/* Second Place */}
              <div className="podium-place second">
                <div className="podium-rank">2</div>
                <div className="podium-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8f9fa', borderRadius: '15px', padding: '1rem 1.5rem', minWidth: 220 }}>
                  <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #c0c0c0 0%, #e5e5e5 100%)', color: '#333', fontWeight: 700, fontSize: '1.2rem', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getUserAvatarInitials(leaderboard[1])}
                  </div>
                  <div className="user-details" style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{getDisplayName(leaderboard[1])}</h3>
                    <p style={{ color: '#667eea', fontWeight: 600, fontSize: '1rem', margin: 0 }}>{leaderboard[1].xp || 0} XP</p>
                  </div>
                </div>
              </div>

              {/* First Place */}
              <div className="podium-place first">
                <div className="podium-rank">1</div>
                <div className="podium-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', borderRadius: '15px', padding: '1.2rem 1.7rem', minWidth: 240 }}>
                  <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', color: '#333', fontWeight: 700, fontSize: '1.5rem', width: 56, height: 56, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 4px 15px rgba(255,215,0,0.2)' }}>
                    {getUserAvatarInitials(leaderboard[0])}
                  </div>
                  <div className="user-details" style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.2rem', margin: 0 }}>{getDisplayName(leaderboard[0])}</h3>
                    <p style={{ color: '#bfa100', fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{leaderboard[0].xp || 0} XP</p>
                  </div>
                </div>
              </div>

              {/* Third Place */}
              <div className="podium-place third">
                <div className="podium-rank">3</div>
                <div className="podium-user" style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: '#f8f9fa', borderRadius: '15px', padding: '1rem 1.5rem', minWidth: 220 }}>
                  <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #cd7f32 0%, #daa520 100%)', color: '#fff', fontWeight: 700, fontSize: '1.2rem', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {getUserAvatarInitials(leaderboard[2])}
                  </div>
                  <div className="user-details" style={{ flex: 1 }}>
                    <h3 style={{ fontWeight: 700, fontSize: '1.1rem', margin: 0 }}>{getDisplayName(leaderboard[2])}</h3>
                    <p style={{ color: '#cd7f32', fontWeight: 600, fontSize: '1rem', margin: 0 }}>{leaderboard[2].xp || 0} XP</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Leaderboard List */}
        <div className="leaderboard-list-section">
          <h2>All Rankings</h2>
          <div className="leaderboard-list">
            {leaderboard.map((user, index) => (
              <div 
                key={user.userId} 
                className={`leaderboard-item ${user.userId === currentUser?.uid ? 'current-user' : ''}`}
                style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.2rem 1.5rem', borderRadius: '15px', background: user.userId === currentUser?.uid ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' : '#f8f9fa', color: user.userId === currentUser?.uid ? 'white' : '#222', marginBottom: '1rem', boxShadow: user.userId === currentUser?.uid ? '0 4px 20px rgba(102, 126, 234, 0.10)' : 'none' }}
              >
                <div className="rank" style={{ fontWeight: 700, fontSize: '1.2rem', minWidth: 40, color: user.userId === currentUser?.uid ? 'white' : '#667eea' }}>#{index + 1}</div>
                <div className="user-avatar" style={{ background: user.userId === currentUser?.uid ? 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)' : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: user.userId === currentUser?.uid ? '#333' : 'white', fontWeight: 700, fontSize: '1.1rem', width: 40, height: 40, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {getUserAvatarInitials(user)}
                </div>
                <div className="user-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <div className="user-name" style={{ fontWeight: 700, fontSize: '1.1rem', color: user.userId === currentUser?.uid ? 'white' : '#222' }}>
                    {user.userId === currentUser?.uid ? (user.displayName || 'You') : (user.displayName || `User ${user.userId.slice(0, 8)}`)}
                  </div>
                  <div className="user-xp" style={{ fontSize: '0.95rem', color: user.userId === currentUser?.uid ? 'white' : '#666' }}>{user.xp || 0} XP</div>
                </div>
                {index < 3 ? (
                  <div className="medal">
                    {index === 0 ? (
                      <FontAwesomeIcon icon={faTrophy} style={{ color: '#FFD700', fontSize: '1.3rem' }} />
                    ) : index === 1 ? (
                      <FontAwesomeIcon icon={faMedal} style={{ color: '#C0C0C0', fontSize: '1.3rem' }} />
                    ) : (
                      <FontAwesomeIcon icon={faMedal} style={{ color: '#CD7F32', fontSize: '1.3rem' }} />
                    )}
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        </div>

        {/* User's Current Rank */}
        {userRank && (
          <div className="user-rank-section">
            <h2>Your Ranking</h2>
            <div className="user-rank-card" style={{ display: 'flex', alignItems: 'center', gap: '1.2rem', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', color: 'white', borderRadius: 15, padding: '1.5rem 2rem', boxShadow: '0 8px 30px rgba(102, 126, 234, 0.10)' }}>
              <div className="rank-number" style={{ fontWeight: 700, fontSize: '2rem', color: '#ffd700', minWidth: 60 }}>#{userRank}</div>
              <div className="user-avatar" style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)', color: '#333', fontWeight: 700, fontSize: '1.3rem', width: 48, height: 48, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                {getUserAvatarInitials({ userId: currentUser?.uid, displayName: currentUser?.displayName })}
              </div>
              <div className="user-info" style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.2rem', margin: 0, color: 'white' }}>You</h3>
                <p style={{ color: 'white', fontSize: '1rem', margin: 0 }}>Keep learning to climb the ranks!</p>
              </div>
              <FontAwesomeIcon icon={faTrophy} className="trophy-icon" style={{ color: '#ffd700', fontSize: '2rem', marginLeft: 'auto', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))' }} />
            </div>
          </div>
        )}

        {/* Motivation Section */}
        <div className="motivation-section">
          <h2>Keep Learning!</h2>
          <div className="motivation-cards">
            <div className="motivation-card">
              <FontAwesomeIcon icon={faFire} />
              <h3>Build Your Streak</h3>
              <p>Learn daily to maintain your streak and climb the ranks</p>
            </div>
            <div className="motivation-card">
              <FontAwesomeIcon icon={faTrophy} />
              <h3>Earn XP</h3>
              <p>Complete lessons and quizzes to earn experience points</p>
            </div>
            <div className="motivation-card">
              <FontAwesomeIcon icon={faUserGraduate} />
              <h3>Master Levels</h3>
              <p>Unlock new content by completing previous levels</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Leaderboard; 