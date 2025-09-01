import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle, FileText, Video, Link, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { courseServiceEnhanced as courseService, CreateCourseData } from '@/services/courseServiceEnhanced';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface DocumentFile {
  id?: string;
  title: string;
  type: 'file' | 'url';
  file?: File | null;
  url?: string;
  mimeType?: string;
}

interface VideoLink {
  id?: string;
  title: string;
  type: 'file' | 'url' | 'youtube' | 'vimeo';
  url?: string;
  file?: File | null;
  duration?: number;
}

interface Lesson {
  title: string;
  content: string;
  documents: DocumentFile[];
  videos: VideoLink[];
}

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

const CourseCreationWizardEnhanced = () => {
  const { user } = useSupabaseAuth();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);

  // Étape 1: Informations du cours
  const [courseData, setCourseData] = useState<CreateCourseData>({
    title: '',
    description: '',
    category: '',
    level: 'Débutant',
    duration: '',
    instructor: user?.first_name + ' ' + user?.last_name || '',
    instructor_id: user?.id,
    tags: []
  });

  // Étape 2: Structure (modules et leçons)
  const [modules, setModules] = useState<Module[]>([
    {
      title: '',
      description: '',
      lessons: [{ title: '', content: '', documents: [], videos: [] }]
    }
  ]);

  // Fonctions pour gérer les documents
  const addDocument = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].documents.push({
      title: '',
      type: 'url',
      url: ''
    });
    setModules(updated);
  };

  const updateDocument = <K extends keyof DocumentFile>(
    moduleIndex: number,
    lessonIndex: number,
    docIndex: number,
    field: K,
    value: DocumentFile[K]
  ) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].documents[docIndex][field] = value;
    setModules(updated);
  };

  const removeDocument = (moduleIndex: number, lessonIndex: number, docIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].documents.splice(docIndex, 1);
    setModules(updated);
  };

  // Fonctions pour gérer les vidéos
  const addVideo = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].videos.push({
      title: '',
      type: 'url',
      url: ''
    });
    setModules(updated);
  };

  const updateVideo = <K extends keyof VideoLink>(
    moduleIndex: number,
    lessonIndex: number,
    videoIndex: number,
    field: K,
    value: VideoLink[K]
  ) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].videos[videoIndex][field] = value;
    setModules(updated);
  };

  const removeVideo = (moduleIndex: number, lessonIndex: number, videoIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].videos.splice(videoIndex, 1);
    setModules(updated);
  };

  // Fonctions pour gérer les modules
  const addModule = () => {
    setModules([...modules, {
      title: '',
      description: '',
      lessons: [{ title: '', content: '', documents: [], videos: [] }]
    }]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const updateModule = (index: number, field: keyof Module, value: string) => {
    const updated = [...modules];
    if (field === 'lessons') return;
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  // Fonctions pour gérer les leçons
  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons.push({ title: '', content: '', documents: [], videos: [] });
    setModules(updated);
  };

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    if (updated[moduleIndex].lessons.length > 1) {
      updated[moduleIndex].lessons = updated[moduleIndex].lessons.filter((_, i) => i !== lessonIndex);
      setModules(updated);
    }
  };

  const updateLesson = (moduleIndex: number, lessonIndex: number, field: keyof Lesson, value: string) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex] = {
      ...updated[moduleIndex].lessons[lessonIndex],
      [field]: value
    };
    setModules(updated);
  };

  // Fonction pour détecter le type de vidéo à partir de l'URL
  const detectVideoType = (url: string): 'youtube' | 'vimeo' | 'url' => {
    if (url.includes('youtube.com') || url.includes('youtu.be')) {
      return 'youtube';
    } else if (url.includes('vimeo.com')) {
      return 'vimeo';
    }
    return 'url';
  };

  // Fonction pour valider les URLs
  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

// Dans la fonction handleSubmit, remplacez la partie "Préparer les données pour l'API" par :

