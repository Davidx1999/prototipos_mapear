import React, { useState, useRef } from 'react';
import { ChevronUp, HelpCircle, Eye, XCircle, Maximize, Grid, CheckCircle2, MinusCircle, XCircle as XCircleIcon, Route, FileText, ChevronDown, ChevronLeft, ChevronRight, Settings2, LayoutDashboard, X } from 'lucide-react';
import CascadeSelector from '../../ui/CascadeSelector';
import Chips from '../../ui/Chips';
import Button from '../../ui/Button';
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
  handleContextChange,
  isSidebarOpenMobile = false
}) {
  const [isCascadeOpen, setIsCascadeOpen] = useState(false);
  const [confirmedContext, setConfirmedContext] = useState({ testes: [] });
  const triggerRef = useRef(null);

  const openCascade = () => setIsCascadeOpen(true);
  const clearCascade = () => {
    setConfirmedContext({ testes: [] });
    handleContextChange([], []);
  };

  const renderCascadeBreadcrumb = () => {
    if (navPath.length === 0) return <span className="text-gray-400">Selecione...</span>;
    return navPath.map((p, i) => {
      const label = Array.isArray(p) ? `${p.length} selecionados` : (typeof p === 'object' ? p.nome : p);
      return i < navPath.length - 1 ? `${label} / ` : label;
    }).join('');
  };

  return (
    /* --- SIDEBAR FLUTUANTE --- */
    /* Largura fixada em 320px ('min-w-[320px] w-[320px]') e margem esquerda de 24px ('md:left-6'). 
       A soma (344px) alinha o painel com a tab do sub-header. */
    <aside className={`absolute top-4 left-4 md:left-6 w-[320px] min-w-[320px] bg-white/95 backdrop-blur-md rounded-xl shadow-[0_4px_25px_rgba(0,0,0,0.1)] border border-gray-200 flex flex-col z-[45] transition-all duration-300 max-h-[calc(100vh-32px)] ${isSidebarOpenMobile ? 'translate-x-0' : '-translate-x-[120%] lg:translate-x-0'}`} style={{ overflow: 'visible' }}>
      <div
        className={`p-4 flex justify-between items-center bg-white z-10 ${isContextExpanded ? 'border-b border-gray-100 rounded-t-xl' : 'rounded-xl'}`}
      >
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setIsContextExpanded(!isContextExpanded)}>
          <Button
            variant="primary"
            appearance="ghost"
            size="xs"
            iconSize={20}
            iconOnly={true}
            iconLeft={isContextExpanded ? <ChevronUp /> : <ChevronDown />}
          />
          <h3 className="font-bold text-[14px] text-[#1D2432]">
            Seleção de Contexto
          </h3>
        </div>
        <Button
          variant="tertiary"
          appearance="ghost"
          size="xs"
          iconSize={20}
          tertiaryTone="low"
          iconOnly={true}
          iconLeft={<HelpCircle />}
          title="Este painel permite configurar o contexto dos dados (Escolas, Turmas, Avaliações) e ajustar visualizações do Mapa de Calor."
        />
      </div>

      {isContextExpanded && (
        <div className="animate-fade-slide" style={{ overflow: 'visible' }}>

          {/* Filtro em Cascata */}
          <div className="p-4 border-b border-gray-100 bg-gray-50/50">
            <div className="flex gap-2 w-full min-w-0">
              <div
                ref={triggerRef}
                className="flex-1 min-w-0 flex flex-col relative" style={{ zIndex: 500 }}
              >
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
                        return Object.keys(escolaData);
                      }
                      if (levelIndex === 5) {
                        const escolaData = devDB[st]?.[mu]?.[re]?.[es] || {};
                        if (!tu || tu.length === 0) return null;
                        const availableAvaliacoes = tu.flatMap(t => Object.keys(escolaData[t] || {}));
                        return [...new Set(availableAvaliacoes)];
                      }
                      if (levelIndex === 6) {
                        const escolaData = devDB[st]?.[mu]?.[re]?.[es] || {};
                        if (!av || !tu || tu.length === 0) return null;
                        const availableTestes = tu.flatMap(t => escolaData[t]?.[av] || []);
                        return [...new Set(availableTestes)];
                      }
                    } catch (e) { return null; }
                    return null;
                  }}
                  levels={CASCADE_LEVELS}
                  colors={{ primary: { base: '#008BC9', dark: '#003A79' }, neutral: ['#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#1F2937'], semantic: { info: { dark: '#155274', base: '#489EEA', light: '#B3E6F5', extraLight: '#DFF8FF' } } }}
                  onConfirm={handleContextChange}
                  multiSelectLeaf={true}
                  selectedLeafItems={selectedTurmas}
                  pendingLeafItems={turmasPendentesMock}
                  variant="sidebar"
                  initialSelections={navPath}
                />
              </div>
            </div>
          </div>

          {/* Cálculo das Interseções */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-[13px] text-[#1D2432]">Cálculo das Interseções por</h3>
              <Button
                variant="tertiary"
                appearance="ghost"
                size="xs"
                tertiaryTone="low"
                iconOnly={true}
                iconLeft={<HelpCircle />}
                title="Define como as interseções são calculadas."
              />
            </div>
            <div className="flex p-1 bg-gray-100 rounded-lg">
              {['Média', 'Mediana', 'Moda'].map(opt => (
                <button
                  key={opt}
                  onClick={() => setCalcMethod(opt)}
                  className={`flex-1 py-1.5 text-[11px] font-bold rounded-md transition-all ${calcMethod === opt ? 'bg-[#94CFEF] text-[#003A79] shadow-sm scale-105' : 'text-[#008BC9] hover:bg-white'}`}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>

          {/* Ajustes de Exibição */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-[13px] text-[#1D2432]">Ajustes de Exibição</h3>
              <Button
                variant="tertiary"
                appearance="ghost"
                size="xs"
                tertiaryTone="low"
                iconOnly={true}
                iconLeft={<HelpCircle />}
                title="Configurações de ordenação e filtros visuais."
              />
            </div>
            <div className="flex flex-col gap-4">
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
              <div className="flex items-center justify-between mt-2 pt-2 border-t border-gray-100">
                <span className="text-[12px] font-bold text-gray-700">Ocultar Sem Participação</span>
                <button
                  onClick={() => setHideNoParticipation(!hideNoParticipation)}
                  className={`w-10 h-5 rounded-full relative transition-colors ${hideNoParticipation ? 'bg-[#008BC9]' : 'bg-gray-300'}`}
                >
                  <div className={`absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all shadow-sm ${hideNoParticipation ? 'right-[2px]' : 'left-[2px]'}`}></div>
                </button>
              </div>
            </div>
          </div>

          {/* Escala de Desempenho Médio */}
          <div className="p-4 border-b border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-[13px] text-[#1D2432]">Escala de Desempenho Médio</h3>
              <Button
                variant="tertiary"
                appearance="ghost"
                size="xs"
                tertiaryTone="low"
                iconOnly={true}
                iconLeft={<HelpCircle />}
                title="Legenda de cores para a escala de desempenho médio."
              />
            </div>
            <div className="flex flex-col gap-1 mt-2">
              <div className="w-full h-3 rounded-full shadow-inner border border-gray-200" style={{ background: 'linear-gradient(to right, #8CD47E 5%, #F8D66D 25%, #FF6961 50%, #B3E6F5 75%, #FFFFFF 95%)' }}></div>
              <div className="flex justify-between items-center text-[10px] font-bold text-gray-500 mt-1">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
            </div>
          </div>

          {/* Legenda dos Centroides */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-bold text-[13px] text-[#1D2432]">Legenda dos Centroides</h3>
              <Button
                variant="tertiary"
                appearance="ghost"
                size="xs"
                tertiaryTone="low"
                iconOnly={true}
                iconLeft={<HelpCircle />}
                title="Significado de cada status nos centroides."
              />
            </div>
            <div className="flex flex-col gap-2">
              {legendItems.map((status, idx) => {
                // Map internal status labels to Chips statuses
                let chipStatus = 'neutral';
                if (status.label.includes('Suficiente') && !status.label.includes('Parcialmente')) chipStatus = 'success';
                if (status.label.includes('Parcialmente')) chipStatus = 'warning';
                if (status.label.includes('Insuficiente')) chipStatus = 'error';
                if (status.label.includes('Sem Conteúdo')) chipStatus = 'primary';
                
                return (
                  <div key={idx} className="flex items-center gap-2">
                    <Chips 
                      label={status.label} 
                      status={chipStatus} 
                      iconLeft={status.icon} 
                      variant="light"
                      className="w-full !justify-start !px-3 shadow-sm" 
                    />
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      )}
    </aside>
  );
}
