// RemindersService.ts
// Service stub for reminders

export type Reminder = {
  id: string;
  title: string;
  time: string; // e.g., '08:00'
  enabled: boolean;
};

export type RemindersListener = (data: Reminder[]) => void;

class RemindersService {
  private listener: RemindersListener | null = null;
  private reminders: Reminder[] = [
    { id: '1', title: 'Morning Walk', time: '07:00', enabled: true },
    { id: '2', title: 'Drink Water', time: '10:00', enabled: true },
  ];

  getReminders() {
    return this.reminders;
  }

  addReminder(reminder: Omit<Reminder, 'id'>) {
    const newReminder = { ...reminder, id: Date.now().toString() };
    this.reminders = [...this.reminders, newReminder];
    this.notify();
  }

  removeReminder(id: string) {
    this.reminders = this.reminders.filter(r => r.id !== id);
    this.notify();
  }

  subscribe(listener: RemindersListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.reminders);
    }
  }
}

export default new RemindersService(); 