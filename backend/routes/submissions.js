const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const auth = require('../middleware/auth');
const Submission = require('../models/Submission');
const Assignment = require('../models/Assignment');
const storage = require('../utils/gridfs');
const multer = require('multer');
const upload = multer({ storage });
const Grid = require('gridfs-stream');
const conn = mongoose.connection;
let gfs;
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

const checkDeadline = require('../middleware/checkDeadline');
const notify = require('../utils/notify');

router.post('/:assignmentId', auth, checkDeadline, upload.single('file'), async (req, res) => {
  if (req.user.role !== 'student') return res.status(403).json({ message: 'Forbidden' });
  const assignment = await Assignment.findById(req.params.assignmentId);
  if (!assignment) return res.status(404).json({ message: 'Assignment not found' });
  const submission = new Submission({
    assignment: assignment._id,
    student: req.user._id,
    fileId: req.file.id,
    originalName: req.file.originalname
  });
  await submission.save();
  res.json(submission);
});

router.get('/assignment/:assignmentId', auth, async (req, res) => {
  const subs = await Submission.find({ assignment: req.params.assignmentId }).populate('student', 'name email');
  res.json(subs);
});

router.get('/my', auth, async (req, res) => {
  const subs = await Submission.find({ student: req.user._id }).populate('assignment');
  res.json(subs);
});

router.get('/file/:fileId', auth, async (req, res) => {
  const fileId = req.params.fileId;
  try {
    const _id = mongoose.Types.ObjectId(fileId);
    const file = await gfs.files.findOne({ _id });
    if (!file) return res.status(404).json({ message: 'No file' });
    if (file.contentType === 'application/pdf') {
      const readstream = gfs.createReadStream({ _id });
      res.set('Content-Type', 'application/pdf');
      return readstream.pipe(res);
    }
    if (file.contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' || file.filename.endsWith('.docx')) {
      const bufs = [];
      const readstream = gfs.createReadStream({ _id });
      readstream.on('data', (d) => bufs.push(d));
      readstream.on('end', async () => {
        const buffer = Buffer.concat(bufs);
        const mammoth = require('mammoth');
        const result = await mammoth.convertToHtml({ buffer });
        res.set('Content-Type', 'text/html');
        res.send(result.value);
      });
      return;
    }
    res.set('Content-Disposition', `attachment; filename="${file.filename}"`);
    const readstream = gfs.createReadStream({ _id });
    readstream.pipe(res);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error streaming file' });
  }
});

// Archive zip of all submissions for an assignment (teacher)
router.get('/archive/:assignmentId', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
  const assignmentId = req.params.assignmentId;
  const subs = await Submission.find({ assignment: assignmentId }).populate('student', 'name');
  if (!subs.length) return res.status(404).json({ message: 'No submissions' });
  res.setHeader('Content-Type', 'application/zip');
  res.setHeader('Content-Disposition', `attachment; filename=submissions-${assignmentId}.zip`);
  const archiver = require('archiver');
  const archive = archiver('zip');
  archive.pipe(res);
  for (const s of subs) {
    try {
      const fileId = mongoose.Types.ObjectId(s.fileId);
      const file = await gfs.files.findOne({ _id: fileId });
      if (!file) continue;
      const pass = gfs.createReadStream({ _id: fileId });
      archive.append(pass, { name: `${s.student.name || s.student._id}_${s.originalName}` });
    } catch(e) { console.warn('skip file', e); }
  }
  archive.finalize();
});

// Grade endpoint
router.put('/grade/:submissionId', auth, async (req, res) => {
  if (req.user.role !== 'teacher') return res.status(403).json({ message: 'Forbidden' });
  const { grade, feedback } = req.body;
  const s = await Submission.findByIdAndUpdate(req.params.submissionId, { grade, feedback }, { new: true }).populate('student', 'name email');
  if (!s) return res.status(404).json({ message: 'Submission not found' });
  try {
    const a = await Assignment.findById(s.assignment);
    await notify.notifyOnGraded(s, a);
  } catch (e) { console.warn('email failed', e); }
  res.json(s);
});

module.exports = router;
