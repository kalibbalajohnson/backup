'use client';
import React, { useMemo, useState } from 'react';

import { DataTable } from '@/components/ui/table/data-table';
import { DOCTORS_COLUMNS } from './config/columns';
import ModuleHeader from '@/components/module-header';
import { Button } from '@/components/ui/button';
import { useClinicalTrialApplicationsContext } from '@/lib/providers/clinical-trial-applications.context';
import { useRouter, useSearchParams } from 'next/navigation';
import { useNursesContext } from '@/lib/providers/nurses.context';
import { useDoctorsContext } from '@/lib/providers/doctors.context';
import { useUsersContext } from '@/lib/providers/users.context';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function DoctorsPageComponent() {
  const { isFetchingUsers, users } = useUsersContext();
  const [user, setUser] = useLocalStorage('user', {});
  const router = useRouter();

  const doctors = useMemo(() => {
    return users?.filter(
      (doctor: any) =>
        doctor?.pharmaceutical == user?.uid && doctor?.role == 'doctor'
    );
  }, [users, user?.uid]);

  return (
    <div className="space-y-12">
      <ModuleHeader
        heading="Doctors"
        action={
          <Button
            className="text-white"
            onClick={() => router.push('users/create?role=doctor')}
          >
            Add
          </Button>
        }
      />
      <DataTable
        columns={DOCTORS_COLUMNS}
        data={doctors}
        isLoading={isFetchingUsers}
      />
    </div>
  );
}
