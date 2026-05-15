import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import { Blocks, PanelLeftOpen, ChevronRight, X } from 'lucide-react';
import CascadeMobile from './cascade/CascadeMobile';
import CascadeDesktop from './cascade/CascadeDesktop';

/**
 * CascadeSelector (Refactored)
 * A multi-level hierarchical selection component.
 */
export default function CascadeSelector({
  db,
  levels,
  colors,
  onConfirm,
  variant = 'default',
  initialSelections = [],
  multiSelectLeaf = false,
  selectedLeafItems = [],
  pendingLeafItems = []
}) {
  // ══ STATE ═════════════════════════════════════════════════════════════════
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState(initialSelections);
  const [selectedLeafs, setSelectedLeafs] = useState(selectedLeafItems);
  const [searchLevel, setSearchLevel] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isMobile, setIsMobile] = useState(false);
  const [mobileStep, setMobileStep] = useState(0);
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncingLevel, setSyncingLevel] = useState(null);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const containerRef = useRef(null);
  const columnsRef = useRef(null);

  // ══ EFFECTS ═══════════════════════════════════════════════════════════════
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (initialSelections.length > 0) setSelections(initialSelections);
    if (selectedLeafItems.length > 0) setSelectedLeafs(selectedLeafItems);
  }, [initialSelections, selectedLeafItems]);

  // ══ ACTIONS ═══════════════════════════════════════════════════════════════
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
    const isTurmaLevel = levelIndex === 4;

    if (isTurmaLevel) {
      const currentTurmas = selections[levelIndex] || [];
      const newTurmas = Array.isArray(currentTurmas)
        ? (currentTurmas.includes(value) ? currentTurmas.filter(t => t !== value) : [...currentTurmas, value])
        : [value];

      const newSelections = [...selections];
      newSelections[levelIndex] = newTurmas;
      setSelections(newSelections);

      setSyncingLevel(levelIndex + 1);
      setIsSyncing(true);
      if (!isMobile) setTimeout(() => scrollToActive(levelIndex + 1), 50);
      setTimeout(() => { setIsSyncing(false); setSyncingLevel(null); }, 4000);
      return;
    }

    if (multiSelectLeaf && isLastLevel) {
      setSelectedLeafs(prev => prev.includes(value) ? prev.filter(t => t !== value) : [...prev, value]);
      return;
    }

    const newSelections = selections.slice(0, levelIndex);
    newSelections[levelIndex] = objData || value;
    setSelections(newSelections);

    if (multiSelectLeaf) setSelectedLeafs([]);
    setSearchQuery('');
    setSearchLevel(Math.min(levelIndex + 1, levels.length - 1));

    if (isMobile) {
      if (levelIndex < levels.length - 1) setMobileStep(levelIndex + 1);
    } else {
      setTimeout(scrollToActive, 50);
    }
  };

  const toggleAllForLevel = (levelIndex, allAvailable) => {
    if (levelIndex === levels.length - 1) {
      setSelectedLeafs(selectedLeafs.length === allAvailable.length ? [] : [...allAvailable]);
    } else if (levelIndex === 4) {
      const current = Array.isArray(selections[4]) ? selections[4] : [];
      const next = current.length === allAvailable.length ? [] : [...allAvailable];
      const newSelections = [...selections];
      newSelections[4] = next;
      setSelections(newSelections);

      // Trigger sync if selecting all turmas
      if (next.length > 0) {
        setSyncingLevel(levelIndex + 1);
        setIsSyncing(true);
        if (!isMobile) setTimeout(() => scrollToActive(levelIndex + 1), 50);
        setTimeout(() => { setIsSyncing(false); setSyncingLevel(null); }, 4000);
      }
    }
  };

  const clearAll = () => {
    setSelections([]);
    setSelectedLeafs([]);
    setSearchQuery('');
    setSearchLevel(0);
    setTimeout(() => scrollToActive(0), 50);
  };

  const handleClearRequest = () => {
    if (selections.length === 0 && selectedLeafs.length === 0) return;
    setShowClearConfirm(true);
  };

  const confirmClear = () => {
    clearAll();
    setShowClearConfirm(false);
    onConfirm([], []);
    setIsOpen(false);
  };

  const handleConfirm = () => {
    onConfirm(selections, multiSelectLeaf ? selectedLeafs : undefined);
    setIsOpen(false);
  };

  const getCascadeDataForLevel = (levelIndex) => {
    if (typeof db === 'function') return db(levelIndex, selections);
    switch (levelIndex) {
      case 0: return db.estados || db.avaliacoes_gerais;
      case 1: return selections[0] ? db.cidades?.[selections[0]] : null;
      case 2: return selections[1] ? db.escolas?.[selections[1]] : null;
      case 3: return selections[2] ? db.turmas?.[selections[2]] : null;
      case 4: return selections[3] ? db.avaliacoes?.[selections[3]] : null;
      default: return null;
    }
  };

  // ══ RENDERING HELPERS ════════════════════════════════════════════════════
  const breadcrumbHtml = selections.length === 0 ? (
    <span className={`text-neutral-500 font-medium truncate ${variant === 'sidebar' ? 'text-[11px] md:text-[12px]' : 'text-[14px] md:text-[14px]'}`}>
      Escolha uma avaliação para aplicar...
    </span>
  ) : (
    <div className={`flex items-center gap-[8px] flex-1 min-w-0 pr-[16px] overflow-hidden whitespace-nowrap ${variant === 'sidebar' ? 'text-[11px] md:text-[12px]' : 'text-[14px] md:text-[14px]'}`}>
      {isOpen ? (
        // MODO ABERTO: Mostra o caminho completo para permitir navegação retroativa
        selections.map((s, i) => {
          if (!s) return null;
          const isArray = Array.isArray(s);
          const fullLabel = isArray ? `${s.length} ${levels[i]?.title}` : (typeof s === 'object' ? s.nome : s);
          const label = fullLabel.length > 16 ? fullLabel.substring(0, 13) + '...' : fullLabel;
          const isLast = i === selections.length - 1;
          return (
            <React.Fragment key={i}>
              <span
                onClick={(e) => { e.stopPropagation(); setSelections(selections.slice(0, i)); setSearchLevel(i); }}
                className={`font-semibold shrink-0 cursor-pointer hover:underline transition-colors ${isLast ? '' : 'hidden md:block'}`}
                style={{ color: isLast ? (colors?.neutral?.[7] || '#1D2432') : (colors?.neutral?.[5] || '#64748B') }}
              >
                {label}
              </span>
              {(!isLast || (multiSelectLeaf && selectedLeafs.length > 0)) && <ChevronRight size={20} className="text-neutral-400 shrink-0 hidden md:block" />}
            </React.Fragment>
          );
        })
      ) : (
        // MODO FECHADO: Mostra apenas o último item selecionado (ex: o Teste) com truncamento
        (() => {
          const lastIdx = selections.length - 1;
          const s = selections[lastIdx];
          const isArray = Array.isArray(s);
          const fullLabel = isArray ? `${s.length} ${levels[lastIdx]?.title}` : (typeof s === 'object' ? s.nome : s);
          return (
            <span
              className="font-bold truncate w-full"
              style={{ color: colors?.neutral?.[7] || '#1D2432' }}
              title={fullLabel}
            >
              {fullLabel}
            </span>
          );
        })()
      )}
      {multiSelectLeaf && selectedLeafs.length > 0 && (
        <span className="font-bold whitespace-nowrap" style={{ color: colors?.primary?.base }}>
          ({selectedLeafs.length}) {levels[levels.length - 1]?.title}
        </span>
      )}
    </div>
  );

  return (
    <div className={`relative w-full`} style={{ zIndex: isOpen ? 80 : 40 }} ref={containerRef}>
      {/* Top Selector Bar */}
      <div className="items-center gap-[6px] md:gap-[8px] flex w-full">
        <div
          className={`flex items-center bg-neutral-0 border transition-all ${isOpen ? 'border-[2px] border-[var(--primary-base)] ring-2 ring-[var(--primary-light)]' : 'border-neutral-300 shadow-sm'} rounded-[4px] ${variant === 'sidebar' ? 'h-[36px] md:h-[40px] px-[12px] flex-1 min-w-0' : 'h-[44px] md:h-[48px] px-[16px] w-fit min-w-[40%] max-w-[calc(100%-56px)]'} cursor-pointer hover:border-[var(--primary-base)] overflow-hidden`}
          onClick={toggle}
        >
          <Blocks size={20} className="text-primary-base shrink-0 mr-[8px] md:mr-[12px]" />
          {breadcrumbHtml}
        </div>
        {!isMobile && (
          <button
            onClick={toggle}
            className={`${variant === 'sidebar' ? 'w-[36px] h-[36px] md:w-[40px] md:h-[40px]' : 'w-[44px] h-[44px] md:w-[48px] md:h-[48px]'} shrink-0 rounded-[4px] flex items-center justify-center transition-colors ${isOpen ? 'bg-neutral-100 border border-neutral-300 text-neutral-700' : 'bg-[#008BC9] text-white hover:bg-[#003A79] shadow-sm'}`}
          >
            {isOpen ? <X size={20} /> : <PanelLeftOpen size={20} />}
          </button>
        )}
      </div>

      {isOpen && (
        isMobile ? (
          <CascadeMobile
            levels={levels}
            selections={selections}
            selectedLeafs={selectedLeafs}
            mobileStep={mobileStep}
            setMobileStep={setMobileStep}
            onClose={() => setIsOpen(false)}
            colors={colors}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            multiSelectLeaf={multiSelectLeaf}
            isSyncing={isSyncing}
            syncingLevel={syncingLevel}
            onSelectItem={selectItem}
            onClearAll={handleClearRequest}
            onConfirm={handleConfirm}
            onToggleAll={toggleAllForLevel}
            getCascadeDataForLevel={getCascadeDataForLevel}
            pendingLeafItems={pendingLeafItems}
          />
        ) : (
          <CascadeDesktop
            levels={levels}
            selections={selections}
            selectedLeafs={selectedLeafs}
            searchLevel={searchLevel}
            setSearchLevel={setSearchLevel}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            columnsRef={columnsRef}
            multiSelectLeaf={multiSelectLeaf}
            isSyncing={isSyncing}
            syncingLevel={syncingLevel}
            colors={colors}
            onSelectItem={selectItem}
            onSelectLevel={(idx) => { setSelections(selections.slice(0, idx)); setSearchLevel(idx); }}
            onToggleAll={toggleAllForLevel}
            onClearAll={handleClearRequest}
            onConfirm={handleConfirm}
            getCascadeDataForLevel={getCascadeDataForLevel}
            pendingLeafItems={pendingLeafItems}
            variant={variant}
          />
        )
      )}

      {/* Confirmation Overlay for Clear All - Rendered via Portal to cover full screen */}
      {showClearConfirm && createPortal(
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setShowClearConfirm(false)}
        >
          <div
            className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm border border-gray-200 animate-scale-up"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-900 mb-2">Limpar Seleção?</h3>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              Esta ação irá remover todo o contexto selecionado e retornar o mapa ao estado inicial. Deseja continuar?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 py-2.5 rounded-lg border border-gray-300 font-bold text-gray-700 hover:bg-gray-50 transition-colors"
              >
                CANCELAR
              </button>
              <button
                onClick={confirmClear}
                className="flex-1 py-2.5 rounded-lg bg-red-600 text-white font-bold hover:bg-red-700 transition-all shadow-md active:scale-95"
              >
                LIMPAR TUDO
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
      )}
    </div >
  );
}
