import { Reminder } from '@/types/reminder';
import { useReminderStore } from '@/store/reminderStore';
import { Calendar, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

export default function ReminderItem({ reminder }: { reminder: Reminder }) {
  const deleteReminder = useReminderStore((state) => state.deleteReminder);
  const deleting = useReminderStore((state) => state.deleting);

  const isDeleting = deleting === reminder._id;
  const formattedEventDate = format(new Date(reminder.eventDate), 'MMM d, yyyy · h:mm a');
  const formattedReminderDate = format(new Date(reminder.reminderDate), 'MMM d, yyyy · h:mm a');

  const statusConfig = {
    Sent:       { label: '✓ Sent' },
    Processing: { label: '⏳ Processing' },
    Failed:     { label: '✗ Failed' },
    Pending:    { label: '⏰ Pending' },
  };

  const badgeLabel = statusConfig[reminder.status]?.label ?? statusConfig.Pending.label;

  return (
    <motion.div 
      className={`reminder-item ${isDeleting ? 'deleting' : ''}`}
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      whileHover={{ y: -2, boxShadow: '0 8px 24px var(--shadow-color)' }}
    >
      <div style={{ flex: 1, minWidth: 0 }}>
        <h3 className="truncate mb-2">{reminder.title}</h3>
        {reminder.description && (
          <p className="text-sm text-muted mb-2 line-clamp-2">{reminder.description}</p>
        )}
        <p className="text-sm text-muted truncate mb-4">{reminder.email}</p>

        <div className="flex-col gap-2">
          <div className="flex items-center text-xs text-muted mb-2">
            <Calendar size={14} className="mr-2" />
            <span>Event: {formattedEventDate}</span>
          </div>
          <div className="flex items-center text-xs text-muted">
            <Clock size={14} className="mr-2" />
            <span>Reminder: {formattedReminderDate}</span>
          </div>
        </div>
      </div>

      <div className="flex-col items-center justify-between" style={{ height: '100%', minHeight: '5.5rem' }}>
        <span className={`badge status-${reminder.status || 'Pending'}`}>
          {badgeLabel}
        </span>

        <button
          onClick={() => deleteReminder(reminder._id)}
          disabled={!!deleting}
          className="icon-btn mt-4"
          aria-label="Delete reminder"
          style={{ alignSelf: 'flex-end' }}
        >
          <Trash2 size={16} />
        </button>
      </div>
    </motion.div>
  );
}
