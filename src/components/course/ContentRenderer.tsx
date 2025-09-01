
import React from 'react';
import { ContentItem } from '@/types/course';
import TextContent from './TextContent';
import VideoContentEnhanced from './VideoContentEnhanced';
import DocumentContentEnhanced from './DocumentContentEnhanced';
import QuizContentEnhanced from './QuizContentEnhanced';
import SimulationContent from './SimulationContent';

interface ContentRendererProps {
  content: ContentItem;
  onComplete?: (contentId: string) => void;
  onDownload?: (contentId: string, title: string) => void;
}

const ContentRenderer: React.FC<ContentRendererProps> = ({ 
  content, 
  onComplete, 
  onDownload 
}) => {
  const renderContent = () => {
    switch (content.type) {
      case 'text':
        return <TextContent content={content} onComplete={onComplete} />;
      case 'video':
        // Pour les vidéos, on utilise le nouveau composant avec les données appropriées
        const videoData = {
          id: content.id,
          title: content.title,
          video_type: 'url' as const,
          url: content.content,
          duration: content.duration ? Number(content.duration) : undefined
        };
        return <VideoContentEnhanced video={videoData} onComplete={onComplete} />;
      case 'pdf':
        // Pour les documents, on utilise le nouveau composant avec les données appropriées
        const documentData = {
          id: content.id,
          title: content.title,
          document_type: 'url' as const,
          url: content.content,
          mime_type: 'application/pdf'
        };
        return <DocumentContentEnhanced document={documentData} onComplete={onComplete} />;
      case 'quiz':
        return <QuizContentEnhanced content={content} onComplete={onComplete} />;
      case 'simulation':
        return <SimulationContent content={content} onComplete={onComplete} />;
      default:
        return <div className="p-4 text-gray-500">Type de contenu non pris en charge</div>;
    }
  };

  return (
    <div className="w-full">
      {renderContent()}
    </div>
  );
};

export default ContentRenderer;
