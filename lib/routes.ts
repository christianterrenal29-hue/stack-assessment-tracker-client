import type { User } from '@/context/auth-context';

export const getDashboardPath = (role?: User['role'] | string | null) => {
  switch (role) {
    case 'administrator':
      return '/dashboard/admin';
    case 'instructor':
      return '/dashboard/instructor';
    case 'assessor':
      return '/dashboard/assessor';
    case 'student':
      return '/dashboard/student';
    default:
      return '/auth/login';
  }
};
