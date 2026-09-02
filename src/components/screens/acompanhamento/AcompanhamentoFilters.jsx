import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 my-2 select-none">
      {/* ─── ANO DE ACOMPANHAMENTO ─── */}
      <div className="flex flex-col">
        <label className="text-xs font-bold text-slate-800 mb-2">
          Ano de Acompanhamento
        </label>

        <div className="flex items-center gap-3 overflow-x-auto pb-1 scrollbar-hide text-xs font-bold">
          {/* Opção "Todos" - sem borda, apenas texto azul */}
          <button
            onClick={() => setSelectedYear('Todos')}
            className={`transition-colors whitespace-nowrap ${
              selectedYear === 'Todos'
                ? 'bg-[#489EEA] text-[#0F172A] border border-[#1E293B] rounded-[4px] px-2.5 py-1'
                : 'text-[#0078B0] hover:text-[#005580]'
            }`}
          >
            Todos
          </button>

          {/* Seta esquerda */}
          <button
            className="text-slate-500 hover:text-slate-800 transition-colors"
            title="Ano anterior"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>

          {/* Número 4 sutil */}
          <span className="text-[11px] font-semibold text-slate-400">4</span>

          {/* Anos */}
          {YEARS_LIST.filter(y => y !== 'Todos').map((ano) => {
            const isSelected = selectedYear === ano;
            return (
              <button
                key={ano}
                onClick={() => setSelectedYear(ano)}
                className={`transition-all whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#489EEA] text-[#0F172A] border border-[#1E293B] rounded-[4px] px-3.5 py-1 font-bold shadow-2xs'
                    : 'text-[#0078B0] hover:text-[#005580] px-1'
                }`}
              >
                {ano}
              </button>
            );
          })}

          {/* Seta direita */}
          <button
            className="text-slate-500 hover:text-slate-800 transition-colors"
            title="Próximo ano"
          >
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* ─── TIPO DE DOMÍNIO E TIPO DE AMOSTRA ─── */}
      <div className="flex items-center gap-5 flex-wrap">
        {/* Tipo de Domínio */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-800 mb-2">
            Tipo de Domínio
          </label>
          <div className="inline-flex bg-white border border-slate-300 rounded-[6px] overflow-hidden shadow-2xs">
            <button
              onClick={() => setTipoDominio('Repertório')}
              className={`px-4 py-1.5 text-xs font-bold transition-all border-none ${
                tipoDominio === 'Repertório'
                  ? 'bg-[#489EEA] text-white shadow-2xs'
                  : 'text-[#0078B0] hover:bg-slate-50'
              }`}
            >
              Repertório
            </button>
            <button
              onClick={() => setTipoDominio('Cognitivo')}
              className={`px-4 py-1.5 text-xs font-bold transition-all border-none ${
                tipoDominio === 'Cognitivo'
                  ? 'bg-[#489EEA] text-white shadow-2xs'
                  : 'text-[#0078B0] hover:bg-slate-50'
              }`}
            >
              Cognitivo
            </button>
          </div>
        </div>

        {/* Tipo de Amostra */}
        <div className="flex flex-col">
          <label className="text-xs font-bold text-slate-800 mb-2">
            Tipo de Amostra
          </label>
          <div className="inline-flex bg-white border border-slate-300 rounded-[6px] overflow-hidden shadow-2xs">
            <button
              onClick={() => setTipoAmostra('TRI')}
              className={`px-4 py-1.5 text-xs font-bold transition-all border-none ${
                tipoAmostra === 'TRI'
                  ? 'bg-[#489EEA] text-white shadow-2xs'
                  : 'text-[#0078B0] hover:bg-slate-50'
              }`}
            >
              Correções TRI
            </button>
            <button
              onClick={() => setTipoAmostra('TCT')}
              className={`px-4 py-1.5 text-xs font-bold transition-all border-none ${
                tipoAmostra === 'TCT'
                  ? 'bg-[#489EEA] text-white shadow-2xs'
                  : 'text-[#0078B0] hover:bg-slate-50'
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
