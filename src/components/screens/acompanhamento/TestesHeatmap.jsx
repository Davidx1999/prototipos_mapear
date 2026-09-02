import React, { useState } from 'react';
import { HelpCircle, ZoomIn, ZoomOut, Maximize2 } from 'lucide-react';
import { HEATMAP_DATA } from './mockDataAcompanhamento';

export default function TestesHeatmap() {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredCell, setHoveredCell] = useState(null);

  // Mapeia valor numérico (0-100) para cor do Heatmap conforme a Imagem 5
  const getCellColor = (val) => {
    if (val === 0) return '#FFFFFF'; // Branco com borda se não houver dado
    if (val <= 20) return '#3B0764'; // Roxo escuro
    if (val <= 40) return '#1E3A8A'; // Azul/Índigo escuro
    if (val <= 60) return '#0D9488'; // Azul-petróleo / Teal
    if (val <= 80) return '#22C55E'; // Verde
    return '#EAB308'; // Amarelo/Dourado (100)
  };

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.15, 1.3));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.15, 0.85));

  return (
    <div className="p-5 flex flex-col flex-1 select-none">
      {/* ─── CONTAINER DAS DUAS MATRIZES (LEITURA E MATEMÁTICA) ─── */}
      <div
        className="flex flex-col xl:flex-row items-center justify-center gap-8 py-4 overflow-x-auto transition-transform duration-200"
        style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'top center' }}
      >
        {/* ─── MATRIZ 1: LEITURA ─── */}
        <div className="flex flex-col items-center">
          {/* Caixa de Título Superior */}
          <div className="border border-slate-300 rounded-lg px-8 py-1 mb-3 bg-white shadow-2xs">
            <span className="text-xs font-extrabold text-slate-800 tracking-wide">
              Leitura
            </span>
          </div>

          <div className="flex items-start gap-2.5">
            {/* Rótulos das Linhas (Pro, Lin, Lei, Lit) */}
            <div className="flex flex-col gap-2 pt-8">
              {HEATMAP_DATA.leitura.rows.map((row) => (
                <div
                  key={row.id}
                  className="w-10 h-8 rounded-md border border-slate-300 bg-white flex items-center justify-center text-xs font-extrabold text-slate-700 shadow-2xs"
                  title={row.title}
                >
                  {row.label}
                </div>
              ))}
            </div>

            {/* Colunas dos Testes + Células */}
            <div className="flex flex-col">
              {/* Cabeçalho das Colunas: T1 a T10 */}
              <div className="flex border border-slate-300 rounded-md overflow-hidden bg-white mb-2 shadow-2xs">
                {HEATMAP_DATA.leitura.columns.map((col) => (
                  <div
                    key={col}
                    className="w-9 h-6 flex items-center justify-center text-xs font-extrabold text-slate-800 border-r border-slate-200 last:border-r-0"
                  >
                    {col}
                  </div>
                ))}
              </div>

              {/* Grade de Células Coloridas */}
              <div className="flex flex-col gap-2">
                {HEATMAP_DATA.leitura.rows.map((row) => (
                  <div key={row.id} className="flex gap-1.5">
                    {row.cells.map((val, cIdx) => {
                      const color = getCellColor(val);
                      const isWhite = color === '#FFFFFF';
                      const colName = HEATMAP_DATA.leitura.columns[cIdx];

                      return (
                        <div
                          key={cIdx}
                          onMouseEnter={() => setHoveredCell({ subject: 'Leitura', row: row.title, test: colName, val })}
                          onMouseLeave={() => setHoveredCell(null)}
                          className={`w-9 h-8 rounded-sm cursor-pointer transition-all duration-150 hover:ring-2 hover:ring-[#008BC9] ${
                            isWhite ? 'border border-slate-200 bg-white' : ''
                          }`}
                          style={{ backgroundColor: color }}
                          title={`Leitura: ${row.title} - ${colName}: ${val > 0 ? `${val}%` : 'Sem dados'}`}
                        />
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── MATRIZ 2: MATEMÁTICA + LEGENDA VERTICAL ─── */}
        <div className="flex items-start gap-4">
          <div className="flex flex-col items-center">
            {/* Caixa de Título Superior */}
            <div className="border border-slate-300 rounded-lg px-8 py-1 mb-3 bg-white shadow-2xs">
              <span className="text-xs font-extrabold text-slate-800 tracking-wide">
                Matemática
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              {/* Rótulos das Linhas (Alg, Geo, Est, Pro) */}
              <div className="flex flex-col gap-2 pt-8">
                {HEATMAP_DATA.matematica.rows.map((row) => (
                  <div
                    key={row.id}
                    className="w-10 h-8 rounded-md border border-slate-300 bg-white flex items-center justify-center text-xs font-extrabold text-slate-700 shadow-2xs"
                    title={row.title}
                  >
                    {row.label}
                  </div>
                ))}
              </div>

              {/* Colunas dos Testes + Células */}
              <div className="flex flex-col">
                {/* Cabeçalho das Colunas: T1 a T6 */}
                <div className="flex border border-slate-300 rounded-md overflow-hidden bg-white mb-2 shadow-2xs">
                  {HEATMAP_DATA.matematica.columns.map((col) => (
                    <div
                      key={col}
                      className="w-9 h-6 flex items-center justify-center text-xs font-extrabold text-slate-800 border-r border-slate-200 last:border-r-0"
                    >
                      {col}
                    </div>
                  ))}
                </div>

                {/* Grade de Células Coloridas */}
                <div className="flex flex-col gap-2">
                  {HEATMAP_DATA.matematica.rows.map((row) => (
                    <div key={row.id} className="flex gap-1.5">
                      {row.cells.map((val, cIdx) => {
                        const color = getCellColor(val);
                        const isWhite = color === '#FFFFFF';
                        const colName = HEATMAP_DATA.matematica.columns[cIdx];

                        return (
                          <div
                            key={cIdx}
                            onMouseEnter={() => setHoveredCell({ subject: 'Matemática', row: row.title, test: colName, val })}
                            onMouseLeave={() => setHoveredCell(null)}
                            className={`w-9 h-8 rounded-sm cursor-pointer transition-all duration-150 hover:ring-2 hover:ring-[#008BC9] ${
                              isWhite ? 'border border-slate-200 bg-white' : ''
                            }`}
                            style={{ backgroundColor: color }}
                            title={`Matemática: ${row.title} - ${colName}: ${val > 0 ? `${val}%` : 'Sem dados'}`}
                          />
                        );
                      })}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ─── BARRA DE LEGENDA VERTICAL ─── */}
          <div className="flex flex-col items-center pt-2">
            <button className="text-slate-400 hover:text-slate-600 mb-2 p-0.5" title="Sobre a escala do Heatmap">
              <HelpCircle className="w-3.5 h-3.5" />
            </button>

            {/* Barra de Gradiente Vertical */}
            <div className="flex items-center gap-1.5">
              <div
                className="w-2.5 h-36 rounded-full"
                style={{
                  background: 'linear-gradient(to bottom, #EAB308 0%, #22C55E 25%, #0D9488 50%, #1E3A8A 75%, #3B0764 100%)'
                }}
              />
              <div className="flex flex-col justify-between h-36 text-[9px] font-extrabold text-slate-500">
                <span>100</span>
                <span>75</span>
                <span>50</span>
                <span>25</span>
                <span>0</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── NOTIFICAÇÃO DE HOVER SUTIL ─── */}
      <div className="h-5 text-center text-xs text-slate-500 font-medium">
        {hoveredCell ? (
          <span>
            <strong className="text-slate-800">{hoveredCell.subject}</strong> · {hoveredCell.row} ({hoveredCell.test}):{' '}
            <strong className="text-[#008BC9]">{hoveredCell.val > 0 ? `${hoveredCell.val}%` : 'Sem avaliação'}</strong>
          </span>
        ) : (
          <span className="opacity-0">Placeholder</span>
        )}
      </div>

      {/* ─── RODAPÉ DO HEATMAP: "Ordem Temporal ↗" + CONTROLES DE ZOOM ─── */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between mt-2">
        {/* Ordem Temporal */}
        <div className="flex items-center gap-1 text-xs font-semibold text-slate-600">
          <span>Ordem Temporal</span>
          <span className="text-slate-400">↗</span>
        </div>

        {/* Controles de Lupa / Zoom / Tela Cheia */}
        <div className="flex items-center gap-1">
          <button
            onClick={handleZoomIn}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Aumentar zoom"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Diminuir zoom"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1 rounded text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
            title="Ajustar tamanho padrão"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
