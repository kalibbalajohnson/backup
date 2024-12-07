'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';

export const DRUG_ADVERSE_COLUMNS: ColumnDef<any>[] = [
  {
    accessorKey: '#',
    header: '#',
    cell: (row) => row.row.index + 1
  },
  {
    accessorKey: 'patient_name',
    header: 'Patient Name'
  },
  {
    accessorKey: 'date_of_birth',
    header: 'Date Of Birth'
  },
  {
    accessorKey: 'patient_gender',
    header: 'Patient Gender',
    cell: ({ row }) => (
      <span className="capitalize">{row?.original.patient_gender}</span>
    )
  },
  {
    accessorKey: 'reaction',
    header: 'Reaction'
  },
  {
    accessorKey: 'reaction_duration',
    header: 'Reaction Duration'
  },

  {
    accessorKey: 'severity',
    header: 'Severity'
  },

  {
    accessorKey: 'severity',
    header: 'Severity',
    cell: ({ row }) => {
      return (
        <Badge
          variant={
            row.original.severity == 'mild'
              ? 'outline'
              : row.original.severity == 'moderate'
                ? 'secondary'
                : row.original.severity == 'high'
                  ? 'destructive'
                  : 'default'
          }
        >
          {row.original.severity}
        </Badge>
      );
    }
  },
  {
    id: 'actions',
    accessorKey: 'Actions',
    cell: ({ row }) => {
      const customer = row.original;

      return (
        <div className="flex flex-row space-x-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="bg-white p-2">
              {/* <Link
                href={`${Routes.customers.edit(customer?.id)}`}
                className=" cursor-pointer"
              >
                Edit
              </Link> */}
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
