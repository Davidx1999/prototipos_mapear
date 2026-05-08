import React, { useState, useRef, useMemo, useEffect } from 'react';
import { LayoutDashboard, Grid, BarChart2, ChevronRight, ChevronDown, X, Settings2, MousePointer2, ArrowLeft } from 'lucide-react';

import HeatmapSidebar from './devolutivas/HeatmapSidebar';
import HeatmapControls from './devolutivas/HeatmapControls';
import HeatmapMatrix from './devolutivas/HeatmapMatrix';
import HeatmapTooltip from './devolutivas/HeatmapTooltip';

import {
  statusColors as staticStatusColors,
  getStatusColors,
  getLegendItems,
  getColorFromGradient,
  getDynamicColGroups,
  GROUPING_NAMES,
  getMockRows,
  devDB,
  CASCADE_LEVELS
} from './devolutivas/HeatmapUtils';

// Altura do Header global da app (sticky top-0) em px
const GLOBAL_HEADER_H = 61;

export default function Devolutivas({ colors, navigateTo }) {
  // --- ESTADOS GERAIS E LAYOUT ---
  const [mainTab, setMainTab] = useState('heatmap');
  const [calcMethod, setCalcMethod] = useState('Moda');
  const [sortBy, setSortBy] = useState('Score');
  const [sortOrder, setSortOrder] = useState('Desempenho Crescente');
  const [hideNoParticipation, setHideNoParticipation] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedTurmas, setSelectedTurmas] = useState([]);

  const [isColsSeparated, setIsColsSeparated] = useState(false);
  const [isRowsSeparated, setIsRowsSeparated] = useState(false);
  const [showLegendPopover, setShowLegendPopover] = useState(false);
  const [isCombinedView, setIsCombinedView] = useState(false);
  const [isColorsActive, setIsColorsActive] = useState(false);
  const [colorTheme, setColorTheme] = useState('default');
  const [activeBottomPanel, setActiveBottomPanel] = useState(null);
  const [activeBottomMenu, setActiveBottomMenu] = useState(null);
  const [colGroupingCriteria, setColGroupingCriteria] = useState('Tarefas');

  const currentStatusColors = useMemo(() => getStatusColors(colorTheme), [colorTheme]);
  const legendItems = useMemo(() => getLegendItems(currentStatusColors), [currentStatusColors]);

  const dynamicColGroups = useMemo(() => getDynamicColGroups(colGroupingCriteria), [colGroupingCriteria]);
  const totalColsCount = useMemo(() => dynamicColGroups.reduce((acc, g) => acc + g.cols.length, 0), [dynamicColGroups]);

  // --- NAVEGAÇÃO ---
  const [navLevel, setNavLevel] = useState(-1);
  const [navPath, setNavPath] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);

  const levelLabels = ['Estado', 'Município', 'Regional', 'Escola', 'Turma', 'Avaliação', 'Teste'];

  const drillDown = (name) => {
    if (navLevel < 5) {
      setNavLevel(navLevel + 1);
      setNavPath([...navPath, name]);
      setSelectedRows(new Set());
    }
  };

  const goBack = (levelIndex) => {
    setNavLevel(levelIndex);
    setNavPath(navPath.slice(0, levelIndex + 1));
    setSelectedRows(new Set());
  };

  const toggleRow = (id) => {
    setSelectedRows(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleContextChange = (path, turmas = []) => {
    const validSelections = path.filter(s => s !== null && s !== undefined);
    if (validSelections.length > 0) {
      setNavLevel(validSelections.length - 1);
      setNavPath(validSelections);
      setSelectedTurmas(turmas);
      setSelectedRows(new Set());
      setIsLoaded(true);
    }
  };

  // --- SKILLS ---
  const [showSkills, setShowSkills] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const skillsList = useMemo(() => GROUPING_NAMES[colGroupingCriteria] || [], [colGroupingCriteria]);

  // --- ESTADOS DO CANVAS ---
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanMode, setIsPanMode] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

  const [tooltipData, setTooltipData] = useState(null);
  const containerRef = useRef(null);

  // --- LÓGICA DE FILTRAGEM E ORDENAÇÃO ---
  const filteredStudents = useMemo(() => {
    // Agora sempre mostramos alunos (mock) no nível final (Turma)
    let rows = getMockRows(navLevel, navPath[navLevel], totalColsCount);

    if (hideNoParticipation) {
      rows = rows.filter(student => !student.data.every(val => val === null || val === 'branco'));
    }

    rows = [...rows].sort((a, b) => {
      let valA, valB;
      if (sortBy === 'Score') {
        const getScore = (data) => {
          const validData = data.filter(v => v !== null);
          return validData.length === 0 ? -Infinity : validData.reduce((acc, curr) => acc + curr, 0) / validData.length;
        };
        valA = getScore(a.data);
        valB = getScore(b.data);
      } else {
        valA = a.name;
        valB = b.name;
      }

      const isAsc = sortOrder.includes('Crescente') || sortOrder.includes('A-Z');
      if (valA === valB) return 0;
      return isAsc ? (valA > valB ? 1 : -1) : (valA < valB ? 1 : -1);
    });

    return rows;
  }, [hideNoParticipation, navLevel, navPath, sortBy, sortOrder]);

  const displayStudents = useMemo(() => {
    if (isCombinedView && selectedRows.size >= 2) {
      return filteredStudents.filter(s => selectedRows.has(s.name));
    }
    return filteredStudents;
  }, [filteredStudents, isCombinedView, selectedRows]);

  // --- LÓGICA DE CÁLCULO DINÂMICO DOS RODAPÉS ---
  const dynamicTotals = useMemo(() => {
    return Array.from({ length: totalColsCount }, (_, colIdx) => {
      const colValues = filteredStudents
        .map(s => s.data[colIdx])
        .filter(v => v !== null);

      if (colValues.length === 0) return '-';

      if (calcMethod === 'Média') {
        const sum = colValues.reduce((a, b) => a + b, 0);
        return Math.round((sum / colValues.length) * 10) / 10;
      } else if (calcMethod === 'Mediana') {
        const sorted = [...colValues].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        const median = sorted.length % 2 !== 0 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
        return Math.round(median * 10) / 10;
      } else {
        const freq = {};
        let maxFreq = 0;
        let mode = colValues[0];
        colValues.forEach(v => {
          freq[v] = (freq[v] || 0) + 1;
          if (freq[v] > maxFreq) { maxFreq = freq[v]; mode = v; }
        });
        return mode;
      }
    });
  }, [calcMethod, filteredStudents, totalColsCount]);

  // --- LÓGICA DE ORDENAÇÃO DE COLUNAS ---
  const displayColGroups = useMemo(() => {
    if (sortBy !== 'Score') return dynamicColGroups;
    const allCols = dynamicColGroups.flatMap((g, gIdx) =>
      g.cols.map((c, cIdx) => {
        const globalIdx = dynamicColGroups.slice(0, gIdx).reduce((acc, curr) => acc + curr.cols.length, 0) + cIdx;
        return {
          ...c,
          groupTitle: g.title,
          globalIndex: globalIdx,
          totalVal: dynamicTotals[globalIdx]
        };
      })
    );

    const sortedCols = [...allCols].sort((a, b) => {
      const valA = (a.totalVal === '-' || a.totalVal === null) ? -1 : a.totalVal;
      const valB = (b.totalVal === '-' || b.totalVal === null) ? -1 : b.totalVal;
      return sortOrder === 'Desempenho Crescente' ? valA - valB : valB - valA;
    });

    return [{
      title: sortOrder === 'Desempenho Crescente' ? 'Itens: Menor para Maior Desempenho' : 'Itens: Maior para Menor Desempenho',
      cols: sortedCols
    }];
  }, [dynamicColGroups, dynamicTotals, sortBy, sortOrder]);

  // --- HANDLERS DO CANVAS ---
  const handleMouseDown = (e) => {
    if (!isPanMode || !containerRef.current) return;
    setIsDragging(true);
    setStartPos({
      x: e.pageX - containerRef.current.offsetLeft,
      y: e.pageY - containerRef.current.offsetTop
    });
    setScrollPos({
      left: containerRef.current.scrollLeft,
      top: containerRef.current.scrollTop
    });
  };

  const handleMouseMove = (e) => {
    if (!isDragging || !isPanMode || !containerRef.current) return;
    e.preventDefault();
    const x = e.pageX - containerRef.current.offsetLeft;
    const y = e.pageY - containerRef.current.offsetTop;
    const walkX = (x - startPos.x) * 1.5;
    const walkY = (y - startPos.y) * 1.5;
    containerRef.current.scrollLeft = scrollPos.left - walkX;
    containerRef.current.scrollTop = scrollPos.top - walkY;
  };

  const handleMouseUpOrLeave = () => setIsDragging(false);

  const handleZoom = (delta) => {
    setZoomLevel(prev => Math.min(Math.max(0.4, prev + delta), 2));
  };

  const handleFitScreen = () => {
    setZoomLevel(1);
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, top: 0, behavior: 'smooth' });
    }
  };

  // --- HANDLERS DO TOOLTIP ---
  const handleCellMouseEnter = (e, alunoName, colInfo, statusKey) => {
    if (isDragging || isPanMode) return;
    const rect = e.target.getBoundingClientRect();
    setTooltipData({
      aluno: alunoName,
      questao: colInfo.id,
      habilidades: colInfo.skills.join(', '),
      statusKey: statusKey,
      x: rect.left + (rect.width / 2),
      y: rect.top
    });
  };
  const handleCellMouseLeave = () => setTooltipData(null);

  const renderEmptyState = () => (
    <div className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center bg-neutral-1/50 relative overflow-hidden">
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${colors.neutral[2]} 1px, transparent 1px), linear-gradient(90deg, ${colors.neutral[2]} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          opacity: 0.40
        }}
      />
      <div className="flex flex-col items-center justify-center max-w-2xl relative z-10">
        <div className="relative mb-8">
          {/* Círculos decorativos pulsantes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary-base/5 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-base/10 rounded-full animate-pulse delay-700" />

          <img
            src={`${import.meta.env.BASE_URL}assets/Figure/colored/noHeatmap.png`}
            alt="Aguardando Seleção"
            className="relative z-10 w-80 h-auto drop-shadow-xl"
          />
        </div>

        <h2 className="text-[24px] font-bold text-neutral-8 mb-4 tracking-tight">
          Aguardando Seleção de Dados
        </h2>
        <p className="text-[14px] text-neutral-5 max-w-[440px] leading-relaxed mb-8">
          Para visualizar o Mapa de Calor, utilize o <span className="font-bold text-primary-base">Filtro em Cascata</span> no painel lateral e selecione o contexto desejado.
        </p>

        {!isContextExpanded && (
          <button
            onClick={() => setIsContextExpanded(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-base text-white rounded-xl font-bold text-[14px] shadow-lg shadow-primary-base/20 hover:bg-primary-dark transition-all active:scale-95 group"
          >
            <Settings2 size={18} className="group-hover:rotate-45 transition-transform" />
            Abrir Configurações
          </button>
        )}
      </div>
    </div>
  );

  return (
    // Ocupa exatamente o espaço restante abaixo do header global — sem overflow
    <div
      className="flex flex-col overflow-hidden bg-neutral-1"
      style={{ height: `calc(100vh - ${GLOBAL_HEADER_H}px)` }}
    >
      {/* ── HEADER INTERNO (tabs + breadcrumb + skills btn) ── */}
      <div className="bg-neutral-0 border-b border-neutral-2 flex flex-wrap md:flex-nowrap items-stretch shrink-0 z-40 min-h-[48px]">
        <div className="w-full md:w-[344px] flex items-end h-[48px] md:h-full border-b md:border-b-0 md:border-r border-gray-200 shrink-0 px-4 md:px-6 gap-6 overflow-x-auto hide-scrollbar bg-white">
          <button
            onClick={() => setMainTab('heatmap')}
            className={`text-[13px] md:text-[14px] font-bold h-full whitespace-nowrap pt-[2px] ${mainTab === 'heatmap' ? 'text-[#008BC9] border-b-[3px] border-[#008BC9]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Mapa de Calor
          </button>
          <button
            onClick={() => setMainTab('detalhes')}
            className={`text-[13px] md:text-[14px] font-bold h-full whitespace-nowrap pt-[2px] ${mainTab === 'detalhes' ? 'text-[#008BC9] border-b-[3px] border-[#008BC9]' : 'text-gray-500 hover:text-gray-800'}`}
          >
            Detalhes da Resposta
          </button>
        </div>

        <div className="flex-1 px-4 md:px-6 py-2 md:py-0 truncate text-[12px] md:text-[13px] font-semibold text-[#008BC9] w-full bg-white flex items-center">
          {navPath.length > 0 ? (
            <>
              <span className="truncate">
                {navPath.map((path, idx) => {
                  const label = Array.isArray(path) ? `${path.length} ${levelLabels[idx]}s` : (typeof path === 'object' ? path.nome : path);
                  return idx < navPath.length - 1 ? (
                    <React.Fragment key={idx}>
                      <button onClick={() => goBack(idx)} className="hover:underline">{label}</button>
                      <span className="text-gray-400"> / </span>
                    </React.Fragment>
                  ) : (
                    <button key={idx} onClick={() => goBack(idx)} className="hover:underline">{label}</button>
                  );
                })}
              </span>
              {navPath.length < levelLabels.length && (
                <span className="text-gray-400 font-medium ml-1">/ {levelLabels[navPath.length]}s</span>
              )}
            </>
          ) : (
            <span className="text-gray-400 font-medium">Selecione um contexto...</span>
          )}
        </div>

        <div className="w-full md:w-auto border-t md:border-t-0 md:border-l border-gray-200 h-full flex items-center px-4 md:px-6 py-2 md:py-0 shrink-0 bg-white justify-end">
          <button
            onClick={() => { setShowSkills(!showSkills); if (showSkills) setActiveSkill(null); }}
            className={`flex items-center gap-2 px-4 py-1.5 md:py-2 rounded-md font-bold text-[12px] md:text-[13px] transition-colors w-full md:w-auto justify-center ${showSkills ? 'bg-[#008BC9] text-white' : 'bg-[#D9F0FC] text-[#008BC9] hover:bg-[#bae6fd]'}`}
          >
            Destacar Habilidades {showSkills ? <X size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {/* ── CORPO PRINCIPAL (sidebar + área de conteúdo) ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar */}
        <HeatmapSidebar
          isContextExpanded={isContextExpanded}
          setIsContextExpanded={setIsContextExpanded}
          calcMethod={calcMethod}
          setCalcMethod={setCalcMethod}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          hideNoParticipation={hideNoParticipation}
          setHideNoParticipation={setHideNoParticipation}
          statusColors={currentStatusColors}
          legendItems={legendItems}
          colorTheme={colorTheme}
          isColorsActive={isColorsActive}
          navPath={navPath}
          selectedTurmas={selectedTurmas}
          handleContextChange={handleContextChange}
        />

        {/* Área de conteúdo (skills bar + matrix + controles flutuantes) */}
        <div className="flex-1 relative overflow-hidden flex flex-col">

          {/* Barra de Skills */}
          {showSkills && (
            <div className="absolute top-0 left-0 right-0 z-30 bg-neutral-0 border-b border-neutral-2 px-4 py-2 flex items-center gap-3 h-[48px]">
              <span className="text-[12px] font-semibold text-neutral-6 whitespace-nowrap shrink-0">Destacar Habilidade:</span>
              <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1 py-0.5">
                {skillsList.map(s => (
                  <button
                    key={s}
                    onClick={() => setActiveSkill(activeSkill === s ? null : s)}
                    className={`min-w-[36px] px-2 py-1 rounded text-[11px] font-bold border transition-all whitespace-nowrap shrink-0 ${activeSkill === s ? 'bg-[#94CFEF] border-primary-dark text-primary-dark' : 'bg-neutral-0 border-neutral-2 text-neutral-5 hover:bg-neutral-1'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Controles flutuantes (direita + inferior) */}
          <HeatmapControls
            showLegendPopover={showLegendPopover}
            setShowLegendPopover={setShowLegendPopover}
            colorTheme={colorTheme}
            setColorTheme={setColorTheme}
            isColorsActive={isColorsActive}
            setIsColorsActive={setIsColorsActive}
            isPanMode={isPanMode}
            setIsPanMode={setIsPanMode}
            handleZoom={handleZoom}
            handleFitScreen={handleFitScreen}
            isColsSeparated={isColsSeparated}
            setIsColsSeparated={setIsColsSeparated}
            isRowsSeparated={isRowsSeparated}
            setIsRowsSeparated={setIsRowsSeparated}
            navLevel={navLevel}
            selectedRows={selectedRows}
            isCombinedView={isCombinedView}
            setIsCombinedView={setIsCombinedView}
            activeBottomMenu={activeBottomMenu}
            setActiveBottomMenu={setActiveBottomMenu}
            colGroupingCriteria={colGroupingCriteria}
            setColGroupingCriteria={setColGroupingCriteria}
          />

          {/* Matriz / conteúdo principal */}
          {!isLoaded ? (
            renderEmptyState()
          ) : mainTab === 'heatmap' ? (
            <HeatmapMatrix
              containerRef={containerRef}
              isPanMode={isPanMode}
              isDragging={isDragging}
              handleMouseDown={handleMouseDown}
              handleMouseMove={handleMouseMove}
              handleMouseUpOrLeave={handleMouseUpOrLeave}
              mainTab={mainTab}
              showSkills={showSkills}
              zoomLevel={zoomLevel}
              colGroups={dynamicColGroups}
              displayColGroups={displayColGroups}
              isColsSeparated={isColsSeparated}
              calcMethod={calcMethod}
              levelLabels={levelLabels}
              navLevel={navLevel}
              isRowsSeparated={isRowsSeparated}
              displayStudents={displayStudents}
              selectedRows={selectedRows}
              toggleRow={toggleRow}
              drillDown={drillDown}
              isCombinedView={isCombinedView}
              statusColors={currentStatusColors}
              colorTheme={colorTheme}
              isColorsActive={isColorsActive}
              getColorFromGradient={getColorFromGradient}
              handleCellMouseEnter={handleCellMouseEnter}
              handleCellMouseLeave={handleCellMouseLeave}
              activeSkill={activeSkill}
              dynamicTotals={dynamicTotals}
            />
          ) : (
            <div className="flex justify-center items-center h-full text-neutral-4">
              <div className="flex flex-col items-center gap-4">
                <LayoutDashboard size={48} className="opacity-20" />
                <p className="font-bold text-[18px]">Selecione um aluno ou item para ver detalhes...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <HeatmapTooltip tooltipData={tooltipData} statusColors={currentStatusColors} />
    </div>
  );
}
