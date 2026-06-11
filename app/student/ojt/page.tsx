'use client';

import useSWR from 'swr';
import { BriefcaseBusiness, ClipboardList } from 'lucide-react';
import { DashboardLayout } from '@/components/dashboard-layout';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { LoadingSkeleton } from '@/components/loading-skeleton';

type OJTRecord = {
  _id: string;
  company?: string;
  supervisor?: string;
  supervisorContact?: string;
  startDate?: string;
  endDate?: string;
  status: 'ongoing' | 'completed' | 'terminated';
  requiredHours: number;
  hoursCompleted: number;
  monthlyReports?: Array<{
    month: string;
    hoursWorked: number;
    skillsDeveloped?: string[];
    supervisorComment?: string;
  }>;
};

export default function StudentOJTLogPage() {
  const { data: ojt, isLoading, error } = useSWR<OJTRecord>(
    '/ojt/me',
    (url: string) => apiClient.get<OJTRecord>(url)
  );

  if (isLoading) return <LoadingSkeleton />;

  if (error || !ojt) {
    return (
      <DashboardLayout role="student">
        <Card>
          <CardHeader>
            <CardTitle>My OJT Log</CardTitle>
            <CardDescription>No OJT record is assigned yet.</CardDescription>
          </CardHeader>
        </Card>
      </DashboardLayout>
    );
  }

  const progress = ojt.requiredHours > 0 ? Math.min((ojt.hoursCompleted / ojt.requiredHours) * 100, 100) : 0;

  return (
    <DashboardLayout role="student">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My OJT Log</h1>
          <p className="text-muted-foreground mt-1">Track workplace training hours and monthly reports.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Completed Hours</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{ojt.hoursCompleted}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Required Hours</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{ojt.requiredHours}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Status</CardTitle>
            </CardHeader>
            <CardContent>
              <Badge>{ojt.status}</Badge>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseBusiness className="w-5 h-5" />
              Training Placement
            </CardTitle>
            <CardDescription>{ojt.company || 'Company not set'}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Progress value={progress} />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground">Progress</p>
                <p className="font-medium">{progress.toFixed(1)}%</p>
              </div>
              <div>
                <p className="text-muted-foreground">Supervisor</p>
                <p className="font-medium">{ojt.supervisor || '-'}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Contact</p>
                <p className="font-medium">{ojt.supervisorContact || '-'}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ClipboardList className="w-5 h-5" />
              Monthly Reports
            </CardTitle>
            <CardDescription>{ojt.monthlyReports?.length ?? 0} report(s)</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {(ojt.monthlyReports ?? []).map((report) => (
              <div key={report.month} className="rounded-md border p-4">
                <div className="flex justify-between">
                  <h3 className="font-medium">{report.month}</h3>
                  <Badge variant="secondary">{report.hoursWorked} hours</Badge>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {report.supervisorComment || 'No supervisor comment.'}
                </p>
              </div>
            ))}
            {(ojt.monthlyReports ?? []).length === 0 && (
              <p className="py-8 text-center text-muted-foreground">No monthly reports yet.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
