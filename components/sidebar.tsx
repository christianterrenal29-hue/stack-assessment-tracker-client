'use client';

import { Link, useLocation, useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { BarChart3, Users, FileText, Activity, Clock, Medal, LogOut, Settings } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

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
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };

  const getLinks = (): SidebarLink[] => {
    const baseLinks = [
      { href: '/dashboard', label: 'Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
    ];

    const roleLinks: Record<string, SidebarLink[]> = {
      administrator: [
        { href: '/dashboard/admin', label: 'Admin Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/admin/users', label: 'User Management', icon: <Users className="w-5 h-5" /> },
        { href: '/admin/institutions', label: 'Institutions', icon: <FileText className="w-5 h-5" /> },
        { href: '/admin/compliance', label: 'Compliance', icon: <Medal className="w-5 h-5" /> },
        { href: '/admin/audit', label: 'Audit Logs', icon: <Activity className="w-5 h-5" /> },
      ],
      instructor: [
        { href: '/dashboard/instructor', label: 'Instructor Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/instructor/students', label: 'My Students', icon: <Users className="w-5 h-5" /> },
        { href: '/instructor/assessments', label: 'Assessments', icon: <FileText className="w-5 h-5" /> },
        { href: '/instructor/attendance', label: 'Attendance', icon: <Activity className="w-5 h-5" /> },
        { href: '/instructor/ojt', label: 'OJT Monitoring', icon: <Clock className="w-5 h-5" /> },
      ],
      assessor: [
        { href: '/dashboard/assessor', label: 'Assessor Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/assessor/submissions', label: 'Submissions', icon: <FileText className="w-5 h-5" /> },
        { href: '/assessor/grading', label: 'Grading', icon: <Medal className="w-5 h-5" /> },
      ],
      student: [
        { href: '/dashboard/student', label: 'My Dashboard', icon: <BarChart3 className="w-5 h-5" /> },
        { href: '/student/assessments', label: 'Assessments', icon: <FileText className="w-5 h-5" /> },
        { href: '/student/competencies', label: 'Competencies', icon: <Medal className="w-5 h-5" /> },
        { href: '/student/attendance', label: 'Attendance', icon: <Activity className="w-5 h-5" /> },
        { href: '/student/ojt', label: 'OJT Log', icon: <Clock className="w-5 h-5" /> },
      ],
    };

    return [...baseLinks, ...(roleLinks[role] || [])];
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

      <div className="absolute bottom-0 w-64 border-t border-border p-4 space-y-2">
        <Link to="/settings"
          className="flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <Settings className="w-5 h-5" />
          Settings
        </Link>
        <button
          type="button"
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium text-foreground hover:bg-accent transition-colors"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </aside>
  );
}
