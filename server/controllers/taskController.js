const Task = require('../models/Task');
const Notification = require('../models/Notification');
const User = require('../models/User');

const populateTask = (query) =>
  query
    .populate('assignedTo', 'name email')
    .populate('createdBy', 'name email')
    .populate('project', 'name color');

const broadcastTask = (req, event, payload) => {
  if (req.io && payload.project) {
    const projectId = payload.project._id || payload.project;
    req.io.to(`project:${projectId}`).emit(event, payload);
  }
};

const notifyUsers = async (type, message, taskId, excludeUserId) => {
  try {
    const users = await User.find({ _id: { $ne: excludeUserId } }).select('_id');
    if (!users.length) return;
    await Notification.insertMany(
      users.map((u) => ({ message, type, userId: u._id, taskId }))
    );
  } catch (err) {
    console.error('Notification creation failed:', err.message);
  }
};

const getTasks = async (req, res) => {
  try {
    const filter = {};
    if (req.query.project) filter.project = req.query.project;
    const tasks = await populateTask(Task.find(filter).sort({ createdAt: -1 }));
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getTask = async (req, res) => {
  try {
    const task = await populateTask(Task.findById(req.params.id));
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status, project, assignedTo } = req.body;
    if (!title || !project) {
      return res.status(400).json({ message: 'Title and project are required' });
    }
    // Standard users are always assigned to themselves (enforced server-side)
    const resolvedAssignedTo =
      req.user.role !== 'admin' ? req.user._id : (assignedTo || null);

    const task = await Task.create({
      title,
      description: description || '',
      dueDate: dueDate || null,
      priority: priority || 'medium',
      status: status || 'todo',
      project,
      assignedTo: resolvedAssignedTo,
      createdBy: req.user._id,
    });
    const populated = await populateTask(Task.findById(task._id));
    broadcastTask(req, 'task:created', populated);
    await notifyUsers('task_created', `New task "${title}" was created`, task._id, req.user._id);
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTask = async (req, res) => {
  try {
    const task = await populateTask(
      Task.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true })
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    broadcastTask(req, 'task:updated', task);
    await notifyUsers('task_updated', `Task "${task.title}" was updated`, task._id, req.user._id);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const updateTaskStatus = async (req, res) => {
  try {
    const { status } = req.body;
    if (!['todo', 'in-progress', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status value' });
    }
    const task = await populateTask(
      Task.findByIdAndUpdate(req.params.id, { status }, { new: true })
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    broadcastTask(req, 'task:statusChanged', task);
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });
    broadcastTask(req, 'task:deleted', { _id: task._id, project: task.project });
    await notifyUsers('task_deleted', `Task "${task.title}" was deleted`, task._id, req.user._id);
    await task.deleteOne();
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getTasks, getTask, createTask, updateTask, updateTaskStatus, deleteTask };
