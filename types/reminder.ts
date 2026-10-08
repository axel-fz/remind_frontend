export interface Reminder {
  _id: string;
  title: string;
  description?: string;
  email: string;
  eventDate: string;
  reminderDate: string;
  status: 'Pending' | 'Processing' | 'Sent' | 'Failed';
}

export interface CreateReminderDto {
  title: string;
  description?: string;
  email: string;
  eventDate: string;
  reminderDate: string;
}
