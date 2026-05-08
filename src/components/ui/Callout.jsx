import React from 'react';
import { X, Info, CheckCircle2, AlertTriangle, AlertCircle, AlertOctagon } from 'lucide-react';
import Button from './Button';

/**
 * Callout Component
 * A highly visual and interactive message component for notifications, warnings, and information.
 */
const Callout = ({
  type = 'informative',
  title,
  description,
  icon,
  actionText,
  onAction,
  onClose,
  colors,
  children,
  className = ''
}) => {
  // Ultra-defensive check
  if (!colors || !colors.semantic || !colors.neutral) {
    return (
      <div className={`p-4 rounded-lg bg-semantic-info-extraLight text-neutral-7${className}`}>
        {title && <div className="font-bold">{title}</div>}
        {description || children}
      </div>
    );
  }

  // Configuration for different types according to design specs
  const typeConfigs = {
    informative: {
      bg: colors.semantic.info?.extraLight || '#DFF8FF',
      stroke: colors.semantic.info?.base || '#489EEA',
      ellipseBg: colors.semantic.info?.light || '#B3E6F5',
      iconColor: colors.neutral[7] || '#0F1113',
      defaultIcon: <Info />
    },
    successful: {
      bg: colors.semantic.success?.extraLight || '#EBFFE6',
      stroke: colors.semantic.success?.base || '#3FCC33',
      ellipseBg: colors.semantic.success?.light || '#B8EBAD',
      iconColor: colors.neutral[7] || '#0F1113',
      defaultIcon: <CheckCircle2 />
    },
    caution: {
      bg: colors.semantic.warning?.extraLight || '#FFFAEB',
      stroke: colors.semantic.warning?.base || '#FFD352',
      ellipseBg: colors.semantic.warning?.base || '#FFD352',
      iconColor: colors.neutral[7] || '#0F1113',
      defaultIcon: <AlertTriangle />
    },
    warning: {
      bg: colors.semantic.error?.extraLight || '#FEE4E2',
      stroke: colors.semantic.error?.base || '#E00120',
      ellipseBg: colors.semantic.error?.light || '#FFACB7',
      iconColor: colors.neutral[7] || '#0F1113',
      defaultIcon: <AlertCircle />
    },
    neutral: {
      bg: colors.neutral[0] || '#FFFFFF',
      stroke: colors.neutral[2] || '#DEE1E8',
      ellipseBg: colors.neutral[1] || '#F7F8FA',
      iconColor: colors.primary?.base || '#008BC9',
      defaultIcon: <AlertOctagon />
    }
  };

  const config = typeConfigs[type] || typeConfigs.informative;

  return (
    <div
      className={`relative flex items-start p-[16px] rounded-[8px] border transition-all ${className}`}
      style={{
        backgroundColor: config.bg,
        borderColor: config.stroke
      }}
    >
      {/* Icon Ellipse - 36px x 36px - Aligned to top */}
      <div
        className="w-[36px] h-[36px] rounded-full shrink-0 flex items-center justify-center mt-[-2px]"
        style={{ backgroundColor: config.ellipseBg }}
      >
        {React.isValidElement(icon || config.defaultIcon) ? (
          React.cloneElement(icon || config.defaultIcon, {
            size: 20,
            color: config.iconColor
          })
        ) : null}
      </div>

      {/* Content Area - 16px gap to the right - Aligned to top */}
      <div className="ml-[16px] flex-1 flex flex-col pt-[4px]">
        <div className="flex flex-col gap-[4px]">
          {title && (
            <h6 className="text-[18px] font-semibold text-neutral-7 leading-tight mb-[4px]" style={{ color: colors.neutral[7] }}>
              {title}
            </h6>
          )}
          {description && (
            <p className="text-[14px] leading-relaxed" style={{ color: colors.neutral[7] }}>
              {description}
            </p>
          )}
          {children && (
            <div className="text-[14px] leading-relaxed" style={{ color: colors.neutral[7] }}>
              {children}
            </div>
          )}
        </div>

        {/* Action Button - Gap below text */}
        {actionText && (
          <div className="mt-[12px]">
            <Button
              variant="primary"
              appearance="link"
              size="xs"
              onClick={onAction}
              className="!px-0"
            >
              {actionText}
            </Button>
          </div>
        )}
      </div>

      {/* Close Button - Aligned to top */}
      {onClose && (
        <div className="ml-[16px] mt-[-4px]">
          <Button
            variant="tertiary"
            appearance="ghost"
            size="xs"
            tertiaryTone="low"
            iconOnly
            iconLeft={<X />}
            onClick={onClose}
          />
        </div>
      )}
    </div>
  );
};

export default Callout;
