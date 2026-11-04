const express = require('express');
const Student = require('../models/Student');

const router = express.Router();

// GET /api/students — return all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/:studentNumber — return a single student
router.get('/:studentNumber', async (req, res) => {
  try {
    const student = await Student.findOne({ studentNumber: req.params.studentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/students — create a new student
router.post('/', async (req, res) => {
  try {
    const student = await Student.create(req.body);
    res.status(201).json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Student number must be unique' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/students/:studentNumber — replace a student
router.put('/:studentNumber', async (req, res) => {
  try {
    const student = await Student.findOneAndUpdate({ studentNumber: req.params.studentNumber }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Student number must be unique' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/students/:studentNumber — partially update a student
router.patch('/:studentNumber', async (req, res) => {
  try {
    const allowedFields = ['studentNumber', 'name', 'age', 'major'];
    const updateData = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one of studentNumber, name, age, major must be provided' });
    }

    const student = await Student.findOneAndUpdate(
      { studentNumber: req.params.studentNumber },
      { $set: updateData },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }

    res.json(student);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Student number must be unique' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/students/:studentNumber — remove a student
router.delete('/:studentNumber', async (req, res) => {
  try {
    const student = await Student.findOneAndDelete({ studentNumber: req.params.studentNumber });
    if (!student) {
      return res.status(404).json({ error: 'Student not found' });
    }
    res.json({ message: 'Student deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
