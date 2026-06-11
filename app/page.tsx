import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/auth-context';
import { getDashboardPath } from '@/lib/routes';

export default function Page() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-background text-muted-foreground">
        Loading...
      </main>
    );
  }

  return <Navigate to={user ? getDashboardPath(user.role) : '/auth/login'} replace />;
}
