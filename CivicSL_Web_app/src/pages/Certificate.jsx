import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCertificate, faDownload } from '@fortawesome/free-solid-svg-icons';
import { useAuth } from '../contexts/AuthContext';
import { useEffect, useState } from 'react';
import { UserProgressService } from '../services/userProgressService';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import './Certificate.css';
import { useNavigate } from 'react-router-dom';

function Certificate() {
  const { currentUser } = useAuth();
  const [userProgress, setUserProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [level5Passed, setLevel5Passed] = useState(false);
  const [level5Reflection, setLevel5Reflection] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProgress = async () => {
      if (!currentUser) return;
      setLoading(true);
      const progress = await UserProgressService.getUserProgress(currentUser.uid, currentUser.displayName);
      setUserProgress(progress);
      setLevel5Reflection(progress.level5Reflection || '');
      // Assume level 5 is index 4
      setLevel5Passed(progress.progress && progress.progress[4] === 100);
      setLoading(false);
    };
    fetchProgress();
  }, [currentUser]);

  const handleDownloadCertificate = async () => {
    const certElem = document.getElementById('certificate-full');
    if (!certElem) return;
    const canvas = await html2canvas(certElem);
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({ orientation: 'landscape' });
    const width = pdf.internal.pageSize.getWidth();
    const height = pdf.internal.pageSize.getHeight();
    pdf.addImage(imgData, 'PNG', 0, 0, width, height);
    pdf.save('CivicSL_Certificate.pdf');
  };

  const eligible = userProgress && userProgress.progress && userProgress.progress.slice(0, 4).every(p => p === 100) && level5Passed;

  if (loading) return (
    <div className="certificate">
      <div className="certificate-container">
        <div className="loading-spinner">
          <FontAwesomeIcon icon={faCertificate} spin />
          <p>Loading your certificate...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="certificate">
      <div className="certificate-container">
        <div className="certificate-header-row">
          <div className="certificate-header-text">
            <h1 className="certificate-title">Certificate</h1>
            <p className="certificate-subtitle">View and download your earned certificate</p>
          </div>
          <button
            className="certificate-close-btn"
            onClick={() => navigate('/dashboard')}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        <div className="certificate-main-content">
          {eligible ? (
            <>
              <div id="certificate-full" className="coursera-certificate">
                {/* Optional: Add your logo here */}
                {/* <img src="/logo192.png" alt="Logo" className="cert-logo" /> */}
                <div className="cert-title">Certificate of Completion</div>
                <div className="cert-statement">This is to certify that</div>
                <div className="cert-name">{currentUser?.displayName || currentUser?.email || 'Your Name'}</div>
                <div className="cert-course">Civic Education Program</div>
                <div className="cert-desc">
                  has successfully completed the comprehensive CivicSL learning program, demonstrating proficiency in civic knowledge, rights, responsibilities, and community engagement.
                </div>
                <div className="cert-footer">
                  <div className="cert-date">
                    <div>Date of Completion</div>
                    <div>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
                  </div>
                  <div className="cert-signature">
                    <div className="sig-line"></div>
                    <div className="sig-label">Program Director</div>
                  </div>
                </div>
              </div>
              <div className="certificate-actions">
                <button className="download-btn" onClick={handleDownloadCertificate}>
                  <FontAwesomeIcon icon={faDownload} /> Download
                </button>
              </div>
            </>
          ) : (
            <div className="certificate-card locked">
            <FontAwesomeIcon icon={faCertificate} className="certificate-icon" />
              <h3>Keep Learning!</h3>
              <p>Complete all levels and pass the final assessment to unlock your certificate.</p>
          </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Certificate; 