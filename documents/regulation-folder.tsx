import { Badge } from '@/components/ui/badge';
import { CardContent, Card } from '@/components/ui/card';
import { Routes } from '@/lib/config/routes';
import { truncateString } from '@/lib/utils';
import { Folder } from 'lucide-react';
import Link from 'next/link';

export default function RegulationFolder({
  requirement,
  tag
}: {
  requirement: any;
  tag: string;
}) {
  return (
    <Link
      href={
        tag === 'dossier'
          ? `${Routes.dossiers.details(requirement?.id)}`
          : `${Routes.regulations.details(requirement?.id)}`
      }
      className="group block"
    >
      <Card
        key={requirement.id}
        className="relative h-48 w-full overflow-hidden rounded-lg border border-gray-300 bg-gradient-to-br from-white to-white  dark:border-gray-700 dark:from-gray-800 dark:to-gray-900"
      >
        <CardContent className="flex h-full flex-col justify-between p-6">
          <div className="flex items-start space-x-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-gray-700 group-hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-300">
              <Folder className="h-8 w-8" />
            </div>
            <div>
              <h3 className="text-lg font-semibold capitalize text-gray-800 dark:text-gray-100">
                {tag === 'dossier'
                  ? requirement?.data?.title
                  : requirement.title}
              </h3>
              <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {tag === 'dossier'
                  ? truncateString(requirement?.data?.description, 80)
                  : truncateString(requirement.description, 80)}
              </p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            {tag && (
              <Badge className="hover:bg-text-white rounded-full bg-gray-100 px-3 py-1 text-xs font-medium text-gray-700">
                {tag}
              </Badge>
            )}
            <Link
              href={
                tag === 'dossier'
                  ? `${Routes.dossiers.details(requirement?.id)}`
                  : `${Routes.regulations.details(requirement?.id)}`
              }
              className="text-sm font-medium text-gray-700 hover:underline dark:text-gray-300"
            >
              Open
            </Link>
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
