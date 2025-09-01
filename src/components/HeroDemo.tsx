import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

const HeroDemo = () => {
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();

  return (
    <section className="py-20 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
          Plateforme d'Apprentissage
          <span className="block text-blue-600">LMS INVENTION</span>
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Votre parcours d'apprentissage commence ici.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button 
            size="lg"
            onClick={() => navigate(user ? '/dashboard' : '/supabase-auth')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3"
          >
            {user ? 'Tableau de bord' : 'Commencer'}
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroDemo;
