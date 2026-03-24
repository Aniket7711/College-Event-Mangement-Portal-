import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EmptyState from '@/components/shared/EmptyState';
import { CheckCircle } from 'lucide-react';

const StudentAttendance = () => {
  const { user, registrations, events } = useApp();
  const attended = registrations.filter(r => r.studentId === user?.id && r.status === 'attended');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">Attendance History</h1>
        {attended.length === 0 ? (
          <EmptyState title="No attendance records" message="Attend events and get checked in via QR code." />
        ) : (
          <div className="space-y-3">
            {attended.map(reg => {
              const evt = events.find(e => e.id === reg.eventId);
              return (
                <div key={reg.id} className="glass-card p-4 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                    <CheckCircle className="w-5 h-5 text-success" />
                  </div>
                  <div>
                    <h3 className="font-semibold">{reg.eventTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {evt && new Date(evt.date).toLocaleDateString('en-IN')} · Checked in: {reg.checkedInAt && new Date(reg.checkedInAt).toLocaleTimeString()}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default StudentAttendance;
