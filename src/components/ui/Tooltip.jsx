import React, { useState } from 'react';

/**
 * Tooltip Component
 * A premium, design-system-driven tooltip for revealing additional context on hover.
 */
const Tooltip = ({ 
  content, 
  children, 
  position = 'top',
  className = '' 
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [timeoutId, setTimeoutId] = useState(null);

  const handleMouseEnter = () => {
    const id = setTimeout(() => {
      setIsVisible(true);
    }, 500);
    setTimeoutId(id);
  };

  const handleMouseLeave = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
      setTimeoutId(null);
    }
    setIsVisible(false);
  };

  const positionStyles = {
    top: 'bottom-full left-1/2 -translate-x-1/2 mb-[8px]',
    bottom: 'top-full left-1/2 -translate-x-1/2 mt-[8px]',
    left: 'right-full top-1/2 -translate-y-1/2 mr-[8px]',
    right: 'left-full top-1/2 -translate-y-1/2 ml-[8px]',
  };

  const arrowStyles = {
    top: 'top-full left-1/2 -translate-x-1/2 border-t-neutral-7 border-x-transparent border-b-transparent',
    bottom: 'bottom-full left-1/2 -translate-x-1/2 border-b-neutral-7 border-x-transparent border-t-transparent',
    left: 'left-full top-1/2 -translate-y-1/2 border-l-neutral-7 border-y-transparent border-r-transparent',
    right: 'right-full top-1/2 -translate-y-1/2 border-r-neutral-7 border-y-transparent border-l-transparent',
  };

  return (
    <div 
      className={`relative inline-block ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {children}
      
      {isVisible && content && (
        <div className={`
          absolute z-[100] px-[12px] py-[8px] 
          bg-[var(--neutral-7)] text-[var(--neutral-0)] text-[12px] font-medium
          rounded-[6px] shadow-lg whitespace-normal min-w-[200px] max-w-[300px]
          animate-fade-in pointer-events-none
          ${positionStyles[position]}
        `}>
          {content}
          
          {/* Arrow */}
          <div className={`
            absolute border-[6px]
            ${arrowStyles[position]}
          `} style={{ borderTopColor: position === 'top' ? '#1D2432' : 'transparent', borderBottomColor: position === 'bottom' ? '#1D2432' : 'transparent', borderLeftColor: position === 'left' ? '#1D2432' : 'transparent', borderRightColor: position === 'right' ? '#1D2432' : 'transparent' }} />
        </div>
      )}
    </div>
  );
};

export default Tooltip;
