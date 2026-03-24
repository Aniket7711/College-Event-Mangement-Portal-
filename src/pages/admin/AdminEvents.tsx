import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';

const AdminEvents = () => {
  const { events } = useApp();

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">All Events</h1>
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Title</th>
                <th className="text-left p-3 font-medium">Category</th>
                <th className="text-left p-3 font-medium">Organizer</th>
                <th className="text-left p-3 font-medium">Date</th>
                <th className="text-left p-3 font-medium">Registrations</th>
                <th className="text-left p-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody>
              {events.map(e => (
                <tr key={e.id} className="border-t border-border hover:bg-muted/30">
                  <td className="p-3"><Link to={`/events/${e.id}`} className="text-primary hover:underline">{e.title}</Link></td>
                  <td className="p-3">{e.category}</td>
                  <td className="p-3 text-muted-foreground">{e.organizerName}</td>
                  <td className="p-3 text-muted-foreground">{new Date(e.date).toLocaleDateString('en-IN')}</td>
                  <td className="p-3">{e.registeredCount}/{e.totalSeats}</td>
                  <td className="p-3"><span className={`status-badge status-${e.status}`}>{e.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminEvents;
