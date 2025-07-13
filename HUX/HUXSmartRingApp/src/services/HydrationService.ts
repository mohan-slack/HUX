// HydrationService.ts
// Service stub for Hydration tracking

export type HydrationData = {
  totalIntake: number; // in milliliters
  timestamp: number;
};

export type HydrationListener = (data: HydrationData) => void;

class HydrationService {
  private listener: HydrationListener | null = null;
  private totalIntake: number = 0;

  addIntake(amount: number) {
    this.totalIntake += amount;
    this.notify();
  }

  getDailyIntake() {
    return this.totalIntake;
  }

  resetIntake() {
    this.totalIntake = 0;
    this.notify();
  }

  subscribe(listener: HydrationListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener({ totalIntake: this.totalIntake, timestamp: Date.now() });
    }
  }
}

export default new HydrationService(); 