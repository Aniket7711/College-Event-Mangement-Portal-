import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import StatsCard from '@/components/shared/StatsCard';
import EventCard from '@/components/shared/EventCard';
import { Calendar, CheckCircle, Clock, ClipboardList } from 'lucide-react';

const StudentDashboard = () => {
  const { user, events, registrations } = useApp();
  const myRegs = registrations.filter(r => r.studentId === user?.id && r.status !== 'cancelled');
  const attended = myRegs.filter(r => r.status === 'attended').length;
  const upcoming = myRegs.filter(r => {
    const evt = events.find(e => e.id === r.eventId);
    return evt && new Date(evt.date) >= new Date() && r.status === 'registered';
  }).length;
  const approvedEvents = events.filter(e => e.status === 'approved').slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Here's your activity overview</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Registrations" value={myRegs.length} icon={ClipboardList} />
          <StatsCard title="Upcoming Events" value={upcoming} icon={Calendar} />
          <StatsCard title="Events Attended" value={attended} icon={CheckCircle} />
          <StatsCard title="Pending" value={myRegs.filter(r => r.status === 'registered').length} icon={Clock} />
        </div>
        <div>
          <h2 className="text-lg font-display font-semibold mb-4">Recommended Events</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {approvedEvents.map(e => <EventCard key={e.id} event={e} />)}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
