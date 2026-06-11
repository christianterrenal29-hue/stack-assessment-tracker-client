'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function StudentDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            My Learning Dashboard
          </h1>
          <p className="text-muted-foreground">
            Track your progress and upcoming assessments
          </p>
        </div>

        {/* Progress Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Overall Progress
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold mb-2">-%</div>
              <Progress value={0} className="h-2" />
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Competencies
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0/0</div>
              <p className="text-xs text-muted-foreground mt-1">achieved</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Attendance Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-%</div>
              <p className="text-xs text-muted-foreground mt-1">this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                OJT Hours
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0/0</div>
              <p className="text-xs text-muted-foreground mt-1">hours completed</p>
            </CardContent>
          </Card>
        </div>

        {/* Competency Progress */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Competency Progress</CardTitle>
            <CardDescription>
              Track your progress on required competencies
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Competency 1</span>
                  <span className="text-sm text-muted-foreground">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Competency 2</span>
                  <span className="text-sm text-muted-foreground">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm font-medium">Competency 3</span>
                  <span className="text-sm text-muted-foreground">0%</span>
                </div>
                <Progress value={0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assessments */}
        <Card>
          <CardHeader>
            <CardTitle>My Assessments</CardTitle>
            <CardDescription>
              Pending and completed assessments
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="pending">Pending (0)</TabsTrigger>
                <TabsTrigger value="in-progress">In Progress (0)</TabsTrigger>
                <TabsTrigger value="completed">Completed (0)</TabsTrigger>
              </TabsList>

              <TabsContent value="pending" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No pending assessments
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="in-progress" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No assessments in progress
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No completed assessments
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
