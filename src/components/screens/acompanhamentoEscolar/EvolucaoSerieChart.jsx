import React from 'react';

/**
 * EvolucaoSerieChart Component
 * Renders the monthly evolution (Língua Portuguesa vs Matemática) line chart.
 */
const EvolucaoSerieChart = ({ isDarkMode, perfValue }) => {
  const width = 500;
  const height = 185;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const baseMath = perfValue || 70;
  const baseRead = Math.min(95, Math.max(30, baseMath - 6));

  const leituraVals = [baseRead - 8, baseRead - 4, baseRead + 12, baseRead - 2, baseRead + 6, baseRead + 1].map(v => Math.min(100, Math.max(0, v)));
  const matematicaVals = [baseMath - 12, baseMath - 6, baseMath + 15, baseMath, baseMath + 8, baseMath + 2].map(v => Math.min(100, Math.max(0, v)));
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

  const getX = (idx) => paddingLeft + (idx * (width - paddingLeft - paddingRight)) / (months.length - 1);
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [20, 40, 60, 80, 100];

  let readPath = "";
  let mathPath = "";
  leituraVals.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) readPath += `M ${x} ${y}`;
    else readPath += ` L ${x} ${y}`;
  });
  matematicaVals.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) mathPath += `M ${x} ${y}`;
    else mathPath += ` L ${x} ${y}`;
  });

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="relative flex-1">
        <svg className="w-full h-full min-h-[160px]" viewBox={`0 0 ${width} ${height}`}>
          {/* Grid Lines */}
          {gridTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={isDarkMode ? "#334155" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3,3" />
                <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="bold">{tick}%</text>
              </g>
            );
          })}
          {/* X Labels */}
          {months.map((m, idx) => {
            const x = getX(idx);
            return (
              <text key={m} x={x} y={height - 5} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="semibold">{m}</text>
            );
          })}
          {/* Leitura Line (Purple) */}
          <path d={readPath} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {leituraVals.map((val, idx) => (
            <circle key={`r-${idx}`} cx={getX(idx)} cy={getY(val)} r="3.5" fill={isDarkMode ? "#0f172a" : "#ffffff"} stroke="#a855f7" strokeWidth="2" />
          ))}
          {/* Matemática Line (Amber) */}
          <path d={mathPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {matematicaVals.map((val, idx) => (
            <circle key={`m-${idx}`} cx={getX(idx)} cy={getY(val)} r="3.5" fill={isDarkMode ? "#0f172a" : "#ffffff"} stroke="#f59e0b" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div className="flex gap-4 justify-center text-xs font-semibold text-slate-500 mt-2 border-t pt-2 border-slate-100 dark:border-slate-850">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-[#a855f7] inline-block"></span> Português · Leitura</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-[#f59e0b] inline-block"></span> Matemática</span>
      </div>
    </div>
  );
};

export default EvolucaoSerieChart;
