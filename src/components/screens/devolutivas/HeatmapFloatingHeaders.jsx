import React from 'react';
import { Info, ChevronLeft, ChevronRight } from 'lucide-react';

export default function HeatmapFloatingHeaders({
  showSkills,
  isLoaded,
  activeSkill,
  setActiveSkill,
  skillsList,
  SKILL_DETAILS,
  canScrollSkillsLeft,
  canScrollSkillsRight,
  scrollSkills,
  skillsScrollRef,
  checkSkillsScroll,
  handleSkillInfoEnter,
  setSkillTooltip,
  isTestSelected,
  availableTurmas,
  focalTurma,
  setFocalTurma,
  isDarkMode = false,
  colors
}) {
  return (
    <>
      {/* PAINEL FLUTUANTE SUPERIOR: Destacar Habilidades */}
      {showSkills && (
        <div 
          className="absolute top-2 left-4 right-4 md:left-[352px] md:right-6 backdrop-blur-md rounded-[8px] border flex items-center px-4 py-3 gap-2 z-40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-fade-slide"
          style={{ backgroundColor: isDarkMode ? 'rgba(43,43,43,0.95)' : 'rgba(255,255,255,0.95)', borderColor: isDarkMode ? colors.neutral[5] : '#E5E7EB' }}
        >
          <span className="font-bold text-[12px] whitespace-nowrap shrink-0" style={{ color: isDarkMode ? colors.neutral[0] : '#374151' }}>Destacar Habilidade:</span>

          <div className="flex items-center w-full relative h-[34px]">
            {canScrollSkillsLeft && (
              <div 
                className="absolute left-0 top-0 bottom-0 z-10 pr-8 flex items-center transition-opacity"
                style={{ background: isDarkMode ? `linear-gradient(to right, ${colors.neutral[6]}, rgba(43,43,43,0.9), transparent)` : 'linear-gradient(to right, #FFFFFF, rgba(255,255,255,0.9), transparent)' }}
              >
                <button onClick={() => scrollSkills('left')} className="p-1 rounded-full shadow-md border transition-colors" style={{ backgroundColor: isDarkMode ? colors.neutral[5] : '#FFFFFF', borderColor: isDarkMode ? colors.neutral[4] : '#E5E7EB', color: isDarkMode ? colors.neutral[1] : '#4B5563' }}><ChevronLeft size={20} /></button>
              </div>
            )}

            <div ref={skillsScrollRef} onScroll={checkSkillsScroll} className="flex gap-2 overflow-x-auto hide-scrollbar w-full items-center py-1 h-full px-2 scroll-smooth">
              {skillsList.map((skillName) => {
                const skill = SKILL_DETAILS[skillName] || { code: '??', description: 'Sem descrição' };
                return (
                  <button
                    key={skillName}
                    onClick={() => setActiveSkill(activeSkill === skillName ? null : skillName)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[11px] font-bold transition-all border shrink-0 shadow-sm outline-none group ${activeSkill === skillName ? 'scale-[1.02]' : ''}`}
                    style={{ 
                      backgroundColor: activeSkill === skillName ? '#94CFEF' : (isDarkMode ? colors.neutral[6] : '#FFFFFF'), 
                      borderColor: activeSkill === skillName ? '#008BC9' : (isDarkMode ? colors.neutral[5] : '#D1D5DB'), 
                      color: activeSkill === skillName ? '#003A79' : (isDarkMode ? colors.neutral[1] : '#4B5563') 
                    }}
                  >
                    <span className="shrink-0">{skill.code}</span>
                    <div
                      onMouseEnter={(e) => handleSkillInfoEnter(e, skillName, skill.description)}
                      onMouseLeave={() => setSkillTooltip(null)}
                      className="p-0.5 -m-0.5"
                    >
                      <Info size={20} className="shrink-0 transition-colors group-hover:text-[#008BC9]" style={{ color: activeSkill === skillName ? '#003A79' : (isDarkMode ? colors.neutral[4] : '#9CA3AF') }} />
                    </div>
                  </button>
                );
              })}
            </div>

            {canScrollSkillsRight && (
              <div 
                className="absolute right-0 top-0 bottom-0 z-10 pl-8 flex items-center transition-opacity"
                style={{ background: isDarkMode ? `linear-gradient(to left, ${colors.neutral[6]}, rgba(43,43,43,0.9), transparent)` : 'linear-gradient(to left, #FFFFFF, rgba(255,255,255,0.9), transparent)' }}
              >
                <button onClick={() => scrollSkills('right')} className="p-1 rounded-full shadow-md border transition-colors" style={{ backgroundColor: isDarkMode ? colors.neutral[5] : '#FFFFFF', borderColor: isDarkMode ? colors.neutral[4] : '#E5E7EB', color: isDarkMode ? colors.neutral[1] : '#4B5563' }}><ChevronRight size={20} /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAINEL FLUTUANTE SUPERIOR: Navegação de Turmas (Segmented Button) */}
      {isTestSelected && availableTurmas.length > 1 && (
        <div
          className="absolute left-4 md:left-[352px] z-40 transition-all duration-300 flex items-center backdrop-blur-sm px-2 py-2 rounded-[8px] border shadow-lg"
          style={{ top: showSkills ? '74px' : '8px', backgroundColor: isDarkMode ? 'rgba(43,43,43,0.9)' : 'rgba(255,255,255,0.9)', borderColor: isDarkMode ? colors.neutral[5] : '#E5E7EB' }}
        >
          {(() => {
            const limit = 5;
            const showAll = availableTurmas.length <= limit;

            if (showAll) {
              return ['Todas', ...availableTurmas].map(t => (
                <button
                  key={t}
                  onClick={() => setFocalTurma(t)}
                  className={`px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all whitespace-nowrap ${focalTurma === t ? 'shadow-md scale-105' : 'hover:opacity-80'}`}
                  style={{ backgroundColor: focalTurma === t ? '#008BC9' : 'transparent', color: focalTurma === t ? '#FFFFFF' : (isDarkMode ? colors.neutral[3] : '#6B7280') }}
                >
                  {t}
                </button>
              ));
            } else {
              const first = availableTurmas[0];
              const last = availableTurmas[availableTurmas.length - 1];
              const middleTurmas = availableTurmas.slice(1, -1);

              return (
                <>
                  <button onClick={() => setFocalTurma('Todas')} className={`px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${focalTurma === 'Todas' ? 'shadow-md scale-105' : 'hover:opacity-80'}`} style={{ backgroundColor: focalTurma === 'Todas' ? '#008BC9' : 'transparent', color: focalTurma === 'Todas' ? '#FFFFFF' : (isDarkMode ? colors.neutral[3] : '#6B7280') }}>Todas</button>
                  <button onClick={() => setFocalTurma(first)} className={`px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${focalTurma === first ? 'shadow-md scale-105' : 'hover:opacity-80'}`} style={{ backgroundColor: focalTurma === first ? '#008BC9' : 'transparent', color: focalTurma === first ? '#FFFFFF' : (isDarkMode ? colors.neutral[3] : '#6B7280') }}>{first}</button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const isMiddleSelected = middleTurmas.includes(focalTurma);
                      return (
                        <>
                          {isMiddleSelected && (
                            <button className="px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all shadow-md scale-105 whitespace-nowrap" style={{ backgroundColor: '#008BC9', color: '#FFFFFF' }}>{focalTurma}</button>
                          )}
                          <div className="relative group px-1">
                            <button className={`px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${isMiddleSelected ? '' : 'hover:opacity-80'}`} style={{ backgroundColor: isMiddleSelected ? '#D9F0FC' : 'transparent', color: isMiddleSelected ? '#008BC9' : (isDarkMode ? colors.neutral[3] : '#6B7280') }}>...</button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[200px] border rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50" style={{ backgroundColor: isDarkMode ? colors.neutral[6] : '#FFFFFF', borderColor: isDarkMode ? colors.neutral[5] : '#E5E7EB' }}>
                              <div className="max-h-[200px] overflow-y-auto px-2 flex flex-col gap-1">
                                {middleTurmas.map(t => (
                                  <button key={t} onClick={() => setFocalTurma(t)} className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors`} style={{ backgroundColor: focalTurma === t ? (isDarkMode ? '#155274' : '#D9F0FC') : 'transparent', color: focalTurma === t ? (isDarkMode ? '#B3E6F5' : '#008BC9') : (isDarkMode ? colors.neutral[2] : '#4B5563') }}>{t}</button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <button onClick={() => setFocalTurma(last)} className={`px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${focalTurma === last ? 'shadow-md scale-105' : 'hover:opacity-80'}`} style={{ backgroundColor: focalTurma === last ? '#008BC9' : 'transparent', color: focalTurma === last ? '#FFFFFF' : (isDarkMode ? colors.neutral[3] : '#6B7280') }}>{last}</button>
                </>
              );
            }
          })()}
        </div>
      )}
    </>
  );
}
