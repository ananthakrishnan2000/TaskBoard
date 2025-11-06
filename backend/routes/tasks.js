const express = require('express');
const Task = require('../models/Task');
const Project = require('../models/Project');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

// @desc    Get all tasks for a project
// @route   GET /api/projects/:projectId/tasks
// @access  Private
router.get('/projects/:projectId/tasks', protect, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const tasks = await Task.find({ projectId: req.params.projectId })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      status: 200,
      data: tasks,
      count: tasks.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      status: 500
    });
  }
});

// @desc    Create a new task
// @route   POST /api/projects/:projectId/tasks
// @access  Private
router.post('/projects/:projectId/tasks', protect, async (req, res) => {
  try {
    const project = await Project.findOne({
      _id: req.params.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const task = await Task.create({
      projectId: req.params.projectId,
      ...req.body
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      status: 201,
      data: task
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      status: 400
    });
  }
});

// @desc    Update a task
// @route   PUT /api/tasks/:taskId
// @access  Private
router.put('/tasks/:taskId', protect, async (req, res) => {
  try {
    // Find task and verify project ownership
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const project = await Project.findOne({
      _id: task.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.taskId,
      req.body,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      status: 200,
      data: updatedTask
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      message: error.message,
      status: 400
    });
  }
});

// @desc    Delete a task
// @route   DELETE /api/tasks/:taskId
// @access  Private
router.delete('/tasks/:taskId', protect, async (req, res) => {
  try {
    // Find task and verify project ownership
    const task = await Task.findById(req.params.taskId);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    const project = await Project.findOne({
      _id: task.projectId,
      userId: req.user._id
    });

    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    await Task.findByIdAndDelete(req.params.taskId);

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      status: 200
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
      status: 500
    });
  }
});

module.exports = router;