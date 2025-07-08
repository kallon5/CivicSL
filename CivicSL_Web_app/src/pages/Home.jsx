import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faStar, 
  faTrophy, 
  faRocket, 
  faPlay, 
  faInfoCircle,
  faLayerGroup,
  faGamepad,
  faCertificate,
  faCheckCircle,
  faQuoteLeft,
  faUser,
  faGraduationCap
} from '@fortawesome/free-solid-svg-icons';
import { faFacebookF, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import heroImage from '../assets/images/WhatsApp Image 2025-06-13 at 08.18.18_83fe59bd.jpg';
import './Home.css';

function Home() {
  return (
    <div className="home">
      <main>
        <section className="hero">
          <div className="hero-image">
            <div className="image-container">
              <img
                src={heroImage}
                alt="joyful teens"
                className="hero-img"
              />
              <div className="floating-card card-1">
                <FontAwesomeIcon icon={faStar} />
                <span>Interactive Learning</span>
              </div>
              <div className="floating-card card-2">
                <FontAwesomeIcon icon={faTrophy} />
                <span>Earn Certificates</span>
              </div>
            </div>
          </div>
          <div className="hero-info">
            <div className="hero-badge">
              <FontAwesomeIcon icon={faRocket} />
              <span>Empowering Youth Through Education</span>
            </div>
            <h1 className="hero-title">
              <span className="title-line">LEARN CIVIC</span>
              <span className="title-line">EDUCATION</span>
            </h1>
            <div className="hero-desc">
              A fun and interactive way for teens and youth to understand civic responsibilities
              and rights through gamified learning experiences.
            </div>
            <div className="hero-stats">
              <div className="stat">
                <span className="stat-number">500+</span>
                <span className="stat-label">Students</span>
              </div>
              <div className="stat">
                <span className="stat-number">4</span>
                <span className="stat-label">Levels</span>
              </div>
              <div className="stat">
                <span className="stat-number">100%</span>
                <span className="stat-label">Free</span>
              </div>
            </div>
            <div className="hero-cta">
              <Link to="/login" className="btn get-started">
                <FontAwesomeIcon icon={faPlay} />
                Start Learning Now
              </Link>
              <a href="#features" className="btn learn-more">
                <FontAwesomeIcon icon={faInfoCircle} />
                Learn More
              </a>
            </div>
          </div>
        </section>

        <section className="features" id="features">
          <div className="section-header">
            <h2>Why Choose CivicSL?</h2>
            <p>Discover the features that make learning civic education engaging and effective</p>
          </div>
          <div className="features-list">
            <div className="feature">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faLayerGroup} />
              </div>
              <h3>Structured Learning</h3>
              <p>
                Our platform offers a carefully designed learning path that guides you
                through essential civic education concepts step by step.
              </p>
              <div className="feature-highlight">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Progressive difficulty levels</span>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faGamepad} />
              </div>
              <h3>Interactive Quizzes</h3>
              <p>
                Test your knowledge with engaging quizzes and challenges that make learning
                fun and help you retain information better.
              </p>
              <div className="feature-highlight">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Real-time feedback</span>
              </div>
            </div>
            <div className="feature">
              <div className="feature-icon">
                <FontAwesomeIcon icon={faCertificate} />
              </div>
              <h3>E-Certificate</h3>
              <p>
                Earn a digital certificate upon completion, showcasing your understanding
                of civic education to schools and organizations.
              </p>
              <div className="feature-highlight">
                <FontAwesomeIcon icon={faCheckCircle} />
                <span>Verifiable credentials</span>
              </div>
            </div>
          </div>
        </section>

        <section className="testimonials">
          <div className="section-header">
            <h2>What Students Say</h2>
            <p>Join hundreds of satisfied learners</p>
          </div>
          <div className="testimonials-grid">
            <div className="testimonial">
              <div className="testimonial-content">
                <FontAwesomeIcon icon={faQuoteLeft} />
                <p>"CivicSL made learning about civic responsibilities so much fun! The interactive quizzes really helped me understand the concepts."</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="author-info">
                  <h4>Sarah Johnson</h4>
                  <span>Grade 11 Student</span>
                </div>
              </div>
            </div>
            <div className="testimonial">
              <div className="testimonial-content">
                <FontAwesomeIcon icon={faQuoteLeft} />
                <p>"The structured learning approach and certificates gave me confidence in my civic knowledge. Highly recommended!"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <FontAwesomeIcon icon={faUser} />
                </div>
                <div className="author-info">
                  <h4>Michael Chen</h4>
                  <span>Grade 12 Student</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer>
        <div className="footer-container">
          <div className="footer-content">
            <div className="footer-section">
              <h3>
                <FontAwesomeIcon icon={faGraduationCap} /> CivicSL
              </h3>
              <p>Empowering youth through interactive civic education.</p>
              <div className="social-links">
                <a href="#"><FontAwesomeIcon icon={faFacebookF} /></a>
                <a href="#"><FontAwesomeIcon icon={faTwitter} /></a>
                <a href="#"><FontAwesomeIcon icon={faInstagram} /></a>
              </div>
            </div>
            <div className="footer-section">
              <h4>Quick Links</h4>
              <ul>
                <li><Link to="/login">Login</Link></li>
                <li><Link to="/signup">Sign Up</Link></li>
                <li><Link to="/learning">Learning</Link></li>
                <li><Link to="/quizzes">Quizzes</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Resources</h4>
              <ul>
                <li><Link to="/resource">Study Materials</Link></li>
                <li><Link to="/discuss">Discussion Forum</Link></li>
                <li><Link to="/leaderboard">Leaderboard</Link></li>
                <li><Link to="/certificate">Certificates</Link></li>
              </ul>
            </div>
            <div className="footer-section">
              <h4>Contact</h4>
              <p>Email: info@civicsl.com</p>
              <p>Phone: +1 (555) 123-4567</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2024 CivicSL. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home; 