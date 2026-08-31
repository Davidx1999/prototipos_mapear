import React from 'react';
import { Bookmark, BookMarked, BookOpenText, Route, Paperclip, Brain, Target } from 'lucide-react';

/**
 * EntityLegendBar — Barra de legenda cromática sutil (Heurística H6 de Nielsen)
 * Limpa, minimalista, integrada sem borda ou container pesado.
 */
const ENTITY_LEGEND = [
  { label: 'Avaliação',       icon: Bookmark,     colorDot: 'bg-brand-500',              textColor: 'text-brand-700 dark:text-brand-300' },
  { label: 'Teste',           icon: BookMarked,   colorDot: 'bg-extended-storm-base',    textColor: 'text-extended-storm-dark dark:text-extended-storm-light' },
  { label: 'Tarefa',          icon: BookOpenText, colorDot: 'bg-extended-orange-base',   textColor: 'text-extended-orange-dark dark:text-extended-orange-light' },
  { label: 'Item Composto',   icon: Route,        colorDot: 'bg-extended-lavender-base', textColor: 'text-extended-lavender-dark dark:text-extended-lavender-light' },
  { label: 'Item',            icon: Paperclip,    colorDot: 'bg-extended-aqua-base',     textColor: 'text-extended-aqua-dark dark:text-extended-aqua-light' },
  { label: 'Cognitivo',       icon: Brain,        colorDot: 'bg-extended-oliva-base',    textColor: 'text-extended-oliva-dark dark:text-extended-oliva-light' },
  { label: 'Habilidade',      icon: Target,       colorDot: 'bg-extended-cherry-base',   textColor: 'text-extended-cherry-dark dark:text-extended-cherry-light' },
];

export default function EntityLegendBar({ isDarkMode }) {
  return (
    <div className="flex items-center gap-3.5 flex-wrap text-xs py-0.5">
      <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-4 select-none">
        Legenda Hierárquica:
      </span>
      <div className="flex items-center gap-3 flex-wrap">
        {ENTITY_LEGEND.map(({ label, icon: Icon, colorDot, textColor }) => (
          <div
            key={label}
            className={`flex items-center gap-1.5 font-semibold text-[11px] ${textColor} transition-opacity hover:opacity-100 opacity-90`}
            title={`Representação cromática: ${label}`}
          >
            <span className={`w-2 h-2 rounded-full ${colorDot} shrink-0`} />
            <Icon size={13} className="shrink-0" />
            <span>{label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
