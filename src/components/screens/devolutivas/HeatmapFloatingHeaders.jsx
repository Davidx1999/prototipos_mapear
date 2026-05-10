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
  setFocalTurma
}) {
  return (
    <>
      {/* PAINEL FLUTUANTE SUPERIOR: Destacar Habilidades */}
      {showSkills && (
        <div className="absolute top-2 left-4 right-4 md:left-[352px] md:right-6 bg-white/95 backdrop-blur-md rounded-[8px] border border-gray-200 flex items-center px-4 py-3 gap-2 z-40 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-fade-slide">
          <span className="font-bold text-[12px] text-gray-700 whitespace-nowrap shrink-0">Destacar Habilidade:</span>

          <div className="flex items-center w-full relative h-[34px]">
            {canScrollSkillsLeft && (
              <div className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-white via-white/90 to-transparent pr-8 flex items-center transition-opacity">
                <button onClick={() => scrollSkills('left')} className="p-1 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-[#008BC9] transition-colors"><ChevronLeft size={20} /></button>
              </div>
            )}

            <div ref={skillsScrollRef} onScroll={checkSkillsScroll} className="flex gap-2 overflow-x-auto hide-scrollbar w-full items-center py-1 h-full px-2 scroll-smooth">
              {skillsList.map((skillName) => {
                const skill = SKILL_DETAILS[skillName] || { code: '??', description: 'Sem descrição' };
                return (
                  <button
                    key={skillName}
                    onClick={() => setActiveSkill(activeSkill === skillName ? null : skillName)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-[6px] text-[11px] font-bold transition-all border shrink-0 shadow-sm outline-none group ${activeSkill === skillName ? 'bg-[#94CFEF] text-[#003A79] border-[#008BC9] scale-[1.02]' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'}`}
                  >
                    <span className="shrink-0">{skill.code}</span>
                    <div
                      onMouseEnter={(e) => handleSkillInfoEnter(e, skillName, skill.description)}
                      onMouseLeave={() => setSkillTooltip(null)}
                      className="p-0.5 -m-0.5"
                    >
                      <Info size={20} className={`shrink-0 transition-colors ${activeSkill === skillName ? 'text-[#003A79]' : 'text-gray-400 group-hover:text-[#008BC9]'}`} />
                    </div>
                  </button>
                );
              })}
            </div>

            {canScrollSkillsRight && (
              <div className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-white via-white/90 to-transparent pl-8 flex items-center transition-opacity">
                <button onClick={() => scrollSkills('right')} className="p-1 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-[#008BC9] transition-colors"><ChevronRight size={20} /></button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* PAINEL FLUTUANTE SUPERIOR: Navegação de Turmas (Segmented Button) */}
      {isTestSelected && availableTurmas.length > 1 && (
        <div
          className={`absolute left-4 md:left-[352px] z-40 transition-all duration-300 flex items-center bg-white/90 backdrop-blur-sm p-1 rounded-[8px] border border-gray-200 shadow-lg`}
          style={{ top: showSkills ? '94px' : '8px' }}
        >
          {(() => {
            const limit = 5;
            const showAll = availableTurmas.length <= limit;

            if (showAll) {
              return ['Todas', ...availableTurmas].map(t => (
                <button
                  key={t}
                  onClick={() => setFocalTurma(t)}
                  className={`px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all whitespace-nowrap ${focalTurma === t ? 'bg-[#008BC9] text-white shadow-md scale-105' : 'text-gray-500 hover:bg-gray-100'}`}
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
                  <button onClick={() => setFocalTurma('Todas')} className={`px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${focalTurma === 'Todas' ? 'bg-[#008BC9] text-white shadow-md scale-105' : 'text-gray-500 hover:bg-gray-100'}`}>Todas</button>
                  <button onClick={() => setFocalTurma(first)} className={`px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${focalTurma === first ? 'bg-[#008BC9] text-white shadow-md scale-105' : 'text-gray-500 hover:bg-gray-100'}`}>{first}</button>

                  <div className="flex items-center gap-1">
                    {(() => {
                      const isMiddleSelected = middleTurmas.includes(focalTurma);
                      return (
                        <>
                          {isMiddleSelected && (
                            <button className="px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all bg-[#008BC9] text-white shadow-md scale-105 whitespace-nowrap">{focalTurma}</button>
                          )}
                          <div className="relative group px-1">
                            <button className={`px-3 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${isMiddleSelected ? 'text-[#008BC9] bg-[#D9F0FC]' : 'text-gray-500 hover:bg-gray-100'}`}>...</button>
                            <div className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[200px] bg-white border border-gray-200 rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all py-2 z-50">
                              <div className="max-h-[200px] overflow-y-auto px-2 flex flex-col gap-1">
                                {middleTurmas.map(t => (
                                  <button key={t} onClick={() => setFocalTurma(t)} className={`w-full text-left px-3 py-2 rounded-lg text-[12px] font-semibold transition-colors ${focalTurma === t ? 'bg-[#D9F0FC] text-[#008BC9]' : 'text-gray-600 hover:bg-gray-50'}`}>{t}</button>
                                ))}
                              </div>
                            </div>
                          </div>
                        </>
                      );
                    })()}
                  </div>

                  <button onClick={() => setFocalTurma(last)} className={`px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${focalTurma === last ? 'bg-[#008BC9] text-white shadow-md scale-105' : 'text-gray-500 hover:bg-gray-100'}`}>{last}</button>
                </>
              );
            }
          })()}
        </div>
      )}
    </>
  );
}
