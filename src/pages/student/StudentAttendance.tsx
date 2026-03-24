import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import EmptyState from '@/components/shared/EmptyState';
import { Button } from '@/components/ui/button';
import { downloadParticipationCertificate } from '@/lib/certificate';
import { CheckCircle, Download } from 'lucide-react';
import { toast } from 'sonner';

const StudentAttendance = () => {
  const { user, registrations, events } = useApp();
  const attended = registrations.filter(r => r.studentId === user?.id && r.status === 'attended');

  const handleDownload = (regId: string) => {
    const registration = attended.find((item) => item.id === regId);
    const event = registration ? events.find((item) => item.id === registration.eventId) : null;

    if (!registration?.certificateCode) {
      toast.error('Certificate is not available yet');
      return;
    }

    downloadParticipationCertificate({
      studentName: registration.studentName,
      eventTitle: registration.eventTitle,
      eventDate: event?.date,
      certificateCode: registration.certificateCode,
      issuedAt: registration.certificateIssuedAt,
    });
  };

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
                  <div className="flex-1">
                    <h3 className="font-semibold">{reg.eventTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {evt && new Date(evt.date).toLocaleDateString('en-IN')} · Checked in: {reg.checkedInAt && new Date(reg.checkedInAt).toLocaleTimeString()}
                    </p>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => handleDownload(reg.id)}>
                    <Download className="w-4 h-4 mr-1" /> Certificate
                  </Button>
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
