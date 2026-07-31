import React from 'react';
import { Search, X, Camera, School, ChevronRight } from 'lucide-react';
import Input from '../../ui/Input';

export default function StepEscolas({
  themeColors,
  schoolSearch,
  setSchoolSearch,
  schoolsList,
  setSelectedSchool,
  setStep,
  handleMobileScroll,
  isHeaderHidden
}) {
  const filteredSchools = schoolsList.filter(s =>
    s.toLowerCase().includes(schoolSearch.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white animate-fade-slide">
      <div
        className="flex-1 p-[16px] flex flex-col gap-[16px]"
      >
        <div>
          <h1
            className="text-[20px] font-black text-neutral-800 tracking-tight"
            style={{ color: themeColors?.neutral?.[7] || '#0f172a' }}
          >
            Digitalização de Avaliações
          </h1>
          <p className="text-[12px] text-neutral-5 font-semibold mt-[1px]">
            Módulo dedicado ao registro e escaneamento de testes Mapear
          </p>
        </div>

        {/* Hero Banner */}
        <div className="bg-gradient-to-r from-[#003A79] to-[#008BC9] text-white p-[18px] rounded-[16px] shadow-md flex items-center gap-[14px]">
          <img
            src={`${import.meta.env.BASE_URL}assets/Figure/colored/successful.png`}
            alt="Sucesso"
            className="w-[48px] h-[48px] object-contain shrink-0"
          />
          <div>
            <h3 className="text-[15px] font-black leading-tight">Do papel ao digital!</h3>
            <p className="text-[12px] text-sky-100 mt-[2px] leading-relaxed">
              Realize o escaneamento por celular ou tablet de testes realizados pelos estudantes.
            </p>
          </div>
        </div>

        {/* Search bar */}
        <Input
          placeholder="Buscar..."
          value={schoolSearch}
          onChange={(e) => setSchoolSearch(e.target.value)}
          iconLeft={<Search size={16} />}
          iconRight={schoolSearch ? <X size={16} onClick={() => setSchoolSearch('')} /> : null}
          height="40px"
        />

        {/* Section title */}
        <div className="flex flex-col mt-[4px]">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[14px] font-bold text-neutral-800">
              Lista de Escolas
            </span>
            {schoolSearch.trim() !== '' && (
              <span className="text-[11px] text-neutral-5 font-semibold">
                Resultados encontrados ({filteredSchools.length})
              </span>
            )}
          </div>

          {/* List items */}
          <div className="flex flex-col gap-[8px]">
            {filteredSchools.map((school, index) => (
              <div
                key={index}
                onClick={() => {
                  setSelectedSchool(school);
                  setStep('avaliacoes');
                }}
                className="w-full py-3.5 px-3 rounded-[8px] flex items-center justify-between hover:bg-sky-50 active:bg-sky-100 transition-colors cursor-pointer group bg-white"
              >
                <div className="flex items-center gap-[12px] min-w-0">
                  <School size={20} className="text-[#003A79] shrink-0" />
                  <span className="text-[14px] font-bold text-[#003A79] truncate">
                    {school}
                  </span>
                </div>
                <ChevronRight size={18} className="text-[#003A79] group-hover:translate-x-0.5 transition-transform shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
