import React from 'react';

/**
 * Chips / Status Tag Component
 * 
 * @param {string} label - The text inside the chip
 * @param {string} variant - 'light' | 'dark' | 'stroked' | 'none'
 * @param {string} status - 'primary' | 'success' | 'warning' | 'error' | 'neutral' | 'graphPositive' | 'graphNeutral' | 'graphNegative'
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
      dark: 'bg-[#3FCC33] text-neutral-7 border-transparent',
      stroked: 'bg-transparent text-[#3FCC33] border-[#3FCC33]',
      none: 'bg-transparent text-[#3FCC33] border-transparent px-0'
    },
    warning: {
      light: 'bg-[#FEF0C7] text-neutral-7 border-transparent',
      dark: 'bg-[#DC9403] text-white border-transparent',
      stroked: 'bg-transparent text-[#DC9403] border-[#DC9403]',
      none: 'bg-transparent text-[#DC9403] border-transparent px-0'
    },
    error: {
      light: 'bg-[#FFACB7] text-neutral-7 border-transparent',
      dark: 'bg-[#E00120] text-white border-transparent',
      stroked: 'bg-transparent text-[#E00120] border-[#E00120]',
      none: 'bg-transparent text-[#E00120] border-transparent px-0'
    },
    neutral: {
      light: 'bg-[#DEE1E8] text-neutral-7 border-transparent',
      dark: 'bg-[#1D2432] text-white border-transparent',
      stroked: 'bg-[#FFFFFF] text-[#1D2432] border-[#1D2432] hover:bg-[#DEE1E8] shadow-none',
      none: 'bg-transparent text-[#677080] border-transparent px-0'
    },
    // Graph palette for Heatmap - Cores específicas solicitadas: #8CD47E, #F8D66D, #FF6961
    graphPositive: {
      light: 'bg-[#8CD47E] text-neutral-7 border-transparent',
      dark: 'bg-[#8CD47E] text-neutral-7 border-transparent',
      stroked: 'bg-transparent text-[#8CD47E] border-[#8CD47E]',
      none: 'bg-transparent text-[#8CD47E] border-transparent px-0'
    },
    graphNeutral: {
      light: 'bg-[#F8D66D] text-neutral-7 border-transparent',
      dark: 'bg-[#F8D66D] text-neutral-7 border-transparent',
      stroked: 'bg-transparent text-[#F8D66D] border-[#F8D66D]',
      none: 'bg-transparent text-[#F8D66D] border-transparent px-0'
    },
    graphNegative: {
      light: 'bg-[#FF6961] text-neutral-7 border-transparent',
      dark: 'bg-[#FF6961] text-neutral-7 border-transparent',
      stroked: 'bg-transparent text-[#FF6961] border-[#FF6961]',
      none: 'bg-transparent text-[#FF6961] border-transparent px-0'
    },
    lavender: {
      light: 'bg-[#D9BBFF] text-neutral-7 border-transparent',
      dark: 'bg-[#B070F0] text-white border-transparent',
      stroked: 'bg-transparent text-[#B070F0] border-[#B070F0]',
      none: 'bg-transparent text-[#B070F0] border-transparent px-0'
    },
    orange: {
      light: 'bg-[#FBBE77] text-neutral-7 border-transparent',
      dark: 'bg-[#E17A00] text-white border-transparent',
      stroked: 'bg-transparent text-[#E17A00] border-[#E17A00]',
      none: 'bg-transparent text-[#E17A00] border-transparent px-0'
    },
    oliva: {
      light: 'bg-[#ADCE6D] text-neutral-7 border-transparent',
      dark: 'bg-[#88A94A] text-white border-transparent',
      stroked: 'bg-transparent text-[#88A94A] border-[#88A94A]',
      none: 'bg-transparent text-[#88A94A] border-transparent px-0'
    },
    terracota: {
      light: 'bg-[#CFA88A] text-neutral-7 border-transparent',
      dark: 'bg-[#AC7F5E] text-white border-transparent',
      stroked: 'bg-transparent text-[#AC7F5E] border-[#AC7F5E]',
      none: 'bg-transparent text-[#AC7F5E] border-transparent px-0'
    },
    wine: {
      light: 'bg-[#CE7E8F] text-neutral-7 border-transparent',
      dark: 'bg-[#A41450] text-white border-transparent',
      stroked: 'bg-transparent text-[#A41450] border-[#A41450]',
      none: 'bg-transparent text-[#A41450] border-transparent px-0'
    },
    cherry: {
      light: 'bg-[#F5A3BC] text-neutral-7 border-transparent',
      dark: 'bg-[#D9265C] text-white border-transparent',
      stroked: 'bg-transparent text-[#D9265C] border-[#D9265C]',
      none: 'bg-transparent text-[#D9265C] border-transparent px-0'
    },
    clay: {
      light: 'bg-[#FAB49E] text-neutral-7 border-transparent',
      dark: 'bg-[#FF6333] text-white border-transparent',
      stroked: 'bg-transparent text-[#FF6333] border-[#FF6333]',
      none: 'bg-transparent text-[#FF6333] border-transparent px-0'
    },
    wheat: {
      light: 'bg-[#F7C8A1] text-neutral-7 border-transparent',
      dark: 'bg-[#F2890D] text-white border-transparent',
      stroked: 'bg-transparent text-[#F2890D] border-[#F2890D]',
      none: 'bg-transparent text-[#F2890D] border-transparent px-0'
    },
    aqua: {
      light: 'bg-[#7ED4CD] text-neutral-7 border-transparent',
      dark: 'bg-[#259E96] text-white border-transparent',
      stroked: 'bg-transparent text-[#259E96] border-[#259E96]',
      none: 'bg-transparent text-[#259E96] border-transparent px-0'
    },
    storm: {
      light: 'bg-[#9EC4FA] text-neutral-7 border-transparent',
      dark: 'bg-[#0D5BF2] text-white border-transparent',
      stroked: 'bg-transparent text-[#0D5BF2] border-[#0D5BF2]',
      none: 'bg-transparent text-[#0D5BF2] border-transparent px-0'
    },
    purple: {
      light: 'bg-[#C693C2] text-neutral-7 border-transparent',
      dark: 'bg-[#9F579E] text-white border-transparent',
      stroked: 'bg-transparent text-[#9F579E] border-[#9F579E]',
      none: 'bg-transparent text-[#9F579E] border-transparent px-0'
    },
    yellowAlt: {
      light: 'bg-[#FFE596] text-neutral-7 border-transparent',
      dark: '#FFD744 text-neutral-7 border-transparent',
      stroked: 'bg-transparent text-[#FFD744] border-[#FFD744]',
      none: 'bg-transparent text-[#FFD744] border-transparent px-0'
    },
    info: {
      light: 'bg-[#B3E6F5] text-neutral-7 border-transparent',
      dark: '#008BC9 text-white border-transparent',
      stroked: 'bg-transparent text-[#008BC9] border-[#008BC9]',
      none: 'bg-transparent text-[#008BC9] border-transparent px-0'
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
