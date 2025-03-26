const Project = require('../models/projectModel');

exports.createProject = async (req, res) => {
  await Project.create(req.body, (err, project) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json({ success: 'Project created successfully', project });
  });
};

exports.getProjects = async (req, res) => {
  await Project.getAll((err, projects) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(projects);
  });
};

exports.getProjectById = (req, res) => {
  Project.getById(req.params.id, (err, project) => {
    if (err || !project) return res.status(404).json({ error: 'Project not found' });
    return res.status(200).json({ success: 'Project loaded successfully', project });
  });
};

exports.updateProject = (req, res) => {
  Project.update(req.params.id, req.body, (err, project) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json({ message: 'Project updated successfully', project });
  });
};

exports.deleteProject = (req, res) => {
  Project.delete(req.params.id, (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(result);
  });
};

exports.searchProjects = (req, res) => {
  const query = req.query.q;
  Project.search(query, (err, projects) => {
    if (err) return res.status(500).json({ error: err.message });
    return res.status(200).json(projects);
  });
};
