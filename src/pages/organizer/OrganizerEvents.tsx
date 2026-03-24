import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { PlusCircle, Edit, Trash2, Users, QrCode, Eye, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

const OrganizerEvents = () => {
  const { user, events, registrations, deleteEvent, completeEvent, cancelEvent } = useApp();
  const myEvents = events.filter(e => e.organizerId === user?.id);

  const handleDelete = (id: string) => {
    const evt = events.find(e => e.id === id);
    if (evt && (evt.status === 'pending' || evt.status === 'cancelled')) {
      deleteEvent(id);
      toast.success('Event deleted');
    } else {
      toast.error('Can only delete pending or cancelled events');
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-display font-bold">My Events</h1>
          <Button asChild><Link to="/organizer/events/create"><PlusCircle className="w-4 h-4 mr-2" />Create Event</Link></Button>
        </div>

        {myEvents.length === 0 ? (
          <EmptyState title="No events yet" message="Create your first event!" />
        ) : (
          <div className="space-y-3">
            {myEvents.map(evt => {
              const regs = registrations.filter(r => r.eventId === evt.id && r.status !== 'cancelled').length;
              return (
                <div key={evt.id} className="glass-card p-4">
                  <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{evt.title}</h3>
                        <span className={`status-badge status-${evt.status}`}>{evt.status}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {new Date(evt.date).toLocaleDateString('en-IN')} · {evt.venue} · {regs}/{evt.totalSeats} registered
                      </p>
                      {evt.rejectionReason && (
                        <p className="text-sm text-destructive mt-1">Reason: {evt.rejectionReason}</p>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link to={`/events/${evt.id}`}><Eye className="w-3 h-3 mr-1" />View</Link>
                      </Button>
                      {evt.status === 'pending' && (
                        <Button size="sm" variant="outline" asChild>
                          <Link to={`/organizer/events/${evt.id}/edit`}><Edit className="w-3 h-3 mr-1" />Edit</Link>
                        </Button>
                      )}
                      {evt.status === 'approved' && (
                        <>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/organizer/events/${evt.id}/participants`}><Users className="w-3 h-3 mr-1" />Participants</Link>
                          </Button>
                          <Button size="sm" variant="outline" asChild>
                            <Link to={`/organizer/events/${evt.id}/scanner`}><QrCode className="w-3 h-3 mr-1" />Scanner</Link>
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => { completeEvent(evt.id); toast.success('Marked complete'); }}>
                            <CheckCircle className="w-3 h-3 mr-1" />Complete
                          </Button>
                        </>
                      )}
                      {(evt.status === 'pending' || evt.status === 'cancelled') && (
                        <Button size="sm" variant="destructive" onClick={() => handleDelete(evt.id)}>
                          <Trash2 className="w-3 h-3 mr-1" />Delete
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerEvents;
