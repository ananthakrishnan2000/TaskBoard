import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getProjects, createProject, updateProject, deleteProject } from '../../services/projectService';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const [projects, setProjects] = useState([]);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [editingProject, setEditingProject] = useState(null);
  const [projectForm, setProjectForm] = useState({ name: '', description: '' });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch projects on component mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const projectsData = await getProjects();
      setProjects(projectsData);
      setError('');
    } catch (err) {
      setError('Failed to load projects: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (e) => {
    e.preventDefault();
    try {
      if (projectForm.name.trim()) {
        const project = await createProject(projectForm);
        setProjects([...projects, project]);
        setProjectForm({ name: '', description: '' });
        setShowProjectForm(false);
        setSuccess('Project created successfully!');
        setError('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to create project: ' + err.message);
    }
  };

  const handleEditProject = (project) => {
    setEditingProject(project);
    setProjectForm({
      name: project.name,
      description: project.description || ''
    });
    setShowProjectForm(true);
  };

  const handleUpdateProject = async (e) => {
    e.preventDefault();
    try {
      if (projectForm.name.trim() && editingProject) {
        const updatedProject = await updateProject(editingProject._id, projectForm);
        setProjects(projects.map(project => 
          project._id === editingProject._id ? updatedProject : project
        ));
        setProjectForm({ name: '', description: '' });
        setShowProjectForm(false);
        setEditingProject(null);
        setSuccess('Project updated successfully!');
        setError('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update project: ' + err.message);
    }
  };

  const handleDeleteProject = async (projectId) => {
    try {
      if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
        await deleteProject(projectId);
        setProjects(projects.filter(project => project._id !== projectId));
        setSuccess('Project deleted successfully!');
        setError('');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete project: ' + err.message);
    }
  };

  const handleFormSubmit = (e) => {
    if (editingProject) {
      handleUpdateProject(e);
    } else {
      handleCreateProject(e);
    }
  };

  const resetForm = () => {
    setProjectForm({ name: '', description: '' });
    setShowProjectForm(false);
    setEditingProject(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading projects...</div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>TaskBoard Pro</h1>
          <div className="user-info">
            <span>Welcome, {user?.name}</span>
            <button onClick={logout} className="logout-btn">
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        {/* Success Message */}
        {success && (
          <div className="success-banner">
            {success}
            <button onClick={() => setSuccess('')} className="close-btn">×</button>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="close-btn">×</button>
          </div>
        )}

        <div className="dashboard-actions">
          <button 
            onClick={() => {
              setEditingProject(null);
              setProjectForm({ name: '', description: '' });
              setShowProjectForm(true);
            }}
            className="btn-primary"
            disabled={loading}
          >
            + Create New Project
          </button>
        </div>

        {/* Create/Edit Project Form */}
        {showProjectForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingProject ? 'Edit Project' : 'Create New Project'}</h3>
                <button 
                  onClick={resetForm}
                  className="close-btn"
                >
                  ×
                </button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Project Name *</label>
                  <input
                    type="text"
                    value={projectForm.name}
                    onChange={(e) => setProjectForm({...projectForm, name: e.target.value})}
                    placeholder="Enter project name"
                    required
                    disabled={loading}
                  />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({...projectForm, description: e.target.value})}
                    placeholder="Enter project description"
                    rows="3"
                    disabled={loading}
                  />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-success" disabled={loading}>
                    {loading ? 'Saving...' : (editingProject ? 'Update Project' : 'Create Project')}
                  </button>
                  <button 
                    type="button" 
                    onClick={resetForm}
                    className="btn-secondary"
                    disabled={loading}
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Projects Grid */}
        <div className="projects-grid">
          <div className="projects-header">
            <h2>Your Projects</h2>
            <span className="projects-count">({projects.length})</span>
          </div>
          
          {projects.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">📁</div>
              <h3>No projects yet</h3>
              <p>Create your first project to get started with task management</p>
              <button 
                onClick={() => {
                  setEditingProject(null);
                  setProjectForm({ name: '', description: '' });
                  setShowProjectForm(true);
                }}
                className="btn-primary"
              >
                Create Your First Project
              </button>
            </div>
          ) : (
            <div className="projects-list">
              {projects.map(project => (
                <div key={project._id} className="project-card">
                  <div className="project-header">
                    <h3>{project.name}</h3>
                    <div className="project-actions-header">
                      <button 
                        onClick={() => handleEditProject(project)}
                        className="edit-btn"
                        disabled={loading}
                        title="Edit project"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteProject(project._id)}
                        className="delete-btn"
                        disabled={loading}
                        title="Delete project"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  <p className="project-description">
                    {project.description || 'No description provided'}
                  </p>
                  <div className="project-footer">
                    <span className="project-date">
                      Created: {new Date(project.createdAt).toLocaleDateString()}
                    </span>
                    {project.updatedAt && project.updatedAt !== project.createdAt && (
                      <span className="project-date">
                        Updated: {new Date(project.updatedAt).toLocaleDateString()}
                      </span>
                    )}
                    <div className="project-actions">
                      <button className="btn-outline">
                        View Tasks
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;