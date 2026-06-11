import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';

interface Competency {
  id: string;
  name: string;
  progress: number;
  status: 'completed' | 'in-progress' | 'not-started' | 'in_progress' | 'not_started' | 'failed';
}

interface CompetencyProgressProps {
  competencies?: Competency[];
  code?: string;
  progress?: number;
  status?: Competency['status'];
  title?: string;
  description?: string;
}

export function CompetencyProgress({
  competencies,
  code,
  progress,
  status,
  title = 'Competency Progress',
  description = 'Track your competency development',
}: CompetencyProgressProps) {
  const items = competencies ?? [{
    id: code ?? title,
    name: code ? `${code} - ${title}` : title,
    progress: progress ?? 0,
    status: status ?? 'not-started',
  }];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-progress':
      case 'in_progress':
        return 'bg-blue-100 text-blue-800';
      case 'not-started':
      case 'not_started':
        return 'bg-gray-100 text-gray-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in-progress':
      case 'in_progress':
        return 'In Progress';
      case 'not-started':
      case 'not_started':
        return 'Not Started';
      case 'failed':
        return 'Failed';
      default:
        return status;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {items.map((competency) => (
            <div key={competency.id} className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">{competency.name}</span>
                <Badge className={getStatusColor(competency.status)}>
                  {getStatusLabel(competency.status)}
                </Badge>
              </div>
              <div className="flex items-center gap-2">
                <Progress value={competency.progress} className="flex-1" />
                <span className="text-sm text-muted-foreground w-12 text-right">
                  {competency.progress}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
