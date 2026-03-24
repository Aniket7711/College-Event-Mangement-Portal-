import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { EVENT_CATEGORIES, DEPARTMENTS } from '@/types';

const EditEventPage = () => {
  const { id } = useParams();
  const { events, updateEvent, user } = useApp();
  const navigate = useNavigate();
  const event = events.find(e => e.id === id && e.organizerId === user?.id);

  const [form, setForm] = useState<any>({});

  useEffect(() => {
    if (event) setForm({ ...event, tags: event.tags.join(', ') });
  }, [event]);

  if (!event) return <DashboardLayout><p className="text-muted-foreground">Event not found.</p></DashboardLayout>;

  const set = (k: string, v: any) => setForm((p: any) => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateEvent(event.id, { ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) });
    toast.success('Event updated!');
    navigate('/organizer/events');
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-display font-bold">Edit Event</h1>
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div><Label>Title</Label><Input value={form.title || ''} onChange={e => set('title', e.target.value)} required /></div>
          <div><Label>Short Description</Label><Input value={form.shortDescription || ''} onChange={e => set('shortDescription', e.target.value)} /></div>
          <div><Label>Full Description</Label><Textarea value={form.fullDescription || ''} onChange={e => set('fullDescription', e.target.value)} rows={4} /></div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category || ''} onValueChange={v => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EVENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Select value={form.department || ''} onValueChange={v => set('department', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Audience</Label>
              <Select value={form.targetAudience || 'All Departments'} onValueChange={v => set('targetAudience', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Venue</Label><Input value={form.venue || ''} onChange={e => set('venue', e.target.value)} /></div>
            <div><Label>Date</Label><Input type="date" value={form.date || ''} onChange={e => set('date', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Start Time</Label><Input type="time" value={form.startTime || ''} onChange={e => set('startTime', e.target.value)} /></div>
            <div><Label>End Time</Label><Input type="time" value={form.endTime || ''} onChange={e => set('endTime', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><Label>Registration Deadline</Label><Input type="date" value={form.registrationDeadline || ''} onChange={e => set('registrationDeadline', e.target.value)} /></div>
            <div><Label>Total Seats</Label><Input type="number" value={form.totalSeats || ''} onChange={e => set('totalSeats', Number(e.target.value))} /></div>
          </div>
          <div><Label>Poster URL</Label><Input value={form.posterUrl || ''} onChange={e => set('posterUrl', e.target.value)} /></div>
          <div><Label>Rules</Label><Textarea value={form.rules || ''} onChange={e => set('rules', e.target.value)} rows={3} /></div>
          <div><Label>Tags</Label><Input value={form.tags || ''} onChange={e => set('tags', e.target.value)} /></div>
          <div className="flex gap-3">
            <Button type="submit">Save Changes</Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default EditEventPage;
