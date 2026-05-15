import React, { useState, useRef, useMemo, useEffect } from 'react';
import { LayoutDashboard, Grid, BarChart2, ChevronRight, ChevronLeft, ChevronDown, X, Settings2, MousePointer2, ArrowLeft, Info, CircleX, Loader2, AlertCircle } from 'lucide-react';

import HeatmapSidebar from './devolutivas/HeatmapSidebar';
import HeatmapControls from './devolutivas/HeatmapControls';
import HeatmapMatrix from './devolutivas/HeatmapMatrix';
import HeatmapTooltip from './devolutivas/HeatmapTooltip';
import ResponseDetails from './devolutivas/ResponseDetails';
import HeatmapEmptyState from './devolutivas/HeatmapEmptyState';
import HeatmapFloatingHeaders from './devolutivas/HeatmapFloatingHeaders';
import HeatmapModals from './devolutivas/HeatmapModals';
import SkillTooltip from './devolutivas/SkillTooltip';
import Tooltip from '../ui/Tooltip';
import TutorialOverlay from '../ui/TutorialOverlay';

import {
  statusColors as staticStatusColors,
  getStatusColors,
  getLegendItems,
  getColorFromGradient,
  getDynamicColGroups,
  GROUPING_NAMES,
  SKILL_DETAILS,
  getMockRows,
  devDB,
  CASCADE_LEVELS
} from './devolutivas/HeatmapUtils';

// Altura do Header global da app (sticky top-0) em px
const GLOBAL_HEADER_H = 61;

// --- LÓGICA DE CÁLCULO DAS INTERSEÇÕES (MÉDIA, MEDIANA, MODA) ---
// Movido para fora para evitar ReferenceError por falta de hoisting
const calculateResult = (values, method) => {
  // 1. MAPEAMENTO: texto/ID -> número (0, 50, 100)
  const numericValues = values
    .map(v => {
      if (v === 'suficiente' || v === '2') return 100;
      if (v === 'parcialmente' || v === '1') return 50;
      if (v === 'insuficiente' || v === '0') return 0;
      return null;
    })
    .filter(v => v !== null);

  if (numericValues.length === 0) return '-';

  if (method === 'Média') {
    const sum = numericValues.reduce((a, b) => a + b, 0);
    return Math.round(sum / numericValues.length);
  } else if (method === 'Mediana') {
    const sorted = [...numericValues].sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 !== 0 ? sorted[mid] : Math.round((sorted[mid - 1] + sorted[mid]) / 2);
  } else {
    // Moda
    const freq = {};
    let maxFreq = 0;
    let mode = numericValues[0];
    numericValues.forEach(v => {
      freq[v] = (freq[v] || 0) + 1;
      if (freq[v] > maxFreq) { maxFreq = freq[v]; mode = v; }
    });
    return mode;
  }
};

