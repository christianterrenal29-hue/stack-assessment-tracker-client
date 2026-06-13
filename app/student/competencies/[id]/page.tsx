'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  FileCheck,
  Target,
  Award,
} from 'lucide-react';

interface Resource {
  id: string;
  title: string;
  type: 'video' | 'pdf' | 'exercise' | 'reading';
  duration?: string;
  completed: boolean;
}

interface Assessment {
  id: string;
  title: string;
  type: 'formative' | 'summative';
  status: 'pending' | 'submitted' | 'graded';
  score?: number;
  totalScore: number;
  dueDate: string;
}

export default function CompetencyDetailsPage() {
  const params = useParams<{ id: string }>();
  const [competency] = useState({
    id: params.id ?? '',
    title: 'Electrical Safety Principles',
    description:
      'Master the fundamental principles of electrical safety, regulations, and best practices in the field.',
    status: 'completed',
    progress: 100,
    startDate: '2024-04-01',
    completionDate: '2024-04-15',
    instructor: 'John Doe',
  });

  const [resources] = useState<Resource[]>([
    {
      id: '1',
      title: 'Introduction to Electrical Safety',
      type: 'video',
      duration: '15 min',
      completed: true,
    },
    {
      id: '2',
      title: 'Safety Regulations and Standards',
      type: 'reading',
      completed: true,
    },
    {
      id: '3',
      title: 'Personal Protective Equipment (PPE)',
      type: 'video',
      duration: '20 min',
      completed: true,
    },
    {
      id: '4',
      title: 'Safety Procedures Practical Exercise',
      type: 'exercise',
      completed: true,
    },
    {
      id: '5',
      title: 'Hazard Identification Checklist',
      type: 'pdf',
      completed: true,
    },
  ]);

  const [assessments] = useState<Assessment[]>([
    {
      id: '1',
      title: 'Safety Knowledge Quiz',
      type: 'formative',
      status: 'graded',
      score: 95,
      totalScore: 100,
      dueDate: '2024-04-08',
    },
    {
      id: '2',
      title: 'Safety Procedures Practical Test',
      type: 'summative',
      status: 'graded',
      score: 92,
      totalScore: 100,
      dueDate: '2024-04-15',
    },
  ]);

  const [objectives] = useState([
    'Understand assessment safety requirements',
    'Apply proper safety procedures',
    'Use personal protective equipment correctly',
    'Identify hazardous situations',
    'Follow OSHA and industry standards',
  ]);

  const resourcesCompleted = resources.filter((r) => r.completed).length;
  const assessmentsGraded = assessments.filter(
    (a) => a.status === 'graded'
  ).length;

  const getResourceIcon = (type: string) => {
    const icons: Record<string, React.ReactNode> = {
      video: '🎬',
      pdf: '📄',
      exercise: '💪',
      reading: '📖',
    };
    return icons[type] || '📋';
  };

  const getResourceColor = (type: string) => {
    const colors: Record<string, string> = {
      video: 'bg-red-50 border-red-200',
      pdf: 'bg-blue-50 border-blue-200',
      exercise: 'bg-green-50 border-green-200',
      reading: 'bg-yellow-50 border-yellow-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const getAssessmentBadgeColor = (type: string) => {
    const colors: Record<string, string> = {
      formative: 'bg-blue-100 text-blue-800',
      summative: 'bg-purple-100 text-purple-800',
    };
    return colors[type] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link to="/student/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {competency.title}
              </h1>
              <p className="text-muted-foreground mt-2">
                {competency.description}
              </p>
            </div>
            {competency.status === 'completed' && (
              <Badge className="h-fit bg-green-100 text-green-800 flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Completed
              </Badge>
            )}
          </div>
        </div>

        {/* Progress Card */}
        <Card className="mb-8 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="w-5 h-5" />
              Progress
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">{competency.progress}% Complete</span>
              </div>
              <Progress value={competency.progress} className="h-3" />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-sm text-muted-foreground">Started</div>
                <div className="font-medium">
                  {new Date(competency.startDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Completed</div>
                <div className="font-medium">
                  {new Date(competency.completionDate).toLocaleDateString()}
                </div>
              </div>
              <div>
                <div className="text-sm text-muted-foreground">Instructor</div>
                <div className="font-medium">{competency.instructor}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="objectives" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="objectives">Learning Objectives</TabsTrigger>
            <TabsTrigger value="resources">
              Resources ({resourcesCompleted}/{resources.length})
            </TabsTrigger>
            <TabsTrigger value="assessments">
              Assessments ({assessmentsGraded}/{assessments.length})
            </TabsTrigger>
            <TabsTrigger value="achievement">Achievement</TabsTrigger>
          </TabsList>

          {/* Learning Objectives Tab */}
          <TabsContent value="objectives" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Objectives</CardTitle>
                <CardDescription>
                  What you will learn in this competency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {objectives.map((objective, idx) => (
                    <div
                      key={idx}
                      className="flex items-start gap-3 p-3 border rounded-lg bg-muted/30"
                    >
                      <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-foreground">{objective}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Learning Resources</CardTitle>
                <CardDescription>
                  {resourcesCompleted} of {resources.length} resources completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className={`p-4 border rounded-lg flex items-start justify-between gap-4 ${getResourceColor(
                        resource.type
                      )}`}
                    >
                      <div className="flex items-start gap-3 flex-1">
                        <span className="text-2xl">
                          {getResourceIcon(resource.type)}
                        </span>
                        <div className="flex-1">
                          <div className="font-medium text-foreground">
                            {resource.title}
                          </div>
                          <div className="text-sm text-muted-foreground capitalize">
                            {resource.type}
                            {resource.duration && ` • ${resource.duration}`}
                          </div>
                        </div>
                      </div>
                      {resource.completed ? (
                        <Badge className="bg-green-100 text-green-800 h-fit">
                          <CheckCircle2 className="w-3 h-3 mr-1" />
                          Completed
                        </Badge>
                      ) : (
                        <Button size="sm">Start</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Assessments Tab */}
          <TabsContent value="assessments" className="mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Assessments</CardTitle>
                <CardDescription>
                  {assessmentsGraded} of {assessments.length} assessments completed
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {assessments.map((assessment) => (
                    <div
                      key={assessment.id}
                      className="p-4 border rounded-lg"
                    >
                      <div className="flex items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <FileCheck className="w-4 h-4" />
                            <h4 className="font-medium text-foreground">
                              {assessment.title}
                            </h4>
                          </div>
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
                              <Badge
                                className={getAssessmentBadgeColor(
                                  assessment.type
                                )}
                              >
                                {assessment.type}
                              </Badge>
                            </div>
                          ) : (
                            <Badge variant="outline">Pending</Badge>
                          )}
                        </div>
                      </div>

                      {assessment.status === 'graded' && (
                        <div className="mt-3">
                          <div className="flex items-center justify-between mb-1 text-xs">
                            <span>Score: {Math.round((assessment.score! / assessment.totalScore) * 100)}%</span>
                          </div>
                          <Progress
                            value={(assessment.score! / assessment.totalScore) * 100}
                            className="h-2"
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Achievement Tab */}
          <TabsContent value="achievement" className="mt-6">
            <Card className="bg-gradient-to-r from-purple-50 to-pink-50 border-purple-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="w-5 h-5 text-purple-600" />
                  Competency Achievement
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center py-8">
                  <Award className="w-16 h-16 text-purple-600 mx-auto mb-4" />
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    Competency Achieved!
                  </h3>
                  <p className="text-muted-foreground mb-4">
                    You have successfully completed all requirements for{' '}
                    <strong>{competency.title}</strong>
                  </p>
                  <div className="bg-white p-4 rounded-lg border-2 border-purple-200 inline-block">
                    <p className="text-sm text-muted-foreground">
                      Completion Date
                    </p>
                    <p className="text-2xl font-bold">
                      {new Date(competency.completionDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600">
                      {resources.filter((r) => r.completed).length}/{resources.length}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Resources Completed
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600">
                      {assessments
                        .filter((a) => a.status === 'graded')
                        .reduce((sum, a) => sum + (a.score || 0), 0) /
                        assessments.filter((a) => a.status === 'graded')
                          .length}
                      %
                    </div>
                    <p className="text-sm text-muted-foreground">
                      Average Score
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
