const mongoose = require('mongoose');
require('dotenv').config();

const Student = require('./models/Student');
const Course = require('./models/Course');

const students = [
  { studentNumber: '2912345', name: 'Mikko Virtanen', age: 22, major: 'Tietojenkäsittely' },
  { studentNumber: '2923456', name: 'Aino Mäkinen', age: 24, major: 'Tietotekniikka' },
  { studentNumber: '2934567', name: 'Juhani Korhonen', age: 21, major: 'Ohjelmistokehitys' },
  { studentNumber: '2945678', name: 'Sari Leinonen', age: 23, major: 'Kyberturvallisuus' },
  { studentNumber: '2956789', name: 'Petteri Hämäläinen', age: 25, major: 'Tekoäly ja data-analytiikka' },
];

const courses = [
  { code: 'IT12345', name: 'Ohjelmoinnin perusteet', credits: 5, instructor: 'Mikael Järvi' },
  { code: 'IT23456', name: 'Tietokannat', credits: 4, instructor: 'Liisa Virtanen' },
  { code: 'IT34567', name: 'Verkkosovellukset', credits: 5, instructor: 'Jukka Mäkelä' },
  { code: 'IT45678', name: 'Kyberturvallisuuden perusteet', credits: 4, instructor: 'Anna Heikkinen' },
  { code: 'IT56789', name: 'Pilvipalvelut ja DevOps', credits: 5, instructor: 'Timo Laitinen' },
];

async function seed() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Create a .env file first.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'opintorekisteri' });
    console.log('Connected to MongoDB');

    await Student.deleteMany({});
    await Course.deleteMany({});
    console.log('Cleared existing data');

    const createdStudents = await Student.insertMany(students);
    console.log(`Seeded ${createdStudents.length} students:`);
    createdStudents.forEach(s => console.log(`  - ${s.name} (${s.major})`));

    const createdCourses = await Course.insertMany(courses);
    console.log(`Seeded ${createdCourses.length} courses:`);
    createdCourses.forEach(c => console.log(`  - ${c.name} (${c.credits} op)`));

    console.log('Seeding complete!');
  } catch (error) {
    console.error('Seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

seed();
