import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Pause, Volume2, Check, ExternalLink, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface VideoData {
  id: string;
  title: string;
  video_type: 'file' | 'url' | 'youtube' | 'vimeo';
  url?: string;
  file_path?: string;
  duration?: number;
  thumbnail_url?: string;
}

interface VideoContentEnhancedProps {
  video: VideoData;
  onComplete?: (videoId: string) => void;
}

const VideoContentEnhanced: React.FC<VideoContentEnhancedProps> = ({ video, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [watchedPercentage, setWatchedPercentage] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

/* ----------  HOOK YOUTUBE API (progression réelle) ---------- */
useEffect(() => {
  if (video.video_type !== 'youtube') return;

  const id = extractYouTubeId(video.url || '');
  if (!id) return;

  if (!(window as any).YT) {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const first = document.getElementsByTagName('script')[0];
    first.parentNode!.insertBefore(tag, first);
  }

  (window as any).onYouTubeIframeAPIReady = () => {
    const player = new (window as any).YT.Player(`yt-${video.id}`, {
      events: {
        onStateChange: (e: any) => {
          if (e.data === (window as any).YT.PlayerState.PLAYING) {
            const iv = setInterval(() => {
              const c = player.getCurrentTime();
              const d = player.getDuration();
              const pct = (c / d) * 100;
              setWatchedPercentage(pct);
              if (pct >= 90 && !isCompleted) {
                setIsCompleted(true);
                onComplete?.(video.id);
                clearInterval(iv);
              }
            }, 1000);
          }
        },
      },
    });
  };
}, [video, isCompleted, onComplete]);

  const extractYouTubeId = (url: string): string | null => {
    const patterns = [
      /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
      /youtube\.com\/embed\/([^&\n?#]+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const extractVimeoId = (url: string): string | null => {
    const patterns = [
      /vimeo\.com\/(\d+)/,
      /player\.vimeo\.com\/video\/(\d+)/
    ];
    
    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match) return match[1];
    }
    return null;
  };

  const handleVideoProgress = (currentTime: number, duration: number) => {
    if (duration > 0) {
      const percentage = Math.round((currentTime / duration) * 100);
      setWatchedPercentage(percentage);
      
      // Marquer comme complété à 90%
      if (percentage >= 90 && !isCompleted) {
        setIsCompleted(true);
        onComplete?.(video.id);
      }
    }
  };

  const handleVideoTimeUpdate = () => {
    if (videoRef.current) {
      const { currentTime, duration } = videoRef.current;
      handleVideoProgress(currentTime, duration);
    }
  };

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const formatDuration = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const renderVideoPlayer = () => {
    if (!video.url && !video.file_path) {
      return (
        <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
            <p className="text-gray-500">Aucune source vidéo disponible</p>
          </div>
        </div>
      );
    }
    // Détection précoce YouTube / Vimeo
    if (video.video_type === 'url' && video.url) {
      if (extractYouTubeId(video.url)) {
        video.video_type = 'youtube';
      } else if (extractVimeoId(video.url)) {
        video.video_type = 'vimeo';
      }
    }
    console.log('📺 Rendering video player for type:', video.video_type);
    
    switch (video.video_type) {
      
      case 'youtube': {
        const id = extractYouTubeId(video.url || '');
        if (!id) return null;
        return (
          <div className="aspect-video w-full">
            <iframe
              id={`yt-${video.id}`}
              className="w-full h-full rounded-lg"
              src={`https://www.youtube.com/embed/${id}?enablejsapi=1&rel=0`}
              title={video.title}
              allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        );
      }

case 'vimeo': {
  const id = video.url?.match(/vimeo\.com\/(\d+)/)?.[1];
  if (!id) return null;

  return (
    <div className="aspect-video w-full">
      <iframe
        src={`https://player.vimeo.com/video/${id}?title=0&byline=0&portrait=0`}
        title={video.title}
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
        className="w-full h-full rounded-lg"
      />
    </div>
  );
}

      case 'file':
        return (
          <video
            ref={videoRef}
            className="w-full h-full rounded-lg"
            controls
            onTimeUpdate={handleVideoTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setError('Erreur lors du chargement de la vidéo')}
            poster={video.thumbnail_url}
          >
            <source src={video.file_path} type="video/mp4" />
            <source src={video.file_path} type="video/webm" />
            <source src={video.file_path} type="video/ogg" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        );

      case 'url':
      default:
        return (
          <video
            ref={videoRef}
            className="w-full h-full rounded-lg"
            controls
            onTimeUpdate={handleVideoTimeUpdate}
            onPlay={() => setIsPlaying(true)}
            onPause={() => setIsPlaying(false)}
            onError={() => setError('Erreur lors du chargement de la vidéo')}
            poster={video.thumbnail_url}
          >
            <source src={video.url} type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        );
    }
  };

  const getVideoTypeBadge = () => {
    const badgeProps = {
      youtube: { variant: 'destructive' as const, text: 'YouTube' },
      vimeo: { variant: 'secondary' as const, text: 'Vimeo' },
      file: { variant: 'default' as const, text: 'Fichier' },
      url: { variant: 'outline' as const, text: 'Lien direct' }
    };
    const props = badgeProps[video.video_type] || badgeProps.url;
    return <Badge variant={props.variant}>{props.text}</Badge>;
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Play className="h-5 w-5 text-red-600" />
            <span>{video.title}</span>
            {isCompleted && <Check className="h-5 w-5 text-green-600" />}
          </div>
          <div className="flex items-center space-x-2">
            {getVideoTypeBadge()}
            {video.video_type === 'youtube' || video.video_type === 'vimeo' ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open(video.url, '_blank')}
              >
                <ExternalLink className="h-4 w-4" />
              </Button>
            ) : null}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {error ? (
          <div className="aspect-video w-full bg-red-50 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <AlertCircle className="h-16 w-16 text-red-400 mx-auto mb-4" />
              <p className="text-red-600 font-medium">Erreur de chargement</p>
              <p className="text-sm text-red-500 mt-2">{error}</p>
            </div>
          </div>
        ) : (
          <div className="aspect-video w-full">
            {renderVideoPlayer()}
          </div>
        )}

        {/* Barre de progression pour les vidéos */}
        {(video.video_type === 'youtube' || video.video_type === 'url'|| video.video_type === 'vimeo') && (
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progression</span>
              <span className="text-gray-600">{Math.round(watchedPercentage)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${watchedPercentage}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            {(video.video_type === 'youtube' || video.video_type === 'vimeo'|| video.video_type === 'url' ) && (
              <Button
                variant="outline"
                size="sm"
                onClick={togglePlay}
                className="flex items-center space-x-2"
                disabled={!!error}
              >
                {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                <span>{isPlaying ? 'Pause' : 'Lecture'}</span>
              </Button>
            )}
            <Volume2 className="h-4 w-4 text-gray-500" />
          </div>
          
          {video.duration && (
            <div className="text-sm text-gray-500">
              Durée : {formatDuration(video.duration)}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default VideoContentEnhanced;

