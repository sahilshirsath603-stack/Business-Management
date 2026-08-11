import React, { useState, useEffect } from 'react';
import { ClockWidget } from '../components/ClockWidget';
import { LeaveReviewModal } from '../components/LeaveReviewModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Users, CheckCircle2, AlertTriangle, Clock, CalendarCheck, Search, Calendar, Check, X, UserPlus, ShieldAlert, MessageSquare } from 'lucide-react';

export const ManagerDashboard = ({ onNavigate }) => {
  const { user, showToast } = useAuth();
  const [stats, setStats] = useState(null);
  const [teamLogs, setTeamLogs] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [pendingAccessUsers, setPendingAccessUsers] = useState([]);
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);

  // Filters
  const [dateFilter, setDateFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsRes, attRes, leaveRes, pendingAccessRes] = await Promise.all([
        api.getDashboardStats(),
        api.getTeamAttendance({ date: dateFilter }),
        api.getTeamLeaveRequests({ status: 'pending' }),
        api.getPendingAccessRequests()
      ]);
      setStats(statsRes.stats);
      setTeamLogs(attRes.logs || []);
      setPendingLeaves(leaveRes.leaves || []);
      setPendingAccessUsers(pendingAccessRes.pending || []);
    } catch (err) {
      console.error('Failed to load manager dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [dateFilter]);

  const handleAccessAction = async (userId, action) => {
    setActionId(userId);
    try {
      const res = await api.updateAccessRequest(userId, action);
      showToast(res.message, 'success');
      loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setActionId(null);
    }
  };

  const filteredLogs = teamLogs.filter(log => {
    const isSelf = String(log.userId) === String(user?.id || user?._id);
    if (isSelf || (log.userRole && log.userRole !== 'employee')) {
      return false;
    }
    return log.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
           log.department.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Manager Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.2) 0%, rgba(99, 102, 241, 0.1) 100%)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
          <span className="role-pill manager">Manager Console</span>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Department: {user?.department}</span>
        </div>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
          Department Dashboard - {user?.department}
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem', fontSize: '0.92rem' }}>
          Approve new employee access requests, review leave applications with comments, and track team punctuality.
        </p>
      </div>

      {/* NEW EMPLOYEE ACCESS APPROVAL REQUESTS CARD */}
      {pendingAccessUsers.length > 0 && (
        <div className="glass-panel animate-fade-in" style={{ padding: '1.5rem', border: '1px solid rgba(245, 158, 11, 0.4)', background: 'rgba(245, 158, 11, 0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
            <UserPlus size={22} color="#fbbf24" />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: '800', color: '#fbbf24' }}>
                New Employee Access Approvals ({pendingAccessUsers.length})
              </h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                The following new staff members registered for {user?.department} and require manager approval to access the system:
              </p>
            </div>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Email Address</th>
                  <th>Designation</th>
                  <th>Registration Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingAccessUsers.map(emp => (
                  <tr key={emp.id}>
                    <td>
                      <span style={{ fontWeight: '700' }}>{emp.name}</span>
                    </td>
                    <td style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{emp.email}</td>
                    <td>{emp.designation || 'Software Engineer'}</td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>{emp.createdAt}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button
                          onClick={() => handleAccessAction(emp.id, 'approve')}
                          disabled={actionId === emp.id}
                          className="btn-success"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <Check size={14} /> Approve Access
                        </button>
                        <button
                          onClick={() => handleAccessAction(emp.id, 'decline')}
                          disabled={actionId === emp.id}
                          className="btn-danger"
                          style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          <X size={14} /> Decline
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Clock Widget */}
      <ClockWidget onAttendanceChange={loadData} />

      {/* 5 Manager KPI Metrics Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Team Members</span>
            <Users size={20} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{stats?.totalTeamMembers || 0} Staff</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Active team accounts</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Present Today</span>
            <CheckCircle2 size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#34d399' }}>{stats?.presentToday || 0} Members</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Punctual check-ins</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Late Today</span>
            <Clock size={20} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24' }}>{stats?.lateToday || 0} Members</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>After 10:15 AM</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Absent Today</span>
            <AlertTriangle size={20} color="#fb7185" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fb7185' }}>{stats?.absentToday || 0} Members</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Not clocked in</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Pending Leave Requests</span>
            <CalendarCheck size={20} color="#60a5fa" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#60a5fa' }}>
            {stats?.pendingLeavesCount || pendingLeaves.length} Requests
          </div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Action required</p>
        </div>
      </div>

      {/* Pending Leave Requests Hub */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <CalendarCheck size={20} color="#60a5fa" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Pending Team Leave Approvals</h3>
          </div>
          <button onClick={() => onNavigate('leaves')} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
            All Leaves Hub
          </button>
        </div>

        {pendingLeaves.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.92rem' }}>
            <CheckCircle2 size={36} color="#34d399" style={{ margin: '0 auto 0.8rem auto', display: 'block' }} />
            All team leave requests are up to date! No pending approvals.
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Leave Type</th>
                  <th>Dates</th>
                  <th>Days</th>
                  <th>Reason</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingLeaves.map(leave => (
                  <tr key={leave.id}>
                    <td>
                      <div style={{ fontWeight: '700' }}>{leave.userName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{leave.department}</div>
                    </td>
                    <td>{leave.type}</td>
                    <td>{leave.startDate} → {leave.endDate}</td>
                    <td>{leave.days} Days</td>
                    <td style={{ maxWidth: '220px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {leave.reason}
                    </td>
                    <td>
                      <button
                        onClick={() => { setSelectedLeave(leave); setIsReviewModalOpen(true); }}
                        className="btn-primary"
                        style={{ padding: '0.4rem 0.85rem', fontSize: '0.8rem' }}
                      >
                        <MessageSquare size={14} /> Review & Decision
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Team Attendance Roster with Filters */}
      <div className="glass-panel" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
          <h3 style={{ fontSize: '1.15rem', fontWeight: '700' }}>Team Attendance Roster</h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}>
            <div style={{ position: 'relative', width: '200px' }}>
              <Search size={16} style={{ position: 'absolute', left: '0.8rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-dim)' }} />
              <input
                type="text"
                className="glass-input"
                style={{ paddingLeft: '2.4rem', padding: '0.45rem 0.8rem', fontSize: '0.82rem' }}
                placeholder="Search Employee..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <Calendar size={16} color="var(--text-muted)" />
              <input
                type="date"
                className="glass-input"
                style={{ padding: '0.45rem 0.8rem', fontSize: '0.82rem', width: '160px' }}
                value={dateFilter}
                onChange={(e) => setDateFilter(e.target.value)}
              />
            </div>

            {dateFilter && (
              <button onClick={() => setDateFilter('')} className="btn-secondary" style={{ padding: '0.45rem 0.8rem', fontSize: '0.8rem' }}>
                Reset Date
              </button>
            )}
          </div>
        </div>

        {filteredLogs.length === 0 ? (
          <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '2rem 0' }}>
            No team check-ins recorded for this selection.
          </p>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Date</th>
                  <th>Clock In</th>
                  <th>Clock Out</th>
                  <th>Status</th>
                  <th>Notes</th>
                </tr>
              </thead>
              <tbody>
                {filteredLogs.map(log => (
                  <tr key={log.id}>
                    <td style={{ fontWeight: '600' }}>{log.userName}</td>
                    <td>{log.date}</td>
                    <td>{log.clockIn || '--'}</td>
                    <td>{log.clockOut || '--'}</td>
                    <td>
                      <span className={`status-pill ${log.status}`}>{log.status}</span>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{log.notes || '--'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <LeaveReviewModal
        isOpen={isReviewModalOpen}
        leave={selectedLeave}
        onClose={() => setIsReviewModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
