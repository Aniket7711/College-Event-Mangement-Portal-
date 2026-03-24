import { Navigate } from 'react-router-dom';
import { useApp } from '@/context/AppContext';
import { UserRole } from '@/types';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

export const RoleProtectedRoute = ({ children, roles }: { children: React.ReactNode; roles: UserRole[] }) => {
  const { user } = useApp();
  if (!user) return <Navigate to="/login" replace />;
  if (!roles.includes(user.role)) return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="text-center">
        <h1 className="text-4xl font-display font-bold text-destructive mb-2">Access Denied</h1>
        <p className="text-muted-foreground">You don't have permission to access this page.</p>
      </div>
    </div>
  );
  return <>{children}</>;
};
