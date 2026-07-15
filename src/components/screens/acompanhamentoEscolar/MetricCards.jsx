import React from 'react';

const MetricCards = ({ currentMetrics, isDarkMode }) => {
  return (
    <div className={`rounded-[4px] p-5 border flex flex-col justify-between shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
      <div>
        <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wide mb-3">Saúde Curricular Geral</h3>
        <div className="space-y-4">
          {/* Suficiência */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Alunos no Nível Suficiente</span>
              <span className="font-bold text-emerald-600 dark:text-emerald-450">{currentMetrics.suf}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-[4px] h-1.5">
              <div className="bg-emerald-500 h-1.5 rounded-[4px] transition-all duration-300" style={{ width: `${currentMetrics.suf}%` }}></div>
            </div>
          </div>

          {/* Participação */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Participação nas Avaliações</span>
              <span className="font-bold text-blue-600 dark:text-sky-400">{currentMetrics.part}%</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-[4px] h-1.5">
              <div className="bg-blue-500 h-1.5 rounded-[4px] transition-all duration-300" style={{ width: `${currentMetrics.part}%` }}></div>
            </div>
          </div>

          {/* Alunos Críticos */}
          <div>
            <div className="flex justify-between items-center text-xs mb-1">
              <span className="font-semibold text-slate-600 dark:text-slate-400">Alunos Críticos</span>
              <span className="font-bold text-rose-600 dark:text-rose-455">{currentMetrics.risk} alunos</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-[4px] h-1.5">
              <div className="bg-rose-500 h-1.5 rounded-[4px] transition-all duration-300" style={{ width: `${Math.min(100, (currentMetrics.risk / 20) * 100)}%` }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricCards;
