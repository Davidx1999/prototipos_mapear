import React, { useState, useRef, useMemo, useEffect } from 'react';
import { LayoutDashboard, Grid, BarChart2, ChevronRight } from 'lucide-react';

import HeatmapSidebar from './devolutivas/HeatmapSidebar';
import HeatmapControls from './devolutivas/HeatmapControls';
import HeatmapMatrix from './devolutivas/HeatmapMatrix';
import HeatmapTooltip from './devolutivas/HeatmapTooltip';

import {
  statusColors,
  getColorFromGradient,
  colGroups,
  getMockRows,
  devDB,
  CASCADE_LEVELS
} from './devolutivas/HeatmapUtils';

// Altura do Header global da app (sticky top-0) em px
const GLOBAL_HEADER_H = 61;
// Altura do header interno da Devolutivas (tabs + breadcrumb) em px
const DEV_HEADER_H = 56;
// Total de offset para elementos fixos dentro da tela
const TOP_OFFSET = GLOBAL_HEADER_H + DEV_HEADER_H;

export default function Devolutivas({ colors, navigateTo }) {
  // --- ESTADOS GERAIS E LAYOUT ---
  const [mainTab, setMainTab] = useState('heatmap');
  const [calcMethod, setCalcMethod] = useState('Moda');
  const [sortBy, setSortBy] = useState('Score');
  const [sortOrder, setSortOrder] = useState('Desempenho Crescente');
  const [hideNoParticipation, setHideNoParticipation] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set());

  const [isColsSeparated, setIsColsSeparated] = useState(false);
  const [isRowsSeparated, setIsRowsSeparated] = useState(false);
  const [showLegendPopover, setShowLegendPopover] = useState(false);
  const [isCombinedView, setIsCombinedView] = useState(false);
  const [isColorsActive, setIsColorsActive] = useState(true);
  const [colorTheme, setColorTheme] = useState('default');
  const [activeBottomPanel, setActiveBottomPanel] = useState(null);

  // --- NAVEGAÇÃO ---
  const [navLevel, setNavLevel] = useState(0);
  const [navPath, setNavPath] = useState(['Minas Gerais']);

  const levelLabels = ['Estado', 'Município', 'Escola', 'Turma', 'Alunos'];

  const drillDown = (name) => {
    if (navLevel < 4) {
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

  // --- SKILLS ---
  const [showSkills, setShowSkills] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const [skillsList] = useState(['H1', 'H2', 'H3', 'H4', 'H5', 'H6', 'H7', 'H8', 'H9', 'H10', 'H11', 'H12', 'H13', 'H14', 'H15', 'H16', 'H17', 'H18']);

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
    let rows = getMockRows(navLevel, navPath[navLevel]);

    if (hideNoParticipation) {
      rows = rows.filter(student => !student.data.every(val => val === 'branco'));
    }

    rows = [...rows].sort((a, b) => {
      let valA, valB;
      if (sortBy === 'Score') {
        valA = a.data.reduce((acc, curr) => acc + (statusColors[curr].val || 0), 0);
        valB = b.data.reduce((acc, curr) => acc + (statusColors[curr].val || 0), 0);
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
    return Array.from({ length: 40 }, (_, colIdx) => {
      const colValues = filteredStudents
        .map(s => statusColors[s.data[colIdx]].val)
        .filter(v => v !== null);

      if (colValues.length === 0) return '-';

      if (calcMethod === 'Média') {
        const sum = colValues.reduce((a, b) => a + b, 0);
        return Math.round(sum / colValues.length);
      } else if (calcMethod === 'Mediana') {
        const sorted = [...colValues].sort((a, b) => a - b);
        const mid = Math.floor(sorted.length / 2);
        return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
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
  }, [calcMethod, filteredStudents]);

  // --- LÓGICA DE ORDENAÇÃO DE COLUNAS ---
  const displayColGroups = useMemo(() => {
    if (sortBy !== 'Score') return colGroups;

    const allCols = colGroups.flatMap((g, gIdx) =>
      g.cols.map((c, cIdx) => {
        const globalIdx = colGroups.slice(0, gIdx).reduce((acc, curr) => acc + curr.cols.length, 0) + cIdx;
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
  }, [colGroups, dynamicTotals, sortBy, sortOrder]);

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

  return (
    // Ocupa exatamente o espaço restante abaixo do header global — sem overflow
    <div
      className="flex flex-col overflow-hidden bg-gray-50"
      style={{ height: `calc(100vh - ${GLOBAL_HEADER_H}px)` }}
    >
      {/* ── HEADER INTERNO FIXO (tabs + breadcrumb + skills btn) ── */}
      <div
        className="bg-white border-b border-gray-200 flex items-center px-6 gap-4 shrink-0 z-40 shadow-sm"
        style={{ height: DEV_HEADER_H }}
      >
        {/* Tabs */}
        <div className="flex bg-gray-100 p-1 rounded-xl shrink-0">
          <button
            onClick={() => setMainTab('heatmap')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${mainTab === 'heatmap' ? 'bg-white text-[#003A79] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <Grid size={16} /> Mapa de Calor
          </button>
          <button
            onClick={() => setMainTab('detalhes')}
            className={`flex items-center gap-2 px-4 py-1.5 rounded-[4px] text-[12px] font-bold transition-all ${mainTab === 'detalhes' ? 'bg-white text-[#003A79] shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
          >
            <BarChart2 size={16} /> Detalhes da Resposta
          </button>
        </div>

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 flex-1 overflow-x-auto no-scrollbar min-w-0">
          {navPath.map((path, idx) => (
            <React.Fragment key={idx}>
              <button
                onClick={() => goBack(idx)}
                className={`text-[12px] font-bold px-3 py-1.5 rounded-[4px] transition-all whitespace-nowrap ${idx === navLevel ? 'bg-[#008BC9] text-white shadow-md' : 'text-gray-500 hover:bg-gray-100'}`}
              >
                {path}
              </button>
              {idx < navPath.length - 1 && <ChevronRight size={14} className="text-gray-400 shrink-0" />}
            </React.Fragment>
          ))}
        </div>

        {/* Botão Destacar Habilidades */}
        <button
          onClick={() => setShowSkills(!showSkills)}
          className={`flex items-center gap-2 px-4 py-2 rounded-[4px] text-[12px] font-extrabold transition-all border shrink-0 ${showSkills ? 'bg-[#94CFEF] text-[#003A79] border-[#008BC9]' : 'bg-white text-[#008BC9] border-[#008BC9] hover:bg-gray-50'}`}
        >
          {showSkills ? 'OCULTAR HABILIDADES' : 'DESTACAR HABILIDADES'}
        </button>
      </div>

      {/* ── CORPO PRINCIPAL (sidebar + área de conteúdo) ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar */}
        <HeatmapSidebar
          isContextExpanded={isContextExpanded}
          setIsContextExpanded={setIsContextExpanded}
          navPath={navPath}
          navLevel={navLevel}
          goBack={goBack}
          CASCADE_LEVELS={CASCADE_LEVELS}
          devDB={devDB}
          levelLabels={levelLabels}
          calcMethod={calcMethod}
          setCalcMethod={setCalcMethod}
          sortBy={sortBy}
          setSortBy={setSortBy}
          sortOrder={sortOrder}
          setSortOrder={setSortOrder}
          hideNoParticipation={hideNoParticipation}
          setHideNoParticipation={setHideNoParticipation}
          statusColors={statusColors}
          colorTheme={colorTheme}
          isColorsActive={isColorsActive}
        />

        {/* Área de conteúdo (matrix + controles flutuantes) */}
        <div className="flex-1 relative overflow-hidden">

          {/* Barra de Skills — entre sidebar e controles flutuantes */}
          {showSkills && (
            <div className="absolute top-3 left-[356px] right-[24px] z-30 animate-fade-slide">
              <div className="flex items-center bg-white/95 backdrop-blur-md rounded-[8px] px-3 py-2 border border-[#008BC9] shadow-xl gap-2 h-10">
                <span className="text-[10px] font-extrabold text-[#003A79] uppercase tracking-wide whitespace-nowrap shrink-0">Habilidades</span>
                <div className="w-[1px] h-4 bg-gray-200 shrink-0" />
                <div className="flex gap-1.5 overflow-x-auto no-scrollbar flex-1 py-0.5">
                  {skillsList.map(s => (
                    <button
                      key={s}
                      onClick={() => setActiveSkill(activeSkill === s ? null : s)}
                      className={`px-3 py-1 rounded-[4px] text-[10px] font-bold border transition-all whitespace-nowrap shrink-0 ${activeSkill === s ? 'bg-[#003A79] text-white border-[#003A79]' : 'bg-white text-gray-500 border-gray-300 hover:border-[#008BC9]'}`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
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
            activeBottomPanel={activeBottomPanel}
            setActiveBottomPanel={setActiveBottomPanel}
            navLevel={navLevel}
            selectedRows={selectedRows}
            isCombinedView={isCombinedView}
            setIsCombinedView={setIsCombinedView}
          />

          {/* Matriz / conteúdo principal */}
          {mainTab === 'heatmap' ? (
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
              colGroups={colGroups}
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
              statusColors={statusColors}
              colorTheme={colorTheme}
              isColorsActive={isColorsActive}
              getColorFromGradient={getColorFromGradient}
              handleCellMouseEnter={handleCellMouseEnter}
              handleCellMouseLeave={handleCellMouseLeave}
              activeSkill={activeSkill}
            />
          ) : (
            <div className="flex justify-center items-center h-full text-gray-400">
              <div className="flex flex-col items-center gap-4">
                <LayoutDashboard size={48} className="opacity-20" />
                <p className="font-bold text-[18px]">Selecione um aluno ou item para ver detalhes...</p>
              </div>
            </div>
          )}
        </div>
      </div>

      <HeatmapTooltip tooltipData={tooltipData} statusColors={statusColors} />
    </div>
  );
}
