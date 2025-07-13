// ProfileService.ts
// Service stub for user profile management

export type ProfileData = {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number; // cm
  weight: number; // kg
  avatar?: string; // URL or base64
};

export type ProfileListener = (data: ProfileData) => void;

class ProfileService {
  private listener: ProfileListener | null = null;
  private profile: ProfileData = {
    name: 'User',
    age: 30,
    gender: 'other',
    height: 170,
    weight: 70,
    avatar: '',
  };

  getProfile() {
    return this.profile;
  }

  updateProfile(profile: Partial<ProfileData>) {
    this.profile = { ...this.profile, ...profile };
    this.notify();
  }

  subscribe(listener: ProfileListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.profile);
    }
  }
}

export default new ProfileService(); 