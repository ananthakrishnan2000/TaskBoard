import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { resetPassword, validateResetToken } from '../../services/passwordService';

const ResetPassword = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [tokenLoading, setTokenLoading] = useState(true);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState('');
  const [isTokenValid, setIsTokenValid] = useState(false);

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        await validateResetToken(token);
        setIsTokenValid(true);
      } catch (err) {
        setErrors({ submit: 'Invalid or expired reset token. Please request a new password reset.' });
      } finally {
        setTokenLoading(false);
      }
    };

    if (token) {
      validateToken();
    } else {
      setErrors({ submit: 'No reset token provided.' });
      setTokenLoading(false);
    }
  }, [token]);

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
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      newErrors.password = 'Password must contain at least one uppercase letter, one lowercase letter, and one number';
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
      
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      console.error('Reset password error:', err);
      
      // More specific error messages
      if (err.message.includes('Invalid token') || err.message.includes('expired')) {
        setErrors({ submit: 'Reset token is invalid or has expired. Please request a new password reset.' });
      } else if (err.message.includes('Network Error')) {
        setErrors({ submit: 'Network error. Please check your connection and try again.' });
      } else {
        setErrors({ submit: err.message || 'Failed to reset password. Please try again.' });
      }
    } finally {
      setLoading(false);
    }
  };

  // Show loading while validating token
  if (tokenLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundEffect}></div>
        <div style={styles.card}>
          <h2 style={styles.title}>Validating Reset Link...</h2>
          <p style={styles.subtitle}>Please wait while we verify your reset link.</p>
        </div>
      </div>
    );
  }

  // Show error if token is invalid
  if (!isTokenValid && !tokenLoading) {
    return (
      <div style={styles.container}>
        <div style={styles.backgroundEffect}></div>
        <div style={styles.card}>
          <h2 style={styles.title}>Invalid Reset Link</h2>
          <p style={styles.subtitle}>
            {errors.submit || 'This password reset link is invalid or has expired.'}
          </p>
          <button 
            onClick={() => navigate('/forgot-password')}
            style={styles.button}
          >
            Request New Reset Link
          </button>
        </div>
      </div>
    );
  }

  // Your existing styles object remains the same...
  const styles = {
    // ... (keep all your existing styles)
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
              placeholder="Enter new password (min 6 characters)"
              disabled={loading}
            />
            {errors.password && (
              <span style={styles.errorMessage}>{errors.password}</span>
            )}
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
            {errors.confirmPassword && (
              <span style={styles.errorMessage}>{errors.confirmPassword}</span>
            )}
          </div>

          {errors.submit && (
            <div style={{...styles.errorMessage, textAlign: 'center', padding: '12px'}}>
              {errors.submit}
            </div>
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