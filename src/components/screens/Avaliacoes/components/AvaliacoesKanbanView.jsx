import React, { useState } from 'react';
import { Plus, Copy, ChevronRight, BookMarked, BookOpenText, Paperclip, Route, Bookmark, AlertTriangle, Calendar, CheckCircle2 } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';
import { CONTENT_MAX_WIDTH_PERCENT } from '../AvaliacoesHubV2';

const TYPE_CHIP_MAP = {
  'Somativa': 'cherry',
  'Diagnóstica': 'oliva',
  'Formativa': 'storm',
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

const STATUS_HEADER_MAP = {
  'Em edição': { headerBg: 'bg-[#FBBE77]', headerText: 'text-[#5A3810]', bodyBgLight: 'bg-[#FBBE77]/10', bodyBgDark: 'bg-[#FBBE77]/5' },
  'Programada': { headerBg: 'bg-[#9EC4FA]', headerText: 'text-[#1E3A8A]', bodyBgLight: 'bg-[#9EC4FA]/10', bodyBgDark: 'bg-[#9EC4FA]/5' },
  'Em aplicação': { headerBg: 'bg-[#B3E6F5]', headerText: 'text-[#164E63]', bodyBgLight: 'bg-[#B3E6F5]/10', bodyBgDark: 'bg-[#B3E6F5]/5' },
  'Aplicação encerrada': { headerBg: 'bg-[#FCA5A5]', headerText: 'text-[#7F1D1D]', bodyBgLight: 'bg-[#FCA5A5]/10', bodyBgDark: 'bg-[#FCA5A5]/5' },
  'Em correção': { headerBg: 'bg-[#D9BBFF]', headerText: 'text-[#4C1D95]', bodyBgLight: 'bg-[#D9BBFF]/10', bodyBgDark: 'bg-[#D9BBFF]/5' },
  'Concluída': { headerBg: 'bg-[#B8EBAD]', headerText: 'text-[#14532D]', bodyBgLight: 'bg-[#B8EBAD]/10', bodyBgDark: 'bg-[#B8EBAD]/5' },
};

export default function AvaliacoesKanbanView({
  assessments = [],
  onSelectAssessment,
  onDuplicate,
  onUpdateStatus,
  onCreateNew,
  selectedAssessmentId,
  isDarkMode
}) {
  const [draggedItem, setDraggedItem] = useState(null);

  const columns = [
    { id: 'Em edição', title: 'EM EDIÇÃO' },
    { id: 'Programada', title: 'PROGRAMADA' },
    { id: 'Em aplicação', title: 'EM APLICAÇÃO' },
    { id: 'Aplicação encerrada', title: 'APLICAÇÃO ENCERRADA' },
    { id: 'Em correção', title: 'EM CORREÇÃO' },
    { id: 'Concluída', title: 'CONCLUÍDA' },
  ];

  const handleDragStart = (e, av) => {
    setDraggedItem(av);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e, newStatus) => {
    e.preventDefault();
    if (draggedItem && draggedItem.status !== newStatus) {
      onUpdateStatus(draggedItem.id, newStatus);
    }
    setDraggedItem(null);
  };

  return (
    <div className={`flex-1 overflow-x-auto p-4 transition-colors ${isDarkMode ? 'bg-neutral-7' : 'bg-brand-50/20'
      }`}>
      <div className="flex gap-4 h-full items-start w-max min-w-full mx-auto pb-4" style={{ paddingLeft: `${(100 - CONTENT_MAX_WIDTH_PERCENT) / 2}%`, paddingRight: `${(100 - CONTENT_MAX_WIDTH_PERCENT) / 2}%` }}>
        {columns.map((col, cIdx) => {
          const colItems = assessments.filter(a => a.status === col.id);
          const headerInfo = STATUS_HEADER_MAP[col.id] || STATUS_HEADER_MAP['Em edição'];
          const isInitialStage = col.id === 'Em edição';

          return (
            <div
              key={col.id}
              className={`w-[280px] shrink-0 flex flex-col max-h-full h-fit rounded-[8px] border overflow-hidden transition-all ${isDarkMode ? `${headerInfo.bodyBgDark} border-neutral-6` : `${headerInfo.bodyBgLight} border-neutral-2/80 shadow-sm`
                }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* Kanban Column Status Header */}
              <div className={`p-2.5 px-3 border-b flex items-center justify-between shrink-0 ${headerInfo.headerBg} ${headerInfo.headerText}`}>
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="text-[10px] uppercase font-bold tracking-wider truncate">
                    {`${cIdx + 1}. ${col.title}`}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/40 dark:bg-black/20 shrink-0">
                  {colItems.length}
                </span>
              </div>

              {/* Items Container */}
              <div className="flex-1 min-h-0 overflow-y-auto space-y-2.5 p-2.5">
                {colItems.length === 0 ? (
                  <div className="p-4 text-center text-xs text-neutral-4 border border-dashed border-neutral-3/60 dark:border-neutral-5/60 rounded-[8px] font-medium flex flex-col items-center justify-center gap-1 min-h-[100px]">
                    <span>Nenhuma avaliação</span>
                    {isInitialStage && (
                      <span className="text-[10px] text-neutral-5">Clique abaixo para criar</span>
                    )}
                  </div>
                ) : (
                  colItems.map(av => {
                    const isSelected = selectedAssessmentId === av.id;
                    const isDragging = draggedItem?.id === av.id;
                    const typeStatus = TYPE_CHIP_MAP[av.type] || 'storm';
                    const blockers = getAssessmentBlockers(av);
                    const hasBlockers = blockers.length > 0;

                    return (
                      <div
                        key={av.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, av)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectAssessment(av)}
                        className={`group p-3 rounded-[8px] border transition-all cursor-grab active:cursor-grabbing space-y-2.5 ${isDragging ? 'opacity-50 border-dashed border-brand-500 scale-95' : ''
                          } ${isSelected
                            ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-md bg-brand-50/50 dark:bg-brand-900/20'
                            : isDarkMode
                              ? 'bg-neutral-7 border-neutral-5/80 hover:border-neutral-4 hover:shadow-md'
                              : 'bg-white border-neutral-2 hover:border-brand-300 hover:shadow-md'
                          }`}
                      >
                        {/* 1. Header: Code + Nature/Type + Duplicate Action */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 rounded-[4px] bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                              {av.code}
                            </span>
                            <Chips label={av.type} status={typeStatus} variant="stroked" className="!text-neutral-7 dark:!text-neutral-2" />
                          </div>
                          <Button
                            variant="tertiary"
                            appearance="ghost"
                            size="xs"
                            iconOnly
                            iconLeft={<Copy size={16} />}
                            onClick={(e) => { e.stopPropagation(); onDuplicate(av); }}
                            title="Duplicar Avaliação"
                            className="opacity-70 group-hover:opacity-100"
                          />
                        </div>

                        {/* 2. Title (Strong Visual Hierarchy) */}
                        <div>
                          <h4 className="font-bold text-xs text-neutral-8 dark:text-white leading-snug line-clamp-2">
                            {av.title}
                          </h4>
                          <div className="text-[11px] text-neutral-6 dark:text-neutral-4 mt-1 font-medium flex items-center gap-1 flex-wrap">
                            <span>{av.municipality}</span>
                            <span>•</span>
                            <span>{av.grade}</span>
                          </div>
                          {av.subjectSummary && (
                            <div className="text-[11px] text-brand-600 dark:text-brand-400 mt-0.5 font-medium truncate">
                              {av.subjectSummary}
                            </div>
                          )}
                          <div className="text-[10px] text-neutral-5 dark:text-neutral-4 mt-1 flex items-center gap-1 font-medium">
                            <Calendar size={16} className="text-neutral-4 dark:text-neutral-5 shrink-0" />
                            <span>{getPeriodLabel(av)}</span>
                          </div>
                        </div>

                        {/* 3. Compact Hierarchy Indicators (Neutral Surface) */}
                        <div className="flex items-center gap-1.5 text-[10px] text-neutral-6 dark:text-neutral-3 font-semibold pt-0.5">
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700">
                            <BookMarked size={16} className="text-neutral-5 shrink-0" />
                            {av.testsCount}T
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700">
                            <BookOpenText size={16} className="text-neutral-5 shrink-0" />
                            {av.tasksCount}Tf
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200/80 dark:border-neutral-700">
                            <Paperclip size={16} className="text-neutral-5 shrink-0" />
                            {av.itemsCount}I
                          </span>
                        </div>

                        {/* 4. Aviso de Edições Pendentes */}
                        {hasBlockers && (
                          <div className="p-1.5 px-2 rounded-[4px] bg-extended-orange-extraLight/50 dark:bg-extended-orange-dark/20 border border-extended-orange-light/70 text-[10px] text-extended-orange-dark dark:text-extended-orange-light font-semibold flex items-center gap-1.5">
                            <AlertTriangle size={16} className="text-extended-orange-base shrink-0" />
                            <span>Edições Pendentes</span>
                          </div>
                        )}

                        {/* 5. Contextual Readiness CTAs */}
                        {(
                          (av.status === 'Em edição' && !hasBlockers) ||
                          av.status === 'Programada' ||
                          av.status === 'Aplicação encerrada' ||
                          av.status === 'Em correção'
                        ) && (
                            <div className="pt-2 border-t border-neutral-2 dark:border-neutral-6 flex flex-col gap-2">
                              {/* Em edição - Readiness to Schedule */}
                              {av.status === 'Em edição' && !hasBlockers && (
                                <div className="flex flex-col gap-1.5 p-2 bg-brand-50/80 dark:bg-brand-900/30 rounded-[6px] border border-brand-200 dark:border-brand-800">
                                  <span className="text-[10px] font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Pronta para programar
                                  </span>
                                  <Button
                                    variant="primary"
                                    appearance="solid"
                                    size="1xs"
                                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(av.id, 'Programada'); }}
                                    className="w-full justify-center font-bold"
                                  >
                                    Programar aplicação
                                  </Button>
                                </div>
                              )}

                              {/* Programada - CTA Aplicar */}
                              {av.status === 'Programada' && (
                                <Button
                                  variant="primary"
                                  appearance="solid"
                                  size="1xs"
                                  onClick={(e) => { e.stopPropagation(); onUpdateStatus(av.id, 'Em aplicação'); }}
                                  className="w-full justify-center font-bold"
                                >
                                  Aplicar
                                </Button>
                              )}

                              {/* Aplicação encerrada - Readiness to Correct */}
                              {av.status === 'Aplicação encerrada' && (
                                <div className="flex flex-col gap-1.5 p-2 bg-lavender-50/80 dark:bg-lavender-900/30 rounded-[6px] border border-lavender-200 dark:border-lavender-800">
                                  <span className="text-[10px] font-bold text-lavender-700 dark:text-lavender-300 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Pronta para corrigir
                                  </span>
                                  <Button
                                    variant="primary"
                                    appearance="solid"
                                    size="1xs"
                                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(av.id, 'Em correção'); }}
                                    className="w-full justify-center font-bold"
                                  >
                                    Iniciar correção
                                  </Button>
                                </div>
                              )}

                              {/* Em correção - Readiness to Conclude */}
                              {av.status === 'Em correção' && (
                                <div className="flex flex-col gap-1.5 p-2 bg-success-light/30 dark:bg-success-dark/20 rounded-[6px] border border-success-base/30">
                                  <span className="text-[10px] font-bold text-success-dark dark:text-success-light flex items-center gap-1">
                                    <CheckCircle2 size={12} /> Pronta para concluir
                                  </span>
                                  <Button
                                    variant="primary"
                                    appearance="solid"
                                    size="1xs"
                                    onClick={(e) => { e.stopPropagation(); onUpdateStatus(av.id, 'Concluída'); }}
                                    className="w-full justify-center font-bold"
                                  >
                                    Concluir avaliação
                                  </Button>
                                </div>
                              )}
                            </div>
                          )}
                      </div>
                    );
                  })
                )}
              </div>

              {/* 
                Pipeline entry point rule:
                ONLY "Em edição" column is allowed to have the "+ Nova Avaliação" entry action.
                Other columns are pipeline progression states, not entry points.
              */}
              {isInitialStage && (
                <div className={`p-2 border-t shrink-0 ${isDarkMode ? 'border-neutral-6 bg-neutral-7/40' : 'border-neutral-2/60 bg-white/60'}`}>
                  <Button
                    variant="tertiary"
                    appearance="ghost"
                    size="1xs"
                    iconLeft={<Plus size={14} />}
                    onClick={onCreateNew}
                    className="w-full justify-center font-bold"
                  >
                    Nova Avaliação
                  </Button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
