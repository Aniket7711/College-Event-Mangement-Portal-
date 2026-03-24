import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { QrCode, X, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Textarea } from '@/components/ui/textarea';

const StudentRegistrations = () => {
  const { user, registrations, events, cancelRegistration, submitFeedback, feedbacks } = useApp();
  const [showQR, setShowQR] = useState<string | null>(null);
  const [feedbackFor, setFeedbackFor] = useState<string | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const myRegs = registrations.filter(r => r.studentId === user?.id && r.status !== 'cancelled');

  const handleCancel = async (regId: string) => {
    await cancelRegistration(regId);
    toast.success('Registration cancelled');
  };

  const handleFeedback = async (eventId: string) => {
    if (!comment.trim()) { toast.error('Please add a comment'); return; }
    await submitFeedback(eventId, rating, comment);
    toast.success('Feedback submitted!');
    setFeedbackFor(null);
    setComment('');
    setRating(5);
  };

  if (myRegs.length === 0) return (
    <DashboardLayout><EmptyState title="No registrations yet" message="Browse events and register!" /></DashboardLayout>
  );

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">My Registrations</h1>
        <div className="space-y-3">
          {myRegs.map(reg => {
            const evt = events.find(e => e.id === reg.eventId);
            const hasFeedback = feedbacks.find(f => f.eventId === reg.eventId && f.studentId === user?.id);
            return (
              <div key={reg.id} className="glass-card p-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="font-semibold">{reg.eventTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {evt && new Date(evt.date).toLocaleDateString('en-IN')} · {evt?.venue}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant={reg.status === 'attended' ? 'default' : 'secondary'}>
                        {reg.status === 'attended' ? '✓ Attended' : 'Registered'}
                      </Badge>
                      {reg.checkedInAt && (
                        <span className="text-xs text-muted-foreground">
                          Checked in: {new Date(reg.checkedInAt).toLocaleString()}
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline" onClick={() => setShowQR(showQR === reg.id ? null : reg.id)}>
                      <QrCode className="w-4 h-4 mr-1" /> QR Code
                    </Button>
                    {reg.status === 'attended' && !hasFeedback && (
                      <Button size="sm" variant="outline" onClick={() => setFeedbackFor(reg.eventId)}>
                        <MessageSquare className="w-4 h-4 mr-1" /> Feedback
                      </Button>
                    )}
                    {reg.status === 'registered' && evt && new Date(evt.registrationDeadline) > new Date() && (
                      <Button size="sm" variant="destructive" onClick={() => handleCancel(reg.id)}>
                        <X className="w-4 h-4 mr-1" /> Cancel
                      </Button>
                    )}
                  </div>
                </div>
                {showQR === reg.id && (
                  <div className="mt-4 flex flex-col items-center p-4 bg-card rounded-lg border border-border">
                    <QRCodeSVG value={reg.qrToken} size={200} />
                    <p className="text-xs text-muted-foreground mt-2">Show this at the event entrance</p>
                    <p className="text-xs text-muted-foreground font-mono mt-1">{reg.qrToken.slice(0, 8)}...</p>
                  </div>
                )}
                {feedbackFor === reg.eventId && (
                  <div className="mt-4 p-4 bg-muted/50 rounded-lg space-y-3">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">Rating:</span>
                      {[1,2,3,4,5].map(n => (
                        <button key={n} onClick={() => setRating(n)} className={`text-lg ${n <= rating ? 'text-warning' : 'text-muted-foreground/30'}`}>★</button>
                      ))}
                    </div>
                    <Textarea placeholder="Share your experience..." value={comment} onChange={e => setComment(e.target.value)} rows={3} />
                    <div className="flex gap-2">
                      <Button size="sm" onClick={() => handleFeedback(reg.eventId)}>Submit</Button>
                      <Button size="sm" variant="ghost" onClick={() => setFeedbackFor(null)}>Cancel</Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
};

export default StudentRegistrations;
