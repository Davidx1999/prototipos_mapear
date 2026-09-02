import React, { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { EVOLUCAO_DATA } from './mockDataAcompanhamento';
import { BlockInfoCallout } from './TooltipCallout';

export default function EvolucaoAlunoChart({ title = "Evolução do Estudante" }) {
  const [periodo, setPeriodo] = useState('Semestre'); // 'Semestre' | 'Bimestre' | 'Ano'
  const [showInfoCallout, setShowInfoCallout] = useState(false);
  const [activeTooltipIndex, setActiveTooltipIndex] = useState(1); // Default to last point to show tooltip like screenshots
  const [isComparacaoAtiva, setIsComparacaoAtiva] = useState(true);
  const [compararPor, setCompararPor] = useState('Turma');
  const [showPeriodoDropdown, setShowPeriodoDropdown] = useState(false);

  const points = EVOLUCAO_DATA[periodo] || EVOLUCAO_DATA.Semestre;

  // Helpers to calculate SVG coordinates (viewBox 0 0 1000 320)
  const chartHeight = 240;
  const paddingX = 140;
  const usableWidth = 1000 - paddingX * 2;
  const stepX = points.length > 1 ? usableWidth / (points.length - 1) : usableWidth / 2;

  const getY = (val) => {
    // 0% at bottom (chartHeight = 240), 100% at top (0)
    return chartHeight - (val / 100) * chartHeight;
  };

  // Generate SVG path commands
  const pathLeitura = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.leitura)}`).join(' ');
  const pathLeituraTurma = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.leituraTurma)}`).join(' ');
  const pathMatematica = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.matematica)}`).join(' ');
  const pathMatematicaTurma = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${paddingX + i * stepX} ${getY(p.matematicaTurma)}`).join(' ');

  const activePoint = points[activeTooltipIndex] || points[points.length - 1];
  const activePointX = paddingX + (activeTooltipIndex >= 0 ? activeTooltipIndex : points.length - 1) * stepX;
  const tooltipLeftPercent = (activePointX / 1000) * 100;

  return (
    <div className="bg-white rounded-[8px] border border-slate-300 shadow-2xs flex flex-col justify-between relative">
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
              className="inline-flex items-center gap-1 text-xs font-bold text-[#008BC9] hover:text-[#0078B0] transition-colors py-0.5 px-1 rounded-[4px] hover:bg-sky-50"
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
                      setActiveTooltipIndex(op === 'Semestre' ? 1 : 1);
                      setShowPeriodoDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 text-xs transition-colors ${
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
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
            title="Sobre o Gráfico Longitudinal"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {/* Callout Explicativo Branco */}
          {showInfoCallout && (
            <BlockInfoCallout
              title="Gráfico Longitudinal do Aluno"
              text="As linhas do gráfico mostram a evolução do aluno ao longo dos anos, permitindo compará-la com a média da turma e por área do conhecimento."
              onClose={() => setShowInfoCallout(false)}
            />
          )}
        </div>
      </div>

      {/* ─── CORPO: LEGENDA SUPERIOR + GRÁFICO ─── */}
      <div className="p-4 flex-1 flex flex-col relative min-h-[300px]">
        {/* Legenda Superior (Leitura e Matemática) */}
        <div className="flex items-center justify-center gap-6 mb-3 text-xs font-bold">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#A855F7] ring-2 ring-purple-100 inline-block" />
            <span className="text-[#A855F7]">Leitura</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-amber-100 inline-block" />
            <span className="text-[#F59E0B]">Matemática</span>
          </div>
        </div>

        {/* Área do Gráfico SVG */}
        <div className="relative w-full h-[240px] mt-2 select-none">
          {/* Eixo Y com Linhas Horizontais */}
          <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
            {[100, 80, 60, 40, 20, 0].map((level) => (
              <div key={level} className="flex items-center w-full">
                <span className="w-8 text-[10px] text-slate-400 text-right pr-2 shrink-0">
                  {level}%
                </span>
                <div className="flex-1 border-b border-slate-100" />
              </div>
            ))}
          </div>

          {/* SVG com as Linhas e Pontos */}
          <svg
            className="absolute left-8 right-0 top-0 w-[calc(100%-2rem)] h-[calc(100%-1.5rem)] overflow-visible"
            viewBox="0 0 1000 240"
            preserveAspectRatio="none"
          >
            {/* Linhas Comparativas da Turma (Tracejadas) */}
            {isComparacaoAtiva && (
              <>
                <path
                  d={pathLeituraTurma}
                  fill="none"
                  stroke="#D8B4FE"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
                <path
                  d={pathMatematicaTurma}
                  fill="none"
                  stroke="#FCD34D"
                  strokeWidth="2"
                  strokeDasharray="5 5"
                />
              </>
            )}

            {/* Linhas Principais do Aluno (Contínuas) */}
            <path
              d={pathLeitura}
              fill="none"
              stroke="#A855F7"
              strokeWidth="2.5"
            />
            <path
              d={pathMatematica}
              fill="none"
              stroke="#F59E0B"
              strokeWidth="2.5"
            />

            {/* Pontos Clicáveis / Interativos */}
            {points.map((p, i) => {
              const cx = paddingX + i * stepX;
              const cyLeitura = getY(p.leitura);
              const cyMatematica = getY(p.matematica);
              const isSelected = activeTooltipIndex === i;

              return (
                <g key={i} className="cursor-pointer" onClick={() => setActiveTooltipIndex(i)}>
                  {/* Linha vertical indicadora sutil */}
                  {isSelected && (
                    <line
                      x1={cx}
                      y1="0"
                      x2={cx}
                      y2={chartHeight}
                      stroke="#94A3B8"
                      strokeWidth="1"
                      strokeDasharray="3 3"
                    />
                  )}

                  {/* Nó Leitura */}
                  <circle
                    cx={cx}
                    cy={cyLeitura}
                    r={isSelected ? "5.5" : "4.5"}
                    fill="white"
                    stroke="#A855F7"
                    strokeWidth="2.5"
                    className="transition-all hover:scale-125"
                  />

                  {/* Nó Matemática */}
                  <circle
                    cx={cx}
                    cy={cyMatematica}
                    r={isSelected ? "5.5" : "4.5"}
                    fill="white"
                    stroke="#F59E0B"
                    strokeWidth="2.5"
                    className="transition-all hover:scale-125"
                  />
                </g>
              );
            })}
          </svg>

          {/* ─── TOOLTIP ESCURO FLUTUANTE SOBRE O PONTO ATIVO (Conforme Imagens 1, 2, 3) ─── */}
          {activePoint && (
            <div
              className="absolute z-30 pointer-events-none transition-all duration-200"
              style={{
                left: `${tooltipLeftPercent}%`,
                top: '25%',
                transform: 'translate(-50%, -50%)'
              }}
            >
              <div className="bg-[#1D2432] text-white rounded-lg p-2.5 shadow-2xl min-w-[170px] text-left border border-slate-700/80">
                {/* Título do Tooltip */}
                <div className="text-[10px] font-extrabold uppercase tracking-wider text-slate-300 text-center pb-1.5 mb-1.5 border-b border-slate-700/60">
                  {activePoint.shortLabel}
                </div>

                {/* Leitura */}
                <div className="mb-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#A855F7] shrink-0" />
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
                <div>
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-[#F59E0B] shrink-0" />
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

        {/* Eixo X: Rótulos dos Períodos */}
        <div className="flex items-center justify-between pl-12 pr-4 mt-2 text-[11px] font-bold text-slate-700 select-none">
          {points.map((p, idx) => (
            <button
              key={idx}
              onClick={() => setActiveTooltipIndex(idx)}
              className={`transition-colors text-center hover:text-[#008BC9] ${
                activeTooltipIndex === idx ? 'text-[#008BC9] font-extrabold' : 'text-slate-600'
              }`}
            >
              {p.label}
            </button>
          ))}
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

        {/* Toggle Comparação + Seletor */}
        <div className="flex items-center gap-2.5 self-end sm:self-auto">
          {/* Switch Toggle */}
          <label className="inline-flex items-center cursor-pointer gap-2">
            <input
              type="checkbox"
              checked={isComparacaoAtiva}
              onChange={(e) => setIsComparacaoAtiva(e.target.checked)}
              className="sr-only peer"
            />
            <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#489EEA]"></div>
            <span className="text-xs font-semibold text-slate-700">
              Ativar comparação por
            </span>
          </label>

          {/* Seletor Turma */}
          <div className="relative">
            <select
              value={compararPor}
              onChange={(e) => setCompararPor(e.target.value)}
              disabled={!isComparacaoAtiva}
              className="text-xs font-bold text-slate-800 bg-white border border-slate-300 rounded-[4px] px-2 py-1 pr-6 focus:outline-none focus:ring-1 focus:ring-[#489EEA] cursor-pointer disabled:opacity-50"
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
