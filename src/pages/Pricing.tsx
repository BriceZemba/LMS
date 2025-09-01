
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';

const Pricing = () => {
  const plans = [
    {
      name: 'Gratuit',
      price: '0€',
      features: [
        'Accès aux cours gratuits',
        'Certificats de base',
        'Support communautaire'
      ]
    },
    {
      name: 'Premium',
      price: '29€/mois',
      features: [
        'Accès à tous les cours',
        'Certificats professionnels',
        'Support prioritaire',
        'Projets pratiques'
      ]
    },
    {
      name: 'Enterprise',
      price: 'Sur devis',
      features: [
        'Tous les avantages Premium',
        'Formation personnalisée',
        'Support dédié',
        'Analytics avancées'
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Tarifs
            </h1>
            <p className="text-xl text-gray-600">
              Choisissez le plan qui vous convient
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {plans.map((plan, index) => (
              <Card key={index} className="relative">
                <CardHeader>
                  <CardTitle className="text-center">
                    <div className="text-2xl font-bold">{plan.name}</div>
                    <div className="text-3xl font-bold text-blue-600 mt-2">
                      {plan.price}
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3 mb-6">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center">
                        <Check className="h-5 w-5 text-green-600 mr-2" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button className="w-full">
                    Choisir ce plan
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Pricing;
