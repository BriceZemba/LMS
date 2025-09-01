
import { supabase } from '@/integrations/supabase/client';

export interface QuizData {
  title: string;
  description?: string;
  lesson_id?: number;
  module_id?: number;
}

export interface QuizOptionData {
  quiz_id: number;
  option_text: string;
  is_correct: boolean;
}

export interface QuizResultData {
  user_id: number;
  quiz_id: number;
  score: number;
  passed: boolean;
  duration_seconds?: number;
}

export const quizService = {
  // Create a new quiz
  async createQuiz(quizData: QuizData) {
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

  // Add options to a quiz
  async addQuizOptions(options: QuizOptionData[]) {
    try {
      const { data, error } = await supabase
        .from('quiz_options')
        .insert(options)
        .select();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding quiz options:', error);
      return { success: false, error };
    }
  },

  // Get quiz with options
  async getQuizWithOptions(quizId: number) {
    try {
      const { data: quiz, error: quizError } = await supabase
        .from('quizzes')
        .select('*')
        .eq('id', quizId)
        .single();

      if (quizError) throw quizError;

      const { data: options, error: optionsError } = await supabase
        .from('quiz_options')
        .select('*')
        .eq('quiz_id', quizId)
        .order('id');

      if (optionsError) throw optionsError;

      return { success: true, data: { ...quiz, options } };
    } catch (error) {
      console.error('Error fetching quiz:', error);
      return { success: false, error };
    }
  },

  // Submit quiz result
  async submitQuizResult(resultData: QuizResultData) {
    try {
      const { data, error } = await supabase
        .from('quiz_results')
        .insert({
          ...resultData,
          completed_at: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error submitting quiz result:', error);
      return { success: false, error };
    }
  },

  // Get user quiz results
  async getUserQuizResults(userId: number, quizId?: number) {
    try {
      let query = supabase
        .from('quiz_results')
        .select(`
          *,
          quizzes!inner(title, description)
        `)
        .eq('user_id', userId)
        .order('completed_at', { ascending: false });

      if (quizId) {
        query = query.eq('quiz_id', quizId);
      }

      const { data, error } = await query;
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching quiz results:', error);
      return { success: false, error };
    }
  },

  // Get quizzes for a module or lesson
  async getQuizzes(moduleId?: number, lessonId?: number) {
    try {
      let query = supabase.from('quizzes').select('*');
      
      if (moduleId) query = query.eq('module_id', moduleId);
      if (lessonId) query = query.eq('lesson_id', lessonId);

      const { data, error } = await query.order('created_at');
      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching quizzes:', error);
      return { success: false, error };
    }
  }
};
