const Assignment = require('../models/Assignment');
module.exports = async (req, res, next) => {
  const assignmentId = req.params.assignmentId;
  const assignment = await Assignment.findById(assignmentId);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  if (assignment.dueDate && new Date() > new Date(assignment.dueDate)) return res.status(403).json({ message: 'Submission deadline passed' });
  next();
};
