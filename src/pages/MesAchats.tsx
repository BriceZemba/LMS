
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Download, 
  Eye, 
  Calendar, 
  CreditCard,
  Check,
  Clock,
  AlertCircle
} from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { toast } from 'sonner';

const MesAchats = () => {
  // Données d'exemple
  const achats = [
    {
      id: 1,
      type: 'cours',
      titre: 'Google Cybersécurité',
      date: '2024-01-15',
      montant: 49.99,
      devise: 'EUR',
      statut: 'completé',
      facture: 'INV-2024-001',
      methode: 'Carte de crédit',
      description: 'Certificat Professionnel Google'
    },
    {
      id: 2,
      type: 'cours',
      titre: 'Intelligence Artificielle Appliquée',
      date: '2024-01-10',
      montant: 149.00,
      devise: 'EUR',
      statut: 'completé',
      facture: 'INV-2024-002',
      methode: 'PayPal',
      description: 'Certificat Professionnel Microsoft'
    },
    {
      id: 3,
      type: 'abonnement',
      titre: 'Abonnement Premium',
      date: '2024-01-01',
      montant: 19.99,
      devise: 'EUR',
      statut: 'actif',
      facture: 'INV-2024-003',
      methode: 'Carte de crédit',
      description: 'Accès illimité pendant 1 mois'
    }
  ];

  const getStatusBadge = (statut: string) => {
    switch (statut) {
      case 'completé':
        return <Badge className="bg-green-100 text-green-800"><Check className="h-3 w-3 mr-1" />Completé</Badge>;
      case 'actif':
        return <Badge className="bg-blue-100 text-blue-800"><Clock className="h-3 w-3 mr-1" />Actif</Badge>;
      case 'en_attente':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="h-3 w-3 mr-1" />En attente</Badge>;
      default:
        return <Badge variant="outline">{statut}</Badge>;
    }
  };

  const handleDownloadInvoice = (factureId: string) => {
    toast.success(`Téléchargement de la facture ${factureId}...`);
  };

  const handleViewInvoice = (factureId: string) => {
    toast.info(`Ouverture de la facture ${factureId}...`);
  };

  const totalDepense = achats.reduce((total, achat) => total + achat.montant, 0);
  const coursAchetes = achats.filter(a => a.type === 'cours').length;
  const abonnementsActifs = achats.filter(a => a.type === 'abonnement' && a.statut === 'actif').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      <Navigation />
      
      <div className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Mes Achats</h1>
            <p className="text-gray-600">Gérez vos achats et téléchargez vos factures</p>
          </div>

          {/* Statistics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <CreditCard className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="text-2xl font-bold text-gray-900">{totalDepense.toFixed(2)}€</h3>
                <p className="text-gray-600">Total des achats</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Badge className="h-12 w-12 bg-green-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  {coursAchetes}
                </Badge>
                <h3 className="text-lg font-semibold text-gray-900">Cours achetés</h3>
                <p className="text-gray-600">Accès à vie</p>
              </CardContent>
            </Card>
            <Card className="border-0 shadow-md">
              <CardContent className="p-6 text-center">
                <Badge className="h-12 w-12 bg-purple-600 text-white rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                  {abonnementsActifs}
                </Badge>
                <h3 className="text-lg font-semibold text-gray-900">Abonnements actifs</h3>
                <p className="text-gray-600">Renouvelés automatiquement</p>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="tous" className="space-y-8">
            <TabsList className="grid w-full grid-cols-3 bg-white border shadow-sm max-w-md mx-auto">
              <TabsTrigger value="tous">Tous</TabsTrigger>
              <TabsTrigger value="cours">Cours</TabsTrigger>
              <TabsTrigger value="abonnements">Abonnements</TabsTrigger>
            </TabsList>

            <TabsContent value="tous">
              <div className="space-y-4">
                {achats.map((achat) => (
                  <Card key={achat.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{achat.titre}</h3>
                            {getStatusBadge(achat.statut)}
                          </div>
                          <p className="text-gray-600 mb-2">{achat.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(achat.date).toLocaleDateString('fr-FR')}
                            </div>
                            <div className="flex items-center">
                              <CreditCard className="h-4 w-4 mr-1" />
                              {achat.methode}
                            </div>
                            <span className="font-medium">
                              {achat.montant.toFixed(2)} {achat.devise}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInvoice(achat.facture)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(achat.facture)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="cours">
              <div className="space-y-4">
                {achats.filter(a => a.type === 'cours').map((achat) => (
                  <Card key={achat.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{achat.titre}</h3>
                            {getStatusBadge(achat.statut)}
                          </div>
                          <p className="text-gray-600 mb-2">{achat.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              {new Date(achat.date).toLocaleDateString('fr-FR')}
                            </div>
                            <span className="font-medium">
                              {achat.montant.toFixed(2)} {achat.devise}
                            </span>
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2 mt-4 md:mt-0">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleViewInvoice(achat.facture)}
                          >
                            <Eye className="h-4 w-4 mr-1" />
                            Voir
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDownloadInvoice(achat.facture)}
                          >
                            <Download className="h-4 w-4 mr-1" />
                            Télécharger
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="abonnements">
              <div className="space-y-4">
                {achats.filter(a => a.type === 'abonnement').map((achat) => (
                  <Card key={achat.id} className="border-0 shadow-lg">
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-gray-900">{achat.titre}</h3>
                            {getStatusBadge(achat.statut)}
                          </div>
                          <p className="text-gray-600 mb-2">{achat.description}</p>
                          <div className="flex items-center space-x-4 text-sm text-gray-500">
                            <div className="flex items-center">
                              <Calendar className="h-4 w-4 mr-1" />
                              Prochain renouvellement: {new Date(Date.now() + 30*24*60*60*1000).toLocaleDateString('fr-FR')}
                            </div>
                            <span className="font-medium">
                              {achat.montant.toFixed(2)} {achat.devise}/mois
                            </span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default MesAchats;
