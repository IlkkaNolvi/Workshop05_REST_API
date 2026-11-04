const express = require('express');

const router = express.Router();

// In-memory "database"
let students = [
  { studentNumber: '2912345', name: 'Mikko Virtanen', age: 22, major: 'Tietojenkäsittely' },
  { studentNumber: '2923456', name: 'Aino Mäkinen', age: 24, major: 'Tietotekniikka' },
];

// GET /api/students — return all students
router.get('/', (req, res) => {
  res.json(students);
});

// GET /api/students/:studentNumber — return a single student
router.get('/:studentNumber', (req, res) => {
  const student = students.find(s => s.studentNumber === req.params.studentNumber);
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

// POST /api/students — create a new student
router.post('/', (req, res) => {
  const { studentNumber, name, age, major } = req.body;
  if (!studentNumber || !name || !age || !major) {
    return res.status(400).json({ error: 'studentNumber, name, age and major are required' });
  }
  if (!/^29\d{5}$/.test(studentNumber)) {
    return res.status(400).json({ error: 'studentNumber must be 7 digits and start with 29' });
  }
  const exists = students.some(s => s.studentNumber === studentNumber);
  if (exists) {
    return res.status(400).json({ error: 'Student number must be unique' });
  }
  const student = { studentNumber, name, age, major };
  students.push(student);
  res.status(201).json(student);
});

// PUT /api/students/:studentNumber — replace a student
router.put('/:studentNumber', (req, res) => {
  const index = students.findIndex(s => s.studentNumber === req.params.studentNumber);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const { studentNumber, name, age, major } = req.body;
  if (!studentNumber || !name || !age || !major) {
    return res.status(400).json({ error: 'studentNumber, name, age and major are required' });
  }
  if (!/^29\d{5}$/.test(studentNumber)) {
    return res.status(400).json({ error: 'studentNumber must be 7 digits and start with 29' });
  }
  const exists = students.some((s, i) => s.studentNumber === studentNumber && i !== index);
  if (exists) {
    return res.status(400).json({ error: 'Student number must be unique' });
  }
  students[index] = { studentNumber, name, age, major };
  res.json(students[index]);
});

// DELETE /api/students/:studentNumber — remove a student
router.delete('/:studentNumber', (req, res) => {
  const index = students.findIndex(s => s.studentNumber === req.params.studentNumber);
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  students.splice(index, 1);
  res.json({ message: 'Student deleted successfully' });
});

module.exports = router;
