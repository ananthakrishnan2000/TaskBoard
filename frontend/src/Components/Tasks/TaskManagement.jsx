import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { getTasks, createTask, updateTask, deleteTask } from '../../services/projectService';
import { getProjects } from '../../services/projectService';
import './TaskManagement.css';

const TaskManagement = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [tasks, setTasks] = useState([]);
  const [project, setProject] = useState(null);
  const [showTaskForm, setShowTaskForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    status: 'Pending',
    dueDate: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    fetchProjectAndTasks();
  }, [projectId]);

  const fetchProjectAndTasks = async () => {
    try {
      setLoading(true);
      
      // Fetch project details
      const projects = await getProjects();
      const currentProject = projects.find(p => p._id === projectId);
      setProject(currentProject);
      
      // Fetch tasks
      const tasksData = await getTasks(projectId);
      setTasks(tasksData);
      setError('');
    } catch (err) {
      setError('Failed to load project and tasks: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Filter tasks based on search and filter criteria
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || task.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateTask = async (e) => {
    e.preventDefault();
    try {
      if (taskForm.title.trim()) {
        const task = await createTask(projectId, taskForm);
        setTasks([task, ...tasks]);
        resetTaskForm();
        setSuccess('Task created successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to create task: ' + err.message);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setTaskForm({
      title: task.title,
      status: task.status,
      dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : ''
    });
    setShowTaskForm(true);
  };

  const handleUpdateTask = async (e) => {
    e.preventDefault();
    try {
      if (taskForm.title.trim() && editingTask) {
        const updatedTask = await updateTask(editingTask._id, taskForm);
        setTasks(tasks.map(task => 
          task._id === editingTask._id ? updatedTask : task
        ));
        resetTaskForm();
        setSuccess('Task updated successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to update task: ' + err.message);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      if (window.confirm('Are you sure you want to delete this task?')) {
        await deleteTask(taskId);
        setTasks(tasks.filter(task => task._id !== taskId));
        setSuccess('Task deleted successfully!');
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      setError('Failed to delete task: ' + err.message);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const updatedTask = await updateTask(taskId, { status: newStatus });
      setTasks(tasks.map(task => 
        task._id === taskId ? updatedTask : task
      ));
      setSuccess('Task status updated!');
      setTimeout(() => setSuccess(''), 2000);
    } catch (err) {
      setError('Failed to update task status: ' + err.message);
    }
  };

  const resetTaskForm = () => {
    setTaskForm({ title: '', status: 'Pending', dueDate: '' });
    setShowTaskForm(false);
    setEditingTask(null);
  };

  const handleFormSubmit = (e) => {
    if (editingTask) {
      handleUpdateTask(e);
    } else {
      handleCreateTask(e);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'Completed': return '#10b981';
      case 'In Progress': return '#3b82f6';
      case 'Pending': return '#f59e0b';
      default: return '#6b7280';
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No due date';
    return new Date(dateString).toLocaleDateString();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner">Loading tasks...</div>
      </div>
    );
  }

  if (!project) {
    return (
      <div className="error-container">
        <h2>Project not found</h2>
        <button onClick={() => navigate('/dashboard')} className="btn-primary">
          Back to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div className="task-management-container">
      {/* Header */}
      <header className="task-header">
        <div className="header-content">
          <div className="header-left">
            <button onClick={() => navigate('/dashboard')} className="back-btn">
              ← Back to Projects
            </button>
            <h1>{project.name} - Tasks</h1>
            {project.description && (
              <p className="project-description">{project.description}</p>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="task-main">
        {/* Messages */}
        {success && (
          <div className="success-banner">
            {success}
            <button onClick={() => setSuccess('')} className="close-btn">×</button>
          </div>
        )}

        {error && (
          <div className="error-banner">
            {error}
            <button onClick={() => setError('')} className="close-btn">×</button>
          </div>
        )}

        {/* Task Actions */}
        <div className="task-actions">
          <button 
            onClick={() => {
              setEditingTask(null);
              setTaskForm({ title: '', status: 'Pending', dueDate: '' });
              setShowTaskForm(true);
            }}
            className="btn-primary"
          >
            + Add New Task
          </button>
          
          {/* Search and Filter Section */}
          <div className="search-filter-container">
            <div className="search-box">
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
            
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="filter-select"
            >
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </div>
          
          <div className="task-stats">
            <span>Total: {tasks.length}</span>
            <span style={{ color: '#f59e0b' }}>Pending: {tasks.filter(t => t.status === 'Pending').length}</span>
            <span style={{ color: '#3b82f6' }}>In Progress: {tasks.filter(t => t.status === 'In Progress').length}</span>
            <span style={{ color: '#10b981' }}>Completed: {tasks.filter(t => t.status === 'Completed').length}</span>
          </div>
        </div>

        {/* Task Form Modal */}
        {showTaskForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <div className="modal-header">
                <h3>{editingTask ? 'Edit Task' : 'Create New Task'}</h3>
                <button onClick={resetTaskForm} className="close-btn">×</button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="form-group">
                  <label>Task Title *</label>
                  <input
                    type="text"
                    value={taskForm.title}
                    onChange={(e) => setTaskForm({...taskForm, title: e.target.value})}
                    placeholder="Enter task title"
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({...taskForm, status: e.target.value})}
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label>Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({...taskForm, dueDate: e.target.value})}
                  />
                </div>
                
                <div className="form-actions">
                  <button type="submit" className="btn-success">
                    {editingTask ? 'Update Task' : 'Create Task'}
                  </button>
                  <button type="button" onClick={resetTaskForm} className="btn-secondary">
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Tasks List */}
        <div className="tasks-container">
          {filteredTasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon" position = "right">🔍</div>
              <h3>No tasks found</h3>
              <p>Try adjusting your search or filter criteria</p>
              <button 
                onClick={() => {
                  setEditingTask(null);
                  setTaskForm({ title: '', status: 'Pending', dueDate: '' });
                  setShowTaskForm(true);
                }}
                className="btn-primary"
              >
                Create Your First Task
              </button>
            </div>
          ) : (
            <div className="tasks-list">
              {filteredTasks.map(task => (
                <div key={task._id} className="task-card">
                  <div className="task-header">
                    <h4 className="task-title">{task.title}</h4>
                    <div className="task-actions-header">
                      <button 
                        onClick={() => handleEditTask(task)}
                        className="edit-btn"
                        title="Edit task"
                      >
                        ✏️
                      </button>
                      <button 
                        onClick={() => handleDeleteTask(task._id)}
                        className="delete-btn"
                        title="Delete task"
                      >
                        ×
                      </button>
                    </div>
                  </div>
                  
                  <div className="task-details">
                    <div className="task-status">
                      <span 
                        className="status-badge"
                        style={{ backgroundColor: getStatusColor(task.status) }}
                      >
                        {task.status}
                      </span>
                    </div>
                    
                    <div className="task-date">
                      <span>Due: {formatDate(task.dueDate)}</span>
                    </div>
                    
                    <div className="task-created">
                      <span>Created: {new Date(task.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                  
                  <div className="task-footer">
                    <div className="status-actions">
                      <button 
                        onClick={() => handleStatusChange(task._id, 'Pending')}
                        className={`status-btn ${task.status === 'Pending' ? 'active' : ''}`}
                        style={{ backgroundColor: task.status === 'Pending' ? '#f59e0b' : '#f3f4f6' }}
                      >
                        Pending
                      </button>
                      <button 
                        onClick={() => handleStatusChange(task._id, 'In Progress')}
                        className={`status-btn ${task.status === 'In Progress' ? 'active' : ''}`}
                        style={{ backgroundColor: task.status === 'In Progress' ? '#3b82f6' : '#f3f4f6' }}
                      >
                        In Progress
                      </button>
                      <button 
                        onClick={() => handleStatusChange(task._id, 'Completed')}
                        className={`status-btn ${task.status === 'Completed' ? 'active' : ''}`}
                        style={{ backgroundColor: task.status === 'Completed' ? '#10b981' : '#f3f4f6' }}
                      >
                        Completed
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

export default TaskManagement;