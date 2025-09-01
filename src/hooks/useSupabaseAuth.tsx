import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { sessionService } from '@/services/sessionService';
import { toast } from 'sonner';

interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  role_id?: number;
  role_name?: string;
  country_name?: string;
  created_at: string;
  updated_at: string | null;
}

interface Country {
  id: number;
  name: string;
  code: string;
}

interface Role {
  id: number;
  role_name: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (userData: RegisterData) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
  countries: Country[];
  roles: Role[];
  isAdmin: () => boolean;
  isFormateur: () => boolean;
  isStudent: () => boolean;
}

interface RegisterData {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  country_id: number;
  role_id?: number;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const SupabaseAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [countries, setCountries] = useState<Country[]>([]);
  const [roles, setRoles] = useState<Role[]>([]);
  const [showWelcome, setShowWelcome] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');

  // Helper function to get client info
  const getClientInfo = () => {
    return {
      ip_address: null, // In a real app, you'd get this from a service
      user_agent: navigator.userAgent
    };
  };

  useEffect(() => {
    loadCountries();
    loadRoles();
    
    // Check if user is already logged in
    const savedUser = localStorage.getItem('lms_user_supabase');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('lms_user_supabase');
      }
    }
    setIsLoading(false);
  }, []);

  const loadCountries = async () => {
    try {
      const { data, error } = await supabase
        .from('countries')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setCountries(data || []);
    } catch (error) {
      console.error('Error loading countries:', error);
    }
  };

  const loadRoles = async () => {
    try {
      const { data, error } = await supabase
        .from('roles')
        .select('*')
        .order('role_name');
      
      if (error) throw error;
      setRoles(data || []);
    } catch (error) {
      console.error('Error loading roles:', error);
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      const { data, error } = await supabase
        .from('users')
        .select(`
          id,
          first_name,
          last_name,
          email,
          role_id,
          created_at,
          updated_at,
          roles!inner(role_name),
          countries!inner(name)
        `)
        .eq('email', email)
        .single();
      
      if (error || !data) {
        console.error('User not found:', error);
        return false;
      }
      
      const userData = {
        id: data.id,
        first_name: data.first_name,
        last_name: data.last_name,
        email: data.email,
        role_id: data.role_id,
        role_name: (data.roles )?.role_name,
        country_name: (data.countries )?.name,
        created_at: data.created_at,
        updated_at: data.updated_at
      };
      
      setUser(userData);
      localStorage.setItem('lms_user_supabase', JSON.stringify(userData));
      
      // Track session
      const clientInfo = getClientInfo();
      await sessionService.createSession({
        user_id: userData.id,
        ...clientInfo
      });
      
      // Replace welcome animation with toast
      toast.success(`Bienvenue ${userData.first_name} !`);
      
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (userData: RegisterData): Promise<boolean> => {
    try {
      setIsLoading(true);
      
      // Get default role "Apprenant" if no role specified
      let roleId = userData.role_id;
      if (!roleId) {
        const apprenantRole = roles.find(role => role.role_name === 'Apprenant');
        if (apprenantRole) {
          roleId = apprenantRole.id;
        }
      }
      
      const { data, error } = await supabase
        .from('users')
        .insert({
          first_name: userData.first_name,
          last_name: userData.last_name,
          email: userData.email,
          password_hash: userData.password, // Note: Should be hashed in production
          country_id: userData.country_id,
          role_id: roleId
        })
        .select(`
          id,
          first_name,
          last_name,
          email,
          role_id,
          created_at,
          updated_at,
          roles!inner(role_name),
          countries!inner(name)
        `)
        .single();
      
      if (error) {
        console.error('Registration error:', error);
        return false;
      }
      
      if (data) {
        const newUser = {
          id: data.id,
          first_name: data.first_name,
          last_name: data.last_name,
          email: data.email,
          role_id: data.role_id,
          role_name: (data.roles )?.role_name,
          country_name: (data.countries )?.name,
          created_at: data.created_at,
          updated_at: data.updated_at
        };
        
        setUser(newUser);
        localStorage.setItem('lms_user_supabase', JSON.stringify(newUser));
        
        // Track session
        const clientInfo = getClientInfo();
        await sessionService.createSession({
          user_id: newUser.id,
          ...clientInfo
        });
        
        // Replace welcome animation with toast
        toast.success(`Bienvenue ${newUser.first_name} !`);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    // End session tracking
    await sessionService.endSession();
    
    setUser(null);
    localStorage.removeItem('lms_user_supabase');
  };

  const isAdmin = () => user?.role_id === 6;
  const isFormateur = () => user?.role_id === 7;
  const isStudent = () => user && !isAdmin() && !isFormateur();

  return (
    <AuthContext.Provider value={{ 
      user, 
      login, 
      register, 
      logout, 
      isLoading, 
      countries, 
      roles,
      isAdmin,
      isFormateur,
      isStudent
    }}>
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useSupabaseAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useSupabaseAuth must be used within a SupabaseAuthProvider');
  }
  return context;
};
