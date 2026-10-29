export type UserRole = 'student' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  role: UserRole;
  xp: number;
  streak: number;
  level: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  arabicPhrase?: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VocabItem {
  id: string;
  arabic: string;
  transliteration: string;
  meaning: string;
  category: string;
  exampleSentence?: string;
  exampleTranslation?: string;
  mastered?: boolean;
}

export interface ContentSection {
  title: string;
  type: 'theory' | 'dialogue' | 'examples' | 'table';
  arabicText?: string;
  transliteration?: string;
  indonesian?: string;
  explanation?: string;
  dialogueLines?: {
    speaker: string;
    speakerArabic?: string;
    arabic: string;
    transliteration: string;
    translation: string;
  }[];
  tableData?: {
    headers: string[];
    rows: string[][];
  };
}

export interface Lesson {
  id: string;
  courseId: string;
  title: string;
  titleArabic: string;
  order: number;
  durationMinutes: number;
  summary: string;
  sections: ContentSection[];
  vocabulary: VocabItem[];
  quiz: QuizQuestion[];
}

export interface Course {
  id: string;
  title: string;
  titleArabic: string;
  level: 'Mubtadi\' (Pemula)' | 'Mutawassith (Menengah)' | 'Mutaqaddim (Lanjut)';
  category: 'Nahwu' | 'Shorof' | 'Muhadatsah' | 'Mufradat' | 'Qira\'ah';
  description: string;
  iconName: string;
  lessons: Lesson[];
}

export interface LessonProgress {
  userId: string;
  lessonId: string;
  courseId: string;
  completed: boolean;
  quizScore?: number;
  updatedAt: string;
}

export interface IrabWordAnalysis {
  word: string;
  type: string;
  root?: string;
  irab: string;
  meaning: string;
}

export interface TashkeelResponse {
  original: string;
  vocalized: string;
  transliteration: string;
  translation: string;
  summary: string;
  words: IrabWordAnalysis[];
}

export interface MuhadatsahResponse {
  arabicResponse: string;
  transliteration: string;
  indonesianTranslation: string;
  correctionFeedback?: string;
  suggestedNextReplies?: string[];
}
