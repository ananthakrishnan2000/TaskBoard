import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../services/authService';

const Register = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

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

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Name must be at least 2 characters';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

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
      const { confirmPassword, ...registerData } = formData;
      const response = await registerUser(registerData);
      login(response.user, response.token);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Enhanced styles with better spacing
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '40px 20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    },
    card: {
      background: 'white',
      padding: '48px 40px',
      borderRadius: '16px',
      boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '440px',
      border: '1px solid rgba(255, 255, 255, 0.2)'
    },
    title: {
      fontSize: '32px',
      fontWeight: '700',
      color: '#1a202c',
      textAlign: 'center',
      marginBottom: '12px',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      backgroundClip: 'text'
    },
    subtitle: {
      color: '#718096',
      textAlign: 'center',
      marginBottom: '40px',
      fontSize: '16px',
      lineHeight: '1.5'
    },
    form: {
      display: 'flex',
      flexDirection: 'column',
      gap: '28px' // Increased gap for better spacing
    },
    formGroup: {
      display: 'flex',
      flexDirection: 'column'
    },
    label: {
      fontWeight: '600',
      color: '#2d3748',
      marginBottom: '10px', // Increased margin
      fontSize: '14px',
      display: 'block'
    },
    input: {
      padding: '12px 16px', // Increased padding
      border: '2px solid #e2e8f0',
      borderRadius: '8px',
      fontSize: '16px',
      transition: 'all 0.3s ease',
      width: '100%',
      boxSizing: 'border-box',
      backgroundColor: '#fafafa'
    },
    inputFocus: {
      outline: 'none',
      borderColor: '#4299e1',
      backgroundColor: 'white',
      boxShadow: '0 0 0 3px rgba(66, 153, 225, 0.1)'
    },
    inputError: {
      borderColor: '#fc8181',
      backgroundColor: '#fff5f5'
    },
    errorMessage: {
      color: '#e53e3e',
      fontSize: '14px',
      marginTop: '8px', // Increased margin
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    submitError: {
      textAlign: 'center',
      padding: '16px', // Increased padding
      backgroundColor: '#fed7d7',
      border: '1px solid #feb2b2',
      borderRadius: '8px',
      color: '#c53030',
      fontSize: '14px',
      marginBottom: '8px'
    },
    button: {
      padding: '16px 24px', // Increased padding
      border: 'none',
      borderRadius: '8px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      background: 'linear-gradient(135deg, #48bb78 0%, #38a169 100%)',
      color: 'white',
      transition: 'all 0.3s ease',
      marginTop: '12px' // Added top margin
    },
    buttonHover: {
      transform: 'translateY(-1px)',
      boxShadow: '0 4px 12px rgba(72, 187, 120, 0.3)'
    },
    buttonDisabled: {
      opacity: 0.6,
      cursor: 'not-allowed',
      transform: 'none'
    },
    switch: {
      textAlign: 'center',
      marginTop: '32px', // Increased margin
      paddingTop: '28px', // Increased padding
      borderTop: '1px solid #e2e8f0'
    },
    switchText: {
      color: '#718096',
      margin: 0,
      fontSize: '15px'
    },
    link: {
      background: 'none',
      border: 'none',
      color: '#4299e1',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '15px',
      textDecoration: 'none',
      transition: 'color 0.2s ease'
    },
    linkHover: {
      color: '#3182ce',
      textDecoration: 'underline'
    },
    passwordHint: {
      fontSize: '12px',
      color: '#a0aec0',
      marginTop: '6px',
      marginBottom: '0'
    }
  };

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>
          Join TaskBoard Pro and start managing your projects efficiently
        </p>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Name Field */}
          <div style={styles.formGroup}>
            <label htmlFor="name" style={styles.label}>
              Full Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.name ? styles.inputError : {}),
                ...(!errors.name && formData.name ? { borderColor: '#48bb78' } : {})
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4299e1';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.name ? '#fc8181' : 
                  (formData.name ? '#48bb78' : '#e2e8f0');
                e.target.style.backgroundColor = errors.name ? '#fff5f5' : '#fafafa';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <span style={styles.errorMessage}>
                ⚠️ {errors.name}
              </span>
            )}
          </div>

          {/* Email Field */}
          <div style={styles.formGroup}>
            <label htmlFor="email" style={styles.label}>
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.email ? styles.inputError : {}),
                ...(!errors.email && formData.email ? { borderColor: '#48bb78' } : {})
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4299e1';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.email ? '#fc8181' : 
                  (formData.email ? '#48bb78' : '#e2e8f0');
                e.target.style.backgroundColor = errors.email ? '#fff5f5' : '#fafafa';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Enter your email address"
            />
            {errors.email && (
              <span style={styles.errorMessage}>
                ⚠️ {errors.email}
              </span>
            )}
          </div>

          {/* Password Field */}
          <div style={styles.formGroup}>
            <label htmlFor="password" style={styles.label}>
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              style={{
                ...styles.input,
                ...(errors.password ? styles.inputError : {}),
                ...(!errors.password && formData.password ? { borderColor: '#48bb78' } : {})
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4299e1';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.password ? '#fc8181' : 
                  (formData.password ? '#48bb78' : '#e2e8f0');
                e.target.style.backgroundColor = errors.password ? '#fff5f5' : '#fafafa';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Create a strong password"
            />
            {errors.password ? (
              <span style={styles.errorMessage}>
                ⚠️ {errors.password}
              </span>
            ) : (
              <p style={styles.passwordHint}>
                Must be at least 6 characters long
              </p>
            )}
          </div>

          {/* Confirm Password Field */}
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
                ...(errors.confirmPassword ? styles.inputError : {}),
                ...(!errors.confirmPassword && formData.confirmPassword ? { borderColor: '#48bb78' } : {})
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#4299e1';
                e.target.style.backgroundColor = 'white';
                e.target.style.boxShadow = '0 0 0 3px rgba(66, 153, 225, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = errors.confirmPassword ? '#fc8181' : 
                  (formData.confirmPassword ? '#48bb78' : '#e2e8f0');
                e.target.style.backgroundColor = errors.confirmPassword ? '#fff5f5' : '#fafafa';
                e.target.style.boxShadow = 'none';
              }}
              placeholder="Re-enter your password"
            />
            {errors.confirmPassword && (
              <span style={styles.errorMessage}>
                ⚠️ {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Submit Error */}
          {errors.submit && (
            <div style={styles.submitError}>
              ⚠️ {errors.submit}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit"
            style={{
              ...styles.button,
              ...(isButtonHovered && !loading ? styles.buttonHover : {}),
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
            onMouseEnter={() => setIsButtonHovered(true)}
            onMouseLeave={() => setIsButtonHovered(false)}
          >
            {loading ? (
              <span>Creating Account...</span>
            ) : (
              <span>Create Account</span>
            )}
          </button>
        </form>

        {/* Switch to Login */}
        <div style={styles.switch}>
          <p style={styles.switchText}>
            Already have an account?{' '}
            <button 
              type="button" 
              onClick={switchToLogin} 
              style={{
                ...styles.link,
                ...(isLinkHovered ? styles.linkHover : {})
              }}
              onMouseEnter={() => setIsLinkHovered(true)}
              onMouseLeave={() => setIsLinkHovered(false)}
            >
              Sign In
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;