import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import StatsCard from '@/components/shared/StatsCard';
import { Calendar, CheckCircle, Users, FileText } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '@/components/ui/badge';

const OrganizerDashboard = () => {
  const { user, events, registrations } = useApp();
  const myEvents = events.filter(e => e.organizerId === user?.id);
  const published = myEvents.filter(e => e.status === 'approved');
  const totalRegs = registrations.filter(r => myEvents.some(e => e.id === r.eventId) && r.status !== 'cancelled').length;
  const totalAttended = registrations.filter(r => myEvents.some(e => e.id === r.eventId) && r.status === 'attended').length;

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Organizer Dashboard</h1>
          <p className="text-muted-foreground">Manage your events and track performance</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Events" value={myEvents.length} icon={Calendar} />
          <StatsCard title="Published" value={published.length} icon={FileText} />
          <StatsCard title="Registrations" value={totalRegs} icon={Users} />
          <StatsCard title="Attendance" value={totalAttended} icon={CheckCircle} />
        </div>

        <div>
          <h2 className="text-lg font-display font-semibold mb-4">Recent Events</h2>
          <div className="space-y-3">
            {myEvents.slice(0, 5).map(evt => (
              <Link key={evt.id} to={`/events/${evt.id}`} className="glass-card p-4 flex items-center justify-between hover:shadow-md transition-shadow">
                <div>
                  <h3 className="font-semibold">{evt.title}</h3>
                  <p className="text-sm text-muted-foreground">{new Date(evt.date).toLocaleDateString('en-IN')} · {evt.venue}</p>
                </div>
                <Badge variant={evt.status === 'approved' ? 'default' : 'secondary'} className={`status-${evt.status}`}>
                  {evt.status}
                </Badge>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default OrganizerDashboard;
