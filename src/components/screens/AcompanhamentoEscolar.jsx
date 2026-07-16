import React, { useState, useRef, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../ui/Button';
import Toast from '../ui/Toast';
import Tabs from '../ui/Tabs';

// Sub-componentes do módulo Acompanhamento Escolar
import DashboardView from './acompanhamentoEscolar/DashboardView';
import TurmaDetailView from './acompanhamentoEscolar/TurmaDetailView';
import DisciplinaDetailView from './acompanhamentoEscolar/DisciplinaDetailView';
import DominiosModal from './acompanhamentoEscolar/DominiosModal';
import EditorAvaliacao from './acompanhamentoEscolar/EditorAvaliacao';

// Banco de dados e ajudantes
import {
  series,
  letters,
  years,
  HISTORICO_DATA_GENERATOR,
  STORYTELLING_DATABASE,
  AVALIACOES_INSIGHTS,
  RISK_STUDENTS,
  CONCEPT_DATA,
  MATRIX_DRILL,
  COMP_COLORS,
  PORT_DOMAIN_COLORS,
  DOMAIN_COLORS,
  ANNUAL_COMP,
  ANNUAL_PORT,
  TRAJ_HAB_PORT,
  ANNUAL_DATA,
  INST_EVENTS,
  getHabVals
} from './acompanhamentoEscolar/db';

const tabsConfig = [
  { id: 'ano', label: 'Visão Geral da Escola' },
  { id: 'trajetoria', label: 'Trajetória Escolar' }
];

const AcompanhamentoEscolar = ({ colors, navigateTo, isDarkMode }) => {
  // ══ ESTADOS GERAIS ══
  const [role, setRole] = useState('diretor'); // 'rede' | 'diretor' | 'professor'
  const [year, setYear] = useState('2026'); // Timeline year
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'detalhe-turma' | 'detalhe-disciplina' | 'editor-avaliacao'
  const [selectedTurma, setSelectedTurma] = useState({ serie: '3em', letra: 'D' });
  const [selectedDisciplina, setSelectedDisciplina] = useState('Língua Portuguesa');
  const [favorites, setFavorites] = useState([]);
  
  // Estados de Abas e Sub-abas
  const [activeTab, setActiveTab] = useState('ano'); // 'ano' | 'trajetoria'
  const [subTab, setSubTab] = useState('panorama'); // 'panorama' | 'diagnostico'
  const [selectedEvaluation, setSelectedEvaluation] = useState('0'); // '0' | '1' | '2'
  const [selectedTurmaFilter, setSelectedTurmaFilter] = useState('all');
  const [activeDomain, setActiveDomain] = useState(null); // Detalhe de domínio para modal
  const [desempenhoMode, setDesempenhoMode] = useState('media'); // 'media' | 'boxplot'
  const [interventions, setInterventions] = useState([]);
  const [trajPath, setTrajPath] = useState({ comp: null, dom: null });

  // Custom states for view modifications
  const [hoveredMomentum, setHoveredMomentum] = useState(null);

  // Simulation states
  const [isLoading, setIsLoading] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  // ══ HANDLERS DE TOAST ══
  const triggerToast = (msg) => {
    setToast({
      message: msg,
      type: 'info',
      title: 'Notificação MAPEAR'
    });
  };

  // ══ TRAJETÓRIA ESCOLAR MEMO E HANDLERS ══
  const trajData = useMemo(() => {
    const sKey = selectedTurma.serie;
    const comp = ANNUAL_COMP[sKey];
    const lvl = trajPath.dom ? 2 : trajPath.comp ? 1 : 0;

    if (lvl === 0) {
      return {
        lvl,
        colLabel: "Componente",
        title: "Evolução institucional — " + (sKey === "1em" ? "1º Ano EM" : sKey === "2em" ? "2º Ano EM" : "3º Ano EM"),
        desc: "Coorte institucional: a série comparada ano contra ano por componente curricular. Linha pontilhada: média da rede (perfil similar). Clique em um componente para analisar seus domínios.",
        yoyTitle: "Variação ano contra ano — por componente curricular",
        items: Object.entries(comp.components).map(([nome, vals]) => ({ nome, vals, color: COMP_COLORS[nome], drill: true })),
        ref: { label: "Média da rede", vals: comp.rede },
        gapNote: comp.gapNote,
      };
    }

    const isMath = trajPath.comp === "Matemática";
    const domains = isMath ? ANNUAL_DATA[sKey].domains : ANNUAL_PORT[sKey];

    if (lvl === 1) {
      return {
        lvl,
        colLabel: "Domínio",
        title: trajPath.comp + " — evolução por domínio · " + (sKey === "1em" ? "1º EM" : sKey === "2em" ? "2º EM" : "3º EM"),
        desc: "Domínios de repertório de " + trajPath.comp + " ano contra ano. Linha pontilhada: média geral do componente. Clique em um domínio para analisar as habilidades.",
        yoyTitle: "Variação ano contra ano — por domínio",
        items: Object.entries(domains).map(([nome, vals]) => ({ nome, vals, color: (isMath ? DOMAIN_COLORS : PORT_DOMAIN_COLORS)[nome] || "#5c6cf5", drill: true })),
        ref: { label: trajPath.comp + " (geral)", vals: comp.components[trajPath.comp] },
        gapNote: isMath ? ANNUAL_DATA[sKey].gapNote : comp.gapNote,
      };
    }

    const domVals = domains[trajPath.dom];
    const habs = isMath ? MATRIX_DRILL[trajPath.dom].flatMap(k => k.habilidades) : TRAJ_HAB_PORT[trajPath.dom];
    const hasGap = domVals.includes(null);
    const HAB_PALETTE = ["#8b5cf6", "#14b8e0", "#f59e0b", "#6cc24a", "#e05252", "#e879a0", "#5c6cf5", "#0e9cc4"];

    return {
      lvl,
      colLabel: "Habilidade",
      title: trajPath.dom + " — evolução por habilidade · " + (sKey === "1em" ? "1º EM" : sKey === "2em" ? "2º EM" : "3º EM"),
      desc: "Habilidades do domínio " + trajPath.dom + " ano contra ano. Linha pontilhada: média geral do domínio.",
      yoyTitle: "Variação ano contra ano — por habilidade",
      items: habs.map((h, i) => ({ nome: h.cod, sub: h.desc, vals: getHabVals(h, domVals, sKey), color: HAB_PALETTE[i % HAB_PALETTE.length], drill: false })),
      ref: { label: trajPath.dom + " (geral)", vals: domVals },
      gapNote: hasGap ? (isMath ? ANNUAL_DATA[sKey].gapNote : comp.gapNote) : null,
    };
  }, [selectedTurma.serie, trajPath]);

  const handleTrajDrill = (nome) => {
    setTrajPath((prev) => {
      if (!prev.comp) return { comp: nome, dom: null };
      if (!prev.dom) return { comp: prev.comp, dom: nome };
      return prev;
    });
  };

  const handleTrajUp = () => {
    setTrajPath((prev) => {
      if (prev.dom) return { comp: prev.comp, dom: null };
      return { comp: null, dom: null };
    });
  };

  const handleTrajTo = (level) => {
    setTrajPath((prev) => {
      if (level === 0) return { comp: null, dom: null };
      if (level === 1) return { comp: prev.comp, dom: null };
      return prev;
    });
  };

  const navigateCohort = (direction) => {
    const currentYearNum = parseInt(year);
    const currentSerieIndex = selectedTurma.serie === '1em' ? 0 : selectedTurma.serie === '2em' ? 1 : 2;
    const entryYear = currentYearNum - currentSerieIndex;

    const nextIndex = direction === 'next' ? currentSerieIndex + 1 : currentSerieIndex - 1;
    if (nextIndex >= 0 && nextIndex <= 2) {
      const targetStep = {
        serie: nextIndex === 0 ? '1em' : nextIndex === 1 ? '2em' : '3em',
        year: (entryYear + nextIndex).toString()
      };
      
      simulateLoading(() => {
        setYear(targetStep.year);
        setSelectedTurma(prev => ({ ...prev, serie: targetStep.serie }));
      });
      triggerToast(`Acompanhando Cohort da Turma: Redirecionando para ${targetStep.serie === '1em' ? '1º EM' : targetStep.serie === '2em' ? '2º EM' : '3º EM'} no ano letivo ${targetStep.year}.`);
    }
  };

  // ══ SIMULADOR DE CARREGAMENTO ══
  const simulateLoading = (callback) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      callback();
    }, 550);
  };

  // ══ NAVEGAÇÃO DE FLUXO LINEAR ══
  const handleNavigate = (targetView, forceSerie = null, forceLetra = null, forceDiscipline = null) => {
    simulateLoading(() => {
      setCurrentView(targetView);
      if (forceSerie && forceLetra) {
        setSelectedTurma({ serie: forceSerie, letra: forceLetra });
      }
      if (forceDiscipline) {
        setSelectedDisciplina(forceDiscipline);
      }
    });
  };

  const navigateBack = () => {
    if (currentView === "detalhe-turma") {
      handleNavigate("dashboard");
    } else if (currentView === "detalhe-disciplina") {
      handleNavigate("detalhe-turma");
    } else if (currentView === "editor-avaliacao") {
      handleNavigate("detalhe-disciplina");
    }
  };

  // Changing role
  const changeRole = (newRole) => {
    setRole(newRole);
    triggerToast(`Visão alterada para ${newRole === 'rede' ? 'Rede / Gestor' : newRole === 'diretor' ? 'Diretor Escolar' : 'Professor'}`);
  };

  // Changing timeline year
  const changeYear = (newYear) => {
    simulateLoading(() => {
      setYear(newYear);
    });
  };

  // Toggle favorite status
  const toggleFavorite = (e, serie, letra) => {
    e.stopPropagation();
    const fullKey = `${serie}:${letra}`;
    setFavorites((prev) => {
      const idx = prev.indexOf(fullKey);
      if (idx > -1) {
        const next = [...prev];
        next.splice(idx, 1);
        triggerToast(`Turma ${letra.toUpperCase()} removida dos favoritos.`);
        return next;
      } else {
        triggerToast(`Turma ${letra.toUpperCase()} favoritada com sucesso!`);
        return [...prev, fullKey];
      }
    });
  };

  // ══ METRIC CALCULATIONS ══
  const currentMetrics = useMemo(() => HISTORICO_DATA_GENERATOR(year), [year]);

  // Dynamic class data generator based on series, letter and timeline year
  const getTurmaData = (serie, letra) => {
    const serieFactor = series.indexOf(serie) * 4;
    const letraFactor = letters.indexOf(letra) * 2;
    const yearInt = parseInt(year);

    let perf = Math.min(96, Math.max(48, 65 + (yearInt % 5) + serieFactor - letraFactor));
    let status = "suf";
    let trend = "estavel";

    if (perf < 55) {
      status = "ins";
      trend = "decrescimo";
    } else if (perf < 70) {
      status = "par";
      trend = "estavel";
    } else {
      trend = "acrescimo";
    }

    let momentumSeries = [];
    if (trend === "acrescimo") {
      momentumSeries = [perf - 12, perf - 7, perf - 3, perf + 2, perf];
    } else if (trend === "decrescimo") {
      momentumSeries = [perf + 10, perf + 5, perf + 1, perf - 4, perf];
    } else {
      momentumSeries = [perf - 2, perf + 3, perf - 1, perf + 1, perf];
    }
    momentumSeries = momentumSeries.map(v => Math.min(100, Math.max(0, v)));

    return { perf, status, trend, momentumSeries };
  };

  const activeTurmaData = useMemo(() => {
    return getTurmaData(selectedTurma.serie, selectedTurma.letra);
  }, [selectedTurma, year]);

  // Sparkline Match Momentum SVG inside class cards
  const renderMatchMomentum = (momentumSeries) => {
    const target = 70;
    const width = 62;
    const height = 24;
    const centerY = height / 2;
    const barWidth = 4;
    const gap = 3;
    const maxDiff = 30;

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="opacity-95 shrink-0 select-none">
        <line x1="2" y1={centerY} x2={width - 2} y2={centerY} stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
        {momentumSeries.map((val, idx) => {
          const diff = val - target;
          const x = 4 + idx * (barWidth + gap);
          let barHeight = (Math.abs(diff) / maxDiff) * (height / 2 - 2);
          if (barHeight < 1.5 && diff !== 0) barHeight = 1.5;
          if (barHeight > (height / 2 - 2)) barHeight = height / 2 - 2;

          const y = diff >= 0 ? centerY - barHeight : centerY;
          const color = diff >= 0 ? '#10b981' : '#ef4444';

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              rx="1"
            />
          );
        })}
      </svg>
    );
  };

  // Seletor de turma com dropdown no topo do detalhe da turma
  const handleDropdownTurmaChange = (e) => {
    const [s, l] = e.target.value.split(":");
    handleNavigate("detalhe-turma", s, l);
  };

  const navigateTurmaPrevNext = (dir) => {
    let currentSIndex = series.indexOf(selectedTurma.serie);
    let currentLIndex = letters.indexOf(selectedTurma.letra);

    if (dir === "next") {
      currentLIndex++;
      if (currentLIndex >= letters.length) {
        currentLIndex = 0;
        currentSIndex = (currentSIndex + 1) % series.length;
      }
    } else {
      currentLIndex--;
      if (currentLIndex < 0) {
        currentLIndex = letters.length - 1;
        currentSIndex = currentSIndex - 1 < 0 ? series.length - 1 : currentSIndex - 1;
      }
    }
    handleNavigate("detalhe-turma", series[currentSIndex], letters[currentLIndex]);
  };

  return (
    <div className={`flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 pb-24 flex flex-col h-full ${isDarkMode ? 'bg-slate-955 text-slate-100' : 'bg-white text-slate-800'}`}>
      
      {/* Seletor de Papéis */}
      <div className="flex justify-end mb-4 shrink-0">
        <div className={`flex items-center gap-1 p-1 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-slate-105 border-slate-200'}`}>
          <span className="text-[10px] font-bold text-slate-505 px-2 uppercase select-none">Visão:</span>
          {['rede', 'diretor', 'professor'].map(r => (
            <Button
              key={r}
              onClick={() => changeRole(r)}
              variant="tertiary"
              appearance={role === r ? 'solid' : 'ghost'}
              size="xs"
              uppercase={false}
              className="!h-7"
            >
              {r === 'rede' ? 'Rede / Gestor' : r === 'diretor' ? 'Diretor Escolar' : 'Professor'}
            </Button>
          ))}
        </div>
      </div>

      {/* Breadcrumbs */}
      <div className="text-[11px] text-slate-405 dark:text-slate-505 mb-2 flex items-center gap-1 select-none">
        <span className="cursor-pointer hover:underline hover:text-[#006699]" onClick={() => triggerToast('Visão regional - CE')}>CE</span>
        <span>›</span>
        <span className="cursor-pointer hover:underline hover:text-[#006699]" onClick={() => triggerToast('Fortaleza')}>Fortaleza</span>
        <span>›</span>
        <span className="font-bold text-slate-650 dark:text-slate-350">Liceu do Conjunto Ceará</span>
      </div>

      {/* Header principal */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-855 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Liceu do Conjunto Ceará</h1>
          <span className="px-2.5 py-0.5 text-[9px] bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-400 font-extrabold rounded-full border border-emerald-100 dark:border-emerald-900/30">Ativo</span>
        </div>

        {/* Seletores e Escopo */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-[4px] border border-slate-205 dark:border-slate-800 items-center">
            <Button
              onClick={() => {
                triggerToast("Redirecionando para o painel de Acompanhamento Individualizado do Aluno...");
                navigateTo('acompanhamento');
              }}
              variant="tertiary"
              appearance="ghost"
              size="xs"
              uppercase={true}
              className="!h-7 text-slate-550 hover:text-slate-900 dark:hover:text-white"
            >
              Por aluno
            </Button>
            <Button
              onClick={() => triggerToast("Já visualizando escopo: Escola")}
              variant="primary"
              appearance="solid"
              size="xs"
              uppercase={true}
              className="!h-7"
            >
              Por escola
            </Button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-850 hidden md:block"></div>

          {/* Filtros em Cascata */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            <label className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500">
              Série:
              <select
                value={selectedTurma.serie}
                onChange={(e) => {
                  setSelectedTurma(prev => ({ ...prev, serie: e.target.value }));
                  triggerToast(`Filtrando dados para a série: ${e.target.value.toUpperCase()}`);
                }}
                className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1 text-xs text-[#006699] dark:text-sky-400 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="1em">1º Ano EM</option>
                <option value="2em">2º Ano EM</option>
                <option value="3em">3º Ano EM</option>
              </select>
            </label>

            <div className="flex items-center gap-1.5 text-slate-455 dark:text-slate-500">
              <label className="flex items-center gap-1.5 cursor-pointer">
                Ano Letivo:
              </label>
              <div className="flex items-center gap-1">
                <Button
                  onClick={() => {
                    const y = parseInt(year);
                    if (y > 2024) changeYear((y - 1).toString());
                  }}
                  disabled={year === '2024'}
                  variant="tertiary"
                  appearance="ghost"
                  size="xs"
                  iconOnly={true}
                  className="!p-1"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <select
                  value={year}
                  onChange={(e) => changeYear(e.target.value)}
                  className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1 text-xs text-[#006699] dark:text-sky-400 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
                >
                  <option value="2024">2024</option>
                  <option value="2025">2025</option>
                  <option value="2026">2026</option>
                </select>

                <Button
                  onClick={() => {
                    const y = parseInt(year);
                    if (y < 2026) changeYear((y + 1).toString());
                  }}
                  disabled={year === '2026'}
                  variant="tertiary"
                  appearance="ghost"
                  size="xs"
                  iconOnly={true}
                  className="!p-1"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* ABAS DO DESIGN BASE */}
      {currentView === 'dashboard' && (
        <div className="w-screen relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] border-b border-slate-205 dark:border-slate-850 mb-5 flex justify-center">
          <div className="w-full max-w-[1440px] px-4 md:px-8">
            <Tabs
              tabs={tabsConfig}
              activeTab={activeTab}
              onChange={(id) => setActiveTab(id)}
              variant="line"
              size="md"
              colors={colors}
              className="!border-b-0"
            />
          </div>
        </div>
      )}

      {/* ══ LOADING SPINNER OVERLAY ══ */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 dark:bg-slate-955/70 z-50 flex flex-col items-center justify-center">
          <div className="border-2 border-slate-200 dark:border-slate-800 border-t-2 border-t-[#006699] dark:border-t-sky-400 rounded-full w-8 h-8 animate-spin"></div>
          <p className="text-xs font-semibold text-slate-650 dark:text-slate-400 mt-3">Sincronizando dados pedagógicos...</p>
        </div>
      )}

      {/* ══ VISTAS MODULARIZADAS DO ACOPLAMENTO PEDAGÓGICO ══ */}
      {currentView === 'dashboard' && (
        <DashboardView
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          subTab={subTab}
          setSubTab={setSubTab}
          isDarkMode={isDarkMode}
          colors={colors}
          years={years}
          year={year}
          changeYear={changeYear}
          currentMetrics={currentMetrics}
          selectedTurma={selectedTurma}
          selectedDisciplina={selectedDisciplina}
          interventions={interventions}
          selectedTurmaFilter={selectedTurmaFilter}
          setSelectedTurmaFilter={setSelectedTurmaFilter}
          triggerToast={triggerToast}
          series={series}
          letters={letters}
          getTurmaData={getTurmaData}
          favorites={favorites}
          toggleFavorite={toggleFavorite}
          handleNavigate={handleNavigate}
          renderMatchMomentum={renderMatchMomentum}
          desempenhoMode={desempenhoMode}
          setDesempenhoMode={setDesempenhoMode}
          selectedEvaluation={selectedEvaluation}
          setSelectedEvaluation={setSelectedEvaluation}
          AVALIACOES_INSIGHTS={AVALIACOES_INSIGHTS}
          RISK_STUDENTS={RISK_STUDENTS}
          CONCEPT_DATA={CONCEPT_DATA}
          setActiveDomain={setActiveDomain}
          trajPath={trajPath}
          trajData={trajData}
          handleTrajDrill={handleTrajDrill}
          handleTrajUp={handleTrajUp}
          handleTrajTo={handleTrajTo}
          INST_EVENTS={INST_EVENTS}
        />
      )}

      {currentView === 'detalhe-turma' && (
        <TurmaDetailView
          isDarkMode={isDarkMode}
          selectedTurma={selectedTurma}
          setSelectedTurma={setSelectedTurma}
          activeTurmaData={activeTurmaData}
          navigateBack={navigateBack}
          navigateTurmaPrevNext={navigateTurmaPrevNext}
          handleDropdownTurmaChange={handleDropdownTurmaChange}
          series={series}
          letters={letters}
          year={year}
          setYear={setYear}
          simulateLoading={simulateLoading}
          triggerToast={triggerToast}
          navigateCohort={navigateCohort}
          colors={colors}
          interventions={interventions}
          setInterventions={setInterventions}
          hoveredMomentum={hoveredMomentum}
          setHoveredMomentum={setHoveredMomentum}
          handleNavigate={handleNavigate}
          renderMatchMomentum={renderMatchMomentum}
        />
      )}

      {currentView === 'detalhe-disciplina' && (
        <DisciplinaDetailView
          isDarkMode={isDarkMode}
          selectedDisciplina={selectedDisciplina}
          selectedTurma={selectedTurma}
          year={year}
          navigateBack={navigateBack}
          handleNavigate={handleNavigate}
        />
      )}

      {currentView === 'editor-avaliacao' && (
        <EditorAvaliacao
          isDarkMode={isDarkMode}
          colors={colors}
          navigateBack={navigateBack}
          triggerToast={triggerToast}
          handleNavigate={handleNavigate}
        />
      )}

      {/* ══ OVERLAYS MODAIS DE DRILL-DOWN E PLANOS DE INTERVENÇÃO ══ */}
      <DominiosModal
        activeDomain={activeDomain}
        setActiveDomain={setActiveDomain}
        isDarkMode={isDarkMode}
        MATRIX_DRILL={MATRIX_DRILL}
        triggerToast={triggerToast}
        colors={colors}
      />

      {/* ══ SISTEMA GERAL DE NOTIFICAÇÕES (TOAST) ══ */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] min-w-[320px] max-w-[480px]">
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
            colors={colors}
            duration={3000}
          />
        </div>
      )}

    </div>
  );
};

export default AcompanhamentoEscolar;
