import React from 'react';

/**
 * DesempenhoTurmaChart Component
 * Renders the class performance chart with Toggle support (Averages / Boxplot).
 */
const DesempenhoTurmaChart = ({ isDarkMode, mode }) => {
  const width = 500;
  const height = 185;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const classes = ["3A", "3B", "3C", "3D"];
  const averages = [80, 74, 82, 68];
  
  const boxplots = [
    { min: 58, q1: 72, median: 81, q3: 88, max: 96 },
    { min: 48, q1: 64, median: 75, q3: 83, max: 94 },
    { min: 62, q1: 76, median: 83, q3: 89, max: 98 },
    { min: 42, q1: 58, median: 69, q3: 78, max: 90 }
  ];

  const getX = (idx) => paddingLeft + ((idx + 0.5) * (width - paddingLeft - paddingRight)) / classes.length;
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [20, 40, 60, 80, 100];
  const barWidth = 36;

  return (
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
      {classes.map((c, idx) => {
        const x = getX(idx);
        return (
          <text key={c} x={x} y={height - 5} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="semibold">Turma {c}</text>
        );
      })}

      {/* Render average bars */}
      {mode === 'media' && averages.map((avg, idx) => {
        const x = getX(idx) - barWidth / 2;
        const y = getY(avg);
        const barHeight = height - paddingBottom - y;
        const fill = avg >= 70 ? "#10b981" : avg >= 55 ? "#f59e0b" : "#ef4444";
        return (
          <g key={`bar-${idx}`}>
            <rect x={x} y={y} width={barWidth} height={barHeight} fill={fill} rx="2" opacity="0.85" className="hover:opacity-100 transition-opacity cursor-pointer" />
            <text x={getX(idx)} y={y - 4} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#ffffff" : "#1e293b"} fontWeight="bold">{avg}%</text>
          </g>
        );
      })}

      {/* Render box plots */}
      {mode === 'boxplot' && boxplots.map((bp, idx) => {
        const x = getX(idx);
        const boxX = x - barWidth / 2;
        const yMin = getY(bp.min);
        const yMax = getY(bp.max);
        const yQ1 = getY(bp.q1);
        const yQ3 = getY(bp.q3);
        const yMed = getY(bp.median);

        return (
          <g key={`box-${idx}`} className="cursor-pointer hover:opacity-90 transition-opacity">
            {/* Whiskers line */}
            <line x1={x} y1={yMin} x2={x} y2={yMax} stroke={isDarkMode ? "#38bdf8" : "#006699"} strokeWidth="1.5" />
            <line x1={x - 6} y1={yMin} x2={x + 6} y2={yMin} stroke={isDarkMode ? "#38bdf8" : "#006699"} strokeWidth="1.5" />
            <line x1={x - 6} y1={yMax} x2={x + 6} y2={yMax} stroke={isDarkMode ? "#38bdf8" : "#006699"} strokeWidth="1.5" />
            
            {/* Interquartile range box */}
            <rect x={boxX} y={yQ3} width={barWidth} height={Math.max(2, yQ1 - yQ3)} fill={isDarkMode ? "rgba(56, 189, 248, 0.2)" : "rgba(0, 102, 153, 0.15)"} stroke={isDarkMode ? "#38bdf8" : "#006699"} strokeWidth="2" rx="1" />
            
            {/* Median line */}
            <line x1={boxX} y1={yMed} x2={boxX + barWidth} y2={yMed} stroke="#10b981" strokeWidth="2.5" />
          </g>
        );
      })}
    </svg>
  );
};

export default DesempenhoTurmaChart;
