import React from 'react';
import { Search, X, ChevronRight } from 'lucide-react';
import Input from '../../ui/Input';
import MobileNavigationHeader from './MobileNavigationHeader';
import StepProgress from './StepProgress';
import CascadeBreadcrumb from './CascadeBreadcrumb';

export default function StepTurmas({
  themeColors,
  selectedTest,
  classSearch,
  setClassSearch,
  classesList,
  setSelectedClass,
  setStep,
  handleMobileScroll,
  isHeaderHidden
}) {
  const filtered = classesList.filter(c =>
    c.toLowerCase().includes(classSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-slide">
      {/* Fixed Navigation Top Block */}
      <div className={`sticky top-0 z-30 shrink-0 bg-white shadow-xs border-b border-neutral-100 transition-all duration-300 ${isHeaderHidden ? 'pt-0' : 'pt-0'}`}>
        <MobileNavigationHeader
          title="Turmas"
          onBack={() => setStep('testes')}
          iconType="users"
          isHeaderHidden={isHeaderHidden}
          themeColors={themeColors}
        />
        <StepProgress currentStep={3} setStep={setStep} />
        <CascadeBreadcrumb leftText={selectedTest} rightText="Escolhendo..." onLeftClick={() => setStep('testes')} />

        <div className="px-[16px] pb-[12px] bg-white">
          <Input
            placeholder="Buscar turma..."
            value={classSearch}
            onChange={(e) => setClassSearch(e.target.value)}
            iconLeft={<Search size={16} />}
            iconRight={classSearch ? <X size={16} onClick={() => setClassSearch('')} /> : null}
            height="40px"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        <div className="p-[16px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-bold text-neutral-800">
              Lista de Turmas
            </span>
            {classSearch.trim() !== '' && (
              <span className="text-[11px] text-neutral-5 font-semibold">
                Resultados encontrados ({filtered.length})
              </span>
            )}
          </div>

          <div className="flex flex-col gap-[8px]">
            {filtered.map((item, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedClass(item);
                  setStep('estudantes');
                }}
                className="w-full py-3.5 px-3 rounded-[8px] flex items-center justify-between hover:bg-sky-50 active:bg-sky-100 transition-colors cursor-pointer group bg-white"
              >
                <span className="text-[14px] font-bold text-[#003A79] truncate">
                  {item}
                </span>
                <ChevronRight size={18} className="text-[#003A79] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
