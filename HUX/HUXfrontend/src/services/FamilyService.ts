// FamilyService.ts
// Service stub for family sharing

export type FamilyMember = {
  id: string;
  name: string;
  relation: string;
  avatar?: string;
};

export type FamilyListener = (data: FamilyMember[]) => void;

class FamilyService {
  private listener: FamilyListener | null = null;
  private members: FamilyMember[] = [
    { id: '1', name: 'Asha', relation: 'Mother' },
    { id: '2', name: 'Ravi', relation: 'Father' },
  ];

  getFamilyMembers() {
    return this.members;
  }

  addFamilyMember(member: Omit<FamilyMember, 'id'>) {
    const newMember = { ...member, id: Date.now().toString() };
    this.members = [...this.members, newMember];
    this.notify();
  }

  removeFamilyMember(id: string) {
    this.members = this.members.filter(m => m.id !== id);
    this.notify();
  }

  subscribe(listener: FamilyListener) {
    this.listener = listener;
    this.notify();
  }

  unsubscribe() {
    this.listener = null;
  }

  private notify() {
    if (this.listener) {
      this.listener(this.members);
    }
  }
}

export default new FamilyService(); 