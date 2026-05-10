import React from 'react';

export default function SkillTooltip({ skillTooltip }) {
  if (!skillTooltip) return null;

  return (
    <div
      className="fixed z-[9999] bg-[#1D2432] text-white p-3 rounded-lg shadow-2xl flex flex-col w-[260px] pointer-events-none transform -translate-x-1/2 transition-opacity animate-fade-in border border-gray-700"
      style={{ left: skillTooltip.x, top: skillTooltip.y }}
    >
      <span className="font-bold text-[12px] text-[#94CFEF] uppercase tracking-wider border-b border-gray-700 pb-1.5 mb-1.5">
        {skillTooltip.name}
      </span>
      <span className="text-[11px] leading-relaxed text-gray-300">
        {skillTooltip.description}
      </span>
      {/* Arrow */}
      <div className="absolute left-1/2 top-[-5px] -translate-x-1/2 w-2.5 h-2.5 bg-[#1D2432] rotate-45 border-t border-l border-gray-700"></div>
    </div>
  );
}
