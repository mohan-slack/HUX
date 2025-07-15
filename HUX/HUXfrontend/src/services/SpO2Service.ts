// SpO2Service.ts
// Service stub for SpO2 (blood oxygen) monitoring

import { NativeModules, NativeEventEmitter } from 'react-native';
const { HuxRingNative } = NativeModules;
const huxRingEvents = new NativeEventEmitter(HuxRingNative);

export type SpO2Data = {
  value: number; // SpO2 percentage
  timestamp: number;
};

class SpO2Service {
  private sub: any;
  private monitoring: boolean = false;

  startMonitoring(listener: (data: SpO2Data) => void) {
    this.monitoring = true;
    this.sub = huxRingEvents.addListener('SpO2Update', (data) => listener({ value: data.value, timestamp: data.timestamp }));
    HuxRingNative.startSpO2Monitoring();
  }

  stopMonitoring() {
    this.monitoring = false;
    HuxRingNative.stopSpO2Monitoring();
    this.sub?.remove();
  }
}

export default new SpO2Service(); 