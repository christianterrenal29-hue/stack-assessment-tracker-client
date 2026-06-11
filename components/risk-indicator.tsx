import { Badge } from '@/components/ui/badge';
import { AlertCircle, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type RiskLevel = 'critical' | 'high' | 'medium' | 'low' | 'none';

interface RiskIndicatorProps {
  riskLevel?: RiskLevel;
  level?: Exclude<RiskLevel, 'none'>;
  message?: string;
  reasons?: string[];
  showDetails?: boolean;
  className?: string;
}

export function RiskIndicator({
  riskLevel,
  level,
  message,
  reasons = [],
  showDetails = true,
  className,
}: RiskIndicatorProps) {
  const resolvedLevel = riskLevel ?? level ?? 'none';

  const getRiskConfig = (currentLevel: RiskLevel) => {
    switch (currentLevel) {
      case 'critical':
        return {
          label: 'Critical Risk',
          color: 'bg-red-100 text-red-800',
          icon: AlertCircle,
          borderColor: 'border-red-300',
        };
      case 'high':
        return {
          label: 'High Risk',
          color: 'bg-orange-100 text-orange-800',
          icon: AlertTriangle,
          borderColor: 'border-orange-300',
        };
      case 'medium':
        return {
          label: 'Medium Risk',
          color: 'bg-yellow-100 text-yellow-800',
          icon: AlertTriangle,
          borderColor: 'border-yellow-300',
        };
      case 'low':
        return {
          label: 'Low Risk',
          color: 'bg-blue-100 text-blue-800',
          icon: CheckCircle2,
          borderColor: 'border-blue-300',
        };
      case 'none':
      default:
        return {
          label: 'No Risk',
          color: 'bg-green-100 text-green-800',
          icon: CheckCircle2,
          borderColor: 'border-green-300',
        };
    }
  };

  const config = getRiskConfig(resolvedLevel);
  const Icon = config.icon;
  const details = message ? [message, ...reasons] : reasons;

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-2">
        <Icon className="h-4 w-4" />
        <Badge className={config.color}>{config.label}</Badge>
      </div>
      {showDetails && details.length > 0 && (
        <div className={cn('space-y-1 rounded-lg border p-3', config.borderColor, config.color)}>
          <p className="text-xs font-semibold">Risk Factors:</p>
          <ul className="space-y-1 text-xs">
            {details.map((reason, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="mt-1">-</span>
                <span>{reason}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
