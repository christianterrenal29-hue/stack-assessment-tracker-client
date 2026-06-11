'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DataTable, Column } from '@/components/data-table';
import { AlertCircle, TrendingDown, AlertTriangle, Eye } from 'lucide-react';

interface AtRiskStudent {
  id: string;
  name: string;
  email: string;
  program: string;
  riskLevel: 'critical' | 'high' | 'medium';
  riskFactors: string[];
  progress: number;
  attendance: number;
  ojtHours: number;
  lastActivity: string;
  instructor: string;
}

export default function AtRiskStudentsPage() {
  const [students] = useState<AtRiskStudent[]>([
    {
      id: '1',
      name: 'Ana Reyes',
      email: 'ana@example.com',
      program: 'Electrical Installation',
      riskLevel: 'critical',
      riskFactors: ['Low attendance', 'Low OJT hours', 'Failing assessments'],
      progress: 25,
      attendance: 55,
      ojtHours: 30,
      lastActivity: '2024-05-10',
      instructor: 'John Doe',
    },
    {
      id: '2',
      name: 'Carlos Santos',
      email: 'carlos@example.com',
      program: 'Welding',
      riskLevel: 'high',
      riskFactors: ['Low progress', 'Irregular attendance', 'Missing submissions'],
      progress: 45,
      attendance: 78,
      ojtHours: 80,
      lastActivity: '2024-05-20',
      instructor: 'Jane Smith',
    },
    {
      id: '3',
      name: 'Luis Torres',
      email: 'luis@example.com',
      program: 'HVAC Technician',
      riskLevel: 'high',
      riskFactors: ['Low OJT hours', 'Incomplete competencies'],
      progress: 40,
      attendance: 85,
      ojtHours: 50,
      lastActivity: '2024-05-22',
      instructor: 'John Doe',
    },
    {
      id: '4',
      name: 'Patricia Lim',
      email: 'patricia@example.com',
      program: 'Carpentry',
      riskLevel: 'medium',
      riskFactors: ['Borderline progress', 'Low engagement'],
      progress: 55,
      attendance: 80,
      ojtHours: 100,
      lastActivity: '2024-05-23',
      instructor: 'Jane Smith',
    },
  ]);

  const criticalCount = students.filter((s) => s.riskLevel === 'critical').length;
  const highCount = students.filter((s) => s.riskLevel === 'high').length;
  const mediumCount = students.filter((s) => s.riskLevel === 'medium').length;

  const getRiskColor = (level: string) => {
    const colors: Record<string, string> = {
      critical: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
    };
    return colors[level] || 'bg-gray-100 text-gray-800';
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'critical':
        return <AlertCircle className="w-4 h-4" />;
      case 'high':
        return <AlertTriangle className="w-4 h-4" />;
      case 'medium':
        return <TrendingDown className="w-4 h-4" />;
      default:
        return null;
    }
  };

  const columns: Column<AtRiskStudent>[] = [
    {
      key: 'name',
      label: 'Student',
      sortable: true,
      searchable: true,
    },
    {
      key: 'program',
      label: 'Program',
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
      key: 'attendance',
      label: 'Attendance',
      render: (value: number) => (
        <Badge variant={value >= 80 ? 'default' : 'destructive'}>
          {value}%
        </Badge>
      ),
    },
    {
      key: 'riskLevel',
      label: 'Risk Level',
      sortable: true,
      render: (value: string) => (
        <Badge className={getRiskColor(value)}>
          <span className="flex items-center gap-1">
            {getRiskIcon(value)}
            {value}
          </span>
        </Badge>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                At-Risk Students
              </h1>
              <p className="text-muted-foreground mt-1">
                Monitor and support students requiring attention
              </p>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardHeader>
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 mt-0.5" />
              <div className="flex-1">
                <CardTitle className="text-red-900">
                  {criticalCount} Student(s) Need Immediate Attention
                </CardTitle>
                <CardDescription className="text-red-800 mt-1">
                  Critical-level students are at risk of not completing the program
                </CardDescription>
              </div>
            </div>
          </CardHeader>
        </Card>

        {/* Risk Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="border-red-200 bg-red-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-red-900 flex items-center gap-2">
                <AlertCircle className="w-4 h-4" />
                Critical Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-red-600">{criticalCount}</div>
            </CardContent>
          </Card>

          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-orange-900 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                High Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{highCount}</div>
            </CardContent>
          </Card>

          <Card className="border-yellow-200 bg-yellow-50">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-yellow-900 flex items-center gap-2">
                <TrendingDown className="w-4 h-4" />
                Medium Risk
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-yellow-600">{mediumCount}</div>
            </CardContent>
          </Card>
        </div>

        {/* Data Table */}
        <Card>
          <CardHeader>
            <CardTitle>All At-Risk Students</CardTitle>
            <CardDescription>
              {students.length} student(s) currently flagged as at-risk
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              data={students}
              columns={columns}
              pageSize={10}
              selectable={true}
              emptyMessage="No at-risk students"
            />
          </CardContent>
        </Card>

        {/* Intervention Plans */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-lg">Recent Intervention Actions</CardTitle>
            <CardDescription>
              Steps being taken to support at-risk students
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {students.map((student) => (
                <div
                  key={student.id}
                  className="p-4 border rounded-lg bg-background hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div className="flex-1">
                      <h4 className="font-semibold text-foreground">
                        {student.name}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        {student.program}
                      </p>
                    </div>
                    <Badge className={getRiskColor(student.riskLevel)}>
                      {student.riskLevel}
                    </Badge>
                  </div>

                  <div className="mb-3 text-sm">
                    <p className="font-medium text-muted-foreground mb-2">
                      Risk Factors:
                    </p>
                    <div className="flex flex-wrap gap-2">
                      {student.riskFactors.map((factor, idx) => (
                        <Badge key={idx} variant="secondary" className="text-xs">
                          {factor}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <p className="text-xs text-muted-foreground">
                      Instructor: {student.instructor} • Last activity:{' '}
                      {new Date(student.lastActivity).toLocaleDateString()}
                    </p>
                    <Button variant="outline" size="sm">
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
