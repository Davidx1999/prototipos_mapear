import React from 'react';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  FileText,
  BookMarked,
  BookOpenText,
  Paperclip,
  Brain,
  Sparkles,
  ArrowRight,
  ClipboardCheck,
  Target
} from 'lucide-react';
import Button from '../../../../ui/Button';
import Chips from '../../../../ui/Chips';

const TYPE_CHIP_MAP = {
  'Somativa': 'cherry',
  'Diagnóstica': 'oliva',
  'Formativa': 'storm',
};

const AssessmentReviewModal = ({
  isOpen,
  onClose,
  assessment,
  pendencies = [],
  onNavigateToItem,
  onCompleteAssessment,
  isDarkMode = false
}) => {
  if (!isOpen || !assessment) return null;

  const tests = assessment.tests || [];
  const tasks = tests.flatMap(t => t.tasks || []);
  const items = tasks.flatMap(tf => tf.items || []);

  const totalTests = tests.length;
  const totalTasks = tasks.length;
  const totalItems = items.length;

  const hasCriticalPendencies = pendencies.length > 0;

  // Aggregate pedagogical coverage
  const skillsCovered = [...new Set(items.map(it => it.habilidadeBNCC?.id).filter(Boolean))];
  const cognitiveProcesses = [...new Set(items.flatMap(it => it.processosCognitivosSentenca || []).filter(Boolean))];

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in"
      onClick={onClose}
    >
      <div
        className={`w-full max-w-4xl max-h-[90vh] rounded-[8px] border shadow-2xl flex flex-col overflow-hidden font-['Montserrat',sans-serif] ${
          isDarkMode ? 'bg-neutral-850 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className={`p-5 px-6 border-b flex items-center justify-between shrink-0 ${
          isDarkMode ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-50/80 border-neutral-200'
        }`}>
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-[8px] flex items-center justify-center ${
              hasCriticalPendencies
                ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
            }`}>
              {hasCriticalPendencies ? <ClipboardCheck size={22} /> : <ShieldCheck size={22} />}
            </div>
            <div>
              <h2 className="text-base font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
                Revisão e Validação da Avaliação
              </h2>
              <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-0.5">
                Consolidação pedagógica, verificação de integridade e prontidão do instrumento.
              </p>
            </div>
          </div>

          <Button
            variant="tertiary"
            appearance="ghost"
            size="xs"
            iconOnly
            iconLeft={<X size={16} />}
            onClick={onClose}
            title="Fechar (Esc)"
          />
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">

          {/* 1. Header de Identificação do Instrumento */}
          <div className={`p-4 rounded-[8px] border flex flex-col md:flex-row md:items-center justify-between gap-4 ${
            isDarkMode ? 'bg-neutral-800/40 border-neutral-700' : 'bg-neutral-50/60 border-neutral-200/80'
          }`}>
            <div className="flex flex-col gap-1.5 min-w-0 flex-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-mono text-xs font-bold text-[#0078B0] bg-[#0078B0]/10 px-2.5 py-0.5 rounded-[4px]">
                  {assessment.code || 'AV-2026'}
                </span>
                <Chips
                  label={assessment.type || 'Somativa'}
                  status={TYPE_CHIP_MAP[assessment.type] || 'cherry'}
                  variant="stroked"
                  className="!text-neutral-7 dark:!text-neutral-2"
                />
                <span className="text-xs text-neutral-400 font-medium">
                  {assessment.grade || '5º Ano'} • {assessment.subject || 'Língua Portuguesa'} • Ano {assessment.schoolYear || '2026'}
                </span>
              </div>
              <h3 className="text-base font-bold text-neutral-900 dark:text-white truncate">
                {assessment.title || 'Nova Avaliação'}
              </h3>
            </div>

            {/* Status de Prontidão Badge */}
            <div className="shrink-0 flex items-center">
              {hasCriticalPendencies ? (
                <div className="px-3 py-1.5 rounded-[6px] bg-amber-500/10 border border-amber-500/30 text-amber-700 dark:text-amber-300 flex items-center gap-2 text-xs font-bold">
                  <AlertTriangle size={15} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{pendencies.length} pendência(s) a resolver</span>
                </div>
              ) : (
                <div className="px-3 py-1.5 rounded-[6px] bg-emerald-500/10 border border-emerald-500/30 text-emerald-700 dark:text-emerald-300 flex items-center gap-2 text-xs font-bold">
                  <CheckCircle2 size={15} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Pronta para programação</span>
                </div>
              )}
            </div>
          </div>

          {/* 2. Métricas Estruturais */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className={`p-4 rounded-[8px] border flex items-center gap-3.5 ${
              isDarkMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-white border-neutral-200'
            }`}>
              <div className="w-10 h-10 rounded-[6px] bg-[#0078B0]/10 text-[#0078B0] flex items-center justify-center shrink-0">
                <BookMarked size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Cadernos de Teste
                </span>
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {totalTests} {totalTests === 1 ? 'Caderno' : 'Cadernos'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-[8px] border flex items-center gap-3.5 ${
              isDarkMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-white border-neutral-200'
            }`}>
              <div className="w-10 h-10 rounded-[6px] bg-neutral-100 dark:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center justify-center shrink-0">
                <BookOpenText size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Tarefas Pedagógicas
                </span>
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {totalTasks} {totalTasks === 1 ? 'Tarefa' : 'Tarefas'}
                </span>
              </div>
            </div>

            <div className={`p-4 rounded-[8px] border flex items-center gap-3.5 ${
              isDarkMode ? 'bg-neutral-800/60 border-neutral-700' : 'bg-white border-neutral-200'
            }`}>
              <div className="w-10 h-10 rounded-[6px] bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                <Paperclip size={20} />
              </div>
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400 block">
                  Itens Avaliativos
                </span>
                <span className="text-lg font-bold text-neutral-900 dark:text-white">
                  {totalItems} {totalItems === 1 ? 'Item' : 'Itens'}
                </span>
              </div>
            </div>
          </div>

          {/* 3. Diagnóstico e Checklist de Integridade */}
          <div className={`p-5 rounded-[8px] border space-y-3 ${
            isDarkMode ? 'bg-neutral-800/40 border-neutral-700' : 'bg-white border-neutral-200'
          }`}>
            <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-700 dark:text-neutral-300 flex items-center gap-2">
              <ClipboardCheck size={16} className="text-[#0078B0]" />
              Checklist de Integridade do Instrumento
            </h4>

            {pendencies.length === 0 ? (
              <div className="p-4 rounded-[6px] bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800 text-xs text-emerald-800 dark:text-emerald-300 flex items-center gap-2.5">
                <CheckCircle2 size={18} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                <div>
                  <span className="font-bold block">Todos os critérios técnicos e pedagógicos foram atendidos!</span>
                  <span className="text-[11px] text-emerald-700 dark:text-emerald-400">
                    Todos os cadernos possuem tarefas, itens cadastrados, gabaritos e habilidades mapeadas.
                  </span>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-neutral-500">
                  Os seguintes pontos precisam de atenção antes que o instrumento possa ser finalizado e programado:
                </p>
                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {pendencies.map((pend, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 px-3 rounded-[6px] bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/40 flex items-center justify-between text-xs gap-3"
                    >
                      <div className="flex items-center gap-2 min-w-0 flex-1">
                        <AlertTriangle size={14} className="text-amber-600 dark:text-amber-400 shrink-0" />
                        <span className="font-semibold text-neutral-800 dark:text-neutral-200 truncate">
                          {pend.message}
                        </span>
                        {pend.location && (
                          <span className="text-[11px] text-neutral-400 shrink-0">
                            • {pend.location}
                          </span>
                        )}
                      </div>

                      {pend.itemTarget && (
                        <button
                          type="button"
                          onClick={() => {
                            onNavigateToItem(pend.itemTarget);
                            onClose();
                          }}
                          className="text-[11px] font-bold text-[#0078B0] hover:underline flex items-center gap-1 shrink-0 cursor-pointer"
                        >
                          Resolver <ArrowRight size={12} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* 4. Matriz Pedagógica de Saberes e Cognição */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Habilidades Cobertas */}
            <div className={`p-4 rounded-[8px] border space-y-2.5 ${
              isDarkMode ? 'bg-neutral-800/40 border-neutral-700' : 'bg-neutral-50/40 border-neutral-200'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Target size={14} className="text-[#0078B0]" />
                Habilidades BNCC Cobertas ({skillsCovered.length})
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-28 overflow-y-auto">
                {skillsCovered.length > 0 ? (
                  skillsCovered.map((sk, idx) => (
                    <span
                      key={idx}
                      className="font-mono text-[10px] font-bold px-2 py-0.5 rounded-[4px] bg-[#0078B0]/10 text-[#0078B0]"
                    >
                      {sk}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-400 italic">Nenhuma habilidade associada aos itens.</span>
                )}
              </div>
            </div>

            {/* Processos Cognitivos */}
            <div className={`p-4 rounded-[8px] border space-y-2.5 ${
              isDarkMode ? 'bg-neutral-800/40 border-neutral-700' : 'bg-neutral-50/40 border-neutral-200'
            }`}>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                <Brain size={14} className="text-[#0078B0]" />
                Processos Cognitivos Identificados ({cognitiveProcesses.length})
              </span>
              <div className="flex flex-wrap gap-1.5 pt-1 max-h-28 overflow-y-auto">
                {cognitiveProcesses.length > 0 ? (
                  cognitiveProcesses.map((cp, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded-[4px] bg-neutral-200/80 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-200"
                    >
                      {cp}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-neutral-400 italic">Nenhum processo cognitivo registrado.</span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 px-6 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 ${
          isDarkMode ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
        }`}>
          <p className="text-xs text-neutral-500 dark:text-neutral-400">
            {hasCriticalPendencies
              ? 'Resolva as pendências obrigatórias para poder finalizar a edição do instrumento.'
              : 'O instrumento está pedagogicamente completo e pronto para sair do modo de edição.'}
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="tertiary"
              appearance="solid"
              size="sm"
              onClick={onClose}
            >
              Continuar Editando
            </Button>

            <Button
              variant="primary"
              appearance="solid"
              size="sm"
              iconLeft={<CheckCircle2 size={15} />}
              disabled={hasCriticalPendencies}
              onClick={() => {
                onCompleteAssessment?.();
                onClose();
              }}
              className="font-bold"
              title={hasCriticalPendencies ? 'Resolva as pendências para concluir' : 'Concluir edição da avaliação'}
            >
              Concluir Edição da Avaliação
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssessmentReviewModal;
