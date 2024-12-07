'use client';

import RegulationCardSkeleton from './regulation-card-skeleton';
import RegulationCard from './regulation-card';
import RegulationsBreadcrumbs from './regulations-breadcrumbs';
import InviteRegulationMember from './invite-regulation-member';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { hasPermission } from '@/lib/utils';
import {
  useMyRegulations,
  useOrganizationRegulations
} from '@/hooks/use-regulations';

import { Button } from '@/components/ui/button';
import { ChevronDown, Plus } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import Link from 'next/link';
import { Routes } from '@/lib/config/routes';

export default function Regulations() {
  const [activeMembership, setActiveMembership] = useLocalStorage(
    'membership',
    {}
  );
  const hasInvitationAccess = hasPermission(
    activeMembership?.role?.permissions,
    ['invite']
  );
  const hasCreateAccess = hasPermission(activeMembership?.role?.permissions, [
    'add'
  ]);
  // const { data: regulations, isPending: isLoadingRegulations } =
  //   useMyRegulations();
  const { data: regulations, isPending: isLoadingRegulations } =
    useOrganizationRegulations();

  return (
    <div className="flex flex-col space-y-3">
      <RegulationsBreadcrumbs />
      <main className="flex-1">
        <div className="grid gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Regulations</h1>
            <div className="flex space-x-4">
              {hasCreateAccess && (
                <div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="default">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Regulation
                        <ChevronDown className="ml-2 h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem>
                        <Link
                          href={Routes.regulations.details(
                            `/create/document-input`
                          )}
                        >
                          From Document
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Link
                          href={Routes.regulations.details(
                            `/create/manual-input`
                          )}
                        >
                          Input Requirements Manually
                        </Link>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              )}{' '}
              {hasInvitationAccess && (
                <InviteRegulationMember
                  organization={activeMembership?.organization_id}
                  regulations={regulations?.filter(
                    (regulation) =>
                      regulation?.organization ==
                      activeMembership?.organization_id
                  )}
                />
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3">
              {isLoadingRegulations ? (
                <RegulationCardSkeleton />
              ) : (
                regulations
                  ?.filter(
                    (regulation) =>
                      regulation?.organization ==
                      activeMembership?.organization_id
                  )
                  ?.map((requirement) => (
                    <RegulationCard
                      key={requirement.id}
                      requirement={requirement}
                      tag="regulation"
                    />
                  ))
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
