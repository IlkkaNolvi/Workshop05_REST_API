const express = require('express');
const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

const router = express.Router();

function authenticateToken(req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Authorization token is missing' });
  }

  // Extract the JWT part from the "Bearer <token>" header value.
  const token = authHeader.split(' ')[1];

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    req.user = payload;
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// POST /api/students/login — issue JWT token
router.post('/login', async (req, res) => {
  try {
    const { studentNumber } = req.body;

    if (!studentNumber) {
      return res.status(400).json({ error: 'studentNumber is required' });
    }

    const student = await Student.findOne({ studentNumber });
    if (!student) {
      return res.status(401).json({ error: 'Invalid student number' });
    }

    const token = jwt.sign(
      {
        studentId: student._id.toString(),
        studentNumber: student.studentNumber,
      },
      process.env.JWT_SECRET || 'dev-secret',
      { expiresIn: '1h' }
    );

    return res.json({
      message: 'Login successful',
      token,
      expiresIn: '1h',
    });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

// POST /api/students/logout — client should remove token on logout
router.post('/logout', authenticateToken, (req, res) => {
  return res.json({
    message: 'Logout successful. Remove the token from client storage.',
  });
});

// GET /api/students — return all students
router.get('/', async (req, res) => {
  try {
    const students = await Student.find().sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET /api/students/profile — return authentication status as boolean
router.get('/profile', (req, res) => {
  const authHeader = req.headers.authorization;
  console.log('Received /profile request with Authorization header:', authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.json({ authenticated: false });
  }

  const token = authHeader.split(' ')[1];

  try {
    jwt.verify(token, process.env.JWT_SECRET || 'dev-secret');
    return res.json({ authenticated: true });
  } catch (error) {
    return res.json({ authenticated: false });
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
router.post('/', authenticateToken, async (req, res) => {
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
router.put('/:studentNumber', authenticateToken, async (req, res) => {
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
router.patch('/:studentNumber', authenticateToken, async (req, res) => {
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
router.delete('/:studentNumber', authenticateToken, async (req, res) => {
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
