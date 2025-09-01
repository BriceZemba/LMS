
export type UserRole = 'admin' | 'instructor' | 'student' | 'professional' | 'company';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  isActive: boolean;
  company?: string;
  bio?: string;
  skills?: string[];
}

export interface AdminStats {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  activeUsers: number;
  completedCourses: number;
  averageCompletionRate: number;
  usersByRole: Record<UserRole, number>;
  coursesCreatedThisMonth: number;
  enrollmentsThisMonth: number;
}
