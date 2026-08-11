const db = require('../database/db');
console.log('All Users in DB:', db.getAllUsers().map(u => ({ id: u.id, _id: u._id, name: u.name, email: u.email })));
