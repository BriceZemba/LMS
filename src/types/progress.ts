
import type { Badge } from './gamification';

export interface UserProgress {
  userId: string;
  courseId: string;
  moduleId: string;
  contentId?: string;
  completed: boolean;
  completedAt?: string;
  quizScore?: number;
  timeSpent: number; // en minutes
  xpEarned: number;
}

export interface CourseProgress {
  courseId: string;
  userId: string;
  totalModules: number;
  completedModules: number;
  progressPercentage: number;
  totalTimeSpent: number;
  averageQuizScore: number;
  lastAccessedAt: string;
  isCompleted: boolean;
  completedAt?: string;
}

export interface LearningAnalytics {
  userId: string;
  totalCoursesEnrolled: number;
  totalCoursesCompleted: number;
  totalXP: number;
  totalTimeSpent: number;
  averageScore: number;
  badges: Badge[];
  level: number;
  currentStreak: number;
  longestStreak: number;
}

export interface CourseAnalytics {
  courseId: string;
  totalEnrollments: number;
  totalCompletions: number;
  completionRate: number;
  averageTimeSpent: number;
  averageScore: number;
  activeStudents: number;
  inactiveStudents: number;
  dropoffPoints: { moduleId: string; dropoffRate: number }[];
}
