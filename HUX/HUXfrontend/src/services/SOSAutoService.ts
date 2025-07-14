// SOSAutoService.ts
// Service stub for automatic SOS trigger from sensor detection

export type AutoSOSData = {
  id: string;
  date: string; // ISO date
  sensorType: string;
  sensorValue: number;
  threshold: number;
  detected: boolean;
  resolved: boolean;
};

export type AutoSOSListener = (data: AutoSOSData[]) => void;

class SOSAutoService {
  private listener: AutoSOSListener | null = null;
  private history: AutoSOSData[] = [];

  detectBP(value: number, threshold: number = 180) {
    if (value >= threshold) {
      this.addSOS('Blood Pressure', value, threshold);
    }
  }

  detectOxygen(value: number, threshold: number = 90) {
    if (value <= threshold) {
      this.addSOS('Oxygen', value, threshold);
    }
  }

  detectGlucose(value: number, threshold: number = 250) {
    if (value >= threshold) {
      this.addSOS('Glucose', value, threshold);
    }
  }

  detectCustom(sensorType: string, value: number, threshold: number) {
    this.addSOS(sensorType, value, threshold);
  }

  detectHeartRate(value: number, threshold: number = 130) {
    if (value >= threshold) {
      this.addSOS('Heart Rate', value, threshold);
    }
  }

  detectTemperature(value: number, threshold: number = 39) {
    if (value >= threshold) {
      this.addSOS('Temperature', value, threshold);
    }
  }

  detectFall() {
    // Fall detection is a boolean event, value 1, threshold 1
    this.addSOS('Fall Detection', 1, 1);
  }

  private addSOS(sensorType: string, sensorValue: number, threshold: number) {
    const newSOS: AutoSOSData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      sensorType,
      sensorValue,
      threshold,
      detected: true,
      resolved: false,
    };
    this.history = [newSOS, ...this.history];
    this.notify();
  }

  resolveSOS(id: string) {
    this.history = this.history.map(sos =>
      sos.id === id ? { ...sos, resolved: true } : sos
    );
    this.notify();
  }

  getAutoSOSHistory() {
    return this.history;
  }

  subscribe(listener: AutoSOSListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.history);
    }
  }
}

export default new SOSAutoService(); 