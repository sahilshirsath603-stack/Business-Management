import React, { useState, useEffect } from 'react';
import { ClockWidget } from '../components/ClockWidget';
import { LeaveModal } from '../components/LeaveModal';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { CalendarCheck, Clock, CheckCircle2, Plus, FileText, AlertCircle } from 'lucide-react';

export const EmployeeDashboard = ({ onNavigate }) => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [balances, setBalances] = useState({ sick: 10, casual: 12, annual: 15 });
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const [attendanceRes, leaveRes] = await Promise.all([
        api.getMyAttendanceLogs(),
        api.getMyLeaveRequests()
      ]);
      setLogs(attendanceRes.logs || []);
      setLeaves(leaveRes.leaves || []);
      setBalances(leaveRes.balance || { sick: 10, casual: 12, annual: 15 });
    } catch (err) {
      console.error('Failed to load employee dashboard data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Live polling for instant leave status updates
    const interval = setInterval(() => loadData(true), 3000);
    const handleFocus = () => loadData(true);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, []);

  const totalShifts = logs.length;
  const presentCount = logs.filter(l => l.status === 'present').length;
  const lateCount = logs.filter(l => l.status === 'late').length;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Welcome Banner */}
      <div className="glass-panel" style={{ padding: '1.75rem', background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: '800' }}>
          Welcome, {user?.name}! 👋
        </h2>
        <p style={{ color: 'var(--text-muted)', marginTop: '0.3rem', fontSize: '0.92rem' }}>
          Manage your daily check-in, attendance records, and leave requests effortlessly.
        </p>
      </div>

      {/* Clock Widget */}
      <ClockWidget onAttendanceChange={loadData} />

      {/* Quick Metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.25rem' }}>
        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Total Shift Logs</span>
            <Clock size={20} color="var(--accent-primary)" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800' }}>{totalShifts} Days</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Recorded this period</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>On-Time Check-ins</span>
            <CheckCircle2 size={20} color="#34d399" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#34d399' }}>{presentCount} Days</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Punctual attendance</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Casual Leave Balance</span>
            <CalendarCheck size={20} color="#fbbf24" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#fbbf24' }}>{balances.casual} Days</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Available remaining</p>
        </div>

        <div className="glass-panel" style={{ padding: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.8rem' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: '600' }}>Sick Leave Balance</span>
            <CalendarCheck size={20} color="#60a5fa" />
          </div>
          <div style={{ fontSize: '1.8rem', fontWeight: '800', color: '#60a5fa' }}>{balances.sick} Days</div>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Available remaining</p>
        </div>
      </div>

      {/* Main Content Grid: Attendance & Leaves */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '1.5rem' }}>
        {/* Recent Attendance Logs */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>Recent Attendance History</h3>
            <button onClick={() => onNavigate('attendance')} className="btn-secondary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>
              View All
            </button>
          </div>

          {logs.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
              No attendance records found yet.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Date</th>
                    <th>Clock In</th>
                    <th>Clock Out</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.slice(0, 5).map(log => (
                    <tr key={log.id || log._id}>
                      <td>{log.date}</td>
                      <td>{log.clockIn || '--'}</td>
                      <td>{log.clockOut || '--'}</td>
                      <td>
                        <span className={`status-pill ${log.status}`}>{log.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Leave Requests & Balance */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>My Leave Requests</h3>
            <button onClick={() => setIsLeaveModalOpen(true)} className="btn-primary" style={{ padding: '0.5rem 0.9rem', fontSize: '0.82rem' }}>
              <Plus size={16} /> Apply Leave
            </button>
          </div>

          {leaves.length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', textAlign: 'center', padding: '2rem 0' }}>
              No active leave requests.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
              {leaves.slice(0, 4).map(l => (
                <div
                  key={l.id || l._id}
                  style={{
                    padding: '1rem',
                    borderRadius: 'var(--radius-md)',
                    background: 'rgba(15, 23, 42, 0.5)',
                    border: '1px solid var(--border-glass)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontWeight: '700', fontSize: '0.9rem' }}>{l.type}</span>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>({l.days} Days)</span>
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {l.startDate} to {l.endDate}
                    </p>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>
                      Reason: {l.reason}
                    </p>
                  </div>
                  <span className={`status-pill ${l.status}`}>{l.status}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
