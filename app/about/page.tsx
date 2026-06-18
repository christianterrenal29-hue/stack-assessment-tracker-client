import { Building2, GraduationCap, ShieldCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardPage } from '@/components/dashboard-page';

const systemHighlights = [
  {
    title: 'Institutional Branding',
    description: 'Uses TESDA and Top Link Global College identity across login, landing, and dashboard screens.',
    icon: Building2,
  },
  {
    title: 'Assessment Records',
    description: 'Tracks schedules, candidates, attendance, competency results, requirements, and downloadable reports.',
    icon: GraduationCap,
  },
  {
    title: 'Role-Based Access',
    description: 'Separates administrator, instructor, assessor, and student workflows with protected dashboard modules.',
    icon: ShieldCheck,
  },
];

export default function AboutSystemPage() {
  return (
    <DashboardPage>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div>
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">About System</h1>
          <p className="mt-2 max-w-3xl text-muted-foreground">
            TESDA Assessment Tracker / Assessment Tracker for Student Records and Monitoring System supports Top Link Global College Inc. in managing TESDA assessment operations, candidate records, documents, results, and monitoring reports.
          </p>
        </div>
        <Card>
          <CardContent className="flex items-center justify-between gap-4 p-5">
            <img src="/tesda-logo.png" alt="TESDA logo" className="h-16 w-16 object-contain" />
            <img src="/toplink-logo.png" alt="Top Link Global College logo" className="h-16 w-16 object-contain" />
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {systemHighlights.map(({ title, description, icon: Icon }) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
              <CardDescription>{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>System Purpose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-7 text-muted-foreground">
          <p>
            The system centralizes student assessment records and monitoring activities so faculty, assessors, and administrators can prepare assessment schedules, validate candidate requirements, monitor outcomes, and maintain reports for institutional documentation.
          </p>
          <p>
            It is designed as an academic capstone-ready MERN application with a Vite React frontend, Express API, MongoDB data models, protected routes, and role-aware modules.
          </p>
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
