'use client';

import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Users, FileText, Activity, CalendarClock, Medal } from 'lucide-react';

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
        { href: '/dashboard/admin', label: 'Administrator Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/admin/users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
        { href: '/admin/institutions', label: 'Institutions', icon: <FileText className="w-5 h-5" /> },
        { href: '/admin/compliance', label: 'Compliance', icon: <Medal className="w-5 h-5" /> },
        { href: '/admin/audit', label: 'Audit Logs', icon: <Activity className="w-5 h-5" /> },
      ],
      instructor: [
        { href: '/dashboard/instructor', label: 'Assessment Coordinator Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/instructor/students', label: 'My Students', icon: <Users className="w-5 h-5" /> },
        { href: '/instructor/assessments', label: 'Assessment Scheduling', icon: <CalendarClock className="w-5 h-5" /> },
        { href: '/instructor/attendance', label: 'Assessment Attendance', icon: <Activity className="w-5 h-5" /> },
      ],
      assessor: [
        { href: '/dashboard/assessor', label: 'Assessor Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/assessor/submissions', label: 'Assigned Schedules', icon: <FileText className="w-5 h-5" /> },
        { href: '/assessor/grading', label: 'Candidate Results', icon: <Medal className="w-5 h-5" /> },
      ],
      student: [
        { href: '/dashboard/student', label: 'My Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/student/assessments', label: 'Assessment Schedule', icon: <CalendarClock className="w-5 h-5" /> },
        { href: '/student/competencies', label: 'Competencies', icon: <Medal className="w-5 h-5" /> },
        { href: '/student/attendance', label: 'Assessment Attendance', icon: <Activity className="w-5 h-5" /> },
      ],
    };

    return roleLinks[role] || [];
  };

  const links = getLinks();

  return (
    <aside className="w-64 bg-card border-r border-border h-screen overflow-y-auto">
      <div className="p-6">
        <h1 className="text-xl font-bold text-foreground">TESDA Tracker</h1>
        <p className="text-xs text-muted-foreground mt-1 capitalize">{role}</p>
      </div>

      <nav className="space-y-2 px-4">
        {links.map((link) => {
          const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
          return (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                'flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-foreground hover:bg-accent'
              )}
            >
              {link.icon}
              {link.label}
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}
