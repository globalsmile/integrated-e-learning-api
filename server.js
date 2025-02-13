const express = require('express');
const connectDB = require('./src/config/db');
const cors = require('cors');
require('dotenv').config();

connectDB();

const app = express();
app.use(express.json());
app.use(cors());

app.use('/api/auth', require('./src/routes/auth'));
app.use('/api/courses', require('./src/routes/courses'));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
