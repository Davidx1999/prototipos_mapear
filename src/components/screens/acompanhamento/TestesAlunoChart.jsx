import React, { useState } from 'react';
import { Loader2 } from 'lucide-react';
import { TESTS_DATA_STANDARD, TESTS_DATA_EXTENDED, TESTS_DATA_BY_YEAR } from './mockDataAcompanhamento';

export default function TestesAlunoChart({
  title = "Testes do Estudante",
  subtitle = "",
  selectedYear = '2024',
  isLoading = false,
  extendedMode = false
}) {
  const [showDistribucao, setShowDistribucao] = useState(true);
  const [hoveredTestId, setHoveredTestId] = useState(null);

  const yearTests = TESTS_DATA_BY_YEAR[selectedYear] || TESTS_DATA_BY_YEAR['2024'] || TESTS_DATA_STANDARD;
  const tests = extendedMode ? TESTS_DATA_EXTENDED : yearTests;

  // Extrair grupos de meses únicos com seus testes
  const monthGroups = [];
  tests.forEach((t) => {
    let grp = monthGroups.find(g => g.name === t.monthGroup);
    if (!grp) {
      grp = { name: t.monthGroup, tests: [] };
      monthGroups.push(grp);
    }
    grp.tests.push(t);
  });

  // Função para retornar cor da barra de acertos
  const getBarColor = (score, empty) => {
    if (empty || score === 0) return 'transparent';
    if (score >= 70) return '#4ADE80'; // Verde
    if (score >= 40) return '#FACC15'; // Amarelo
    return '#EF4444'; // Vermelho
  };

  // Helper para posicionar a tooltip horizontalmente sem cortar nas bordas
  const getTooltipPositionClass = (idx, total) => {
    if (idx < 2) return 'left-0 translate-x-0';
    if (idx > total - 3) return 'right-0 translate-x-0';
    return 'left-1/2 -translate-x-1/2';
  };

  return (
    <div className="flex flex-col flex-1 relative z-20">
      {/* Overlay de Loading com Spinner e Blur */}
      {isLoading && (
        <div className="absolute inset-0 bg-white/75 backdrop-blur-[1.5px] flex flex-col items-center justify-center z-30 transition-all rounded-[8px]">
          <Loader2 className="w-8 h-8 text-[#008BC9] animate-spin mb-2" />
          <span className="text-xs font-semibold text-slate-600 animate-pulse">
            Carregando resultados dos testes...
          </span>
        </div>
      )}

      {/* ─── CORPO DOS GRÁFICOS: 1 OU 2 COLUNAS CONFORME TOGGLE COM GAP DE 16PX ─── */}
      <div className={`grid grid-cols-1 ${showDistribucao ? 'lg:grid-cols-2 gap-4 divide-y lg:divide-y-0 divide-slate-200' : ''}`}>
        {/* ─── GRÁFICO 1: PERCENTUAL DE ACERTO ─── */}
        <div className="p-4 flex flex-col relative z-20">
          <span className="text-xs font-bold text-slate-700 mb-4 block">
            Percentual de Acerto
          </span>

          <div className="relative h-64 flex items-end">
            {/* Eixo Y */}
            <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-semibold pointer-events-none pb-7">
              {[100, 75, 50, 25, 0].map((val) => (
                <div key={val} className="flex items-center w-full">
                  <span className="w-6 text-right pr-1.5">{val}</span>
                  <div className="flex-1 border-b border-dashed border-slate-100" />
                </div>
              ))}
            </div>

            {/* Barras dos Testes (Interativas via Hover com Fundo Escuro e Tooltip de Indicadores) */}
            <div className="flex items-end justify-between w-full h-full pl-8 pb-7 select-none">
              {tests.map((t, idx) => {
                const isHovered = hoveredTestId === t.id;
                const barColor = getBarColor(t.score, t.empty);
                const posClass = getTooltipPositionClass(idx, tests.length);

                return (
                  <div
                    key={t.id}
                    onMouseEnter={() => setHoveredTestId(t.id)}
                    onMouseLeave={() => setHoveredTestId(null)}
                    className="flex-1 h-full flex flex-col justify-end items-center relative group px-0.5"
                  >
                    {/* Fundo escuro sutil ativado por hover cobrindo até o rótulo T do teste */}
                    {isHovered && (
                      <div className="absolute -top-2 -bottom-6 inset-x-0 bg-[#1D2432]/15 rounded-[4px] pointer-events-none z-0 transition-colors" />
                    )}

                    {/* Tooltip escura com os indicadores do estudante naquele teste (100% visível, fora do painel) */}
                    {isHovered && (
                      <div className={`absolute bottom-[calc(100%+8px)] ${posClass} z-[70] pointer-events-none`}>
                        <div className="bg-[#1D2432] text-white rounded-[8px] p-3 shadow-2xl border border-slate-700 min-w-[190px] text-left">
                          <div className="flex items-center justify-between gap-3 border-b border-slate-700/80 pb-1.5 mb-2">
                            <span className="font-bold text-[11px] text-[#5AB6E2]">Teste {t.id}</span>
                            <span className="text-[10px] text-slate-300">{t.monthGroup || '2024'}</span>
                          </div>

                          {t.empty ? (
                            <span className="text-slate-400 text-[11px]">Teste não realizado</span>
                          ) : (
                            <div className="flex flex-col gap-1.5">
                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-300">Percentual de Acerto:</span>
                                <span className="font-bold text-[#4ADE80]">{t.score}%</span>
                              </div>

                              <div className="flex justify-between items-center text-[11px]">
                                <span className="text-slate-300">Conceito Predominante:</span>
                                <span className="font-semibold text-amber-300">
                                  {t.score >= 70 ? 'Suficiente' : t.score >= 40 ? 'Parcialmente Suficiente' : 'Abaixo do Básico'}
                                </span>
                              </div>

                              <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1.5 border-t border-slate-700/60">
                                <span>Itens Resolvidos:</span>
                                <span className="text-white font-medium">
                                  {Math.round((t.score / 100) * 40)} / 40
                                </span>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Barra (Corner Radius no topo de 4px) */}
                    {!t.empty && (
                      <div
                        className="w-full max-w-[28px] rounded-t-[4px] transition-all duration-300 relative z-10"
                        style={{
                          height: `${t.score}%`,
                          backgroundColor: barColor
                        }}
                      />
                    )}

                    {/* Rótulo T1, T2, etc */}
                    <span
                      className={`absolute -bottom-5 text-[10px] font-bold w-full text-center transition-colors z-10 ${
                        isHovered
                          ? 'text-[#002C5E] scale-110'
                          : t.empty
                          ? 'text-slate-300'
                          : 'text-[#008BC9]'
                      }`}
                    >
                      {t.id}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Rótulo de Meses Agrupados no Eixo Inferior */}
          <div className="flex items-center justify-between pl-8 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500 select-none">
            {monthGroups.map((mg) => (
              <div key={mg.name} className="flex-1 text-center">
                {mg.name}
              </div>
            ))}
          </div>
        </div>

        {/* ─── GRÁFICO 2: DISTRIBUIÇÃO DE CONCEITO (VISÍVEL SE TOGGLE ATIVO) ─── */}
        {showDistribucao && (
          <div className="p-4 flex flex-col relative z-20">
            <span className="text-xs font-bold text-slate-700 mb-4 block">
              Distribuição de Conceito
            </span>

            <div className="relative h-64 flex items-end">
              {/* Eixo Y */}
              <div className="absolute inset-0 flex flex-col justify-between text-[10px] text-slate-400 font-semibold pointer-events-none pb-7">
                {[100, 75, 50, 25, 0].map((val) => (
                  <div key={val} className="flex items-center w-full">
                    <span className="w-6 text-right pr-1.5">{val}</span>
                    <div className="flex-1 border-b border-dashed border-slate-100" />
                  </div>
                ))}
              </div>

              {/* Barras Empilhadas dos Testes */}
              <div className="flex items-end justify-between w-full h-full pl-8 pb-7 select-none">
                {tests.map((t, idx) => {
                  const isHovered = hoveredTestId === t.id;
                  const c = t.concept;
                  const posClass = getTooltipPositionClass(idx, tests.length);

                  return (
                    <div
                      key={t.id}
                      onMouseEnter={() => setHoveredTestId(t.id)}
                      onMouseLeave={() => setHoveredTestId(null)}
                      className="flex-1 h-full flex flex-col justify-end items-center relative group px-0.5"
                    >
                      {/* Fundo escuro sutil ativado por hover cobrindo até o rótulo T do teste */}
                      {isHovered && (
                        <div className="absolute -top-2 -bottom-6 inset-x-0 bg-[#1D2432]/15 rounded-[4px] pointer-events-none z-0 transition-colors" />
                      )}

                      {/* Tooltip escura com a distribuição detalhada (100% visível, fora do painel) */}
                      {isHovered && (
                        <div className={`absolute bottom-[calc(100%+8px)] ${posClass} z-[70] pointer-events-none`}>
                          <div className="bg-[#1D2432] text-white rounded-[8px] p-3 shadow-2xl border border-slate-700 min-w-[200px] text-left">
                            <div className="flex items-center justify-between gap-3 border-b border-slate-700/80 pb-1.5 mb-2">
                              <span className="font-bold text-[11px] text-[#5AB6E2]">Teste {t.id}</span>
                              <span className="text-[10px] text-slate-300">{t.monthGroup || '2024'}</span>
                            </div>

                            {t.empty ? (
                              <span className="text-slate-400 text-[11px]">Teste não realizado</span>
                            ) : (
                              <div className="flex flex-col gap-1.5">
                                <div className="text-[10px] font-semibold text-slate-300 mb-0.5">
                                  Distribuição de Conceitos:
                                </div>
                                {c.green > 0 && (
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="flex items-center gap-1 text-slate-300">
                                      <span className="w-2 h-2 rounded-full bg-[#4ADE80]" /> Suficiente:
                                    </span>
                                    <span className="font-bold text-white">{c.green}%</span>
                                  </div>
                                )}
                                {c.yellow > 0 && (
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="flex items-center gap-1 text-slate-300">
                                      <span className="w-2 h-2 rounded-full bg-[#FACC15]" /> Médio:
                                    </span>
                                    <span className="font-bold text-white">{c.yellow}%</span>
                                  </div>
                                )}
                                {c.red > 0 && (
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="flex items-center gap-1 text-slate-300">
                                      <span className="w-2 h-2 rounded-full bg-[#EF4444]" /> Abaixo:
                                    </span>
                                    <span className="font-bold text-white">{c.red}%</span>
                                  </div>
                                )}
                                {c.blue > 0 && (
                                  <div className="flex justify-between items-center text-[10px]">
                                    <span className="flex items-center gap-1 text-slate-300">
                                      <span className="w-2 h-2 rounded-full bg-[#BAE6FD]" /> Em desenvolvimento:
                                    </span>
                                    <span className="font-bold text-white">{c.blue}%</span>
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      )}

                      {/* Barra Empilhada (Corner Radius no topo de 4px) */}
                      {!t.empty ? (
                        <div className="w-full max-w-[28px] h-full flex flex-col justify-end rounded-t-[4px] overflow-hidden z-10">
                          {c.green > 0 && <div className="w-full bg-[#4ADE80]" style={{ height: `${c.green}%` }} />}
                          {c.yellow > 0 && <div className="w-full bg-[#FACC15]" style={{ height: `${c.yellow}%` }} />}
                          {c.red > 0 && <div className="w-full bg-[#EF4444]" style={{ height: `${c.red}%` }} />}
                          {c.blue > 0 && <div className="w-full bg-[#BAE6FD]" style={{ height: `${c.blue}%` }} />}
                          {c.white > 0 && <div className="w-full bg-white border-t border-slate-200" style={{ height: `${c.white}%` }} />}
                        </div>
                      ) : (
                        <div className="w-full max-w-[28px] h-1 bg-transparent" />
                      )}

                      {/* Rótulo T1, T2, etc */}
                      <span
                        className={`absolute -bottom-5 text-[10px] font-bold w-full text-center transition-colors z-10 ${
                          isHovered
                            ? 'text-[#002C5E] scale-110'
                            : t.empty
                            ? 'text-slate-300'
                            : 'text-[#008BC9]'
                        }`}
                      >
                        {t.id}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Rótulo de Meses Agrupados no Eixo Inferior */}
            <div className="flex items-center justify-between pl-8 pt-2 border-t border-slate-100 text-[10px] font-bold text-slate-500 select-none">
              {monthGroups.map((mg) => (
                <div key={mg.name} className="flex-1 text-center">
                  {mg.name}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ─── RODAPÉ DO CARD: SWITCH DISTRIBUIÇÃO DE CONCEITO (%) ─── */}
      <div className="px-4 py-2.5 border-t border-slate-200 bg-white rounded-b-[8px] flex justify-end items-center gap-3">
        <span className="text-xs font-semibold text-slate-700">
          Visualizar Distribuição de Conceito (%)
        </span>

        {/* Switch Toggle */}
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={showDistribucao}
            onChange={(e) => setShowDistribucao(e.target.checked)}
            className="sr-only peer"
          />
          <div className="relative w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-[#489EEA]"></div>
        </label>
      </div>
    </div>
  );
}
