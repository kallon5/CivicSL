import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBook } from '@fortawesome/free-solid-svg-icons';

function Resource() {
  return (
    <div className="resource">
      <div className="resource-container">
        <div className="resource-header">
          <h1>Resources</h1>
          <p>Additional study materials and references</p>
        </div>
        <div className="resource-content">
          <div className="resource-card">
            <FontAwesomeIcon icon={faBook} className="resource-icon" />
            <h3>Coming Soon</h3>
            <p>Resource library features are being developed. Check back soon!</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resource; 