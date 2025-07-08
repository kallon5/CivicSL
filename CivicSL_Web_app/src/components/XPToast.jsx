import { useEffect } from 'react';

export default function XPToast({ xp, reason, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 2000);
    return () => clearTimeout(timer);
  }, [onClose]);

  if (!xp) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 24,
      right: 24,
      zIndex: 9999,
      background: 'linear-gradient(135deg, #ffd700 0%, #ffed4e 100%)',
      color: '#333',
      padding: '1rem 2rem',
      borderRadius: 12,
      boxShadow: '0 4px 20px rgba(102, 126, 234, 0.15)',
      fontWeight: 700,
      fontSize: '1.2rem',
      display: 'flex',
      alignItems: 'center',
      gap: 12,
      animation: 'xp-toast-fadein 0.3s',
    }}>
      <span role="img" aria-label="xp">🏆</span>
      <span>+{xp} XP</span>
      {reason && <span style={{ fontWeight: 400, fontSize: '1rem', marginLeft: 8 }}>{reason}</span>}
    </div>
  );
} 