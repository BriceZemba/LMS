
import React, { useState, useRef } from 'react';
import { ContentItem } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, Check } from 'lucide-react';

interface VideoContentProps {
  content: ContentItem;
  onComplete?: (contentId: string) => void;
}

const VideoContent: React.FC<VideoContentProps> = ({ content, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const videoRef = useRef<HTMLIFrameElement>(null);

  const extractYouTubeId = (url: string): string | null => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : null;
  };

  const youtubeId = extractYouTubeId(content.content);

  const handleVideoProgress = () => {
    // Simuler la progression (normalement géré par l'API YouTube)
    if (watchedPercentage < 90) {
      setWatchedPercentage(prev => Math.min(prev + 10, 90));
    } else if (!isCompleted) {
      setIsCompleted(true);
      onComplete?.(content.id);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
    if (!isPlaying) {
      // Simuler la progression vidéo
      const interval = setInterval(() => {
        handleVideoProgress();
      }, 5000);
      
      setTimeout(() => clearInterval(interval), 30000);
    }
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Play className="h-5 w-5 text-red-600" />
          <span>{content.title}</span>
          {isCompleted && <Check className="h-5 w-5 text-green-600" />}
        </CardTitle>
        {content.description && (
          <p className="text-gray-600">{content.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full">
          {youtubeId ? (
            <iframe
              ref={videoRef}
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${youtubeId}?enablejsapi=1`}
              title={content.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          ) : (
            <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <Play className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Vidéo non disponible</p>
                <p className="text-sm text-gray-400">URL: {content.content}</p>
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="text-gray-600">{watchedPercentage}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${watchedPercentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={togglePlay}
              className="flex items-center space-x-2"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
            </Button>
            <Volume2 className="h-4 w-4 text-gray-500" />
          </div>
          
          {content.duration && (
            <div className="text-sm text-gray-500">
              Durée : {content.duration} min
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoContent;
