import React from 'react';
import { Sparkles, ChevronRight } from 'lucide-react';

const StorytellingBox = ({ storytelling, handleNavigate, triggerToast, isDarkMode }) => {
  return (
    <div className={`rounded-[4px] p-5 text-white flex flex-col justify-between relative overflow-hidden shadow-xs ${isDarkMode ? 'bg-slate-900 border border-slate-850' : 'bg-slate-900'}`}>
      <div>
        <div className="flex items-center gap-1.5 mb-3 bg-white/10 px-2 py-0.5 rounded-[4px] w-max text-[10px] font-bold text-sky-300">
          <Sparkles className="w-3 h-3" /> Sintetizador Pedagógico MAPEAR
        </div>
        <h2 className="text-sm font-bold tracking-tight mb-2 uppercase tracking-wide">
          {storytelling.titulo}
        </h2>
        <p className="text-xs text-slate-300 leading-relaxed font-light mb-4 max-w-xl">
          {storytelling.corpo}
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-white/10 z-10">
        {storytelling.actions.map((act, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (act.actionType === 'toast') triggerToast(act.payload);
              else if (act.actionType === 'navigate') handleNavigate(act.payload.view, act.payload.serie, act.payload.letra);
            }}
            className="px-3.5 py-1.5 bg-white text-slate-950 hover:bg-slate-50 rounded-[4px] text-[10px] font-bold shadow-xs border border-slate-200 flex items-center gap-1.5 transition-all"
          >
            {act.label} <ChevronRight className="w-3 h-3 text-slate-500" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default StorytellingBox;
