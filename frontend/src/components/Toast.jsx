import React from 'react';
import { CheckCircle, AlertCircle, Info, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const Toast = () => {
  const { toast } = useAuth();

  if (!toast) return null;

  const isSuccess = toast.type === 'success';
  const isError = toast.type === 'error';

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        zIndex: 9999,
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '14px 20px',
        borderRadius: '14px',
        background: isSuccess
          ? 'rgba(16, 185, 129, 0.95)'
          : isError
          ? 'rgba(244, 63, 94, 0.95)'
          : 'rgba(59, 130, 246, 0.95)',
        color: '#ffffff',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.4)',
        backdropFilter: 'blur(12px)',
        fontWeight: '600',
        fontSize: '0.92rem',
        animation: 'fadeIn 0.3s ease'
      }}
    >
      {isSuccess && <CheckCircle size={20} />}
      {isError && <AlertCircle size={20} />}
      {!isSuccess && !isError && <Info size={20} />}
      <span>{toast.message}</span>
    </div>
  );
};
