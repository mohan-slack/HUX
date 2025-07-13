export type RingFeature =
  | 'heart_rate'
  | 'steps'
  | 'sleep'
  | 'ecg'
  | 'blood_pressure'
  | 'spo2'
  | 'temperature'
  | 'custom_dial'
  | 'notifications'
  | 'ota_update';

export interface RingModel {
  modelNumber: string;
  name: string;
  features: RingFeature[];
  notes?: string;
}

// Example supported models (expand as needed)
export const SUPPORTED_RING_MODELS: RingModel[] = [
  {
    modelNumber: 'HUX-R1',
    name: 'HUX Smart Ring R1',
    features: ['heart_rate', 'steps', 'sleep', 'ecg', 'notifications', 'ota_update'],
    notes: 'Flagship model with ECG and OTA support.'
  },
  {
    modelNumber: 'HUX-R2',
    name: 'HUX Smart Ring R2',
    features: ['heart_rate', 'steps', 'sleep', 'spo2', 'custom_dial', 'notifications'],
    notes: 'Mid-range model with SpO2 and custom dial.'
  },
  {
    modelNumber: 'HUX-R3',
    name: 'HUX Smart Ring R3',
    features: ['heart_rate', 'steps', 'sleep'],
    notes: 'Entry-level model.'
  }
]; 