import { PublicLayout } from '@/components/layout/Layouts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Mail, Phone, MapPin } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Message sent! We\'ll get back to you soon.');
    setForm({ name: '', email: '', message: '' });
  };

  return (
    <PublicLayout>
      <div className="page-container">
        <h1 className="text-3xl md:text-4xl font-display font-bold mb-2 text-center">Contact Us</h1>
        <p className="text-muted-foreground text-center mb-10">Have questions? We'd love to hear from you.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          <div className="glass-card p-8">
            <h2 className="text-xl font-display font-semibold mb-6">Send a Message</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} required />
              </div>
              <div>
                <Label>Email</Label>
                <Input type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))} required />
              </div>
              <div>
                <Label>Message</Label>
                <Textarea rows={4} value={form.message} onChange={e => setForm(p => ({ ...p, message: e.target.value }))} required />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </div>

          <div className="space-y-6">
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold mb-4">Get in Touch</h3>
              <div className="space-y-4 text-sm">
                <div className="flex items-center gap-3"><Mail className="w-5 h-5 text-primary" /><div><p className="font-medium">Email</p><p className="text-muted-foreground">events@campus.edu</p></div></div>
                <div className="flex items-center gap-3"><Phone className="w-5 h-5 text-primary" /><div><p className="font-medium">Phone</p><p className="text-muted-foreground">+91 98765 43210</p></div></div>
                <div className="flex items-center gap-3"><MapPin className="w-5 h-5 text-primary" /><div><p className="font-medium">Address</p><p className="text-muted-foreground">University Campus, Main Block, India</p></div></div>
              </div>
            </div>
            <div className="glass-card p-6">
              <h3 className="font-display font-semibold mb-2">Office Hours</h3>
              <p className="text-sm text-muted-foreground">Monday – Friday: 9:00 AM – 5:00 PM</p>
              <p className="text-sm text-muted-foreground">Saturday: 10:00 AM – 2:00 PM</p>
            </div>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
};

export default ContactPage;
