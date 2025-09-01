import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';
import { toast } from 'sonner';

export interface CreateCourseData {
  title: string;
  description: string;
  category: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé';
  duration?: string;
  instructor: string;
  instructor_id?: number;
  cover_image?: string;
  tags?: string[];
}

export interface ModuleResource {
  documents: Array<{
    id: string;
    title: string;
    document_type: 'file' | 'url';
    file_path?: string;
    url?: string;
    file_size?: number;
    mime_type?: string;
  }>;
  videos: Array<{
    id: string;
    title: string;
    video_type: 'file' | 'url' | 'youtube' | 'vimeo';
    url?: string;
    file_path?: string;
    duration?: number;
    thumbnail_url?: string;
  }>;
}

export interface CreateModuleData {
  course_id: number;
  title: string;
  description?: string;
  position: number;
}

export interface CreateLessonData {
  module_id: number;
  title: string;
  content?: string;
  position: number;
  documents?: CreateDocumentData[];
  videos?: CreateVideoData[];
}

export interface CreateDocumentData {
  lesson_id?: number;
  module_id?: number;
  title?: string;
  file_path: string;
}

export interface CreateVideoData {
  module_id: number;
  title?: string;
  video_url: string;
  duration?: number;
}

export interface CreateQuizData {
  lesson_id?: number;
  module_id?: number;
  title: string;
  description?: string;
}

export interface CreateQuizQuestionData {
  quiz_id: number;
  question_text: string;
  question_type: 'multiple_choice' | 'true_false' | 'short_answer';
  points?: number;
  position: number;
  explanation?: string;
}

export interface CreateQuizOptionData {
  quiz_id: number;
  option_text: string;
  is_correct: boolean;
}

