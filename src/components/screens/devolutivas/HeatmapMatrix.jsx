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
  activeSkill, dynamicTotals, colGroupingCriteria
}) {

  const isColOpacated = (col) => {
    if (!showSkills || !activeSkill) return false;
    return !col.skills.includes(activeSkill);
  };

  const groupedStudents = React.useMemo(() => {
    if (!isRowsSeparated) return { 'Todos os Alunos': displayStudents };
    return displayStudents.reduce((acc, student) => {
      if (!acc[student.turma]) acc[student.turma] = [];
      acc[student.turma].push(student);
      return acc;
    }, {});
  }, [displayStudents, isRowsSeparated]);

  return (
    <div
      ref={containerRef}
      className={`absolute inset-0 overflow-auto hide-scrollbar ${isPanMode ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : ''}`}
      onMouseDown={handleMouseDown} onMouseMove={handleMouseMove} onMouseUp={handleMouseUpOrLeave} onMouseLeave={handleMouseUpOrLeave}
    >
      {mainTab === 'heatmap' && (
        <div className={`pt-[200px] pb-[800px] pl-[50px] md:pl-[500px] pr-[1000px] w-max h-max ${showSkills ? 'mt-[60px] md:mt-[80px]' : ''}`}>
          <div className="inline-block transition-transform duration-200 origin-top-left" style={{ transform: `scale(${zoomLevel})` }}>

            {/* Header: Column groups + IDs */}
            <div className="flex mb-3">
              <div className="w-[180px] shrink-0"></div>
              <div className={`flex ${isColsSeparated ? 'gap-[80px]' : 'gap-1'} ml-3`}>
                {colGroups.map((group, gIdx) => (
                  <div key={gIdx} className="flex flex-col">
                    {isColsSeparated && (
                      <div className="border border-gray-300 rounded-[6px] bg-white mb-2 py-1 px-2 flex items-center justify-center gap-1.5 shadow-sm relative group">
                        <span className="text-[10px] font-bold text-gray-700 truncate max-w-[150px] select-none">
                          {group.title}
                        </span>
                        <Info size={12} className="text-gray-400 cursor-pointer hover:text-[#008BC9]" />
                      </div>
                    )}
                    <div className="flex gap-1">
                      {group.cols.map((col, cIdx) => {
                        const faded = isColOpacated(col);
                        return (
                          <div key={cIdx} className={`w-[32px] h-[32px] bg-white border rounded-[6px] flex items-center justify-center text-[10px] font-bold transition-opacity duration-300 shadow-sm select-none ${faded ? 'opacity-30 border-gray-200 text-gray-400' : 'border-gray-300 text-[#1D2432]'}`}>
                            {col.id}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Matrix: Student Rows grouped by Turma */}
            <div className="flex flex-col relative z-10 pb-6">
              {Object.entries(groupedStudents).map(([turmaName, students], tIdx) => (
                <React.Fragment key={tIdx}>
                  <div className="flex flex-col gap-1.5">
                    {isRowsSeparated && (
                      <div className="flex items-center mt-4 mb-0 sticky left-0 z-40 w-max">
                        <span className="bg-gray-100 text-gray-600 font-bold px-3 py-1 rounded-md text-[12px] uppercase tracking-wider shadow-sm border border-gray-200">
                          {turmaName}
                        </span>
                      </div>
                    )}
                    {students.map((student, sIdx) => (
                      <div key={sIdx} className="flex items-center rounded-l-[8px] transition-colors pr-4 relative">
                        <div className="w-[180px] shrink-0 bg-white border border-gray-300 rounded-[6px] py-1.5 px-3 text-[11px] font-bold text-[#1D2432] shadow-sm truncate flex items-center select-none" title={student.name}>
                          {student.name}
                        </div>
                        <div className={`flex ${isColsSeparated ? 'gap-[80px]' : 'gap-1'} ml-3`}>
                          {colGroups.map((group, gIdx) => {
                            const flatIndexOffset = colGroups.slice(0, gIdx).reduce((acc, curr) => acc + curr.cols.length, 0);
                            return (
                              <div key={gIdx} className="flex gap-1">
                                {group.cols.map((col, cIdx) => {
                                  const val = student.data[flatIndexOffset + cIdx];
                                  const stColor = statusColors[val] || statusColors['null'];
                                  const faded = isColOpacated(col);

                                  return (
                                    <div
                                      key={cIdx}
                                      onMouseEnter={(e) => handleCellMouseEnter(e, student.name, col, val)}
                                      onMouseLeave={handleCellMouseLeave}
                                      className={`w-[32px] h-[32px] rounded-[1px] border cursor-pointer transition-all duration-300 ${faded ? 'opacity-[0.16]' : 'hover:scale-125 hover:shadow-lg hover:z-30 hover:border-gray-800 relative'}`}
                                      style={{ backgroundColor: stColor.bg, borderColor: stColor.border }}
                                    ></div>
                                  )
                                })}
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                  {isRowsSeparated && <div className="h-[20px]"></div>}
                </React.Fragment>
              ))}
            </div>

            {/* Footer: Dynamic Totals */}
            <div className="flex items-center mt-2 border-t border-gray-200 pt-3">
              <div className="w-[180px] shrink-0 text-[11px] font-bold text-gray-500 text-right pr-4 uppercase select-none">
                {calcMethod} Geral
              </div>
              <div className={`flex ${isColsSeparated ? 'gap-[80px]' : 'gap-1'} ml-3`}>
                {colGroups.map((group, gIdx) => {
                  const flatIndexOffset = colGroups.slice(0, gIdx).reduce((acc, curr) => acc + curr.cols.length, 0);
                  return (
                    <div key={gIdx} className="flex gap-1">
                      {group.cols.map((col, cIdx) => {
                        const totalVal = dynamicTotals[flatIndexOffset + cIdx];
                        const faded = isColOpacated(col);

                        let bg = statusColors['1'].bg; // Default yellow
                        if (totalVal !== '-' && totalVal < 40) bg = statusColors['0'].bg;
                        if (totalVal !== '-' && totalVal > 80) bg = statusColors['2'].bg;
                        if (totalVal === '-' || totalVal === 0) bg = statusColors['null'].bg;
                        if (faded) bg = '#E5E7EB';

                        return (
                          <div
                            key={cIdx}
                            className={`w-[32px] h-[28px] rounded-[1px] flex items-center justify-center text-[10px] font-bold text-[#1D2432] transition-all duration-300 border border-gray-300 select-none ${faded ? 'opacity-30 border-transparent text-neutral-4' : 'shadow-sm'}`}
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
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
