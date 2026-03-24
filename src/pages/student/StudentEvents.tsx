import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EventCard from '@/components/shared/EventCard';
import EmptyState from '@/components/shared/EmptyState';

const StudentEvents = () => {
  const { events } = useApp();
  const approved = events.filter(e => e.status === 'approved');

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
