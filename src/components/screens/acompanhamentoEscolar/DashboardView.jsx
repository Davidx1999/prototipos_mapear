import React, { useState, useEffect, useMemo } from 'react';
import {
  Info, Sparkles, Activity, FileText, Bot, Edit3, Trash2, ArrowLeft,
  ChevronLeft, ChevronRight, ChevronDown, Download, RefreshCw, BarChart3, TrendingUp, CheckCircle2, Flame
} from 'lucide-react';
import Button from '../../ui/Button';
import Chips from '../../ui/Chips';

// Modular charts & components
import TurmasGrid from './TurmasGrid';
import EvolucaoSerieChart from './EvolucaoSerieChart';
import DesempenhoTurmaChart from './DesempenhoTurmaChart';
import DistribucaoConceitoChart from './DistribucaoConceitoChart';
import TrajetoriaChart from './TrajetoriaChart';
import Timeline from './Timeline';
import Breadcrumb from '../../ui/Breadcrumb';

const ALL_EVENTS = [
  // General Events
  { ano: 2023, mes: "Dez 2023", comp: null, dom: null, tipo: "plataforma", titulo: "Planejamento Curricular da Rede", detalhe: "Definição de metas de proficiência formativa para o ano letivo seguinte." },
  { ano: 2024, mes: "Fev 2024", comp: null, dom: null, tipo: "plataforma", titulo: "Adoção da plataforma MAPEAR", detalhe: "Início das avaliações formativas com questões abertas corrigidas por IA." },
  { ano: 2024, mes: "Ago 2024", comp: null, dom: null, tipo: "plataforma", titulo: "Alinhamento Curricular Intermediário", detalhe: "Revisão dos planos de ensino baseada no painel de desempenho MAPEAR." },
  { ano: 2025, mes: "Jan 2025", comp: null, dom: null, tipo: "plataforma", titulo: "Adaptação Curricular da Rede", detalhe: "Ajuste na carga horária semanal das disciplinas fundamentais." },
  { ano: 2025, mes: "Set 2025", comp: null, dom: null, tipo: "plataforma", titulo: "Avaliação Diagnóstica Integrada", detalhe: "Simulado Saeb com correção por IA e mapeamento automático de lacunas." },
  { ano: 2026, mes: "Fev 2026", comp: null, dom: null, tipo: "plataforma", titulo: "Consolidação de Práticas de IA", detalhe: "Compartilhamento de práticas pedagógicas bem-sucedidas sugeridas pela IA." },

  // Matemática General
  { ano: 2023, mes: "Nov 2023", comp: "Matemática", dom: null, tipo: "diagnostico", titulo: "Diagnóstico Zero de Matemática", detalhe: "Mapeamento inicial de álgebra básica nas coortes de ingresso do EM." },
  { ano: 2024, mes: "Mar 2024", comp: "Matemática", dom: null, tipo: "plataforma", titulo: "Formação de Professores: Estimativa Rápida", detalhe: "Desenvolvimento de estratégias de estimativa e cálculo mental rápido." },

  // Matemática - Álgebra e Funções
  { ano: 2025, mes: "Mar 2025", comp: "Matemática", dom: "Álgebra e Funções", tipo: "intervencao", titulo: "Intervenção: cálculo mental com milhares", detalhe: "Origem: IA. Alvo: Habilidade S01.H16. Resultados de proficiência: 61% -> 72%." },
  { ano: 2026, mes: "Abr 2026", comp: "Matemática", dom: "Álgebra e Funções", tipo: "intervencao", titulo: "Oficina: Modelagem de Funções de 1º Grau", detalhe: "Reforço prático com situações cotidianas nas turmas de 3º EM." },

  // Matemática - Geometria e Medidas
  { ano: 2024, mes: "Out 2024", comp: "Matemática", dom: "Geometria e Medidas", tipo: "plataforma", titulo: "Oficina de Resolução: Figuras Planas", detalhe: "Implementação de metodologias ativas para o cálculo de áreas complexas." },
  { ano: 2025, mes: "Nov 2025", comp: "Matemática", dom: "Geometria e Medidas", tipo: "intervencao", titulo: "Reforço: Relações Métricas no Triângulo", detalhe: "Uso de kits geométricos manipuláveis após alerta de baixo rendimento pela IA." },

  // Matemática - Estatística e Probabilidade
  { ano: 2025, mes: "Jan 2025", comp: "Matemática", dom: "Estatística e Probabilidade", tipo: "matriz", titulo: "Reformulação da prova de Estatística", detalhe: "Resultados de 2025 marcados como não comparáveis na série histórica." },

  // Matemática - Grandezas e Proporcionalidade
  { ano: 2026, mes: "Fev 2026", comp: "Matemática", dom: "Grandezas e Proporcionalidade", tipo: "intervencao", titulo: "Intervenção: Justificativa em Razão/Proporção", detalhe: "Alvo: Habilidade S04.H14. Resultados de proficiência: 38% -> em andamento." },

  // Português General
  { ano: 2023, mes: "Out 2023", comp: "Português · Leitura", dom: null, tipo: "diagnostico", titulo: "Fluência Leitora Inicial", detalhe: "Mapeamento de velocidade e compreensão de decodificação na rede." },
  { ano: 2024, mes: "Abr 2024", comp: "Português · Leitura", dom: null, tipo: "plataforma", titulo: "Projeto Rodas de Leitura", detalhe: "Leitura compartilhada de crônicas e contos clássicos no 1º EM." },

  // Português - Localização de Informação
  { ano: 2025, mes: "Jan 2025", comp: "Português · Leitura", dom: "Localização de Informação", tipo: "matriz", titulo: "Nova Matriz de Avaliação de Leitura", detalhe: "Reestruturação do instrumento de avaliação. Resultados de 2025 não comparáveis." },
  { ano: 2025, mes: "Ago 2025", comp: "Português · Leitura", dom: "Localização de Informação", tipo: "intervencao", titulo: "Intervenção: Leitura Rápida e Escaneamento", detalhe: "Alvo: Habilidade L01.H02. Desenvolvimento de técnicas de skimming e scanning." },

  // Português - Inferência e Compreensão
  { ano: 2024, mes: "Set 2024", comp: "Português · Leitura", dom: "Inferência e Compreensão", tipo: "diagnostico", titulo: "Seminário: Relações de Causa e Efeito", detalhe: "Análise qualitativa das inferências textuais com turmas em alerta." },
  { ano: 2025, mes: "Mai 2025", comp: "Português · Leitura", dom: "Inferência e Compreensão", tipo: "intervencao", titulo: "Intervenção: Estratégias de Inferência Implícita", detalhe: "Alvo: L02.H04. Leitura orientada com inferências a partir de textos argumentativos." },

  // Português - Análise e Reflexão
  { ano: 2024, mes: "Nov 2024", comp: "Português · Leitura", dom: "Análise e Reflexão", tipo: "diagnostico", titulo: "Foco Pedagógico: Fato vs Opinião", detalhe: "Identificação de fragilidades ao diferenciar argumentos de fatos." },
  { ano: 2026, mes: "Mar 2026", comp: "Português · Leitura", dom: "Análise e Reflexão", tipo: "intervencao", titulo: "Intervenção: Análise Crítica de Mídia", detalhe: "Alvo: L03.H08 (efeitos de sentido e ironia). Análise de posts em redes e notícias." }
];

