const mongoose = require('mongoose');
const submissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment' },
  student: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  fileId: { type: String },
  originalName: String,
  grade: String,
  feedback: String,
  submittedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Submission', submissionSchema);
