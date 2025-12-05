const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Assignment = require('../models/Assignment');

router.post('/', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
  const { title, description, dueDate } = req.body;
  const a = new Assignment({ title, description, dueDate, createdBy: req.user._id });
  await a.save();
  res.json(a);
});

router.get('/', auth, async (req, res) => {
  const list = await Assignment.find().populate('createdBy', 'name email');
  res.json(list);
});

router.get('/:id', auth, async (req, res) => {
  const a = await Assignment.findById(req.params.id);
  res.json(a);
});

router.put('/:id', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
  const a = await Assignment.findByIdAndUpdate(req.params.id, req.body, { new: true });
  res.json(a);
});

router.delete('/:id', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
  await Assignment.findByIdAndDelete(req.params.id);
  res.json({ message: 'deleted' });
});

module.exports = router;
