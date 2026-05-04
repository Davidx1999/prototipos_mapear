import React from 'react';
import { Info, ChevronRight } from 'lucide-react';

export default function HeatmapMatrix({
  containerRef,
  isPanMode, isDragging, handleMouseDown, handleMouseMove, handleMouseUpOrLeave,
  mainTab, showSkills, zoomLevel,
  colGroups, displayColGroups, isColsSeparated,
  calcMethod, levelLabels, navLevel,
  isRowsSeparated, displayStudents,
  selectedRows, toggleRow, drillDown, isCombinedView,
  statusColors, colorTheme, isColorsActive, getColorFromGradient,
  handleCellMouseEnter, handleCellMouseLeave,
  activeSkill, dynamicTotals
}) {

  const isColOpacated = (col) => {
    if (!activeSkill) return false;
    return !col.skills.includes(activeSkill);
  };

  // Group rows by region label if at certain nav levels
  const getRegionalGroups = () => {
    if (navLevel >= 3) return [{ label: null, rows: displayStudents }];
    
    // For demo: split students into regional groups
    const mid = Math.ceil(displayStudents.length / 2);
    const groups = [];
    if (displayStudents.length > 3) {
      groups.push({ label: 'Regional 4', rows: displayStudents.slice(0, mid) });
      groups.push({ label: 'Regional 11', rows: displayStudents.slice(mid) });
    } else {
      groups.push({ label: null, rows: displayStudents });
    }
    return groups;
  };

  const regionalGroups = getRegionalGroups();

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-auto hide-scrollbar ${isPanMode ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUpOrLeave}
      onMouseLeave={handleMouseUpOrLeave}
    >
      {mainTab === 'heatmap' && (
        <div className={`${showSkills ? 'pt-[56px]' : 'pt-4'} pb-[120px] pl-4 pr-[80px] w-max h-max transition-all duration-300`}>
          <div className="inline-block transition-transform duration-200 origin-top-left" style={{ transform: `scale(${zoomLevel})` }}>

            {/* Header Dinâmico do Heatmap - Column groups + item IDs */}
            <div className="flex mb-1 sticky top-0 z-20">
              {/* Spacer for school name column */}
              <div className="w-[220px] shrink-0 sticky left-0 z-30"></div>
              
              {displayColGroups.map((group, gIdx) => (
                <div key={gIdx} className={`flex flex-col first:ml-0 ${isColsSeparated ? 'ml-[40px]' : 'ml-2'}`}>
                  {isColsSeparated && (
                    <div className="border border-neutral-2 rounded-md bg-neutral-0 mb-1 py-1 px-3 flex items-center justify-center gap-1.5 shadow-sm">
                      <span className="text-[10px] font-semibold text-neutral-5 truncate max-w-[140px] select-none">{group.title}</span>
                      <Info size={12} className="text-neutral-4 cursor-pointer hover:text-primary-base" />
                    </div>
                  )}
                  <div className="flex gap-[2px]">
                    {group.cols.map((col, cIdx) => {
                      const faded = isColOpacated(col);
                      return (
                        <div key={cIdx} className={`w-[30px] h-[26px] bg-neutral-0 border rounded-sm flex items-center justify-center text-[9px] font-bold transition-all duration-300 select-none ${faded ? 'opacity-30 border-neutral-2 text-neutral-4' : 'border-gray-300 text-neutral-6'}`}>
                          {col.id}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Rows grouped by region */}
            <div className="flex flex-col gap-6">
              {regionalGroups.map((group, gIdx) => (
                <div key={gIdx} className="flex flex-col">
                  {/* Regional label */}
                  {group.label && (
                    <div className="flex items-center gap-2 mb-2 mt-2 sticky left-0 z-20">
                      <span className="text-[12px] font-bold text-neutral-6">{group.label}</span>
                    </div>
                  )}

                  {/* Student rows */}
                  <div className={`flex flex-col ${isRowsSeparated ? 'gap-6' : 'gap-[2px]'}`}>
                    {group.rows.map((student, sIdx) => (
                      <div key={sIdx} className="flex items-center">
                        {/* Name cell with checkbox */}
                        <div className="w-[220px] shrink-0 flex items-center gap-2 py-1 pr-3 sticky left-0 z-20 bg-neutral-1">
                          {navLevel < 4 && (
                            <input
                              type="checkbox"
                              checked={selectedRows.has(student.name)}
                              onChange={(e) => { e.stopPropagation(); toggleRow(student.name); }}
                              className="w-4 h-4 rounded border-gray-300 text-primary-base focus:ring-[#008BC9] cursor-pointer accent-[#008BC9] shrink-0"
                            />
                          )}
                          <span
                            className={`text-[12px] font-bold truncate transition-colors ${navLevel < 3 && !isCombinedView ? 'text-primary-base hover:underline cursor-pointer' : 'text-neutral-6'}`}
                            onClick={() => { if (!isCombinedView && navLevel < 3) drillDown(student.name) }}
                            title={student.name}
                          >
                            {student.name}
                          </span>
                        </div>

                        {/* Data cells */}
                        {displayColGroups.map((colGroup, cgIdx) => (
                          <div key={cgIdx} className={`flex gap-[2px] first:ml-0 ${isColsSeparated ? 'ml-[40px]' : 'ml-2'}`}>
                            {colGroup.cols.map((col, cIdx) => {
                              const val = student.data[col.globalIndex];
                              let stColor = isColorsActive ? { ...statusColors[val] } : { bg: '#E5E7EB', border: '#D1D5DB' };

                              if (isColorsActive && colorTheme === 'colorblind') {
                                if (val === 2) { stColor.bg = '#0072B2'; stColor.border = '#005a8d'; }
                                if (val === 1) { stColor.bg = '#F0E442'; stColor.border = '#d1c63a'; }
                                if (val === 0) { stColor.bg = '#D55E00'; stColor.border = '#a34800'; }
                                if (val === -1) { stColor.bg = '#CCCCCC'; stColor.border = '#aaaaaa'; }
                              }

                              const faded = isColOpacated(col);

                              return (
                                <div
                                  key={cIdx}
                                  onMouseEnter={(e) => handleCellMouseEnter(e, student.name, col, val)}
                                  onMouseLeave={handleCellMouseLeave}
                                  className={`w-[30px] h-[26px] rounded-sm border cursor-pointer transition-all duration-300 ${faded ? 'opacity-[0.16]' : 'hover:scale-125 hover:shadow-lg hover:z-30 hover:border-gray-800 relative'}`}
                                  style={{ backgroundColor: stColor.bg, borderColor: stColor.border }}
                                ></div>
                              )
                            })}
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Footer totals row */}
            <div className="flex items-center mt-4 border-t border-neutral-2 pt-3">
              <div className="w-[220px] shrink-0 sticky left-0 z-20"></div>
              {displayColGroups.map((group, gIdx) => (
                <div key={gIdx} className={`flex gap-[2px] first:ml-0 ${isColsSeparated ? 'ml-[40px]' : 'ml-2'}`}>
                  {group.cols.map((col, cIdx) => {
                    const totalVal = col.totalVal;
                    const faded = isColOpacated(col);
                    let bg = getColorFromGradient(totalVal, isColorsActive, colorTheme);

                    return (
                      <div
                        key={cIdx}
                        className={`w-[30px] h-[24px] rounded-sm flex items-center justify-center text-[8px] font-bold text-neutral-6 transition-all duration-300 border border-gray-300 select-none ${faded ? 'opacity-30 border-transparent text-neutral-4' : 'shadow-sm'}`}
                        style={{ backgroundColor: faded ? '#E5E7EB' : bg }}
                      >
                        {totalVal}{totalVal !== '-' ? '' : ''}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
