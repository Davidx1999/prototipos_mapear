import React, { useState } from 'react';
import { HelpCircle, Loader2 } from 'lucide-react';
import { METRIC_INDICATORS, METRIC_INDICATORS_BY_YEAR } from './mockDataAcompanhamento';
import { DarkTooltipBalloon } from './TooltipCallout';

export default function MetricCards({ dataMode = 'percentage', selectedYear = '2024', isLoading = false }) {
  const [activeTooltip, setActiveTooltip] = useState(null);

  const yearIndicators = METRIC_INDICATORS_BY_YEAR[selectedYear] || METRIC_INDICATORS_BY_YEAR['2024'] || METRIC_INDICATORS;
  const metrics = yearIndicators[dataMode] || yearIndicators.percentage;

  const cardList = [
    { key: 'acertos', data: metrics.acertos },
    { key: 'avaliacoes', data: metrics.avaliacoes },
    { key: 'itens', data: metrics.itens },
    { key: 'intervencoes', data: metrics.intervencoes }
  ];

  return (
    /* CONTAINER ÚNICO COM BORDA EXTERNA E DIVISORES VERTICAIS (SEM BORDAS DUPLAS, OVERFLOW VISÍVEL PARA TOOLTIP) */
    <div className="bg-white border border-[#CBD5E1] rounded-[8px] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x divide-slate-200 shadow-2xs relative z-30">
      {cardList.map(({ key, data }, idx) => (
        <div
          key={key}
          className={`p-4 flex flex-col justify-between min-h-[100px] relative bg-white ${
            idx === 0 ? 'rounded-l-[8px]' : idx === cardList.length - 1 ? 'rounded-r-[8px]' : ''
          }`}
        >
          {/* Topo da Célula: Rótulo + (?) */}
          <div className="flex items-center justify-between gap-2 mb-2">
            <span className="text-sm font-medium text-[#64748B]">
              {data.label}
            </span>

            <div className="relative">
              <button
                onMouseEnter={() => setActiveTooltip(key)}
                onMouseLeave={() => setActiveTooltip(null)}
                onClick={() => setActiveTooltip(activeTooltip === key ? null : key)}
                className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
              >
                <HelpCircle className="w-4 h-4" />
              </button>

              {activeTooltip === key && (
                <DarkTooltipBalloon
                  text={data.tooltip}
                  position="bottom"
                  align={idx >= 2 ? 'right' : 'center'}
                />
              )}
            </div>
          </div>

          {/* Valor Principal: h5 semibold neutral 7 (24px) ou Skeleton se estiver carregando */}
          {isLoading ? (
            <div className="flex items-center gap-2 h-[32px]">
              <div className="h-6 w-20 bg-slate-200 rounded animate-pulse" />
              {idx === 0 && <Loader2 className="w-3.5 h-3.5 text-[#008BC9] animate-spin shrink-0" />}
            </div>
          ) : (
            <div className="flex items-baseline tracking-tight">
              {data.value && data.value.includes('/') ? (
                (() => {
                  const [numerator, denominator] = data.value.split('/');
                  return (
                    <>
                      <span className="text-[24px] leading-tight font-semibold text-[#1D2432]">
                        {numerator.trim()}
                      </span>
                      <span className="text-[16px] leading-normal font-medium text-[#677080] ml-1.5">
                        / {denominator.trim()}
                      </span>
                    </>
                  );
                })()
              ) : (
                <span className="text-[24px] leading-tight font-semibold text-[#1D2432]">
                  {data.value}
                </span>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
