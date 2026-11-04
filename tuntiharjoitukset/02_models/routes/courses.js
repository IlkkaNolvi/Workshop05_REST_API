const express = require('express');

const router = express.Router();

// In-memory "database" for step 02 (DB integration comes later)
let courses = [
  { id: 1, name: 'Ohjelmoinnin perusteet', credits: 5, instructor: 'Mikael Järvi' },
  { id: 2, name: 'Tietokannat', credits: 4, instructor: 'Liisa Virtanen' },
  { id: 3, name: 'Verkkosovellukset', credits: 5, instructor: 'Jukka Mäkelä' },
];
let nextId = 4;

// GET /api/courses — return all courses
router.get('/', (req, res) => {
  res.json(courses);
});

// GET /api/courses/:id — return a single course
router.get('/:id', (req, res) => {
  const course = courses.find(c => c.id === Number(req.params.id));
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json(course);
});

// POST /api/courses — create a new course
router.post('/', (req, res) => {
  const { name, credits, instructor } = req.body;
  if (!name || !credits || !instructor) {
    return res.status(400).json({ error: 'name, credits and instructor are required' });
  }
  const course = { id: nextId++, name, credits, instructor };
  courses.push(course);
  res.status(201).json(course);
});

// PUT /api/courses/:id — replace a course
router.put('/:id', (req, res) => {
  const index = courses.findIndex(c => c.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }
  const { name, credits, instructor } = req.body;
  if (!name || !credits || !instructor) {
    return res.status(400).json({ error: 'name, credits and instructor are required' });
  }
  courses[index] = { id: courses[index].id, name, credits, instructor };
  res.json(courses[index]);
});

// PATCH /api/courses/:id — partially update a course
router.patch('/:id', (req, res) => {
  const index = courses.findIndex(c => c.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }

  const allowedFields = ['name', 'credits', 'instructor'];
  const updateData = {};

  for (const field of allowedFields) {
    if (Object.prototype.hasOwnProperty.call(req.body, field)) {
      updateData[field] = req.body[field];
    }
  }

  if (Object.keys(updateData).length === 0) {
    return res.status(400).json({ error: 'At least one of name, credits, instructor must be provided' });
  }

  courses[index] = { ...courses[index], ...updateData };
  res.json(courses[index]);
});

// DELETE /api/courses/:id — remove a course
router.delete('/:id', (req, res) => {
  const index = courses.findIndex(c => c.id === Number(req.params.id));
  if (index === -1) {
    return res.status(404).json({ error: 'Course not found' });
  }
  courses.splice(index, 1);
  res.json({ message: 'Course deleted successfully' });
});

module.exports = router;
