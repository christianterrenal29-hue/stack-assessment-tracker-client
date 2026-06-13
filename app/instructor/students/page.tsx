'use client';

import { useMemo, useState } from 'react';
import useSWR from 'swr';
import { CalendarClock, Medal, Pencil, Plus, Users } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { COURSE_OPTIONS, YEAR_LEVEL_OPTIONS, type CourseOption, type YearLevelOption } from '@/lib/school-options';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/data-table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

type CandidateRecord = {
  _id: string;
  studentId: string;
  course?: CourseOption;
  yearLevel?: YearLevelOption;
  status: 'active' | 'inactive' | 'graduated' | 'dropped';
  qualifications?: unknown[];
  currentCompetencies?: unknown[];
  completedCompetencies?: unknown[];
  lastAssessmentDate?: string;
  user?: {
    firstName: string;
    lastName: string;
    email?: string;
  };
};

const defaultForm = {
  userId: '',
  studentId: '',
  course: 'IT' as CourseOption,
  yearLevel: '1st Year' as YearLevelOption,
  status: 'active' as CandidateRecord['status'],
};

export default function CandidateManagementPage() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCandidate, setEditingCandidate] = useState<CandidateRecord | null>(null);
  const [formData, setFormData] = useState(defaultForm);
  const [courseFilter, setCourseFilter] = useState('');
  const [yearFilter, setYearFilter] = useState('');
  const [formError, setFormError] = useState('');

  const { data: candidates = [], isLoading, mutate } = useSWR<CandidateRecord[]>(
    '/students',
    (url: string) => apiClient.get<CandidateRecord[]>(url)
  );

  const filteredCandidates = useMemo(() => {
    return candidates.filter((candidate) => {
      const matchesCourse = !courseFilter || candidate.course === courseFilter;
      const matchesYear = !yearFilter || candidate.yearLevel === yearFilter;
      return matchesCourse && matchesYear;
    });
  }, [candidates, courseFilter, yearFilter]);

  const activeCount = filteredCandidates.filter((candidate) => candidate.status === 'active').length;
  const completedCompetencies = filteredCandidates.reduce((sum, candidate) => sum + (candidate.completedCompetencies?.length ?? 0), 0);

  const openCreateDialog = () => {
    setEditingCandidate(null);
    setFormData(defaultForm);
    setFormError('');
    setDialogOpen(true);
  };

  const openEditDialog = (candidate: CandidateRecord) => {
    setEditingCandidate(candidate);
    setFormData({
      userId: '',
      studentId: candidate.studentId,
      course: candidate.course ?? 'IT',
      yearLevel: candidate.yearLevel ?? '1st Year',
      status: candidate.status,
    });
    setFormError('');
    setDialogOpen(true);
  };

  const saveCandidate = async () => {
    setFormError('');
    try {
      if (editingCandidate) {
        await apiClient.put(`/students/${editingCandidate._id}`, {
          course: formData.course,
          yearLevel: formData.yearLevel,
          status: formData.status,
        });
      } else {
        await apiClient.post('/students', formData);
      }
      setDialogOpen(false);
      await mutate();
    } catch (error) {
      setFormError(error instanceof Error ? error.message : 'Unable to save student record');
    }
  };

  const columns: Column<CandidateRecord>[] = [
    {
      key: 'studentId',
      label: 'Candidate',
      searchable: true,
      render: (_value, row) => (
        <div>
          <p className="font-medium">{row.user ? `${row.user.firstName} ${row.user.lastName}` : row.studentId}</p>
          <p className="text-xs text-muted-foreground">{row.studentId}</p>
        </div>
      ),
    },
    {
      key: 'course',
      label: 'Course',
      sortable: true,
      render: (value?: string) => value ?? '-',
    },
    {
      key: 'yearLevel',
      label: 'Year Level',
      sortable: true,
      render: (value?: string) => value ?? '-',
    },
    {
      key: 'status',
      label: 'Status',
      render: (value: string) => <Badge variant="outline">{value}</Badge>,
    },
    {
      key: 'qualifications',
      label: 'Qualifications',
      render: (_value, row) => row.qualifications?.length ?? 0,
    },
    {
      key: 'completedCompetencies',
      label: 'Completed Competencies',
      render: (_value, row) => `${row.completedCompetencies?.length ?? 0}/${(row.currentCompetencies?.length ?? 0) + (row.completedCompetencies?.length ?? 0)}`,
    },
    {
      key: 'lastAssessmentDate',
      label: 'Last Assessment',
      render: (value?: string) => value ? new Date(value).toLocaleDateString() : '-',
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_value, row) => (
        <Button variant="ghost" size="sm" onClick={() => openEditDialog(row)} aria-label={`Edit ${row.studentId}`}>
          <Pencil className="h-4 w-4" />
        </Button>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="mx-auto max-w-7xl space-y-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Candidate Management</h1>
            <p className="text-muted-foreground">View student/candidate records for TESDA assessment scheduling.</p>
          </div>
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={openCreateDialog}>
                <Plus className="mr-2 h-4 w-4" />
                Add Student Record
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingCandidate ? 'Edit Student Record' : 'Create Student Record'}</DialogTitle>
                <DialogDescription>Course and year level use fixed TESDA tracker options only.</DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                {!editingCandidate && (
                  <Input placeholder="User ID" value={formData.userId} onChange={(event) => setFormData({ ...formData, userId: event.target.value })} />
                )}
                <Input
                  placeholder="Student ID"
                  value={formData.studentId}
                  onChange={(event) => setFormData({ ...formData, studentId: event.target.value })}
                  disabled={Boolean(editingCandidate)}
                />
                <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={formData.course} onChange={(event) => setFormData({ ...formData, course: event.target.value as CourseOption })}>
                  {COURSE_OPTIONS.map((course) => <option key={course} value={course}>{course}</option>)}
                </select>
                <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={formData.yearLevel} onChange={(event) => setFormData({ ...formData, yearLevel: event.target.value as YearLevelOption })}>
                  {YEAR_LEVEL_OPTIONS.map((yearLevel) => <option key={yearLevel} value={yearLevel}>{yearLevel}</option>)}
                </select>
                <select className="w-full rounded-md border bg-background px-3 py-2 text-sm" value={formData.status} onChange={(event) => setFormData({ ...formData, status: event.target.value as CandidateRecord['status'] })}>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="dropped">Dropped</option>
                </select>
                {formError && <p className="text-sm text-red-600">{formError}</p>}
                <Button className="w-full" onClick={saveCandidate}>{editingCandidate ? 'Save Changes' : 'Create Student Record'}</Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Total Candidates</p>
                <Users className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{filteredCandidates.length}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Active Candidates</p>
                <CalendarClock className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{activeCount}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-sm text-muted-foreground">Completed Competencies</p>
                <Medal className="h-5 w-5 text-primary" />
              </div>
              <p className="text-3xl font-bold">{completedCompetencies}</p>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Candidate Roster</CardTitle>
            <CardDescription>Candidates available for assessment schedules.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
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
            <DataTable data={filteredCandidates} columns={columns} loading={isLoading} emptyMessage="No candidates found" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
