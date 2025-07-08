import { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faClock, 
  faChartLine, 
  faBookOpen, 
  faCalendarDay, 
  faTrophy, 
  faUsers, 
  faShieldAlt, 
  faGavel, 
  faUserTie, 
  faGlobe,
  faChevronDown,
  faChevronUp
} from '@fortawesome/free-solid-svg-icons';
import './Quizzes.css';

const quizCategories = [
  {
    id: "interactive",
    title: "🎮 Interactive Quiz Types",
    description: "Dynamic quizzes with different gameplay mechanics",
    quizzes: [
      {
        icon: faClock,
        title: "⏱️ Timed Quiz",
        description: "60 seconds for 10 questions - test your speed and knowledge!",
        type: "timed"
      },
      {
        icon: faChartLine,
        title: "📈 Progressive Quiz",
        description: "Questions get harder as you advance through the quiz.",
        type: "progressive"
      },
      {
        icon: faBookOpen,
        title: "📚 Review Quiz",
        description: "Questions from your completed lessons to reinforce learning.",
        type: "review"
      }
    ]
  },
  {
    id: "gamified",
    title: "🏆 Gamified Approach",
    description: "Fun and competitive quiz experiences",
    quizzes: [
      {
        icon: faCalendarDay,
        title: "📅 Daily Challenge",
        description: "New quiz every day to keep your knowledge fresh.",
        type: "daily"
      },
      {
        icon: faTrophy,
        title: "🏆 Achievement Quizzes",
        description: "Unlock special quizzes by completing levels.",
        type: "achievement"
      },
      {
        icon: faUsers,
        title: "🥇 Competitive Quiz",
        description: "Compare your scores with other learners.",
        type: "competitive"
      }
    ]
  },
  {
    id: "topics",
    title: "📚 Topic-based Quizzes",
    description: "Specialized quizzes focused on specific areas",
    quizzes: [
      {
        icon: faShieldAlt,
        title: "🛡️ Rights & Responsibilities",
        description: "Test your knowledge of citizen rights and duties.",
        type: "rights"
      },
      {
        icon: faGavel,
        title: "⚖️ Government & Laws",
        description: "Questions about governance, laws, and legal systems.",
        type: "government"
      },
      {
        icon: faUserTie,
        title: "👤 Citizenship Quiz",
        description: "What it means to be a good citizen of Sierra Leone.",
        type: "citizenship"
      },
      {
        icon: faGlobe,
        title: "🌍 Current Affairs",
        description: "Stay updated with recent civic news and events.",
        type: "current-affairs"
      }
    ]
  }
];

function Quizzes() {
  const [expandedSections, setExpandedSections] = useState({
    interactive: false,
    gamified: false,
    topics: false
  });

  const toggleSection = (sectionId) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const handleQuizClick = (quizType) => {
    // TODO: Implement quiz logic based on type
    console.log(`Starting quiz: ${quizType}`);
    alert(`Starting ${quizType} quiz! (Feature coming soon)`);
  };

  return (
    <div className="quizzes">
      <div className="quizzes-container">
        <div className="quizzes-header">
          <h1>Quizzes</h1>
          <p>Choose your quiz type and test your civic knowledge</p>
        </div>
        
        <div className="quiz-categories">
          {quizCategories.map((category) => (
            <div key={category.id} className="quiz-category">
              <div 
                className="category-header"
                onClick={() => toggleSection(category.id)}
              >
                <div className="category-info">
                  <h2 className="category-title">{category.title}</h2>
                  <p className="category-description">{category.description}</p>
                </div>
                <FontAwesomeIcon 
                  icon={expandedSections[category.id] ? faChevronUp : faChevronDown} 
                  className="expand-icon"
                />
              </div>
              
              {expandedSections[category.id] && (
                <div className="quiz-grid">
                  {category.quizzes.map((quiz, quizIndex) => (
                    <div 
                      key={quizIndex} 
                      className="quiz-card"
                      onClick={() => handleQuizClick(quiz.type)}
                    >
                      <FontAwesomeIcon icon={quiz.icon} className="quiz-icon" />
                      <h3>{quiz.title}</h3>
                      <p>{quiz.description}</p>
                      <button className="start-quiz-btn">Start Quiz</button>
                    </div>
                  ))}
                </div>
              )}
          </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Quizzes; 