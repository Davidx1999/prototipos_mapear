import React from 'react';
import { Check, ChevronRight } from 'lucide-react';
import Typography from '../Typography';

const CascadeItem = ({
  item,
  levelIndex,
  isLastLevel,
  isTurmaLevel,
  isSelected,
  multiSelectLeaf,
  onClick,
  colors,
  pendingLeafItems = [],
  isMobile = false
}) => {
  const isObj = typeof item === 'object';
  const label = isObj ? item.nome : item;
  const value = isObj ? item.id : item;

  // Mobile and Desktop have slightly different paddings and text sizes
  const containerClasses = isMobile
    ? `mx-[12px] my-[3px] px-[16px] py-[14px] rounded-[12px] flex items-center justify-between active:scale-[0.98] transition-all`
    : `px-[12px] py-[12px] rounded-[4px] text-[13px] font-normal cursor-pointer transition-colors flex justify-between items-center group ${isSelected ? ((isLastLevel && multiSelectLeaf) || isTurmaLevel ? 'bg-blue-50 text-neutral-800' : 'bg-[#003A79] text-white shadow-md') : 'text-neutral-700 hover:bg-neutral-100'}`;

  const containerStyle = isMobile ? {
    backgroundColor: isSelected ? `${colors.primary.base}12` : 'transparent',
    border: `1px solid ${isSelected ? `${colors.primary.base}30` : 'transparent'}`
  } : {};

  return (
    <div
      onClick={() => onClick(levelIndex, value, isObj ? item : null)}
      className={containerClasses}
      style={containerStyle}
    >
      <div className="flex items-center gap-[14px] w-full overflow-hidden">
        {(multiSelectLeaf && isLastLevel) || isTurmaLevel ? (
          <div
            className={`${isMobile ? 'w-[22px] h-[22px] rounded-[6px]' : 'w-4 h-4 rounded'} border-2 flex items-center justify-center transition-all shrink-0`}
            style={{
              backgroundColor: isSelected ? colors.primary.base : 'transparent',
              borderColor: isSelected ? colors.primary.base : colors.neutral[3]
            }}
          >
            {isSelected && <Check size={isMobile ? 13 : 12} strokeWidth={3} style={{ color: colors.neutral[0] }} />}
          </div>
        ) : null}
        
        <div className="flex flex-col gap-[2px] overflow-hidden flex-1 py-1">
          <span
            className={`leading-snug line-clamp-3 font-normal ${isMobile ? 'text-[15px]' : 'text-[13px]'}`}
            style={{ color: isMobile ? (isSelected ? colors.primary.base : colors.neutral[7]) : 'inherit' }}
            title={label}
          >
            {label}
          </span>
          {isLastLevel && pendingLeafItems.includes(value) && (
            <Typography variant="xxs" weight="bold" color="#EA580C" className="uppercase tracking-wider">
              Pendente Avaliação
            </Typography>
          )}
        </div>
      </div>
      
      {!isLastLevel && !isTurmaLevel && (
        <ChevronRight size={isMobile ? 18 : 16} className={`shrink-0 ${isMobile ? '' : (isSelected ? 'text-white' : 'opacity-50 group-hover:text-primary-base')}`} style={isMobile ? { color: colors.neutral[3] } : {}} />
      )}
    </div>
  );
};

export default CascadeItem;
