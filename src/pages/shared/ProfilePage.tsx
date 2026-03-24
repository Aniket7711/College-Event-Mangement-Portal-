import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { useState } from 'react';

const ProfilePage = () => {
  const { user, updateProfile } = useApp();
  const [form, setForm] = useState({ name: user?.name || '', department: user?.department || '', year: user?.year || '' });

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    await updateProfile(form);
    toast.success('Profile updated!');
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
              <Label>Department</Label>
              <Input value={form.department} onChange={e => setForm(p => ({ ...p, department: e.target.value }))} />
            </div>
            <div>
              <Label>Year</Label>
              <Input value={form.year} onChange={e => setForm(p => ({ ...p, year: e.target.value }))} />
            </div>
            <Button type="submit">Save Changes</Button>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default ProfilePage;
