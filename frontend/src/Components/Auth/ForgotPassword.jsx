import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'
import { forgotPassword } from '../../services/passwordService';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await forgotPassword(email);
      setMessage('Password reset email sent! Check your inbox for further instructions.');
      setEmail('');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBackToLogin = () => {
    navigate('/login');
  };

  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #1e3a8a 50%, #065f46 50%, #065f46 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
      position: 'relative',
      overflow: 'hidden'
    },
    backgroundEffect: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      background: `
        radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 80% 20%, rgba(16, 185, 129, 0.1) 0%, transparent 50%),
        radial-gradient(circle at 40% 40%, rgba(99, 102, 241, 0.05) 0%, transparent 50%),
        radial-gradient(circle at 60% 60%, rgba(34, 197, 94, 0.05) 0%, transparent 50%)
      `,
      zIndex: 0
    },
    card: {
      background: 'rgba(255, 255, 255, 0.95)',
      padding: '48px 40px',
      borderRadius: '20px',
      boxShadow: `
        0 20px 40px rgba(0, 0, 0, 0.1),
        0 0 0 1px rgba(255, 255, 255, 0.2)
      `,
      width: '100%',
      maxWidth: '440px',
      backdropFilter: 'blur(10px)',
      border: '1px solid rgba(255, 255, 255, 0.3)',
      position: 'relative',
      zIndex: 1
    },
    title: {
      fontSize: '28px',
      fontWeight: '700',
      color: '#1f2937',
      textAlign: 'center',
      marginBottom: '8px'
    },
    subtitle: {
      color: '#6b7280',
      textAlign: 'center',
      marginBottom: '32px',
      fontSize: '16px',
      lineHeight: '1.5'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '20px'
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontWeight: '600',
      color: '#374151',
      marginBottom: '8px',
      fontSize: '14px'
    },
    input: {
      padding: '14px 16px',
      border: '1px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: 'rgba(255, 255, 255, 0.8)',
      backdropFilter: 'blur(5px)'
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '14px',
      marginTop: '8px'
    },
    successMessage: {
      color: '#065f46',
      fontSize: '14px',
      marginTop: '8px',
      backgroundColor: '#d1fae5',
      padding: '12px',
      borderRadius: '8px',
      border: '1px solid #a7f3d0',
      textAlign: 'center'
    },
    button: {
      padding: '16px 24px',
      border: 'none',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      background: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      color: 'white',
      transition: 'all 0.3s ease',
      marginTop: '12px',
      boxShadow: '0 4px 15px rgba(30, 58, 138, 0.3)'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    },
    switch: {
      textAlign: 'center',
      marginTop: '24px',
      paddingTop: '24px',
      borderTop: '1px solid #e5e7eb'
    },
    link: {
      background: 'none',
      border: 'none',
      color: '#3b82f6',
      cursor: 'pointer',
      fontWeight: '600',
      textDecoration: 'underline'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundEffect}></div>
      
      <div style={styles.card}>
        <h2 style={styles.title}>Reset Your Password</h2>
        <p style={styles.subtitle}>
          Enter your email address and we'll send you a link to reset your password.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={styles.input}
              placeholder="Enter your email address"
              disabled={loading}
            />
            {error && <span style={styles.errorMessage}>{error}</span>}
            {message && <div style={styles.successMessage}>{message}</div>}
          </div>

          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div style={styles.switch}>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Remember your password?{' '}
            <button 
              type="button" 
              onClick={handleBackToLogin} 
              style={styles.link}
            >
              Back to Login
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;