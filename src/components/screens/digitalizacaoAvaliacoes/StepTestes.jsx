import React from 'react';
import { Search, X, AlertCircle, ChevronRight } from 'lucide-react';
import Input from '../../ui/Input';
import MobileNavigationHeader from './MobileNavigationHeader';
import StepProgress from './StepProgress';
import CascadeBreadcrumb from './CascadeBreadcrumb';

export default function StepTestes({
  themeColors,
  selectedEvaluation,
  testSearch,
  setTestSearch,
  testsList,
  setSelectedTest,
  setStep,
  showInfoBannerTestes,
  setShowInfoBannerTestes,
  handleMobileScroll,
  isHeaderHidden
}) {
  const filtered = testsList.filter(t =>
    t.toLowerCase().includes(testSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-slide">
      {/* Fixed Navigation Top Block */}
      <div className={`sticky top-0 z-30 shrink-0 bg-white shadow-xs border-b border-neutral-100 transition-all duration-300 ${isHeaderHidden ? 'pt-0' : 'pt-0'}`}>
        <MobileNavigationHeader
          title="Testes"
          onBack={() => setStep('avaliacoes')}
          iconType="save"
          isHeaderHidden={isHeaderHidden}
          themeColors={themeColors}
        />
        <StepProgress currentStep={2} setStep={setStep} />
        <CascadeBreadcrumb leftText={selectedEvaluation} rightText="Escolhendo..." onLeftClick={() => setStep('avaliacoes')} />

        <div className="px-[16px] pb-[12px] bg-white">
          <Input
            placeholder="Buscar teste..."
            value={testSearch}
            onChange={(e) => setTestSearch(e.target.value)}
            iconLeft={<Search size={16} />}
            iconRight={testSearch ? <X size={16} onClick={() => setTestSearch('')} /> : null}
            height="40px"
          />
        </div>
      </div>

      <div className="flex-1 flex flex-col">
        {/* Full-width Info callout */}
        {showInfoBannerTestes && (
          <div className="w-full px-[16px] py-[12px] bg-[#E6F6FC] border-y border-[#B3E6F5] flex items-center gap-[12px] shrink-0 animate-fade-in">
            <div className="w-[28px] h-[28px] rounded-full bg-[#B3E6F5] text-[#008BC9] flex items-center justify-center shrink-0">
              <AlertCircle size={16} />
            </div>
            <p className="text-[12px] text-neutral-800 font-semibold leading-snug flex-1">
              Você está visualizando todos os testes realizados nesta escola.
            </p>
            <button
              onClick={() => setShowInfoBannerTestes(false)}
              className="text-neutral-400 hover:text-neutral-600 p-1 rounded-full hover:bg-black/5 transition-colors"
              title="Fechar aviso"
            >
              <X size={14} />
            </button>
          </div>
        )}

        <div className="p-[16px] flex flex-col">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-bold text-neutral-800">
              Lista de Testes
            </span>
            {testSearch.trim() !== '' && (
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
                  setSelectedTest(item);
                  setStep('turmas');
                }}
                className="w-full py-3.5 px-3 rounded-[8px] flex items-center justify-between hover:bg-sky-50 active:bg-sky-100 transition-colors cursor-pointer group bg-white"
              >
                <span className="text-[14px] font-bold text-[#003A79] leading-snug flex-1 break-words">
                  {item}
                </span>
                <ChevronRight size={18} className="text-[#003A79] group-hover:translate-x-0.5 transition-transform shrink-0 ml-2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
