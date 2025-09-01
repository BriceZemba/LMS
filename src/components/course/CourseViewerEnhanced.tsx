import React, { useState, useEffect } from 'react';
import { Course, Module, ContentItem } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  BookOpen, 
  ChevronDown, 
  ChevronRight, 
  Play, 
  CheckCircle,
  Lock,
  Clock,
  Users,
  FileText,
  Video,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import ContentRenderer from './ContentRenderer';
import VideoContentEnhanced from './VideoContentEnhanced';
import DocumentContentEnhanced from './DocumentContentEnhanced';
import QuizContentEnhanced from './QuizContentEnhanced';
import { courseServiceEnhanced } from '@/services/courseServiceEnhanced';
import { toast } from 'sonner';

interface CourseViewerEnhancedProps {
  course: Course;
  userProgress?: any[];
  onContentComplete?: (contentId: string) => void;
  onModuleComplete?: (moduleId: string) => void;
}

interface ModuleResource {
  documents: Array<{
    id: string;
    title: string;
    document_type: 'file' | 'url';
    file_path?: string;
    url?: string;
    file_size?: number;
    mime_type?: string;
  }>;
  videos: Array<{
    id: string;
    title: string;
    video_type: 'file' | 'url' | 'youtube' | 'vimeo';
    url?: string;
    file_path?: string;
    duration?: number;
    thumbnail_url?: string;
  }>;
  quizzes: Array<{
    id: string;
    title: string;
    // description: string;
  }>;
}

const CourseViewerEnhanced: React.FC<CourseViewerEnhancedProps> = ({
  course,
  userProgress = [],
  onContentComplete,
  onModuleComplete
}) => {
  const navigate = useNavigate();
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [selectedResource, setSelectedResource] = useState<any>(null);
  const [resourceType, setResourceType] = useState<'document' | 'video' | 'quiz' | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([course.modules[0]?.id]));
  const [moduleResources, setModuleResources] = useState<{ [moduleId: string]: ModuleResource }>({});
  const [loading, setLoading] = useState(false);

  // Charger les ressources d'un module
const loadModuleResources = async (moduleId: string) => {
  setLoading(true);
  try {
    const result = await courseServiceEnhanced.getModuleResources(parseInt(moduleId));
    if (result.success) {
      const mappedData: ModuleResource = {
        documents: result.data.documents.map(doc => ({
          id: doc.id.toString(),
          title: doc.title || '',
          document_type: 'file',
          file_path: doc.file_path
        })),
        videos: result.data.videos.map(video => ({
          id: video.id.toString(),
          title: video.title || '',
          video_type: 'url',
          url: video.video_url,
          duration: video.duration || 0
        })),
        quizzes: result.data.quizzes.map(quiz => ({
          id: quiz.id.toString(),
          title: quiz.title || ''
          // description: quiz.description || '',
        })),

      };

      console.log('Resulte quizzes:', mappedData.quizzes);
      setModuleResources(prev => ({
          ...prev,
          [moduleId]: mappedData
      }));
    } else {
      toast.error(result.error?.message || 'Erreur lors du chargement des ressources');
    }
  } catch (error) {
    console.error('Error loading module resources:', error);
    toast.error('Erreur lors du chargement des ressources');
  } finally {
    setLoading(false);
  }
};

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
        // Charger les ressources quand on ouvre un module
        loadModuleResources(moduleId);
      }
      return newSet;
    });
  };

  

  const selectContent = (module: Module, content: ContentItem) => {
    setSelectedModule(module);
    setSelectedContent(content);
    setSelectedResource(null);
    setResourceType(null);
  };

  const selectResource = (resource: any, type: 'document' | 'video' | 'quiz') => {
    setSelectedContent(null);
    setSelectedResource(resource);
    setResourceType(type);
  };

  const handleContentComplete = (contentId: string) => {
    onContentComplete?.(contentId);
    toast.success('Contenu terminé !');
  };

  const handleResourceComplete = (resourceId: string) => {
    toast.success('Ressource consultée avec succès !');
  };

