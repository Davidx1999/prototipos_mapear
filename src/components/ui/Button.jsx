import React from 'react';

/**
 * Button Component
 * Scalable, design-system-driven component based on the Mapear Design System.
 */
const Button = ({
  variant = 'primary',
  appearance = 'solid',
  size = 'md',
  iconLeft,
  iconRight,
  iconOnly = false,
  loading = false,
  disabled = false,
  tertiaryTone = 'medium',
  justify = 'left',
  className = '',
  children,
  ...props
}) => {
  
  // ══ SIZE CONFIGURATION ══════════════════════════════════════════════════
  const sizeStyles = {
    lg: {
      height: 'h-[56px]',
      padding: iconOnly ? 'px-0 w-[56px]' : 'px-[24px]',
      fontSize: 'text-[16px]',
      lineHeight: 'leading-[24px]',
      iconSize: 18,
      gap: 'gap-[8px]'
    },
    md: {
      height: 'h-[40px]',
      padding: iconOnly ? 'px-0 w-[40px]' : 'px-[16px]',
      fontSize: 'text-[14px]',
      lineHeight: 'leading-[21px]',
      iconSize: 18,
      gap: 'gap-[8px]'
    },
    sm: {
      height: 'h-[36px]',
      padding: iconOnly ? 'px-0 w-[36px]' : 'px-[12px]',
      fontSize: 'text-[14px]',
      lineHeight: 'leading-[21px]',
      iconSize: 16,
      gap: 'gap-[8px]'
    },
    xs: {
      height: 'h-[28px]',
      padding: iconOnly ? 'px-0 w-[28px]' : 'px-[8px]',
      fontSize: 'text-[12px]',
      lineHeight: 'leading-[18px]',
      iconSize: 14,
      gap: 'gap-[6px]'
    }
  };

  // ══ VARIANT & APPEARANCE CONFIGURATION ══════════════════════════════════
  const variantStyles = {
    primary: {
      solid: `bg-[var(--primary-base)] text-[var(--neutral-0)] border-transparent 
              hover:bg-[var(--primary-dark)] 
              active:bg-[var(--primary-extra-dark)]`,
      ghost: `bg-transparent text-[var(--primary-base)] border-transparent
              hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]
              active:bg-[var(--primary-dark)] active:text-[var(--primary-extra-light)]`
    },
    secondary: {
      solid: `bg-[var(--primary-extra-light)] text-[var(--primary-dark)] border-transparent
              hover:bg-[var(--primary-light)]
              active:bg-[var(--primary-base)]`,
      ghost: `bg-transparent text-[var(--primary-extra-dark)] border-transparent
              hover:bg-[var(--primary-light)] hover:bg-opacity-[0.48]
              active:bg-[var(--primary-base)] active:text-[var(--primary-dark)]`
    },
    tertiary: {
      solid: `bg-[var(--neutral-0)] border-[var(--neutral-3)] border
              hover:bg-[var(--neutral-2)] hover:border-[var(--neutral-3)]
              active:bg-[var(--neutral-4)] active:border-[var(--neutral-5)]`,
      ghost: `bg-transparent border-transparent
              hover:bg-[var(--neutral-2)]
              active:bg-[var(--neutral-4)]`
    }
  };

  // ══ TERTIARY LABEL RULE ════════════════════════════════════════════════
  const getTertiaryLabelColor = () => {
    if (variant !== 'tertiary') return '';
    return tertiaryTone === 'high' ? 'text-[var(--neutral-6)]' : 'text-[var(--neutral-5)]';
  };

  const justifyStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const currentVariant = variantStyles[variant]?.[appearance] || variantStyles.primary.solid;
  const tertiaryLabelColor = getTertiaryLabelColor();
  const currentJustify = iconOnly ? 'justify-center' : (justifyStyles[justify] || justifyStyles.left);

  // ══ LOADING SPINNER ════════════════════════════════════════════════════
  const Spinner = () => (
    <svg 
      className="animate-spin" 
      width={currentSize.iconSize} 
      height={currentSize.iconSize} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2.5" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M21 12a9 9 0 1 1-6.219-8.56" />
    </svg>
  );

  return (
    <button
      className={`
        relative flex items-center font-semibold transition-all duration-120
        rounded-[4px] cursor-pointer outline-none shrink-0 overflow-hidden
        focus-visible:ring-2 focus-visible:ring-[var(--primary-dark)] focus-visible:ring-offset-2
        active:scale-[0.97]
        disabled:bg-[var(--neutral-2)] disabled:text-[var(--neutral-3)] 
        disabled:cursor-not-allowed disabled:pointer-events-none disabled:scale-100
        ${currentJustify}
        ${currentVariant}
        ${currentSize.height}
        ${currentSize.padding}
        ${currentSize.fontSize}
        ${currentSize.lineHeight}
        ${currentSize.gap}
        ${tertiaryLabelColor}
        ${className}
      `}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {iconLeft && !iconOnly && (
            <span className="flex items-center justify-center transition-colors shrink-0">
              {React.cloneElement(iconLeft, { size: currentSize.iconSize, stroke: 'currentColor' })}
            </span>
          )}
          
          {iconOnly ? (
            <span className="flex items-center justify-center transition-colors">
              {React.cloneElement(iconLeft || iconRight || children, { size: currentSize.iconSize, stroke: 'currentColor' })}
            </span>
          ) : (
            <span className="truncate">{children}</span>
          )}

          {iconRight && !iconOnly && (
            <span className="flex items-center justify-center transition-colors shrink-0">
              {React.cloneElement(iconRight, { size: currentSize.iconSize, stroke: 'currentColor' })}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