export default function Devolutivas({ colors, navigateTo, isDarkMode, setToast }) {
  // --- ESTADOS GERAIS E LAYOUT ---
  const [mainTab, setMainTab] = useState('heatmap');
  const [calcMethod, setCalcMethod] = useState('Média');
  const [sortBy, setSortBy] = useState('Nenhuma');
  const [sortOrder, setSortOrder] = useState('Sem ordem');
  const [hideNoParticipation, setHideNoParticipation] = useState(false);
  const [isContextExpanded, setIsContextExpanded] = useState(true);
  const [selectedRows, setSelectedRows] = useState(new Set());
  const [selectedTurmas, setSelectedTurmas] = useState([]);
  const [focalTurma, setFocalTurma] = useState('Todas');
  const [modalData, setModalData] = useState(null); // Para o modal placeholder
  const [selectionForDetails, setSelectionForDetails] = useState(null);

  const [isColsSeparated, setIsColsSeparated] = useState(false);
  const [isRowsSeparated, setIsRowsSeparated] = useState(false);
  const [showLegendPopover, setShowLegendPopover] = useState(false);
  const [showScalePopover, setShowScalePopover] = useState(false);
  const [isCombinedView, setIsCombinedView] = useState(false);
  const [isColorsActive, setIsColorsActive] = useState(false);
  const [colorTheme, setColorTheme] = useState('default');
  const [activeBottomPanel, setActiveBottomPanel] = useState(null);
  const [activeBottomMenu, setActiveBottomMenu] = useState(null);
  const [colGroupingCriteria, setColGroupingCriteria] = useState('Tarefas');

  const currentStatusColors = useMemo(() => getStatusColors(colorTheme), [colorTheme]);
  const legendItems = useMemo(() => getLegendItems(currentStatusColors), [currentStatusColors]);

  const dynamicColGroups = useMemo(() => {
    const groups = getDynamicColGroups(colGroupingCriteria);
    let flatIdx = 0;
    return groups.map(group => ({
      ...group,
      cols: group.cols.map(col => ({
        ...col,
        originalIndex: col.originalIndex ?? flatIdx++
      }))
    }));
  }, [colGroupingCriteria]);

  const totalColsCount = useMemo(() => dynamicColGroups.reduce((acc, g) => acc + g.cols.length, 0), [dynamicColGroups]);

  // --- NAVEGAÇÃO ---
  const [navLevel, setNavLevel] = useState(-1);
  const [navPath, setNavPath] = useState([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  const handleStartTutorial = () => {
    console.log("Iniciando Tutorial...");
    setIsContextExpanded(true);
    setTimeout(() => {
      setShowTutorial(true);
    }, 300);
  };

  const tutorialSteps = [
    {
      selector: '#sidebar-context-section',
      title: 'Seleção de Contexto',
      content: 'Neste painel você define o escopo da sua análise, escolhendo desde o Estado até o Teste específico que deseja visualizar.'
    },
    {
      selector: '#heatmap-matrix-container',
      title: 'Matriz de Desempenho',
      content: 'Visualize o desempenho individual de cada aluno. As cores indicam o nível de proficiência em cada item do teste.'
    },
    {
      selector: '#bottom-controls-bar',
      title: 'Controles de Visualização',
      content: 'Use estas ferramentas para agrupar dados por turmas, mudar temas de cores ou aplicar zoom para detalhes.'
    },
    {
      selector: '#skills-highlight-btn',
      title: 'Destaque de Habilidades',
      content: 'Filtre o mapa para mostrar apenas os itens que avaliam competências específicas que você deseja trabalhar.'
    }
  ];

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

  const [isLoadingMatrix, setIsLoadingMatrix] = useState(false);
  const [matrixError, setMatrixError] = useState(null);

  const handleContextChange = (path, leafItems) => {
    const validSelections = path.filter(s => s !== null && s !== undefined);
    if (validSelections.length > 0) {
      setNavLevel(validSelections.length - 1);
      setNavPath(validSelections);

      // Se tivermos múltiplas turmas selecionadas (nível 4 do path)
      const turmas = Array.isArray(path[4]) ? path[4] : [];
      setSelectedTurmas(turmas);

      setFocalTurma('Todas');
      setSelectedRows(new Set());

      const lastSelected = validSelections[validSelections.length - 1];
      const isCultura = typeof lastSelected === 'object' ? lastSelected.nome === 'Cultura, Linguagem e Cotidiano Brasileiro' : lastSelected === 'Cultura, Linguagem e Cotidiano Brasileiro';
      const isFolclore = typeof lastSelected === 'object' ? lastSelected.nome === 'Folclore, Lendas Urbanas Brasileiras' : lastSelected === 'Folclore, Lendas Urbanas Brasileiras';

      if (isCultura) {
        setIsLoadingMatrix(true);
        setMatrixError(null);
        setIsLoaded(true);
        setTimeout(() => {
          setIsLoadingMatrix(false);
        }, 2000); // 2 segundos de simulação
      } else if (isFolclore) {
        setIsLoadingMatrix(false);
        const errorMsg = 'Ocorreu um erro ao carregar os dados desta avaliação. Por favor, tente novamente mais tarde.';
        setMatrixError(errorMsg);
        setIsLoaded(true);
        if (setToast) {
          setToast({
            type: 'caution',
            title: 'Erro de Carregamento',
            message: errorMsg
          });
        }
      } else {
        setIsLoadingMatrix(false);
        setMatrixError(null);
        setIsLoaded(true);
      }
    } else {
      // Retorna ao Empty State
      setNavLevel(-1);
      setNavPath([]);
      setSelectedTurmas([]);
      setFocalTurma('Todas');
      setSelectedRows(new Set());
      setIsLoaded(false);
      setIsLoadingMatrix(false);
      setMatrixError(null);
    }
  };

  // --- SKILLS ---
  const [showSkills, setShowSkills] = useState(false);
  const [activeSkill, setActiveSkill] = useState(null);
  const skillsList = useMemo(() => GROUPING_NAMES[colGroupingCriteria] || [], [colGroupingCriteria]);

  // --- SKILLS SCROLL LOGIC ---
  const [canScrollSkillsLeft, setCanScrollSkillsLeft] = useState(false);
  const [canScrollSkillsRight, setCanScrollSkillsRight] = useState(false);
  const skillsScrollRef = useRef(null);

  const checkSkillsScroll = () => {
    if (skillsScrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = skillsScrollRef.current;
      setCanScrollSkillsLeft(scrollLeft > 5);
      setCanScrollSkillsRight(scrollLeft + clientWidth < scrollWidth - 5);
    }
  };

  const scrollSkills = (direction) => {
    if (skillsScrollRef.current) {
      const scrollAmount = direction === 'left' ? -200 : 200;
      skillsScrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (showSkills) {
      setTimeout(checkSkillsScroll, 100);
    }
  }, [showSkills, skillsList]);

  // --- ESTADOS DO CANVAS ---
  const [skillTooltip, setSkillTooltip] = useState(null);

  const handleSkillInfoEnter = (e, skillName, skillDesc) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setSkillTooltip({
      x: rect.left + rect.width / 2,
      y: rect.bottom + 8,
      name: skillName,
      description: skillDesc
    });
  };

  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPanMode, setIsPanMode] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [scrollPos, setScrollPos] = useState({ left: 0, top: 0 });

  const [tooltipData, setTooltipData] = useState(null);
  const containerRef = useRef(null);

  // --- SHORTCUTS (Spacebar for Pan Mode) ---
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.code === 'Space') {
        // Evita disparar se o usuário estiver digitando em um input
        if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

        e.preventDefault(); // Evita o scroll padrão da página
        if (!e.repeat) setIsPanMode(true);
      }
    };
    const handleKeyUp = (e) => {
      if (e.code === 'Space') {
        setIsPanMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Resetar divisões ao mudar a ordenação para evitar estados inconsistentes
  useEffect(() => {
    setIsColsSeparated(false);
    setIsRowsSeparated(false);
  }, [sortBy]);

  // --- LÓGICA DE FILTRAGEM E ORDENAÇÃO ---
  const filteredStudents = useMemo(() => {
    let rows = getMockRows(navLevel, navPath[navLevel], totalColsCount);
    if (hideNoParticipation) {
      rows = rows.filter(student => !student.data.every(val => val === null || val === 'branco'));
    }
    if (focalTurma !== 'Todas') {
      // Normalização simples para o mock (fazendo '9 Ano A' bater com '9º Ano A')
      const normalize = (s) => s.replace(/º/g, '').replace(/ª/g, '').toLowerCase().trim();
      const focalNorm = normalize(focalTurma);
      rows = rows.filter(student => normalize(student.turma) === focalNorm);
    }
    return rows;
  }, [hideNoParticipation, navLevel, navPath, totalColsCount, focalTurma]);

  // Turmas reais presentes nos dados exibidos (para o TurmaNavBar)
  const availableTurmas = useMemo(() => {
    // Forçar a ordem e os nomes solicitados pelo usuário para o mock
    if (navLevel < 4) return [];
    return ['9 Ano A', '9 Ano B', '9 Ano C', '7 ano A', '7 ano B', '7 ano C'];
  }, [navLevel]);

  const isTestSelected = navLevel === 6;

  const studentTotals = useMemo(() => {
    const totals = {};
    filteredStudents.forEach(student => {
      totals[student.name] = calculateResult(student.data, calcMethod);
    });
    return totals;
  }, [calcMethod, filteredStudents]);

  const overallTotal = useMemo(() => {
    const allValues = filteredStudents.flatMap(s => s.data);
    return calculateResult(allValues, calcMethod);
  }, [calcMethod, filteredStudents]);

  const sortedStudentsList = useMemo(() => {
    let list = [...filteredStudents];
    if ((sortBy === 'Alunos' || sortBy === 'Alunos X Itens') && sortOrder !== 'Sem ordem') {
      list.sort((a, b) => {
        let scoreA = studentTotals[a.name] === '-' ? -1 : studentTotals[a.name];
        let scoreB = studentTotals[b.name] === '-' ? -1 : studentTotals[b.name];

        const diff = sortOrder === 'Desempenho Crescente' ? scoreA - scoreB : scoreB - scoreA;
        if (diff === 0) return a.name.localeCompare(b.name); // Desempate alfabético
        return diff;
      });
    } else {
      list.sort((a, b) => a.name.localeCompare(b.name));
    }
    return list;
  }, [filteredStudents, sortBy, sortOrder, studentTotals]);

  const displayStudents = useMemo(() => {
    if (isCombinedView && selectedRows.size >= 2) {
      return sortedStudentsList.filter(s => selectedRows.has(s.name));
    }
    return sortedStudentsList;
  }, [sortedStudentsList, isCombinedView, selectedRows]);

  const dynamicTotals = useMemo(() => {
    return Array.from({ length: totalColsCount }, (_, colIdx) => {
      const colValues = displayStudents.map(s => s.data[colIdx]);
      return calculateResult(colValues, calcMethod);
    });
  }, [calcMethod, displayStudents, totalColsCount]);



  // --- LÓGICA DE CÁLCULO DINÂMICO DOS RODAPÉS ---

  // --- LÓGICA DE ORDENAÇÃO DE COLUNAS ---
  const displayColGroups = useMemo(() => {
    if (sortBy === 'Itens' || sortBy === 'Alunos X Itens') {
      // Achatar todas as colunas para ordenar
      let flatCols = dynamicColGroups.flatMap(g => g.cols).map((c, idx) => {
        // Encontrar o índice original no array achatado para pegar o total correto
        // Na nossa estrutura, o originalIndex é o índice na matriz de dados
        return {
          ...c,
          score: dynamicTotals[c.originalIndex]
        };
      });

      flatCols.sort((a, b) => {
        let scoreA = a.score === '-' ? -1 : a.score;
        let scoreB = b.score === '-' ? -1 : b.score;
        const diff = sortOrder === 'Desempenho Crescente' ? scoreA - scoreB : scoreB - scoreA;
        if (diff === 0) return a.id.localeCompare(b.id);
        return diff;
      });

      // Retorna num grupo único "Itens Ordenados"
      return [{ title: sortOrder === 'Desempenho Crescente' ? 'Itens: Menor para Maior Desempenho' : 'Itens: Maior para Menor Desempenho', cols: flatCols }];
    }
    return dynamicColGroups;
  }, [dynamicColGroups, sortBy, sortOrder, dynamicTotals]);

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
    <div
      className="flex flex-col overflow-hidden transition-colors duration-300"
      style={{
        height: `calc(100vh - ${GLOBAL_HEADER_H}px)`,
        backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[1]
      }}
    >
      {/* ── HEADER INTERNO (tabs + breadcrumb + skills btn) ── */}
      <div
        className="border-b flex flex-wrap md:flex-nowrap items-stretch shrink-0 z-40 min-h-[48px]"
        style={{
          backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[0],
          borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2]
        }}
      >
        <div
          className="w-full md:w-[344px] flex items-end h-[48px] md:h-full border-b md:border-b-0 md:border-r shrink-0 px-4 md:px-6 gap-6 overflow-x-auto hide-scrollbar"
          style={{ borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }}
        >
          <button
            onClick={() => setMainTab('heatmap')}
            className={`text-[14px] md:text-[14px] font-bold h-full whitespace-nowrap pt-[2px] ${mainTab === 'heatmap' ? 'text-[#008BC9] border-b-[3px] border-[#008BC9]' : (isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-gray-500 hover:text-gray-800')}`}
          >
            Mapa de Calor
          </button>
          <button
            onClick={() => setMainTab('detalhes')}
            className={`text-[14px] md:text-[14px] font-bold h-full whitespace-nowrap pt-[2px] ${mainTab === 'detalhes' ? 'text-[#008BC9] border-b-[3px] border-[#008BC9]' : (isDarkMode ? 'text-neutral-300 hover:text-white' : 'text-gray-500 hover:text-gray-800')}`}
          >
            Detalhes da Resposta
          </button>
        </div>

        <div className="flex-1 px-4 md:px-6 py-2 md:py-0 truncate text-[12px] md:text-[14px] font-semibold text-[#008BC9] w-full flex items-center">
          {navPath.length > 0 ? (
            <>
              <span className="truncate">
                {navPath.map((path, idx) => {
                  const label = Array.isArray(path) ? `${path.length} ${levelLabels[idx]}s` : (typeof path === 'object' ? path.nome : path);
                  return idx < navPath.length - 1 ? (
                    <React.Fragment key={idx}>
                      <button onClick={() => goBack(idx)} className="hover:underline" style={{ color: isDarkMode ? colors.primary.light : colors.primary.base }}>{label}</button>
                      <span style={{ color: isDarkMode ? colors.neutral[4] : colors.neutral[4] }} className="mx-1"> / </span>
                    </React.Fragment>
                  ) : (
                    <button key={idx} onClick={() => goBack(idx)} className="hover:underline" style={{ color: isDarkMode ? colors.primary.light : colors.primary.base }}>{label}</button>
                  );
                })}
              </span>
              {navPath.length < levelLabels.length && (
                <span className="font-medium ml-1" style={{ color: isDarkMode ? colors.neutral[4] : colors.neutral[4] }}>/ {levelLabels[navPath.length]}s</span>
              )}
            </>
          ) : (
            <span className="font-medium" style={{ color: isDarkMode ? colors.neutral[4] : colors.neutral[4] }}>Selecione um contexto...</span>
          )}
        </div>

        <div
          className="w-full md:w-auto border-t md:border-t-0 md:border-l h-full flex items-center px-4 md:px-6 py-2 md:py-0 shrink-0 justify-end"
          style={{ borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }}
        >
          <button
            id="skills-highlight-btn"
            disabled={!isTestSelected || mainTab === 'detalhes'}
            onClick={() => { if (mainTab !== 'detalhes') { setShowSkills(!showSkills); if (showSkills) setActiveSkill(null); } }}
            className={`flex items-center gap-2 px-4 py-1.5 md:py-2 rounded-md font-bold text-[12px] md:text-[12px] transition-colors w-full md:w-auto justify-center ${(!isTestSelected || mainTab === 'detalhes') ? (isDarkMode ? 'bg-neutral-500 text-neutral-300 cursor-not-allowed' : 'bg-gray-100 text-gray-400 cursor-not-allowed') : (showSkills ? 'bg-[#008BC9] text-white' : (isDarkMode ? 'bg-[#003A79] text-[#94CFEF] hover:bg-[#0C63AA]' : 'bg-[#D9F0FC] text-[#008BC9] hover:bg-[#bae6fd]'))}`}
          >
            Destacar Habilidades {showSkills ? <CircleX size={20} /> : <ChevronDown size={20} />}
          </button>
        </div>
      </div>

      {/* ── CORPO PRINCIPAL (sidebar + área de conteúdo) ── */}
      <div className="flex flex-1 overflow-hidden relative">

        {/* Sidebar */}
        {mainTab === 'heatmap' && (
          <div id="sidebar-container">
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
              isSidebarOpenMobile={false}
              rowEntityLabel={navLevel < 4 ? levelLabels[navLevel + 1] : 'Alunos'}
              isTestSelected={isTestSelected}
              onStartTutorial={handleStartTutorial}
              isDarkMode={isDarkMode}
              colors={colors}
            />
          </div>
        )}

        {/* Área de conteúdo (skills bar + matrix + controles flutuantes) */}
        <div className="flex-1 relative overflow-hidden flex flex-col">
          {/* PAINÉIS FLUTUANTES (Skills + Turmas) */}
          {mainTab === 'heatmap' && (
            <HeatmapFloatingHeaders
              showSkills={showSkills}
              isLoaded={isLoaded}
              activeSkill={activeSkill}
              setActiveSkill={setActiveSkill}
              skillsList={skillsList}
              SKILL_DETAILS={SKILL_DETAILS}
              canScrollSkillsLeft={canScrollSkillsLeft}
              canScrollSkillsRight={canScrollSkillsRight}
              scrollSkills={scrollSkills}
              skillsScrollRef={skillsScrollRef}
              checkSkillsScroll={checkSkillsScroll}
              handleSkillInfoEnter={handleSkillInfoEnter}
              setSkillTooltip={setSkillTooltip}
              isTestSelected={isTestSelected}
              availableTurmas={availableTurmas}
              focalTurma={focalTurma}
              setFocalTurma={setFocalTurma}
              isDarkMode={isDarkMode}
              colors={colors}
            />
          )}

          {/* Controles flutuantes (direita + inferior) */}
          {mainTab === 'heatmap' && (
            <div id="bottom-controls-bar">
              <HeatmapControls
                isTestSelected={isTestSelected}
                showLegendPopover={showLegendPopover}
                setShowLegendPopover={setShowLegendPopover}
                showScalePopover={showScalePopover}
                setShowScalePopover={setShowScalePopover}
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
                sortBy={sortBy}
                isDarkMode={isDarkMode}
                colors={colors}
              />
            </div>
          )}

          {/* Matriz / conteúdo principal */}
          {!isLoaded ? (
            <HeatmapEmptyState
              isContextExpanded={isContextExpanded}
              setIsContextExpanded={setIsContextExpanded}
              colors={colors}
              isDarkMode={isDarkMode}
            />
          ) : isLoadingMatrix ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 relative overflow-hidden">
              {/* Background Grid */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(${isDarkMode ? colors?.neutral[5] : colors?.neutral[2]} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? colors?.neutral[5] : colors?.neutral[2]} 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                  backgroundPosition: 'center center',
                  opacity: isDarkMode ? 0.2 : 0.40
                }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                <Loader2 size={48} className="animate-spin" style={{ color: colors?.primary?.base || '#008BC9' }} />
                <div className="text-lg font-semibold" style={{ color: isDarkMode ? colors?.neutral[2] : colors?.neutral[6] }}>
                  Carregando matriz...
                </div>
              </div>
            </div>
          ) : matrixError ? (
            <div className="flex-1 flex flex-col items-center justify-center gap-4 p-8 text-center relative overflow-hidden">
              {/* Background Grid */}
              <div
                className="absolute inset-0 z-0 pointer-events-none"
                style={{
                  backgroundImage: `linear-gradient(${isDarkMode ? colors?.neutral[5] : colors?.neutral[2]} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? colors?.neutral[5] : colors?.neutral[2]} 1px, transparent 1px)`,
                  backgroundSize: '40px 40px',
                  backgroundPosition: 'center center',
                  opacity: isDarkMode ? 0.2 : 0.40
                }}
              />
              <div className="relative z-10 flex flex-col items-center justify-center gap-4">
                <img
                  src={`${import.meta.env.BASE_URL}assets/Figure/colored/somethingWentWrong.png`}
                  alt="Erro no carregamento"
                  className="w-64 h-auto"
                />
                <div className="text-xl font-bold" style={{ color: isDarkMode ? colors?.neutral[2] : colors?.neutral[7] }}>
                  Erro no carregamento
                </div>
                <div className="text-base max-w-md" style={{ color: isDarkMode ? colors?.neutral[4] : colors?.neutral[5] }}>
                  {matrixError}
                </div>
              </div>
            </div>
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
              isGroupColsActive={isColsSeparated}
              calcMethod={calcMethod}
              levelLabels={levelLabels}
              navLevel={navLevel}
              isGroupRowsActive={isRowsSeparated}
              displayStudents={displayStudents}
              selectedRowItems={Array.from(selectedRows)}
              toggleRowCheckbox={toggleRow}
              handleRowDrillDownClick={drillDown}
              isCombinedView={isCombinedView}
              statusColors={currentStatusColors}
              colorTheme={colorTheme}
              isColorsActive={isColorsActive}
              getGradientColor={getColorFromGradient}
              handleCellMouseEnter={handleCellMouseEnter}
              handleCellMouseLeave={handleCellMouseLeave}
              activeSkill={activeSkill}
              dynamicTotals={dynamicTotals}
              studentTotals={studentTotals}
              overallTotal={overallTotal}
              rowEntityLabel={navLevel < 4 ? levelLabels[navLevel + 1] : 'Aluno'}
              colGroupingCriteria={colGroupingCriteria}
              sortBy={sortBy}
              isDarkMode={isDarkMode}
              colors={colors}
              onOpenModal={(type, data) => {
                if (type === 'details') {
                  setSelectionForDetails({
                    studentName: data.student.name,
                    turma: data.student.turma,
                    questaoId: data.col.id
                  });
                  setMainTab('detalhes');
                } else {
                  setModalData({ type, data });
                }
              }}
            />
          ) : (
            <ResponseDetails
              navPath={navPath}
              handleContextChange={handleContextChange}
              colors={colors}
              navLevel={navLevel}
              db={devDB}
              levels={CASCADE_LEVELS}
              students={sortedStudentsList}
              colGroups={dynamicColGroups}
              statusColors={currentStatusColors}
              initialSelection={selectionForDetails}
              isDarkMode={isDarkMode}
            />
          )}

        </div>

        <HeatmapTooltip tooltipData={tooltipData} statusColors={currentStatusColors} />
        <HeatmapModals modalType={modalData?.type} modalData={modalData} setModalType={setModalData} statusColors={currentStatusColors} isDarkMode={isDarkMode} colors={colors} />
        <SkillTooltip skillTooltip={skillTooltip} />

        {showTutorial && (
          <TutorialOverlay
            steps={tutorialSteps}
            onFinish={() => setShowTutorial(false)}
          />
        )}

      </div>
    </div>
  );
}
