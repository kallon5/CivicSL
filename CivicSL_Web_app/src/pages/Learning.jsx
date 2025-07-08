import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { UserProgressService, LearningStreaksService } from '../services/userProgressService';
import { LearningContentService } from '../services/learningContentService';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, 
  faCheckCircle, 
  faLock,
  faPlay,
  faFire,
  faTrophy,
  faCalendar,
  faTimes,
  faArrowLeft,
  faArrowRight,
  faChevronRight,
  faCertificate,
  faDownload,
  faEye,
  faInfoCircle
} from '@fortawesome/free-solid-svg-icons';
import './Learning.css';
import QuizModal from '../components/QuizModal';
import XPToast from '../components/XPToast';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { useNavigate } from 'react-router-dom';
import StreakToast from '../components/StreakToast';

function Learning() {
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState(null);
  const [userStreak, setUserStreak] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showLevelModal, setShowLevelModal] = useState(false);
  const [showModuleModal, setShowModuleModal] = useState(false);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [selectedModule, setSelectedModule] = useState(null);
  const [currentModuleIndex, setCurrentModuleIndex] = useState(0);
  const confettiRef = useRef(null);
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [quizData, setQuizData] = useState(null);
  const [quizType, setQuizType] = useState(null); // 'module' or 'level'
  const [pendingModule, setPendingModule] = useState(null);
  const [pendingLevelIndex, setPendingLevelIndex] = useState(null);
  const [levelQuizPassed, setLevelQuizPassed] = useState({}); // { [levelId]: true/false }
  const [moduleQuizPassed, setModuleQuizPassed] = useState({}); // { [moduleId]: true/false }
  const [xpToast, setXPToast] = useState({ xp: 0, reason: '' });
  const [selectedLevelIndex, setSelectedLevelIndex] = useState(null);
  const [level5Passed, setLevel5Passed] = useState(false);
  const [level5Reflection, setLevel5Reflection] = useState('');
  const [showCertificateModal, setShowCertificateModal] = useState(false);
  const navigate = useNavigate();
  const [streakToast, setStreakToast] = useState(null);

  // Get all levels from the learning content service
  const levels = LearningContentService.getAllLevels();

  // Load user progress and streaks on component mount
  useEffect(() => {
    const loadUserData = async () => {
      if (!currentUser) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [progress, streak] = await Promise.all([
          UserProgressService.getUserProgress(currentUser.uid, currentUser.displayName),
          LearningStreaksService.getUserStreak(currentUser.uid)
        ]);
        setUserProgress(progress);
        setUserStreak(streak);

        // Always set level5Passed based on Firestore data
        if (progress && progress.progress && progress.progress[4] === 100) {
          setLevel5Passed(true);
          console.log('Loaded progress:', progress.progress, 'level5Passed:', true);
        } else {
          setLevel5Passed(false);
          console.log('Loaded progress:', progress.progress, 'level5Passed:', false);
        }
        // Set Level 5 reflection if exists
        if (progress && progress.level5Reflection) {
          setLevel5Reflection(progress.level5Reflection);
        }
      } catch (err) {
        setError('Failed to load your progress. Please try again.');
      } finally {
        setLoading(false);
      }
    };
    loadUserData();
  }, [currentUser]);

  // Confetti animation (simple SVG burst)
  const triggerConfetti = () => {
    if (confettiRef.current) {
      confettiRef.current.classList.remove('show');
      void confettiRef.current.offsetWidth; // reflow
      confettiRef.current.classList.add('show');
      setTimeout(() => {
        if (confettiRef.current) confettiRef.current.classList.remove('show');
      }, 1500);
    }
  };

  // Handle starting a lesson
  const handleStartLesson = async (levelIndex, moduleId, showConfetti = false) => {
    if (!currentUser || !userProgress) return;
    try {
      await LearningStreaksService.updateDailyStreak(currentUser.uid);
      const newProgress = await UserProgressService.completeLesson(currentUser.uid, levelIndex, moduleId);
      setUserProgress(prev => ({ ...prev, progress: newProgress }));
      setSelectedLevel(prevLevel => {
        if (!prevLevel) return prevLevel;
        const updatedLessons = prevLevel.lessons.map(lesson =>
          lesson.id === moduleId ? { ...lesson, completed: true } : lesson
        );
        return { ...prevLevel, lessons: updatedLessons };
      });
      LearningContentService.markLessonCompleted(levelIndex + 1, moduleId);
      const updatedProgress = await UserProgressService.getUserProgress(currentUser.uid, currentUser.displayName);
      setUserProgress(updatedProgress);
      const updatedStreak = await LearningStreaksService.getUserStreak(currentUser.uid);
      setUserStreak(updatedStreak);
      setXPToast({ xp: 10, reason: 'Completed a lesson/module' });
      if (showConfetti) triggerConfetti();

      if (userStreak && updatedStreak) {
        if (updatedStreak.currentStreak > userStreak.currentStreak) {
          setStreakToast({ message: `🔥 You're on a ${updatedStreak.currentStreak}-day streak!`, type: 'streak' });
        }
        if (updatedStreak.bestStreak > userStreak.bestStreak) {
          setStreakToast({ message: `🎉 New best streak: ${updatedStreak.bestStreak} days!`, type: 'best' });
          triggerConfetti();
        }
        if (updatedStreak.currentStreak === 1 && userStreak.currentStreak > 1) {
          setStreakToast({ message: `😢 You missed a day. Your streak has reset.`, type: 'reset' });
        }
      }
    } catch (err) {
      console.error('Error starting lesson:', err);
      setError('Failed to start lesson. Please try again.');
    }
  };

  // Handle level selection
  const handleLevelClick = (levelIndex) => {
    console.log('Level clicked:', levelIndex, 'Unlocked:', isLevelUnlocked(levelIndex));
    if (isLevelUnlocked(levelIndex)) {
      // Special handling for Level 5 (assessment)
      if (levelIndex === 4) { // Level 5 is index 4
        console.log('Level 5 clicked, checking completion status...');
        // Check if Level 5 is already completed
        if (userProgress && userProgress.progress && userProgress.progress[4] === 100) {
          console.log('Level 5 already completed');
          // Level 5 already completed, show completion message
          const confirmed = window.confirm(
            '🎉 Congratulations! You have already completed the Civic Assessment!\n\n' +
            'Your certificate is ready to claim. Would you like to view your certificate now?'
          );
          if (confirmed) {
            // Navigate to certificate page or show certificate modal
            if (userProgress && userProgress.progress && userProgress.progress.slice(0, 4).every(p => p === 100)) {
              setShowCertificateModal(true);
            }
          }
          return;
        }
        
        console.log('Setting up Level 5 assessment modal...');
        // Open Level 5 assessment in modal instead of iframe
        setSelectedLevelIndex(levelIndex);
        setQuizData({
          questions: [
            {
              question: "What is the primary purpose of civic education?",
              options: [
                "To prepare citizens for active participation in democracy",
                "To teach only about government structures",
                "To focus solely on voting rights",
                "To memorize historical dates"
              ],
              correct: 0
            },
            {
              question: "Which branch of government is responsible for interpreting laws?",
              options: [
                "Executive Branch",
                "Legislative Branch",
                "Judicial Branch",
                "Administrative Branch"
              ],
              correct: 2
            },
            {
              question: "What is the fundamental principle behind the separation of powers?",
              options: [
                "To make government more efficient",
                "To prevent any one branch from becoming too powerful",
                "To reduce government spending",
                "To simplify the lawmaking process"
              ],
              correct: 1
            },
            {
              question: "Which of the following is NOT a civic responsibility?",
              options: [
                "Voting in elections",
                "Paying taxes",
                "Serving on a jury when called",
                "Running for office (mandatory)"
              ],
              correct: 3
            },
            {
              question: "What does the First Amendment protect?",
              options: [
                "Freedom of speech, religion, press, assembly, and petition",
                "Right to bear arms",
                "Right to a speedy trial",
                "Right to vote"
              ],
              correct: 0
            },
            {
              question: "What is the purpose of checks and balances in government?",
              options: [
                "To slow down the legislative process",
                "To ensure each branch can limit the power of other branches",
                "To increase government bureaucracy",
                "To reduce public participation"
              ],
              correct: 1
            },
            {
              question: "Which level of government is typically responsible for education?",
              options: [
                "Federal government only",
                "State and local governments",
                "International organizations",
                "Private corporations only"
              ],
              correct: 1
            },
            {
              question: "What is civic engagement?",
              options: [
                "Only voting in elections",
                "Active participation in community and political life",
                "Reading the news",
                "Paying taxes"
              ],
              correct: 1
            },
            {
              question: "What is the role of the media in a democracy?",
              options: [
                "To entertain the public",
                "To inform citizens and hold government accountable",
                "To support only one political party",
                "To avoid controversial topics"
              ],
              correct: 1
            },
            {
              question: "What is the purpose of public opinion in a democracy?",
              options: [
                "To create division among citizens",
                "To influence government decisions and policies",
                "To replace the voting process",
                "To eliminate political parties"
              ],
              correct: 1
            },
            {
              question: "What is the significance of the rule of law?",
              options: [
                "It applies only to citizens, not government officials",
                "Everyone, including government officials, must follow the law",
                "It only applies to criminal cases",
                "It can be ignored in emergencies"
              ],
              correct: 1
            },
            {
              question: "What is the purpose of political parties?",
              options: [
                "To divide the country",
                "To organize citizens with similar political views and goals",
                "To eliminate competition in elections",
                "To control the media"
              ],
              correct: 1
            },
            {
              question: "What is the importance of an independent judiciary?",
              options: [
                "To support the executive branch",
                "To make decisions based on law, not political pressure",
                "To speed up court cases",
                "To reduce court costs"
              ],
              correct: 1
            },
            {
              question: "What is the role of interest groups in democracy?",
              options: [
                "To replace political parties",
                "To advocate for specific issues and influence policy",
                "To eliminate public debate",
                "To control elections"
              ],
              correct: 1
            },
            {
              question: "What is the purpose of the electoral college?",
              options: [
                "To make elections more complicated",
                "To balance the influence of large and small states in presidential elections",
                "To eliminate popular vote",
                "To reduce voter participation"
              ],
              correct: 1
            },
            {
              question: "What is the significance of civil rights?",
              options: [
                "They only apply to certain groups",
                "They protect individual freedoms from government interference",
                "They are optional for governments to follow",
                "They only apply to voting"
              ],
              correct: 1
            },
            {
              question: "What is the purpose of federalism?",
              options: [
                "To centralize all power in the federal government",
                "To divide power between national and state governments",
                "To eliminate state governments",
                "To create international government"
              ],
              correct: 1
            },
            {
              question: "What is the importance of public service?",
              options: [
                "It's only for government employees",
                "It strengthens communities and democracy through citizen participation",
                "It's mandatory for all citizens",
                "It only involves volunteering"
              ],
              correct: 1
            },
            {
              question: "What is the role of education in democracy?",
              options: [
                "To prepare only for jobs",
                "To prepare informed and engaged citizens",
                "To eliminate critical thinking",
                "To support only one viewpoint"
              ],
              correct: 1
            },
            {
              question: "What is the purpose of constitutional rights?",
              options: [
                "To limit individual freedoms",
                "To protect fundamental freedoms and limit government power",
                "To apply only to certain citizens",
                "To create government bureaucracy"
              ],
              correct: 1
            }
          ]
        });
        setQuizType('level');
        console.log('Opening Level 5 quiz modal...');
        setShowQuizModal(true);
      } else {
        // Regular level handling
      setSelectedLevel(levels[levelIndex]);
      setSelectedLevelIndex(levelIndex);
      setShowLevelModal(true);
      }
    }
  };

  // Handle module selection
  const handleModuleClick = (moduleIndex) => {
    setCurrentModuleIndex(moduleIndex);
    setSelectedModule(selectedLevel.lessons[moduleIndex]);
    setShowModuleModal(true);
  };

  // Handle next module
  const handleNextModule = () => {
    if (!moduleQuizPassed[selectedModule.id]) {
      setQuizData(selectedModule.quiz);
      setQuizType('module');
      setPendingModule(selectedModule);
      setShowQuizModal(true);
      return;
    }
    if (currentModuleIndex < selectedLevel.lessons.length - 1) {
      const nextIndex = currentModuleIndex + 1;
      setCurrentModuleIndex(nextIndex);
      setSelectedModule(selectedLevel.lessons[nextIndex]);
    } else {
      setShowModuleModal(false); // Last module, close modal (level quiz will auto-popup)
    }
  };

  // Handle previous module
  const handlePreviousModule = () => {
    if (currentModuleIndex > 0) {
      const prevIndex = currentModuleIndex - 1;
      setCurrentModuleIndex(prevIndex);
      setSelectedModule(selectedLevel.lessons[prevIndex]);
    }
  };

  // Check if a level is unlocked
  const isLevelUnlocked = (levelIndex) => {
    if (!userProgress) return levelIndex === 0; // Only first level unlocked by default
    
    if (levelIndex === 0) return true; // First level is always unlocked
    
    // Check if previous level is 100% complete
    return userProgress.progress[levelIndex - 1] >= 100;
  };

  // Get completed lessons for a level
  const getCompletedLessons = (levelIndex) => {
    if (!userProgress) return 0;
    const progressPercent = userProgress.progress[levelIndex] || 0;
    const level = levels[levelIndex];
    return Math.floor((progressPercent / 100) * level.lessons.length);
  };

  // Check if a module is completed
  const isModuleCompleted = (moduleId) => {
    const module = selectedLevel?.lessons.find(lesson => lesson.id === moduleId);
    return module?.completed || false;
  };

  // Handle module quiz completion
  const handleModuleQuizComplete = async (score, correctAnswers = null, totalQuestions = null) => {
    setShowQuizModal(false);
    if (score >= 80 && pendingModule && selectedLevelIndex !== null) {
      setModuleQuizPassed(prev => ({ ...prev, [pendingModule.id]: true }));
      await handleStartLesson(selectedLevelIndex, pendingModule.id, false); // false = no confetti
      // Move to next module if not last
      const nextIndex = selectedLevel.lessons.findIndex(m => m.id === pendingModule.id) + 1;
      if (nextIndex < selectedLevel.lessons.length) {
        setCurrentModuleIndex(nextIndex);
        setSelectedModule(selectedLevel.lessons[nextIndex]);
      } else {
        setShowModuleModal(false);
      }
      setPendingModule(null);
      let xp = 5;
      if (typeof correctAnswers === 'number') xp += correctAnswers;
      if (score === 100) xp += 5;
      setXPToast({ xp, reason: 'Quiz completed!' });
      // Update streak after quiz
      if (currentUser) {
        await LearningStreaksService.updateDailyStreak(currentUser.uid);
        const updatedStreak = await LearningStreaksService.getUserStreak(currentUser.uid);
        setUserStreak(updatedStreak);
      }

      if (userStreak && updatedStreak) {
        if (updatedStreak.currentStreak > userStreak.currentStreak) {
          setStreakToast({ message: `🔥 You're on a ${updatedStreak.currentStreak}-day streak!`, type: 'streak' });
        }
        if (updatedStreak.bestStreak > userStreak.bestStreak) {
          setStreakToast({ message: `🎉 New best streak: ${updatedStreak.bestStreak} days!`, type: 'best' });
        }
        if (updatedStreak.currentStreak === 1 && userStreak.currentStreak > 1) {
          setStreakToast({ message: `😢 You missed a day. Your streak has reset.`, type: 'reset' });
        }
      }
    }
  };

  // Helper: Check if all modules in selectedLevel are completed
  const areAllModulesCompleted = (level) => {
    return level.lessons.every(lesson => lesson.completed);
  };

  // Auto-popup level quiz after last module is completed
  useEffect(() => {
    if (selectedLevel && areAllModulesCompleted(selectedLevel) && !levelQuizPassed[selectedLevel.id]) {
      setQuizData(selectedLevel.quiz);
      setQuizType('level');
      setPendingLevelIndex(selectedLevelIndex);
      setShowQuizModal(true);
    }
    // eslint-disable-next-line
  }, [selectedLevel && selectedLevel.lessons.map(l => l.completed).join(","), levelQuizPassed, selectedLevelIndex]);

  // Handle level quiz completion
  const handleLevelQuizComplete = async (score, correctAnswers = null, totalQuestions = null) => {
    setShowQuizModal(false);
    if (score >= 80 && pendingLevelIndex !== null) {
      if (userProgress) {
        const newProgress = [...userProgress.progress];
        newProgress[pendingLevelIndex] = 100;
        setUserProgress(prev => ({ ...prev, progress: newProgress }));
        await UserProgressService.updateLevelProgress(currentUser.uid, pendingLevelIndex, 100);
        const updatedProgress = await UserProgressService.getUserProgress(currentUser.uid, currentUser.displayName);
        setUserProgress(updatedProgress);
      }
      setLevelQuizPassed(prev => ({ ...prev, [selectedLevel.id]: true }));
      setPendingLevelIndex(null);
      triggerConfetti();
      let xp = 5;
      if (typeof correctAnswers === 'number') xp += correctAnswers;
      if (score === 100) xp += 5;
      setXPToast({ xp, reason: 'Quiz completed!' });
      // Update streak after quiz
      if (currentUser) {
        await LearningStreaksService.updateDailyStreak(currentUser.uid);
        const updatedStreak = await LearningStreaksService.getUserStreak(currentUser.uid);
        setUserStreak(updatedStreak);
      }

      if (userStreak && updatedStreak) {
        if (updatedStreak.currentStreak > userStreak.currentStreak) {
          setStreakToast({ message: `🔥 You're on a ${updatedStreak.currentStreak}-day streak!`, type: 'streak' });
        }
        if (updatedStreak.bestStreak > userStreak.bestStreak) {
          setStreakToast({ message: `🎉 New best streak: ${updatedStreak.bestStreak} days!`, type: 'best' });
        }
        if (updatedStreak.currentStreak === 1 && userStreak.currentStreak > 1) {
          setStreakToast({ message: `😢 You missed a day. Your streak has reset.`, type: 'reset' });
        }
      }
    }
  };

  // Save Level 5 reflection to Firestore
  const saveLevel5Reflection = async (reflectionText) => {
    if (!currentUser) return;
    setLevel5Reflection(reflectionText);
    try {
      await updateDoc(doc(db, 'userProgress', currentUser.uid), {
        level5Reflection: reflectionText,
      });
    } catch (err) {
      // Optionally handle error
    }
  };

  // Custom handler for Level 5 assessment completion
  const handleLevel5AssessmentComplete = async (score, correctAnswers, totalMCQ) => {
    console.log('Level 5 Assessment Complete:', { score, correctAnswers, totalMCQ });
    
    // Award higher XP for Level 5
    let xp = 0;
    if (score >= 80) xp += 50;
    if (typeof correctAnswers === 'number') xp += correctAnswers * 2;
    if (score === 100) xp += 10;
    
    // Mark Level 5 as passed if score >= 80 and save to database
    if (score >= 80) {
      console.log('Level 5 passed! Saving progress...');
      setLevel5Passed(true);
      
      // Save Level 5 progress to database
      if (userProgress) {
        const newProgress = [...userProgress.progress];
        newProgress[4] = 100; // Level 5 is index 4
        setUserProgress(prev => ({ ...prev, progress: newProgress }));
        
        try {
          await UserProgressService.updateLevelProgress(currentUser.uid, 4, 100);
          console.log('Level 5 progress saved successfully');
          
    // Refresh user progress
    const updatedProgress = await UserProgressService.getUserProgress(currentUser.uid, currentUser.displayName);
    setUserProgress(updatedProgress);
          console.log('Updated progress:', updatedProgress);
        } catch (error) {
          console.error('Error saving Level 5 progress:', error);
        }
      }
      
      // Trigger confetti animation
      triggerConfetti();
      // Update streak after assessment
      if (currentUser) {
        await LearningStreaksService.updateDailyStreak(currentUser.uid);
        const updatedStreak = await LearningStreaksService.getUserStreak(currentUser.uid);
        setUserStreak(updatedStreak);
      }
    }
    
    if (xp > 0) setXPToast({ xp, reason: 'Civic Assessment Complete!' });
    
    // Close the quiz modal
    setShowQuizModal(false);

    if (userStreak && updatedStreak) {
      if (updatedStreak.currentStreak > userStreak.currentStreak) {
        setStreakToast({ message: `🔥 You're on a ${updatedStreak.currentStreak}-day streak!`, type: 'streak' });
      }
      if (updatedStreak.bestStreak > userStreak.bestStreak) {
        setStreakToast({ message: `🎉 New best streak: ${updatedStreak.bestStreak} days!`, type: 'best' });
      }
      if (updatedStreak.currentStreak === 1 && userStreak.currentStreak > 1) {
        setStreakToast({ message: `😢 You missed a day. Your streak has reset.`, type: 'reset' });
      }
    }
  };

  const handleClaimCertificate = () => {
    console.log('Claim certificate clicked:', { 
      userProgress: userProgress?.progress, 
      level5Passed, 
      eligible: userProgress && userProgress.progress && userProgress.progress.slice(0, 4).every(p => p === 100) && level5Passed 
    });
    if (userProgress && userProgress.progress && userProgress.progress.slice(0, 4).every(p => p === 100) && level5Passed) {
      setShowCertificateModal(true);
    }
  };

  const handleDownloadCertificate = async () => {
    const certElem = document.getElementById('certificate-preview');
    if (!certElem) return;
    const canvas = await html2canvas(certElem);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape' });
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('CivicSL_Certificate.pdf');
  };

  useEffect(() => {
    async function refreshStreak() {
      if (currentUser) {
        const streak = await LearningStreaksService.getUserStreak(currentUser.uid);
        setUserStreak(streak);
      }
    }
    refreshStreak();
    // Optionally, set up an interval to refresh at the start of each week
  }, [currentUser]);

  if (loading) {
    return (
      <div className="learning">
        <div className="learning-container">
          <div className="loading-spinner">
            <FontAwesomeIcon icon={faBookOpen} spin />
            <p>Loading your progress...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="learning">
        <div className="learning-container">
          <div className="error-message">
            <p>{error}</p>
            <button onClick={() => window.location.reload()}>Try Again</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="learning">
      {/* Floating XP/Streak badge */}
      {userProgress && userStreak && (
        <div className="floating-badge">
          <span role="img" aria-label="trophy">🏆</span> {userProgress.xp} XP
          <span role="img" aria-label="fire">🔥</span> {userStreak.currentStreak}d
        </div>
      )}
      {/* Confetti SVG */}
      <svg ref={confettiRef} className="confetti" style={{ display: 'none' }} width="100vw" height="100vh">
        <g>
          <circle cx="50%" cy="20%" r="8" fill="#FFD700" />
          <circle cx="60%" cy="25%" r="6" fill="#4CAF50" />
          <circle cx="40%" cy="30%" r="7" fill="#667eea" />
          <circle cx="55%" cy="18%" r="5" fill="#ff6b35" />
          <circle cx="45%" cy="22%" r="4" fill="#764ba2" />
        </g>
      </svg>
      <div className="learning-container">
        <div className="learning-header">
          <h1>Learning Path</h1>
          <p>Follow the structured curriculum to master civic education</p>
        </div>

        {/* Streaks Breakdown */}
        {userStreak && (
          <div className="streaks-breakdown">
            <div className={`streak-card daily${userStreak.currentStreak > 0 ? ' active' : ''}`}>
              <div className="streak-label">
                🔥 Daily Streak
                <span className="info-icon" title="Complete at least one lesson or quiz each day to keep your daily streak!">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
              </div>
              <div className="streak-value">{userStreak.currentStreak} days</div>
              <div className="streak-best">Best: {userStreak.bestStreak} days</div>
            </div>
            <div className="streak-card weekly">
              <div className="streak-label">
                📅 Weekly Streak
                <span className="info-icon" title="Complete an activity on each day to fill the circle. The streak resets every Monday.">
                  <FontAwesomeIcon icon={faInfoCircle} />
                </span>
              </div>
              <div className="streak-value">{userStreak.weeklyCurrentStreak} days</div>
              <div className="streak-best">Best: {userStreak.weeklyBestStreak} days</div>
              <div className="weekly-days-ui">
                {['M','T','W','T','F','S','S'].map((d, i) => (
                  <span key={i} className={`week-day-circle${userStreak.weeklyDays && userStreak.weeklyDays[i] ? ' active' : ''}`}>{d}</span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Levels Grid */}
        <div className="levels-grid">
          {levels.map((level, index) => {
            const isUnlocked = isLevelUnlocked(index);
            const completedLessons = getCompletedLessons(index);
            const progressPercent = userProgress ? userProgress.progress[index] || 0 : 0;
            const isAssessmentLevel = index === 4; // Level 5 is assessment
            
            return (
              <div key={level.id} className={`level-card ${!isUnlocked ? 'locked' : ''} ${isAssessmentLevel ? 'assessment-level' : ''}`}
                style={{ 
                  boxShadow: isUnlocked ? '0 8px 30px rgba(102, 126, 234, 0.15)' : undefined,
                  border: isAssessmentLevel ? '2px solid #FFD700' : undefined,
                  background: isAssessmentLevel ? 'linear-gradient(135deg, #fff8e1 0%, #fff3cd 100%)' : undefined
                }}>
                <div className="level-header" onClick={() => handleLevelClick(index)}>
                  <div className="level-icon" style={isAssessmentLevel ? { background: 'linear-gradient(135deg, #FFD700, #FFA000)' } : undefined}>
                    {!isUnlocked ? (
                      <FontAwesomeIcon icon={faLock} />
                    ) : isAssessmentLevel ? (
                      <FontAwesomeIcon icon={faTrophy} />
                    ) : (
                      <FontAwesomeIcon icon={faBookOpen} />
                    )}
                  </div>
                  <div className="level-info">
                    <h3>{level.title}</h3>
                    <p>{level.description}</p>
                    {isAssessmentLevel && (
                      <span style={{ 
                        color: '#FF6B35', 
                        fontSize: '0.9rem', 
                        fontWeight: 'bold',
                        display: 'block',
                        marginTop: '5px'
                      }}>
                        🏆 Final Assessment
                      </span>
                    )}
                  </div>
                  <div className="level-arrow">
                    <FontAwesomeIcon icon={faChevronRight} />
                  </div>
                </div>
                
                <div className="level-progress">
                  <div className="progress-info">
                    {isAssessmentLevel ? (
                      <span>{progressPercent >= 100 ? 'Assessment Completed' : 'Assessment Available'}</span>
                    ) : (
                    <span>{completedLessons}/{level.lessons.length} lessons completed</span>
                    )}
                    <span>{Math.round(progressPercent)}%</span>
                  </div>
                  <div className="progress-bar">
                    <div 
                      className="progress-fill" 
                      style={{ 
                        width: `${progressPercent}%`,
                        background: isAssessmentLevel ? 'linear-gradient(90deg, #FFD700, #FFA000)' : undefined
                      }}
                    ></div>
                  </div>
                </div>

                {!isUnlocked && (
                  <button 
                    className="level-btn locked"
                    disabled={true}
                  >
                    <FontAwesomeIcon icon={faLock} />
                    Complete Previous Level
                  </button>
                )}
                
                {isUnlocked && isAssessmentLevel && progressPercent < 100 && (
                  <button 
                    className="level-btn"
                    onClick={() => handleLevelClick(index)}
                    style={{
                      background: 'linear-gradient(135deg, #FFD700, #FFA000)',
                      color: 'white',
                      fontWeight: 'bold'
                    }}
                  >
                    <FontAwesomeIcon icon={faTrophy} />
                    Start Assessment
                  </button>
                )}
                
                {isUnlocked && isAssessmentLevel && progressPercent >= 100 && (
                  <button 
                    className="level-btn"
                    disabled={true}
                    style={{
                      background: 'linear-gradient(135deg, #4CAF50, #45a049)',
                      color: 'white'
                    }}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Assessment Complete
                  </button>
                )}
              </div>
            );
          })}
        </div>

        {/* Level Modal */}
        {showLevelModal && selectedLevel && (
          <div className="modal-overlay" onClick={() => setShowLevelModal(false)}>
            <div className="level-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedLevel.title}</h2>
                <button className="close-btn" onClick={() => setShowLevelModal(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              <div className="modal-content">
                <p className="level-description">{selectedLevel.description}</p>
                <div className="modules-grid">
                  {selectedLevel.lessons.map((module, index) => (
                    <div 
                      key={module.id} 
                      className={`module-card ${isModuleCompleted(module.id) ? 'completed' : ''}`}
                      onClick={() => handleModuleClick(index)}
                    >
                      <div className="module-header">
                        <div className="module-number">Module {module.id}</div>
                        {isModuleCompleted(module.id) && (
                          <FontAwesomeIcon icon={faCheckCircle} className="completed-icon" />
                        )}
                      </div>
                      <h3>{module.title}</h3>
                      <p>{module.summary}</p>
                      <div className="module-arrow">
                        <FontAwesomeIcon icon={faChevronRight} />
                      </div>
                    </div>
                  ))}
                </div>
                {/* Take Level Quiz Button */}
                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                  <button
                    className="claim-certificate-btn"
                    style={{ minWidth: 200 }}
                    disabled={!(areAllModulesCompleted(selectedLevel) && !levelQuizPassed[selectedLevel.id])}
                    onClick={() => {
                      setQuizData(selectedLevel.quiz);
                      setQuizType('level');
                      setPendingLevelIndex(selectedLevelIndex);
                      setShowQuizModal(true);
                    }}
                  >
                    Take Level Quiz
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Module Modal */}
        {showModuleModal && selectedModule && (
          <div className="modal-overlay" onClick={() => setShowModuleModal(false)}>
            <div className="module-modal" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>{selectedModule.title}</h2>
                <button className="close-btn" onClick={() => setShowModuleModal(false)}>
                  <FontAwesomeIcon icon={faTimes} />
                </button>
              </div>
              {/* Progress bar for lesson modal */}
              <div className="lesson-modal-progress">
                <div className="progress-fill" style={{ width: `${((currentModuleIndex + 1) / selectedLevel.lessons.length) * 100}%` }}></div>
              </div>
              <div className="modal-content">
                <div className="module-content">
                  {selectedModule.content.split('\n').map((paragraph, idx) => (
                    <p key={idx}>{paragraph}</p>
                  ))}
                </div>
                <div className="module-navigation">
                  <button 
                    className="nav-btn prev-btn"
                    onClick={handlePreviousModule}
                    disabled={currentModuleIndex === 0}
                  >
                    <FontAwesomeIcon icon={faArrowLeft} />
                    Previous
                  </button>
                  <button 
                    className="nav-btn complete-btn"
                    onClick={() => {
                      setQuizData(selectedModule.quiz);
                      setQuizType('module');
                      setPendingModule(selectedModule);
                      setShowQuizModal(true);
                    }}
                    disabled={moduleQuizPassed[selectedModule.id]}
                  >
                    <FontAwesomeIcon icon={faCheckCircle} />
                    Mark Complete
                  </button>
                  <button 
                    className="nav-btn next-btn"
                    onClick={handleNextModule}
                    disabled={currentModuleIndex === selectedLevel.lessons.length - 1}
                  >
                    Next
                    <FontAwesomeIcon icon={faArrowRight} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Modal for module/level quizzes */}
        {showQuizModal && quizData && selectedLevelIndex === 4 && quizType === 'level' ? (
          <QuizModal
            isOpen={showQuizModal}
            onClose={() => setShowQuizModal(false)}
            quiz={quizData}
            levelTitle="Level 5: Civic Assessment"
            onComplete={handleLevel5AssessmentComplete}
            onReflectionSubmit={saveLevel5Reflection}
            timeLimitSeconds={420}
            isAssessment={true}
          />
        ) : showQuizModal && quizData ? (
          <QuizModal
            isOpen={showQuizModal}
            onClose={() => setShowQuizModal(false)}
            quiz={quizData}
            levelTitle={quizType === 'level' ? selectedLevel?.title : selectedModule?.title}
            onComplete={quizType === 'module' ? handleModuleQuizComplete : handleLevelQuizComplete}
          />
        ) : null}
      </div>
      {/* Certificate Section at the bottom */}
      <div className="certificate-section">
        <div className="certificate-card">
          <FontAwesomeIcon icon={faCertificate} className="certificate-icon" />
          <h3>Your Certificate is close</h3>
          <p>You are doing great! Complete all levels and pass the final assessment to unlock your certificate.</p>
          <button
            className="claim-certificate-btn"
            disabled={!(userProgress && userProgress.progress && userProgress.progress.slice(0, 4).every(p => p === 100) && level5Passed)}
            onClick={handleClaimCertificate}
          >
            Claim Certificate
          </button>
        </div>
      </div>
      {/* XP Toast Notification */}
      {xpToast.xp > 0 && (
        <XPToast xp={xpToast.xp} reason={xpToast.reason} onClose={() => setXPToast({ xp: 0, reason: '' })} />
      )}
      {/* Certificate Modal */}
      {showCertificateModal && (
        <div className="modal-overlay" onClick={() => setShowCertificateModal(false)}>
          <div className="level-modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 700 }}>
            <div className="modal-header">
              <h2>🎉 Your Certificate is Ready!</h2>
              <button className="close-btn" onClick={() => setShowCertificateModal(false)}>
                <FontAwesomeIcon icon={faTimes} />
              </button>
            </div>
            <div className="modal-content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <div id="certificate-preview" className="modern-certificate">
                <div className="certificate-border">
                  <div className="certificate-header">
                    <div className="certificate-logo">
                      <FontAwesomeIcon icon={faCertificate} />
                    </div>
                    <h1>CivicSL</h1>
                    <p className="certificate-subtitle">Civic Education Platform</p>
                  </div>
                  
                  <div className="certificate-body">
                    <h2>Certificate of Completion</h2>
                    <p className="certificate-text">This is to certify that</p>
                    <h3 className="student-name">{currentUser?.displayName || currentUser?.email || 'Your Name'}</h3>
                    <p className="certificate-text">has successfully completed the comprehensive Civic Education program, demonstrating proficiency in:</p>
                    
                    <div className="achievements">
                      <div className="achievement-item">
                        <span className="achievement-icon">📚</span>
                        <span>Government Structures & Democracy</span>
                      </div>
                      <div className="achievement-item">
                        <span className="achievement-icon">🗽</span>
                        <span>Civic Rights & Responsibilities</span>
                      </div>
                      <div className="achievement-item">
                        <span className="achievement-icon">🤝</span>
                        <span>Community Engagement</span>
                      </div>
                      <div className="achievement-item">
                        <span className="achievement-icon">🏆</span>
                        <span>Final Assessment (Score: 80%+)</span>
                      </div>
                    </div>
                    
                    <p className="certificate-text">This certificate represents a commitment to civic education and active citizenship.</p>
                  </div>
                  
                  <div className="certificate-footer">
                    <div className="date-section">
                      <p>Date of Completion</p>
                      <span>{new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</span>
                    </div>
                    <div className="signature-section">
                      <div className="signature-line"></div>
                      <p>Program Director</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="certificate-actions">
                <button className="download-btn" onClick={handleDownloadCertificate}>
                  <FontAwesomeIcon icon={faDownload} />
                  Download PDF
                </button>
                <button className="view-btn" onClick={() => { setShowCertificateModal(false); navigate('/certificate'); }}>
                  <FontAwesomeIcon icon={faEye} />
                  View Full Certificate
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {streakToast && (
        <StreakToast
          message={streakToast.message}
          type={streakToast.type}
          onClose={() => setStreakToast(null)}
        />
      )}
    </div>
  );
}

export default Learning; 