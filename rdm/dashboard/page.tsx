'use client';
import OrgAdminDashboard from '@/components/dashboards/org-admin-dashboard';
import { useLocalStorage } from '@/hooks/use-local-storage';

export default function DashboardHome() {
  const [activeMembership, setActiveMembership] = useLocalStorage(
    'membership',
    null
  );
  const role = activeMembership?.role?.name;

  switch (role) {
    case 'business_admin':
    case 'org_admin':
      return (
        <div className="h-full">
          <OrgAdminDashboard />
        </div>
      );
      break;
    case 'super_admin':
      return <div className="h-full">Super Admin Dashboard</div>;
      break;

    default:
      return <div className="h-full">Loading...</div>;
      break;
  }
}