export const courseServiceEnhanced = {
  // Créer un cours complet avec modules et leçons amélioré
  async createCourseWithStructure(courseData: CreateCourseData, modules: Array<{
    title: string;
    description?: string;
    lessons: Array<{
      title: string;
      content?: string;
      documents?: Array<CreateDocumentData>;
      videos?: Array<CreateVideoData>;
    }>;
  }>) {
    try {
      // 1. Créer le cours
      const { data: course, error: courseError } = await supabase
        .from('courses')
        .insert(courseData)
        .select()
        .single();

      if (courseError) throw courseError;

      // 2. Créer les modules avec leurs leçons, documents et vidéos
      for (let i = 0; i < modules.length; i++) {
        const moduleData = modules[i];
        
        const { data: module, error: moduleError } = await supabase
          .from('modules')
          .insert({
            course_id: course.id,
            title: moduleData.title,
            description: moduleData.description,
            position: i + 1
          })
          .select()
          .single();

        if (moduleError) throw moduleError;

        // 3. Créer les leçons pour chaque module avec leurs documents et vidéos
        for (let j = 0; j < moduleData.lessons.length; j++) {
          const lessonData = moduleData.lessons[j];
          
          const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .insert({
              module_id: module.id,
              title: lessonData.title,
              content: lessonData.content,
              position: j + 1
            })
            .select()
            .single();

          if (lessonError) throw lessonError;

          // 4. Ajouter les documents à la leçon
          if (lessonData.documents && lessonData.documents.length > 0) {
            for (const document of lessonData.documents) {
              await this.addDocument({
                ...document,
                lesson_id: lesson.id  // Associer à la leçon
              });
            }
          }

          // 5. Ajouter les vidéos au module (selon votre schéma DB actuel)
          if (lessonData.videos && lessonData.videos.length > 0) {
            for (const video of lessonData.videos) {
              await this.addVideo({
                ...video,
                module_id: module.id  // Associer au module selon votre schéma
              });
            }
          }
        }
      }

      return { success: true, course };
    } catch (error) {
      console.error('Error creating course structure:', error);
      return { success: false, error };
    }
  },

    // ----------  SUPPRESSION D'UN COURS  ----------
  async deleteCourse(courseId: number) {
    try {
      const { error } = await supabase
        .from('courses')
        .delete()
        .eq('id', courseId);

      if (error) throw error;
      return { success: true };
    } catch (error) {
      console.error('Erreur suppression cours:', error);
      return { success: false, error };
    }
  },

  // Récupérer un cours avec sa structure complète
  async getCourseWithStructure(courseId: number) {
    try {
      const { data, error } = await supabase
        .from('course_structure')
        .select('*')
        .eq('course_id', courseId)
        .order('module_position, lesson_position');

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching course structure:', error);
      return { success: false, error };
    }
  },

  // Récupérer tous les cours
  async getAllCourses() {
    try {
      const { data, error } = await supabase
        .from('courses')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching courses:', error);
      return { success: false, error };
    }
  },

  // Créer un module
  async createModule(moduleData: CreateModuleData) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .insert(moduleData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating module:', error);
      return { success: false, error };
    }
  },

  // Créer une leçon
  async createLesson(lessonData: CreateLessonData) {
    try {
      const { data, error } = await supabase
        .from('lessons')
        .insert({
          module_id: lessonData.module_id,
          title: lessonData.title,
          content: lessonData.content,
          position: lessonData.position
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating lesson:', error);
      return { success: false, error };
    }
  },

  // Ajouter un document (amélioré)
  async addDocument(documentData: CreateDocumentData) {
    try {
      const { data, error } = await supabase
        .from('documents')
        .insert(documentData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding document:', error);
      return { success: false, error };
    }
  },

  // Ajouter une vidéo (corrigé selon le schéma réel)
  async addVideo(videoData: CreateVideoData) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert({
          module_id: videoData.module_id,
          title: videoData.title,
          video_url: videoData.video_url,
          duration: videoData.duration
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding video:', error);
      return { success: false, error };
    }
  },

  // Créer un quiz
  async createQuiz(quizData: CreateQuizData) {
    try {
      const { data, error } = await supabase
        .from('quizzes')
        .insert(quizData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating quiz:', error);
      return { success: false, error };
    }
  },

  // Créer une question de quiz
  async createQuizQuestion(questionData: CreateQuizQuestionData) {
    try {
      const { data, error } = await supabase
        .from('quiz_questions')  // Corrigé: c'était 'quizzes' avant
        .insert(questionData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating quiz question:', error);
      return { success: false, error };
    }
  },

  // Créer une option de question
  async createQuizOption(optionData: CreateQuizOptionData) {
    try {
      const { data, error } = await supabase
        .from('quiz_options')
        .insert(optionData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating quiz option:', error);
      return { success: false, error };
    }
  },

  // Créer un quiz complet avec questions et options
  async createQuizWithQuestions(quizData: CreateQuizData, questions: Array<{
    question_text: string;
    question_type: 'multiple_choice' | 'true_false' | 'short_answer';
    points?: number;
    explanation?: string;
    options?: Array<{
      option_text: string;
      is_correct: boolean;
    }>;
  }>) {
    try {
      // 1. Créer le quiz
      const quizResult = await this.createQuiz(quizData);
      if (!quizResult.success) throw quizResult.error;

      const quiz = quizResult.data;

      // 2. Créer les questions
      for (let i = 0; i < questions.length; i++) {
        const questionData = questions[i];
        
        const questionResult = await this.createQuizQuestion({
          quiz_id: quiz.id,
          question_text: questionData.question_text,
          question_type: questionData.question_type,
          points: questionData.points || 1,
          position: i + 1,
          explanation: questionData.explanation
        });

        if (!questionResult.success) throw questionResult.error;

        const question = questionResult.data;

        // 3. Créer les options pour les questions à choix multiples et vrai/faux
        if (questionData.options && questionData.options.length > 0) {
          for (const optionData of questionData.options) {
            const optionResult = await this.createQuizOption({
              // question_id: question.id,  // Corrigé: était quiz_id avant
              option_text: optionData.option_text,
              is_correct: optionData.is_correct
            });

            if (!optionResult.success) throw optionResult.error;
          }
        }
      }

      return { success: true, quiz };
    } catch (error) {
      console.error('Error creating quiz with questions:', error);
      return { success: false, error };
    }
  },

  // Récupérer un quiz avec ses questions et options
async getQuizWithQuestions(quizId: number) {
    try {
      // Récupérer les questions du quiz
      const { data: questions, error: questionsError } = await supabase
        .from('quiz_questions')
        .select('*, quiz_options(*)')
        .eq('quiz_id', quizId)
        .order('position', { ascending: true });

      if (questionsError) throw questionsError;

      // Récupérer les détails du quiz
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;

      return { success: true, data: { quiz, questions } };
    } catch (error) {
      console.error('Error fetching quiz structure:', error);
      return { success: false, error };
    }
  },

  // Soumettre une réponse de quiz
  async submitQuizAnswer(quizResultId: number, questionId: number, answer: {
    selected_option_id?: number;
    text_answer?: string;
  }) {
    try {
      // Récupérer la question pour déterminer la bonne réponse
      const { data: question, error: questionError } = await supabase
        .from('quiz_questions')
        .select('*, quiz_options(*)')
        .eq('id', questionId)
        .single();

      if (questionError) throw questionError;

      let isCorrect = false;
      let pointsEarned = 0;

      if (question.question_type === 'multiple_choice' || question.question_type === 'true_false') {
        if (answer.selected_option_id) {
          const selectedOption = question.quiz_options.find((opt: any) => opt.id === answer.selected_option_id);
          isCorrect = selectedOption?.is_correct || false;
          pointsEarned = isCorrect ? question.points : 0;
        }
      }
      // Pour les réponses courtes, la correction sera manuelle ou basée sur des mots-clés
      else if (question.question_type === 'short_answer') {
        // Pour l'instant, on considère que les réponses courtes nécessitent une correction manuelle
        isCorrect = false;
        pointsEarned = 0;
      }

      const { data, error } = await supabase
        .from('quiz_answers')
        .insert({
          quiz_result_id: quizResultId,
          question_id: questionId,
          selected_option_id: answer.selected_option_id,
          text_answer: answer.text_answer,
          is_correct: isCorrect,
          points_earned: pointsEarned
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting quiz answer:', error);
      return { success: false, error };
    }
  },

  // Démarrer un quiz (créer un quiz_result)
  async startQuiz(quizId: number, userId: number) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          quiz_id: quizId,
          user_id: userId,
          started_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error starting quiz:', error);
      return { success: false, error };
    }
  },

  // Terminer un quiz
  async completeQuiz(quizResultId: number) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .update({
          completed_at: new Date().toISOString()
        })
        .eq('id', quizResultId)
        .select()
        .single();

      if (error) throw error;

      // Le score sera calculé automatiquement par le trigger
      return { success: true, data };
    } catch (error) {
      console.error('Error completing quiz:', error);
      return { success: false, error };
    }
  },

  // Publier un cours
  async publishCourse(courseId: number) {
    try {
      const { data, error } = await supabase
        .from('courses')
        .update({ published: true })
        .eq('id', courseId)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error publishing course:', error);
      return { success: false, error };
    }
  },

// Récupérer les ressources d'un module (documents, vidéos et quizz)
async getModuleResources(moduleId: number) {
    try {
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('module_id', moduleId);

      const { data: videos, error: videosError } = await supabase
        .from('videos')
        .select('*')
        .eq('module_id', moduleId);
      const { data: quizzes, error: quizzesError } = await supabase
        .from('quizzes')
        .select('id, title')
        .eq('module_id', moduleId);

      if (docsError) throw docsError;
      if (videosError) throw videosError;
      if (quizzesError) throw quizzesError;
      console.log('Module Resources:', { documents, videos, quizzes });

      return { 
        success: true, 
        data: { 
          documents: documents || [], 
          videos: videos || [] ,  
          quizzes: quizzes || []
        } 
      };
    } catch (error) {
      console.error('Error fetching module resources:', error);
      return { success: false, error };
    }
  },

  // Récupérer tous les modules
  async getAllModules() {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          description,
          course_id,
          position,
          created_at,
          courses (
            title,
            category
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching modules:', error);
      return { success: false, error };
    }
  },

  // Récupérer les modules d'un cours spécifique
  async getModulesByCourse(courseId: number) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          description,
          course_id,
          position,
          created_at
        `)
        .eq('course_id', courseId)
        .order('position', { ascending: true });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching modules by course:', error);
      return { success: false, error };
    }
  },

  // Récupérer un module spécifique
  async getModule(moduleId: number) {
    try {
      const { data, error } = await supabase
        .from('modules')
        .select(`
          id,
          title,
          description,
          course_id,
          position,
          created_at,
          courses (
            title,
            category,
            instructor
          )
        `)
        .eq('id', moduleId)
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching module:', error);
      return { success: false, error };
    }
  },


  // Récupérer les ressources d'une leçon (documents)
  async getLessonResources(lessonId: number) {
    try {
      const { data: documents, error: docsError } = await supabase
        .from('documents')
        .select('*')
        .eq('lesson_id', lessonId);

      if (docsError) throw docsError;

      return { 
        success: true, 
        data: { 
          documents: documents || []
        } 
      };
    } catch (error) {
      console.error('Error fetching lesson resources:', error);
      return { success: false, error };
    }
  },

  // Valider la structure d'un quiz avant publication
  // async validateQuizStructure(quizId: number) {
  //   try {
  //     const { data, error } = await supabase
  //       .rpc('validate_quiz_structure', { quiz_id_param: quizId });

  //     if (error) throw error;
  //     return { success: true, valid: data };
  //   } catch (error) {
  //     console.error('Error validating quiz structure:', error);
  //     return { success: false, error };
  //   }
  // }
};

export default courseServiceEnhanced;

function setLoading(arg0: boolean) {
  throw new Error('Function not implemented.');
}
