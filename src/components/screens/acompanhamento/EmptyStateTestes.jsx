import React from 'react';
import { BarChart3, AlertCircle } from 'lucide-react';

export default function EmptyStateTestes({ onSelectYear }) {
  return (
    <div className="p-12 flex flex-col items-center justify-center text-center select-none min-h-[320px]">
      {/* Ícone central sutil com círculo suave */}
      <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4 text-slate-400">
        <BarChart3 className="w-8 h-8 text-slate-400" />
      </div>

      {/* Título */}
      <h4 className="text-base font-extrabold text-slate-800 mb-1 tracking-tight">
        Nenhum dado disponível
      </h4>

      {/* Texto Explicativo */}
      <p className="text-xs text-slate-500 max-w-md mb-5 leading-relaxed font-medium">
        Para visualizar o detalhamento dos testes, a distribuição de conceitos e a matriz longitudinal do estudante, selecione um ano individual no filtro acima.
      </p>

      {/* Botão de Atalho para Selecionar 2020 */}
      {onSelectYear && (
        <button
          onClick={() => onSelectYear('2020')}
          className="px-4 py-2 bg-[#008BC9] hover:bg-[#0078B0] text-white text-xs font-bold rounded-lg transition-all shadow-2xs"
        >
          Visualizar ano 2020
        </button>
      )}
    </div>
  );
}
