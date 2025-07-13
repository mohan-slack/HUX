// SOSService.ts
// Service stub for SOS/emergency

export type SOSData = {
  id: string;
  date: string; // ISO date
  location: string;
  resolved: boolean;
};

export type SOSListener = (data: SOSData[]) => void;

class SOSService {
  private listener: SOSListener | null = null;
  private history: SOSData[] = [];

  triggerSOS(location: string) {
    const newSOS: SOSData = {
      id: Date.now().toString(),
      date: new Date().toISOString(),
      location,
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

  getSOSHistory() {
    return this.history;
  }

  subscribe(listener: SOSListener) {
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

export default new SOSService(); 