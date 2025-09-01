
import React, { useEffect, useState } from 'react';

interface WelcomeAnimationProps {
  firstName: string;
  onComplete: () => void;
}

const WelcomeAnimation: React.FC<WelcomeAnimationProps> = ({ firstName, onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade out animation to complete
    }, 5000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!isVisible) {
    return (
      <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center z-50 animate-fade-out">
        <div className="text-white text-4xl font-bold animate-scale-out">
          Bienvenue {firstName}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center z-50 animate-fade-in">
      <div className="text-white text-4xl font-bold animate-scale-in">
        Bienvenue {firstName}
      </div>
    </div>
  );
};

export default WelcomeAnimation;
