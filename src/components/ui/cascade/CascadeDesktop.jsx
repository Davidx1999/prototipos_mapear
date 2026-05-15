import React from 'react';
import { Search, X, ChevronDown, Eraser, Check, AlertCircle, LayoutList, Info, Map as MapIcon } from 'lucide-react';
import Input from '../Input';
import Callout from '../Callout';
import CascadeColumn from './CascadeColumn';
import Button from '../Button';

const CascadeDesktop = ({
  levels,
  selections,
  selectedLeafs,
  searchLevel,
  setSearchLevel,
  searchQuery,
  setSearchQuery,
  columnsRef,
  multiSelectLeaf,
  isSyncing,
  syncingLevel,
  colors,
  onSelectItem,
  onSelectLevel,
  onToggleAll,
  onClearAll,
  onConfirm,
  getCascadeDataForLevel,
  pendingLeafItems,
  variant
}) => {
  return (
    <div className={`absolute top-[calc(100%+4px)] left-0 bg-white rounded-[8px] border border-neutral-300 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col animate-fade-slide ${variant === 'sidebar' ? 'w-[calc(100vw-32px)] md:w-[48vw] min-w-[800px] max-w-[1200px]' : 'w-[calc(100vw-32px)] md:w-[80vw] max-w-[1100px]'} max-h-[500px]`} style={{ zIndex: 81 }}>

      {/* Search Header */}
      <div className="p-[8px] border-b border-neutral-200 bg-neutral-0 shrink-0">
        <div className="flex items-center gap-[8px]">
          <div className="w-[180px] shrink-0 relative">
            <select
              className="w-full h-[42px] px-[12px] text-[14px] font-bold text-neutral-700 outline-none appearance-none cursor-pointer hover:bg-neutral-50 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed rounded-[4px] border border-neutral-300 focus:border-2 focus:border-primary-base focus:ring-2 focus:ring-[var(--primary-light)] transition-all"
              value={searchLevel}
              onChange={(e) => {
                const val = parseInt(e.target.value);
                setSearchLevel(val);
                if (columnsRef.current) {
                  const colWidth = window.innerWidth < 768 ? 240 : (window.innerWidth < 1024 ? 280 : 300);
                  columnsRef.current.scrollTo({ left: val * colWidth, behavior: 'smooth' });
                }
              }}
              disabled={selections.length === 0}
            >
              {levels.map((lvl, idx) => (
                <option key={idx} value={idx}>{lvl.title}</option>
              ))}
            </select>
            <ChevronDown size={20} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
          </div>
          <div className="flex-1">
            <Input
              iconLeft={<Search size={20} />}
              placeholder="Pesquisar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
              className="!py-[8px] h-[42px]"
              iconRight={searchQuery ? (
                <X size={20} onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }} className="cursor-pointer" />
              ) : null}
            />
          </div>
        </div>
      </div>

      {/* Columns Area */}
      <div
        ref={columnsRef}
        className="flex w-full h-[240px] md:h-[280px] overflow-x-auto custom-scrollbar snap-x snap-mandatory scroll-smooth relative bg-neutral-0"
      >
        {levels.map((lvl, i) => (
          <CascadeColumn
            key={i}
            level={lvl}
            index={i}
            rawItems={getCascadeDataForLevel(i)}
            filteredItems={(() => {
              const raw = getCascadeDataForLevel(i) || [];
              if (i === searchLevel && searchQuery) {
                return raw.filter(item => (typeof item === 'object' ? item.nome : item).toLowerCase().includes(searchQuery));
              }
              return raw;
            })()}
            selections={selections}
            selectedLeafs={selectedLeafs}
            isSyncing={isSyncing}
            syncingLevel={syncingLevel}
            levels={levels}
            multiSelectLeaf={multiSelectLeaf}
            colors={colors}
            onSelectItem={onSelectItem}
            onSelectLevel={onSelectLevel}
            onToggleAll={onToggleAll}
            pendingLeafItems={pendingLeafItems}
            isSearchLevel={i === searchLevel}
            searchQuery={searchQuery}
          />
        ))}
      </div>

      {/* Alert Banner for Multiple Selection */}
      {Array.isArray(selections[4]) && selections[4].length > 1 && (
        <div
          className="p-[16px] flex items-center gap-[16px] border-t shrink-0"
          style={{ backgroundColor: colors.semantic?.info?.extraLight || '#DFF8FF', borderColor: colors.neutral[2] || '#E5E7EB' }}
        >
          <AlertCircle size={20} style={{ color: colors.semantic?.info?.dark || '#155274', flexShrink: 0 }} />
          <span className="text-[14px] leading-snug" style={{ color: colors.neutral[7] }}>
            Exibindo <strong>somente</strong> avaliações <strong>realizadas por ambas</strong> as turmas. Alguns registros podem estar <strong>ocultos</strong>.
          </span>
        </div>
      )}

      {/* Final Leaf Warnings */}
      {multiSelectLeaf && selections.length >= levels.length - 1 && (() => {
        const items = getCascadeDataForLevel(levels.length - 1) || [];
        const missing = items.filter(t => pendingLeafItems.includes(typeof t === 'object' ? t.id : t));
        if (missing.length > 0) {
          return (
            <div className="bg-orange-50 border-t border-orange-200 p-3 px-4 flex items-start gap-3 text-orange-800 text-[12px] font-medium shrink-0">
              <AlertCircle size={20} className="shrink-0 mt-[1px] text-orange-600" />
              <span>Aviso: Algumas {levels[levels.length - 1]?.title.toLowerCase()} ainda não concluíram a avaliação selecionada.</span>
            </div>
          );
        }
        return null;
      })()}

      {/* Footer Actions */}
      <div className="p-[16px] md:px-[24px] md:py-[12px] border-t border-neutral-200 bg-neutral-0 flex justify-end gap-[16px] items-center shrink-0">
        <button
          onClick={onClearAll}
          className="px-[16px] py-[10px] text-[14px] font-bold text-neutral-600 hover:bg-neutral-200 border border-neutral-300 rounded-[4px] transition-colors flex items-center gap-[6px] bg-neutral-0 shadow-sm"
        >
          LIMPAR SELEÇÃO <Eraser size={20} />
        </button>
        <Button
          onClick={onConfirm}
          disabled={selections.length === 0 || (multiSelectLeaf && selectedLeafs.length === 0)}
          iconRight={<Check size={20} />}
        >
          CONFIRMAR
        </Button>
      </div>
    </div>
  );
};

export default CascadeDesktop;
