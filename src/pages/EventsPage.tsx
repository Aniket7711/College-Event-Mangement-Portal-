import { useState, useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import { PublicLayout } from '@/components/layout/Layouts';
import EventCard from '@/components/shared/EventCard';
import EmptyState from '@/components/shared/EmptyState';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search } from 'lucide-react';
import { EVENT_CATEGORIES, DEPARTMENTS } from '@/types';

const EventsPage = () => {
  const { events } = useApp();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');
  const [department, setDepartment] = useState('all');
  const [mode, setMode] = useState('all');
  const [sort, setSort] = useState('newest');

  const filtered = useMemo(() => {
    let result = events.filter(e => e.status === 'approved');
    if (search) result = result.filter(e =>
      e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.shortDescription.toLowerCase().includes(search.toLowerCase())
    );
    if (category !== 'all') result = result.filter(e => e.category === category);
    if (department !== 'all') result = result.filter(e => e.department === department);
    if (mode !== 'all') result = result.filter(e => e.mode === mode);

    switch (sort) {
      case 'newest': result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()); break;
      case 'upcoming': result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); break;
      case 'popular': result.sort((a, b) => b.registeredCount - a.registeredCount); break;
    }
    return result;
  }, [events, search, category, department, mode, sort]);

  return (
    <PublicLayout>
      <div className="page-container">
        <h1 className="text-3xl font-display font-bold mb-2">Explore Events</h1>
        <p className="text-muted-foreground mb-6">Discover events happening on campus</p>

        <div className="glass-card p-4 mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input placeholder="Search events..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={category} onValueChange={setCategory}>
              <SelectTrigger className="w-full lg:w-40"><SelectValue placeholder="Category" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {EVENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={department} onValueChange={setDepartment}>
              <SelectTrigger className="w-full lg:w-44"><SelectValue placeholder="Department" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Depts</SelectItem>
                {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
              </SelectContent>
            </Select>
            <Select value={mode} onValueChange={setMode}>
              <SelectTrigger className="w-full lg:w-36"><SelectValue placeholder="Mode" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Modes</SelectItem>
                <SelectItem value="offline">Offline</SelectItem>
                <SelectItem value="online">Online</SelectItem>
                <SelectItem value="hybrid">Hybrid</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full lg:w-36"><SelectValue placeholder="Sort" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest</SelectItem>
                <SelectItem value="upcoming">Upcoming</SelectItem>
                <SelectItem value="popular">Popular</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {filtered.length === 0 ? (
          <EmptyState title="No events found" message="Try adjusting your filters." />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(event => <EventCard key={event.id} event={event} />)}
          </div>
        )}
      </div>
    </PublicLayout>
  );
};

export default EventsPage;
