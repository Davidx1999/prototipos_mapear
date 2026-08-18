import React from 'react';
import { Star, Plus, Eye, Sparkles, User, Brain, Target, Building2, FileText } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';

export default function TaskCard({
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
      className={`group p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between relative ${
        isDarkMode
          ? 'bg-neutral-6 border-neutral-5 hover:border-brand-500/70 hover:shadow-xl hover:shadow-brand-500/5'
          : 'bg-white border-neutral-2 hover:border-brand-300 hover:shadow-xl hover:shadow-brand-500/10'
      }`}
    >
      <div>
        {/* Top Badges */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 flex-wrap">
            {task.isCurated ? (
              <Chips label="Curado MAPEAR" status="success" variant="dark" iconLeft={<Sparkles size={11} />} />
            ) : (
              <Chips label="Banco Pessoal" status="orange" variant="light" iconLeft={<User size={11} />} />
            )}
            <Chips label={task.subject} status="storm" variant="dark" />
          </div>

          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(task.id); }}
            className="p-1.5 rounded-lg hover:bg-neutral-1 dark:hover:bg-neutral-5 transition-colors text-neutral-4"
            title={isFavorite ? 'Remover dos Favoritos' : 'Favoritar'}
          >
            <Star size={16} className={isFavorite ? 'fill-brand-500 text-brand-500' : ''} />
          </button>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-neutral-8 dark:text-white group-hover:text-brand-500 transition-colors line-clamp-2 leading-snug">
          {task.title}
        </h3>

        {/* Tags & Skill */}
        <div className="mt-3 space-y-2">
          {task.skill && (
            <div className="flex items-center gap-1.5 text-xs text-neutral-6 dark:text-neutral-3">
              <Chips label={task.skill} status="cherry" variant="dark" iconLeft={<Target size={11} />} />
              <span className="truncate">{task.skillDesc}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-xs">
            <Chips label={`Bloom: ${task.cognitiveProcess || 'Compreender'}`} status={cognitiveChip} variant="dark" iconLeft={<Brain size={11} />} />
            {task.itemCompostoMarkdown && (
              <Chips label="Possui Texto Markdown" status="lavender" variant="light" iconLeft={<FileText size={11} />} />
            )}
          </div>
        </div>
      </div>

      {/* Footer Metrics & Actions */}
      <div className="pt-4 mt-4 border-t border-neutral-2 dark:border-neutral-5 flex items-center justify-between gap-2">
        <div className="text-[11px] font-medium text-neutral-4 flex items-center gap-1">
          <Building2 size={13} className="text-brand-500" />
          <span>{task.networkUsageCount || 34} usos na rede</span>
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
