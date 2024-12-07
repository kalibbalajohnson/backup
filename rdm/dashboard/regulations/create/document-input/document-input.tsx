'use client';
import { useCallback, useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/v2/input';
import { Label } from '@/components/ui/label';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRegulationsContext } from '@/lib/providers/regulations.context';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';
import { v4 as uuid } from 'uuid';
import { Plus } from 'lucide-react';
import { useLocalStorage } from '@/hooks/use-local-storage';
import { handleUpload } from '@/lib/uploader';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { postRequest } from '@/lib/requests';
import { useSession } from 'next-auth/react';
import Breadcrumbs from './breadcrumbs';
import { useActiveMembership } from '@/hooks/use-memberships';
import { useRouter } from 'next/navigation';
import { Routes } from '@/lib/config/routes';

const transformRequirements = (requirementsString) => {
  // Check if requirementsString is defined and not empty
  if (!requirementsString || typeof requirementsString !== 'string') {
    console.error('Invalid requirements string:', requirementsString);
    return [];
  }

  try {
    // Trim leading and trailing backticks and new lines
    const cleanString = requirementsString
      .trim()
      .replace(/^```json\s*\n|\n\s*```$/g, '');

    // Parse the JSON string into an array
    const requirementsArray = JSON.parse(cleanString);

    // Format the requirements as an array of objects with a title
    return requirementsArray?.map((req) => ({ title: req?.slice(0, 40) }));
  } catch (error) {
    console.error('Error transforming requirements:', error);
    return [];
  }
};

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  file: z
    .any()
    .refine((files) => files.length === 1, 'File is required')
    .transform((files) => files[0])
});

type FormInputs = z.infer<typeof schema>;

