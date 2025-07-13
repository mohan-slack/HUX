// MenstrualService.ts
// Service stub for menstrual tracking

export type Cycle = {
  id: string;
  startDate: string; // ISO date
  endDate: string; // ISO date
  notes?: string;
};

export type CycleListener = (data: Cycle[]) => void;

class MenstrualService {
  private listener: CycleListener | null = null;
  private cycles: Cycle[] = [
    { id: '1', startDate: '2024-05-01', endDate: '2024-05-06', notes: 'Mild cramps' },
  ];

  getCycles() {
    return this.cycles;
  }

  addCycle(cycle: Omit<Cycle, 'id'>) {
    const newCycle = { ...cycle, id: Date.now().toString() };
    this.cycles = [...this.cycles, newCycle];
    this.notify();
  }

  subscribe(listener: CycleListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.cycles);
    }
  }
}

export default new MenstrualService(); 