
import React, { useState, useEffect } from 'react';
import { ContentItem } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BookOpen, Check } from 'lucide-react';

interface TextContentProps {
  content: ContentItem;
  onComplete?: (contentId: string) => void;
}

const TextContent: React.FC<TextContentProps> = ({ content, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [readingTime, setReadingTime] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setReadingTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleMarkAsComplete = () => {
    setIsCompleted(true);
    onComplete?.(content.id);
  };

  // Simuler le contenu markdown en HTML simple
  const renderMarkdownContent = (text: string) => {
    return text.split('\n').map((line, index) => {
      if (line.startsWith('# ')) {
        return <h1 key={index} className="text-2xl font-bold mb-4">{line.slice(2)}</h1>;
      }
      if (line.startsWith('## ')) {
        return <h2 key={index} className="text-xl font-semibold mb-3">{line.slice(3)}</h2>;
      }
      if (line.startsWith('### ')) {
        return <h3 key={index} className="text-lg font-medium mb-2">{line.slice(4)}</h3>;
      }
      if (line.trim() === '') {
        return <br key={index} />;
      }
      return <p key={index} className="mb-3 text-gray-700 leading-relaxed">{line}</p>;
    });
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <BookOpen className="h-5 w-5 text-blue-600" />
          <span>{content.title}</span>
          {isCompleted && <Check className="h-5 w-5 text-green-600" />}
        </CardTitle>
        {content.description && (
          <p className="text-gray-600">{content.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="prose max-w-none">
          {renderMarkdownContent(content.content)}
        </div>
        
        <div className="flex items-center justify-between pt-4 border-t">
          <div className="text-sm text-gray-500">
            Temps de lecture : {Math.floor(readingTime / 60)}:{(readingTime % 60).toString().padStart(2, '0')}
          </div>
          
          {!isCompleted && (
            <Button onClick={handleMarkAsComplete} className="bg-green-600 hover:bg-green-700">
              <Check className="h-4 w-4 mr-2" />
              Marquer comme terminé
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextContent;
