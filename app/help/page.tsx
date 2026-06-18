import { BookOpen, ClipboardCheck, FileText, ShieldCheck, Users } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardPage } from '@/components/dashboard-page';

const guideSections = [
  {
    title: 'Administrator',
    icon: ShieldCheck,
    items: ['Manage user accounts and roles.', 'Maintain institutions, departments, and competency records.', 'Review audit logs, compliance pages, reports, and documents.'],
  },
  {
    title: 'Instructor / Coordinator',
    icon: ClipboardCheck,
    items: ['Create assessment schedules and assign assessors.', 'Add candidates by course and year level.', 'Monitor attendance, requirements, results, and printable reports.'],
  },
  {
    title: 'Assessor',
    icon: FileText,
    items: ['View assigned assessment schedules.', 'Review candidate attendance and competency outcomes.', 'Access documents and reports needed for assessment validation.'],
  },
  {
    title: 'Student',
    icon: Users,
    items: ['View assessment schedule, attendance, and result status.', 'Track competencies and requirements.', 'Access uploaded documents when available.'],
  },
];

export default function HelpPage() {
  return (
    <DashboardPage>
      <div>
        <h1 className="text-3xl font-bold text-foreground sm:text-4xl">Help / User Guide</h1>
        <p className="mt-2 text-muted-foreground">
          Quick role-based guide for using the TESDA Assessment Tracker for Student Records and Monitoring System.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {guideSections.map(({ title, icon: Icon, items }) => (
          <Card key={title}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <Icon className="h-5 w-5 text-primary" />
                {title}
              </CardTitle>
              <CardDescription>Common tasks and modules for this role.</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {items.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span className="mt-2 h-1.5 w-1.5 rounded-full bg-primary" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            General Workflow
          </CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 text-sm text-muted-foreground md:grid-cols-4">
          {['Prepare candidate records and requirements.', 'Schedule TESDA assessment and assign assessor.', 'Record attendance and competency results.', 'Generate reports and keep audit-ready records.'].map((step, index) => (
            <div key={step} className="rounded-md border bg-card p-4">
              <p className="mb-2 text-xs font-semibold uppercase text-primary">Step {index + 1}</p>
              <p>{step}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </DashboardPage>
  );
}
