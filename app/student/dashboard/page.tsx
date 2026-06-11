'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Link } from 'react-router-dom';
import {
  CheckCircle2,
  Clock,
  AlertCircle,
  BookOpen,
  TrendingUp,
  FileCheck,
  Award,
} from 'lucide-react';

interface Competency {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in-progress' | 'not-started';
  progress: number;
  dueDate: string;
}

interface Assessment {
  id: string;
  title: string;
  dueDate: string;
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  totalScore: number;
}

export default function StudentDashboardPage() {
  const [studentData] = useState({
    name: 'Maria Garcia',
    email: 'maria@example.com',
    program: 'Electrical Installation',
    enrollmentDate: '2024-01-15',
    overallProgress: 65,
    attendanceRate: 92,
    ojtHours: 120,
  });

  const [competencies] = useState<Competency[]>([
    {
      id: '1',
      title: 'Electrical Safety Principles',
      description: 'Understand and apply electrical safety standards',
      status: 'completed',
      progress: 100,
      dueDate: '2024-04-15',
    },
    {
      id: '2',
      title: 'Circuit Analysis',
      description: 'Analyze and design basic circuits',
      status: 'completed',
      progress: 100,
      dueDate: '2024-05-15',
    },
    {
      id: '3',
      title: 'Power Distribution Systems',
      description: 'Understand power distribution and grid systems',
      status: 'in-progress',
      progress: 70,
      dueDate: '2024-06-15',
    },
    {
      id: '4',
      title: 'Installation Techniques',
      description: 'Master electrical installation methods',
      status: 'in-progress',
      progress: 45,
      dueDate: '2024-07-15',
    },
    {
      id: '5',
      title: 'Troubleshooting',
      description: 'Diagnose and repair electrical systems',
      status: 'not-started',
      progress: 0,
      dueDate: '2024-08-15',
    },
  ]);

  const [assessments] = useState<Assessment[]>([
    {
      id: '1',
      title: 'Module 1 Assessment',
      dueDate: '2024-06-30',
      status: 'graded',
      score: 85,
      totalScore: 100,
    },
    {
      id: '2',
      title: 'Module 2 Mid-Term',
      dueDate: '2024-07-15',
      status: 'pending',
      totalScore: 100,
    },
    {
      id: '3',
      title: 'Module 3 Assessment',
      dueDate: '2024-08-30',
      status: 'pending',
      totalScore: 100,
    },
  ]);

  const completedCompetencies = competencies.filter(
    (c) => c.status === 'completed'
  ).length;
  const inProgressCompetencies = competencies.filter(
    (c) => c.status === 'in-progress'
  ).length;
  const pendingAssessments = assessments.filter(
    (a) => a.status === 'pending'
  ).length;

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      completed: 'bg-green-100 text-green-800',
      'in-progress': 'bg-blue-100 text-blue-800',
      'not-started': 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle2 className="w-5 h-5" />;
      case 'in-progress':
        return <Clock className="w-5 h-5" />;
      case 'not-started':
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome, {studentData.name}
          </h1>
          <p className="text-muted-foreground mt-2">
            {studentData.program} • Enrolled: {new Date(studentData.enrollmentDate).toLocaleDateString()}
          </p>
        </div>

        {/* Overall Progress */}
        <Card className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Overall Progress
            </CardTitle>
            <CardDescription>
              Your journey through the program
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{studentData.overallProgress}% Complete</span>
                <span className="text-sm text-muted-foreground">
                  {completedCompetencies}/{competencies.length} Competencies
                </span>
              </div>
              <Progress value={studentData.overallProgress} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4 mt-6">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">
                  {studentData.attendanceRate}%
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Attendance
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-blue-600">
                  {studentData.ojtHours}h
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  OJT Hours
                </p>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {completedCompetencies}/{competencies.length}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Competencies
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Pending Assessments Alert */}
        {pendingAssessments > 0 && (
          <Card className="mb-8 border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900 flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                {pendingAssessments} Pending Assessment(s)
              </CardTitle>
              <CardDescription className="text-orange-800">
                Complete these assessments to progress
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {assessments
                  .filter((a) => a.status === 'pending')
                  .map((assessment) => (
                    <div
                      key={assessment.id}
                      className="flex items-center justify-between p-3 bg-white rounded border border-orange-200"
                    >
                      <div>
                        <p className="font-medium text-foreground">
                          {assessment.title}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          Due: {new Date(assessment.dueDate).toLocaleDateString()}
                        </p>
                      </div>
                      <Button size="sm" variant="default">
                        Take Assessment
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {completedCompetencies}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Clock className="w-4 h-4" />
                In Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">
                {inProgressCompetencies}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <FileCheck className="w-4 h-4" />
                Assessments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {assessments.filter((a) => a.status === 'graded').length}/
                {assessments.length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                <Award className="w-4 h-4" />
                Last Graded
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-600">
                {assessments.find((a) => a.status === 'graded')?.score || '--'}%
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Competencies Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="w-5 h-5" />
              Competencies
            </CardTitle>
            <CardDescription>
              Track your progress through required competencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competencies.map((competency) => (
                <div
                  key={competency.id}
                  className="p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        {getStatusIcon(competency.status)}
                        <h4 className="font-semibold text-foreground">
                          {competency.title}
                        </h4>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {competency.description}
                      </p>
                    </div>
                    <Badge className={getStatusColor(competency.status)}>
                      {competency.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-xs font-medium">
                          {competency.progress}%
                        </span>
                      </div>
                      <Progress value={competency.progress} className="h-2" />
                    </div>
                    <Link to={`/student/competencies/${competency.id}`}
                    >
                      <Button variant="outline" size="sm">
                        Details
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Assessments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="w-5 h-5" />
              Recent Assessments
            </CardTitle>
            <CardDescription>
              Your assessment submissions and grades
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {assessments.map((assessment) => (
                <div
                  key={assessment.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex-1">
                    <p className="font-medium text-foreground">
                      {assessment.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Due: {new Date(assessment.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    {assessment.status === 'graded' ? (
                      <div>
                        <div className="text-lg font-bold text-green-600">
                          {assessment.score}/{assessment.totalScore}
                        </div>
                        <Badge variant="default" className="mt-1">
                          Graded
                        </Badge>
                      </div>
                    ) : assessment.status === 'submitted' ? (
                      <Badge variant="secondary">Under Review</Badge>
                    ) : (
                      <Badge variant="outline">Pending</Badge>
                    )}
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
