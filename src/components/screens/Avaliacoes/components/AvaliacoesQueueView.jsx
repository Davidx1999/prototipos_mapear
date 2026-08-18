import React from 'react';
import { ArrowRight, Copy, BookOpen, Puzzle, PenLine, Brain, Play, AlertTriangle, Calendar } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';
import { CONTENT_MAX_WIDTH_PERCENT } from '../AvaliacoesHubV2';

/**
 * AvaliacoesQueueView — Visão Fila de Foco
 * 
 * Requisitos atendidos:
 * - Uso estrito do componente oficial `<Chips />` para TODOS os badges e status tags
 * - Uso estrito do componente oficial `<Button />` para todos os botões com alto contraste
 * - Sem opção híbrida de correção
 */

const STATUS_CHIP_MAP = {
  'Em edição':    { status: 'orange',   variant: 'dark', border: 'border-l-extended-orange-base' },
  'Programada':   { status: 'storm',    variant: 'dark', border: 'border-l-extended-storm-base' },
  'Em aplicação': { status: 'primary',  variant: 'dark', border: 'border-l-extended-aqua-base' },
  'Em correção':  { status: 'lavender', variant: 'dark', border: 'border-l-extended-lavender-base' },
  'Concluída':    { status: 'success',  variant: 'dark', border: 'border-l-semantic-success-base' },
};

const TYPE_CHIP_MAP = {
  'Somativa':    'cherry',
  'Diagnóstica': 'oliva',
  'Formativa':   'storm',
};

const COGNITIVE_CHIP_MAP = {
  'Conhecer':    'oliva',
  'Compreender': 'oliva',
  'Aplicar':     'orange',
  'Analisar':    'storm',
  'Avaliar':     'lavender',
  'Criar':       'cherry',
};

const getAssessmentBlockers = (av) => {
  const tests = av.testsTree || [];
  const tasks = tests.flatMap(t => t.tasks || []);
  const items = tasks.flatMap(tf => tf.items || []);
  return av.blockers?.length ? av.blockers : [
    tests.length === 0 && 'nenhum teste criado',
    tests.some(t => !(t.tasks || []).length) && 'teste sem tarefas',
    tasks.some(tf => !(tf.items || []).length) && 'tarefa sem itens',
    items.some(item => !item.skill) && 'item sem habilidade associada',
    av.startDate && av.endDate && new Date(av.endDate) < new Date(av.startDate) && 'prazo inválido',
  ].filter(Boolean);
};

const getPeriodLabel = (av) => {
  if (av.startDate && av.endDate) return `${av.startDate} a ${av.endDate}`;
  if (av.startDate) return `Início: ${av.startDate}`;
  if (av.correctionDeadline) return `Correção até ${av.correctionDeadline}`;
  return av.schoolYear || 'Período não definido';
};

