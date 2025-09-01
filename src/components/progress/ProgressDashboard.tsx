
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Trophy, 
  Clock, 
  Target, 
  Award,
  TrendingUp,
  BookOpen,
  Star
} from 'lucide-react';
import { LearningAnalytics, CourseProgress } from '@/types/progress';

interface ProgressDashboardProps {
  analytics: LearningAnalytics;
  courseProgress: CourseProgress[];
}

const ProgressDashboard: React.FC<ProgressDashboardProps> = ({ 
  analytics, 
  courseProgress 
}) => {
  const getLevelProgress = () => {
    const xpForCurrentLevel = analytics.level * 1000;
    const xpForNextLevel = (analytics.level + 1) * 1000;
    const currentLevelXP = analytics.totalXP - xpForCurrentLevel;
    const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
    return (currentLevelXP / xpNeededForNext) * 100;
  };

  return (
    <div className="space-y-6">
      {/* Statistiques générales */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Niveau</p>
                <p className="text-2xl font-bold">{analytics.level}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">XP Total</p>
                <p className="text-2xl font-bold">{analytics.totalXP.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm text-muted-foreground">Cours Terminés</p>
                <p className="text-2xl font-bold">{analytics.totalCoursesCompleted}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-5 w-5 text-purple-500" />
              <div>
                <p className="text-sm text-muted-foreground">Temps Total</p>
                <p className="text-2xl font-bold">{Math.round(analytics.totalTimeSpent / 60)}h</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progression du niveau */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5" />
            <span>Progression du Niveau</span>
          </CardTitle>
          <CardDescription>
            Niveau {analytics.level} → Niveau {analytics.level + 1}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>{analytics.totalXP.toLocaleString()} XP</span>
              <span>{((analytics.level + 1) * 1000).toLocaleString()} XP</span>
            </div>
            <Progress value={getLevelProgress()} className="h-3" />
          </div>
        </CardContent>
      </Card>

      {/* Badges récents */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Award className="h-5 w-5" />
            <span>Badges Récents</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {analytics.badges.slice(0, 8).map((badge) => (
              <div key={badge.id} className="text-center space-y-2">
                <div className="w-16 h-16 mx-auto bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center">
                  <Trophy className="h-8 w-8 text-white" />
                </div>
                <div>
                  <p className="font-medium text-sm">{badge.name}</p>
                  <Badge variant={badge.rarity === 'legendary' ? 'default' : 'secondary'}>
                    {badge.rarity}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Progression des cours */}
      <Card>
        <CardHeader>
          <CardTitle>Progression des Cours</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {courseProgress.map((progress) => (
              <div key={progress.courseId} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">Cours {progress.courseId}</span>
                  <span className="text-sm text-muted-foreground">
                    {progress.progressPercentage}%
                  </span>
                </div>
                <Progress value={progress.progressPercentage} />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{progress.completedModules}/{progress.totalModules} modules</span>
                  <span>{Math.round(progress.totalTimeSpent / 60)}h passées</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
