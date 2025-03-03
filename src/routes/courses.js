const express = require('express');
const authMiddleware = require('../middlewares/auth');
const role = require('../middlewares/role');
const Course = require('../models/Course');
const { sendEmail } = require('../utils/email');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('../config/cloudinary');


const router = express.Router();

// Create Course (Instructor only)
router.post('/', authMiddleware, role('instructor'), async (req, res) => {
  // This extra role check is optional if your middleware works as expected.
  if (req.user.role !== 'instructor') return res.status(403).json({ message: 'Forbidden' });

  const { title, description, duration, price } = req.body;
  const course = new Course({ title, description, duration, price, instructor: req.user.id });

  await course.save();
  res.json(course);
});

// Get all courses
router.get('/', async (req, res) => {
  const courses = await Course.find().populate('instructor', 'name');
  res.json(courses);
});

// Update Course (Instructor only)
router.put('/:courseId', authMiddleware, role('instructor'), async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  
  // Ensure the logged-in instructor is the owner of the course
  if (course.instructor.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: You do not own this course' });
  }

  const { title, description, duration, price } = req.body;
  if (title) course.title = title;
  if (description) course.description = description;
  if (duration) course.duration = duration;
  if (price) course.price = price;

  await course.save();
  res.json({ message: 'Course updated successfully', course });
});

// Delete Course (Instructor only)
router.delete('/:courseId', authMiddleware, role('instructor'), async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });
  
  // Ensure the logged-in instructor is the owner of the course
  if (course.instructor.toString() !== req.user.id) {
    return res.status(403).json({ message: 'Forbidden: You do not own this course' });
  }
  
  await course.deleteOne();
  res.json({ message: 'Course deleted successfully' });
});

// Enroll Student (Student only)
router.post('/:courseId/enroll', authMiddleware, role('student'), async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (!course.students.includes(req.user.id)) {
    course.students.push(req.user.id);
    await course.save();
  }

  res.json({ message: 'Enrolled successfully', course });

  sendEmail(req.user.email, 'Enrollment Confirmation', 'You have been successfully enrolled in the course.');

});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'course_media',
    allowed_formats: ['jpg', 'png', 'mp4', 'pdf']
  }
});

const upload = multer({ storage });

// Only instructors can upload media
router.post('/:courseId/upload', authMiddleware, role('instructor'), upload.single('media'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }
  // Save file information to course document if needed.
  res.json({ message: 'Media uploaded successfully', fileUrl: req.file.path });
});

module.exports = router;
