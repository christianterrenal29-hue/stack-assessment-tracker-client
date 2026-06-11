'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  AlertCircle,
  CheckCircle2,
  Bell,
  FileText,
  Users,
  TrendingUp,
  Trash2,
} from 'lucide-react';

interface Notification {
  id: string;
  type: 'alert' | 'info' | 'success' | 'warning';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: React.ReactNode;
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'alert',
      title: 'Critical Student Alert',
      message: 'Ana Reyes has not submitted any assignments in 7 days',
      timestamp: '2024-05-24T10:30:00',
      read: false,
      icon: <AlertCircle className="w-4 h-4" />,
    },
    {
      id: '2',
      type: 'success',
      title: 'Assessment Completed',
      message: 'Maria Garcia completed Module 1 Assessment with 85%',
      timestamp: '2024-05-24T09:15:00',
      read: false,
      icon: <CheckCircle2 className="w-4 h-4" />,
    },
    {
      id: '3',
      type: 'warning',
      title: 'Low Attendance Alert',
      message: 'Carlos Santos has 78% attendance rate',
      timestamp: '2024-05-23T14:45:00',
      read: true,
      icon: <AlertCircle className="w-4 h-4" />,
    },
    {
      id: '4',
      type: 'info',
      title: 'New Submission',
      message: 'Juan Cruz submitted Module 2 Mid-Term Assessment',
      timestamp: '2024-05-23T11:20:00',
      read: true,
      icon: <FileText className="w-4 h-4" />,
    },
    {
      id: '5',
      type: 'success',
      title: 'Competency Achieved',
      message: 'Maria Garcia achieved Competency: Electrical Circuits',
      timestamp: '2024-05-22T16:30:00',
      read: true,
      icon: <TrendingUp className="w-4 h-4" />,
    },
    {
      id: '6',
      type: 'info',
      title: 'Student Enrolled',
      message: '3 new students have enrolled in Electrical Installation program',
      timestamp: '2024-05-22T10:00:00',
      read: true,
      icon: <Users className="w-4 h-4" />,
    },
    {
      id: '7',
      type: 'warning',
      title: 'Assessment Due Soon',
      message: 'Module 3 Assessment is due in 2 days',
      timestamp: '2024-05-21T09:00:00',
      read: true,
      icon: <Bell className="w-4 h-4" />,
    },
  ]);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      alert: 'border-red-200 bg-red-50 text-red-900',
      warning: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      success: 'border-green-200 bg-green-50 text-green-900',
      info: 'border-blue-200 bg-blue-50 text-blue-900',
    };
    return colors[type] || 'border-gray-200 bg-gray-50 text-gray-900';
  };

  const getNotificationBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      alert: 'bg-red-100 text-red-800',
      warning: 'bg-yellow-100 text-yellow-800',
      success: 'bg-green-100 text-green-800',
      info: 'bg-blue-100 text-blue-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const handleDeleteAll = () => {
    setNotifications([]);
  };

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={`p-4 border rounded-lg transition-colors ${getNotificationColor(
        notification.type
      )} ${!notification.read ? 'font-medium' : 'opacity-75'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          {notification.icon && (
            <div className="mt-1">{notification.icon}</div>
          )}
          <div className="flex-1">
            <h4 className="font-semibold">{notification.title}</h4>
            <p className="text-sm mt-1">{notification.message}</p>
            <div className="flex items-center gap-2 mt-3">
              <time className="text-xs">
                {new Date(notification.timestamp).toLocaleString()}
              </time>
              {!notification.read && (
                <Badge
                  className={getNotificationBadgeColor(notification.type)}
                >
                  New
                </Badge>
              )}
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          {!notification.read && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleMarkAsRead(notification.id)}
              className="text-xs"
            >
              Mark Read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(notification.id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Stay updated with system events
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge className="h-fit">
              <Bell className="w-3 h-3 mr-1" />
              {unreadCount} Unread
            </Badge>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2 mb-6">
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="gap-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              Mark All as Read
            </Button>
          )}
          {notifications.length > 0 && (
            <Button
              variant="outline"
              onClick={handleDeleteAll}
              className="gap-2 text-destructive"
            >
              <Trash2 className="w-4 h-4" />
              Clear All
            </Button>
          )}
        </div>

        {notifications.length === 0 ? (
          <Card>
            <CardHeader className="text-center py-12">
              <Bell className="w-12 h-12 mx-auto text-muted-foreground mb-4" />
              <CardTitle>No Notifications</CardTitle>
              <CardDescription>
                You&apos;re all caught up! Check back later for updates.
              </CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="alerts">Alerts</TabsTrigger>
              <TabsTrigger value="success">Success</TabsTrigger>
              <TabsTrigger value="warnings">Warnings</TabsTrigger>
              <TabsTrigger value="unread">
                Unread ({unreadCount})
              </TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="mt-6">
              <div className="space-y-3">
                {notifications.map((notification) => (
                  <NotificationItem
                    key={notification.id}
                    notification={notification}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="mt-6">
              <div className="space-y-3">
                {notifications
                  .filter((n) => n.type === 'alert')
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="success" className="mt-6">
              <div className="space-y-3">
                {notifications
                  .filter((n) => n.type === 'success')
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="warnings" className="mt-6">
              <div className="space-y-3">
                {notifications
                  .filter((n) => n.type === 'warning')
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="unread" className="mt-6">
              <div className="space-y-3">
                {notifications
                  .filter((n) => !n.read)
                  .map((notification) => (
                    <NotificationItem
                      key={notification.id}
                      notification={notification}
                    />
                  ))}
              </div>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </div>
  );
}
