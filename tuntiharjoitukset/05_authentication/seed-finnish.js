const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');
const Course = require('./models/Course');

const students = [
  { studentNumber: '2961001', name: 'Eetu Nieminen', age: 22, major: 'Ohjelmistokehitys' },
  { studentNumber: '2961002', name: 'Laura Salonen', age: 24, major: 'Tietotekniikka' },
  { studentNumber: '2961003', name: 'Oskari Heikkila', age: 21, major: 'Tietojenkasittely' },
  { studentNumber: '2961004', name: 'Emilia Kallio', age: 23, major: 'Kyberturvallisuus' },
  { studentNumber: '2961005', name: 'Juho Lehtonen', age: 25, major: 'Pilvipalvelut' },
];

const courses = [
  { code: 'IT61001', name: 'Web-ohjelmointi', credits: 5, instructor: 'Matti Laine' },
  { code: 'IT61002', name: 'Tietokannat', credits: 4, instructor: 'Riikka Koskinen' },
  { code: 'IT61003', name: 'Palvelinohjelmointi', credits: 5, instructor: 'Janne Aalto' },
  { code: 'IT61004', name: 'Tietoturvan perusteet', credits: 4, instructor: 'Sanna Miettinen' },
  { code: 'IT61005', name: 'Ohjelmistotestaus', credits: 3, instructor: 'Pekka Rasanen' },
];

async function seedFinnishData() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Create a .env file first.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'opintorekisteri' });
    console.log('Connected to MongoDB');

    await Student.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing students and courses');

    const createdStudents = await Student.insertMany(students);
    console.log(`Seeded ${createdStudents.length} students:`);
    createdStudents.forEach(student => {
      console.log(`  - ${student.name} (${student.studentNumber})`);
    });

    const createdCourses = await Course.insertMany(courses);
    console.log(`Seeded ${createdCourses.length} courses:`);
    createdCourses.forEach(course => {
      console.log(`  - ${course.name} (${course.code})`);
    });

    console.log('Finnish sample data seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seedFinnishData();