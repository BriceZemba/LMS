
import React, { useState } from 'react';
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
  Users
} from 'lucide-react';
import ContentRenderer from './ContentRenderer';
import { toast } from 'sonner';

interface CourseViewerProps {
  course: Course;
  userProgress?: any[];
  onContentComplete?: (contentId: string) => void;
  onModuleComplete?: (moduleId: string) => void;
}

const CourseViewer: React.FC<CourseViewerProps> = ({
  course,
  userProgress = [],
  onContentComplete,
  onModuleComplete
}) => {
  const [selectedModule, setSelectedModule] = useState<Module | null>(null);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [expandedModules, setExpandedModules] = useState<Set<string>>(new Set([course.modules[0]?.id]));

  const toggleModule = (moduleId: string) => {
    setExpandedModules(prev => {
      const newSet = new Set(prev);
      if (newSet.has(moduleId)) {
        newSet.delete(moduleId);
      } else {
        newSet.add(moduleId);
      }
      return newSet;
    });
  };

  const selectContent = (module: Module, content: ContentItem) => {
    setSelectedModule(module);
    setSelectedContent(content);
  };

  const handleContentComplete = (contentId: string) => {
    onContentComplete?.(contentId);
    toast.success('Contenu terminé !');
  };

  const handleDownload = (contentId: string, title: string) => {
    // Simuler le téléchargement
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${title}.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const calculateModuleProgress = (module: Module) => {
    // Simuler le calcul de progression
    return Math.floor(Math.random() * 100);
  };

  const calculateCourseProgress = () => {
    const totalModules = course.modules.length;
    const completedModules = course.modules.filter(m => calculateModuleProgress(m) === 100).length;
    return Math.round((completedModules / totalModules) * 100);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar - Liste des modules */}
      <div className="w-1/3 bg-white border-r border-gray-200 overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
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
              <span>{course.enrolledStudents} étudiant(s)</span>
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
                            <div className="w-4 h-4 rounded border border-purple-300 flex items-center justify-center">
                              <span className="text-xs text-purple-600">Q</span>
                            </div>
                            <div className="text-left">
                              <p className="font-medium text-gray-900">{module.quiz.title}</p>
                              <p className="text-xs text-gray-500">Quiz</p>
                            </div>
                          </div>
                        </Button>
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
              onDownload={handleDownload}
            />
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
              </p>
              <Button
                onClick={() => {
                  if (course.modules[0]?.contents[0]) {
                    selectContent(course.modules[0], course.modules[0].contents[0]);
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

export default CourseViewer;
