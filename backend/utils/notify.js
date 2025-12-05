const nodemailer = require('nodemailer');
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

exports.notifyOnGraded = async (submission, assignment) => {
  const student = submission.student;
  const mail = {
    from: process.env.SMTP_USER,
    to: student.email,
    subject: `Your submission was graded`,
    text: `Hi ${student.name},\n\nYour submission ${submission.originalName} for assignment ${assignment.title} was graded.\nGrade: ${submission.grade}\nFeedback: ${submission.feedback || 'N/A'}\n\nRegards,\nAssignment Portal`
  };
  await transporter.sendMail(mail);
};
