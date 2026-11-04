const express = require('express');
const Course = require('../models/Course');

const router = express.Router();

// GET /api/courses — return all courses
router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().sort({ createdAt: -1 });
    res.json(courses);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/courses/:code — return a single course
router.get('/:code', async (req, res) => {
  try {
    const course = await Course.findOne({ code: req.params.code });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// POST /api/courses — create a new course
router.post('/', async (req, res) => {
  try {
    const course = await Course.create(req.body);
    res.status(201).json(course);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Course code must be unique' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// PUT /api/courses/:code — replace a course
router.put('/:code', async (req, res) => {
  try {
    const course = await Course.findOneAndUpdate({ code: req.params.code }, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json(course);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Course code must be unique' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// PATCH /api/courses/:code — partially update a course
router.patch('/:code', async (req, res) => {
  try {
    const allowedFields = ['code', 'name', 'credits', 'instructor'];
    const updateData = {};

    for (const field of allowedFields) {
      if (Object.prototype.hasOwnProperty.call(req.body, field)) {
        updateData[field] = req.body[field];
      }
    }

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({ error: 'At least one of code, name, credits, instructor must be provided' });
    }

    const course = await Course.findOneAndUpdate({ code: req.params.code }, { $set: updateData }, {
      new: true,
      runValidators: true,
    });

    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json(course);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Course code must be unique' });
    }
    if (error.name === 'ValidationError') {
      return res.status(400).json({ error: error.message });
    }
    res.status(500).json({ error: error.message });
  }
});

// DELETE /api/courses/:code — remove a course
router.delete('/:code', async (req, res) => {
  try {
    const course = await Course.findOneAndDelete({ code: req.params.code });
    if (!course) {
      return res.status(404).json({ error: 'Course not found' });
    }
    res.json({ message: 'Course deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
