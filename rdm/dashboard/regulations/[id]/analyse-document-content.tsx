'use client';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ReloadIcon } from '@radix-ui/react-icons';
import { useToast } from '@/hooks/use-toast';
import { EyeIcon } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function AnalyseRegulationDocument({
  document,
  regulationTitle
}: {
  document: any;
  regulationTitle: any;
}) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [analysing, setAnalysing] = useState(false);
  const [analysis, setAnalysis] = useState<any>();
  const { toast } = useToast();

  async function onSubmit() {
    setAnalysing(true);

    const formData = new FormData();
    formData.append('is_file_link', String(true));
    formData.append('pdf_link', document?.url);
    formData.append('reference', regulationTitle);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_FEYTI_OCR_API}/analyse-document-content/`,
        {
          method: 'POST',
          body: formData
        }
      );

      if (!response.ok) {
        throw new Error('Network response was not ok');
      }

      const result = await response.json();
      setAnalysis(result.data.report); // Set report directly
    } catch (error) {
      console.log(error);
      toast({
        variant: 'destructive',
        title: 'Failed to analyse document.'
      });
    }

    setAnalysing(false);
  }

  return (
    <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center" variant="outline">
          <EyeIcon className="h-4 w-4" />
          Analyse
        </Button>
      </DialogTrigger>
      <DialogContent className="max-h-[90vh] w-full max-w-[90vh] space-y-3 overflow-auto bg-white">
        <DialogHeader>
          <DialogTitle>Analyse Document</DialogTitle>
        </DialogHeader>
        <DialogDescription>
          {analysis
            ? 'Below is a summarized analysis of the document'
            : 'We use Artificial Intelligence to proofread and let you know the contents of a document submission. This is to enable you to know the contents of given document submissions.'}
        </DialogDescription>
        {analysis ? (
          <div className="prose">
            <ReactMarkdown>{analysis}</ReactMarkdown>
          </div>
        ) : (
          <div className="w-full">
            <Button onClick={onSubmit} disabled={analysing}>
              {analysing ? (
                <span className="flex flex-row items-center">
                  <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />{' '}
                  Analysing...
                </span>
              ) : (
                'Proceed to analyse'
              )}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
