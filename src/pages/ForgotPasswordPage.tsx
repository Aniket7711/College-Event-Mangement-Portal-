import { PublicLayout } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { toast } from 'sonner';
import { useState } from 'react';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('If an account exists with that email, a password reset link has been sent.');
    setEmail('');
  };

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4">
        <div className="glass-card w-full max-w-md p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary-foreground" />
            </div>
          </div>
          <h2 className="text-2xl font-display font-bold text-center mb-1">Reset Password</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">Enter your email to receive a reset link</p>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="you@campus.edu" required />
            </div>
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
          <Link to="/login" className="flex items-center justify-center gap-1 mt-4 text-sm text-muted-foreground hover:text-foreground">
            <ArrowLeft className="w-4 h-4" /> Back to login
          </Link>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ForgotPasswordPage;
