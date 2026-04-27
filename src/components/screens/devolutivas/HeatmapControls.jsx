import React from 'react';
import { 
  ChevronLeft, ChevronRight, LayoutList, X, MousePointer2, Move, ZoomIn, ZoomOut, Maximize, 
  Columns, Rows, Palette 
} from 'lucide-react';

export default function HeatmapControls({
  showSkills, canScrollSkillsLeft, canScrollSkillsRight, scrollSkills, skillsScrollRef,
  skillsList, activeSkill, setActiveSkill,
  
  showLegendPopover, setShowLegendPopover,
  colorTheme, setColorTheme,
  isColorsActive, setIsColorsActive,
  isPanMode, setIsPanMode,
  handleZoom, handleFitScreen,
  
  isColsSeparated, setIsColsSeparated,
  isRowsSeparated, setIsRowsSeparated,
  activeBottomPanel, setActiveBottomPanel,
  
  navLevel, selectedRows, isCombinedView, setIsCombinedView
}) {
  return (
    <>
      {/* PAINEL FLUTUANTE SUPERIOR: Destacar Habilidades */}
      {showSkills && (
        <div className="absolute top-4 left-4 right-4 md:left-[360px] md:right-6 bg-white/95 backdrop-blur-md rounded-xl border border-gray-200 flex items-center px-4 py-3 gap-4 z-30 shadow-[0_8px_30px_rgb(0,0,0,0.12)] animate-fade-slide">
          <span className="font-bold text-[12px] text-gray-700 whitespace-nowrap shrink-0">Destacar Habilidade:</span>
          <div className="flex items-center w-full relative overflow-hidden h-[34px]">
            {canScrollSkillsLeft && (
              <div className="absolute left-0 top-0 bottom-0 z-10 bg-gradient-to-r from-white via-white/90 to-transparent pr-6 flex items-center">
                <button onClick={() => scrollSkills('left')} className="p-1 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-[#008BC9] transition-colors">
                  <ChevronLeft size={16} />
                </button>
              </div>
            )}
            <div ref={skillsScrollRef} className="flex gap-2 overflow-hidden w-full items-center px-2 py-1 h-full">
              {skillsList.map((skill) => (
                <button
                  key={skill}
                  onClick={() => setActiveSkill(activeSkill === skill ? null : skill)}
                  className={`flex items-center gap-1 px-3 py-1.5 rounded-[6px] text-[11px] font-bold transition-all border shrink-0 shadow-sm outline-none ${activeSkill === skill ? 'bg-[#94CFEF] text-[#003A79] border-[#008BC9] scale-[1.02]' : 'bg-white text-gray-600 hover:bg-gray-50 border-gray-300'}`}
                >
                  {skill}
                </button>
              ))}
            </div>
            {canScrollSkillsRight && (
              <div className="absolute right-0 top-0 bottom-0 z-10 bg-gradient-to-l from-white via-white/90 to-transparent pl-6 flex items-center">
                <button onClick={() => scrollSkills('right')} className="p-1 rounded-full bg-white shadow-md border border-gray-200 text-gray-600 hover:text-[#008BC9] transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CONTROLES FLUTUANTES (Direita) */}
      <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-40 shadow-xl bg-white/90 backdrop-blur-md rounded-[10px] border border-gray-200 p-1.5">
        <div className="relative group">
          <button
            onClick={() => setShowLegendPopover(!showLegendPopover)}
            className={`p-2 rounded-[6px] transition-colors ${showLegendPopover ? 'bg-[#008BC9] text-white shadow-inner' : 'text-gray-500 hover:text-[#008BC9] hover:bg-gray-100'}`}
            title="Escala de Desempenho"
          >
            <LayoutList size={16} />
          </button>
          {showLegendPopover && (
            <div className="absolute right-[calc(100%+12px)] top-0 bg-white rounded-xl shadow-2xl border border-gray-200 w-[260px] p-5 z-50 animate-fade-slide">
              <div className="flex justify-between items-center mb-4">
                <h3 className="font-bold text-[13px] text-[#1D2432]">Escala de Desempenho</h3>
                <X size={14} className="text-gray-400 cursor-pointer" onClick={() => setShowLegendPopover(false)} />
              </div>
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <div className={`w-full h-3 rounded-full shadow-inner border border-gray-200/50 ${colorTheme === 'colorblind' && isColorsActive ? 'bg-gradient-to-r from-white via-[#CCCCCC] via-[#D55E00] via-[#F0E442] to-[#0072B2]' : isColorsActive ? 'bg-gradient-to-r from-white via-[#B3E6F5] via-[#FF6961] via-[#F8D66D] to-[#8CD47E]' : 'bg-gray-200'}`}></div>
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 px-0.5">
                    <span>0%</span><span>25%</span><span>50%</span><span>75%</span><span>100%</span>
                  </div>
                </div>
                <p className="text-[11px] text-gray-500 leading-relaxed italic">
                  * O degradê representa a variação do desempenho médio/mediana/moda calculada para cada item e linha do heatmap.
                </p>
              </div>
            </div>
          )}
        </div>
        <div className="w-full h-[1px] bg-gray-200 my-0.5"></div>
        <button onClick={() => setIsPanMode(!isPanMode)} className={`p-2 rounded-[6px] transition-colors ${isPanMode ? 'bg-[#008BC9] text-white shadow-inner' : 'text-gray-500 hover:text-[#008BC9] hover:bg-gray-100'}`} title="Arrastar/Mover Heatmap">
          {isPanMode ? <MousePointer2 size={16} /> : <Move size={16} />}
        </button>
        <div className="w-full h-[1px] bg-gray-200 my-0.5"></div>
        <button onClick={() => handleZoom(0.2)} className="p-2 text-gray-500 hover:text-[#008BC9] hover:bg-gray-100 rounded-[6px] transition-colors" title="Aumentar Zoom"><ZoomIn size={16} /></button>
        <button onClick={() => handleZoom(-0.2)} className="p-2 text-gray-500 hover:text-[#008BC9] hover:bg-gray-100 rounded-[6px] transition-colors" title="Diminuir Zoom"><ZoomOut size={16} /></button>
        <div className="w-full h-[1px] bg-gray-200 my-0.5"></div>
        <button onClick={handleFitScreen} className="p-2 text-gray-500 hover:text-[#008BC9] hover:bg-gray-100 rounded-[6px] transition-colors" title="Ajustar à Tela"><Maximize size={16} /></button>
      </div>

      {/* CONTROLES FLUTUANTES (Inferior Centro) */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-3 z-40">
        <button onClick={() => setIsColsSeparated(!isColsSeparated)} className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border transition-colors ${isColsSeparated ? 'border-[#008BC9] text-[#008BC9] ring-2 ring-[#D9F0FC]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`} title="Separar por Colunas">
          <Columns size={18} />
        </button>

        <button onClick={() => setIsRowsSeparated(!isRowsSeparated)} className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border transition-colors ${isRowsSeparated ? 'border-[#008BC9] text-[#008BC9] ring-2 ring-[#D9F0FC]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`} title="Separar por Linhas">
          <Rows size={18} />
        </button>

        <div className="relative">
          <button onClick={() => setActiveBottomPanel(activeBottomPanel === 'palette' ? null : 'palette')} className={`flex items-center justify-center w-10 h-10 md:w-12 md:h-12 bg-white/95 backdrop-blur-md rounded-xl shadow-xl border transition-colors ${activeBottomPanel === 'palette' ? 'border-[#008BC9] text-[#008BC9] ring-2 ring-[#D9F0FC]' : 'border-gray-200 text-gray-600 hover:border-gray-300'}`} title="Paleta de Cores">
            <Palette size={18} />
          </button>
          {activeBottomPanel === 'palette' && (
            <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-2xl border border-gray-200 p-2 min-w-[200px] animate-fade-slide z-50">
              <div className="flex flex-col gap-1">
                <button onClick={() => { setColorTheme('default'); setIsColorsActive(true); }} className={`flex items-center gap-3 p-2 rounded-lg text-[12px] font-bold transition-colors ${colorTheme === 'default' && isColorsActive ? 'bg-[#D9F0FC] text-[#003A79]' : 'hover:bg-gray-50'}`}>
                  <div className="w-4 h-4 rounded-full bg-[#8CD47E]"></div> Padrão (Semântico)
                </button>
                <button onClick={() => { setColorTheme('colorblind'); setIsColorsActive(true); }} className={`flex items-center gap-3 p-2 rounded-lg text-[12px] font-bold transition-colors ${colorTheme === 'colorblind' ? 'bg-[#D9F0FC] text-[#003A79]' : 'hover:bg-gray-50'}`}>
                  <div className="w-4 h-4 rounded-full bg-[#0072B2]"></div> Modo Daltônico
                </button>
                <button onClick={() => setIsColorsActive(!isColorsActive)} className={`flex items-center gap-3 p-2 rounded-lg text-[12px] font-bold transition-colors ${!isColorsActive ? 'bg-[#D9F0FC] text-[#003A79]' : 'hover:bg-gray-50'}`}>
                  <div className="w-4 h-4 rounded-full bg-gray-300"></div> Escala de Cinza
                </button>
              </div>
            </div>
          )}
        </div>

        {(selectedRows.size >= 2 || (navLevel === 4 && selectedRows.size > 0)) && (
          <button
            onClick={() => setIsCombinedView(!isCombinedView)}
            disabled={navLevel === 4 && selectedRows.size < 2 && !isCombinedView}
            className={`px-6 py-0 h-10 md:h-12 rounded-xl font-bold text-[12px] md:text-[13px] shadow-xl transition-all whitespace-nowrap hidden lg:block tracking-wide scale-105 ring-2 ring-offset-2 animate-bounce-subtle ${isCombinedView ? 'bg-white text-[#008BC9] ring-[#008BC9]' : 'bg-[#008BC9] text-white ring-[#008BC9] hover:bg-[#003A79]'} ${(navLevel === 4 && selectedRows.size < 2 && !isCombinedView) ? 'opacity-50 cursor-not-allowed bg-gray-400 ring-gray-400 grayscale' : ''}`}
          >
            {isCombinedView ? 'VOLTAR AO MAPA GERAL' : `VISUALIZAR COMBINAÇÃO (${selectedRows.size})`}
          </button>
        )}
      </div>
    </>
  );
}
