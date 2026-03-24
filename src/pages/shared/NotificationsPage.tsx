import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EmptyState from '@/components/shared/EmptyState';
import { Badge } from '@/components/ui/badge';
import { Bell } from 'lucide-react';

const NotificationsPage = () => {
  const { user, notifications, markNotificationRead } = useApp();
  const myNotifs = [...notifications].sort((a, b) =>
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const typeColors: Record<string, string> = {
    success: 'bg-success/10 text-success',
    error: 'bg-destructive/10 text-destructive',
    warning: 'bg-warning/10 text-warning',
    info: 'bg-info/10 text-info',
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">Notifications</h1>
        {myNotifs.length === 0 ? (
          <EmptyState title="No notifications" message="You're all caught up!" />
        ) : (
          <div className="space-y-2">
            {myNotifs.map(n => (
              <div
                key={n.id}
                onClick={() => !n.isRead && markNotificationRead(n.id)}
                className={`glass-card p-4 cursor-pointer transition-colors ${!n.isRead ? 'border-l-4 border-l-primary' : 'opacity-70'}`}
              >
                <div className="flex items-start gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${typeColors[n.type]}`}>
                    <Bell className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm">{n.title}</p>
                      {!n.isRead && <Badge className="bg-primary text-primary-foreground text-[10px]">New</Badge>}
                    </div>
                    <p className="text-sm text-muted-foreground">{n.message}</p>
                    <p className="text-xs text-muted-foreground mt-1">{new Date(n.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default NotificationsPage;
