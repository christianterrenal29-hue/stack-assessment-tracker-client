'use client';

import { Link } from 'react-router-dom';
import useSWR from 'swr';
import { Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { apiClient } from '@/lib/api-client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { LoadingSkeleton } from '@/components/loading-skeleton';

type Competency = {
  _id: string;
  code?: string;
  title?: string;
  name?: string;
  description?: string;
  category?: string;
  status?: string;
};

export default function StudentCompetenciesListPage() {
  const { data: competencies = [], isLoading } = useSWR<Competency[]>(
    '/competencies',
    (url: string) => apiClient.get<Competency[]>(url)
  );

  if (isLoading) return <LoadingSkeleton />;

  return (
    <div className="p-8">
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Competencies</h1>
          <p className="text-muted-foreground mt-1">
            Review TESDA competency units and open details for progress evidence.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Available Units</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold">{competencies.length}</CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">Completed</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-green-600">
              {competencies.filter((item) => item.status === 'completed').length}
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm text-muted-foreground">In Progress</CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-bold text-blue-600">
              {competencies.filter((item) => item.status !== 'completed').length}
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {competencies.map((competency) => (
            <Card key={competency._id}>
              <CardHeader>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <CardTitle className="flex items-center gap-2 text-lg">
                      <BookOpen className="w-5 h-5" />
                      {competency.title || competency.name || 'Competency'}
                    </CardTitle>
                    <CardDescription>{competency.code || competency.category || 'TESDA unit'}</CardDescription>
                  </div>
                  <Badge variant={competency.status === 'completed' ? 'default' : 'secondary'}>
                    {competency.status === 'completed' ? (
                      <CheckCircle2 className="w-3 h-3 mr-1" />
                    ) : (
                      <Award className="w-3 h-3 mr-1" />
                    )}
                    {competency.status || 'available'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {competency.description || 'No description provided.'}
                </p>
                <Button asChild variant="outline" className="w-full">
                  <Link to={`/student/competencies/${competency._id}`}>View Details</Link>
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {competencies.length === 0 && (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              No competencies are available yet.
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
