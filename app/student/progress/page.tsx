'use client';

import { DashboardLayout } from '@/components/dashboard-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CompetencyProgress } from '@/components/competency-progress';
import { RiskIndicator } from '@/components/risk-indicator';
import { StatCard } from '@/components/stat-card';
import { TrendingUp, Award, Target, Clock } from 'lucide-react';
import useSWR from 'swr';
import { apiClient } from '@/lib/api-client';
import { LoadingSkeleton } from '@/components/loading-skeleton';

interface StudentProgress {
  studentId: string;
  currentCompetencies: Array<{
    competencyId: string;
    code: string;
    title: string;
    progress: number;
    status: 'not_started' | 'in_progress' | 'completed' | 'failed';
  }>;
  assessmentPerformance: {
    totalAssessments: number;
    passedAssessments: number;
    averageScore: number;
  };
  attendance: {
    totalClasses: number;
    attendedClasses: number;
    percentage: number;
  };
  ojt: {
    hoursCompleted: number;
    hoursRequired: number;
    percentage: number;
  };
  riskIndicators: {
    lowAttendance: boolean;
    lowAssessmentScore: boolean;
    incompleteOJT: boolean;
    behavioralConcerns: boolean;
    academicStruggles: boolean;
  };
}

export default function StudentProgressPage() {
  const { data: progress, isLoading } = useSWR<StudentProgress>(
    '/students/me/progress',
    (url: string) => apiClient.get<StudentProgress>(url)
  );

  if (isLoading) return <LoadingSkeleton />;

  if (!progress) {
    return (
      <DashboardLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">No progress data available</p>
        </div>
      </DashboardLayout>
    );
  }

  const riskCount = Object.values(progress.riskIndicators).filter(Boolean).length;
  const riskLevel = riskCount === 0 ? 'low' : riskCount <= 2 ? 'medium' : 'high';

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold text-gray-900">My Progress</h1>

        <div className="grid grid-cols-4 gap-4">
          <StatCard
            icon={<Award className="w-6 h-6" />}
            label="Average Score"
            value={`${progress.assessmentPerformance.averageScore}%`}
            trend={progress.assessmentPerformance.averageScore >= 70 ? 'up' : 'down'}
          />
          <StatCard
            icon={<Target className="w-6 h-6" />}
            label="Competencies"
            value={`${progress.currentCompetencies.filter((c: any) => c.status === 'completed').length}/${progress.currentCompetencies.length}`}
            trend="up"
          />
          <StatCard
            icon={<Clock className="w-6 h-6" />}
            label="Attendance"
            value={`${progress.attendance.percentage}%`}
            trend={progress.attendance.percentage >= 80 ? 'up' : 'down'}
          />
          <StatCard
            icon={<TrendingUp className="w-6 h-6" />}
            label="OJT Hours"
            value={`${progress.ojt.hoursCompleted}/${progress.ojt.hoursRequired}`}
            trend={progress.ojt.percentage >= 75 ? 'up' : 'down'}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Risk Assessment</CardTitle>
            </CardHeader>
            <CardContent>
              <RiskIndicator
                level={riskLevel as 'low' | 'medium' | 'high' | 'critical'}
                message={
                  riskCount === 0
                    ? 'You are on track!'
                    : `${riskCount} risk factor${riskCount > 1 ? 's' : ''} detected`
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Attendance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Attended</span>
                  <span className="font-medium">{progress.attendance.attendedClasses}/{progress.attendance.totalClasses}</span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-500"
                    style={{ width: `${progress.attendance.percentage}%` }}
                  />
                </div>
                <p className="text-xs text-gray-600">{progress.attendance.percentage}% attendance</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Assessment Performance</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Passed</span>
                  <span className="font-medium">
                    {progress.assessmentPerformance.passedAssessments}/{progress.assessmentPerformance.totalAssessments}
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-green-500"
                    style={{
                      width: `${
                        (progress.assessmentPerformance.passedAssessments /
                          progress.assessmentPerformance.totalAssessments) *
                        100
                      }%`,
                    }}
                  />
                </div>
                <p className="text-xs text-gray-600">
                  Avg: {progress.assessmentPerformance.averageScore}%
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Competency Progress</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progress.currentCompetencies.map((competency: any) => (
                <CompetencyProgress
                  key={competency.competencyId}
                  code={competency.code}
                  title={competency.title}
                  progress={competency.progress}
                  status={competency.status}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {riskCount > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="text-orange-900">Risk Factors</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {progress.riskIndicators.lowAttendance && (
                  <li className="flex items-center gap-2 text-orange-900">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Low attendance rate
                  </li>
                )}
                {progress.riskIndicators.lowAssessmentScore && (
                  <li className="flex items-center gap-2 text-orange-900">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Low assessment scores
                  </li>
                )}
                {progress.riskIndicators.incompleteOJT && (
                  <li className="flex items-center gap-2 text-orange-900">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Incomplete OJT hours
                  </li>
                )}
                {progress.riskIndicators.behavioralConcerns && (
                  <li className="flex items-center gap-2 text-orange-900">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Behavioral concerns
                  </li>
                )}
                {progress.riskIndicators.academicStruggles && (
                  <li className="flex items-center gap-2 text-orange-900">
                    <span className="w-2 h-2 bg-orange-500 rounded-full" />
                    Academic struggles
                  </li>
                )}
              </ul>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
