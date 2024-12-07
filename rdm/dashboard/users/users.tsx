'use client';
import React, { useState } from 'react';

import { DataTable } from '@/components/ui/table/data-table';
import { USERS_COLUMNS } from './config/columns';
import ModuleHeader from '@/components/module-header';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useMoleculesContext } from '@/lib/providers/drugs.context';
import { useUsersContext } from '@/lib/providers/users.context';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function UsersList() {
  const { users, isFetchingUsers } = useUsersContext();
  const [user, setUser] = useLocalStorage('user', {});
  const router = useRouter();
  return (
    <div className="space-y-12">
      <ModuleHeader
        heading="Users"
        action={
          <Button
            onClick={() => router.push('users/create?role=user')}
            className="text-white"
          >
            Add User
          </Button>
        }
      />
      <DataTable
        columns={USERS_COLUMNS}
        data={users}
        isLoading={isFetchingUsers}
      />
    </div>
  );
}
