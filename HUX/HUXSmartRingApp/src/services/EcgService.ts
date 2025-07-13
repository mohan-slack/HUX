import { NativeModules, NativeEventEmitter } from 'react-native';
const { HuxRingNative } = NativeModules;
const huxRingEvents = new NativeEventEmitter(HuxRingNative);

export type EcgStatus = 'idle' | 'recording' | 'error';

export interface EcgRecord {
  id: string;
  timestamp: Date;
  data: number[]; // ECG waveform data
  duration: number; // in seconds
  notes?: string;
}

export class EcgService {
  private static instance: EcgService;
  private sub: any;
  private status: EcgStatus = 'idle';

  private constructor() {}

  static getInstance() {
    if (!EcgService.instance) {
      EcgService.instance = new EcgService();
    }
    return EcgService.instance;
  }

  async startEcg(): Promise<void> {
    this.status = 'recording';
    HuxRingNative.startEcgMonitoring();
  }

  async stopEcg(): Promise<void> {
    this.status = 'idle';
    HuxRingNative.stopEcgMonitoring();
    this.sub?.remove();
  }

  onEcgUpdate(listener: (record: EcgRecord) => void): void {
    this.sub = huxRingEvents.addListener('EcgUpdate', (data) => listener({
      id: data.id,
      timestamp: new Date(data.timestamp),
      data: data.data,
      duration: data.duration,
      notes: data.notes,
    }));
  }

  offEcgUpdate(): void {
    this.sub?.remove();
  }

  getStatus(): EcgStatus {
    return this.status;
  }
} 