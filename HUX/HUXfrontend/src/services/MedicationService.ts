// MedicationService.ts
// Service stub for medication tracking

export type Medication = {
  id: string;
  name: string;
  dosage: string;
  time: string; // e.g., '09:00'
  taken: boolean;
};

export type MedicationListener = (data: Medication[]) => void;

class MedicationService {
  private listener: MedicationListener | null = null;
  private medications: Medication[] = [
    { id: '1', name: 'Vitamin D', dosage: '1000 IU', time: '09:00', taken: false },
  ];

  getMedications() {
    return this.medications;
  }

  addMedication(med: Omit<Medication, 'id' | 'taken'>) {
    const newMed = { ...med, id: Date.now().toString(), taken: false };
    this.medications = [...this.medications, newMed];
    this.notify();
  }

  removeMedication(id: string) {
    this.medications = this.medications.filter(m => m.id !== id);
    this.notify();
  }

  markTaken(id: string) {
    this.medications = this.medications.map(m =>
      m.id === id ? { ...m, taken: true } : m
    );
    this.notify();
  }

  subscribe(listener: MedicationListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.medications);
    }
  }
}

export default new MedicationService(); 