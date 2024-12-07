import RegulationDetails from './regulation-details';

export default function RegulationDetailsPage({ params }: { params: any }) {
  return <RegulationDetails regulationId={params?.id} />;
}
