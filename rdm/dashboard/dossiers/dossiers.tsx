'use client';

import { useEffect, useState } from 'react';
import CreateDossier from './create-dossier';
import DossierService from '@/services/dossiers';
import RegulationCardSkeleton from '../regulations/regulation-card-skeleton';
import RegulationCard from '../regulations/regulation-card';
import DossierBreadcrumbs from './breadcrumbs';

export default function Dossiers() {
  const [dossiers, setDossiers] = useState<any>();
  const [isFetchingDossiers, setIsFetchingDossiers] = useState<boolean>(false);
  const dossierService = new DossierService();

  async function fetchAllDossiers() {
    setIsFetchingDossiers(true);
    try {
      const dossiers = await dossierService.getAllDossiers();
      setDossiers(dossiers);
    } catch (error) {
      console.error('Error fetching dossiers:', error);
    } finally {
      setIsFetchingDossiers(false);
    }
  }

  useEffect(() => {
    fetchAllDossiers();
  }, []);

  return (
    <main className="flex-1">
      <div className="grid gap-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Dossiers</h1>
          <div className="space-x-4">
            <CreateDossier />
          </div>
        </div>
        <div className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
            {isFetchingDossiers ? (
              <RegulationCardSkeleton />
            ) : (
              dossiers?.map((requirement) => (
                <RegulationCard
                  key={requirement.id}
                  requirement={requirement}
                  tag="dossier"
                />
              ))
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
