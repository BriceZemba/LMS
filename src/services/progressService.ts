
import { supabase } from '@/integrations/supabase/client';

export interface ProgressData {
  user_id: number;
  course_id: number;
  module_id?: number;
  percent_completed: number;
}

export const progressService = {
  // Update user progress
  async updateProgress(progressData: ProgressData) {
    try {
      const { data, error } = await supabase
        .from('progress')
        .upsert({
          user_id: progressData.user_id,
          course_id: progressData.course_id,
          module_id: progressData.module_id,
          percent_completed: progressData.percent_completed,
          last_update: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error updating progress:', error);
      return { success: false, error };
    }
  },

  // Get user progress for a course
  async getCourseProgress(userId: number, courseId: number) {
    try {
      const { data, error } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching progress:', error);
      return { success: false, error };
    }
  },

  // Calculate overall course progress
  async calculateCourseProgress(userId: number, courseId: number) {
    try {
      // Get all modules for the course
      const { data: modules, error: modulesError } = await supabase
        .from('modules')
        .select('id')
        .eq('course_id', courseId);

      if (modulesError) throw modulesError;

      // Get user progress for all modules
      const { data: progress, error: progressError } = await supabase
        .from('progress')
        .select('*')
        .eq('user_id', userId)
        .eq('course_id', courseId);

      if (progressError) throw progressError;

      if (!modules || modules.length === 0) return { success: true, progress: 0 };

      const totalModules = modules.length;
      const completedModules = progress?.filter(p => p.percent_completed >= 100).length || 0;
      const overallProgress = Math.round((completedModules / totalModules) * 100);

      return { success: true, progress: overallProgress };
    } catch (error) {
      console.error('Error calculating course progress:', error);
      return { success: false, error };
    }
  }
};
