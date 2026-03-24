import { Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => (
  <footer className="bg-sidebar text-sidebar-foreground mt-auto">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-4">
            <img src="/favicon.png" alt="CampusEvents Logo" className="w-9 h-9 opacity-80" />
            <span className="font-display font-bold text-lg">CampusEvents</span>
          </div>
          <p className="text-sm text-sidebar-foreground/70">
            Your one-stop platform for discovering, organizing, and managing college events.
          </p>
        </div>
        <div>
          <h3 className="font-display font-semibold mb-4">Quick Links</h3>
          <div className="space-y-2 text-sm text-sidebar-foreground/70">
            <Link to="/events" className="block hover:text-sidebar-foreground transition-colors">Browse Events</Link>
            <Link to="/about" className="block hover:text-sidebar-foreground transition-colors">About Us</Link>
            <Link to="/contact" className="block hover:text-sidebar-foreground transition-colors">Contact</Link>
            <Link to="/verify-certificate" className="block hover:text-sidebar-foreground transition-colors">Verify Certificate</Link>
          </div>
        </div>
        <div>
          <h3 className="font-display font-semibold mb-4">Categories</h3>
          <div className="space-y-2 text-sm text-sidebar-foreground/70">
            <p>Technical</p><p>Cultural</p><p>Sports</p><p>Workshops</p>
          </div>
        </div>
        <div>
          <h3 className="font-display font-semibold mb-4">Contact</h3>
          <div className="space-y-2 text-sm text-sidebar-foreground/70">
            <p className="flex items-center gap-2"><Mail className="w-4 h-4" /> events@campus.edu</p>
            <p className="flex items-center gap-2"><Phone className="w-4 h-4" /> +91 98765 43210</p>
            <p className="flex items-center gap-2"><MapPin className="w-4 h-4" /> University Campus, India</p>
          </div>
        </div>
      </div>
      <div className="border-t border-sidebar-border mt-8 pt-8 text-center text-sm text-sidebar-foreground/50">
        © 2025 CampusEvents. All rights reserved.
      </div>
    </div>
  </footer>
);

export default Footer;
