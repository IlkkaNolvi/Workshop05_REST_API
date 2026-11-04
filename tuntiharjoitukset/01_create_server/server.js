const express = require('express');

const studentsRouter = require('./routes/students');
const coursesRouter = require('./routes/courses');

const app = express();
const PORT = 3001;

app.use(express.json());

app.use('/api/students', studentsRouter);
app.use('/api/courses', coursesRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
