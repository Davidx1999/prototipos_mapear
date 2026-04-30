import React, { useState } from 'react';
import { X, LayoutGrid, Columns, House } from 'lucide-react';
import { sidebarMenus } from '../../data/constants';
import Button from '../ui/Button';

const GripMenu = ({
  colors,
  isGripOpen,
  setIsGripOpen,
  gripActiveTab,
  setGripActiveTab,
  currentScreen,
  navigateTo
}) => {
  const [viewMode, setViewMode] = useState('tabs'); // 'tabs' or 'list'

  if (!isGripOpen) return null;

  return (
    <>
      {/* Fundo semi-transparente que permite fechar clicando fora */}
      <div
        className="fixed inset-0 top-[72px] bg-blue-900/20 backdrop-blur-[4px] z-[90]"
        onClick={() => setIsGripOpen(false)}
      />

      {/* Painel centralizado e harmonizado com o botão Grip */}
      <div className="fixed top-[72px] left-[88px] right-[88px] md:left-[164px] md:right-[164px] bg-white shadow-[0_24px_50px_rgba(0,0,0,0.1)] z-[100] border border-[#DEE1E8] flex flex-col origin-top animate-slide-down-full rounded-b-[8px] rounded-t-none overflow-hidden">

        {/* Topo: Categorias Master ou Toggle de Visualização */}
        <div className="w-full bg-white border-b border-[#DEE1E8] relative flex items-center justify-between px-[24px]">
          <div className="flex-1 flex items-center gap-[16px]">
            <div className="py-[16px]">
              <h2 className="text-[14px] font-bold text-[#1D2432]">Ferramentas do Mapear</h2>
            </div>
          </div>

          <div className="flex items-center gap-[4px] ml-[16px] py-[8px]">
            <Button 
              variant="tertiary" 
              size="sm" 
              className="flex items-center gap-[8px] h-[32px] !text-[12px] !px-[12px] !rounded-[8px]"
              onClick={() => { navigateTo('dashboard'); setIsGripOpen(false); }}
            >
              <House size={16} />
              <span>Início</span>
            </Button>

            <div className="w-[1px] h-[20px] bg-[#DEE1E8] mx-[8px]" />

            <button
              onClick={() => setViewMode('tabs')}
              className={`p-[6px] rounded-[6px] transition-all ${viewMode === 'tabs' ? 'bg-[#DEE1E8] text-[#008BC9]' : 'text-[#969DA9] hover:bg-gray-50'}`}
              title="Visualização por Abas"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-[6px] rounded-[6px] transition-all ${viewMode === 'list' ? 'bg-[#DEE1E8] text-[#008BC9]' : 'text-[#969DA9] hover:bg-gray-50'}`}
              title="Visualização em Lista"
            >
              <Columns size={18} />
            </button>
          </div>
        </div>

        <div className="w-full bg-[#FCFDFD] overflow-y-auto max-h-[70vh] custom-scrollbar">
          <div className={`w-full ${viewMode === 'tabs' ? 'pt-[4px] pb-[40px]' : 'pt-[16px] pb-[40px]'}`}>
            {viewMode === 'tabs' ? (
              <>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-0 mb-[32px] border-b border-[#DEE1E8]">
                  {sidebarMenus.map((menu) => {
                    const isActive = gripActiveTab === menu.id;
                    return (
                      <button
                        key={menu.id}
                        onClick={(e) => { e.stopPropagation(); setGripActiveTab(menu.id); }}
                        className={`relative flex items-center justify-center gap-[10px] py-[16px] px-[12px] transition-all whitespace-nowrap ${isActive
                          ? 'text-[#008BC9]'
                          : 'text-[#677080] hover:text-[#1D2432]'
                          }`}
                      >
                        <div className={`transition-colors ${isActive ? 'text-[#008BC9]' : 'text-[#969DA9]'}`}>
                          {React.cloneElement(menu.icon, { size: 18, strokeWidth: isActive ? 2.5 : 2 })}
                        </div>
                        <span className={`text-[13px] md:text-[14px] leading-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                          {menu.label}
                        </span>
                        {isActive && (
                          <div className="absolute bottom-0 left-0 w-full h-[3px] bg-[#008BC9] rounded-t-full" />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div key={gripActiveTab} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] md:gap-[20px] px-[24px]">
                  {sidebarMenus.find(m => m.id === gripActiveTab)?.cards.map((card, index) => {
                    const isCardActive = currentScreen === (card.route || card.title);

                    return (
                      <div
                        key={card.id}
                        onClick={() => { navigateTo(card.route || 'empty-state', card.title); setIsGripOpen(false); }}
                        className={`group flex items-center gap-[16px] p-[16px] rounded-[12px] border cursor-pointer transition-all h-full animate-fade-slide-stagger ${isCardActive
                          ? 'bg-[#F4F8FB] shadow-sm'
                          : 'border-[#DEE1E8] bg-white hover:border-[#008BC9] hover:shadow-md'
                          }`}
                        style={{
                          borderColor: isCardActive ? colors.primary.dark : undefined,
                          borderWidth: isCardActive ? '2px' : '1px',
                          animationDelay: `${index * 40}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <div
                          className={`p-[10px] rounded-[8px] transition-colors shrink-0 ${isCardActive
                            ? ''
                            : 'bg-[#F4F6F8] text-[#969DA9] group-hover:bg-[#E5F3F9] group-hover:text-[#008BC9]'
                            }`}
                          style={{
                            backgroundColor: isCardActive ? `${colors.primary.base}15` : undefined,
                            color: isCardActive ? colors.primary.dark : undefined
                          }}
                        >
                          {React.cloneElement(card.icon, { size: 20, strokeWidth: isCardActive ? 2 : 2 })}
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <h4
                            className={`text-[14px] font-bold leading-tight truncate transition-colors ${!isCardActive ? 'text-[#1D2432] group-hover:text-[#008BC9]' : ''}`}
                            style={{ color: isCardActive ? colors.primary.dark : undefined }}
                          >
                            {card.title}
                          </h4>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-0 animate-fade-slide mt-[-16px] mb-[-40px]">
                {sidebarMenus.map((menu, index) => (
                  <div
                    key={menu.id}
                    className={`flex flex-col gap-[16px] animate-fade-slide-stagger pt-[16px] pb-[40px] ${index !== sidebarMenus.length - 1 ? 'lg:border-r' : ''}`}
                    style={{
                      borderColor: '#DEE1E8',
                      animationDelay: `${index * 60}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex items-center gap-[10px] pb-[8px] px-[24px] border-b border-[#DEE1E8]">
                      <div style={{ color: colors.primary.dark }}>
                        {React.cloneElement(menu.icon, { size: 16, strokeWidth: 2.5 })}
                      </div>
                      <h5 className="text-[12px] font-bold uppercase tracking-wider text-[#1D2432]">
                        {menu.label}
                      </h5>
                    </div>
                    <div className="flex flex-col gap-[2px]">
                      {menu.cards.map((card) => {
                        const isCardActive = currentScreen === (card.route || card.title);
                        return (
                          <div
                            key={card.id}
                            onClick={() => { navigateTo(card.route || 'empty-state', card.title); setIsGripOpen(false); }}
                            className={`group flex items-center gap-[12px] cursor-pointer py-[10px] px-[24px] transition-all hover:bg-[#DEE1E8]`}
                            style={{ 
                              color: isCardActive ? colors.primary.dark : colors.neutral[7]
                            }}
                          >
                            <div 
                              className={`w-[6px] h-[6px] rounded-full shrink-0 transition-all ${isCardActive ? '' : 'bg-transparent group-hover:bg-[#008BC9]'}`}
                              style={{ 
                                backgroundColor: isCardActive ? colors.primary.dark : undefined
                              }}
                            />
                            <span className={`text-[13px] transition-colors ${isCardActive ? 'font-bold' : 'font-medium group-hover:text-[#008BC9]'}`}>
                              {card.title}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </>
  );
};

export default GripMenu;
