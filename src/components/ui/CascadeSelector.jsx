import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Blocks, PanelLeftOpen, ChevronRight, ChevronDown, X, Search, Eraser, Check, LayoutList, AlertCircle } from 'lucide-react';
import Input from './Input';

export default function CascadeSelector({
  db,
  levels,
  colors,
  onConfirm,
  variant = 'default', // 'default' or 'sidebar'
  initialSelections = [],
  multiSelectLeaf = false,
  selectedLeafItems = [],
  pendingLeafItems = [] // Items that have a "pending" status
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState(initialSelections);
  const [selectedLeafs, setSelectedLeafs] = useState(selectedLeafItems);
  const [searchLevel, setSearchLevel] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStep, setMobileStep] = useState(0); // For step-by-step selection on mobile
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingLevel, setSyncingLevel] = useState(null);
  const containerRef = useRef(null);
  const columnsRef = useRef(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (initialSelections.length > 0) {
      setSelections(initialSelections);
    }
    if (selectedLeafItems.length > 0) {
      setSelectedLeafs(selectedLeafItems);
    }
  }, [initialSelections, selectedLeafItems]);

  const toggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setSearchLevel(Math.min(selections.length, levels.length - 1));
      setSearchQuery('');
      setTimeout(scrollToActive, 50);
    }
  };

  const scrollToActive = (indexOverride) => {
    if (columnsRef.current) {
      const targetCol = indexOverride !== undefined ? indexOverride : Math.min(selections.length, levels.length - 1);
      const colWidth = window.innerWidth < 768 ? 240 : (window.innerWidth < 1024 ? 280 : 300);
      columnsRef.current.scrollTo({ left: targetCol * colWidth, behavior: 'smooth' });
    }
  };

  const selectItem = (levelIndex, value, objData = null) => {
    const isLastLevel = levelIndex === levels.length - 1;
    const isTurmaLevel = levelIndex === 4; // Hardcoded for this specific request: Turmas is level 5 (index 4)

    if (isTurmaLevel) {
      const currentTurmas = selections[levelIndex] || [];
      const newTurmas = Array.isArray(currentTurmas)
        ? (currentTurmas.includes(value) ? currentTurmas.filter(t => t !== value) : [...currentTurmas, value])
        : [value];

      const newSelections = [...selections];
      newSelections[levelIndex] = newTurmas;
      setSelections(newSelections);

      // Sincronizando Avaliações (next level)
      setSyncingLevel(levelIndex + 1);
      setIsSyncing(true);

      if (!isMobile) {
        setTimeout(() => scrollToActive(levelIndex + 1), 50);
      }

      setTimeout(() => {
        setIsSyncing(false);
        setSyncingLevel(null);
      }, 4000);

      return;
    }

    if (multiSelectLeaf && isLastLevel) {
      toggleLeafSelection(value);
      return;
    }

    const newSelections = selections.slice(0, levelIndex);
    newSelections[levelIndex] = objData || value;
    setSelections(newSelections);

    if (multiSelectLeaf) {
      // If we change something before the leaf, we might want to keep the leaf selection if it's still valid,
      // but the current logic resets it. We'll keep it simple for now.
      setSelectedLeafs([]);
    }

    setSearchQuery('');
    setSearchLevel(Math.min(levelIndex + 1, levels.length - 1));

    if (isMobile) {
      if (levelIndex < levels.length - 1) {
        setMobileStep(levelIndex + 1);
      }
    } else {
      setTimeout(scrollToActive, 50);
    }
  };

  const toggleLeafSelection = (value) => {
    setSelectedLeafs(prev =>
      prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]
    );
  };

  const toggleAllLeafs = (allAvailable) => {
    if (selectedLeafs.length === allAvailable.length) {
      setSelectedLeafs([]);
    } else {
      setSelectedLeafs([...allAvailable]);
    }
  };

  const clearAll = () => {
    setSelections([]);
    setSelectedLeafs([]);
    setSearchQuery('');
    setSearchLevel(0);
    setTimeout(() => scrollToActive(0), 50);
  };

  const handleConfirm = () => {
    if (multiSelectLeaf) {
      onConfirm(selections, selectedLeafs);
    } else {
      onConfirm(selections);
    }
    setIsOpen(false);
  };

  const selectLevel = (levelIndex) => {
    setSelections(selections.slice(0, levelIndex));
    setSearchLevel(levelIndex);
    setIsOpen(true);
  };

  const getCascadeDataForLevel = (levelIndex) => {
    if (typeof db === 'function') {
      return db(levelIndex, selections);
    }
    // Default fallback for the structure in the prompt
    switch (levelIndex) {
      case 0: return db.estados || db.avaliacoes_gerais; // Flexible keys
      case 1: return selections[0] ? db.cidades?.[selections[0]] : null;
      case 2: return selections[1] ? db.escolas?.[selections[1]] : null;
      case 3: return selections[2] ? db.turmas?.[selections[2]] : null;
      case 4: return selections[3] ? db.avaliacoes?.[selections[3]] : null;
      default: return null;
    }
  };

  const breadcrumbHtml = selections.length === 0 ? (
    <span className={`text-neutral-500 font-medium truncate ${variant === 'sidebar' ? 'text-[11px] md:text-[12px]' : 'text-[13px] md:text-[14px]'}`}>
      Escolha uma avaliação para aplicar...
    </span>
  ) : (
    <div className={`flex items-center gap-[8px] w-full pr-[16px] overflow-hidden whitespace-nowrap ${variant === 'sidebar' ? 'text-[11px] md:text-[12px]' : 'text-[13px] md:text-[14px]'}`}>
      {selections.map((s, i) => {
        if (!s) return null;
        const isArray = Array.isArray(s);
        const fullLabel = isArray ? `${s.length} ${levels[i]?.title}` : (typeof s === 'object' ? s.nome : s);
        const label = fullLabel.length > 16 ? fullLabel.substring(0, 13) + '...' : fullLabel;
        const isLast = i === selections.length - 1;
        return (
          <React.Fragment key={i}>
            <span
              onClick={(e) => { e.stopPropagation(); selectLevel(i); }}
              className={`font-semibold shrink-0 cursor-pointer hover:underline transition-colors ${isLast ? '' : 'hidden md:block'}`}
              style={{ color: isLast ? (colors?.neutral?.[7] || '#1D2432') : (colors?.neutral?.[5] || '#64748B') }}
              title={isArray ? s.join(', ') : fullLabel}
            >
              {label}
            </span>
            {(!isLast || (multiSelectLeaf && selectedLeafs.length > 0)) && <ChevronRight size={variant === 'sidebar' ? 12 : 14} className="text-neutral-400 shrink-0 hidden md:block" />}
          </React.Fragment>
        );
      })}
      {multiSelectLeaf && selectedLeafs.length > 0 && (
        <span className="font-bold whitespace-nowrap" style={{ color: colors.primary.base }}>
          ({selectedLeafs.length}) {levels[levels.length - 1]?.title}
        </span>
      )}
    </div>
  );

  const topBar = (
    <div className={`items-center gap-[6px] md:gap-[8px] transition-all flex w-full`}>
      <div
        className={`flex items-center bg-neutral-0 border transition-all ${isOpen ? 'border-[2px] border-[var(--primary-base)] ring-2 ring-[var(--primary-light)]' : 'border-neutral-300 shadow-sm'} rounded-[4px] ${variant === 'sidebar' ? 'h-[36px] md:h-[40px] px-[12px] w-full' : 'h-[44px] md:h-[48px] px-[16px] w-fit min-w-[40%] max-w-[calc(100%-56px)]'} cursor-pointer hover:border-[var(--primary-base)] overflow-hidden`}
        onClick={toggle}
      >
        <Blocks size={variant === 'sidebar' ? 14 : 18} className="text-primary-base shrink-0 mr-[8px] md:mr-[12px]" />
        {breadcrumbHtml}
      </div>
      {!isMobile && (
        <button
          onClick={toggle}
          className={`${variant === 'sidebar' ? 'w-[36px] h-[36px] md:w-[40px] md:h-[40px]' : 'w-[44px] h-[44px] md:w-[48px] md:h-[48px]'} shrink-0 rounded-[4px] flex items-center justify-center transition-colors ${isOpen ? 'bg-neutral-100 border border-neutral-300 text-neutral-700 hover:bg-neutral-200' : 'bg-[#008BC9] text-white hover:bg-[#003A79] shadow-sm'}`}
        >
          {isOpen ? <X size={variant === 'sidebar' ? 16 : 20} /> : <PanelLeftOpen size={variant === 'sidebar' ? 16 : 20} />}
        </button>
      )}
    </div>
  );

  return (
    <div className={`relative w-full`} style={{ zIndex: isOpen ? 80 : 40 }} ref={containerRef}>
      {topBar}

      {isOpen && (
        isMobile ? (
          /* 📱 MOBILE BOTTOM SHEET */
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0"
              style={{ zIndex: 999, backgroundColor: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(2px)', animation: 'cascadeFadeIn 0.2s ease-out forwards' }}
              onClick={() => setIsOpen(false)}
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
                {/* Title row */}
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
                        {levels[mobileStep]?.title}
                      </h2>
                    </div>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
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

                {/* Search using Input component */}
                <Input
                  iconLeft={<Search />}
                  placeholder={`Buscar ${levels[mobileStep]?.title.toLowerCase()}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                  iconRight={searchQuery ? (
                    <X onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }} className="cursor-pointer" />
                  ) : null}
                />
              </div>

              {/* List */}
              <div className="flex-1 overflow-y-auto" style={{ backgroundColor: colors.neutral[0] }}>
                {(() => {
                  const rawItems = getCascadeDataForLevel(mobileStep);
                  const items = rawItems || [];
                  const filtered = searchQuery
                    ? items.filter(it => (typeof it === 'object' ? it.nome : it).toLowerCase().includes(searchQuery))
                    : items;

                  // Empty state: no data at all (parent not selected)
                  if (!rawItems || rawItems.length === 0) {
                    let emptyMsg = 'Nenhum item disponível';
                    if (mobileStep === 1) emptyMsg = 'Selecione um Estado primeiro';
                    else if (mobileStep === 2) emptyMsg = 'Selecione um Município primeiro';
                    else if (mobileStep === 3) emptyMsg = 'Selecione uma Regional primeiro';
                    else if (mobileStep === 4) emptyMsg = 'Selecione uma Escola primeiro';
                    else if (mobileStep === 5) emptyMsg = 'Selecione as Turmas primeiro';
                    else if (mobileStep === 6) emptyMsg = 'Selecione uma Avaliação primeiro';
                    return (
                      <div className="flex flex-col items-center justify-center p-[48px] text-center gap-[12px]">
                        <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center mb-[4px]" style={{ backgroundColor: colors.neutral[1] }}>
                          <LayoutList size={28} style={{ color: colors.neutral[3] }} />
                        </div>
                        <span className="text-[15px] font-semibold" style={{ color: colors.neutral[5] }}>{emptyMsg}</span>
                        <span className="text-[13px]" style={{ color: colors.neutral[4] }}>Complete as etapas anteriores para continuar.</span>
                      </div>
                    );
                  }

                  // Empty state: search found nothing
                  if (filtered.length === 0) {
                    return (
                      <div className="flex flex-col items-center justify-center p-[48px] text-center gap-[12px]">
                        <div className="w-[56px] h-[56px] rounded-full flex items-center justify-center mb-[4px]" style={{ backgroundColor: colors.neutral[1] }}>
                          <Search size={24} style={{ color: colors.neutral[3] }} />
                        </div>
                        <span className="text-[15px] font-semibold" style={{ color: colors.neutral[5] }}>Nenhum resultado</span>
                        <span className="text-[13px]" style={{ color: colors.neutral[4] }}>Tente buscar com termos diferentes.</span>
                      </div>
                    );
                  }

                  return (
                    <div className="flex flex-col pb-[8px]">
                      {isSyncing && mobileStep === syncingLevel ? (
                        <div className="flex flex-col gap-3 p-5">
                          <div className="flex items-center gap-2">
                            <div className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.primary.dark, borderTopColor: 'transparent' }}></div>
                            <span className="text-[14px] font-bold" style={{ color: colors.primary.dark }}>Sincronizando...</span>
                          </div>
                          {[1, 2, 3].map(s => (
                            <div key={s} className="h-[60px] w-full bg-neutral-100 rounded animate-pulse"></div>
                          ))}
                        </div>
                      ) : (
                        filtered.map((item, idx) => {
                          const isObj = typeof item === 'object';
                          const label = isObj ? item.nome : item;
                          const value = isObj ? item.id : item;

                          const isLastLevel = mobileStep === levels.length - 1;
                          const isTurmaLevel = mobileStep === 4;
                          const isAvaliacaoLevel = mobileStep === 5;

                          const isSelected = isLastLevel && multiSelectLeaf
                            ? selectedLeafs.includes(value)
                            : (isTurmaLevel
                              ? (Array.isArray(selections[mobileStep]) && selections[mobileStep].includes(value))
                              : (isObj ? (selections[mobileStep]?.id === value) : (selections[mobileStep] === value)));

                          let subLine = null;
                          if (isAvaliacaoLevel) {
                            const selectedTurmas = selections[4] || [];
                            if (selectedTurmas.length > 0) {
                              const participacoes = db(null, null, 'getParticipation', label) || [];
                              const faltantes = selectedTurmas.filter(t => !participacoes.includes(t));
                              if (faltantes.length === 0) {
                                subLine = <span className="text-[11px] text-green-600 font-bold">Todas as Turmas (100%)</span>;
                              } else {
                                subLine = <span className="text-[11px] text-red-500 font-medium">Falta: {faltantes.join(', ')}</span>;
                              }
                            }
                          }

                          return (
                            <div
                              key={idx}
                              onClick={() => selectItem(mobileStep, value, isObj ? item : null)}
                              className="mx-[12px] my-[3px] px-[16px] py-[14px] rounded-[12px] flex items-center justify-between active:scale-[0.98] transition-all"
                              style={{
                                backgroundColor: isSelected ? `${colors.primary.base}12` : 'transparent',
                                border: `1px solid ${isSelected ? `${colors.primary.base}30` : 'transparent'}`
                              }}
                            >
                              <div className="flex items-center gap-[14px] w-full overflow-hidden">
                                {(multiSelectLeaf && isLastLevel) || isTurmaLevel ? (
                                  <div
                                    className="w-[22px] h-[22px] rounded-[6px] border-2 flex items-center justify-center transition-all shrink-0"
                                    style={{
                                      backgroundColor: isSelected ? colors.primary.base : 'transparent',
                                      borderColor: isSelected ? colors.primary.base : colors.neutral[3]
                                    }}
                                  >
                                    {isSelected && <Check size={13} strokeWidth={3} style={{ color: colors.neutral[0] }} />}
                                  </div>
                                ) : (
                                  <div
                                    className="w-[10px] h-[10px] rounded-full shrink-0 transition-all"
                                    style={{ backgroundColor: isSelected ? colors.primary.base : colors.neutral[2] }}
                                  />
                                )}
                                <div className="flex flex-col gap-[2px] overflow-hidden flex-1">
                                  <span
                                    className={`text-[15px] truncate ${isSelected ? 'font-bold' : 'font-medium'}`}
                                    style={{ color: isSelected ? colors.primary.base : colors.neutral[7] }}
                                  >
                                    {label}
                                  </span>
                                  {subLine}
                                  {isLastLevel && pendingLeafItems.includes(value) && (
                                    <span className="text-[10px] text-orange-600 font-bold uppercase tracking-wider">Pendente Avaliação</span>
                                  )}
                                </div>
                              </div>
                              {!isLastLevel && !isTurmaLevel && (
                                <ChevronRight size={18} style={{ color: colors.neutral[3], flexShrink: 0 }} />
                              )}
                            </div>
                          );
                        })
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Action Bar */}
              <div
                className="px-[20px] py-[16px] flex gap-[12px] shrink-0"
                style={{
                  backgroundColor: colors.neutral[0],
                  borderTop: `1px solid ${colors.neutral[2]}`,
                  paddingBottom: 'max(16px, env(safe-area-inset-bottom))'
                }}
              >
                <button
                  onClick={clearAll}
                  className="h-[52px] px-[20px] rounded-[12px] border text-[14px] font-bold transition-all active:scale-95"
                  style={{ borderColor: colors.neutral[3], color: colors.neutral[5], backgroundColor: colors.neutral[0] }}
                >
                  Limpar
                </button>
                <button
                  onClick={handleConfirm}
                  disabled={selections.length === 0 || (multiSelectLeaf && selectedLeafs.length === 0)}
                  className={`flex-1 h-[52px] rounded-[12px] text-[15px] font-bold flex items-center justify-center gap-[8px] transition-all ${selections.length > 0 ? 'active:scale-[0.98]' : ''}`}
                  style={{
                    backgroundColor: (selections.length > 0 && (!multiSelectLeaf || selectedLeafs.length > 0)) ? colors.primary.base : colors.neutral[2],
                    color: (selections.length > 0 && (!multiSelectLeaf || selectedLeafs.length > 0)) ? colors.neutral[0] : colors.neutral[3],
                    boxShadow: (selections.length > 0 && (!multiSelectLeaf || selectedLeafs.length > 0)) ? `0 4px 16px ${colors.primary.base}40` : 'none'
                  }}
                >
                  Confirmar Seleção <Check size={18} />
                </button>
              </div>
            </div>

            <style>{`
              @keyframes cascadeSlideUp {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              @keyframes cascadeFadeIn {
                from { opacity: 0; }
                to { opacity: 1; }
              }
            `}</style>
          </>
        ) : (
          /* 🖥️ DESKTOP DROPDOWN (Original) */
          <div className={`absolute top-[calc(100%+4px)] left-0 bg-white rounded-[8px] border border-neutral-300 shadow-[0_20px_50px_rgba(0,0,0,0.2)] overflow-hidden flex flex-col animate-fade-slide ${variant === 'sidebar' ? 'w-[calc(100vw-32px)] md:w-[48vw] min-w-[800px] max-w-[1200px]' : 'w-[calc(100vw-32px)] md:w-[80vw] max-w-[1100px]'} max-h-[500px]`} style={{ zIndex: 81 }}>

            <div className="p-[8px] border-b border-neutral-200 bg-neutral-0 shrink-0">
              <div className="flex items-center gap-[8px]">
                <div className="w-[180px] shrink-0 relative">
                  <select
                    className="w-full h-[42px] px-[12px] text-[13px] font-bold text-neutral-700 outline-none appearance-none cursor-pointer hover:bg-neutral-50 disabled:bg-neutral-50 disabled:text-neutral-400 disabled:cursor-not-allowed rounded-[4px] border border-neutral-300 focus:border-2 focus:border-primary-base focus:ring-2 focus:ring-[var(--primary-light)] transition-all"
                    value={searchLevel}
                    onChange={(e) => setSearchLevel(parseInt(e.target.value))}
                    disabled={selections.length === 0}
                  >
                    {levels.map((lvl, idx) => (
                      <option key={idx} value={idx}>{lvl.title}</option>
                    ))}
                  </select>
                  <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
                </div>
                <div className="flex-1">
                  <Input
                    iconLeft={<Search />}
                    placeholder="Pesquisar..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                    className="!py-[8px] h-[42px]"
                    iconRight={searchQuery ? (
                      <X
                        onClick={(e) => { e.stopPropagation(); setSearchQuery(''); }}
                        className="cursor-pointer"
                      />
                    ) : null}
                  />
                </div>
              </div>
            </div>

            <div
              ref={columnsRef}
              className="flex w-full h-[240px] md:h-[280px] overflow-x-auto custom-scrollbar snap-x snap-mandatory scroll-smooth relative bg-neutral-0"
            >
              {levels.map((lvl, i) => {
                const rawItems = getCascadeDataForLevel(i);
                let innerContent = null;

                if (!rawItems || rawItems.length === 0) {
                  let emptyMsg = '';
                  if (i === 1) emptyMsg = 'Selecione um Estado para ver os Municípios';
                  else if (i === 2) emptyMsg = 'Selecione um Município para ver as Regionais';
                  else if (i === 3) emptyMsg = 'Selecione uma Regional para ver as Escolas';
                  else if (i === 4) emptyMsg = 'Selecione uma Escola para ver as Turmas';
                  else if (i === 5) emptyMsg = 'Selecione uma Turma para ver as Avaliações';
                  else if (i === 6) emptyMsg = 'Selecione uma Avaliação para ver os Testes';
                  else emptyMsg = 'Nenhum item disponível';

                  innerContent = (
                    <div className="p-[16px] text-[13px] text-neutral-400 text-center font-medium h-full flex flex-col items-center justify-center gap-[12px] opacity-60">
                      <LayoutList size={32} />
                      {emptyMsg}
                    </div>
                  );
                } else {
                  let filteredItems = rawItems;
                  if (i === searchLevel && searchQuery) {
                    filteredItems = rawItems.filter(item => {
                      const label = typeof item === 'object' ? item.nome : item;
                      return label.toLowerCase().includes(searchQuery);
                    });
                  }

                  if (filteredItems.length === 0) {
                    innerContent = <div className="p-[16px] text-[13px] text-neutral-400 text-center font-medium">Nenhum resultado encontrado.</div>;
                  } else {
                    if (isSyncing && i === syncingLevel) {
                      innerContent = (
                        <div className="flex flex-col gap-3 p-2">
                          <div className="flex items-center gap-2 px-2 py-1">
                            <div className="w-4 h-4 border-2 border-t-transparent rounded-full animate-spin" style={{ borderColor: colors.primary.dark, borderTopColor: 'transparent' }}></div>
                            <span className="text-[12px] font-bold" style={{ color: colors.primary.dark }}>Sincronizando...</span>
                          </div>
                          {[1, 2, 3].map(s => (
                            <div key={s} className="h-[44px] w-full bg-neutral-100 rounded animate-pulse"></div>
                          ))}
                        </div>
                      );
                    } else {
                      innerContent = filteredItems.map((item, idx) => {
                        const isObj = typeof item === 'object';
                        const label = isObj ? item.nome : item;
                        const value = isObj ? item.id : item;

                        const isLastLevel = i === levels.length - 1;
                        const isTurmaLevel = i === 4;
                        const isAvaliacaoLevel = i === 5;

                        const isSelected = isLastLevel && multiSelectLeaf
                          ? selectedLeafs.includes(value)
                          : (isTurmaLevel
                            ? (Array.isArray(selections[i]) && selections[i].includes(value))
                            : (isObj ? (selections[i]?.id === value) : (selections[i] === value)));

                        // Lógica de sub-linha para Avaliações
                        let subLine = null;
                        if (isAvaliacaoLevel) {
                          const selectedTurmas = selections[4] || [];
                          if (selectedTurmas.length > 0) {
                            // Check participation from DB or mock
                            // We expect item to have participation info or we use a mock helper
                            const participacoes = db(null, null, 'getParticipation', label) || [];
                            const faltantes = selectedTurmas.filter(t => !participacoes.includes(t));

                            if (faltantes.length === 0) {
                              subLine = <span className="text-[10px] text-green-600 font-bold">Todas as Turmas (100%)</span>;
                            } else {
                              subLine = <span className="text-[10px] text-red-500 font-medium truncate">Falta: {faltantes.join(', ')}</span>;
                            }
                          }
                        }

                        return (
                          <div
                            key={idx}
                            onClick={() => selectItem(i, value, isObj ? item : null)}
                            className={`px-[12px] py-[12px] rounded-[4px] text-[13px] font-semibold cursor-pointer transition-colors flex justify-between items-center group ${isSelected ? ((isLastLevel && multiSelectLeaf) || isTurmaLevel ? 'bg-blue-50 text-neutral-800' : 'bg-[#003A79] text-white shadow-md') : 'text-neutral-700 hover:bg-neutral-100'}`}
                          >
                            <div className="flex flex-col gap-0.5 overflow-hidden w-full">
                              <span className="truncate pr-[8px]" title={label}>{label}</span>
                              {subLine}
                              {isLastLevel && pendingLeafItems.includes(value) && (
                                <span className="text-[9px] text-orange-600 font-bold uppercase tracking-wider">Pendente Avaliação</span>
                              )}
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              {((multiSelectLeaf && isLastLevel) || isTurmaLevel) ? (
                                <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${isSelected ? 'bg-[#008BC9] border-[#008BC9] text-white' : 'border-gray-300 bg-white group-hover:border-gray-400'}`}>
                                  {isSelected && <Check size={12} strokeWidth={3} />}
                                </div>
                              ) : (
                                i < levels.length - 1 && <ChevronRight size={16} className={`shrink-0 opacity-50 ${isSelected ? 'text-white' : 'group-hover:text-primary-base'}`} />
                              )}
                            </div>
                          </div>
                        );
                      });
                    }
                  }
                }

                return (
                  <div key={i} className="w-[240px] md:w-[280px] lg:w-[300px] shrink-0 border-r border-neutral-200 flex flex-col h-full snap-start bg-neutral-0">
                    <div className="p-[12px] border-b border-neutral-200 bg-neutral-0 shrink-0 sticky top-0 flex items-center justify-between">
                      <button
                        onClick={() => selectLevel(i)}
                        disabled={i >= selections.length}
                        className={`text-[13px] font-bold transition-colors ${i < selections.length ? 'text-[#008BC9] hover:underline cursor-pointer' : 'text-neutral-400 cursor-default'}`}
                      >
                        {lvl.title}
                      </button>
                      {i === levels.length - 1 && multiSelectLeaf && rawItems && rawItems.length > 0 && (
                        <button
                          onClick={() => toggleAllLeafs(rawItems.map(it => typeof it === 'object' ? it.id : it))}
                          className="text-[10px] font-bold text-neutral-500 hover:text-primary-base flex items-center gap-1.5 transition-colors"
                        >
                          Todas
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${selectedLeafs.length === rawItems.length ? 'bg-primary-base border-primary-base text-white' : (selectedLeafs.length > 0 ? 'bg-primary-base/20 border-primary-base' : 'border-gray-300 bg-white')}`}>
                            {selectedLeafs.length === rawItems.length ? <Check size={12} strokeWidth={3} /> : (selectedLeafs.length > 0 && <div className="w-2 h-[2px] bg-primary-base rounded-full"></div>)}
                          </div>
                        </button>
                      )}
                    </div>
                    <div className="flex-1 overflow-y-auto custom-scrollbar p-[8px] flex flex-col gap-[2px]">
                      {innerContent}
                    </div>
                  </div>
                );
              })}
            </div>

            {multiSelectLeaf && selections.length >= levels.length - 1 && (
              (() => {
                const items = getCascadeDataForLevel(levels.length - 1) || [];
                const missing = items.filter(t => pendingLeafItems.includes(typeof t === 'object' ? t.id : t));
                if (missing.length > 0) {
                  return (
                    <div className="bg-orange-50 border-t border-orange-200 p-3 px-4 flex items-start gap-3 text-orange-800 text-[12px] font-medium shrink-0 shadow-inner z-10">
                      <AlertCircle size={16} className="shrink-0 mt-[1px] text-orange-600" />
                      <span>Aviso: Algumas {levels[levels.length - 1]?.title.toLowerCase()} ainda não concluíram a avaliação selecionada e seus relatórios não serão gerados no mapa de calor.</span>
                    </div>
                  );
                }
                return null;
              })()
            )}

            <div className="p-[16px] md:px-[24px] md:py-[12px] border-t border-neutral-200 bg-neutral-0 flex justify-end gap-[16px] items-center shrink-0">
              <button
                onClick={clearAll}
                className="px-[16px] py-[10px] text-[13px] font-bold text-neutral-600 hover:bg-neutral-200 border border-neutral-300 rounded-[4px] transition-colors flex items-center gap-[6px] bg-neutral-0 shadow-sm"
              >
                <Eraser size={16} /> LIMPAR SELEÇÃO
              </button>
              <button
                onClick={handleConfirm}
                disabled={selections.length === 0 || (multiSelectLeaf && selectedLeafs.length === 0)}
                className={`px-[24px] py-[10px] text-[13px] font-bold rounded-[4px] transition-colors flex items-center gap-[8px] ${selections.length > 0 ? 'bg-[#008BC9] text-white hover:bg-[#003A79] shadow-md' : 'bg-neutral-200 text-neutral-300 cursor-not-allowed'}`}
              >
                CONFIRMAR <Check size={16} />
              </button>
            </div>
          </div>
        )
      )}
    </div>
  );
}
