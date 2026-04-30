
import React from 'react';
import { Home, Layout, ArrowLeft } from 'lucide-react';
import Button from '../ui/Button';

const EmptyStatePage = ({ colors, navigateTo, title }) => {
  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[60px] md:py-[100px] flex flex-col items-center justify-center animate-fade-in-up text-center">
      {/* Ilustração ou Ícone Grande */}
      <div className="relative mb-[32px]">
        <div
          className="w-[100px] h-[100px] md:w-[140px] md:h-[140px] rounded-full flex items-center justify-center relative z-10 shadow-inner"
          style={{ backgroundColor: colors.neutral[1], color: colors.primary.base }}
        >
          <Layout size={56} className="md:w-[72px] md:h-[72px] opacity-80" />
        </div>
        {/* Elementos decorativos de fundo */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] rounded-full opacity-10 animate-pulse" style={{ border: `2px solid ${colors.primary.base}` }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180%] h-[180%] rounded-full opacity-5" style={{ border: `1px solid ${colors.primary.base}` }} />
      </div>

      <div className="max-w-[600px]">
        <h1 className="text-[28px] md:text-[42px] font-bold mb-[16px] tracking-tight" style={{ color: colors.neutral[7] }}>
          {title || 'Em Desenvolvimento'}
        </h1>

        <p className="text-[15px] md:text-[20px] mb-[48px] leading-relaxed" style={{ color: colors.neutral[5] }}>
          O módulo <span className="font-semibold" style={{ color: colors.primary.base }}>{title}</span> está sendo preparado pela nossa equipe técnica para oferecer a melhor experiência pedagógica.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-[16px] md:gap-[24px]">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigateTo('dashboard')}
            className="w-full sm:w-auto shadow-lg shadow-blue-500/20"
          >
            <Home size={20} /> Voltar ao Início
          </Button>

          <Button
            variant="secondary"
            size="lg"
            onClick={() => navigateTo('generic')}
            className="w-full sm:w-auto"
          >
            Explorar Módulos
          </Button>
        </div>
      </div>

      {/* Rodapé informativo sutil */}
      <div className="mt-[80px] pt-[32px] border-t w-full max-w-[400px] opacity-50" style={{ borderColor: colors.neutral[2] }}>
        <p className="text-[12px] font-medium uppercase tracking-widest" style={{ color: colors.neutral[4] }}>
          Ecossistema Mapear • 2026
        </p>
      </div>
    </main>
  );
};

export default EmptyStatePage;
