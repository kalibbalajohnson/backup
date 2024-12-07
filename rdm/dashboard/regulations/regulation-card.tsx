import { Badge } from '@/components/ui/badge';
import { CardContent, Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Routes } from '@/lib/config/routes';
import { calculateComplianceProgress, truncateString } from '@/lib/utils';
import Link from 'next/link';

export default function RegulationCard({
  requirement,
  tag
}: {
  requirement: any;
  tag: string;
}) {
  return (
    <Card key={requirement.id}>
      <CardContent className="grid h-44 gap-4 px-4 py-5">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold capitalize">
            {tag == 'dossier' ? requirement?.data?.title : requirement.title}
          </h3>
          {/* {requirement.status !== "pending" && (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {requirement.compliance}% Compliant
              </span>
            )} */}
          {tag && <Badge>{tag}</Badge>}
        </div>

        {/* <Progress value={calculateComplianceProgress(requirement?.documents)} /> */}

        <p className="text-sm text-gray-500 dark:text-gray-400">
          {tag == 'dossier'
            ? truncateString(requirement?.data?.description, 80)
            : truncateString(requirement.description, 80)}
        </p>
        <div className="flex justify-end">
          {' '}
          <Link
            href={
              tag == 'dossier'
                ? `${Routes.dossiers.details(requirement?.id)}`
                : `${Routes.regulations.details(requirement?.id)}`
            }
            className="text-sm hover:underline"
          >
            View Details
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
