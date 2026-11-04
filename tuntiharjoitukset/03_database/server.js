const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const studentsRouter = require('./routes/students');
const coursesRouter = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 3001;

async function connectToDatabase() {
  if (!process.env.MONGODB_URI) {
    console.warn('MONGODB_URI is missing. Create a .env file before testing database features.');
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'opintorekisteri' });
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('MongoDB connection error:', error.message);
  }
}

app.use(express.json());

app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);

connectToDatabase().then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('Mounted routers:');
    console.log('  /api/students -> routes/students.js');
    console.log('  /api/courses -> routes/courses.js');
  });
});
