import React from 'react';

/**
 * TrajetoriaChart Component
 * Renders the longitudinal cohort SVG line chart supporting intentional gaps and legends.
 */
const TrajetoriaChart = ({ items, refData, isDarkMode }) => {
  const width = 600;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 130; // leaves space for legend/labels next to lines
  const paddingTop = 20;
  const paddingBottom = 30;

  const getX = (idx) => paddingLeft + (idx * (width - paddingLeft - paddingRight)) / 3;
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [20, 40, 60, 80, 100];
  const years = [2023, 2024, 2025, 2026];

  return (
    <svg className="w-full h-full min-h-[180px]" viewBox={`0 0 ${width} ${height}`}>
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

      {/* X Axis Years */}
      {years.map((yr, idx) => (
        <text key={yr} x={getX(idx)} y={height - 8} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="bold">{yr}</text>
      ))}

      {/* Reference Line (Rede/Geral) */}
      {refData && (() => {
        let refPath = "";
        refData.vals.forEach((val, idx) => {
          if (val === null) return;
          const x = getX(idx);
          const y = getY(val);
          if (refPath === "") refPath += `M ${x} ${y}`;
          else refPath += ` L ${x} ${y}`;
        });
        return (
          <>
            <path d={refPath} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
            {/* Label for Reference line at the end */}
            {refData.vals[3] !== null && (
              <text x={getX(3) + 8} y={getY(refData.vals[3]) + 3} fontSize="9" fill="#94a3b8" fontWeight="bold">
                {refData.label} ({refData.vals[3]}%)
              </text>
            )}
          </>
        );
      })()}

      {/* Item Lines */}
      {items.map((it) => {
        // Build path segments. Since we can have null (gaps), we can draw segment by segment
        const segments = [];
        let currentSegment = [];

        it.vals.forEach((val, idx) => {
          if (val === null) {
            if (currentSegment.length > 0) {
              segments.push(currentSegment);
              currentSegment = [];
            }
          } else {
            currentSegment.push({ x: getX(idx), y: getY(val), val, idx });
          }
        });
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
        }

        const lastValidVal = it.vals.slice().reverse().find(v => v !== null);
        const lastValidIdx = it.vals.lastIndexOf(lastValidVal);

        return (
          <g key={it.nome}>
            {segments.map((seg, sIdx) => {
              let d = "";
              seg.forEach((pt, pIdx) => {
                if (pIdx === 0) d += `M ${pt.x} ${pt.y}`;
                else d += ` L ${pt.x} ${pt.y}`;
              });
              return (
                <path
                  key={sIdx}
                  d={d}
                  fill="none"
                  stroke={it.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            
            {/* Dots and Tooltips */}
            {it.vals.map((val, idx) => {
              if (val === null) return null;
              const x = getX(idx);
              const y = getY(val);
              return (
                <g key={idx} className="group cursor-pointer">
                  <circle cx={x} cy={y} r="4" fill={it.color} stroke={isDarkMode ? "#0f172a" : "#ffffff"} strokeWidth="1.5" className="transition-all hover:scale-150" />
                  <title>{it.nome}: {val}% ({years[idx]})</title>
                </g>
              );
            })}

            {/* Item Label at the end */}
            {lastValidVal !== undefined && (
              <text x={getX(lastValidIdx) + 8} y={getY(lastValidVal) + 3} fontSize="9" fill={it.color} fontWeight="extrabold">
                {it.nome} ({lastValidVal}%)
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

export default TrajetoriaChart;
