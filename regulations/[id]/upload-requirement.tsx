'use client';
import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogPrimitive
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/v2/input';
import { Label } from '@/components/ui/label';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useRegulationsContext } from '@/lib/providers/regulations.context';
import { useToast } from '@/hooks/use-toast';
import { UploadIcon } from 'lucide-react';
import { handleUpload } from '@/lib/uploader';
import { useActiveMembership } from '@/hooks/use-memberships';
import { useQueryClient } from '@tanstack/react-query';

const schema = z.object({
  file: z
    .any()
    .refine((files) => files.length === 1, 'File is required')
    .refine((files) => {
      const file = files[0];
      return file && file.type === 'application/pdf';
    }, 'Only PDF files are allowed')
    .transform((files) => files[0])
});

type FormInputs = z.infer<typeof schema>;

export default function UploadRegulationRequirement({
  requirementId,
  regulationId
}: {
  regulationId: any;
  requirementId: any;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const { UpdateRegulatoryDocumentHandler } = useRegulationsContext();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: zodResolver(schema)
  });
  const { toast } = useToast();
  const [document, setDocument] = useState(null);
  const { accessToken, activeMembership } = useActiveMembership();
  const queryClient = useQueryClient();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setUploading(true);
    try {
      const uploadResponse = await handleUpload({
        document,
        directory: 'regulationDocuments'
      });

      console.log('uploaded doc', uploadResponse);

      const currentTime = new Date();

      const requirementData = {
        url: uploadResponse,
        updated_at: currentTime
      };

      setUploading(false);
      setSaving(true);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/regulation-requirements/${requirementId}/`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`
          },
          body: JSON.stringify(requirementData)
        }
      );

      if (!response.ok) {
        throw new Error('Failed to update requirement');
      }

      const responseData = await response.json();

      queryClient.invalidateQueries({ queryKey: ['regulation', regulationId] });

      toast({
        title: 'Successfully updated requirement.'
      });
    } catch (error) {
      console.error('Processing Error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to save document.'
      });
    } finally {
      reset();
      setDialogOpen(false);
      setSaving(false);
      setUploading(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center" variant="outline">
          <UploadIcon className="h-4 w-4" />
          Upload
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Upload Document</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Label>Document</Label>
            <Input
              type="file"
              {...register('file')}
              onChange={(event) => setDocument(event.target.files[0])}
            />
            {errors.file && (
              <p className="text-red-600">{errors.file.message.toString()}</p>
            )}
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-end space-x-4 py-5">
              <DialogPrimitive.Close>
                <Button
                  variant="outline"
                  type="button"
                  disabled={uploading || saving}
                >
                  Cancel
                </Button>
              </DialogPrimitive.Close>
              <Button type="submit" disabled={uploading || saving}>
                {uploading ? (
                  <span className="flex flex-row items-center">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Uploading document...
                  </span>
                ) : saving ? (
                  <span className="flex flex-row items-center">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" /> Saving
                    document...
                  </span>
                ) : (
                  'Upload'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
