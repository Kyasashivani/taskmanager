const mockProjectService = require('./mockProjectService');

let tasks = new Map();
let tasksByUser = new Map();
let tasksByProject = new Map();
let nextId = 1;

const normalizeProject = async (projectField) => {
  if (!projectField) return null;
  if (typeof projectField === 'object' && projectField._id) return projectField;
  if (typeof projectField === 'string') {
    const project = await mockProjectService.getProjectById(projectField);
    if (project) return project;
    return {
      _id: projectField,
      title: 'Unknown Project',
      description: '',
    };
  }
  return null;
};

const normalizeTask = async (task) => {
  return {
    ...task,
    project: await normalizeProject(task.project),
  };
};

const mockTaskService = {
  createTask: async (title, description, projectId, assignedToUserId, status = 'Pending') => {
    const id = String(nextId++);
    const project = await normalizeProject(projectId);
    const task = {
      _id: id,
      title,
      description,
      project,
      assignedTo: {
        _id: assignedToUserId,
        name: `User ${assignedToUserId}`,
        email: `user${assignedToUserId}@example.com`
      },
      status: status || 'Pending',
      dueDate: null,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    tasks.set(id, task);
    
    if (!tasksByUser.has(assignedToUserId)) {
      tasksByUser.set(assignedToUserId, []);
    }
    tasksByUser.get(assignedToUserId).push(id);
    
    if (!tasksByProject.has(projectId)) {
      tasksByProject.set(projectId, []);
    }
    tasksByProject.get(projectId).push(id);
    
    return task;
  },

  getTasksByUser: async (userId) => {
    const taskIds = tasksByUser.get(userId) || [];
    return taskIds.map(id => tasks.get(id)).filter(t => t);
  },

  getTasksByProject: async (projectId) => {
    const taskIds = tasksByProject.get(projectId) || [];
    return taskIds.map(id => tasks.get(id)).filter(t => t);
  },

  getTaskById: async (taskId) => {
    const task = tasks.get(taskId);
    if (!task) return null;
    return normalizeTask(task);
  },

  getAllTasks: async () => {
    const allTasks = Array.from(tasks.values());
    return Promise.all(allTasks.map((task) => normalizeTask(task)));
  },

  updateTaskStatus: async (taskId, newStatus) => {
    const task = tasks.get(taskId);
    if (!task) return null;
    
    const updated = { ...task, status: newStatus, updatedAt: new Date() };
    tasks.set(taskId, updated);
    return normalizeTask(updated);
  },

  updateTask: async (taskId, updates) => {
    const task = tasks.get(taskId);
    if (!task) return null;
    
    const updated = { ...task, ...updates, updatedAt: new Date() };
    tasks.set(taskId, updated);
    return normalizeTask(updated);
  },

  deleteTask: async (taskId) => {
    const task = tasks.get(taskId);
    if (!task) return null;
    
    tasks.delete(taskId);
    
    if (task.assignedTo) {
      const userId = task.assignedTo._id || task.assignedTo;
      if (tasksByUser.has(userId)) {
        tasksByUser.set(userId, tasksByUser.get(userId).filter(id => id !== taskId));
      }
    }
    
    if (task.project) {
      const projectId = task.project._id || task.project;
      if (tasksByProject.has(projectId)) {
        tasksByProject.set(projectId, tasksByProject.get(projectId).filter(id => id !== taskId));
      }
    }
    
    return task;
  },

  getDashboardStats: async () => {
    const allTasks = Array.from(tasks.values());
    const totalTasks = allTasks.length;
    const completedTasks = allTasks.filter(t => t.status === 'Completed').length;
    const pendingTasks = allTasks.filter(t => t.status === 'Pending').length;
    const inProgressTasks = allTasks.filter(t => t.status === 'In Progress').length;
    const overdueTasks = allTasks.filter(t => {
      if (!t.dueDate) return false;
      return new Date(t.dueDate) < new Date() && t.status !== 'Completed';
    }).length;
    
    return {
      totalTasks,
      completedTasks,
      pendingTasks,
      inProgressTasks,
      overdueTasks
    };
  }
};

module.exports = mockTaskService;
