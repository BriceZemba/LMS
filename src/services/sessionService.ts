
import { supabase } from '@/integrations/supabase/client';

export interface SessionData {
  user_id: number;
  ip_address?: string;
  user_agent?: string;
}

export const sessionService = {
  // Create a new session when user logs in
  async createSession(sessionData: SessionData) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .insert({
          user_id: sessionData.user_id,
          ip_address: sessionData.ip_address,
          user_agent: sessionData.user_agent,
          login_time: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;
      
      // Store session ID in localStorage for logout tracking
      localStorage.setItem('current_session_id', data.id.toString());
      
      return { success: true, sessionId: data.id };
    } catch (error) {
      console.error('Error creating session:', error);
      return { success: false, error };
    }
  },

  // End session when user logs out
  async endSession() {
    try {
      const sessionId = localStorage.getItem('current_session_id');
      if (!sessionId) return { success: true };

      const { error } = await supabase
        .from('sessions')
        .update({ logout_time: new Date().toISOString() })
        .eq('id', parseInt(sessionId));

      if (error) throw error;
      
      localStorage.removeItem('current_session_id');
      return { success: true };
    } catch (error) {
      console.error('Error ending session:', error);
      return { success: false, error };
    }
  },

  // Get user session history
  async getUserSessions(userId: number) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .order('login_time', { ascending: false });

      if (error) throw error;
      return { success: true, data };
    } catch (error) {
      console.error('Error fetching sessions:', error);
      return { success: false, error };
    }
  }
};
