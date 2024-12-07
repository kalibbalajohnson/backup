'use client'

import { useEffect, useState } from 'react';
import { storage } from '@/lib/firebase/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';
import { Card, CardContent } from '@/components/ui/card';
import { FileIcon } from 'lucide-react';
import { truncateString } from '@/lib/utils';
import io from 'socket.io-client';
import { Socket } from 'socket.io-client';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Routes } from '@/lib/config/routes';
import Link from 'next/link';

type Document = {
  name: string;
  url: string;
  // size: number; 
  // lastModified: string; 
};

async function listFiles(directory: string): Promise<{ name: string; url: string }[]> {
  const directoryRef = ref(storage, directory);
  const fileList = await listAll(directoryRef);

  const downloadURLs = await Promise.all(
    fileList.items.map(async (itemRef) => {
      const url = await getDownloadURL(itemRef);
      return { name: itemRef.name, url };
    })
  );

  return downloadURLs;
}

export default function Documents() {
  const [regulationDocuments, setRegulationDocuments] = useState<Document[]>([]);
  const [dossierDocuments, setDossierDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const regulationDocs = await listFiles('documents');
        const dossierDocs = await listFiles('dossierDocuments');

        setRegulationDocuments(regulationDocs);
        setDossierDocuments(dossierDocs);
      } catch (error) {
        console.error('Error fetching documents:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();

    // Connect to the Socket.IO server
    const socketInstance = io('/api/socket');
    setSocket(socketInstance);

    socketInstance.on('connect', () => {
      // console.log('Connected to Socket.IO server');
    });

    // Listen for real-time text updates
    socketInstance.on('text-update', (updatedText) => {
      console.log('Received text update:', updatedText);
    });

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold">Uploaded Documents</h2>
        <Link href={Routes.documents.details(
          `create-document`
        )} target="_blank">
          <Button variant="default">
            <Plus className="mr-1 h-4 w-4" />
            Create Document
          </Button>
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-4 p-4 md:grid-cols-4">
        {dossierDocuments?.map((doc: any, index: number) => {
          return (
            <Link href={doc?.url} key={index} target="_blank">
              <Card className="h-72 w-64 cursor-pointer border border-gray-200 hover:border-primary">
                <CardContent className="flex h-72 flex-col items-center justify-center p-4">
                  <FileIcon className="size-16 text-primary" />
                  <div className="mt-4 text-center">
                    <p className="font-semibold text-primary">{truncateString(doc?.name)}</p>
                    <p className="text-sm text-gray-500">22.67kb</p>
                    <p className="text-xs text-gray-400">Last Modified: 30 mins ago</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
        {regulationDocuments?.map((doc: any, index: number) => {
          return (
            <Link href={doc?.url} key={index} target="_blank">

              <Card className="h-72 w-64 cursor-pointer border border-gray-200 hover:border-primary">
                <CardContent className="flex h-72 flex-col items-center justify-center p-4">
                  <FileIcon className="size-16 text-primary" />
                  <div className="mt-4 text-center">
                    <p className="font-semibold text-primary">{truncateString(doc?.name)}</p>
                    <p className="text-sm text-gray-500">22.67kb</p>
                    <p className="text-xs text-gray-400">Last Modified: 30 mins ago</p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
