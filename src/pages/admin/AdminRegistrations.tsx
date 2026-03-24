import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import { Badge } from '@/components/ui/badge';

const AdminRegistrations = () => {
  const { registrations, events } = useApp();
  const activeRegs = registrations.filter(r => r.status !== 'cancelled');

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-2xl font-display font-bold">All Registrations</h1>
        <div className="glass-card overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/50">
              <tr>
                <th className="text-left p-3 font-medium">Student</th>
                <th className="text-left p-3 font-medium">Roll No</th>
                <th className="text-left p-3 font-medium">Event</th>
                <th className="text-left p-3 font-medium">Status</th>
                <th className="text-left p-3 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {activeRegs.map(r => (
                <tr key={r.id} className="border-t border-border">
                  <td className="p-3">{r.studentName}</td>
                  <td className="p-3 text-muted-foreground">{r.studentRollNumber}</td>
                  <td className="p-3">{r.eventTitle}</td>
                  <td className="p-3">
                    <Badge variant={r.status === 'attended' ? 'default' : 'secondary'}>
                      {r.status === 'attended' ? '✓ Attended' : 'Registered'}
                    </Badge>
                  </td>
                  <td className="p-3 text-muted-foreground">{new Date(r.registeredAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default AdminRegistrations;
