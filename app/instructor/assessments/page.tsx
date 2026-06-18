'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { CalendarClock, ClipboardCheck, Plus, Trash2, Users } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { AssessmentSchedule, StudentSummary, UserSummary, formatCandidateName, formatAssessorName } from '@/lib/assessment-types';
import { COURSE_OPTIONS, YEAR_LEVEL_OPTIONS, type CourseOption, type YearLevelOption } from '@/lib/school-options';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ConfirmDeleteDialog } from '@/components/confirm-delete-dialog';

const MAX_CANDIDATES = 10;

const statusColors: Record<string, string> = {
  scheduled: 'bg-blue-100 text-blue-800',
  ongoing: 'bg-amber-100 text-amber-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-100 text-gray-800',
};

const resultLabels: Record<string, string> = {
  pending: 'Pending',
  competent: 'Competent',
  not_yet_competent: 'Not Yet Competent',
};

const defaultForm = {
  title: '',
  course: 'IT' as CourseOption,
  yearLevel: '1st Year' as YearLevelOption,
  qualificationTitle: '',
  ncLevel: '',
  scheduleDateTime: '',
  assessmentCenter: '',
  labRoom: '',
  assessor: '',
  qualificationHandled: '',
  toolsMaterialsChecklist: '',
  candidateIds: [] as string[],
};

