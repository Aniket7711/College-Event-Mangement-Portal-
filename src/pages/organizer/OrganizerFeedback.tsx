import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EmptyState from '@/components/shared/EmptyState';

const OrganizerFeedback = () => {
  const { user, events, feedbacks } = useApp();
  const myEvents = events.filter(e => e.organizerId === user?.id);
  const myFeedback = feedbacks.filter(f => myEvents.some(e => e.id === f.eventId));

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">Feedback Received</h1>
        {myFeedback.length === 0 ? (
          <EmptyState title="No feedback yet" message="Feedback will appear after students attend your events." />
        ) : (
          <div className="space-y-3">
            {myFeedback.map(fb => (
              <div key={fb.id} className="glass-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-sm">{fb.eventTitle}</h3>
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(n => (
                      <span key={n} className={`text-sm ${n <= fb.rating ? 'text-warning' : 'text-muted-foreground/30'}`}>★</span>
                    ))}
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{fb.comment}</p>
                <p className="text-xs text-muted-foreground mt-2">— {fb.studentName} · {new Date(fb.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default OrganizerFeedback;
