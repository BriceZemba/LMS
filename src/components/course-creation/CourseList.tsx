
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  BookOpen, 
  Users, 
  Clock, 
  Search, 
  Filter,
  Eye,
  Edit,
  Trash2,
  CheckCircle,
  XCircle
} from 'lucide-react';
import { courseServiceEnhanced as courseService } from '@/services/courseServiceEnhanced';
import { toast } from 'sonner';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface Course {
  id: number;
  title: string;
  description: string;
  category: string;
  level: string;
  duration: string;
  instructor: string;
  published: boolean;
  enrolled_students: number;
  completion_rate: number;
  created_at: string;
  updated_at: string;
}


const CourseList = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [deleteTarget, setDeleteTarget] = useState<number | null>(null);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    setLoading(true);
    try {
      const result = await courseService.getAllCourses();
      if (result.success) {
        setCourses(result.data || []);
      } else {
        toast.error('Erreur lors du chargement des cours');
      }
    } catch (error) {
      console.error('Error loading courses:', error);
      toast.error('Erreur lors du chargement des cours');
    } finally {
      setLoading(false);
    }
  };

  

  const handlePublishCourse = async (courseId: number) => {
    try {
      const result = await courseService.publishCourse(courseId);
      if (result.success) {
        toast.success('Cours publié avec succès');
        loadCourses(); // Recharger la liste
      } else {
        toast.error('Erreur lors de la publication du cours');
      }
    } catch (error) {
      console.error('Error publishing course:', error);
      toast.error('Erreur lors de la publication du cours');
    }
  };

    const handleDelete = async () => {
    if (!deleteTarget) return;
    const res = await courseService.deleteCourse(deleteTarget);
    if (res.success) {
      toast.success('Cours supprimé');
      loadCourses();
    } else {
      toast.error(res.error?.message || 'Erreur suppression');
    }
    setDeleteTarget(null);
  };


  const filteredCourses = courses.filter(course => {
    const matchesSearch = course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         course.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || course.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'published' && course.published) ||
                         (statusFilter === 'draft' && !course.published);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Rechercher un cours..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="Catégorie" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Toutes les catégories</SelectItem>
                <SelectItem value="Digitalization">Digitalisation</SelectItem>
                <SelectItem value="Smart Home">Maison Intelligente</SelectItem>
                <SelectItem value="Access Control">Contrôle d'Accès</SelectItem>
                <SelectItem value="IoT">Internet des Objets</SelectItem>
                <SelectItem value="Security">Sécurité</SelectItem>
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-32">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="published">Publiés</SelectItem>
                <SelectItem value="draft">Brouillons</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Liste des cours */}
      <div className="grid gap-4">
        {filteredCourses.length === 0 ? (
          <Card>
            <CardContent className="p-8 text-center">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Aucun cours trouvé
              </h3>
              <p className="text-gray-600">
                {courses.length === 0 
                  ? "Vous n'avez pas encore créé de cours."
                  : "Aucun cours ne correspond à vos critères de recherche."
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredCourses.map((course) => (
            <Card key={course.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-semibold">{course.title}</h3>
                      {course.published ? (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      ) : (
                        <XCircle className="h-5 w-5 text-gray-400" />
                      )}
                    </div>
                    
                    <p className="text-gray-600 mb-3 line-clamp-2">
                      {course.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-3">
                      <Badge variant="secondary">{course.category}</Badge>
                      <Badge variant="outline">{course.level}</Badge>
                      {course.duration && (
                        <Badge variant="outline" className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.duration}
                        </Badge>
                      )}
                      <Badge variant="outline" className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {course.enrolled_students} inscrits
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-gray-500">
                      Instructeur: {course.instructor} • 
                      Créé le {new Date(course.created_at).toLocaleDateString('fr-FR')}
                    </div>
                  </div>
                  
                  <div className="flex flex-col md:flex-row gap-2 mt-4 md:mt-0 md:ml-4">
                    <Button variant="outline" size="sm" onClick={() => window.open(`/course/${course.id}`, '_blank')}>
                      <Eye className="h-4 w-4 mr-1" />
                      Voir
                    </Button>
                    
                    <Button variant="outline" size="sm" onClick={() => window.location.href = `/course/edit/${course.id}`}>
                      <Edit className="h-4 w-4 mr-1" />
                      Modifier
                    </Button>
                    
                    {!course.published && (
                      <Button 
                        size="sm" 
                        onClick={() => handlePublishCourse(course.id)}
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <CheckCircle className="h-4 w-4 mr-1" />
                        Publier
                      </Button>
                    )}
                    
          {/* Bouton Supprimer */}
          <Button
            variant="outline"
            size="sm"
            className="text-red-600"
            onClick={() => setDeleteTarget(course.id)}
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Supprimer
          </Button>

          {/* Confirmation */}
          <AlertDialog open={!!deleteTarget} onOpenChange={() => setDeleteTarget(null)}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
                <AlertDialogDescription>
                  Cette action est irréversible. Le cours et toutes ses données seront définitivement supprimés.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Annuler</AlertDialogCancel>
                <AlertDialogAction onClick={handleDelete} className="bg-red-600 hover:bg-red-700">
                  Supprimer
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseList;
