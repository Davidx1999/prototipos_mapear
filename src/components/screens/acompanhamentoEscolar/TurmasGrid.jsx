import React from 'react';
import { Star, Info } from 'lucide-react';
import Button from '../../ui/Button';

const TurmasGrid = ({
  series,
  letters,
  getTurmaData,
  favorites,
  toggleFavorite,
  handleNavigate,
  renderMatchMomentum,
  isDarkMode,
  colors
}) => {
  return (
    <div className={`rounded-[4px] border p-5 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
      <div className="flex justify-between items-center mb-4">
        <div>
          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Matriz de Saúde das Turmas</h4>
          <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1">Status de proficiência agregada por série e turma.</p>
        </div>
        
        {/* Legenda de Triagem (Nielsen Feedback) */}
        <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-950 p-2 rounded-[4px] border border-slate-100 dark:border-slate-850 flex-wrap">
          <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase flex items-center gap-1">
            <Info className="w-3.5 h-3.5" /> Legenda:
          </span>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-emerald-500" />
            <span className="text-slate-600 dark:text-slate-400">Suficiente (≥ 70%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-amber-500" />
            <span className="text-slate-600 dark:text-slate-400">Parcial (50% - 69%)</span>
          </div>
          <div className="flex items-center gap-1.5 text-[10px] font-bold">
            <span className="w-2.5 h-2.5 rounded-[2px] bg-rose-500 animate-pulse" />
            <span className="text-slate-600 dark:text-slate-400">Insuficiente (&lt; 50%)</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {series.map((s) => {
          const title = s === "1em" ? "1º Ano Ensino Médio" : s === "2em" ? "2º Ano Ensino Médio" : "3º Ano Ensino Médio";
          return (
            <div key={s} className={`rounded-[4px] p-4 border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-800 dark:text-slate-200 border-b pb-2 mb-3 flex items-center justify-between" style={{ borderColor: isDarkMode ? colors?.neutral?.[5] || '#1E293B' : '#F1F5F9' }}>
                <span>{title}</span>
                <span className="text-[10px] text-slate-450 font-normal">Turmas A a H</span>
              </h3>
              <div className="grid grid-cols-1 gap-2">
                {letters.map((letra) => {
                  const t = getTurmaData(s, letra);
                  const isFav = favorites.some(f => f.serie === s && f.letra === letra);
                  
                  let borderClass = isDarkMode ? 'border-slate-800 hover:border-slate-700 bg-slate-900/50' : 'border-slate-202 hover:border-slate-300 bg-white';
                  let badgeColor = "bg-rose-500 animate-pulse";
                  if (t.status === 'suf') {
                    badgeColor = "bg-emerald-500";
                  } else if (t.status === 'par') {
                    badgeColor = "bg-amber-500";
                  }

                  if (isFav) {
                    borderClass = isDarkMode ? 'border-amber-400 bg-amber-955/20 hover:border-amber-500' : 'border-amber-450 bg-amber-50/5 hover:border-amber-500';
                  }

                  return (
                    <div
                      key={letra}
                      onClick={() => handleNavigate("detalhe-turma", s, letra)}
                      className={`border rounded-[4px] p-2.5 shadow-xs cursor-pointer transition-all flex justify-between items-center ${borderClass}`}
                    >
                      <div className="flex items-center gap-2">
                        <Button
                          onClick={(e) => toggleFavorite(e, s, letra)}
                          variant="tertiary"
                          appearance="ghost"
                          size="xs"
                          iconOnly={true}
                          iconLeft={<Star className={isFav ? 'fill-current' : ''} />}
                          className={`transition-colors mr-0.5 !h-auto !w-auto !p-1 ${isFav ? 'text-amber-500 hover:text-amber-600' : 'text-slate-350 dark:text-slate-655 hover:text-amber-500'}`}
                        />
                        <span className={`w-2.5 h-2.5 rounded-[2px] ${badgeColor}`} />
                        <div>
                          <span className="font-bold text-xs text-slate-800 dark:text-slate-200">Turma {letra}</span>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">Média: <strong className="text-slate-700 dark:text-slate-300">{t.perf}%</strong></p>
                        </div>
                      </div>
                      {renderMatchMomentum(t.momentumSeries)}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default TurmasGrid;
