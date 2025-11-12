// For production - automatically switches between local and deployed
export const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? process.env.BACKEND_URL  // Same domain when deployed
  : 'http://localhost:5000/api';

// For demo purposes
export const DEMO_MODE = true;