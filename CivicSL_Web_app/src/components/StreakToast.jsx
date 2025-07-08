import React from 'react';
import './StreakToast.css';

export default function StreakToast({ message, type, onClose }) {
  return (
    <div className={`streak-toast ${type}`}>
      <span>{message}</span>
      <button className="close-btn" onClick={onClose}>×</button>
    </div>
  );
} 