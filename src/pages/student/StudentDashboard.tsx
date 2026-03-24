import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import StatsCard from '@/components/shared/StatsCard';
import EventCard from '@/components/shared/EventCard';
import { Calendar, CheckCircle, Clock, ClipboardList } from 'lucide-react';
import { motion } from 'framer-motion';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } as any
  }
};

const StudentDashboard = () => {
  const { user, events, registrations } = useApp();
  const myRegs = registrations.filter(r => r.studentId === user?.id && r.status !== 'cancelled');
  const attended = myRegs.filter(r => r.status === 'attended').length;
  const upcoming = myRegs.filter(r => {
    const evt = events.find(e => e.id === r.eventId);
    return evt && new Date(evt.date) >= new Date() && r.status === 'registered';
  }).length;
  
  const isEligible = (e: any) => !e.targetAudience || e.targetAudience === 'All Departments' || e.targetAudience === user?.department;
  const recommended = events.filter(e => ['approved', 'completed'].includes(e.status) && isEligible(e)).slice(0, 3);

  return (
    <DashboardLayout>
      <div className="space-y-8">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <h1 className="text-3xl font-display font-bold">Welcome, {user?.name?.split(' ')[0]}!</h1>
          <p className="text-muted-foreground">Keep track of your campus journey</p>
        </motion.div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          <motion.div variants={itemVariants}>
            <StatsCard title="Total Registrations" value={myRegs.length} icon={ClipboardList} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard title="Upcoming Events" value={upcoming} icon={Calendar} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard title="Events Attended" value={attended} icon={CheckCircle} />
          </motion.div>
          <motion.div variants={itemVariants}>
            <StatsCard title="Active Registrations" value={myRegs.filter(r => r.status === 'registered').length} icon={Clock} />
          </motion.div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.2 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map(e => (
              <EventCard key={e.id} event={e} />
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;
