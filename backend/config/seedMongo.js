const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { Department, User, LeaveType, Attendance, LeaveRequest, Notification } = require('../models');

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/office_management_db';

const seedMongoDB = async () => {
  try {
    console.log('Connecting to local MongoDB for Blen Digital seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB:', MONGODB_URI);

    // Clear existing collections
    await Promise.all([
      Department.deleteMany({}),
      User.deleteMany({}),
      LeaveType.deleteMany({}),
      Attendance.deleteMany({}),
      LeaveRequest.deleteMany({}),
      Notification.deleteMany({})
    ]);
    console.log('Cleared existing collections.');

    // 1. Seed Departments
    const depts = await Department.insertMany([
      { name: 'Management', code: 'MGMT', description: 'Agency Executive Leadership' },
      { name: 'Engineering', code: 'ENG', description: 'Web Development & Tech Production' },
      { name: 'Marketing', code: 'MKT', description: 'Social Media & Creative Campaigns' },
      { name: 'Human Resources', code: 'HR', description: 'Talent & HR Operations' },
      { name: 'Finance', code: 'FIN', description: 'Finance & Accounting' }
    ]);
    console.log(`✓ Seeded ${depts.length} Departments.`);

    const mgmtDept = depts.find(d => d.code === 'MGMT');
    const engDept = depts.find(d => d.code === 'ENG');
    const mktDept = depts.find(d => d.code === 'MKT');

    // 2. Seed Password Hashes
    const sahilHash = await bcrypt.hash('Password', 10);
    const managerHash = await bcrypt.hash('manager123', 10);
    const empHash = await bcrypt.hash('employee123', 10);

    // 3. Seed Users with Blen Digital Agency Designations
    const sahilAdmin = new User({
      name: 'Sahil Admin',
      email: 'sahil@gmail.com',
      password: sahilHash,
      role: 'admin',
      department: mgmtDept._id,
      designation: 'Super System Administrator',
      status: 'active'
    });
    await sahilAdmin.save();

    const davidManager = new User({
      name: 'David Miller',
      email: 'manager@office.com',
      password: managerHash,
      role: 'manager',
      department: mktDept._id,
      designation: 'Social Media Manager',
      reportsTo: sahilAdmin._id,
      status: 'active'
    });
    await davidManager.save();

    const alexEmp = new User({
      name: 'Alex Johnson',
      email: 'employee@office.com',
      password: empHash,
      role: 'employee',
      department: engDept._id,
      designation: 'Web Developer',
      reportsTo: davidManager._id,
      status: 'active'
    });
    await alexEmp.save();

    console.log('✓ Seeded 3 Users (Sahil Admin, Social Media Manager, Web Developer).');

    // 4. Seed Leave Types (Casual Leave: 12, Sick Leave: 10, Earned Leave: 15)
    const leaveTypes = await LeaveType.insertMany([
      { name: 'Casual Leave (CL)', code: 'CL', defaultDaysPerYear: 12, requiresApproval: true, isPaid: true },
      { name: 'Sick Leave (SL)', code: 'SL', defaultDaysPerYear: 10, requiresApproval: true, isPaid: true },
      { name: 'Earned Leave (EL)', code: 'EL', defaultDaysPerYear: 15, requiresApproval: true, isPaid: true }
    ]);
    console.log(`✓ Seeded ${leaveTypes.length} Leave Types with Yearly Limits (CL: 12, SL: 10, EL: 15).`);

    // 5. Seed Attendance Logs
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendances = await Attendance.insertMany([
      {
        user: alexEmp._id,
        department: engDept._id,
        date: today,
        clockIn: new Date(),
        status: 'present',
        notes: 'Remote working'
      },
      {
        user: davidManager._id,
        department: mktDept._id,
        date: today,
        clockIn: new Date(),
        status: 'present',
        notes: 'In Office'
      }
    ]);
    console.log(`✓ Seeded ${attendances.length} Attendance Logs.`);

    // 6. Seed Leave Requests
    const sickLeaveType = leaveTypes.find(l => l.code === 'SL');

    const leaveReqs = await LeaveRequest.insertMany([
      {
        user: alexEmp._id,
        department: engDept._id,
        leaveType: sickLeaveType._id,
        startDate: new Date('2026-08-15'),
        endDate: new Date('2026-08-16'),
        totalDays: 2,
        reason: 'Medical checkup',
        status: 'pending'
      }
    ]);
    console.log(`✓ Seeded ${leaveReqs.length} Leave Requests.`);

    // 7. Seed Notifications
    const notifs = await Notification.insertMany([
      {
        recipient: sahilAdmin._id,
        title: 'Blen Digital System Active',
        message: 'Blen Digital - Digital Marketing Agency portal is online.',
        type: 'system_announcement'
      }
    ]);
    console.log(`✓ Seeded ${notifs.length} Notifications.`);

    console.log('=======================================================');
    console.log('  SUCCESS: Blen Digital Database Seeded Successfully!  ');
    console.log('=======================================================');

    process.exit(0);
  } catch (err) {
    console.error('MongoDB Seeding Failed:', err);
    process.exit(1);
  }
};

seedMongoDB();
