import React from 'react';
import { X, ChevronLeft, ChevronRight, Search, LayoutGrid, Check, AlertCircle } from 'lucide-react';
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
  onToggleAll,
  getCascadeDataForLevel,
  pendingLeafItems
}) => {
  const currentLevel = levels[mobileStep];
  const isTurmaLevel = currentLevel?.id === 'turma';
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
          height: '72vh',
          maxHeight: '72vh',
          animation: 'cascadeSlideUp 0.3s cubic-bezier(0.32, 0.72, 0, 1) forwards',
          boxShadow: '0 -20px 60px rgba(0,0,0,0.2)'
        }}
      >
        {/* Handle */}
        <div className="flex justify-center pt-[12px] pb-[8px] shrink-0">
          <div className="w-[80px] h-[5px] rounded-full" style={{ backgroundColor: colors.neutral[3] || '#D1D5DB' }} />
        </div>

        {/* Header */}
        <div className="px-[20px] pt-[8px] pb-[12px] shrink-0">
          <div className="flex items-center justify-between mb-[16px]">
            <div className="flex items-center gap-[12px]">
              <Button
                variant="secondary"
                appearance="solid"
                size="md"
                iconOnly={true}
                onClick={() => setMobileStep(mobileStep - 1)}
                disabled={mobileStep === 0}
              >
                <ChevronLeft />
              </Button>
              <div>
                <h2 className="text-[20px] font-bold leading-tight text-neutral-800" style={{ color: colors.neutral[7] }}>
                  {currentLevel?.title}
                </h2>
                <p className="text-[13px] font-medium text-neutral-5" style={{ color: colors.neutral[4] }}>
                  {mobileStep + 1} de {levels.length}
                </p>
              </div>
            </div>
            <Button
              variant="tertiary"
              appearance="solid"
              size="md"
              iconOnly={true}
              onClick={onClose}
            >
              <X />
            </Button>
          </div>

          {/* Progress dots */}
          <div className="flex items-center gap-[8px] mb-[16px]">
            {levels.map((_, idx) => {
              const isDone = idx < mobileStep;
              const isCurrent = idx === mobileStep;
              const hasSelection = Array.isArray(selections[idx]) ? selections[idx].length > 0 : !!selections[idx];
              return (
                <div
                  key={idx}
                  className="transition-all duration-300"
                  style={{
                    width: isCurrent ? 40 : 8,
                    height: 8,
                    borderRadius: 999,
                    backgroundColor: isCurrent ? colors.primary.extraDark : (isDone || hasSelection ? colors.primary.base : (colors.neutral[2] || '#E5E7EB'))
                  }}
                />
              );
            })}
          </div>

          {/* Breadcrumb path */}
          <div
            className="flex items-center gap-[8px] py-[10px] px-[12px] rounded-[8px] border mb-[16px]"
            style={{
              backgroundColor: colors.neutral[1] || '#F3F4F6',
              borderColor: colors.neutral[2] || '#E5E7EB'
            }}
          >
            <LayoutGrid size={16} className="shrink-0" style={{ color: colors.neutral[5] || '#64748B' }} />
            <div className="flex items-center gap-[4px] text-[13px] overflow-x-auto hide-scrollbar whitespace-nowrap" style={{ color: colors.neutral[7] || '#1D2432' }}>
              {(() => {
                const visible = selections
                  .map((s, idx) => ({ value: s, index: idx }))
                  .filter(item => item.index < mobileStep && item.value);

                if (visible.length === 0) {
                  return <span className="font-bold text-[13px]" style={{ color: colors.neutral[7] || '#1D2432' }}>Escolhendo...</span>;
                }

                const lastItem = visible[visible.length - 1];
                const lastLevelIdx = lastItem.index;
                const lastSelection = lastItem.value;
                const isArray = Array.isArray(lastSelection);
                const label = isArray ? `${lastSelection.length} ${levels[lastLevelIdx]?.title}` : (typeof lastSelection === 'object' ? lastSelection.nome : lastSelection);

                return (
                  <>
                    {visible.length > 1 && (
                      <>
                        <span className="text-[13px] font-normal text-neutral-400">...</span>
                        <ChevronRight size={12} className="shrink-0" style={{ color: colors.neutral[4] || '#94A3B8' }} />
                      </>
                    )}
                    <button
                      onClick={() => setMobileStep(lastLevelIdx)}
                      className="font-normal hover:underline transition-colors focus:outline-none text-[13px]"
                      style={{ color: colors.neutral[5] || '#64748B' }}
                    >
                      {label}
                    </button>
                    <ChevronRight size={12} className="shrink-0" style={{ color: colors.neutral[4] || '#94A3B8' }} />
                    <span className="font-bold text-[13px]" style={{ color: colors.neutral[7] || '#1D2432' }}>Escolhendo...</span>
                  </>
                );
              })()}
            </div>
          </div>

          <Input
            iconLeft={<Search />}
            placeholder="Buscar..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
            iconRight={
              <div className="flex items-center gap-2 pr-2">
                {searchQuery && (
                  <X onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }} className="cursor-pointer" size={16} />
                )}
                {((isTurmaLevel) || (mobileStep === levels.length - 1 && multiSelectLeaf)) && rawItems && rawItems.length > 0 && (
                  <button
                    onClick={() => onToggleAll(mobileStep, rawItems.map(it => typeof it === 'object' ? it.id : it))}
                    className="flex items-center gap-[6px] pl-2 border-l border-neutral-300 transition-opacity active:opacity-60"
                  >
                    <span className="text-[14px] font-normal" style={{ color: colors.neutral[5] }}>Todas</span>
                    <div
                      className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${(isTurmaLevel ? (selections[mobileStep]?.length === rawItems.length) : (selectedLeafs.length === rawItems.length))
                        ? 'bg-primary-base border-primary-base text-white'
                        : (((isTurmaLevel ? selections[mobileStep]?.length : selectedLeafs.length) > 0) ? 'bg-primary-base/20 border-primary-base' : 'border-neutral-300 bg-white')
                        }`}
                      style={{
                        backgroundColor: (isTurmaLevel ? (selections[mobileStep]?.length === rawItems.length) : (selectedLeafs.length === rawItems.length))
                          ? colors.primary.base
                          : (((isTurmaLevel ? selections[mobileStep]?.length : selectedLeafs.length) > 0) ? `${colors.primary.base}20` : 'transparent'),
                        borderColor: ((isTurmaLevel ? (selections[mobileStep]?.length > 0) : (selectedLeafs.length > 0)))
                          ? colors.primary.base
                          : colors.neutral[3]
                      }}
                    >
                      {(isTurmaLevel ? (selections[mobileStep]?.length === rawItems.length) : (selectedLeafs.length === rawItems.length)) ? (
                        <Check size={12} strokeWidth={3} style={{ color: colors.neutral[0] }} />
                      ) : (
                        ((isTurmaLevel ? selections[mobileStep]?.length : selectedLeafs.length) > 0) && <div className="w-2 h-[2px] rounded-full" style={{ backgroundColor: colors.primary.base }}></div>
                      )}
                    </div>
                  </button>
                )}
              </div>
            }
          />
        </div>

        {/* List Header */}
        <div className="px-[20px] pb-[8px] pt-[8px] shrink-0 border-b" style={{ borderColor: colors.neutral[1] || '#F3F4F6' }}>
          <h3 className="text-[14px] font-bold text-neutral-800" style={{ color: colors.neutral[7] || '#1D2432' }}>
            Lista de {currentLevel?.title}
          </h3>
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
              {(() => {
                const renderItem = (item, idx, customKeyPrefix = "") => {
                  const isLastLevel = mobileStep === levels.length - 1;
                  const isTurmaLevel = levels[mobileStep]?.id === 'turma';
                  const value = typeof item === 'object' ? item.id : item;
                  const isSelected = isLastLevel && multiSelectLeaf
                    ? selectedLeafs.includes(value)
                    : (isTurmaLevel
                      ? (Array.isArray(selections[mobileStep]) && selections[mobileStep].includes(value))
                      : (typeof item === 'object' ? (selections[mobileStep]?.id === value) : (selections[mobileStep] === value)));

                  return (
                    <CascadeItem
                      key={`${customKeyPrefix}${idx}`}
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
                };

                if (searchQuery) {
                  const allSelectedItems = items.filter(item => {
                    const isLastLevel = mobileStep === levels.length - 1;
                    const isTurmaLevel = levels[mobileStep]?.id === 'turma';
                    const value = typeof item === 'object' ? item.id : item;
                    return isLastLevel && multiSelectLeaf
                      ? selectedLeafs.includes(value)
                      : (isTurmaLevel
                        ? (Array.isArray(selections[mobileStep]) && selections[mobileStep].includes(value))
                        : (typeof item === 'object' ? (selections[mobileStep]?.id === value) : (selections[mobileStep] === value)));
                  });

                  const filteredIds = new Set(filtered.map(it => typeof it === 'object' ? it.id : it));
                  const selectedNotInSearch = allSelectedItems.filter(it => !filteredIds.has(typeof it === 'object' ? it.id : it));

                  return (
                    <>
                      {selectedNotInSearch.length > 0 && (
                        <div className="flex flex-col">
                          {selectedNotInSearch.map((item, idx) => renderItem(item, idx, "sel-"))}
                        </div>
                      )}

                      <div className="px-[20px] mt-[8px] mb-[4px] shrink-0">
                        <span className="text-[12px] font-normal tracking-wide text-neutral-400">Resultados Pesquisado</span>
                      </div>

                      {filtered.length > 0 ? (
                        <div className="flex flex-col">
                          {filtered.map((item, idx) => renderItem(item, idx, "res-"))}
                        </div>
                      ) : (
                        <div className="px-[20px] py-[24px] text-[14px] text-neutral-400 font-medium italic text-center">
                          Nenhum resultado encontrado para a pesquisa.
                        </div>
                      )}
                    </>
                  );
                }

                return filtered.map((item, idx) => renderItem(item, idx));
              })()}
            </div>
          )}
        </div>

        {/* Footer */}
        {(() => {
          const turmaIdx = levels.findIndex(lvl => lvl.id === 'turma');
          if (turmaIdx !== -1 && mobileStep >= turmaIdx) {
            const turmaSelections = selections[turmaIdx];
            if (Array.isArray(turmaSelections) && turmaSelections.length > 1) {
              return (
                <div
                  className="mx-[16px] mb-[12px] p-[16px] flex items-center gap-[16px] rounded-[8px] border"
                  style={{ backgroundColor: colors.semantic?.info?.extraLight || '#DFF8FF', borderColor: colors.neutral[2] || '#E5E7EB' }}
                >
                  <AlertCircle size={18} style={{ color: colors.semantic?.info?.dark || '#155274', flexShrink: 0 }} />
                  <span className="text-[14px] leading-snug" style={{ color: colors.neutral[7] }}>
                    Nem todas as turmas <strong>selecionadas</strong> participaram das avaliações apresentadas.
                  </span>
                </div>
              );
            }
          }
          return null;
        })()}
        <div
          className="px-[20px] py-[16px] flex gap-[12px] shrink-0"
          style={{
            backgroundColor: colors.neutral[0],
            borderTop: `1px solid ${colors.neutral[2]}`,
            paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
          }}
        >
          <Button
            onClick={onClearAll}
            disabled={selections.length === 0 && selectedLeafs.length === 0}
            variant="tertiary"
            appearance="solid"
            size="md"
            className="flex-1 !text-[12px] font-semibold tracking-normal normal-case !border"
            style={selections.length === 0 && selectedLeafs.length === 0 ? { color: colors?.neutral?.[3] || '#CACDD5', borderColor: colors?.neutral?.[3] || '#CACDD5', backgroundColor: 'transparent' } : {}}
          >
            Limpar Seleção
          </Button>
          <Button
            onClick={onConfirm}
            disabled={selections.length === 0 || (multiSelectLeaf && selectedLeafs.length === 0)}
            variant="primary"
            appearance="solid"
            size="lg"
            className="flex-1"
            iconRight={<Check size={18} />}
          >
            CONFIRMAR
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
