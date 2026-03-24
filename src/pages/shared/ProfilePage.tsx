import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { useState } from 'react';
import { DEPARTMENTS } from '@/types';

const ROLL_NUMBER_REGEX = /^\d[A-Z]\d{2}[A-Z]{2,4}\d{4,5}$/;

const ProfilePage = () => {
  const { user, updateProfile } = useApp();
  const [form, setForm] = useState({
    name: user?.name || '',
    rollNumber: user?.rollNumber || '',
    department: user?.department || '',
    year: user?.year || '',
  });
  const [saving, setSaving] = useState(false);

  const rollNumberValid = !form.rollNumber || ROLL_NUMBER_REGEX.test(form.rollNumber);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.rollNumber && !rollNumberValid) {
      toast.error('Invalid roll number format. Example: 2K21CSUN01007');
      return;
    }
    setSaving(true);
    try {
      await updateProfile(form);
      toast.success('Profile updated!');
    } catch {
      toast.error('Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-xl space-y-6">
        <h1 className="text-2xl font-display font-bold">My Profile</h1>
        <div className="glass-card p-6">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center text-primary font-display font-bold text-xl">
              {user?.name?.split(' ').map(n => n[0]).join('')}
            </div>
            <div>
              <p className="font-semibold">{user?.name}</p>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
              <p className="text-xs text-muted-foreground capitalize">{user?.role} · {user?.rollNumber}</p>
            </div>
          </div>
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <Label>Full Name</Label>
              <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div>
              <Label>Roll Number</Label>
              <Input
                value={form.rollNumber}
                onChange={e => setForm(p => ({ ...p, rollNumber: e.target.value.toUpperCase() }))}
                placeholder="2K21CSUN01007"
                maxLength={13}
              />
              {form.rollNumber && !rollNumberValid && (
                <p className="text-xs text-destructive mt-1">Format: 2K21CSUN01007 (digit, letter, 2-digit year, dept code, number)</p>
              )}
            </div>
            <div>
              <Label>Department</Label>
              <Select value={form.department} onValueChange={v => setForm(p => ({ ...p, department: v }))}>
                <SelectTrigger><SelectValue placeholder="Select department" /></SelectTrigger>
                <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div>
              <Label>Year</Label>
              <Select value={form.year} onValueChange={v => setForm(p => ({ ...p, year: v }))}>
                <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="1st">1st Year</SelectItem>
                  <SelectItem value="2nd">2nd Year</SelectItem>
                  <SelectItem value="3rd">3rd Year</SelectItem>
                  <SelectItem value="4th">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
