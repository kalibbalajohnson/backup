'use client';
import React, { useState } from 'react';

import { DataTable } from '@/components/ui/table/data-table';
import { DRUGS_COLUMNS } from './config/columns';
import ModuleHeader from '@/components/module-header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useMoleculesContext } from '@/lib/providers/drugs.context';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function DrugList() {
  const { molecules, isFetchingMolecules } = useMoleculesContext();
  const [user, setUser] = useLocalStorage('user', {});
  const router = useRouter();

  return (
    <div className="space-y-12">
      <ModuleHeader
        heading="Drugs"
        action={
          <Button
            onClick={() => router.push('drugs/create')}
            className="text-white"
          >
            Add Drug
          </Button>
        }
      />
      <DataTable
        columns={DRUGS_COLUMNS}
        data={
          user?.role == 'admin'
            ? molecules
            : user?.role == 'pharmaceutical'
              ? molecules?.filter((drug) => drug?.pharmaceutical === user?.uid)
              : []
        }
        isLoading={isFetchingMolecules}
      />
    </div>
  );
}
