import React from 'react';
import { ChevronUp, HelpCircle, Eye, XCircle, Maximize, Grid, CheckCircle2, MinusCircle, XCircle as XCircleIcon, Route, FileText, ChevronDown } from 'lucide-react';
import CascadeSelector from '../../ui/CascadeSelector';
import { devDB, CASCADE_LEVELS } from './HeatmapUtils';

export default function HeatmapSidebar({
  isContextExpanded,
  setIsContextExpanded,
  calcMethod,
  setCalcMethod,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  hideNoParticipation,
  setHideNoParticipation,
  statusColors,
  colorTheme,
  isColorsActive,
  navPath,
  handleContextChange
}) {
  return (
    <aside className={`shrink-0 bg-neutral-0 border-r border-neutral-2 overflow-y-auto flex flex-col transition-all duration-300 ${isContextExpanded ? 'w-[280px]' : 'w-0 overflow-hidden'}`}>
      {isContextExpanded && (
        <div className="flex flex-col gap-2 p-4 h-full">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ChevronUp size={16} className="text-neutral-6 cursor-pointer" onClick={() => setIsContextExpanded(false)} />
              <span className="font-semibold text-[13px] text-neutral-6">Seleção de Contexto</span>
            </div>
            <HelpCircle size={16} className="text-neutral-5" />
          </div>

          <hr className="border-neutral-2" />

          {/* Filtro em Cascata */}
          <div className="flex flex-col gap-1">
            <span className="text-[11px] font-bold text-neutral-5 uppercase tracking-wider mb-1">Filtro em Cascata</span>
            <CascadeSelector
              db={devDB}
              levels={CASCADE_LEVELS}
              colors={{ primary: { base: '#008BC9' }, neutral: ['#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#1F2937'] }}
              onConfirm={handleContextChange}
              variant="sidebar"
              initialSelections={navPath}
            />
          </div>

          <hr className="border-neutral-2" />

          {/* Cálculo das Interseções */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[13px] font-semibold text-neutral-6">Cálculo das Interseções por</span>
              <HelpCircle size={14} className="text-neutral-5" />
            </div>
            <div className="flex gap-0 p-1 bg-neutral-1 rounded-lg border border-gray-100">
              {['Média', 'Mediana', 'Moda'].map((type) => (
                <button
                  key={type}
                  onClick={() => setCalcMethod(type)}
                  className={`flex-1 py-2 text-[12px] font-bold rounded-md transition-all ${calcMethod === type ? 'bg-[#94CFEF] text-primary-dark shadow-sm' : 'text-primary-base hover:bg-neutral-2'}`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          {/* Ajustes de Exibição */}
          <div className="flex justify-between items-center mt-1">
            <span className="text-[13px] font-semibold text-neutral-6">Ajustes de Exibição</span>
            <HelpCircle size={14} className="text-neutral-6" />
          </div>

          <div className="flex flex-col gap-3">
            {/* Ordenar por */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-neutral-6">Ordenar por</label>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="w-full h-9 px-3 bg-neutral-0 border border-[#CACDD5] rounded-lg text-[13px] text-neutral-6 appearance-none focus:outline-none focus:border-primary-base cursor-pointer pr-8"
                >
                  <option value="Score">Score</option>
                  <option value="Nome">Nome</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-5 pointer-events-none" />
              </div>
            </div>

            {/* Ordem */}
            <div className="flex flex-col gap-1">
              <label className="text-[11px] font-semibold text-neutral-6">Ordem</label>
              <div className="relative">
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full h-9 px-3 bg-neutral-0 border border-[#CACDD5] rounded-lg text-[13px] text-neutral-6 appearance-none focus:outline-none focus:border-primary-base cursor-pointer pr-8"
                >
                  <option value="Desempenho Crescente">Desempenho Crescente</option>
                  <option value="Desempenho Decrescente">Desempenho Decrescente</option>
                  <option value="A-Z">A → Z</option>
                  <option value="Z-A">Z → A</option>
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-5 pointer-events-none" />
              </div>
            </div>

            {/* Ocultar Sem Participação */}
            <div className="flex items-center justify-between mt-1">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setHideNoParticipation(!hideNoParticipation)}
                  className={`w-9 h-5 rounded-full relative transition-colors ${hideNoParticipation ? 'bg-[#008BC9]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-[2px] w-4 h-4 rounded-full bg-neutral-0 transition-all shadow-sm ${hideNoParticipation ? 'right-[2px]' : 'left-[2px]'}`}></div>
                </button>
                <span className="text-[13px] text-neutral-7">Ocultar Sem Participação</span>
              </div>
              <Eye size={16} className="text-neutral-5" />
            </div>
          </div>

          <hr className="border-neutral-2 mt-1" />

          {/* Legenda dos Centroídes */}
          <div>
            <div className="flex justify-between items-center mb-3">
              <span className="text-[12px] font-bold text-neutral-6">Legenda dos Centroides</span>
              <HelpCircle size={14} className="text-neutral-6" />
            </div>
            <div className="flex flex-col gap-2">
              {[
                { bg: '#B8EBAD', border: '#8CD47E', text: 'Suficiente', icon: <CheckCircle2 size={12} className="text-green-700" /> },
                { bg: '#FEF0C7', border: '#F8D66D', text: 'Parcialmente Suficiente', icon: <MinusCircle size={12} className="text-yellow-700" /> },
                { bg: '#FFACB7', border: '#FF6961', text: 'Insuficiente', icon: <XCircle size={12} className="text-red-700" /> },
                { bg: '#B3E6F5', border: '#92C9D9', text: 'Sem Conteúdo Relevante', icon: <Route size={12} className="text-cyan-700" /> },
                { bg: '#DEE1E8', border: '#CACDD5', text: 'Em Branco', icon: <FileText size={12} className="text-neutral-5" /> },
              ].map((item, idx) => (
                <div key={idx} className="px-2.5 py-1.5 rounded-full flex items-center gap-2 w-fit border" style={{ backgroundColor: item.bg, borderColor: `${item.border}40` }}>
                  {item.icon}
                  <span className="text-[11px] font-medium text-neutral-6">{item.text}</span>
                </div>
              ))}
            </div>
          </div>

          <hr className="border-neutral-2 mt-1" />

          {/* Escala de Desempenho Médio */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-[12px] font-bold text-neutral-6">Escala de Desempenho Médio</span>
              <HelpCircle size={14} className="text-neutral-5" />
            </div>
            <div className="w-full">
              <div className="h-4 w-full bg-gradient-to-r from-white via-[#B3E6F5] via-[#FF6961] via-[#F8D66D] to-[#8CD47E] rounded border border-gray-300"></div>
              <div className="flex justify-between text-[10px] font-bold mt-1 text-neutral-6">
                <span>0</span>
                <span>25</span>
                <span>50</span>
                <span>75</span>
                <span>100</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
