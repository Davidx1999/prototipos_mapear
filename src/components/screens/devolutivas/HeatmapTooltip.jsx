import React from 'react';
import { Users } from 'lucide-react';
import Chips from '../../ui/Chips';

export default function HeatmapTooltip({ tooltipData, statusColors, colorTheme = 'default' }) {
  if (!tooltipData) return null;

  const chipBg = statusColors[tooltipData.statusKey]?.bg;
  const isMonochromatic = colorTheme === 'monochromatic';

  let textColor = '#0F1113';
  if (chipBg === '#FFFFFF') {
    textColor = '#0F1113';
  } else if (isMonochromatic) {
    const statusKey = tooltipData.statusKey;
    const isSuficienteOrParcialmente = statusKey === 'suficiente' || statusKey === 'parcialmente' || statusKey === '2' || statusKey === '1';
    textColor = isSuficienteOrParcialmente ? '#0F1113' : '#FFFFFF';
  } else {
    const isDarkBg = chipBg === '#004488' || chipBg === '#BB5566' || chipBg === '#F45F74' || chipBg === '#E35759' || chipBg === '#0B81A2' || chipBg === '#36B802' || chipBg === '#0D7E87' || chipBg === '#FF5A5D' || chipBg === '#6B8E23' || chipBg === '#C74A3A' || chipBg === '#5E4B4E';
    textColor = isDarkBg ? '#FFFFFF' : '#0F1113';
  }

  return (
    <div
      className="fixed z-[100] bg-[#1D2432] text-white p-4 rounded-xl shadow-2xl flex flex-col min-w-[220px] pointer-events-none transform -translate-x-1/2 -translate-y-[calc(100%+20px)] transition-opacity duration-150 ease-in-out border border-gray-700"
      style={{ left: tooltipData.x, top: tooltipData.y }}
    >
      <div className="flex items-center gap-2 border-b border-gray-700 pb-2 mb-3">
        <Users size={20} className="text-[#94CFEF]" />
        <span className="font-bold text-[11px] uppercase tracking-wider text-gray-300">Dados Intersecção</span>
      </div>
      <div className="flex justify-between items-center mb-2 gap-4">
        <span className="text-neutral-4 font-medium text-[12px]">Aluno</span>
        <span className="font-bold text-[14px] truncate text-right">{tooltipData.aluno}</span>
      </div>
      <div className="flex justify-between items-center mb-4 gap-4">
        <span className="text-neutral-4 font-medium text-[12px]">Item Curricular</span>
        <span className="font-bold text-[14px]">{tooltipData.questao}</span>
      </div>

      <div className="w-full flex justify-center mt-1">
        <Chips
          label={statusColors[tooltipData.statusKey]?.label}
          status="neutral"
          variant="light"
          iconLeft={statusColors[tooltipData.statusKey]?.icon ? React.cloneElement(statusColors[tooltipData.statusKey].icon, { className: '', style: { color: textColor } }) : null}
          className="w-full h-8 font-semibold"
          style={{
            backgroundColor: chipBg,
            borderColor: statusColors[tooltipData.statusKey]?.border || 'rgba(0,0,0,0.1)',
            color: textColor
          }}
        />
      </div>

      <div className="absolute left-1/2 bottom-[-5px] -translate-x-1/2 w-3 h-3 bg-[#1D2432] rotate-45 border-b border-r border-gray-700"></div>
    </div>
  );
}