const DashboardView = ({
  activeTab,
  setActiveTab,
  subTab,
  setSubTab,
  isDarkMode,
  colors,
  years,
  year,
  changeYear,
  currentMetrics,
  selectedTurma,
  selectedDisciplina,
  interventions,
  selectedTurmaFilter,
  setSelectedTurmaFilter,
  triggerToast,
  series,
  letters,
  getTurmaData,
  favorites,
  toggleFavorite,
  handleNavigate,
  renderMatchMomentum,
  desempenhoMode,
  setDesempenhoMode,
  selectedEvaluation,
  setSelectedEvaluation,
  AVALIACOES_INSIGHTS,
  RISK_STUDENTS,
  CONCEPT_DATA,
  setActiveDomain,
  trajPath,
  trajData,
  handleTrajDrill,
  handleTrajUp,
  handleTrajTo,
  INST_EVENTS
}) => {
  const [expandedInsight, setExpandedInsight] = useState(0);
  const isMath = selectedDisciplina === 'Matemática';

  const [uncheckedTrajItems, setUncheckedTrajItems] = useState({});

  useEffect(() => {
    setUncheckedTrajItems({});
  }, [trajPath]);

  const filteredEvents = useMemo(() => {
    const currentYearNum = parseInt(year);
    return ALL_EVENTS.filter(ev => {
      // 1. Filter by year
      if (ev.ano > currentYearNum) return false;

      // 2. Filter by component
      if (trajPath.comp === null) {
        return ev.comp === null;
      } else {
        if (ev.comp !== null && ev.comp !== trajPath.comp) return false;

        // 3. Filter by domain
        if (trajPath.dom === null) {
          return ev.dom === null;
        } else {
          return ev.dom === null || ev.dom === trajPath.dom;
        }
      }
    });
  }, [year, trajPath]);

  const breadcrumbPaths = useMemo(() => {
    const arr = [{ label: 'Componentes', onClick: () => handleTrajTo(0) }];
    if (trajPath.comp) {
      arr.push({ label: trajPath.comp, onClick: () => handleTrajTo(1) });
    }
    if (trajPath.dom) {
      arr.push({ label: trajPath.dom, onClick: () => {} });
    }
    return arr;
  }, [trajPath, handleTrajTo]);

  return (
    <div className="flex flex-col gap-6 animate-fade-slide">
      {/* SELEÇÃO DE ABAS SECUNDÁRIAS (SUBNAV - APENAS NA VISÃO DO ANO) */}
      {activeTab === 'ano' && (
        <div className="subnav flex gap-2 shrink-0">
          <Button
            onClick={() => setSubTab('panorama')}
            variant="primary"
            appearance="ghost"
            size="sm"
            uppercase={false}
            className={`!font-bold !h-7 ${subTab === 'panorama'
              ? '!bg-[var(--color-button-ghost-primary-color-primary-bg-hover)] !text-[var(--color-button-ghost-primary-color-primary-text-hover)]'
              : '!text-[var(--color-button-ghost-primary-color-primary-text-button)]'
              }`}
          >
            Panorama
          </Button>
          <Button
            onClick={() => setSubTab('diagnostico')}
            variant="primary"
            appearance="ghost"
            size="sm"
            uppercase={false}
            className={`!font-bold !h-7 ${subTab === 'diagnostico'
              ? '!bg-[var(--color-button-ghost-primary-color-primary-bg-hover)] !text-[var(--color-button-ghost-primary-color-primary-text-hover)]'
              : '!text-[var(--color-button-ghost-primary-color-primary-text-button)]'
              }`}
          >
            Diagnóstico das Respostas
          </Button>
        </div>
      )}

      {/* ================= TAB 1: VISÃO GERAL DO ANO ================= */}
      {activeTab === 'ano' && (
        <>
          {/* --- SUB-TAB: PANORAMA --- */}
          {subTab === 'panorama' && (
            <div className="flex flex-col gap-6 animate-fade-slide">
              {/* Superior Numeric Cards (Saúde da Escola) */}
              <div className={`rounded-[4px] border p-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                {/* Card 1: Acertos */}
                <div className="flex flex-col justify-between">
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">
                    <span>Acertos</span>
                    <Info className="w-3.5 h-3.5 text-slate-350 dark:text-slate-655" />
                  </div>
                  <div className="mt-2.5 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{currentMetrics.suf}%</span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 mt-1">
                    n = {selectedTurma.serie === "1em" ? 128 : selectedTurma.serie === "2em" ? 104 : 132} alunos
                  </span>
                </div>

                {/* Card 2: Participação */}
                <div className="flex flex-col justify-between border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide">
                    <span>Participação</span>
                    <Info className="w-3.5 h-3.5 text-slate-350 dark:text-slate-655" />
                  </div>
                  <div className="mt-2.5">
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{currentMetrics.part}%</span>
                  </div>
                  <span className={`text-[10px] font-bold mt-1 ${currentMetrics.part < 90 ? 'text-rose-600' : 'text-emerald-600'}`}>
                    {currentMetrics.part < 90 ? 'pode mascarar a média' : 'dentro do esperado'}
                  </span>
                </div>

                {/* Card 3: Em Branco */}
                <div className="flex flex-col justify-between border-t md:border-t-0 md:border-l pt-4 md:pt-0 md:pl-6" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide">
                    <span>Em Branco</span>
                    <Info className="w-3.5 h-3.5 text-slate-350 dark:text-slate-655" />
                  </div>
                  <div className="mt-2.5">
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                      {year === '2026' ? '3%' : '2%'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 mt-1">
                    respostas sem tentativa
                  </span>
                </div>

                {/* Card 4: Sem Conteúdo Cognitivo */}
                <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide">
                    <span>Sem Conteúdo Cognitivo</span>
                    <Info className="w-3.5 h-3.5 text-slate-350 dark:text-slate-655" />
                  </div>
                  <div className="mt-2.5">
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                      2%
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 mt-1">
                    sem engajamento avaliável
                  </span>
                </div>

                {/* Card 5: Avaliações */}
                <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                  <div className="flex justify-between items-center text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide">
                    <span>Avaliações</span>
                    <Info className="w-3.5 h-3.5 text-slate-350 dark:text-slate-655" />
                  </div>
                  <div className="mt-2.5">
                    <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                      {year === '2026' ? 120 : 108}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 mt-1">
                    ano letivo {year}
                  </span>
                </div>
              </div>

              {/* Matriz de Saúde das 24 Turmas */}
              <TurmasGrid
                series={series}
                letters={letters}
                getTurmaData={getTurmaData}
                favorites={favorites}
                toggleFavorite={toggleFavorite}
                handleNavigate={handleNavigate}
                renderMatchMomentum={renderMatchMomentum}
                isDarkMode={isDarkMode}
                colors={colors}
              />

              {/* GRÁFICOS DO PANORAMA */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Gráfico 1: Evolução da Série */}
                <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Evolução Curricular da Série ({year})</h4>
                    <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 mb-4">Média mensal dos estudantes nos dois componentes curriculares.</p>
                  </div>
                  <div className="h-64 mt-2">
                    <EvolucaoSerieChart isDarkMode={isDarkMode} perfValue={currentMetrics.suf} />
                  </div>
                </div>

                {/* Gráfico 2: Desempenho por Turma (Média x Boxplot) */}
                <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Distribuição de Resultados ({year})</h4>
                      <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1">Comparação de proficiência média e dispersão interquartil das turmas.</p>
                    </div>
                    {/* Toggle Button */}
                    <div className="flex bg-slate-100 dark:bg-slate-950 p-0.5 rounded-[4px] border border-slate-205 dark:border-slate-800 shrink-0">
                      <Button
                        onClick={() => setDesempenhoMode('media')}
                        variant="tertiary"
                        appearance={desempenhoMode === 'media' ? 'solid' : 'ghost'}
                        size="xs"
                        uppercase={false}
                        className="!font-bold !h-6"
                      >
                        Média
                      </Button>
                      <Button
                        onClick={() => setDesempenhoMode('boxplot')}
                        variant="tertiary"
                        appearance={desempenhoMode === 'boxplot' ? 'solid' : 'ghost'}
                        size="xs"
                        uppercase={false}
                        className="!font-bold !h-6"
                      >
                        Dispersão (Boxplot)
                      </Button>
                    </div>
                  </div>
                  <div className="h-64 mt-2">
                    <DesempenhoTurmaChart isDarkMode={isDarkMode} mode={desempenhoMode} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* --- SUB-TAB: DIAGNÓSTICO --- */}
          {subTab === 'diagnostico' && (
            <div className="flex flex-col gap-6 animate-fade-slide">
              {/* DIAGNÓSTICO DE RESPOSTAS POR INTELIGÊNCIA ARTIFICIAL */}
              <div className={`rounded-[4px] border shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                {/* Header */}
                <div className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-850">
                  <div className="flex items-start gap-3">
                    <Bot className="w-5 h-5 mt-0.5 text-[#006699] dark:text-sky-400" />
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">
                        DIAGNÓSTICO DE RESPOSTAS POR INTELIGÊNCIA ARTIFICIAL
                      </h4>
                      <p className="text-sm text-slate-450 dark:text-slate-400 font-light mt-0.5">
                        Dificuldades e padrões de erros encontrados nas resoluções escritas dos estudantes.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <label className="text-sm font-bold text-slate-450 dark:text-slate-500 uppercase">AVALIAÇÃO:</label>
                    <select
                      value={selectedEvaluation}
                      onChange={(e) => setSelectedEvaluation(e.target.value)}
                      className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1.5 text-sm font-semibold text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
                    >
                      {Object.keys(AVALIACOES_INSIGHTS).map(key => (
                        <option key={key} value={key}>{AVALIACOES_INSIGHTS[key].titulo}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Accordion List */}
                <div className="p-5 space-y-3">
                  {AVALIACOES_INSIGHTS[selectedEvaluation].insights.map((ins, idx) => {
                    const isExpanded = expandedInsight === idx;
                    return (
                      <div key={idx} className={`rounded-[4px] border transition-all ${isExpanded ? 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-sm' : 'border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-50 dark:hover:bg-slate-900/60'}`}>
                        {/* Header Accordion */}
                        <div
                          className="flex items-center justify-between p-4 cursor-pointer"
                          onClick={() => setExpandedInsight(isExpanded ? null : idx)}
                        >
                          <div className="flex items-center gap-3">
                            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                            <span className="text-sm font-bold text-slate-800 dark:text-slate-200">{ins.padrao}</span>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="px-2.5 py-1 text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300 rounded-[4px]">
                              {ins.alunos} estudantes impactados
                            </span>
                            {isExpanded ? <ChevronDown className="w-4 h-4 text-slate-400" /> : <ChevronRight className="w-4 h-4 text-slate-400" />}
                          </div>
                        </div>

                        {/* Expanded Content */}
                        {isExpanded && (
                          <div className="px-4 pb-4 pt-1 animate-fade-slide">
                            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">{ins.desc}</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                              <div className="p-4 rounded-[4px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                                <span className="text-sm font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide block mb-2">RESPOSTA TÍPICA ANALISADA</span>
                                <p className="text-sm text-slate-800 dark:text-slate-300 italic">"{ins.resposta}"</p>
                              </div>
                              <div className="p-4 rounded-[4px] border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950">
                                <span className="text-sm font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide block mb-2">RECOMENDAÇÃO CURRICULAR DA IA</span>
                                <p className="text-sm text-slate-800 dark:text-slate-300">{ins.rec}</p>
                              </div>
                            </div>

                            <div className="flex items-center gap-3 text-sm font-bold uppercase text-slate-455 dark:text-slate-500 mb-4">
                              <span>IMPACTO POR TURMAS:</span>
                              {ins.turmasDist.map((t, i) => (
                                <span key={i} className="text-slate-700 dark:text-slate-300">{t.nome}: <span className="font-extrabold">{t.valor} Alunos</span></span>
                              ))}
                            </div>

                            <div className="flex items-center justify-between gap-3 mt-4">
                              <div>
                                <Chips label="Insuficientes" status="error" variant="light" />
                              </div>
                              <div className="flex items-center gap-3">
                                <Button
                                  onClick={() => triggerToast("Abrindo respostas para este padrão...")}
                                  variant="secondary"
                                  appearance="solid"
                                  size="sm"
                                  uppercase={false}
                                >
                                  Ver Respostas
                                </Button>
                                <Button
                                  onClick={() => triggerToast("Intervenção registrada com sucesso!")}
                                  variant="primary"
                                  appearance="solid"
                                  size="sm"
                                  uppercase={false}
                                  iconRight={<CheckCircle2 className="w-4 h-4" />}
                                >
                                  Aceitar e registrar intervenção
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Lower Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className={`lg:col-span-1 rounded-[4px] border p-5 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide mb-1">Distribuição de Conceito Escolar</h4>
                  <p className="text-sm text-slate-455 dark:text-slate-400 font-light mb-4">Acompanhamento evolutivo da classificação conceitual qualitativa no ano.</p>
                  <div className="h-64 mt-2">
                    <DistribucaoConceitoChart isDarkMode={isDarkMode} />
                  </div>
                </div>

                <div className={`lg:col-span-2 rounded-[4px] border p-5 shadow-xs flex-1 ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                  <div className="flex justify-between items-center border-b pb-3 mb-4" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-slate-200 text-sm uppercase tracking-wide">ESTUDANTES SOB MONITORAMENTO PRÓXIMO</h4>
                      <p className="text-sm text-slate-450 dark:text-slate-400 font-light mt-0.5">Desempenho abaixo do básico em 2 ou mais domínios curriculares.</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">FILTRAR TURMA:</label>
                      <select
                        value={selectedTurmaFilter}
                        onChange={(e) => setSelectedTurmaFilter(e.target.value)}
                        className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
                      >
                        <option value="all">Todas as turmas</option>
                        <option value="3A">Turma 3A</option>
                        <option value="3B">Turma 3B</option>
                        <option value="3C">Turma 3C</option>
                        <option value="3D">Turma 3D</option>
                      </select>
                      <Button
                        onClick={() => triggerToast("Exportando lista de monitoramento (.csv)...")}
                        variant="tertiary"
                        appearance="solid"
                        size="xs"
                        iconLeft={<Download />}
                        uppercase={true}
                        className="!h-7"
                      >
                        EXPORTAR LISTA
                      </Button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                          <th className="py-2.5 px-3">Estudante</th>
                          <th className="py-2.5 px-3">Turma</th>
                          <th className="py-2.5 px-3 text-center">Domínios Críticos</th>
                          <th className="py-2.5 px-3 text-center">Taxa de Participação</th>
                          <th className="py-2.5 px-3">Conceito Escolar</th>
                          <th className="py-2.5 px-3 text-right">Ação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300 font-medium">
                        {RISK_STUDENTS.filter(s => selectedTurmaFilter === 'all' || s.turma === selectedTurmaFilter).map((stu, sIdx) => {
                          const conc = CONCEPT_DATA[stu.conceito];
                          return (
                            <tr key={sIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                              <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white text-xs">{stu.nome}</td>
                              <td className="py-2.5 px-3 text-xs">Turma {stu.turma}</td>
                              <td className="py-2.5 px-3 text-center text-rose-600 dark:text-rose-400 font-bold text-xs">{stu.dominios}</td>
                              <td className="py-2.5 px-3 text-center text-xs">{stu.part}%</td>
                              <td className="py-2.5 px-3">
                                <span className={`px-2.5 py-0.5 text-[10px] font-bold border rounded-[2px] ${conc.color}`}>
                                  {conc.label}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-right">
                                <Button
                                  onClick={() => triggerToast(`Abrindo perfil histórico e de tentativas do ${stu.nome}.`)}
                                  variant="tertiary"
                                  appearance="ghost"
                                  size="xs"
                                  uppercase={false}
                                  iconRight={<ChevronRight className="w-3.5 h-3.5" />}
                                  className="text-slate-700 dark:text-slate-350"
                                >
                                  Detalhes
                                </Button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}

      {/* ================= TAB 2: TRAJETÓRIA DA ESCOLA ================= */}
      {activeTab === 'trajetoria' && (
        <div className="flex flex-col gap-6 animate-fade-slide">



          {/* Breadcrumbs e Botão de Subida */}
          <div className="border-b pb-1 mb-4" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
            <Breadcrumb
              paths={breadcrumbPaths}
              onBack={trajPath.comp ? handleTrajUp : null}
              colors={colors}
              className="!mb-2"
            />
          </div>

          {/* Cards Rápidos de Informação */}
          {(() => {
            if (trajPath.comp === null) {
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Componentes Curriculares</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">2</p>
                    <span className="text-[10px] text-emerald-600 font-bold">Português e Matemática</span>
                  </div>
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Total de Domínios</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">7</p>
                    <span className="text-[10px] text-slate-500 font-bold">Matrizes de Referência Saeb</span>
                  </div>
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Avanço Médio Geral</span>
                    <p className="text-lg font-extrabold text-emerald-600 dark:text-emerald-450">+15 p.p.</p>
                    <span className="text-[10px] text-slate-500 font-semibold">desde o ano letivo 2023</span>
                  </div>
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Média de Proficiência</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">68%</p>
                    <span className="text-[10px] text-emerald-600 font-bold">+7% vs média estadual</span>
                  </div>
                </div>
              );
            } else if (trajPath.dom === null) {
              const count = isMath ? Object.keys(MATRIX_DRILL).length : 3;
              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Domínios do Componente</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">{count}</p>
                    <span className="text-[10px] text-slate-500 font-bold truncate block">{trajPath.comp}</span>
                  </div>
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Média Geral em 2026</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">74%</p>
                    <span className="text-[10px] text-emerald-600 font-bold">+12 p.p. desde 2023</span>
                  </div>
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Habilidade com Maior Alta</span>
                    <p className="text-lg font-extrabold text-emerald-650 truncate">Interpret. Tabelas</p>
                    <span className="text-[10px] text-emerald-600 font-bold">+28 p.p. (S10.H02)</span>
                  </div>
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Foco prioritário de ação</span>
                    <p className="text-lg font-extrabold text-rose-600 dark:text-rose-400 truncate">Álgebra e Funções</p>
                    <span className="text-[10px] text-rose-500 font-bold">Abaixo da média da rede</span>
                  </div>
                </div>
              );
            } else {
              const ranked = [...trajData.items].map(it => {
                const last = it.vals.filter(x => x !== null);
                const delta = last.length > 1 ? last[last.length - 1] - last[0] : 0;
                const lastVal = last.length ? last[last.length - 1] : 0;
                return { ...it, delta, lastVal };
              }).sort((a, b) => b.delta - a.delta);
              const best = ranked[0] || { nome: '—', delta: 0 };
              const worst = ranked[ranked.length - 1] || { nome: '—', delta: 0 };
              const refLast = trajData.ref.vals[trajData.ref.vals.length - 1];
              const refFirst = trajData.ref.vals[0];
              const refDelta = refLast !== null && refFirst !== null ? refLast - refFirst : 0;

              return (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Habilidades</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">{trajData.items.length}</p>
                    <span className="text-[10px] text-slate-500 font-bold truncate block">{trajPath.dom}</span>
                  </div>
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Domínio em 2026</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">{refLast}%</p>
                    <span className={`text-[10px] font-bold ${refDelta >= 0 ? 'text-emerald-600' : 'text-rose-605 dark:text-rose-455'}`}>
                      {refDelta >= 0 ? '+' : ''}{refDelta} p.p. desde 2023
                    </span>
                  </div>
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Maior Avanço</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">{best.nome}</p>
                    <span className="text-[10px] text-emerald-600 font-bold">
                      +{best.delta} p.p. desde 2023
                    </span>
                  </div>
                  <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Menor Avanço</span>
                    <p className="text-lg font-extrabold text-slate-800 dark:text-white">{worst.nome}</p>
                    <span className={`text-[10px] font-bold ${worst.delta >= 0 ? 'text-emerald-650' : 'text-rose-605 dark:text-rose-455'}`}>
                      {worst.delta >= 0 ? '+' : ''}{worst.delta} p.p. desde 2023
                    </span>
                  </div>
                </div>
              );
            }
          })()}

          {/* Gráfico de Tendência Histórica & Cronologia */}
          <div className={`rounded-[4px] border p-6 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Lado Esquerdo: Gráfico */}
              <div className="lg:col-span-2 flex flex-col justify-between">
                <div>
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide mb-1">{trajData.title}</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-400 font-light mb-4" dangerouslySetInnerHTML={{ __html: trajData.desc }} />
                </div>
                <div className="h-auto py-4 mt-2">
                  <TrajetoriaChart
                    items={trajData.items.filter(it => !uncheckedTrajItems[it.nome])}
                    refData={uncheckedTrajItems['__reference__'] ? null : trajData.ref}
                    isDarkMode={isDarkMode}
                    handleTrajDrill={handleTrajDrill}
                  />
                </div>
                {trajData.gapNote && (
                  <p className="text-[10px] font-light text-slate-400 dark:text-slate-500 italic mt-3 bg-slate-50 dark:bg-slate-950 p-2 border border-slate-100 dark:border-slate-850 rounded-[3px] leading-relaxed">
                    <strong>Nota curricular:</strong> {trajData.gapNote}
                  </p>
                )}
              </div>

              {/* Lado Direito: Cronologia de Eventos Escolares */}
              <div className="border-t lg:border-t-0 lg:border-l pt-5 lg:pt-0 lg:pl-6 flex flex-col justify-start gap-4" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                <div>
                  <div className="flex items-center gap-1.5 mb-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600 dark:text-emerald-450" />
                    <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">Cronologia de Eventos</h4>
                  </div>
                  <p className="text-[11px] text-slate-455 dark:text-slate-400 font-light mb-4">Marcos de intervenções pedagógicas e alterações curriculares estruturais da coorte.</p>
                </div>

                <div className="relative flex-1 h-0 overflow-y-auto pr-2 flex flex-col gap-4 pl-4 border-l border-slate-200 dark:border-slate-800 ml-1.5 py-1">
                  {filteredEvents.length > 0 ? (
                    filteredEvents.map((ev, eIdx) => (
                      <div key={eIdx} className="relative text-xs">
                        {/* Timeline dot */}
                        <span className="absolute -left-[20.5px] top-1 w-2.5 h-2.5 rounded-full border-2 border-white dark:border-slate-900 bg-slate-400 shadow-sm"></span>
                        <span className="text-[9px] font-extrabold uppercase text-[#006699] dark:text-sky-400">{ev.mes}</span>
                        <h5 className="font-bold text-slate-850 dark:text-slate-200 text-xs mt-0.5">{ev.titulo}</h5>
                        <p className="text-[11px] text-slate-550 dark:text-slate-400 font-light mt-0.5 leading-relaxed">{ev.detalhe}</p>
                      </div>
                    ))
                  ) : (
                    <p className="text-xs text-slate-400 dark:text-slate-500 italic">Nenhum evento pedagógico ou alteração curricular registrada neste nível/período.</p>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* YoY Evolution Metrics Table */}
          <div className={`rounded-[4px] border p-5 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center border-b pb-3 mb-4" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">{trajData.yoyTitle}</h4>
                <p className="text-[11px] text-slate-455 dark:text-slate-400 font-light mt-0.5">Indicador ano a ano com cálculo de deltas percentuais.</p>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                    <th className="py-2.5 px-3 w-12 text-center">Exibir</th>
                    <th className="py-2.5 px-3 w-1/3">{trajData.colLabel}</th>
                    <th className="py-2.5 px-3 text-center">2023</th>
                    <th className="py-2.5 px-3 text-center">2024</th>
                    <th className="py-2.5 px-3 text-center">Δ 24→25</th>
                    <th className="py-2.5 px-3 text-center">2025</th>
                    <th className="py-2.5 px-3 text-center">Δ 25→26</th>
                    <th className="py-2.5 px-3 text-center">2026</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-705 dark:text-slate-300 font-semibold">
                  {/* Reference line */}
                  <tr className="bg-slate-50/50 dark:bg-slate-900/30 font-bold">
                    <td className="py-3 px-3 text-center w-12">
                      <input
                        type="checkbox"
                        checked={!uncheckedTrajItems['__reference__']}
                        onChange={() => setUncheckedTrajItems(prev => ({ ...prev, '__reference__': !prev['__reference__'] }))}
                        className="rounded border-slate-300 dark:border-slate-700 text-[#006699] focus:ring-[#006699] cursor-pointer w-4 h-4"
                      />
                    </td>
                    <td className="py-3 px-3 text-slate-900 dark:text-white">{trajData.ref.label}</td>
                    <td className="py-3 px-3 text-center">{trajData.ref.vals[0] === null ? '—' : `${trajData.ref.vals[0]}%`}</td>
                    <td className="py-3 px-3 text-center">{trajData.ref.vals[1] === null ? '—' : `${trajData.ref.vals[1]}%`}</td>
                    {/* 24 -> 25 delta */}
                    <td className="py-3 px-3 text-center">
                      {(() => {
                        const v = trajData.ref.vals[2];
                        const prev = trajData.ref.vals[1];
                        if (v === null || prev === null) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-400 dark:bg-slate-800 rounded">n/c</span>;
                        const d = v - prev;
                        if (Math.abs(d) <= 2) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-450 dark:bg-slate-855 rounded font-normal">≈</span>;
                        return (
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${d > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20' : 'bg-rose-50 text-rose-650'}`}>
                            {d > 0 ? '+' : ''}{d}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-3 px-3 text-center">{trajData.ref.vals[2] === null ? '—' : `${trajData.ref.vals[2]}%`}</td>
                    {/* 25 -> 26 delta */}
                    <td className="py-3 px-3 text-center">
                      {(() => {
                        const v = trajData.ref.vals[3];
                        const prev = trajData.ref.vals[2];
                        if (v === null || prev === null) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-400 dark:bg-slate-800 rounded">n/c</span>;
                        const d = v - prev;
                        if (Math.abs(d) <= 2) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-455 dark:bg-slate-855 rounded font-normal">≈</span>;
                        return (
                          <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${d > 0 ? 'bg-emerald-50 text-emerald-650 dark:bg-emerald-955/20' : 'bg-rose-50 text-rose-600'}`}>
                            {d > 0 ? '+' : ''}{d}
                          </span>
                        );
                      })()}
                    </td>
                    <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">{trajData.ref.vals[3] === null ? '—' : `${trajData.ref.vals[3]}%`}</td>
                  </tr>

                  {/* Individual Items */}
                  {trajData.items.map((it) => (
                    <tr key={it.nome} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                      <td className="py-3 px-3 text-center w-12">
                        <input
                          type="checkbox"
                          checked={!uncheckedTrajItems[it.nome]}
                          onChange={() => setUncheckedTrajItems(prev => ({ ...prev, [it.nome]: !prev[it.nome] }))}
                          className="rounded border-slate-300 dark:border-slate-700 text-[#006699] focus:ring-[#006699] cursor-pointer w-4 h-4"
                        />
                      </td>
                      <td className="py-3 px-3">
                        <div className="flex flex-col">
                          {it.drill ? (
                            <button
                              onClick={() => handleTrajDrill && handleTrajDrill(it.nome)}
                              className="font-bold text-[#006699] dark:text-sky-400 hover:underline text-left"
                            >
                              {it.nome}
                            </button>
                          ) : (
                            <span className="font-semibold text-slate-900 dark:text-white">{it.nome}</span>
                          )}
                          {it.sub && <span className="text-sm text-slate-400 dark:text-slate-500 font-light truncate max-w-[280px]">{it.sub}</span>}
                        </div>
                      </td>
                      <td className="py-3 px-3 text-center">{it.vals[0] === null ? '—' : `${it.vals[0]}%`}</td>
                      <td className="py-3 px-3 text-center">{it.vals[1] === null ? '—' : `${it.vals[1]}%`}</td>

                      {/* 24 -> 25 delta */}
                      <td className="py-3 px-3 text-center">
                        {(() => {
                          const v = it.vals[2];
                          const prev = it.vals[1];
                          if (v === null || prev === null) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-400 dark:bg-slate-800 rounded">n/c</span>;
                          const d = v - prev;
                          if (Math.abs(d) <= 2) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-455 dark:bg-slate-855 rounded font-normal">≈</span>;
                          return (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${d > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20' : 'bg-rose-50 text-rose-600'}`}>
                              {d > 0 ? '+' : ''}{d}
                            </span>
                          );
                        })()}
                      </td>

                      <td className="py-3 px-3 text-center">{it.vals[2] === null ? '—' : `${it.vals[2]}%`}</td>

                      {/* 25 -> 26 delta */}
                      <td className="py-3 px-3 text-center">
                        {(() => {
                          const v = it.vals[3];
                          const prev = it.vals[2];
                          if (v === null || prev === null) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-400 dark:bg-slate-800 rounded">n/c</span>;
                          const d = v - prev;
                          if (Math.abs(d) <= 2) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-455 dark:bg-slate-855 rounded font-normal">≈</span>;
                          return (
                            <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${d > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20' : 'bg-rose-50 text-rose-600'}`}>
                              {d > 0 ? '+' : ''}{d}
                            </span>
                          );
                        })()}
                      </td>

                      {/* 2026 */}
                      <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">{it.vals[3] === null ? '—' : `${it.vals[3]}%`}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      )}
    </div>
  );
};

export default DashboardView;
