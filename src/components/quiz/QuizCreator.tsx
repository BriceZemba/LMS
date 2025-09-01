
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X, Save } from 'lucide-react';
import { quizService } from '@/services/quizService';
import { toast } from 'sonner';

interface QuizCreatorProps {
  moduleId?: number;
  lessonId?: number;
  onQuizCreated?: (quizId: number) => void;
}

interface QuizOption {
  text: string;
  isCorrect: boolean;
}

const QuizCreator: React.FC<QuizCreatorProps> = ({ 
  moduleId, 
  lessonId, 
  onQuizCreated 
}) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [options, setOptions] = useState<QuizOption[]>([
    { text: '', isCorrect: false },
    { text: '', isCorrect: false }
  ]);
  const [loading, setLoading] = useState(false);

  const addOption = () => {
    setOptions([...options, { text: '', isCorrect: false }]);
  };

  const removeOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const updateOption = (index: number, field: 'text' | 'isCorrect', value: string | boolean) => {
    const newOptions = [...options];
    newOptions[index] = { ...newOptions[index], [field]: value };
    
    // If setting this option as correct, unset others
    if (field === 'isCorrect' && value === true) {
      newOptions.forEach((option, i) => {
        if (i !== index) option.isCorrect = false;
      });
    }
    
    setOptions(newOptions);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error('Le titre est requis');
      return;
    }

    const validOptions = options.filter(opt => opt.text.trim());
    if (validOptions.length < 2) {
      toast.error('Au moins 2 options sont requises');
      return;
    }

    const hasCorrectAnswer = validOptions.some(opt => opt.isCorrect);
    if (!hasCorrectAnswer) {
      toast.error('Veuillez sélectionner la bonne réponse');
      return;
    }

    setLoading(true);
    
    try {
      // Create quiz
      const quizResult = await quizService.createQuiz({
        title: title.trim(),
        description: description.trim() || undefined,
        module_id: moduleId,
        lesson_id: lessonId
      });

      if (!quizResult.success) {
        throw new Error('Erreur lors de la création du quiz');
      }

      // Add options
      const optionsData = validOptions.map(option => ({
        quiz_id: quizResult.data.id,
        option_text: option.text.trim(),
        is_correct: option.isCorrect
      }));

      const optionsResult = await quizService.addQuizOptions(optionsData);
      
      if (!optionsResult.success) {
        throw new Error('Erreur lors de l\'ajout des options');
      }

      toast.success('Quiz créé avec succès !');
      
      // Reset form
      setTitle('');
      setDescription('');
      setOptions([
        { text: '', isCorrect: false },
        { text: '', isCorrect: false }
      ]);

      onQuizCreated?.(quizResult.data.id);
      
    } catch (error) {
      console.error('Error creating quiz:', error);
      toast.error('Erreur lors de la création du quiz');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Créer un Quiz</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="title">Titre du Quiz *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Ex: Quiz sur les bases de l'IoT"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Description optionnelle du quiz..."
              rows={3}
            />
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label>Options de réponse</Label>
              <Button type="button" onClick={addOption} size="sm" variant="outline">
                <Plus className="h-4 w-4 mr-1" />
                Ajouter une option
              </Button>
            </div>

            {options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <Input
                  value={option.text}
                  onChange={(e) => updateOption(index, 'text', e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  className="flex-1"
                />
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="correctAnswer"
                    checked={option.isCorrect}
                    onChange={(e) => updateOption(index, 'isCorrect', e.target.checked)}
                    className="w-4 h-4"
                  />
                  <Label className="text-sm">Correcte</Label>
                </div>
                {options.length > 2 && (
                  <Button
                    type="button"
                    onClick={() => removeOption(index)}
                    size="sm"
                    variant="outline"
                    className="px-2"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Button type="submit" disabled={loading} className="w-full">
            <Save className="h-4 w-4 mr-2" />
            {loading ? 'Création...' : 'Créer le Quiz'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default QuizCreator;
