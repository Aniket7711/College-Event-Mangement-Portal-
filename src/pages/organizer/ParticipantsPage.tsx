import { useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';

const ParticipantsPage = () => {
  const { id } = useParams();
  const { events, registrations } = useApp();
  const event = events.find(e => e.id === id);
  const participants = registrations.filter(r => r.eventId === id && r.status !== 'cancelled');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Participants</h1>
          <p className="text-muted-foreground">{event?.title} — {participants.length} registered</p>
        </div>
        {participants.length === 0 ? (
          <EmptyState title="No participants" message="No one has registered yet." />
        ) : (
          <div className="glass-card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-muted/50">
                <tr>
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Roll No</th>
                  <th className="text-left p-3 font-medium">Email</th>
                  <th className="text-left p-3 font-medium">Status</th>
                  <th className="text-left p-3 font-medium">Registered At</th>
                </tr>
              </thead>
              <tbody>
                {participants.map(p => (
                  <tr key={p.id} className="border-t border-border">
                    <td className="p-3">{p.studentName}</td>
                    <td className="p-3">{p.studentRollNumber}</td>
                    <td className="p-3">{p.studentEmail}</td>
                    <td className="p-3">
                      <Badge variant={p.status === 'attended' ? 'default' : 'secondary'}>
                        {p.status === 'attended' ? '✓ Attended' : 'Registered'}
                      </Badge>
                    </td>
                    <td className="p-3 text-muted-foreground">{new Date(p.registeredAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default ParticipantsPage;
