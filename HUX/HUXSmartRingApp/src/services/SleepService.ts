import { NativeModules, NativeEventEmitter } from 'react-native';
const { HuxRingNative } = NativeModules;
const huxRingEvents = new NativeEventEmitter(HuxRingNative);

export type SleepStatus = 'idle' | 'tracking' | 'error';

export interface SleepSummary {
  start: Date;
  end: Date;
  duration: number; // in minutes
  quality: 'good' | 'fair' | 'poor';
}

export class SleepService {
  private static instance: SleepService;
  private sub: any;
  private status: SleepStatus = 'idle';

  private constructor() {}

  static getInstance() {
    if (!SleepService.instance) {
      SleepService.instance = new SleepService();
    }
    return SleepService.instance;
  }

  async startTracking(): Promise<void> {
    this.status = 'tracking';
    HuxRingNative.startSleepTracking();
  }

  async stopTracking(): Promise<void> {
    this.status = 'idle';
    HuxRingNative.stopSleepTracking();
    this.sub?.remove();
  }

  onSleepUpdate(listener: (summary: SleepSummary) => void): void {
    this.sub = huxRingEvents.addListener('SleepUpdate', (data) => listener({
      start: new Date(data.start),
      end: new Date(data.end),
      duration: data.duration,
      quality: data.quality,
    }));
  }

  offSleepUpdate(): void {
    this.sub?.remove();
  }

  getStatus(): SleepStatus {
    return this.status;
  }
} 