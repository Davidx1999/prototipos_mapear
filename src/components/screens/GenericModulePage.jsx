
import React from 'react';
import { Home, Grid, ChevronRight } from 'lucide-react';
import { sidebarMenus } from '../../data/constants';
import Button from '../ui/Button';

const GenericModulePage = ({ colors, navigateTo }) => {
  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[48px] animate-fade-in-up">
      <div className="mb-[40px] flex flex-col md:flex-row md:items-center justify-between gap-[24px]">
        <div>
          <h1 className="text-[28px] md:text-[36px] font-bold mb-[8px]" style={{ color: colors.neutral[7] }}>
            Explorar Módulos
          </h1>
          <p className="text-[14px] md:text-[16px]" style={{ color: colors.neutral[5] }}>
            Selecione uma das ferramentas do ecossistema Mapear para começar.
          </p>
        </div>
        <Button 
          variant="secondary" 
          onClick={() => navigateTo('dashboard')}
          className="md:self-start"
        >
          <Home size={18} /> Voltar para Tela Inicial
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[24px]">
        {sidebarMenus.map((menu) => (
          <div 
            key={menu.id}
            className="p-[24px] rounded-[12px] border bg-white flex flex-col h-full shadow-sm hover:shadow-md transition-all duration-300 group"
            style={{ borderColor: colors.neutral[2] }}
          >
            <div className="flex items-center gap-[16px] mb-[20px]">
              <div 
                className="w-[48px] h-[48px] rounded-[10px] flex items-center justify-center transition-colors group-hover:bg-[#E5F3F9] group-hover:text-[#008BC9]" 
                style={{ backgroundColor: colors.neutral[1], color: colors.neutral[5] }}
              >
                {menu.icon}
              </div>
              <h2 className="text-[18px] font-bold transition-colors group-hover:text-[#008BC9]" style={{ color: colors.neutral[7] }}>
                {menu.label}
              </h2>
            </div>
            
            <div className="flex flex-col gap-[12px] flex-1">
              {menu.cards.map((card) => (
                <button
                  key={card.id}
                  onClick={() => card.route ? navigateTo(card.route) : null}
                  className="flex items-center justify-between p-[12px] rounded-[8px] text-left hover:bg-gray-50 transition-colors group/item"
                  style={{ color: colors.neutral[6] }}
                >
                  <div className="flex items-center gap-[12px]">
                    <div className="text-gray-400 group-hover/item:text-[#008BC9] transition-colors">
                      {card.icon}
                    </div>
                    <span className="text-[14px] font-semibold group-hover/item:text-[#008BC9] transition-colors">
                      {card.title}
                    </span>
                  </div>
                  <ChevronRight size={16} className="text-gray-300 group-hover/item:text-[#008BC9] transition-colors" />
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default GenericModulePage;
