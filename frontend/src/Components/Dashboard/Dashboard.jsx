import React from 'react';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { user, logout } = useAuth();

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome to Dashboard, {user?.name}!</h1>
      <p>Email: {user?.email}</p>
      <button onClick={logout} style={{ 
        padding: '10px 20px', 
        backgroundColor: '#ef4444', 
        color: 'white', 
        border: 'none', 
        borderRadius: '6px',
        cursor: 'pointer'
      }}>
        Logout
      </button>
    </div>
  );
};

export default Dashboard;