const calculateModuleProgress = (module: Module) => {
  // 1. Liste des éléments comptabilisés
  const items = [
    ...(module.contents || []),               // leçons
    ...(moduleResources[module.id]?.videos || []),
    ...(moduleResources[module.id]?.documents || []),
    ...(moduleResources[module.id]?.quizzes || []),  // Quiz des ressources
    ...(module.quiz ? [module.quiz] : []),    // Quiz du module
  ];

  if (!items.length) return 0;

  // 2. Éléments marqués comme terminés
  const completed = items.filter((item) => {
    if (item.id && userProgress) {
      return userProgress.find((p) => p.item_id === item.id)?.completed;
    }
    return false;
  });

  return Math.round((completed.length / items.length) * 100);
};

const calculateCourseProgress = () => {
  let totalItems = 0;
  let completedItems = 0;

  course.modules.forEach((mod) => {
    const modProgress = calculateModuleProgress(mod); // 0-100
    const itemsInModule = 
      (mod.contents?.length || 0) +
      (moduleResources[mod.id]?.videos?.length || 0) +
      (moduleResources[mod.id]?.documents?.length || 0) +
      (moduleResources[mod.id]?.quizzes?.length || 0) +  // Ajout des quiz des ressources
      (mod.quiz ? 1 : 0);

    totalItems += itemsInModule;
    completedItems += (modProgress / 100) * itemsInModule;
  });

  return totalItems ? Math.round((completedItems / totalItems) * 100) : 0;
};

  const goBack = () => {
    navigate(`/courses`);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Liste des modules */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <Button
            variant="ghost"
            onClick={goBack}
            className="mb-4 p-0 h-auto"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au cours
          </Button>
          
          <h1 className="text-xl font-bold text-gray-900 mb-2">{course.title}</h1>
          <p className="text-gray-600 text-sm mb-4">{course.description}</p>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Progression du cours</span>
              <span className="text-gray-600">{calculateCourseProgress()}%</span>
            </div>
            <Progress value={calculateCourseProgress()} className="h-2" />
          </div>

          <div className="flex items-center space-x-4 mt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center space-x-1">
              <Users className="h-4 w-4" />
              <span>{course.enrolledStudents} étudiants</span>
            </div>
          </div>
        </div>

        <div className="p-4">
          <h3 className="font-semibold text-gray-900 mb-4">Modules du cours</h3>
          <div className="space-y-2">
            {course.modules.map((module, moduleIndex) => {
              const isExpanded = expandedModules.has(module.id);
              const moduleProgress = calculateModuleProgress(module);
              const isLocked = moduleIndex > 0 && calculateModuleProgress(course.modules[moduleIndex - 1]) < 100;
              const resources = moduleResources[module.id];

              return (
                <div key={module.id} className="border border-gray-200 rounded-lg">
                  <Button
                    variant="ghost"
                    className="w-full justify-between p-4 h-auto"
                    onClick={() => !isLocked && toggleModule(module.id)}
                    disabled={isLocked}
                  >
                    <div className="flex items-center space-x-3 text-left flex-1">
                      {isLocked ? (
                        <Lock className="h-5 w-5 text-gray-400" />
                      ) : (
                        <div className="w-5 h-5 rounded-full border-2 border-blue-600 flex items-center justify-center">
                          {moduleProgress === 100 ? (
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          ) : (
                            <span className="text-xs font-bold text-blue-600">{moduleIndex + 1}</span>
                          )}
                        </div>
                      )}
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{module.title}</h4>
                        <p className="text-sm text-gray-600">{module.description}</p>
                        <div className="mt-2">
                          <Progress value={moduleProgress} className="h-1" />
                        </div>
                      </div>
                    </div>
                    {!isLocked && (
                      isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                    )}
                  </Button>



                    {isExpanded && !isLocked && (
                      <div className="px-4 pb-4 space-y-2">
                        {/* Leçons */}
                        {module.contents.map((content, contentIndex) => (
                          <Button
                            key={content.id}
                            variant="ghost"
                            className="w-full justify-start p-3 h-auto"
                            onClick={() => selectContent(module, content)}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center">
                                <span className="text-xs">{contentIndex + 1}</span>
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{content.title}</p>
                                <p className="text-xs text-gray-500">{content.type}</p>
                              </div>
                            </div>
                          </Button>
                        ))}

                        {/* Documents */}
                        {resources?.documents.map((document, docIndex) => (
                          <Button
                            key={`doc-${document.id}`}
                            variant="ghost"
                            className="w-full justify-start p-3 h-auto"
                            onClick={() => selectResource(document, 'document')}
                          >
                            <div className="flex items-center space-x-3">
                              <FileText className="h-4 w-4 text-blue-600" />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{document.title}</p>
                                <p className="text-xs text-gray-500">
                                  Document {document.document_type === 'url' ? '(lien)' : '(fichier)'}
                                </p>
                              </div>
                            </div>
                          </Button>
                        ))}

                        {/* Vidéos */}
                        {resources?.videos.map((video, videoIndex) => (
                          <Button
                            key={`video-${video.id}`}
                            variant="ghost"
                            className="w-full justify-start p-3 h-auto"
                            onClick={() => selectResource(video, 'video')}
                          >
                            <div className="flex items-center space-x-3">
                              <Video className="h-4 w-4 text-red-600" />
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{video.title}</p>
                                <p className="text-xs text-gray-500">
                                  Vidéo {video.video_type}
                                  {video.duration && ` (${Math.floor(video.duration / 60)}:${(video.duration % 60).toString().padStart(2, '0')})`}
                                </p>
                              </div>
                            </div>
                          </Button>
                        ))}

                        {/* Quiz provenant des ressources */}
                        {resources?.quizzes && resources.quizzes.map((quiz, quizIndex) => (
                          <Button
                            key={`quiz-${quiz.id}`}
                            variant="ghost"
                            className="w-full justify-start p-3 h-auto"
                            onClick={() => selectResource(quiz, 'quiz')}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded border border-purple-300 flex items-center justify-center">
                                <span className="text-xs text-purple-600">Q</span>
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{quiz.title}</p>
                                <p className="text-xs text-gray-500">Quiz</p>
                              </div>
                            </div>
                          </Button>
                        ))}

                        {/* Quiz du module (si différent des quiz dans les ressources) */}
                        {module.quiz && (
                          <Button
                            variant="ghost"
                            className="w-full justify-start p-3 h-auto"
                            onClick={() => selectContent(module, {
                              id: module.quiz!.id,
                              type: 'quiz',
                              title: module.quiz!.title,
                              content: '',
                              description: module.quiz!.description
                            })}
                          >
                            <div className="flex items-center space-x-3">
                              <div className="w-4 h-4 rounded border border-green-300 flex items-center justify-center">
                                <span className="text-xs text-green-600">MQ</span>
                              </div>
                              <div className="text-left">
                                <p className="font-medium text-gray-900">{module.quiz.title}</p>
                                <p className="text-xs text-gray-500">Quiz du module</p>
                              </div>
                            </div>
                          </Button>
                        )}

                        {loading && (
                          <div className="text-center py-2">
                            <div className="text-sm text-gray-500">Chargement des ressources...</div>
                          </div>
                        )}
                      </div>
                    )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto">
        {selectedContent ? (
          <div className="p-6">
            <ContentRenderer
              content={selectedContent}
              onComplete={handleContentComplete}
            />
          </div>
        ) : selectedResource && resourceType ? (
          <div className="p-6">
            {resourceType === 'document' ? (
              <DocumentContentEnhanced
                document={selectedResource}
                onComplete={handleResourceComplete}
              />
            ) : resourceType === 'video' ? (
              <VideoContentEnhanced
                video={selectedResource}
                onComplete={handleResourceComplete}  
              />
            ) : resourceType === 'quiz' ? (
                  <QuizContentEnhanced content={selectedResource} onComplete={handleResourceComplete}
                  />
            ) : null
            }
          </div>
        ) : (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <BookOpen className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                Bienvenue dans {course.title}
              </h3>
              <p className="text-gray-600 mb-6 max-w-md">
                Sélectionnez un module dans la barre latérale pour commencer votre apprentissage.
                Vous trouverez des leçons, des documents et des vidéos pour chaque module.
              </p>
              <Button
                onClick={() => {
                  if (course.modules[0]) {
                    toggleModule(course.modules[0].id);
                    if (course.modules[0].contents[0]) {
                      selectContent(course.modules[0], course.modules[0].contents[0]);
                    }
                  }
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Play className="h-4 w-4 mr-2" />
                Commencer le cours
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CourseViewerEnhanced;

