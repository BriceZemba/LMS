export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  public: {
    Tables: {
      admin_logs: {
        Row: {
          action_timestamp: string
          action_type: string
          admin_user_id: number
          description: string | null
          id: number
          ip_address: string | null
          target_id: number | null
          target_table: string | null
        }
        Insert: {
          action_timestamp?: string
          action_type: string
          admin_user_id: number
          description?: string | null
          id?: number
          ip_address?: string | null
          target_id?: number | null
          target_table?: string | null
        }
        Update: {
          action_timestamp?: string
          action_type?: string
          admin_user_id?: number
          description?: string | null
          id?: number
          ip_address?: string | null
          target_id?: number | null
          target_table?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "admin_logs_admin_user_id_fkey"
            columns: ["admin_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    quiz:{
        Row:{
          id:number
          lesson_id:number
          module_id:number
          title:string
          description:string | null
          created_at:string | null
          updated_at:string | null
        }
        
      }
      badges: {
        Row: {
          created_at: string | null
          description: string | null
          icon_url: string | null
          id: number
          name: string
          points_awarded: number | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: number
          name: string
          points_awarded?: number | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          icon_url?: string | null
          id?: number
          name?: string
          points_awarded?: number | null
        }
        Relationships: []
      }
      certificates: {
        Row: {
          certificate_code: string
          course_id: number
          date_issued: string | null
          file_path: string | null
          id: number
          user_id: number
          valid_until: string | null
        }
        Insert: {
          certificate_code: string
          course_id: number
          date_issued?: string | null
          file_path?: string | null
          id?: number
          user_id: number
          valid_until?: string | null
        }
        Update: {
          certificate_code?: string
          course_id?: number
          date_issued?: string | null
          file_path?: string | null
          id?: number
          user_id?: number
          valid_until?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "certificates_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "certificates_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string | null
          id: number
          name: string
        }
        Insert: {
          code?: string | null
          id?: number
          name: string
        }
        Update: {
          code?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      course_stats: {
        Row: {
          average_completion_percent: number | null
          average_quiz_score: number | null
          course_id: number
          id: number
          last_updated: string | null
          total_enrollments: number | null
        }
        Insert: {
          average_completion_percent?: number | null
          average_quiz_score?: number | null
          course_id: number
          id?: number
          last_updated?: string | null
          total_enrollments?: number | null
        }
        Update: {
          average_completion_percent?: number | null
          average_quiz_score?: number | null
          course_id?: number
          id?: number
          last_updated?: string | null
          total_enrollments?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "course_stats_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "course_stats_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          completion_rate: number | null
          cover_image: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          enrolled_students: number | null
          id: number
          instructor: string | null
          instructor_id: number | null
          level: string | null
          published: boolean | null
          tags: string[] | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          completion_rate?: number | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          enrolled_students?: number | null
          id?: number
          instructor?: string | null
          instructor_id?: number | null
          level?: string | null
          published?: boolean | null
          tags?: string[] | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          completion_rate?: number | null
          cover_image?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          enrolled_students?: number | null
          id?: number
          instructor?: string | null
          instructor_id?: number | null
          level?: string | null
          published?: boolean | null
          tags?: string[] | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      documents: {
        Row: {
          file_path: string
          id: number
          lesson_id: number | null
          module_id: number | null
          title: string | null
          uploaded_at: string | null
        }
        Insert: {
          file_path: string
          id?: number
          lesson_id?: number | null
          module_id?: number | null
          title?: string | null
          uploaded_at?: string | null
        }
        Update: {
          file_path?: string
          id?: number
          lesson_id?: number | null
          module_id?: number | null
          title?: string | null
          uploaded_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "documents_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["module_id"]
          },
          {
            foreignKeyName: "documents_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      enrollments: {
        Row: {
          course_id: number
          enrollment_date: string
          id: number
          progress_percent: number | null
          status: string
          user_id: number
        }
        Insert: {
          course_id: number
          enrollment_date?: string
          id?: number
          progress_percent?: number | null
          status?: string
          user_id: number
        }
        Update: {
          course_id?: number
          enrollment_date?: string
          id?: number
          progress_percent?: number | null
          status?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "enrollments_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "enrollments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_posts: {
        Row: {
          content: string
          created_at: string | null
          id: number
          thread_id: number
          updated_at: string | null
          user_id: number
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: number
          thread_id: number
          updated_at?: string | null
          user_id: number
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: number
          thread_id?: number
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_posts_thread_id_fkey"
            columns: ["thread_id"]
            isOneToOne: false
            referencedRelation: "forum_threads"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_posts_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forum_threads: {
        Row: {
          created_at: string | null
          forum_id: number
          id: number
          is_closed: boolean | null
          title: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          forum_id: number
          id?: number
          is_closed?: boolean | null
          title: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          forum_id?: number
          id?: number
          is_closed?: boolean | null
          title?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "forum_threads_forum_id_fkey"
            columns: ["forum_id"]
            isOneToOne: false
            referencedRelation: "forums"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "forum_threads_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      forums: {
        Row: {
          course_id: number
          created_at: string | null
          description: string | null
          id: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: number
          created_at?: string | null
          description?: string | null
          id?: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: number
          created_at?: string | null
          description?: string | null
          id?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "forums_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "forums_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      leaderboards: {
        Row: {
          course_id: number | null
          id: number
          last_updated: string | null
          points: number
          rank: number
          user_id: number
        }
        Insert: {
          course_id?: number | null
          id?: number
          last_updated?: string | null
          points?: number
          rank: number
          user_id: number
        }
        Update: {
          course_id?: number | null
          id?: number
          last_updated?: string | null
          points?: number
          rank?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "leaderboards_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "leaderboards_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "leaderboards_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      lessons: {
        Row: {
          content: string | null
          created_at: string | null
          id: number
          module_id: number
          position: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          content?: string | null
          created_at?: string | null
          id?: number
          module_id: number
          position?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          content?: string | null
          created_at?: string | null
          id?: number
          module_id?: number
          position?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["module_id"]
          },
          {
            foreignKeyName: "lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      modules: {
        Row: {
          course_id: number
          created_at: string | null
          description: string | null
          id: number
          position: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id: number
          created_at?: string | null
          description?: string | null
          id?: number
          position?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: number
          created_at?: string | null
          description?: string | null
          id?: number
          position?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: number
          is_read: boolean | null
          message: string
          read_at: string | null
          type: string
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message: string
          read_at?: string | null
          type: string
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          is_read?: boolean | null
          message?: string
          read_at?: string | null
          type?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          id: number
          payment_date: string
          payment_method: string | null
          status: string
          transaction_id: string | null
          user_id: number
        }
        Insert: {
          amount: number
          id?: number
          payment_date?: string
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          user_id: number
        }
        Update: {
          amount?: number
          id?: number
          payment_date?: string
          payment_method?: string | null
          status?: string
          transaction_id?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "payments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      points_history: {
        Row: {
          created_at: string | null
          id: number
          points: number
          reason: string | null
          related_entity: string | null
          related_entity_id: number | null
          user_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          points: number
          reason?: string | null
          related_entity?: string | null
          related_entity_id?: number | null
          user_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          points?: number
          reason?: string | null
          related_entity?: string | null
          related_entity_id?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "points_history_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      progress: {
        Row: {
          course_id: number | null
          id: number
          last_update: string | null
          module_id: number | null
          percent_completed: number
          user_id: number
        }
        Insert: {
          course_id?: number | null
          id?: number
          last_update?: string | null
          module_id?: number | null
          percent_completed: number
          user_id: number
        }
        Update: {
          course_id?: number | null
          id?: number
          last_update?: string | null
          module_id?: number | null
          percent_completed?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["course_id"]
          },
          {
            foreignKeyName: "progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["module_id"]
          },
          {
            foreignKeyName: "progress_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "progress_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_options: {
        Row: {
          created_at: string | null
          id: number
          is_correct: boolean | null
          option_text: string
          quiz_id: number
        }
        Insert: {
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          option_text: string
          quiz_id: number
        }
        Update: {
          created_at?: string | null
          id?: number
          is_correct?: boolean | null
          option_text?: string
          quiz_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_options_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
        ]
      }
      quiz_results: {
        Row: {
          completed_at: string | null
          duration_seconds: number | null
          id: number
          passed: boolean | null
          quiz_id: number
          score: number | null
          user_id: number
        }
        Insert: {
          completed_at?: string | null
          duration_seconds?: number | null
          id?: number
          passed?: boolean | null
          quiz_id: number
          score?: number | null
          user_id: number
        }
        Update: {
          completed_at?: string | null
          duration_seconds?: number | null
          id?: number
          passed?: boolean | null
          quiz_id?: number
          score?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "quiz_results_quiz_id_fkey"
            columns: ["quiz_id"]
            isOneToOne: false
            referencedRelation: "quizzes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quiz_results_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      quizzes: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          lesson_id: number | null
          module_id: number | null
          title: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          lesson_id?: number | null
          module_id?: number | null
          title: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          lesson_id?: number | null
          module_id?: number | null
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["lesson_id"]
          },
          {
            foreignKeyName: "quizzes_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "lessons"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["module_id"]
          },
          {
            foreignKeyName: "quizzes_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
      roles: {
        Row: {
          id: number
          role_name: string
        }
        Insert: {
          id?: number
          role_name: string
        }
        Update: {
          id?: number
          role_name?: string
        }
        Relationships: []
      }
      sessions: {
        Row: {
          id: number
          ip_address: string | null
          login_time: string
          logout_time: string | null
          user_agent: string | null
          user_id: number | null
        }
        Insert: {
          id?: number
          ip_address?: string | null
          login_time?: string
          logout_time?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Update: {
          id?: number
          ip_address?: string | null
          login_time?: string
          logout_time?: string | null
          user_agent?: string | null
          user_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "sessions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      subscriptions: {
        Row: {
          end_date: string | null
          id: number
          payment_id: number | null
          start_date: string
          status: string
          subscription_type: string
          user_id: number
        }
        Insert: {
          end_date?: string | null
          id?: number
          payment_id?: number | null
          start_date: string
          status?: string
          subscription_type: string
          user_id: number
        }
        Update: {
          end_date?: string | null
          id?: number
          payment_id?: number | null
          start_date?: string
          status?: string
          subscription_type?: string
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_payment_id_fkey"
            columns: ["payment_id"]
            isOneToOne: false
            referencedRelation: "payments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      translations: {
        Row: {
          id: number
          last_updated: string | null
          text_en: string
          text_fr: string
          translation_key: string
        }
        Insert: {
          id?: number
          last_updated?: string | null
          text_en: string
          text_fr: string
          translation_key: string
        }
        Update: {
          id?: number
          last_updated?: string | null
          text_en?: string
          text_fr?: string
          translation_key?: string
        }
        Relationships: []
      }
      user_activity: {
        Row: {
          id: number
          last_action: string | null
          last_visit: string | null
          total_time_spent_seconds: number | null
          user_id: number
        }
        Insert: {
          id?: number
          last_action?: string | null
          last_visit?: string | null
          total_time_spent_seconds?: number | null
          user_id: number
        }
        Update: {
          id?: number
          last_action?: string | null
          last_visit?: string | null
          total_time_spent_seconds?: number | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_activity_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_badges: {
        Row: {
          awarded_at: string | null
          badge_id: number
          id: number
          user_id: number
        }
        Insert: {
          awarded_at?: string | null
          badge_id: number
          id?: number
          user_id: number
        }
        Update: {
          awarded_at?: string | null
          badge_id?: number
          id?: number
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_preferences: {
        Row: {
          id: number
          other_preferences: Json | null
          preferred_language: string
          updated_at: string | null
          user_id: number
        }
        Insert: {
          id?: number
          other_preferences?: Json | null
          preferred_language?: string
          updated_at?: string | null
          user_id: number
        }
        Update: {
          id?: number
          other_preferences?: Json | null
          preferred_language?: string
          updated_at?: string | null
          user_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "user_preferences_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          country_id: number | null
          created_at: string | null
          email: string
          first_name: string
          id: number
          last_name: string
          password_hash: string
          role_id: number | null
          updated_at: string | null
        }
        Insert: {
          country_id?: number | null
          created_at?: string | null
          email: string
          first_name: string
          id?: number
          last_name: string
          password_hash: string
          role_id?: number | null
          updated_at?: string | null
        }
        Update: {
          country_id?: number | null
          created_at?: string | null
          email?: string
          first_name?: string
          id?: number
          last_name?: string
          password_hash?: string
          role_id?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_role_id_fkey"
            columns: ["role_id"]
            isOneToOne: false
            referencedRelation: "roles"
            referencedColumns: ["id"]
          },
        ]
      }
      videos: {
        Row: {
          duration: number | null
          id: number
          module_id: number
          title: string | null
          uploaded_at: string | null
          video_url: string
        }
        Insert: {
          duration?: number | null
          id?: number
          module_id: number
          title?: string | null
          uploaded_at?: string | null
          video_url: string
        }
        Update: {
          duration?: number | null
          id?: number
          module_id?: number
          title?: string | null
          uploaded_at?: string | null
          video_url?: string
        }
        Relationships: [
          {
            foreignKeyName: "videos_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_structure"
            referencedColumns: ["module_id"]
          },
          {
            foreignKeyName: "videos_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "modules"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      course_structure: {
        Row: {
          category: string | null
          course_description: string | null
          course_id: number | null
          course_title: string | null
          documents_count: number | null
          duration: string | null
          instructor: string | null
          lesson_content: string | null
          lesson_id: number | null
          lesson_position: number | null
          lesson_title: string | null
          level: string | null
          module_description: string | null
          module_id: number | null
          module_position: number | null
          module_title: string | null
          published: boolean | null
          videos_count: number | null
        }
        Relationships: []
      }
    }
    Functions: {
      hash_password: {
        Args: { password_text: string }
        Returns: string
      }
      verify_password: {
        Args: { password_text: string; password_hash: string }
        Returns: boolean
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
