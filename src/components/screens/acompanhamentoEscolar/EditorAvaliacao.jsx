import React from 'react';
import { Bot, ArrowLeft, CheckCircle2, RefreshCw, Edit3, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';

/**
 * EditorAvaliacao Component
 * Renders the evaluation creator/editor with AI-assisted item recommendations.
 */
const EditorAvaliacao = ({ isDarkMode, colors, navigateBack, triggerToast, handleNavigate }) => {
  return (
    <div className="flex flex-col gap-6 animate-fade-slide">
      
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
            <span className="text-[9px] font-bold text-emerald-605 uppercase tracking-wide block">Geração de Item Integrada</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">Editor de Avaliações × Assistente IA</h3>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500 dark:text-slate-400">
            Foco em: <strong>Interpretação Textual</strong>
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Coluna Esquerda: AI Panel */}
        <div className="bg-slate-900 text-white p-5 rounded-[4px] flex flex-col justify-between min-h-[440px] shadow-md border border-slate-800">
          <div>
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <span className="text-xs font-bold text-sky-400 uppercase tracking-wide flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-sky-400" /> ASSISTENTE IA DE CRIAÇÃO
              </span>
              <span className="text-[9px] text-slate-400">Status: Ativo</span>
            </div>

            <div className="space-y-4 text-xs leading-relaxed">
              <p className="text-slate-355 font-light">
                Olá! Analisei as lacunas do 3º EM D em Interpretação Textual e selecionei as tarefas mais adequadas do nosso banco de itens.
              </p>
              <div className="bg-slate-800/60 p-3 rounded-[4px] border border-slate-800 space-y-2">
                <p className="font-semibold text-sky-300">Estrutura Recomendada:</p>
                <ul className="space-y-1 text-slate-400 pl-4 list-disc font-light">
                  <li><strong>Tarefa 1:</strong> Cadê a Água (H2)</li>
                  <li><strong>Tarefa 2:</strong> Curupira e Amigos (H3)</li>
                  <li><strong>Bloco de Itens:</strong> Inferências de Crônica</li>
                </ul>
              </div>

              <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-2 rounded-[4px] border border-emerald-500/20">
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>Tarefas mapeadas ao currículo!</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 space-y-2">
             <Button
               onClick={() => triggerToast("IA está reorganizando o banco de itens...")}
               variant="secondary"
               appearance="solid"
               size="sm"
               iconLeft={<RefreshCw />}
               uppercase={true}
               className="w-full"
             >
               Regenerar Estrutura
             </Button>
          </div>
        </div>

        {/* Coluna Direita: Item Preview */}
        <div className={`lg:col-span-2 rounded-[4px] border p-6 flex flex-col justify-between min-h-[440px] shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
          <div>
            <div className="flex justify-between items-center border-b pb-3 mb-5" style={{ borderColor: isDarkMode ? (colors?.neutral?.[5] || '#334155') : '#F1F5F9' }}>
              <div>
                <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205 uppercase tracking-wide">Estrutura Básica da Prova de Reforço</h4>
                <p className="text-[11px] text-slate-400 mt-1">Questões selecionadas automaticamente com foco na defasagem.</p>
              </div>
              <span className="text-xs text-slate-500">Mapeamento: <strong>3 itens selecionados</strong></span>
            </div>

            <div className="space-y-3">
              {/* Item 1 */}
              <div className={`border rounded-[4px] p-4 flex justify-between items-start ${isDarkMode ? 'bg-slate-955 border-slate-800' : 'bg-slate-55/50 border-slate-200'}`}>
                <div className="pr-4">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tarefa 1 • Habilidade H2</span>
                  <h5 className="text-xs font-bold text-slate-850 dark:text-slate-250 mt-1">Exame Texto "Cadê a Água"</h5>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Leitura crítica baseada em inferência estrutural e decodificação analítica.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="tertiary"
                    appearance="ghost"
                    size="xs"
                    iconOnly={true}
                    iconLeft={<Edit3 />}
                    onClick={() => triggerToast("Editando tarefa...")}
                    className="text-slate-400 hover:text-slate-650"
                  />
                  <Button
                    variant="destructive"
                    appearance="ghost"
                    size="xs"
                    iconOnly={true}
                    iconLeft={<Trash2 />}
                    onClick={() => triggerToast("Excluindo tarefa...")}
                    className="text-rose-500 hover:text-rose-700"
                  />
                </div>
              </div>

              {/* Item 2 */}
              <div className={`border rounded-[4px] p-4 flex justify-between items-start ${isDarkMode ? 'bg-slate-955 border-slate-800' : 'bg-slate-55/50 border-slate-200'}`}>
                <div className="pr-4">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tarefa 2 • Habilidade H3</span>
                  <h5 className="text-xs font-bold text-slate-855 dark:text-slate-255 mt-1">Exame Texto "Curupira e Amigos"</h5>
                  <p className="text-xs text-slate-500 mt-1 leading-relaxed">Análise de intertextualidade literária e sentido figurado.</p>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="tertiary"
                    appearance="ghost"
                    size="xs"
                    iconOnly={true}
                    iconLeft={<Edit3 />}
                    onClick={() => triggerToast("Editando tarefa...")}
                    className="text-slate-400 hover:text-slate-650"
                  />
                  <Button
                    variant="destructive"
                    appearance="ghost"
                    size="xs"
                    iconOnly={true}
                    iconLeft={<Trash2 />}
                    onClick={() => triggerToast("Excluindo tarefa...")}
                    className="text-rose-500 hover:text-rose-700"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Footer buttons */}
          <div className="border-t pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: isDarkMode ? (colors?.neutral?.[5] || '#334155') : '#F1F5F9' }}>
            <Button
              onClick={navigateBack}
              variant="tertiary"
              appearance="solid"
              size="md"
              uppercase={true}
            >
              Cancelar
            </Button>
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                onClick={() => triggerToast("Criando versão editável no seu espaço de trabalho!")}
                variant="secondary"
                appearance="solid"
                size="md"
                uppercase={true}
                className="flex-1 sm:flex-none"
              >
                Criar versão editável
              </Button>
              <Button
                onClick={() => {
                  triggerToast("Avaliação atribuída e sincronizada ao diário de classe.");
                  handleNavigate("detalhe-disciplina");
                }}
                variant="primary"
                appearance="solid"
                size="md"
                uppercase={true}
                className="flex-1 sm:flex-none"
              >
                Atribuir a Turma
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditorAvaliacao;
