import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { LeaveModal } from '../components/LeaveModal';
import { CalendarCheck, Plus, Check, X, Filter, Clock, AlertCircle } from 'lucide-react';

export const LeavePage = () => {
  const { user, showToast } = useAuth();
  const [activeSubTab, setActiveSubTab] = useState(user.role === 'employee' ? 'my' : 'team');
  const [myLeaves, setMyLeaves] = useState([]);
  const [teamLeaves, setTeamLeaves] = useState([]);
  const [balances, setBalances] = useState({ sick: 10, casual: 12, annual: 15 });
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const loadData = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const myRes = await api.getMyLeaveRequests();
      setMyLeaves(myRes.leaves || []);
      setBalances(myRes.balance || { sick: 10, casual: 12, annual: 15 });

      if (user.role === 'manager' || user.role === 'admin') {
        const teamRes = user.role === 'admin' ? await api.getAllLeaveRequests() : await api.getTeamLeaveRequests();
        setTeamLeaves(teamRes.leaves || []);
      }
    } catch (err) {
      console.error('Failed to load leave page data:', err);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  useEffect(() => {
    loadData();

    // Live Instant Polling (every 3 seconds) for instant status feedback
    const interval = setInterval(() => {
      loadData(true);
    }, 3000);

    // Instant refresh on tab focus
    const handleFocus = () => loadData(true);
    window.addEventListener('focus', handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', handleFocus);
    };
  }, [user]);

  const handleUpdateStatus = async (leaveId, status) => {
    setProcessingId(leaveId);
    try {
      const comment = status === 'approved' ? 'Approved by Manager/Admin' : 'Rejected by Manager/Admin';
      const res = await api.updateLeaveStatus(leaveId, status, comment);
      showToast(res.message, 'success');
      await loadData();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setProcessingId(null);
    }
  };

  const displayedTeamLeaves = teamLeaves.filter(l => statusFilter === 'all' || l.status === statusFilter);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header Banner */}
      <div className="glass-panel" style={{ padding: '1.5rem', display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: '800' }}>Leave Management Hub</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            Apply for leave, track balances, and manage employee absence approvals
          </p>
        </div>
        <button onClick={() => setIsLeaveModalOpen(true)} className="btn-primary">
          <Plus size={18} /> Apply For Leave
        </button>
      </div>

      {/* Leave Balances Header Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
        <div className="glass-panel" style={{ padding: '1.2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Casual Leave (CL)</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#fbbf24', marginTop: '0.3rem' }}>{balances.casual} / 12 Days</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Yearly Quota: 12 Days</span>
        </div>
        <div className="glass-panel" style={{ padding: '1.2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Sick Leave (SL)</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#60a5fa', marginTop: '0.3rem' }}>{balances.sick} / 10 Days</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Yearly Quota: 10 Days</span>
        </div>
        <div className="glass-panel" style={{ padding: '1.2rem', textAlign: 'center' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: '600' }}>Earned Leave (EL)</span>
          <div style={{ fontSize: '1.6rem', fontWeight: '800', color: '#34d399', marginTop: '0.3rem' }}>{balances.annual || balances.earned || 15} / 15 Days</div>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)' }}>Yearly Quota: 15 Days</span>
        </div>
      </div>

      {/* Sub Tabs (for Manager / Admin) */}
      {(user.role === 'manager' || user.role === 'admin') && (
        <div style={{ display: 'flex', gap: '0.5rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.5rem' }}>
          <button
            onClick={() => setActiveSubTab('team')}
            className={activeSubTab === 'team' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
          >
            Team Approvals ({teamLeaves.filter(l => l.status === 'pending').length} Pending)
          </button>
          <button
            onClick={() => setActiveSubTab('my')}
            className={activeSubTab === 'my' ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '0.5rem 1.25rem', fontSize: '0.88rem' }}
          >
            My Personal Requests
          </button>
        </div>
      )}

      {/* Team Approvals View */}
      {activeSubTab === 'team' && (user.role === 'manager' || user.role === 'admin') && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1.1rem', fontWeight: '700' }}>
              {user.role === 'admin' ? 'Company-Wide Leave Requests' : `Department Leave Requests (${user.department})`}
            </h3>

            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Filter size={16} color="var(--text-muted)" />
              <select
                className="glass-input"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                style={{ width: '150px' }}
              >
                <option value="all" style={{ background: '#0f172a' }}>All Requests</option>
                <option value="pending" style={{ background: '#0f172a' }}>Pending Only</option>
                <option value="approved" style={{ background: '#0f172a' }}>Approved</option>
                <option value="rejected" style={{ background: '#0f172a' }}>Rejected</option>
              </select>
            </div>
          </div>

          {displayedTeamLeaves.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              No leave requests found for this filter.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Employee</th>
                    <th>Type</th>
                    <th>Dates</th>
                    <th>Duration</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {displayedTeamLeaves.map(leave => (
                    <tr key={leave.id || leave._id}>
                      <td>
                        <div style={{ fontWeight: '700' }}>{leave.userName}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>{leave.department}</div>
                      </td>
                      <td>{leave.type}</td>
                      <td>{leave.startDate} → {leave.endDate}</td>
                      <td>{leave.days} Days</td>
                      <td style={{ maxWidth: '200px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {leave.reason}
                      </td>
                      <td>
                        <span className={`status-pill ${leave.status}`}>{leave.status}</span>
                      </td>
                      <td>
                        {leave.status === 'pending' ? (
                          <div style={{ display: 'flex', gap: '0.4rem' }}>
                            <button
                              onClick={() => handleUpdateStatus(leave.id || leave._id, 'approved')}
                              disabled={processingId === (leave.id || leave._id)}
                              className="btn-success"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                            >
                              <Check size={14} /> Approve
                            </button>
                            <button
                              onClick={() => handleUpdateStatus(leave.id || leave._id, 'rejected')}
                              disabled={processingId === (leave.id || leave._id)}
                              className="btn-danger"
                              style={{ padding: '0.35rem 0.6rem', fontSize: '0.78rem' }}
                            >
                              <X size={14} /> Reject
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontStyle: 'italic' }}>
                            {leave.comment || 'Resolved'}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* My Personal Leave Requests View */}
      {(activeSubTab === 'my' || user.role === 'employee') && (
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: '700', marginBottom: '1.25rem' }}>My Submitted Leave Applications</h3>

          {myLeaves.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
              You haven't submitted any leave applications yet.
            </p>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Leave Type</th>
                    <th>Start Date</th>
                    <th>End Date</th>
                    <th>Days</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Manager Feedback</th>
                  </tr>
                </thead>
                <tbody>
                  {myLeaves.map(leave => (
                    <tr key={leave.id || leave._id}>
                      <td style={{ fontWeight: '700' }}>{leave.type}</td>
                      <td>{leave.startDate}</td>
                      <td>{leave.endDate}</td>
                      <td>{leave.days} Days</td>
                      <td style={{ maxWidth: '220px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {leave.reason}
                      </td>
                      <td>
                        <span className={`status-pill ${leave.status}`}>{leave.status}</span>
                      </td>
                      <td style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                        {leave.comment || '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      <LeaveModal
        isOpen={isLeaveModalOpen}
        onClose={() => setIsLeaveModalOpen(false)}
        onSuccess={loadData}
      />
    </div>
  );
};
