import React from 'react';
import { LayoutList, ChevronRight } from 'lucide-react';

export default function CascadeBreadcrumb({ leftText, rightText, onLeftClick = null, onRightClick = null }) {
  return (
    <div className="px-[16px] pb-[10px] bg-white shrink-0">
      <div className="bg-[#F8FAFC] border border-neutral-200 rounded-[4px] p-[10px] px-[14px] flex items-center justify-between gap-[8px] text-[13px]">
        <div className="flex items-center gap-[8px] min-w-0 flex-1 justify-between">
          <div className="flex items-center gap-[8px] min-w-0 shrink">
            <LayoutList size={18} className="text-neutral-500 shrink-0" />
            
            {/* Left text (Passo anterior) -> Encolhe e trunca caso o espaço seja reduzido */}
            <span
              onClick={onLeftClick || undefined}
              className={`truncate shrink min-w-0 transition-colors ${
                onLeftClick
                  ? 'text-neutral-600 font-semibold hover:text-neutral-900 hover:underline cursor-pointer'
                  : 'text-neutral-500 font-medium'
              }`}
              title={leftText}
            >
              {leftText}
            </span>

            <ChevronRight size={14} className="text-neutral-400 shrink-0" />
          </div>

          {/* Right text (Turma / Item atual) -> Alinhado à direita, NUNCA truncado (prioridade total) */}
          <span
            onClick={onRightClick || undefined}
            className={`shrink-0 whitespace-nowrap transition-colors ml-1 ${
              rightText === 'Escolhendo...'
                ? 'text-neutral-500 font-semibold italic'
                : onRightClick
                ? 'text-neutral-800 font-bold hover:text-neutral-950 hover:underline cursor-pointer'
                : 'font-bold text-neutral-800'
            }`}
            title={rightText}
          >
            {rightText}
          </span>
        </div>
      </div>
    </div>
  );
}
