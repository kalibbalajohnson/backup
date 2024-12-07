import React from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function RegulationDetailsSkeleton() {
  return (
    <div className="container mx-auto px-4 py-4">
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <div className="col-span-2 lg:col-span-1">
          <div className="space-y-8">
            <div className="mb-8">
              <Skeleton className="h-8 w-3/4" />
            </div>
            <div className="space-y-4">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
              <Skeleton className="h-4 w-2/3" />
            </div>
            <div className="space-y-3">
              <Skeleton className="h-4 w-1/4" />
              <Skeleton className="h-4 w-full" />
            </div>
            <div>
              <Skeleton className="h-10 w-1/3" />
            </div>
          </div>
        </div>
        <div className="col-span-2 lg:col-span-2">
          <div className="space-y-4">
            <Skeleton className="h-6 w-1/4" />
            <div className="grid h-full max-h-[75vh] gap-4 overflow-auto">
              {Array.from({ length: 5 }).map((_, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm dark:border-gray-800 dark:bg-gray-950"
                >
                  <div className="flex items-center space-x-3">
                    <Skeleton className="h-6 w-6" />
                    <div>
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-4 w-24" />
                    </div>
                  </div>
                  <Skeleton className="h-10 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
