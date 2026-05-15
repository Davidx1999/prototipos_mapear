import React, { useState, useRef } from 'react';
import {
  ChevronDown,
  Settings2,
  HelpCircle,
  XCircle,
  CircleX,
  ChevronUp,
  ArrowUp,
  ArrowDown
} from 'lucide-react';
import CascadeSelector from '../../ui/CascadeSelector';
import Chips from '../../ui/Chips';
import Button from '../../ui/Button';
import RichTooltip from '../../ui/RichTooltip';
import { devDB, CASCADE_LEVELS, turmasPendentesMock, participacaoAvaliacaoMock } from './HeatmapUtils';

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
  legendItems = [],
  navPath,
  selectedTurmas,
  handleContextChange,
  isSidebarOpenMobile = false,
  rowEntityLabel = 'Alunos',
  isTestSelected = false,
  onStartTutorial = () => { },
  isDarkMode = false,
  colors
}) {
  const sidebarScrollRef = useRef(null);
  const [showScrollButtons, setShowScrollButtons] = useState(false);
  const methods = ['Média', 'Mediana', 'Moda'];

  const checkScrollNeeded = () => {
    if (sidebarScrollRef.current) {
      const { scrollHeight, clientHeight } = sidebarScrollRef.current;
      const isHeightSmall = window.innerHeight < 920;
      setShowScrollButtons(scrollHeight > clientHeight && isHeightSmall);
    }
  };

  React.useEffect(() => {
    checkScrollNeeded();
    window.addEventListener('resize', checkScrollNeeded);
    return () => window.removeEventListener('resize', checkScrollNeeded);
  }, [isContextExpanded]);

  const scrollSidebar = (direction) => {
    if (sidebarScrollRef.current) {
      const scrollAmount = direction === 'up' ? -200 : 200;
      sidebarScrollRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <aside
      className={`
        absolute top-2 left-4 md:left-4 w-[328px] min-w-[328px] backdrop-blur-md rounded-[8px] shadow-[0_4px_25px_rgba(0,0,0,0.1)] border flex flex-col z-[45] transition-all duration-300
        max-h-[calc(100%-16px)] h-fit
      `}
      style={{
        overflow: 'visible',
        backgroundColor: isDarkMode ? `${colors.neutral[7]}F2` : 'rgba(255, 255, 255, 0.95)',
        borderColor: isDarkMode ? colors.neutral[6] : colors.neutral[2]
      }}
    >
      {/* Header */}
      <div
        className={`p-4 flex justify-between items-center z-20 shrink-0 ${isContextExpanded ? 'border-b rounded-t-[8px]' : 'rounded-[8px]'}`}
        style={{
          backgroundColor: isDarkMode ? colors.neutral[7] : colors.neutral[0],
          borderColor: isDarkMode ? colors.neutral[6] : colors.neutral[1]
        }}
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
          <h3 className="font-bold text-[14px]" style={{ color: isDarkMode ? colors.neutral[0] : '#1D2432' }}>
            Seleção de Contexto
          </h3>
        </div>
        <div className="flex items-center gap-1">
          {isContextExpanded && showScrollButtons && (
            <>
              <Button
                variant="secondary"
                showRing={true}
                appearance="ghost"
                size="xs"
                iconSize={16}
                iconOnly={true}
                iconLeft={<ArrowUp />}
                onClick={(e) => { e.stopPropagation(); scrollSidebar('up'); }}
                className="!text-[#003A79]"
                title="Subir"
              />
              <Button
                variant="secondary"
                showRing={true}
                appearance="ghost"
                size="xs"
                iconSize={16}
                iconOnly={true}
                iconLeft={<ArrowDown />}
                onClick={(e) => { e.stopPropagation(); scrollSidebar('down'); }}
                className="!text-[#003A79]"
                title="Descer"
              />
            </>
          )}
          {/* Ocultado por solicitação do usuário para ganhar espaço */}
          {/* 
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
          */}
        </div>
      </div>

      {isContextExpanded && (
        <>
          {/* Seleção de Contexto - Movido para fora do scroll para evitar clipping */}
          <div id="sidebar-context-section" className="p-4 border-b shrink-0" style={{ borderColor: isDarkMode ? colors.neutral[6] : colors.neutral[1], backgroundColor: isDarkMode ? colors.neutral[7] : colors.neutral[0] }}>
            <div className="flex flex-col gap-1">
              <span className="text-[14px] font-bold tracking-wider" style={{ color: isDarkMode ? colors.neutral[3] : colors.neutral[7] }}>Seleção de Contexto</span>
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
                colors={{
                  primary: { base: '#008BC9', dark: '#003A79' },
                  neutral: ['#FFFFFF', '#F3F4F6', '#E5E7EB', '#D1D5DB', '#9CA3AF', '#6B7280', '#4B5563', '#1F2937'],
                  semantic: { info: { dark: '#155274', base: '#489EEA', light: '#B3E6F5', extraLight: '#DFF8FF' } }
                }}
                onConfirm={handleContextChange}
                multiSelectLeaf={false}
                selectedLeafItems={selectedTurmas}
                pendingLeafItems={turmasPendentesMock}
                variant="sidebar"
                initialSelections={navPath}
              />
            </div>
          </div>

          <div
            ref={sidebarScrollRef}
            className="flex-1 overflow-y-auto hide-scrollbar flex flex-col animate-fade-slide relative"
            style={{ overflowX: 'visible' }}
          >

            {/* Cálculo das Interseções */}
            <div className="p-4 border-b" style={{ borderColor: isDarkMode ? colors.neutral[6] : colors.neutral[1] }}>
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-[14px]" style={{ color: isDarkMode ? colors.neutral[0] : '#1D2432' }}>Cálculo das Interseções</h3>
                <RichTooltip
                  title="Cálculo das Interseções"
                  description="Escolha o método estatístico para consolidar os resultados das células agrupadas (por turmas ou itens)."
                  position="right"
                >
                  {({ isVisible }) => (
                    <Button
                      variant="tertiary"
                      appearance="ghost"
                      size="xs"
                      tertiaryTone="low"
                      iconOnly={true}
                      iconLeft={<HelpCircle />}
                      className={isVisible ? "!bg-gray-100" : ""}
                    />
                  )}
                </RichTooltip>
              </div>
              {/* Segmented Button Pattern with Reverted Background and Refined Design */}
              <div className={`flex p-1 rounded-[6px] gap-[1px] ${!isTestSelected ? 'opacity-60' : ''}`} style={{ backgroundColor: isDarkMode ? colors.neutral[6] : (isTestSelected ? '#F3F4F6' : '#F9FAFB') }}>
                {methods.map((m, idx) => {
                  let roundedClass = 'rounded-none';
                  if (idx === 0) roundedClass = 'rounded-l-[4px] rounded-r-none';
                  if (idx === methods.length - 1) roundedClass = 'rounded-r-[4px] rounded-l-none';

                  return (
                    <button
                      key={m}
                      disabled={!isTestSelected}
                      onClick={() => setCalcMethod(m)}
                      className={`
                      flex-1 py-1.5 text-[12px] font-bold transition-all
                      ${calcMethod === m
                          ? (isTestSelected ? (isDarkMode ? 'bg-[#003A79] text-white shadow-sm z-10' : 'bg-white text-[#008BC9] shadow-sm z-10') : (isDarkMode ? 'bg-neutral-500 text-neutral-300' : 'bg-gray-200 text-gray-400'))
                          : (isDarkMode ? 'bg-transparent text-neutral-300 hover:bg-neutral-500/50' : 'bg-transparent text-neutral-700 hover:bg-white/50')}
                      ${roundedClass}
                      ${!isTestSelected ? 'cursor-not-allowed' : ''}
                    `}
                    >
                      {m}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Ajustes de Exibição (Novo Padrão de Ordenação) */}
            <div className="p-4 border-b" style={{ borderColor: isDarkMode ? colors.neutral[6] : colors.neutral[1] }}>
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[14px]" style={{ color: isDarkMode ? colors.neutral[0] : '#1D2432' }}>Ajustes de Exibição</h3>
                <RichTooltip
                  title="Ajustes de Exibição"
                  description="Configure como os dados são organizados no mapa. Você pode ordenar por alunos ou itens, e aplicar filtros de participação."
                  position="right"
                >
                  {({ isVisible }) => (
                    <Button
                      variant="tertiary"
                      appearance="ghost"
                      size="xs"
                      tertiaryTone="low"
                      iconOnly={true}
                      iconLeft={<HelpCircle />}
                      className={isVisible ? "!bg-gray-100" : ""}
                    />
                  )}
                </RichTooltip>
              </div>

              <div className="flex flex-col gap-4">
                {/* Ordenar por */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold tracking-wider" style={{ color: isDarkMode ? colors.neutral[3] : colors.neutral[7] }}>Ordenar por</label>
                  <div className="relative">
                    <select
                      disabled={!isTestSelected}
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className={`w-full px-3 h-9 border rounded-md text-[12px] font-semibold outline-none appearance-none focus:border-[#008BC9] shadow-sm ${!isTestSelected ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{
                        backgroundColor: isDarkMode ? colors.neutral[6] : (isTestSelected ? colors.neutral[0] : colors.neutral[1]),
                        color: isDarkMode ? colors.neutral[1] : (isTestSelected ? colors.neutral[7] : colors.neutral[4]),
                        borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[3]
                      }}
                    >
                      <option value="Nenhuma">Sem ordenação (Padrão)</option>
                      <option value="Alunos">Apenas {rowEntityLabel}</option>
                      <option value="Itens">Apenas Itens</option>
                      <option value="Alunos X Itens">{rowEntityLabel} X Itens (Ambos)</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                      {isTestSelected && sortBy !== 'Nenhuma' && (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSortBy('Nenhuma'); setSortOrder('Sem ordem'); }}
                          className="pointer-events-auto text-neutral-7 hover:text-red-500 transition-colors"
                          title="Limpar ordenação"
                        >
                          <CircleX size={16} />
                        </button>
                      )}
                      <ChevronDown size={18} className="text-neutral-7" />
                    </div>
                  </div>
                </div>

                {/* Ordem */}
                <div className="flex flex-col gap-1">
                  <label className="text-[12px] font-bold tracking-wider" style={{ color: isDarkMode ? colors.neutral[3] : colors.neutral[7] }}>Ordem</label>
                  <div className="relative">
                    <select
                      disabled={!isTestSelected || sortBy === 'Nenhuma'}
                      value={sortOrder}
                      onChange={(e) => setSortOrder(e.target.value)}
                      className={`w-full px-3 h-9 border rounded-md text-[12px] font-semibold outline-none appearance-none focus:border-[#008BC9] shadow-sm ${(!isTestSelected || sortBy === 'Nenhuma') ? 'cursor-not-allowed' : 'cursor-pointer'}`}
                      style={{
                        backgroundColor: isDarkMode ? colors.neutral[6] : ((!isTestSelected || sortBy === 'Nenhuma') ? colors.neutral[1] : colors.neutral[0]),
                        color: isDarkMode ? colors.neutral[1] : ((!isTestSelected || sortBy === 'Nenhuma') ? colors.neutral[4] : colors.neutral[7]),
                        borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[3]
                      }}
                    >
                      <option value="Sem ordem">Sem ordem</option>
                      <option value="Desempenho Crescente">Desempenho Crescente</option>
                      <option value="Desempenho Decrescente">Desempenho Decrescente</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1.5 pointer-events-none">
                      {isTestSelected && sortBy !== 'Nenhuma' && sortOrder !== 'Sem ordem' && (
                        <button
                          onClick={(e) => { e.preventDefault(); e.stopPropagation(); setSortOrder('Sem ordem'); }}
                          className="pointer-events-auto text-neutral-7 hover:text-red-500 transition-colors"
                          title="Limpar ordem"
                        >
                          <CircleX size={16} />
                        </button>
                      )}
                      <ChevronDown size={18} className="text-neutral-7" />
                    </div>
                  </div>
                </div>

                {/* Ocultar Sem Participação */}
                <div className="flex items-center justify-between mt-2 pt-2 border-t -mx-4 px-4" style={{ borderColor: isDarkMode ? colors.neutral[6] : colors.neutral[1] }}>
                  <span className="text-[14px] font-bold" style={{ color: isDarkMode ? (!isTestSelected ? colors.neutral[5] : colors.neutral[1]) : (!isTestSelected ? colors.neutral[4] : colors.neutral[7]) }}>Ocultar Sem Participação</span>
                  <button
                    disabled={!isTestSelected}
                    onClick={() => setHideNoParticipation(!hideNoParticipation)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${!isTestSelected ? 'cursor-not-allowed' : ''}`}
                    style={{ backgroundColor: !isTestSelected ? (isDarkMode ? colors.neutral[6] : colors.neutral[1]) : (hideNoParticipation ? colors.primary.base : (isDarkMode ? colors.neutral[5] : colors.neutral[3])) }}
                  >
                    <div className={`absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all shadow-sm ${hideNoParticipation ? 'right-[2px]' : 'left-[2px]'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            {/* Legenda dos Centroides */}
            <div className="p-4 mb-4">
              <div className="flex justify-between items-center mb-1">
                <h3 className="font-bold text-[14px]" style={{ color: isDarkMode ? colors.neutral[0] : '#1D2432' }}>Legenda dos Centroides</h3>
                <RichTooltip
                  title="Legenda dos Centroides"
                  description="Os ícones e cores representam o nível de proficiência consolidado de cada grupo na matriz."
                  position="right"
                >
                  {({ isVisible }) => (
                    <Button
                      variant="tertiary"
                      appearance="ghost"
                      size="xs"
                      tertiaryTone="low"
                      iconOnly={true}
                      iconLeft={<HelpCircle />}
                      className={isVisible ? "!bg-gray-100" : ""}
                    />
                  )}
                </RichTooltip>
              </div>
              <div className="flex flex-wrap gap-2">
                {legendItems.map((status, idx) => {
                  let chipStatus = 'neutral';
                  if (status.label.includes('Suficiente') && !status.label.includes('Parcialmente')) chipStatus = 'success';
                  if (status.label.includes('Parcialmente')) chipStatus = 'warning';
                  if (status.label.includes('Insuficiente')) chipStatus = 'error';
                  if (status.val === -1) chipStatus = 'info';

                  return (
                    <Chips
                      key={idx}
                      label={status.label}
                      status={chipStatus}
                      iconLeft={status.icon ? React.cloneElement(status.icon, { className: '!text-neutral-7' }) : null}
                      variant="light"
                      className="!justify-start !px-3 shadow-sm !text-neutral-7"
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
