const mongoose = require('mongoose');
require('dotenv').config();

async function dropCollections() {
  if (!process.env.MONGODB_URI) {
    console.error('MONGODB_URI is missing. Create a .env file first.');
    process.exit(1);
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, { dbName: 'opintorekisteri' });
    console.log('Connected to MongoDB');

    const collections = await mongoose.connection.db.listCollections().toArray();
    const collectionNames = collections.map(collection => collection.name);

    for (const name of ['students', 'courses']) {
      if (collectionNames.includes(name)) {
        await mongoose.connection.db.dropCollection(name);
        console.log(`Dropped collection: ${name}`);
      } else {
        console.log(`Collection not found, skipped: ${name}`);
      }
    }

    console.log('Collection cleanup complete!');
  } catch (error) {
    console.error('Collection cleanup failed:', error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB');
  }
}

dropCollections();
