'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';
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
  _id: string;
  type: 'risk_alert' | 'intervention' | 'achievement' | 'general' | 'upcoming_assessment' | 'missing_requirements' | 'result_posted' | 'schedule_updated';
  title: string;
  message: string;
  createdAt: string;
  read: boolean;
  actionUrl?: string;
}

export default function NotificationsPage() {
  const [error, setError] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const { data: notifications = [], mutate, isLoading, error: loadError } = useSWR<Notification[]>(
    '/notifications',
    (url: string) => apiClient.get<Notification[]>(url)
  );

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getNotificationColor = (type: string) => {
    const colors: Record<string, string> = {
      risk_alert: 'border-red-200 bg-red-50 text-red-900',
      missing_requirements: 'border-yellow-200 bg-yellow-50 text-yellow-900',
      result_posted: 'border-green-200 bg-green-50 text-green-900',
      upcoming_assessment: 'border-blue-200 bg-blue-50 text-blue-900',
      schedule_updated: 'border-cyan-200 bg-cyan-50 text-cyan-900',
      intervention: 'border-orange-200 bg-orange-50 text-orange-900',
      achievement: 'border-green-200 bg-green-50 text-green-900',
      general: 'border-slate-200 bg-slate-50 text-slate-900',
    };
    return colors[type] || 'border-gray-200 bg-gray-50 text-gray-900';
  };

  const getNotificationBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      risk_alert: 'bg-red-100 text-red-800',
      missing_requirements: 'bg-yellow-100 text-yellow-800',
      result_posted: 'bg-green-100 text-green-800',
      upcoming_assessment: 'bg-blue-100 text-blue-800',
      schedule_updated: 'bg-cyan-100 text-cyan-800',
      intervention: 'bg-orange-100 text-orange-800',
      achievement: 'bg-green-100 text-green-800',
      general: 'bg-slate-100 text-slate-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  const getNotificationIcon = (type: Notification['type']) => {
    if (type === 'result_posted' || type === 'achievement') return <TrendingUp className="w-4 h-4" />;
    if (type === 'missing_requirements') return <FileText className="w-4 h-4" />;
    if (type === 'schedule_updated') return <Users className="w-4 h-4" />;
    if (type === 'upcoming_assessment') return <Bell className="w-4 h-4" />;
    return <AlertCircle className="w-4 h-4" />;
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await apiClient.put(`/notifications/${id}/read`, {});
      await mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notification as read');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await apiClient.put('/notifications/read/all', {});
      await mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to mark notifications as read');
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await apiClient.delete(`/notifications/${deleteId}`);
      setDeleteId(null);
      await mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to delete notification');
    } finally {
      setIsDeleting(false);
    }
  };

  const grouped = useMemo(() => ({
    alerts: notifications.filter((n) => n.type === 'risk_alert'),
    success: notifications.filter((n) => n.type === 'result_posted' || n.type === 'achievement'),
    warnings: notifications.filter((n) => n.type === 'missing_requirements'),
    unread: notifications.filter((n) => !n.read),
  }), [notifications]);

  const NotificationItem = ({ notification }: { notification: Notification }) => (
    <div
      className={`p-4 border rounded-lg transition-colors ${getNotificationColor(
        notification.type
      )} ${!notification.read ? 'font-medium' : 'opacity-75'}`}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1">
          <div className="mt-1">{getNotificationIcon(notification.type)}</div>
          <div className="flex-1">
            <h4 className="font-semibold">{notification.title}</h4>
            <p className="text-sm mt-1">{notification.message}</p>
            <div className="flex items-center gap-2 mt-3">
              <time className="text-xs">
                {new Date(notification.createdAt).toLocaleString()}
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
              onClick={() => handleMarkAsRead(notification._id)}
              className="text-xs"
            >
              Mark Read
            </Button>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setDeleteId(notification._id)}
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">
              Notifications
            </h1>
            <p className="text-muted-foreground mt-1">
              Upcoming assessments, missing requirements, posted results, and schedule updates
            </p>
          </div>
          {unreadCount > 0 && (
            <Badge className="h-fit">
              <Bell className="w-3 h-3 mr-1" />
              {unreadCount} Unread
            </Badge>
          )}
        </div>
        {(error || loadError) && (
          <Alert variant="destructive">
            <AlertDescription>{error || loadError.message || 'Failed to load notifications'}</AlertDescription>
          </Alert>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
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
        </div>

        {isLoading ? (
          <Card>
            <CardHeader className="text-center py-12">
              <CardTitle>Loading Notifications</CardTitle>
              <CardDescription>Fetching TESDA assessment notifications.</CardDescription>
            </CardHeader>
          </Card>
        ) : notifications.length === 0 ? (
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
                    key={notification._id}
                    notification={notification}
                  />
                ))}
              </div>
            </TabsContent>

            <TabsContent value="alerts" className="mt-6">
              <div className="space-y-3">
                {grouped.alerts.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
                {grouped.alerts.length === 0 && <Card><CardHeader className="text-center py-10"><CardTitle>No Alerts</CardTitle><CardDescription>No risk alerts at this time.</CardDescription></CardHeader></Card>}
              </div>
            </TabsContent>

            <TabsContent value="success" className="mt-6">
              <div className="space-y-3">
                {grouped.success.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
                {grouped.success.length === 0 && <Card><CardHeader className="text-center py-10"><CardTitle>No Success Notifications</CardTitle><CardDescription>No posted results or achievements yet.</CardDescription></CardHeader></Card>}
              </div>
            </TabsContent>

            <TabsContent value="warnings" className="mt-6">
              <div className="space-y-3">
                {grouped.warnings.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
                {grouped.warnings.length === 0 && <Card><CardHeader className="text-center py-10"><CardTitle>No Warnings</CardTitle><CardDescription>No missing-requirement notices at this time.</CardDescription></CardHeader></Card>}
              </div>
            </TabsContent>

            <TabsContent value="unread" className="mt-6">
              <div className="space-y-3">
                {grouped.unread.map((notification) => (
                    <NotificationItem
                      key={notification._id}
                      notification={notification}
                    />
                  ))}
                {grouped.unread.length === 0 && <Card><CardHeader className="text-center py-10"><CardTitle>No Unread Notifications</CardTitle><CardDescription>Everything has been reviewed.</CardDescription></CardHeader></Card>}
              </div>
            </TabsContent>
          </Tabs>
        )}
        <ConfirmDeleteDialog
          open={Boolean(deleteId)}
          onOpenChange={(open) => !open && setDeleteId(null)}
          onConfirm={handleDelete}
          isDeleting={isDeleting}
          title="Delete notification?"
          description="This will remove the selected notification from your list."
        />
      </div>
    </div>
  );
}
