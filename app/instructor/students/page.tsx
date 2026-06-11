'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DataTable, Column } from '@/components/data-table';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { Eye, AlertCircle } from 'lucide-react';

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  enrollmentDate: string;
  progress: number;
  competenciesCompleted: number;
  totalCompetencies: number;
  attendanceRate: number;
  ojtHours: number;
  riskLevel: 'critical' | 'high' | 'medium' | 'low' | 'none';
  lastActivity: string;
}

export default function StudentManagementPage() {
  const [students] = useState<Student[]>([
    {
      id: '1',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria@example.com',
      enrollmentDate: '2024-01-15',
      progress: 65,
      competenciesCompleted: 4,
      totalCompetencies: 8,
      attendanceRate: 92,
      ojtHours: 120,
      riskLevel: 'low',
      lastActivity: '2024-05-24',
    },
    {
      id: '2',
      firstName: 'Carlos',
      lastName: 'Santos',
      email: 'carlos@example.com',
      enrollmentDate: '2024-01-15',
      progress: 45,
      competenciesCompleted: 3,
      totalCompetencies: 8,
      attendanceRate: 78,
      ojtHours: 80,
      riskLevel: 'medium',
      lastActivity: '2024-05-20',
    },
    {
      id: '3',
      firstName: 'Ana',
      lastName: 'Reyes',
      email: 'ana@example.com',
      enrollmentDate: '2024-01-15',
      progress: 25,
      competenciesCompleted: 1,
      totalCompetencies: 8,
      attendanceRate: 55,
      ojtHours: 30,
      riskLevel: 'critical',
      lastActivity: '2024-05-10',
    },
  ]);

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-blue-100 text-blue-800',
      none: 'bg-green-100 text-green-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const columns: Column<Student>[] = [
    {
      key: 'firstName',
      label: 'Student Name',
      sortable: true,
      searchable: true,
      render: (value: string, row: Student) => `${row.firstName} ${row.lastName}`,
    },
    {
      key: 'email',
      label: 'Email',
      searchable: true,
    },
    {
      key: 'progress',
      label: 'Progress',
      render: (value: number) => (
        <div className="w-32">
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs font-medium">{value}%</span>
          </div>
          <Progress value={value} className="h-2" />
        </div>
      ),
    },
    {
      key: 'competenciesCompleted',
      label: 'Competencies',
      render: (value: number, row: Student) => (
        <div className="text-sm">
          <div className="font-medium">{value}/{row.totalCompetencies}</div>
        </div>
      ),
    },
    {
      key: 'attendanceRate',
      label: 'Attendance',
      render: (value: number) => (
        <Badge variant={value >= 80 ? 'default' : 'secondary'}>
          {value}%
        </Badge>
      ),
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      render: (value: string) => (
        <Badge className={getRiskColor(value)}>{value}</Badge>
      ),
    },
  ];

  const atRiskCount = students.filter(
    (s) => s.riskLevel === 'critical' || s.riskLevel === 'high'
  ).length;

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">My Students</h1>
          <p className="text-muted-foreground mt-1">
            Monitor student progress and performance
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Total Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{students.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Avg. Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {Math.round(
                  students.reduce((acc, s) => acc + s.progress, 0) /
                    students.length
                )}
                %
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                High Attendance
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {students.filter((s) => s.attendanceRate >= 80).length}
              </div>
            </CardContent>
          </Card>
          <Card className={atRiskCount > 0 ? 'border-red-200 bg-red-50' : ''}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                {atRiskCount > 0 && <AlertCircle className="w-4 h-4 text-red-600" />}
                At-Risk Students
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{atRiskCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>Student List</CardTitle>
            <CardDescription>
              View all students, their progress, and risk status
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={students}
              columns={columns}
              pageSize={10}
              selectable={true}
              emptyMessage="No students enrolled yet"
            />
          </CardContent>
        </Card>

        {/* At-Risk Students Section */}
        {atRiskCount > 0 && (
          <Card className="mt-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900">
                Students Requiring Attention
              </CardTitle>
              <CardDescription>
                {atRiskCount} student(s) showing risk indicators
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {students
                  .filter(
                    (s) =>
                      s.riskLevel === 'critical' || s.riskLevel === 'high'
                  )
                  .map((student) => (
                    <div
                      key={student.id}
                      className="flex items-start justify-between gap-4 p-4 bg-white rounded-lg border border-orange-200"
                    >
                      <div className="flex-1">
                        <div className="font-semibold text-foreground">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Progress: {student.progress}% • Attendance:{' '}
                          {student.attendanceRate}% • OJT: {student.ojtHours}
                          h
                        </div>
                      </div>
                      <Button variant="outline" size="sm">
                        <Eye className="w-4 h-4 mr-2" />
                        Review
                      </Button>
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
