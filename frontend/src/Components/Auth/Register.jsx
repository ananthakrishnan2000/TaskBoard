import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { registerUser } from '../../services/authService';
import { useNavigate, Link } from 'react-router-dom';

const Register = ({ switchToLogin }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);
  const { login } = useAuth();

  // Email domain validation function
  const isValidEmailDomain = (email) => {
    const emailDomain = email.split('@')[1]?.toLowerCase();
    
    if (!emailDomain) return false;

    // List of popular legitimate email providers
    const allowedDomains = [
      // Google
      'gmail.com', 'google.com', 'googlemail.com',
      // Microsoft
      'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
      // Yahoo
      'yahoo.com', 'yahoo.co.in', 'yahoo.co.uk', 'ymail.com',
      // Apple
      'icloud.com', 'me.com', 'mac.com',
      // Professional
      'protonmail.com', 'proton.me', 'zoho.com', 'aol.com', 'gmx.com',
      // Educational (common patterns)
      'edu', 'ac.in', 'edu.in'
    ];

    // Allow educational domains (contains .edu)
    if (emailDomain.includes('.edu')) {
      return true;
    }

    // Allow specific country domains with common providers
    const baseDomain = emailDomain.split('.').slice(-2).join('.');
    
    return allowedDomains.includes(emailDomain) || allowedDomains.includes(baseDomain);
  };

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
    } else if (!isValidEmailDomain(formData.email)) {
      newErrors.email = 'Please use a valid email provider (Gmail, Yahoo, Outlook, iCloud, etc.)';
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
      
      // Set registration success
      setRegistrationSuccess(true);
      setErrors({ success: 'Account created successfully!' });
      
      // Clear form
      setFormData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  const handleProceedToLogin = () => {
    // Use the prop if available, otherwise use navigate
    if (switchToLogin && typeof switchToLogin === 'function') {
      switchToLogin();
    } else {
      navigate('/login');
    }
  };

  const handleSignInClick = () => {
    // Use the prop if available, otherwise use navigate
    if (switchToLogin && typeof switchToLogin === 'function') {
      switchToLogin();
    } else {
      navigate('/login');
    }
  };

  // Enhanced styles with better spacing

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
  // Add these new styles for the background effect
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
    fontSize: '32px',
    fontWeight: '700',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: '12px',
    background: 'linear-gradient(135deg, #1e3a8a 0%, #065f46 100%)',
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
    gap: '28px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column'
  },
  label: {
    fontWeight: '600',
    color: '#2d3748',
    marginBottom: '10px',
    fontSize: '14px',
    display: 'block'
  },
  input: {
    padding: '14px 16px',
    border: '2px solid #e2e8f0',
    borderRadius: '12px',
    fontSize: '16px',
    transition: 'all 0.3s ease',
    width: '100%',
    boxSizing: 'border-box',
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    backdropFilter: 'blur(5px)'
  },
  inputFocus: {
    outline: 'none',
    borderColor: '#3b82f6',
    backgroundColor: 'white',
    boxShadow: '0 0 0 3px rgba(59, 130, 246, 0.1)'
  },
  inputError: {
    borderColor: '#ef4444',
    backgroundColor: 'rgba(254, 226, 226, 0.5)'
  },
  errorMessage: {
    color: '#ef4444',
    fontSize: '14px',
    marginTop: '8px',
    display: 'flex',
    alignItems: 'center',
    gap: '6px'
  },
  successMessage: {
    textAlign: 'center',
    padding: '20px',
    backgroundColor: 'rgba(209, 250, 229, 0.8)',
    border: '1px solid #a7f3d0',
    borderRadius: '12px',
    color: '#065f46',
    marginBottom: '20px',
    backdropFilter: 'blur(5px)'
  },
  submitError: {
    textAlign: 'center',
    padding: '16px',
    backgroundColor: 'rgba(254, 215, 215, 0.8)',
    border: '1px solid #feb2b2',
    borderRadius: '12px',
    color: '#c53030',
    fontSize: '14px',
    marginBottom: '8px',
    backdropFilter: 'blur(5px)'
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
  loginButton: {
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
  buttonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(6, 95, 70, 0.4)'
  },
  loginButtonHover: {
    transform: 'translateY(-2px)',
    boxShadow: '0 8px 25px rgba(30, 58, 138, 0.4)'
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
    transform: 'none',
    boxShadow: 'none'
  },
  switch: {
    textAlign: 'center',
    marginTop: '32px',
    paddingTop: '28px',
    borderTop: '1px solid rgba(226, 232, 240, 0.5)'
  },
  switchText: {
    color: '#718096',
    margin: 0,
    fontSize: '15px'
  },
  link: {
    background: 'none',
    border: 'none',
    color: '#3b82f6',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '15px',
    textDecoration: 'none',
    transition: 'color 0.2s ease'
  },
  linkHover: {
    color: '#1e3a8a',
    textDecoration: 'underline'
  },
  passwordHint: {
    fontSize: '12px',
    color: '#a0aec0',
    marginTop: '6px',
    marginBottom: '0'
  },
  emailHint: {
    fontSize: '12px',
    color: '#a0aec0',
    marginTop: '6px',
    marginBottom: '0'
  }
};

  const [isButtonHovered, setIsButtonHovered] = useState(false);
  const [isLoginButtonHovered, setIsLoginButtonHovered] = useState(false);
  const [isLinkHovered, setIsLinkHovered] = useState(false);

  return (
    <div style={styles.container}>
      <div style={styles.backgroundEffect}></div>
      <div style={styles.card}>
        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>
          Join TaskBoard Pro and start managing your projects efficiently
        </p>

        {/* Success Message */}
        {registrationSuccess && (
          <div style={styles.successMessage}>
            <h3 style={{ margin: '0 0 10px 0', color: '#065f46' }}>🎉 Registration Successful!</h3>
            <p style={{ margin: '0', color: '#047857' }}>
              Your account has been created successfully. You can now login to access your dashboard.
            </p>
          </div>
        )}

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
              disabled={registrationSuccess}
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
              disabled={registrationSuccess}
            />
            {errors.email ? (
              <span style={styles.errorMessage}>
                ⚠️ {errors.email}
              </span>
            ) : (
              <p style={styles.emailHint}>
                We accept Gmail, Yahoo, Outlook, iCloud, and educational emails
              </p>
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
              disabled={registrationSuccess}
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
              disabled={registrationSuccess}
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

          {/* Submit Button or Proceed to Login */}
          {!registrationSuccess ? (
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
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          ) : (
            <button 
              type="button"
              style={{
                ...styles.loginButton,
                ...(isLoginButtonHovered ? styles.loginButtonHover : {})
              }}
              onClick={handleProceedToLogin}
              onMouseEnter={() => setIsLoginButtonHovered(true)}
              onMouseLeave={() => setIsLoginButtonHovered(false)}
            >
              Proceed to Login
            </button>
          )}
        </form>

        {/* Switch to Login (only show if not successful) */}
        {!registrationSuccess && (
          <div style={styles.switch}>
            <p style={styles.switchText}>
              Already have an account?{' '}
              <button 
                type="button" 
                onClick={handleSignInClick} 
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
        )}
      </div>
    </div>
  );
};

export default Register;