import React from 'react';

/**
 * InteractiveChip Component
 * A pill-shaped interactive component for filters and selections.
 * 
 * @param {string} label - Text to display
 * @param {boolean} isActive - Whether the chip is in active state
 * @param {string} variant - 'light' | 'stroked' | 'dark' | 'none'
 * @param {string} size - 'sm' (22px) | 'md' (26px)
 * @param {React.ReactNode} iconLeft - Optional icon
 * @param {function} onClick - Click handler
 */
const InteractiveChip = ({
  label,
  isActive = false,
  variant = 'stroked',
  size = 'md',
  iconLeft,
  iconRight,
  onClick,
  className = '',
  ...props
}) => {
  
  // ══ SIZE CONFIGURATION ══════════════════════════════════════════════════
  const sizeStyles = {
    sm: {
      height: 'h-[22px]',
      padding: 'px-[10px]',
      fontSize: 'text-[11px]',
      iconSize: 12,
      gap: 'gap-[4px]'
    },
    md: {
      height: 'h-[26px]',
      padding: 'px-[12px]',
      fontSize: 'text-[12px]',
      iconSize: 14,
      gap: 'gap-[6px]'
    }
  };

  // ══ VARIANT CONFIGURATION (INACTIVE STATE) ══════════════════════════════
  const inactiveStyles = {
    light: 'bg-neutral-1 border-transparent text-neutral-7 hover:bg-neutral-2',
    stroked: 'bg-neutral-0 border-neutral-3 text-neutral-7 hover:bg-neutral-1',
    dark: 'bg-neutral-2 border-transparent text-neutral-7 hover:bg-neutral-3',
    none: 'bg-transparent border-transparent text-neutral-7 hover:bg-neutral-1'
  };

  // ══ ACTIVE STATE ════════════════════════════════════════════════════════
  // Use CSS variables for design system consistency
  const activeStyle = 'bg-[var(--primary-dark)] border-[var(--primary-dark)] text-[var(--neutral-0)] shadow-sm';

  const currentSize = sizeStyles[size] || sizeStyles.md;
  const currentVariant = isActive ? activeStyle : (inactiveStyles[variant] || inactiveStyles.stroked);

  return (
    <button
      onClick={onClick}
      className={`
        inline-flex items-center justify-center border cursor-pointer
        rounded-full font-bold transition-all duration-200 whitespace-nowrap
        active:scale-[0.96] outline-none select-none
        ${currentSize.height}
        ${currentSize.padding}
        ${currentSize.fontSize}
        ${currentSize.gap}
        ${currentVariant}
        ${className}
      `}
      {...props}
    >
      {iconLeft && (
        <span className="flex items-center justify-center shrink-0">
          {React.cloneElement(iconLeft, { 
            size: currentSize.iconSize, 
            strokeWidth: isActive ? 3 : 2.5,
            color: 'currentColor'
          })}
        </span>
      )}
      <span>{label}</span>
      {iconRight && (
        <span className="flex items-center justify-center shrink-0">
          {React.cloneElement(iconRight, { 
            size: currentSize.iconSize, 
            strokeWidth: isActive ? 3 : 2.5,
            color: 'currentColor'
          })}
        </span>
      )}
    </button>
  );
};

export default InteractiveChip;
