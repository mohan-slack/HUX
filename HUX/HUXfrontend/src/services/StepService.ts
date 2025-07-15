import { NativeModules, NativeEventEmitter } from 'react-native';
const { HuxRingNative } = NativeModules;
const huxRingEvents = new NativeEventEmitter(HuxRingNative);

export type StepStatus = 'idle' | 'tracking' | 'error';

export type StepData = {
  count: number;
  timestamp: number;
};

export class StepService {
  private static instance: StepService;
  private sub: any;
  private status: StepStatus = 'idle';

  private constructor() {}

  static getInstance() {
    if (!StepService.instance) {
      StepService.instance = new StepService();
    }
    return StepService.instance;
  }

  // Start step tracking (to be implemented with native SDK)
  async startTracking(): Promise<void> {
    this.status = 'tracking';
    HuxRingNative.startStepMonitoring();
  }

  // Stop tracking
  async stopTracking(): Promise<void> {
    this.status = 'idle';
    HuxRingNative.stopStepMonitoring();
    this.sub?.remove();
  }

  // Subscribe to step updates
  onStepUpdate(listener: (data: StepData) => void): void {
    this.sub = huxRingEvents.addListener('StepUpdate', (data) => listener({ count: data.steps, timestamp: data.timestamp }));
  }

  // Unsubscribe
  offStepUpdate(): void {
    this.sub?.remove();
  }

  // Get daily total (stub)
  async getDailyTotal(): Promise<number> {
    // TODO: Integrate with native SDK/bridge
    return 0;
  }

  // Get weekly total (stub)
  async getWeeklyTotal(): Promise<number> {
    // TODO: Integrate with native SDK/bridge
    return 0;
  }

  getStatus(): StepStatus {
    return this.status;
  }
} 