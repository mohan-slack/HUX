// SleepSoundsService.ts
// Service stub for sleep sounds

export type SleepSound = {
  id: string;
  name: string;
  duration: number; // seconds
  playing: boolean;
};

export type SleepSoundsListener = (data: SleepSound[]) => void;

class SleepSoundsService {
  private listener: SleepSoundsListener | null = null;
  private sounds: SleepSound[] = [
    { id: '1', name: 'Rain', duration: 1800, playing: false },
    { id: '2', name: 'Ocean', duration: 1200, playing: false },
    { id: '3', name: 'Forest', duration: 1500, playing: false },
  ];

  getSounds() {
    return this.sounds;
  }

  playSound(id: string) {
    this.sounds = this.sounds.map(s => ({ ...s, playing: s.id === id }));
    this.notify();
  }

  stopSound() {
    this.sounds = this.sounds.map(s => ({ ...s, playing: false }));
    this.notify();
  }

  subscribe(listener: SleepSoundsListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.sounds);
    }
  }
}

export default new SleepSoundsService(); 