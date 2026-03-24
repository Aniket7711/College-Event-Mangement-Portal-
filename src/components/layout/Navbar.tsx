import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { useState } from 'react';
import { Calendar, Menu, X, Bell, LogOut, LayoutDashboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { user, logout, notifications } = useApp();
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const unreadCount = notifications.filter(n => n.userId === user?.id && !n.isRead).length;

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
          <Link to="/" className="flex items-center gap-2 group">
            <motion.img 
              whileHover={{ rotate: 10, scale: 1.1 }}
              src="/favicon.png" alt="CampusEvents Logo" className="w-9 h-9 rounded-lg shadow-sm" 
            />
            <span className="font-display font-bold text-lg text-foreground group-hover:text-primary transition-colors">CampusEvents</span>
          </Link>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(link => (
              <motion.div key={link.path} whileHover={{ y: -2 }} whileTap={{ y: 0 }}>
                <Link
                  to={link.path}
                  className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-all ${
                    isActive(link.path)
                      ? 'bg-primary/10 text-primary'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`}
                >
                  {link.label === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                  {link.label}
                </Link>
              </motion.div>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            {user ? (
              <>
                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                  <Link to={`/${user.role}/notifications`} className="relative p-2 rounded-md hover:bg-muted transition-colors mr-2 block">
                    <Bell className="w-5 h-5 text-muted-foreground" />
                    <AnimatePresence>
                      {unreadCount > 0 && (
                        <motion.div
                          initial={{ scale: 0, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          exit={{ scale: 0, opacity: 0 }}
                          className="absolute -top-1 -right-1"
                        >
                          <Badge className="h-5 w-5 flex items-center justify-center p-0 text-[10px] bg-destructive text-destructive-foreground">
                            {unreadCount}
                          </Badge>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </Link>
                </motion.div>
                <Button variant="ghost" size="sm" onClick={handleLogout} className="gap-2 text-muted-foreground hover:text-destructive">
                  <LogOut className="w-4 h-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="flex gap-2">
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant={location.pathname === '/login' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => navigate('/login')}
                  >
                    Login
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Button 
                    variant={location.pathname === '/signup' ? 'default' : 'ghost'} 
                    size="sm" 
                    onClick={() => navigate('/signup')}
                  >
                    Sign Up
                  </Button>
                </motion.div>
              </div>
            )}
          </div>

          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden p-2 rounded-md hover:bg-muted"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </motion.button>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden border-t border-border bg-card overflow-hidden"
          >
            <div className="px-4 py-3 space-y-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.path}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.path}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium ${
                      isActive(link.path) ? 'bg-primary/10 text-primary' : 'text-muted-foreground'
                    }`}
                  >
                    {link.label === 'Dashboard' && <LayoutDashboard className="w-4 h-4" />}
                    {link.label}
                  </Link>
                </motion.div>
              ))}
              <div className="pt-2 border-t border-border space-y-1">
                {user ? (
                  <motion.button 
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: navLinks.length * 0.05 }}
                    onClick={() => { handleLogout(); setMobileOpen(false); }}
                    className="flex w-full items-center gap-2 text-left px-3 py-2 rounded-md text-sm font-medium text-destructive"
                  >
                    <LogOut className="w-4 h-4" /> Logout
                  </motion.button>
                ) : (
                  <>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: navLinks.length * 0.05 }}
                    >
                      <Link to="/login" onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 rounded-md text-sm font-medium text-muted-foreground">Login</Link>
                    </motion.div>
                    <motion.div
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: (navLinks.length + 1) * 0.05 }}
                    >
                      <Link to="/signup" onClick={() => setMobileOpen(false)}
                        className="block px-3 py-2 rounded-md text-sm font-medium text-primary">Sign Up</Link>
                    </motion.div>
                  </>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
