'use client';

import { Sidebar } from './sidebar';
import { Header } from './header';
import { useLocation } from 'react-router-dom';

type DashboardRole = 'administrator' | 'instructor' | 'assessor' | 'student';

interface DashboardLayoutProps {
  children: React.ReactNode;
  role?: DashboardRole;
  userName?: string;
  unreadNotifications?: number;
}

function inferRoleFromPath(pathname: string): DashboardRole {
  if (pathname.includes('/admin')) return 'administrator';
  if (pathname.includes('/instructor')) return 'instructor';
  if (pathname.includes('/assessor')) return 'assessor';
  return 'student';
}

export function DashboardLayout({
  children,
  role,
  userName = 'User',
  unreadNotifications = 0,
}: DashboardLayoutProps) {
  const { pathname } = useLocation();
  const resolvedRole = role ?? inferRoleFromPath(pathname);

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <Sidebar role={resolvedRole} />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header userName={userName} unreadNotifications={unreadNotifications} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
