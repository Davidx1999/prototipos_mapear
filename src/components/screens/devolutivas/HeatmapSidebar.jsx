import React from 'react';
import { ChevronUp, HelpCircle, Eye, XCircle, Maximize, Grid, CheckCircle2, MinusCircle, XCircle as XCircleIcon, Route, FileText, ChevronDown, ChevronLeft, Settings2 } from 'lucide-react';
import CascadeSelector from '../../ui/CascadeSelector';
import Chips from '../../ui/Chips';
import { devDB, CASCADE_LEVELS, turmasPendentesMock, participacaoAvaliacaoMock, testesMock } from './HeatmapUtils';

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
  legendItems = [],
  colorTheme,
  isColorsActive,
  navPath,
  selectedTurmas,
  handleContextChange
}) {
  return (
    <aside
      className={`absolute top-4 left-4 z-[100] bg-white/95 backdrop-blur-md border border-neutral-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-2xl flex flex-col transition-all duration-500 ease-in-out ${isContextExpanded ? 'translate-x-0 opacity-100' : '-translate-x-[360px] opacity-0 pointer-events-none'}`}
      style={{ width: '300px', maxHeight: 'calc(100vh - 140px)', overflow: 'visible' }}
    >
      {isContextExpanded && (
        <div className="flex flex-col gap-4 p-5 h-full" style={{ overflow: 'visible' }}>

          {/* Header */}
          <div className="flex items-center justify-between shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary-base/10 flex items-center justify-center">
                <Settings2 size={16} className="text-primary-base" />
              </div>
              <span className="font-bold text-[14px] text-neutral-7">Configurações</span>
            </div>
            <button
              onClick={() => setIsContextExpanded(false)}
              className="p-1.5 hover:bg-neutral-100 rounded-full transition-colors text-neutral-5"
              title="Fechar painel"
            >
              <ChevronLeft size={20} />
            </button>
          </div>

          <div className="h-px bg-neutral-200 w-full shrink-0" />

          {/* Filtro em Cascata */}
          <div className="flex flex-col gap-1 relative" style={{ zIndex: 500 }}>
            <span className="text-[11px] font-bold text-neutral-5 uppercase tracking-wider mb-1">Filtro em Cascata</span>
            <CascadeSelector
              db={(levelIndex, selections, action, params) => {
                if (action === 'getParticipation') {
                  return participacaoAvaliacaoMock[params] || [];
                }
                try {
                  if (levelIndex === 0) return Object.keys(devDB);
                  const [st, mu, re, es, tu, av] = selections;
                  if (levelIndex === 1) return st ? Object.keys(devDB[st] || {}) : null;
                  if (levelIndex === 2) return mu ? Object.keys(devDB[st]?.[mu] || {}) : null;
                  if (levelIndex === 3) return re ? Object.keys(devDB[st]?.[mu]?.[re] || {}) : null;
                  if (levelIndex === 4) {
                    const escolaData = devDB[st]?.[mu]?.[re]?.[es] || {};
                    // Pega todas as turmas únicas presentes nas avaliações dessa escola
                    return [...new Set(Object.values(escolaData).flat())];
                  }
                  if (levelIndex === 5) {
                    const escolaData = devDB[st]?.[mu]?.[re]?.[es] || {};
                    // Só mostra avaliações se houver turmas selecionadas
                    return (tu && tu.length > 0) ? Object.keys(escolaData) : null;
                  }
                  if (levelIndex === 6) {
                    // Só mostra testes se houver uma avaliação selecionada
                    return av ? (testesMock[av] || ['Prova 1', 'Prova 2']) : null;
                  }
                } catch (e) { return null; }
                return null;
              }}
              levels={CASCADE_LEVELS}
              colors={{ primary: { base: '#008BC9', dark: '#003A79' }, neutral: ['#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#1F2937'] }}
              onConfirm={handleContextChange}
              multiSelectLeaf={true}
              selectedLeafItems={selectedTurmas}
              pendingLeafItems={turmasPendentesMock}
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
              {legendItems.map((status, idx) => (
                <Chips
                  key={idx}
                  label={status.label}
                  iconLeft={status.icon}
                  variant="stroked"
                  className="!px-3 !py-1.5 shadow-sm border"
                  style={{
                    backgroundColor: status.bg,
                    borderColor: status.border,
                    color: '#1D2432', // Neutral-8
                    fontWeight: 700,
                    fontSize: '11px'
                  }}
                />
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
