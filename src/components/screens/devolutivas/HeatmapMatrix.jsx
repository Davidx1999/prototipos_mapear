import React from 'react';
import { Info } from 'lucide-react';

export default function HeatmapMatrix({
  containerRef,
  isPanMode, isDragging, handleMouseDown, handleMouseMove, handleMouseUpOrLeave,
  showSkills, zoomLevel,
  colGroups,
  displayColGroups,
  calcMethod, navLevel,
  displayStudents,
  statusColors, getGradientColor,
  handleCellMouseEnter, handleCellMouseLeave,
  activeSkill, dynamicTotals, studentTotals, overallTotal,
  rowEntityLabel, colGroupingCriteria, isGroupColsActive, isGroupRowsActive,
  sortBy,
  onOpenModal
}) {

  const isColOpacated = (col) => {
    if (!showSkills || !activeSkill) return false;
    return !col.skills.includes(activeSkill);
  };

  const groupedStudents = React.useMemo(() => {
    if (!isGroupRowsActive) return { 'Todos os Alunos': displayStudents };
    return displayStudents.reduce((acc, student) => {
      if (!acc[student.turma]) acc[student.turma] = [];
      acc[student.turma].push(student);
      return acc;
    }, {});
  }, [displayStudents, isGroupRowsActive]);

  return (
    /* CANVAS BASE (HEATMAP) */
    <div 
      ref={containerRef} 
      className={`absolute inset-0 overflow-auto hide-scrollbar ${isPanMode ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}
    >
      <div className={`pt-[100px] pb-[300px] pl-[50px] md:pl-[400px] pr-[400px] w-max h-max ${showSkills ? 'mt-[60px] md:mt-[80px]' : ''}`}>
        <div className="inline-block transition-transform duration-200 origin-top-left" style={{ transform: `scale(${zoomLevel})` }}>
          
          <div className="flex mb-3">
            <div className="w-[220px] shrink-0"></div>
            <div className={`flex ${isGroupColsActive ? 'gap-[80px]' : 'gap-3'} ml-3`}>
              {displayColGroups.map((group, gIdx) => (
                <div key={gIdx} className="flex flex-col">
                  {isGroupColsActive && (
                    <div className="border border-gray-300 rounded-[6px] bg-white mb-2 py-1 px-2 flex items-center justify-center gap-1.5 shadow-sm relative group">
                      <span className="text-[10px] font-bold text-gray-700 truncate max-w-[120px] select-none">
                        {colGroupingCriteria} {gIdx + 1}
                      </span>
                      <Info size={20} className="text-gray-400 cursor-pointer hover:text-[#008BC9]"/>
                    </div>
                  )}
                  <div className="flex gap-1">
                    {group.cols.map((col, cIdx) => {
                      const faded = isColOpacated(col);
                      return sortBy === 'Alunos' ? (
                        <div key={cIdx} className="w-[32px] h-[32px]"></div>
                      ) : (
                        <button 
                          key={cIdx} 
                          onClick={() => onOpenModal('item', `Item ${col.id}`)}
                          className={`w-[32px] h-[32px] bg-white border rounded-[6px] flex items-center justify-center text-[10px] font-bold transition-all duration-300 shadow-sm select-none hover:border-[#008BC9] hover:text-[#008BC9] hover:shadow-md active:scale-95 ${faded ? 'opacity-30 border-gray-200 text-gray-400' : 'border-gray-300 text-[#1D2432]'}`}
                        >
                          {col.id}
                        </button>
                      )
                    })}
                  </div>
                </div>
              ))}
            </div>
            {/* CABEÇALHO DA COLUNA EXTREMA DIREITA (ENTIDADES) */}
            {sortBy !== 'Itens' && (
              <div className="flex flex-col ml-6 shrink-0 justify-end">
                 <div className="w-[48px] h-[32px] bg-white border border-gray-300 rounded-[6px] flex items-center justify-center text-[9px] font-bold shadow-sm text-gray-500 uppercase tracking-wider text-center leading-[1.1] select-none">
                   {calcMethod}<br/>{rowEntityLabel}
                 </div>
              </div>
            )}
          </div>

          <div className="flex flex-col relative z-10 pb-6">
            {Object.entries(groupedStudents).map(([turmaName, students], tIdx) => (
              <React.Fragment key={tIdx}>
                {isGroupRowsActive && (
                  <div className="flex items-center mt-6 mb-2 sticky left-0 z-40 w-max">
                    <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-md text-[12px] uppercase tracking-wider shadow-sm border border-gray-200">{turmaName}</span>
                  </div>
                )}
                <div className="flex flex-col gap-1.5">
                  {students.map((student, sIdx) => {
                    return (
                      <div key={sIdx} className="flex items-center rounded-l-[8px] transition-colors pr-4 relative">
                        {sortBy === 'Itens' ? (
                          <div className="w-[220px] shrink-0"></div>
                        ) : (
                          <button 
                            onClick={() => onOpenModal('student', student.name)}
                            className="w-[220px] shrink-0 bg-white border border-gray-300 rounded-[6px] py-1.5 px-3 text-[11px] font-bold text-[#1D2432] shadow-sm truncate flex items-center gap-2 select-none group hover:border-[#008BC9] hover:text-[#008BC9] hover:shadow-md transition-all active:scale-[0.98]" 
                            title={student.name}
                          >
                            <span className="truncate flex-1 text-left">
                              {student.name}
                            </span>
                          </button>
                        )}
                        
                        <div className={`flex ${isGroupColsActive ? 'gap-[80px]' : 'gap-3'} ml-3`}>
                          {displayColGroups.map((group, gIdx) => {
                            return (
                              <div key={gIdx} className="flex gap-1">
                                {group.cols.map((col, cIdx) => {
                                  const val = student.data[col.originalIndex];
                                  const stColor = statusColors[val] || statusColors['null'];
                                  const faded = isColOpacated(col);

                                  return (
                                    <div 
                                      key={cIdx} 
                                      onMouseEnter={(e) => handleCellMouseEnter(e, student.name, col, val)}
                                      onMouseLeave={handleCellMouseLeave}
                                      onClick={() => onOpenModal('details', { student, col })}
                                      className={`w-[32px] h-[32px] rounded-[1px] border cursor-pointer transition-all duration-300 ${faded ? 'opacity-[0.16]' : 'hover:scale-125 hover:shadow-lg hover:z-30 hover:border-gray-800 relative'}`}
                                      style={{ backgroundColor: stColor.bg, borderColor: stColor.border }}
                                    ></div>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                        
                        {/* DADO DA ENTIDADE (EXTREMA DIREITA) */}
                        {sortBy !== 'Itens' ? (
                          <div className="ml-6 shrink-0 flex items-center">
                            {(() => {
                              const val = studentTotals[student.name];
                              let bg = statusColors.branco.bg;
                              if (val !== '-' && val !== null) bg = getGradientColor(val);
                              
                              return (
                                <div 
                                  className="w-[48px] h-[32px] rounded-[6px] border border-black/10 flex items-center justify-center text-[11px] font-bold text-[#1D2432] shadow-sm transition-all duration-300 select-none"
                                  style={{ backgroundColor: bg }}
                                >
                                  {val}{val !== '-' ? '%' : ''}
                                </div>
                              );
                            })()}
                          </div>
                        ) : (
                          <div className="ml-6 w-[48px] shrink-0"></div>
                        )}
                        
                      </div>
                    );
                  })}
                </div>
                {isGroupRowsActive && <div className="h-[20px]"></div>}
              </React.Fragment>
            ))}
          </div>

          {sortBy !== 'Alunos' && (
            <div className="flex items-center mt-2 border-t border-gray-200 pt-3">
              <div className="w-[220px] shrink-0 text-[11px] font-bold text-gray-500 text-right pr-4 uppercase select-none">
                {calcMethod} Geral
              </div>
              <div className={`flex ${isGroupColsActive ? 'gap-[80px]' : 'gap-3'} ml-3`}>
                {displayColGroups.map((group, gIdx) => {
                  return (
                    <div key={gIdx} className="flex gap-1">
                      {group.cols.map((col, cIdx) => {
                        const totalVal = dynamicTotals[col.originalIndex];
                        const faded = isColOpacated(col);
                        
                        let bg = statusColors.branco.bg; 
                        if (totalVal !== '-' && totalVal !== null) {
                          bg = getGradientColor(totalVal);
                        }
                        if (faded) bg = '#E5E7EB';

                        return (
                          <div 
                            key={cIdx} 
                            className={`w-[32px] h-[28px] rounded-[4px] flex items-center justify-center text-[10px] font-bold text-[#1D2432] transition-all duration-300 border border-black/10 select-none ${faded ? 'opacity-30 border-transparent text-gray-400' : 'shadow-sm'}`}
                            style={{ backgroundColor: bg }}
                          >
                            {totalVal}{totalVal !== '-' ? '%' : ''}
                          </div>
                        )
                      })}
                    </div>
                  )
                })}
              </div>
              
              {/* TOTAL GERAL DA MATRIZ (EXTREMA DIREITA / CANTO INFERIOR) */}
              <div className="ml-6 shrink-0 flex items-center">
                {(() => {
                  const val = overallTotal;
                  let bg = statusColors.branco.bg;
                  if (val !== '-' && val !== null) bg = getGradientColor(val);
                  
                  return (
                    <div 
                      className="w-[48px] h-[28px] rounded-[4px] border border-black/10 flex items-center justify-center text-[11px] font-bold text-[#1D2432] shadow-sm transition-all duration-300 select-none ring-2 ring-white"
                      style={{ backgroundColor: bg }}
                      title={`${calcMethod} de toda a matriz`}
                    >
                      {val}{val !== '-' ? '%' : ''}
                    </div>
                  );
                })()}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
