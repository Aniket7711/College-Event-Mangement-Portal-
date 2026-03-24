import { Link, Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PublicLayout } from '@/components/layout/Layouts';
import EventCard from '@/components/shared/EventCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users, Award, Zap, Shield, QrCode } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const { user, events, registrations, users } = useApp();

  // Redirect to dashboard if logged in
  if (user && user.role) {
    return <Navigate to={`/${user.role}/dashboard`} replace />;
  }

  const approvedEvents = events.filter(e => 
    ['approved', 'completed'].includes(e.status) && (!e.targetAudience || e.targetAudience === 'All Departments')
  );
  const featured = approvedEvents.slice(0, 3);

  const stats = [
    { label: 'Total Events', value: events.length, icon: Calendar },
    { label: 'Registrations', value: registrations.length, icon: Users },
    { label: 'Active Students', value: users.filter(u => u.role === 'student').length, icon: Award },
  ];

  const features = [
    { icon: Calendar, title: 'Discover Events', desc: 'Browse and find events matching your interests across all departments.' },
    { icon: QrCode, title: 'QR Check-in', desc: 'Seamless event entry with QR-based attendance marking.' },
    { icon: Shield, title: 'Secure Platform', desc: 'Role-based access with organizer verification and admin approval.' },
    { icon: Zap, title: 'Real-time Updates', desc: 'Stay notified about registrations, approvals, and event changes.' },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' } as any
    },
  };

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden min-h-[80vh] flex items-center" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 opacity-10">
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 2, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl transform-gpu" 
          />
          <motion.div 
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{ scale: 1, opacity: 0.1 }}
            transition={{ duration: 3, repeat: Infinity, repeatType: 'reverse' }}
            className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl transform-gpu" 
          />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <motion.div 
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-7xl font-display font-bold text-primary-foreground leading-tight mb-6">
              Your Campus,<br />Your Events
            </h1>
            <p className="text-lg md:text-xl text-primary-foreground/70 mb-8 max-w-lg">
              Discover, register, and manage college events all in one place. From hackathons to cultural fests — never miss out.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button size="lg" className="h-14 px-8 rounded-full" asChild>
                <Link to="/events">Browse Events <ArrowRight className="w-5 h-5 ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="h-14 px-8 rounded-full bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {stats.map(s => (
            <motion.div 
              key={s.label} 
              variants={itemVariants}
              whileHover={{ y: -5, boxShadow: '0 10px 30px -10px rgba(0,0,0,0.1)' }}
              className="glass-card p-8 flex items-center gap-6"
            >
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
                <s.icon className="w-7 h-7 text-primary" />
              </div>
              <div>
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-3xl font-display font-bold"
                >
                  {s.value}
                </motion.p>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">{s.label}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex items-end justify-between mb-12"
        >
          <div>
            <h2 className="text-3xl md:text-4xl font-display font-bold">Featured Events</h2>
            <p className="text-muted-foreground mt-2 text-lg">Handpicked experiences for you</p>
          </div>
          <Button variant="ghost" className="hidden sm:flex group" asChild>
            <Link to="/events">View All <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" /></Link>
          </Button>
        </motion.div>
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {featured.map(event => (
            <motion.div key={event.id} variants={itemVariants}>
              <EventCard event={event} />
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="bg-muted/30 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">Everything you need</h2>
            <p className="text-muted-foreground mt-4 text-lg max-w-2xl mx-auto">
              We provide all the tools to make college event management seamless and fun for everyone.
            </p>
          </motion.div>
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {features.map(f => (
              <motion.div 
                key={f.title} 
                variants={itemVariants}
                whileHover={{ y: -8 }}
                className="glass-card p-8 text-center group transition-colors hover:border-primary/50"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                  <f.icon className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-xl font-display font-semibold mb-3">{f.title}</h3>
                <p className="text-muted-foreground leading-relaxed">{f.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-card p-12 md:p-20 text-center relative overflow-hidden" 
          style={{ background: 'var(--gradient-primary)' }}
        >
          <div className="relative z-10">
            <h2 className="text-3xl md:text-5xl font-display font-bold text-primary-foreground mb-6">Ready to jump in?</h2>
            <p className="text-xl text-primary-foreground/80 mb-10 max-w-md mx-auto leading-relaxed">
              Join thousands of students and start your journey today.
            </p>
            <Button size="lg" variant="secondary" className="h-16 px-10 rounded-full text-lg shadow-xl" asChild>
              <Link to="/signup">Create Your Account <ArrowRight className="w-5 h-5 ml-2" /></Link>
            </Button>
          </div>
          <motion.div 
            animate={{ rotate: 360 }}
            transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
            className="absolute top-0 right-0 w-64 h-64 bg-white/5 rounded-full -mr-32 -mt-32 blur-3xl" 
          />
          <motion.div 
            animate={{ rotate: -360 }}
            transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
            className="absolute bottom-0 left-0 w-64 h-64 bg-black/5 rounded-full -ml-32 -mb-32 blur-3xl" 
          />
        </motion.div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;

