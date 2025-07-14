// AchievementsService.ts
// Service stub for achievements

export type Achievement = {
  id: string;
  title: string;
  description: string;
  unlocked: boolean;
  timestamp?: number;
};

export type AchievementsListener = (data: Achievement[]) => void;

class AchievementsService {
  private listener: AchievementsListener | null = null;
  private achievements: Achievement[] = [
    { id: 'steps_10k', title: '10,000 Steps', description: 'Walk 10,000 steps in a day', unlocked: false },
    { id: 'hydration_2l', title: 'Hydrated', description: 'Drink 2L of water in a day', unlocked: false },
    { id: 'sleep_8h', title: 'Well Rested', description: 'Sleep 8 hours in a night', unlocked: false },
  ];

  getAchievements() {
    return this.achievements;
  }

  unlockAchievement(id: string) {
    this.achievements = this.achievements.map(a =>
      a.id === id && !a.unlocked ? { ...a, unlocked: true, timestamp: Date.now() } : a
    );
    this.notify();
  }

  subscribe(listener: AchievementsListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.achievements);
    }
  }
}

export default new AchievementsService(); 