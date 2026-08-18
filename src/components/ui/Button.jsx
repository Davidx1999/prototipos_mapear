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
  uppercase,
  ...props
}) => {
  // ══ VARIANT & APPEARANCE CONFIG ══════════════════════════════════════════
  const variantStyles = {
    primary: {
      solid: `bg-[var(--color-button-solid-primary-color-primary-bg)] hover:bg-[var(--color-button-solid-primary-color-primary-bg-hover)] active:bg-[var(--color-button-solid-primary-color-primary-bg-pressed)]
              text-[var(--color-button-solid-primary-color-primary-text-button)] hover:text-[var(--color-button-solid-primary-color-primary-text-hover)] active:text-[var(--color-button-solid-primary-color-primary-text-pressed)]
              border-transparent`,
      ghost: `bg-transparent hover:bg-[var(--color-button-ghost-primary-color-primary-bg-hover)] active:bg-[var(--color-button-ghost-primary-color-primary-bg-pressed)]
              text-[var(--color-button-ghost-primary-color-primary-text-button)] hover:text-[var(--color-button-ghost-primary-color-primary-text-hover)] active:text-[var(--color-button-ghost-primary-color-primary-text-pressed)]
              border-transparent`,
      link: `bg-transparent text-[var(--color-button-ghost-primary-color-primary-text-button)] hover:text-[var(--color-button-ghost-primary-color-primary-text-hover)] active:text-[var(--color-button-ghost-primary-color-primary-text-pressed)] border-transparent`
    },
    secondary: {
      solid: `bg-[var(--color-button-solid-secondary-color-secondary-bg)] hover:bg-[var(--color-button-solid-secondary-color-secondary-bg-hover)] active:bg-[var(--color-button-solid-secondary-color-secondary-bg-pressed)]
              text-[var(--color-button-solid-secondary-color-secondary-text-button)] hover:text-[var(--color-button-solid-secondary-color-secondary-text-hover)] active:text-[var(--color-button-solid-secondary-color-secondary-text-pressed)]
              border-transparent ${showRing ? 'ring-2 ring-[var(--color-button-solid-primary-color-primary-bg)]' : ''}`,
      ghost: `bg-transparent hover:bg-[var(--color-button-ghost-secondary-color-secondary-bg-hover)] active:bg-[var(--color-button-ghost-secondary-color-secondary-bg-pressed)]
              text-[var(--color-button-ghost-secondary-color-secondary-text-button)] hover:text-[var(--color-button-ghost-secondary-color-secondary-text-hover)] active:text-[var(--color-button-ghost-secondary-color-secondary-text-pressed)]
              border-transparent`,
      link: `bg-transparent text-[var(--color-button-ghost-secondary-color-secondary-text-button)] hover:text-[var(--color-button-ghost-secondary-color-secondary-text-hover)] active:text-[var(--color-button-ghost-secondary-color-secondary-text-pressed)] border-transparent`
    },
    tertiary: {
      solid: `bg-[var(--color-button-solid-tertiary-color-neutral-bg)] hover:bg-[var(--color-button-solid-tertiary-color-neutral-bg-hover)] active:bg-[var(--color-button-solid-tertiary-color-neutral-bg-pressed)]
              text-[var(--color-button-solid-tertiary-color-neutral-text-button)] hover:text-[var(--color-button-solid-tertiary-color-neutral-text-hover)] active:text-[var(--color-button-solid-tertiary-color-neutral-text-pressed)]
              border-[var(--color-button-solid-tertiary-color-neutral-stk)] hover:border-[var(--color-button-solid-tertiary-color-neutral-stk-hover)] active:border-[var(--color-button-solid-tertiary-color-neutral-stk-pressed)] border`,
      ghost: `bg-transparent hover:bg-[var(--color-button-ghost-tertiary-color-neutral-bg-hover)] active:bg-[var(--color-button-ghost-tertiary-color-neutral-bg-pressed)]
              text-[var(--color-button-ghost-tertiary-color-neutral-text-button)] hover:text-[var(--color-button-ghost-tertiary-color-neutral-text-hover)] active:text-[var(--color-button-ghost-tertiary-color-neutral-text-pressed)]
              border-transparent`,
      link: `bg-transparent text-[var(--color-button-ghost-tertiary-color-neutral-text-button)] hover:text-[var(--color-button-ghost-tertiary-color-neutral-text-hover)] active:text-[var(--color-button-ghost-tertiary-color-neutral-text-pressed)] border-transparent`
    },
    'tertiary-2': {
      ghost: `bg-transparent hover:bg-[var(--color-button-ghost-tertiary-2-color-neutral-bg-hover)] active:bg-[var(--color-button-ghost-tertiary-2-color-neutral-bg-pressed)]
              text-[var(--color-button-ghost-tertiary-2-color-neutral-text-button)] hover:text-[var(--color-button-ghost-tertiary-2-color-neutral-text-hover)] active:text-[var(--color-button-ghost-tertiary-2-color-neutral-text-pressed)]
              border-transparent`,
      link: `bg-transparent text-[var(--color-button-ghost-tertiary-2-color-neutral-text-button)] hover:text-[var(--color-button-ghost-tertiary-2-color-neutral-text-hover)] active:text-[var(--color-button-ghost-tertiary-2-color-neutral-text-pressed)] border-transparent`
    },
    destructive: {
      solid: `bg-[var(--color-button-solid-destructive-primary-color-destructive-bg)] hover:bg-[var(--color-button-solid-destructive-primary-color-destructive-bg-hover)] active:bg-[var(--color-button-solid-destructive-primary-color-destructive-bg-pressed)]
              text-[var(--color-button-solid-destructive-primary-color-destructive-text-button)] hover:text-[var(--color-button-solid-destructive-primary-color-destructive-text-hover)] active:text-[var(--color-button-solid-destructive-primary-color-destructive-text-pressed)]
              border-transparent`,
      ghost: `bg-transparent hover:bg-[var(--color-button-ghost-destructive-primary-color-destructive-bg-hover)] active:bg-[var(--color-button-ghost-destructive-primary-color-destructive-bg-pressed)]
              text-[var(--color-button-ghost-destructive-primary-color-destructive-text-button)] hover:text-[var(--color-button-ghost-destructive-primary-color-destructive-text-hover)] active:text-[var(--color-button-ghost-destructive-primary-color-destructive-text-pressed)]
              border-transparent`,
      link: `bg-transparent text-[var(--color-button-ghost-destructive-primary-color-destructive-text-button)] hover:text-[var(--color-button-ghost-destructive-primary-color-destructive-text-hover)] active:text-[var(--color-button-ghost-destructive-primary-color-destructive-text-pressed)] border-transparent`
    },
    'destructive-secondary': {
      solid: `bg-[var(--color-button-solid-destructive-secondary-color-dest-secondary-bg)] hover:bg-[var(--color-button-solid-destructive-secondary-color-dest-secondary-bg-hover)] active:bg-[var(--color-button-solid-destructive-secondary-color-dest-secondary-bg-pressed)]
              text-[var(--color-button-solid-destructive-secondary-color-dest-secondary-text-button)] hover:text-[var(--color-button-solid-destructive-secondary-color-dest-secondary-text-hover)] active:text-[var(--color-button-solid-destructive-secondary-color-dest-secondary-text-pressed)]
              border-transparent`,
      ghost: `bg-transparent hover:bg-[var(--color-button-ghost-destructive-secondary-color-dest-secondary-bg-hover)] active:bg-[var(--color-button-ghost-destructive-secondary-color-dest-secondary-bg-pressed)]
              text-[var(--color-button-ghost-destructive-secondary-color-dest-secondary-text-button)] hover:text-[var(--color-button-ghost-destructive-secondary-color-dest-secondary-text-hover)] active:text-[var(--color-button-ghost-destructive-secondary-color-dest-secondary-text-pressed)]
              border-transparent`,
      link: `bg-transparent text-[var(--color-button-ghost-destructive-secondary-color-dest-secondary-text-button)] hover:text-[var(--color-button-ghost-destructive-secondary-color-dest-secondary-text-hover)] active:text-[var(--color-button-ghost-destructive-secondary-color-dest-secondary-text-pressed)] border-transparent`
    }
  };

  const sizeStyles = {
    lg: {
      height: '',
      padding: iconOnly ? 'p-3.5' : 'px-6 py-3',
      fontSize: 'text-[16px]',
      lineHeight: 'leading-[24px]',
      iconSize: 20,
      gap: 'gap-[10px]'
    },
    md: {
      height: '',
      padding: iconOnly ? 'p-2.5' : 'px-[16px] py-[8px]',
      fontSize: 'text-[14px]',
      lineHeight: 'leading-[20px]',
      iconSize: 20,
      gap: 'gap-[8px]'
    },
    sm: {
      height: '',
      padding: iconOnly ? 'p-2' : 'px-[16px] py-[8px]',
      fontSize: 'text-[14px]',
      lineHeight: 'leading-[20px]',
      iconSize: 18,
      gap: 'gap-[6px]'
    },
    xs: {
      height: '',
      padding: iconOnly ? 'p-1.5' : 'px-[16px] py-[6px]',
      fontSize: 'text-[13px]',
      lineHeight: 'leading-[18px]',
      iconSize: 14,
      gap: 'gap-[6px]'
    }
  };

  const getTertiaryLabelColor = () => {
    if (variant !== 'tertiary') return '';
    return tertiaryTone === 'high' ? 'text-[var(--color-neutral-7)]' : 'text-[var(--color-neutral-5)]';
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
        return 'bg-transparent text-[var(--color-button-solid-disabled-color-disabled-text-button)] border-transparent cursor-not-allowed pointer-events-none';
      }
      if (appearance === 'ghost') {
        return 'bg-transparent text-[var(--color-button-solid-disabled-color-disabled-text-button)] border-transparent cursor-not-allowed pointer-events-none';
      }
      return 'bg-[var(--color-button-solid-disabled-color-disabled-bg)] text-[var(--color-button-solid-disabled-color-disabled-text-button)] border-[var(--color-button-solid-disabled-color-disabled-bg)] cursor-not-allowed pointer-events-none';
    }
    return variantStyles[variant]?.[appearance] || variantStyles.primary.solid;
  };

  const activeAppearanceStyles = getAppearanceStyles();

  const selectionStyles = selected ? ({
    primary: '!bg-[var(--color-brand-300)] !text-[var(--color-brand-700)]',
    secondary: `!bg-[var(--color-brand-500)] !text-[var(--color-brand-700)] ${showRing ? 'ring-2 ring-[#003A79] ring-offset-1' : ''}`,
    tertiary: '!bg-[var(--color-neutral-2)] !text-[var(--color-neutral-7)] !border-transparent'
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
        focus-visible:ring-2 focus-visible:ring-[var(--color-brand-700)] focus-visible:ring-offset-2
        active:scale-[0.97]
        ${currentJustify}
        ${activeAppearanceStyles}
        ${selectionStyles}
        ${uppercase === true || (uppercase === undefined && appearance === 'solid') ? 'uppercase' : ''}
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
