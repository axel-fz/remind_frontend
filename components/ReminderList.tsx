'use client';

import { useReminderStore } from '@/store/reminderStore';
import ReminderItem from './ReminderItem';
import { CalendarX } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReminderList() {
  const { reminders, loading, error, fetchReminders } = useReminderStore();

  if (loading && reminders.length === 0) {
    return (
      <div className="mt-8">
        <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
          Upcoming reminders
          <span className="badge" style={{ background: 'var(--input-bg)', color: 'var(--text-color)' }}>...</span>
        </h2>
        <div className="flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="reminder-item" style={{ opacity: 0.5 }}>
              <div style={{ height: '20px', background: 'var(--input-bg)', width: '30%', borderRadius: '4px', marginBottom: '8px' }}></div>
              <div style={{ height: '16px', background: 'var(--input-bg)', width: '25%', borderRadius: '4px' }}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      {error && (
        <div className="error-box mb-6">
          <div className="text-sm">
            <span className="font-medium">Error:</span> {error}
          </div>
          <button
            onClick={fetchReminders}
            className="error-btn"
          >
            Retry
          </button>
        </div>
      )}

      <h2 className="text-lg font-medium mb-4 flex items-center gap-2">
        Upcoming reminders
        <span className="badge">
          {reminders.length}
        </span>
      </h2>

      {reminders.length === 0 && !error ? (
        <motion.div 
          className="glass-panel p-6" 
          style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <div style={{ background: 'var(--input-bg)', padding: '1rem', borderRadius: '50%', marginBottom: '1rem' }}>
            <CalendarX size={24} style={{ color: 'var(--text-muted)' }} />
          </div>
          <h3 className="text-sm font-medium">No reminders yet</h3>
          <p className="text-sm text-muted mt-2">Create your first reminder above.</p>
        </motion.div>
      ) : (
        <motion.div 
          className="flex-col gap-3"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          <AnimatePresence>
            {reminders.map((reminder) => (
              <ReminderItem key={reminder._id} reminder={reminder} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
