'use client';

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { Activity, BarChart3, Bell, CalendarClock, ClipboardList, FileText, HelpCircle, Info, Medal, Users } from 'lucide-react';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface SidebarProps {
  role: 'administrator' | 'instructor' | 'assessor' | 'student';
}

export function Sidebar({ role }: SidebarProps) {
  const { pathname } = useLocation();

  const getLinks = (): SidebarLink[] => {
    const roleLinks: Record<string, SidebarLink[]> = {
      administrator: [
        { href: '/dashboard/admin', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/admin/users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
        { href: '/instructor/assessments', label: 'Assessments', icon: <CalendarClock className="w-5 h-5" /> },
        { href: '/candidate-results', label: 'Candidate Results', icon: <Medal className="w-5 h-5" /> },
        { href: '/reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
        { href: '/documents', label: 'Documents / Requirements', icon: <ClipboardList className="w-5 h-5" /> },
        { href: '/dashboard/notifications', label: 'Notifications', icon: <Bell className="w-5 h-5" /> },
      ],
      instructor: [
        { href: '/dashboard/instructor', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/instructor/students', label: 'Candidates', icon: <Users className="w-5 h-5" /> },
        { href: '/instructor/assessments', label: 'Assessments', icon: <CalendarClock className="w-5 h-5" /> },
        { href: '/candidate-results', label: 'Candidate Results', icon: <Medal className="w-5 h-5" /> },
        { href: '/instructor/attendance', label: 'Assessment Attendance', icon: <Activity className="w-5 h-5" /> },
        { href: '/reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
        { href: '/documents', label: 'Documents / Requirements', icon: <ClipboardList className="w-5 h-5" /> },
      ],
      assessor: [
        { href: '/dashboard/assessor', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/candidate-results', label: 'Candidate Results', icon: <Medal className="w-5 h-5" /> },
        { href: '/reports', label: 'Reports', icon: <FileText className="w-5 h-5" /> },
        { href: '/documents', label: 'Documents / Requirements', icon: <ClipboardList className="w-5 h-5" /> },
      ],
      student: [
        { href: '/dashboard/student', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/student/assessments', label: 'Assessment Schedule', icon: <CalendarClock className="w-5 h-5" /> },
        { href: '/student/competencies', label: 'Competencies', icon: <Medal className="w-5 h-5" /> },
        { href: '/student/attendance', label: 'Assessment Attendance', icon: <Activity className="w-5 h-5" /> },
        { href: '/documents', label: 'Documents / Requirements', icon: <ClipboardList className="w-5 h-5" /> },
      ],
    };

    return [
      ...(roleLinks[role] || []),
      { href: '/help', label: 'Help / User Guide', icon: <HelpCircle className="w-5 h-5" /> },
      { href: '/about', label: 'About System', icon: <Info className="w-5 h-5" /> },
    ];
  };

  const links = getLinks();

  return (
    <aside className="h-auto shrink-0 overflow-y-auto border-b border-white/10 bg-sidebar text-sidebar-foreground shadow-xl md:h-screen md:w-72 md:border-b-0 md:border-r">
      <div className="border-b border-white/10 p-4 md:p-5">
        <div className="flex items-center gap-3 rounded-2xl bg-white/[0.08] p-3">
        <img src="/tesda-logo.png" alt="TESDA logo" className="h-11 w-11 rounded-xl bg-white object-contain p-1 shadow-sm" />
        <div className="min-w-0">
          <h1 className="truncate text-sm font-semibold">TESDA Assessment Tracker</h1>
          <p className="truncate text-xs text-white/70">Top Link Global College</p>
          <p className="mt-1 inline-flex rounded-full bg-white/10 px-2 py-0.5 text-[11px] capitalize text-white/75">{role}</p>
        </div>
        <img src="/toplink-logo.png" alt="Top Link Global College logo" className="ml-auto h-11 w-11 rounded-xl bg-white object-contain p-1 shadow-sm" />
        </div>
      </div>

      <nav className="flex gap-2 overflow-x-auto px-4 py-4 md:block md:space-y-1.5 md:overflow-visible">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              to={link.href}
              aria-current={isActive ? 'page' : undefined}
              className={cn(
                'group flex shrink-0 items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 md:w-full',
                isActive
                  ? 'bg-white text-[#0b2f57] shadow-md'
                  : 'text-white/78 hover:bg-white/10 hover:text-white hover:translate-x-0.5'
              )}
            >
              <span className={cn('text-white/70 transition-colors group-hover:text-white', isActive && 'text-[#0b7f3a]')}>{link.icon}</span>
              <span className="truncate">{link.label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
