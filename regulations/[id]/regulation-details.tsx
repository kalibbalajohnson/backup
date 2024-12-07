'use client';

import { Label } from '@/components/ui/label';
import { ArrowUpRight, FileIcon } from 'lucide-react';
import RegulationDetailsSkeleton from './loading';
import UploadRequirementDocument from './upload-requirement';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import CheckCompliance from './check-compliance';
import AnalyseRegulationDocument from './analyse-document-content';
import { useRegulationById } from '@/hooks/use-regulations';
import EditDocument from './edit-document';

export default function RegulationDetails({
  regulationId
}: {
  regulationId: string;
}) {
  const { data: regulation, isLoading: isLoadingRegulation } =
    useRegulationById({ id: regulationId });

  return (
    <>
      {isLoadingRegulation ? (
        <RegulationDetailsSkeleton />
      ) : regulation ? (
        <div className="container mx-auto px-4 py-6">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="col-span-2 lg:col-span-1">
              <div className="space-y-8">
                <h1 className="text-3xl font-bold capitalize tracking-tight">
                  {regulation?.title}
                </h1>
                <p className="text-gray-500 dark:text-gray-400">
                  {regulation?.description}
                </p>
                <div className="space-y-3">
                  <Label>Progress</Label>
                </div>
                <CheckCompliance regulation={regulation} />
              </div>
            </div>
            <div className="col-span-2 lg:col-span-2">
              <div className="space-y-4">
                <h2 className="text-2xl font-bold">Associated Documents</h2>
                <div className="grid max-h-[75vh] gap-4 overflow-auto">
                  {regulation?.requirements?.map((doc, index) => (
                    <div
                      key={index}
                      className={`${
                        doc?.url
                          ? 'items-center justify-between space-y-4'
                          : 'flex justify-between'
                      } rounded-lg border bg-white px-5 py-4 shadow-sm dark:border-gray-800 dark:bg-gray-950`}
                    >
                      <div className="flex items-center space-x-4">
                        <FileIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
                        <div>
                          <p className="text-sm font-medium capitalize">
                            {doc.title}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {doc?.updated_at ? (
                              <span>
                                Last updated: {formatDateTime(doc?.updated_at)}
                              </span>
                            ) : (
                              <span>
                                Created: {formatDateTime(doc?.created_at)}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>

                      <div className="ml-7 flex items-center space-x-3">
                        {doc?.url ? (
                          <>
                            <Link
                              href={`${doc?.url}`}
                              target="_blank"
                              className="flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium text-primary transition-all hover:bg-gray-50"
                              title="View the document"
                            >
                              <span>View</span>
                              <ArrowUpRight className="h-4 w-4" />
                            </Link>

                            <EditDocument documentUrl={doc?.url} />

                            <UploadRequirementDocument
                              regulationId={regulationId}
                              requirementId={doc?.id}
                            />
                            <AnalyseRegulationDocument
                              document={doc}
                              regulationTitle={doc?.title}
                            />
                          </>
                        ) : (
                          <UploadRequirementDocument
                            regulationId={regulationId}
                            requirementId={doc?.id}
                          />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-10 text-center text-gray-500">
          Regulation not found
        </div>
      )}
    </>
  );
}
