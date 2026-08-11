import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle2, LogOut, FileText, AlertTriangle, Calendar } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const ClockWidget = ({ onAttendanceChange }) => {
  const { showToast } = useAuth();
  const [time, setTime] = useState(new Date());
  const [todayLog, setTodayLog] = useState(null);
  const [loading, setLoading] = useState(false);
  const [notes, setNotes] = useState('');

  const fetchTodayStatus = async () => {
    try {
      const res = await api.getTodayAttendance();
      setTodayLog(res.log);
    } catch (err) {
      console.error('Failed to fetch today attendance status:', err.message);
    }
  };

  useEffect(() => {
    fetchTodayStatus();
    const interval = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const handleClockIn = async () => {
    setLoading(true);
    try {
      const res = await api.clockIn(notes);
      setTodayLog(res.log);
      showToast(res.message, 'success');
      if (onAttendanceChange) onAttendanceChange();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleClockOut = async () => {
    setLoading(true);
    try {
      const res = await api.clockOut();
      setTodayLog(res.log);
      showToast(res.message, 'success');
      if (onAttendanceChange) onAttendanceChange();
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  const isClockedIn = todayLog && !todayLog.clockOut;
  const isClockedOut = todayLog && todayLog.clockOut;

  return (
    <div className="glass-panel" style={{ padding: '1.75rem', position: 'relative', overflow: 'hidden' }}>
      {/* Decorative Glow */}
      <div
        style={{
          position: 'absolute',
          top: '-40px',
          right: '-40px',
          width: '160px',
          height: '160px',
          borderRadius: '50%',
          background: 'var(--accent-gradient)',
          opacity: 0.15,
          filter: 'blur(30px)',
          pointerEvents: 'none'
        }}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '1.5rem' }}>
        {/* Left: Clock Display & Shift Badge */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <Clock size={20} color="var(--accent-primary)" />
            <span style={{ fontSize: '0.85rem', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)' }}>
              Work Shift Counter
            </span>
            <span
              style={{
                fontSize: '0.72rem',
                fontWeight: '700',
                padding: '0.2rem 0.6rem',
                borderRadius: '9999px',
                background: 'rgba(0, 242, 254, 0.15)',
                color: 'var(--accent-cyan)',
                border: '1px solid rgba(0, 242, 254, 0.3)'
              }}
            >
              Shift: 10:00 AM - 05:00 PM (7 Hrs)
            </span>
          </div>
          <div style={{ fontSize: '2.4rem', fontWeight: '800', fontFamily: 'monospace', letterSpacing: '-0.03em', background: 'linear-gradient(135deg, #fff 0%, #cbd5e1 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
          </div>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>
            {time.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' })} • Punctual threshold: 10:15 AM
          </p>
        </div>

        {/* Center: Current Status Pill */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', minWidth: '200px' }}>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>Attendance Status</span>
          {!todayLog && (
            <div className="status-pill absent" style={{ padding: '0.5rem 1rem' }}>
              <AlertTriangle size={16} /> Not Clocked In
            </div>
          )}
          {isClockedIn && (
            <div className="status-pill present" style={{ padding: '0.5rem 1rem' }}>
              <CheckCircle2 size={16} /> Clocked In at {todayLog.clockIn}
            </div>
          )}
          {isClockedOut && (
            <div className="status-pill pending" style={{ padding: '0.5rem 1rem' }}>
              <LogOut size={16} /> Clocked Out ({todayLog.clockIn} - {todayLog.clockOut})
            </div>
          )}
        </div>

        {/* Right: Notes Input & Clock In/Out Action Button */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, maxWidth: '340px' }}>
          {!isClockedIn && !isClockedOut && (
            <input
              type="text"
              className="glass-input"
              placeholder="Notes (e.g. Remote working / Client site)"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ fontSize: '0.85rem', padding: '0.5rem 0.8rem' }}
            />
          )}

          {!isClockedIn && !isClockedOut && (
            <button
              onClick={handleClockIn}
              disabled={loading}
              className="btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              <CheckCircle2 size={18} />
              {loading ? 'Clocking In...' : 'Clock In Now'}
            </button>
          )}

          {isClockedIn && (
            <button
              onClick={handleClockOut}
              disabled={loading}
              className="btn-danger"
              style={{ width: '100%', padding: '0.85rem', justifyContent: 'center' }}
            >
              <LogOut size={18} />
              {loading ? 'Clocking Out...' : 'Clock Out Shift'}
            </button>
          )}

          {isClockedOut && (
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontStyle: 'italic', textAlign: 'center' }}>
              Shift completed for today (10 AM - 5 PM). Great work!
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
