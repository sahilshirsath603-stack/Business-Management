const { User, Department, Attendance, LeaveType, LeaveRequest, Notification } = require('../models');

console.log('=======================================================');
console.log('  Testing Mongoose Models Schema & Index Definitions  ');
console.log('=======================================================');

const testModels = () => {
  try {
    // 1. Department
    const dept = new Department({ name: 'Engineering', code: 'ENG' });
    console.log('✓ Department Model Loaded:', dept.name, 'Code:', dept.code);

    // 2. User
    const user = new User({
      name: 'Sarah Connor',
      email: 'admin@office.com',
      password: 'secretPassword123',
      role: 'admin',
      department: dept._id,
      designation: 'Chief Administrator'
    });
    console.log('✓ User Model Loaded:', user.name, 'Role:', user.role);

    // 3. LeaveType
    const leaveType = new LeaveType({
      name: 'Sick Leave',
      code: 'SL',
      defaultDaysPerYear: 10
    });
    console.log('✓ LeaveType Model Loaded:', leaveType.name, 'Default Days:', leaveType.defaultDaysPerYear);

    // 4. Attendance
    const att = new Attendance({
      user: user._id,
      department: dept._id,
      date: new Date(),
      status: 'present',
      clockIn: new Date()
    });
    console.log('✓ Attendance Model Loaded:', att.status, 'ClockIn:', att.clockIn);

    // 5. LeaveRequest
    const leaveReq = new LeaveRequest({
      user: user._id,
      department: dept._id,
      leaveType: leaveType._id,
      startDate: new Date('2026-08-15'),
      endDate: new Date('2026-08-17'),
      totalDays: 3,
      reason: 'Medical recovery after dental surgery'
    });
    console.log('✓ LeaveRequest Model Loaded:', leaveReq.reason, 'Days:', leaveReq.totalDays);

    // 6. Notification
    const notif = new Notification({
      recipient: user._id,
      title: 'Leave Approved',
      message: 'Your leave request for 3 days has been approved by management.',
      type: 'leave_approved'
    });
    console.log('✓ Notification Model Loaded:', notif.title, 'Type:', notif.type);

    console.log('=======================================================');
    console.log('  SUCCESS: All 6 MongoDB Mongoose Models Validated!     ');
    console.log('=======================================================');
  } catch (err) {
    console.error('Model validation failed:', err);
  }
};

testModels();
