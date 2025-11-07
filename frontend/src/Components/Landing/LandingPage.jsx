import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Organize Your Work with 
            <span className="brand-highlight"> TaskBoard Pro</span>
          </h1>
          <p className="hero-subtitle">
            Simple, intuitive task management for teams and individuals. 
            Plan, track, and collaborate effortlessly.
          </p>
          
          <div className="cta-buttons">
            <button 
              onClick={() => navigate('/register')}
              className="btn-primary btn-large"
            >
              Get Started Free
            </button>
            <button 
              onClick={() => navigate('/login')}
              className="btn-secondary btn-large"
            >
              Login to Your Account
            </button>
          </div>

          {/* Quick Demo Access */}
          <div className="demo-access">
            <p>Want to explore first?</p>
            <button 
              onClick={() => navigate('/demo')}
              className="btn-demo"
            >
              🚀 Try Demo Version
            </button>
          </div>
        </div>
        
        <div className="hero-visual">
          {/* Add your hero image or illustration here */}
          <div className="hero-placeholder">
            📊 TaskBoard Preview
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2>Why Choose TaskBoard Pro?</h2>
        <div className="features-grid">
          <div className="feature-card">
            <div className="feature-icon">✅</div>
            <h3>Easy Task Management</h3>
            <p>Create, organize, and track tasks with intuitive drag-and-drop interface</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">👥</div>
            <h3>Team Collaboration</h3>
            <p>Work together with your team in real-time on projects and tasks</p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📈</div>
            <h3>Progress Tracking</h3>
            <p>Monitor project progress with visual charts and status updates</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;