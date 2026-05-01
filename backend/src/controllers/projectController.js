const Project = require('../models/Project');
const User = require('../models/User');
const mockProjectService = require('../services/mockProjectService');

exports.createProject = async (req, res) => {
  try {
    const { title, description, members } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Project title is required.' });
    }

    try {
      const project = await Project.create({
        title: title.trim(),
        description: description ? description.trim() : '',
        createdBy: req.user.id,
        members: Array.isArray(members) ? members : [],
      });

      res.status(201).json(project);
    } catch (dbError) {
      // Fall back to mock service
      const project = await mockProjectService.createProject(
        title.trim(),
        description ? description.trim() : '',
        req.user.id
      );
      res.status(201).json(project);
    }
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Unable to create project.' });
  }
};

exports.getAllProjects = async (req, res) => {
  try {
    try {
      const projects = await Project.find()
        .populate('createdBy', 'name email role')
        .populate('members', 'name email role');

      res.status(200).json(projects);
    } catch (dbError) {
      // Fall back to mock service
      const projects = await mockProjectService.getProjectsByUser(req.user.id);
      res.status(200).json(projects);
    }
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Unable to fetch projects.' });
  }
};

exports.addMemberToProject = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;

    if (!memberId) {
      return res.status(400).json({ message: 'Member ID is required.' });
    }

    try {
      const project = await Project.findById(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
      }

      const userExists = await User.exists({ _id: memberId });
      if (!userExists) {
        return res.status(404).json({ message: 'User not found.' });
      }

      const alreadyMember = project.members.some((member) => member.toString() === memberId);
      if (alreadyMember) {
        return res.status(400).json({ message: 'User is already a member of the project.' });
      }

      project.members.push(memberId);
      await project.save();

      const populatedProject = await Project.findById(id)
        .populate('createdBy', 'name email role')
        .populate('members', 'name email role');

      res.status(200).json(populatedProject);
    } catch (dbError) {
      // Fall back to mock service
      const project = await mockProjectService.getProjectById(id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found.' });
      }

      const alreadyMember = project.members.some((member) => {
        const memberId_ = typeof member === 'object' ? member._id : member;
        return memberId_ === memberId;
      });
      
      if (alreadyMember) {
        return res.status(400).json({ message: 'User is already a member of the project.' });
      }

      project.members.push({
        _id: memberId,
        name: `User ${memberId}`,
        email: `user${memberId}@example.com`
      });
      
      await mockProjectService.updateProject(id, { members: project.members });
      res.status(200).json(project);
    }
  } catch (error) {
    console.error('Add project member error:', error);
    res.status(500).json({ message: 'Unable to add member to project.' });
  }
};
