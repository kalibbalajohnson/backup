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
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/hooks/use-toast';
import { useLocalStorage } from '@/hooks/use-local-storage';
const schema = z.object({
  file: z
    .any()
    .refine((files) => files.length === 1, 'File is required')
    .transform((files) => files[0])
    .optional()
});

type FormInputs = z.infer<typeof schema>;

export default function CheckCompliance({ regulation }: { regulation: any }) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [crunching, setCrunching] = useState(false);
  const [report, setReport] = useState<any>();
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

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setCrunching(true);
    try {
      const requestBody = {
        document_uris: [],
        text: `The ${regulation.title} document contains all regulations for a drug manufacturer ${regulation.documentGsutilUrl}.`
      };

      // Add the manufacturer's document URL
      requestBody.document_uris.push(regulation.documentGsutilUrl);

      // Iterate over the regulation's documents to add their URLs and titles to the request body
      regulation.documents.forEach((doc) => {
        if (doc.documentGsutilUrl) {
          requestBody.document_uris.push(doc.documentGsutilUrl);
          requestBody.text += `\n\nThe ${doc.title} document (${doc.documentGsutilUrl}) contains requirements submitted by ${regulation.title}. What is the percentage compliance of the availed documents out of 22 documents?`;
        }
      });

      const response = await fetch(
        'https://api-gr7f.onrender.com/api/v1/docs-processing/compare/',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(requestBody)
        }
      );

      const responseData = await response.json();
      setReport(response);
      // Handle response data as needed
    } catch (error) {
      console.error('Request Error:', error);
      toast({
        variant: 'destructive',
        title: 'Failed to process document.'
      });
    } finally {
      setCrunching(false);
    }
  };

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center">Check Complaince</Button>
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogHeader>
          <DialogTitle>Check Compliance</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            {/* {report && <ul className="flex">{report?.map((i)=><li>{i}</li>)}</ul>} */}
          </div>
          <div className="flex flex-col space-y-4">
            <div className="flex justify-end space-x-4 py-5">
              <DialogPrimitive.Close>
                <Button variant="outline" type="button" disabled={crunching}>
                  Cancel
                </Button>
              </DialogPrimitive.Close>
              <Button type="submit" disabled={crunching}>
                {uploading ? (
                  <span className="flex flex-row items-center">
                    <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{' '}
                    Crunching data...
                  </span>
                ) : (
                  'Check'
                )}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
