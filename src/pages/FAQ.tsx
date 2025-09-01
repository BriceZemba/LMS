
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, 
  MessageCircle, 
  HelpCircle, 
  BookOpen, 
  CreditCard, 
  Shield,
  ChevronDown,
  ChevronUp,
  Send
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [supportForm, setSupportForm] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const faqCategories = [
    {
      id: 'general',
      name: 'Questions générales',
      icon: <HelpCircle className="h-5 w-5" />,
      questions: [
        {
          id: 1,
          question: 'Comment créer un compte sur LMS INVENTION ?',
          answer: 'Pour créer un compte, cliquez sur "S\'inscrire" dans le menu de navigation. Vous pouvez vous inscrire avec votre email ou utiliser Google. Suivez ensuite les étapes pour vérifier votre compte.'
        },
        {
          id: 2,
          question: 'Comment réinitialiser mon mot de passe ?',
          answer: 'Sur la page de connexion, cliquez sur "Mot de passe oublié". Entrez votre adresse email et suivez les instructions envoyées dans votre boîte mail.'
        },
        {
          id: 3,
          question: 'Puis-je changer mon adresse email ?',
          answer: 'Oui, vous pouvez modifier votre adresse email dans votre profil utilisateur. Allez dans Profil > Informations personnelles > Modifier.'
        }
      ]
    },
    {
      id: 'courses',
      name: 'Cours et contenu',
      icon: <BookOpen className="h-5 w-5" />,
      questions: [
        {
          id: 4,
          question: 'Comment puis-je accéder à mes cours achetés ?',
          answer: 'Vos cours achetés sont accessibles depuis votre Dashboard. Cliquez sur "Mes Cours" dans le menu utilisateur ou allez directement sur /dashboard.'
        },
        {
          id: 5,
          question: 'Les cours ont-ils une date d\'expiration ?',
          answer: 'Non, une fois acheté, vous avez un accès à vie au contenu du cours. Vous pouvez le suivre à votre rythme.'
        },
        {
          id: 6,
          question: 'Puis-je télécharger les vidéos de cours ?',
          answer: 'Pour des raisons de droits d\'auteur, le téléchargement des vidéos n\'est pas autorisé. Cependant, vous pouvez accéder au contenu en ligne à tout moment.'
        }
      ]
    },
    {
      id: 'payment',
      name: 'Paiements et facturation',
      icon: <CreditCard className="h-5 w-5" />,
      questions: [
        {
          id: 7,
          question: 'Quels moyens de paiement acceptez-vous ?',
          answer: 'Nous acceptons les cartes de crédit (Visa, MasterCard, American Express) via Stripe, ainsi que PayPal dans certaines régions.'
        },
        {
          id: 8,
          question: 'Puis-je obtenir un remboursement ?',
          answer: 'Oui, nous offrons une garantie de remboursement de 30 jours. Contactez notre support pour initier une demande de remboursement.'
        },
        {
          id: 9,
          question: 'Comment puis-je voir mes factures ?',
          answer: 'Vos factures sont disponibles dans la section "Mes achats" de votre menu utilisateur. Vous pouvez les télécharger au format PDF.'
        }
      ]
    },
    {
      id: 'technical',
      name: 'Support technique',
      icon: <Shield className="h-5 w-5" />,
      questions: [
        {
          id: 10,
          question: 'Le lecteur vidéo ne fonctionne pas, que faire ?',
          answer: 'Essayez de rafraîchir la page, vérifiez votre connexion internet, ou essayez un autre navigateur. Si le problème persiste, contactez le support.'
        },
        {
          id: 11,
          question: 'L\'application est lente, comment l\'améliorer ?',
          answer: 'Videz le cache de votre navigateur, fermez les onglets inutiles, et assurez-vous d\'avoir une connexion internet stable.'
        }
      ]
    }
  ];

  const filteredFaqs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  const handleSupportSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Ici vous pourriez envoyer le formulaire à votre backend
    toast.success('Votre message a été envoyé ! Nous vous répondrons dans les 24h.');
    setSupportForm({ name: '', email: '', subject: '', message: '' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Centre d'Aide</h1>
            <p className="text-xl text-gray-600 mb-8">Trouvez rapidement les réponses à vos questions</p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <Input
                type="text"
                placeholder="Rechercher dans la FAQ..."
                className="pl-10 h-12 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <Tabs defaultValue="faq" className="space-y-8">
            <TabsList className="grid w-full grid-cols-2 bg-white border shadow-sm max-w-md mx-auto">
              <TabsTrigger value="faq">FAQ</TabsTrigger>
              <TabsTrigger value="support">Support</TabsTrigger>
            </TabsList>

            <TabsContent value="faq" className="space-y-8">
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <Card className="border-0 shadow-md text-center">
                  <CardContent className="p-6">
                    <HelpCircle className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-gray-900">50+</h3>
                    <p className="text-gray-600">Questions fréquentes</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md text-center">
                  <CardContent className="p-6">
                    <MessageCircle className="h-12 w-12 text-green-600 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-gray-900">24h</h3>
                    <p className="text-gray-600">Temps de réponse</p>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-md text-center">
                  <CardContent className="p-6">
                    <Shield className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                    <h3 className="text-2xl font-bold text-gray-900">99%</h3>
                    <p className="text-gray-600">Problèmes résolus</p>
                  </CardContent>
                </Card>
              </div>

              {/* FAQ Categories */}
              <div className="space-y-6">
                {filteredFaqs.map((category) => (
                  <Card key={category.id} className="border-0 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center space-x-2">
                        {category.icon}
                        <span>{category.name}</span>
                        <Badge variant="outline">{category.questions.length}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {category.questions.map((faq) => (
                        <div key={faq.id} className="border border-gray-200 rounded-lg">
                          <button
                            className="w-full text-left p-4 hover:bg-gray-50 flex items-center justify-between"
                            onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                          >
                            <span className="font-medium text-gray-900">{faq.question}</span>
                            {expandedFaq === faq.id ? (
                              <ChevronUp className="h-5 w-5 text-gray-500" />
                            ) : (
                              <ChevronDown className="h-5 w-5 text-gray-500" />
                            )}
                          </button>
                          {expandedFaq === faq.id && (
                            <div className="px-4 pb-4">
                              <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                            </div>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="support">
              <div className="max-w-2xl mx-auto">
                <Card className="border-0 shadow-lg">
                  <CardHeader>
                    <CardTitle>Contactez notre support</CardTitle>
                    <CardDescription>
                      Notre équipe vous répondra dans les plus brefs délais
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleSupportSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                            Nom complet
                          </label>
                          <Input
                            id="name"
                            type="text"
                            required
                            value={supportForm.name}
                            onChange={(e) => setSupportForm({...supportForm, name: e.target.value})}
                          />
                        </div>
                        <div>
                          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                            Email
                          </label>
                          <Input
                            id="email"
                            type="email"
                            required
                            value={supportForm.email}
                            onChange={(e) => setSupportForm({...supportForm, email: e.target.value})}
                          />
                        </div>
                      </div>
                      
                      <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                          Sujet
                        </label>
                        <Input
                          id="subject"
                          type="text"
                          required
                          value={supportForm.subject}
                          onChange={(e) => setSupportForm({...supportForm, subject: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                          Message
                        </label>
                        <Textarea
                          id="message"
                          rows={6}
                          required
                          placeholder="Décrivez votre problème ou votre question en détail..."
                          value={supportForm.message}
                          onChange={(e) => setSupportForm({...supportForm, message: e.target.value})}
                        />
                      </div>
                      
                      <Button type="submit" className="w-full flex items-center justify-center space-x-2">
                        <Send className="h-4 w-4" />
                        <span>Envoyer le message</span>
                      </Button>
                    </form>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default FAQ;
