
import React from 'react';

const LogoFgv = ({ isFooter = false, stacked = false, onClick, isHighContrast, colors }) => {
  const imgFilter = (isFooter || isHighContrast) ? 'brightness(0) invert(1)' : 'none';
  const baseClass = onClick ? 'cursor-pointer hover:opacity-80 transition-opacity' : '';
  
  if (stacked) {
    return (
      <div className={`flex flex-col items-center gap-[4px] ${baseClass}`} onClick={onClick}>
        <img src="https://dgpe.fgv.br/sites/default/files/Marca_DGPE%20%281%29.png" alt="FGV DGPE Logo" className="h-[24px]" style={{ filter: imgFilter }} />
        <span className="text-[32px] font-[800] tracking-tight" style={{ color: colors.primary.base }}>MAPEAR</span>
      </div>
    );
  }
  return (
    <div className={`flex items-center gap-[8px] shrink-0 ${baseClass}`} onClick={onClick}>
      <img src="https://dgpe.fgv.br/sites/default/files/Marca_DGPE%20%281%29.png" alt="FGV DGPE Logo" className="h-[24px] md:h-[32px]" style={{ filter: imgFilter }} />
      <span className="text-[18px] md:text-[20px] font-[800]" style={{ color: isFooter ? colors.neutral[0] : colors.primary.base }}>| MAPEAR</span>
    </div>
  );
};

export default LogoFgv;
