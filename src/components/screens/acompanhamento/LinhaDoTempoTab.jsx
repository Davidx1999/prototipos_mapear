import React, { useState } from 'react';
import { ChevronLeft, ChevronDown } from 'lucide-react';
import { TIMELINE_STUDENT_DATA } from './mockDataAcompanhamento';

export default function LinhaDoTempoTab() {
  const [selectedYear, setSelectedYear] = useState(2025);
  const [selectedMonth, setSelectedMonth] = useState('Jan');

  const years = [2022, 2023, 2024, 2025, 2026];
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];

  return (
    <div className="flex flex-col items-center py-6 w-full select-none">
      {/* ─── NAVEGAÇÃO DE ANOS COM DESTAQUE ─── */}
      <div className="flex items-center gap-8 mb-6">
        {years.map((yr) => {
          const isSelected = yr === selectedYear;
          return (
            <button
              key={yr}
              onClick={() => setSelectedYear(yr)}
              className="flex flex-col items-center transition-all group"
            >
              <span
                className={`transition-colors ${
                  isSelected
                    ? 'text-2xl md:text-3xl font-black text-slate-800'
                    : 'text-lg font-bold text-slate-400 hover:text-slate-600'
                }`}
              >
                {yr}
              </span>
              {isSelected && (
                <div className="w-full h-1 bg-[#008BC9] rounded-full mt-1 shadow-2xs" />
              )}
            </button>
          );
        })}
      </div>

      {/* ─── NAVEGAÇÃO DE MESES ─── */}
      <div className="flex items-center gap-4 md:gap-6 mb-10 overflow-x-auto max-w-full pb-2 scrollbar-hide text-xs font-bold">
        {months.map((m) => {
          const isSelected = m === selectedMonth;
          return (
            <button
              key={m}
              onClick={() => setSelectedMonth(m)}
              className={`pb-1 border-b-2 transition-all whitespace-nowrap ${
                isSelected
                  ? 'border-[#008BC9] text-[#008BC9] font-extrabold flex items-center gap-1'
                  : 'border-transparent text-slate-400 hover:text-slate-600 font-semibold'
              }`}
            >
              <span>{m}</span>
              {isSelected && <ChevronDown className="w-3 h-3 text-[#008BC9]" />}
            </button>
          );
        })}
        <button className="pb-1 border-b-2 border-transparent text-slate-400 hover:text-slate-600 font-semibold flex items-center gap-1">
          <span>Pós</span>
          <ChevronDown className="w-3 h-3 text-slate-400" />
        </button>
      </div>

      {/* ─── LINHA DO TEMPO VERTICAL COM CARDS ALTERNADOS ─── */}
      <div className="relative w-full max-w-4xl mx-auto pt-4">
        {/* Linha Central Azul */}
        <div className="absolute top-0 bottom-0 left-6 md:left-1/2 w-0.5 bg-[#94CFEF] -translate-x-1/2" />

        {TIMELINE_STUDENT_DATA.map((monthData, idx) => {
          const isLeft = idx % 2 === 0;

          return (
            <div
              key={idx}
              className={`relative flex w-full mb-10 flex-col md:flex-row ${
                isLeft ? 'md:flex-row-reverse' : ''
              } items-start`}
            >
              {/* Marcador Circular Central */}
              <div className="absolute left-6 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#008BC9] border-2 border-white -translate-x-1/2 mt-1 z-10 shadow-sm" />

              {/* Espaço Vazio de Metade para manter alternância no Desktop */}
              <div className="hidden md:block md:w-1/2" />

              {/* Conteúdo do Mês e Cards */}
              <div
                className={`w-full pl-12 md:pl-0 md:w-1/2 flex flex-col ${
                  isLeft ? 'md:pr-8 md:items-end' : 'md:pl-8 md:items-start'
                }`}
              >
                {/* Nome do Mês */}
                <div className="text-sm font-extrabold text-[#008BC9] mb-3">
                  {monthData.month}
                </div>

                {/* Lista de Cards do Mês */}
                <div className="flex flex-col gap-3 w-full max-w-sm">
                  {monthData.items.map((item, itemIdx) => (
                    <div key={itemIdx} className="w-full">
                      {/* Card Tipo Texto */}
                      {item.type === 'text' && (
                        <div className="bg-white border border-slate-200 rounded-lg p-3 shadow-2xs text-xs font-bold text-slate-700 hover:border-slate-300 transition-colors">
                          {item.content}
                        </div>
                      )}

                      {/* Card Tipo Avaliação / Ranking */}
                      {item.type === 'card' && (
                        <div className="bg-white border border-slate-200 rounded-lg p-4 shadow-2xs hover:border-slate-300 transition-all">
                          {/* Chips Superiores */}
                          <div className="flex justify-between items-center mb-3">
                            <span className="text-[10px] font-extrabold text-[#008BC9] px-2 py-0.5 rounded bg-[#D9F0FC] border border-[#94CFEF]">
                              {item.scale || 'Larga Escala'}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500">
                              {item.rank}
                            </span>
                          </div>

                          {/* Título da Avaliação */}
                          <h4 className="text-xs font-bold text-slate-800 mb-3 leading-snug text-left">
                            {item.title}
                          </h4>

                          {/* Barra de Gradiente com Ponteiro Marcador */}
                          <div className="relative w-full h-2 rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 mb-1.5 shadow-inner">
                            <div
                              className="absolute top-1/2 -translate-y-1/2 w-1.5 h-4 bg-[#1D2432] rounded-full shadow-sm"
                              style={{ left: `${item.score}%` }}
                              title={`Desempenho: ${item.score}%`}
                            />
                          </div>

                          {/* Rótulo inferior */}
                          <div className="flex justify-end text-[10px] font-bold text-slate-400">
                            {item.rank}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          );
        })}

        {/* Ponto Final da Linha */}
        <div className="relative w-full flex justify-start md:justify-center -mt-4">
          <div className="absolute left-6 md:left-1/2 w-2.5 h-2.5 rounded-full bg-[#94CFEF] -translate-x-1/2 z-10" />
        </div>
      </div>

      {/* ─── BOTÃO RETORNAR PARA O ANO ANTERIOR ─── */}
      <button
        onClick={() => setSelectedYear(prev => prev - 1)}
        className="mt-8 inline-flex items-center gap-2 px-5 py-2.5 bg-[#008BC9] hover:bg-[#0078B0] text-white text-xs font-extrabold rounded-lg shadow-2xs transition-all uppercase tracking-wide"
      >
        <ChevronLeft className="w-4 h-4" />
        <span>Retornar para o ano anterior</span>
      </button>
    </div>
  );
}
