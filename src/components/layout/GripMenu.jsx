import React, { useState } from 'react';
import { X, LayoutGrid, List, House } from 'lucide-react';
import { sidebarMenus } from '../../data/constants';
import Button from '../ui/Button';

const GripMenu = ({
  colors,
  isGripOpen,
  setIsGripOpen,
  gripActiveTab,
  setGripActiveTab,
  currentScreen,
  navigateTo,
  isDarkMode
}) => {
  const [viewMode, setViewMode] = useState('tabs'); // 'tabs' or 'list'
  const [hoveredTabId, setHoveredTabId] = useState(null);

  if (!isGripOpen) return null;

  return (
    <>
      {/* Fundo semi-transparente que permite fechar clicando fora */}
      <div
        className="fixed inset-0 top-[72px] bg-blue-900/20 backdrop-blur-[4px] z-[90]"
        onClick={() => setIsGripOpen(false)}
      />

      {/* Painel centralizado e harmonizado com o botão Grip */}
      <div
        className="fixed top-[72px] left-[16px] right-[16px] md:left-[40px] md:right-[40px] lg:left-[24px] lg:right-[24px] xl:left-[164px] xl:right-[164px] shadow-[0_24px_50px_rgba(0,0,0,0.1)] z-[100] border border-t-0 flex flex-col origin-top animate-slide-down-full rounded-b-[8px] rounded-t-none overflow-hidden"
        style={{ backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[0], borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }}
      >

        {/* Topo: Categorias Master ou Toggle de Visualização */}
        <div
          className="w-full border-b relative flex items-center justify-between px-[24px]"
          style={{ backgroundColor: isDarkMode ? colors.neutral[7] : colors.neutral[0], borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }}
        >
          <div className="flex-1 flex items-center gap-[16px]">
            <div className="py-[16px]">
              <h2 className="text-[14px] font-bold" style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[6] }}>Ferramentas do Mapear</h2>
            </div>
          </div>

          <div className="flex items-center gap-[4px] ml-[16px] py-[8px]">
            <Button
              variant="tertiary"
              appearance="solid"
              size="sm"
              tertiaryTone={isDarkMode ? "low" : "high"}
              iconLeft={<House />}
              className={isDarkMode ? "bg-neutral-6 text-white hover:bg-primary-base border-neutral-5" : ""}
              onClick={() => { navigateTo('dashboard'); setIsGripOpen(false); }}
            >
              Início
            </Button>

            <div className="w-[1px] h-[20px] mx-[8px]" style={{ backgroundColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }} />

            <Button
              variant={viewMode === 'tabs' ? (isDarkMode ? 'primary' : 'primary') : 'tertiary'}
              appearance={viewMode === 'tabs' ? "solid" : "ghost"}
              iconOnly
              size="sm"
              selected={viewMode === 'tabs'}
              tertiaryTone={isDarkMode ? "low" : "high"}
              iconLeft={<LayoutGrid />}
              onClick={() => setViewMode('tabs')}
              className={isDarkMode && viewMode !== 'tabs' ? "text-white hover:bg-white/10" : ""}
              title="Visualização por Abas"
            />

            <Button
              variant={viewMode === 'list' ? (isDarkMode ? 'primary' : 'primary') : 'tertiary'}
              appearance={viewMode === 'list' ? "solid" : "ghost"}
              iconOnly
              size="sm"
              selected={viewMode === 'list'}
              tertiaryTone={isDarkMode ? "low" : "high"}
              iconLeft={<List />}
              onClick={() => setViewMode('list')}
              className={isDarkMode && viewMode !== 'list' ? "text-white hover:bg-white/10" : ""}
              title="Visualização em Lista"
            />
          </div>
        </div>

        <div
          className="w-full overflow-y-auto max-h-[calc(100vh-120px)] md:max-h-[70vh] custom-scrollbar"
          style={{ backgroundColor: isDarkMode ? colors.neutral[7] : colors.neutral[0] }}
        >
          <div className={`w-full ${viewMode === 'tabs' ? 'pt-[4px] pb-[40px]' : 'pt-[16px] pb-[40px]'}`}>
            {viewMode === 'tabs' ? (
              <>
                <div className="flex flex-wrap lg:grid lg:grid-cols-5 gap-0 mb-[32px] border-b justify-center" style={{ borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }}>
                  {sidebarMenus.map((menu) => {
                    const isActive = gripActiveTab === menu.id;
                    const isHovered = hoveredTabId === menu.id;

                    return (
                      <button
                        key={menu.id}
                        onClick={(e) => {
                          e.stopPropagation();
                          setGripActiveTab(menu.id);
                        }}
                        onMouseEnter={() => setHoveredTabId(menu.id)}
                        onMouseLeave={() => setHoveredTabId(null)}
                        className={`relative flex items-center justify-center gap-[10px] py-[16px] px-[12px] transition-all whitespace-nowrap min-w-[140px] flex-1 lg:flex-none rounded-t-[4px]`}
                        style={{
                          backgroundColor: !isActive && isHovered ? (isDarkMode ? `${colors.primary.light}20` : colors.neutral[1]) : 'transparent',
                          color: isActive ? (isDarkMode ? colors.primary.light : colors.primary.base) : (isDarkMode ? colors.neutral[2] : colors.neutral[6])
                        }}
                      >
                        <div
                          className="tab-icon transition-colors shrink-0"
                          style={{ color: isActive ? (isDarkMode ? colors.primary.light : colors.primary.base) : (isDarkMode ? colors.neutral[2] : colors.neutral[6]) }}
                        >
                          {React.cloneElement(menu.icon, { size: 18, strokeWidth: isActive ? 2.5 : 2 })}
                        </div>
                        <span
                          className={`tab-label text-[14px] md:text-[14px] leading-tight truncate px-[4px] transition-colors ${isActive ? 'font-bold' : 'font-medium'}`}
                          title={menu.label}
                          style={{ color: isActive ? (isDarkMode ? colors.primary.light : colors.primary.base) : (isDarkMode ? colors.neutral[2] : colors.neutral[6]) }}
                        >
                          {menu.label}
                        </span>
                        {isActive && (
                          <div
                            className="absolute bottom-0 left-0 w-full h-[3px] rounded-t-full"
                            style={{ backgroundColor: isDarkMode ? colors.primary.light : colors.primary.base }}
                          />
                        )}
                      </button>
                    );
                  })}
                </div>

                <div key={gripActiveTab} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-[16px] md:gap-[20px] px-[24px]">
                  {sidebarMenus.find(m => m.id === gripActiveTab)?.cards.map((card, index) => {
                    const isCardActive = currentScreen === (card.route || card.title);

                    return (
                      <div
                        key={card.id}
                        onClick={() => { navigateTo(card.route || 'empty-state', card.title); setIsGripOpen(false); }}
                        className={`group flex items-center gap-[16px] p-[16px] rounded-[12px] border cursor-pointer transition-all h-full animate-fade-slide-stagger ${isCardActive
                          ? ''
                          : 'border-neutral-2 hover:shadow-md'
                          }`}
                        onMouseEnter={(e) => {
                          if (!isCardActive) {
                            e.currentTarget.style.borderColor = isDarkMode ? colors.primary.light : colors.primary.base;
                            const title = e.currentTarget.querySelector('.card-title');
                            const iconBox = e.currentTarget.querySelector('.card-icon-box');
                            if (title) title.style.color = isDarkMode ? colors.primary.light : colors.primary.base;
                            if (iconBox) {
                              iconBox.style.backgroundColor = isDarkMode ? colors.primary.light : `${colors.primary.base}15`;
                              iconBox.style.color = isDarkMode ? colors.primary.dark : colors.primary.base;
                            }
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (!isCardActive) {
                            e.currentTarget.style.borderColor = isDarkMode ? colors.neutral[5] : colors.neutral[2];
                            const title = e.currentTarget.querySelector('.card-title');
                            const iconBox = e.currentTarget.querySelector('.card-icon-box');
                            if (title) title.style.color = isDarkMode ? colors.neutral[0] : colors.neutral[7];
                            if (iconBox) {
                              iconBox.style.color = isDarkMode ? colors.neutral[0] : colors.neutral[4];
                              iconBox.style.backgroundColor = isDarkMode ? colors.neutral[5] : colors.neutral[1];
                            }
                          }
                        }}
                        style={{
                          backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[0],
                          borderColor: isCardActive ? colors.primary.light : (isDarkMode ? colors.neutral[5] : colors.neutral[2]),
                          borderWidth: isCardActive ? '2px' : '1px',
                          animationDelay: `${index * 40}ms`,
                          animationFillMode: 'both'
                        }}
                      >
                        <div
                          className={`card-icon-box p-[8px] rounded-[8px] transition-colors shrink-0`}
                          style={{
                            backgroundColor: isCardActive ? colors.primary.base : (isDarkMode ? colors.neutral[5] : colors.neutral[1]),
                            color: isCardActive ? colors.neutral[0] : (isDarkMode ? colors.neutral[0] : colors.neutral[4])
                          }}
                        >
                          {React.cloneElement(card.icon, { size: 20, strokeWidth: isCardActive ? 2 : 2 })}
                        </div>
                        <div className="flex flex-col flex-1 overflow-hidden">
                          <h4
                            className={`card-title text-[14px] font-bold leading-tight truncate transition-colors`}
                            style={{ color: isCardActive ? (isDarkMode ? colors.primary.light : colors.primary.base) : (isDarkMode ? colors.neutral[0] : colors.neutral[7]) }}
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
                      borderColor: isDarkMode ? colors.neutral[5] : '#DEE1E8',
                      animationDelay: `${index * 60}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    <div className="flex items-center gap-[10px] pb-[8px] px-[24px] border-b" style={{ borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }}>
                      <div style={{ color: colors.primary.base }}>
                        {React.cloneElement(menu.icon, { size: 16, strokeWidth: 2.5 })}
                      </div>
                      <h5 className="text-[12px] font-bold uppercase tracking-wider" style={{ color: isDarkMode ? colors.neutral[2] : colors.neutral[6] }}>
                        {menu.label}
                      </h5>
                    </div>
                    {/* List Mode */}
                    <div className="flex flex-col gap-[2px]">
                      {menu.cards.map((card) => {
                        const isCardActive = currentScreen === (card.route || card.title);
                        return (
                          <div
                            key={card.id}
                            onClick={() => { navigateTo(card.route || 'empty-state', card.title); setIsGripOpen(false); }}
                            className={`group flex items-start gap-[12px] cursor-pointer py-[8px] px-[24px] transition-all`}
                            onMouseEnter={(e) => {
                              e.currentTarget.style.backgroundColor = isDarkMode ? colors.neutral[5] : colors.neutral[1];
                              const label = e.currentTarget.querySelector('.list-label');
                              const iconBox = e.currentTarget.querySelector('.list-icon-box');
                              if (label) {
                                label.style.color = isDarkMode ? colors.primary.light : colors.primary.dark;
                                if (!isCardActive) label.style.fontWeight = '600';
                              }
                              if (iconBox && !isCardActive) {
                                iconBox.style.color = isDarkMode ? colors.primary.dark : colors.primary.base;
                                iconBox.style.backgroundColor = isDarkMode ? colors.primary.light : `${colors.primary.base}10`;
                              }
                            }}
                            onMouseLeave={(e) => {
                              e.currentTarget.style.backgroundColor = 'transparent';
                              const label = e.currentTarget.querySelector('.list-label');
                              const iconBox = e.currentTarget.querySelector('.list-icon-box');
                              if (label) {
                                label.style.color = isCardActive ? (isDarkMode ? colors.primary.light : colors.primary.dark) : (isDarkMode ? colors.neutral[0] : colors.neutral[7]);
                                if (!isCardActive) label.style.fontWeight = '400';
                              }
                              if (iconBox && !isCardActive) {
                                iconBox.style.color = isDarkMode ? colors.neutral[0] : colors.neutral[4];
                                iconBox.style.backgroundColor = 'transparent';
                              }
                            }}
                            style={{
                              color: isCardActive ? (isDarkMode ? colors.primary.light : colors.primary.dark) : (isDarkMode ? colors.neutral[0] : colors.neutral[7])
                            }}
                          >
                            <div
                              className="list-icon-box w-[24px] h-[24px] flex items-center justify-center shrink-0 transition-all rounded-[4px]"
                              style={{
                                color: isCardActive ? (isDarkMode ? colors.primary.dark : colors.primary.dark) : (isDarkMode ? colors.neutral[0] : colors.neutral[4]),
                                backgroundColor: isCardActive ? (isDarkMode ? colors.primary.light : `${colors.primary.base}15`) : 'transparent'
                              }}
                            >
                              {React.cloneElement(card.icon, {
                                size: 16,
                                strokeWidth: isCardActive ? 2.5 : 2
                              })}
                            </div>
                            <span
                              className={`list-label text-[14px] transition-colors ${isCardActive ? 'font-semibold' : 'font-normal'}`}
                              style={{ color: isCardActive ? (isDarkMode ? colors.primary.light : colors.primary.dark) : (isDarkMode ? colors.neutral[0] : colors.neutral[7]) }}
                            >
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
