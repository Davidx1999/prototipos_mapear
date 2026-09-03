import React, { useState, useEffect } from 'react';
import { BarChart2, Grid, HelpCircle, Layers } from 'lucide-react';
import { STUDENTS } from './acompanhamento/mockDataAcompanhamento';
import AcompanhamentoHeader from './acompanhamento/AcompanhamentoHeader';
import AcompanhamentoFilters from './acompanhamento/AcompanhamentoFilters';
import MetricCards from './acompanhamento/MetricCards';
import EvolucaoAlunoChart from './acompanhamento/EvolucaoAlunoChart';
import DominiosRepertorio from './acompanhamento/DominiosRepertorio';
import TestesAlunoChart from './acompanhamento/TestesAlunoChart';
import TestesHeatmap from './acompanhamento/TestesHeatmap';
import EmptyStateTestes from './acompanhamento/EmptyStateTestes';
import LinhaDoTempoTab from './acompanhamento/LinhaDoTempoTab';

export default function Acompanhamento({
  colors,
  acompanhamentoTab,
  setAcompanhamentoTab,
  navigateTo
}) {
  // Estado do Estudante selecionado (Roberto Carlos - EEM José Militão)
  const [activeStudent, setActiveStudent] = useState(STUDENTS[0]);

  React.useEffect(() => {
    setActiveStudent(STUDENTS[0]);
  }, []);

  // Aba principal: 'resultados' | 'linha-do-tempo'
  const [activeMainTab, setActiveMainTab] = useState(
    acompanhamentoTab === 2 ? 'linha-do-tempo' : 'resultados'
  );

  // Sub-navegação: 'Estudante' | 'Turmas' | 'Escolas' | 'Rede'
  const [activeSubNav, setActiveSubNav] = useState('Estudante');

  // Filtros de Topo
  const [selectedYear, setSelectedYear] = useState('2024');
  const [tipoDominio, setTipoDominio] = useState('Repertório');
  const [tipoAmostra, setTipoAmostra] = useState('TRI');

  // Visibilidade das matérias no gráfico de evolução e domínios de repertório
  const [isLeituraAtiva, setIsLeituraAtiva] = useState(true);
  const [isMatematicaAtiva, setIsMatematicaAtiva] = useState(true);

  // Modo de visualização dos testes: 'bars' | 'heatmap'
  const [testesViewMode, setTestesViewMode] = useState('bars');

  // Alternância entre dataset padrão (12 testes - Imagens 1,2,3,5) e estendido (20 testes - Imagem 4)
  const [extendedTestsMode, setExtendedTestsMode] = useState(false);

  // Alternância do título "Estudante" vs "Aluno" (conforme pequenas variações entre imagens)
  const [studentLabelVariant, setStudentLabelVariant] = useState('Estudante'); // 'Estudante' | 'Aluno'

  // Simulação de Lazy Loading ao alternar filtros (para dar sensação de telemetria real do backend)
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 450);
    return () => clearTimeout(timer);
  }, [selectedYear, tipoDominio, tipoAmostra]);

  // Alternar para a visualização correta caso mude o subNav
  const handleSubNavChange = (nav) => {
    setActiveSubNav(nav);
    if (nav !== 'Estudante' && navigateTo) {
      navigateTo('acompanhamento-escolar');
    }
  };

  const handleExportPDF = () => {
    window.print();
  };

  return (
    <main
      className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-5 pb-16 animate-fade-slide flex flex-col bg-white min-h-screen select-none"
      style={{ fontFamily: 'Montserrat, sans-serif' }}
    >
      {/* ─── 1) CABEÇALHO GERAL COM VOLTAR, SUBNAV, BREADCRUMB E ALUNO ─── */}
      <AcompanhamentoHeader
        activeStudent={activeStudent}
        setActiveStudent={setActiveStudent}
        activeSubNav={activeSubNav}
        setActiveSubNav={handleSubNavChange}
        onBackToDashboard={() => navigateTo && navigateTo('dashboard')}
        onExportPDF={handleExportPDF}
      />

      {/* ─── 2) ABAS STICKY: [Resultados] [Linha do Tempo] ─── */}
      {/* Como o pai direto é <main>, as abas permanecem fixadas por toda a rolagem da página abaixo do header (top-[84px]) */}
      <div className="sticky top-[84px] z-40 bg-white border-b border-[#CBD5E1] my-2 before:content-[''] before:absolute before:inset-y-0 before:-left-[100vw] before:-right-[100vw] before:bg-white before:border-b before:border-[#CBD5E1] before:-z-10 shadow-2xs">
        <div className="max-w-[1440px] mx-auto flex items-center">
          <button
            onClick={() => {
              setActiveMainTab('resultados');
              if (setAcompanhamentoTab) {
                setAcompanhamentoTab(0);
              }
            }}
            className={`h-[56px] px-8 text-base font-semibold inline-flex items-center justify-center transition-all ${
              activeMainTab === 'resultados'
                ? 'text-[#008BC9] border-b-[3px] border-[#008BC9] -mb-[1.5px] bg-transparent'
                : 'text-[#1D2432] border-b-[3px] border-transparent -mb-[1.5px] hover:bg-[#BCE5F8] hover:text-[#002C5E]'
            }`}
          >
            Resultados
          </button>

          <button
            onClick={() => {
              setActiveMainTab('linha-do-tempo');
              if (setAcompanhamentoTab) {
                setAcompanhamentoTab(2);
              }
            }}
            className={`h-[56px] px-8 text-base font-semibold inline-flex items-center justify-center transition-all ${
              activeMainTab === 'linha-do-tempo'
                ? 'text-[#008BC9] border-b-[3px] border-[#008BC9] -mb-[1.5px] bg-transparent'
                : 'text-[#1D2432] border-b-[3px] border-transparent -mb-[1.5px] hover:bg-[#BCE5F8] hover:text-[#002C5E]'
            }`}
          >
            Linha do Tempo
          </button>
        </div>
      </div>

      {/* ─── 3) CONTEÚDO DA ABA: RESULTADOS ─── */}
      {activeMainTab === 'resultados' && (
        <div className="flex flex-col mt-3">
          {/* Barra de Filtros: Ano, Domínio e Amostra (Toolbar) */}
          <AcompanhamentoFilters
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            tipoDominio={tipoDominio}
            setTipoDominio={setTipoDominio}
            tipoAmostra={tipoAmostra}
            setTipoAmostra={setTipoAmostra}
          />

          {/* Cards de Indicadores: exatamente 8px (mt-2) da toolbar */}
          <div className="mt-2">
            <MetricCards
              dataMode={tipoAmostra === 'TRI' ? 'percentage' : 'fraction'}
              selectedYear={selectedYear}
              isLoading={isLoading}
            />
          </div>

          {/* Bloco Central (Evolução do Estudante + Domínios): exatamente 16px (mt-4) dos indicadores */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 mb-0 items-stretch">
            {/* Lado Esquerdo: Evolução do Estudante (2 colunas) */}
            <div className="lg:col-span-2 flex flex-col h-full">
              <EvolucaoAlunoChart
                title={`Evolução do ${studentLabelVariant}`}
                selectedYear={selectedYear}
                isLoading={isLoading}
                isLeituraAtiva={isLeituraAtiva}
                setIsLeituraAtiva={setIsLeituraAtiva}
                isMatematicaAtiva={isMatematicaAtiva}
                setIsMatematicaAtiva={setIsMatematicaAtiva}
              />
            </div>

            {/* Lado Direito: Domínios de Repertório (1 coluna) */}
            <div className="lg:col-span-1 flex flex-col h-full">
              <DominiosRepertorio
                tipoDominio={tipoDominio}
                selectedYear={selectedYear}
                isLoading={isLoading}
                isLeituraAtiva={isLeituraAtiva}
                isMatematicaAtiva={isMatematicaAtiva}
              />
            </div>
          </div>

          {/* Bloco Inferior: Testes do Estudante: exatamente 16px (mt-4) da evolução do estudante */}
          <div className="bg-white rounded-[8px] border border-slate-300 shadow-2xs flex flex-col mt-4 relative z-20">
            {/* Topo da Seção de Testes: Título + Ícones de Alternância */}
            <div className="p-4 border-b border-slate-200 flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-bold text-slate-800 tracking-tight">
                  Testes do {studentLabelVariant}
                </h3>
                {extendedTestsMode && (
                  <p className="text-[10px] font-semibold text-slate-400 mt-0.5">
                    Análise detalhada dos testes do aluno
                  </p>
                )}
              </div>

              {/* Controles de visualização: Gráfico de Barras vs Heatmap + Suporte a 20 testes */}
              <div className="flex items-center gap-2">
                {/* Botão sutil para alternar modo 12 vs 20 testes (demonstra Imagem 4 vs Imagens 1-3) */}
                <button
                  onClick={() => {
                    setExtendedTestsMode(!extendedTestsMode);
                    setStudentLabelVariant(!extendedTestsMode ? 'Aluno' : 'Estudante');
                  }}
                  className={`px-2 py-0.5 rounded-[4px] text-[10px] font-bold border transition-all ${
                    extendedTestsMode
                      ? 'bg-sky-50 text-[#0078B0] border-sky-200'
                      : 'bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100'
                  }`}
                  title="Alternar entre visualização de 12 testes e 20 testes"
                >
                  {extendedTestsMode ? '20 Testes (Jan-Dez)' : '12 Testes'}
                </button>

                {/* Ícone Gráfico de Barras */}
                <button
                  onClick={() => setTestesViewMode('bars')}
                  className={`p-1.5 rounded-[4px] transition-all ${
                    testesViewMode === 'bars'
                      ? 'bg-[#0078B0] text-white shadow-2xs'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Visualizar em Gráficos de Barras"
                >
                  <BarChart2 className="w-4 h-4" />
                </button>

                {/* Ícone Heatmap / Matriz */}
                <button
                  onClick={() => setTestesViewMode('heatmap')}
                  className={`p-1.5 rounded-[4px] transition-all ${
                    testesViewMode === 'heatmap'
                      ? 'bg-[#0078B0] text-white shadow-2xs'
                      : 'text-slate-400 hover:text-slate-600 hover:bg-slate-100'
                  }`}
                  title="Visualizar em Formato de Heatmap / Matriz"
                >
                  <Grid className="w-4 h-4" />
                </button>

                {/* Ícone de Ajuda */}
                <button
                  className="text-slate-400 hover:text-slate-600 transition-colors p-1"
                  title="Ajuda sobre a análise de testes"
                >
                  <HelpCircle className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Conteúdo Dinâmico */}
            {selectedYear === 'Todos' ? (
              <EmptyStateTestes onSelectYear={(ano) => setSelectedYear(ano)} />
            ) : testesViewMode === 'bars' ? (
              <TestesAlunoChart
                title={`Testes do ${studentLabelVariant}`}
                subtitle={extendedTestsMode ? 'Análise detalhada dos testes do aluno' : ''}
                selectedYear={selectedYear}
                isLoading={isLoading}
                extendedMode={extendedTestsMode}
              />
            ) : (
              <TestesHeatmap />
            )}
          </div>
        </div>
      )}

      {/* ─── 3) CONTEÚDO DA ABA: LINHA DO TEMPO (Sincronizada com o ano selecionado) ─── */}
      {activeMainTab === 'linha-do-tempo' && (
        <LinhaDoTempoTab
          selectedYear={selectedYear === 'Todos' ? 2026 : Number(selectedYear)}
          setSelectedYear={(yr) => setSelectedYear(String(yr))}
        />
      )}
    </main>
  );
}
