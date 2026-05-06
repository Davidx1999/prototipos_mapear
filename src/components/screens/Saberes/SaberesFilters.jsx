import React, { useState, useRef, useEffect } from 'react';
import { Search, Filter, ChevronDown, Check, X } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import InteractiveChip from '../../ui/InteractiveChip';
import {
  mockComponentes,
  mockDominios,
  mockConhecimentos
} from '../../../data/mockData';

const SaberesFilters = ({
  colors,
  activeSaberesTab,
  searchValue,
  setSearchValue,
  activeFilters,
  setActiveFilters
}) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const dropdownRef = useRef(null);

  const toggleDropdown = (filterId) => {
    // If it's already active and we click the X (iconRight), it will be handled by InteractiveChip or we handle it here
    setOpenDropdown(openDropdown === filterId ? null : filterId);
  };

  const removeFilter = (filterId, e) => {
    e.stopPropagation();
    const newFilters = { ...activeFilters };
    delete newFilters[filterId];
    setActiveFilters(newFilters);
    setOpenDropdown(null);
  };

  const selectFilterOption = (filterId, value) => {
    setActiveFilters(prev => ({
      ...prev,
      [filterId]: value
    }));
    setOpenDropdown(null);
  };

  const handleSearch = () => {
    console.log('Searching for:', searchValue);
  };

  const onKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setOpenDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const DropdownMenu = ({ type, options }) => (
    <div
      className="absolute top-full mt-[8px] right-0 w-[220px] bg-neutral-0 border border-neutral-2 rounded-[8px] shadow-lg z-[50] py-[8px] animate-slide-down-small"
      style={{ borderColor: colors.neutral[2], backgroundColor: colors.neutral[0] }}
    >
      <div className="px-[12px] py-[4px] mb-[4px] border-b border-neutral-1">
        <span className="text-[10px] font-bold text-neutral-4 uppercase tracking-widest">Selecionar Opção</span>
      </div>
      {options.map((opt, i) => (
        <div
          key={i}
          onClick={() => selectFilterOption(type, opt)}
          className="px-[12px] py-[8px] text-[13px] hover:bg-neutral-1 cursor-pointer transition-colors flex items-center justify-between group"
          style={{ color: colors.neutral[7] }}
        >
          {opt}
          <div className="w-[4px] h-[4px] rounded-full bg-primary-base opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      ))}
    </div>
  );

  const filterCount = Object.keys(activeFilters).length;

  return (
    <div className="flex flex-col mb-[24px] gap-[8px]">
      {activeSaberesTab !== 6 && (
        <>
          {/* Row 1: Search */}
          <div className="flex items-center gap-[8px] md:gap-[8px] w-full">
            <div className="flex-1">
              <Input
                iconLeft={<Search />}
                placeholder="Pesquise pelo código ou título"
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onKeyDown={onKeyDown}
                className="w-full"
              />
            </div>
            <Button
              variant="primary"
              iconOnly
              size="default"
              onClick={handleSearch}
              className="shrink-0"
            >
              <Search size={20} />
            </Button>
          </div>

          {/* Row 2: Interactive Filter Chips */}
          {activeSaberesTab > 0 && (
            <div className="flex flex-wrap items-center justify-end gap-[8px] md:gap-[8px]" ref={dropdownRef}>

              <div className="relative">
                <InteractiveChip
                  label={activeFilters.comp || "Componente"}
                  isActive={!!activeFilters.comp}
                  onClick={() => toggleDropdown('comp')}
                  variant="stroked"
                  size="md"
                  iconLeft={activeFilters.comp ? <Check /> : <Filter />}
                  iconRight={activeFilters.comp ? <X onClick={(e) => removeFilter('comp', e)} /> : <ChevronDown />}
                />
                {openDropdown === 'comp' && (
                  <DropdownMenu
                    type="comp"
                    options={mockComponentes.map(c => c.title)}
                  />
                )}
              </div>

              {(activeSaberesTab === 4 || activeSaberesTab === 5) && (
                <div className="relative">
                  <InteractiveChip
                    label={activeFilters.repertorio || "Repertório"}
                    isActive={!!activeFilters.repertorio}
                    onClick={() => toggleDropdown('repertorio')}
                    variant="stroked"
                    size="md"
                    iconLeft={activeFilters.repertorio ? <Check /> : <Filter />}
                    iconRight={activeFilters.repertorio ? <X onClick={(e) => removeFilter('repertorio', e)} /> : <ChevronDown />}
                  />
                  {openDropdown === 'repertorio' && (
                    <DropdownMenu
                      type="repertorio"
                      options={[...new Set(mockConhecimentos.map(c => c.dom))]}
                    />
                  )}
                </div>
              )}

              {activeSaberesTab === 5 && (
                <>
                  <div className="relative">
                    <InteractiveChip
                      label={activeFilters.cognitivo || "Dom. Cognitivo"}
                      isActive={!!activeFilters.cognitivo}
                      onClick={() => toggleDropdown('cognitivo')}
                      variant="stroked"
                      size="md"
                      iconLeft={activeFilters.cognitivo ? <Check /> : <Filter />}
                      iconRight={activeFilters.cognitivo ? <X onClick={(e) => removeFilter('cognitivo', e)} /> : <ChevronDown />}
                    />
                    {openDropdown === 'cognitivo' && (
                      <DropdownMenu
                        type="cognitivo"
                        options={[...new Set(mockDominios.map(d => d.title))]}
                      />
                    )}
                  </div>
                  <div className="relative">
                    <InteractiveChip
                      label={activeFilters.conhecimento || "Conhecimento"}
                      isActive={!!activeFilters.conhecimento}
                      onClick={() => toggleDropdown('conhecimento')}
                      variant="stroked"
                      size="md"
                      iconLeft={activeFilters.conhecimento ? <Check /> : <Filter />}
                      iconRight={activeFilters.conhecimento ? <X onClick={(e) => removeFilter('conhecimento', e)} /> : <ChevronDown />}
                    />
                    {openDropdown === 'conhecimento' && (
                      <DropdownMenu
                        type="conhecimento"
                        options={mockConhecimentos.map(c => c.title).slice(0, 15)}
                      />
                    )}
                  </div>
                </>
              )}

              <div className={`overflow-hidden transition-all duration-300 flex items-center ${filterCount > 0 ? 'w-[80px] opacity-100 ml-[8px]' : 'w-0 opacity-0 ml-0'}`}>
                <Button
                  variant="tertiary"
                  appearance="ghost"
                  size="xs"
                  onClick={() => setActiveFilters({})}
                  className="text-[11px] uppercase font-bold whitespace-nowrap"
                >
                  Limpar
                </Button>
              </div>
            </div>
          )}
        </>
      )}

      {activeSaberesTab === 6 && (
        <div className="flex gap-[16px] w-full flex-col md:flex-row animate-fade-slide">
          <div className="flex-1 flex flex-col gap-[8px]">
            <label className="text-[12px] font-bold" style={{ color: colors.neutral[7] }}>Filtrar por Habilidade Origem</label>
            <select className="w-full px-[16px] py-[10px] rounded-[8px] border text-[13px] outline-none bg-neutral-0 focus:border-primary-base transition-colors" style={{ borderColor: colors.neutral[3] }}>
              <option>Selecione</option>
            </select>
          </div>
          <div className="flex-1 flex flex-col gap-[8px]">
            <label className="text-[12px] font-bold" style={{ color: colors.neutral[7] }}>Filtrar por Habilidade Destino</label>
            <select className="w-full px-[16px] py-[10px] rounded-[8px] border text-[13px] outline-none bg-neutral-0 focus:border-primary-base transition-colors" style={{ borderColor: colors.neutral[3] }}>
              <option>Selecione</option>
            </select>
          </div>
        </div>
      )}
    </div>
  );
};

export default SaberesFilters;
