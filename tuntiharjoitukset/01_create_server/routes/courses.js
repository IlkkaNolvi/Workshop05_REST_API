const express = require('express');

const router = express.Router();

// In-memory "database"
let courses = [
  { code: 'IT12345', name: 'Ohjelmoinnin perusteet', credits: 5, instructor: 'Mikael Järvi' },
  { code: 'IT23456', name: 'Tietokannat', credits: 4, instructor: 'Liisa Virtanen' },
  { code: 'IT34567', name: 'Verkkosovellukset', credits: 5, instructor: 'Jukka Mäkelä' },
];

// GET /api/courses — return all courses
router.get('/', (req, res) => {
  res.json(courses);
});

// GET /api/courses/:code — return a single course
router.get('/:code', (req, res) => {
  const course = courses.find(c => c.code === req.params.code);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

// POST /api/courses — create a new course
router.post('/', (req, res) => {
  const { code, name, credits, instructor } = req.body;
  if (!code || !name || !credits || !instructor) {
    return res.status(400).json({ error: 'code, name, credits and instructor are required' });
  }
  if (!/^IT\d{5}$/.test(code)) {
    return res.status(400).json({ error: 'code must be 7 characters and start with IT' });
  }
  const exists = courses.some(c => c.code === code);
  if (exists) {
    return res.status(400).json({ error: 'Course code must be unique' });
  }
  const course = { code, name, credits, instructor };
  courses.push(course);
  res.status(201).json(course);
});

// PUT /api/courses/:code — replace a course
router.put('/:code', (req, res) => {
  const index = courses.findIndex(c => c.code === req.params.code);
  if (index === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const { code, name, credits, instructor } = req.body;
  if (!code || !name || !credits || !instructor) {
    return res.status(400).json({ error: 'code, name, credits and instructor are required' });
  }
  if (!/^IT\d{5}$/.test(code)) {
    return res.status(400).json({ error: 'code must be 7 characters and start with IT' });
  }
  const exists = courses.some((c, i) => c.code === code && i !== index);
  if (exists) {
    return res.status(400).json({ error: 'Course code must be unique' });
  }
  courses[index] = { code, name, credits, instructor };
  res.json(courses[index]);
});

// DELETE /api/courses/:code — remove a course
router.delete('/:code', (req, res) => {
  const index = courses.findIndex(c => c.code === req.params.code);
  if (index === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }
  courses.splice(index, 1);
  res.json({ message: 'Course deleted successfully' });
});

module.exports = router;
