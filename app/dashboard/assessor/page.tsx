'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function AssessorDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">
            Assessor Dashboard
          </h1>
          <p className="text-muted-foreground">
            Review and grade student assessments
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Pending Submissions
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">awaiting review</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Graded Today
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">0</div>
              <p className="text-xs text-muted-foreground mt-1">completed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Average Score
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-</div>
              <p className="text-xs text-muted-foreground mt-1">this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                Completion Rate
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">-%</div>
              <p className="text-xs text-muted-foreground mt-1">of assessments</p>
            </CardContent>
          </Card>
        </div>

        {/* Submissions Queue */}
        <Card>
          <CardHeader>
            <CardTitle>Submissions Queue</CardTitle>
            <CardDescription>
              Student assessments waiting for your review
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
                    No pending submissions at this time
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="in-progress" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No submissions in progress
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="completed" className="mt-4">
                <div className="text-center py-8">
                  <p className="text-muted-foreground">
                    No completed submissions
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
