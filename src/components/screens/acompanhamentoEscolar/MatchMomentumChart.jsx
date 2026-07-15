import React, { useState, useEffect, useRef } from 'react';
import { Sparkles } from 'lucide-react';

const MatchMomentumChart = ({
  currentPerf,
  isDarkMode
}) => {
  const [viewMode, setViewMode] = useState('mensal'); // 'mensal' | 'semanal'
  const [hoveredItem, setHoveredItem] = useState(null);

  const containerRef = useRef(null);
  const [width, setWidth] = useState(640);

  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver(entries => {
      if (entries[0] && entries[0].contentRect.width > 0) {
        setWidth(entries[0].contentRect.width);
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // SVG Size Configuration
  const height = 260;
  const paddingLeft = 40;
  const paddingRight = 40;
  const centerY = 120; // Center Y axis line

  // Monthly values (6 months)
  const mVals = [
    { label: "Janeiro", val: Math.max(35, Math.min(95, currentPerf - 8)), event: null },
    { label: "Fevereiro", val: Math.max(35, Math.min(95, currentPerf - 4)), event: null },
    { label: "Março", val: 52, event: { type: "alert", label: "Avaliação Diagnóstica: Alerta de Desempenho severo (-18 p.p.)" } },
    { label: "Abril", val: Math.max(35, Math.min(95, currentPerf - 12)), event: null },
    { label: "Maio", val: 74, event: { type: "success", label: "Intervenção Pedagógica: Oficina de Justificativa (+4 p.p.)" } },
    { label: "Junho", val: 82, event: { type: "star", label: "Simulado SAEB: Meta de Proficiência superada (+12 p.p.)" } }
  ];

  // Weekly values (12 weeks)
  const wVals = [
    { label: "Semana 1", val: 66, event: null },
    { label: "Semana 2", val: 68, event: null },
    { label: "Semana 3", val: 63, event: null },
    { label: "Semana 4", val: 50, event: { type: "alert", label: "Semana 4: Queda abrupta na Diagnóstica de Frações (-20 p.p.)" } },
    { label: "Semana 5", val: 58, event: null },
    { label: "Semana 6", val: 61, event: null },
    { label: "Semana 7", val: 65, event: null },
    { label: "Semana 8", val: 72, event: null },
    { label: "Semana 9", val: 76, event: { type: "success", label: "Semana 9: Conclusão da Trilha de Frações Equivalentes (+6 p.p.)" } },
    { label: "Semana 10", val: 73, event: null },
    { label: "Semana 11", val: 83, event: { type: "star", label: "Semana 11: Simulado de Bloco de Habilidades (+13 p.p.)" } },
    { label: "Semana 12", val: 79, event: null }
  ];

  const activeData = viewMode === 'mensal' ? mVals : wVals;

  // Gap between bars: exactly 4px
  const N = activeData.length;
  const totalWidth = width - paddingLeft - paddingRight;
  const totalGapsWidth = (N - 1) * 4;
  const barWidth = (totalWidth - totalGapsWidth) / N;

  const getBarX = (idx) => paddingLeft + idx * (barWidth + 4);
  const getCenterX = (idx) => getBarX(idx) + barWidth / 2;
  const getY = (val) => centerY - ((val - 70) / 30) * 80;

  return (
    <div className="flex flex-col w-full gap-4">
      {/* Header and Toggle Group */}
      <div className="flex items-center justify-between border-b pb-3 border-slate-100 dark:border-slate-850">
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block">Filtro Temporal</span>
          <span className="text-xs font-semibold text-slate-650 dark:text-slate-400">Classificação: {viewMode === 'mensal' ? 'Média Mensal' : 'Média Semanal'}</span>
        </div>
        
        {/* Toggle Button Group */}
        <div className="flex items-center gap-1 p-1 rounded-[4px] border bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800">
          <button
            onClick={() => setViewMode('mensal')}
            className={`px-3 py-1 rounded-[4px] text-[10px] font-bold uppercase transition-all ${
              viewMode === 'mensal'
                ? 'bg-[#006699] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Mensal
          </button>
          <button
            onClick={() => setViewMode('semanal')}
            className={`px-3 py-1 rounded-[4px] text-[10px] font-bold uppercase transition-all ${
              viewMode === 'semanal'
                ? 'bg-[#006699] text-white shadow-sm'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Semanal
          </button>
        </div>
      </div>

      {/* Expanded Chart Container */}
      <div ref={containerRef} className="relative w-full h-[260px]">
        {/* Tooltip Overlay */}
        {hoveredItem && (
          <div
            className="absolute z-20 bg-slate-950 text-white p-3 rounded-[4px] shadow-xl text-[11px] max-w-[250px] pointer-events-none border border-slate-800 animate-fade-slide"
            style={{
              left: `${Math.min(width - 240, Math.max(10, getCenterX(hoveredItem.idx) - 100))}px`,
              top: `${hoveredItem.diff >= 0 ? 10 : 120}px`
            }}
          >
            <p className="font-bold text-sky-400">{hoveredItem.label} — Desempenho: {hoveredItem.val}%</p>
            <p className="mt-0.5 font-medium">Class Momentum: {hoveredItem.diff >= 0 ? `+${hoveredItem.diff.toFixed(0)}` : hoveredItem.diff.toFixed(0)} p.p. vs meta</p>
            {hoveredItem.event && (
              <p className="mt-1.5 border-t border-slate-800 pt-1.5 text-amber-400 font-semibold flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" /> {hoveredItem.event.label}
              </p>
            )}
          </div>
        )}

        <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
          {/* Target line (70%) */}
          <line
            x1={paddingLeft}
            y1={centerY}
            x2={width - paddingRight}
            y2={centerY}
            stroke={isDarkMode ? "#475569" : "#94a3b8"}
            strokeWidth="2.5"
            strokeDasharray="4,4"
          />

          {/* Grid lines */}
          {[90, 50].map((tick) => {
            const y = getY(tick);
            return (
              <line
                key={tick}
                x1={paddingLeft}
                y1={y}
                x2={width - paddingRight}
                y2={y}
                stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                strokeWidth="1.2"
                strokeDasharray="2,2"
              />
            );
          })}

          {/* Render Momentum Bars */}
          {activeData.map((item, idx) => {
            const val = item.val;
            const diff = val - 70;
            const x = getBarX(idx);
            const y = getY(val);
            const isPositive = diff >= 0;

            const rx = 3;
            const barY = isPositive ? y : centerY;
            const barHeight = Math.abs(centerY - y);

            const fillColor = isPositive
              ? (isDarkMode ? "#10b981" : "#10b981")
              : (isDarkMode ? "#ef4444" : "#ef4444");

            // Format X label: Jan, Fev, Mar... for months, or S1, S2, S3... for weeks
            const shortLabel = viewMode === 'mensal' 
              ? item.label.substring(0, 3) 
              : `S${idx + 1}`;

            return (
              <g
                key={idx}
                onMouseEnter={() => setHoveredItem({ label: item.label, val, diff, event: item.event, idx })}
                onMouseLeave={() => setHoveredItem(null)}
                className="cursor-pointer"
              >
                {/* Wider interaction rectangle */}
                <rect
                  x={x - 2}
                  y={10}
                  width={barWidth + 4}
                  height={height - 40}
                  fill="transparent"
                />

                {/* Vertical Bar */}
                <rect
                  x={x}
                  y={barY}
                  width={barWidth}
                  height={Math.max(3, barHeight)}
                  fill={fillColor}
                  rx={rx}
                  className="hover:opacity-85 transition-opacity"
                />

                {/* X Axis Label */}
                <text
                  x={getCenterX(idx)}
                  y={height - 12}
                  textAnchor="middle"
                  fontSize="9"
                  fill={isDarkMode ? "#94a3b8" : "#64748b"}
                  fontWeight="bold"
                >
                  {shortLabel}
                </text>

                {/* Event Badge Circle Overlay */}
                {item.event && item.event.type === "alert" && (
                  <g transform={`translate(${getCenterX(idx)}, ${barY + barHeight + 14})`}>
                    <circle cx="0" cy="0" r="8" fill="#ef4444" />
                    <text x="0" y="3.5" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="black">!</text>
                  </g>
                )}

                {item.event && item.event.type === "success" && (
                  <g transform={`translate(${getCenterX(idx)}, ${barY - 14})`}>
                    <circle cx="0" cy="0" r="8" fill="#10b981" />
                    <text x="0" y="4" textAnchor="middle" fontSize="10" fill="#ffffff" fontWeight="black">✓</text>
                  </g>
                )}

                {item.event && item.event.type === "star" && (
                  <g transform={`translate(${getCenterX(idx)}, ${barY - 14})`}>
                    <circle cx="0" cy="0" r="8" fill="#f59e0b" />
                    <polygon points="0,-4 1.5,-1 5,-1 2,1 3,4.5 0,2.5 -3,4.5 -2,1 -5,-1 -1.5,-1" fill="#ffffff" />
                  </g>
                )}
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default MatchMomentumChart;
