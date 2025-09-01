
import React, { useState } from 'react';
import { ContentItem } from '@/types/course';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Monitor, Play, RotateCcw, Check } from 'lucide-react';

interface SimulationContentProps {
  content: ContentItem;
  onComplete?: (contentId: string) => void;
}

const SimulationContent: React.FC<SimulationContentProps> = ({ content, onComplete }) => {
  const [isCompleted, setIsCompleted] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [simulationProgress, setSimulationProgress] = useState(0);

  const startSimulation = () => {
    setIsRunning(true);
    setSimulationProgress(0);
    
    // Simuler une progression
    const interval = setInterval(() => {
      setSimulationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsRunning(false);
          setIsCompleted(true);
          onComplete?.(content.id);
          return 100;
        }
        return prev + 10;
      });
    }, 1000);
  };

  const resetSimulation = () => {
    setIsRunning(false);
    setSimulationProgress(0);
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Monitor className="h-5 w-5 text-green-600" />
          <span>{content.title}</span>
          {isCompleted && <Check className="h-5 w-5 text-green-600" />}
        </CardTitle>
        {content.description && (
          <p className="text-gray-600">{content.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="aspect-video w-full bg-gray-900 rounded-lg flex items-center justify-center relative overflow-hidden">
          {isRunning ? (
            <div className="text-center text-white">
              <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-400 border-t-transparent mx-auto mb-4"></div>
              <p className="text-lg font-medium">Simulation en cours...</p>
              <p className="text-sm opacity-75">Progression : {simulationProgress}%</p>
              <div className="w-64 bg-gray-700 rounded-full h-2 mt-4 mx-auto">
                <div
                  className="bg-green-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${simulationProgress}%` }}
                />
              </div>
            </div>
          ) : (
            <div className="text-center text-white">
              <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Simulation Interactive</h3>
              <p className="text-gray-300 mb-4">
                Cliquez sur "Démarrer" pour lancer la simulation
              </p>
              <p className="text-sm text-gray-400">
                {content.content}
              </p>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Progression</span>
            <span className="text-gray-600">{simulationProgress}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${simulationProgress}%` }}
            />
          </div>
        </div>

        <div className="flex items-center justify-between pt-4 border-t">
          <div className="flex items-center space-x-2">
            <Button
              onClick={startSimulation}
              disabled={isRunning}
              className="bg-green-600 hover:bg-green-700 flex items-center space-x-2"
            >
              <Play className="h-4 w-4" />
              <span>{isRunning ? 'En cours...' : 'Démarrer'}</span>
            </Button>
            
            <Button
              variant="outline"
              onClick={resetSimulation}
              disabled={isRunning}
              className="flex items-center space-x-2"
            >
              <RotateCcw className="h-4 w-4" />
              <span>Réinitialiser</span>
            </Button>
          </div>
          
          {content.duration && (
            <div className="text-sm text-gray-500">
              Durée estimée : {content.duration} min
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default SimulationContent;
