const express = require('express');
// const connectDB = require('./src/config/db');
const cors = require('cors');
require('dotenv').config();

// connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('../src/routes/auth'));
app.use('/api/courses', require('../src/routes/courses'));
app.use('/api/analytics', require('../src/routes/analytics'));

module.exports = app;