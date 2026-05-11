import React from 'react';
import { Settings2 } from 'lucide-react';

export default function HeatmapEmptyState({ isContextExpanded, setIsContextExpanded, colors, isDarkMode = false }) {
  return (
    <div 
      className="flex-1 h-full flex flex-col items-center justify-center p-8 text-center relative overflow-hidden"
      style={{ backgroundColor: isDarkMode ? colors.neutral[6] : 'rgba(243, 244, 246, 0.5)' }}
    >
      {/* Background Grid */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `linear-gradient(${isDarkMode ? colors.neutral[5] : colors.neutral[2]} 1px, transparent 1px), linear-gradient(90deg, ${isDarkMode ? colors.neutral[5] : colors.neutral[2]} 1px, transparent 1px)`,
          backgroundSize: '40px 40px',
          backgroundPosition: 'center center',
          opacity: isDarkMode ? 0.2 : 0.40
        }}
      />
      <div className="flex flex-col items-center justify-center max-w-2xl relative z-10">
        <div className="relative mb-8">
          {/* Círculos decorativos pulsantes */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary-base/5 rounded-full animate-pulse" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary-base/10 rounded-full animate-pulse delay-700" />

          <img
            src={`${import.meta.env.BASE_URL}assets/Figure/colored/noHeatmap.png`}
            alt="Aguardando Seleção"
            className="relative z-10 w-80 h-auto drop-shadow-xl"
          />
        </div>

        <h2 
          className="text-[24px] font-bold mb-4 tracking-tight"
          style={{ color: isDarkMode ? colors.neutral[0] : '#1D2432' }}
        >
          Aguardando Seleção de Dados
        </h2>
        <p 
          className="text-[14px] max-w-[440px] leading-relaxed mb-8"
          style={{ color: isDarkMode ? colors.neutral[3] : '#6B7280' }}
        >
          Para visualizar o Mapa de Calor, utilize o <span className="font-bold text-primary-base" style={{ color: isDarkMode ? colors.primary.light : '' }}>Seleção de Contexto</span> no painel lateral e selecione o contexto desejado.
        </p>

        {!isContextExpanded && (
          <button
            onClick={() => setIsContextExpanded(true)}
            className="flex items-center gap-2 px-6 py-3 bg-primary-base text-white rounded-xl font-bold text-[14px] shadow-lg shadow-primary-base/20 hover:bg-primary-dark transition-all active:scale-95 group"
          >
            <Settings2 size={20} className="group-hover:rotate-45 transition-transform" />
            Abrir Configurações
          </button>
        )}
      </div>
    </div>
  );
}
