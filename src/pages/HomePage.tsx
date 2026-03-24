import { Link, Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PublicLayout } from '@/components/layout/Layouts';
import EventCard from '@/components/shared/EventCard';
import { Button } from '@/components/ui/button';
import { ArrowRight, Calendar, Users, Award, Zap, Shield, QrCode } from 'lucide-react';

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

  return (
    <PublicLayout>
      {/* Hero */}
      <section className="relative overflow-hidden" style={{ background: 'var(--gradient-hero)' }}>
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-20 w-96 h-96 bg-accent rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground leading-tight mb-6 animate-fade-in">
              Your Campus,<br />Your Events
            </h1>
            <p className="text-lg text-primary-foreground/70 mb-8 animate-fade-in">
              Discover, register, and manage college events all in one place. From hackathons to cultural fests — never miss out.
            </p>
            <div className="flex flex-wrap gap-3 animate-fade-in">
              <Button size="lg" asChild>
                <Link to="/events">Browse Events <ArrowRight className="w-4 h-4 ml-2" /></Link>
              </Button>
              <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground" asChild>
                <Link to="/signup">Get Started</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {stats.map(s => (
            <div key={s.label} className="glass-card p-6 flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                <s.icon className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-display font-bold">{s.value}</p>
                <p className="text-sm text-muted-foreground">{s.label}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Events */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-display font-bold">Featured Events</h2>
            <p className="text-muted-foreground mt-1">Don't miss these upcoming events</p>
          </div>
          <Button variant="ghost" asChild>
            <Link to="/events">View All <ArrowRight className="w-4 h-4 ml-1" /></Link>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featured.map(event => <EventCard key={event.id} event={event} />)}
        </div>
      </section>

      {/* Features */}
      <section className="bg-muted/50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-display font-bold">Why CampusEvents?</h2>
            <p className="text-muted-foreground mt-2">Everything you need to manage college events</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(f => (
              <div key={f.title} className="glass-card p-6 text-center">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-display font-semibold mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="glass-card p-8 md:p-12 text-center" style={{ background: 'var(--gradient-primary)' }}>
          <h2 className="text-2xl md:text-3xl font-display font-bold text-primary-foreground mb-4">Ready to get started?</h2>
          <p className="text-primary-foreground/80 mb-6 max-w-md mx-auto">Join hundreds of students and organizers on CampusEvents today.</p>
          <Button size="lg" variant="secondary" asChild>
            <Link to="/signup">Create Account <ArrowRight className="w-4 h-4 ml-2" /></Link>
          </Button>
        </div>
      </section>
    </PublicLayout>
  );
};

export default HomePage;
