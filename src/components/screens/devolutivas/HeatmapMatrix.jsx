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
  activeSkill
}) {

  const isColOpacated = (col) => {
    if (!activeSkill) return false;
    return !col.skills.includes(activeSkill);
  };

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
        <div className={`${showSkills ? 'pt-[64px]' : 'pt-4'} pb-[120px] pl-[80px] md:pl-[120px] pr-[120px] w-max h-max transition-all duration-300`}>
          <div className="inline-block transition-transform duration-200 origin-top-left" style={{ transform: `scale(${zoomLevel})` }}>

            {/* Header Dinâmico do Heatmap */}
            <div className="flex mb-3 sticky top-0 z-20">
              <div className="w-[180px] shrink-0 sticky left-0 md:left-[344px] z-30"></div>
              {displayColGroups.map((group, gIdx) => (
                <div key={gIdx} className={`flex flex-col first:ml-0 ${isColsSeparated ? 'ml-[80px]' : 'ml-3'}`}>
                  {isColsSeparated && (
                    <div className="border border-gray-300 rounded-none bg-white mb-2 py-1 px-2 flex items-center justify-center gap-1.5 shadow-sm relative group animate-fade-slide">
                      <span className="text-[10px] font-bold text-gray-700 truncate max-w-[120px] select-none">{group.title}</span>
                      <Info size={12} className="text-gray-400 cursor-pointer hover:text-[#008BC9]" />
                    </div>
                  )}
                  <div className="flex gap-1">
                    {group.cols.map((col, cIdx) => {
                      const faded = isColOpacated(col);
                      return (
                        <div key={cIdx} className={`w-[32px] h-[32px] bg-white border rounded-none flex items-center justify-center text-[10px] font-bold transition-all duration-300 shadow-sm select-none ${faded ? 'opacity-30 border-gray-200 text-gray-400' : 'border-gray-300 text-[#1D2432]'}`}>
                          {col.id}
                        </div>
                      )
                    })}
                  </div>
                </div>
              ))}

              {/* Header da Escala por Linha */}
              <div className="flex flex-col ml-[80px] shrink-0 sticky right-0 z-30">
                <div className="border border-[#008BC9] rounded-none bg-[#D9F0FC] mb-2 py-1 px-4 flex items-center justify-center gap-1.5 shadow-sm">
                  <span className="text-[10px] font-bold text-[#003A79] uppercase">{calcMethod} Geral</span>
                </div>
                <div className="flex items-center justify-center w-[100px] h-[32px] bg-white border border-gray-300 rounded-none text-gray-500 text-[10px] font-bold shadow-sm">
                  Escala / {levelLabels[navLevel].slice(0, -1)}
                </div>
              </div>
            </div>

            {/* Matriz de Alunos e Cores */}
            <div className={`flex flex-col relative z-10 pb-6 ${isRowsSeparated ? 'gap-[80px]' : 'gap-1.5'}`}>
              {displayStudents.map((student, sIdx) => (
                <div key={sIdx} className="flex flex-col">
                  {isRowsSeparated && (
                    <div className="text-[12px] font-bold text-gray-500 mb-2 uppercase tracking-wide sticky left-0 md:left-[344px] z-20">
                      {student.name}
                    </div>
                  )}
                  <div className="flex items-center rounded-l-[8px] transition-all duration-300 pr-4 relative">
                    <div className="w-[180px] shrink-0 bg-white border border-gray-200 rounded-none py-1.5 px-3 text-[11px] font-bold text-[#1D2432] shadow-sm sticky left-0 md:left-[352px] z-20 truncate flex items-center gap-2 select-none group" title={student.name}>
                      {navLevel < 4 && (
                        <input
                          type="checkbox"
                          checked={selectedRows.has(student.name)}
                          onChange={(e) => { e.stopPropagation(); toggleRow(student.name); }}
                          className="w-4 h-4 rounded-[4px] border-gray-300 text-[#008BC9] focus:ring-[#008BC9] cursor-pointer"
                        />
                      )}
                      <span
                        className={`truncate transition-colors ${navLevel < 4 && !isCombinedView ? 'hover:text-[#008BC9] cursor-pointer underline decoration-dotted underline-offset-4' : ''}`}
                        onClick={() => { if (!isCombinedView && navLevel < 4) drillDown(student.name) }}
                      >
                        {student.name}
                      </span>
                      {navLevel < 4 && !isCombinedView && <ChevronRight size={12} className="opacity-0 group-hover:opacity-100 transition-opacity text-[#008BC9]" />}
                    </div>

                    {displayColGroups.map((group, gIdx) => (
                      <div key={gIdx} className={`flex gap-1 first:ml-0 ${isColsSeparated ? 'ml-[80px]' : 'ml-3'}`}>
                        {group.cols.map((col, cIdx) => {
                          const val = student.data[col.globalIndex];
                          let stColor = isColorsActive ? { ...statusColors[val] } : { bg: '#E5E7EB', border: '#D1D5DB' };

                          if (isColorsActive && colorTheme === 'colorblind') {
                            if (val === 'suficiente') { stColor.bg = '#0072B2'; stColor.border = '#005a8d'; }
                            if (val === 'parcialmente') { stColor.bg = '#F0E442'; stColor.border = '#d1c63a'; }
                            if (val === 'insuficiente') { stColor.bg = '#D55E00'; stColor.border = '#a34800'; }
                            if (val === 'sem_conteudo') { stColor.bg = '#CCCCCC'; stColor.border = '#aaaaaa'; }
                          }

                          const faded = isColOpacated(col);

                          return (
                            <div
                              key={cIdx}
                              onMouseEnter={(e) => handleCellMouseEnter(e, student.name, col, val)}
                              onMouseLeave={handleCellMouseLeave}
                              className={`w-[32px] h-[32px] rounded-none border cursor-pointer transition-all duration-300 ${faded ? 'opacity-[0.16]' : 'hover:scale-125 hover:shadow-lg hover:z-30 hover:border-gray-800 relative'}`}
                              style={{ backgroundColor: stColor.bg, borderColor: stColor.border }}
                            ></div>
                          )
                        })}
                      </div>
                    ))}

                    {/* Coluna de Escala por Linha */}
                    <div className="flex items-center ml-[80px] shrink-0 sticky right-0 z-20">
                      {(() => {
                        const values = student.data.map(k => statusColors[k].val).filter(v => v !== null);
                        let res = '-';
                        if (values.length > 0) {
                          if (calcMethod === 'Média') res = Math.round(values.reduce((a, b) => a + b, 0) / values.length);
                          else if (calcMethod === 'Mediana') {
                            const s = [...values].sort((a, b) => a - b);
                            const m = Math.floor(s.length / 2);
                            res = s.length % 2 !== 0 ? s[m] : Math.round((s[m - 1] + s[m]) / 2);
                          } else {
                            const f = {}; let mf = 0; let mo = values[0];
                            values.forEach(v => { f[v] = (f[v] || 0) + 1; if (f[v] > mf) { mf = f[v]; mo = v; } });
                            res = mo;
                          }
                        }
                        const bg = getColorFromGradient(res, isColorsActive, colorTheme);
                        return (
                          <div
                            className="w-[100px] h-[32px] rounded-none border border-gray-300 flex items-center justify-center text-[11px] font-extrabold text-[#1D2432] shadow-sm transition-all duration-300"
                            style={{ backgroundColor: bg }}
                          >
                            {res}{res !== '-' ? '%' : ''}
                          </div>
                        );
                      })()}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Rodapé Dinâmico de Totais */}
            <div className="flex items-center mt-2 border-t border-gray-200 pt-3">
              <div className="w-[180px] shrink-0 sticky left-0 md:left-[344px] z-20 text-[11px] font-bold text-gray-400 text-right pr-4 uppercase select-none">
                {calcMethod} Geral
              </div>
              {displayColGroups.map((group, gIdx) => (
                <div key={gIdx} className={`flex gap-1 first:ml-0 ${isColsSeparated ? 'ml-[80px]' : 'ml-3'}`}>
                  {group.cols.map((col, cIdx) => {
                    const totalVal = col.totalVal;
                    const faded = isColOpacated(col);
                    let bg = getColorFromGradient(totalVal, isColorsActive, colorTheme);

                    return (
                      <div
                        key={cIdx}
                        className={`w-[32px] h-[28px] rounded-none flex items-center justify-center text-[10px] font-bold text-[#1D2432] transition-all duration-300 border border-gray-300 select-none ${faded ? 'opacity-30 border-transparent text-gray-400' : 'shadow-sm'}`}
                        style={{ backgroundColor: faded ? '#E5E7EB' : bg }}
                      >
                        {totalVal}{totalVal !== '-' ? '%' : ''}
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
