import React from 'react';

/**
 * ModalHistoricoChart Component
 * Renders the decade performance line chart inside drill-down modals.
 */
const ModalHistoricoChart = ({ isDarkMode }) => {
  const width = 640;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const years = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
  const currentDomainData = [17, 52, 23, 84, 51, 80, 33, 74, 98, 54];
  const comparativeData =   [25, 45, 30, 75, 58, 70, 42, 60, 90, 68];

  const getX = (idx) => paddingLeft + (idx * (width - paddingLeft - paddingRight)) / (years.length - 1);
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [0, 25, 50, 75, 100];

  let currentPath = "";
  let compPath = "";
  currentDomainData.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) currentPath += `M ${x} ${y}`;
    else currentPath += ` L ${x} ${y}`;
  });
  comparativeData.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) compPath += `M ${x} ${y}`;
    else compPath += ` L ${x} ${y}`;
  });

  return (
    <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
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
      {years.map((y, idx) => {
        const x = getX(idx);
        return (
          <text key={y} x={x} y={height - 8} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="semibold">{y}</text>
        );
      })}
      {/* Comparative average line (gray dashed) */}
      <path d={compPath} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,4" />
      
      {/* Current Domain Line (amber) */}
      <path d={currentPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {currentDomainData.map((val, idx) => (
        <circle key={idx} cx={getX(idx)} cy={getY(val)} r="3.5" fill={isDarkMode ? "#0f172a" : "#ffffff"} stroke="#f59e0b" strokeWidth="2" />
      ))}
    </svg>
  );
};

export default ModalHistoricoChart;
