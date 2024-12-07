'use client';
import React, { useState } from 'react';

import { DataTable } from '@/components/ui/table/data-table';
import { DRUG_ADVERSE_COLUMNS } from './columns';
import { useDrugAdversesContext } from '@/lib/providers/drug-adverses.context';
import ModuleHeader from '@/components/module-header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function DrugAdverses() {
  const { drugAdverses, isFetchingDrugAdverses } = useDrugAdversesContext();
  const [user, setUser] = useLocalStorage('user', {});
  const router = useRouter();
  return (
    <div className="space-y-12">
      <ModuleHeader
        heading="Drug Adverses"
        action={
          <Button
            onClick={() => router.push('drug-adverses/report')}
            className="text-white"
          >
            Report Drug Adverse
          </Button>
        }
      />
      <DataTable
        columns={DRUG_ADVERSE_COLUMNS}
        data={drugAdverses}
        isLoading={isFetchingDrugAdverses}
      />
    </div>
  );
}
