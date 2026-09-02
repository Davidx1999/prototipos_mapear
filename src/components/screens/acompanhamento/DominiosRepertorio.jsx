import React, { useState } from 'react';
import { HelpCircle, BarChart2 } from 'lucide-react';
import { DOMINIOS_DATA } from './mockDataAcompanhamento';
import { BlockInfoCallout } from './TooltipCallout';

export default function DominiosRepertorio({ tipoDominio = 'Repertório' }) {
  const [showInfoCallout, setShowInfoCallout] = useState(false);

  // Seleciona os domínios com base no filtro superior
  const dominiosList = tipoDominio === 'Cognitivo'
    ? DOMINIOS_DATA.Cognitivo
    : DOMINIOS_DATA.RepertorioMatematica;

  const subHeader = tipoDominio === 'Cognitivo' ? 'Cognitivo' : 'Matemática';

  return (
    <div className="bg-white rounded-[8px] border border-slate-300 shadow-2xs p-4 flex flex-col justify-between relative">
      {/* ─── TOPO: TÍTULO + (?) ─── */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 relative">
        <h3 className="text-sm font-bold text-slate-800 tracking-tight">
          Domínios de Repertório
        </h3>

        <div className="relative">
          <button
            onClick={() => setShowInfoCallout(!showInfoCallout)}
            className="text-slate-400 hover:text-slate-600 transition-colors p-0.5"
            title="Sobre os Domínios"
          >
            <HelpCircle className="w-3.5 h-3.5" />
          </button>

          {showInfoCallout && (
            <BlockInfoCallout
              title="Gráfico de Barras Horizontal"
              text="Média do aluno por Domínios de Repertório ou Cognitivos nas avaliações em que participou."
              onClose={() => setShowInfoCallout(false)}
            />
          )}
        </div>
      </div>

      {/* ─── CORPO: SUB-CABECALHO + BARRAS HORIZONTAIS ─── */}
      <div className="flex-1 flex flex-col gap-4">
        <span className="text-xs font-bold text-slate-700">
          {subHeader}
        </span>

        <div className="flex flex-col gap-3.5 overflow-y-auto max-h-[260px] pr-1">
          {dominiosList.map((item, idx) => (
            <div key={idx} className="flex flex-col gap-1.5 group">
              {/* Rótulo + Ícone do Gráfico à direita */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-slate-700 group-hover:text-slate-900 transition-colors">
                  {item.nome}
                </span>
                <BarChart2 className="w-3.5 h-3.5 text-[#489EEA]" />
              </div>

              {/* Barra de Progresso + Percentual numérico */}
              <div className="flex items-center gap-3">
                <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${item.score}%`,
                      backgroundColor: item.color || (item.score >= 70 ? '#4ADE80' : '#FACC15')
                    }}
                  />
                </div>
                <span className="text-xs font-bold text-slate-800 w-8 text-right shrink-0">
                  {item.score}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
