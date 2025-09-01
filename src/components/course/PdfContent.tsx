
import React, { useState } from 'react';
import { ContentItem } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Download, Eye, Check } from 'lucide-react';
import { toast } from 'sonner';

interface PdfContentProps {
  content: ContentItem;
  onComplete?: (contentId: string) => void;
  onDownload?: (contentId: string, title: string) => void;
}

const PdfContent: React.FC<PdfContentProps> = ({ content, onComplete, onDownload }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isViewing, setIsViewing] = useState(false);

  const handleDownload = () => {
    // Simuler le téléchargement
    toast.success(`Téléchargement de "${content.title}" commencé`);
    onDownload?.(content.id, content.title);
    
    // Marquer comme complété après téléchargement
    if (!isCompleted) {
      setIsCompleted(true);
      onComplete?.(content.id);
    }
  };

  const handleView = () => {
    setIsViewing(true);
    // Simuler la visualisation et marquer comme complété
    setTimeout(() => {
      if (!isCompleted) {
        setIsCompleted(true);
        onComplete?.(content.id);
      }
    }, 3000);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-red-600" />
          <span>{content.title}</span>
          {isCompleted && <Check className="h-5 w-5 text-green-600" />}
        </CardTitle>
        {content.description && (
          <p className="text-gray-600">{content.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {isViewing ? (
          <div className="aspect-[4/3] w-full bg-gray-100 rounded-lg flex items-center justify-center">
            <div className="text-center">
              <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 font-medium">Aperçu du document PDF</p>
              <p className="text-sm text-gray-500 mt-2">
                {content.title}
              </p>
              <div className="mt-4 space-y-2">
                <div className="w-full h-2 bg-gray-200 rounded">
                  <div className="w-3/4 h-2 bg-blue-600 rounded animate-pulse"></div>
                </div>
                <p className="text-xs text-gray-500">Chargement du document...</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Document PDF
            </h3>
            <p className="text-gray-600 mb-4">
              Cliquez pour visualiser ou télécharger le document
            </p>
            <p className="text-sm text-gray-500">
              {content.content}
            </p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              onClick={handleView}
              className="flex items-center space-x-2"
            >
              <Eye className="h-4 w-4" />
              <span>Visualiser</span>
            </Button>
            
            {content.downloadable && (
              <Button
                onClick={handleDownload}
                className="bg-blue-600 hover:bg-blue-700 flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Télécharger</span>
              </Button>
            )}
          </div>
          
          <div className="text-sm text-gray-500">
            Format : ...
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PdfContent;
