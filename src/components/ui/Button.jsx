import React from 'react';

/**
 * Button Component
 * Flexible button component with multiple variants, appearances, and sizes.
 * Supports icon injection and loading states.
 */
const Button = ({
  children,
  variant = 'primary', // primary, secondary, tertiary
  appearance = 'solid', // solid, ghost, link
  size = 'md', // xs, sm, md, lg
  justify = 'center', // left, center, right
  iconLeft,
  iconRight,
  iconOnly = false,
  loading = false,
  disabled = false,
  type = 'button',
  onClick,
  className = '',
  tertiaryTone = 'high', // high, low
  selected = false,
  iconSize,
  showRing = false,
  ...props
}) => {
  // ══ VARIANT & APPEARANCE CONFIG ══════════════════════════════════════════
  const variantStyles = {
    primary: {
      solid: 'bg-[var(--primary-base)] text-white border-transparent hover:bg-[var(--primary-dark)] active:bg-[var(--primary-extra-dark)]',
      ghost: `bg-transparent text-[var(--primary-base)] border-transparent
              hover:bg-[var(--primary-light)] hover:text-[var(--primary-dark)]
              active:bg-[var(--primary-dark)] active:text-[var(--primary-extra-light)]`,
      link: `bg-transparent text-[var(--primary-base)] border-transparent
             hover:text-[var(--primary-dark)]
             active:text-[var(--primary-extra-dark)]`
    },
    secondary: {
      solid: `bg-[var(--primary-extra-light)] text-[#008BC9] border-[#008BC9] hover:bg-[var(--primary-light)] shadow-md ${showRing ? 'ring-2 ring-[#003A79]' : ''}`,
      ghost: `bg-transparent text-[var(--primary-base)] border-transparent
              hover:bg-[var(--primary-light)] hover:bg-opacity-[0.48]
              active:bg-[var(--primary-base)] active:text-[var(--primary-dark)]`,
      link: `bg-transparent text-[var(--primary-dark)] border-transparent
             hover:text-[var(--primary-base)]
             active:text-[var(--primary-extra-dark)]`
    },
    tertiary: {
      solid: `bg-[var(--neutral-0)] border-[var(--neutral-3)] border
              hover:bg-[var(--neutral-2)] hover:border-[var(--neutral-3)]
              active:bg-[var(--neutral-4)] active:border-[var(--neutral-5)]`,
      ghost: `bg-transparent border-transparent
              hover:bg-[var(--neutral-2)]
              active:bg-[var(--neutral-4)]`,
      link: `bg-transparent border-transparent
             hover:text-[var(--neutral-7)]
             active:text-[var(--neutral-4)]`
    }
  };

  const sizeStyles = {
    lg: {
      height: 'h-[48px]',
      padding: iconOnly ? 'px-0 w-[48px]' : 'px-[24px]',
      fontSize: 'text-[16px]',
      lineHeight: 'leading-[24px]',
      iconSize: 20,
      gap: 'gap-[10px]'
    },
    md: {
      height: 'h-[40px]',
      padding: iconOnly ? 'px-0 w-[40px]' : 'px-[16px]',
      fontSize: 'text-[14px]',
      lineHeight: 'leading-[20px]',
      iconSize: 20,
      gap: 'gap-[8px]'
    },
    sm: {
      height: 'h-[32px]',
      padding: iconOnly ? 'px-0 w-[32px]' : 'px-[12px]',
      fontSize: 'text-[14px]',
      lineHeight: 'leading-[20px]',
      iconSize: 20,
      gap: 'gap-[6px]'
    },
    xs: {
      height: 'h-[28px]',
      padding: iconOnly ? 'px-0 w-[28px]' : 'px-[8px]',
      fontSize: 'text-[14px]',
      lineHeight: 'leading-[18px]',
      iconSize: 20,
      gap: 'gap-[6px]'
    }
  };

  const getTertiaryLabelColor = () => {
    if (variant !== 'tertiary') return '';
    return tertiaryTone === 'high' ? 'text-[var(--neutral-7)]' : 'text-[var(--neutral-5)]';
  };

  const justifyStyles = {
    left: 'justify-start',
    center: 'justify-center',
    right: 'justify-end'
  };

  // ══ SELECTION & DISABLED LOGIC ═══════════════════════════════════════════
  const getAppearanceStyles = () => {
    if (disabled || loading) {
      if (appearance === 'link') {
        return 'bg-transparent text-[var(--neutral-3)] border-transparent cursor-not-allowed pointer-events-none';
      }
      return 'bg-[var(--neutral-2)] text-[var(--neutral-3)] border-[var(--neutral-2)] cursor-not-allowed pointer-events-none';
    }
    return variantStyles[variant]?.[appearance] || variantStyles.primary.solid;
  };

  const activeAppearanceStyles = getAppearanceStyles();

  const selectionStyles = selected ? ({
    primary: '!bg-[var(--primary-light)] !text-[var(--primary-dark)]',
    secondary: `!bg-[var(--primary-base)] !text-[var(--primary-dark)] ${showRing ? 'ring-2 ring-[#003A79] ring-offset-1' : ''}`,
    tertiary: '!bg-[var(--neutral-2)] !text-[var(--neutral-7)]'
  }[variant] || '') : '';

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const activeIconSize = iconSize || currentSize.iconSize;
  const tertiaryLabelColor = getTertiaryLabelColor();
  const currentJustify = iconOnly ? 'justify-center' : (justifyStyles[justify] || justifyStyles.left);

  // ══ LOADING SPINNER ════════════════════════════════════════════════════
  const Spinner = () => (
    <svg
      className="animate-spin"
      width={activeIconSize}
      height={activeIconSize}
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
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        relative flex flex-row items-center font-semibold transition-all duration-120
        rounded-[4px] cursor-pointer outline-none shrink-0 overflow-hidden
        focus-visible:ring-2 focus-visible:ring-[var(--primary-dark)] focus-visible:ring-offset-2
        active:scale-[0.97]
        ${currentJustify}
        ${activeAppearanceStyles}
        ${selectionStyles}
        ${appearance === 'solid' ? 'uppercase' : ''}
        ${currentSize.height}
        ${currentSize.padding}
        ${currentSize.fontSize}
        ${currentSize.lineHeight}
        ${currentSize.gap}
        ${tertiaryLabelColor}
        ${className}
      `}
      {...props}
    >
      {loading ? (
        <Spinner />
      ) : (
        <>
          {iconLeft && !iconOnly && (
            <span className="shrink-0 flex items-center justify-center">
              {React.cloneElement(iconLeft, { size: activeIconSize, stroke: 'currentColor' })}
            </span>
          )}

          {iconOnly ? (
            <span className="shrink-0 flex items-center justify-center">
              {React.isValidElement(iconLeft || iconRight || children) 
                ? React.cloneElement(iconLeft || iconRight || children, { size: activeIconSize, stroke: 'currentColor' })
                : (iconLeft || iconRight || children)}
            </span>
          ) : (
            <span className="truncate">{children}</span>
          )}

          {iconRight && !iconOnly && (
            <span className="shrink-0 flex items-center justify-center">
              {React.cloneElement(iconRight, { size: activeIconSize, stroke: 'currentColor' })}
            </span>
          )}
        </>
      )}
    </button>
  );
};

export default Button;
