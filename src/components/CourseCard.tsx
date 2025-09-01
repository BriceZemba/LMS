import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Star, Clock, Users, Award, Play } from 'lucide-react';

interface CourseCardProps {
  id: string;
  title: string;
  organization: string;
  organizationLogo?: string;
  coverImage?: string;
  price: number | 'free';
  badges?: string[];
  certificateType?: string;
  rating?: number;
  students?: number;
  duration?: string;
  degreeLink?: string;
  onEnroll?: (courseId: string) => void;
  onBuy?: (courseId: string) => void;
  isOwned?: boolean;
}

const CourseCard: React.FC<CourseCardProps> = ({
  id,
  title,
  organization,
  organizationLogo,
  coverImage,
  price,
  badges = [],
  certificateType = "Certificat Professionnel",
  rating = 4.8,
  students = 0,
  duration,
  degreeLink,
  onEnroll,
  onBuy,
  isOwned = false
}) => {
  const isPaid = price !== 'free' && price > 0;
  const formatPrice = (price: number | 'free') => {
    if (price === 'free') return 'Gratuit';
    return `${price}€`;
  };

  const handleAction = () => {
    if (isPaid && !isOwned) {
      onBuy?.(id);
    } else {
      onEnroll?.(id);
    }
  };

  return (
    <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden border-0 shadow-lg max-w-sm">
      {/* Image de couverture avec badges */}
      <div className="relative">
        <div className="h-48 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center overflow-hidden">
          {coverImage ? (
            <img 
              src={coverImage} 
              alt={title}
              className="w-full h-full object-cover"
            />
          ) : (
            <Play className="h-12 w-12 text-white/80" />
          )}
        </div>
        
        {/* Badges sur l'image */}
        <div className="absolute top-2 left-2 flex flex-wrap gap-1">
          {badges.map((badge, index) => (
            <Badge 
              key={index}
              className="bg-white/90 text-gray-800 text-xs font-medium shadow-sm"
            >
              {badge}
            </Badge>
          ))}
          {price === 'free' && (
            <Badge className="bg-green-600 text-white text-xs font-medium">
              Essai gratuit
            </Badge>
          )}
        </div>

        {/* Prix dans le coin droit */}
        <div className="absolute top-2 right-2">
          <Badge 
            className={`text-sm font-bold ${
              isPaid ? 'bg-blue-600 text-white' : 'bg-green-600 text-white'
            }`}
          >
            {formatPrice(price)}
          </Badge>
        </div>
      </div>

      <CardHeader className="pb-2">
        {/* Organisme avec logo */}
        <div className="flex items-center space-x-2 mb-2">
          {organizationLogo ? (
            <img 
              src={organizationLogo} 
              alt={organization}
              className="w-6 h-6 rounded-full object-cover"
            />
          ) : (
            <div className="w-6 h-6 bg-gradient-to-br from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">
                {organization.charAt(0)}
              </span>
            </div>
          )}
          <span className="text-sm font-medium text-gray-600">{organization}</span>
        </div>

        {/* Titre du cours */}
        <h3 className="text-lg font-bold text-gray-900 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
          {title}
        </h3>

        {/* Lien diplôme */}
        {degreeLink && (
          <a 
            href={degreeLink}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center space-x-1 mb-2"
          >
            <Award className="h-4 w-4" />
            <span>🎓 Préparer un diplôme</span>
          </a>
        )}

        {/* Type de certificat */}
        <p className="text-sm text-gray-600 mb-3">{certificateType}</p>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Statistiques */}
        <div className="flex items-center justify-between text-sm text-gray-600 mb-4">
          <div className="flex items-center space-x-4">
            {rating && (
              <div className="flex items-center space-x-1">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span>{rating}</span>
              </div>
            )}
            {students > 0 && (
              <div className="flex items-center space-x-1">
                <Users className="h-4 w-4" />
                <span>{students.toLocaleString()}</span>
              </div>
            )}
          </div>
          {duration && (
            <div className="flex items-center space-x-1">
              <Clock className="h-4 w-4" />
              <span>{duration}</span>
            </div>
          )}
        </div>

        {/* Bouton d'action */}
        <Button 
          onClick={handleAction}
          className={`w-full font-medium ${
            isPaid && !isOwned
              ? 'bg-green-600 hover:bg-green-700 text-white'
              : isOwned
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          {isPaid && !isOwned ? (
            <>
              <span>Acheter ce cours</span>
            </>
          ) : isOwned ? (
            <>
              <Play className="mr-2 h-4 w-4" />
              Continuer le cours
            </>
          ) : (
            <>
              <Play className="mr-2 h-4 w-4" />
              Commencer gratuitement
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default CourseCard;