const handleSubmit = async () => {
  if (!validateForm()) return;

  setIsLoading(true);
  try {
    // Préparer les données pour l'API
    const modulesData = modules.map(module => ({
      title: module.title,
      description: module.description,
      lessons: module.lessons.map((lesson, lessonIndex) => ({
        title: lesson.title,
        content: lesson.content,
        // Associer les documents à chaque leçon
        documents: lesson.documents.map(doc => ({
          title: doc.title,
          file_path: doc.type === 'file' ? `uploads/${doc.file?.name}` : (doc.url || '')
        })),
        // Pour les vidéos, on laisse le service gérer l'ajout du module_id
        videos: lesson.videos.map(video => ({
          title: video.title,
          video_url: video.type !== 'file' ? video.url : `uploads/${video.file?.name}`,
          duration: video.duration,
          module_id: 0 // Cette valeur sera remplacée par le vrai module_id dans le service
        }))
      }))
    }));

    const result = await courseService.createCourseWithStructure(courseData, modulesData);
    
    if (result.success) {
      toast.success('Cours créé avec succès !');
      // Réinitialiser le formulaire
      setCourseData({
        title: '',
        description: '',
        category: '',
        level: 'Débutant',
        duration: '',
        instructor: user?.first_name + ' ' + user?.last_name || '',
        instructor_id: user?.id,
        tags: []
      });
      setModules([{
        title: '',
        description: '',
        lessons: [{ title: '', content: '', documents: [], videos: [] }]
      }]);
      setCurrentStep(1);
    } else {
      toast.error('Erreur lors de la création du cours');
      console.error(result.error);
    }
  } catch (error) {
    toast.error('Erreur lors de la création du cours');
    console.error(error);
  } finally {
    setIsLoading(false);
  }
};

  const validateForm = () => {
    if (!courseData.title || !courseData.description || !courseData.category) {
      toast.error('Veuillez remplir tous les champs obligatoires du cours');
      return false;
    }

    for (let i = 0; i < modules.length; i++) {
      if (!modules[i].title) {
        toast.error(`Veuillez saisir le titre du module ${i + 1}`);
        return false;
      }
      
      for (let j = 0; j < modules[i].lessons.length; j++) {
        if (!modules[i].lessons[j].title) {
          toast.error(`Veuillez saisir le titre de la leçon ${j + 1} du module ${i + 1}`);
          return false;
        }

        // Valider les URLs des documents
        for (let k = 0; k < modules[i].lessons[j].documents.length; k++) {
          const doc = modules[i].lessons[j].documents[k];
          if (doc.type === 'url' && doc.url && !isValidUrl(doc.url)) {
            toast.error(`URL invalide pour le document "${doc.title}" dans la leçon ${j + 1} du module ${i + 1}`);
            return false;
          }
        }

        // Valider les URLs des vidéos
        for (let k = 0; k < modules[i].lessons[j].videos.length; k++) {
          const video = modules[i].lessons[j].videos[k];
          if (video.type !== 'file' && video.url && !isValidUrl(video.url)) {
            toast.error(`URL invalide pour la vidéo "${video.title}" dans la leçon ${j + 1} du module ${i + 1}`);
            return false;
          }
        }
      }
    }

    return true;
  };

  const nextStep = () => {
    if (currentStep === 1) {
      if (!courseData.title || !courseData.description || !courseData.category) {
        toast.error('Veuillez remplir tous les champs obligatoires');
        return;
      }
    }
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Indicateur de progression */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        <div className={`flex items-center space-x-2 ${currentStep >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            1
          </div>
          <span>Informations du cours</span>
        </div>
        <div className="w-12 h-px bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentStep >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            2
          </div>
          <span>Structure du cours</span>
        </div>
        <div className="w-12 h-px bg-gray-300"></div>
        <div className={`flex items-center space-x-2 ${currentStep >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${currentStep >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
            3
          </div>
          <span>Confirmation</span>
        </div>
      </div>

      {/* Étape 1: Informations du cours */}
      {currentStep === 1 && (
        <Card>
          <CardHeader>
            <CardTitle>Informations du cours</CardTitle>
            <CardDescription>
              Définissez les informations de base de votre cours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Titre du cours *</Label>
              <Input
                id="title"
                value={courseData.title}
                onChange={(e) => setCourseData({...courseData, title: e.target.value})}
                placeholder="Ex: Introduction à l'IoT"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                value={courseData.description}
                onChange={(e) => setCourseData({...courseData, description: e.target.value})}
                placeholder="Décrivez le contenu et les objectifs du cours..."
                required
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="category">Catégorie *</Label>
                <Select value={courseData.category} onValueChange={(value) => setCourseData({...courseData, category: value})}>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Digitalization">Digitalisation</SelectItem>
                    <SelectItem value="Smart Home">Maison Intelligente</SelectItem>
                    <SelectItem value="Access Control">Contrôle d'Accès</SelectItem>
                    <SelectItem value="IoT">Internet des Objets</SelectItem>
                    <SelectItem value="Security">Sécurité</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="level">Niveau</Label>
                <Select value={courseData.level} onValueChange={(value: 'Débutant' | 'Intermédiaire' | 'Avancé') => setCourseData({...courseData, level: value})}>
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
                value={courseData.duration}
                onChange={(e) => setCourseData({...courseData, duration: e.target.value})}
                placeholder="Ex: 4 heures, 2 semaines, etc."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructor">Instructeur</Label>
              <Input
                id="instructor"
                value={courseData.instructor}
                onChange={(e) => setCourseData({...courseData, instructor: e.target.value})}
                placeholder="Nom de l'instructeur"
              />
            </div>

            <div className="flex justify-end">
              <Button onClick={nextStep}>
                Suivant <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 2: Structure du cours */}
      {currentStep === 2 && (
        <Card>
          <CardHeader>
            <CardTitle>Structure du cours</CardTitle>
            <CardDescription>
              Organisez votre cours en modules et leçons avec documents et vidéos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {modules.map((module, moduleIndex) => (
              <div key={moduleIndex} className="border rounded-lg p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold">Module {moduleIndex + 1}</h3>
                  {modules.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeModule(moduleIndex)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>

                <div className="space-y-2">
                  <Label>Titre du module *</Label>
                  <Input
                    value={module.title}
                    onChange={(e) => updateModule(moduleIndex, 'title', e.target.value)}
                    placeholder="Ex: Introduction aux concepts de base"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Description du module</Label>
                  <Textarea
                    value={module.description}
                    onChange={(e) => updateModule(moduleIndex, 'description', e.target.value)}
                    placeholder="Décrivez le contenu de ce module..."
                    rows={2}
                  />
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">Leçons</h4>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => addLesson(moduleIndex)}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Ajouter une leçon
                    </Button>
                  </div>
                  
                  {module.lessons.map((lesson, lessonIndex) => (
                    <div key={lessonIndex} className="bg-gray-50 p-4 rounded space-y-4">
                      <div className="flex items-center justify-between">
                        <Label className="text-base font-medium">Leçon {lessonIndex + 1}</Label>
                        {module.lessons.length > 1 && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLesson(moduleIndex, lessonIndex)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        )}
                      </div>

                      <Input
                        value={lesson.title}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'title', e.target.value)}
                        placeholder="Titre de la leçon"
                      />

                      <Textarea
                        value={lesson.content}
                        onChange={(e) => updateLesson(moduleIndex, lessonIndex, 'content', e.target.value)}
                        placeholder="Contenu de la leçon..."
                        rows={3}
                      />

                      {/* Documents */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Documents
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addDocument(moduleIndex, lessonIndex)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                        
                        {lesson.documents.map((doc, docIndex) => (
                          <div key={docIndex} className="border rounded p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <Input
                                placeholder="Titre du document"
                                value={doc.title}
                                onChange={(e) => updateDocument(moduleIndex, lessonIndex, docIndex, 'title', e.target.value)}
                                className="flex-1 mr-2"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeDocument(moduleIndex, lessonIndex, docIndex)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <Tabs 
                              value={doc.type} 
                              onValueChange={(value: 'file' | 'url') => updateDocument(moduleIndex, lessonIndex, docIndex, 'type', value)}
                            >
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="url" className="flex items-center gap-2">
                                  <Link className="h-3 w-3" />
                                  Lien
                                </TabsTrigger>
                                <TabsTrigger value="file" className="flex items-center gap-2">
                                  <Upload className="h-3 w-3" />
                                  Upload
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="url" className="space-y-2">
                                <Input
                                  type="url"
                                  placeholder="https://example.com/document.pdf"
                                  value={doc.url || ''}
                                  onChange={(e) => updateDocument(moduleIndex, lessonIndex, docIndex, 'url', e.target.value)}
                                />
                                <p className="text-xs text-gray-500">
                                  Formats supportés: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
                                </p>
                              </TabsContent>
                              
                              <TabsContent value="file" className="space-y-2">
                                <Input
                                  type="file"
                                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    updateDocument(moduleIndex, lessonIndex, docIndex, 'file', file);
                                  }}
                                />
                                <p className="text-xs text-gray-500">
                                  Formats supportés: PDF, Word (.doc, .docx), Excel (.xls, .xlsx)
                                </p>
                              </TabsContent>
                            </Tabs>
                          </div>
                        ))}
                      </div>

                      {/* Vidéos */}
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label className="flex items-center gap-2">
                            <Video className="h-4 w-4" />
                            Vidéos
                          </Label>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addVideo(moduleIndex, lessonIndex)}
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Ajouter
                          </Button>
                        </div>
                        
                        {lesson.videos.map((video, videoIndex) => (
                          <div key={videoIndex} className="border rounded p-3 space-y-3">
                            <div className="flex items-center justify-between">
                              <Input
                                placeholder="Titre de la vidéo"
                                value={video.title}
                                onChange={(e) => updateVideo(moduleIndex, lessonIndex, videoIndex, 'title', e.target.value)}
                                className="flex-1 mr-2"
                              />
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => removeVideo(moduleIndex, lessonIndex, videoIndex)}
                                className="text-red-600"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                            
                            <Tabs 
                              value={video.type === 'file' ? 'file' : 'url'}
                              onValueChange={(value: 'file' | 'url') => {
                                updateVideo(moduleIndex, lessonIndex, videoIndex, 'type', value);
                                if (value === 'url' && video.url) {
                                  const detectedType = detectVideoType(video.url);
                                  updateVideo(moduleIndex, lessonIndex, videoIndex, 'type', detectedType);
                                }
                              }}
                            >
                              <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="url" className="flex items-center gap-2">
                                  <Link className="h-3 w-3" />
                                  Lien
                                </TabsTrigger>
                                <TabsTrigger value="file" className="flex items-center gap-2">
                                  <Upload className="h-3 w-3" />
                                  Upload
                                </TabsTrigger>
                              </TabsList>
                              
                              <TabsContent value="url" className="space-y-2">
                                <Input
                                  type="url"
                                  placeholder="https://youtube.com/watch?v=... ou https://vimeo.com/..."
                                  value={video.url || ''}
                                  onChange={(e) => {
                                    const url = e.target.value;
                                    updateVideo(moduleIndex, lessonIndex, videoIndex, 'url', url);
                                    if (url) {
                                      const detectedType = detectVideoType(url);
                                      updateVideo(moduleIndex, lessonIndex, videoIndex, 'type', detectedType);
                                    }
                                  }}
                                />
                                <p className="text-xs text-gray-500">
                                  Formats supportés: YouTube, Vimeo, ou liens directs vers des vidéos
                                </p>
                                {video.type === 'youtube' && (
                                  <Badge variant="secondary" className="text-xs">
                                    YouTube détecté
                                  </Badge>
                                )}
                                {video.type === 'vimeo' && (
                                  <Badge variant="secondary" className="text-xs">
                                    Vimeo détecté
                                  </Badge>
                                )}
                              </TabsContent>
                              
                              <TabsContent value="file" className="space-y-2">
                                <Input
                                  type="file"
                                  accept="video/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0] || null;
                                    updateVideo(moduleIndex, lessonIndex, videoIndex, 'file', file);
                                  }}
                                />
                                <p className="text-xs text-gray-500">
                                  Formats supportés: MP4, AVI, MOV, WMV, etc.
                                </p>
                              </TabsContent>
                            </Tabs>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            <Button
              variant="outline"
              onClick={addModule}
              className="w-full"
            >
              <Plus className="h-4 w-4 mr-2" />
              Ajouter un module
            </Button>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Précédent
              </Button>
              <Button onClick={nextStep}>
                Suivant <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Étape 3: Confirmation */}
      {currentStep === 3 && (
        <Card>
          <CardHeader>
            <CardTitle>Confirmation</CardTitle>
            <CardDescription>
              Vérifiez les informations avant de créer le cours
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{courseData.title}</h3>
                <p className="text-gray-600">{courseData.description}</p>
                <div className="flex gap-2 mt-2">
                  <Badge variant="secondary">{courseData.category}</Badge>
                  <Badge variant="outline">{courseData.level}</Badge>
                  {courseData.duration && <Badge variant="outline">{courseData.duration}</Badge>}
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-2">Structure du cours :</h4>
                <ul className="space-y-2">
                  {modules.map((module, moduleIndex) => (
                    <li key={moduleIndex} className="border-l-2 border-blue-200 pl-4">
                      <div className="font-medium">{moduleIndex + 1}. {module.title}</div>
                      <ul className="ml-4 mt-1 space-y-1">
                        {module.lessons.map((lesson, lessonIndex) => (
                          <li key={lessonIndex} className="text-sm text-gray-600">
                            <div>{moduleIndex + 1}.{lessonIndex + 1} {lesson.title}</div>
                            {lesson.documents.length > 0 && (
                              <div className="ml-4 text-xs text-blue-600">
                                📄 {lesson.documents.length} document(s)
                              </div>
                            )}
                            {lesson.videos.length > 0 && (
                              <div className="ml-4 text-xs text-green-600">
                                🎥 {lesson.videos.length} vidéo(s)
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="flex justify-between">
              <Button variant="outline" onClick={prevStep}>
                <ArrowLeft className="h-4 w-4 mr-2" /> Précédent
              </Button>
              <Button 
                onClick={handleSubmit} 
                disabled={isLoading}
                className="bg-green-600 hover:bg-green-700"
              >
                {isLoading ? (
                  <>Création en cours...</>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Créer le cours
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CourseCreationWizardEnhanced;

