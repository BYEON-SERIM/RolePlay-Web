export interface Student {
  id: number;
  name: string;
  status: 'present' | 'absent' | 'left';
  arrivalTime: string | null;
  departureTime: string | null;
}

const STORAGE_KEYS = {
  STICKERS: 'academy-stickers-state',
  STUDENTS: 'academy-students-state',
  PRAISE_MESSAGE: 'academy-praise-message',
};

const initialStudents: Student[] = [
];

export const academyStore = {
  // 스티커 관련
  getStickers: (): number => {
    const saved = localStorage.getItem(STORAGE_KEYS.STICKERS);
    return saved ? parseInt(saved, 10) : 0;
  },
  addSticker: () => {
    const current = academyStore.getStickers();
    const next = current + 1;
    localStorage.setItem(STORAGE_KEYS.STICKERS, next.toString());
    window.dispatchEvent(new Event('academy-stickers-updated'));
  },
  removeSticker: () => {
    const current = academyStore.getStickers();
    if (current > 0) {
      const next = current - 1;
      localStorage.setItem(STORAGE_KEYS.STICKERS, next.toString());
      window.dispatchEvent(new Event('academy-stickers-updated'));
    }
  },

  // 칭찬 메시지 관련
  getPraiseMessage: (): string => {
    const saved = localStorage.getItem(STORAGE_KEYS.PRAISE_MESSAGE);
    return saved ?? '';
  },
  savePraiseMessage: (message: string) => {
    localStorage.setItem(STORAGE_KEYS.PRAISE_MESSAGE, message);
    window.dispatchEvent(new Event('academy-praise-updated'));
  },

  // 학생 관련
  getStudents: (): Student[] => {
    const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
    if (saved) return JSON.parse(saved);
    
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(initialStudents));
    return initialStudents;
  },
  saveStudents: (students: Student[]) => {
    localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    window.dispatchEvent(new Event('academy-students-updated'));
  },
  addStudent: (name: string) => {
    if (!name.trim()) return;
    const students = academyStore.getStudents();
    const newStudent: Student = { id: Date.now(), name: name.trim(), status: 'absent', arrivalTime: null, departureTime: null };
    academyStore.saveStudents([...students, newStudent]);
  },
  deleteStudent: (id: number) => {
    const students = academyStore.getStudents();
    academyStore.saveStudents(students.filter(s => s.id !== id));
  },
};