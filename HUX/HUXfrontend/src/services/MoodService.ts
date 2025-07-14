// MoodService.ts
// Service stub for mood tracking

export type Mood = {
  id: string;
  date: string; // ISO date
  mood: string;
  notes?: string;
};

export type MoodListener = (data: Mood[]) => void;

class MoodService {
  private listener: MoodListener | null = null;
  private moods: Mood[] = [
    { id: '1', date: '2024-06-01', mood: 'Happy', notes: 'Great workout!' },
  ];

  getMoods() {
    return this.moods;
  }

  addMood(mood: Omit<Mood, 'id'>) {
    const newMood = { ...mood, id: Date.now().toString() };
    this.moods = [...this.moods, newMood];
    this.notify();
  }

  subscribe(listener: MoodListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.moods);
    }
  }
}

export default new MoodService(); 