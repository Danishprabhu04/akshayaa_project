import { motion } from 'framer-motion';
import { DivideIcon as LucideIcon } from 'lucide-react';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
}

interface CardHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface CardBodyProps {
  children: React.ReactNode;
  className?: string;
}

interface CardFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Card({ children, className = '', hover = false, onClick }: CardProps) {
  const Component = onClick ? motion.button : motion.div;
  
  return (
    <Component
      onClick={onClick}
      whileHover={hover ? { scale: 1.02, y: -2 } : undefined}
      className={`
        glass-card rounded-2xl border border-white/20 shadow-xl backdrop-blur-2xl
        ${hover ? 'cursor-pointer hover:shadow-2xl transition-shadow' : ''}
        ${onClick ? 'focus-ring text-left w-full' : ''}
        ${className}
      `}
    >
      {children}
    </Component>
  );
}

export function CardHeader({ children, className = '' }: CardHeaderProps) {
  return (
    <div className={`p-6 border-b border-white/10 ${className}`}>
      {children}
    </div>
  );
}

export function CardBody({ children, className = '' }: CardBodyProps) {
  return (
    <div className={`p-6 ${className}`}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className = '' }: CardFooterProps) {
  return (
    <div className={`p-6 pt-0 border-t border-white/10 ${className}`}>
      {children}
    </div>
  );
}

// KPI Card Component
interface KPICardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  color?: 'primary' | 'success' | 'warning' | 'error';
}

const colorStyles = {
  primary: 'from-primary-500 to-accent-500',
  success: 'from-success-500 to-green-600',
  warning: 'from-warning-500 to-orange-600',
  error: 'from-error-500 to-red-600',
};

const changeStyles = {
  positive: 'text-success-600',
  negative: 'text-error-600',
  neutral: 'text-text-secondary',
};

export function KPICard({ title, value, change, changeType = 'neutral', icon: Icon, color = 'primary' }: KPICardProps) {
  return (
    <Card hover>
      <CardBody className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-2xl font-bold text-text-primary mt-1">{value}</p>
          {change && (
            <p className={`text-sm mt-1 ${changeStyles[changeType]}`}>
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-xl bg-gradient-to-br ${colorStyles[color]}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </CardBody>
    </Card>
  );
}