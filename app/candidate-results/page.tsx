'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { AlertCircle, Award, CheckCircle2, Clock3, Pencil, RefreshCw, UserX, Users } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import {
  AssessmentSchedule,
  AssessmentScheduleStatus,
  CandidateAssessmentResult,
  CandidateAttendanceStatus,
  formatCandidateName,
} from '@/lib/assessment-types';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/data-table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

type CandidateResultRow = {
  id: string;
  scheduleId: string;
  studentRecordId: string;
  assessmentSchedule: string;
  candidateName: string;
  studentId: string;
  course: string;
  yearLevel: string;
  qualification: string;
  assessmentStatus: AssessmentScheduleStatus;
  result: CandidateAssessmentResult;
  attendanceStatus: CandidateAttendanceStatus;
  assessorRemarks: string;
};

type ResultMetric = {
  label: string;
  value: number;
  Icon: LucideIcon;
  tone: string;
};

const assessmentStatusLabel: Record<AssessmentScheduleStatus, string> = {
  scheduled: 'Scheduled',
  ongoing: 'Ongoing',
  completed: 'Completed',
  cancelled: 'Cancelled',
};

const resultLabel: Record<CandidateAssessmentResult, string> = {
  pending: 'Pending',
  competent: 'Competent',
  not_yet_competent: 'Not Yet Competent',
};

const attendanceLabel: Record<CandidateAttendanceStatus, string> = {
  pending: 'Pending',
  present: 'Present',
  absent: 'Absent',
  'no-show': 'No-show',
};

const assessmentStatusClass: Record<AssessmentScheduleStatus, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  ongoing: 'bg-cyan-100 text-cyan-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const resultClass: Record<CandidateAssessmentResult, string> = {
  pending: 'bg-cyan-100 text-cyan-800',
  competent: 'bg-green-100 text-green-800',
  not_yet_competent: 'bg-amber-100 text-amber-800',
};

const attendanceClass: Record<CandidateAttendanceStatus, string> = {
  pending: 'bg-slate-100 text-slate-800',
  present: 'bg-blue-100 text-blue-800',
  absent: 'bg-red-100 text-red-800',
  'no-show': 'bg-orange-100 text-orange-800',
};

