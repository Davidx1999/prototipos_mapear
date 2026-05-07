import React from 'react';
import {
  X, Move, ZoomIn, ZoomOut, Maximize,
  Columns, Rows, ChevronDown, Palette, Map as MapIcon
} from 'lucide-react';

export default function HeatmapControls({
  showLegendPopover, setShowLegendPopover,
  colorTheme, setColorTheme,
  isColorsActive, setIsColorsActive,
  isPanMode, setIsPanMode,
  handleZoom, handleFitScreen,
  isColsSeparated, setIsColsSeparated,
  isRowsSeparated, setIsRowsSeparated,
  navLevel, selectedRows, isCombinedView, setIsCombinedView,
  activeBottomMenu, setActiveBottomMenu,
  colGroupingCriteria, setColGroupingCriteria
}) {
  return (
    <>
      {/* ── RIGHT SIDE CONTROLS (Move/Zoom/Fit) ── */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
        {/* Move/Pan button */}
        <button
          onClick={() => setIsPanMode(!isPanMode)}
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-lg border ${isPanMode ? 'bg-neutral-0 border-neutral-2 text-neutral-6' : 'bg-neutral-0 border-neutral-2 text-neutral-5 hover:text-primary-base'}`}
          title="Arrastar/Mover"
        >
          <Move size={18} />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => handleZoom(0.2)}
          className="w-10 h-10 bg-neutral-0 rounded-lg shadow-lg border border-neutral-2 flex items-center justify-center text-neutral-5 hover:text-primary-base transition-colors"
          title="Aumentar Zoom"
        >
          <ZoomIn size={18} />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom(-0.2)}
          className="w-10 h-10 bg-neutral-0 rounded-lg shadow-lg border border-neutral-2 flex items-center justify-center text-neutral-5 hover:text-primary-base transition-colors"
          title="Diminuir Zoom"
        >
          <ZoomOut size={18} />
        </button>

        {/* Fit/Reset */}
        <button
          onClick={handleFitScreen}
          className="w-10 h-10 bg-neutral-0 rounded-lg shadow-lg border border-neutral-2 flex items-center justify-center text-neutral-5 hover:text-primary-base transition-colors"
          title="Ajustar à Tela"
        >
          <Maximize size={18} />
        </button>
      </div>

      {/* ── BOTTOM CENTER CONTROLS (Floating centralized bar) ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        
        {/* Combined View Close Button */}
        {isCombinedView && (
          <button
            onClick={() => setIsCombinedView(false)}
            className="flex items-center justify-center w-[44px] h-[44px] bg-white rounded-lg border border-gray-200 text-gray-500 hover:text-red-500 shadow-sm transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* Botão 1: Agrupar por Turmas (Linhas) */}
        <button 
          onClick={() => setIsRowsSeparated(!isRowsSeparated)} 
          className={`flex items-center justify-center w-[44px] h-[44px] bg-white rounded-lg border shadow-sm transition-colors ${isRowsSeparated ? 'border-[#008BC9] text-[#008BC9] bg-[#D9F0FC]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
          title="Agrupar por Turmas"
        >
          <Rows size={20} />
        </button>

        {/* Botão 2: Agrupar por Colunas + Chevron */}
        <div className={`flex items-center bg-white rounded-lg border shadow-sm transition-colors relative ${isColsSeparated || activeBottomMenu === 'cols' ? 'border-[#008BC9]' : 'border-gray-200'}`}>
          <button 
            onClick={() => setIsColsSeparated(!isColsSeparated)} 
            className={`flex items-center justify-center w-[44px] h-[44px] border-r transition-colors rounded-l-lg ${isColsSeparated ? 'text-[#008BC9] bg-[#D9F0FC] border-[#008BC9]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            title="Agrupar Matriz"
          >
            <Columns size={20} />
          </button>
          <button 
            onClick={() => setActiveBottomMenu(activeBottomMenu === 'cols' ? null : 'cols')}
            className={`flex items-center justify-center w-[36px] h-[44px] transition-colors rounded-r-lg ${activeBottomMenu === 'cols' ? 'text-[#008BC9] bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ChevronDown size={16} />
          </button>

          {activeBottomMenu === 'cols' && (
            <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[240px] bg-white border border-gray-200 rounded-xl shadow-xl p-4 animate-fade-slide">
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-3 block">Agrupar Colunas Por</span>
              <div className="flex flex-col gap-2">
                {['Tarefas', 'Domínios Cognitivos', 'Domínios de Repertório', 'Conhecimentos'].map(opt => (
                  <label key={opt} onClick={() => { setColGroupingCriteria(opt); setActiveBottomMenu(null); setIsColsSeparated(true); }} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${colGroupingCriteria === opt ? 'border-[#008BC9]' : 'border-gray-300 group-hover:border-[#008BC9]'}`}>
                      {colGroupingCriteria === opt && <div className="w-2 h-2 bg-[#008BC9] rounded-full"></div>}
                    </div>
                    <span className="text-[13px] font-semibold text-gray-700">{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Botão 3: Temas de Cores + Chevron */}
        <div className={`flex items-center bg-white rounded-lg border shadow-sm transition-colors relative ${isColorsActive || activeBottomMenu === 'colors' ? 'border-[#008BC9]' : 'border-gray-200'}`}>
          <button 
            onClick={() => setIsColorsActive(!isColorsActive)} 
            className={`flex items-center justify-center w-[44px] h-[44px] border-r transition-colors rounded-l-lg ${isColorsActive ? 'text-[#008BC9] bg-[#D9F0FC] border-[#008BC9]' : 'border-gray-200 text-gray-700 hover:bg-gray-50'}`}
            title="Mudar Paleta de Cores"
          >
            <Palette size={20} />
          </button>
          <button 
            onClick={() => setActiveBottomMenu(activeBottomMenu === 'colors' ? null : 'colors')}
            className={`flex items-center justify-center w-[36px] h-[44px] transition-colors rounded-r-lg ${activeBottomMenu === 'colors' ? 'text-[#008BC9] bg-gray-50' : 'text-gray-500 hover:bg-gray-50'}`}
          >
            <ChevronDown size={16} />
          </button>

          {activeBottomMenu === 'colors' && (
            <div className="absolute bottom-[calc(100%+12px)] left-1/2 -translate-x-1/2 w-[240px] bg-white border border-gray-200 rounded-xl shadow-xl p-4 animate-fade-slide">
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-3 block">Paleta de Cores</span>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'default', label: 'Padrão FGV' },
                  { id: 'colorblind', label: 'Acessível (Daltonismo)' },
                  { id: 'monochromatic', label: 'Monocromático' }
                ].map(opt => (
                  <label key={opt.id} onClick={() => { setColorTheme(opt.id); setActiveBottomMenu(null); setIsColorsActive(true); }} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${colorTheme === opt.id ? 'border-[#008BC9]' : 'border-gray-300 group-hover:border-[#008BC9]'}`}>
                      {colorTheme === opt.id && <div className="w-2 h-2 bg-[#008BC9] rounded-full"></div>}
                    </div>
                    <span className="text-[13px] font-semibold text-gray-700">{opt.label}</span>
                  </label>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* VISUALIZAR COMBINAÇÃO button */}
        {(selectedRows.size >= 2 || isCombinedView) && (
          <button
            onClick={() => setIsCombinedView(!isCombinedView)}
            className={`px-8 py-3 rounded-lg font-bold text-[13px] tracking-wide shadow-xl transition-all whitespace-nowrap ${isCombinedView ? 'bg-white text-[#008BC9] border-2 border-[#008BC9]' : 'bg-[#008BC9] text-white hover:bg-[#003A79]'}`}
          >
            {isCombinedView ? 'MAPA GERAL' : 'VISUALIZAR COMBINAÇÃO'}
          </button>
        )}
      </div>
    </>
  );
}
