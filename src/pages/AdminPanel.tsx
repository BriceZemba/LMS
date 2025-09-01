import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  TrendingUp, 
  Award,
  Plus,
  Edit,
  Trash2,
  Eye,
  Settings,
  BarChart3
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const AdminPanel = () => {
  const { user, isAdmin } = useSupabaseAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // État pour le formulaire de création de cours
  const [courseForm, setCourseForm] = useState({
    title: '',
    description: '',
    category: '',
    level: '',
    duration: '',
    videoUrl: '',
    pdfUrl: '',
    content: ''
  });

  const handleCourseSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!courseForm.title || !courseForm.description || !courseForm.category) {
      toast.error('Veuillez remplir tous les champs obligatoires');
      return;
    }

    toast.success('Cours créé avec succès !');
    setCourseForm({
      title: '',
      description: '',
      category: '',
      level: '',
      duration: '',
      videoUrl: '',
      pdfUrl: '',
      content: ''
    });
  };

  // Vérification des droits d'accès - moved after all hooks
  if (!user || !isAdmin()) {
    navigate('/');
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
                Administration
              </h1>
              <p className="text-lg text-gray-600">
                Gérez votre plateforme LMS INVENTION
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Settings className="h-6 w-6 text-gray-600" />
              <span className="text-sm text-gray-600">Panneau Admin</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white rounded-xl shadow-lg">
              <TabsTrigger value="overview" className="flex items-center space-x-2">
                <BarChart3 className="h-4 w-4" />
                <span>Vue d'ensemble</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="flex items-center space-x-2">
                <BookOpen className="h-4 w-4" />
                <span>Cours</span>
              </TabsTrigger>
              <TabsTrigger value="users" className="flex items-center space-x-2">
                <Users className="h-4 w-4" />
                <span>Utilisateurs</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="flex items-center space-x-2">
                <Settings className="h-4 w-4" />
                <span>Paramètres</span>
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle>Bienvenue dans le panneau d'administration</CardTitle>
                  <CardDescription>
                    Vous pouvez maintenant créer et gérer vos propres contenus
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Utilisez les onglets ci-dessus pour naviguer entre les différentes sections d'administration.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Courses Tab */}
            <TabsContent value="courses" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-green-600" />
                    <span>Créer un Nouveau Cours</span>
                  </CardTitle>
                  <CardDescription>
                    Ajoutez du contenu éducatif à votre plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleCourseSubmit} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="title">Titre du cours *</Label>
                      <Input
                        id="title"
                        value={courseForm.title}
                        onChange={(e) => setCourseForm({...courseForm, title: e.target.value})}
                        placeholder="Ex: Introduction à l'IoT"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        value={courseForm.description}
                        onChange={(e) => setCourseForm({...courseForm, description: e.target.value})}
                        placeholder="Décrivez le contenu du cours..."
                        required
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="category">Catégorie *</Label>
                        <Select value={courseForm.category} onValueChange={(value) => setCourseForm({...courseForm, category: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Digitalization">Digitalisation</SelectItem>
                            <SelectItem value="Smart Home">Maison Intelligente</SelectItem>
                            <SelectItem value="Access Control">Contrôle d'Accès</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="level">Niveau</Label>
                        <Select value={courseForm.level} onValueChange={(value) => setCourseForm({...courseForm, level: value})}>
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Débutant">Débutant</SelectItem>
                            <SelectItem value="Intermédiaire">Intermédiaire</SelectItem>
                            <SelectItem value="Avancé">Avancé</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="duration">Durée estimée</Label>
                      <Input
                        id="duration"
                        value={courseForm.duration}
                        onChange={(e) => setCourseForm({...courseForm, duration: e.target.value})}
                        placeholder="Ex: 4 heures"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="videoUrl">URL de la vidéo YouTube</Label>
                      <Input
                        id="videoUrl"
                        value={courseForm.videoUrl}
                        onChange={(e) => setCourseForm({...courseForm, videoUrl: e.target.value})}
                        placeholder="https://youtube.com/watch?v=..."
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pdfUrl">URL du fichier PDF</Label>
                      <Input
                        id="pdfUrl"
                        value={courseForm.pdfUrl}
                        onChange={(e) => setCourseForm({...courseForm, pdfUrl: e.target.value})}
                        placeholder="URL du document à télécharger"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="content">Contenu du cours</Label>
                      <Textarea
                        id="content"
                        value={courseForm.content}
                        onChange={(e) => setCourseForm({...courseForm, content: e.target.value})}
                        placeholder="Rédigez le contenu détaillé du cours..."
                        rows={4}
                      />
                    </div>

                    <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                      <Plus className="h-4 w-4 mr-2" />
                      Créer le cours
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Users Tab */}
            <TabsContent value="users" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Users className="h-5 w-5 text-blue-600" />
                    <span>Gestion des Utilisateurs</span>
                  </CardTitle>
                  <CardDescription>
                    Vue d'ensemble des utilisateurs inscrits sur la plateforme
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Section pour gérer les utilisateurs - à implémenter selon vos besoins.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Settings Tab */}
            <TabsContent value="settings" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="h-5 w-5 text-gray-600" />
                    <span>Paramètres de la Plateforme</span>
                  </CardTitle>
                  <CardDescription>
                    Configuration générale de LMS INVENTION
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Section paramètres - à configurer selon vos préférences.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AdminPanel;
