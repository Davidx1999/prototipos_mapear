import React from 'react';
import { X } from 'lucide-react';
import Button from '../../ui/Button';

// Modular charts
import ModalHistoricoChart from './ModalHistoricoChart';

/**
 * DominiosModal Component
 * Renders the detail/overlay modal for a specific domain.
 */
const DominiosModal = ({
  activeDomain,
  setActiveDomain,
  isDarkMode,
  MATRIX_DRILL,
  triggerToast,
  }) => {
  if (!activeDomain || activeDomain.media === undefined) return null;

  const flatHabilidades = React.useMemo(() => {
    const list = MATRIX_DRILL[activeDomain?.name] || [];
    if (list.length > 0 && list[0].habilidades === undefined) {
      return list;
    }
    return list.flatMap(subgroup => subgroup.habilidades || []);
  }, [activeDomain.name, MATRIX_DRILL]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
      <div className={`w-full max-w-[800px] rounded-[6px] border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div>
            <span className="text-[10px] font-bold text-[#006699] dark:text-sky-400 uppercase tracking-wide">Foco no Domínio de Aprendizagem</span>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activeDomain.name}</h3>
          </div>
          <Button
            onClick={() => setActiveDomain(null)}
            variant="tertiary"
            appearance="ghost"
            size="sm"
            iconOnly={true}
            iconLeft={<X />}
          />
        </div>

        {/* Scrollable Body */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs">
          {/* KPIs de Domínio */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-3 bg-slate-50 dark:bg-slate-955 rounded-[4px] border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Média de Proficiência</span>
              <span className="text-lg font-bold text-slate-900 dark:text-white">{activeDomain.media}%</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-955 rounded-[4px] border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Maior Nota</span>
              <span className="text-lg font-bold text-emerald-600 dark:text-emerald-450">{activeDomain.maior}%</span>
            </div>
            <div className="p-3 bg-slate-50 dark:bg-slate-955 rounded-[4px] border border-slate-200 dark:border-slate-800">
              <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Menor Nota</span>
              <span className="text-lg font-bold text-rose-600 dark:text-rose-450">{activeDomain.menor}%</span>
            </div>
          </div>

          {/* Histórico Temporal Multianual */}
          <div className="space-y-2">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Histórico Temporal Multianual (2016-2025)</h4>
            <p className="text-[11px] text-slate-450 dark:text-slate-400">Progresso do domínio analisado ano contra ano.</p>
            <div className="h-44 border border-slate-100 dark:border-slate-800 rounded-[4px] p-2 bg-slate-50/50 dark:bg-slate-955/30">
              <ModalHistoricoChart isDarkMode={isDarkMode} />
            </div>
          </div>

          {/* Detalhe de Habilidades (Drill Down) */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Detalhamento por Habilidades (Matriz de Referência)</h4>
            <div className="border border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-450 font-bold uppercase tracking-wider text-[9px]">
                    <th className="py-2 px-3">Código/Habilidade</th>
                    <th className="py-2 px-3 text-center">Itens</th>
                    <th className="py-2 px-3 text-center">Alunos</th>
                    <th className="py-2 px-3 text-right">Percentil Médio</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-300">
                  {flatHabilidades.map((row, rIdx) => (
                    <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                      <td className="py-2 px-3">
                        <span className="font-extrabold text-[#006699] dark:text-sky-400 block">{row.cod}</span>
                        <span className="text-[10px] text-slate-500 font-light block">{row.desc}</span>
                      </td>
                      <td className="py-2 px-3 text-center">{row.itens}</td>
                      <td className="py-2 px-3 text-center">{row.alunos}</td>
                      <td className="py-2 px-3 text-right font-extrabold text-slate-900 dark:text-white">{row.pct}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3 shrink-0">
          <Button
            onClick={() => {
              triggerToast(`Imprimindo relatório para ${activeDomain.name}...`);
            }}
            variant="tertiary"
            appearance="solid"
            size="md"
            uppercase={true}
          >
            Gerar PDF
          </Button>
          <Button
            onClick={() => setActiveDomain(null)}
            variant="primary"
            appearance="solid"
            size="md"
            uppercase={true}
          >
            Fechar
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DominiosModal;
