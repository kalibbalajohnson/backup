'use client';
import React, { useMemo, useState } from 'react';

import { DataTable } from '@/components/ui/table/data-table';
import { NURSES_COLUMNS } from './config/columns';
import ModuleHeader from '@/components/module-header';
import { Button } from '@/components/ui/button';
import { useClinicalTrialApplicationsContext } from '@/lib/providers/clinical-trial-applications.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNursesContext } from '@/lib/providers/nurses.context';
import { useUsersContext } from '@/lib/providers/users.context';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function NursesPageComponent() {
  const { isFetchingUsers, users } = useUsersContext();
  const [user, setUser] = useLocalStorage('user', {});
  const router = useRouter();

  const nurses = useMemo(() => {
    return users?.filter(
      (doctor: any) =>
        doctor?.pharmaceutical == user?.uid && doctor?.role == 'nurse'
    );
  }, [users, user?.uid]);

  return (
    <div className="space-y-12">
      <ModuleHeader
        heading="Nurses"
        action={
          <Button
            className="text-white"
            onClick={() => router.push('users/create?role=nurse')}
          >
            Add
          </Button>
        }
      />
      <DataTable
        columns={NURSES_COLUMNS}
        data={nurses}
        isLoading={isFetchingUsers}
      />
    </div>
  );
}
