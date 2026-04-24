
import React, { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const ScrollableTabs = ({ tabs, activeTab, onTabClick, colors }) => {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

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
    if (scrollRef.current) scrollRef.current.scrollBy({ left: direction === 'right' ? 250 : -250, behavior: 'smooth' });
  };

  return (
    <div className="relative flex items-center border-b w-full" style={{ borderColor: colors.neutral[2] }}>
      {canScrollLeft && (
        <div className="absolute left-0 w-[40px] h-full flex items-center justify-start z-10" style={{ background: `linear-gradient(to right, ${colors.neutral[0]} 40%, transparent)` }}>
          <div className="cursor-pointer hover:text-[#008BC9] text-[#677080] rounded-full shadow-sm p-[4px] border bg-white" style={{ borderColor: colors.neutral[2] }} onClick={() => scroll('left')}><ChevronLeft size={16}/></div>
        </div>
      )}
      <div ref={scrollRef} onScroll={checkScroll} className="flex items-center overflow-x-auto hide-scrollbar px-[16px] md:px-[40px] w-full scroll-smooth">
        {tabs.map((tab, idx) => (
          <div key={tab} onClick={() => onTabClick(idx)} className={`px-[16px] md:px-[24px] py-[12px] font-bold text-[13px] md:text-[14px] cursor-pointer whitespace-nowrap border-b-2 transition-colors ${activeTab === idx ? 'border-[#008BC9] text-[#008BC9]' : 'border-transparent text-[#677080] hover:text-[#008BC9]'}`}>
            {tab}
          </div>
        ))}
      </div>
      {canScrollRight && (
        <div className="absolute right-0 w-[40px] h-full flex items-center justify-end z-10" style={{ background: `linear-gradient(to left, ${colors.neutral[0]} 40%, transparent)` }}>
          <div className="cursor-pointer hover:text-[#008BC9] text-[#677080] rounded-full shadow-sm p-[4px] border bg-white" style={{ borderColor: colors.neutral[2] }} onClick={() => scroll('right')}><ChevronRight size={16}/></div>
        </div>
      )}
    </div>
  );
};

export default ScrollableTabs;
