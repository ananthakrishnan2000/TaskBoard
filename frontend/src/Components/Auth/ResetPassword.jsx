import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword } from '../../services/passwordService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      await resetPassword(token, formData.password);
      setMessage('Password reset successfully! You can now login with your new password.');
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setErrors({ submit: err.message });
    } finally {
      setLoading(false);
    }
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
      fontSize: '16px'
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
    inputError: {
      borderColor: '#ef4444'
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
      background: 'linear-gradient(135deg, #065f46 0%, #047857 100%)',
      color: 'white',
      transition: 'all 0.3s ease',
      marginTop: '12px',
      boxShadow: '0 4px 15px rgba(6, 95, 70, 0.3)'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.backgroundEffect}></div>
      
      <div style={styles.card}>
        <h2 style={styles.title}>Set New Password</h2>
        <p style={styles.subtitle}>
          Enter your new password below.
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              New Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {})
              }}
              placeholder="Enter new password"
              disabled={loading}
            />
            {errors.password && <span style={styles.errorMessage}>{errors.password}</span>}
          </div>

          <div style={styles.formGroup}>
            <label htmlFor="confirmPassword" style={styles.label}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.confirmPassword ? styles.inputError : {})
              }}
              placeholder="Confirm new password"
              disabled={loading}
            />
            {errors.confirmPassword && <span style={styles.errorMessage}>{errors.confirmPassword}</span>}
          </div>

          {errors.submit && (
            <div style={styles.errorMessage}>{errors.submit}</div>
          )}

          {message && (
            <div style={styles.successMessage}>
              {message}
              <br />
              <small>Redirecting to login...</small>
            </div>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading || message}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;