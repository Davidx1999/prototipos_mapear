import React from 'react';
import {
  X, Move, ZoomIn, ZoomOut, Maximize,
  Columns, Rows, ChevronDown, Map as MapIcon
} from 'lucide-react';

export default function HeatmapControls({
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

      {/* ── BOTTOM CENTER CONTROLS (Floating bar) ── */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-3 z-40">
        {/* X close button (when in combined view) */}
        {isCombinedView && (
          <button
            onClick={() => setIsCombinedView(false)}
            className="w-10 h-10 flex items-center justify-center text-neutral-5 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* Grid / Columns control */}
        <div className="flex flex-col border border-neutral-2 rounded-lg overflow-hidden bg-neutral-0 shadow-lg">
          <button
            onClick={() => setIsColsSeparated(!isColsSeparated)}
            className={`p-2.5 border-b border-neutral-2 transition-colors ${isColsSeparated ? 'bg-[#D9F0FC] text-primary-base' : 'hover:bg-neutral-1 text-neutral-5'}`}
          >
            <Columns size={18} />
          </button>
          <button className="p-1 hover:bg-neutral-1 flex justify-center text-neutral-5">
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Map / Rows control */}
        <div className="flex flex-col border border-neutral-2 rounded-lg overflow-hidden bg-neutral-0 shadow-lg">
          <button
            onClick={() => setIsRowsSeparated(!isRowsSeparated)}
            className={`p-2.5 border-b border-neutral-2 transition-colors ${isRowsSeparated ? 'bg-[#D9F0FC] text-primary-base' : 'hover:bg-neutral-1 text-neutral-5'}`}
          >
            <MapIcon size={18} />
          </button>
          <button className="p-1 hover:bg-neutral-1 flex justify-center text-neutral-5">
            <ChevronDown size={12} />
          </button>
        </div>

        {/* VISUALIZAR COMBINAÇÃO button */}
        {(selectedRows.size >= 2 || isCombinedView) && (
          <button
            onClick={() => setIsCombinedView(!isCombinedView)}
            className={`px-8 py-3.5 rounded-lg font-extrabold text-[13px] tracking-wider shadow-xl transition-all whitespace-nowrap ${isCombinedView ? 'bg-neutral-0 text-primary-base border-2 border-primary-base hover:bg-neutral-1' : 'bg-[#008BC9] text-white hover:bg-[#003A79]'}`}
          >
            {isCombinedView ? 'VOLTAR AO MAPA GERAL' : 'VISUALIZAR COMBINAÇÃO'}
          </button>
        )}
      </div>
    </>
  );
}
