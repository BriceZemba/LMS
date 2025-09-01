import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  XCircle, 
  HelpCircle, 
  ArrowRight, 
  ArrowLeft,
  Trophy,
  RotateCcw
} from 'lucide-react';
import { courseServiceEnhanced } from '@/services/courseServiceEnhanced';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

interface QuizQuestion {
  id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  points: number;
  explanation?: string;
  options: Array<{
    id: number;
    option_text: string;
    is_correct: boolean;
  }>;
}

interface QuizData {
  id: number;
  title: string;
  description?: string;
  questions: QuizQuestion[];
}

interface QuizPlayerEnhancedProps {
  quizId: number;
  onComplete?: (results: any) => void;
  onClose?: () => void;
}

interface UserAnswer {
  questionId: number;
  selectedOptionId?: number;
  textAnswer?: string;
}

const QuizPlayerEnhanced: React.FC<QuizPlayerEnhancedProps> = ({
  quizId,
  onComplete,
  onClose
}) => {
  const { user } = useSupabaseAuth();
  const [quiz, setQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>([]);
  const [quizResultId, setQuizResultId] = useState<number | null>(null);
  const [showResults, setShowResults] = useState(false);
  const [results, setResults] = useState<any>(null);
  const [timeStarted, setTimeStarted] = useState<Date | null>(null);
  const [timeElapsed, setTimeElapsed] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Timer
  useEffect(() => {
    if (timeStarted && !showResults) {
      const interval = setInterval(() => {
        setTimeElapsed(Math.floor((Date.now() - timeStarted.getTime()) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [timeStarted, showResults]);

  // Charger le quiz
  useEffect(() => {
    const loadQuiz = async () => {
      try {
        const result = await courseServiceEnhanced.getQuizWithQuestions(quizId);
        if (result.success && result.data) {
          // Organiser les données du quiz
          const quizStructure = result.data;
          const questionsMap = new Map();
          
          quizStructure.questions.forEach((item: any) => {
            if (!questionsMap.has(item.question_id)) {
              questionsMap.set(item.question_id, {
                id: item.question_id,
                question_text: item.question_text,
                question_type: item.question_type,
                points: item.points,
                explanation: item.explanation,
                options: []
              });
            }
            
            if (item.option_id) {
              questionsMap.get(item.question_id).options.push({
                id: item.option_id,
                option_text: item.option_text,
                is_correct: item.is_correct
              });
            }
          });

          const quizData: QuizData = {
            id: quizId,
            title: quizStructure[0]?.quiz_title || 'Quiz',
            description: quizStructure[0]?.quiz_description,
            questions: Array.from(questionsMap.values()).sort((a, b) => a.id - b.id)
          };

          setQuiz(quizData);
          
          // Démarrer le quiz
          if (user) {
            const startResult = await courseServiceEnhanced.startQuiz(quizId, user.id);
            if (startResult.success) {
              setQuizResultId(startResult.data.id);
              setTimeStarted(new Date());
            }
          }
        }
      } catch (error) {
        console.error('Error loading quiz:', error);
        toast.error('Erreur lors du chargement du quiz');
      } finally {
        setLoading(false);
      }
    };

    loadQuiz();
  }, [quizId, user]);

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const getCurrentAnswer = (): UserAnswer | undefined => {
    return userAnswers.find(answer => 
      answer.questionId === quiz?.questions[currentQuestionIndex]?.id
    );
  };

  const updateAnswer = (answer: Partial<UserAnswer>) => {
    const questionId = quiz?.questions[currentQuestionIndex]?.id;
    if (!questionId) return;

    setUserAnswers(prev => {
      const existing = prev.find(a => a.questionId === questionId);
      if (existing) {
        return prev.map(a => 
          a.questionId === questionId 
            ? { ...a, ...answer }
            : a
        );
      } else {
        return [...prev, { questionId, ...answer }];
      }
    });
  };

  const goToQuestion = (index: number) => {
    if (index >= 0 && index < (quiz?.questions.length || 0)) {
      setCurrentQuestionIndex(index);
    }
  };

  const submitQuiz = async () => {
    if (!quiz || !quizResultId || !user) return;

    setSubmitting(true);
    try {
      // Soumettre toutes les réponses
      for (const answer of userAnswers) {
        await courseServiceEnhanced.submitQuizAnswer(quizResultId, answer.questionId, {
          selected_option_id: answer.selectedOptionId,
          text_answer: answer.textAnswer
        });
      }

      // Terminer le quiz
      const completeResult = await courseServiceEnhanced.completeQuiz(quizResultId);
      if (completeResult.success) {
        setResults(completeResult.data);
        setShowResults(true);
        onComplete?.(completeResult.data);
      }
    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast.error('Erreur lors de la soumission du quiz');
    } finally {
      setSubmitting(false);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestionIndex(0);
    setUserAnswers([]);
    setShowResults(false);
    setResults(null);
    setTimeStarted(new Date());
    setTimeElapsed(0);
  };

  if (loading) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Chargement du quiz...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!quiz) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardContent className="text-center py-12">
          <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">Quiz non trouvé</h3>
          <p className="text-gray-600 mb-4">Le quiz demandé n'existe pas ou n'est pas accessible.</p>
          <Button onClick={onClose}>Fermer</Button>
        </CardContent>
      </Card>
    );
  }

  if (showResults && results) {
    return (
      <Card className="w-full max-w-4xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Trophy className="h-12 w-12 text-yellow-500" />
          </div>
          <CardTitle className="text-2xl">Quiz terminé !</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-600">
                {results.correct_answers || 0}
              </div>
              <div className="text-sm text-gray-600">Bonnes réponses</div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-gray-600">
                {results.total_questions || quiz.questions.length}
              </div>
              <div className="text-sm text-gray-600">Questions totales</div>
            </div>
            <div className="bg-green-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(results.percentage || 0)}%
              </div>
              <div className="text-sm text-gray-600">Score</div>
            </div>
            <div className="bg-purple-50 rounded-lg p-4">
              <div className="text-2xl font-bold text-purple-600">
                {formatTime(timeElapsed)}
              </div>
              <div className="text-sm text-gray-600">Temps écoulé</div>
            </div>
          </div>

          <div className="text-center">
            <Badge 
              variant={results.passed ? "default" : "destructive"}
              className="text-lg px-4 py-2"
            >
              {results.passed ? "Réussi" : "Échoué"}
            </Badge>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Révision des réponses</h3>
            {quiz.questions.map((question, index) => {
              const userAnswer = userAnswers.find(a => a.questionId === question.id);
              const isCorrect = question.question_type === 'short_answer' 
                ? null // Les réponses courtes nécessitent une correction manuelle
                : question.options.some(opt => 
                    opt.id === userAnswer?.selectedOptionId && opt.is_correct
                  );

              return (
                <div key={question.id} className="border rounded-lg p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-medium flex-1">{question.question_text}</h4>
                    <div className="flex items-center space-x-2">
                      {isCorrect === true && <CheckCircle className="h-5 w-5 text-green-600" />}
                      {isCorrect === false && <XCircle className="h-5 w-5 text-red-600" />}
                      {isCorrect === null && <HelpCircle className="h-5 w-5 text-yellow-600" />}
                    </div>
                  </div>

                  {question.question_type === 'short_answer' ? (
                    <div className="space-y-2">
                      <p className="text-sm text-gray-600">Votre réponse :</p>
                      <p className="bg-gray-50 p-2 rounded">{userAnswer?.textAnswer || 'Aucune réponse'}</p>
                    </div>
                  ) : (
                    <div className="space-y-1">
                      {question.options.map(option => {
                        const isSelected = option.id === userAnswer?.selectedOptionId;
                        const isCorrectOption = option.is_correct;
                        
                        return (
                          <div 
                            key={option.id}
                            className={`p-2 rounded text-sm ${
                              isSelected && isCorrectOption ? 'bg-green-100 text-green-800' :
                              isSelected && !isCorrectOption ? 'bg-red-100 text-red-800' :
                              !isSelected && isCorrectOption ? 'bg-blue-100 text-blue-800' :
                              'bg-gray-50'
                            }`}
                          >
                            <span className="mr-2">
                              {isSelected ? '●' : '○'}
                              {isCorrectOption && !isSelected ? ' ✓' : ''}
                            </span>
                            {option.option_text}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {question.explanation && (
                    <div className="mt-3 p-3 bg-blue-50 rounded text-sm">
                      <strong>Explication :</strong> {question.explanation}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          <div className="flex justify-center space-x-4">
            <Button onClick={restartQuiz} variant="outline">
              <RotateCcw className="h-4 w-4 mr-2" />
              Recommencer
            </Button>
            <Button onClick={onClose}>
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const currentAnswer = getCurrentAnswer();
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{quiz.title}</CardTitle>
          <div className="flex items-center space-x-4 text-sm text-gray-600">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeElapsed)}</span>
            </div>
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </Badge>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {currentQuestion && (
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <h3 className="text-lg font-medium flex-1">
                {currentQuestion.question_text}
              </h3>
              <Badge variant="secondary">
                {currentQuestion.points} point{currentQuestion.points > 1 ? 's' : ''}
              </Badge>
            </div>

            {/* Questions à choix multiples */}
            {currentQuestion.question_type === 'multiple_choice' && (
              <div className="space-y-2">
                {currentQuestion.options.map(option => (
                  <label
                    key={option.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option.id}
                      checked={currentAnswer?.selectedOptionId === option.id}
                      onChange={() => updateAnswer({ selectedOptionId: option.id })}
                      className="w-4 h-4"
                    />
                    <span className="flex-1">{option.option_text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Questions vrai/faux */}
            {currentQuestion.question_type === 'true_false' && (
              <div className="space-y-2">
                {currentQuestion.options.map(option => (
                  <label
                    key={option.id}
                    className="flex items-center space-x-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50"
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option.id}
                      checked={currentAnswer?.selectedOptionId === option.id}
                      onChange={() => updateAnswer({ selectedOptionId: option.id })}
                      className="w-4 h-4"
                    />
                    <span className="flex-1 font-medium">{option.option_text}</span>
                  </label>
                ))}
              </div>
            )}

            {/* Questions à réponse courte */}
            {currentQuestion.question_type === 'short_answer' && (
              <div className="space-y-2">
                <Textarea
                  value={currentAnswer?.textAnswer || ''}
                  onChange={(e) => updateAnswer({ textAnswer: e.target.value })}
                  placeholder="Saisissez votre réponse..."
                  rows={4}
                  className="w-full"
                />
                <p className="text-sm text-gray-500">
                  Cette question nécessite une correction manuelle par l'instructeur.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between pt-6 border-t">
          <Button
            variant="outline"
            onClick={() => goToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>

          <div className="flex items-center space-x-2">
            {quiz.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => goToQuestion(index)}
                className={`w-8 h-8 rounded-full text-sm font-medium ${
                  index === currentQuestionIndex
                    ? 'bg-blue-600 text-white'
                    : userAnswers.some(a => a.questionId === quiz.questions[index].id)
                    ? 'bg-green-100 text-green-800'
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          {currentQuestionIndex === quiz.questions.length - 1 ? (
            <Button
              onClick={submitQuiz}
              disabled={submitting || userAnswers.length === 0}
              className="bg-green-600 hover:bg-green-700"
            >
              {submitting ? 'Soumission...' : 'Terminer le quiz'}
            </Button>
          ) : (
            <Button
              onClick={() => goToQuestion(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === quiz.questions.length - 1}
            >
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizPlayerEnhanced;

