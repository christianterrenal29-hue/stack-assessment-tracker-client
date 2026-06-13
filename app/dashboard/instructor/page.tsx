import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { CalendarClock, CheckCircle2, ClipboardList, UserX, Users } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { AssessmentDashboardSummary } from '@/lib/assessment-types';

export default function InstructorDashboard() {
  const { data: summary } = useSWR<AssessmentDashboardSummary>(
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
  ] as const;

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        <div>
          <h1 className="text-4xl font-bold text-foreground">Assessment Coordinator Dashboard</h1>
          <p className="text-muted-foreground">Schedule TESDA assessments, prepare candidate lists, and monitor results.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {metrics.map(([label, value, Icon]) => (
            <div key={label} className="rounded-lg border bg-card p-5">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">{label}</p>
                <Icon className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <section className="rounded-lg border bg-card p-6">
            <h2 className="mb-4 text-2xl font-bold text-foreground">Upcoming Assessment Schedules</h2>
            <div className="space-y-3">
              {(summary?.upcomingSchedules ?? []).map((schedule) => (
                <div key={schedule._id} className="rounded-lg border p-4">
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
                <p className="rounded-lg border p-6 text-center text-muted-foreground">No upcoming assessment schedules.</p>
              )}
            </div>
          </section>

          <aside className="h-fit rounded-lg border bg-card p-6">
            <h3 className="mb-4 text-lg font-bold text-foreground">Quick Actions</h3>
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
      </div>
    </main>
  );
}
