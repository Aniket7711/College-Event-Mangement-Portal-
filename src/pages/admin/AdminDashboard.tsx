import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import StatsCard from '@/components/shared/StatsCard';
import { Users, Calendar, FileText, CheckCircle, Clock, BarChart3, UserCheck, UserX } from 'lucide-react';

const AdminDashboard = () => {
  const { users, events, registrations } = useApp();
  const students = users.filter(u => u.role === 'student');
  const organizers = users.filter(u => u.role === 'organizer');
  const pending = events.filter(e => e.status === 'pending');
  const approved = events.filter(e => e.status === 'approved');
  const attended = registrations.filter(r => r.status === 'attended');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Platform overview and management</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Users" value={users.length} icon={Users} />
          <StatsCard title="Students" value={students.length} icon={UserCheck} />
          <StatsCard title="Organizers" value={organizers.length} icon={UserX} />
          <StatsCard title="Total Events" value={events.length} icon={Calendar} />
          <StatsCard title="Approved" value={approved.length} icon={CheckCircle} />
          <StatsCard title="Pending Approval" value={pending.length} icon={Clock} />
          <StatsCard title="Registrations" value={registrations.filter(r => r.status !== 'cancelled').length} icon={FileText} />
          <StatsCard title="Attendance" value={attended.length} icon={BarChart3} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold mb-3">Recent Events</h3>
            <div className="space-y-2">
              {events.slice(0, 5).map(e => (
                <div key={e.id} className="flex items-center justify-between text-sm py-2 border-b border-border last:border-0">
                  <span className="truncate">{e.title}</span>
                  <span className={`status-badge status-${e.status}`}>{e.status}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="glass-card p-5">
            <h3 className="font-display font-semibold mb-3">User Distribution</h3>
            <div className="space-y-3">
              {[
                { label: 'Students', count: students.length, total: users.length },
                { label: 'Organizers', count: organizers.length, total: users.length },
                { label: 'Admins', count: users.filter(u => u.role === 'admin').length, total: users.length },
              ].map(item => (
                <div key={item.label}>
                  <div className="flex justify-between text-sm mb-1">
                    <span>{item.label}</span><span>{item.count}</span>
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full">
                    <div className="h-2 bg-primary rounded-full transition-all" style={{ width: `${(item.count / Math.max(item.total, 1)) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminDashboard;
