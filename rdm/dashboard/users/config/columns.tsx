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

export const USERS_COLUMNS: ColumnDef<any>[] = [
  {
    accessorKey: '#',
    header: '#',
    cell: (row) => row.row.index + 1
  },
  {
    accessorKey: 'firstName',
    header: 'First Name',
    cell: ({ row }) => (
      <span className="capitalize">{row?.original.firstName}</span>
    )
  },
  {
    accessorKey: 'lastName',
    header: 'Last Name',
    cell: ({ row }) => (
      <span className="capitalize">{row?.original.lastName}</span>
    )
  },
  {
    accessorKey: 'email',
    header: 'Email',
    cell: ({ row }) => <span className="">{row?.original.email}</span>
  },
  {
    accessorKey: 'active',
    header: 'Status',
    cell: ({ row }) => {
      return (
        <Badge
          className="text-white"
          variant={row.original.active == true ? 'default' : 'destructive'}
        >
          {row.original.active == true ? 'Active' : 'Inactive'}
        </Badge>
      );
    }
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
