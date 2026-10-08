import { create } from 'zustand';
import api from '@/lib/axios';
import { Reminder, CreateReminderDto } from '@/types/reminder';

interface ToastState {
  message: string;
  type: 'success' | 'error';
}

interface ReminderState {
  reminders: Reminder[];
  loading: boolean;
  deleting: string | null;   // tracks which id is being deleted
  updating: string | null;   // tracks which id is being updated
  error: string | null;
  toast: ToastState | null;
  fetchReminders: () => Promise<void>;
  createReminder: (dto: CreateReminderDto) => Promise<void>;
  updateReminder: (id: string, dto: Partial<CreateReminderDto>) => Promise<void>;
  deleteReminder: (id: string) => Promise<void>;
  showToast: (message: string, type: 'success' | 'error') => void;
  clearError: () => void;
}

export const useReminderStore = create<ReminderState>((set, get) => ({
  reminders: [],
  loading: false,
  deleting: null,
  updating: null,
  error: null,
  toast: null,

  fetchReminders: async () => {
    set({ loading: true, error: null });
    try {
      const response = await api.get<Reminder[]>('/reminders');
      set({ reminders: response.data, loading: false });
    } catch (error: any) {
      set({ error: error.message, loading: false });
    }
  },

  createReminder: async (dto: CreateReminderDto) => {
    set({ loading: true, error: null });
    try {
      await api.post('/reminders', dto);
      await get().fetchReminders();
      get().showToast('Reminder created successfully!', 'success');
    } catch (error: any) {
      set({ error: error.message, loading: false });
      get().showToast(error.message, 'error');
      throw error;
    }
  },

  // BUG-04 fix: updateReminder now sets updating state to prevent double-submits
  updateReminder: async (id: string, dto: Partial<CreateReminderDto>) => {
    if (get().updating) return; // guard: no concurrent updates
    set({ updating: id, error: null });
    try {
      await api.patch(`/reminders/${id}`, dto);
      await get().fetchReminders();
      get().showToast('Reminder updated', 'success');
    } catch (error: any) {
      set({ error: error.message });
      get().showToast(error.message, 'error');
      throw error;
    } finally {
      set({ updating: null });
    }
  },

  // BUG-05 fix: deleteReminder now sets deleting state to prevent double-deletes
  deleteReminder: async (id: string) => {
    if (get().deleting) return; // guard: no concurrent deletes
    const previousReminders = get().reminders;
    set({ deleting: id, reminders: previousReminders.filter((r) => r._id !== id) });
    try {
      await api.delete(`/reminders/${id}`);
      get().showToast('Reminder deleted', 'success');
    } catch (error: any) {
      // Rollback optimistic update
      set({ reminders: previousReminders, error: error.message });
      get().showToast('Failed to delete reminder', 'error');
    } finally {
      set({ deleting: null });
    }
  },

  showToast: (message, type) => {
    set({ toast: { message, type } });
    setTimeout(() => {
      set({ toast: null });
    }, 3000);
  },

  clearError: () => set({ error: null }),
}));
