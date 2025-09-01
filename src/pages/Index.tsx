
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle, Eye, Settings, Users, BookOpen, Award, Zap, Globe } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Hero } from '@/components/ui/animated-hero';

const Index = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <CheckCircle className="h-12 w-12 text-blue-600" />,
      title: "Notre Mission",
      description: "Accélérer la transformation digitale et améliorer la performance des industries africaines en proposant des solutions innovantes et durables."
    },
    {
      icon: <Eye className="h-12 w-12 text-blue-600" />,
      title: "Notre Vision", 
      description: "Devenir un acteur clé de la transformation industrielle et de l'usine intelligente en Afrique en développant un modèle moderne et durable."
    },
    {
      icon: <Settings className="h-12 w-12 text-blue-600" />,
      title: "Notre Approche",
      description: "Comprendre les besoins spécifiques de chaque client afin de proposer des solutions sur mesure et adaptées aux réalités du terrain."
    }
  ];

  const projects = [
    {
      title: "DIGITALIZATION",
      description: "Solutions de transformation digitale pour l'industrie 4.0",
      image: "/api/placeholder/400/250",
      color: "bg-gradient-to-br from-blue-900 to-purple-900"
    },
    {
      title: "SMART HOME",
      description: "Systèmes domotiques intelligents et connectés",
      image: "/api/placeholder/400/250", 
      color: "bg-gradient-to-br from-gray-700 to-gray-900"
    },
    {
      title: "ACCESS",
      description: "Solutions de contrôle d'accès et de sécurité",
      image: "/api/placeholder/400/250",
      color: "bg-gradient-to-br from-orange-700 to-red-800"
    }
  ];

  const stats = [
    { number: "500+", label: "Étudiants Actifs", icon: <Users className="h-6 w-6" /> },
    { number: "50+", label: "Cours Disponibles", icon: <BookOpen className="h-6 w-6" /> },
    { number: "1000+", label: "Certificats Délivrés", icon: <Award className="h-6 w-6" /> },
    { number: "98%", label: "Taux de Satisfaction", icon: <Zap className="h-6 w-6" /> }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      {/* Hero Section with new animated hero */}
      <section className="pt-16">
        <Hero />
      </section>

      {/* Stats */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
            {stats.map((stat, index) => (
              <Card key={index} className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-3 text-blue-600">
                    {stat.icon}
                  </div>
                  <div className="text-3xl font-bold text-gray-900 mb-1">{stat.number}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Mission, Vision, Approche */}
      <section className="py-16 px-6 bg-gradient-to-br from-slate-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto mb-4">
                    {feature.icon}
                  </div>
                  <CardTitle className="text-2xl font-bold text-blue-600">
                    {feature.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-gray-600 text-center leading-relaxed">
                    {feature.description}
                  </CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Nos Projets */}
      <section className="py-16 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">NOS PROJETS</h2>
            <p className="text-lg text-gray-600 max-w-4xl mx-auto">
              Nos projets d'ingénierie repoussent les limites de la créativité technique. Explorez nos projets pour découvrir comment nous avons contribué à façonner l'avenir de l'ingénierie, de la digitalisation et de l'industrie 4.0.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {projects.map((project, index) => (
              <Card key={index} className="group overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3">
                <div className={`h-48 ${project.color} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors duration-300"></div>
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
                    <div className="w-12 h-1 bg-blue-400"></div>
                  </div>
                </div>
                <CardContent className="p-6">
                  <p className="text-gray-600">{project.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Prêt à transformer votre parcours professionnel ?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Rejoignez des milliers de professionnels qui font confiance à LMS INVENTION
          </p>
          <Button 
            onClick={() => navigate('/register')}
            size="lg" 
            className="bg-white text-blue-600 hover:bg-gray-50 px-8 py-3 rounded-xl font-semibold"
          >
            Commencer Maintenant
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;