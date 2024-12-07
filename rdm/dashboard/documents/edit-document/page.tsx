'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import dynamic from 'next/dynamic';
import { marked } from 'marked';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import 'react-quill/dist/quill.snow.css';

const EditDocument = () => {
  const [docHTML, setDocHTML] = useState<string>('');
  const printRef = useRef<HTMLDivElement | null>(null);

  const ReactQuill = useMemo(
    () => dynamic(() => import('react-quill'), { ssr: false }),
    []
  );

  const { toast } = useToast();

  useEffect(() => {
    const fetchContent = async () => {
      const content = localStorage.getItem('extractedContent');
      if (content) {
        const formattedText = await marked.parse(content);
        setDocHTML(formattedText);
      }
    };

    fetchContent();
  }, []);

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
        '<html><head><title>Document Preview</title></head><body>'
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
        <div className="flex justify-end space-x-4">
          <Button variant="outline" onClick={handlePrint}>
            Preview PDF
          </Button>
          <Button onClick={handleSend}>Send To Verifier</Button>
        </div>
      </div>

      <div>
        <ReactQuill
          value={docHTML}
          onChange={setDocHTML}
          placeholder="Edit extracted content..."
          theme="snow"
        />
      </div>

      <div ref={printRef} className="hidden">
        <div dangerouslySetInnerHTML={{ __html: docHTML }} />
      </div>
    </div>
  );
};

export default EditDocument;
