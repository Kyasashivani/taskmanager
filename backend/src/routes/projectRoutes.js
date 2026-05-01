const express = require('express');
const { createProject, getAllProjects, addMemberToProject } = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

const router = express.Router();

router.use(authMiddleware);

router.post('/', createProject);
router.get('/', getAllProjects);
router.put('/:id/add-member', addMemberToProject);

module.exports = router;
