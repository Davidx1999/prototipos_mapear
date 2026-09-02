import React, { useState } from 'react';
import { TESTS_DATA_STANDARD, TESTS_DATA_EXTENDED } from './mockDataAcompanhamento';

export default function TestesAlunoChart({
  title = "Testes do Estudante",
  subtitle = "",
  extendedMode = false
}) {
  const [showDistribucao, setShowDistribucao] = useState(true);
  const [selectedTestId, setSelectedTestId] = useState('T5');

  const tests = extendedMode ? TESTS_DATA_EXTENDED : TESTS_DATA_STANDARD;

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

  return (
    <div className="flex flex-col flex-1">
      {/* ─── CORPO DOS GRÁFICOS: 1 OU 2 COLUNAS CONFORME TOGGLE ─── */}
      <div className={`grid grid-cols-1 ${showDistribucao ? 'lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-slate-200' : ''}`}>
        {/* ─── GRÁFICO 1: PERCENTUAL DE ACERTO ─── */}
        <div className="p-4 flex flex-col">
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

            {/* Barras dos Testes */}
            <div className="flex items-end justify-between w-full h-full pl-8 pb-7 select-none">
              {tests.map((t) => {
                const isSelected = selectedTestId === t.id;
                const barColor = getBarColor(t.score, t.empty);

                return (
                  <div
                    key={t.id}
                    onClick={() => setSelectedTestId(t.id)}
                    className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer px-0.5"
                  >
                    {/* Destaque sombreado em coluna quando selecionado (conforme Imagem 3) */}
                    {isSelected && (
                      <div className="absolute -inset-y-2 inset-x-0 bg-slate-200/60 rounded-sm pointer-events-none z-0" />
                    )}

                    {/* Barra */}
                    {!t.empty && (
                      <div
                        className="w-full max-w-[28px] rounded-t-sm transition-all duration-300 relative z-10 hover:brightness-95"
                        style={{
                          height: `${t.score}%`,
                          backgroundColor: barColor
                        }}
                        title={`${t.id}: ${t.score}%`}
                      />
                    )}

                    {/* Rótulo T1, T2, etc */}
                    <span
                      className={`absolute -bottom-5 text-[10px] font-bold w-full text-center transition-colors z-10 ${
                        t.empty ? 'text-slate-300' : 'text-[#008BC9] group-hover:text-[#0078B0]'
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
          <div className="p-4 flex flex-col">
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
                {tests.map((t) => {
                  const isSelected = selectedTestId === t.id;
                  const c = t.concept;

                  return (
                    <div
                      key={t.id}
                      onClick={() => setSelectedTestId(t.id)}
                      className="flex-1 h-full flex flex-col justify-end items-center relative group cursor-pointer px-0.5"
                    >
                      {/* Destaque sombreado em coluna */}
                      {isSelected && (
                        <div className="absolute -inset-y-2 inset-x-0 bg-slate-200/60 rounded-sm pointer-events-none z-0" />
                      )}

                      {/* Barra Empilhada */}
                      {!t.empty ? (
                        <div className="w-full max-w-[28px] h-full flex flex-col justify-end rounded-t-sm overflow-hidden z-10">
                          {c.green > 0 && <div className="w-full bg-[#4ADE80]" style={{ height: `${c.green}%` }} title={`Suficiente: ${c.green}%`} />}
                          {c.yellow > 0 && <div className="w-full bg-[#FACC15]" style={{ height: `${c.yellow}%` }} title={`Médio: ${c.yellow}%`} />}
                          {c.red > 0 && <div className="w-full bg-[#EF4444]" style={{ height: `${c.red}%` }} title={`Abaixo: ${c.red}%`} />}
                          {c.blue > 0 && <div className="w-full bg-[#BAE6FD]" style={{ height: `${c.blue}%` }} title={`Em desenvolvimento: ${c.blue}%`} />}
                          {c.white > 0 && <div className="w-full bg-white border-t border-slate-200" style={{ height: `${c.white}%` }} />}
                        </div>
                      ) : (
                        <div className="w-full max-w-[28px] h-1 bg-transparent" />
                      )}

                      {/* Rótulo T1, T2, etc */}
                      <span
                        className={`absolute -bottom-5 text-[10px] font-bold w-full text-center transition-colors z-10 ${
                          t.empty ? 'text-slate-300' : 'text-[#008BC9] group-hover:text-[#0078B0]'
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
