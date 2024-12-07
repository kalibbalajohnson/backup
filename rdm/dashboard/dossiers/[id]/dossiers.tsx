'use client';
import DossierExplorer from '@/components/dossier-explorer';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import DossierService from '@/services/dossiers';
import { useEffect, useState } from 'react';

export default function Dossiers({ dossierId }: { dossierId: string }) {
  const dossierService = new DossierService();
  const [dossier, setDossier] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  async function fetchDossierById(dossierId: string) {
    setIsLoading(true);
    try {
      const dossier = await dossierService.getDossierById(dossierId);
      if (dossier) {
        setDossier(dossier);
      } else {
        console.log('Dossier not found.');
      }
    } catch (error) {
      console.error('Error fetching dossier by ID:', error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchDossierById(dossierId);
  }, []);

  return (
    <div className="mt-4 space-y-4">
      <header className="">
        <h2 className="text-lg font-medium capitalize">{dossier?.title}</h2>
        <h2 className="text-sm text-muted-foreground">
          {dossier?.description}
        </h2>
      </header>
      <Tabs defaultValue="module-1" className="w-[400px]">
        <TabsList>
          {dossier?.data?.map((module, index) => (
            <TabsTrigger key={index} value={`module-${index + 1}`}>
              {module.title}
            </TabsTrigger>
          ))}
        </TabsList>
        {isLoading ? (
          <span>loading...</span>
        ) : (
          dossier?.data?.map((module, index) => (
            <TabsContent key={index} value={`module-${index + 1}`}>
              <DossierExplorer
                data={module.children || {}}
                dossierId={dossierId}
              />
            </TabsContent>
          ))
        )}
      </Tabs>
    </div>
  );
}
