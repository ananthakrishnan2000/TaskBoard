import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './Components/Auth/Login.jsx';
import Register from './Components/Auth/Register.jsx';
// Remove Dashboard import for now since it's causing errors
// import Dashboard from './Components/Dashboard/Dashboard';

// Remove CSS import temporarily
// import './styles/App.css';

const AuthWrapper = () => {
  const [isLogin, setIsLogin] = useState(true);
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        color: 'white',
        fontSize: '18px',
        fontWeight: '600'
      }}>
        Loading...
      </div>
    );
  }

  if (user) {
    // Temporary dashboard until we fix the import
    return (
      <div style={{ padding: '20px' }}>
        <h1>Welcome to Dashboard, {user?.name}!</h1>
        <p>Email: {user?.email}</p>
        <button onClick={() => { 
          localStorage.removeItem('token'); 
          localStorage.removeItem('user'); 
          window.location.reload(); 
        }} style={{ 
          padding: '10px 20px', 
          backgroundColor: '#ef4444', 
          color: 'white', 
          border: 'none', 
          borderRadius: '6px',
          cursor: 'pointer'
        }}>
          Logout
        </button>
        <p style={{ marginTop: '20px', color: '#6b7280' }}>
          Dashboard component will be implemented soon.
        </p>
      </div>
    );
  }

  return isLogin ? (
    <Login switchToRegister={() => setIsLogin(false)} />
  ) : (
    <Register switchToLogin={() => setIsLogin(true)} />
  );
};

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <AuthWrapper />
      </div>
    </AuthProvider>
  );
}

export default App;