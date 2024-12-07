import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function DocumentSkeleton() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid gap-8 lg:grid-cols-3">
        {Array.from({ length: 8 }).map((_, index) => (
          <div
            key={index}
            className="relative h-48 w-full overflow-hidden rounded-lg border shadow-sm dark:border-gray-700 dark:from-gray-800 dark:to-gray-900"
          >
            <div className="flex h-full flex-col justify-between p-6">
              <div className="flex items-start space-x-4">
                <div className="flex flex-col space-y-2">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-4 w-48" />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16 rounded-full" />
                <Skeleton className="h-6 w-20" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
