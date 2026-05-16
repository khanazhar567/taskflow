const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTask,
  createTask,
  updateTask,
  updateTaskStatus,
  deleteTask,
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');
const { admin } = require('../middleware/adminMiddleware');

router.get('/', protect, getTasks);
router.get('/:id', protect, getTask);
router.post('/', protect, createTask);
router.put('/:id', protect, admin, updateTask);
router.patch('/:id/status', protect, admin, updateTaskStatus);
router.delete('/:id', protect, admin, deleteTask);

module.exports = router;
