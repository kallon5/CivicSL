import { useState, useEffect, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faTimes, 
  faCheck, 
  faTimes as faX,
  faArrowLeft,
  faArrowRight,
  faTrophy
} from '@fortawesome/free-solid-svg-icons';
import './QuizModal.css';

function QuizModal({ isOpen, onClose, quiz, levelTitle, onComplete, onReflectionSubmit, timeLimitSeconds = null, isAssessment = false }) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [answers, setAnswers] = useState({});
  const [textAnswers, setTextAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [score, setScore] = useState(0);
  const [timer, setTimer] = useState(timeLimitSeconds);
  const timerRef = useRef();

  useEffect(() => {
    if (!isOpen || !timeLimitSeconds) return;
    setTimer(timeLimitSeconds);
    timerRef.current = setInterval(() => {
      setTimer(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleAutoSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
    // eslint-disable-next-line
  }, [isOpen, timeLimitSeconds]);

  if (!isOpen || !quiz) return null;

  const handleAnswerSelect = (answerIndex) => {
    setSelectedAnswer(answerIndex);
    setAnswers(prev => ({
      ...prev,
      [currentQuestion]: answerIndex
    }));
  };

  const handleTextChange = (e) => {
    setTextAnswers(prev => ({ ...prev, [currentQuestion]: e.target.value }));
  };

  const handleNext = () => {
    setCurrentQuestion(q => {
      const nextQ = q + 1;
      setSelectedAnswer(answers[nextQ] || null);
      return nextQ;
    });
  };

  const handlePrevious = () => {
    setCurrentQuestion(q => {
      const prevQ = q - 1;
      setSelectedAnswer(answers[prevQ] || null);
      return prevQ;
    });
  };

  const handleRetake = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setAnswers({});
    setTextAnswers({});
    setShowResults(false);
    setScore(0);
    setTimer(timeLimitSeconds);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleAutoSubmit = () => {
    if (!showResults) {
      handleFinish();
    }
  };

  const handleFinish = () => {
    // Calculate score (exclude text questions)
    let correctAnswers = 0;
    let totalMCQ = 0;
    quiz.questions.forEach((question, index) => {
      if (question.type === 'text') return;
      totalMCQ++;
      // Check for both 'answer' and 'correct' properties for compatibility
      const correctAnswer = question.correct !== undefined ? question.correct : question.answer;
      if (answers[index] === correctAnswer) {
        correctAnswers++;
      }
    });
    const finalScore = totalMCQ > 0 ? Math.round((correctAnswers / totalMCQ) * 100) : 0;
    setScore(finalScore);
    setShowResults(true);
    // Save reflection if present
    const reflectionQ = quiz.questions.find(q => q.type === 'text');
    if (reflectionQ && onReflectionSubmit) {
      const idx = quiz.questions.findIndex(q => q.type === 'text');
      onReflectionSubmit(textAnswers[idx] || '');
    }
  };

  const handleComplete = () => {
    console.log('QuizModal handleComplete called', { isAssessment, score, answers });
    if (onComplete) {
      // For assessment, pass correctAnswers and totalMCQ for XP
      if (isAssessment) {
        let correctAnswers = 0;
        let totalMCQ = 0;
        quiz.questions.forEach((question, index) => {
          if (question.type === 'text') return;
          totalMCQ++;
          // Check for both 'answer' and 'correct' properties for compatibility
          const correctAnswer = question.correct !== undefined ? question.correct : question.answer;
          if (answers[index] === correctAnswer) {
            correctAnswers++;
          }
        });
        console.log('Assessment results:', { score, correctAnswers, totalMCQ });
        onComplete(score, correctAnswers, totalMCQ);
      } else {
        onComplete(score);
      }
    }
    onClose();
  };

  const currentQ = quiz.questions[currentQuestion];
  const progress = ((currentQuestion + 1) / quiz.questions.length) * 100;
  const minutes = Math.floor((timer || 0) / 60);
  const seconds = (timer || 0) % 60;

  return (
    <div className="quiz-modal-overlay">
      <div className="quiz-modal">
        <div className="quiz-header">
          <div className="quiz-title">
            <h2>{levelTitle} Quiz</h2>
            <p>Question {currentQuestion + 1} of {quiz.questions.length}</p>
          </div>
          <button className="close-btn" onClick={onClose}>
            <FontAwesomeIcon icon={faTimes} />
          </button>
        </div>

        <div className="quiz-progress">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <span>{Math.round(progress)}%</span>
          {timeLimitSeconds && (
            <span className="quiz-timer">⏰ {minutes}:{seconds.toString().padStart(2, '0')}</span>
          )}
        </div>

        {!showResults ? (
          <div className="quiz-content">
            <div className="question-section">
              <h3>{currentQ.question}</h3>
              {currentQ.type === 'text' ? (
                <textarea
                  className="reflection-textarea"
                  value={textAnswers[currentQuestion] || ''}
                  onChange={handleTextChange}
                  placeholder="Write your answer here..."
                  rows={5}
                  required={!!currentQ.required}
                  style={{ width: '100%', marginTop: 12 }}
                />
              ) : (
                <div className="options-list">
                  {currentQ.options.map((option, index) => (
                    <button
                      key={index}
                      className={`option-btn ${selectedAnswer === index ? 'selected' : ''}`}
                      onClick={() => handleAnswerSelect(index)}
                    >
                      <span className="option-letter">
                        {String.fromCharCode(65 + index)}
                      </span>
                      <span className="option-text">{option}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="quiz-navigation">
              <button 
                className="nav-btn prev-btn"
                onClick={handlePrevious}
                disabled={currentQuestion === 0}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
                Previous
              </button>
              <button 
                className="nav-btn next-btn"
                onClick={currentQuestion === quiz.questions.length - 1 ? handleFinish : handleNext}
                disabled={currentQ.type === 'text' ? !(textAnswers[currentQuestion] && textAnswers[currentQuestion].trim()) : selectedAnswer === null}
              >
                {currentQuestion === quiz.questions.length - 1 ? 'Finish' : 'Next'}
                <FontAwesomeIcon icon={faArrowRight} />
              </button>
            </div>
          </div>
        ) : (
          <div className="quiz-results">
            <div className="results-header">
              <FontAwesomeIcon icon={faTrophy} className="trophy-icon" />
              <h3>Quiz Complete!</h3>
              <div className="score-display">
                <span className="score-number">{score}%</span>
                <span className="score-label">Your Score</span>
              </div>
            </div>

            <div className="score-message">
              {score >= 80 ? (
                <p className="excellent">Excellent! You've mastered this level!</p>
              ) : score >= 60 ? (
                <p className="good">Good job! You have a solid understanding.</p>
              ) : (
                <p className="needs-improvement">Keep studying! Review the material and try again.</p>
              )}
            </div>

            <div className="results-actions">
              <button className="action-btn retake-btn" onClick={handleRetake}>
                Retake Quiz
              </button>
              <button className="action-btn complete-btn" onClick={handleComplete}>
                {isAssessment ? 'Finish' : 'Continue Learning'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default QuizModal; 