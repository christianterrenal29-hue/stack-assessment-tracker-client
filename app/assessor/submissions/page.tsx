'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle2, AlertCircle, FileCheck } from 'lucide-react';

interface Submission {
  id: string;
  studentName: string;
  email: string;
  assessmentTitle: string;
  submittedAt: string;
  status: 'pending' | 'in-review' | 'graded';
  score?: number;
  totalScore: number;
  competency: string;
}

export default function SubmissionsPage() {
  const [submissions] = useState<Submission[]>([
    {
      id: '1',
      studentName: 'Maria Garcia',
      email: 'maria@example.com',
      assessmentTitle: 'Module 1 Assessment',
      submittedAt: '2024-05-24T10:30:00',
      status: 'pending',
      totalScore: 100,
      competency: 'Technical Competency 1',
    },
    {
      id: '2',
      studentName: 'Carlos Santos',
      email: 'carlos@example.com',
      assessmentTitle: 'Module 1 Assessment',
      submittedAt: '2024-05-23T14:15:00',
      status: 'in-review',
      score: 78,
      totalScore: 100,
      competency: 'Technical Competency 1',
    },
    {
      id: '3',
      studentName: 'Ana Reyes',
      email: 'ana@example.com',
      assessmentTitle: 'Module 1 Assessment',
      submittedAt: '2024-05-20T09:45:00',
      status: 'graded',
      score: 65,
      totalScore: 100,
      competency: 'Technical Competency 1',
    },
    {
      id: '4',
      studentName: 'Juan Cruz',
      email: 'juan@example.com',
      assessmentTitle: 'Module 2 Mid-Term',
      submittedAt: '2024-05-22T16:20:00',
      status: 'pending',
      totalScore: 100,
      competency: 'Technical Competency 2',
    },
  ]);

  const pendingCount = submissions.filter((s) => s.status === 'pending').length;
  const inReviewCount = submissions.filter((s) => s.status === 'in-review').length;
  const gradedCount = submissions.filter((s) => s.status === 'graded').length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4" />;
      case 'in-review':
        return <FileCheck className="w-4 h-4" />;
      case 'graded':
        return <CheckCircle2 className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      'in-review': 'bg-blue-100 text-blue-800',
      graded: 'bg-green-100 text-green-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const columns: Column<Submission>[] = [
    {
      key: 'studentName',
      label: 'Student',
      sortable: true,
      searchable: true,
    },
    {
      key: 'assessmentTitle',
      label: 'Assessment',
      sortable: true,
      searchable: true,
    },
    {
      key: 'competency',
      label: 'Competency',
      searchable: true,
    },
    {
      key: 'submittedAt',
      label: 'Submitted',
      sortable: true,
      render: (value: string) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => (
        <Badge className={getStatusColor(value)}>
          <span className="flex items-center gap-1">
            {getStatusIcon(value)}
            {value}
          </span>
        </Badge>
      ),
    },
    {
      key: 'score',
      label: 'Score',
      render: (value: number | undefined, row: Submission) =>
        value !== undefined ? (
          <span className="font-medium">
            {value}/{row.totalScore}
          </span>
        ) : (
          <span className="text-muted-foreground">--</span>
        ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Submissions Queue</h1>
          <p className="text-muted-foreground mt-1">
            Review and grade student submissions
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Pending Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{pendingCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                In Review
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">{inReviewCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Graded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">{gradedCount}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{submissions.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>All Submissions</CardTitle>
            <CardDescription>
              Click on a submission to grade it
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={submissions}
              columns={columns}
              pageSize={10}
              selectable={false}
              emptyMessage="No submissions yet"
              rowLink={(row) => `/assessor/submissions/${row.id}/grade`}
            />
          </CardContent>
        </Card>

        {/* Priority Section */}
        {pendingCount > 0 && (
          <Card className="mt-8 border-red-200 bg-red-50">
            <CardHeader>
              <CardTitle className="text-red-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                Action Required
              </CardTitle>
              <CardDescription className="text-red-800">
                {pendingCount} submission(s) waiting for review
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissions
                  .filter((s) => s.status === 'pending')
                  .slice(0, 3)
                  .map((submission) => (
                    <div
                      key={submission.id}
                      className="flex items-center justify-between p-3 bg-white rounded border border-red-200"
                    >
                      <div>
                        <div className="font-medium text-foreground">
                          {submission.studentName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {submission.assessmentTitle}
                        </div>
                      </div>
                      <Link to={`/assessor/submissions/${submission.id}/grade`}>
                        <Button variant="default" size="sm">
                          Grade Now
                        </Button>
                      </Link>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
