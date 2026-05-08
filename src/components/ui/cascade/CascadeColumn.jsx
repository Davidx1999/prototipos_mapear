import React from 'react';
import { LayoutList, Check } from 'lucide-react';
import CascadeItem from './CascadeItem';
import Button from '../Button';
import Typography from '../Typography';

const CascadeColumn = ({
  level,
  index,
  rawItems,
  filteredItems,
  selections,
  selectedLeafs,
  isSyncing,
  syncingLevel,
  levels,
  multiSelectLeaf,
  colors,
  onSelectItem,
  onSelectLevel,
  onToggleAll,
  pendingLeafItems
}) => {
  const isLastLevel = index === levels.length - 1;
  const isTurmaLevel = index === 4;
  const isMultiSelectLevel = isTurmaLevel || (isLastLevel && multiSelectLeaf);

  let innerContent = null;

  if (!rawItems || rawItems.length === 0) {
    const emptyMessages = [
      'Nenhum item disponível',
      'Selecione um Estado para ver os Municípios',
      'Selecione um Município para ver as Regionais',
      'Selecione uma Regional para ver as Escolas',
      'Selecione uma Escola para ver as Turmas',
      'Selecione uma Turma para ver as Avaliações',
      'Selecione uma Avaliação para ver os Testes'
    ];
    const emptyMsg = emptyMessages[index] || emptyMessages[0];

    innerContent = (
      <div className="p-[16px] text-[13px] text-neutral-400 text-center font-medium h-full flex flex-col items-center justify-center gap-[12px] opacity-60">
        {emptyMsg}
      </div>
    );
  } else if (filteredItems.length === 0) {
    innerContent = <div className="p-[16px] text-[13px] text-neutral-400 text-center font-medium">Nenhum resultado encontrado.</div>;
  } else if (isSyncing && index === syncingLevel) {
    innerContent = (
      <div className="flex items-center justify-center h-full gap-2 py-12">
        <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.primary?.dark || '#003A79', borderTopColor: 'transparent' }}></div>
        <span className="text-[12px] font-bold" style={{ color: colors.primary?.dark || '#003A79' }}>Sincronizando...</span>
      </div>
    );
  } else {
    innerContent = filteredItems.map((item, idx) => {
      const value = typeof item === 'object' ? item.id : item;
      const isSelected = isLastLevel && multiSelectLeaf
        ? selectedLeafs.includes(value)
        : (isTurmaLevel
          ? (Array.isArray(selections[index]) && selections[index].includes(value))
          : (typeof item === 'object' ? (selections[index]?.id === value) : (selections[index] === value)));

      return (
        <CascadeItem
          key={idx}
          item={item}
          levelIndex={index}
          isLastLevel={isLastLevel}
          isTurmaLevel={isTurmaLevel}
          isSelected={isSelected}
          multiSelectLeaf={multiSelectLeaf}
          onClick={onSelectItem}
          colors={colors}
          pendingLeafItems={pendingLeafItems}
          isMobile={false}
        />
      );
    });
  }

  const getSelectionCount = () => {
    if (isLastLevel) return selectedLeafs.length;
    if (isTurmaLevel) return Array.isArray(selections[4]) ? selections[4].length : 0;
    return 0;
  };

  const currentCount = getSelectionCount();
  const totalCount = rawItems ? rawItems.length : 0;
  const isAllSelected = totalCount > 0 && currentCount === totalCount;
  const isPartialSelected = currentCount > 0 && currentCount < totalCount;

  return (
    <div className="w-[240px] md:w-[280px] lg:w-[300px] shrink-0 border-r border-neutral-200 flex flex-col h-full snap-start bg-neutral-0">
      <div className="h-[48px] px-[12px] border-b border-neutral-200 bg-neutral-0 shrink-0 sticky top-0 flex items-center justify-between z-10">
        <Button
          variant="primary"
          appearance="link"
          size="xs"
          onClick={() => onSelectLevel(index)}
          disabled={index >= selections.length}
          className="!px-0 !h-auto font-bold"
        >
          {level.title}
        </Button>
        {isMultiSelectLevel && rawItems && rawItems.length > 0 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleAll(index, rawItems.map(it => typeof it === 'object' ? it.id : it));
            }}
            className="flex items-center gap-[8px] hover:opacity-80 transition-opacity cursor-pointer p-1 -mr-1"
          >
            <Typography variant="s" weight="regular" color={colors.neutral[5]}>
              Todas
            </Typography>
            <div
              className={`w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${isAllSelected ? 'bg-primary-base border-primary-base text-white' : (isPartialSelected ? 'bg-primary-base/20 border-primary-base' : 'border-neutral-300 bg-white')}`}
              style={{
                backgroundColor: isAllSelected ? colors.primary.base : (isPartialSelected ? `${colors.primary.base}20` : 'transparent'),
                borderColor: (isAllSelected || isPartialSelected) ? colors.primary.base : colors.neutral[3]
              }}
            >
              {isAllSelected ? (
                <Check size={12} strokeWidth={3} style={{ color: colors.neutral[0] }} />
              ) : (
                isPartialSelected && <div className="w-2 h-[2px] rounded-full" style={{ backgroundColor: colors.primary.base }}></div>
              )}
            </div>
          </button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto custom-scrollbar p-[8px] flex flex-col gap-[2px]">
        {innerContent}
      </div>
    </div>
  );
};

export default CascadeColumn;
