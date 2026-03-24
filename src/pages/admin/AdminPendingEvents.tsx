import { useState } from 'react';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { Check, X, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminPendingEvents = () => {
  const { events, approveEvent, rejectEvent } = useApp();
  const pending = events.filter(e => e.status === 'pending');
  const [rejectId, setRejectId] = useState<string | null>(null);
  const [reason, setReason] = useState('');

  const handleReject = async (id: string) => {
    if (!reason.trim()) { toast.error('Please provide a reason'); return; }
    await rejectEvent(id, reason);
    toast.success('Event rejected');
    setRejectId(null);
    setReason('');
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">Pending Approval</h1>
        {pending.length === 0 ? (
          <EmptyState title="No pending events" message="All events have been reviewed." />
        ) : (
          <div className="space-y-3">
            {pending.map(evt => (
              <div key={evt.id} className="glass-card p-4">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{evt.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      By {evt.organizerName} · {evt.category} · {new Date(evt.date).toLocaleDateString('en-IN')}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">{evt.shortDescription}</p>
                  </div>
                  <div className="flex gap-2 flex-shrink-0">
                    <Button size="sm" variant="outline" asChild>
                      <Link to={`/events/${evt.id}`}><Eye className="w-3 h-3 mr-1" />View</Link>
                    </Button>
                    <Button size="sm" onClick={async () => { await approveEvent(evt.id); toast.success('Event approved!'); }}>
                      <Check className="w-3 h-3 mr-1" />Approve
                    </Button>
                    <Button size="sm" variant="destructive" onClick={() => setRejectId(rejectId === evt.id ? null : evt.id)}>
                      <X className="w-3 h-3 mr-1" />Reject
                    </Button>
                  </div>
                </div>
                {rejectId === evt.id && (
                  <div className="mt-3 flex gap-2">
                    <Input placeholder="Rejection reason..." value={reason} onChange={e => setReason(e.target.value)} />
                    <Button size="sm" variant="destructive" onClick={() => handleReject(evt.id)}>Confirm</Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default AdminPendingEvents;