export default function AvaliacoesQueueView({
  assessments = [],
  onSelectAssessment,
  onDuplicate,
  onUpdateStatus,
  selectedAssessmentId,
  isDarkMode
}) {
  const queueGroups = [
    {
      id: 'action_required',
      title: 'Ação Imediata Necessária',
      description: 'Avaliações em edição aguardando composição, gabarito ou aprovação para avançar.',
      headerGradient: 'from-extended-orange-extraLight/80 to-transparent dark:from-extended-orange-dark/30 dark:to-transparent',
      borderColor: 'border-extended-orange-light dark:border-extended-orange-dark/40',
      dotColor: 'bg-extended-orange-base',
      items: assessments.filter(a => a.status === 'Em edição')
    },
    {
      id: 'ready_to_launch',
      title: 'Prontas para Programação & Aplicação',
      description: 'Edição concluída. Prontas para agendamento e alocação nas turmas do município.',
      headerGradient: 'from-extended-storm-extraLight/80 to-transparent dark:from-extended-storm-dark/30 dark:to-transparent',
      borderColor: 'border-extended-storm-light dark:border-extended-storm-dark/40',
      dotColor: 'bg-extended-storm-base',
      items: assessments.filter(a => a.status === 'Programada' || a.status === 'Em aplicação')
    },
    {
      id: 'in_correction',
      title: 'Fila de Correção & Devolutivas',
      description: 'Testes aplicados aguardando digitalização HTR/IA ou revisão manual.',
      headerGradient: 'from-extended-lavender-extraLight/80 to-transparent dark:from-extended-lavender-dark/30 dark:to-transparent',
      borderColor: 'border-extended-lavender-light dark:border-extended-lavender-dark/40',
      dotColor: 'bg-extended-lavender-base',
      items: assessments.filter(a => a.status === 'Em correção')
    },
    {
      id: 'completed',
      title: 'Concluídas & Relatórios Liberados (Histórico)',
      description: 'Avaliações finalizadas integradas com relatórios e intervenção pedagógica.',
      headerGradient: 'from-semantic-success-extraLight/80 to-transparent dark:from-semantic-success-dark/30 dark:to-transparent',
      borderColor: 'border-semantic-success-light dark:border-semantic-success-dark/40',
      dotColor: 'bg-semantic-success-base',
      items: assessments.filter(a => a.status === 'Concluída')
    }
  ];

  const getDominantCognitive = (av) => {
    const processes = [];
    av.testsTree?.forEach(t => t.tasks?.forEach(tf => {
      if (tf.cognitiveProcess) processes.push(tf.cognitiveProcess);
    }));
    return processes[0] || null;
  };

  return (
    <div className={`flex-1 overflow-y-auto p-6 transition-colors ${
      isDarkMode ? 'bg-neutral-7' : 'bg-brand-50/30'
    }`}>
      <div className="mx-auto w-full space-y-8" style={{ maxWidth: `${CONTENT_MAX_WIDTH_PERCENT}%` }}>
      {queueGroups.map(group => {
        if (group.items.length === 0) return null;
        return (
          <section key={group.id} className="space-y-4">
            <div className={`rounded-[8px] p-4 bg-gradient-to-r ${group.headerGradient} border ${group.borderColor}`}>
              <h3 className="font-bold text-sm tracking-wide text-neutral-8 dark:text-white flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full ${group.dotColor} shadow-sm`} />
                {group.title}
                <span className="text-xs px-2.5 py-0.5 rounded-full font-mono bg-white dark:bg-neutral-6 text-neutral-8 dark:text-white font-bold shadow-sm border border-neutral-2 dark:border-neutral-5">
                  {group.items.length}
                </span>
              </h3>
              <p className="text-xs text-neutral-6 dark:text-neutral-3 mt-1 font-medium">{group.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {group.items.map(av => {
                const isSelected = selectedAssessmentId === av.id;
                const statusInfo = STATUS_CHIP_MAP[av.status] || STATUS_CHIP_MAP['Em edição'];
                const typeStatus = TYPE_CHIP_MAP[av.type] || 'storm';
                const dominantCog = getDominantCognitive(av);
                const blockers = getAssessmentBlockers(av);

                return (
                  <div
                    key={av.id}
                    onClick={() => onSelectAssessment(av)}
                    className={`group relative rounded-[8px] border-l-4 ${statusInfo.border} border border-neutral-2 dark:border-neutral-5 p-5 transition-all cursor-pointer flex flex-col justify-between ${
                      isSelected
                        ? 'ring-2 ring-brand-500 shadow-xl bg-brand-50 dark:bg-brand-900/30'
                        : isDarkMode
                        ? 'bg-neutral-6 hover:shadow-lg hover:border-neutral-4'
                        : 'bg-white hover:shadow-lg hover:border-brand-300'
                    }`}
                  >
                    <div>
                      {/* Code + Official Chips */}
                      <div className="flex items-start justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2 flex-wrap">
                          <Chips label={av.code} status="storm" variant="dark" />
                          <Chips label={av.type} status={typeStatus} variant="dark" />
                          {av.schoolYear && (
                            <Chips label={av.schoolYear} status="neutral" variant="stroked" />
                          )}
                        </div>
                        <Button
                          variant="tertiary"
                          appearance="solid"
                          size="xs"
                          iconOnly
                          iconLeft={<Copy size={14} />}
                          onClick={(e) => { e.stopPropagation(); onDuplicate(av); }}
                          title="Duplicar Avaliação"
                        />
                      </div>

                      {/* Title & Scope */}
                      <div className="space-y-1 mb-4">
                        <h4 className="font-bold text-base text-neutral-8 dark:text-white group-hover:text-brand-500 transition-colors leading-snug line-clamp-2">
                          {av.title}
                        </h4>
                        <div className="text-xs text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 flex-wrap">
                          <span className="font-bold text-neutral-8 dark:text-neutral-2">{av.municipality}</span>
                          <span>•</span>
                          <span>{av.grade}</span>
                          <span>•</span>
                          <span className="font-semibold text-brand-500">{av.subjectSummary || av.subject}</span>
                        </div>
                        <div className="text-xs text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 mt-1">
                          <Calendar size={13} className="text-brand-500" />
                          <span>{getPeriodLabel(av)}</span>
                        </div>
                      </div>

                      {/* Hierarchy Progress Chips */}
                      <div className="flex items-center gap-2 text-xs font-bold p-2.5 rounded-[8px] bg-neutral-1 dark:bg-neutral-5/30 mb-4 flex-wrap">
                        <Chips label={`${av.testsCount} Testes`} status="storm" variant="light" iconLeft={<BookOpen />} />
                        <Chips label={`${av.tasksCount} Tarefas`} status="orange" variant="light" iconLeft={<Puzzle />} />
                        <Chips label={`${av.itemsCount} Itens`} status="aqua" variant="light" iconLeft={<PenLine />} />
                      </div>

                      {/* Pedagogical Chips */}
                      <div className="flex items-center gap-2 flex-wrap mb-4">
                        {dominantCog && (
                          <Chips label={`Cognitivo: ${dominantCog}`} status={COGNITIVE_CHIP_MAP[dominantCog] || 'oliva'} variant="light" iconLeft={<Brain />} />
                        )}
                        {av.correctionMethod && (
                          <Chips label={av.correctionMethod} status="neutral" variant="light" />
                        )}
                      </div>

                      {blockers.length > 0 && (
                        <div className="p-2.5 rounded-[8px] bg-extended-orange-extraLight/50 dark:bg-extended-orange-dark/20 border border-extended-orange-light/60 text-xs text-extended-orange-dark dark:text-extended-orange-light font-bold flex items-start gap-2 mb-4">
                          <AlertTriangle size={14} className="text-extended-orange-base shrink-0 mt-0.5" />
                          <span>Esta avaliação não pode ser publicada: {blockers[0]}</span>
                        </div>
                      )}
                    </div>

                    {/* Bottom CTA using official Button */}
                    <div className="pt-3 border-t border-neutral-2 dark:border-neutral-5 flex items-center justify-between">
                      <div className="flex items-center gap-1.5 text-xs text-neutral-7 dark:text-neutral-2 font-semibold min-w-0 pr-2">
                        <Play size={13} className="text-brand-500 shrink-0" />
                        <span className="truncate">{av.nextStep}</span>
                      </div>
                      
                      <Button
                        variant="primary"
                        appearance="solid"
                        size="xs"
                        iconRight={<ArrowRight size={14} />}
                        onClick={(e) => { e.stopPropagation(); onSelectAssessment(av); }}
                      >
                        Inspecionar
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        );
      })}
      </div>
    </div>
  );
}
