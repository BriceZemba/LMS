
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Plus, Trash2, ArrowLeft, ArrowRight, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';
import { courseService, CreateCourseData } from '@/services/courseService';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

interface Module {
  title: string;
  description: string;
  lessons: Lesson[];
}

// Partie modifier
interface DocumentFile {
  id?: string;
  title: string;
  file: File | null; // PDF, Word, Excel
}

interface VideoLink {
  id?: string;
  url: string; // lien YouTube, Vimeo, ...
}

interface Lesson {
  title: string;
  content: string;
  documents: DocumentFile[];
  videos: VideoLink[];
}


const CourseCreationWizard = () => {
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
      lessons: [{ title: '', content: '', documents: [], videos: [] }] // Modifier pour inclure documents et vidéos
    }
  ]);

  const removeDocument = (moduleIndex: number, lessonIndex: number, docIndex: number) => {
  const updatedModules = [...modules];
  updatedModules[moduleIndex].lessons[lessonIndex].documents.splice(docIndex, 1);
  setModules(updatedModules);
};

const removeVideo = (moduleIndex: number, lessonIndex: number, videoIndex: number) => {
  const updatedModules = [...modules];
  updatedModules[moduleIndex].lessons[lessonIndex].videos.splice(videoIndex, 1);
  setModules(updatedModules);
};


    // fonction pour documents et video
    const addDocument = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].documents.push({
      title: '',
      file: null,
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

  const addVideo = (moduleIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].videos.push({ url: '' });
    setModules(updated);
  };

  const updateVideo = (
    moduleIndex: number,
    lessonIndex: number,
    videoIndex: number,
    url: string
  ) => {
    const updated = [...modules];
    updated[moduleIndex].lessons[lessonIndex].videos[videoIndex].url = url;
    setModules(updated);
  };


  const addModule = () => {
    setModules([...modules, {
      title: '',
      description: '',
      lessons: [{ title: '', content: '' , documents: [], videos: []}] //Modifier pour inclure documents et vidéos
    }]);
  };

  const removeModule = (index: number) => {
    if (modules.length > 1) {
      setModules(modules.filter((_, i) => i !== index));
    }
  };

  const updateModule = (index: number, field: keyof Module, value: string) => {
    const updated = [...modules];
    if (field === 'lessons') return; // Les leçons sont gérées séparément
    updated[index] = { ...updated[index], [field]: value };
    setModules(updated);
  };

  const addLesson = (moduleIndex: number) => {
    const updated = [...modules];
    updated[moduleIndex].lessons.push({ title: '', content: '' , documents: [], videos: [] }); // Modifier pour inclure documents et vidéos
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

  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsLoading(true);
    try {
      const result = await courseService.createCourseWithStructure(courseData, modules);
      
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
          lessons: [{ title: '', content: '' , documents: [], videos: [] }] // Modifier pour inclure documents et vidéos
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
              Organisez votre cours en modules et leçons
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
  <div key={lessonIndex} className="bg-gray-50 p-3 rounded space-y-4">
    <div className="flex items-center justify-between">
      <Label>Leçon {lessonIndex + 1}</Label>
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
    <div className="space-y-2">
      <Label>Documents</Label>
      {lesson.documents.map((doc, docIndex) => (
        <div key={docIndex} className="flex items-center space-x-2">
          <Input
            type="text"
            placeholder="Titre du document"
            value={doc.title}
            onChange={(e) =>
              updateDocument(moduleIndex, lessonIndex, docIndex, 'title', e.target.value)
            }
          />
          <Input
            type="file"
            accept=".pdf,.doc,.docx,.xls,.xlsx"
            onChange={(e) => {
              const file = e.target.files?.[0] || null;
              updateDocument(moduleIndex, lessonIndex, docIndex, 'file', file);
            }}
          />
          <Button
            variant="ghost"
            size="icon"
            className="text-red-600"
            onClick={() => removeDocument(moduleIndex, lessonIndex, docIndex)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      ))}
      <Button
        variant="outline"
        size="sm"
        onClick={() => addDocument(moduleIndex, lessonIndex)}
      >
        + Ajouter un document
      </Button>
    </div>

    {/* Vidéos */}
{/* Vidéos */}
<div className="space-y-2">
  <Label>Vidéos</Label>
  {lesson.videos.map((videoUrl, videoIndex) => (
    <div key={videoIndex} className="flex items-center space-x-2">
      <Input
        type="url"
        placeholder="Lien vers la vidéo (YouTube, Vimeo...)"
        value={typeof videoUrl === 'string' ? videoUrl : videoUrl.url}
        onChange={(e) =>
          updateVideo(moduleIndex, lessonIndex, videoIndex, e.target.value)
        }
      />
      <Button
        variant="ghost"
        size="icon"
        className="text-red-600"
        onClick={() => removeVideo(moduleIndex, lessonIndex, videoIndex)}
      >
        <Trash2 className="h-4 w-4" />
      </Button>
    </div>
  ))}
  <Button
    variant="outline"
    size="sm"
    onClick={() => addVideo(moduleIndex, lessonIndex)}
  >
    + Ajouter une vidéo
  </Button>
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
                            {moduleIndex + 1}.{lessonIndex + 1} {lesson.title}
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

export default CourseCreationWizard;
