'use client';

import { useEffect } from 'react';
import { useReminderStore } from '@/store/reminderStore';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'next/navigation';
import ReminderForm from '@/components/ReminderForm';
import ReminderList from '@/components/ReminderList';
import Toast from '@/components/Toast';

export default function Dashboard() {
  const fetchReminders = useReminderStore((state) => state.fetchReminders);
  const token = useAuthStore((state) => state.token);
  const router = useRouter();

  useEffect(() => {
    if (!token) {
      router.push('/login');
    } else {
      fetchReminders();
    }
  }, [fetchReminders, token, router]);

  if (!token) return null;

  return (
    <>
      <Toast />
      <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        <ReminderForm />
        <ReminderList />
      </div>
    </>
  );
}
