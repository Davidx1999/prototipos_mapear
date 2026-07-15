import React, { useRef, useState, useEffect } from 'react';

const Timeline = ({ years, year, changeYear, isDarkMode }) => {
  const timelineRef = useRef(null);
  
  // Dragging state
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  
  // Gradient state
  const [showLeftGrad, setShowLeftGrad] = useState(false);
  const [showRightGrad, setShowRightGrad] = useState(true);

  // Check scroll position to hide gradients at ends
  const checkScroll = () => {
    if (timelineRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = timelineRef.current;
      setShowLeftGrad(scrollLeft > 8);
      setShowRightGrad(scrollLeft + clientWidth < scrollWidth - 8);
    }
  };

  // Run scroll check on mount, scroll, and resizing
  useEffect(() => {
    checkScroll();
    const timer = setTimeout(checkScroll, 100);
    window.addEventListener('resize', checkScroll);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', checkScroll);
    };
  }, [years]);

  // Auto adjust active year position in the timeline
  useEffect(() => {
    const activeBtn = document.getElementById(`year-btn-${year}`);
    if (activeBtn && timelineRef.current) {
      activeBtn.scrollIntoView({
        behavior: 'smooth',
        block: 'nearest',
        inline: 'center'
      });
      setTimeout(checkScroll, 300);
    }
  }, [year]);

  // Mouse drag handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - timelineRef.current.offsetLeft);
    setScrollLeft(timelineRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - timelineRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    timelineRef.current.scrollLeft = scrollLeft - walk;
    checkScroll();
  };

  return (
    <div className="flex flex-col gap-1 w-full lg:w-auto relative">
      {/* Estilo local para forçar ocultação total da barra de rolagem e botões nativos de scroll */}
      <style>{`
        .timeline-hide-scrollbar::-webkit-scrollbar {
          display: none !important;
          width: 0 !important;
          height: 0 !important;
        }
        .timeline-hide-scrollbar {
          -ms-overflow-style: none !important;  /* IE/Edge */
          scrollbar-width: none !important;  /* Firefox */
        }
      `}</style>

      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">
        Linha do Tempo Escolar (2011 - 2026) — <span className="text-[#006699] dark:text-sky-400 font-bold">Arraste para navegar</span>
      </span>

      <div className="relative flex items-center w-full lg:w-[420px] xl:w-[500px]">
        {/* Left Gradient (Fades out when scrolled to start) */}
        <div
          className={`absolute left-0 top-0 bottom-0 w-10 bg-gradient-to-r ${isDarkMode ? 'from-slate-900' : 'from-white'} to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            showLeftGrad ? 'opacity-100' : 'opacity-0'
          }`}
        />

        <div
          ref={timelineRef}
          onMouseDown={handleMouseDown}
          onMouseLeave={handleMouseLeave}
          onMouseUp={handleMouseUp}
          onMouseMove={handleMouseMove}
          onScroll={checkScroll}
          className="flex flex-row gap-2 overflow-x-auto timeline-hide-scrollbar scroll-smooth p-0.5 w-full draggable-timeline select-none whitespace-nowrap cursor-grab active:cursor-grabbing"
        >
          {years.map((y) => {
            const yearStr = y.toString();
            const isActive = yearStr === year;
            return (
              <button
                key={y}
                id={`year-btn-${yearStr}`}
                onClick={() => changeYear(yearStr)}
                className={`px-5 py-2 text-sm font-extrabold rounded-[4px] border shrink-0 transition-all duration-150 select-none ${
                  isActive
                    ? (isDarkMode ? 'border-sky-500 bg-sky-500 text-slate-955 shadow-md' : 'border-slate-900 bg-slate-900 text-white shadow-md')
                    : (isDarkMode ? 'border-slate-800 text-slate-400 bg-slate-900 hover:bg-slate-850' : 'border-slate-200 text-slate-650 bg-white hover:bg-slate-50')
                }`}
              >
                {yearStr}
              </button>
            );
          })}
        </div>

        {/* Right Gradient (Fades out when scrolled to end) */}
        <div
          className={`absolute right-0 top-0 bottom-0 w-10 bg-gradient-to-l ${isDarkMode ? 'from-slate-950' : 'from-white'} to-transparent pointer-events-none z-10 transition-opacity duration-200 ${
            showRightGrad ? 'opacity-100' : 'opacity-0'
          }`}
        />
      </div>
    </div>
  );
};

export default Timeline;
