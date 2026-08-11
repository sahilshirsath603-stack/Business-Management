import React, { useState, useEffect } from 'react';
import { Bell, Check, Info, ShieldAlert, CheckCircle2, X } from 'lucide-react';
import { api } from '../services/api';

export const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [isOpen, setIsOpen] = useState(false);

  const fetchNotifications = async () => {
    try {
      const res = await api.getNotifications();
      setNotifications(res.notifications || []);
    } catch (e) {}
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 10000); // Poll every 10s
    return () => clearInterval(interval);
  }, []);

  const unreadCount = notifications.filter(n => !n.isRead).length;

  const handleMarkRead = async (id) => {
    try {
      await api.markNotificationRead(id);
      setNotifications(notifications.map(n => n.id === id ? { ...n, isRead: true } : n));
    } catch (e) {}
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn-secondary"
        style={{
          padding: '0.5rem',
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-4px',
              right: '-4px',
              background: '#f43f5e',
              color: '#fff',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              fontSize: '0.7rem',
              fontWeight: 'bold',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: '2px solid var(--bg-dark)'
            }}
          >
            {unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div
          className="glass-panel animate-fade-in"
          style={{
            position: 'absolute',
            top: '48px',
            right: 0,
            width: '340px',
            maxHeight: '420px',
            overflowY: 'auto',
            zIndex: 100,
            padding: '1.25rem',
            background: 'rgba(15, 23, 42, 0.95)',
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.5)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', borderBottom: '1px solid var(--border-glass)', paddingBottom: '0.6rem' }}>
            <h4 style={{ fontWeight: '700', fontSize: '0.95rem' }}>Notifications</h4>
            <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{unreadCount} Unread</span>
          </div>

          {notifications.length === 0 ? (
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', textAlign: 'center', padding: '1.5rem 0' }}>
              No notifications.
            </p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {notifications.map(n => (
                <div
                  key={n.id}
                  style={{
                    padding: '0.8rem',
                    borderRadius: 'var(--radius-md)',
                    background: n.isRead ? 'rgba(30, 41, 59, 0.3)' : 'rgba(99, 102, 241, 0.15)',
                    border: n.isRead ? '1px solid var(--border-glass)' : '1px solid rgba(99, 102, 241, 0.4)',
                    position: 'relative'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.3rem' }}>
                    <span style={{ fontWeight: '700', fontSize: '0.85rem', color: n.isRead ? 'var(--text-muted)' : 'var(--text-main)' }}>
                      {n.title}
                    </span>
                    {!n.isRead && (
                      <button
                        onClick={() => handleMarkRead(n.id)}
                        style={{ background: 'transparent', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer' }}
                        title="Mark as read"
                      >
                        <Check size={14} />
                      </button>
                    )}
                  </div>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                    {n.message}
                  </p>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-dim)', marginTop: '0.3rem', display: 'block' }}>
                    {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
