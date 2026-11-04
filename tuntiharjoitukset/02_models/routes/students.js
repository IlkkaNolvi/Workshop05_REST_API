const express = require('express');

const router = express.Router();

// In-memory "database" for step 02 (DB integration comes later)
let students = [
  { id: 1, name: 'Mikko Virtanen', age: 22, major: 'Tietojenkäsittely' },
  { id: 2, name: 'Aino Mäkinen', age: 24, major: 'Tietotekniikka' },
];
let nextId = 3;

// GET /api/students — return all students
router.get('/', (req, res) => {
  res.json(students);
});

// GET /api/students/:id — return a single student
router.get('/:id', (req, res) => {
  const student = students.find(s => s.id === Number(req.params.id));
  if (!student) {
    return res.status(404).json({ error: 'Student not found' });
  }
  res.json(student);
});

// POST /api/students — create a new student
router.post('/', (req, res) => {
  const { name, age, major } = req.body;
  if (!name || !age || !major) {
    return res.status(400).json({ error: 'name, age and major are required' });
  }
  const student = { id: nextId++, name, age, major };
  students.push(student);
  res.status(201).json(student);
});

// PUT /api/students/:id — replace a student
router.put('/:id', (req, res) => {
  const index = students.findIndex(s => s.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  const { name, age, major } = req.body;
  if (!name || !age || !major) {
    return res.status(400).json({ error: 'name, age and major are required' });
  }
  students[index] = { id: students[index].id, name, age, major };
  res.json(students[index]);
});

// DELETE /api/students/:id — remove a student
router.delete('/:id', (req, res) => {
  const index = students.findIndex(s => s.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Student not found' });
  }
  students.splice(index, 1);
  res.json({ message: 'Student deleted successfully' });
});

module.exports = router;
