// StressService.ts
// Service stub for Stress monitoring

import { NativeModules, NativeEventEmitter } from 'react-native';
const { HuxRingNative } = NativeModules;
const huxRingEvents = new NativeEventEmitter(HuxRingNative);

export type StressData = {
  stressLevel: number; // 0-100
  timestamp: number;
};

class StressService {
  private sub: any;
  private monitoring: boolean = false;

  startMonitoring(listener: (data: StressData) => void) {
    this.monitoring = true;
    this.sub = huxRingEvents.addListener('StressUpdate', (data) => listener({ stressLevel: data.stressLevel, timestamp: data.timestamp }));
    HuxRingNative.startStressMonitoring();
  }

  stopMonitoring() {
    this.monitoring = false;
    HuxRingNative.stopStressMonitoring();
    this.sub?.remove();
  }
}

export default new StressService(); 