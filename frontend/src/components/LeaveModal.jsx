import React, { useState } from 'react';
import { X, Calendar, FileText, Send } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LeaveModal = ({ isOpen, onClose, onSuccess }) => {
  const { showToast } = useAuth();
  const [formData, setFormData] = useState({
    type: 'Casual Leave (CL)',
    startDate: '',
    endDate: '',
    reason: ''
  });
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (new Date(formData.endDate) < new Date(formData.startDate)) {
      showToast('End date cannot be prior to start date.', 'error');
      return;
    }

    setLoading(true);
    try {
      const res = await api.applyLeave(formData);
      showToast(res.message, 'success');
      onSuccess();
      onClose();
      setFormData({ type: 'Casual Leave (CL)', startDate: '', endDate: '', reason: '' });
    } catch (err) {
      showToast(err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '1rem',
        background: 'rgba(0, 0, 0, 0.7)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '520px',
          padding: '2rem',
          position: 'relative'
        }}
      >
        <button
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '1.25rem',
            right: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-muted)',
            cursor: 'pointer'
          }}
        >
          <X size={22} />
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '12px',
              background: 'var(--accent-gradient)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fff'
            }}
          >
            <Calendar size={22} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: '700' }}>Apply for Leave</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Submit a formal leave request to your manager</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              Leave Type & Yearly Quota
            </label>
            <select
              className="glass-input"
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
            >
              <option value="Casual Leave (CL)" style={{ background: '#0f172a' }}>Casual Leave (CL) - Max 12 Days/Year</option>
              <option value="Sick Leave (SL)" style={{ background: '#0f172a' }}>Sick Leave (SL) - Max 10 Days/Year</option>
              <option value="Earned Leave (EL)" style={{ background: '#0f172a' }}>Earned Leave (EL) - Max 15 Days/Year</option>
            </select>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                Start Date
              </label>
              <input
                type="date"
                className="glass-input"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
                End Date
              </label>
              <input
                type="date"
                className="glass-input"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
              Reason for Absence
            </label>
            <textarea
              className="glass-input"
              rows={3}
              placeholder="State the reason clearly..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
            <button type="button" onClick={onClose} className="btn-secondary" style={{ flex: 1 }}>
              Cancel
            </button>
            <button type="submit" disabled={loading} className="btn-primary" style={{ flex: 1 }}>
              <Send size={16} />
              {loading ? 'Submitting...' : 'Submit Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
