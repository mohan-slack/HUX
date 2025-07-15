// ActivityService.ts
// Service stub for Activity tracking

export type ActivityData = {
  steps: number;
  distance: number; // meters
  calories: number; // kcal
  timestamp: number;
};

export type ActivityListener = (data: ActivityData) => void;

class ActivityService {
  private listener: ActivityListener | null = null;
  private tracking: boolean = false;

  startTracking(listener: ActivityListener) {
    this.listener = listener;
    this.tracking = true;
    // TODO: Integrate with native SDK
    // Simulate data for now
    this.simulateData();
  }

  stopTracking() {
    this.listener = null;
    this.tracking = false;
  }

  private simulateData() {
    if (!this.tracking || !this.listener) return;
    const steps = 1000 + Math.floor(Math.random() * 5000);
    const distance = steps * 0.7; // average step length in meters
    const calories = Math.round(steps * 0.04); // rough estimate
    const data: ActivityData = { steps, distance, calories, timestamp: Date.now() };
    this.listener(data);
    setTimeout(() => this.simulateData(), 5000);
  }
}

export default new ActivityService(); 