export default function CreateRegulationFromDocumentInputForm({}: {}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [summarizing, setSummarizing] = useState(false);
  const [saving, setSaving] = useState(false);
  const { AddRegulationHandler } = useRegulationsContext();
  const [isUploadingFile, setIsUploadingFile] = useState<boolean>(false);
  const [isExtractingRequirements, setIsExtractingRequirements] =
    useState<boolean>(false);
  const [isRefiningingRequirements, setIsRefiningRequirements] =
    useState<boolean>(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: zodResolver(schema)
  });
  const [user, setUser] = useLocalStorage('user', {});
  const { toast } = useToast();
  const { accessToken, activeMembership } = useActiveMembership();
  const queryClient = useQueryClient();

  // const onSubmit: SubmitHandler<FormInputs> = async (data: any) => {
  //   try {
  //     setIsUploadingFile(true);
  //     const regulationPublicUrl = await handleUpload({
  //       document: data.file,
  //       directory: 'regulations'
  //     });

  //     setIsUploadingFile(false);

  //     try {
  //       setIsExtractingRequirements(true);
  //       const extractionRes = await fetch(
  //         'https://api-gr7f.onrender.com/api/v1/docs-processing/extract-requirements/',
  //         {
  //           method: 'POST',
  //           headers: {
  //             'Content-Type': 'application/json'
  //           },
  //           body: JSON.stringify({
  //             document_url: regulationPublicUrl,
  //             prompt:
  //               "You are a highly skilled document analysis specialist. Please provide a summary of the document's contents "
  //           })
  //         }
  //       );
  //       setIsExtractingRequirements(false);

  //       const extractionResponse = await extractionRes.json();

  //       try {
  //         setIsRefiningRequirements(true);
  //         const refinedRes = await fetch(
  //           'https://api-gr7f.onrender.com/api/v1/docs-processing/refine-requirements-extracts/',
  //           {
  //             method: 'POST',
  //             headers: {
  //               'Content-Type': 'application/json'
  //             },
  //             body: JSON.stringify({
  //               text: `

  //               from the list below, i want to have a list of actionable items
  //               ${extractionResponse}
  //               `
  //             })
  //           }
  //         );
  //         setIsRefiningRequirements(false);
  //         const refinedResponse = await refinedRes.json();

  //         const currentTime = new Date();
  //         const rawData = refinedResponse.data;
  //         const jsonData = JSON.parse(rawData.replace(/```/g, '').trim());

  //         const documents = jsonData?.map((title: string) => ({
  //           title,
  //           id: uuid(),
  //           createdAt: currentTime
  //         }));

  //         const addRegulationResponse = await AddRegulationHandler({
  //           title: data?.title,
  //           description: data?.description,
  //           documentPublicUrl: regulationPublicUrl,
  //           status: 'pending',
  //           pharmaceutical: user?.uid,
  //           documents
  //         });

  //         toast({
  //           title: 'Successfully created regulation.'
  //         });

  //         return await addRegulationResponse;
  //       } catch (error) {
  //         console.log(error);
  //         toast({
  //           variant: 'destructive',
  //           title: 'Failed to save regulation.'
  //         });
  //       }
  //     } catch (error) {
  //       console.log(error);
  //       toast({
  //         variant: 'destructive',
  //         title: 'Failed to extract requirements.'
  //       });
  //     }
  //   } catch (error) {
  //     console.log(error);
  //     toast({
  //       variant: 'destructive',
  //       title: 'Failed to upload document.'
  //     });
  //   } finally {
  //     setDialogOpen(false);
  //   }
  // };

  const createRegulation = useMutation({
    mutationFn: async (values: FormInputs) => {
      const formData = new FormData();
      formData.append('file', values.file);

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_FEYTI_OCR_API}/extract-regulation-requirements/`,
          {
            method: 'POST',
            body: formData
          }
        );

        if (!response.ok) {
          if (response.status === 400) {
            const responseMsg = await response.json();
            throw new Error(
              responseMsg[Object.keys(responseMsg)[0]]?.[0] ||
                response.statusText
            );
          }
          throw new Error(response.statusText);
        }

        const data = await response.json();

        const transformedRequirements = transformRequirements(
          data.data.requirements
        );

        const submissionResponse = await postRequest(
          `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulations/create-from-manual-input/`,
          {
            ...values,
            requirements: transformedRequirements,
            organization: activeMembership?.organization_id
          },
          accessToken
        );

        return submissionResponse;
      } catch (error) {
        throw new Error(error.message);
      }
    },

    onSuccess(data) {
      router.push(Routes.regulations.list);

      queryClient.invalidateQueries({ queryKey: ['organizationRegulations'] });
      toast({
        title: 'Success',
        description: 'Regulation created successfully.'
      });
    },

    onError(error: any) {
      toast({
        title: 'Error',
        description: 'Failed to create regulation.'
      });
    }
  });

  const onSubmit = useCallback(
    (data: FormInputs) => {
      createRegulation.mutate(data);
    },
    [createRegulation]
  );

  const { isPending } = createRegulation;

  return (
    <div className="flex flex-col space-y-8">
      <Breadcrumbs />
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Label>Title</Label>
          <Input {...register('title')} />
          {errors.title && (
            <p className="text-red-600">{errors.title.message}</p>
          )}
        </div>
        <div>
          <Label>Description</Label>
          <Textarea {...register('description')} />
          {errors.description && (
            <p className="text-red-600">{errors.description.message}</p>
          )}
        </div>
        <div>
          <Label>Document</Label>
          <Input type="file" {...register('file')} />
          {errors.file && (
            <p className="text-red-600">{errors.file.message.toString()}</p>
          )}
        </div>
        <div className="flex flex-col space-y-4">
          <div className="flex justify-end space-x-4 py-5">
            <Button
              variant="outline"
              type="button"
              disabled={uploading || summarizing}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              disabled={
                uploading ||
                summarizing ||
                isUploadingFile ||
                isExtractingRequirements ||
                isRefiningingRequirements ||
                isPending
              }
            >
              {isPending ? (
                <span className="flex flex-row items-center">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{' '}
                  Creating...
                </span>
              ) : (
                'Add Regulation'
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
