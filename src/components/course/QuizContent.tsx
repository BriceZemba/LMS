
import React, { useState } from 'react';
import { ContentItem, Quiz, QuizQuestion } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { HelpCircle, Check, X, RotateCcw } from 'lucide-react';
import { toast } from 'sonner';

interface QuizContentProps {
  content: ContentItem;
  onComplete?: (contentId: string) => void;
}

const QuizContent: React.FC<QuizContentProps> = ({ content, onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [score, setScore] = useState(0);

  // Simuler un quiz basé sur le contenu
  const mockQuiz: Quiz = {
    id: content.id,
    title: content.title,
    description: content.description,
    passingScore: 70,
    questions: [
      {
        id: '1',
        question: 'Quelle est la principale caractéristique de l\'Industrie 4.0 ?',
        type: 'single-choice',
        options: [
          'La production manuelle',
          'L\'interconnexion des systèmes',
          'L\'utilisation exclusive de machines',
          'La réduction des coûts'
        ],
        correctAnswers: [1],
        explanation: 'L\'Industrie 4.0 se caractérise principalement par l\'interconnexion des systèmes et l\'utilisation de technologies numériques.'
      },
      {
        id: '2',
        question: 'Quelles technologies sont associées à l\'IoT ? (Plusieurs réponses possibles)',
        type: 'multiple-choice',
        options: [
          'Capteurs intelligents',
          'Connectivité réseau',
          'Analyse de données',
          'Machines à vapeur'
        ],
        correctAnswers: [0, 1, 2],
        explanation: 'L\'IoT combine capteurs, connectivité et analyse de données. Les machines à vapeur appartiennent à une ère industrielle antérieure.'
      }
    ]
  };

  const currentQ = mockQuiz.questions[currentQuestion];

  const handleAnswerChange = (questionId: string, answerIndex: number, checked: boolean = true) => {
    setAnswers(prev => {
      const currentAnswers = prev[questionId] || [];
      
      if (currentQ.type === 'single-choice') {
        return { ...prev, [questionId]: [answerIndex] };
      } else {
        if (checked) {
          return { ...prev, [questionId]: [...currentAnswers, answerIndex] };
        } else {
          return { ...prev, [questionId]: currentAnswers.filter(i => i !== answerIndex) };
        }
      }
    });
  };

  const calculateScore = () => {
    let correctAnswers = 0;
    
    mockQuiz.questions.forEach(question => {
      const userAnswers = answers[question.id] || [];
      const correctAnswers_q = question.correctAnswers;
      
      if (userAnswers.length === correctAnswers_q.length && 
          userAnswers.every(answer => correctAnswers_q.includes(answer))) {
        correctAnswers++;
      }
    });
    
    return Math.round((correctAnswers / mockQuiz.questions.length) * 100);
  };

  const handleSubmitQuiz = () => {
    const finalScore = calculateScore();
    setScore(finalScore);
    setShowResults(true);
    
    if (finalScore >= mockQuiz.passingScore) {
      setQuizCompleted(true);
      onComplete?.(content.id);
      toast.success(`Quiz réussi avec ${finalScore}% !`);
    } else {
      toast.error(`Score insuffisant : ${finalScore}%. Minimum requis : ${mockQuiz.passingScore}%`);
    }
  };

  const handleRetakeQuiz = () => {
    setAnswers({});
    setCurrentQuestion(0);
    setShowResults(false);
    setScore(0);
  };

  const isQuestionAnswered = () => {
    return answers[currentQ.id] && answers[currentQ.id].length > 0;
  };

  if (showResults) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <HelpCircle className="h-5 w-5 text-purple-600" />
            <span>Résultats du Quiz</span>
            {quizCompleted && <Check className="h-5 w-5 text-green-600" />}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <div className={`text-4xl font-bold mb-2 ${score >= mockQuiz.passingScore ? 'text-green-600' : 'text-red-600'}`}>
              {score}%
            </div>
            <p className="text-gray-600">
              {score >= mockQuiz.passingScore ? 'Quiz réussi !' : 'Quiz échoué'}
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Score minimum requis : {mockQuiz.passingScore}%
            </p>
          </div>

          <div className="space-y-4">
            {mockQuiz.questions.map((question, index) => {
              const userAnswers = answers[question.id] || [];
              const isCorrect = userAnswers.length === question.correctAnswers.length && 
                              userAnswers.every(answer => question.correctAnswers.includes(answer));

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start space-x-2 mb-3">
                    {isCorrect ? (
                      <Check className="h-5 w-5 text-green-600 mt-0.5" />
                    ) : (
                      <X className="h-5 w-5 text-red-600 mt-0.5" />
                    )}
                    <div>
                      <p className="font-medium">{question.question}</p>
                      <p className="text-sm text-gray-600 mt-2">{question.explanation}</p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            {score < mockQuiz.passingScore && (
              <Button onClick={handleRetakeQuiz} variant="outline">
                <RotateCcw className="h-4 w-4 mr-2" />
                Reprendre le quiz
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <HelpCircle className="h-5 w-5 text-purple-600" />
          <span>{mockQuiz.title}</span>
        </CardTitle>
        <div className="flex items-center justify-between">
          <p className="text-gray-600">{mockQuiz.description}</p>
          <span className="text-sm text-gray-500">
            {currentQuestion + 1} / {mockQuiz.questions.length}
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-purple-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / mockQuiz.questions.length) * 100}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
          <h3 className="text-lg font-medium mb-4">{currentQ.question}</h3>
          
          {currentQ.type === 'single-choice' ? (
            <RadioGroup
              value={answers[currentQ.id]?.[0]?.toString() || ''}
              onValueChange={(value) => handleAnswerChange(currentQ.id, parseInt(value))}
            >
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          ) : (
            <div className="space-y-3">
              {currentQ.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Checkbox
                    id={`option-${index}`}
                    checked={answers[currentQ.id]?.includes(index) || false}
                    onCheckedChange={(checked) => 
                      handleAnswerChange(currentQ.id, index, checked as boolean)
                    }
                  />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between pt-4 border-t">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(prev => Math.max(0, prev - 1))}
            disabled={currentQuestion === 0}
          >
            Précédent
          </Button>
          
          {currentQuestion === mockQuiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={!isQuestionAnswered()}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Terminer le quiz
            </Button>
          ) : (
            <Button
              onClick={() => setCurrentQuestion(prev => prev + 1)}
              disabled={!isQuestionAnswered()}
            >
              Suivant
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizContent;
