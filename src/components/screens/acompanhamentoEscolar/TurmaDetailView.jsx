import React from 'react';
import {
  ArrowLeft, ChevronLeft, ChevronRight, Info, AlertTriangle, AlertCircle, Sparkles, TrendingUp
} from 'lucide-react';
import Button from '../../ui/Button';

// Modular charts & components
import MatchMomentumChart from './MatchMomentumChart';

const TurmaDetailView = ({
  isDarkMode,
  selectedTurma,
  setSelectedTurma,
  activeTurmaData,
  navigateBack,
  navigateTurmaPrevNext,
  handleDropdownTurmaChange,
  series,
  letters,
  year,
  setYear,
  simulateLoading,
  triggerToast,
  navigateCohort,
  colors,
  interventions,
  setInterventions,
  hoveredMomentum,
  setHoveredMomentum,
  handleNavigate,
  renderMatchMomentum
}) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-slide">
      
      {/* Top Back and Navigation Row */}
      <div className={`border p-4 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
        <div className="flex items-center gap-3">
          <Button
            variant="tertiary"
            appearance="solid"
            size="sm"
            iconLeft={<ArrowLeft />}
            onClick={navigateBack}
          >
            Voltar
          </Button>
          <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div>
            <span className="text-[9px] font-bold text-[#006699] dark:text-sky-400 uppercase tracking-wide block">Painel de Acompanhamento</span>
            <h3 className="text-sm font-bold text-slate-955 dark:text-white">
              {selectedTurma.serie === "1em" ? "1º Ano EM" : selectedTurma.serie === "2em" ? "2º Ano EM" : "3º Ano EM"} - Turma {selectedTurma.letra}
            </h3>
          </div>
        </div>

        {/* Quick Class Selector Switchers */}
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-semibold text-slate-500">Mudar Turma:</span>
          <Button
            onClick={() => navigateTurmaPrevNext('prev')}
            variant="tertiary"
            appearance="solid"
            size="sm"
            iconOnly={true}
            iconLeft={<ChevronLeft />}
            className="!p-1 !h-8 !w-8"
          />
          
          <select
            value={`${selectedTurma.serie}:${selectedTurma.letra}`}
            onChange={handleDropdownTurmaChange}
            className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1 text-xs font-semibold text-slate-705 dark:text-slate-305 bg-white dark:bg-slate-900 focus:outline-none"
          >
            {series.map(s => (
              letters.map(l => (
                <option key={`${s}:${l}`} value={`${s}:${l}`}>
                  {s === "1em" ? "1º EM" : s === "2em" ? "2º EM" : "3º EM"} - Turma {l}
                </option>
              ))
            ))}
          </select>

          <Button
            onClick={() => navigateTurmaPrevNext('next')}
            variant="tertiary"
            appearance="solid"
            size="sm"
            iconOnly={true}
            iconLeft={<ChevronRight />}
            className="!p-1 !h-8 !w-8"
          />
        </div>
      </div>

      <div className="flex flex-col gap-6">
        


        {/* KPIs strip */}
        <div className={`rounded-[4px] p-5 border grid grid-cols-1 md:grid-cols-3 gap-4 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-[4px] border border-slate-100 dark:border-slate-850">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Aproveitamento</span>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{activeTurmaData.perf}%</p>
            <p className="text-[10px] text-slate-500 mt-1">Média curricular atual</p>
          </div>
          
          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-[4px] border border-slate-100 dark:border-slate-850">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Status de Atenção</span>
            <span className={`px-2 py-0.5 text-[9px] font-bold rounded-[2px] uppercase inline-block mt-0.5 ${
              activeTurmaData.status === 'ins' 
                ? 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-955/20 dark:text-rose-450 dark:border-rose-900/30' 
                : activeTurmaData.status === 'par'
                  ? 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30'
                  : 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-955/20 dark:text-emerald-450 dark:border-emerald-900/30'
            }`}>
              {activeTurmaData.status === 'ins' ? 'CRÍTICO' : activeTurmaData.status === 'par' ? 'PARCIAL' : 'SUFICIENTE'}
            </span>
            <p className="text-[10px] text-slate-500 mt-1">Classificação qualitativa do grupo</p>
          </div>

          <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-[4px] border border-slate-100 dark:border-slate-850">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Taxa de Participação</span>
            <p className="text-xl font-bold text-slate-800 dark:text-white">{activeTurmaData.part}%</p>
            <p className="text-[10px] text-slate-500 mt-1">Frequência nas avaliações formativas</p>
          </div>
        </div>

        {/* Linha 1: Tomada de Decisão & Class Momentum */}
        <div className="flex flex-col gap-6">
          
          {/* Card de Tomada de Decisão (Div em linha pequena, não tão chamativa) */}
          <div className={`p-4 rounded-[4px] border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
            activeTurmaData.status === 'ins'
              ? 'border-rose-200 bg-rose-50/30 dark:border-rose-950/20 dark:bg-rose-955/5'
              : 'border-slate-200 bg-slate-50/50 dark:border-slate-800 dark:bg-slate-900/30'
          }`}>
            <div className="flex items-center gap-3">
              {activeTurmaData.status === 'ins' ? (
                <AlertTriangle className="w-5 h-5 text-rose-500 shrink-0 animate-pulse" />
              ) : (
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" />
              )}
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Tomada de Decisão</span>
                <p className="text-xs text-slate-700 dark:text-slate-300 font-medium mt-0.5">
                  {activeTurmaData.status === 'ins'
                    ? `A Turma ${selectedTurma.letra} apresenta queda crítica em 3 habilidades de álgebra. Recomendamos intervenção imediata.`
                    : `A Turma ${selectedTurma.letra} mantém desempenho estável, mas requer atenção em leitura e interpretação.`}
                </p>
              </div>
            </div>

            <Button
              onClick={() => triggerToast(`Abrindo plano de intervenções customizado para a turma ${selectedTurma.letra}.`)}
              variant="tertiary"
              appearance="solid"
              size="xs"
              uppercase={true}
              iconLeft={<Sparkles className="w-3.5 h-3.5 text-amber-500" />}
              className="!h-8 shrink-0 border-amber-300 hover:bg-amber-50/40"
            >
              Plano de Intervenção
            </Button>
          </div>

          {/* Class Momentum (Gráfico de evolução interna) */}
          <div className={`rounded-[4px] border p-5 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
            <div className="flex justify-between items-center mb-4">
              <div>
                <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide">Class Momentum</h4>
                <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light mt-0.5">
                  Gráfico de dispersão cruzando a **Participação** (eixo X) com o **Aproveitamento** (eixo Y) de cada estudante.
                </p>
              </div>
              
              <div className="flex gap-4 text-[9px] font-bold uppercase text-slate-500">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Suficiente</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-500"></span> Parcial</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-rose-500"></span> Crítico</span>
              </div>
            </div>
            
            <div className="relative w-full">
              <MatchMomentumChart
                isDarkMode={isDarkMode}
                hoveredStudent={hoveredMomentum}
                setHoveredStudent={setHoveredMomentum}
                turma={selectedTurma.letra}
              />
            </div>
          </div>

        </div>

        {/* Linha 2: Habilidades por Componente (Disciplinas) */}
        <div className={`rounded-[4px] border p-5 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide mb-1">Componentes Curriculares da Turma</h4>
          <p className="text-[11px] text-slate-455 dark:text-slate-400 font-light mb-4">Clique em uma disciplina para analisar os domínios de competência, habilidades críticas e o mapa de calor de respostas.</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Língua Portuguesa */}
            <div
              onClick={() => handleNavigate('detalhe-disciplina', null, null, 'Língua Portuguesa')}
              className="border border-slate-202 dark:border-slate-800 p-4 rounded-[4px] cursor-pointer hover:border-[#006699] dark:hover:border-sky-400 hover:bg-slate-50/50 dark:hover:bg-slate-855/50 transition-all flex justify-between items-center group"
            >
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-355">Língua Portuguesa</span>
                <p className="text-[11px] text-slate-550 dark:text-slate-400 mt-1">
                  Média: <strong className="text-amber-600">62% (Parcial)</strong>
                </p>
              </div>
              <div className="text-[#006699] dark:text-sky-400 text-xs font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                Aprofundar <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Matemática */}
            <div
              onClick={() => handleNavigate('detalhe-disciplina', null, null, 'Matemática')}
              className="border border-slate-202 dark:border-slate-800 p-4 rounded-[4px] cursor-pointer hover:border-[#006699] dark:hover:border-sky-400 hover:bg-slate-50/50 dark:hover:bg-slate-855/50 transition-all flex justify-between items-center group"
            >
              <div>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Matemática</span>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                  Média: <strong className="text-emerald-600 dark:text-emerald-455">74% (Suficiente)</strong>
                </p>
              </div>
              <div className="text-[#006699] dark:text-sky-400 text-xs font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                Aprofundar <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default TurmaDetailView;
