
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  MessageSquare, 
  Pin, 
  Lock, 
  Reply, 
  Plus,
  Search,
  Filter
} from 'lucide-react';
import { ForumTopic, ForumReply } from '@/types/forum';

interface ForumDiscussionProps {
  courseId: string;
  topics: ForumTopic[];
  onCreateTopic: () => void;
  onTopicClick: (topicId: string) => void;
}

const ForumDiscussion: React.FC<ForumDiscussionProps> = ({
  courseId,
  topics,
  onCreateTopic,
  onTopicClick
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'pinned' | 'recent'>('all');

  const filteredTopics = topics.filter(topic => {
    const matchesSearch = topic.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         topic.content.toLowerCase().includes(searchTerm.toLowerCase());
    
    switch (selectedFilter) {
      case 'pinned':
        return matchesSearch && topic.isPinned;
      case 'recent':
        return matchesSearch && new Date(topic.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      default:
        return matchesSearch;
    }
  });

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const past = new Date(date);
    const diffInHours = Math.floor((now.getTime() - past.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Il y a moins d\'une heure';
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    if (diffInHours < 48) return 'Hier';
    return past.toLocaleDateString('fr-FR');
  };

  return (
    <div className="space-y-6">
      {/* Header avec actions */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
        <div>
          <h2 className="text-2xl font-bold">Forum de Discussion</h2>
          <p className="text-muted-foreground">
            Échangez avec vos collègues apprenants et votre formateur
          </p>
        </div>
        
        <Button onClick={onCreateTopic} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>Nouveau Sujet</span>
        </Button>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="text"
                  placeholder="Rechercher dans les discussions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            
            <div className="flex space-x-2">
              <Button
                variant={selectedFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('all')}
              >
                Tous
              </Button>
              <Button
                variant={selectedFilter === 'pinned' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('pinned')}
              >
                Épinglés
              </Button>
              <Button
                variant={selectedFilter === 'recent' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setSelectedFilter('recent')}
              >
                Récents
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des sujets */}
      <div className="space-y-4">
        {filteredTopics.map((topic) => (
          <Card 
            key={topic.id} 
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() => onTopicClick(topic.id)}
          >
            <CardContent className="p-4">
              <div className="flex items-start space-x-4">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={topic.authorAvatar} alt={topic.authorName} />
                  <AvatarFallback>
                    {topic.authorName.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    {topic.isPinned && <Pin className="h-4 w-4 text-blue-500" />}
                    {topic.isLocked && <Lock className="h-4 w-4 text-gray-500" />}
                    <h3 className="font-semibold text-lg truncate">{topic.title}</h3>
                  </div>
                  
                  <p className="text-muted-foreground text-sm mb-2 line-clamp-2">
                    {topic.content}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <span>Par {topic.authorName}</span>
                      <span>{formatTimeAgo(topic.createdAt)}</span>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      {topic.tags.length > 0 && (
                        <div className="flex space-x-1">
                          {topic.tags.slice(0, 2).map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      )}
                      
                      <div className="flex items-center space-x-1 text-sm text-muted-foreground">
                        <Reply className="h-4 w-4" />
                        <span>{topic.repliesCount}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredTopics.length === 0 && (
        <Card>
          <CardContent className="p-8 text-center">
            <MessageSquare className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">Aucune discussion trouvée</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? 'Aucun sujet ne correspond à votre recherche.'
                : 'Soyez le premier à lancer une discussion !'}
            </p>
            <Button onClick={onCreateTopic}>
              Créer le premier sujet
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ForumDiscussion;
