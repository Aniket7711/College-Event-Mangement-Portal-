import { ReactNode } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import DashboardSidebar from './DashboardSidebar';

export const PublicLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <main className="flex-1">{children}</main>
    <Footer />
  </div>
);

export const DashboardLayout = ({ children }: { children: ReactNode }) => (
  <div className="flex flex-col min-h-screen">
    <Navbar />
    <div className="flex flex-1">
      <DashboardSidebar />
      <main className="flex-1 p-4 lg:p-6 overflow-auto bg-background">{children}</main>
    </div>
  </div>
);
