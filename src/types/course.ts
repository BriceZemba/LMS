
export interface QuizQuestion {
  id: string;
  question: string;
  type: 'multiple-choice' | 'single-choice';
  options: string[];
  correctAnswers: number[]; // indices des bonnes réponses
  explanation?: string;
}

export interface Quiz {
  id: string;
  title: string;
  description?: string;
  questions: QuizQuestion[];
  passingScore: number; // pourcentage requis pour réussir
}

export interface ContentItem {
  id: string;
  type: 'text' | 'video' | 'pdf' | 'quiz' | 'simulation';
  title: string;
  content: string; // URL pour vidéo/PDF, markdown pour texte, etc.
  description?: string;
  downloadable?: boolean;
  duration?: number; // en minutes
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  contents: ContentItem[];
  quiz?: Quiz;
  completed?: boolean;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration: string;
  modules: Module[];
  instructor: string;
  instructorId: string;
  coverImage?: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  published: boolean;
  enrolledStudents: number;
  completionRate: number;
}

export interface UserProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  contentId?: string;
  completed: boolean;
  completedAt?: string;
  quizScore?: number;
  timeSpent: number; // en minutes
}

export interface CourseEnrollment {
  id: string;
  userId: string;
  courseId: string;
  enrolledAt: string;
  progress: UserProgress[];
  completed: boolean;
  completedAt?: string;
  certificateIssued: boolean;
}
