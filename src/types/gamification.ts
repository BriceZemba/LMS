
export interface Badge {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  category: 'completion' | 'engagement' | 'achievement' | 'social';
  criteria: BadgeCriteria;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  earnedAt?: string;
}

export interface BadgeCriteria {
  type: 'course_completion' | 'module_completion' | 'quiz_score' | 'streak' | 'time_spent' | 'forum_participation';
  value: number;
  courseId?: string;
}

export interface XPActivity {
  id: string;
  userId: string;
  activityType: 'module_completion' | 'quiz_success' | 'forum_post' | 'login_streak' | 'course_completion';
  xpAmount: number;
  courseId?: string;
  moduleId?: string;
  timestamp: string;
  description: string;
}

export interface Leaderboard {
  userId: string;
  userName: string;
  userAvatar?: string;
  totalXP: number;
  level: number;
  badges: number;
  position: number;
  courseId?: string; // pour le classement par cours
}
