import React, { useState } from 'react';
import { X, CheckCircle, XCircle, MessageSquare, Send } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const LeaveReviewModal = ({ isOpen, leave, onClose, onSuccess }) => {
  const { showToast } = useAuth();
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen || !leave) return null;

  const handleAction = async (status) => {
    setLoading(true);
    try {
      const finalComment = comment.trim() || (status === 'approved' ? 'Approved by Manager' : 'Rejected by Manager');
      const res = await api.updateLeaveStatus(leave.id, status, finalComment);
      showToast(res.message, 'success');
      onSuccess();
      onClose();
      setComment('');
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
        background: 'rgba(0, 0, 0, 0.75)',
        backdropFilter: 'blur(8px)'
      }}
    >
      <div
        className="glass-panel animate-fade-in"
        style={{
          width: '100%',
          maxWidth: '500px',
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

        <h3 style={{ fontSize: '1.2rem', fontWeight: '800', marginBottom: '1rem' }}>
          Review Leave Request
        </h3>

        {/* Leave Summary Details */}
        <div
          style={{
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            background: 'rgba(15, 23, 42, 0.6)',
            border: '1px solid var(--border-glass)',
            marginBottom: '1.25rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.5rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', fontSize: '1rem' }}>{leave.userName}</span>
            <span className="role-pill manager" style={{ fontSize: '0.72rem' }}>{leave.department}</span>
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Type:</strong> {leave.type} ({leave.days} Days)
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Dates:</strong> {leave.startDate} to {leave.endDate}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <strong>Reason:</strong> {leave.reason}
          </div>
        </div>

        {/* Comment Box */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem', fontWeight: '600', marginBottom: '0.4rem', color: 'var(--text-muted)' }}>
            <MessageSquare size={16} /> Manager Feedback / Comment
          </label>
          <textarea
            className="glass-input"
            rows={3}
            placeholder="Add optional notes for the employee..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            style={{ resize: 'vertical' }}
          />
        </div>

        {/* Decision Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => handleAction('rejected')}
            disabled={loading}
            className="btn-danger"
            style={{ flex: 1, padding: '0.8rem', justifyContent: 'center' }}
          >
            <XCircle size={18} /> Reject Request
          </button>
          <button
            onClick={() => handleAction('approved')}
            disabled={loading}
            className="btn-success"
            style={{ flex: 1, padding: '0.8rem', justifyContent: 'center' }}
          >
            <CheckCircle size={18} /> Approve Request
          </button>
        </div>
      </div>
    </div>
  );
};
