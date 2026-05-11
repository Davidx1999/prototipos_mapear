
import React from 'react';

const LogoFgv = ({ isFooter = false, stacked = false, onClick, isHighContrast, isDarkMode, colors }) => {
  const imgFilter = (isFooter || isHighContrast || isDarkMode) ? 'brightness(0) invert(1)' : 'none';
  const baseClass = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';

  if (stacked) {
    return (
      <div className={`flex flex-col items-center gap-[4px] ${baseClass}`} onClick={onClick}>
        <img src="assets/fgv_logo.png" alt="FGV Mapear Logo" className="h-[24px]" style={{ filter: imgFilter }} />
      </div>
    );
  }
  return (
    <div className={`flex items-center shrink-0 ${baseClass}`} onClick={onClick}>
      <img src="assets/fgv_logo.png" alt="FGV Mapear Logo" className="h-[24px] md:h-[32px]" style={{ filter: imgFilter }} />
    </div>
  );
};

export default LogoFgv;
