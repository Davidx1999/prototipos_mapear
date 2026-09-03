import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, HelpCircle, Loader2 } from 'lucide-react';
import { EVOLUCAO_DATA, EVOLUCAO_DATA_BY_YEAR } from './mockDataAcompanhamento';
import { BlockInfoCallout } from './TooltipCallout';

export default function EvolucaoAlunoChart({
  title = "Evolução do Estudante",
  selectedYear = '2024',
  isLoading = false,
  isLeituraAtiva: propIsLeituraAtiva,
  setIsLeituraAtiva: propSetIsLeituraAtiva,
  isMatematicaAtiva: propIsMatematicaAtiva,
  setIsMatematicaAtiva: propSetIsMatematicaAtiva
}) {
  const [periodo, setPeriodo] = useState('Semestre'); // 'Semestre' | 'Bimestre' | 'Ano'
  const [showInfoCallout, setShowInfoCallout] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [pinnedIndex, setPinnedIndex] = useState(null); // Tooltip fechada por padrão, abre no hover
  const [isComparacaoAtiva, setIsComparacaoAtiva] = useState(true);
  const [compararPor, setCompararPor] = useState('Turma');
  const [showPeriodoDropdown, setShowPeriodoDropdown] = useState(false);
  const [animationKey, setAnimationKey] = useState(0);

  // Estados locais ou controlados via props
  const [internalLeitura, setInternalLeitura] = useState(true);
  const [internalMatematica, setInternalMatematica] = useState(true);

  const isLeituraAtiva = propIsLeituraAtiva !== undefined ? propIsLeituraAtiva : internalLeitura;
  const setIsLeituraAtiva = propSetIsLeituraAtiva || setInternalLeitura;
  const isMatematicaAtiva = propIsMatematicaAtiva !== undefined ? propIsMatematicaAtiva : internalMatematica;
  const setIsMatematicaAtiva = propSetIsMatematicaAtiva || setInternalMatematica;

  const containerRef = useRef(null);

  // Escuta cliques fora do container para fechar/desafixar a tooltip
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setPinnedIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Toda vez que o gráfico é refeito (troca de período, toggle de comparação, matéria ou ano), reinicia a animação de crescimento
  useEffect(() => {
    setAnimationKey((prev) => prev + 1);
  }, [periodo, isComparacaoAtiva, isLeituraAtiva, isMatematicaAtiva, compararPor, selectedYear]);

  const yearData = EVOLUCAO_DATA_BY_YEAR[selectedYear] || EVOLUCAO_DATA_BY_YEAR['2024'] || EVOLUCAO_DATA;
  const data = yearData[periodo] || yearData.Semestre;
  const points = data;
  const activeTooltipIndex = pinnedIndex !== null ? pinnedIndex : hoveredIndex;

  // Helpers de coordenadas SVG:
  // paddingX ajustado por período para que os pontos fiquem perfeitamente centralizados sobre as legendas
  const chartHeight = 240;
  const paddingX = periodo === 'Semestre' ? 180 : periodo === 'Bimestre' ? 90 : 60;
  const paddingTop = 16;
  const paddingBottom = 16;
  const usableHeight = chartHeight - paddingTop - paddingBottom;
  const usableWidth = 1000 - paddingX * 2;
  const stepX = points.length > 1 ? usableWidth / (points.length - 1) : usableWidth / 2;

  const getY = (val) => chartHeight - paddingBottom - (val / 100) * usableHeight;
  const getPointLeftPercent = (i) => ((paddingX + i * stepX) / 1000) * 100;

  // Generate SVG path commands
  const pathLeitura = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.leitura)}`).join(' ');
  const pathLeituraTurma = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.leituraTurma)}`).join(' ');
  const pathMatematica = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.matematica)}`).join(' ');
  const pathMatematicaTurma = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.matematicaTurma)}`).join(' ');

  const activePoint = activeTooltipIndex !== null && activeTooltipIndex >= 0 && activeTooltipIndex < points.length
    ? points[activeTooltipIndex]
    : null;
  const activePointX = activePoint ? paddingX + activeTooltipIndex * stepX : 0;
  const tooltipLeftPercent = (activePointX / 1000) * 100;

  return (
    <div
      ref={containerRef}
      className="bg-white rounded-[8px] border border-slate-300 shadow-2xs flex flex-col justify-between relative h-[435px] max-h-[435px] overflow-hidden"
    >
      {/* ─── TOPO DO CARD: Título + Seletor Por + (?) ─── */}
      <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-2">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          {title}
        </h3>

        <div className="flex items-center gap-2 relative">
          <span className="text-xs font-semibold text-slate-500">Por</span>

          {/* Seletor do Período */}
          <div className="relative">
            <button
              onClick={() => setShowPeriodoDropdown(!showPeriodoDropdown)}
              className="inline-flex items-center gap-1 text-xs font-bold text-[#008BC9] hover:text-[#0078B0] transition-colors py-0.5 px-1 rounded-[4px] hover:bg-sky-50 cursor-pointer"
            >
              <span>{periodo}</span>
              <ChevronDown className="w-3 h-3 text-[#008BC9]" />
            </button>

            {showPeriodoDropdown && (
              <div className="absolute right-0 top-full mt-1 bg-white rounded-[6px] border border-slate-300 shadow-xl z-50 py-1 w-28 animate-in fade-in zoom-in-95 duration-150">
                {['Semestre', 'Bimestre', 'Ano'].map((op) => (
                  <button
                    key={op}
                    onClick={() => {
                      setPeriodo(op);
                      setPinnedIndex(null);
                      setShowPeriodoDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors cursor-pointer ${
                      periodo === op
                        ? 'bg-sky-50 font-bold text-[#008BC9]'
                        : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    {op}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Botão de Ajuda do Bloco */}
          <button
            onClick={() => setShowInfoCallout(!showInfoCallout)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
            title="Sobre o Gráfico Longitudinal"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Callout Explicativo Branco */}
          {showInfoCallout && (
            <BlockInfoCallout
              title="Gráfico Longitudinal"
              text="Exibe a evolução percentual de proficiência do estudante ao longo do tempo nas disciplinas de Leitura e Matemática."
              onClose={() => setShowInfoCallout(false)}
            />
          )}
        </div>
      </div>

      {/* ─── CORPO: LEGENDA SUPERIOR + GRÁFICO ─── */}
      <div className="p-4 pb-0 flex-1 min-h-0 flex flex-col relative justify-between">
        {/* Legenda Superior Interativa (Leitura e Matemática com Toggle e Estado Cinza) */}
        <div className="flex items-center justify-center gap-4 mb-3 text-xs font-bold select-none">
          <button
            onClick={() => {
              if (isLeituraAtiva && !isMatematicaAtiva) {
                setIsMatematicaAtiva(true);
              } else {
                setIsLeituraAtiva(!isLeituraAtiva);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all cursor-pointer ${
              isLeituraAtiva
                ? 'border-purple-300 bg-purple-50 text-[#A855F7] shadow-2xs font-bold'
                : 'border-slate-200 bg-slate-100 text-slate-400 font-medium hover:bg-slate-200/70'
            }`}
            title={isLeituraAtiva ? "Clique para desabilitar Leitura (fica cinza)" : "Clique para habilitar Leitura"}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full inline-block transition-colors ${
                isLeituraAtiva ? 'bg-[#A855F7] ring-2 ring-purple-200' : 'bg-slate-400'
              }`}
            />
            <span>Leitura</span>
          </button>

          <button
            onClick={() => {
              if (isMatematicaAtiva && !isLeituraAtiva) {
                setIsLeituraAtiva(true);
              } else {
                setIsMatematicaAtiva(!isMatematicaAtiva);
              }
            }}
            className={`flex items-center gap-2 px-3 py-1 rounded-full border transition-all cursor-pointer ${
              isMatematicaAtiva
                ? 'border-amber-300 bg-amber-50 text-[#F59E0B] shadow-2xs font-bold'
                : 'border-slate-200 bg-slate-100 text-slate-400 font-medium hover:bg-slate-200/70'
            }`}
            title={isMatematicaAtiva ? "Clique para desabilitar Matemática (fica cinza)" : "Clique para habilitar Matemática"}
          >
            <span
              className={`w-2.5 h-2.5 rounded-full inline-block transition-colors ${
                isMatematicaAtiva ? 'bg-[#F59E0B] ring-2 ring-amber-200' : 'bg-slate-400'
              }`}
            />
            <span>Matemática</span>
          </button>
        </div>

        {/* Área do Gráfico SVG */}
        <div className="relative w-full h-[240px] mt-2 select-none">
          {/* Overlay de Loading com Spinner e Blur */}
          {isLoading && (
            <div className="absolute inset-0 bg-white/75 backdrop-blur-[1.5px] flex flex-col items-center justify-center z-30 transition-all rounded-[6px]">
              <Loader2 className="w-8 h-8 text-[#008BC9] animate-spin mb-2" />
              <span className="text-xs font-semibold text-slate-600 animate-pulse">
                Carregando evolução do estudante...
              </span>
            </div>
          )}

          {/* Eixo Y com Linhas Horizontais */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            {[100, 80, 60, 40, 20, 0].map((level) => (
              <div key={level} className="flex items-center w-full">
                <span className="w-12 text-sm text-[#7F8795] font-medium text-right pr-2.5 shrink-0">
                  {level}%
                </span>
                <div className="flex-1 border-b border-slate-100" />
              </div>
            ))}
          </div>

          {/* SVG com as Linhas e Pontos */}
          <svg
            className="absolute left-12 right-0 top-0 w-[calc(100%-3rem)] h-[calc(100%-1.5rem)] overflow-visible"
            viewBox="0 0 1000 240"
            preserveAspectRatio="none"
          >
            {/* Definição de ClipPath animado para crescimento da esquerda para a direita */}
            <defs>
              <clipPath id={`growClip-${animationKey}`}>
                <rect x="0" y="0" width="1000" height="240">
                  <animate
                    attributeName="width"
                    from="0"
                    to="1000"
                    dur="0.8s"
                    fill="freeze"
                    calcMode="spline"
                    keySplines="0.25 0.1 0.25 1"
                  />
                </rect>
              </clipPath>
            </defs>

            {/* Grupo com a animação de crescimento aplicada a todas as linhas (aluno e comparação) */}
            <g clipPath={`url(#growClip-${animationKey})`}>
              {/* Linhas Comparativas da Turma (Tracejadas) */}
              {isComparacaoAtiva && (
                <>
                  <path
                    d={pathLeituraTurma}
                    fill="none"
                    stroke={isLeituraAtiva ? "#D8B4FE" : "#E2E8F0"}
                    strokeWidth={isLeituraAtiva ? "2" : "1"}
                    strokeDasharray={isLeituraAtiva ? "5 5" : "3 3"}
                    opacity={isLeituraAtiva ? 1 : 0.4}
                  />
                  <path
                    d={pathMatematicaTurma}
                    fill="none"
                    stroke={isMatematicaAtiva ? "#FCD34D" : "#E2E8F0"}
                    strokeWidth={isMatematicaAtiva ? "2" : "1"}
                    strokeDasharray={isMatematicaAtiva ? "5 5" : "3 3"}
                    opacity={isMatematicaAtiva ? 1 : 0.4}
                  />
                </>
              )}

              {/* Linhas Principais do Aluno */}
              <path
                d={pathLeitura}
                fill="none"
                stroke={isLeituraAtiva ? "#A855F7" : "#CBD5E1"}
                strokeWidth={isLeituraAtiva ? "2.5" : "1.5"}
                strokeDasharray={isLeituraAtiva ? "none" : "4 4"}
                opacity={isLeituraAtiva ? 1 : 0.45}
              />
              <path
                d={pathMatematica}
                fill="none"
                stroke={isMatematicaAtiva ? "#F59E0B" : "#CBD5E1"}
                strokeWidth={isMatematicaAtiva ? "2.5" : "1.5"}
                strokeDasharray={isMatematicaAtiva ? "none" : "4 4"}
                opacity={isMatematicaAtiva ? 1 : 0.45}
              />
            </g>

            {/* Pontos Clicáveis / Interativos */}
            {points.map((p, i) => {
              const cx = paddingX + i * stepX;
              const cyLeitura = getY(p.leitura);
              const cyMatematica = getY(p.matematica);
              const isSelected = activeTooltipIndex === i;

              return (
                <g
                  key={i}
                  className="cursor-pointer"
                  onMouseEnter={() => setHoveredIndex(i)}
                  onMouseLeave={() => setHoveredIndex(null)}
                  onClick={(e) => {
                    e.stopPropagation();
                    setPinnedIndex(pinnedIndex === i ? null : i);
                  }}
                >
                  {/* Área invisível de captura de mouse mais larga */}
                  <rect
                    x={cx - (stepX / 2)}
                    y="0"
                    width={stepX}
                    height={chartHeight}
                    fill="transparent"
                  />

                  {/* Linha vertical indicadora sutil */}
                  {isSelected && (
                    <line
                      x1={cx}
                      y1="0"
                      x2={cx}
                      y2={chartHeight}
                      stroke="#94A3B8"
                      strokeWidth="1.5"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Nó Leitura */}
                  <circle
                    cx={cx}
                    cy={cyLeitura}
                    r={!isLeituraAtiva ? "3.5" : isSelected ? "6" : "4.5"}
                    fill={!isLeituraAtiva ? "#CBD5E1" : isSelected ? "white" : "#A855F7"}
                    stroke={isLeituraAtiva ? "#A855F7" : "none"}
                    strokeWidth={isLeituraAtiva && isSelected ? "2.5" : "0"}
                    opacity={isLeituraAtiva ? 1 : 0.45}
                    className="transition-all duration-200"
                  />

                  {/* Nó Matemática */}
                  <circle
                    cx={cx}
                    cy={cyMatematica}
                    r={!isMatematicaAtiva ? "3.5" : isSelected ? "6" : "4.5"}
                    fill={!isMatematicaAtiva ? "#CBD5E1" : isSelected ? "white" : "#F59E0B"}
                    stroke={isMatematicaAtiva ? "#F59E0B" : "none"}
                    strokeWidth={isMatematicaAtiva && isSelected ? "2.5" : "0"}
                    opacity={isMatematicaAtiva ? 1 : 0.45}
                    className="transition-all duration-200"
                  />
                </g>
              );
            })}
          </svg>

          {/* ─── TOOLTIP ESCURO FLUTUANTE SOBRE O PONTO ATIVO ─── */}
          {activePoint && (
            <div
              className="absolute z-30 pointer-events-none transition-all duration-150"
              style={{
                left: `${tooltipLeftPercent}%`,
                top: '25%',
                transform:
                  activeTooltipIndex === 0
                    ? 'translate(8px, -50%)'
                    : activeTooltipIndex === points.length - 1
                    ? 'translate(calc(-100% - 8px), -50%)'
                    : 'translate(-50%, -50%)'
              }}
            >
              <div className="bg-[#1D2432] text-white rounded-lg p-2.5 shadow-2xl min-w-[170px] text-left border border-slate-700/80">
                {/* Título do Tooltip */}
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 text-center pb-1.5 mb-1.5 border-b border-slate-700/60">
                  {activePoint.shortLabel}
                </div>

                {/* Leitura */}
                <div className={`mb-1.5 transition-opacity ${!isLeituraAtiva ? 'opacity-40' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isLeituraAtiva ? 'bg-[#A855F7]' : 'bg-slate-400'}`} />
                      <span className="text-[10px] text-slate-300 font-medium">Leitura:</span>
                    </div>
                    <span className="text-[11px] font-bold text-white">
                      {activePoint.leitura.toFixed(2).replace('.', ',')}%
                    </span>
                  </div>
                  {isComparacaoAtiva && (
                    <div className="text-[9px] text-slate-400 pl-3.5 flex items-center justify-between">
                      <span className="opacity-80">--- {compararPor}:</span>
                      <span>{activePoint.leituraTurma.toFixed(2).replace('.', ',')}%</span>
                    </div>
                  )}
                </div>

                {/* Matemática */}
                <div className={`transition-opacity ${!isMatematicaAtiva ? 'opacity-40' : 'opacity-100'}`}>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className={`w-2 h-2 rounded-full shrink-0 ${isMatematicaAtiva ? 'bg-[#F59E0B]' : 'bg-slate-400'}`} />
                      <span className="text-[10px] text-slate-300 font-medium">Matemática:</span>
                    </div>
                    <span className="text-[11px] font-bold text-white">
                      {activePoint.matematica.toFixed(2).replace('.', ',')}%
                    </span>
                  </div>
                  {isComparacaoAtiva && (
                    <div className="text-[9px] text-slate-400 pl-3.5 flex items-center justify-between">
                      <span className="opacity-80">--- {compararPor}:</span>
                      <span>{activePoint.matematicaTurma.toFixed(2).replace('.', ',')}%</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Eixo X: Rótulos dos Períodos com alinhamento rigoroso no centro dos pontos */}
        <div className="relative w-full h-7 mt-2 mb-4 select-none pl-12">
          <div className="relative w-full h-full">
            {points.map((p, idx) => {
              const leftPercent = getPointLeftPercent(idx);
              const isSelected = activeTooltipIndex === idx;

              return (
                <div
                  key={idx}
                  className="absolute top-0.5 -translate-x-1/2 text-center pointer-events-auto"
                  style={{ left: `${leftPercent}%` }}
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setPinnedIndex(pinnedIndex === idx ? null : idx);
                    }}
                    onMouseEnter={() => setHoveredIndex(idx)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className={`transition-colors whitespace-nowrap text-[11px] font-bold cursor-pointer ${
                      isSelected ? 'text-[#008BC9] font-extrabold' : 'text-slate-600 hover:text-[#008BC9]'
                    }`}
                  >
                    {p.label}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ─── RODAPÉ DO CARD: Legenda de Média + Toggle Comparação ─── */}
      <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50 rounded-b-lg flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        {/* Legenda de Traço */}
        <div className="flex items-center gap-4 text-slate-600 font-medium text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-3.5 h-0.5 bg-slate-400 inline-block" />
            <span className="w-1.5 h-1.5 rounded-full border border-slate-400 -ml-2 inline-block bg-white" />
            <span className="ml-0.5">Média do Aluno</span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="w-4 h-0.5 border-t border-dashed border-slate-400 inline-block" />
            <span>Média Comparativa</span>
          </div>
        </div>

        {/* Toggle de Comparação */}
        <div className="flex items-center gap-2.5">
          <label className="inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              checked={isComparacaoAtiva}
              onChange={(e) => setIsComparacaoAtiva(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#008BC9]"></div>
            <span className="text-xs font-semibold text-slate-700">
              Ativar comparação por
            </span>
          </label>

          {/* Seletor Turma / Escola / Rede */}
          <div className="relative">
            <select
              value={compararPor}
              onChange={(e) => setCompararPor(e.target.value)}
              disabled={!isComparacaoAtiva}
              className="text-xs font-bold text-[#008BC9] bg-transparent border-none py-1 pr-6 focus:outline-none cursor-pointer disabled:opacity-50"
            >
              <option value="Turma">Turma</option>
              <option value="Escola">Escola</option>
              <option value="Rede">Rede</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );
}
