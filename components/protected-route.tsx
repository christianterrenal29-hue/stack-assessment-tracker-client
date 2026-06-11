import { Navigate, useLocation } from 'react-router-dom';
import { useAuth, type User } from '@/context/auth-context';
import { getDashboardPath } from '@/lib/routes';

type ProtectedRouteProps = {
  children: React.ReactNode;
  roles?: User['role'][];
};

export function ProtectedRoute({ children, roles }: ProtectedRouteProps) {
  const { user, isLoading } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading...
      </main>
    );
  }

  if (!user) {
    return <Navigate to="/auth/login" replace state={{ from: location }} />;
  }

  if (roles && !roles.includes(user.role)) {
    return <Navigate to={getDashboardPath(user.role)} replace />;
  }

  return <>{children}</>;
}
