const express = require('express');
const authMiddleware = require('../middlewares/auth');
const Course = require('../models/Course');

const router = express.Router();

// Create Course (Instructor only)
router.post('/', authMiddleware, async (req, res) => {
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

// Enroll student
router.post('/:courseId/enroll', authMiddleware, async (req, res) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return res.status(404).json({ message: 'Course not found' });

  if (!course.students.includes(req.user.id)) {
    course.students.push(req.user.id);
    await course.save();
  }

  res.json({ message: 'Enrolled successfully', course });
});

module.exports = router;
