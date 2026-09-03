import React from 'react';
import { YEARS_LIST } from './mockDataAcompanhamento';

export default function AcompanhamentoFilters({
  selectedYear,
  setSelectedYear,
  tipoDominio,
  setTipoDominio,
  tipoAmostra,
  setTipoAmostra
}) {
  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 select-none">
      {/* ─── ANO DE ACOMPANHAMENTO (Sem setas, alinhado em altura com os segmented buttons) ─── */}
      <div className="flex flex-col">
        <label className="text-sm font-bold text-[#1D2432] mb-2">
          Ano de Acompanhamento
        </label>

        <div className="flex items-center gap-2 h-[40px] overflow-x-auto scrollbar-hide text-sm font-bold">
          {/* Opção "Todos" */}
          <button
            onClick={() => setSelectedYear('Todos')}
            className={`h-[40px] px-3.5 flex items-center justify-center rounded-[6px] transition-all cursor-pointer ${
              selectedYear === 'Todos'
                ? 'bg-[#5AB6E2] text-[#002C5E] border-[1.5px] border-[#001D31] shadow-xs'
                : 'text-[#002C5E] hover:bg-[#BCE5F8] hover:text-[#002C5E] border-[1.5px] border-transparent'
            }`}
          >
            Todos
          </button>

          {/* Anos de 2023 a 2026 */}
          {YEARS_LIST.filter((y) => y !== 'Todos').map((ano) => {
            const isSelected = selectedYear === ano;
            return (
              <button
                key={ano}
                onClick={() => setSelectedYear(ano)}
                className={`h-[40px] px-3.5 flex items-center justify-center rounded-[6px] transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-[#5AB6E2] text-[#002C5E] border-[1.5px] border-[#001D31] shadow-xs'
                    : 'text-[#002C5E] hover:bg-[#BCE5F8] hover:text-[#002C5E] border-[1.5px] border-transparent'
                }`}
              >
                {ano}
              </button>
            );
          })}
        </div>
      </div>

      {/* ─── TIPO DE DOMÍNIO E TIPO DE AMOSTRA (SÓLIDOS COM BG #5AB6E2 QUANDO SELECIONADO, CORNER RADIUS 16PX) ─── */}
      <div className="flex items-center gap-6 flex-wrap">
        {/* Tipo de Domínio */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-[#1D2432] mb-2">
            Tipo de Domínio
          </label>
          <div className="inline-flex h-[40px] items-center">
            <button
              onClick={() => setTipoDominio('Repertório')}
              className={`h-[40px] px-5 text-sm font-bold transition-all rounded-l-[16px] flex items-center justify-center cursor-pointer border ${
                tipoDominio === 'Repertório'
                  ? 'bg-[#5AB6E2] text-[#002C5E] border-[#5AB6E2] z-10'
                  : 'bg-white text-[#002C5E] border-[#CBD5E1] hover:bg-[#BCE5F8] hover:text-[#008BC9] hover:border-[#008BC9]'
              }`}
            >
              Repertório
            </button>
            <button
              onClick={() => setTipoDominio('Cognitivo')}
              className={`h-[40px] px-5 text-sm font-bold transition-all rounded-r-[16px] -ml-[1px] flex items-center justify-center cursor-pointer border ${
                tipoDominio === 'Cognitivo'
                  ? 'bg-[#5AB6E2] text-[#002C5E] border-[#5AB6E2] z-10'
                  : 'bg-white text-[#002C5E] border-[#CBD5E1] hover:bg-[#BCE5F8] hover:text-[#008BC9] hover:border-[#008BC9]'
              }`}
            >
              Cognitivo
            </button>
          </div>
        </div>

        {/* Tipo de Amostra */}
        <div className="flex flex-col">
          <label className="text-sm font-bold text-[#1D2432] mb-2">
            Tipo de Amostra
          </label>
          <div className="inline-flex h-[40px] items-center">
            <button
              onClick={() => setTipoAmostra('TRI')}
              className={`h-[40px] px-5 text-sm font-bold transition-all rounded-l-[16px] flex items-center justify-center cursor-pointer border ${
                tipoAmostra === 'TRI'
                  ? 'bg-[#5AB6E2] text-[#002C5E] border-[#5AB6E2] z-10'
                  : 'bg-white text-[#002C5E] border-[#CBD5E1] hover:bg-[#BCE5F8] hover:text-[#008BC9] hover:border-[#008BC9]'
              }`}
            >
              Correções TRI
            </button>
            <button
              onClick={() => setTipoAmostra('TCT')}
              className={`h-[40px] px-5 text-sm font-bold transition-all rounded-r-[16px] -ml-[1px] flex items-center justify-center cursor-pointer border ${
                tipoAmostra === 'TCT'
                  ? 'bg-[#5AB6E2] text-[#002C5E] border-[#5AB6E2] z-10'
                  : 'bg-white text-[#002C5E] border-[#CBD5E1] hover:bg-[#BCE5F8] hover:text-[#008BC9] hover:border-[#008BC9]'
              }`}
            >
              Correções TCT
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
