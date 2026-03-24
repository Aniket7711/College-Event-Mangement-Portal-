import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { EVENT_CATEGORIES, DEPARTMENTS, EventCategory, EventMode } from '@/types';

const CreateEventPage = () => {
  const { user, createEvent } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', shortDescription: '', fullDescription: '', category: 'Technical' as EventCategory,
    department: user?.department || '', targetAudience: 'All Departments', venue: '', mode: 'offline' as EventMode,
    date: '', startTime: '', endTime: '', registrationDeadline: '',
    totalSeats: 50, posterUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=800',
    rules: '', contactEmail: user?.email || '', contactPhone: '', tags: '',
  });

  const set = (k: string, v: any) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title || !form.date || !form.venue) { toast.error('Fill all required fields'); return; }
    try {
      await createEvent({
        ...form,
        tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
        totalSeats: Number(form.totalSeats),
      });
      toast.success('Event created and submitted for approval!');
      navigate('/organizer/events');
    } catch {
      toast.error('Failed to create event');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-2xl space-y-6">
        <h1 className="text-2xl font-display font-bold">Create New Event</h1>
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <div>
            <Label>Event Title *</Label>
            <Input value={form.title} onChange={e => set('title', e.target.value)} placeholder="Enter event title" required />
          </div>
          <div>
            <Label>Short Description</Label>
            <Input value={form.shortDescription} onChange={e => set('shortDescription', e.target.value)} placeholder="Brief one-liner" />
          </div>
          <div>
            <Label>Full Description</Label>
            <Textarea value={form.fullDescription} onChange={e => set('fullDescription', e.target.value)} rows={4} placeholder="Detailed description" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <Label>Category</Label>
              <Select value={form.category} onValueChange={v => set('category', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{EVENT_CATEGORIES.map(c => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Department</Label>
              <Select value={form.department} onValueChange={v => set('department', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Target Audience</Label>
              <Select value={form.targetAudience} onValueChange={v => set('targetAudience', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">All Departments</SelectItem>
                  {DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <Label>Venue *</Label>
              <Input value={form.venue} onChange={e => set('venue', e.target.value)} required />
            </div>
            <div>
              <Label>Mode</Label>
              <Select value={form.mode} onValueChange={v => set('mode', v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="offline">Offline</SelectItem>
                  <SelectItem value="online">Online</SelectItem>
                  <SelectItem value="hybrid">Hybrid</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div><Label>Date *</Label><Input type="date" value={form.date} onChange={e => set('date', e.target.value)} required /></div>
            <div><Label>Start Time</Label><Input type="time" value={form.startTime} onChange={e => set('startTime', e.target.value)} /></div>
            <div><Label>End Time</Label><Input type="time" value={form.endTime} onChange={e => set('endTime', e.target.value)} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Registration Deadline</Label><Input type="date" value={form.registrationDeadline} onChange={e => set('registrationDeadline', e.target.value)} /></div>
            <div><Label>Total Seats</Label><Input type="number" value={form.totalSeats} onChange={e => set('totalSeats', e.target.value)} min={1} /></div>
          </div>
          <div>
            <Label>Poster Image URL</Label>
            <Input value={form.posterUrl} onChange={e => set('posterUrl', e.target.value)} />
          </div>
          <div>
            <Label>Rules / Instructions</Label>
            <Textarea value={form.rules} onChange={e => set('rules', e.target.value)} rows={3} placeholder="One rule per line" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div><Label>Contact Email</Label><Input type="email" value={form.contactEmail} onChange={e => set('contactEmail', e.target.value)} /></div>
            <div><Label>Contact Phone</Label><Input value={form.contactPhone} onChange={e => set('contactPhone', e.target.value)} /></div>
          </div>
          <div>
            <Label>Tags (comma separated)</Label>
            <Input value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="coding, hackathon, prizes" />
          </div>
          <div className="flex gap-3 pt-2">
            <Button type="submit">Submit for Approval</Button>
            <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
};

export default CreateEventPage;
