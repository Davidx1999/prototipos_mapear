import { ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import CascadeSelector from '../../ui/CascadeSelector';

export default function HeatmapSidebar({
  isContextExpanded,
  setIsContextExpanded,
  navPath,
  navLevel,
  goBack,
  CASCADE_LEVELS,
  devDB,
  levelLabels,
  calcMethod,
  setCalcMethod,
  sortBy,
  setSortBy,
  sortOrder,
  setSortOrder,
  hideNoParticipation,
  setHideNoParticipation,
  statusColors,
  colorTheme,
  isColorsActive
}) {
  return (
    <aside className={`fixed top-[156px] left-6 h-[calc(100vh-168px)] bg-white rounded-[8px] border border-gray-200 shadow-2xl transition-all duration-400 z-[60] flex flex-col ${isContextExpanded ? 'w-[320px]' : 'w-[52px] h-[52px]'}`}>

      {/* Botão de Toggle Contexto */}
      <div
        className={`flex justify-between items-center cursor-pointer hover:bg-gray-50 transition-colors bg-white rounded-[8px] z-10 ${isContextExpanded ? 'p-4 border-b border-gray-100' : 'w-full h-full justify-center'}`}
        onClick={() => setIsContextExpanded(!isContextExpanded)}
      >
        {isContextExpanded && <h2 className="font-extrabold text-[13px] text-[#003A79] tracking-wide uppercase">Seleção de Contexto</h2>}
        {isContextExpanded ? <ChevronDown size={20} className="text-[#008BC9]" /> : <ChevronUp size={20} className="text-[#008BC9]" />}
      </div>

      {isContextExpanded && (
        <div className="flex flex-col flex-1 animate-fade-slide">
          <div className="p-5 flex flex-col gap-2 relative">

            <div className="flex flex-col">
              <label className="text-[11px] font-bold text-gray-400 mb-2 uppercase tracking-wide">Filtro em Cascata</label>
              <CascadeSelector
                db={devDB}
                levels={CASCADE_LEVELS}
                onConfirm={(selections) => console.log('Seleção:', selections)}
                variant="sidebar"
              />
            </div>

            <div className="h-[1px] bg-gray-100 my-2"></div>

            <div className="flex flex-col gap-5">
              <h3 className="font-extrabold text-[13px] text-[#1D2432]">Ajustes de Exibição</h3>

              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Método de Totalização</label>
                  <div className="relative">
                    <select
                      value={calcMethod}
                      onChange={(e) => setCalcMethod(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-[8px] text-[13px] font-bold text-[#1D2432] appearance-none focus:outline-none focus:border-[#008BC9] focus:ring-1 focus:ring-[#008BC9] shadow-sm cursor-pointer hover:border-[#008BC9] transition-colors"
                    >
                      <option value="Moda">Moda (Mais frequente)</option>
                      <option value="Mediana">Mediana</option>
                      <option value="Média">Média Ponderada</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-wide">Ordenar Mapa</label>
                  <div className="flex flex-col gap-2">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="w-full h-10 px-3 bg-white border border-gray-300 rounded-[8px] text-[13px] font-bold text-[#1D2432] appearance-none focus:outline-none focus:border-[#008BC9] shadow-sm cursor-pointer"
                    >
                      <option value="Nome">Por {levelLabels[navLevel]}</option>
                      <option value="Score">Por Desempenho</option>
                    </select>
                    {sortBy === 'Score' ? (
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-gray-300 rounded-[8px] text-[13px] font-bold text-[#1D2432] appearance-none focus:outline-none focus:border-[#008BC9] shadow-sm cursor-pointer"
                      >
                        <option value="Desempenho Crescente">Menor &rarr; Maior</option>
                        <option value="Desempenho Decrescente">Maior &rarr; Menor</option>
                      </select>
                    ) : (
                      <select
                        value={sortOrder}
                        onChange={(e) => setSortOrder(e.target.value)}
                        className="w-full h-10 px-3 bg-white border border-gray-300 rounded-[8px] text-[13px] font-bold text-[#1D2432] appearance-none focus:outline-none focus:border-[#008BC9] shadow-sm cursor-pointer"
                      >
                        <option value="A-Z">A &rarr; Z</option>
                        <option value="Z-A">Z &rarr; A</option>
                      </select>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between mt-2 pt-4 border-t border-gray-100">
                  <span className="text-[12px] font-bold text-gray-700">Ocultar Sem Participação</span>
                  <button
                    onClick={() => setHideNoParticipation(!hideNoParticipation)}
                    className={`w-10 h-5 rounded-full relative transition-colors ${hideNoParticipation ? 'bg-[#008BC9]' : 'bg-gray-300'}`}
                  >
                    <div className={`absolute top-[2px] w-4 h-4 rounded-full bg-white transition-all shadow-sm ${hideNoParticipation ? 'right-[2px]' : 'left-[2px]'}`}></div>
                  </button>
                </div>
              </div>
            </div>

            <div className="p-5 border-t border-gray-100 bg-gray-50/30 rounded-b-[8px]">
              <div className="flex justify-between items-center mb-3">
                <h3 className="font-bold text-[13px] text-[#1D2432]">Legenda dos Centroides</h3>
                <HelpCircle size={14} className="text-gray-400" />
              </div>
              <div className="flex flex-col gap-2">
                {Object.entries(statusColors).map(([key, status], idx) => {
                  let bg = status.bg;
                  let border = status.border;
                  if (colorTheme === 'colorblind' && isColorsActive) {
                    if (key === 'suficiente') { bg = '#0072B2'; border = '#005a8d'; }
                    if (key === 'parcialmente') { bg = '#F0E442'; border = '#d1c63a'; }
                    if (key === 'insuficiente') { bg = '#D55E00'; border = '#a34800'; }
                    if (key === 'sem_conteudo') { bg = '#CCCCCC'; border = '#aaaaaa'; }
                  } else if (!isColorsActive) {
                    bg = '#E5E7EB'; border = '#D1D5DB';
                  }

                  return (
                    <div key={idx} className="flex items-center gap-2">
                      <div className="px-2 py-1.5 rounded-[8px] border text-[11px] font-bold flex items-center gap-2 w-full shadow-sm transition-colors duration-300" style={{ backgroundColor: bg, borderColor: border, color: '#1D2432' }}>
                        {status.icon} <span className={`truncate ${status.label === 'Em Branco' ? 'text-gray-600' : ''}`}>{status.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </aside>
  );
}
