
import React from 'react';
import { Shield } from 'lucide-react';
import LogoFgv from '../ui/LogoFgv';

const Footer = ({ colors, isHighContrast }) => {
  return (
    <footer className="mt-auto px-[24px] md:px-[64px] py-[32px] md:py-[48px] flex flex-col gap-[32px] md:gap-[48px] transition-colors duration-500" style={{ backgroundColor: colors.primary.ultraDark, color: isHighContrast ? colors.neutral[0] : '#FFFFFF' }}>
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="mb-[32px] md:mb-[48px]"><LogoFgv isFooter={true} isHighContrast={isHighContrast} colors={colors} /></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[24px] md:gap-[32px] text-[13px] md:text-[14px]">
          <div className="flex flex-col gap-[12px]"><h5 className="font-bold mb-[4px] md:mb-[8px]">Sobre</h5><a href="#" className="opacity-80 hover:opacity-100">Sobre o Mapear</a></div>
          <div className="flex flex-col gap-[12px]"><h5 className="font-bold mb-[4px] md:mb-[8px]">Links Úteis</h5><a href="#" className="opacity-80 hover:opacity-100">Notícias</a></div>
          <div className="flex flex-col gap-[12px]"><h5 className="font-bold mb-[4px] md:mb-[8px]">Suporte</h5><a href="#" className="opacity-80 hover:opacity-100">Central de Suporte</a></div>
        </div>
        <div className="mt-[48px] md:mt-[64px] pt-[24px] md:pt-[32px] border-t border-opacity-20 flex flex-col gap-[16px]" style={{ borderColor: isHighContrast ? colors.neutral[3] : '#969DA9' }}>
          <div className="flex items-center gap-[12px]"><Shield className="w-[28px] h-[28px] md:w-[32px] md:h-[32px]" style={{ color: colors.primary.light }} /><h2 className="text-[16px] md:text-[20px] font-bold leading-tight">Centro de Excelência<br/>em Políticas Educacionais</h2></div>
          <p className="text-[9px] md:text-[10px] opacity-60 mt-[8px] md:mt-[16px]">© 2026 FGV DGPE. Todos os direitos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
