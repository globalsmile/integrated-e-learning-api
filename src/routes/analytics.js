// src/routes/analytics.js
const express = require('express');
const Course = require('../models/Course');
const router = express.Router();

router.get('/summary', async (req, res) => {
  try {
    const totalCourses = await Course.countDocuments();
    const totalEnrollments = await Course.aggregate([
      { $unwind: '$students' },
      { $group: { _id: null, total: { $sum: 1 } } }
    ]);

    res.json({
      totalCourses,
      totalEnrollments: totalEnrollments[0] ? totalEnrollments[0].total : 0
    });
  } catch (error) {
    res.status(500).json({ message: 'Analytics error', error });
  }
});

module.exports = router;
