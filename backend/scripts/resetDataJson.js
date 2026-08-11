const fs = require('fs');
const path = require('path');

const dataFile = path.join(__dirname, '../database/data.json');
if (fs.existsSync(dataFile)) {
  fs.unlinkSync(dataFile);
  console.log('Deleted data.json successfully.');
}
