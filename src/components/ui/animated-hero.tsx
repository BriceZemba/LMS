
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { MoveRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';
import { useSupabaseAuth } from '@/hooks/useSupabaseAuth';

function Hero() {
  const [titleNumber, setTitleNumber] = useState(0);
  const titles = useMemo(
    () => ["innovante", "moderne", "intelligente", "efficace", "révolutionnaire"],
    []
  );
  const navigate = useNavigate();
  const { user } = useSupabaseAuth();
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (titleNumber === titles.length - 1) {
        setTitleNumber(0);
      } else {
        setTitleNumber(titleNumber + 1);
      }
    }, 2000);
    return () => clearTimeout(timeoutId);
  }, [titleNumber, titles]);

  return (
    <div className="w-full bg-gradient-to-br from-slate-50 to-blue-50">
      <div className="container mx-auto">
        <div className="flex gap-8 py-20 lg:py-40 items-center justify-center flex-col">
          <div>
            <Button variant="secondary" size="sm" className="gap-4 bg-blue-100 text-blue-600 hover:bg-blue-200" onClick={() => navigate('/supabase-auth')}>
              Découvrez notre plateforme <MoveRight className="w-4 h-4" />
            </Button>
          </div>
          <div className="flex gap-4 flex-col">
            <h1 className="text-5xl md:text-7xl max-w-4xl tracking-tighter text-center font-regular">
              <span className="text-gray-900">Plateforme LMS</span>
              <span className="relative flex w-full justify-center overflow-hidden text-center md:pb-4 md:pt-1">
                &nbsp;
                {titles.map((title, index) => (
                  <motion.span
                    key={index}
                    className="absolute font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                    initial={{ opacity: 0, y: "-100" }}
                    transition={{ type: "spring", stiffness: 50 }}
                    animate={
                      titleNumber === index
                        ? {
                            y: 0,
                            opacity: 1,
                          }
                        : {
                            y: titleNumber > index ? -150 : 150,
                            opacity: 0,
                          }
                    }
                  >
                    {title}
                  </motion.span>
                ))}
              </span>
            </h1>

            <p className="text-lg md:text-xl leading-relaxed tracking-tight text-gray-600 max-w-3xl text-center">
              Transformez votre parcours professionnel avec notre plateforme d'apprentissage nouvelle génération. 
              Accédez à des formations de qualité, développez vos compétences et obtenez des certifications reconnues 
              dans le domaine de la transformation digitale industrielle.
            </p>
          </div>
          <div className="flex flex-row gap-3" onClick={() => navigate('/supabase-auth')}>
            <Button size="lg" className="gap-4 border-blue-600 text-blue-600 hover:bg-blue-50" variant="outline">
              Contactez-nous <PhoneCall className="w-4 h-4" />
            </Button>
            <Button size="lg" className="gap-4 bg-blue-600 hover:bg-blue-700 text-white">
              Commencer maintenant <MoveRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export { Hero };