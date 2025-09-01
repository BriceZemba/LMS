import React, { useEffect, useRef, useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  FileText,
  Download,
  ExternalLink,
  Check,
  AlertCircle,
  Eye,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface DocumentData {
  id: string;
  title: string;
  document_type: 'file' | 'url';
  file_path?: string;
  url?: string;
  file_size?: number;
  mime_type?: string;
}

interface DocumentContentEnhancedProps {
  document: DocumentData;
  onComplete?: (documentId: string) => void;
}

const DocumentContentEnhanced: React.FC<DocumentContentEnhancedProps> = ({
  document,
  onComplete,
}) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  /* ----------  INFINITE-SCROLL LOGIC  ---------- */
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [percentVisible, setPercentVisible] = useState(0);

  // Intersection observer: how much of the content is in view?
  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const onScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      const total = scrollHeight - clientHeight;
      const ratio = total <= 0 ? 1 : Math.min(scrollTop / total, 1);
      setPercentVisible(ratio);

      // Mark as completed when 90 % has been scrolled into view
      if (ratio >= 0.9 && !isCompleted) {
        setIsCompleted(true);
        onComplete?.(document.id);
      }
    };

    container.addEventListener('scroll', onScroll);
    return () => container.removeEventListener('scroll', onScroll);
  }, [isCompleted, onComplete, document.id]);

  /* ----------  RENDER HELPERS  ---------- */
  const getSrc = () =>
    document.document_type === 'url' ? document.url : document.file_path;

  const renderContent = () => {
    const src = getSrc();
    if (!src) return <p>Aucune source disponible</p>;

    const mime = (document.mime_type || '').toLowerCase();

    // PDF
    if (mime.includes('pdf')) {
      return (
        <iframe
          src={`https://docs.google.com/viewer?url=${encodeURIComponent(src)}&embedded=true`}
          className="w-full h-full"
          title={document.title}
          onLoad={() => setLoading(false)}
          onError={() => {
            setError('Impossible de charger le PDF');
            setLoading(false);
          }}
        />
      );
    }

    // Images
    if (mime.startsWith('image/')) {
      return (
        <img
          src={src}
          alt={document.title}
          className="max-w-full h-auto rounded"
          onLoad={() => setLoading(false)}
          onError={() => {
            setError('Impossible de charger l’image');
            setLoading(false);
          }}
        />
      );
    }

    // Plain text / markdown (fallback)
    return (
      <iframe
        src={src}
        className="w-full h-full"
        title={document.title}
        onLoad={() => setLoading(false)}
        onError={() => {
          setError('Impossible de charger le document');
          setLoading(false);
        }}
      />
    );
  };


  const openInNewTab = () => window.open(getSrc()!, '_blank');

  /* ----------  UI  ---------- */
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <FileText className="h-5 w-5 text-blue-600" />
            <span>{document.title}</span>
            {isCompleted && <Check className="h-5 w-5 text-green-600" />}
          </div>

          <div className="flex items-center space-x-2">
            <Badge variant="outline">
              {document.mime_type?.includes('pdf')
                ? 'PDF'
                : document.mime_type?.startsWith('image')
                ? 'Image'
                : 'Document'}
            </Badge>

            <Button
              variant="ghost"
              size="sm"
              onClick={openInNewTab}
              title="Ouvrir dans un nouvel onglet"
            >
              <ExternalLink className="h-4 w-4" />
            </Button>
          </div>
        </CardTitle>
      </CardHeader>

      <CardContent>
        {/* Loading / Error states */}
        {error && (
          <div className="flex h-64 items-center justify-center rounded-lg bg-red-50">
            <div className="text-center text-red-600">
              <AlertCircle className="mx-auto mb-2 h-10 w-10" />
              <p>{error}</p>
            </div>
          </div>
        )}

        {loading && !error && (
          <div className="flex h-64 items-center justify-center rounded-lg bg-gray-100">
            <Eye className="h-10 w-10 animate-pulse text-gray-400" />
          </div>
        )}

        {/* Scrollable container with initial 80 % height */}
        {!error && (
          <div
            ref={scrollContainerRef}
            className="w-full h-[70vh] rounded border bg-white"
          >
            {renderContent()}
          </div>
        )}

        {/* Progress indicator */}
        <div className="mt-3 flex items-center justify-between text-sm text-gray-600">
          <span>Contenu consulté</span>
          <span>{Math.round(percentVisible * 100)} %</span>
        </div>
        <div className="h-1 w-full bg-gray-200 rounded">
          <div
            className="h-1 bg-blue-600 rounded transition-all"
            style={{ width: `${Math.round(percentVisible * 100)}%` }}
          />
        </div>

        <p className="mt-2 text-xs text-gray-400">
          Faites défiler vers le bas pour charger la suite du document.
        </p>
      </CardContent>
    </Card>
  );
};

export default DocumentContentEnhanced;