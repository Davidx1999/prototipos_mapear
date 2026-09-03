import React, { useState, useEffect } from 'react';
import {
  ArrowUpCircle,
  ArrowDownCircle,
  GitMerge,
  Target,
  BookOpen,
  CheckCircle2,
  MinusCircle,
  XCircle,
  Route,
  File,
  ChevronUp,
  ChevronDown,
  ArrowLeft,
  CornerUpRight,
  Loader2
} from 'lucide-react';
import { TIMELINE_DATA_BY_YEAR } from './mockDataAcompanhamento';

export default function LinhaDoTempoTab({
  selectedYear: propSelectedYear,
  setSelectedYear: propSetSelectedYear
}) {
  const [internalSelectedYear, setInternalSelectedYear] = useState(2026);
  const [expandedSections, setExpandedSections] = useState({ 'timeline-fev': true });
  const [isTimelineLoading, setIsTimelineLoading] = useState(false);

  const years = [2021, 2022, 2023, 2024, 2025, 2026];

  const selectedYear = propSelectedYear ? Number(propSelectedYear) : internalSelectedYear;
  const setSelectedYear = (yr) => {
    if (propSetSelectedYear) propSetSelectedYear(yr);
    setInternalSelectedYear(yr);
  };

  useEffect(() => {
    setIsTimelineLoading(true);
    const timer = setTimeout(() => {
      setIsTimelineLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedYear]);

  const selectedYearIndex = years.indexOf(selectedYear) >= 0 ? years.indexOf(selectedYear) : years.length - 1;
  const YEAR_ITEM_WIDTH = 130;

  const yearTimeline = TIMELINE_DATA_BY_YEAR[selectedYear] || TIMELINE_DATA_BY_YEAR[2026];
  const months = yearTimeline.months || [];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const toggleExpand = (id) => {
    setExpandedSections((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  /**
   * Badges de Conceito Predominante (sem "Avançado"):
   * - Múltipla Escolha: Correto, Incorreto, Em Branco
   * - Híbridos / Abertas: Suficiente, Parcialmente Suficiente, Insuficiente, S/ Conteúdo Relevante, Em Branco
   *
   * Ícones:
   * - Correto / Suficiente: CheckCircle2 interno
   * - Parcialmente Suficiente: MinusCircle
   * - Incorreto / Insuficiente: XCircle
   * - S/ Conteúdo Relevante: Route
   * - Em Branco: File em branco
   */
  const getConceptBadge = (concept) => {
    if (concept === 'Suficiente' || concept === 'Correto') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#B7EEB4] text-[#0F1113] whitespace-nowrap shrink-0">
          <CheckCircle2 className="w-3.5 h-3.5 text-[#0F1113]" />
          <span>{concept === 'Correto' ? 'Correto' : 'Suficiente'}</span>
        </span>
      );
    }
    if (concept === 'Parcialmente Suficiente' || concept === 'Parcialmente') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFEBB8] text-[#0F1113] whitespace-nowrap shrink-0">
          <MinusCircle className="w-3.5 h-3.5 text-[#0F1113]" />
          <span>Parcialmente Suficiente</span>
        </span>
      );
    }
    if (concept === 'Insuficiente' || concept === 'Incorreto') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFAEB4] text-[#0F1113] whitespace-nowrap shrink-0">
          <XCircle className="w-3.5 h-3.5 text-[#0F1113]" />
          <span>{concept === 'Incorreto' ? 'Incorreto' : 'Insuficiente'}</span>
        </span>
      );
    }
    if (concept === 'S/ Conteúdo Relevante' || concept === 'Sem Conteúdo Relevante') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#BDE9FB] text-[#0F1113] whitespace-nowrap shrink-0">
          <Route className="w-3.5 h-3.5 text-[#0F1113]" />
          <span>Sem Conteúdo Relevante</span>
        </span>
      );
    }
    if (concept === 'Em Branco' || concept === 'Em branco') {
      return (
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E4E7EE] text-[#0F1113] whitespace-nowrap shrink-0">
          <File className="w-3.5 h-3.5 text-[#0F1113]" />
          <span>Em Branco</span>
        </span>
      );
    }
    return null;
  };

  /**
   * Badges de Escala: fundo branco, com borda e texto/ícone coloridos
   * - Larga Escala: borda e texto em vinho/cereja (#8B1D3B)
   * - Pequena Escala: borda e texto em roxo/índigo (#5E2E8C)
   */
  const getScaleBadge = (scale) => {
    if (scale === 'Larga Escala') {
      return (
        <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-white border border-[#8B1D3B] text-[#8B1D3B] whitespace-nowrap shrink-0">
          Larga Escala
        </span>
      );
    }
    return (
      <span className="px-3 py-0.5 rounded-full text-xs font-semibold bg-white border border-[#5E2E8C] text-[#5E2E8C] whitespace-nowrap shrink-0">
        Pequena Escala
      </span>
    );
  };

  /**
   * Barra indicadora com contorno sutil dark 24% para eliminar ilusão de ótica:
   * - Múltipla Escolha: branco, vermelho e verde
   * - Híbridos / Abertas: branco, azul claro (s/ conteúdo), vermelho (insuficiente), amarelo (parcialmente), verde (suficiente)
   */
  const renderIndicatorBar = ({ tipo = 'hibrido', segments }) => {
    if (tipo === 'multipla_escolha') {
      return (
        <div className="h-2 rounded-full overflow-hidden flex w-full mt-3 bg-slate-100 shadow-inner border border-[#0F1113]/24">
          <div style={{ width: `${segments.branco || 0}%` }} className="bg-[#E2E8F0] h-full" title={`Em Branco: ${segments.branco}%`} />
          <div style={{ width: `${segments.vermelho || 0}%` }} className="bg-[#EF4444] h-full" title={`Incorreto: ${segments.vermelho}%`} />
          <div style={{ width: `${segments.verde || 0}%` }} className="bg-[#22C55E] h-full" title={`Correto: ${segments.verde}%`} />
        </div>
      );
    }

    return (
      <div className="h-2 rounded-full overflow-hidden flex w-full mt-3 bg-slate-100 shadow-inner border border-[#0F1113]/24">
        <div style={{ width: `${segments.branco || 0}%` }} className="bg-[#E2E8F0] h-full" title={`Em branco: ${segments.branco}%`} />
        <div style={{ width: `${segments.azul || 0}%` }} className="bg-[#BAE6FD] h-full" title={`S/ conteúdo relevante: ${segments.azul}%`} />
        <div style={{ width: `${segments.vermelho || 0}%` }} className="bg-[#F87171] h-full" title={`Insuficiente: ${segments.vermelho}%`} />
        <div style={{ width: `${segments.amarelo || 0}%` }} className="bg-[#FBBF24] h-full" title={`Parcialmente suficiente: ${segments.amarelo}%`} />
        <div style={{ width: `${segments.verde || 0}%` }} className="bg-[#4ADE80] h-full" title={`Suficiente: ${segments.verde}%`} />
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center w-full select-none pb-20">
      {/* ─── NAVEGAÇÃO STICKY: ANOS E MESES (Fixa a 140px, logo abaixo do Header + Tabs) ─── */}
      <div className="sticky top-[140px] bg-white/95 backdrop-blur-md z-30 w-full pt-4 pb-3 border-b border-[#DEE1E8] shadow-2xs before:content-[''] before:absolute before:inset-y-0 before:-left-[100vw] before:-right-[100vw] before:bg-white/95 before:border-b before:border-[#DEE1E8] before:-z-10">
        <div className="max-w-4xl mx-auto flex flex-col items-center gap-3">
          {/* Trilho de Anos: O ano selecionado fica matematicamente alinhado com a linha central da linha do tempo */}
          <div className="relative w-full overflow-hidden pt-1 pb-3">
            {/* Marcador Central Fixo do Ano Selecionado (Exatamente no eixo 50% da Linha do Tempo, Círculo Completo) */}
            <div className="absolute left-1/2 -translate-x-1/2 bottom-[8px] w-28 md:w-36 h-[2px] bg-[#008BC9] flex items-center justify-center pointer-events-none z-10">
              <div className="w-3.5 h-3.5 rounded-full bg-[#008BC9] shadow-xs" />
            </div>

            {/* Trilho Deslizante dos Anos que centraliza o ano selecionado no eixo central */}
            <div
              className="flex items-center transition-transform duration-300 ease-out"
              style={{
                transform: `translateX(calc(50% - ${(selectedYearIndex + 0.5) * YEAR_ITEM_WIDTH}px))`
              }}
            >
              {years.map((yr) => {
                const isSelected = yr === selectedYear;
                return (
                  <button
                    key={yr}
                    onClick={() => setSelectedYear(yr)}
                    style={{ width: `${YEAR_ITEM_WIDTH}px` }}
                    className="shrink-0 flex flex-col items-center justify-center pb-3 transition-all cursor-pointer select-none"
                  >
                    <span
                      className={`transition-all ${
                        isSelected
                          ? 'text-[30px] leading-[38px] font-semibold text-[#1D2432]'
                          : yr < 2024
                          ? 'text-[28px] leading-[36px] font-medium text-[#94CFEF] hover:text-[#008BC9]'
                          : 'text-[28px] leading-[36px] font-medium text-[#008BC9] hover:text-[#005580]'
                      }`}
                    >
                      {yr}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Barra de Navegação de Meses com Começo e Fim (Sem estado hover persistente, apenas clique para rolar) */}
          <div className="flex items-center justify-center gap-2 md:gap-4 flex-wrap text-sm font-semibold pt-1">
            {/* Botão Começo */}
            <button
              onClick={() => scrollToSection('timeline-comeco')}
              className="inline-flex items-center gap-1.5 text-[#008BC9] hover:text-[#005580] transition-colors py-1 px-2.5 rounded-[6px] hover:bg-sky-50 font-bold cursor-pointer"
              title="Ir para o início da linha do tempo"
            >
              <span>Começo</span>
              <ArrowUpCircle className="w-5 h-5 stroke-[2]" />
            </button>

            {/* Meses dinâmicos do ano selecionado: clique comum para direcionar */}
            {months.map((m) => (
              <button
                key={m}
                onClick={() => scrollToSection(`timeline-${m.toLowerCase()}`)}
                className="px-3.5 py-1 text-[#008BC9] hover:text-[#005580] hover:bg-sky-50 font-semibold transition-all rounded-[6px] cursor-pointer"
              >
                {m}
              </button>
            ))}

            {/* Botão Fim */}
            <button
              onClick={() => scrollToSection('timeline-fim')}
              className="inline-flex items-center gap-1.5 text-[#008BC9] hover:text-[#005580] transition-colors py-1 px-2.5 rounded-[6px] hover:bg-sky-50 font-bold cursor-pointer"
              title="Ir para o final da linha do tempo"
            >
              <span>Fim</span>
              <ArrowDownCircle className="w-5 h-5 stroke-[2]" />
            </button>
          </div>
        </div>
      </div>

      {/* ─── LINHA DO TEMPO VERTICAL COM CARDS ALTERNADOS ─── */}
      <div className="w-full max-w-4xl mx-auto pt-8 px-4">
        {/* Container relativo da linha do tempo: a linha guia começa na primeira bolinha e termina na última bolinha */}
        <div className="relative w-full">
          {/* Linha Central Azul que corre EXATAMENTE da primeira bolinha até a última bolinha */}
          <div className="absolute top-[11px] bottom-[11px] left-6 md:left-1/2 w-[2px] bg-[#008BC9] -translate-x-1/2 pointer-events-none" />

          {/* 1. SEÇÃO: No ano anterior... (Topo / Começo) */}
          <div
            id="timeline-comeco"
            className="relative flex w-full mb-12 flex-col md:flex-row items-start scroll-mt-[310px]"
          >
            {/* Marcador Circular Central com Rótulo (Início da Linha) */}
            <div className="absolute left-6 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#008BC9] -translate-x-1/2 mt-1 z-10 shadow-xs" />

            {/* Lado Esquerdo (Vazio no Desktop) */}
            <div className="hidden md:block md:w-1/2" />

            {/* Lado Direito: Rótulo + Card */}
            <div className="w-full pl-12 md:pl-8 md:w-1/2 flex flex-col items-start">
              <span className="text-sm font-bold text-[#008BC9] mb-3">
                {yearTimeline.prevYearText || 'No ano anterior...'}
              </span>

              <div className="bg-white border border-[#CBD5E1] rounded-[8px] p-4 shadow-2xs hover:border-[#94CFEF] transition-all w-full max-w-md">
                <div className="flex items-center gap-2 text-slate-500 mb-2">
                  <GitMerge className="w-4 h-4 text-slate-500" />
                  <span className="text-xs font-medium text-[#64748B]">
                    {yearTimeline.prevYearSummary?.target || `Desempenho no ano anterior`}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-2 flex-wrap">
                  <h4 className="text-sm font-bold text-[#1D2432]">
                    Conceito Predominante do Ano foi
                  </h4>
                  {getConceptBadge(yearTimeline.prevYearSummary?.concept || 'Suficiente')}
                </div>

                {renderIndicatorBar({
                  tipo: 'hibrido',
                  segments: yearTimeline.prevYearSummary?.segments || { branco: 5, azul: 5, vermelho: 15, amarelo: 25, verde: 50 }
                })}
              </div>
            </div>
          </div>

          {/* 2. SEÇÕES DINÂMICAS DO ANO SELECIONADO (OU SKELETONS EM LAZY LOADING) */}
          {isTimelineLoading ? (
            <div className="flex flex-col gap-8 py-2 w-full">
              {[1, 2, 3].map((s) => {
                const isLeft = s % 2 === 0;
                return (
                  <div
                    key={s}
                    className={`relative flex w-full flex-col ${
                      isLeft
                        ? 'md:flex-row md:flex-row-reverse items-start'
                        : 'md:flex-row items-start'
                    }`}
                  >
                    <div className="absolute left-6 md:left-1/2 w-3.5 h-3.5 rounded-full bg-slate-200 -translate-x-1/2 mt-1 z-10 animate-pulse" />
                    <div className="hidden md:block md:w-1/2" />
                    <div
                      className={`w-full pl-12 flex flex-col ${
                        isLeft
                          ? 'md:pl-0 md:pr-8 md:w-1/2 md:items-end'
                          : 'md:pl-8 md:w-1/2 items-start'
                      }`}
                    >
                      <div className="h-4 w-20 bg-slate-200 rounded animate-pulse mb-3" />
                      <div className="bg-white border border-[#CBD5E1] rounded-[8px] p-4 shadow-2xs w-full max-w-md animate-pulse">
                        <div className="flex items-center justify-between gap-2 mb-3">
                          <div className="h-3.5 w-32 bg-slate-200 rounded" />
                          <div className="h-4 w-20 bg-slate-200 rounded-full" />
                        </div>
                        <div className="h-4 w-48 bg-slate-200 rounded mb-4" />
                        <div className="h-2 w-full bg-slate-200 rounded-full" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            yearTimeline.sections.map((section, sIdx) => {
            const isLeft = section.side === 'left';
            const isExpanded = !!expandedSections[section.id];

            return (
              <div
                key={section.id}
                id={section.id}
                className={`relative flex w-full mb-12 flex-col scroll-mt-[310px] ${
                  isLeft
                    ? 'md:flex-row md:flex-row-reverse items-start'
                    : 'md:flex-row items-start'
                }`}
              >
                {/* Marcador Circular Central */}
                <div className="absolute left-6 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#008BC9] -translate-x-1/2 mt-1 z-10 shadow-xs" />

                {/* Lado Oposto Vazio */}
                <div className="hidden md:block md:w-1/2" />

                {/* Conteúdo do Lado Ativo */}
                <div
                  className={`w-full pl-12 flex flex-col ${
                    isLeft
                      ? 'md:pl-0 md:pr-8 md:w-1/2 md:items-end'
                      : 'md:pl-8 md:w-1/2 items-start'
                  }`}
                >
                  <span className={`text-sm font-bold text-[#008BC9] mb-3 ${isLeft ? 'md:text-right' : ''}`}>
                    {section.month}
                  </span>

                  <div className="flex flex-col gap-3 w-full max-w-md">
                    {section.events.map((ev, eIdx) => {
                      if (ev.type === 'text') {
                        return (
                          <div
                            key={eIdx}
                            className="bg-white border border-[#CBD5E1] rounded-[8px] px-4 py-3.5 text-sm font-bold text-[#1D2432] shadow-2xs hover:border-[#94CFEF] transition-colors"
                          >
                            {ev.text}
                          </div>
                        );
                      }

                      if (ev.type === 'evaluation') {
                        return (
                          <div key={eIdx} className="flex flex-col gap-3">
                            <div className="bg-white border border-[#CBD5E1] rounded-[8px] p-4 shadow-2xs hover:border-[#94CFEF] transition-all">
                              <div className="flex items-center justify-between gap-2 mb-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  {ev.expandable && (
                                    <button
                                      onClick={() => toggleExpand(section.id)}
                                      className="text-[#008BC9] hover:text-[#005580] p-0.5 rounded hover:bg-sky-50 transition-colors cursor-pointer"
                                      title={isExpanded ? 'Recolher desempenho por teste' : 'Expandir desempenho por teste'}
                                    >
                                      {isExpanded ? (
                                        <ChevronUp className="w-4 h-4 stroke-[2.5]" />
                                      ) : (
                                        <ChevronDown className="w-4 h-4 stroke-[2.5]" />
                                      )}
                                    </button>
                                  )}
                                  <Target className="w-4 h-4 text-slate-500 shrink-0" />
                                  <span className="text-xs font-medium text-[#64748B] truncate">
                                    {ev.target}
                                  </span>
                                </div>
                                {getScaleBadge(ev.scale)}
                              </div>

                              <h4 className="text-sm font-bold text-[#1D2432] mb-3 leading-snug">
                                {ev.title}
                              </h4>

                              <div className="border-b border-slate-100 my-2" />

                              <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                <span className="text-xs font-semibold text-[#1D2432]">
                                  Conceito predominante:
                                </span>
                                {getConceptBadge(ev.concept)}
                              </div>

                              {renderIndicatorBar({
                                tipo: ev.barType || 'hibrido',
                                segments: ev.segments
                              })}
                            </div>

                            {/* Sub-cards de Desempenho por Teste com linhas ramificadas tracejadas (quando expansível) */}
                            {ev.expandable && isExpanded && ev.subtests && (
                              <div className="relative pl-6 flex flex-col gap-3 mt-1">
                                <div className="absolute left-2.5 top-0 bottom-6 w-[2px] border-l-2 border-dashed border-[#5AB6E2] pointer-events-none" />

                                {ev.subtests.map((sub, sKey) => (
                                  <div
                                    key={sKey}
                                    className="relative bg-white border border-[#CBD5E1] rounded-[8px] p-4 shadow-2xs hover:border-[#94CFEF] transition-all"
                                  >
                                    <div className="absolute -left-3.5 top-6 w-3.5 border-t-2 border-dashed border-[#5AB6E2] pointer-events-none" />

                                    <div className="flex items-center justify-between gap-2 mb-2">
                                      <div className="flex items-center gap-2 text-slate-500 min-w-0">
                                        <BookOpen className="w-4 h-4 text-slate-500 shrink-0" />
                                        <span className="text-xs font-medium text-[#64748B] truncate">
                                          Desempenho no Teste {sub.id}
                                        </span>
                                      </div>
                                      {getScaleBadge(sub.scale)}
                                    </div>

                                    <h4 className="text-sm font-bold text-[#1D2432] mb-3 leading-snug">
                                      {sub.title}
                                    </h4>

                                    <div className="border-b border-slate-100 my-2" />

                                    <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
                                      <span className="text-xs font-semibold text-[#1D2432]">
                                        Conceito predominante:
                                      </span>
                                      {getConceptBadge(sub.concept)}
                                    </div>

                                    {renderIndicatorBar({
                                      tipo: sub.barType || 'hibrido',
                                      segments: sub.segments
                                    })}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        );
                      }

                      return null;
                    })}
                  </div>
                </div>
              </div>
            );
          })
          )}

          {/* 3. PONTO FINAL: no começo do ano posterior... (A Linha Termina Exatamente Aqui) */}
          <div
            id="timeline-fim"
            className="relative flex w-full flex-col md:flex-row items-start scroll-mt-[310px]"
          >
            <div className="absolute left-6 md:left-1/2 w-3.5 h-3.5 rounded-full bg-[#008BC9] -translate-x-1/2 mt-1 z-10 shadow-xs" />
            <div className="hidden md:block md:w-1/2" />
            <div className="w-full pl-12 md:pl-8 md:w-1/2 flex flex-col items-start">
              <span className="text-sm font-bold text-[#008BC9] leading-tight">
                {yearTimeline.nextYearPreview || 'no começo do ano posterior...'}
              </span>
            </div>
          </div>
        </div>

        {/* ─── BOTÕES DE NAVEGAÇÃO ENTRE ANOS (48px de altura, corner radius 4px) ─── */}
        <div className="flex items-center justify-center gap-4 flex-wrap mt-10">
          {/* Se não for o primeiro ano (2021), exibe 'Voltar ao ano anterior' */}
          {selectedYear > years[0] && (
            <button
              onClick={() => setSelectedYear(Math.max(years[0], selectedYear - 1))}
              className="h-[48px] px-6 rounded-[4px] bg-[#008BC9] hover:bg-[#0078B0] text-white text-sm font-bold shadow-xs transition-all uppercase tracking-wide inline-flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4 stroke-[2.5]" />
              <span>Voltar ao ano anterior</span>
            </button>
          )}

          {/* Se não for o último ano (2026), exibe 'Seguir para o próximo ano' */}
          {selectedYear < years[years.length - 1] && (
            <button
              onClick={() => setSelectedYear(Math.min(years[years.length - 1], selectedYear + 1))}
              className="h-[48px] px-6 rounded-[4px] bg-[#008BC9] hover:bg-[#0078B0] text-white text-sm font-bold shadow-xs transition-all uppercase tracking-wide inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Seguir para o próximo ano</span>
              <CornerUpRight className="w-4 h-4 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
