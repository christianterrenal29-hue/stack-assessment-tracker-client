'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

type ReportMode = 'reports' | 'analytics' | 'compliance';

type ReportPayload = {
  dashboard?: any;
  attendance?: any;
  ojt?: any;
  assessment?: any;
  trends?: any;
  cohort?: any;
  riskFactors?: any;
  successMetrics?: any;
  compliance?: any;
};

const pageCopy: Record<ReportMode, { title: string; description: string }> = {
  reports: {
    title: 'Reports',
    description: 'Export-ready TESDA student progress, risk, attendance, OJT, and assessment summaries.',
  },
  analytics: {
    title: 'Analytics',
    description: 'Operational performance indicators pulled from backend analytics services.',
  },
  compliance: {
    title: 'Compliance',
    description: 'TESDA readiness checks across attendance, OJT hours, and competency completion.',
  },
};

const asPercent = (value: unknown) => {
  if (value === null || value === undefined || value === '') return '0%';
  return `${value}%`;
};

const StatCard = ({
  label,
  value,
  hint,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
}) => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="text-sm font-medium text-muted-foreground">{label}</CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold text-foreground">{value}</div>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </CardContent>
  </Card>
);

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: 'application/json',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

export function AnalyticsReportPage({ mode }: { mode: ReportMode }) {
  const [data, setData] = useState<ReportPayload>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  const copy = pageCopy[mode];

  const endpoints = useMemo(() => {
    if (mode === 'compliance') {
      return [['compliance', '/analytics/compliance']] as const;
    }

    if (mode === 'analytics') {
      return [
        ['dashboard', '/analytics/dashboard'],
        ['attendance', '/analytics/attendance'],
        ['ojt', '/analytics/ojt'],
        ['assessment', '/analytics/assessment'],
        ['trends', '/analytics/trends'],
        ['riskFactors', '/analytics/risk-factors'],
      ] as const;
    }

    return [
      ['dashboard', '/analytics/dashboard'],
      ['cohort', '/analytics/cohort/progress'],
      ['successMetrics', '/analytics/success-metrics'],
      ['compliance', '/analytics/compliance'],
    ] as const;
  }, [mode]);

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');

    try {
      const entries = await Promise.all(
        endpoints.map(async ([key, endpoint]) => [
          key,
          await apiClient.get(endpoint),
        ])
      );
      setData(Object.fromEntries(entries));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load analytics data');
    } finally {
      setIsLoading(false);
    }
  }, [endpoints]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const dashboard = data.dashboard;
  const compliance = data.compliance;
  const attendance = data.attendance ?? dashboard?.attendance;
  const ojt = data.ojt ?? dashboard?.ojt;
  const assessment = data.assessment ?? dashboard?.assessment;
  const riskMetrics = dashboard?.riskMetrics;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">{copy.title}</h1>
            <p className="mt-1 max-w-3xl text-muted-foreground">{copy.description}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadData} disabled={isLoading}>
              <RefreshCw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button onClick={() => downloadJson(`tesda-${mode}.json`, data)} disabled={isLoading}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <Card>
            <CardHeader>
              <CardTitle>Loading {copy.title.toLowerCase()}...</CardTitle>
              <CardDescription>Fetching live data from backend analytics endpoints.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
              <StatCard
                label="Active Students"
                value={dashboard?.students?.active ?? compliance?.total ?? '-'}
                hint={`${dashboard?.students?.total ?? compliance?.total ?? 0} total tracked`}
              />
              <StatCard
                label="Overall Compliance"
                value={asPercent(compliance?.overallCompliance)}
                hint={`${compliance?.fullyCompliant ?? 0} fully compliant students`}
              />
              <StatCard
                label="Average Attendance"
                value={asPercent(attendance?.averageAttendance)}
                hint={`${attendance?.lowAttendanceCount ?? 0} below attendance threshold`}
              />
              <StatCard
                label="Assessment Pass Rate"
                value={asPercent(assessment?.passRate)}
                hint={`${assessment?.completed ?? 0} completed assessments`}
              />
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Risk Summary</CardTitle>
                  <CardDescription>Students grouped by calculated risk level.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ['High', riskMetrics?.high, 'bg-red-100 text-red-800'],
                    ['Medium', riskMetrics?.medium, 'bg-yellow-100 text-yellow-800'],
                    ['Low', riskMetrics?.low, 'bg-green-100 text-green-800'],
                  ].map(([label, value, className]) => (
                    <div key={label as string} className="flex items-center justify-between rounded-md border p-3">
                      <Badge className={className as string}>{label}</Badge>
                      <span className="font-semibold">{String(value ?? 0)}</span>
                    </div>
                  ))}
                  <p className="text-sm text-muted-foreground">
                    At-risk percentage: {asPercent(riskMetrics?.atRiskPercentage)}
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>TESDA Compliance Checks</CardTitle>
                  <CardDescription>Readiness by attendance, OJT, and competency evidence.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    ['Attendance', compliance?.attendanceComplianceRate, compliance?.attendanceCompliant],
                    ['OJT Hours', compliance?.ojtComplianceRate, compliance?.ojtCompliant],
                    ['Competencies', compliance?.competencyComplianceRate, compliance?.competencyCompliant],
                  ].map(([label, rate, count]) => (
                    <div key={label as string} className="rounded-md border p-3">
                      <div className="flex justify-between text-sm">
                        <span className="font-medium">{label}</span>
                        <span>{asPercent(rate)}</span>
                      </div>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {String(count ?? 0)} compliant records
                      </p>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>OJT Progress</CardTitle>
                  <CardDescription>Required and completed workplace training hours.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Completion rate</span><strong>{asPercent(ojt?.completionRate)}</strong></div>
                  <div className="flex justify-between"><span>Hours completed</span><strong>{ojt?.totalHoursCompleted ?? 0}</strong></div>
                  <div className="flex justify-between"><span>Hours required</span><strong>{ojt?.totalHoursRequired ?? 0}</strong></div>
                  <div className="flex justify-between"><span>Monthly reports</span><strong>{ojt?.monthlyReportsTotal ?? 0}</strong></div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Assessment Performance</CardTitle>
                  <CardDescription>Assessment completion and scoring health.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div className="flex justify-between"><span>Total assessments</span><strong>{assessment?.total ?? 0}</strong></div>
                  <div className="flex justify-between"><span>Completed</span><strong>{assessment?.completed ?? 0}</strong></div>
                  <div className="flex justify-between"><span>Pending</span><strong>{assessment?.pending ?? 0}</strong></div>
                  <div className="flex justify-between"><span>Average score</span><strong>{asPercent(assessment?.averageScore)}</strong></div>
                </CardContent>
              </Card>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
