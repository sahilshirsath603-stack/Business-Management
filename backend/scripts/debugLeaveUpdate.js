const db = require('../database/db');

const users = db.getAllUsers();
const emp = users[0];
console.log('User:', emp.name, emp.id);

const newLeave = db.createLeaveRequest(emp.id, {
  type: 'Casual Leave (CL)',
  startDate: '2026-10-01',
  endDate: '2026-10-02',
  reason: 'Test'
});
console.log('1. Created Leave:', newLeave.id, newLeave.status);

const res = db.updateLeaveStatus(newLeave.id, 'approved', 'Test approval');
console.log('2. Return of updateLeaveStatus:', res);

const reload = db.getLeaveRequests({ userId: emp.id });
console.log('3. Reload from DB:', reload.find(l => String(l.id) === String(newLeave.id)));
