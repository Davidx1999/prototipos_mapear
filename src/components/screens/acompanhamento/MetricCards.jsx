import React, { useState } from 'react';
import { HelpCircle } from 'lucide-react';
import { METRIC_INDICATORS } from './mockDataAcompanhamento';
import { DarkTooltipBalloon } from './TooltipCallout';

export default function MetricCards({ dataMode = 'percentage' }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const metrics = METRIC_INDICATORS[dataMode] || METRIC_INDICATORS.percentage;

  const cardList = [
    { key: 'acertos', data: metrics.acertos },
    { key: 'avaliacoes', data: metrics.avaliacoes },
    { key: 'itens', data: metrics.itens },
    { key: 'intervencoes', data: metrics.intervencoes }
  ];

  return (
    /* CONTAINER ÚNICO COM BORDA EXTERNA E DIVISORES VERTICAIS (SEM BORDAS DUPLAS) */
    <div className="bg-white border border-slate-300 rounded-[8px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 overflow-hidden mb-4 shadow-2xs">
      {cardList.map(({ key, data }) => (
        <div
          key={key}
          className="p-4 flex flex-col justify-between min-h-[96px] relative bg-white"
        >
          {/* Topo da Célula: Rótulo + (?) */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-xs font-normal text-slate-500">
              {data.label}
            </span>

            <div className="relative">
              <button
                onMouseEnter={() => setActiveTooltip(key)}
                onMouseLeave={() => setActiveTooltip(null)}
                onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
                title="Ver detalhes da métrica"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>

              {activeTooltip === key && (
                <DarkTooltipBalloon text={data.tooltip} position="bottom" />
              )}
            </div>
          </div>

          {/* Valor Principal */}
          <div className="text-2xl md:text-[28px] font-bold text-slate-900 tracking-tight">
            {data.value}
          </div>
        </div>
      ))}
    </div>
  );
}
