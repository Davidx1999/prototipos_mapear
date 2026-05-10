import React from 'react';
import {
  X, Move, ZoomIn, ZoomOut, Maximize,
  Columns, Rows, ChevronDown, Palette, Map as MapIcon, Check, BarChart2, HelpCircle
} from 'lucide-react';
import SplitButton from '../../ui/SplitButton';
import Button from '../../ui/Button';

export default function HeatmapControls({
  showLegendPopover, setShowLegendPopover,
  showScalePopover, setShowScalePopover,
  colorTheme, setColorTheme,
  isColorsActive, setIsColorsActive,
  isPanMode, setIsPanMode,
  handleZoom, handleFitScreen,
  isColsSeparated, setIsColsSeparated,
  isRowsSeparated, setIsRowsSeparated,
  navLevel, selectedRows, isCombinedView, setIsCombinedView,
  activeBottomMenu, setActiveBottomMenu,
  colGroupingCriteria, setColGroupingCriteria,
  sortBy,
  isTestSelected = false
}) {
  return (
    <>
      {/* ── RIGHT SIDE CONTROLS (Move/Zoom/Fit) ── */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-40">
        {/* Move/Pan button */}
        <Button
          variant={isPanMode ? 'secondary' : 'tertiary'}
          appearance="solid"
          size="md"
          tertiaryTone="high"
          iconOnly={true}
          iconLeft={<Move />}
          onClick={() => setIsPanMode(!isPanMode)}
          disabled={!isTestSelected}
          className={`shadow-lg ${!isTestSelected ? 'opacity-50 grayscale !cursor-not-allowed' : ''}`}
          title={isPanMode ? 'Desativar Modo Arrastar' : 'Ativar Modo Arrastar'}
        />

        {/* Zoom In */}
        <Button
          variant="tertiary"
          appearance="solid"
          size="md"
          tertiaryTone="high"
          iconOnly={true}
          iconLeft={<ZoomIn />}
          onClick={() => handleZoom(0.2)}
          disabled={!isTestSelected}
          className={`shadow-lg ${!isTestSelected ? 'opacity-50 grayscale !cursor-not-allowed' : ''}`}
          title="Aumentar Zoom"
        />

        {/* Zoom Out */}
        <Button
          variant="tertiary"
          appearance="solid"
          size="md"
          tertiaryTone="high"
          iconOnly={true}
          iconLeft={<ZoomOut />}
          onClick={() => handleZoom(-0.2)}
          disabled={!isTestSelected}
          className={`shadow-lg ${!isTestSelected ? 'opacity-50 grayscale !cursor-not-allowed' : ''}`}
          title="Diminuir Zoom"
        />

        {/* Fit/Reset */}
        <Button
          variant="tertiary"
          appearance="solid"
          size="md"
          tertiaryTone="high"
          iconOnly={true}
          iconLeft={<Maximize />}
          onClick={handleFitScreen}
          disabled={!isTestSelected}
          className={`shadow-lg ${!isTestSelected ? 'opacity-50 grayscale !cursor-not-allowed' : ''}`}
          title="Ajustar à Tela"
        />

        {/* Scale/Legend popover button */}
        <div className="relative mt-2">
          <Button
            variant={showScalePopover ? 'secondary' : 'tertiary'}
            appearance="solid"
            size="md"
            tertiaryTone="high"
            iconOnly={true}
            iconLeft={<BarChart2 />}
            onClick={() => setShowScalePopover(!showScalePopover)}
            disabled={!isTestSelected}
            className={`shadow-lg ${!isTestSelected ? 'opacity-50 grayscale !cursor-not-allowed' : ''}`}
            title="Escala de Desempenho"
          />

          {showScalePopover && (
            <div className="absolute right-[calc(100%+4px)] top-0 w-[240px] bg-white border border-gray-200 rounded-[4px] shadow-xl p-4 animate-fade-slide">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-[13px] text-[#1D2432]">Escala de Desempenho</h3>
                <Button
                  variant="tertiary"
                  appearance="ghost"
                  size="xs"
                  tertiaryTone="low"
                  iconOnly={true}
                  iconLeft={<HelpCircle />}
                  title="Cores para a escala de desempenho médio."
                />
              </div>
              <div className="flex flex-col gap-1 mt-2">
                <div className="w-full h-3 rounded-full shadow-inner border border-gray-200" style={{ background: 'linear-gradient(to right, #FFFFFF 5%, #B3E6F5 25%, #FF6961 50%, #F8D66D 75%, #8CD47E 95%)' }}></div>
                <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 mt-1">
                  <span>0%</span>
                  <span>25%</span>
                  <span>50%</span>
                  <span>75%</span>
                  <span>100%</span>
                </div>
              </div>
            </div>
          )}
        </div>
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
            iconLeft={<X size={20} />}
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
          iconLeft={isRowsSeparated ? <X size={20} /> : <Rows size={20} />}
          onClick={() => setIsRowsSeparated(!isRowsSeparated)}
          className={`!h-[44px] !w-[44px] shadow-sm ${!isTestSelected ? '!bg-neutral-200 !text-neutral-400 cursor-not-allowed opacity-100' : (sortBy === 'Itens' ? 'opacity-50 cursor-not-allowed' : '')}`}
          title={!isTestSelected ? "Selecione um teste primeiro" : (sortBy === 'Itens' ? "Desabilitado em ordenação por Itens" : "Agrupar por Turmas")}
          disabled={!isTestSelected || sortBy === 'Itens'}
          showRing={false}
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
            disabled={!isTestSelected || sortBy === 'Alunos'}
            showRing={false}
            className={!isTestSelected ? 'cursor-not-allowed !opacity-100' : ''}
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
            disabled={!isTestSelected}
            showRing={false}
            className={!isTestSelected ? 'cursor-not-allowed !opacity-100' : ''}
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
            icon={isCombinedView ? <MapIcon size={20} /> : <Check size={20} />}
            activeIcon={<X size={20} />}
            isActive={isCombinedView}
            variant="tertiary"
            onClick={() => setIsCombinedView(!isCombinedView)}
            onChevronClick={() => { }} // Placeholder for options
            isOpen={false}
            size="md"
            rounded="4px"
            showRing={false}
            disabled={!isTestSelected}
          />
        )}
      </div>
    </>
  );
}
