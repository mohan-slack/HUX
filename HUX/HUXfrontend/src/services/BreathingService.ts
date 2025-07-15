// BreathingService.ts
// Service stub for breathing exercises

export type BreathingExercise = {
  id: string;
  name: string;
  duration: number; // seconds
  active: boolean;
};

export type BreathingListener = (data: BreathingExercise[]) => void;

class BreathingService {
  private listener: BreathingListener | null = null;
  private exercises: BreathingExercise[] = [
    { id: '1', name: 'Box Breathing', duration: 300, active: false },
    { id: '2', name: '4-7-8 Breathing', duration: 240, active: false },
    { id: '3', name: 'Resonant Breathing', duration: 180, active: false },
  ];

  getExercises() {
    return this.exercises;
  }

  startExercise(id: string) {
    this.exercises = this.exercises.map(e => ({ ...e, active: e.id === id }));
    this.notify();
  }

  stopExercise() {
    this.exercises = this.exercises.map(e => ({ ...e, active: false }));
    this.notify();
  }

  subscribe(listener: BreathingListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.exercises);
    }
  }
}

export default new BreathingService(); 