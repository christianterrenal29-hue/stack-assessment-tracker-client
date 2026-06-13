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
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              TESDA Assessment Tracker stores account, candidate, assessment schedule, attendance,
              competency result, document, and audit information needed to operate TESDA assessment workflows.
            </p>
            <p>
              Access is limited by role. Administrators manage institutional records, assessment
              coordinators maintain schedules and candidate lists, assessors record assessment outcomes,
              and students view their own candidate records.
            </p>
            <p>
              Uploaded documents and audit records should be handled according to institutional
              retention policies and applicable data-protection requirements.
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
