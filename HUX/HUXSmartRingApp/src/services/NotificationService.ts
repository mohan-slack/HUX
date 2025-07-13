// NotificationService.ts
// Service stub for Notifications

export type NotificationData = {
  title: string;
  message: string;
  type: 'call' | 'sms' | 'app' | 'reminder';
  timestamp: number;
};

export type NotificationListener = (data: NotificationData) => void;

class NotificationService {
  private listener: NotificationListener | null = null;
  private types = ['call', 'sms', 'app', 'reminder'] as const;
  private titles = ['Incoming Call', 'New SMS', 'App Alert', 'Reminder'];
  private messages = [
    'John is calling you.',
    'You have a new message.',
    'Don\'t forget your meeting.',
    'Time to drink water!'
  ];

  subscribe(listener: NotificationListener) {
    this.listener = listener;
    this.simulateNotification();
  }

  unsubscribe() {
    this.listener = null;
  }

  private simulateNotification() {
    if (!this.listener) return;
    const idx = Math.floor(Math.random() * this.types.length);
    const data: NotificationData = {
      title: this.titles[idx],
      message: this.messages[idx],
      type: this.types[idx],
      timestamp: Date.now(),
    };
    this.listener(data);
    setTimeout(() => this.simulateNotification(), 8000);
  }
}

export default new NotificationService(); 