'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { CalendarCheck } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { AssessmentSchedule, CandidateAttendanceStatus, formatCandidateName } from '@/lib/assessment-types';
import { COURSE_OPTIONS, YEAR_LEVEL_OPTIONS } from '@/lib/school-options';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
};

export default function AttendancePage() {
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [error, setError] = useState('');

  const { data: schedules = [], mutate, isLoading } = useSWR<AssessmentSchedule[]>(
    '/assessments',
    (url: string) => apiClient.get<AssessmentSchedule[]>(url)
  );

  const rows = useMemo(() => {
    return schedules
      .filter((schedule) => !courseFilter || schedule.course === courseFilter)
      .filter((schedule) => !yearFilter || schedule.yearLevel === yearFilter)
      .flatMap((schedule) =>
        schedule.candidates.map((candidate) => ({ schedule, candidate }))
      )
      .filter(({ candidate }) => !statusFilter || candidate.attendanceStatus === statusFilter);
  }, [courseFilter, schedules, statusFilter, yearFilter]);

  const updateAttendance = async (
    schedule: AssessmentSchedule,
    studentId: string,
    attendanceStatus: CandidateAttendanceStatus
  ) => {
    setError('');
    try {
      await apiClient.patch(`/assessments/${schedule._id}/candidates/${studentId}`, { attendanceStatus });
      await mutate();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to update assessment attendance');
    }
  };

  if (isLoading) return <LoadingSkeleton />;

  const present = rows.filter(({ candidate }) => candidate.attendanceStatus === 'present').length;
  const absent = rows.filter(({ candidate }) => candidate.attendanceStatus === 'absent').length;
  const pending = rows.filter(({ candidate }) => candidate.attendanceStatus === 'pending').length;

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Assessment Attendance</h1>
          <p className="text-muted-foreground mt-1">Update candidate present, absent/no-show, or pending status per assessment schedule.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Present</p>
              <p className="text-2xl font-bold text-green-600">{present}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Absent/No-show</p>
              <p className="text-2xl font-bold text-red-600">{absent}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">Pending</p>
              <p className="text-2xl font-bold">{pending}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarCheck className="h-5 w-5" />
              Candidate Assessment Attendance
            </CardTitle>
            <CardDescription>{rows.length} candidate record(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-3">
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
                <option value="">All Courses</option>
                {COURSE_OPTIONS.map((course) => <option key={course} value={course}>{course}</option>)}
              </select>
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}>
                <option value="">All Year Levels</option>
                {YEAR_LEVEL_OPTIONS.map((yearLevel) => <option key={yearLevel} value={yearLevel}>{yearLevel}</option>)}
              </select>
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={statusFilter} onChange={(event) => setStatusFilter(event.target.value)}>
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="present">Present</option>
                <option value="absent">Absent/No-show</option>
              </select>
            </div>

            {error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Candidate</TableHead>
                  <TableHead>Schedule</TableHead>
                  <TableHead>Date and Time</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Update</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rows.map(({ schedule, candidate }) => (
                  <TableRow key={`${schedule._id}-${candidate.student._id}`}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{formatCandidateName(candidate)}</p>
                        <p className="text-xs text-muted-foreground">{candidate.student.studentId}</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{schedule.title}</p>
                        <p className="text-xs text-muted-foreground">{schedule.course} - {schedule.yearLevel}</p>
                      </div>
                    </TableCell>
                    <TableCell>{new Date(schedule.scheduleDateTime).toLocaleString()}</TableCell>
                    <TableCell><Badge className={statusClass[candidate.attendanceStatus]}>{candidate.attendanceStatus}</Badge></TableCell>
                    <TableCell>
                      <div className="flex justify-end gap-2">
                        {(['pending', 'present', 'absent'] as const).map((status) => (
                          <Button
                            key={status}
                            variant={candidate.attendanceStatus === status ? 'default' : 'outline'}
                            size="sm"
                            onClick={() => updateAttendance(schedule, candidate.student._id, status)}
                          >
                            {status === 'absent' ? 'Absent/No-show' : status}
                          </Button>
                        ))}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {rows.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={5} className="py-10 text-center text-muted-foreground">
                      No candidate assessment attendance records found.
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
