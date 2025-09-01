
import React, { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Star, Zap, Plus } from 'lucide-react';
import { XPActivity } from '@/types/gamification';

interface XPSystemProps {
  currentXP: number;
  level: number;
  recentActivities: XPActivity[];
  onXPGained?: (amount: number) => void;
}

const XPSystem: React.FC<XPSystemProps> = ({ 
  currentXP, 
  level, 
  recentActivities, 
  onXPGained 
}) => {
  const [animatingXP, setAnimatingXP] = useState<number | null>(null);

  const xpForCurrentLevel = level * 1000;
  const xpForNextLevel = (level + 1) * 1000;
  const currentLevelXP = currentXP - xpForCurrentLevel;
  const xpNeededForNext = xpForNextLevel - xpForCurrentLevel;
  const progressPercentage = (currentLevelXP / xpNeededForNext) * 100;

  const showXPGain = (amount: number) => {
    setAnimatingXP(amount);
    setTimeout(() => setAnimatingXP(null), 2000);
  };

  useEffect(() => {
    if (recentActivities.length > 0) {
      const latestActivity = recentActivities[0];
      if (Date.now() - new Date(latestActivity.timestamp).getTime() < 5000) {
        showXPGain(latestActivity.xpAmount);
      }
    }
  }, [recentActivities]);

  return (
    <div className="relative">
      {/* Animation XP */}
      {animatingXP && (
        <div className="absolute top-0 right-0 z-10 animate-fade-in">
          <div className="bg-yellow-500 text-white px-3 py-1 rounded-full flex items-center space-x-1 animate-slide-up">
            <Plus className="h-4 w-4" />
            <span className="font-bold">{animatingXP} XP</span>
          </div>
        </div>
      )}

      <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Star className="h-6 w-6 text-yellow-400" />
              <span className="text-xl font-bold">Niveau {level}</span>
            </div>
            <Badge variant="secondary" className="bg-white/20 text-white">
              {currentXP.toLocaleString()} XP
            </Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm opacity-90">
              <span>{currentLevelXP} XP</span>
              <span>{xpNeededForNext} XP</span>
            </div>
            <div className="w-full bg-white/20 rounded-full h-3">
              <div 
                className="bg-yellow-400 h-3 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progressPercentage, 100)}%` }}
              />
            </div>
            <p className="text-xs opacity-75 text-center">
              {xpNeededForNext - currentLevelXP} XP pour le niveau suivant
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Activités récentes */}
      {recentActivities.length > 0 && (
        <Card className="mt-4">
          <CardContent className="p-4">
            <h4 className="font-medium mb-3 flex items-center space-x-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              <span>Activités Récentes</span>
            </h4>
            <div className="space-y-2">
              {recentActivities.slice(0, 5).map((activity) => (
                <div key={activity.id} className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">{activity.description}</span>
                  <Badge variant="outline" className="text-yellow-600">
                    +{activity.xpAmount} XP
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default XPSystem;
