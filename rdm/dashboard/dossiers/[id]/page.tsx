import Dossiers from './dossiers';

export default function DossiersPage({ params }: { params: any }) {
  return <Dossiers dossierId={params?.id} />;
}
