// GoalsService.ts
// Service stub for user goals management

export type GoalsData = {
  steps: number;
  sleep: number; // hours
  hydration: number; // ml
  calories: number; // kcal
};

export type GoalsListener = (data: GoalsData) => void;

class GoalsService {
  private listener: GoalsListener | null = null;
  private goals: GoalsData = {
    steps: 8000,
    sleep: 8,
    hydration: 2000,
    calories: 2200,
  };

  getGoals() {
    return this.goals;
  }

  updateGoal(goal: Partial<GoalsData>) {
    this.goals = { ...this.goals, ...goal };
    this.notify();
  }

  subscribe(listener: GoalsListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.goals);
    }
  }
}

export default new GoalsService(); 