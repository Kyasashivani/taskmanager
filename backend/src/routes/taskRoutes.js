const express = require('express');
const {
  createTask,
  getAllTasks,
  updateTaskStatus,
  dashboardStats,
} = require('../controllers/taskController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createTask);
router.get('/', getAllTasks);
router.put('/:id/status', updateTaskStatus);
router.get('/dashboard/stats', dashboardStats);

module.exports = router;
