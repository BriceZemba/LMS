import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, X, Save, HelpCircle, CheckCircle, Edit } from 'lucide-react';
import { courseServiceEnhanced } from '@/services/courseServiceEnhanced';
import { toast } from 'sonner';

interface QuizCreatorEnhancedProps {
  modules: Array<{ id: number; title: string }>;
  moduleId?: number;
  lessonId?: number;
  onQuizCreated?: (quizId: number) => void;
  onModuleChange?: (moduleId: number) => void;
}

interface Module {
  id: number;
  title: string;
}

interface QuizOption {
  option_text: string;
  is_correct: boolean;
}

interface Lesson {
  id: number;
  title: string;
  module_id: number;
}

interface QuizQuestion {
  id?: string;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  points: number;
  explanation?: string;
  options: QuizOption[];
}

interface Module {
  id: number;
  title: string;
  description?: string;
  course_id: number;
  position: number;
  created_at?: string;
  courses?: {
    title: any;
    category: any;
  }[];
}



const QuizCreatorEnhanced: React.FC<QuizCreatorEnhancedProps> = ({ 
  moduleId: initialModuleId, 
  lessonId, 
  onQuizCreated,
  onModuleChange
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState<number | undefined>(initialModuleId);
  
  // Informations du quiz
  const [quizTitle, setQuizTitle] = useState('');
  const [quizDescription, setQuizDescription] = useState('');
  
  // Questions
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<QuizQuestion>({
    question_text: '',
    question_type: 'multiple_choice',
    points: 1,
    explanation: '',
    options: [
      { option_text: '', is_correct: false },
      { option_text: '', is_correct: false }
    ]
  });

  const handleModuleChange = (moduleId: string) => {
    const numericModuleId = Number(moduleId);
    setSelectedModuleId(numericModuleId);
    onModuleChange?.(numericModuleId);
  };

  const addOption = () => {
    setCurrentQuestion(prev => ({
      ...prev,
      options: [...prev.options, { option_text: '', is_correct: false }]
    }));
  };

  const removeOption = (index: number) => {
    if (currentQuestion.options.length > 2) {
      setCurrentQuestion(prev => ({
        ...prev,
        options: prev.options.filter((_, i) => i !== index)
      }));
    }
  };

  const updateOption = (index: number, field: 'option_text' | 'is_correct', value: string | boolean) => {
    setCurrentQuestion(prev => {
      const newOptions = [...prev.options];
      newOptions[index] = { ...newOptions[index], [field]: value };
      
      // Pour les QCM et vrai/faux, une seule bonne réponse
      if (field === 'is_correct' && value === true && prev.question_type !== 'short_answer') {
        newOptions.forEach((option, i) => {
          if (i !== index) option.is_correct = false;
        });
      }
      
      return { ...prev, options: newOptions };
    });
  };

  const handleQuestionTypeChange = (type: 'multiple_choice' | 'true_false' | 'short_answer') => {
    let newOptions: QuizOption[] = [];
    
    switch (type) {
      case 'multiple_choice':
        newOptions = [
          { option_text: '', is_correct: false },
          { option_text: '', is_correct: false }
        ];
        break;
      case 'true_false':
        newOptions = [
          { option_text: 'Vrai', is_correct: false },
          { option_text: 'Faux', is_correct: false }
        ];
        break;
      case 'short_answer':
        newOptions = [];
        break;
    }
    
    setCurrentQuestion(prev => ({
      ...prev,
      question_type: type,
      options: newOptions
    }));
  };

  const validateCurrentQuestion = (): boolean => {
    if (!currentQuestion.question_text.trim()) {
      toast.error('Le texte de la question est requis');
      return false;
    }

    if (currentQuestion.question_type === 'multiple_choice') {
      const validOptions = currentQuestion.options.filter(opt => opt.option_text.trim());
      if (validOptions.length < 2) {
        toast.error('Au moins 2 options sont requises pour les QCM');
        return false;
      }
      
      const hasCorrectAnswer = validOptions.some(opt => opt.is_correct);
      if (!hasCorrectAnswer) {
        toast.error('Veuillez sélectionner la bonne réponse');
        return false;
      }
    }

    if (currentQuestion.question_type === 'true_false') {
      const hasCorrectAnswer = currentQuestion.options.some(opt => opt.is_correct);
      if (!hasCorrectAnswer) {
        toast.error('Veuillez sélectionner la bonne réponse (Vrai ou Faux)');
        return false;
      }
    }

    return true;
  };

  const addQuestion = () => {
    if (!validateCurrentQuestion()) return;

    const newQuestion = {
      ...currentQuestion,
      id: Date.now().toString(),
      options: currentQuestion.options.filter(opt => 
        currentQuestion.question_type === 'short_answer' || opt.option_text.trim()
      )
    };

    setQuestions(prev => [...prev, newQuestion]);
    
    // Réinitialiser la question courante
    setCurrentQuestion({
      question_text: '',
      question_type: 'multiple_choice',
      points: 1,
      explanation: '',
      options: [
        { option_text: '', is_correct: false },
        { option_text: '', is_correct: false }
      ]
    });

    toast.success('Question ajoutée !');
  };

  const editQuestion = (index: number) => {
    setCurrentQuestion(questions[index]);
    setQuestions(prev => prev.filter((_, i) => i !== index));
  };

  const removeQuestion = (index: number) => {
    setQuestions(prev => prev.filter((_, i) => i !== index));
    toast.success('Question supprimée');
  };

/* ------------------------------------------------------------------ */
/* 1.  Live modules (drop-in replacement for prop)                     */
/* ------------------------------------------------------------------ */
const [modules, setModules] = useState<Module[]>([]);
const [modulesLoading, setModulesLoading] = useState(true);
const [lessons, setLessons] = useState<Lesson[]>([]);

useEffect(() => {
  const load = async () => {
    const [mRes, lRes] = await Promise.all([
      courseServiceEnhanced.getAllModules(),
      courseServiceEnhanced.getAllCourses?.() ?? Promise.resolve({ success: true, data: [] })
    ]);

    if (mRes.success) setModules(mRes.data);
    if (lRes.success) setLessons(lRes.data);
    setModulesLoading(false);
  };
  load();
}, []);


  const handleSubmit = async () => {
    if (!quizTitle.trim()) {
      toast.error('Le titre du quiz est requis');
      return;
    }

    if (!selectedModuleId) {
      toast.error('Veuillez sélectionner un module');
      return;
    }

    if (questions.length === 0) {
      toast.error('Au moins une question est requise');
      return;
    }

    setLoading(true);
    
    try {
      const result = await courseServiceEnhanced.createQuizWithQuestions(
        {
          title: quizTitle.trim(),
          description: quizDescription.trim() || undefined,
          module_id: selectedModuleId,
          lesson_id: lessonId
        },
        questions.map((q, index) => ({
          question_text: q.question_text,
          question_type: q.question_type,
          points: q.points,
          explanation: q.explanation,
          options: q.options.length > 0 ? q.options : undefined
        }))
      );

      if (result.success) {
        toast.success('Quiz créé avec succès !');
        
        // Réinitialiser le formulaire
        setQuizTitle('');
        setQuizDescription('');
        setQuestions([]);
        setCurrentQuestion({
          question_text: '',
          question_type: 'multiple_choice',
          points: 1,
          explanation: '',
          options: [
            { option_text: '', is_correct: false },
            { option_text: '', is_correct: false }
          ]
        });
        setCurrentStep(1);

        onQuizCreated?.(result.quiz.id);
      } else {
        throw new Error('Erreur lors de la création du quiz');
      }
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Erreur lors de la création du quiz');
    } finally {
      setLoading(false);
    }
  };

  const getQuestionTypeLabel = (type: string) => {
    const labels = {
      'multiple_choice': 'QCM',
      'true_false': 'Vrai/Faux',
      'short_answer': 'Réponse courte'
    };
    return labels[type as keyof typeof labels] || type;
  };

  const getQuestionTypeBadge = (type: string) => {
    const variants = {
      'multiple_choice': 'default' as const,
      'true_false': 'secondary' as const,
      'short_answer': 'outline' as const
    };
    return variants[type as keyof typeof variants] || 'default';
  };

  const lessonsByModule = lessons.reduce((acc, l) => {
  (acc[l.module_id] ||= []).push(l);
  return acc;
   }, {} as Record<number, Lesson[]>);

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Indicateur de progression */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span>Informations du quiz</span>
        </div>
        <div className="w-12 h-px bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span>Questions</span>
        </div>
        <div className="w-12 h-px bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Étape 1: Informations du quiz */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informations du quiz</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="quizTitle">Titre du quiz *</Label>
              <Input
                id="quizTitle"
                value={quizTitle}
                onChange={(e) => setQuizTitle(e.target.value)}
                placeholder="Ex: Quiz sur les bases de l'IoT"
                required
              />
            </div>

<div className="space-y-2">
  <Label htmlFor="moduleSelect">Module *</Label>

  {modulesLoading ? (
    <div className="text-sm text-gray-500">Chargement des modules…</div>
  ) : (
    <Select
      value={selectedModuleId ? String(selectedModuleId) : ""}
      onValueChange={handleModuleChange}
    >
      <SelectTrigger id="moduleSelect">
        <SelectValue placeholder="Choisir un module" />
      </SelectTrigger>

      <SelectContent>
        {modules.map((module) => (
          <SelectItem key={module.id} value={String(module.id)}>
            {module.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )}
</div>

            <div className="space-y-2">
              <Label htmlFor="quizDescription">Description</Label>
              <Textarea
                id="quizDescription"
                value={quizDescription}
                onChange={(e) => setQuizDescription(e.target.value)}
                placeholder="Description optionnelle du quiz..."
                rows={3}
              />
            </div>

            <div className="flex justify-end">
              <Button 
                onClick={() => setCurrentStep(2)}
                disabled={!quizTitle.trim() || !selectedModuleId}
              >
                Suivant
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Questions */}
      {currentStep === 2 && (
        <div className="space-y-6">
          {/* Liste des questions existantes */}
          {questions.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Questions ajoutées ({questions.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {questions.map((question, index) => (
                    <div key={question.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <Badge variant={getQuestionTypeBadge(question.question_type)}>
                            {getQuestionTypeLabel(question.question_type)}
                          </Badge>
                          <span className="text-sm text-gray-500">{question.points} point(s)</span>
                        </div>
                        <p className="font-medium">{question.question_text}</p>
                        {question.options.length > 0 && (
                          <div className="mt-2 text-sm text-gray-600">
                            {question.options.map((option, optIndex) => (
                              <div key={optIndex} className="flex items-center space-x-2">
                                <span className={option.is_correct ? 'text-green-600 font-medium' : ''}>
                                  {option.is_correct ? '✓' : '○'} {option.option_text}
                                </span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => editQuestion(index)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeQuestion(index)}
                          className="text-red-600"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Formulaire de création de question */}
          <Card>
            <CardHeader>
              <CardTitle>
                {currentQuestion.id ? 'Modifier la question' : 'Ajouter une question'}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Type de question</Label>
                  <Select
                    value={currentQuestion.question_type}
                    onValueChange={handleQuestionTypeChange}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="multiple_choice">Choix multiples (QCM)</SelectItem>
                      <SelectItem value="true_false">Vrai/Faux</SelectItem>
                      <SelectItem value="short_answer">Réponse courte</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Points</Label>
                  <Input
                    type="number"
                    min="1"
                    max="10"
                    value={currentQuestion.points}
                    onChange={(e) => setCurrentQuestion(prev => ({
                      ...prev,
                      points: parseInt(e.target.value) || 1
                    }))}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label>Question *</Label>
                <Textarea
                  value={currentQuestion.question_text}
                  onChange={(e) => setCurrentQuestion(prev => ({
                    ...prev,
                    question_text: e.target.value
                  }))}
                  placeholder="Saisissez votre question..."
                  rows={3}
                />
              </div>

              {/* Options pour QCM et Vrai/Faux */}
              {(currentQuestion.question_type === 'multiple_choice' || currentQuestion.question_type === 'true_false') && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Options de réponse</Label>
                    {currentQuestion.question_type === 'multiple_choice' && (
                      <Button type="button" onClick={addOption} size="sm" variant="outline">
                        <Plus className="h-4 w-4 mr-1" />
                        Ajouter une option
                      </Button>
                    )}
                  </div>

                  {currentQuestion.options.map((option, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <Input
                        value={option.option_text}
                        onChange={(e) => updateOption(index, 'option_text', e.target.value)}
                        placeholder={`Option ${index + 1}`}
                        className="flex-1"
                        disabled={currentQuestion.question_type === 'true_false'}
                      />
                      <div className="flex items-center space-x-2">
                        <input
                          type="radio"
                          name="correctAnswer"
                          checked={option.is_correct}
                          onChange={(e) => updateOption(index, 'is_correct', e.target.checked)}
                          className="w-4 h-4"
                        />
                        <Label className="text-sm">Correcte</Label>
                      </div>
                      {currentQuestion.question_type === 'multiple_choice' && currentQuestion.options.length > 2 && (
                        <Button
                          type="button"
                          onClick={() => removeOption(index)}
                          size="sm"
                          variant="outline"
                          className="px-2"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              )}

              {/* Note pour les réponses courtes */}
              {currentQuestion.question_type === 'short_answer' && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start space-x-2">
                    <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-blue-900">Réponse courte</p>
                      <p className="text-sm text-blue-700">
                        Les réponses courtes nécessitent une correction manuelle. 
                        Vous pouvez ajouter une explication pour guider la correction.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label>Explication (optionnelle)</Label>
                <Textarea
                  value={currentQuestion.explanation}
                  onChange={(e) => setCurrentQuestion(prev => ({
                    ...prev,
                    explanation: e.target.value
                  }))}
                  placeholder="Explication de la réponse (affichée après la soumission)..."
                  rows={2}
                />
              </div>

              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => setCurrentStep(1)}
                >
                  Précédent
                </Button>
                <div className="space-x-2">
                  <Button
                    onClick={addQuestion}
                    variant="outline"
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Ajouter la question
                  </Button>
                  <Button
                    onClick={() => setCurrentStep(3)}
                    disabled={questions.length === 0}
                  >
                    Suivant
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Étape 3: Confirmation */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold">{quizTitle}</h3>
              {quizDescription && (
                <p className="text-gray-600 mt-2">{quizDescription}</p>
              )}
            </div>

            <div>
              <h4 className="font-medium mb-3">Questions ({questions.length})</h4>
              <div className="space-y-3">
                {questions.map((question, index) => (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <Badge variant={getQuestionTypeBadge(question.question_type)}>
                        {getQuestionTypeLabel(question.question_type)}
                      </Badge>
                      <span className="text-sm text-gray-500">{question.points} point(s)</span>
                    </div>
                    <p className="font-medium mb-2">{question.question_text}</p>
                    {question.options.length > 0 && (
                      <div className="text-sm text-gray-600 space-y-1">
                        {question.options.map((option, optIndex) => (
                          <div key={optIndex} className="flex items-center space-x-2">
                            <span className={option.is_correct ? 'text-green-600 font-medium' : ''}>
                              {option.is_correct ? '✓' : '○'} {option.option_text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    {question.explanation && (
                      <div className="mt-2 text-sm text-gray-500 italic">
                        Explication : {question.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setCurrentStep(2)}
              >
                Précédent
              </Button>
              <Button
                onClick={handleSubmit}
                disabled={loading}
                className="bg-green-600 hover:bg-green-700"
              >
                <Save className="h-4 w-4 mr-2" />
                {loading ? 'Création...' : 'Créer le quiz'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QuizCreatorEnhanced;