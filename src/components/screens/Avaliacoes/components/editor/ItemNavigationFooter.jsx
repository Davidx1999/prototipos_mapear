import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Check, ArrowRight, ArrowLeft, Save, CheckCircle2, List } from 'lucide-react';

const ItemNavigationFooter = ({
  currentIndex = 0,
  totalItems = 1,
  currentItemCode = 'Item 01',
  allItems = [],
  onPrevItem,
  onNextItem,
  onJumpToItem,
  onSaveItem,
  isSaving = false,
  isDarkMode = false
}) => {
  const [isJumpOpen, setIsJumpOpen] = useState(false);

  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < totalItems - 1;

  return (
    <footer
      className={`sticky bottom-0 z-20 w-full px-6 md:px-8 py-3 border-t shadow-lg flex items-center justify-between gap-4 shrink-0 transition-colors font-['Montserrat',sans-serif] ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800' : 'bg-white border-neutral-200'
      }`}
    >
      {/* Left: Previous Item Button */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onPrevItem}
          disabled={!hasPrev}
          className={`px-4 py-2 rounded-[4px] text-[13px] font-semibold border flex items-center gap-1.5 transition-all ${
            hasPrev
              ? isDarkMode
                ? 'border-neutral-700 bg-neutral-800 text-neutral-200 hover:bg-neutral-700 cursor-pointer'
                : 'border-neutral-300 bg-white text-neutral-700 hover:bg-neutral-100 cursor-pointer'
              : 'border-neutral-200 dark:border-neutral-800 text-neutral-400 dark:text-neutral-600 bg-transparent cursor-not-allowed opacity-60'
          }`}
          title={hasPrev ? 'Ir para o item anterior (Alt + ←)' : 'Este é o primeiro item'}
        >
          <ArrowLeft size={14} />
          <span>Item anterior</span>
        </button>
      </div>

      {/* Center: Current Item Index and Quick Jump Menu */}
      <div className="relative flex items-center gap-2">
        <div
          onClick={() => setIsJumpOpen(!isJumpOpen)}
          className={`px-3.5 py-1.5 rounded-[4px] border flex items-center gap-2 text-[13px] font-bold cursor-pointer transition-colors ${
            isDarkMode
              ? 'bg-neutral-800 border-neutral-700 text-neutral-200 hover:border-neutral-600'
              : 'bg-neutral-50 border-neutral-300 text-neutral-800 hover:border-neutral-400'
          }`}
          title="Clique para saltar diretamente para outro item"
        >
          <span>{currentItemCode}</span>
          <span className="text-neutral-400 font-normal">de</span>
          <span>{totalItems} itens</span>
          <List size={14} className="text-neutral-400 ml-1" />
        </div>

        {/* Quick Jump Popover */}
        {isJumpOpen && (
          <div
            className={`absolute bottom-full mb-2 left-1/2 -translate-x-1/2 w-64 rounded-[8px] border shadow-xl p-2 flex flex-col gap-1 max-h-60 overflow-y-auto z-50 ${
              isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
            }`}
          >
            <span className="text-[11px] font-bold text-neutral-500 uppercase px-2 py-1">
              Saltar para Item
            </span>
            {allItems.map((item, idx) => {
              const isCurrent = idx === currentIndex;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onJumpToItem(idx, item.id);
                    setIsJumpOpen(false);
                  }}
                  className={`px-2.5 py-1.5 rounded-[4px] text-left text-xs flex items-center justify-between transition-colors ${
                    isCurrent
                      ? 'bg-[#0078B0] text-white font-bold'
                      : isDarkMode
                      ? 'hover:bg-neutral-700 text-neutral-300'
                      : 'hover:bg-neutral-100 text-neutral-800'
                  }`}
                >
                  <span className="truncate">{item.code || `Item ${idx + 1}`} - {item.title || item.habilidadeBNCC?.id || 'Sem título'}</span>
                  {isCurrent && <Check size={12} />}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* Right: Autosave Status & Next Item Button */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:flex items-center gap-1.5 text-[11px] text-neutral-400">
          <CheckCircle2 size={13} className="text-emerald-500" />
          <span>Salvo automaticamente</span>
        </div>

        <button
          type="button"
          onClick={onNextItem}
          className={`px-5 py-2 rounded-[4px] text-[13px] font-bold flex items-center gap-1.5 transition-all shadow-xs cursor-pointer ${
            hasNext
              ? 'bg-[#0078B0] hover:bg-[#006899] text-white'
              : 'bg-emerald-600 hover:bg-emerald-700 text-white'
          }`}
          title={hasNext ? 'Avançar para o próximo item (Alt + →)' : 'Concluir e validar todos os itens'}
        >
          <span>{hasNext ? 'Próximo item' : 'Concluir Avaliação'}</span>
          <ArrowRight size={14} />
        </button>
      </div>
    </footer>
  );
};

export default ItemNavigationFooter;
