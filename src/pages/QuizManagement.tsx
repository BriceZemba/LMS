import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, Users, Trophy, Clock } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import QuizCreatorEnhanced from '@/components/quiz/QuizCreatorEnhanced';
import { courseServiceEnhanced } from '@/services/courseServiceEnhanced';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Quiz {
  id: number;
  title: string;
  description?: string;
  module_id?: number;
  lesson_id?: number;
  created_at: string;
  // questions_count?: number;
  attempts_count?: number;
  average_score?: number;
}

const QuizManagement = () => {
  const { user } = useSupabaseAuth();
  const [activeTab, setActiveTab] = useState('list');
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedModuleId, setSelectedModuleId] = useState<number | undefined>();
  const [selectedLessonId, setSelectedLessonId] = useState<number | undefined>();

  // Charger les quiz existants
  useEffect(() => {
const loadQuizzes = async () => {
  try {
    setLoading(true);

    // Utilisation de l'API Supabase pour récupérer les quizz
    const { data: quizzes, error } = await supabase
      .from('quizzes')
      .select('id, title, description, module_id, created_at')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error loading quizzes:', error);
      toast.error('Erreur lors du chargement des quiz');
    } else {
      setQuizzes(quizzes);
    }
  } finally {
    setLoading(false);
  }
};

    loadQuizzes();
  }, []);

  const handleQuizCreated = (quizId: number) => {
    toast.success('Quiz créé avec succès !');
    setActiveTab('list');
    // Recharger la liste des quiz
    // loadQuizzes();
  };

  const handleDeleteQuiz = async (quizId: number) => {
    if (window.confirm('Êtes-vous sûr de vouloir supprimer ce quiz ?')) {
      try {
        // Ici on appellerait l'API pour supprimer le quiz
        setQuizzes(prev => prev.filter(q => q.id !== quizId));
        toast.success('Quiz supprimé avec succès');
      } catch (error) {
        console.error('Error deleting quiz:', error);
        toast.error('Erreur lors de la suppression du quiz');
      }
    }
  };

  const getQuizTypeLabel = (quiz: Quiz) => {
    if (quiz.lesson_id) return 'Leçon';
    if (quiz.module_id) return 'Module';
    return 'Cours';
  };

  const getQuizTypeBadge = (quiz: Quiz) => {
    if (quiz.lesson_id) return 'secondary';
    if (quiz.module_id) return 'default';
    return 'outline';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Gestion des Quiz
            </h1>
            <p className="text-gray-600">
              Créez et gérez vos quiz interactifs pour évaluer les connaissances de vos étudiants.
            </p>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="list" className="flex items-center space-x-2">
                <Trophy className="h-4 w-4" />
                <span>Mes Quiz</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Créer un Quiz</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="list" className="space-y-6">
              {quizzes.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Trophy className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      Aucun quiz créé
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Commencez par créer votre premier quiz interactif.
                    </p>
                    <Button onClick={() => setActiveTab('create')}>
                      <Plus className="h-4 w-4 mr-2" />
                      Créer un quiz
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {quizzes.map((quiz) => (
                    <Card key={quiz.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <CardTitle className="text-lg line-clamp-2">
                            {quiz.title}
                          </CardTitle>
                          <Badge 
                            variant={getQuizTypeBadge(quiz) as any}
                            className="ml-2"
                          >
                            {getQuizTypeLabel(quiz)}
                          </Badge>
                        </div>
                        {quiz.description && (
                          <p className="text-gray-600 text-sm line-clamp-2">
                            {quiz.description}
                          </p>
                        )}
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            {/* <div className="text-lg font-semibold text-blue-600">
                              {quiz.questions_count || 0}
                            </div> */}
                            <div className="text-xs text-gray-500">Questions</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-green-600">
                              {quiz.attempts_count || 0}
                            </div>
                            <div className="text-xs text-gray-500">Tentatives</div>
                          </div>
                          <div>
                            <div className="text-lg font-semibold text-purple-600">
                              {quiz.average_score || 0}%
                            </div>
                            <div className="text-xs text-gray-500">Score moyen</div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t">
                          <div className="flex items-center space-x-2 text-xs text-gray-500">
                            <Clock className="h-3 w-3" />
                            <span>
                              {new Date(quiz.created_at).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => handleDeleteQuiz(quiz.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="create">
              <Card>
                <CardHeader>
                  <CardTitle>Créer un nouveau quiz</CardTitle>
                  <p className="text-gray-600">
                    Utilisez l'assistant pour créer un quiz interactif avec différents types de questions.
                  </p>
                </CardHeader>
                <CardContent>
                  <QuizCreatorEnhanced
                    moduleId={selectedModuleId}
                    lessonId={selectedLessonId}
                    onQuizCreated={handleQuizCreated} modules={[]}                  />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default QuizManagement;

