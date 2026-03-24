import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Calendar, Menu, X, Bell, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const Navbar = () => {
  const { user, logout, notifications } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.isRead).length;

  const getDashboardPath = () => {
    if (!user) return '/login';
    return `/${user.role}/dashboard`;
  };

  const isActive = (path: string) => location.pathname === path;

  const navLinks = [
    { label: user ? 'Dashboard' : 'Home', path: user ? `/${user.role}/dashboard` : '/' },
    { label: 'Events', path: '/events' },
    { label: 'About', path: '/about' },
  ];

  if (user?.role !== 'admin') {
    navLinks.push({ label: 'Contact', path: '/contact' });
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="sticky top-0 z-50 bg-card/95 backdrop-blur-md border-b border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <img src="/favicon.png" alt="CampusEvents Logo" className="w-9 h-9 rounded-lg" />
            <span className="font-display font-bold text-lg text-foreground">CampusEvents</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive(link.path)
                    ? 'bg-primary/10 text-primary'
                    : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                }`}
              >
                {link.label === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <Link to={`/${user.role}/notifications`} className="relative p-2 rounded-md hover:bg-muted transition-colors mr-2">
                  <Bell className="w-5 h-5 text-muted-foreground" />
                  {unreadCount > 0 && (
                    <Badge className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground">
                      {unreadCount}
                    </Badge>
                  )}
                </Link>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant={location.pathname === '/login' ? 'default' : 'ghost'} 
                  size="sm" 
                  onClick={() => navigate('/login')}
                >
                  Login
                </Button>
                <Button 
                  variant={location.pathname === '/login' ? 'ghost' : 'default'} 
                  size="sm" 
                  onClick={() => navigate('/signup')}
                >
                  Sign Up
                </Button>
              </>
            )}
          </div>

          <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-md hover:bg-muted">
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-card">
          <div className="px-4 py-3 space-y-1">
            {navLinks.map(link => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                }`}
              >
                {link.label === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                {link.label}
              </Link>
            ))}
            <div className="pt-2 border-t border-border space-y-1">
              {user ? (
                <>
                  <button onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex w-full items-center gap-2 text-left px-3 py-2 rounded-md text-sm font-medium text-destructive">
                    <LogOut className="w-4 h-4" /> Logout
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground">Login</Link>
                  <Link to="/signup" onClick={() => setMobileOpen(false)}
                    className="block px-3 py-2 rounded-md text-sm font-medium text-primary">Sign Up</Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
