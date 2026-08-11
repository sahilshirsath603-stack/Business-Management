import React from 'react';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert } from 'lucide-react';

export const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem', fontWeight: '600' }}>Validating session...</p>
      </div>
    );
  }

  if (!user) {
    return null; // Parent will handle rendering login page
  }

  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return (
      <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', maxWidth: '500px', margin: '4rem auto' }}>
        <ShieldAlert size={48} color="#f43f5e" style={{ margin: '0 auto 1rem auto' }} />
        <h3 style={{ fontSize: '1.4rem', fontWeight: '800', color: '#f43f5e' }}>Access Denied (403)</h3>
        <p style={{ color: 'var(--text-muted)', margin: '0.8rem 0 1.5rem 0', fontSize: '0.92rem' }}>
          Your current account role <strong>({user.role})</strong> does not have permission to view this section.
        </p>
      </div>
    );
  }

  return children;
};
