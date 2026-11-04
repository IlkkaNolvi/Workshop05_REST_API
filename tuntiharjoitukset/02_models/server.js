const express = require('express');
require('dotenv').config();

const studentsRouter = require('./routes/students');
const coursesRouter = require('./routes/courses');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.json());

app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log('Mounted routers:');
  console.log('  /api/students -> routes/students.js');
  console.log('  /api/courses -> routes/courses.js');
  console.log('Database connection is disabled for this step.');
});
