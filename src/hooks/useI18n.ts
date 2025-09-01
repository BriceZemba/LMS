
import { useState, useEffect } from 'react';
import { SupportedLanguage, Translation } from '@/types/i18n';

// Traductions par défaut
const translations: Record<SupportedLanguage, Translation> = {
  fr: {
    navigation: {
      home: 'Accueil',
      courses: 'Cours',
      dashboard: 'Dashboard',
      profile: 'Profil',
      logout: 'Déconnexion',
      login: 'Connexion',
      signup: "S'inscrire"
    },
    dashboard: {
      title: 'Tableau de Bord',
      welcome: 'Bienvenue',
      progress: 'Progression',
      certificates: 'Certificats',
      enrolled_courses: 'Cours Suivis',
      continue: 'Continuer',
      explore_more: 'Explorer plus de cours'
    },
    course: {
      modules: 'modules',
      completed: 'terminé',
      time_spent: 'temps passé',
      progress: 'progression',
      quiz: 'Quiz',
      video: 'Vidéo',
      document: 'Document',
      simulation: 'Simulation'
    },
    gamification: {
      level: 'Niveau',
      xp: 'XP',
      badges: 'Badges',
      leaderboard: 'Classement',
      achievements: 'Accomplissements',
      points: 'Points',
      rank: 'Rang'
    },
    forum: {
      discussion: 'Discussion',
      new_topic: 'Nouveau Sujet',
      reply: 'Répondre',
      search: 'Rechercher',
      pinned: 'Épinglé',
      locked: 'Verrouillé',
      recent: 'Récent'
    },
    common: {
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      confirm: 'Confirmer'
    }
  },
  en: {
    navigation: {
      home: 'Home',
      courses: 'Courses',
      dashboard: 'Dashboard',
      profile: 'Profile',
      logout: 'Logout',
      login: 'Login',
      signup: 'Sign Up'
    },
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      progress: 'Progress',
      certificates: 'Certificates',
      enrolled_courses: 'Enrolled Courses',
      continue: 'Continue',
      explore_more: 'Explore more courses'
    },
    course: {
      modules: 'modules',
      completed: 'completed',
      time_spent: 'time spent',
      progress: 'progress',
      quiz: 'Quiz',
      video: 'Video',
      document: 'Document',
      simulation: 'Simulation'
    },
    gamification: {
      level: 'Level',
      xp: 'XP',
      badges: 'Badges',
      leaderboard: 'Leaderboard',
      achievements: 'Achievements',
      points: 'Points',
      rank: 'Rank'
    },
    forum: {
      discussion: 'Discussion',
      new_topic: 'New Topic',
      reply: 'Reply',
      search: 'Search',
      pinned: 'Pinned',
      locked: 'Locked',
      recent: 'Recent'
    },
    common: {
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      loading: 'Loading...',
      error: 'Error',
      success: 'Success',
      confirm: 'Confirm'
    }
  }
};

export const useI18n = () => {
  const [currentLanguage, setCurrentLanguage] = useState<SupportedLanguage>(() => {
    const saved = localStorage.getItem('language');
    return (saved as SupportedLanguage) || 'fr';
  });

  const changeLanguage = (language: SupportedLanguage) => {
    setCurrentLanguage(language);
    localStorage.setItem('language', language);
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let value: any = translations[currentLanguage];
    
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        // Fallback to French if key not found
        value = translations.fr;
        for (const fallbackKey of keys) {
          if (value && typeof value === 'object' && fallbackKey in value) {
            value = value[fallbackKey];
          } else {
            return key; // Return key if translation not found
          }
        }
        break;
      }
    }
    
    return typeof value === 'string' ? value : key;
  };

  return {
    currentLanguage,
    changeLanguage,
    t,
    availableLanguages: ['fr', 'en'] as SupportedLanguage[]
  };
};
