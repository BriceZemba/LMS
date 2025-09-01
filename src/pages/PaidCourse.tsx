
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Play, 
  Clock, 
  Users, 
  Star, 
  Award, 
  CheckCircle,
  Lock,
  CreditCard
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { toast } from 'sonner';

const PaidCourse = () => {
  const { courseId } = useParams();
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);

  // Données du cours fictif
  const course = {
    id: courseId,
    title: 'Maîtrise complète de l\'Intelligence Artificielle',
    description: 'Devenez expert en IA avec cette formation complète couvrant le machine learning, deep learning, et les applications pratiques.',
    instructor: 'Dr. Marie Dubois',
    price: 149.99,
    originalPrice: 199.99,
    duration: '12 semaines',
    students: 1247,
    rating: 4.9,
    level: 'Intermédiaire',
    isPaid: true,
    hasAccess: false, // Simule si l'utilisateur a déjà acheté le cours
    modules: [
      { id: 1, title: 'Introduction à l\'IA', duration: '45 min', locked: false },
      { id: 2, title: 'Machine Learning Fondamentaux', duration: '1h 30min', locked: true },
      { id: 3, title: 'Deep Learning avec TensorFlow', duration: '2h 15min', locked: true },
      { id: 4, title: 'Applications pratiques', duration: '1h 45min', locked: true },
    ],
    features: [
      'Accès à vie au contenu',
      'Certificat de completion',
      'Support par email',
      'Projets pratiques',
      'Communauté d\'étudiants'
    ]
  };

  const handlePurchase = async () => {
    if (!user) {
      navigate('/supabase-auth');
      return;
    }

    setIsProcessing(true);
    
    try {
      // Simulation d'un appel API Stripe
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Redirection vers Stripe Checkout (simulation)
      const stripeCheckoutUrl = `https://checkout.stripe.com/pay/cs_test_${course.id}`;
      
      // En production, vous utiliseriez l'API Stripe :
      // window.open(stripeCheckoutUrl, '_blank');
      
      // Pour la démo, on simule un achat réussi
      toast.success('Redirection vers le paiement sécurisé...');
      setTimeout(() => {
        toast.success('Cours acheté avec succès ! Vous pouvez maintenant y accéder.');
        // course.hasAccess = true; // Mettre à jour l'état d'accès
      }, 3000);
      
    } catch (error) {
      toast.error('Erreur lors du processus de paiement');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Contenu principal */}
            <div className="lg:col-span-2 space-y-8">
              {/* Header du cours */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Star className="h-3 w-3 mr-1" />
                      {course.rating} ({course.students} étudiants)
                    </Badge>
                    <Badge variant="outline">{course.level}</Badge>
                    <Badge className="bg-red-100 text-red-800">
                      <Lock className="h-3 w-3 mr-1" />
                      Cours Premium
                    </Badge>
                  </div>
                  <CardTitle className="text-3xl font-bold mb-4">{course.title}</CardTitle>
                  <CardDescription className="text-lg">{course.description}</CardDescription>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mt-4">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {course.duration}
                    </div>
                    <div className="flex items-center">
                      <Users className="h-4 w-4 mr-1" />
                      {course.students} étudiants
                    </div>
                    <div className="flex items-center">
                      <Award className="h-4 w-4 mr-1" />
                      Certificat inclus
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Contenu du cours */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Contenu du cours</CardTitle>
                  <CardDescription>
                    {course.modules.length} modules • {course.duration} de contenu
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {course.modules.map((module, index) => (
                      <div 
                        key={module.id}
                        className={`flex items-center justify-between p-4 rounded-lg border ${
                          module.locked && !course.hasAccess
                            ? 'bg-gray-50 border-gray-200'
                            : 'bg-white border-green-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {module.locked && !course.hasAccess ? (
                            <Lock className="h-5 w-5 text-gray-400" />
                          ) : (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          )}
                          <div>
                            <h4 className={`font-medium ${
                              module.locked && !course.hasAccess ? 'text-gray-500' : 'text-gray-900'
                            }`}>
                              {index + 1}. {module.title}
                            </h4>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className={`text-sm ${
                            module.locked && !course.hasAccess ? 'text-gray-400' : 'text-gray-600'
                          }`}>
                            {module.duration}
                          </span>
                          {!module.locked || course.hasAccess ? (
                            <Play className="h-4 w-4 text-blue-600" />
                          ) : null}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Ce que vous apprendrez */}
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Ce qui est inclus</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-3">
                    {course.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="h-5 w-5 text-green-600 flex-shrink-0" />
                        <span className="text-gray-700">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar achat */}
            <div className="lg:col-span-1">
              <Card className="border-0 shadow-lg sticky top-24">
                <CardContent className="p-6">
                  {/* Aperçu vidéo */}
                  <div className="relative bg-gray-900 rounded-lg mb-6 aspect-video flex items-center justify-center">
                    <Play className="h-16 w-16 text-white opacity-80" />
                    <div className="absolute inset-0 bg-black bg-opacity-30 rounded-lg"></div>
                  </div>

                  {/* Prix */}
                  <div className="mb-6">
                    <div className="flex items-center space-x-2 mb-2">
                      <span className="text-3xl font-bold text-gray-900">€{course.price}</span>
                      <span className="text-lg text-gray-500 line-through">€{course.originalPrice}</span>
                      <Badge className="bg-red-100 text-red-800">-25%</Badge>
                    </div>
                    <p className="text-sm text-gray-600">Offre limitée • Se termine dans 2 jours</p>
                  </div>

                  {/* Bouton d'achat */}
                  {user ? (
                    course.hasAccess ? (
                      <Button 
                        className="w-full h-12 text-lg mb-4"
                        onClick={() => navigate(`/learn/${course.id}`)}
                      >
                        <Play className="mr-2 h-5 w-5" />
                        Commencer le cours
                      </Button>
                    ) : (
                      <Button 
                        className="w-full h-12 text-lg mb-4 bg-green-600 hover:bg-green-700"
                        onClick={handlePurchase}
                        disabled={isProcessing}
                      >
                        {isProcessing ? (
                          <div className="flex items-center">
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                            Traitement...
                          </div>
                        ) : (
                          <>
                            <CreditCard className="mr-2 h-5 w-5" />
                            Acheter maintenant
                          </>
                        )}
                      </Button>
                    )
                  ) : (
                    <Button 
                      className="w-full h-12 text-lg mb-4"
                      onClick={() => navigate('/supabase-auth')}
                    >
                      Se connecter pour acheter
                    </Button>
                  )}

                  <p className="text-xs text-gray-500 text-center mb-4">
                    Paiement sécurisé par Stripe • Garantie 30 jours
                  </p>

                  {/* Informations instructor */}
                  <div className="border-t pt-4">
                    <h4 className="font-semibold mb-2">Votre instructeur</h4>
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold">MD</span>
                      </div>
                      <div>
                        <p className="font-medium">{course.instructor}</p>
                        <p className="text-sm text-gray-600">Expert en IA • 15 ans d'expérience</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PaidCourse;
