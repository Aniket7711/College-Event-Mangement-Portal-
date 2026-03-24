import { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import DashboardSidebar from './DashboardSidebar';
import PageTransition from '../shared/PageTransition';

export const PublicLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-1">
        <PageTransition key={location.pathname}>{children}</PageTransition>
      </main>
      <Footer />
    </div>
  );
};

export const DashboardLayout = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex flex-1">
        <DashboardSidebar />
        <main className="flex-1 p-4 lg:p-6 overflow-auto bg-background">
          <PageTransition key={location.pathname}>{children}</PageTransition>
        </main>
      </div>
    </div>
  );
};
