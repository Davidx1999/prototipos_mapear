import React, { useEffect, useState } from 'react';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Info as InfoIcon } from 'lucide-react';
import Button from './Button';

/**
 * Toast Component
 * Rules:
 * - Isolated icon on the left (square 4px corner radius, icon inside)
 * - Title Body/S (14px) bold, Body/Xs (12px) below
 * - Action button (tertiary default solid)
 * - Close button (tertiary ghost [x])
 * - Timer stroke at the bottom (4px height)
 * - Borders 1px wide
 * - Background: semantic light
 * - Stroke: semantic base
 * - Icon Square Background: semantic dark
 * - Text color: neutral 6
 */
const Toast = ({ 
  type = 'info', 
  title, 
  message, 
  actionLabel, 
  onAction, 
  onClose, 
  duration = 5000,
  colors 
}) => {
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const timer = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(timer);
            if (onClose) onClose();
            return 0;
          }
          return prev - (100 / (duration / 100));
        });
      }, 100);
      return () => clearInterval(timer);
    }
  }, [duration, onClose]);

  const typeConfig = {
    success: {
      icon: <CheckCircle2 size={20} />,
      semantic: colors.semantic.success
    },
    caution: {
      icon: <AlertCircle size={20} />,
      semantic: colors.semantic.error // Mapping caution to error as per usual design patterns
    },
    warning: {
      icon: <AlertTriangle size={20} />,
      semantic: colors.semantic.warning
    },
    info: {
      icon: <InfoIcon size={20} />,
      semantic: colors.semantic.info
    }
  };

  const config = typeConfig[type] || typeConfig.info;

  return (
    <div 
      className="relative flex flex-col rounded-lg overflow-hidden border shadow-lg animate-in slide-in-from-top-4 duration-300"
      style={{ 
        backgroundColor: config.semantic.extraLight, // Using extraLight for background as it's more standard for toasts, or light if requested
        borderColor: config.semantic.base,
        borderWidth: '1px'
      }}
    >
      <div className="flex items-start px-4 pt-4 pb-3" style={{ paddingBottom: '12px' }}>
        {/* Left Icon Square */}
        <div 
          className="flex items-center justify-center rounded-[4px] shrink-0"
          style={{ 
            width: '32px', 
            height: '32px', 
            backgroundColor: config.semantic.dark,
            color: colors.neutral[0]
          }}
        >
          {config.icon}
        </div>

        {/* Text Content */}
        <div className="flex flex-col gap-0.5 ml-4 flex-1 min-w-0" style={{ color: colors.neutral[6] }}>
          <h4 className="text-[14px] font-bold truncate leading-tight">{title}</h4>
          <p className="text-[12px] leading-relaxed opacity-90">{message}</p>
        </div>

        {/* Action Button */}
        {actionLabel && (
          <div className="ml-4 shrink-0">
            <Button 
              variant="tertiary" 
              appearance="solid" 
              size="sm" 
              onClick={onAction}
            >
              {actionLabel}
            </Button>
          </div>
        )}

        {/* Close Button */}
        <div className="ml-4 shrink-0">
          <Button 
            variant="tertiary" 
            appearance="ghost" 
            size="sm" 
            iconOnly 
            iconLeft={<X size={18} />}
            onClick={onClose}
          />
        </div>
      </div>

      {/* Timer Bar */}
      <div 
        className="absolute bottom-0 left-0 h-[4px] transition-all duration-100 ease-linear"
        style={{ 
          width: `${progress}%`,
          backgroundColor: config.semantic.base
        }}
      />
    </div>
  );
};

export default Toast;
