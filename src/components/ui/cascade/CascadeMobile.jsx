import React from 'react';
import { X, ChevronDown, ChevronRight, Search, LayoutList } from 'lucide-react';
import Input from '../Input';
import Callout from '../Callout';
import CascadeItem from './CascadeItem';
import Button from '../Button';

const CascadeMobile = ({
  levels,
  selections,
  selectedLeafs,
  mobileStep,
  setMobileStep,
  onClose,
  colors,
  searchQuery,
  setSearchQuery,
  multiSelectLeaf,
  isSyncing,
  syncingLevel,
  onSelectItem,
  onClearAll,
  onConfirm,
  getCascadeDataForLevel,
  pendingLeafItems
}) => {
  const currentLevel = levels[mobileStep];
  const rawItems = getCascadeDataForLevel(mobileStep);
  const items = rawItems || [];
  const filtered = searchQuery
    ? items.filter(it => (typeof it === 'object' ? it.nome : it).toLowerCase().includes(searchQuery))
    : items;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0"
        style={{ zIndex: 999, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', animation: 'cascadeFadeIn 0.2s ease-out forwards' }}
        onClick={onClose}
      />

      {/* Bottom Sheet */}
      <div
        className="fixed bottom-0 left-0 right-0 flex flex-col overflow-hidden rounded-t-[20px]"
        style={{
          zIndex: 1000,
          backgroundColor: colors.neutral[0],
          maxHeight: '90vh',
          animation: 'cascadeSlideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.2)'
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-[12px] pb-[4px] shrink-0">
          <div className="w-[40px] h-[4px] rounded-full" style={{ backgroundColor: colors.neutral[3] }} />
        </div>

        {/* Header */}
        <div className="px-[20px] pt-[8px] pb-[16px] shrink-0">
          <div className="flex items-center justify-between mb-[12px]">
            <div className="flex items-center gap-[10px]">
              {mobileStep > 0 && (
                <button
                  onClick={() => setMobileStep(mobileStep - 1)}
                  className="w-[36px] h-[36px] rounded-full flex items-center justify-center transition-colors active:scale-95"
                  style={{ backgroundColor: `${colors.primary.base}15`, color: colors.primary.base }}
                >
                  <ChevronDown size={20} className="rotate-90" />
                </button>
              )}
              <div>
                <p className="text-[11px] font-bold uppercase tracking-wider" style={{ color: colors.neutral[4] }}>
                  {mobileStep + 1} de {levels.length}
                </p>
                <h2 className="text-[20px] font-bold leading-tight" style={{ color: colors.neutral[7] }}>
                  {currentLevel?.title}
                </h2>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-[36px] h-[36px] rounded-full flex items-center justify-center transition-colors"
              style={{ backgroundColor: colors.neutral[1], color: colors.neutral[5] }}
            >
              <X size={18} />
            </button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-[6px] mb-[12px]">
            {levels.map((_, idx) => {
              const isDone = idx < mobileStep;
              const isCurrent = idx === mobileStep;
              const hasSelection = Array.isArray(selections[idx]) ? selections[idx].length > 0 : !!selections[idx];
              return (
                <button
                  key={idx}
                  onClick={() => isDone || hasSelection ? setMobileStep(idx) : null}
                  className="transition-all"
                  style={{
                    width: isCurrent ? 24 : 8,
                    height: 8,
                    borderRadius: 4,
                    backgroundColor: isCurrent ? colors.primary.base : (isDone || hasSelection ? `${colors.primary.base}60` : colors.neutral[2])
                  }}
                />
              );
            })}
          </div>

          {/* Breadcrumb path */}
          {selections.length > 0 && (
            <div
              className="flex items-center gap-[4px] overflow-x-auto hide-scrollbar py-[6px] px-[10px] rounded-[8px] mb-[12px]"
              style={{ backgroundColor: colors.neutral[1] }}
            >
              {selections.map((s, i) => {
                if (!s) return null;
                const isArray = Array.isArray(s);
                const label = isArray ? `${s.length} ${levels[i]?.title}` : (typeof s === 'object' ? s.nome : s);
                return (
                  <React.Fragment key={i}>
                    <button
                      onClick={() => setMobileStep(i)}
                      className="text-[11px] font-bold whitespace-nowrap px-[6px] py-[2px] rounded-[4px] transition-colors"
                      style={{
                        color: i === mobileStep ? colors.primary.base : colors.neutral[5],
                        backgroundColor: i === mobileStep ? `${colors.primary.base}15` : 'transparent'
                      }}
                    >
                      {label}
                    </button>
                    {i < selections.length - 1 && (
                      <ChevronRight size={10} style={{ color: colors.neutral[3], flexShrink: 0 }} />
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          <Input
            iconLeft={<Search />}
            placeholder={`Buscar ${currentLevel?.title.toLowerCase()}...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            iconRight={
              <div className="flex items-center gap-2 pr-2">
                {searchQuery && (
                  <X onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }} className="cursor-pointer" size={16} />
                )}
                {((mobileStep === 4) || (mobileStep === levels.length - 1 && multiSelectLeaf)) && rawItems && rawItems.length > 0 && (
                  <button
                    onClick={() => onToggleAll(mobileStep, rawItems.map(it => typeof it === 'object' ? it.id : it))}
                    className="flex items-center gap-[6px] pl-2 border-l border-neutral-300 transition-opacity active:opacity-60"
                  >
                    <span className="text-[14px] font-normal" style={{ color: colors.neutral[5] }}>Todas</span>
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${(mobileStep === 4 ? (selections[4]?.length === rawItems.length) : (selectedLeafs.length === rawItems.length))
                        ? 'bg-primary-base border-primary-base text-white'
                        : (((mobileStep === 4 ? selections[4]?.length : selectedLeafs.length) > 0) ? 'bg-primary-base/20 border-primary-base' : 'border-neutral-300 bg-white')
                        }`}
                      style={{
                        backgroundColor: (mobileStep === 4 ? (selections[4]?.length === rawItems.length) : (selectedLeafs.length === rawItems.length))
                          ? colors.primary.base
                          : (((mobileStep === 4 ? selections[4]?.length : selectedLeafs.length) > 0) ? `${colors.primary.base}20` : 'transparent'),
                        borderColor: ((mobileStep === 4 ? (selections[4]?.length > 0) : (selectedLeafs.length > 0)))
                          ? colors.primary.base
                          : colors.neutral[3]
                      }}
                    >
                      {(mobileStep === 4 ? (selections[4]?.length === rawItems.length) : (selectedLeafs.length === rawItems.length)) ? (
                        <Check size={12} strokeWidth={3} style={{ color: colors.neutral[0] }} />
                      ) : (
                        ((mobileStep === 4 ? selections[4]?.length : selectedLeafs.length) > 0) && <div className="w-2 h-[2px] rounded-full" style={{ backgroundColor: colors.primary.base }}></div>
                      )}
                    </div>
                  </button>
                )}
              </div>
            }
          />
        </div>

        {/* List Content */}
        <div className="flex-1 overflow-y-auto" style={{ backgroundColor: colors.neutral[0] }}>
          {!rawItems || rawItems.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-[48px] text-center gap-[12px]">
              <span className="text-[15px] font-semibold" style={{ color: colors.neutral[5] }}>Complete as etapas anteriores para continuar.</span>
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-[48px] text-center gap-[12px]">
              <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center mb-[4px]" style={{ backgroundColor: colors.neutral[1] }}>
                <Search size={24} style={{ color: colors.neutral[3] }} />
              </div>
              <span className="text-[15px] font-semibold" style={{ color: colors.neutral[5] }}>Nenhum resultado</span>
            </div>
          ) : (
            <div className="flex flex-col pb-[8px]">
              {isSyncing && mobileStep === syncingLevel ? (
                <div className="flex items-center justify-center h-full py-12 gap-3">
                  <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.primary?.dark || '#003A79', borderTopColor: 'transparent' }}></div>
                  <span className="text-[14px] font-bold" style={{ color: colors.primary?.dark || '#003A79' }}>Sincronizando...</span>
                </div>
              ) : (
                filtered.map((item, idx) => {
                  const isLastLevel = mobileStep === levels.length - 1;
                  const isTurmaLevel = mobileStep === 4;
                  const value = typeof item === 'object' ? item.id : item;
                  const isSelected = isLastLevel && multiSelectLeaf
                    ? selectedLeafs.includes(value)
                    : (isTurmaLevel
                      ? (Array.isArray(selections[mobileStep]) && selections[mobileStep].includes(value))
                      : (typeof item === 'object' ? (selections[mobileStep]?.id === value) : (selections[mobileStep] === value)));

                  return (
                    <CascadeItem
                      key={idx}
                      item={item}
                      levelIndex={mobileStep}
                      isLastLevel={isLastLevel}
                      isTurmaLevel={isTurmaLevel}
                      isSelected={isSelected}
                      multiSelectLeaf={multiSelectLeaf}
                      onClick={onSelectItem}
                      colors={colors}
                      pendingLeafItems={pendingLeafItems}
                      isMobile={true}
                    />
                  );
                })
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {mobileStep >= 4 && Array.isArray(selections[4]) && selections[4].length > 1 && (
          <div
            className="mx-[16px] mb-[12px] p-[16px] flex items-center gap-[16px] rounded-[8px] border"
            style={{ backgroundColor: colors.semantic?.info?.extraLight || '#DFF8FF', borderColor: colors.semantic?.info?.base || '#489EEA' }}
          >
            <AlertCircle size={18} style={{ color: colors.semantic?.info?.dark || '#155274', flexShrink: 0 }} />
            <span className="text-[14px] leading-snug" style={{ color: colors.neutral[7] }}>
              Nem todas as turmas <strong>selecionadas</strong> participaram das avaliações apresentadas.
            </span>
          </div>
        )}
        <div
          className="px-[20px] py-[16px] flex gap-[12px] shrink-0"
          style={{
            backgroundColor: colors.neutral[0],
            borderTop: `1px solid ${colors.neutral[2]}`,
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
          }}
        >
          <button
            onClick={onClearAll}
            className="h-[52px] px-[20px] rounded-[12px] border text-[14px] font-bold transition-all active:scale-95"
            style={{ borderColor: colors.neutral[3], color: colors.neutral[5] }}
          >
            Limpar
          </button>
          <Button
            onClick={onConfirm}
            disabled={selections.length === 0 || (multiSelectLeaf && selectedLeafs.length === 0)}
            size="md"
            className="flex-1"
            iconRight={<Check size={18} />}
          >
            CONFIRMAR SELEÇÃO
          </Button>
        </div>
      </div>

      <style>{`
        @keyframes cascadeSlideUp { from { transform: translateY(100%); } to { transform: translateY(0); } }
        @keyframes cascadeFadeIn { from { opacity: 0; } to { opacity: 1; } }
      `}</style>
    </>
  );
};

export default CascadeMobile;
