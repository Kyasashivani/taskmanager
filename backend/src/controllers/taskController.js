const Task = require('../models/Task');
const mockTaskService = require('../services/mockTaskService');

const validStatuses = ['Pending', 'In Progress', 'Completed'];

exports.createTask = async (req, res) => {
  try {
    const { title, description, status, dueDate, assignedTo, project } = req.body;

    if (!title || !project) {
      return res.status(400).json({ message: 'Task title and project are required.' });
    }

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid task status.' });
    }

    try {
      const task = await Task.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        status: status || 'Pending',
        dueDate: dueDate ? new Date(dueDate) : undefined,
        assignedTo: assignedTo || undefined,
        project,
      });

      const populatedTask = await Task.findById(task._id)
        .populate('assignedTo', 'name email role')
        .populate('project', 'title description');

      res.status(201).json(populatedTask);
    } catch (dbError) {
      // Fall back to mock service
      const task = await mockTaskService.createTask(
        title.trim(),
        description ? description.trim() : '',
        project,
        assignedTo || '1',
        status || 'Pending'
      );
      res.status(201).json(task);
    }
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({ message: 'Unable to create task.' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    try {
      const tasks = await Task.find()
        .populate('assignedTo', 'name email role')
        .populate('project', 'title description');

      res.status(200).json(tasks);
    } catch (dbError) {
      // Fall back to mock service
      const tasks = await mockTaskService.getAllTasks();
      res.status(200).json(tasks);
    }
  } catch (error) {
    console.error('Get tasks error:', error);
    res.status(500).json({ message: 'Unable to fetch tasks.' });
  }
};

exports.updateTaskStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Valid status is required.' });
    }

    try {
      const task = await Task.findById(id);
      if (!task) {
        return res.status(404).json({ message: 'Task not found.' });
      }

      task.status = status;
      await task.save();

      const populatedTask = await Task.findById(id)
        .populate('assignedTo', 'name email role')
        .populate('project', 'title description');

      res.status(200).json(populatedTask);
    } catch (dbError) {
      const updatedTask = await mockTaskService.updateTaskStatus(id, status);
      if (!updatedTask) {
        return res.status(404).json({ message: 'Task not found.' });
      }
      res.status(200).json(updatedTask);
    }
  } catch (error) {
    console.error('Update task status error:', error);
    res.status(500).json({ message: 'Unable to update task status.' });
  }
};

exports.dashboardStats = async (req, res) => {
  try {
    try {
      const now = new Date();

      const [totalTasks, pendingTasks, inProgressTasks, completedTasks, overdueTasks] = await Promise.all([
        Task.countDocuments(),
        Task.countDocuments({ status: 'Pending' }),
        Task.countDocuments({ status: 'In Progress' }),
        Task.countDocuments({ status: 'Completed' }),
        Task.countDocuments({
          dueDate: { $lt: now },
          status: { $ne: 'Completed' },
        }),
      ]);

      res.status(200).json({
        totalTasks,
        pendingTasks,
        inProgressTasks,
        completedTasks,
        overdueTasks,
      });
    } catch (dbError) {
      const stats = await mockTaskService.getDashboardStats();
      res.status(200).json(stats);
    }
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ message: 'Unable to fetch dashboard stats.' });
  }
};
