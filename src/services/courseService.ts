
import { supabase } from '@/integrations/supabase/client';
import { Course } from '@/types/course';

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
}

export interface CreateDocumentData {
  lesson_id?: number;
  module_id?: number;
  file_path: string;
  title?: string;
}

export interface CreateVideoData {
  module_id: number;
  video_url: string;
  title?: string;
  duration?: number;
}

export const courseService = {
  // Créer un cours complet avec modules et leçons
  async createCourseWithStructure(courseData: CreateCourseData, modules: Array<{
    title: string;
    description?: string;
    lessons: Array<{
      title: string;
      content?: string;
    }>;
    documents?: Array<{
      title: string;
      file_path: string;
    }>;
    videos?: Array<{
      title: string;
      video_url: string;
      duration?: number;
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

        // 3. Créer les leçons pour chaque module
        for (let j = 0; j < moduleData.lessons.length; j++) {
          const lessonData = moduleData.lessons[j];
          
          const { error: lessonError } = await supabase
            .from('lessons')
            .insert({
              module_id: module.id,
              title: lessonData.title,
              content: lessonData.content,
              position: j + 1
            });

          if (lessonError) throw lessonError;
        }

        // 4. Ajouter les documents au module
        if (moduleData.documents && moduleData.documents.length > 0) {
          for (const document of moduleData.documents) {
            await this.addDocument({
              module_id: module.id,
              title: document.title,
              file_path: document.file_path
            });
          }
        }

        // 5. Ajouter les vidéos au module
        if (moduleData.videos && moduleData.videos.length > 0) {
          for (const video of moduleData.videos) {
            await this.addVideo({
              module_id: module.id,
              title: video.title,
              video_url: video.video_url,
              duration: video.duration
            });
          }
        }
      }

      return { success: true, course };
    } catch (error) {
      console.error('Error creating course structure:', error);
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
        .insert(lessonData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error creating lesson:', error);
      return { success: false, error };
    }
  },

  // Ajouter un document
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

  // Ajouter une vidéo
  async addVideo(videoData: CreateVideoData) {
    try {
      const { data, error } = await supabase
        .from('videos')
        .insert(videoData)
        .select()
        .single();

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error adding video:', error);
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

  // Get documents and videos for a module
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

      if (docsError) throw docsError;
      if (videosError) throw videosError;

      return { 
        success: true, 
        data: { 
          documents: documents || [], 
          videos: videos || [] 
        } 
      };
    } catch (error) {
      console.error('Error fetching module resources:', error);
      return { success: false, error };
    }
  }
};
