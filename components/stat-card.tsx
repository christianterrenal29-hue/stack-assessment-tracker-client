import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';

type Trend =
  | 'up'
  | 'down'
  | {
      value: number;
      isPositive: boolean;
    };

interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  icon?: React.ReactNode;
  trend?: Trend;
  backgroundColor?: string;
  textColor?: string;
  className?: string;
}

export function StatCard({
  label,
  value,
  unit,
  icon,
  trend,
  backgroundColor = 'bg-blue-50',
  textColor = 'text-blue-600',
  className,
}: StatCardProps) {
  const normalizedTrend =
    typeof trend === 'string'
      ? { value: 0, isPositive: trend === 'up' }
      : trend;

  return (
    <Card className={cn('border-0', className)}>
      <CardContent className={cn('pt-6', backgroundColor)}>
        <div className="space-y-2">
          <div className="flex items-start justify-between">
            <p className="text-sm text-muted-foreground">{label}</p>
            {icon && <div className={textColor}>{icon}</div>}
          </div>
          <div className="flex items-baseline gap-2">
            <div className={cn('text-3xl font-bold', textColor)}>
              {value}
              {unit && <span className="text-lg">{unit}</span>}
            </div>
            {normalizedTrend && (
              <span
                className={cn(
                  'text-xs font-semibold',
                  normalizedTrend.isPositive ? 'text-green-600' : 'text-red-600'
                )}
              >
                {normalizedTrend.isPositive ? 'Up' : 'Down'}
                {normalizedTrend.value ? ` ${Math.abs(normalizedTrend.value)}%` : ''}
              </span>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
