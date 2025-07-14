// TemperatureService.ts
// Service stub for Temperature monitoring

import { NativeModules, NativeEventEmitter } from 'react-native';
const { HuxRingNative } = NativeModules;
const huxRingEvents = new NativeEventEmitter(HuxRingNative);

export type TemperatureData = {
  value: number; // Temperature in Celsius
  timestamp: number;
};

class TemperatureService {
  private sub: any;
  private monitoring: boolean = false;

  startMonitoring(listener: (data: TemperatureData) => void) {
    this.monitoring = true;
    this.sub = huxRingEvents.addListener('TemperatureUpdate', (data) => listener({ value: data.value, timestamp: data.timestamp }));
    HuxRingNative.startTemperatureMonitoring();
  }

  stopMonitoring() {
    this.monitoring = false;
    HuxRingNative.stopTemperatureMonitoring();
    this.sub?.remove();
  }
}

export default new TemperatureService(); 