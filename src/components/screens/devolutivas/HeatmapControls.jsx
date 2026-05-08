import React from 'react';
import {
  X, Move, ZoomIn, ZoomOut, Maximize,
  Columns, Rows, ChevronDown, Palette, Map as MapIcon, Check
} from 'lucide-react';
import SplitButton from '../../ui/SplitButton';
import Button from '../../ui/Button';

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
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-lg border ${
            isPanMode 
              ? 'bg-[#D9F0FC] border-[#008BC9] text-[#003A79] ring-2 ring-[#008BC9]/30' 
              : 'bg-white border-neutral-200 text-neutral-400 hover:text-neutral-600 hover:border-neutral-300'
          }`}
          title={isPanMode ? 'Desativar Modo Arrastar' : 'Ativar Modo Arrastar'}
        >
          <Move size={18} />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => handleZoom(0.2)}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:border-neutral-300 transition-colors"
          title="Aumentar Zoom"
        >
          <ZoomIn size={18} />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom(-0.2)}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:border-neutral-300 transition-colors"
          title="Diminuir Zoom"
        >
          <ZoomOut size={18} />
        </button>

        {/* Fit/Reset */}
        <button
          onClick={handleFitScreen}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-neutral-200 flex items-center justify-center text-neutral-400 hover:text-neutral-600 hover:border-neutral-300 transition-colors"
          title="Ajustar à Tela"
        >
          <Maximize size={18} />
        </button>
      </div>

      {/* ── BOTTOM CENTER CONTROLS (Floating centralized bar) ── */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-4 z-50">
        
        {/* Combined View Close Button */}
        {isCombinedView && (
          <Button
            variant="tertiary"
            appearance="solid"
            size="md"
            iconOnly={true}
            iconLeft={<X />}
            onClick={() => setIsCombinedView(false)}
            className="!h-[44px] !w-[44px] shadow-sm"
          />
        )}

        {/* Botão 1: Agrupar por Turmas (Linhas) */}
        <Button
          variant={isRowsSeparated ? 'secondary' : 'tertiary'}
          appearance="solid"
          size="md"
          iconOnly={true}
          iconLeft={isRowsSeparated ? <X /> : <Rows />}
          onClick={() => setIsRowsSeparated(!isRowsSeparated)}
          className="!h-[44px] !w-[44px] shadow-sm"
          title="Agrupar por Turmas"
        />

        {/* Botão 2: Agrupar por Colunas + Chevron */}
        <div className="relative">
          <SplitButton
            label=""
            icon={<Columns size={20} />}
            activeIcon={<X size={20} />}
            isActive={isColsSeparated}
            variant="tertiary"
            onClick={() => setIsColsSeparated(!isColsSeparated)}
            onChevronClick={() => setActiveBottomMenu(activeBottomMenu === 'cols' ? null : 'cols')}
            isOpen={activeBottomMenu === 'cols'}
            size="md"
            rounded="4px"
          />

          {activeBottomMenu === 'cols' && (
            <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[240px] bg-white border border-gray-200 rounded-xl shadow-xl p-4 animate-fade-slide">
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
        <div className="relative">
          <SplitButton
            label=""
            icon={<Palette size={20} />}
            activeIcon={<X size={20} />}
            isActive={isColorsActive}
            variant="tertiary"
            onClick={() => {
              if (isColorsActive) {
                setIsColorsActive(false);
                setColorTheme('default');
              } else {
                setIsColorsActive(true);
                setColorTheme('colorblind');
              }
            }}
            onChevronClick={() => setActiveBottomMenu(activeBottomMenu === 'colors' ? null : 'colors')}
            isOpen={activeBottomMenu === 'colors'}
            size="md"
            rounded="4px"
          />

          {activeBottomMenu === 'colors' && (
            <div className="absolute bottom-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[240px] bg-white border border-gray-200 rounded-xl shadow-xl p-4 animate-fade-slide">
              <span className="text-[12px] font-bold text-gray-500 uppercase tracking-wide mb-3 block">Paleta de Cores</span>
              <div className="flex flex-col gap-2">
                {[
                  { id: 'default', label: 'Padrão FGV' },
                  { id: 'colorblind', label: 'Acessível (Daltonismo)' },
                  { id: 'monochromatic', label: 'Monocromático' }
                ].map(opt => (
                  <label key={opt.id} onClick={() => { setColorTheme(opt.id); setActiveBottomMenu(null); setIsColorsActive(opt.id !== 'default'); }} className="flex items-center gap-3 cursor-pointer group">
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
          <SplitButton
            label={isCombinedView ? 'MAPA GERAL' : 'VISUALIZAR COMBINAÇÃO'}
            icon={isCombinedView ? <MapIcon size={18} /> : <Check size={18} />}
            activeIcon={<X size={18} />}
            isActive={isCombinedView}
            variant="tertiary"
            onClick={() => setIsCombinedView(!isCombinedView)}
            onChevronClick={() => {}} // Placeholder for options
            isOpen={false}
            size="md"
            rounded="4px"
          />
        )}
      </div>
    </>
  );
}
