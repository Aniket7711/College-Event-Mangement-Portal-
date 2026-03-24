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
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 300, damping: 24 } as any
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
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
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
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-display font-semibold">Recommended For You</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommended.map((e, index) => (
              <motion.div 
                key={e.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <EventCard event={e} />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>
    </DashboardLayout>
  );
};

export default StudentDashboard;

