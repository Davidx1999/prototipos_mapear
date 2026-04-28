import React, { useState, useRef, useEffect, useCallback } from 'react';
import { PanelLeftOpen, ChevronRight, ChevronDown, X, Search, Eraser, Check, LayoutList } from 'lucide-react';

export default function CascadeSelector({ 
  db, 
  levels, 
  colors, 
  onConfirm, 
  variant = 'default', // 'default' or 'sidebar'
  initialSelections = [] 
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [selections, setSelections] = useState(initialSelections);
  const [searchLevel, setSearchLevel] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const containerRef = useRef(null);
  const columnsRef = useRef(null);

  useEffect(() => {
    if (initialSelections.length > 0) {
      setSelections(initialSelections);
    }
  }, [initialSelections]);

  const toggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);
    if (nextState) {
      setSearchLevel(Math.min(selections.length, levels.length - 1));
      setSearchQuery('');
      setTimeout(scrollToActive, 50);
    }
  };

  const scrollToActive = () => {
    if (columnsRef.current) {
      const targetCol = Math.min(selections.length, levels.length - 1);
      const colWidth = window.innerWidth < 768 ? 240 : 280;
      columnsRef.current.scrollTo({ left: targetCol * colWidth, behavior: 'smooth' });
    }
  };

  const selectItem = (levelIndex, value, objData = null) => {
    const newSelections = selections.slice(0, levelIndex);
    newSelections[levelIndex] = objData || value;
    setSelections(newSelections);
    setSearchQuery('');
    setSearchLevel(Math.min(levelIndex + 1, levels.length - 1));
    setTimeout(scrollToActive, 50);
  };

  const clearAll = () => {
    setSelections([]);
    setSearchQuery('');
    setSearchLevel(0);
    setTimeout(scrollToActive, 50);
  };

  const handleConfirm = () => {
    onConfirm(selections);
    setIsOpen(false);
  };

  const getCascadeDataForLevel = (levelIndex) => {
    if (typeof db === 'function') {
      return db(levelIndex, selections);
    }
    // Default fallback for the structure in the prompt
    switch(levelIndex) {
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
        const label = typeof s === 'object' ? s.nome : s;
        const isLast = i === selections.length - 1;
        return (
          <React.Fragment key={i}>
            <span className={`font-semibold ${isLast ? 'text-neutral-700 truncate block' : 'text-neutral-500 shrink-0 hidden md:block max-w-[120px]'}`}>
              {label}
            </span>
            {!isLast && <ChevronRight size={variant === 'sidebar' ? 12 : 14} className="text-neutral-400 shrink-0 hidden md:block" />}
          </React.Fragment>
        );
      })}
    </div>
  );

  const topBar = (
    <div className={`flex items-center gap-[6px] md:gap-[8px] w-full transition-all ${variant === 'sidebar' ? '' : 'md:max-w-full'}`}>
      <div 
        className={`flex-1 flex items-center bg-white border ${isOpen ? 'border-[#008BC9] shadow-sm ring-2 ring-[#D9F0FC]' : 'border-neutral-300 shadow-sm'} rounded-[8px] ${variant === 'sidebar' ? 'h-[36px] md:h-[40px] px-[12px]' : 'h-[44px] md:h-[48px] px-[16px]'} cursor-pointer hover:border-[#008BC9] overflow-hidden`}
        onClick={toggle}
      >
        <PanelLeftOpen size={variant === 'sidebar' ? 14 : 18} className="text-[#008BC9] shrink-0 mr-[8px] md:mr-[12px]" />
        {breadcrumbHtml}
      </div>
      <button 
        onClick={toggle}
        className={`${variant === 'sidebar' ? 'w-[36px] h-[36px] md:w-[40px] md:h-[40px]' : 'w-[44px] h-[44px] md:w-[48px] md:h-[48px]'} shrink-0 rounded-[4px] flex items-center justify-center transition-colors ${isOpen ? 'bg-neutral-100 border border-neutral-300 text-neutral-700 hover:bg-neutral-200' : 'bg-[#008BC9] text-white hover:bg-[#003A79] shadow-sm'}`}
      >
        {isOpen ? <X size={variant === 'sidebar' ? 16 : 20} /> : <PanelLeftOpen size={variant === 'sidebar' ? 16 : 20} />}
      </button>
    </div>
  );

  return (
    <div className="relative w-full z-40" ref={containerRef}>
      {topBar}
      
      {isOpen && (
        <div className={`absolute top-[calc(100%+12px)] left-0 bg-white rounded-[8px] border border-neutral-300 shadow-2xl overflow-hidden flex flex-col animate-fade-slide z-50 ${variant === 'sidebar' ? 'w-[calc(100vw-32px)] md:w-[48vw] min-w-[800px] max-w-[1200px]' : 'w-[calc(100vw-32px)] md:w-[80vw] max-w-[1100px]'} max-h-[500px]`}>
          
          <div className="flex flex-col md:flex-row border-b border-neutral-200 bg-white shrink-0">
            <div className="w-full md:w-[240px] md:w-[280px] lg:w-[300px] shrink-0 border-b md:border-b-0 md:border-r border-neutral-200 relative">
              <select 
                className="w-full h-[48px] px-[16px] text-[13px] font-bold text-neutral-700 outline-none appearance-none cursor-pointer hover:bg-neutral-50 focus:text-[#008BC9]"
                value={searchLevel}
                onChange={(e) => setSearchLevel(parseInt(e.target.value))}
              >
                {levels.map((lvl, idx) => (
                  <option key={idx} value={idx}>{lvl.title}</option>
                ))}
              </select>
              <ChevronDown size={14} className="absolute right-[16px] top-1/2 -translate-y-1/2 text-neutral-500 pointer-events-none" />
            </div>
            <div className="flex-1 flex items-center relative">
              <Search size={18} className="absolute left-[16px] text-neutral-400" />
              <input 
                type="text" 
                placeholder="Pesquisar..." 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toLowerCase())}
                className="w-full h-[48px] pl-[44px] pr-[40px] text-[14px] font-medium outline-none text-neutral-700 placeholder-neutral-400"
              />
              {searchQuery && <X size={18} onClick={() => setSearchQuery('')} className="absolute right-[16px] text-neutral-400 hover:text-red-500 cursor-pointer" />}
            </div>
          </div>

          <div 
            ref={columnsRef}
            className="flex w-full h-[240px] md:h-[280px] overflow-x-auto custom-scrollbar snap-x snap-mandatory scroll-smooth relative bg-white"
          >
            {levels.map((lvl, i) => {
              const rawItems = getCascadeDataForLevel(i);
              let innerContent = null;

              if (!rawItems || rawItems.length === 0) {
                let emptyMsg = '';
                if (i === 1) emptyMsg = 'Selecione um Estado para ver os Municípios';
                else if (i === 2) emptyMsg = 'Selecione um Município para ver as Escolas';
                else if (i === 3) emptyMsg = 'Selecione uma Escola para ver as Turmas';
                else if (i === 4) emptyMsg = 'Selecione uma Turma para ver os Testes';
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
                  innerContent = filteredItems.map((item, idx) => {
                    const isObj = typeof item === 'object';
                    const label = isObj ? item.nome : item;
                    const value = isObj ? item.id : item;
                    const isSelected = isObj ? (selections[i]?.id === value) : (selections[i] === value);
                    
                    return (
                      <div 
                        key={idx}
                        onClick={() => selectItem(i, value, isObj ? item : null)} 
                        className={`px-[12px] py-[12px] rounded-[4px] text-[13px] font-semibold cursor-pointer transition-colors flex justify-between items-center group ${isSelected ? 'bg-[#003A79] text-white shadow-md' : 'text-neutral-700 hover:bg-neutral-100'}`}
                      >
                        <span className="truncate pr-[8px]" title={label}>{label}</span>
                        {i < levels.length - 1 && <ChevronRight size={16} className={`shrink-0 opacity-50 ${isSelected ? 'text-white' : 'group-hover:text-[#008BC9]'}`} />}
                      </div>
                    );
                  });
                }
              }

              return (
                <div key={i} className="w-[240px] md:w-[280px] lg:w-[300px] shrink-0 border-r border-neutral-200 flex flex-col h-full snap-start bg-white">
                  <div className="p-[12px] border-b border-neutral-200 bg-white shrink-0 sticky top-0 flex items-center justify-between">
                    <span className="text-[13px] font-bold text-neutral-600">{lvl.title}</span>
                  </div>
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-[8px] flex flex-col gap-[2px]">
                    {innerContent}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-[16px] md:px-[24px] md:py-[16px] border-t border-neutral-200 bg-neutral-50 flex justify-end gap-[16px] items-center shrink-0">
            <button 
              onClick={clearAll} 
              className="px-[16px] py-[10px] text-[13px] font-bold text-neutral-600 hover:bg-neutral-200 border border-neutral-300 rounded-[4px] transition-colors flex items-center gap-[6px] bg-white shadow-sm"
            >
              <Eraser size={16} /> LIMPAR SELEÇÃO
            </button>
            <button 
              onClick={handleConfirm}
              disabled={selections.length < levels.length}
              className={`px-[24px] py-[10px] text-[13px] font-bold rounded-[4px] transition-colors flex items-center gap-[8px] ${selections.length >= levels.length ? 'bg-[#008BC9] text-white hover:bg-[#003A79] shadow-md' : 'bg-neutral-300 text-neutral-500 cursor-not-allowed'}`}
            >
              CONFIRMAR <Check size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
