import { LucideIcon } from 'lucide-react';
import { motion } from 'framer-motion';

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: string;
  className?: string;
}

const StatsCard = ({ title, value, icon: Icon, description, className = '' }: StatsCardProps) => (
  <motion.div 
    whileHover={{ y: -4, scale: 1.02 }}
    transition={{ type: 'spring', stiffness: 400, damping: 10 }}
    className={`glass-card p-5 ${className}`}
  >
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-muted-foreground">{title}</p>
        <p className="text-2xl font-display font-bold mt-1">{value}</p>
        {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
      </div>
      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="w-5 h-5 text-primary" />
      </div>
    </div>
  </motion.div>
);

export default StatsCard;
