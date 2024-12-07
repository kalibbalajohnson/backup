'use client';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Routes } from '@/lib/config/routes';
import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import Link from 'next/link';

export const DRUGS_COLUMNS: ColumnDef<any>[] = [
  {
    accessorKey: '#',
    header: '#',
    cell: (row) => row.row.index + 1
  },
  {
    accessorKey: 'brandName',
    header: 'Brand Name',
    cell: ({ row }) => (
      <span className="capitalize">{row?.original.brandName}</span>
    )
  },
  {
    accessorKey: 'genericName',
    header: 'Generic Name',
    cell: ({ row }) => (
      <span className="capitalize">{row?.original.genericName}</span>
    )
  },
  {
    accessorKey: 'safetyInformation',
    header: 'Safety Information',
    cell: ({ row }) => (
      <span className="">{row?.original.safetyInformation}</span>
    )
  },
  {
    accessorKey: 'modeOfAdministration',
    header: 'Mode Of Administration',
    cell: ({ row }) => (
      <span className="">{row?.original.modeOfAdministration}</span>
    )
  },
  {
    accessorKey: 'dosage',
    header: 'Dosage',
    cell: ({ row }) => <span className="">{row?.original.dosage}</span>
  },

  {
    id: 'actions',
    accessorKey: 'Actions',
    cell: ({ row }) => {
      const drug = row.original;
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
              <Link
                href={`${Routes.drugs.details(drug?.id)}`}
                target="_blank"
                className="cursor-pointer text-sm hover:text-blue-500 hover:underline"
              >
                View Profile
              </Link>
              <DropdownMenuSeparator />
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      );
    }
  }
];
