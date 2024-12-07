import Documents from './documents';
import { storage } from '@/lib/firebase/firebase';
import { ref, listAll, getDownloadURL } from 'firebase/storage';

export default function DocumentsPage() {
  return <Documents />;
}
