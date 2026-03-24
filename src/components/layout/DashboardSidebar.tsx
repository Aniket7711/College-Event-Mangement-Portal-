import { Link, useLocation } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import {
  LayoutDashboard, Calendar, Users, FileText, BarChart3, Settings,
  PlusCircle, QrCode, MessageSquare, Bell, User, CheckCircle, ClipboardList
} from 'lucide-react';

interface SidebarLink {
  label: string;
  path: string;
  icon: React.ReactNode;
}

const DashboardSidebar = () => {
  const { user } = useApp();
  const location = useLocation();

  if (!user) return null;

  const linksByRole: Record<string, SidebarLink[]> = {
    student: [
      { label: 'Dashboard', path: '/student/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Browse Events', path: '/student/events', icon: <Calendar className="w-4 h-4" /> },
      { label: 'My Registrations', path: '/student/registrations', icon: <ClipboardList className="w-4 h-4" /> },
      { label: 'Attendance', path: '/student/attendance', icon: <CheckCircle className="w-4 h-4" /> },
      { label: 'Notifications', path: '/student/notifications', icon: <Bell className="w-4 h-4" /> },
      { label: 'Profile', path: '/student/profile', icon: <User className="w-4 h-4" /> },
    ],
    organizer: [
      { label: 'Dashboard', path: '/organizer/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'My Events', path: '/organizer/events', icon: <Calendar className="w-4 h-4" /> },
      { label: 'Create Event', path: '/organizer/events/create', icon: <PlusCircle className="w-4 h-4" /> },
      { label: 'Feedback', path: '/organizer/feedback', icon: <MessageSquare className="w-4 h-4" /> },
      { label: 'Notifications', path: '/organizer/notifications', icon: <Bell className="w-4 h-4" /> },
      { label: 'Profile', path: '/organizer/profile', icon: <User className="w-4 h-4" /> },
    ],
    admin: [
      { label: 'Dashboard', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Users', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
      { label: 'All Events', path: '/admin/events', icon: <Calendar className="w-4 h-4" /> },
      { label: 'Pending Approval', path: '/admin/events/pending', icon: <FileText className="w-4 h-4" /> },
      { label: 'Registrations', path: '/admin/registrations', icon: <ClipboardList className="w-4 h-4" /> },
      { label: 'Analytics', path: '/admin/analytics', icon: <BarChart3 className="w-4 h-4" /> },
      { label: 'Notifications', path: '/admin/notifications', icon: <Bell className="w-4 h-4" /> },
    ],
  };

  const links = linksByRole[user.role] || [];

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-sidebar text-sidebar-foreground border-r border-sidebar-border min-h-[calc(100vh-4rem)]">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-sidebar-primary flex items-center justify-center text-sidebar-primary-foreground font-semibold text-sm">
            {user.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium truncate">{user.name}</p>
            <p className="text-xs text-sidebar-foreground/60 capitalize">{user.role}</p>
          </div>
        </div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {links.map(link => (
          <Link
            key={link.path}
            to={link.path}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              location.pathname === link.path
                ? 'bg-sidebar-primary text-sidebar-primary-foreground'
                : 'text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-accent-foreground'
            }`}
          >
            {link.icon}
            {link.label}
          </Link>
        ))}
      </nav>
    </aside>
  );
};

export default DashboardSidebar;
