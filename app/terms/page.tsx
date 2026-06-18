import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background px-4 py-10">
      <div className="mx-auto max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle>Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-sm leading-7 text-muted-foreground">
            <p>
              TESDA Assessment Tracker / Assessment Tracker for Student Records and Monitoring System is intended for authorized training, assessment, reporting, compliance, and learner progress monitoring activities.
            </p>
            <p>
              Users are responsible for keeping credentials confidential and for entering accurate
              records within the permissions assigned to their role.
            </p>
            <p>
              Records, documents, grades, and audit trails should only be created, updated, exported,
              or deleted for legitimate institutional purposes.
            </p>
            <p>
              Unauthorized access, false entries, tampering with candidate results, misuse of student documents, or attempts to bypass role restrictions are prohibited and may be subject to school disciplinary action.
            </p>
            <p>
              Reports generated from the system should be reviewed before official submission. The institution remains responsible for validating assessment records, candidate eligibility, and documentary requirements.
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
