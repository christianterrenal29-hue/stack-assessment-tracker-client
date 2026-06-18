'use client';

import useSWR from 'swr';
import { CalendarClock, CheckCircle2, ClipboardList, UserX } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { AssessmentSchedule, StudentSummary } from '@/lib/assessment-types';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardPage } from '@/components/dashboard-page';
import { getStudentProfile } from '@/lib/student-profile';

export default function StudentDashboard() {
  const { data: student, error: studentError } = useSWR<StudentSummary | null>('/students/user/profile', getStudentProfile);
  const { data: schedules = [], isLoading, error: schedulesError } = useSWR<AssessmentSchedule[]>('/assessments', (url: string) => apiClient.get<AssessmentSchedule[]>(url));

  const mySchedules = schedules
    .map((schedule) => ({
      schedule,
      candidate: schedule.candidates.find((candidate) => candidate.student._id === student?._id),
    }))
    .filter((item) => item.candidate);

  const metrics = [
    ['Upcoming Schedules', mySchedules.filter(({ schedule }) => schedule.status === 'scheduled').length, CalendarClock],
    ['Candidates Scheduled', mySchedules.length, CalendarClock],
    ['Completed Assessments', mySchedules.filter(({ schedule }) => schedule.status === 'completed').length, ClipboardList],
    ['Competent', mySchedules.filter(({ candidate }) => candidate?.result === 'competent').length, CheckCircle2],
    ['Not Yet Competent', mySchedules.filter(({ candidate }) => candidate?.result === 'not_yet_competent').length, ClipboardList],
    ['Absent/No-show', mySchedules.filter(({ candidate }) => candidate && ['absent', 'no-show'].includes(candidate.attendanceStatus)).length, UserX],
  ] as const;

  return (
    <DashboardPage>
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-[#0b2f57] sm:text-3xl">My Assessment Dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Track your TESDA assessment schedule, attendance, and competency result.</p>
          {student && <p className="text-sm text-muted-foreground">{student.course} - {student.yearLevel}</p>}
        </div>
        {(studentError || schedulesError) && (
          <Alert variant="destructive">
            <AlertDescription>{studentError?.message || schedulesError?.message || 'Failed to load assessment dashboard'}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {metrics.map(([label, value, Icon]) => (
            <Card key={label} className="border-white/75 bg-white/85 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-3xl font-bold">{value}</p>}
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="border-white/75 bg-white/85 shadow-sm">
          <CardHeader>
            <CardTitle className="text-xl text-[#0b2f57]">My Assessment Schedules</CardTitle>
            <CardDescription>Confirmed schedules where you are included as a candidate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mySchedules.map(({ schedule, candidate }) => (
              <div key={schedule._id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold">{schedule.title}</p>
                    <p className="text-sm text-muted-foreground">{schedule.course} - {schedule.yearLevel}</p>
                    <p className="text-sm text-muted-foreground">{schedule.qualificationTitle} {schedule.ncLevel}</p>
                    <p className="text-sm text-muted-foreground">{new Date(schedule.scheduleDateTime).toLocaleString()} at {schedule.assessmentCenter}</p>
                    <p className="text-sm text-muted-foreground">Assessor: {schedule.assessorName}</p>
                  </div>
                  <div className="flex flex-wrap gap-2 md:justify-end">
                    <Badge>{schedule.status}</Badge>
                    <Badge variant="outline">{candidate?.attendanceStatus}</Badge>
                    <Badge variant="outline">{candidate?.result.replaceAll('_', ' ')}</Badge>
                  </div>
                </div>
              </div>
            ))}
            {mySchedules.length === 0 && <p className="rounded-2xl border border-dashed bg-slate-50/60 p-6 text-center text-muted-foreground">No assessment schedule assigned yet.</p>}
          </CardContent>
        </Card>
    </DashboardPage>
  );
}
