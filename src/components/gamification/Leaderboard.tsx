
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Trophy, Medal, Award, Crown } from 'lucide-react';
import { Leaderboard as LeaderboardType } from '@/types/gamification';

interface LeaderboardProps {
  leaderboard: LeaderboardType[];
  currentUserId: string;
  title?: string;
}

const Leaderboard: React.FC<LeaderboardProps> = ({ 
  leaderboard, 
  currentUserId, 
  title = "Classement Général" 
}) => {
  const getPositionIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Crown className="h-5 w-5 text-yellow-500" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-400" />;
      case 3:
        return <Award className="h-5 w-5 text-orange-500" />;
      default:
        return <span className="text-sm font-bold text-muted-foreground">#{position}</span>;
    }
  };

  const getPositionBg = (position: number, isCurrentUser: boolean) => {
    if (isCurrentUser) return "bg-blue-50 border-blue-200";
    if (position <= 3) return "bg-gradient-to-r from-yellow-50 to-orange-50";
    return "bg-white";
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="space-y-1">
          {leaderboard.map((entry) => {
            const isCurrentUser = entry.userId === currentUserId;
            
            return (
              <div 
                key={entry.userId}
                className={`p-4 border transition-colors ${getPositionBg(entry.position, isCurrentUser)}`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="flex items-center justify-center w-8">
                      {getPositionIcon(entry.position)}
                    </div>
                    
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={entry.userAvatar} alt={entry.userName} />
                      <AvatarFallback>
                        {entry.userName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <p className={`font-medium ${isCurrentUser ? 'text-blue-600' : ''}`}>
                        {entry.userName} {isCurrentUser && '(Vous)'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        Niveau {entry.level} • {entry.badges} badges
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-right">
                    <Badge variant={entry.position <= 3 ? 'default' : 'outline'}>
                      {entry.totalXP.toLocaleString()} XP
                    </Badge>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default Leaderboard;
