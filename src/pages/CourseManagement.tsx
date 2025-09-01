
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, BookOpen, List } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import CourseCreationWizardEnhanced from '@/components/course-creation/CourseCreationWizardEnhanced';
import CourseList from '@/components/course-creation/CourseList';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';
import { useNavigate } from 'react-router-dom';

const CourseManagement = () => {
  const { user, isAdmin, isFormateur } = useSupabaseAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('list');

  // Vérification des droits d'accès
  if (!user || !isAdmin() && !isFormateur()) {
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
                Gestion des Cours
              </h1>
              <p className="text-lg text-gray-600">
                Créez et gérez vos cours avec modules, leçons et contenus
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <BookOpen className="h-6 w-6 text-gray-600" />
              <span className="text-sm text-gray-600">Plateforme LMS</span>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2 bg-white rounded-xl shadow-lg">
              <TabsTrigger value="list" className="flex items-center space-x-2">
                <List className="h-4 w-4" />
                <span>Mes Cours</span>
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center space-x-2">
                <Plus className="h-4 w-4" />
                <span>Créer un Cours</span>
              </TabsTrigger>
            </TabsList>

            {/* Liste des cours */}
            <TabsContent value="list" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <List className="h-5 w-5 text-blue-600" />
                    <span>Mes Cours</span>
                  </CardTitle>
                  <CardDescription>
                    Gérez tous vos cours créés
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CourseList />
                </CardContent>
              </Card>
            </TabsContent>

            {/* Création de cours */}
            <TabsContent value="create" className="space-y-6">
              <Card className="border-0 shadow-lg">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Plus className="h-5 w-5 text-green-600" />
                    <span>Créer un Nouveau Cours</span>
                  </CardTitle>
                  <CardDescription>
                    Utilisez l'assistant pour créer un cours structuré avec modules et leçons
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <CourseCreationWizardEnhanced />
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

export default CourseManagement;