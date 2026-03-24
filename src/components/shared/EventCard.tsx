import { Link } from 'react-router-dom';
import { Calendar, MapPin, Users, Tag } from 'lucide-react';
import { Event } from '@/types';
import { Badge } from '@/components/ui/badge';

const statusColors: Record<string, string> = {
  pending: 'status-pending',
  approved: 'status-approved',
  rejected: 'status-rejected',
  completed: 'status-completed',
  cancelled: 'status-cancelled',
};

const EventCard = ({ event, showStatus = false }: { event: Event; showStatus?: boolean }) => (
  <Link to={`/events/${event.id}`} className="glass-card overflow-hidden group hover:shadow-md transition-all duration-300">
    <div className="aspect-[16/9] overflow-hidden">
      <img src={event.posterUrl} alt={event.title}
        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
    </div>
    <div className="p-4">
      <div className="flex items-center gap-2 mb-2">
        <Badge variant="secondary" className="text-xs">{event.category}</Badge>
        {showStatus && <span className={`status-badge ${statusColors[event.status]}`}>{event.status}</span>}
      </div>
      <h3 className="font-display font-semibold text-foreground line-clamp-1 mb-1">{event.title}</h3>
      <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{event.shortDescription}</p>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <Calendar className="w-3.5 h-3.5" />
          {new Date(event.date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
          {' · '}{event.startTime}
        </div>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5" />{event.venue}
        </div>
        <div className="flex items-center gap-1.5">
          <Users className="w-3.5 h-3.5" />{event.registeredCount}/{event.totalSeats} registered
        </div>
      </div>
    </div>
  </Link>
);

export default EventCard;
