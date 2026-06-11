import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface DashboardCardProps {
  title: string;
  description?: string;
  value?: string | number;
  subtitle?: string;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    direction: 'up' | 'down';
  };
  className?: string;
  children?: React.ReactNode;
  onClick?: () => void;
}

export function DashboardCard({
  title,
  description,
  value,
  subtitle,
  icon,
  trend,
  className,
  children,
  onClick,
}: DashboardCardProps) {
  return (
    <Card className={cn('cursor-pointer hover:border-primary transition-colors', className)} onClick={onClick}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {title}
            </CardTitle>
            {description && (
              <CardDescription className="text-xs mt-1">{description}</CardDescription>
            )}
          </div>
          {icon && <div className="text-primary">{icon}</div>}
        </div>
      </CardHeader>
      <CardContent className="space-y-2">
        {value !== undefined && (
          <div className="flex items-baseline gap-2">
            <div className="text-3xl font-bold text-foreground">{value}</div>
            {trend && (
              <div
                className={cn(
                  'text-xs font-semibold',
                  trend.direction === 'up' ? 'text-green-600' : 'text-red-600'
                )}
              >
                {trend.direction === 'up' ? '↑' : '↓'} {Math.abs(trend.value)}%
              </div>
            )}
          </div>
        )}
        {subtitle && <p className="text-xs text-muted-foreground">{subtitle}</p>}
        {children}
      </CardContent>
    </Card>
  );
}
