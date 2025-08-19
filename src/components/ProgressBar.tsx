import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ProgressBarProps {
  value: number;
  max?: number;
  label?: string;
  showValue?: boolean;
  color?: 'primary' | 'success' | 'warning' | 'error';
  size?: 'sm' | 'md' | 'lg';
  animate?: boolean;
}

const colorClasses = {
  primary: 'bg-gradient-to-r from-primary-500 to-accent-500',
  success: 'bg-gradient-to-r from-success-500 to-green-600',
  warning: 'bg-gradient-to-r from-warning-500 to-orange-600',
  error: 'bg-gradient-to-r from-error-500 to-red-600',
};

const sizeClasses = {
  sm: 'h-2',
  md: 'h-3',
  lg: 'h-4',
};

export default function ProgressBar({
  value,
  max = 100,
  label,
  showValue = true,
  color = 'primary',
  size = 'md',
  animate = true,
}: ProgressBarProps) {
  const [animatedValue, setAnimatedValue] = useState(animate ? 0 : value);
  const percentage = Math.min((value / max) * 100, 100);

  useEffect(() => {
    if (animate) {
      const duration = 1500; // 1.5 seconds
      const startTime = Date.now();
      const startValue = animatedValue;
      const targetValue = value;

      const animateValue = () => {
        const now = Date.now();
        const elapsed = now - startTime;
        const progress = Math.min(elapsed / duration, 1);
        
        // Ease-out animation
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const currentValue = startValue + (targetValue - startValue) * easedProgress;
        
        setAnimatedValue(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animateValue);
        }
      };

      requestAnimationFrame(animateValue);
    }
  }, [value, animate]);

  const displayValue = animate ? animatedValue : value;
  const displayPercentage = Math.min((displayValue / max) * 100, 100);

  return (
    <div className="w-full">
      {(label || showValue) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-medium text-text-primary">{label}</span>
          )}
          {showValue && (
            <span className="text-sm font-medium text-text-secondary">
              {Math.round(displayValue)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`w-full bg-white/20 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          initial={animate ? { width: 0 } : { width: `${percentage}%` }}
          animate={{ width: `${displayPercentage}%` }}
          transition={{ duration: animate ? 1.5 : 0, ease: "easeOut" }}
          className={`${sizeClasses[size]} ${colorClasses[color]} rounded-full shadow-sm`}
        />
      </div>
    </div>
  );
}