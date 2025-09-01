
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  BookOpen, 
  Award, 
  Clock, 
  TrendingUp, 
  User,
  Mail,
  Calendar,
  Target
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { Badge } from '@/components/ui/badge';

const Dashboard = () => {
  const { user, isAdmin, isFormateur } = useSupabaseAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Tableau de Bord
            </h1>
            <p className="text-lg text-gray-600">
              Bienvenue, {user.first_name} ! Suivez votre progression d'apprentissage.
            </p>
          </div>

          {/* User Profile Card */}
          <Card className="mb-8 border-0 shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div>
                  <div className="text-xl font-bold">
                    {user.first_name} {user.last_name}
                  </div>
                  <Badge className={`mt-1 ${
                    isAdmin() ? 'bg-red-100 text-red-800' : 
                    isFormateur() ? 'bg-green-100 text-green-800' : 
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {user.role_name || 'Utilisateur'}
                  </Badge>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span className="text-sm">{user.email}</span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Calendar className="h-4 w-4" />
                  <span className="text-sm">
                    Membre depuis {new Date(user.created_at).toLocaleDateString('fr-FR', { 
                      year: 'numeric', 
                      month: 'long' 
                    })}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-600">
                  <Target className="h-4 w-4" />
                  <span className="text-sm">Pays: {user.country_name || 'Non spécifié'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Empty State */}
          <div className="text-center py-12">
            <BookOpen className="h-16 w-16 mx-auto text-gray-300 mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Votre espace d'apprentissage vous attend
            </h3>
            <p className="text-gray-600 mb-6">
              Commencez votre parcours d'apprentissage en explorant nos cours disponibles.
            </p>
            <Button 
              onClick={() => navigate('/courses')}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Explorer les cours
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Dashboard;
