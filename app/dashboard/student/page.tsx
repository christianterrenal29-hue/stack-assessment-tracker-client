'use client';

import useSWR from 'swr';
import { CalendarClock, CheckCircle2, ClipboardList, UserX } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { AssessmentSchedule, StudentSummary } from '@/lib/assessment-types';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function StudentDashboard() {
  const { data: student } = useSWR<StudentSummary>('/students/user/profile', (url: string) => apiClient.get<StudentSummary>(url));
  const { data: schedules = [] } = useSWR<AssessmentSchedule[]>('/assessments', (url: string) => apiClient.get<AssessmentSchedule[]>(url));

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
    ['Absent/No-show', mySchedules.filter(({ candidate }) => candidate?.attendanceStatus === 'absent').length, UserX],
  ] as const;

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">My Assessment Dashboard</h1>
          <p className="text-muted-foreground">Track your TESDA assessment schedule, attendance, and competency result.</p>
          {student && <p className="text-sm text-muted-foreground">{student.course} - {student.yearLevel}</p>}
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {metrics.map(([label, value, Icon]) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <p className="text-3xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>My Assessment Schedules</CardTitle>
            <CardDescription>Confirmed schedules where you are included as a candidate.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {mySchedules.map(({ schedule, candidate }) => (
              <div key={schedule._id} className="rounded-lg border p-4">
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
            {mySchedules.length === 0 && <p className="rounded-lg border p-6 text-center text-muted-foreground">No assessment schedule assigned yet.</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
