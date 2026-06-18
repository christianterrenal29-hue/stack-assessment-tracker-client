'use client';

import useSWR from 'swr';
import { CalendarCheck } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { AssessmentSchedule, CandidateAttendanceStatus, StudentSummary } from '@/lib/assessment-types';
import { getStudentProfile } from '@/lib/student-profile';
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

const statusClass: Record<CandidateAttendanceStatus, string> = {
  pending: 'bg-slate-100 text-slate-800',
  present: 'bg-green-100 text-green-800',
  absent: 'bg-red-100 text-red-800',
  'no-show': 'bg-orange-100 text-orange-800',
};

export default function StudentAttendancePage() {
  const { data: student, isLoading: isStudentLoading } = useSWR<StudentSummary | null>('/students/user/profile', getStudentProfile);
  const { data: schedules = [], isLoading: isSchedulesLoading } = useSWR<AssessmentSchedule[]>('/assessments', (url: string) => apiClient.get<AssessmentSchedule[]>(url));

  const records = schedules
    .map((schedule) => ({
      schedule,
      candidate: schedule.candidates.find((candidate) => candidate.student._id === student?._id),
    }))
    .filter((record) => record.candidate);

  const present = records.filter((record) => record.candidate?.attendanceStatus === 'present').length;
  const absent = records.filter((record) => record.candidate && ['absent', 'no-show'].includes(record.candidate.attendanceStatus)).length;
  const pending = records.filter((record) => record.candidate?.attendanceStatus === 'pending').length;
  const attendanceRate = records.length > 0 ? Math.round((present / records.length) * 100) : 0;

  if (isStudentLoading || isSchedulesLoading) return <LoadingSkeleton />;

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Assessment Attendance</h1>
          <p className="text-muted-foreground mt-1">View your assessment schedule attendance status.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Assessment Attendance Rate</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{attendanceRate}%</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Present</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-600">{present}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Absent/No-show</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-red-600">{absent}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Pending</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{pending}</CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5" />
              Assessment Attendance Records
            </CardTitle>
            <CardDescription>{records.length} record(s)</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Date and Time</TableHead>
                  <TableHead>Assessment Attendance</TableHead>
                  <TableHead>Result</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((record) => (
                  <TableRow key={record.schedule._id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{record.schedule.title}</p>
                        <p className="text-xs text-muted-foreground">{record.schedule.course} - {record.schedule.yearLevel}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(record.schedule.scheduleDateTime).toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge className={statusClass[record.candidate!.attendanceStatus]}>{record.candidate!.attendanceStatus}</Badge>
                    </TableCell>
                    <TableCell>{record.candidate!.result.replaceAll('_', ' ')}</TableCell>
                  </TableRow>
                ))}
                {records.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4} className="py-10 text-center text-muted-foreground">
                      No assessment attendance records yet.
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
