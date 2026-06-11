'use client';

import useSWR from 'swr';
import { CalendarCheck, Clock } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSkeleton } from '@/components/loading-skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type AttendanceRecord = {
  _id: string;
  date: string;
  status: 'present' | 'absent' | 'late' | 'excused';
  hoursAttended?: number;
  notes?: string;
};

type AttendanceStats = {
  total: number;
  present: number;
  absent: number;
  late: number;
  excused: number;
  totalHours: number;
  attendancePercentage: string | number;
};

const statusClass: Record<AttendanceRecord['status'], string> = {
  present: 'bg-green-100 text-green-800',
  late: 'bg-yellow-100 text-yellow-800',
  absent: 'bg-red-100 text-red-800',
  excused: 'bg-blue-100 text-blue-800',
};

export default function StudentAttendancePage() {
  const { data: records = [], isLoading } = useSWR<AttendanceRecord[]>(
    '/attendance/me',
    (url: string) => apiClient.get<AttendanceRecord[]>(url)
  );
  const { data: stats } = useSWR<AttendanceStats>(
    '/attendance/me/stats',
    (url: string) => apiClient.get<AttendanceStats>(url)
  );

  if (isLoading) return <LoadingSkeleton />;

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-muted-foreground mt-1">View your attendance record and total training hours.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{stats?.attendancePercentage ?? 0}%</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Present/Late</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-600">
              {(stats?.present ?? 0) + (stats?.late ?? 0)}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Absences</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-red-600">{stats?.absent ?? 0}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Hours</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{stats?.totalHours ?? 0}</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" />
              Attendance Records
            </CardTitle>
            <CardDescription>{records.length} record(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Hours</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record._id}>
                    <TableCell>{new Date(record.date).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge className={statusClass[record.status]}>{record.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1">
                        <Clock className="w-4 h-4 text-muted-foreground" />
                        {record.hoursAttended ?? 0}
                      </span>
                    </TableCell>
                    <TableCell>{record.notes || '-'}</TableCell>
                  </TableRow>
                ))}
                {records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      No attendance records yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
