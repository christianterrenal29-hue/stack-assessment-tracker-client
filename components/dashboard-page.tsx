import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface DashboardPageProps {
  children: ReactNode;
  className?: string;
}

export function DashboardPage({ children, className }: DashboardPageProps) {
  return (
    <div className={cn('min-h-full px-4 py-6 sm:px-6 lg:px-8', className)}>
      <div className="mx-auto max-w-7xl space-y-6">{children}</div>
    </div>
  );
}
