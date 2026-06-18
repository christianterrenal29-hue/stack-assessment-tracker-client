'use client';

import { useCallback, useEffect, useState } from 'react';
import { Download, Printer, RefreshCw } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { AssessmentDashboardSummary, AssessmentSchedule, formatCandidateName } from '@/lib/assessment-types';
import { COURSE_OPTIONS, YEAR_LEVEL_OPTIONS } from '@/lib/school-options';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DashboardPage } from '@/components/dashboard-page';

type ReportMode = 'reports' | 'analytics' | 'compliance';

type AssessmentReportPayload = {
  summary: AssessmentDashboardSummary;
  schedules: AssessmentSchedule[];
};

const pageCopy: Record<ReportMode, { title: string; description: string }> = {
  reports: {
    title: 'TESDA Assessment Reports',
    description: 'Generate schedule, assessment attendance, competency result, and CARS-style assessment summaries.',
  },
  analytics: {
    title: 'Assessment Analytics',
    description: 'Operational indicators for TESDA competency assessment schedules and results.',
  },
  compliance: {
    title: 'Assessment Compliance',
    description: 'Checklist completion for application forms, SAG, photos, admission slips, attendance sheets, and CARS/rating sheets.',
  },
};

function downloadJson(filename: string, payload: unknown) {
  const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

const buildReportRows = (schedules: AssessmentSchedule[], type: string) => {
  if (type === 'assessment-schedule') {
    return schedules.map((schedule) => ({
      title: schedule.title,
      course: schedule.course,
      yearLevel: schedule.yearLevel,
      qualification: `${schedule.qualificationTitle} ${schedule.ncLevel}`,
      dateTime: schedule.scheduleDateTime,
      venue: schedule.assessmentCenter,
      assessor: schedule.assessorName,
      candidates: schedule.candidates.length,
      status: schedule.status,
    }));
  }

  if (type === 'assessor-assignment') {
    return schedules.map((schedule) => ({
      title: schedule.title,
      course: schedule.course,
      yearLevel: schedule.yearLevel,
      qualification: `${schedule.qualificationTitle} ${schedule.ncLevel}`,
      dateTime: schedule.scheduleDateTime,
      venue: schedule.assessmentCenter,
      assessor: schedule.assessorName,
      candidates: schedule.candidates.length,
      status: schedule.status,
    }));
  }

  const candidateRows = schedules.flatMap((schedule) =>
    schedule.candidates.map((candidate) => ({
      schedule: schedule.title,
      studentId: candidate.student?.studentId,
      course: schedule.course,
      yearLevel: schedule.yearLevel,
      qualification: `${schedule.qualificationTitle} ${schedule.ncLevel}`,
      candidate: formatCandidateName(candidate),
      attendance: candidate.attendanceStatus,
      result: candidate.result,
      carsRatingSheet: schedule.checklist?.carsRatingSheetStatus,
      attendanceSheet: schedule.checklist?.attendanceSheetStatus,
    }))
  );

  if (type === 'missing-requirements') {
    return schedules
      .filter((schedule) =>
        !schedule.checklist?.applicationFormSubmitted ||
        !schedule.checklist?.selfAssessmentGuideSubmitted ||
        !schedule.checklist?.passportPhotosSubmitted ||
        !schedule.checklist?.assessmentFeeOrAdmissionSlip ||
        schedule.checklist?.attendanceSheetStatus !== 'verified' ||
        schedule.checklist?.carsRatingSheetStatus !== 'verified'
      )
      .map((schedule) => ({
        title: schedule.title,
        course: schedule.course,
        yearLevel: schedule.yearLevel,
        qualification: `${schedule.qualificationTitle} ${schedule.ncLevel}`,
        dateTime: schedule.scheduleDateTime,
        venue: schedule.assessmentCenter,
        assessor: schedule.assessorName,
        status: schedule.status,
      }));
  }

  return candidateRows;
};

export function AnalyticsReportPage({ mode }: { mode: ReportMode }) {
  const [data, setData] = useState<AssessmentReportPayload | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const copy = pageCopy[mode];

  const loadData = useCallback(async () => {
    setIsLoading(true);
    setError('');
    try {
      const [summary, schedules] = await Promise.all([
        apiClient.get<AssessmentDashboardSummary>('/assessments/summary/dashboard'),
        apiClient.get<AssessmentSchedule[]>('/assessments'),
      ]);
      setData({ summary, schedules });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to load assessment reports');
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const schedules = (data?.schedules ?? []).filter((schedule) => {
    const matchesCourse = !courseFilter || schedule.course === courseFilter;
    const matchesYear = !yearFilter || schedule.yearLevel === yearFilter;
    return matchesCourse && matchesYear;
  });
  const candidates = schedules.flatMap((schedule) => schedule.candidates);

  const reports = [
    ['assessment-schedule', 'Assessment Schedule Report', 'Schedules by qualification, venue, assessor, capacity, and status.'],
    ['candidate-list', 'Candidate List', 'Candidate roster by course, year level, qualification, attendance, and result.'],
    ['assessment-attendance', 'Assessment Attendance Sheet', 'Candidate attendance rows with schedule, qualification, venue, and status.'],
    ['candidate-result', 'Candidate Result Report', 'Candidate competency result register by assessment schedule.'],
    ['competency-result-summary', 'Competency Result Summary', 'Competent, Not Yet Competent, pending, absent, and no-show outcomes.'],
    ['cars-summary', 'CARS-style Summary', 'TESDA CARS-style candidate results with attendance sheet and rating sheet status.'],
    ['assessor-assignment', 'Assessor Assignment Report', 'Assessment assignments by assessor, schedule, qualification, and venue.'],
    ['missing-requirements', 'Missing Requirements Report', 'Schedules with incomplete TESDA requirements or unverified sheets.'],
  ] as const;

  const forms = [
    ['attendance-sheet', 'Printable Attendance Sheet', 'Candidate attendance rows with schedule, qualification, venue, and status.'],
    ['candidate-list', 'Printable Candidate List', 'Candidate roster grouped from filtered assessment schedules.'],
    ['assessment-result-sheet', 'Printable Assessment Result Sheet', 'Competency result register for TESDA assessment documentation.'],
  ] as const;

  return (
    <DashboardPage>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-[#0b2f57] sm:text-3xl">{copy.title}</h1>
            <p className="mt-1 max-w-3xl text-muted-foreground">{copy.description}</p>
          </div>
          <Button variant="outline" onClick={loadData} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {isLoading ? (
          <Card className="border-white/75 bg-white/85 shadow-sm">
            <CardHeader>
              <CardTitle>Loading assessment reports...</CardTitle>
              <CardDescription>Fetching schedules and candidate results.</CardDescription>
            </CardHeader>
          </Card>
        ) : (
          <>
            <div className="grid gap-3 md:grid-cols-2">
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={courseFilter} onChange={(event) => setCourseFilter(event.target.value)}>
                <option value="">All Courses</option>
                {COURSE_OPTIONS.map((course) => <option key={course} value={course}>{course}</option>)}
              </select>
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={yearFilter} onChange={(event) => setYearFilter(event.target.value)}>
                <option value="">All Year Levels</option>
                {YEAR_LEVEL_OPTIONS.map((yearLevel) => <option key={yearLevel} value={yearLevel}>{yearLevel}</option>)}
              </select>
            </div>

            <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-6">
              {[
                ['Upcoming', data?.summary.upcomingAssessmentSchedules ?? 0],
                ['Candidates', data?.summary.totalCandidatesScheduled ?? 0],
                ['Completed', data?.summary.completedAssessments ?? 0],
                ['Competent', data?.summary.competentCount ?? 0],
                ['Not Yet Competent', data?.summary.notYetCompetentCount ?? 0],
                ['Absent/No-show', data?.summary.absentNoShowCandidates ?? 0],
              ].map(([label, value]) => (
                <Card key={label} className="border-white/75 bg-white/85 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                  <CardContent className="pt-6">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-2xl font-bold">{value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              {reports.map(([type, title, description]) => {
                const rows = buildReportRows(schedules, type);
                return (
                  <Card key={type} className="border-white/75 bg-white/85 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <CardTitle>{title}</CardTitle>
                          <CardDescription>{description}</CardDescription>
                        </div>
                        <Button size="sm" onClick={() => downloadJson(`tesda-${type}.json`, rows)}>
                          <Download className="mr-2 h-4 w-4" />
                          Export
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="mb-3 text-sm text-muted-foreground">{rows.length} row(s)</p>
                      <div className="space-y-2">
                        {rows.slice(0, 5).map((row, index) => (
                          <div key={index} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3 text-sm">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="font-medium">{'candidate' in row ? row.candidate : row.title}</span>
                              {'status' in row && <Badge>{row.status}</Badge>}
                              {'attendance' in row && <Badge variant="outline">{row.attendance}</Badge>}
                              {'result' in row && <Badge variant="outline">{row.result}</Badge>}
                            </div>
                            <p className="text-muted-foreground">{row.course} - {row.yearLevel}</p>
                            <p className="text-muted-foreground">{row.qualification}</p>
                          </div>
                        ))}
                        {rows.length === 0 && <p className="text-sm text-muted-foreground">No report rows available.</p>}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="border-white/75 bg-white/85 shadow-sm">
              <CardHeader>
                <CardTitle>Printable Forms</CardTitle>
                <CardDescription>Print TESDA-ready forms using the current course and year level filters.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-4 md:grid-cols-3">
                {forms.map(([type, title, description]) => {
                  const rows = buildReportRows(schedules, type);
                  return (
                    <div key={type} className="rounded-2xl border border-slate-100 bg-slate-50/70 p-4">
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div>
                          <h3 className="font-semibold">{title}</h3>
                          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
                        </div>
                        <Printer className="h-5 w-5 shrink-0 text-primary" />
                      </div>
                      <p className="mb-4 text-sm text-muted-foreground">{rows.length} printable row(s)</p>
                      <Button className="w-full" variant="outline" onClick={() => window.print()}>
                        <Printer className="mr-2 h-4 w-4" />
                        Print
                      </Button>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            <Card className="border-white/75 bg-white/85 shadow-sm">
              <CardHeader>
                <CardTitle>Checklist Completion</CardTitle>
                <CardDescription>TESDA documentary requirements across all schedules.</CardDescription>
              </CardHeader>
              <CardContent className="grid gap-3 md:grid-cols-3">
                {[
                  ['Application Forms', schedules.filter((schedule) => schedule.checklist?.applicationFormSubmitted).length],
                  ['Self Assessment Guides', schedules.filter((schedule) => schedule.checklist?.selfAssessmentGuideSubmitted).length],
                  ['Passport Photos', schedules.filter((schedule) => schedule.checklist?.passportPhotosSubmitted).length],
                  ['Admission Slips', schedules.filter((schedule) => schedule.checklist?.assessmentFeeOrAdmissionSlip).length],
                  ['Assessment Attendance Sheets Verified', schedules.filter((schedule) => schedule.checklist?.attendanceSheetStatus === 'verified').length],
                  ['CARS/Rating Sheets Verified', schedules.filter((schedule) => schedule.checklist?.carsRatingSheetStatus === 'verified').length],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="text-xl font-bold">{value}/{schedules.length}</p>
                  </div>
                ))}
              </CardContent>
            </Card>

            <p className="text-xs text-muted-foreground">Candidate records included: {candidates.length}</p>
          </>
        )}
    </DashboardPage>
  );
}
