import React from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';

/**
 * SplitButton Component
 * Supports primary, secondary, and tertiary variants.
 * Features Material Design 3 inspired rounding logic for the open state.
 */
const SplitButton = ({
  label,
  onClick,
  onChevronClick,
  isOpen = false,
  disabled = false,
  icon,
  activeIcon,
  variant = 'primary', // primary, secondary, tertiary
  size = 'md',
  className = '',
  rounded = '4px',
  isActive = false,
  showRing = true
}) => {
  // Styles based on variant
  const getStyles = () => {
    if (disabled) return 'bg-neutral-200 text-neutral-400 border-neutral-200 cursor-not-allowed';

    // Active/Selected state (Secondary)
    if (isActive) {
      return `bg-[var(--primary-extra-light)] text-[#008BC9] border border-[#008BC9] hover:bg-[var(--primary-light)] shadow-md ${showRing ? 'ring-2 ring-[#003A79]' : ''}`;
    }

    if (variant === 'tertiary') {
      return 'bg-white text-gray-700 border border-[var(--neutral-3)] hover:bg-[var(--neutral-2)] shadow-sm';
    }

    // Default Primary
    const baseBg = isOpen ? 'bg-[#003A79]' : 'bg-[#008BC9]';
    return `${baseBg} text-white hover:bg-[#003A79] active:bg-[#002B5C] shadow-md`;
  };

  const currentStyles = getStyles();

  const sizeConfig = {
    xl: { height: 'h-[52px]', fontSize: 'text-[15px]', iconSize: 20, chevronWidth: 'w-[52px]' },
    lg: { height: 'h-[48px]', fontSize: 'text-[14px]', iconSize: 20, chevronWidth: 'w-[48px]' },
    md: { height: 'h-[44px]', fontSize: 'text-[14px]', iconSize: 20, chevronWidth: 'w-[44px]' } // Square chevron
  }[size] || sizeConfig.md;

  const leftRounded = rounded;
  // MD3 Logic: If open, the chevron part becomes a perfect ellipse (fully rounded)
  const rightRounded = isOpen ? '9999px' : rounded;
  const rightLeftRounded = isOpen ? '9999px' : '0px';

  return (
    <div className={`flex items-center gap-[1px] shrink-0 ${className}`}>
      {/* Main Action Part */}
      <button
        onClick={onClick}
        disabled={disabled}
        style={{ borderTopLeftRadius: leftRounded, borderBottomLeftRadius: leftRounded }}
        className={`
          relative flex-1 flex flex-row items-center justify-center font-bold transition-all duration-120
          cursor-pointer outline-none overflow-hidden
          active:scale-[0.98] uppercase
          ${sizeConfig.height} ${label ? 'px-[24px]' : 'w-[44px]'} ${sizeConfig.fontSize}
          ${currentStyles}
        `}
      >
        {label && <span className="truncate mr-[8px]">{label}</span>}
        <span className="shrink-0 flex items-center justify-center">
          {(isActive && activeIcon) ? activeIcon : icon}
        </span>
      </button>

      {/* Chevron Part */}
      <button
        onClick={onChevronClick}
        disabled={disabled}
        style={{
          borderTopRightRadius: rightRounded,
          borderBottomRightRadius: rightRounded,
          borderTopLeftRadius: rightLeftRounded,
          borderBottomLeftRadius: rightLeftRounded
        }}
        className={`
          relative flex items-center justify-center transition-all duration-120
          cursor-pointer outline-none shrink-0 overflow-hidden
          active:scale-[0.98]
          ${sizeConfig.height} ${sizeConfig.chevronWidth}
          ${currentStyles}
        `}
      >
        {isOpen ? <ChevronUp size={sizeConfig.iconSize} /> : <ChevronDown size={sizeConfig.iconSize} />}
      </button>
    </div>
  );
};

export default SplitButton;
