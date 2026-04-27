
import React from 'react';
import { Search, X, Star } from 'lucide-react';
import { sidebarMenus } from '../../data/constants';

const Dashboard = ({
  colors,
  isHighContrast,
  searchQuery,
  setSearchQuery,
  activeMenu,
  setActiveMenu,
  hoveredMenu,
  setHoveredMenu,
  navigateTo,
  favorites,
  toggleFavorite
}) => {
  const isSearching = searchQuery.trim().length > 0;
  const allCards = sidebarMenus.flatMap(menu => menu.cards);
  
  const activeData = sidebarMenus.find(m => m.id === activeMenu);
  const displayedCards = isSearching
    ? allCards.filter(card => {
      const term = searchQuery.toLowerCase();
      return card.title.toLowerCase().includes(term) || card.desc.toLowerCase().includes(term) || (card.keywords && card.keywords.some(kw => kw.toLowerCase().includes(term)));
    })
    : activeData?.cards || [];

  const favoriteCards = allCards.filter(card => favorites.includes(card.id));

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[32px] transition-all duration-300 animate-fade-slide" style={{ backgroundColor: colors.neutral[0] }}>
      {/* ══ HERO SECTION ════════════════════════════════════════════════════ */}
      <div className="relative w-full rounded-[16px] p-[24px] md:p-[40px] overflow-hidden flex flex-col justify-center transition-colors duration-500" style={{ backgroundColor: colors.primary.ultraDark, minHeight: '140px', border: isHighContrast ? '1px solid #FFFFFF' : 'none' }}>
        <div className="absolute right-0 top-0 bottom-0 w-full md:w-1/2 opacity-20 pointer-events-none">
          <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full">
            {[...Array(8)].map((_, i) => <path key={i} d={`M${i * 40},200 C${100 + i * 40},100 ${200 + i * 40},0 500,${i * 20}`} fill="none" stroke={isHighContrast ? '#333333' : colors.neutral[0]} strokeWidth="2" />)}
          </svg>
        </div>
        <div className="relative z-10">
          <span className="text-[12px] md:text-[14px] font-medium mb-[4px] block" style={{ color: isHighContrast ? '#FFFFFF' : colors.neutral[2] }}>Bem-vinda</span>
          <h2 className="text-[24px] md:text-[32px] font-bold mb-[8px]" style={{ color: isHighContrast ? colors.primary.base : colors.neutral[0] }}>Olá, User Test</h2>
          <p className="text-[13px] md:text-[14px] font-medium" style={{ color: isHighContrast ? '#FFFFFF' : colors.neutral[2] }}>Realize sua gestão educacional com o Mapear.</p>
        </div>
      </div>

      {/* ══ FAVORITES (REMOVIDO TEMPORARIAMENTE) ════════════════════════════ */}

      {/* ══ SEARCH BAR ══════════════════════════════════════════════════════ */}
      <div className="mt-[24px] md:mt-[32px] mb-[32px] md:mb-[40px] relative w-full group">
        <Search size={20} className="absolute left-[16px] top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#008BC9]" style={{ color: colors.neutral[4] }} />
        <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Pesquise pela plataforma (ex: alunos, notas, avaliações)..." className="w-full pl-[48px] pr-[48px] py-[14px] md:py-[16px] rounded-[8px] border text-[13px] md:text-[14px] outline-none transition-all duration-300 focus:shadow-md" style={{ borderColor: colors.neutral[3], color: colors.neutral[7], backgroundColor: colors.neutral[0] }} />
        {searchQuery && <X size={20} className="absolute right-[16px] top-1/2 -translate-y-1/2 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setSearchQuery('')} style={{ color: colors.neutral[5] }} />}
      </div>

      {/* ══ CARDS SECTION ═══════════════════════════════════════════════════ */}
      <div className={`flex flex-col lg:flex-row w-full relative transition-all duration-500 ${isSearching ? 'gap-0' : 'gap-[24px] lg:gap-[40px]'}`}>
        <div className={`shrink-0 flex flex-col gap-[8px] overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSearching ? 'h-0 opacity-0 lg:w-0' : 'w-full lg:w-[320px] opacity-100'}`}>
          <h3 className="text-[20px] md:text-[24px] font-bold mb-[8px] md:mb-[16px] whitespace-nowrap" style={{ color: colors.neutral[7] }}>Módulos do Sistema</h3>
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible hide-scrollbar gap-[8px] pb-[8px] lg:pb-0">
            {sidebarMenus.map((menu) => {
              const isActive = activeMenu === menu.id;
              return (
                <button key={menu.id} onClick={() => setActiveMenu(menu.id)} onMouseEnter={() => setHoveredMenu(menu.id)} onMouseLeave={() => setHoveredMenu(null)} className="relative min-w-[240px] lg:min-w-0 lg:w-full flex items-center gap-[12px] md:gap-[16px] px-[12px] md:px-[16px] rounded-[4px] text-left transition-all h-[64px] md:h-[72px] overflow-hidden border lg:border-none" style={{ backgroundColor: isActive ? colors.primary.extraLight : colors.neutral[0], borderColor: colors.neutral[2] }}>
                  <div className="hidden lg:block absolute left-0 top-0 bottom-0 w-[4px] rounded-full transition-colors duration-300" style={{ backgroundColor: isActive ? colors.primary.base : (hoveredMenu === menu.id ? colors.neutral[3] : 'transparent') }} />
                  <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] shrink-0 flex items-center justify-center rounded-[4px] transition-colors" style={{ backgroundColor: colors.primary.base, color: isHighContrast ? '#000' : '#FFF' }}>{menu.icon}</div>
                  <div className="flex flex-col justify-center overflow-hidden">
                    <span className="font-semibold text-[14px] md:text-[16px] truncate transition-colors" style={{ color: isActive || hoveredMenu === menu.id ? colors.neutral[7] : colors.neutral[5] }}>{menu.label}</span>
                    {isActive && <span className="hidden lg:block text-[11px] md:text-[12px] truncate mt-[2px] leading-tight" style={{ color: colors.neutral[5] }}>{menu.shortDesc}</span>}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)]">
          {isSearching && (
            <div className="mb-[16px] md:mb-[24px] animate-fade-slide-stagger" style={{ animationDelay: '0s' }}>
              <h3 className="text-[18px] md:text-[20px] font-bold" style={{ color: colors.neutral[7] }}>Resultados da pesquisa para: <span style={{ color: colors.primary.base }}>"{searchQuery}"</span></h3>
              <p className="text-[13px] md:text-[14px]" style={{ color: colors.neutral[5] }}>{displayedCards.length} ferramenta(s) encontrada(s).</p>
            </div>
          )}
          <div key={isSearching ? 'search-mode' : activeMenu} className={`grid gap-[16px] content-start min-h-[300px] lg:min-h-[500px] transition-all duration-500 ${isSearching ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1 md:grid-cols-2'}`}>
            {displayedCards.length > 0 ? (
              displayedCards.map((card, index) => {
                const isFav = favorites.includes(card.id);
                return (
                  <div key={index} className="p-[20px] md:p-[24px] rounded-[8px] border transition-all flex flex-col group h-full animate-fade-slide-stagger opacity-0 relative hover:shadow-[0_10px_25px_-5px_rgba(0,139,201,0.25)]" style={{ borderColor: colors.neutral[2], backgroundColor: colors.neutral[0], animationDelay: `${index * 0.06}s` }}>
                    <div className="flex gap-[12px] md:gap-[16px] items-start h-full cursor-pointer" onClick={() => card.route && navigateTo(card.route)}>
                      <div className="mt-[2px] transition-colors duration-200 shrink-0 group-hover:text-[#008BC9]" style={{ color: colors.neutral[5] }}>{card.icon}</div>
                      <div className="flex flex-col h-full overflow-hidden pr-[24px]">
                        <h4 className="text-[14px] md:text-[16px] font-bold leading-tight mb-[6px] md:mb-[8px] truncate" title={card.title} style={{ color: colors.neutral[7] }}>{card.title}</h4>
                        <p className="text-[12px] md:text-[14px] leading-relaxed line-clamp-3" style={{ color: colors.neutral[5] }}>{card.desc}</p>
                      </div>
                    </div>
                    {/* Botão de Favorito (Removido Temporariamente) */}
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-[40px] md:py-[64px] flex flex-col items-center justify-center text-center">
                <Search size={40} className="mb-[16px] opacity-20" style={{ color: colors.neutral[5] }} />
                <p className="text-[16px] md:text-[18px] font-semibold" style={{ color: colors.neutral[7] }}>Nenhuma ferramenta encontrada</p>
                <p className="text-[13px] md:text-[14px] mt-[8px]" style={{ color: colors.neutral[5] }}>Tente buscar por termos diferentes.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
};

export default Dashboard;
