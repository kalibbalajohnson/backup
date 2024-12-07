'use client';
import React, { useMemo } from 'react';

import { DataTable } from '@/components/ui/table/data-table';
import { PHARMACISTS_COLUMNS } from './config/columns';
import ModuleHeader from '@/components/module-header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { usePharmacistsContext } from '@/lib/providers/pharmacists.context';
import { useUsersContext } from '@/lib/providers/users.context';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function PharmacistsPageComponent() {
  const router = useRouter();
  const { isFetchingUsers, users } = useUsersContext();
  const [user, setUser] = useLocalStorage('user', {});

  const pharmacists = useMemo(() => {
    return users?.filter(
      (doctor: any) =>
        doctor?.pharmaceutical == user?.uid && doctor?.role == 'pharmacist'
    );
  }, [users, user?.uid]);

  return (
    <div className="space-y-12">
      <ModuleHeader
        heading="Pharmacists"
        action={
          <Button
            className="text-white"
            onClick={() => router.push('users/create?role=pharmacist')}
          >
            Add
          </Button>
        }
      />
      <DataTable
        columns={PHARMACISTS_COLUMNS}
        data={pharmacists}
        isLoading={isFetchingUsers}
      />
    </div>
  );
}
