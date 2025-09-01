import React, { useState } from 'react';
import { ContentItem } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Play, Trophy, Clock, HelpCircle } from 'lucide-react';
import QuizPlayerEnhanced from '@/components/quiz/QuizPlayerEnhanced';

interface QuizContentEnhancedProps {
  content: ContentItem;
  onComplete?: (contentId: string) => void;
}

const QuizContentEnhanced: React.FC<QuizContentEnhancedProps> = ({ content, onComplete }) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [completed, setCompleted] = useState(false);

  const handleStartQuiz = () => {
    setShowQuiz(true);
  };

  const handleQuizComplete = (results: any) => {
    setCompleted(true);
    onComplete?.(content.id);
  };

  const handleCloseQuiz = () => {
    setShowQuiz(false);
  };

  if (showQuiz) {
    return (
      <QuizPlayerEnhanced
        quizId={parseInt(content.id)}
        onComplete={handleQuizComplete}
        onClose={handleCloseQuiz}
      />
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Trophy className="h-5 w-5 text-yellow-600" />
          <span>{content.title}</span>
        </CardTitle>
        {content.description && (
          <p className="text-gray-600">{content.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-6 text-center">
          <Trophy className="h-16 w-16 text-yellow-500 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Prêt pour le quiz ?
          </h3>
          <p className="text-gray-600 mb-6">
            Testez vos connaissances avec ce quiz interactif. 
            Vous recevrez votre score et les corrections à la fin.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 text-sm">
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <HelpCircle className="h-4 w-4" />
              <span>Questions variées</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Clock className="h-4 w-4" />
              <span>Temps libre</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-600">
              <Trophy className="h-4 w-4" />
              <span>Score instantané</span>
            </div>
          </div>

          <Button
            onClick={handleStartQuiz}
            size="lg"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
          >
            <Play className="h-5 w-5 mr-2" />
            Commencer le quiz
          </Button>
        </div>

        {completed && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
            <Trophy className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-green-800 font-medium">Quiz terminé avec succès !</p>
            <p className="text-green-600 text-sm">Vous pouvez le refaire à tout moment.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuizContentEnhanced;

