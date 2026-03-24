import { useParams, useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PublicLayout } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock, Users, Mail, Phone, Tag, ArrowLeft, User } from 'lucide-react';
import { toast } from 'sonner';

const EventDetailPage = () => {
  const { id } = useParams();
  const { events, user, registerForEvent, registrations } = useApp();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id);

  if (!event) return (
    <PublicLayout>
      <div className="page-container text-center py-20">
        <h1 className="text-2xl font-display font-bold mb-2">Event Not Found</h1>
        <Button variant="ghost" onClick={() => navigate('/events')}>Back to Events</Button>
      </div>
    </PublicLayout>
  );

  const isRegistered = user && registrations.find(r => r.studentId === user.id && r.eventId === event.id && r.status !== 'cancelled');
  const isFull = event.registeredCount >= event.totalSeats;
  const deadlinePassed = new Date(event.registrationDeadline) < new Date();
  const seatsLeft = event.totalSeats - event.registeredCount;

  const handleRegister = () => {
    if (!user) { navigate('/login'); return; }
    if (user.role !== 'student') { toast.error('Only students can register'); return; }
    const result = registerForEvent(event.id);
    if (result.success) toast.success(result.message);
    else toast.error(result.message);
  };

  return (
    <PublicLayout>
      <div className="page-container">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="mb-4">
          <ArrowLeft className="w-4 h-4 mr-1" /> Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card overflow-hidden">
              <img src={event.posterUrl} alt={event.title} className="w-full aspect-[2/1] object-cover" />
              <div className="p-6">
                <div className="flex flex-wrap gap-2 mb-3">
                  <Badge variant="secondary">{event.category}</Badge>
                  <Badge variant="outline" className="capitalize">{event.mode}</Badge>
                  <span className={`status-badge status-${event.status}`}>{event.status}</span>
                </div>
                <h1 className="text-2xl md:text-3xl font-display font-bold mb-4">{event.title}</h1>
                <p className="text-muted-foreground mb-6">{event.fullDescription}</p>

                {event.rules && (
                  <div>
                    <h3 className="font-display font-semibold mb-2">Rules & Instructions</h3>
                    <div className="bg-muted/50 rounded-lg p-4 text-sm whitespace-pre-line text-muted-foreground">
                      {event.rules}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="glass-card p-5 space-y-4">
              <h3 className="font-display font-semibold">Event Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-primary" />{new Date(event.date).toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</div>
                <div className="flex items-center gap-3"><Clock className="w-4 h-4 text-primary" />{event.startTime} – {event.endTime}</div>
                <div className="flex items-center gap-3"><MapPin className="w-4 h-4 text-primary" />{event.venue}</div>
                <div className="flex items-center gap-3"><Users className="w-4 h-4 text-primary" />{seatsLeft} seats left of {event.totalSeats}</div>
                <div className="flex items-center gap-3"><User className="w-4 h-4 text-primary" />{event.organizerName}</div>
                <div className="flex items-center gap-3"><Tag className="w-4 h-4 text-primary" />{event.department}</div>
              </div>
              <div className="border-t border-border pt-3 text-xs text-muted-foreground">
                Registration deadline: {new Date(event.registrationDeadline).toLocaleDateString('en-IN')}
              </div>
            </div>

            <div className="glass-card p-5 space-y-3">
              <h3 className="font-display font-semibold">Contact</h3>
              <div className="space-y-2 text-sm">
                <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-muted-foreground" />{event.contactEmail}</p>
                <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-muted-foreground" />{event.contactPhone}</p>
              </div>
            </div>

            {event.status === 'approved' && (
              <div className="glass-card p-5">
                {isRegistered ? (
                  <div className="text-center">
                    <Badge className="bg-success text-success-foreground mb-2">✓ Registered</Badge>
                    <p className="text-sm text-muted-foreground">View your QR code in your dashboard.</p>
                    {user && <Button size="sm" variant="outline" className="mt-3" asChild>
                      <Link to="/student/registrations">View My Registrations</Link>
                    </Button>}
                  </div>
                ) : (
                  <Button className="w-full" size="lg" onClick={handleRegister}
                    disabled={isFull || deadlinePassed}>
                    {!user ? 'Login to Register' : isFull ? 'Event Full' : deadlinePassed ? 'Deadline Passed' : 'Register Now'}
                  </Button>
                )}
              </div>
            )}

            {event.tags.length > 0 && (
              <div className="glass-card p-5">
                <h3 className="font-display font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {event.tags.map(tag => <Badge key={tag} variant="outline" className="text-xs">{tag}</Badge>)}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default EventDetailPage;
