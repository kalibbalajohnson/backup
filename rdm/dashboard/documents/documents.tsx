'use client';

import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Routes } from '@/lib/config/routes';
import { Button } from '@/components/ui/button';
import DocumentSkeleton from './loading';
import RegulationFolder from './regulation-folder';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { useOrganizationRegulations } from '@/hooks/use-regulations';

export default function Documents() {
  const [activeMembership] = useLocalStorage('membership', {});

  const { data: regulations, isPending: isLoadingRegulations } =
    useOrganizationRegulations();

  return (
    <div className="container mx-auto space-y-8 px-4 py-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          Uploaded Documents
        </h2>
        <Link
          href={Routes.documents.details('create-document')}
          target="_blank"
        >
          <Button variant="default">
            <Plus className="mr-1 h-4 w-4" />
            Create Document
          </Button>
        </Link>
      </div>

      <div className="space-y-6">
        {isLoadingRegulations ? (
          <DocumentSkeleton />
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {regulations
              ?.filter(
                (regulation) =>
                  regulation?.organization === activeMembership?.organization_id
              )
              ?.map((requirement) => (
                <RegulationFolder
                  key={requirement.id}
                  requirement={requirement}
                  tag="folder"
                />
              ))}
          </div>
        )}
      </div>
    </div>
  );
}
