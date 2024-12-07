'use client';

import React, { useState, useEffect } from 'react';
import { ArrowUpRight } from 'lucide-react';
import { ReloadIcon } from '@radix-ui/react-icons';

const CLIENT_ID =
  '352469655974-nsb7mj48ih95j1av0di5rhgknd6oeijq.apps.googleusercontent.com';
const SCOPES = 'https://www.googleapis.com/auth/drive.file';

export default function EditDocument({ documentUrl }: { documentUrl: string }) {
  const [authInstance, setAuthInstance] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initializeGapi = async () => {
      if (typeof window !== 'undefined') {
        const gapi = await import('gapi-script').then((mod) => mod.gapi);
        gapi.load('client:auth2', async () => {
          try {
            const auth = await gapi.auth2.init({
              client_id: CLIENT_ID,
              scope: SCOPES
            });
            setAuthInstance(auth);
          } catch (error) {
            console.error('Error initializing Google Auth:', error);
          }
        });
      }
    };

    initializeGapi();
  }, []);

  const signInAndEdit = async (docUrl: string) => {
    setIsLoading(true);
    if (authInstance) {
      try {
        const user = authInstance.currentUser.get();
        if (!user.isSignedIn()) {
          await authInstance.signIn();
        }
        await handleRecreate(docUrl);
      } catch (error) {
        console.error('Error during sign-in or edit:', error);
      } finally {
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  };

  const handleRecreate = async (docUrl: string) => {
    if (typeof window === 'undefined') return;
    try {
      const response = await fetch(
        `/api/proxy-download?fileUrl=${encodeURIComponent(docUrl)}`
      );
      if (!response.ok) {
        throw new Error('Failed to fetch the document through the server');
      }

      const fileBlob = await response.blob();

      const fileId = await uploadToGoogleDrive(fileBlob);

      if (!fileId) {
        console.error('Failed to upload file to Google Drive.');
        return;
      }

      const googleDriveViewerUrl = `https://drive.google.com/file/d/${fileId}/view`;

      window.open(googleDriveViewerUrl, '_blank');
    } catch (error) {
      console.error('Error in handleRecreate:', error);
    }
  };

  const uploadToGoogleDrive = async (
    fileBlob: Blob
  ): Promise<string | null> => {
    try {
      const accessToken = authInstance?.currentUser
        .get()
        .getAuthResponse().access_token;
      if (!accessToken) {
        throw new Error('Access token not found. Please log in again.');
      }

      const uploadResponse = await fetch(
        'https://www.googleapis.com/upload/drive/v3/files?uploadType=media',
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': fileBlob.type
          },
          body: fileBlob
        }
      );

      if (!uploadResponse.ok) {
        console.error(
          'Failed to upload the file to Google Drive:',
          uploadResponse.statusText
        );
        return null;
      }

      const uploadedFile = await uploadResponse.json();
      console.log('File uploaded successfully:', uploadedFile);

      const fileId = uploadedFile.id;
      if (!fileId) {
        console.error('No file ID created');
        return null;
      }
      console.log('File ID created successfully:', fileId);

      return fileId;
    } catch (error) {
      console.error('Error during file upload or conversion:', error);
      return null;
    }
  };

  return (
    <div
      onClick={!isLoading ? () => signInAndEdit(documentUrl) : undefined}
      className={`flex items-center space-x-2 rounded-lg px-3 py-2 text-sm font-medium ${isLoading ? 'text-yellow-700 ' : 'cursor-pointer text-yellow-600'} transition-all hover:bg-gray-50`}
      title="Edit the document"
    >
      {isLoading ? (
        <>
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          <ArrowUpRight className="h-4 w-4" />
        </>
      ) : (
        <>
          <span>Edit</span>
          <ArrowUpRight className="h-4 w-4" />
        </>
      )}
    </div>
  );
}
