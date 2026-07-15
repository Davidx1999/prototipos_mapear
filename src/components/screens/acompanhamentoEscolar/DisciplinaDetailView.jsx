import React from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Sparkles, Bot } from 'lucide-react';
import Button from '../../ui/Button';

/**
 * DisciplinaDetailView Component
 * Renders the detail view for a specific curriculum component (Língua Portuguesa / Matemática).
 */
const DisciplinaDetailView = ({
  isDarkMode,
  selectedDisciplina,
  selectedTurma,
  year,
  navigateBack,
  handleNavigate
}) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-slide">
      
      <div className={`border p-4 rounded-[4px] flex items-center justify-between shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
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
            <span className="text-[9px] font-bold text-[#006699] dark:text-sky-400 uppercase tracking-wide block">Aprofundamento Pedagógico</span>
            <h3 className="text-sm font-bold text-slate-955 dark:text-white">
              {selectedDisciplina} — {selectedTurma.serie === "1em" ? "1º Ano EM" : selectedTurma.serie === "2em" ? "2º Ano EM" : "3º Ano EM"} Turma {selectedTurma.letra} ({year})
            </h3>
          </div>
        </div>
      </div>

      {/* Subtheme Analysis */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Bloco Leitura (Consolidado) */}
        <div className={`rounded-[4px] p-5 border flex flex-col justify-between shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 dark:bg-emerald-955/20 dark:text-emerald-400 px-2 py-0.5 rounded-[2px] border border-emerald-100 dark:border-emerald-900/30">ÓTIMO DESEMPENHO</span>
              <span className="text-base font-bold text-emerald-600 dark:text-emerald-450">82% acertos</span>
            </div>
            <h4 className="text-xs font-bold text-slate-850 dark:text-slate-250 mb-1.5">Componente: Leitura Crítica</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Os estudantes demonstram facilidade para decodificar textos curtos, localizar informações explícitas e identificar o tema central em narrativas diretas.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-855 flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
            <CheckCircle2 className="w-3.5 h-3.5" /> Domínio amplamente consolidado na turma.
          </div>
        </div>

        {/* Bloco Interpretação (Defasagem) */}
        <div className={`rounded-[4px] p-5 border flex flex-col justify-between shadow-xs ${isDarkMode ? 'bg-rose-955/10 border-rose-900/30' : 'bg-rose-50/15 border-rose-200'}`}>
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[9px] font-bold text-rose-855 bg-rose-50 dark:bg-rose-955/40 dark:text-rose-350 px-2 py-0.5 rounded-[2px] border border-rose-100 dark:border-rose-900/30">DEFASAGEM IDENTIFICADA</span>
              <span className="text-base font-bold text-rose-600 dark:text-rose-455">42% acertos</span>
            </div>
            <h4 className="text-xs font-bold text-slate-855 dark:text-slate-255 mb-1.5">Componente: Interpretação Textual & Inferência</h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              O gargalo da média de Língua Portuguesa concentra-se na inferência de sentido figurado, ironias e na intertextualidade entre textos longos.
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-900/20 flex items-center gap-2 text-[10px] text-rose-600 dark:text-rose-400 font-bold animate-pulse">
            <AlertCircle className="w-3.5 h-3.5" /> Interpretação Textual está derrubando a média da turma.
          </div>
        </div>

      </div>

      {/* Detailed Skills Mapping */}
      <div className={`rounded-[4px] p-5 border shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
        <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-4">Mapeamento de Habilidades do Componente Crítico</h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Consolidadas */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-450 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Consolidadas (3)
            </h5>
            <div className="space-y-1.5 text-xs">
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-2.5 rounded-[4px] flex justify-between items-center">
                <span>H1. Identificar tese e argumento em editoriais simples</span>
                <span className="text-emerald-600 font-bold">85%</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-2.5 rounded-[4px] flex justify-between items-center">
                <span>H4. Diferenciar fato de opinião em textos jornalísticos</span>
                <span className="text-emerald-600 font-bold">81%</span>
              </div>
              <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-2.5 rounded-[4px] flex justify-between items-center">
                <span>H5. Reconhecer o gênero e finalidade de cartazes</span>
                <span className="text-emerald-600 font-bold">89%</span>
              </div>
            </div>
          </div>

          {/* Habilidades Críticas */}
          <div className="space-y-3">
            <h5 className="text-xs font-bold text-rose-700 dark:text-rose-455 flex items-center gap-1">
              <AlertCircle className="w-4 h-4 text-rose-500" /> Defasagem Severa (7)
            </h5>
            <div className="space-y-1.5 text-xs">
              <div className="bg-rose-500/5 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-905/30 p-2.5 rounded-[4px] flex justify-between items-center">
                <span className="font-medium text-rose-850 dark:text-rose-300">H2. Inferir efeitos de humor e ironia em crônicas</span>
                <span className="text-rose-605 font-bold">34%</span>
              </div>
              <div className="bg-rose-500/5 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-905/30 p-2.5 rounded-[4px] flex justify-between items-center">
                <span className="font-medium text-rose-850 dark:text-rose-300">H3. Identificar intertextualidade entre poemas</span>
                <span className="text-rose-605 font-bold">29%</span>
              </div>
              <div className="bg-rose-500/5 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-955/30 p-2.5 rounded-[4px] flex justify-between items-center">
                <span className="font-medium text-rose-850 dark:text-rose-300">H6. Reconhecer recursos persuasivos em ensaios</span>
                <span className="text-rose-605 font-bold">40%</span>
              </div>
            </div>
          </div>
        </div>

        {/* CTA do Loop Pedagógico */}
        <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <div className="bg-sky-50 dark:bg-slate-800 text-[#006699] dark:text-sky-400 p-2.5 rounded-[4px] border border-sky-100 dark:border-slate-750">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Próximo Passo Recomendado por IA</h5>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Podemos criar uma avaliação de reforço estruturada sob medida com foco unicamente das 7 habilidades de interpretação com defasagem.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleNavigate('editor-avaliacao')}
            className="px-5 py-2.5 bg-[#006699] hover:bg-[#004d73] text-white text-xs font-bold uppercase tracking-wider rounded-[4px] transition-all flex items-center gap-2 shadow-sm shrink-0"
          >
            <Bot className="w-4 h-4" /> Gerar Avaliação de Reforço com IA
          </button>
        </div>
      </div>

    </div>
  );
};

export default DisciplinaDetailView;
