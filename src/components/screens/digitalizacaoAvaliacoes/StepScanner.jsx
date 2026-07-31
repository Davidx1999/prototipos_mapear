import React from 'react';
import {
  GraduationCap, Maximize2, AlertTriangle, ChevronLeft, ChevronRight,
  Crop, SlidersHorizontal, Sun, RotateCw, ArrowUpDown, Trash2, Camera, FileUp
} from 'lucide-react';
import Button from '../../ui/Button';
import MobileNavigationHeader from './MobileNavigationHeader';

export default function StepScanner({
  themeColors,
  activeStudent,
  scannerPages,
  setScannerPages,
  activePageIndex,
  setActivePageIndex,
  setShowAddPageModal,
  setShowDeletePageModal,
  handleFinishScannerUpload,
  setStep,
  setToast
}) {
  const currentPage = scannerPages[activePageIndex] || scannerPages[0];

  return (
    <div className="flex-1 flex flex-col bg-neutral-900 text-white animate-fade-slide overflow-hidden relative select-none">
      {/* Header */}
      <MobileNavigationHeader
        title="Ajustar Página"
        onBack={() => setStep('estudantes')}
        iconType="add-page"
        onAddPage={() => setShowAddPageModal(true)}
        themeColors={themeColors}
      />

      {/* Student info subheader */}
      <div className="px-[16px] py-[8px] bg-neutral-800/80 border-b border-neutral-700/60 flex items-center gap-[8px] text-[13px] shrink-0">
        <GraduationCap size={16} className="text-[#008BC9]" />
        <span className="font-bold text-white/90 truncate">
          {activeStudent?.name || "Ana Beatriz Silva Almeida Rocha"}
        </span>
      </div>

      {/* Viewport area */}
      <div className="flex-1 relative flex flex-col items-center justify-center p-[16px] bg-neutral-950 overflow-hidden">
        {/* Main page image container */}
        <div className="relative w-full max-w-[310px] aspect-[1/1.38] bg-white rounded-lg shadow-2xl overflow-hidden border border-neutral-700 flex flex-col items-center justify-center">
          
          {/* Mock captured evaluation document sheet */}
          <div className="w-full h-full p-4 flex flex-col justify-between text-neutral-800 font-['Montserrat',sans-serif] select-none opacity-90 relative">
            
            {/* Document Header */}
            <div className="border-b-2 border-neutral-800 pb-2 flex justify-between items-end">
              <div>
                <span className="text-[9px] uppercase font-bold text-neutral-500 block">Avaliação Formativa</span>
                <span className="text-[11px] font-black text-neutral-900">Língua Portuguesa - Caderno 01</span>
              </div>
              <div className="text-[9px] font-mono border border-neutral-400 px-1 rounded">
                P. {activePageIndex + 1}
              </div>
            </div>

            {/* Document Mock Lines & Writing */}
            <div className="flex-1 py-3 flex flex-col gap-2">
              <div className="h-[6px] bg-neutral-200 rounded w-full"></div>
              <div className="h-[6px] bg-neutral-200 rounded w-4/5"></div>
              <div className="h-[6px] bg-neutral-200 rounded w-full"></div>

              {/* Simulated handwritten student response */}
              <div className="my-2 p-2 bg-[#FAF7F2] border border-[#E9E3D5] rounded text-[11px] italic font-serif text-sky-900 leading-tight">
                "O Brasil é marcado por uma grande diversidade cultural, visível nas festas populares..."
              </div>

              <div className="h-[6px] bg-neutral-200 rounded w-11/12"></div>
              <div className="h-[6px] bg-neutral-200 rounded w-3/4"></div>
            </div>

            {/* Footer barcode mock */}
            <div className="border-t border-neutral-300 pt-1 flex justify-between items-center">
              <span className="text-[8px] font-mono text-neutral-500">ID: 118022610703</span>
              <div className="flex gap-0.5 h-[12px]">
                {[4,2,6,3,8,2,5,3,7,2,9,4,3].map((w, i) => (
                  <div key={i} className="bg-neutral-800 h-full" style={{ width: `${w}px` }}></div>
                ))}
              </div>
            </div>

            {/* Expand viewport icon button */}
            <button className="absolute bottom-[10px] right-[10px] w-[32px] h-[32px] rounded-lg bg-black/60 text-white flex items-center justify-center backdrop-blur shadow hover:bg-black">
              <Maximize2 size={16} />
            </button>

            {/* Warning overlay if page is illegible */}
            {currentPage?.isIllegible && (
              <div className="absolute inset-x-2 top-2 bg-red-600/90 text-white backdrop-blur p-2 rounded-lg text-center shadow-lg border border-red-400 animate-pulse">
                <div className="flex items-center justify-center gap-1 text-[12px] font-bold">
                  <AlertTriangle size={16} />
                  <span>Página ilegível</span>
                </div>
                <span className="text-[10px] text-red-100 block mt-0.5">Recomendamos refazer a captura.</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Page selector bar */}
      <div className="h-[44px] bg-neutral-900 border-t border-neutral-800 flex items-center justify-center gap-[14px] px-[16px] text-[13px] shrink-0">
        <button
          onClick={() => setActivePageIndex(prev => Math.max(0, prev - 1))}
          disabled={activePageIndex === 0}
          className="w-[28px] h-[28px] rounded bg-neutral-800 disabled:opacity-40 flex items-center justify-center"
        >
          <ChevronLeft size={18} />
        </button>

        <div className="flex items-center gap-[6px] font-semibold text-white/90">
          <span>Página {activePageIndex + 1} de {scannerPages.length}</span>
          <div className="w-[18px] h-[18px] rounded-full bg-emerald-500 text-neutral-950 flex items-center justify-center text-[10px] font-black">
            ✓
          </div>
        </div>

        <button
          onClick={() => setActivePageIndex(prev => Math.min(scannerPages.length - 1, prev + 1))}
          disabled={activePageIndex === scannerPages.length - 1}
          className="w-[28px] h-[28px] rounded bg-neutral-800 disabled:opacity-40 flex items-center justify-center"
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Editing Tools Bar */}
      <div className="h-[64px] bg-neutral-950 border-t border-neutral-800 flex items-center justify-around px-[12px] text-neutral-400 text-[10px] shrink-0 overflow-x-auto hide-scrollbar">
        <button className="flex flex-col items-center gap-1 hover:text-white transition-colors py-1 px-2">
          <Crop size={18} />
          <span>Recorte</span>
        </button>

        <button className="flex flex-col items-center gap-1 hover:text-white transition-colors py-1 px-2">
          <SlidersHorizontal size={18} />
          <span>Contraste</span>
        </button>

        <button className="flex flex-col items-center gap-1 hover:text-white transition-colors py-1 px-2">
          <Sun size={18} />
          <span>Brilho</span>
        </button>

        <button className="flex flex-col items-center gap-1 hover:text-white transition-colors py-1 px-2">
          <RotateCw size={18} />
          <span>Girar</span>
        </button>

        <button className="flex flex-col items-center gap-1 hover:text-white transition-colors py-1 px-2">
          <ArrowUpDown size={18} />
          <span>Reordenar</span>
        </button>

        <button
          onClick={() => setShowDeletePageModal(true)}
          className="flex flex-col items-center gap-1 text-red-400 hover:text-red-300 transition-colors py-1 px-2"
        >
          <Trash2 size={18} />
          <span>Excluir</span>
        </button>
      </div>

      {/* Action Buttons Footer */}
      <div className="p-[14px] bg-neutral-900 border-t border-neutral-800 grid grid-cols-2 gap-[12px] shrink-0">
        <Button
          variant="tertiary"
          appearance="outlined"
          size="md"
          className="w-full font-bold text-[13px] text-sky-400 border-sky-400/60 hover:bg-sky-500/10 flex items-center justify-center gap-2"
          onClick={() => {
            setScannerPages(prev => [...prev, { id: prev.length + 1, isIllegible: false }]);
            setActivePageIndex(scannerPages.length);
            setToast("Nova foto adicionada!");
          }}
        >
          <Camera size={16} />
          <span>NOVA FOTO</span>
        </Button>

        <Button
          variant="primary"
          size="md"
          className="w-full font-bold text-[13px] bg-[#008BC9] hover:bg-sky-600 flex items-center justify-center gap-2"
          onClick={handleFinishScannerUpload}
        >
          <span>ENVIAR PDF</span>
          <FileUp size={16} />
        </Button>
      </div>
    </div>
  );
}
