import React from 'react';

/**
 * DistribucaoConceitoChart Component
 * Renders the stacked bar chart showing Concept Distribution over time.
 */
const DistribucaoConceitoChart = ({ isDarkMode }) => {
  const width = 500;
  const height = 185;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const months = ["Jan", "Mar", "Abr", "Jun", "Out"];

  const data = [
    { ins: 15, par: 35, suf: 50 },
    { ins: 20, par: 25, suf: 55 },
    { ins: 10, par: 40, suf: 50 },
    { ins: 12, par: 28, suf: 60 },
    { ins: 8, par: 22, suf: 70 }
  ];

  const getX = (idx) => paddingLeft + ((idx + 0.5) * (width - paddingLeft - paddingRight)) / months.length;
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [25, 50, 75, 100];
  const barWidth = 64;

  return (
    <div className="flex flex-col gap-2 w-full h-full">
      <svg className="w-full h-full min-h-[160px]" viewBox={`0 0 ${width} ${height}`}>
        {/* Grid Lines */}
        {gridTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={isDarkMode ? "#334155" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3,3" />
              <text x={paddingLeft - 8} y={y + 3.5} textAnchor="end" fontSize="11" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="bold">{tick}%</text>
            </g>
          );
        })}
        {/* X Labels */}
        {months.map((m, idx) => {
          const x = getX(idx);
          return (
            <text key={m} x={x} y={height - 5} textAnchor="middle" fontSize="11" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="semibold">{m}</text>
          );
        })}

        {/* Stacked Bars */}
        {data.map((item, idx) => {
          const x = getX(idx) - barWidth / 2;

          const hIns = item.ins;
          const yIns = getY(hIns);
          const heightIns = height - paddingBottom - yIns;

          const hPar = item.par;
          const yPar = getY(hIns + hPar);
          const heightPar = yIns - yPar;

          const hSuf = item.suf;
          const ySuf = getY(100);
          const heightSuf = yPar - ySuf;

          return (
            <g key={idx} className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x={x} y={yIns} width={barWidth} height={Math.max(1, heightIns)} fill="#ef4444" rx="1" />
              <rect x={x} y={yPar} width={barWidth} height={Math.max(1, heightPar)} fill="#f59e0b" rx="1" />
              <rect x={x} y={ySuf} width={barWidth} height={Math.max(1, heightSuf)} fill="#10b981" rx="1" />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-center gap-3 text-xs font-semibold text-slate-500 mt-1 border-t pt-2 border-slate-100 dark:border-slate-850">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-[2px] inline-block"></span> Suficiente</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-[2px] inline-block"></span> Parcialmente Suficiente</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-[2px] inline-block"></span> Insuficiente</span>
      </div>
    </div>
  );
};

export default DistribucaoConceitoChart;