export default function CandidateResultsPage() {
  const [resultFilter, setResultFilter] = useState('');
  const [attendanceFilter, setAttendanceFilter] = useState('');
  const [editingRow, setEditingRow] = useState<CandidateResultRow | null>(null);
  const [draftAttendance, setDraftAttendance] = useState<CandidateAttendanceStatus>('pending');
  const [draftResult, setDraftResult] = useState<CandidateAssessmentResult>('pending');
  const [draftRemarks, setDraftRemarks] = useState('');
  const [updateError, setUpdateError] = useState('');

  const {
    data: schedules,
    error,
    isLoading,
    mutate,
  } = useSWR<AssessmentSchedule[]>('/assessments', (url: string) => apiClient.get<AssessmentSchedule[]>(url));

  const rows = useMemo<CandidateResultRow[]>(
    () =>
      (schedules ?? []).flatMap((schedule) =>
        (schedule.candidates ?? []).map((candidate, index) => ({
          id: `${schedule._id}-${candidate.student?._id ?? index}`,
          scheduleId: schedule._id,
          studentRecordId: candidate.student?._id ?? '',
          assessmentSchedule: schedule.title,
          candidateName: formatCandidateName(candidate),
          studentId: candidate.student?.studentId ?? '',
          course: schedule.course,
          yearLevel: schedule.yearLevel,
          qualification: `${schedule.qualificationTitle} ${schedule.ncLevel}`.trim(),
          assessmentStatus: schedule.status,
          result: candidate.result,
          attendanceStatus: candidate.attendanceStatus,
          assessorRemarks: candidate.remarks ?? '',
        }))
      ),
    [schedules]
  );

  const filteredRows = rows.filter((row) => {
    const matchesResult = !resultFilter || row.result === resultFilter;
    const matchesAttendance = !attendanceFilter || row.attendanceStatus === attendanceFilter;
    return matchesResult && matchesAttendance;
  });

  const competent = filteredRows.filter((row) => row.result === 'competent').length;
  const notYetCompetent = filteredRows.filter((row) => row.result === 'not_yet_competent').length;
  const absent = filteredRows.filter((row) => row.attendanceStatus === 'absent').length;
  const noShow = filteredRows.filter((row) => row.attendanceStatus === 'no-show').length;
  const pending = filteredRows.filter((row) => row.result === 'pending').length;

  const openEdit = (row: CandidateResultRow) => {
    setEditingRow(row);
    setDraftAttendance(row.attendanceStatus);
    setDraftResult(row.result);
    setDraftRemarks(row.assessorRemarks);
    setUpdateError('');
  };

  const saveResult = async () => {
    if (!editingRow) return;
    setUpdateError('');
    try {
      await apiClient.patch(`/assessments/${editingRow.scheduleId}/candidates/${editingRow.studentRecordId}`, {
        attendanceStatus: draftAttendance,
        result: draftResult,
        remarks: draftRemarks,
      });
      setEditingRow(null);
      await mutate();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : 'Unable to update candidate result');
    }
  };

  const columns: Column<CandidateResultRow>[] = [
    { key: 'assessmentSchedule', label: 'Assessment Schedule', sortable: true, searchable: true },
    { key: 'candidateName', label: 'Candidate/Student Name', sortable: true, searchable: true },
    { key: 'studentId', label: 'Student ID', sortable: true, searchable: true },
    { key: 'course', label: 'Course', sortable: true, searchable: true },
    { key: 'yearLevel', label: 'Year Level', sortable: true },
    { key: 'qualification', label: 'Qualification / NC Level', sortable: true, searchable: true },
    {
      key: 'assessmentStatus',
      label: 'Assessment Status',
      sortable: true,
      render: (value: AssessmentScheduleStatus) => <Badge className={assessmentStatusClass[value]}>{assessmentStatusLabel[value]}</Badge>,
    },
    {
      key: 'result',
      label: 'Result',
      sortable: true,
      render: (value: CandidateAssessmentResult) => <Badge className={resultClass[value]}>{resultLabel[value]}</Badge>,
    },
    {
      key: 'attendanceStatus',
      label: 'Assessment Attendance',
      sortable: true,
      render: (value: CandidateAttendanceStatus) => <Badge className={attendanceClass[value]}>{attendanceLabel[value]}</Badge>,
    },
    {
      key: 'assessorRemarks',
      label: 'Assessor Remarks',
      searchable: true,
      render: (value: string) => value || <span className="text-muted-foreground">No remarks</span>,
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value, row) => (
        <Button variant="ghost" size="sm" onClick={() => openEdit(row)} aria-label={`Edit result for ${row.candidateName}`}>
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-4 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidate Results</h1>
            <p className="mt-1 text-muted-foreground">
              Review assessment schedules, candidate details, attendance, and competency outcomes.
            </p>
          </div>
          <Button variant="outline" onClick={() => mutate()} disabled={isLoading}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              {error instanceof Error ? error.message : 'Unable to load candidate results.'}
            </AlertDescription>
          </Alert>
        )}

        <div className="grid gap-4 md:grid-cols-3 xl:grid-cols-6">
          {([
            { label: 'Total Candidates', value: filteredRows.length, Icon: Users, tone: 'text-slate-700 bg-slate-50' },
            { label: 'Competent', value: competent, Icon: CheckCircle2, tone: 'text-green-700 bg-green-50' },
            { label: 'Not Yet Competent', value: notYetCompetent, Icon: Award, tone: 'text-amber-700 bg-amber-50' },
            { label: 'Absent', value: absent, Icon: UserX, tone: 'text-red-700 bg-red-50' },
            { label: 'No-show', value: noShow, Icon: UserX, tone: 'text-orange-700 bg-orange-50' },
            { label: 'Pending Results', value: pending, Icon: Clock3, tone: 'text-cyan-700 bg-cyan-50' },
          ] satisfies ResultMetric[]).map(({ label, value, Icon, tone }) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <div className="mb-3 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <span className={`rounded-md p-2 ${tone}`}>
                    <Icon className="h-5 w-5" />
                  </span>
                </div>
                <p className="text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Assessment Result Register</CardTitle>
            <CardDescription>
              {isLoading
                ? 'Loading candidate results...'
                : `${filteredRows.length} candidate result record(s) available.`}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3 md:grid-cols-2">
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={resultFilter} onChange={(event) => setResultFilter(event.target.value)}>
                <option value="">All Results</option>
                <option value="pending">Pending</option>
                <option value="competent">Competent</option>
                <option value="not_yet_competent">Not Yet Competent</option>
              </select>
              <select className="rounded-md border bg-background px-3 py-2 text-sm" value={attendanceFilter} onChange={(event) => setAttendanceFilter(event.target.value)}>
                <option value="">All Attendance Statuses</option>
                <option value="pending">Pending</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="no-show">No-show</option>
              </select>
            </div>
            <DataTable
              data={filteredRows}
              columns={columns}
              loading={isLoading}
              pageSize={10}
              emptyMessage={error ? 'Candidate results could not be loaded.' : 'No candidate results found.'}
            />
          </CardContent>
        </Card>

        <Dialog open={Boolean(editingRow)} onOpenChange={(open) => !open && setEditingRow(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Update Candidate Result</DialogTitle>
              <DialogDescription>
                {editingRow ? `${editingRow.candidateName} - ${editingRow.studentId}` : 'Edit attendance and competency result.'}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={draftAttendance}
                onChange={(event) => setDraftAttendance(event.target.value as CandidateAttendanceStatus)}
              >
                <option value="pending">Attendance pending</option>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="no-show">No-show</option>
              </select>
              <select
                className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                value={draftResult}
                onChange={(event) => setDraftResult(event.target.value as CandidateAssessmentResult)}
              >
                <option value="pending">Result pending</option>
                <option value="competent">Competent</option>
                <option value="not_yet_competent">Not Yet Competent</option>
              </select>
              <Textarea
                value={draftRemarks}
                onChange={(event) => setDraftRemarks(event.target.value)}
                placeholder="Assessor remarks"
              />
              {updateError && <p className="text-sm text-red-600">{updateError}</p>}
              <Button className="w-full" onClick={saveResult}>Save Result</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
