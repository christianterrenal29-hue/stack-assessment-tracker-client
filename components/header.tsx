'use client';

import { Bell, LogOut, User, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useAuth } from '@/context/auth-context';

interface HeaderProps {
  userName?: string;
  unreadNotifications?: number;
}

export function Header({ userName = 'User', unreadNotifications = 0 }: HeaderProps) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate('/auth/login', { replace: true });
  };

  return (
    <header className="min-h-16 border-b border-white/80 bg-white/80 px-4 py-3 flex items-center justify-between gap-3 shadow-sm backdrop-blur sm:px-6">
      <div className="flex min-w-0 items-center gap-3">
        <img src="/tesda-logo.png" alt="TESDA logo" className="h-9 w-9 rounded-lg bg-white object-contain p-1 shadow-sm" />
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-[#0b2f57]">Top Link Global College Inc.</p>
          <p className="truncate text-xs text-muted-foreground">Assessment Tracker for Student Records and Monitoring System</p>
        </div>
        <img src="/toplink-logo.png" alt="Top Link Global College logo" className="hidden h-9 w-9 rounded-lg bg-white object-contain p-1 shadow-sm sm:block" />
      </div>

      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <Button asChild variant="ghost" size="icon" className="relative">
          <Link to="/dashboard/notifications" aria-label="Notifications">
            <Bell className="w-5 h-5" />
            {unreadNotifications > 0 && (
              <span className="absolute top-1 right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
                {unreadNotifications}
              </span>
            )}
          </Link>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="rounded-full" aria-label={`${userName} menu`}>
              <Avatar className="h-8 w-8">
                <AvatarFallback>{userName.charAt(0).toUpperCase()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>{userName}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/profile">
              <User className="w-4 h-4 mr-2" />
              <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/settings">
              <Settings className="w-4 h-4 mr-2" />
              <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-red-600" onSelect={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
