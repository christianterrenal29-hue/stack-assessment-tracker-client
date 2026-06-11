import { AlertCircle, CheckCircle, InfoIcon, AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';

interface AlertProps {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  description?: string;
  dismissible?: boolean;
  onDismiss?: () => void;
}

export function Alert({ type, message, description, dismissible = false, onDismiss }: AlertProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.();
  };

  if (!isVisible) return null;

  const styles = {
    success: {
      bg: 'bg-green-50 border-green-200',
      icon: 'text-green-600',
      title: 'text-green-900',
      text: 'text-green-700',
      IconComponent: CheckCircle,
    },
    error: {
      bg: 'bg-red-50 border-red-200',
      icon: 'text-red-600',
      title: 'text-red-900',
      text: 'text-red-700',
      IconComponent: AlertCircle,
    },
    warning: {
      bg: 'bg-yellow-50 border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-900',
      text: 'text-yellow-700',
      IconComponent: AlertTriangle,
    },
    info: {
      bg: 'bg-blue-50 border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-900',
      text: 'text-blue-700',
      IconComponent: InfoIcon,
    },
  };

  const style = styles[type];

  return (
    <div className={`border rounded-md p-4 ${style.bg}`}>
      <div className="flex gap-3">
        <style.IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${style.icon}`} />
        <div className="flex-1">
          <h3 className={`font-medium ${style.title}`}>{message}</h3>
          {description && <p className={`text-sm mt-1 ${style.text}`}>{description}</p>}
        </div>
        {dismissible && (
          <button
            onClick={handleDismiss}
            className={`flex-shrink-0 ${style.icon} hover:opacity-70`}
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}
