import React, { useState } from 'react';
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
  // Estado do Estudante selecionado
  const [activeStudent, setActiveStudent] = useState(STUDENTS[0]);

  // Aba principal: 'resultados' | 'linha-do-tempo'
  const [activeMainTab, setActiveMainTab] = useState(
    acompanhamentoTab === 2 ? 'linha-do-tempo' : 'resultados'
  );

  // Sub-navegação: 'Estudante' | 'Turmas' | 'Escolas' | 'Rede'
  const [activeSubNav, setActiveSubNav] = useState('Estudante');

  // Filtros de Topo
  const [selectedYear, setSelectedYear] = useState('2020');
  const [tipoDominio, setTipoDominio] = useState('Repertório');
  const [tipoAmostra, setTipoAmostra] = useState('TRI');

  // Modo de visualização dos testes: 'bars' | 'heatmap'
  const [testesViewMode, setTestesViewMode] = useState('bars');

  // Alternância entre dataset padrão (12 testes - Imagens 1,2,3,5) e estendido (20 testes - Imagem 4)
  const [extendedTestsMode, setExtendedTestsMode] = useState(false);

  // Alternância do título "Estudante" vs "Aluno" (conforme pequenas variações entre imagens)
  const [studentLabelVariant, setStudentLabelVariant] = useState('Estudante'); // 'Estudante' | 'Aluno'

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
      {/* ─── 1) CABEÇALHO GERAL COM VOLTAR, TABS, SELETORES E ALUNO ─── */}
      <AcompanhamentoHeader
        activeStudent={activeStudent}
        setActiveStudent={setActiveStudent}
        activeMainTab={activeMainTab}
        setActiveMainTab={(tab) => {
          setActiveMainTab(tab);
          if (setAcompanhamentoTab) {
            setAcompanhamentoTab(tab === 'linha-do-tempo' ? 2 : 0);
          }
        }}
        activeSubNav={activeSubNav}
        setActiveSubNav={handleSubNavChange}
        onBackToDashboard={() => navigateTo && navigateTo('dashboard')}
        onExportPDF={handleExportPDF}
      />

      {/* ─── 2) CONTEÚDO DA ABA: RESULTADOS ─── */}
      {activeMainTab === 'resultados' && (
        <div className="flex flex-col gap-4 mt-2">
          {/* Barra de Filtros: Ano, Domínio e Amostra */}
          <AcompanhamentoFilters
            selectedYear={selectedYear}
            setSelectedYear={setSelectedYear}
            tipoDominio={tipoDominio}
            setTipoDominio={setTipoDominio}
            tipoAmostra={tipoAmostra}
            setTipoAmostra={setTipoAmostra}
          />

          {/* Cards de Indicadores (Percentual de Acertos, Avaliações, Itens, Intervenções) */}
          <MetricCards dataMode={tipoAmostra === 'TRI' ? 'percentage' : 'fraction'} />

          {/* Bloco Central: Evolução do Estudante + Domínios de Repertório */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-1">
            {/* Lado Esquerdo: Evolução do Estudante (2 colunas) */}
            <div className="lg:col-span-2 flex flex-col">
              <EvolucaoAlunoChart
                title={`Evolução do ${studentLabelVariant}`}
              />
            </div>

            {/* Lado Direito: Domínios de Repertório (1 coluna) */}
            <div className="lg:col-span-1 flex flex-col">
              <DominiosRepertorio tipoDominio={tipoDominio} />
            </div>
          </div>

          {/* Bloco Inferior: Testes do Estudante (Gráfico de Barras / Heatmap / Empty State) */}
          <div className="bg-white rounded-[8px] border border-slate-300 shadow-2xs flex flex-col mt-2 overflow-hidden">
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
                      ? 'bg-[#489EEA] text-white shadow-2xs'
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
                      ? 'bg-[#489EEA] text-white shadow-2xs'
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
                extendedMode={extendedTestsMode}
              />
            ) : (
              <TestesHeatmap />
            )}
          </div>
        </div>
      )}

      {/* ─── 3) CONTEÚDO DA ABA: LINHA DO TEMPO ─── */}
      {activeMainTab === 'linha-do-tempo' && (
        <LinhaDoTempoTab />
      )}
    </main>
  );
}
