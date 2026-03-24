import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { PublicLayout } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { DEPARTMENTS } from '@/types';
import { GoogleLogin } from '@react-oauth/google';

const ROLL_NUMBER_REGEX = /^\d[A-Z]\d{2}[A-Z]{2,4}\d{4,5}$/;

const SignupPage = () => {
  const { signup, loginWithGoogle } = useApp();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '', email: '', password: '', confirmPassword: '',
    rollNumber: '', department: '', year: '', role: 'student' as 'student' | 'organizer'
  });
  const [loading, setLoading] = useState(false);

  const rollNumberValid = !form.rollNumber || ROLL_NUMBER_REGEX.test(form.rollNumber);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) { toast.error('Passwords do not match'); return; }
    if (form.password.length < 6) { toast.error('Password must be at least 6 characters'); return; }
    if (form.role === 'student') {
      if (!form.rollNumber || !form.department || !form.year) { toast.error('Please fill in all student details'); return; }
      if (!rollNumberValid) { toast.error('Invalid roll number format. Example: 2K21CSUN01007'); return; }
    }
    setLoading(true);
    try {
      const result = await signup({ ...form, password: form.password });
      if (result.success) {
        toast.success(result.message);
        navigate(`/${form.role}/dashboard`);
      } else toast.error(result.message);
    } catch {
      toast.error('Signup failed');
    } finally {
      setLoading(false);
    }
  };

  const set = (k: string, v: string) => setForm(prev => ({ ...prev, [k]: v }));

  return (
    <PublicLayout>
      <div className="min-h-[80vh] flex items-center justify-center px-4 py-12">
        <div className="glass-card w-full max-w-lg p-8">
          <div className="flex items-center justify-center gap-2 mb-6">
            <img src="/favicon.png" alt="CampusEvents Logo" className="w-10 h-10 rounded-lg" />
            <span className="font-display font-bold text-xl">CampusEvents</span>
          </div>
          <h2 className="text-2xl font-display font-bold text-center mb-1">Create Account</h2>
          <p className="text-sm text-muted-foreground text-center mb-6">Join the campus event community</p>

          <div className="flex justify-center mb-6">
            <GoogleLogin
              onSuccess={async (credentialResponse) => {
                if (credentialResponse.credential) {
                  const result = await loginWithGoogle(credentialResponse.credential);
                  if (result.success) {
                    toast.success(result.message);
                    if (result.role) navigate(`/${result.role}/dashboard`);
                  } else toast.error(result.message);
                }
              }}
              onError={() => toast.error('Google Signup Failed')}
              text="signup_with"
            />
          </div>

          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 border-t border-border"></div>
            <span className="text-xs text-muted-foreground font-medium uppercase">Or register with email</span>
            <div className="flex-1 border-t border-border"></div>
          </div>

          <div className="flex bg-muted p-1 rounded-xl mb-6">
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                form.role === 'student' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => { set('role', 'student'); set('rollNumber', ''); set('department', ''); set('year', ''); }}
            >
              Student
            </button>
            <button
              type="button"
              className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                form.role === 'organizer' ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}
              onClick={() => { set('role', 'organizer'); set('rollNumber', ''); set('department', ''); set('year', ''); }}
            >
              Organizer
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Full Name</Label>
                <Input value={form.name} onChange={e => set('name', e.target.value)} placeholder="John Doe" required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@campus.edu" required />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <Label>Password</Label>
                <Input type="password" value={form.password} onChange={e => set('password', e.target.value)} placeholder="••••••••" required />
              </div>
              <div>
                <Label>Confirm Password</Label>
                <Input type="password" value={form.confirmPassword} onChange={e => set('confirmPassword', e.target.value)} placeholder="••••••••" required />
              </div>
            </div>
            {form.role === 'student' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Roll Number</Label>
                    <Input
                      value={form.rollNumber}
                      onChange={e => set('rollNumber', e.target.value.toUpperCase())}
                      placeholder="2K21CSUN01007"
                      maxLength={13}
                    />
                    {form.rollNumber && !rollNumberValid && (
                      <p className="text-xs text-destructive mt-1">Format: 2K21CSUN01007</p>
                    )}
                  </div>
                  <div>
                    <Label>Department</Label>
                    <Select value={form.department} onValueChange={v => set('department', v)}>
                      <SelectTrigger><SelectValue placeholder="Select dept" /></SelectTrigger>
                      <SelectContent>{DEPARTMENTS.map(d => <SelectItem key={d} value={d}>{d}</SelectItem>)}</SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label>Year</Label>
                    <Select value={form.year} onValueChange={v => set('year', v)}>
                      <SelectTrigger><SelectValue placeholder="Select year" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1st">1st Year</SelectItem>
                        <SelectItem value="2nd">2nd Year</SelectItem>
                        <SelectItem value="3rd">3rd Year</SelectItem>
                        <SelectItem value="4th">4th Year</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </>
            )}
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-sm text-center mt-4 text-muted-foreground">
            Already have an account? <Link to="/login" className="text-primary hover:underline font-medium">Sign in</Link>
          </p>
        </div>
      </div>
    </PublicLayout>
  );
};

export default SignupPage;
