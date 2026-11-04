const mongoose = require('mongoose');

const studentSchema = new mongoose.Schema(
  {
    studentNumber: {
      type: String,
      required: true,
      unique: true,
      match: /^29\d{5}$/,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      required: true,
    },
    major: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Student', studentSchema);
