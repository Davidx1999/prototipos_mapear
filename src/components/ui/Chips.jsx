import React from 'react';

/**
 * Chips / Status Tag Component
 * 
 * @param {string} label - The text inside the chip
 * @param {string} variant - 'light' | 'dark' | 'stroked' | 'none'
 * @param {string} status - 'primary' | 'success' | 'warning' | 'error' | 'neutral'
 * @param {React.ReactNode} iconLeft - Optional icon at the beginning
 * @param {string} className - Additional CSS classes
 */
const Chips = ({
  label,
  variant = 'light',
  status = 'primary',
  iconLeft,
  className = '',
  ...props
}) => {

  // Style mappings based on design system tokens
  const styles = {
    primary: {
      light: 'bg-[#B3E6F5] text-neutral-7 border-transparent',
      dark: 'bg-[#008BC9] text-white border-transparent',
      stroked: 'bg-transparent text-[#008BC9] border-[#008BC9]',
      none: 'bg-transparent text-[#008BC9] border-transparent px-0'
    },
    success: {
      light: 'bg-[#B8EBAD] text-neutral-7 border-transparent',
      dark: 'bg-[#0D9488] text-white border-transparent',
      stroked: 'bg-transparent text-[#0D9488] border-[#0D9488]',
      none: 'bg-transparent text-[#0D9488] border-transparent px-0'
    },
    warning: {
      light: 'bg-[#FEF0C7] text-neutral-7 border-transparent',
      dark: 'bg-[#D97706] text-white border-transparent',
      stroked: 'bg-transparent text-[#D97706] border-[#D97706]',
      none: 'bg-transparent text-[#D97706] border-transparent px-0'
    },
    error: {
      light: 'bg-[#FFACB7] text-neutral-7 border-transparent',
      dark: 'bg-[#DC2626] text-white border-transparent',
      stroked: 'bg-transparent text-[#DC2626] border-[#DC2626]',
      none: 'bg-transparent text-[#DC2626] border-transparent px-0'
    },
    neutral: {
      light: 'bg-[#DEE1E8] text-neutral-7 border-transparent',
      dark: 'bg-[#1D2432] text-white border-transparent',
      stroked: 'bg-transparent text-[#677080] border-[#DEE1E8]',
      none: 'bg-transparent text-[#677080] border-transparent px-0'
    }
  };

  const currentStyle = styles[status]?.[variant] || styles.primary.light;

  return (
    <div
      className={`
        inline-flex items-center justify-center gap-[6px] 
        px-[10px] py-[4px] rounded-[999px] border
        text-[11px] md:text-[12px] font-semibold tracking-wider
        transition-all duration-200 whitespace-nowrap
        ${currentStyle}
        ${className}
      `}
      {...props}
    >
      {iconLeft && (
        <span className="flex items-center justify-center">
          {React.cloneElement(iconLeft, { size: 12, strokeWidth: 2.5 })}
        </span>
      )}
      <span>{label}</span>
    </div>
  );
};

export default Chips;
