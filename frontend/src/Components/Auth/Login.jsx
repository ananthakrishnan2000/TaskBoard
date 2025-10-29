import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { loginUser } from '../../services/authService';

const Login = ({ switchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
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

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
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
      const response = await loginUser(formData);
      login(response.user, response.token);
    } catch (error) {
      setErrors({ submit: error.message });
    } finally {
      setLoading(false);
    }
  };

  // Inline styles instead of CSS file
  const styles = {
    container: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    },
    card: {
      background: 'white',
      padding: '40px',
      borderRadius: '12px',
      boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)',
      width: '100%',
      maxWidth: '400px'
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
      padding: '12px 16px',
      border: '2px solid #e5e7eb',
      borderRadius: '6px',
      fontSize: '16px',
      transition: 'all 0.3s ease'
    },
    inputError: {
      borderColor: '#ef4444'
    },
    errorMessage: {
      color: '#ef4444',
      fontSize: '14px',
      marginTop: '4px'
    },
    submitError: {
      textAlign: 'center',
      padding: '12px',
      backgroundColor: '#fef2f2',
      border: '1px solid #fecaca',
      borderRadius: '6px',
      color: '#ef4444'
    },
    button: {
      padding: '12px 24px',
      border: 'none',
      borderRadius: '6px',
      fontSize: '16px',
      fontWeight: '600',
      cursor: 'pointer',
      width: '100%',
      backgroundColor: '#3b82f6',
      color: 'white'
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
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to your TaskBoard Pro account</p>

        <form onSubmit={handleSubmit} style={styles.form}>
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
                ...(errors.email ? styles.inputError : {})
              }}
              placeholder="Enter your email"
            />
            {errors.email && <span style={styles.errorMessage}>{errors.email}</span>}
          </div>

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
                ...(errors.password ? styles.inputError : {})
              }}
              placeholder="Enter your password"
            />
            {errors.password && <span style={styles.errorMessage}>{errors.password}</span>}
          </div>

          {errors.submit && (
            <div style={styles.submitError}>{errors.submit}</div>
          )}

          <button 
            type="submit" 
            style={{
              ...styles.button,
              ...(loading ? styles.buttonDisabled : {})
            }}
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div style={styles.switch}>
          <p style={{ color: '#6b7280', margin: 0 }}>
            Don't have an account?{' '}
            <button 
              type="button" 
              onClick={switchToRegister} 
              style={styles.link}
            >
              Sign Up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;