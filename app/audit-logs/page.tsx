'use client';

import { useEffect, useState } from 'react';
import { RefreshCw, ScrollText } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AuditUser = {
  firstName?: string;
  lastName?: string;
  email?: string;
  role?: string;
};

type AuditLog = {
  _id: string;
  user?: AuditUser | string;
  action: string;
  entity: string;
  entityId?: string;
  changes?: Record<string, unknown>;
  ipAddress?: string;
  timestamp: string;
};

const userLabel = (user: AuditLog['user']) => {
  if (!user || typeof user === 'string') return 'System';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ');
  return name || user.email || 'User';
};

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const loadLogs = async () => {
    setIsLoading(true);
    setError('');
    try {
      const data = await apiClient.get<AuditLog[]>('/audit-logs');
      setLogs(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load audit logs');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadLogs();
  }, []);

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Audit Logs</h1>
            <p className="mt-1 text-muted-foreground">
              Review administrative and system actions across TESDA tracker modules.
            </p>
          </div>
          <Button variant="outline" onClick={loadLogs} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ScrollText className="h-5 w-5" />
              Activity Trail
            </CardTitle>
            <CardDescription>
              {isLoading ? 'Loading logs...' : `${logs.length} recent event(s)`}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Action</TableHead>
                  <TableHead>Module</TableHead>
                  <TableHead>User</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>IP / Device</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {logs.map((log) => (
                  <TableRow key={log._id}>
                    <TableCell>
                      <Badge variant="secondary">{log.action}</Badge>
                    </TableCell>
                    <TableCell>{log.entity}</TableCell>
                    <TableCell>
                      <div className="font-medium">{userLabel(log.user)}</div>
                      {typeof log.user === 'object' && log.user?.email && (
                        <div className="text-xs text-muted-foreground">{log.user.email}</div>
                      )}
                    </TableCell>
                    <TableCell>{new Date(log.timestamp).toLocaleString()}</TableCell>
                    <TableCell>
                      <div>{log.ipAddress || 'Unknown IP'}</div>
                      <div className="max-w-xs truncate text-xs text-muted-foreground">
                        {String(log.changes?.userAgent || 'Unknown device')}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {!isLoading && logs.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No audit log entries found.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
