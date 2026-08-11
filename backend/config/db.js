const mongoose = require('mongoose');

const connectDB = async () => {
  const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/office_management_db';

  try {
    const conn = await mongoose.connect(connUri);

    console.log(`=======================================================`);
    console.log(`  MongoDB Local Connected: ${conn.connection.host}:${conn.connection.port}`);
    console.log(`  Database Name: ${conn.connection.name}`);
    console.log(`  MongoDB Compass Connection String:`);
    console.log(`  mongodb://127.0.0.1:27017/office_management_db`);
    console.log(`=======================================================`);

    return conn;
  } catch (err) {
    console.warn(`\n[MongoDB Connection Notice]: Could not connect to local MongoDB daemon at ${connUri}`);
    console.warn(`Reason: ${err.message}`);
    console.warn(`-> If you have MongoDB installed locally, start the service (e.g. 'net start MongoDB' or 'mongod')`);
    console.warn(`-> Open MongoDB Compass and paste: mongodb://127.0.0.1:27017/office_management_db\n`);
    return null;
  }
};

module.exports = connectDB;
