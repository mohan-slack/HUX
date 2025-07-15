export interface BleDevice {
  id: string;
  name: string;
  rssi?: number;
  modelNumber?: string;
}

export type BleConnectionStatus = 'disconnected' | 'scanning' | 'connecting' | 'connected' | 'error';

export class BleService {
  private static instance: BleService;
  private constructor() {}

  static getInstance() {
    if (!BleService.instance) {
      BleService.instance = new BleService();
    }
    return BleService.instance;
  }

  // Scan for BLE devices (to be implemented with native bridge)
  async scanForDevices(): Promise<BleDevice[]> {
    // TODO: Integrate with native SDK/bridge
    return [];
  }

  // Connect to a device by ID
  async connectToDevice(deviceId: string): Promise<boolean> {
    // TODO: Integrate with native SDK/bridge
    return false;
  }

  // Disconnect from device
  async disconnect(): Promise<void> {
    // TODO: Integrate with native SDK/bridge
  }

  // Get current connection status
  getConnectionStatus(): BleConnectionStatus {
    // TODO: Integrate with native SDK/bridge
    return 'disconnected';
  }

  // Listen for connection status changes
  onStatusChange(callback: (status: BleConnectionStatus) => void): void {
    // TODO: Integrate with native SDK/bridge/events
  }

  // Listen for device found during scan
  onDeviceFound(callback: (device: BleDevice) => void): void {
    // TODO: Integrate with native SDK/bridge/events
  }
} 