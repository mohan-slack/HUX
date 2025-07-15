import { NativeModules, NativeEventEmitter } from 'react-native';
const { HuxRingNative } = NativeModules;
const huxRingEvents = new NativeEventEmitter(HuxRingNative);

export type BloodPressureStatus = 'idle' | 'monitoring' | 'error';

export interface BloodPressureRecord {
  id: string;
  timestamp: Date;
  systolic: number;
  diastolic: number;
  pulse: number;
  notes?: string;
}

export class BloodPressureService {
  private static instance: BloodPressureService;
  private sub: any;
  private status: BloodPressureStatus = 'idle';

  private constructor() {}

  static getInstance() {
    if (!BloodPressureService.instance) {
      BloodPressureService.instance = new BloodPressureService();
    }
    return BloodPressureService.instance;
  }

  async startMonitoring(): Promise<void> {
    this.status = 'monitoring';
    HuxRingNative.startBpMonitoring();
  }

  async stopMonitoring(): Promise<void> {
    this.status = 'idle';
    HuxRingNative.stopBpMonitoring();
    this.sub?.remove();
  }

  onBpUpdate(listener: (record: BloodPressureRecord) => void): void {
    this.sub = huxRingEvents.addListener('BpUpdate', (data) => listener({
      id: data.id,
      timestamp: new Date(data.timestamp),
      systolic: data.systolic,
      diastolic: data.diastolic,
      pulse: data.pulse,
      notes: data.notes,
    }));
  }

  offBpUpdate(): void {
    this.sub?.remove();
  }

  getStatus(): BloodPressureStatus {
    return this.status;
  }
} 