import React, { useState } from 'react';
import { HelpCircle, BarChart2, Loader2 } from 'lucide-react';
import { DOMINIOS_DATA, DOMINIOS_DATA_BY_YEAR } from './mockDataAcompanhamento';
import { BlockInfoCallout } from './TooltipCallout';
import HistoricoPercentualAcertoModal from './HistoricoPercentualAcertoModal';

export default function DominiosRepertorio({
  tipoDominio = 'Repertório',
  selectedYear = '2024',
  isLoading = false,
  isLeituraAtiva = true,
  isMatematicaAtiva = true
}) {
  const [showInfoCallout, setShowInfoCallout] = useState(false);
  const [selectedDominio, setSelectedDominio] = useState(null);

  const isCognitivo = tipoDominio === 'Cognitivo';
  const currentDominios = DOMINIOS_DATA_BY_YEAR[selectedYear] || DOMINIOS_DATA_BY_YEAR['2024'] || DOMINIOS_DATA;

  return (
    <>
      <div className="bg-white rounded-[8px] border border-slate-300 shadow-2xs p-4 flex flex-col relative h-[435px] max-h-[435px] overflow-hidden">
        {/* ─── TOPO: TÍTULO + (?) ─── */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-3 relative shrink-0">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-bold text-slate-800 tracking-tight">
              {isCognitivo ? 'Domínios Cognitivos' : 'Domínios de Repertório'}
            </h3>
            {isLoading && <Loader2 className="w-3.5 h-3.5 text-[#008BC9] animate-spin" />}
          </div>

          <div className="relative">
            <button
              onClick={() => setShowInfoCallout(!showInfoCallout)}
              className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 cursor-pointer"
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

        {/* ─── CORPO: SUB-CABECALHO + BARRAS HORIZONTAIS CLICÁVEIS OU SKELETONS ─── */}
        <div className="flex-1 min-h-0 flex flex-col gap-3 overflow-y-auto overflow-x-hidden pr-0.5 scrollbar-thin">
          {isLoading ? (
            <div className="flex flex-col gap-2.5 py-1">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col gap-2 p-2 rounded-[6px] bg-slate-50/80 animate-pulse border border-slate-100">
                  <div className="flex items-center justify-between">
                    <div className={`h-3 bg-slate-200 rounded ${i % 2 === 0 ? 'w-36' : 'w-44'}`} />
                    <div className="h-3 w-7 bg-slate-200 rounded" />
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full" />
                </div>
              ))}
            </div>
          ) : (
            <>
          {/* Seção MATEMÁTICA: visível se matemática estiver ativa na esquerda */}
          {isMatematicaAtiva && (
            <div className="flex flex-col gap-1.5">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#F59E0B]">
                <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
                <span>Matemática</span>
              </div>

              <div className="flex flex-col gap-1">
                {(isCognitivo ? currentDominios.CognitivoMatematica : currentDominios.RepertorioMatematica).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDominio({ ...item, materia: 'Matemática' })}
                    className="w-full flex flex-col gap-1.5 p-2 rounded-[6px] hover:bg-amber-50/50 transition-all text-left cursor-pointer group border border-transparent hover:border-amber-200/60"
                    title={`Clique para ver o Histórico de ${item.nome}`}
                  >
                    <div className="flex items-center justify-between text-xs w-full">
                      <span className="font-semibold text-slate-700 group-hover:text-[#D97706] transition-colors">
                        {item.nome}
                      </span>
                      <BarChart2 className="w-3.5 h-3.5 text-[#F59E0B] group-hover:scale-110 transition-all" />
                    </div>
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.score}%`,
                            backgroundColor: item.color || (item.score >= 70 ? '#4ADE80' : '#FACC15')
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-800 w-8 text-right shrink-0 group-hover:text-[#D97706] transition-colors">
                        {item.score}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Seção LEITURA: visível se leitura estiver ativa na esquerda */}
          {isLeituraAtiva && (
            <div className="flex flex-col gap-1.5 pt-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-[#A855F7]">
                <span className="w-2 h-2 rounded-full bg-[#A855F7]" />
                <span>Leitura</span>
              </div>

              <div className="flex flex-col gap-1">
                {(isCognitivo ? currentDominios.CognitivoLeitura : currentDominios.RepertorioLeitura).map((item, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedDominio({ ...item, materia: 'Leitura' })}
                    className="w-full flex flex-col gap-1.5 p-2 rounded-[6px] hover:bg-purple-50/50 transition-all text-left cursor-pointer group border border-transparent hover:border-purple-200/60"
                    title={`Clique para ver o Histórico de ${item.nome}`}
                  >
                    <div className="flex items-center justify-between text-xs w-full">
                      <span className="font-semibold text-slate-700 group-hover:text-[#7E22CE] transition-colors">
                        {item.nome}
                      </span>
                      <BarChart2 className="w-3.5 h-3.5 text-[#A855F7] group-hover:scale-110 transition-all" />
                    </div>
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-500"
                          style={{
                            width: `${item.score}%`,
                            backgroundColor: item.color || (item.score >= 70 ? '#4ADE80' : '#FACC15')
                          }}
                        />
                      </div>
                      <span className="text-xs font-bold text-slate-800 w-8 text-right shrink-0 group-hover:text-[#7E22CE] transition-colors">
                        {item.score}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Mensagem caso ambas as matérias estejam desabilitadas */}
          {!isMatematicaAtiva && !isLeituraAtiva && (
            <div className="py-8 text-center text-xs text-slate-400 italic">
              Habilite Leitura ou Matemática no gráfico ao lado para visualizar seus domínios.
            </div>
          )}
          </>
          )}
        </div>
      </div>

      {/* ─── MODAL DE HISTÓRICO DO PERCENTUAL DE ACERTO ─── */}
      {selectedDominio && (
        <HistoricoPercentualAcertoModal
          isOpen={!!selectedDominio}
          onClose={() => setSelectedDominio(null)}
          dominio={selectedDominio}
          selectedYear={selectedYear}
          tipoDominio={tipoDominio}
        />
      )}
    </>
  );
}
