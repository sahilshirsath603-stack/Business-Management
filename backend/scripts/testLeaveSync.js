const db = require('../database/db');

console.log('--- TESTING LEAVE APPROVAL & INSTANT SYNC ---');

try {
  const users = db.getAllUsers();
  const emp = users.find(u => u.email !== 'sahil@gmail.com') || users[0];
  const empId = emp.id || emp._id;
  console.log('Testing with User:', emp.name, 'ID:', empId);

  // 1. Submit leave request for employee
  const leave = db.createLeaveRequest(empId, {
    type: 'Casual Leave (CL)',
    startDate: '2026-09-01',
    endDate: '2026-09-02',
    reason: 'Personal work'
  });
  console.log('Created Leave Request ID:', leave.id, 'Status:', leave.status);

  // 2. Approve leave request as Manager
  const updatedLeave = db.updateLeaveStatus(leave.id, 'approved', 'Approved by Manager');
  console.log('Updated Leave Status:', updatedLeave.id, 'New Status:', updatedLeave.status);

  // 3. Fetch employee leaves and balance
  const employeeLeaves = db.getLeaveRequests({ userId: empId });
  console.log('All Leaves for User:', employeeLeaves);

  const foundTargetLeave = employeeLeaves.find(l => String(l.id || l._id) === String(leave.id || leave._id));
  console.log('Target Leave Found:', foundTargetLeave);

} catch (err) {
  console.error('❌ ERROR:', err.message);
}
