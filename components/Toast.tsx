'use client';

import { useReminderStore } from '@/store/reminderStore';
import { XCircle, CheckCircle, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function Toast() {
  const { toast } = useReminderStore();
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (toast) {
      setShow(true);
    } else {
      setShow(false);
    }
  }, [toast]);

  if (!toast && !show) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      style={{
        position: 'fixed',
        bottom: '2rem',
        left: '50%',
        transform: `translateX(-50%) ${show ? 'translateY(0)' : 'translateY(1rem)'}`,
        opacity: show ? 1 : 0,
        zIndex: 50,
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        padding: '1rem 1.5rem',
        borderRadius: '0.75rem',
        boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        background: toast?.type === 'error' ? 'var(--error-bg)' : 'rgba(34, 197, 94, 0.8)',
        color: toast?.type === 'error' ? 'var(--error-text)' : '#fff',
        border: `1px solid ${toast?.type === 'error' ? 'var(--error-border)' : 'rgba(34, 197, 94, 0.4)'}`,
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      {toast?.type === 'error' ? <XCircle size={20} /> : <CheckCircle size={20} />}
      <span className="text-sm font-medium">{toast?.message}</span>
      <button
        onClick={() => useReminderStore.setState({ toast: null })}
        style={{
          background: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'pointer',
          padding: '0.25rem',
          marginLeft: '0.5rem',
          opacity: 0.8,
          transition: 'opacity 0.2s',
        }}
        onMouseOver={(e) => (e.currentTarget.style.opacity = '1')}
        onMouseOut={(e) => (e.currentTarget.style.opacity = '0.8')}
        aria-label="Close toast"
      >
        <X size={16} />
      </button>
    </div>
  );
}
