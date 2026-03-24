import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EventCard from '@/components/shared/EventCard';
import EmptyState from '@/components/shared/EmptyState';

const StudentEvents = () => {
  const { events, user } = useApp();
  
  const isEligible = (e: any) => !e.targetAudience || e.targetAudience === 'All Departments' || e.targetAudience === user?.department;
  const approved = events.filter(e => ['approved', 'completed'].includes(e.status) && isEligible(e));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">Browse Events</h1>
        {approved.length === 0 ? (
          <EmptyState title="No events available" message="Check back later for new events." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approved.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentEvents;