export default function AssessmentSchedulingPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedScheduleId, setSelectedScheduleId] = useState<string | null>(null);
  const [newCandidateId, setNewCandidateId] = useState('');
  const [formData, setFormData] = useState(defaultForm);
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [error, setError] = useState('');
  const [removeCandidateId, setRemoveCandidateId] = useState<string | null>(null);
  const [isRemoving, setIsRemoving] = useState(false);

  const { data: schedules = [], mutate: mutateSchedules } = useSWR<AssessmentSchedule[]>(
    '/assessments',
    (url: string) => apiClient.get<AssessmentSchedule[]>(url)
  );
  const { data: students = [] } = useSWR<StudentSummary[]>('/students?status=active', (url: string) => apiClient.get<StudentSummary[]>(url));
  const { data: assessors = [] } = useSWR<UserSummary[]>('/users/role/assessor', (url: string) => apiClient.get<UserSummary[]>(url));

  const selectedSchedule = schedules.find((schedule) => schedule._id === selectedScheduleId) ?? schedules[0];
  const selectedCandidateIds = new Set(selectedSchedule?.candidates.map((candidate) => candidate.student._id) ?? []);
  const filteredSchedules = schedules.filter((schedule) => {
    const matchesCourse = !courseFilter || schedule.course === courseFilter;
    const matchesYear = !yearFilter || schedule.yearLevel === yearFilter;
    return matchesCourse && matchesYear;
  });
  const formCandidateOptions = students.filter((student) => (
    student.course === formData.course && student.yearLevel === formData.yearLevel
  ));
  const addCandidateOptions = students.filter((student) => (
    selectedSchedule &&
    student.course === selectedSchedule.course &&
    student.yearLevel === selectedSchedule.yearLevel &&
    !selectedCandidateIds.has(student._id)
  ));

  const dashboardStats = useMemo(() => {
    const candidates = filteredSchedules.flatMap((schedule) => schedule.candidates);
    return {
      upcoming: filteredSchedules.filter((schedule) => schedule.status === 'scheduled').length,
      totalCandidates: candidates.length,
      completed: filteredSchedules.filter((schedule) => schedule.status === 'completed').length,
      competent: candidates.filter((candidate) => candidate.result === 'competent').length,
      notYetCompetent: candidates.filter((candidate) => candidate.result === 'not_yet_competent').length,
      absent: candidates.filter((candidate) => ['absent', 'no-show'].includes(candidate.attendanceStatus)).length,
    };
  }, [filteredSchedules]);

  const updateForm = (field: keyof typeof formData, value: string | string[]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleCandidate = (studentId: string) => {
    const current = new Set(formData.candidateIds);
    if (current.has(studentId)) {
      current.delete(studentId);
    } else {
      current.add(studentId);
    }
    const candidateIds = Array.from(current).slice(0, MAX_CANDIDATES);
    updateForm('candidateIds', candidateIds);
  };

  const createSchedule = async () => {
    setError('');
    if (formData.candidateIds.length > MAX_CANDIDATES) {
      setError(`A schedule can include ${MAX_CANDIDATES} candidates only.`);
      return;
    }

    try {
      await apiClient.post('/assessments', {
        ...formData,
        candidates: formData.candidateIds,
        qualificationHandled: formData.qualificationHandled || `${formData.qualificationTitle} ${formData.ncLevel}`,
      });
      setFormData(defaultForm);
      setDialogOpen(false);
      await mutateSchedules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to create assessment schedule');
    }
  };

  const updateSchedule = async (schedule: AssessmentSchedule, updates: Partial<AssessmentSchedule>) => {
    await apiClient.put(`/assessments/${schedule._id}`, updates);
    await mutateSchedules();
  };

  const addCandidate = async () => {
    if (!selectedSchedule || !newCandidateId) return;
    setError('');
    try {
      await apiClient.post(`/assessments/${selectedSchedule._id}/candidates`, { studentId: newCandidateId });
      setNewCandidateId('');
      await mutateSchedules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add candidate');
    }
  };

  const removeCandidate = async () => {
    if (!selectedSchedule || !removeCandidateId) return;
    setIsRemoving(true);
    setError('');
    try {
      await apiClient.delete(`/assessments/${selectedSchedule._id}/candidates/${removeCandidateId}`);
      setRemoveCandidateId(null);
      await mutateSchedules();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to remove candidate');
    } finally {
      setIsRemoving(false);
    }
  };

  const updateCandidate = async (studentId: string, updates: Record<string, string>) => {
    if (!selectedSchedule) return;
    await apiClient.patch(`/assessments/${selectedSchedule._id}/candidates/${studentId}`, updates);
    await mutateSchedules();
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Assessment Scheduling</h1>
            <p className="text-muted-foreground">Plan TESDA competency assessments, assign assessors, and manage candidates.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button><Plus className="mr-2 h-4 w-4" />New Schedule</Button>
            </DialogTrigger>
            <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
              <DialogHeader>
                <DialogTitle>Create Assessment Schedule</DialogTitle>
                <DialogDescription>Each schedule is limited to 10 candidates.</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 md:grid-cols-2">
                <Input placeholder="Schedule title" value={formData.title} onChange={(e) => updateForm('title', e.target.value)} />
                <Input type="datetime-local" value={formData.scheduleDateTime} onChange={(e) => updateForm('scheduleDateTime', e.target.value)} />
                <select className="rounded-md border bg-background px-3 py-2 text-sm" value={formData.course} onChange={(e) => updateForm('course', e.target.value as CourseOption)}>
                  {COURSE_OPTIONS.map((course) => <option key={course} value={course}>{course}</option>)}
                </select>
                <select className="rounded-md border bg-background px-3 py-2 text-sm" value={formData.yearLevel} onChange={(e) => updateForm('yearLevel', e.target.value as YearLevelOption)}>
                  {YEAR_LEVEL_OPTIONS.map((yearLevel) => <option key={yearLevel} value={yearLevel}>{yearLevel}</option>)}
                </select>
                <Input placeholder="Qualification title" value={formData.qualificationTitle} onChange={(e) => updateForm('qualificationTitle', e.target.value)} />
                <Input placeholder="NC level, e.g. NC II" value={formData.ncLevel} onChange={(e) => updateForm('ncLevel', e.target.value)} />
                <Input placeholder="Assessment venue" value={formData.assessmentCenter} onChange={(e) => updateForm('assessmentCenter', e.target.value)} />
                <Input placeholder="Assessment room / lab" value={formData.labRoom} onChange={(e) => updateForm('labRoom', e.target.value)} />
                <Input placeholder="Qualification handled" value={formData.qualificationHandled} onChange={(e) => updateForm('qualificationHandled', e.target.value)} />
                <select className="rounded-md border bg-background px-3 py-2 text-sm" value={formData.assessor} onChange={(e) => updateForm('assessor', e.target.value)}>
                  <option value="">Assigned accredited assessor</option>
                  {assessors.map((assessor) => (
                    <option key={assessor._id} value={assessor._id}>{assessor.firstName} {assessor.lastName}</option>
                  ))}
                </select>
              </div>
              <Textarea
                placeholder="Tools/materials checklist before assessment"
                value={formData.toolsMaterialsChecklist}
                onChange={(e) => updateForm('toolsMaterialsChecklist', e.target.value)}
              />
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <p className="font-medium">Candidates</p>
                  <Badge>{formData.candidateIds.length}/{MAX_CANDIDATES}</Badge>
                </div>
                <div className="grid max-h-56 gap-2 overflow-y-auto rounded-md border p-3 md:grid-cols-2">
                  {formCandidateOptions.map((student) => {
                    const name = student.user ? `${student.user.firstName} ${student.user.lastName}` : student.studentId;
                    const checked = formData.candidateIds.includes(student._id);
                    return (
                      <label key={student._id} className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent">
                        <Checkbox checked={checked} onCheckedChange={() => toggleCandidate(student._id)} disabled={!checked && formData.candidateIds.length >= MAX_CANDIDATES} />
                        <span>{name} <span className="text-muted-foreground">({student.course}, {student.yearLevel})</span></span>
                      </label>
                    );
                  })}
                  {formCandidateOptions.length === 0 && <p className="text-sm text-muted-foreground">No active students match this course and year level.</p>}
                </div>
              </div>
              {error && <p className="text-sm text-red-600">{error}</p>}
              <Button onClick={createSchedule}>Create Schedule</Button>
            </DialogContent>
          </Dialog>
        </div>
        {error && <p className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</p>}

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
            ['Upcoming', dashboardStats.upcoming],
            ['Candidates', dashboardStats.totalCandidates],
            ['Completed', dashboardStats.completed],
            ['Competent', dashboardStats.competent],
            ['Not Yet Competent', dashboardStats.notYetCompetent],
            ['Absent/No-show', dashboardStats.absent],
          ].map(([label, value]) => (
            <Card key={label}>
              <CardContent className="pt-6">
                <p className="text-sm text-muted-foreground">{label}</p>
                <p className="text-2xl font-bold">{value}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,420px)]">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><CalendarClock className="h-5 w-5" />Schedules</CardTitle>
              <CardDescription>Assessment schedules with capacity and assessor assignment.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {filteredSchedules.map((schedule) => (
                <button
                  key={schedule._id}
                  onClick={() => setSelectedScheduleId(schedule._id)}
                  className={`w-full rounded-lg border p-4 text-left transition hover:bg-accent ${selectedSchedule?._id === schedule._id ? 'border-primary bg-accent' : ''}`}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{schedule.title}</h3>
                        <Badge className={statusColors[schedule.status]}>{schedule.status}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{schedule.course} - {schedule.yearLevel}</p>
                      <p className="text-sm text-muted-foreground">{schedule.qualificationTitle} {schedule.ncLevel}</p>
                      <p className="text-sm text-muted-foreground">{new Date(schedule.scheduleDateTime).toLocaleString()}</p>
                      <p className="text-sm text-muted-foreground">Assessment Venue/Room: {schedule.assessmentCenter}{schedule.labRoom ? ` - ${schedule.labRoom}` : ''}</p>
                      {schedule.toolsMaterialsChecklist && <p className="text-sm text-muted-foreground">Tools/materials: {schedule.toolsMaterialsChecklist}</p>}
                    </div>
                    <div className="text-sm text-muted-foreground md:text-right">
                      <p>{formatAssessorName(schedule.assessor, schedule.assessorName)}</p>
                      <p>{schedule.candidates.length}/{schedule.maxCandidates} candidates</p>
                    </div>
                  </div>
                </button>
              ))}
              {filteredSchedules.length === 0 && <p className="rounded-lg border p-6 text-center text-muted-foreground">No assessment schedules match the selected filters.</p>}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><Users className="h-5 w-5" />Candidates</CardTitle>
              <CardDescription>{selectedSchedule ? selectedSchedule.title : 'Select a schedule to manage candidates.'}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedSchedule && (
                <>
                  <div className="grid grid-cols-[1fr_auto] gap-2">
                    <select className="rounded-md border bg-background px-3 py-2 text-sm" value={newCandidateId} onChange={(e) => setNewCandidateId(e.target.value)} disabled={selectedSchedule.candidates.length >= MAX_CANDIDATES}>
                      <option value="">Add student candidate</option>
                      {addCandidateOptions.map((student) => (
                        <option key={student._id} value={student._id}>{student.user ? `${student.user.firstName} ${student.user.lastName}` : student.studentId} ({student.course}, {student.yearLevel})</option>
                      ))}
                    </select>
                    <Button onClick={addCandidate} disabled={!newCandidateId || selectedSchedule.candidates.length >= MAX_CANDIDATES}>Add</Button>
                  </div>
                  <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={selectedSchedule.status} onChange={(e) => updateSchedule(selectedSchedule, { status: e.target.value as AssessmentSchedule['status'] })}>
                    <option value="scheduled">Scheduled</option>
                    <option value="ongoing">Ongoing</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                  <Input
                    placeholder="Assessment room / lab"
                    value={selectedSchedule.labRoom ?? ''}
                    onChange={(e) => updateSchedule(selectedSchedule, { labRoom: e.target.value })}
                  />
                  <Textarea
                    placeholder="Tools/materials checklist before assessment"
                    value={selectedSchedule.toolsMaterialsChecklist ?? ''}
                    onChange={(e) => updateSchedule(selectedSchedule, { toolsMaterialsChecklist: e.target.value })}
                  />
                  <div className="space-y-3">
                    {selectedSchedule.candidates.map((candidate) => (
                      <div key={candidate.student._id} className="rounded-lg border p-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-medium">{formatCandidateName(candidate)}</p>
                            <p className="text-xs text-muted-foreground">{candidate.student.studentId} - {candidate.student.course ?? selectedSchedule.course} - {candidate.student.yearLevel ?? selectedSchedule.yearLevel}</p>
                          </div>
                          <Button variant="ghost" size="sm" onClick={() => setRemoveCandidateId(candidate.student._id)}><Trash2 className="h-4 w-4" /></Button>
                        </div>
                        <div className="mt-3 grid gap-2 md:grid-cols-2">
                          <select className="rounded-md border bg-background px-2 py-2 text-sm" value={candidate.attendanceStatus} onChange={(e) => updateCandidate(candidate.student._id, { attendanceStatus: e.target.value })}>
                            <option value="pending">Assessment attendance pending</option>
                            <option value="present">Present</option>
                            <option value="absent">Absent</option>
                            <option value="no-show">No-show</option>
                          </select>
                          <select className="rounded-md border bg-background px-2 py-2 text-sm" value={candidate.result} onChange={(e) => updateCandidate(candidate.student._id, { result: e.target.value })}>
                            <option value="pending">Result pending</option>
                            <option value="competent">Competent</option>
                            <option value="not_yet_competent">Not Yet Competent</option>
                          </select>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">Result: {resultLabels[candidate.result]}</p>
                      </div>
                    ))}
                  </div>
                  <Card className="border-dashed">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-base"><ClipboardCheck className="h-4 w-4" />Assessment Requirements Checklist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        ['applicationFormSubmitted', 'Application Form submitted'],
                        ['selfAssessmentGuideSubmitted', 'Self Assessment Guide submitted'],
                        ['passportPhotosSubmitted', 'Passport photos submitted'],
                        ['assessmentFeeOrAdmissionSlip', 'Assessment fee/admission slip'],
                      ].map(([key, label]) => (
                        <label key={key} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={Boolean(selectedSchedule.checklist?.[key as keyof typeof selectedSchedule.checklist])}
                            onCheckedChange={(checked) => updateSchedule(selectedSchedule, { checklist: { ...selectedSchedule.checklist, [key]: Boolean(checked) } as AssessmentSchedule['checklist'] })}
                          />
                          {label}
                        </label>
                      ))}
                      <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={selectedSchedule.checklist?.attendanceSheetStatus ?? 'pending'} onChange={(e) => updateSchedule(selectedSchedule, { checklist: { ...selectedSchedule.checklist, attendanceSheetStatus: e.target.value as any } })}>
                        <option value="pending">Assessment attendance sheet pending</option>
                        <option value="submitted">Assessment attendance sheet submitted</option>
                        <option value="verified">Assessment attendance sheet verified</option>
                        <option value="missing">Assessment attendance sheet missing</option>
                      </select>
                      <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={selectedSchedule.checklist?.carsRatingSheetStatus ?? 'pending'} onChange={(e) => updateSchedule(selectedSchedule, { checklist: { ...selectedSchedule.checklist, carsRatingSheetStatus: e.target.value as any } })}>
                        <option value="pending">CARS/rating sheet pending</option>
                        <option value="submitted">CARS/rating sheet submitted</option>
                        <option value="verified">CARS/rating sheet verified</option>
                        <option value="missing">CARS/rating sheet missing</option>
                      </select>
                    </CardContent>
                  </Card>
                  <Textarea placeholder="Internal schedule notes" />
                </>
              )}
            </CardContent>
          </Card>
        </div>
        <ConfirmDeleteDialog
          open={Boolean(removeCandidateId)}
          onOpenChange={(open) => !open && setRemoveCandidateId(null)}
          onConfirm={removeCandidate}
          isDeleting={isRemoving}
          title="Remove candidate?"
          description="This will remove the selected candidate from the current assessment schedule."
          confirmLabel="Remove"
        />
      </div>
    </div>
  );
}
