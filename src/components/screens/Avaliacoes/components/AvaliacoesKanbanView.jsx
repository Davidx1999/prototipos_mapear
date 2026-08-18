import React, { useState } from 'react';
import { Plus, Copy, ChevronRight, BookOpen, Puzzle, PenLine, AlertTriangle, Calendar } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';
import { CONTENT_MAX_WIDTH_PERCENT } from '../AvaliacoesHubV2';

const TYPE_CHIP_MAP = {
  'Somativa':    'cherry',
  'Diagnóstica': 'oliva',
  'Formativa':   'storm',
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
  'Em edição':    { headerBg: 'bg-[#FBBE77]', headerText: 'text-[#5A3810]', bodyBgLight: 'bg-[#FBBE77]/10', bodyBgDark: 'bg-[#FBBE77]/5' },
  'Programada':   { headerBg: 'bg-[#9EC4FA]', headerText: 'text-[#1E3A8A]', bodyBgLight: 'bg-[#9EC4FA]/10', bodyBgDark: 'bg-[#9EC4FA]/5' },
  'Em aplicação': { headerBg: 'bg-[#B3E6F5]', headerText: 'text-[#164E63]', bodyBgLight: 'bg-[#B3E6F5]/10', bodyBgDark: 'bg-[#B3E6F5]/5' },
  'Em correção':  { headerBg: 'bg-[#D9BBFF]', headerText: 'text-[#4C1D95]', bodyBgLight: 'bg-[#D9BBFF]/10', bodyBgDark: 'bg-[#D9BBFF]/5' },
  'Concluída':    { headerBg: 'bg-[#B8EBAD]', headerText: 'text-[#14532D]', bodyBgLight: 'bg-[#B8EBAD]/10', bodyBgDark: 'bg-[#B8EBAD]/5' },
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
    { id: 'Em edição',    title: 'EM EDIÇÃO' },
    { id: 'Programada',   title: 'PROGRAMADA' },
    { id: 'Em aplicação', title: 'EM APLICAÇÃO' },
    { id: 'Em correção',  title: 'EM CORREÇÃO' },
    { id: 'Concluída',    title: 'CONCLUÍDA' },
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
    <div className={`flex-1 overflow-x-auto p-4 transition-colors ${
      isDarkMode ? 'bg-neutral-7' : 'bg-brand-50/20'
    }`}>
      <div className="mx-auto w-full h-full" style={{ maxWidth: `${CONTENT_MAX_WIDTH_PERCENT}%` }}>
        <div className="flex gap-3 min-w-[1000px] w-full h-full items-start">
        {columns.map((col, cIdx) => {
          const colItems = assessments.filter(a => a.status === col.id);
          const headerInfo = STATUS_HEADER_MAP[col.id];

          return (
            <div 
              key={col.id} 
              className={`flex-1 min-w-[210px] shrink-0 flex flex-col max-h-full rounded-[8px] border overflow-hidden ${
                isDarkMode ? `${headerInfo.bodyBgDark} border-neutral-6` : `${headerInfo.bodyBgLight} border-neutral-2/80 shadow-sm`
              }`}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, col.id)}
            >
              {/* ClickUp Style Status Header */}
              <div className={`p-2.5 px-3 border-b flex items-center justify-between shrink-0 ${headerInfo.headerBg} ${headerInfo.headerText}`}>
                <div className="flex items-center gap-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider">
                    {`${cIdx + 1}. ${col.title}`}
                  </span>
                </div>
                <span className="text-[11px] font-mono font-bold px-2 py-0.5 rounded-full bg-white/40 dark:bg-black/20">
                  {colItems.length}
                </span>
              </div>

              {/* Items Container */}
              <div className="flex-1 overflow-y-auto space-y-2.5 p-2.5">
                {colItems.length === 0 ? (
                  <div className="p-5 text-center text-xs text-neutral-4 border border-dashed border-neutral-3/60 dark:border-neutral-5/60 rounded-[8px] font-medium">
                    Nenhuma avaliação
                  </div>
                ) : (
                  colItems.map(av => {
                    const isSelected = selectedAssessmentId === av.id;
                    const isDragging = draggedItem?.id === av.id;
                    const typeStatus = TYPE_CHIP_MAP[av.type] || 'storm';
                    const blockers = getAssessmentBlockers(av);

                    return (
                      <div
                        key={av.id}
                        draggable
                        onDragStart={(e) => handleDragStart(e, av)}
                        onDragEnd={handleDragEnd}
                        onClick={() => onSelectAssessment(av)}
                        className={`group p-3 rounded-[8px] border transition-all cursor-grab active:cursor-grabbing space-y-2.5 ${
                          isDragging ? 'opacity-50 border-dashed border-brand-500 scale-95' : ''
                        } ${
                          isSelected
                            ? 'border-brand-500 ring-2 ring-brand-500/30 shadow-md bg-brand-50/50 dark:bg-brand-900/20'
                            : isDarkMode
                            ? 'bg-neutral-7 border-neutral-5/80 hover:border-neutral-4 hover:shadow-md'
                            : 'bg-white border-neutral-2 hover:border-brand-300 hover:shadow-md'
                        }`}
                      >
                        {/* Header: Code + Type + Duplicate */}
                        <div className="flex items-center justify-between gap-1">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <Chips label={av.code} status="storm" variant="dark" />
                            <Chips label={av.type} status={typeStatus} variant="dark" />
                          </div>
                          <Button
                            variant="tertiary"
                            appearance="ghost"
                            size="xs"
                            iconOnly
                            iconLeft={<Copy size={13} />}
                            onClick={(e) => { e.stopPropagation(); onDuplicate(av); }}
                            title="Duplicar Avaliação"
                          />
                        </div>

                        {/* Title & Metadata */}
                        <div>
                          <h4 className="font-bold text-xs text-neutral-8 dark:text-white leading-snug line-clamp-2">{av.title}</h4>
                          <div className="text-[11px] text-neutral-5 dark:text-neutral-4 mt-1 font-semibold">{av.municipality} • {av.grade}</div>
                          {av.subjectSummary && (
                            <div className="text-[11px] text-brand-500 mt-0.5 font-semibold truncate">{av.subjectSummary}</div>
                          )}
                          <div className="text-[11px] text-neutral-5 dark:text-neutral-4 mt-1 font-semibold flex items-center gap-1">
                            <Calendar size={12} className="text-brand-500 shrink-0" />
                            <span>{getPeriodLabel(av)}</span>
                          </div>
                        </div>

                        {/* Counts */}
                        <div className="flex items-center gap-1 flex-wrap">
                          <Chips label={`${av.testsCount}T`} status="storm" variant="light" iconLeft={<BookOpen size={11} />} />
                          <Chips label={`${av.tasksCount}Tf`} status="orange" variant="light" iconLeft={<Puzzle size={11} />} />
                          <Chips label={`${av.itemsCount}I`} status="aqua" variant="light" iconLeft={<PenLine size={11} />} />
                        </div>

                        {/* Blockers Alert */}
                        {blockers.length > 0 && (
                          <div className="p-2 rounded-[8px] bg-extended-orange-extraLight/50 dark:bg-extended-orange-dark/20 border border-extended-orange-light/60 text-[11px] text-extended-orange-dark dark:text-extended-orange-light font-bold flex items-start gap-1.5">
                            <AlertTriangle size={13} className="text-extended-orange-base shrink-0 mt-0.5" />
                            <span className="line-clamp-2">Impedido: {blockers[0]}</span>
                          </div>
                        )}

                        {/* Footer / Next Step */}
                        <div className="pt-2 border-t border-neutral-2 dark:border-neutral-5 text-[10px] flex items-center justify-between">
                          <span className="text-neutral-6 dark:text-neutral-3 font-semibold truncate pr-1">{av.nextStep}</span>
                          <ChevronRight size={14} className="text-brand-500 group-hover:translate-x-0.5 transition-transform shrink-0" />
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* ClickUp Style Bottom Action "+ Adicionar Avaliação" on EVERY Column */}
              <div className={`p-2 border-t shrink-0 ${isDarkMode ? 'border-neutral-5/60 bg-neutral-7/20' : 'border-neutral-2/60 bg-white/40'}`}>
                <Button
                  variant="tertiary"
                  appearance="ghost"
                  size="xs"
                  iconLeft={<Plus size={13} />}
                  onClick={onCreateNew}
                  className="w-full justify-start text-neutral-5 hover:text-brand-500 !px-2"
                >
                  Adicionar Avaliação
                </Button>
              </div>
            </div>
          );
        })}
        </div>
      </div>
    </div>
  );
}
