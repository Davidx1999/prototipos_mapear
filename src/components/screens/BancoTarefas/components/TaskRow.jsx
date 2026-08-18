import React from 'react';
import { Star, Plus, Eye, Sparkles, User, Brain, Target, Building2, BookOpen } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';

export default function TaskRow({
  task,
  onSelect,
  onInsert,
  onToggleFavorite,
  isFavorite,
  isDarkMode
}) {
  const cognitiveChip = {
    'Conhecer': 'oliva',
    'Compreender': 'oliva',
    'Aplicar': 'orange',
    'Analisar': 'storm',
    'Avaliar': 'lavender',
    'Criar': 'cherry'
  }[task.cognitiveProcess] || 'oliva';

  return (
    <div
      onClick={() => onSelect(task)}
      className={`p-3.5 rounded-xl border flex items-center justify-between gap-4 transition-all cursor-pointer ${
        isDarkMode
          ? 'bg-neutral-6 border-neutral-5 hover:border-brand-500/50 hover:bg-neutral-5/40'
          : 'bg-white border-neutral-2 hover:border-brand-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-center gap-3 min-w-0 flex-1">
        <button
          onClick={(e) => { e.stopPropagation(); onToggleFavorite(task.id); }}
          className="p-1 text-neutral-4 hover:text-brand-500 transition-colors shrink-0"
        >
          <Star size={16} className={isFavorite ? 'fill-brand-500 text-brand-500' : ''} />
        </button>

        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 flex-wrap">
            {task.isCurated ? (
              <Chips label="Curado" status="success" variant="dark" iconLeft={<Sparkles size={10} />} />
            ) : (
              <Chips label="Pessoal" status="orange" variant="light" iconLeft={<User size={10} />} />
            )}
            <Chips label={task.subject} status="storm" variant="dark" />
            <Chips label={task.grade} status="neutral" variant="stroked" />
            {task.skill && <Chips label={task.skill} status="cherry" variant="dark" iconLeft={<Target size={10} />} />}
            <Chips label={task.cognitiveProcess || 'Compreender'} status={cognitiveChip} variant="dark" iconLeft={<Brain size={10} />} />
          </div>

          <h4 className="text-xs font-bold text-neutral-8 dark:text-white truncate">{task.title}</h4>
        </div>
      </div>

      <div className="flex items-center gap-4 shrink-0">
        <div className="text-[11px] font-medium text-neutral-4 flex items-center gap-1 hidden md:flex">
          <Building2 size={13} className="text-brand-500" />
          <span>{task.networkUsageCount || 28} usos</span>
        </div>

        <div className="flex items-center gap-1.5">
          <Button
            variant="tertiary"
            appearance="solid"
            size="xs"
            iconLeft={<Eye size={13} />}
            onClick={(e) => { e.stopPropagation(); onSelect(task); }}
          >
            Ver
          </Button>

          {onInsert && (
            <Button
              variant="primary"
              appearance="solid"
              size="xs"
              iconLeft={<Plus size={13} />}
              onClick={(e) => { e.stopPropagation(); onInsert(task); }}
            >
              Inserir
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
