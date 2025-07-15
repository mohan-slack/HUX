import { NativeModules, NativeEventEmitter } from 'react-native';
const { HuxRingNative } = NativeModules;
const huxRingEvents = new NativeEventEmitter(HuxRingNative);

export type HeartRateStatus = 'idle' | 'monitoring' | 'error';

export class HeartRateService {
  private static instance: HeartRateService;
  private sub: any;
  private status: HeartRateStatus = 'idle';

  private constructor() {}

  static getInstance() {
    if (!HeartRateService.instance) {
      HeartRateService.instance = new HeartRateService();
    }
    return HeartRateService.instance;
  }

  // Start real-time heart rate monitoring (to be implemented with native SDK)
  async startMonitoring(): Promise<void> {
    this.status = 'monitoring';
    HuxRingNative.startHeartRateMonitoring();
  }

  // Stop monitoring
  async stopMonitoring(): Promise<void> {
    this.status = 'idle';
    HuxRingNative.stopHeartRateMonitoring();
    this.sub?.remove();
  }

  // Subscribe to heart rate updates
  onHeartRateUpdate(listener: (bpm: number) => void): void {
    this.sub = huxRingEvents.addListener('HeartRateUpdate', (data) => listener(data.bpm));
  }

  // Unsubscribe
  offHeartRateUpdate(): void {
    this.sub?.remove();
  }

  getStatus(): HeartRateStatus {
    return this.status;
  }
} 