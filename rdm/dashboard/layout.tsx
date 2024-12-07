import DashboardHeader from '@/components/layout/dashboard-header';
import SideBar from '@/components/layout/sidebar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { rdmNavItems } from '@/constants/data';

export const metadata = {
  title: 'Feyti Medical Group - Pioneering AI-Driven Drug Safety Solutions',
  description: `Feyti Medical Group offers a range of services including pharmacovigilance, 
    clinical trial design and management, regulatory consulting, data management, 
    and statistical analysis. Explore how we can meet your pharmaceutical needs today.`
};

export default function DashboardLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <DashboardHeader />
      <div className="flex h-screen overflow-hidden">
        <SideBar navItems={rdmNavItems} />
        <main className="flex-1 overflow-hidden pt-16">
          <ScrollArea className="h-full">
            <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">{children}</div>
          </ScrollArea>
        </main>
      </div>
    </>
  );
}
