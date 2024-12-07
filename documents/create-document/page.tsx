'use client';

import { useState, useRef, useMemo } from 'react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Input } from '@/components/ui/v2/input';
import { Label } from '@/components/ui/label';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { marked } from 'marked';
import 'react-quill/dist/quill.snow.css';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@/components/ui/dialog';
import dynamic from 'next/dynamic';

const schema = z.object({
  file: z
    .any()
    .refine((files) => files?.length === 1, 'File is required')
    .transform((files) => files[0])
});

type FormInputs = z.infer<typeof schema>;

const CreateDocument = () => {
  const [docHTML, setDocHTML] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );
  const printRef = useRef<HTMLDivElement | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<FormInputs>({
    resolver: zodResolver(schema)
  });

  const { toast } = useToast();

  const onSubmit: SubmitHandler<FormInputs> = async (data) => {
    setIsGenerating(true);
    const formData = new FormData();
    formData.append('file', data.file);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FEYTI_OCR_API}/extract-pdf-richcontent/`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        const errorMsg = await response.json();
        throw new Error(errorMsg?.data?.message || 'Failed to extract text.');
      }

      const result = await response.json();
      const formattedText = result.data.text;
      const htmlContent = `<div style="font-family: sans-serif, 'Roboto';">${marked.parse(formattedText)}</div>`;
      setDocHTML(htmlContent);

      toast({
        title: 'Success',
        description: 'Text extracted and formatted successfully.'
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'An unexpected error occurred.'
      });
    } finally {
      setIsGenerating(false);
      setIsOpen(false);
    }
  };

  const handlePrint = () => {
    if (docHTML.trim() === '') {
      toast({
        title: 'Error',
        description: 'No document content to print.'
      });
      return;
    }

    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(
        '<html><head><title>Regulations Document</title></head><body>'
      );
      printWindow.document.write('<div>');
      printWindow.document.write(docHTML);
      printWindow.document.write('</div>');

      printWindow.document.write('</body></html>');
      printWindow.document.close();
      printWindow.print();
    }
  };

  const handleSend = () => {
    toast({
      title: 'Document Sent',
      description: 'The document has been successfully sent.'
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2>Edit Document</h2>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button>Upload Document</Button>
          </DialogTrigger>
          <DialogContent className="rounded-lg bg-white p-6 shadow-lg">
            <DialogHeader>
              <DialogTitle>Upload Document</DialogTitle>
              <DialogDescription>Select a PDF to upload</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <Label htmlFor="file">Document</Label>
                <Input id="file" type="file" {...register('file')} />
                {errors.file && (
                  <p className="text-red-600">
                    {errors.file.message.toString()}
                  </p>
                )}
              </div>
              <div className="flex justify-end space-x-4">
                <Button
                  variant="outline"
                  type="button"
                  disabled={isGenerating}
                  onClick={() => setDocHTML('')}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={isGenerating}>
                  {isGenerating ? (
                    <span className="flex items-center">
                      <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                      Generating...
                    </span>
                  ) : (
                    'Generate'
                  )}
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div>
        <ReactQuill
          value={docHTML}
          onChange={setDocHTML}
          placeholder="Edit extracted content..."
          theme="snow"
        />
      </div>

      <div className="flex justify-end space-x-4">
        <Button variant="outline" onClick={handlePrint}>
          Preview PDF
        </Button>
        <Button onClick={handleSend}>Send To Verifier</Button>
      </div>

      <div ref={printRef} className="hidden">
        <div dangerouslySetInnerHTML={{ __html: docHTML }} />
      </div>
    </div>
  );
};

export default CreateDocument;
