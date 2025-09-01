
import React from 'react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';

const CallToActionSection = () => {
  const navigate = useNavigate();

  return (
    <section className="py-16 px-6 bg-blue-600">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-bold text-white mb-4">
          Prêt à commencer ?
        </h2>
        <p className="text-blue-100 mb-8">
          Rejoignez notre communauté d'apprentissage dès aujourd'hui.
        </p>
        <Button 
          size="lg"
          onClick={() => navigate('/auth')}
          className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-3"
        >
          S'inscrire maintenant
        </Button>
      </div>
    </section>
  );
};

export default CallToActionSection;
