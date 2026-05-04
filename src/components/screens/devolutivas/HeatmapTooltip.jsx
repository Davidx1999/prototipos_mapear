import React from 'react';
import { Users } from 'lucide-react';

export default function HeatmapTooltip({ tooltipData, statusColors }) {
  if (!tooltipData) return null;

  return (
    <div
      className="fixed z-[100] bg-[#1D2432] text-white p-4 rounded-xl shadow-2xl flex flex-col min-w-[220px] pointer-events-none transform -translate-x-1/2 -translate-y-[calc(100%+20px)] transition-opacity duration-150 ease-in-out border border-gray-700"
      style={{ left: tooltipData.x, top: tooltipData.y }}
    >
      <div className="flex items-center gap-2 border-b border-gray-700 pb-2 mb-3">
        <Users size={14} className="text-[#94CFEF]" />
        <span className="font-bold text-[11px] uppercase tracking-wider text-gray-300">Dados Intersecção</span>
      </div>
      <div className="flex justify-between items-center mb-2 gap-4">
        <span className="text-neutral-4 font-medium text-[12px]">Aluno</span>
        <span className="font-bold text-[13px] truncate text-right">{tooltipData.aluno}</span>
      </div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <span className="text-neutral-4 font-medium text-[12px]">Item Curricular</span>
        <span className="font-bold text-[13px]">{tooltipData.questao}</span>
      </div>
      <div
        className="w-full py-1.5 px-3 rounded-md text-[11px] font-bold flex items-center justify-center gap-2 shadow-inner"
        style={{ backgroundColor: statusColors[tooltipData.statusKey].bg, color: '#1D2432' }}
      >
        {statusColors[tooltipData.statusKey].icon} {statusColors[tooltipData.statusKey].label}
      </div>

      <div className="absolute left-1/2 bottom-[-5px] -translate-x-1/2 w-3 h-3 bg-[#1D2432] rotate-45 border-b border-r border-gray-700"></div>
    </div>
  );
}
