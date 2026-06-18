'use client';

import useSWR from 'swr';
import { CalendarClock, CheckCircle2, ClipboardList, UserX } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/context/auth-context';
import { AssessmentSchedule, formatCandidateName } from '@/lib/assessment-types';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardPage } from '@/components/dashboard-page';

export default function AssessorDashboard() {
  const { user } = useAuth();
  const { data: schedules = [], isLoading, error } = useSWR<AssessmentSchedule[]>(
    user?._id ? `/assessments?assessor=${user._id}` : null,
    (url: string) => apiClient.get<AssessmentSchedule[]>(url)
  );

  const candidates = schedules.flatMap((schedule) => schedule.candidates);

  const metrics = [
    ['Upcoming Schedules', schedules.filter((schedule) => schedule.status === 'scheduled').length, CalendarClock],
    ['Candidates Scheduled', candidates.length, ClipboardList],
    ['Completed Assessments', schedules.filter((schedule) => schedule.status === 'completed').length, ClipboardList],
    ['Competent', candidates.filter((candidate) => candidate.result === 'competent').length, CheckCircle2],
    ['Not Yet Competent', candidates.filter((candidate) => candidate.result === 'not_yet_competent').length, ClipboardList],
    ['Absent/No-show', candidates.filter((candidate) => ['absent', 'no-show'].includes(candidate.attendanceStatus)).length, UserX],
  ] as const;

  return (
    <DashboardPage>
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-[#0b2f57] sm:text-3xl">Assessor Dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">View assigned TESDA assessment schedules and candidate results.</p>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message || 'Failed to load assigned schedules'}</AlertDescription>
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
            <CardTitle className="text-xl text-[#0b2f57]">Assigned Assessment Schedules</CardTitle>
            <CardDescription>Candidate attendance and competency decisions for your schedules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {schedules.map((schedule) => (
              <div key={schedule._id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                <div className="mb-3 flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
                  <div>
                    <p className="font-semibold">{schedule.title}</p>
                    <p className="text-sm text-muted-foreground">{schedule.course} - {schedule.yearLevel}</p>
                    <p className="text-sm text-muted-foreground">{schedule.qualificationTitle} {schedule.ncLevel}</p>
                    <p className="text-sm text-muted-foreground">{new Date(schedule.scheduleDateTime).toLocaleString()} at {schedule.assessmentCenter}</p>
                  </div>
                  <Badge>{schedule.status}</Badge>
                </div>
                <div className="grid gap-2">
                  {schedule.candidates.map((candidate) => (
                    <div key={candidate.student._id} className="flex flex-col gap-1 rounded-md bg-accent/60 px-3 py-2 text-sm md:flex-row md:items-center md:justify-between">
                      <span>{formatCandidateName(candidate)}</span>
                      <span className="text-muted-foreground">{candidate.attendanceStatus} - {candidate.result.replaceAll('_', ' ')}</span>
                    </div>
                  ))}
                  {schedule.candidates.length === 0 && <p className="text-sm text-muted-foreground">No candidates assigned yet.</p>}
                </div>
              </div>
            ))}
            {schedules.length === 0 && <p className="rounded-2xl border border-dashed bg-slate-50/60 p-6 text-center text-muted-foreground">No assigned schedules.</p>}
          </CardContent>
        </Card>
    </DashboardPage>
  );
}
