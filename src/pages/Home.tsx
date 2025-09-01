
import React from 'react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { Hero } from '@/components/ui/animated-hero';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Button } from '@/components/ui/button';
import { ArrowRight, BookOpen, Users, Award, TrendingUp } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  const { user } = useSupabaseAuth();
  const navigate = useNavigate();

  const stats = [
    { icon: BookOpen, label: 'Cours disponibles', value: '50+' },
    { icon: Users, label: 'Étudiants actifs', value: '1000+' },
    { icon: Award, label: 'Certificats délivrés', value: '500+' },
    { icon: TrendingUp, label: 'Taux de réussite', value: '95%' }
  ];

  const features = [
    {
      title: 'Formations Expertes',
      description: 'Accédez à des formations de qualité dispensées par des experts de l\'industrie',
      icon: '🎓'
    },
    {
      title: 'Apprentissage Flexible',
      description: 'Apprenez à votre rythme avec nos modules adaptatifs et interactifs',
      icon: '⚡'
    },
    {
      title: 'Certifications Reconnues',
      description: 'Obtenez des certifications reconnues par l\'industrie',
      icon: '🏆'
    },
    {
      title: 'Suivi Personnalisé',
      description: 'Bénéficiez d\'un suivi personnalisé de votre progression',
      icon: '📊'
    }
  ];

  return (
    <div className="min-h-screen">
      <Navigation />
      
      <div className="pt-16">
        {/* Hero Section */}
        <Hero />

        {/* Welcome Section for Logged Users */}
        {user && (
          <motion.section
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="py-16 bg-white"
          >
            <div className="max-w-7xl mx-auto px-6">
              <div className="text-center mb-12">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                  Bienvenue, {user.first_name} !
                </h2>
                <p className="text-xl text-gray-600 mb-8">
                  Continuez votre parcours d'apprentissage
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button 
                    onClick={() => navigate('/dashboard')}
                    size="lg"
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    Accéder au tableau de bord
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                  <Button 
                    onClick={() => navigate('/courses')}
                    size="lg"
                    variant="outline"
                    className="border-blue-600 text-blue-600 hover:bg-blue-50"
                  >
                    Parcourir les cours
                  </Button>
                </div>
              </div>
            </div>
          </motion.section>
        )}

        {/* Stats Section */}
        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="py-16 bg-gradient-to-r from-blue-600 to-purple-600"
        >
          <div className="max-w-7xl mx-auto px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center text-white"
                >
                  <stat.icon className="h-12 w-12 mx-auto mb-4 text-blue-200" />
                  <div className="text-3xl font-bold mb-2">{stat.value}</div>
                  <div className="text-blue-100">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        {/* Features Section */}
        <section className="py-20 bg-gray-50">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Pourquoi choisir LMS INVENTION ?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Une plateforme moderne conçue pour votre réussite professionnelle
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        {!user && (
          <motion.section
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="py-20 bg-blue-600"
          >
            <div className="max-w-4xl mx-auto px-6 text-center">
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Prêt à commencer votre parcours ?
              </h2>
              <p className="text-xl text-blue-100 mb-8">
                Rejoignez des milliers d'apprenants et développez vos compétences dès aujourd'hui
              </p>
              <Button 
                onClick={() => navigate('/supabase-auth')}
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                Commencer maintenant
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </div>
          </motion.section>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Home;
