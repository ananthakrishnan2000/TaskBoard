import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './FloatingLoginButton.css';

const FloatingLoginButton = () => {
  const navigate = useNavigate();
  const [isExpanded, setIsExpanded] = useState(false);

  const handleMainClick = () => {
    if (isExpanded) {
      navigate('/login');
    } else {
      setIsExpanded(true);
      // Auto-collapse after 3 seconds
      setTimeout(() => setIsExpanded(false), 3000);
    }
  };

  return (
    <div className="floating-login-container">
      {/* Expanded Options */}
      {isExpanded && (
        <div className="floating-options">
          <button 
            onClick={() => navigate('/login')}
            className="floating-option-btn"
          >
            🔑 Login
          </button>
          <button 
            onClick={() => navigate('/register')}
            className="floating-option-btn"
          >
            📝 Register
          </button>
          <button 
            onClick={() => navigate('/demo')}
            className="floating-option-btn"
          >
            🚀 Demo
          </button>
        </div>
      )}
      
      {/* Main Floating Button */}
      <button 
        onClick={handleMainClick}
        className={`floating-main-btn ${isExpanded ? 'expanded' : ''}`}
        title="Quick Access"
      >
        {isExpanded ? '✕' : '⚡'}
      </button>
    </div>
  );
};

export default FloatingLoginButton;