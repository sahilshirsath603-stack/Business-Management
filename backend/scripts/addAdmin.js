const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');

const DB_FILE = path.join(__dirname, '../database/data.json');

const addAdminUser = () => {
  try {
    const raw = fs.readFileSync(DB_FILE, 'utf8');
    const db = JSON.parse(raw);

    const email = 'sahil@gmail.com';
    const password = 'Password';

    // Check if user exists
    const existingIdx = db.users.findIndex(u => u.email.toLowerCase() === email.toLowerCase());

    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const adminUser = {
      id: existingIdx !== -1 ? db.users[existingIdx].id : 'u-admin-sahil',
      name: 'Sahil Admin',
      email: email,
      password: hashedPassword,
      role: 'admin',
      department: 'Management',
      designation: 'Super System Administrator',
      reportsTo: null,
      status: 'active',
      createdAt: new Date().toISOString().split('T')[0]
    };

    if (existingIdx !== -1) {
      db.users[existingIdx] = adminUser;
      console.log(`Updated existing user ${email} to Admin with new password.`);
    } else {
      db.users.unshift(adminUser);
      db.leaveBalances[adminUser.id] = { sick: 15, casual: 15, annual: 20 };
      console.log(`Created new Admin account: ${email}`);
    }

    fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
    console.log('Admin account successfully persisted in data.json!');
  } catch (err) {
    console.error('Failed to add admin user:', err.message);
  }
};

addAdminUser();
