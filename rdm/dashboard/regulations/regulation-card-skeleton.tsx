import { CardContent, Card } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function RegulationCardSkeleton() {
  return (
    <Card>
      <CardContent className="grid gap-4 px-10 py-5">
        <div className="flex items-center justify-between">
          <Skeleton className="h-6 w-1/2" />

          <Skeleton className="h-4 w-1/4" />
        </div>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-6 w-full" />
        <div className="flex justify-end">
          {' '}
          <Skeleton className="h-12 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}
