let projects = new Map();
let projectsByUser = new Map();
let nextId = 1;

const mockProjectService = {
  createProject: async (title, description, createdByUserId) => {
    const id = String(nextId++);
    const project = {
      _id: id,
      title,
      description,
      createdBy: {
        _id: createdByUserId,
        name: `User ${createdByUserId}`,
        email: `user${createdByUserId}@example.com`
      },
      members: [{
        _id: createdByUserId,
        name: `User ${createdByUserId}`,
        email: `user${createdByUserId}@example.com`
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    projects.set(id, project);
    
    if (!projectsByUser.has(createdByUserId)) {
      projectsByUser.set(createdByUserId, []);
    }
    projectsByUser.get(createdByUserId).push(id);
    
    return project;
  },

  getProjectsByUser: async (userId) => {
    const projectIds = projectsByUser.get(userId) || [];
    return projectIds.map(id => projects.get(id)).filter(p => p);
  },

  getProjectById: async (projectId) => {
    return projects.get(projectId) || null;
  },

  updateProject: async (projectId, updates) => {
    const project = projects.get(projectId);
    if (!project) return null;
    
    const updated = { ...project, ...updates, updatedAt: new Date() };
    projects.set(projectId, updated);
    return updated;
  },

  deleteProject: async (projectId) => {
    const project = projects.get(projectId);
    if (!project) return null;
    
    projects.delete(projectId);
    
    for (const [userId, ids] of projectsByUser.entries()) {
      projectsByUser.set(userId, ids.filter(id => id !== projectId));
    }
    
    return project;
  }
};

module.exports = mockProjectService;
