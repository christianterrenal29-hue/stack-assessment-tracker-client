import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { AlertTriangle, CalendarClock, CheckCircle2, ClipboardList, Clock3, UserX, Users } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { AssessmentDashboardSummary } from '@/lib/assessment-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Skeleton } from '@/components/ui/skeleton';
import { DashboardPage } from '@/components/dashboard-page';

export default function InstructorDashboard() {
  const { data: summary, isLoading, error } = useSWR<AssessmentDashboardSummary>(
    '/assessments/summary/dashboard',
    (url: string) => apiClient.get<AssessmentDashboardSummary>(url)
  );

  const metrics = [
    ['Upcoming Schedules', summary?.upcomingAssessmentSchedules ?? 0, CalendarClock],
    ['Candidates Scheduled', summary?.totalCandidatesScheduled ?? 0, Users],
    ['Completed Assessments', summary?.completedAssessments ?? 0, ClipboardList],
    ['Competent', summary?.competentCount ?? 0, CheckCircle2],
    ['Not Yet Competent', summary?.notYetCompetentCount ?? 0, ClipboardList],
    ['Absent/No-show', summary?.absentNoShowCandidates ?? 0, UserX],
    ['Pending Results', summary?.pendingResults ?? 0, Clock3],
    ['Missing Requirements', summary?.missingRequirements ?? 0, AlertTriangle],
  ] as const;

  return (
    <DashboardPage>
        <div>
          <h1 className="text-2xl font-semibold tracking-normal text-[#0b2f57] sm:text-3xl">Assessment Coordinator Dashboard</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Schedule TESDA assessments, prepare candidate lists, and monitor results.</p>
        </div>
        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error.message || 'Failed to load dashboard summary'}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-8">
          {metrics.map(([label, value, Icon]) => (
            <div key={label} className="rounded-2xl border border-white/75 bg-white/85 p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              {isLoading ? <Skeleton className="h-9 w-16" /> : <p className="text-3xl font-bold text-foreground">{value}</p>}
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-2xl border border-white/75 bg-white/85 p-6 shadow-sm">
            <h2 className="mb-4 text-xl font-semibold text-[#0b2f57]">Upcoming Assessment Schedules</h2>
            <div className="space-y-3">
              {(summary?.upcomingSchedules ?? []).map((schedule) => (
                <div key={schedule._id} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                  <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-semibold">{schedule.title}</p>
                      <p className="text-sm text-muted-foreground">{schedule.course} - {schedule.yearLevel}</p>
                      <p className="text-sm text-muted-foreground">{schedule.qualificationTitle} {schedule.ncLevel}</p>
                    </div>
                    <div className="text-sm text-muted-foreground md:text-right">
                      <p>{new Date(schedule.scheduleDateTime).toLocaleString()}</p>
                      <p>{schedule.candidates.length}/{schedule.maxCandidates} candidates</p>
                    </div>
                  </div>
                </div>
              ))}
              {(summary?.upcomingSchedules ?? []).length === 0 && (
                <p className="rounded-2xl border border-dashed bg-slate-50/60 p-6 text-center text-muted-foreground">No upcoming assessment schedules.</p>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-2xl border border-white/75 bg-white/85 p-6 shadow-sm">
            <h3 className="mb-4 text-lg font-semibold text-[#0b2f57]">Quick Actions</h3>
            <div className="space-y-3">
              <Link to="/instructor/assessments" className="block rounded-lg bg-blue-600 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-blue-700">
                Create Schedule
              </Link>
              <Link to="/instructor/students" className="block rounded-lg bg-slate-700 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-slate-800">
                Manage Candidates
              </Link>
              <Link to="/reports" className="block rounded-lg bg-green-700 px-4 py-3 text-center text-sm font-medium text-white transition hover:bg-green-800">
                View Reports
              </Link>
            </div>
          </aside>
        </div>
    </DashboardPage>
  );
}
