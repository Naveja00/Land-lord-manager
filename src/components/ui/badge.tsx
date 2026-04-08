import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  className?: string;
}

const variantStyles: Record<string, string> = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-emerald-50 text-emerald-700',
  warning: 'bg-amber-50 text-amber-700',
  danger: 'bg-red-50 text-red-700',
  info: 'bg-blue-50 text-blue-700',
};

export function Badge({ children, variant = 'default', className = '' }: BadgeProps) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${variantStyles[variant]} ${className}`}
    >
      {children}
    </span>
  );
}

export function StatusBadge({ status }: { status: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    open: { variant: 'warning', label: 'Open' },
    in_progress: { variant: 'info', label: 'In Progress' },
    pending_parts: { variant: 'warning', label: 'Pending Parts' },
    completed: { variant: 'success', label: 'Completed' },
    closed: { variant: 'default', label: 'Closed' },
  };
  const { variant, label } = config[status] || { variant: 'default' as const, label: status };
  return <Badge variant={variant}>{label}</Badge>;
}

export function PriorityBadge({ priority }: { priority: string }) {
  const config: Record<string, { variant: BadgeProps['variant']; label: string }> = {
    low: { variant: 'default', label: 'Low' },
    medium: { variant: 'info', label: 'Medium' },
    high: { variant: 'warning', label: 'High' },
    emergency: { variant: 'danger', label: 'Emergency' },
  };
  const { variant, label } = config[priority] || { variant: 'default' as const, label: priority };
  return <Badge variant={variant}>{label}</Badge>;
}
