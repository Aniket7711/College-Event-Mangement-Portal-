import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import { BarChart3, TrendingUp, Users, Calendar } from 'lucide-react';

const AdminAnalytics = () => {
  const { events, registrations, users, feedbacks } = useApp();
  const categories = [...new Set(events.map(e => e.category))];

  const categoryData = categories.map(cat => ({
    category: cat,
    events: events.filter(e => e.category === cat).length,
    registrations: registrations.filter(r => {
      const evt = events.find(e => e.id === r.eventId);
      return evt?.category === cat && r.status !== 'cancelled';
    }).length,
  }));

  const avgRating = feedbacks.length > 0
    ? (feedbacks.reduce((sum, f) => sum + f.rating, 0) / feedbacks.length).toFixed(1)
    : 'N/A';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">Analytics</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="glass-card p-5 text-center">
            <BarChart3 className="w-8 h-8 text-primary mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{avgRating}</p>
            <p className="text-sm text-muted-foreground">Avg. Event Rating</p>
          </div>
          <div className="glass-card p-5 text-center">
            <TrendingUp className="w-8 h-8 text-success mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">
              {registrations.filter(r => r.status === 'attended').length}
            </p>
            <p className="text-sm text-muted-foreground">Total Check-ins</p>
          </div>
          <div className="glass-card p-5 text-center">
            <Users className="w-8 h-8 text-warning mx-auto mb-2" />
            <p className="text-2xl font-display font-bold">{feedbacks.length}</p>
            <p className="text-sm text-muted-foreground">Feedback Received</p>
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-4">Events by Category</h3>
          <div className="space-y-3">
            {categoryData.map(item => (
              <div key={item.category}>
                <div className="flex justify-between text-sm mb-1">
                  <span>{item.category}</span>
                  <span className="text-muted-foreground">{item.events} events · {item.registrations} regs</span>
                </div>
                <div className="w-full h-3 bg-muted rounded-full">
                  <div className="h-3 bg-primary rounded-full transition-all"
                    style={{ width: `${(item.events / Math.max(events.length, 1)) * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="glass-card p-5">
          <h3 className="font-display font-semibold mb-4">Monthly Activity</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold">{events.filter(e => e.status === 'approved').length}</p>
              <p className="text-xs text-muted-foreground">Active Events</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold">{events.filter(e => e.status === 'completed').length}</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold">{users.filter(u => u.isActive).length}</p>
              <p className="text-xs text-muted-foreground">Active Users</p>
            </div>
            <div className="p-3 bg-muted/50 rounded-lg">
              <p className="text-lg font-bold">{registrations.filter(r => r.status === 'cancelled').length}</p>
              <p className="text-xs text-muted-foreground">Cancellations</p>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminAnalytics;
