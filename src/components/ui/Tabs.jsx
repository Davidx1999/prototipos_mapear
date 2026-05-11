import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react';

/**
 * Tabs Component
 * Optimized for high-fidelity SaaS interfaces.
 * Supports a mobile-specific dropdown variant and an outlined line style.
 */
const Tabs = ({
  tabs = [], // Array of strings or objects { id, label, icon }
  activeTab,
  onChange,
  variant = 'line', // 'line' | 'pill'
  mobileVariant = 'buttons', // 'scroll' | 'dropdown' | 'buttons' | 'auto'
  size = 'md', // 'sm' | 'md'
  fullWidth = false,
  hideArrows = false,
  className = '',
  colors
}) => {
  const [hoveredId, setHoveredId] = useState(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 619);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const isLine = variant === 'line';
  const effectiveMobileVariant = isMobile ? mobileVariant : 'scroll';

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(Math.ceil(scrollLeft + clientWidth) < scrollWidth - 2);
    }
  };

  useEffect(() => {
    checkScroll();
    window.addEventListener('resize', checkScroll);
    return () => window.removeEventListener('resize', checkScroll);
  }, [tabs, activeTab]);

  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === 'right' ? 250 : -250,
        behavior: 'smooth'
      });
    }
  };

  const baseStyles = `relative flex items-center justify-center transition-all duration-200 cursor-pointer whitespace-nowrap select-none ${fullWidth ? 'flex-1' : 'shrink-0'}`;

  const sizeStyles = {
    sm: "px-[12px] py-[8px] text-[14px] gap-[8px]",
    md: "px-[20px] py-[16px] text-[14px] gap-[10px]"
  };

  const containerStyles = isLine
    ? "flex items-center border-b w-full relative"
    : "flex items-center gap-[4px] p-[4px] bg-neutral-1 rounded-[4px] relative";

  if (effectiveMobileVariant === 'dropdown') {
    const activeTabObj = tabs.find((t, idx) => {
      const id = typeof t === 'object' ? (t.id !== undefined ? t.id : idx) : idx;
      return id === activeTab;
    });
    const activeLabel = typeof activeTabObj === 'object' ? activeTabObj.label : activeTabObj;
    const activeIcon = typeof activeTabObj === 'object' ? activeTabObj.icon : null;

    return (
      <div className={`relative w-full ${className}`}>
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border rounded-xl shadow-sm text-sm font-medium text-slate-800 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/20"
          style={{ borderColor: colors?.neutral?.[2] || '#DEE1E8' }}
        >
          <div className="flex items-center gap-3">
            {activeIcon && React.cloneElement(activeIcon, {
              size: 18,
              style: { color: colors?.primary?.base || '#008BC9' }
            })}
            <span>{activeLabel}</span>
          </div>
          <ChevronDown size={18} className={`text-slate-400 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
        </button>

        {isDropdownOpen && (
          <div
            className="absolute top-[calc(100%+8px)] left-0 w-full bg-white border rounded-xl shadow-xl z-50 overflow-hidden flex flex-col"
            style={{ borderColor: colors?.neutral?.[2] || '#DEE1E8' }}
          >
            <div className="max-h-[260px] overflow-y-auto hide-scrollbar">
              {tabs.map((tab, idx) => {
                const label = typeof tab === 'object' ? tab.label : tab;
                const icon = typeof tab === 'object' ? tab.icon : null;
                const id = typeof tab === 'object' ? (tab.id !== undefined ? tab.id : idx) : idx;
                const isActive = activeTab === id;

                return (
                  <button
                    key={id}
                    onClick={() => {
                      if (onChange) onChange(id);
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-sm transition-colors text-left border-b border-slate-50 last:border-0
                      ${isActive ? 'bg-slate-50 font-medium' : 'hover:bg-slate-50 text-slate-600'}`}
                    style={isActive ? { color: colors?.primary?.base || '#008BC9' } : {}}
                  >
                    {icon && React.cloneElement(icon, {
                      size: 18,
                      className: isActive ? '' : 'text-slate-400',
                      style: isActive ? { color: colors?.primary?.base || '#008BC9' } : {}
                    })}
                    <span>{label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (effectiveMobileVariant === 'buttons') {
    return (
      <div className={`flex items-center overflow-x-auto hide-scrollbar gap-[8px] pb-[4px] ${className}`}>
        {tabs.map((tab, idx) => {
          const label = typeof tab === 'object' ? tab.label : tab;
          const icon = typeof tab === 'object' ? tab.icon : null;
          const id = typeof tab === 'object' ? (tab.id !== undefined ? tab.id : idx) : idx;
          const isActive = activeTab === id;

          return (
            <button
              key={id}
              onClick={() => onChange && onChange(id)}
              className={`px-[16px] py-[10px] rounded-[8px] border text-[14px] whitespace-nowrap transition-all flex items-center justify-center gap-[8px] shrink-0 basis-[42%] ${isActive
                  ? 'font-bold shadow-sm'
                  : 'font-medium'
                }`}
              style={{
                backgroundColor: isActive ? '#EFF6FF' : (colors?.neutral?.[0] || '#FFFFFF'),
                borderColor: isActive ? (colors?.primary?.base || '#008BC9') : (colors?.neutral?.[2] || '#DEE1E8'),
                color: isActive ? (colors?.primary?.base || '#008BC9') : (colors?.neutral?.[6] || '#1D2432')
              }}
            >
              {icon && React.cloneElement(icon, { size: 16 })}
              <span>{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div
      className={`${containerStyles} ${className}`}
      style={isLine ? { borderColor: colors?.neutral?.[2] || '#DEE1E8' } : { backgroundColor: colors?.neutral?.[1] || '#F7F8FA' }}
    >
      {/* Scroll Controls (Left) */}
      {canScrollLeft && !hideArrows && (
        <div
          className="absolute left-0 w-[48px] h-full flex items-center justify-start z-20 pointer-events-none"
          style={{ background: `linear-gradient(to right, ${colors?.neutral?.[0] || '#FFFFFF'} 40%, transparent)` }}
        >
          <button
            onClick={() => scroll('left')}
            className="pointer-events-auto ml-[4px] p-[4px] rounded-full bg-white border shadow-sm hover:text-primary-base transition-colors text-slate-600 hover:text-blue-600"
            style={{ borderColor: colors?.neutral?.[2] || '#DEE1E8' }}
          >
            <ChevronLeft size={16} />
          </button>
        </div>
      )}

      <div
        ref={scrollRef}
        onScroll={checkScroll}
        className="flex-1 flex items-center overflow-x-auto hide-scrollbar scroll-smooth"
      >
        {tabs.map((tab, idx) => {
          const label = typeof tab === 'object' ? tab.label : tab;
          const icon = typeof tab === 'object' ? tab.icon : null;
          const id = typeof tab === 'object' ? (tab.id !== undefined ? tab.id : idx) : idx;
          const isActive = activeTab === id;
          const isHovered = hoveredId === id;

          let stateStyles = "";
          let textColor = {};
          let bgStyle = {};

          if (isLine) {
            stateStyles = `${isActive ? 'font-bold' : 'font-medium'}`;
            bgStyle = { backgroundColor: !isActive && isHovered ? (colors?.neutral?.[1] || '#F7F8FA') : 'transparent' };
            textColor = { color: isActive ? (colors?.primary?.base || '#008BC9') : (colors?.neutral?.[6] || '#1D2432') };
          } else {
            stateStyles = `rounded-[8px] ${isActive ? 'bg-white shadow-sm font-medium' : 'font-medium'}`;
            bgStyle = !isActive && isHovered ? { backgroundColor: colors?.neutral?.[2] || '#DEE1E8' } : {};
            textColor = { color: isActive ? (colors?.primary?.base || '#008BC9') : (colors?.neutral?.[6] || '#1D2432') };
          }

          return (
            <div
              key={id}
              onMouseEnter={() => setHoveredId(id)}
              onMouseLeave={() => setHoveredId(null)}
              onClick={() => onChange && onChange(id)}
              className={`${baseStyles} ${sizeStyles[size]} ${stateStyles} ${isLine ? 'rounded-t-[4px]' : ''}`}
              style={{ ...bgStyle, ...textColor }}
            >
              {icon && (
                <span className="flex items-center shrink-0">
                  {React.cloneElement(icon, {
                    size: size === 'sm' ? 16 : 18,
                    strokeWidth: isActive ? 2.5 : 2
                  })}
                </span>
              )}
              <span>{label}</span>

              {isLine && isActive && (
                <div
                  className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-full"
                  style={{ backgroundColor: colors?.primary?.base || '#008BC9' }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Scroll Controls (Right) */}
      {canScrollRight && !hideArrows && (
        <div
          className="absolute right-0 w-[48px] h-full flex items-center justify-end z-20 pointer-events-none"
          style={{ background: `linear-gradient(to left, ${colors?.neutral?.[0] || '#FFFFFF'} 40%, transparent)` }}
        >
          <button
            onClick={() => scroll('right')}
            className="pointer-events-auto mr-[4px] p-[4px] rounded-full bg-white border shadow-sm hover:text-primary-base transition-colors text-slate-600 hover:text-blue-600"
            style={{ borderColor: colors?.neutral?.[2] || '#DEE1E8' }}
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
};

export default Tabs;
