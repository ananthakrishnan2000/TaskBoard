import React, { createContext, useState, useContext, useEffect } from 'react';
import { getUserProfile } from '../services/authService';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    console.log('🔍 AuthProvider useEffect running...');
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');
      
      console.log('📝 Initial Auth Check:');
      console.log('   - Token exists:', !!token);
      console.log('   - Stored user exists:', !!storedUser);
      
      if (token && storedUser) {
        try {
          console.log('🔄 Verifying token with backend...');
          const userData = await getUserProfile(token);
          console.log('✅ Token valid, setting user:', userData);
          setUser(userData);
        } catch (error) {
          console.error('❌ Token verification failed:', error.message);
          // Clear invalid auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          setUser(null);
        }
      } else {
        console.log('🚫 No valid authentication data found');
        setUser(null);
      }
      setLoading(false);
      console.log('🏁 Auth check completed. User set to:', user);
    };

    checkAuth();
  }, []);

  const login = (userData, token) => {
    console.log('🔐 Login function called:');
    console.log('   - User data:', userData);
    console.log('   - Token received:', !!token);
    
    // Ensure we're using the correct user data structure
    const user = userData.user || userData.data || userData;
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setUser(user);
    
    console.log('✅ Login completed. User set in state and localStorage.');
  };

  const logout = () => {
    console.log('🚪 Logout called');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    loading
  };

  console.log('🔄 AuthContext value:', { 
    user: value.user, 
    loading: value.loading 
  });

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};