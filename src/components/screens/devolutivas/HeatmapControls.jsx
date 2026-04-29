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
          className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all shadow-lg border ${isPanMode ? 'bg-white border-gray-200 text-[#1D2432]' : 'bg-white border-gray-200 text-gray-500 hover:text-[#008BC9]'}`}
          title="Arrastar/Mover"
        >
          <Move size={18} />
        </button>

        {/* Zoom In */}
        <button
          onClick={() => handleZoom(0.2)}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#008BC9] transition-colors"
          title="Aumentar Zoom"
        >
          <ZoomIn size={18} />
        </button>

        {/* Zoom Out */}
        <button
          onClick={() => handleZoom(-0.2)}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#008BC9] transition-colors"
          title="Diminuir Zoom"
        >
          <ZoomOut size={18} />
        </button>

        {/* Fit/Reset */}
        <button
          onClick={handleFitScreen}
          className="w-10 h-10 bg-white rounded-lg shadow-lg border border-gray-200 flex items-center justify-center text-gray-600 hover:text-[#008BC9] transition-colors"
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
            className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-red-500 transition-colors"
          >
            <X size={20} />
          </button>
        )}

        {/* Grid / Columns control */}
        <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
          <button
            onClick={() => setIsColsSeparated(!isColsSeparated)}
            className={`p-2.5 border-b border-gray-200 transition-colors ${isColsSeparated ? 'bg-[#D9F0FC] text-[#008BC9]' : 'hover:bg-gray-50 text-gray-600'}`}
          >
            <Columns size={18} />
          </button>
          <button className="p-1 hover:bg-gray-50 flex justify-center text-gray-500">
            <ChevronDown size={12} />
          </button>
        </div>

        {/* Map / Rows control */}
        <div className="flex flex-col border border-gray-200 rounded-lg overflow-hidden bg-white shadow-lg">
          <button
            onClick={() => setIsRowsSeparated(!isRowsSeparated)}
            className={`p-2.5 border-b border-gray-200 transition-colors ${isRowsSeparated ? 'bg-[#D9F0FC] text-[#008BC9]' : 'hover:bg-gray-50 text-gray-600'}`}
          >
            <MapIcon size={18} />
          </button>
          <button className="p-1 hover:bg-gray-50 flex justify-center text-gray-500">
            <ChevronDown size={12} />
          </button>
        </div>

        {/* VISUALIZAR COMBINAÇÃO button */}
        {(selectedRows.size >= 2 || isCombinedView) && (
          <button
            onClick={() => setIsCombinedView(!isCombinedView)}
            className={`px-8 py-3.5 rounded-lg font-extrabold text-[13px] tracking-wider shadow-xl transition-all whitespace-nowrap ${isCombinedView ? 'bg-white text-[#008BC9] border-2 border-[#008BC9] hover:bg-gray-50' : 'bg-[#008BC9] text-white hover:bg-[#003A79]'}`}
          >
            {isCombinedView ? 'VOLTAR AO MAPA GERAL' : 'VISUALIZAR COMBINAÇÃO'}
          </button>
        )}
      </div>
    </>
  );
}
