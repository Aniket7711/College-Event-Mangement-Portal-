import { FormEvent, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { PublicLayout } from '@/components/layout/Layouts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { registrationService } from '@/services/registrationService';
import { CertificateVerification } from '@/types';
import { ShieldAlert, ShieldCheck } from 'lucide-react';

const VerifyCertificatePage = () => {
  const [searchParams] = useSearchParams();
  const [code, setCode] = useState(searchParams.get('code') || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CertificateVerification | null>(null);

  const verifyCertificate = async (certificateCode: string) => {
    if (!certificateCode.trim()) return;
    setLoading(true);
    try {
      const response = await registrationService.verifyCertificate(certificateCode.trim());
      setResult(response);
    } catch (error: any) {
      setResult({
        valid: false,
        message: error.response?.data?.message || 'Unable to verify this certificate',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fromQuery = searchParams.get('code');
    if (fromQuery) {
      verifyCertificate(fromQuery);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onSubmit = (event: FormEvent) => {
    event.preventDefault();
    verifyCertificate(code);
  };

  return (
    <PublicLayout>
      <div className="page-container max-w-3xl">
        <h1 className="text-3xl font-display font-bold mb-2">Verify Participation Certificate</h1>
        <p className="text-muted-foreground mb-6">Enter a certificate ID to check authenticity.</p>

        <Card>
          <CardHeader>
            <CardTitle>Certificate Verification</CardTitle>
            <CardDescription>Use the certificate ID shown on the participant's PDF.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3">
              <Input
                value={code}
                onChange={(event) => setCode(event.target.value)}
                placeholder="e.g., CERT-MR4SFA-7AB921"
              />
              <Button type="submit" disabled={loading || !code.trim()}>
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            </form>
          </CardContent>
        </Card>

        {result && (
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                {result.valid ? <ShieldCheck className="text-success" /> : <ShieldAlert className="text-destructive" />}
                {result.valid ? 'Valid Certificate' : 'Invalid Certificate'}
              </CardTitle>
              <CardDescription>
                {result.valid ? 'Certificate is authentic and issued by CampusEvents.' : result.message}
              </CardDescription>
            </CardHeader>
            {result.valid && result.certificate && (
              <CardContent className="space-y-3 text-sm">
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Certificate ID</span>
                  <Badge variant="secondary">{result.certificate.code}</Badge>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Participant</span>
                  <span className="font-medium">{result.certificate.studentName}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Event</span>
                  <span className="font-medium">{result.certificate.eventTitle}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Event Date</span>
                  <span>{result.certificate.eventDate ? new Date(result.certificate.eventDate).toLocaleDateString('en-IN') : 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between border-b border-border pb-2">
                  <span className="text-muted-foreground">Organizer</span>
                  <span>{result.certificate.organizerName || 'N/A'}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Issued On</span>
                  <span>{result.certificate.issuedAt ? new Date(result.certificate.issuedAt).toLocaleString('en-IN') : 'N/A'}</span>
                </div>
              </CardContent>
            )}
          </Card>
        )}
      </div>
    </PublicLayout>
  );
};

export default VerifyCertificatePage;
