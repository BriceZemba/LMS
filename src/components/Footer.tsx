import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

const Footer = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email) {
      toast.error('Veuillez remplir tous les champs');
      return;
    }
    
    // Simulate newsletter subscription
    toast.success('Inscription à la newsletter réussie !');
    setName('');
    setEmail('');
  };

  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* À propos */}
          <div>
            <h3 className="text-lg font-semibold mb-6">À propos</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/career" className="text-gray-300 hover:text-white transition-colors">
                  Carrière
                </Link>
              </li>
              <li>
                <Link to="/partners" className="text-gray-300 hover:text-white transition-colors">
                  Partenaires
                </Link>
              </li>
              <li>
                <Link to="/faq" className="text-gray-300 hover:text-white transition-colors">
                  FAQ
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-gray-300 hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-gray-300 hover:text-white transition-colors">
                  À Propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Notre expertise */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Notre expertise</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/study-office" className="text-gray-300 hover:text-white transition-colors">
                  Bureau d'étude
                </Link>
              </li>
              <li>
                <Link to="/consulting" className="text-gray-300 hover:text-white transition-colors">
                  Conseils
                </Link>
              </li>
              <li>
                <Link to="/research" className="text-gray-300 hover:text-white transition-colors">
                  R & D
                </Link>
              </li>
              <li>
                <Link to="/training" className="text-gray-300 hover:text-white transition-colors">
                  Formations
                </Link>
              </li>
            </ul>
          </div>

          {/* Légal */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Légal</h3>
            <ul className="space-y-4">
              <li>
                <Link to="/terms" className="text-gray-300 hover:text-white transition-colors">
                  Termes et conditions
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-gray-300 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link to="/legal-notices" className="text-gray-300 hover:text-white transition-colors">
                  Mentions légales
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            <p className="text-gray-300 mb-6">
              Abonnez-vous pour ne rater aucune de nos actualités.
            </p>
            <form onSubmit={handleNewsletterSubmit} className="space-y-4">
              <Input
                type="text"
                placeholder="Entrez votre nom et prenom"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="bg-white border-none text-black placeholder-gray-500 rounded-full"
              />
              <Input
                type="email"
                placeholder="Entrez votre e-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white border-none text-black placeholder-gray-500 rounded-full"
              />
              <Button 
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-2"
              >
                Envoyer
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="text-center">
            <p className="text-gray-400 text-sm">
              © 2023 Tous droits réservés LMS INVENTION
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
