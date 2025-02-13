const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  instructor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  duration: String,
  price: Number,
  students: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Course', CourseSchema);
