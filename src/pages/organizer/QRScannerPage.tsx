import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { DashboardLayout } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { QrCode, CheckCircle, XCircle, AlertTriangle } from 'lucide-react';

const QRScannerPage = () => {
  const { id } = useParams();
  const { events, checkIn, user } = useApp();
  const event = events.find(e => e.id === id);
  const [manualToken, setManualToken] = useState('');
  const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

  const handleManualCheckIn = async () => {
    if (!manualToken.trim()) return;
    const res = await checkIn(manualToken.trim());
    setResult(res);
    if (res.success) setManualToken('');
  };

  return (
    <DashboardLayout>
      <div className="max-w-lg mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-display font-bold">QR Check-in Scanner</h1>
          <p className="text-muted-foreground">{event?.title}</p>
        </div>

        <div className="glass-card p-6 text-center">
          <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <QrCode className="w-8 h-8 text-primary" />
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Enter the student's QR token below to check them in. Students can find their token in their registration QR code.
          </p>
          <div className="flex gap-2">
            <Input
              placeholder="Paste QR token here..."
              value={manualToken}
              onChange={e => setManualToken(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleManualCheckIn()}
            />
            <Button onClick={handleManualCheckIn}>Check In</Button>
          </div>
        </div>

        {result && (
          <div className={`glass-card p-6 text-center ${result.success ? 'border-2 border-success' : 'border-2 border-destructive'}`}>
            {result.success ? (
              <CheckCircle className="w-12 h-12 text-success mx-auto mb-3" />
            ) : result.message.includes('Already') ? (
              <AlertTriangle className="w-12 h-12 text-warning mx-auto mb-3" />
            ) : (
              <XCircle className="w-12 h-12 text-destructive mx-auto mb-3" />
            )}
            <p className="font-display font-semibold text-lg">{result.success ? 'Success!' : 'Check-in Failed'}</p>
            <p className="text-muted-foreground mt-1">{result.message}</p>
            <Button variant="ghost" className="mt-4" onClick={() => setResult(null)}>Scan Another</Button>
          </div>
        )}

        <div className="glass-card p-4 text-sm text-muted-foreground">
          <p className="font-medium mb-1">How it works:</p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Student shows their QR code from the registration page</li>
            <li>Copy the token displayed under the QR code</li>
            <li>Paste it here and click Check In</li>
            <li>The system verifies and marks attendance</li>
          </ol>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default QRScannerPage;
