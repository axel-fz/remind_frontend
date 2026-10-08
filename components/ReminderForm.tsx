'use client';

import { useState, useEffect } from 'react';
import { useReminderStore } from '@/store/reminderStore';
import { CreateReminderDto } from '@/types/reminder';
import { Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export default function ReminderForm() {
  const createReminder = useReminderStore((state) => state.createReminder);
  const loading = useReminderStore((state) => state.loading);

  const [formData, setFormData] = useState<CreateReminderDto>({
    title: '',
    description: '',
    email: '',
    eventDate: '',
    reminderDate: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof CreateReminderDto, string>>>({});
  const [minDateTime, setMinDateTime] = useState('');

  useEffect(() => {
    const now = new Date();
    now.setSeconds(0, 0);
    now.setMinutes(now.getMinutes() + 1);
    setMinDateTime(now.toISOString().slice(0, 16));
  }, []);

  const validate = () => {
    const newErrors: Partial<Record<keyof CreateReminderDto, string>> = {};
    const now = new Date();

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required and cannot be whitespace only';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.eventDate) {
      newErrors.eventDate = 'Event date is required';
    } else if (new Date(formData.eventDate) <= now) {
      newErrors.eventDate = 'Event date must be in the future';
    }

    if (!formData.reminderDate) {
      newErrors.reminderDate = 'Reminder date is required';
    } else if (new Date(formData.reminderDate) <= now) {
      newErrors.reminderDate = 'Reminder date must be in the future';
    } else if (formData.eventDate && new Date(formData.reminderDate) >= new Date(formData.eventDate)) {
      newErrors.reminderDate = 'Reminder must be before the event date';
    }

    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      const firstErrorKey = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorKey);
      if (element) element.focus();
    }

    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      const payload: CreateReminderDto = {
        title: formData.title.trim(),
        description: formData.description?.trim(),
        email: formData.email,
        eventDate: new Date(formData.eventDate).toISOString(),
        reminderDate: new Date(formData.reminderDate).toISOString(),
      };
      await createReminder(payload);
      setFormData({ title: '', description: '', email: '', eventDate: '', reminderDate: '' });
      setErrors({});
    } catch (err) {
      // Error handled by store
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name as keyof CreateReminderDto]) {
      setErrors({ ...errors, [e.target.name]: undefined });
    }
  };

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="mb-6">
        <h2 className="text-lg font-medium" style={{ color: 'var(--text-color)' }}>Create a reminder</h2>
        <p className="text-sm text-muted mt-1">Set up a new event and when you want to be reminded.</p>
      </div>

      <motion.form 
        onSubmit={handleSubmit} 
        className="glass-panel p-6"
        whileHover={{ boxShadow: '0 15px 50px rgba(0,0,0,0.1)' }}
      >
        <div className="grid sm-grid-cols-2 gap-5 mb-6">
          <div className="sm-col-span-2 relative">
            <label htmlFor="title">Event Title</label>
            <motion.div
              animate={{ boxShadow: ['0px 0px 0px 0px rgba(139, 92, 246, 0.2)', '0px 0px 0px 6px rgba(139, 92, 246, 0)'] }}
              transition={{ duration: 1.5, repeat: Infinity, repeatType: "loop", ease: "easeOut", delay: 1 }}
              style={{ borderRadius: '0.5rem' }}
            >
              <input
                type="text"
                id="title"
                name="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="e.g., Dentist Appointment"
                className="glass-input"
                style={{ borderColor: errors.title ? 'var(--error-border)' : undefined }}
                disabled={loading}
              />
            </motion.div>
            {errors.title && <p className="mt-4 text-xs" style={{ color: 'var(--error-text)' }}>{errors.title}</p>}
          </div>

          <div className="sm-col-span-2">
            <label htmlFor="description">Description (Optional)</label>
            <textarea
              id="description"
              name="description"
              value={formData.description || ''}
              onChange={handleChange}
              placeholder="e.g., Don't forget to bring the documents"
              className="glass-input"
              rows={3}
              style={{ borderColor: errors.description ? 'var(--error-border)' : undefined, resize: 'vertical' }}
              disabled={loading}
            />
            {errors.description && <p className="mt-4 text-xs" style={{ color: 'var(--error-text)' }}>{errors.description}</p>}
          </div>

          <div className="sm-col-span-2">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="you@example.com"
              className="glass-input"
              style={{ borderColor: errors.email ? 'var(--error-border)' : undefined }}
              disabled={loading}
            />
            {errors.email && <p className="mt-4 text-xs" style={{ color: 'var(--error-text)' }}>{errors.email}</p>}
          </div>

          <div>
            <label htmlFor="eventDate">Event Date & Time</label>
            <input
              type="datetime-local"
              id="eventDate"
              name="eventDate"
              value={formData.eventDate}
              onChange={handleChange}
              min={minDateTime}
              className="glass-input"
              style={{ borderColor: errors.eventDate ? 'var(--error-border)' : undefined }}
              disabled={loading}
            />
            {errors.eventDate && <p className="mt-4 text-xs" style={{ color: 'var(--error-text)' }}>{errors.eventDate}</p>}
          </div>

          <div>
            <label htmlFor="reminderDate">Reminder Date & Time</label>
            <input
              type="datetime-local"
              id="reminderDate"
              name="reminderDate"
              value={formData.reminderDate}
              onChange={handleChange}
              min={minDateTime}
              className="glass-input"
              style={{ borderColor: errors.reminderDate ? 'var(--error-border)' : undefined }}
              disabled={loading}
            />
            {errors.reminderDate && <p className="mt-4 text-xs" style={{ color: 'var(--error-text)' }}>{errors.reminderDate}</p>}
          </div>
        </div>

        <div className="flex justify-end">
          <motion.button
            type="submit"
            disabled={loading}
            className="btn-primary"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading && <Loader2 className="animate-spin" size={16} />}
            {loading ? 'Creating...' : 'Create reminder'}
          </motion.button>
        </div>
      </motion.form>
    </motion.section>
  );
}
