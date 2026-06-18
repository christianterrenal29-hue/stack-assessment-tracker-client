import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Privacy Policy</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm leading-7 text-muted-foreground">
            <p>
              TESDA Assessment Tracker / Assessment Tracker for Student Records and Monitoring System stores account, candidate, assessment schedule, attendance, competency result, document, notification, report, and audit information needed to operate TESDA assessment workflows at Top Link Global College Inc.
            </p>
            <p>
              Access is limited by role. Administrators manage institutional records, assessment
              coordinators maintain schedules and candidate lists, assessors record assessment outcomes,
              and students view their own candidate records.
            </p>
            <p>
              Uploaded documents may include identification files, application forms, self-assessment guides, attendance sheets, rating sheets, certificates, and related evidence. These records are used only for legitimate academic, assessment, monitoring, reporting, and compliance purposes.
            </p>
            <p>
              The system applies authenticated access, role-based permissions, protected API routes, and audit logging where supported by the module. Users should not share credentials or download, disclose, alter, or delete records except for authorized institutional work.
            </p>
            <p>
              Records should be retained, archived, corrected, or removed according to school policy, TESDA documentation requirements, and applicable Philippine data privacy obligations.
            </p>
            <Button asChild variant="outline">
              <Link to="/auth/login">Back to login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
