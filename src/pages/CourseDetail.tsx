import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Play, Users, Clock, Award, Loader2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';
import CourseViewerEnhanced from '@/components/course/CourseViewerEnhanced';
import { Course } from '@/types/course';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolled, setEnrolled] = useState(false);
  const [showViewer, setShowViewer] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debug logs
  console.log('CourseDetail render:', { courseId, user: !!user, loading, course: !!course });

  // Effet pour récupérer les données du cours
  useEffect(() => {
    const fetchCourseData = async () => {
      if (!courseId) {
        console.error('No courseId provided');
        setError('ID de cours manquant');
        setLoading(false);
        return;
      }

      try {
        console.log('Starting to fetch course data for ID:', courseId);
        setLoading(true);
        setError(null);

        const courseIdNum = parseInt(courseId);
        if (isNaN(courseIdNum)) {
          throw new Error('Invalid course ID');
        }

        console.log('Fetching course with ID:', courseIdNum);

        // Récupérer les données du cours
        const { data: courseData, error: courseError } = await supabase
          .from('courses')
          .select('*')
          .eq('id', courseIdNum)
          .single();

        console.log('Course data response:', { courseData, courseError });

        if (courseError) {
          console.error('Course error:', courseError);
          throw new Error(`Erreur cours: ${courseError.message}`);
        }

        if (!courseData) {
          throw new Error('Aucun cours trouvé avec cet ID');
        }

        // Récupérer la structure du cours (modules et leçons)
        console.log('Fetching course structure...');
        const { data: structureData, error: structureError } = await supabase
          .from('course_structure')
          .select('*')
          .eq('course_id', courseIdNum);

        console.log('Structure data response:', { structureData, structureError });

        if (structureError) {
          console.error('Structure error:', structureError);
          // Ne pas faire échouer si pas de structure
          console.warn('No course structure found, continuing with empty modules');
        }

        // Organiser les données par modules
        const modulesMap = new Map();
        structureData?.forEach((item) => {
          console.log('Processing structure item:', item);
          
          if (!modulesMap.has(item.module_id)) {
            modulesMap.set(item.module_id, {
              id: item.module_id?.toString() || '',
              title: item.module_title || '',
              description: item.module_description || '',
              order: item.module_position || 0,
              contents: []
            });
          }
          
          if (item.lesson_id) {
            modulesMap.get(item.module_id).contents.push({
              id: item.lesson_id.toString(),
              type: 'text',
              title: item.lesson_title || '',
              content: item.lesson_content || '',
              description: ''
            });
          }
        });

        const modules = Array.from(modulesMap.values()).sort((a, b) => a.order - b.order);
        console.log('Processed modules:', modules);

        const courseObject = {
          id: courseData.id.toString(),
          title: courseData.title,
          description: courseData.description || '',
          category: courseData.category || '',
          level: courseData.level as 'Débutant' | 'Intermédiaire' | 'Avancé' || 'Débutant',
          duration: courseData.duration || '',
          modules: modules,
          instructor: courseData.instructor || '',
          instructorId: courseData.instructor_id?.toString() || '',
          coverImage: courseData.cover_image || '',
          tags: courseData.tags || [],
          createdAt: courseData.created_at || '',
          updatedAt: courseData.updated_at || '',
          published: courseData.published || false,
          enrolledStudents: courseData.enrolled_students || 0,
          completionRate: courseData.completion_rate || 0
        };

        console.log('Final course object:', courseObject);
        setCourse(courseObject);
      } catch (error) {
        console.error('Error fetching course:', error);
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        setError(errorMessage);
        toast.error(`Erreur lors du chargement du cours: ${errorMessage}`);
      } finally {
        console.log('Finishing course fetch, setting loading to false');
        setLoading(false);
      }
    };

    fetchCourseData();
  }, [courseId]);

  // Effet séparé pour vérifier l'inscription
  useEffect(() => {
    const checkEnrollment = async () => {
      if (!user?.id || !courseId) {
        console.log('Skipping enrollment check:', { hasUser: !!user?.id, courseId });
        return;
      }

      try {
        console.log('Checking enrollment for user:', user.id, 'course:', courseId);
        const courseIdNum = parseInt(courseId);
        
        const { data, error } = await supabase
          .from('enrollments')
          .select('id')
          .eq('user_id', user.id)
          .eq('course_id', courseIdNum)
          .single();

        console.log('Enrollment check result:', { data, error });

        if (!error && data) {
          console.log('User is enrolled');
          setEnrolled(true);
        } else {
          console.log('User is not enrolled');
          setEnrolled(false);
        }
      } catch (error) {
        console.error('Error checking enrollment:', error);
        setEnrolled(false);
      }
    };

    checkEnrollment();
  }, [user?.id, courseId]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Veuillez vous connecter pour vous inscrire');
      navigate('/supabase-auth');
      return;
    }

    try {
      const courseIdNum = parseInt(courseId!);
      const { error } = await supabase
        .from('enrollments')
        .insert({
          user_id: user.id,
          course_id: courseIdNum,
          status: 'active'
        });

      if (error) throw error;

      setEnrolled(true);
      toast.success('Inscription réussie !');
    } catch (error) {
      console.error('Error enrolling:', error);
      toast.error('Erreur lors de l\'inscription');
    }
  };

  const handleStartCourse = () => {
    if (enrolled) {
      setShowViewer(true);
    } else {
      handleEnroll();
    }
  };

  // Affichage du loader avec plus d'informations
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col items-center justify-center min-h-[400px]">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mb-4" />
              <p className="text-gray-600">Chargement du cours...</p>
              {/* <p className="text-sm text-gray-400 mt-2">Cour: {course.title}</p> */}
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Affichage d'erreur spécifique
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-red-600 mb-4">Erreur de chargement</h1>
              <p className="text-gray-600 mb-4">{error}</p>
              {/* <p className="text-sm text-gray-400 mb-6">Cours: {course.title}</p> */}
              <div className="space-x-4">
                <Button onClick={() => window.location.reload()}>
                  Réessayer
                </Button>
                <Button variant="outline" onClick={() => navigate('/courses')}>
                  Retour aux cours
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Cours non trouvé
  if (!course) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        <Navigation />
        <div className="pt-20 pb-16">
          <div className="max-w-7xl mx-auto px-6">
            <div className="text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Cours non trouvé</h1>
              {/* <p className="text-gray-600 mb-6">Aucun cours trouvé avec l'ID: {courseId}</p> */}
              <Button onClick={() => navigate('/courses')}>
                Retour aux cours
              </Button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Affichage du viewer si l'utilisateur est inscrit
  if (showViewer && enrolled) {
    return <CourseViewerEnhanced course={course} />;
  }

  // Affichage principal du cours
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
            className="mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
                <CardHeader>
                  <CardTitle className="text-2xl">
                    {course.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600 mb-6">
                    {course.description}
                  </p>
                  
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="flex items-center space-x-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <span className="text-sm">{course.enrolledStudents} étudiant(s)</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-5 w-5 text-green-600" />
                      <span className="text-sm">{course.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award className="h-5 w-5 text-purple-600" />
                      <span className="text-sm">Certificat</span>
                    </div>
                  </div>

                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3">Modules du cours</h3>
                    {course.modules.length > 0 ? (
                      <div className="space-y-2">
                        {course.modules.map((module, index) => (
                          <div key={module.id} className="border border-gray-200 rounded-lg p-4">
                            <h4 className="font-medium">Module {index + 1}: {module.title}</h4>
                            <p className="text-sm text-gray-600">{module.description}</p>
                            <span className="text-xs text-gray-500">{module.contents.length} leçons</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500 italic">Aucun module disponible pour ce cours.</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div>
              <Card>
                <CardContent className="p-6">
                  <Button 
                    className="w-full mb-4" 
                    onClick={handleStartCourse}
                  >
                    <Play className="h-4 w-4 mr-2" />
                    {enrolled ? 'Continuer le cours' : 'Commencer le cours'}
                  </Button>
                  <p className="text-center text-gray-600">
                    {enrolled ? 'Vous êtes inscrit' : 'Gratuit'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default CourseDetail;