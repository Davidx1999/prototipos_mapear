import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { X, ChevronDown, HelpCircle, Loader2 } from 'lucide-react';

const MOCK_HISTORICO_ANOS = [
  { ano: '2016', aluno: 17, turma: 10 },
  { ano: '2017', aluno: 52, turma: 20 },
  { ano: '2018', aluno: 23, turma: 32 },
  { ano: '2019', aluno: 84, turma: 78 },
  { ano: '2020', aluno: 51, turma: 60 },
  { ano: '2021', aluno: 80, turma: 55 },
  { ano: '2022', aluno: 33, turma: 63 },
  { ano: '2023', aluno: 74, turma: 53 },
  { ano: '2024', aluno: 98, turma: 96 },
  { ano: '2025', aluno: 54, turma: 74 },
];

export default function HistoricoPercentualAcertoModal({
  isOpen,
  onClose,
  dominio,
  selectedYear = '2024',
  tipoDominio = 'Repertório'
}) {
  const [periodo, setPeriodo] = useState('Semestre');
  const [showPeriodoDropdown, setShowPeriodoDropdown] = useState(false);
  const [showHelpTooltip, setShowHelpTooltip] = useState(false);
  const [isComparacaoAtiva, setIsComparacaoAtiva] = useState(true);
  const [compararPor, setCompararPor] = useState('Turma');
  const [hoveredPointIndex, setHoveredPointIndex] = useState(1);
  const [isModalLoading, setIsModalLoading] = useState(true);

  const modalRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      setIsModalLoading(true);
      const timer = setTimeout(() => {
        setIsModalLoading(false);
      }, 350);
      return () => clearTimeout(timer);
    }
  }, [isOpen, dominio, selectedYear]);

  // Fecha com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !dominio) return null;

  const endYear = selectedYear === 'Todos' ? 2026 : Number(selectedYear);
  const startYear = Math.max(2017, endYear - 7);
  const yearsRange = [];
  for (let y = startYear; y <= endYear; y++) {
    yearsRange.push(y);
  }

  const baseScore = dominio.score || 70;
  const data = yearsRange.map((yr, idx) => {
    if (yr === endYear) {
      return {
        ano: String(yr),
        aluno: baseScore,
        turma: Math.min(100, Math.max(20, Math.round(baseScore * 0.92)))
      };
    }
    const diff = (yearsRange.length - 1 - idx) * 4.2;
    const seed = (dominio.nome.charCodeAt(idx % dominio.nome.length) * 17 + yr * 13) % 19 - 9;
    const alunoVal = Math.min(99, Math.max(20, Math.round(baseScore - diff + seed)));
    const turmaVal = Math.min(95, Math.max(25, Math.round(alunoVal * 0.88 + seed * 0.5)));
    return {
      ano: String(yr),
      aluno: alunoVal,
      turma: turmaVal
    };
  });

  const isLeitura = dominio.materia === 'Leitura';
  const subHeader = tipoDominio === 'Cognitivo'
    ? (dominio.materia ? `Cognitivo · ${dominio.materia}` : 'Cognitivo')
    : (dominio.materia || 'Matemática');

  // Cores do gráfico de acordo com Leitura (roxo) ou Matemática (âmbar/laranja)
  const colorAluno = isLeitura ? '#A855F7' : '#F8A766';
  const colorTurma = isLeitura ? '#C084FC' : '#E58B24';
  const pointFillIdle = isLeitura ? '#E9D5FF' : '#FCD8BA';

  // Métricas do Topo
  const mediaGeralNum = Number((data.reduce((acc, curr) => acc + curr.aluno, 0) / data.length).toFixed(1));
  const mediaGeralStr = mediaGeralNum.toString().replace('.', ',');
  const valorAtual = baseScore;

  let maiorPonto = data[0];
  let menorPonto = data[0];
  data.forEach((p) => {
    if (p.aluno > maiorPonto.aluno) maiorPonto = p;
    if (p.aluno < menorPonto.aluno) menorPonto = p;
  });

  // Coordenadas SVG
  const chartHeight = 260;
  const paddingX = 45;
  const paddingTop = 28;
  const paddingBottom = 22;
  const usableHeight = chartHeight - paddingTop - paddingBottom;
  const usableWidth = 1000 - paddingX * 2;
  const stepX = usableWidth / (data.length - 1);

  const getY = (val) => chartHeight - paddingBottom - (val / 100) * usableHeight;

  const pathAluno = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.aluno)}`).join(' ');
  const pathTurma = data.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.turma)}`).join(' ');

  const yMedia = getY(mediaGeralNum);

  const activePoint = hoveredPointIndex !== null ? data[hoveredPointIndex] : null;
  const activeX = hoveredPointIndex !== null ? paddingX + hoveredPointIndex * stepX : 0;
  const activeLeftPct = (activeX / 1000) * 100;

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] w-screen h-screen bg-[#1D2432]/60 flex items-center justify-center p-4 md:p-8 select-none animate-fade-in"
      style={{
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)'
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={modalRef}
        className="bg-white rounded-[8px] shadow-2xl w-full max-w-5xl lg:max-w-[1120px] border border-slate-200 flex flex-col overflow-hidden animate-scale-up"
        style={{ fontFamily: 'Montserrat, sans-serif' }}
      >
        {/* ─── 1. HEADER DO MODAL (Corner Radius 8px no container pai) ─── */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <h2 className="text-base md:text-lg font-bold text-[#1D2432]">
            Histórico do Percentual de Acerto
          </h2>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 hover:bg-slate-100 p-1.5 rounded-full transition-colors"
            title="Fechar"
          >
            <X className="w-5 h-5 stroke-[2]" />
          </button>
        </div>

        {/* ─── 2. SUBHEADER: DOMÍNIO + SELETOR DE PERÍODO + HELP (?) ─── */}
        <div className="px-6 pt-4 pb-3 flex items-center justify-between flex-wrap gap-4 border-b border-slate-100">
          <div className="text-sm font-semibold text-[#1D2432]">
            {dominio.nome} · {subHeader}
          </div>

          <div className="flex items-center gap-3 relative">
            <span className="text-xs font-semibold text-slate-500">Por</span>

            {/* Dropdown Período */}
            <div className="relative">
              <button
                onClick={() => setShowPeriodoDropdown(!showPeriodoDropdown)}
                className="text-sm font-bold text-[#008BC9] flex items-center gap-1 hover:text-[#005580] transition-colors py-0.5"
              >
                <span>{periodo}</span>
                <ChevronDown className="w-4 h-4 stroke-[2.5]" />
              </button>

              {showPeriodoDropdown && (
                <div className="absolute right-0 top-full mt-1 bg-white border border-slate-200 rounded-[6px] shadow-lg z-20 py-1 min-w-[120px] text-xs font-semibold text-slate-700">
                  {['Semestre', 'Bimestre', 'Ano'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => {
                        setPeriodo(opt);
                        setShowPeriodoDropdown(false);
                      }}
                      className="w-full text-left px-3 py-1.5 hover:bg-sky-50 hover:text-[#008BC9] transition-colors"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Botão de Ajuda (?) com Tooltip */}
            <div className="relative">
              <button
                onMouseEnter={() => setShowHelpTooltip(true)}
                onMouseLeave={() => setShowHelpTooltip(false)}
                onClick={() => setShowHelpTooltip(!showHelpTooltip)}
                className="text-slate-500 hover:text-slate-800 transition-colors p-0.5 rounded-full"
                title="Informações"
              >
                <HelpCircle className="w-4 h-4 stroke-[2]" />
              </button>

              {showHelpTooltip && (
                <div className="absolute right-0 top-full mt-2 w-72 bg-[#1D2432] text-white text-xs p-3 rounded-md shadow-xl z-30 pointer-events-none leading-relaxed border border-slate-700">
                  Média do aluno por Domínios de Repertório nas avaliações em que participou.
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ─── 3. CARDS DE MÉTRICAS RESUMO (OU SKELETON) ─── */}
        {isModalLoading ? (
          <div className="px-6 py-3 border-b border-slate-100 bg-white grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col px-4 animate-pulse">
                <div className="h-3 w-14 bg-slate-200 rounded mb-1.5" />
                <div className="h-7 w-20 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="px-6 py-3 border-b border-slate-100 bg-white grid grid-cols-2 sm:grid-cols-4 divide-x divide-slate-100">
            {/* Média */}
            <div className="flex flex-col pr-4">
              <span className="text-xs font-medium text-slate-500 mb-0.5">Média</span>
              <span className="text-2xl font-bold text-[#1D2432] tracking-tight">{mediaGeralStr}%</span>
            </div>

            {/* Atual */}
            <div className="flex flex-col px-4">
              <span className="text-xs font-medium text-slate-500 mb-0.5">Atual</span>
              <span className="text-2xl font-bold text-[#1D2432] tracking-tight">{valorAtual}%</span>
            </div>

            {/* Maior Valor */}
            <div className="flex flex-col px-4">
              <span className="text-xs font-medium text-slate-500 mb-0.5">Maior Valor</span>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-[#1D2432] tracking-tight">{maiorPonto.aluno}%</span>
                <span className="text-xs font-normal text-slate-500 ml-1.5">({maiorPonto.ano})</span>
              </div>
            </div>

            {/* Menor Valor */}
            <div className="flex flex-col pl-4">
              <span className="text-xs font-medium text-slate-500 mb-0.5">Menor Valor</span>
              <div className="flex items-baseline">
                <span className="text-2xl font-bold text-[#1D2432] tracking-tight">{menorPonto.aluno}%</span>
                <span className="text-xs font-normal text-slate-500 ml-1.5">({menorPonto.ano})</span>
              </div>
            </div>
          </div>
        )}

        {/* ─── 4. ÁREA DO GRÁFICO COM LINHA DE MÉDIA E VALORES SOBRE OS PONTOS ─── */}
        <div className="px-6 py-5 relative">
          {/* Overlay de Loading com Spinner e Blur */}
          {isModalLoading && (
            <div className="absolute inset-0 bg-white/80 backdrop-blur-[1.5px] flex flex-col items-center justify-center z-30 transition-all rounded-[8px]">
              <Loader2 className="w-8 h-8 text-[#008BC9] animate-spin mb-2" />
              <span className="text-xs font-semibold text-slate-600 animate-pulse">
                Carregando histórico do domínio...
              </span>
            </div>
          )}

          <div className="relative w-full h-[260px]">
            {/* Linhas de Grade Horizontais e Eixo Y: 100, 75, 50, 25, 0 */}
            <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-4">
              {[100, 75, 50, 25, 0].map((val) => (
                <div key={val} className="flex items-center w-full">
                  <span className="w-8 text-[11px] text-slate-600 font-medium pr-2 shrink-0 text-right">
                    {val}
                  </span>
                  <div className="flex-1 border-b border-slate-200/80" />
                </div>
              ))}
            </div>

            {/* Badge da Média [ 56,6% ] e Linha Pontilhada Horizontal com Seta */}
            <div
              className="absolute left-1 flex items-center w-[calc(100%-0.25rem)] pointer-events-none z-10"
              style={{ top: `${(yMedia / chartHeight) * 100}%`, transform: 'translateY(-50%)' }}
            >
              <span className="bg-[#1D2432] text-white text-[10px] font-bold px-1.5 py-0.5 rounded-[4px] shadow-xs shrink-0">
                56,6%
              </span>
              <div className="flex-1 border-b border-dashed border-slate-400 ml-1 relative">
                {/* Marcador de seta na ponta direita */}
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-0 h-0 border-y-[3px] border-y-transparent border-l-[5px] border-l-slate-400" />
              </div>
            </div>

            {/* SVG com Linhas, Valores e Pontos */}
            <svg
              className="absolute left-8 right-2 top-0 w-[calc(100%-2.5rem)] h-full overflow-visible"
              viewBox="0 0 1000 260"
              preserveAspectRatio="none"
            >
              {/* Linha Comparativa Tracejada da Turma */}
              {isComparacaoAtiva && (
                <path
                  d={pathTurma}
                  fill="none"
                  stroke={colorTurma}
                  strokeWidth="2"
                  strokeDasharray="6 6"
                />
              )}

              {/* Linha Contínua do Aluno */}
              <path
                d={pathAluno}
                fill="none"
                stroke={colorAluno}
                strokeWidth="2.5"
              />

              {/* Rótulos de Porcentagem Acima dos Pontos */}
              {data.map((p, i) => {
                const cx = paddingX + i * stepX;
                const cy = getY(p.aluno);
                // No ponto 2017, a tooltip já mostra o valor
                return (
                  <text
                    key={`label-${i}`}
                    x={cx}
                    y={cy - 9}
                    textAnchor="middle"
                    fill="#64748B"
                    fontSize="11"
                    fontWeight="600"
                    className="pointer-events-none select-none"
                  >
                    {p.aluno}%
                  </text>
                );
              })}

              {/* Pontos Clicáveis / Hover */}
              {data.map((p, i) => {
                const cx = paddingX + i * stepX;
                const cy = getY(p.aluno);
                const isSelected = hoveredPointIndex === i;

                return (
                  <g
                    key={i}
                    className="cursor-pointer"
                    onMouseEnter={() => setHoveredPointIndex(i)}
                    onMouseLeave={() => setHoveredPointIndex(null)}
                  >
                    {/* Área ampla de clique/hover */}
                    <rect
                      x={cx - stepX / 2}
                      y="0"
                      width={stepX}
                      height={chartHeight}
                      fill="transparent"
                    />

                    {/* Ponto Circular Estilizado */}
                    <circle
                      cx={cx}
                      cy={cy}
                      r={isSelected ? 6.5 : 5}
                      fill={isSelected ? '#FFFFFF' : pointFillIdle}
                      stroke={colorAluno}
                      strokeWidth={isSelected ? 3 : 2}
                      className="transition-all"
                    />
                  </g>
                );
              })}
            </svg>

            {/* Tooltip Flutuante Escura (Conforme o print) */}
            {activePoint && (
              <div
                className="absolute z-30 pointer-events-none transition-all duration-150"
                style={{
                  left: `calc(${activeLeftPct}% + 2rem)`,
                  top: '28%',
                  transform:
                    hoveredPointIndex === 0
                      ? 'translate(8px, -50%)'
                      : hoveredPointIndex === data.length - 1
                      ? 'translate(calc(-100% - 8px), -50%)'
                      : 'translate(-50%, -50%)'
                }}
              >
                <div className="bg-[#1D2432] text-white p-2.5 rounded-lg shadow-xl text-xs min-w-[145px] border border-slate-700">
                  <div className="font-bold text-center text-slate-300 pb-1 mb-1.5 border-b border-slate-700/80 text-[11px]">
                    {activePoint.ano}
                  </div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: colorAluno }}
                    />
                    <span className="text-slate-300 text-[11px]">Nota do Aluno:</span>
                    <span className="font-bold text-white ml-auto text-[11px]">{activePoint.aluno}%</span>
                  </div>
                  {isComparacaoAtiva && (
                    <div className="flex items-center gap-1.5 text-slate-400 text-[10px]">
                      <span>Nota da {compararPor}:</span>
                      <span className="font-bold text-slate-200 ml-auto">{activePoint.turma}%</span>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Eixo X: Anos com marcadores de traço */}
          <div className="relative w-full h-6 mt-1 select-none pl-8 pr-2">
            <div className="relative w-full h-full border-t border-slate-300">
              {data.map((p, idx) => {
                const leftPct = ((paddingX + idx * stepX) / 1000) * 100;
                return (
                  <div
                    key={p.ano}
                    className="absolute -translate-x-1/2 flex flex-col items-center"
                    style={{ left: `${leftPct}%`, top: '-1px' }}
                  >
                    {/* Tick mark */}
                    <div className="w-[1px] h-1.5 bg-slate-400" />
                    {/* Ano */}
                    <span className="text-[11px] font-medium text-slate-600 mt-1">
                      {p.ano}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ─── 5. FOOTER: LEGENDA + TOGGLE DE COMPARAÇÃO ─── */}
        <div className="px-6 py-3 border-t border-slate-200 bg-slate-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          {/* Legendas */}
          <div className="flex items-center gap-5 text-slate-600 font-medium text-[11px]">
            <div className="flex items-center gap-1.5">
              <span
                className="w-3.5 h-0.5 inline-block"
                style={{ backgroundColor: colorAluno }}
              />
              <span
                className="w-1.5 h-1.5 rounded-full border -ml-2 inline-block bg-white"
                style={{ borderColor: colorAluno }}
              />
              <span className="ml-0.5">Média do Aluno</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span
                className="w-4 h-0.5 border-t border-dashed inline-block"
                style={{ borderColor: colorTurma }}
              />
              <span>Média Comparativa</span>
            </div>
          </div>

          {/* Toggle de Comparação */}
          <div className="flex items-center gap-2.5 self-end sm:self-auto">
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
                className="text-xs font-bold text-[#008BC9] bg-transparent border-none py-1 pr-5 focus:outline-none cursor-pointer disabled:opacity-50"
              >
                <option value="Turma">Turma</option>
                <option value="Escola">Escola</option>
                <option value="Rede">Rede</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
}
