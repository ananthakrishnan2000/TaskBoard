import { API_BASE_URL } from '../utils/constants';

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  console.log('🔐 Auth header - Token exists:', !!token);
  return { 'Authorization': `Bearer ${token}` };
};

const handleResponse = async (response) => {
  const data = await response.json();
  
  console.log('📨 Project API Response:', {
    status: response.status,
    ok: response.ok,
    data: data
  });
  
  if (!response.ok) {
    throw new Error(data.message || `HTTP error! status: ${response.status}`);
  }

  return data;
};

// Projects API
export const getProjects = async () => {
  console.log('📦 Fetching projects...');
  
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
  });
  
  const data = await handleResponse(response);
  return data.data || data; // Return the projects array
};

export const createProject = async (projectData) => {
  console.log('🆕 Creating project:', projectData);
  
  const response = await fetch(`${API_BASE_URL}/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(projectData),
  });
  
  const data = await handleResponse(response);
  return data.data || data; // Return the created project
};

export const updateProject = async (projectId, projectData) => {
  console.log('✏️ Updating project:', projectId);
  
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(projectData),
  });
  
  const data = await handleResponse(response);
  return data.data || data;
};

export const deleteProject = async (projectId) => {
  console.log('🗑️ Deleting project:', projectId);
  
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
  });
  
  const data = await handleResponse(response);
  return data;
};

// Tasks API
export const getTasks = async (projectId) => {
  console.log('📋 Fetching tasks for project:', projectId);
  
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
  });
  
  const data = await handleResponse(response);
  return data.data || data;
};

export const createTask = async (projectId, taskData) => {
  console.log('🆕 Creating task for project:', projectId);
  
  const response = await fetch(`${API_BASE_URL}/projects/${projectId}/tasks`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(taskData),
  });
  
  const data = await handleResponse(response);
  return data.data || data;
};

export const updateTask = async (taskId, taskData) => {
  console.log('✏️ Updating task:', taskId);
  
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
    body: JSON.stringify(taskData),
  });
  
  const data = await handleResponse(response);
  return data.data || data;
};

export const deleteTask = async (taskId) => {
  console.log('🗑️ Deleting task:', taskId);
  
  const response = await fetch(`${API_BASE_URL}/tasks/${taskId}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeader()
    },
  });
  
  const data = await handleResponse(response);
  return data;
};