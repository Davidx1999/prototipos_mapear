import React, { useState, useRef } from 'react';
import {
  Search, X, Star, Grid, List as ListIcon, PenTool, LayoutDashboard,
  TrendingUp, CheckSquare, Users, BookOpen,
  ChevronRight, ClipboardList, PieChart, Map, GraduationCap,
  Heart
} from 'lucide-react';
import { sidebarMenus } from '../../data/constants';
import Input from '../ui/Input';

const Dashboard = ({
  colors,
  isHighContrast,
  searchQuery,
  setSearchQuery,
  activeMenu = 'avaliacoes',
  setActiveMenu,
  hoveredMenu,
  setHoveredMenu = () => {},
  navigateTo,
  favorites = [],
  toggleFavorite = () => {},
  isDarkMode
}) => {
  // Mobile specific state
  const [mobileViewMode, setMobileViewMode] = useState('grid'); // 'grid' | 'list'
  const [mobileActiveMenuIndex, setMobileActiveMenuIndex] = useState(1);
  const [mobileSlideDirection, setMobileSlideDirection] = useState('right');

  const changeMobileCategory = (newIndex, direction) => {
    let dir = direction;
    if (!dir) {
      dir = newIndex > mobileActiveMenuIndex ? 'right' : 'left';
    }
    setMobileSlideDirection(dir);
    setMobileActiveMenuIndex(newIndex);
    if (setActiveMenu && sidebarMenus[newIndex]) {
      setActiveMenu(sidebarMenus[newIndex].id);
    }
  };

  const getFormattedDate = () => {
    const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
    let dateStr = new Date().toLocaleDateString('pt-BR', options);
    return dateStr.charAt(0).toUpperCase() + dateStr.slice(1);
  };

  const isSearching = (searchQuery || '').trim().length > 0;
  const allCards = sidebarMenus.flatMap(menu => menu.cards);

  // Desktop active menu logic
  const desktopActiveData = sidebarMenus.find(m => m.id === activeMenu) || sidebarMenus[0];

  // Mobile active menu logic
  const mobileActiveData = sidebarMenus[mobileActiveMenuIndex] || sidebarMenus[0];

  // Mobile Swipe Logic
  const touchStartX = useRef(null);

  const handleMobileTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const handleMobileTouchEnd = (e) => {
    if (!touchStartX.current || isSearching) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX.current - touchEndX;

    if (diff > 50) {
      const nextIndex = (mobileActiveMenuIndex + 1) % sidebarMenus.length;
      changeMobileCategory(nextIndex, 'right');
    } else if (diff < -50) {
      const prevIndex = (mobileActiveMenuIndex - 1 + sidebarMenus.length) % sidebarMenus.length;
      changeMobileCategory(prevIndex, 'left');
    }
    touchStartX.current = null;
  };

  // Cards display for Desktop vs Mobile
  const desktopDisplayedCards = isSearching
    ? allCards.filter(card => {
      const term = (searchQuery || '').toLowerCase();
      return card.title.toLowerCase().includes(term) || card.desc.toLowerCase().includes(term) || (card.keywords && card.keywords.some(kw => kw.toLowerCase().includes(term)));
    })
    : desktopActiveData?.cards || [];

  const mobileDisplayedCards = isSearching
    ? allCards.filter(card => {
      const term = (searchQuery || '').toLowerCase();
      return card.title.toLowerCase().includes(term) || card.desc.toLowerCase().includes(term) || (card.keywords && card.keywords.some(kw => kw.toLowerCase().includes(term)));
    })
    : mobileActiveData?.cards || [];

  return (
    <div className="flex-1 w-full">
      {/* 📱 MOBILE LAYOUT (< 620px) */}
      <div className="block min-[620px]:hidden flex-1 w-full">
        <main 
          className={`flex-1 w-full transition-colors duration-300 ${
            isDarkMode ? 'bg-neutral-7' : 'bg-neutral-0'
          }`}
        >
          {/* Mobile Animations */}
          <style>{`
            .hide-scrollbar::-webkit-scrollbar {
              display: none;
            }
            .hide-scrollbar {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            @keyframes slideInRight {
              from { transform: translateX(12px); opacity: 0.6; }
              to { transform: translateX(0); opacity: 1; }
            }
            @keyframes slideInLeft {
              from { transform: translateX(-12px); opacity: 0.6; }
              to { transform: translateX(0); opacity: 1; }
            }
            .animate-slide-right {
              animation: slideInRight 0.22s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }
            .animate-slide-left {
              animation: slideInLeft 0.22s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
            }
          `}</style>

          <div className="max-w-[1200px] mx-auto px-4 py-6 flex flex-col gap-3">
            
            {/* Hero Card */}
            <div 
              className="relative overflow-hidden rounded-[12px] p-6 shadow-sm"
              style={{ 
                background: `linear-gradient(135deg, ${colors?.primary?.ultraDark || '#001D31'} 0%, ${colors?.primary?.base || '#008BC9'} 100%)`,
                color: '#FFFFFF'
              }}
            >
              <div className="absolute bottom-0 right-0 opacity-20 pointer-events-none">
                 <svg width="200" height="100" viewBox="0 0 200 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0 100C40 100 60 50 100 50C140 50 160 100 200 100V0H0V100Z" fill="white" opacity="0.1"/>
                    <path d="M0 100C30 80 70 80 100 100C130 120 170 120 200 100V0H0V100Z" fill="white" opacity="0.1"/>
                 </svg>
              </div>

              <div className="relative z-10">
                <p className="text-[13px] font-medium mb-1 opacity-90">Bem-vindo(a)</p>
                <h1 className="text-[24px] font-bold mb-4 tracking-tight">
                  Olá, David Salviano
                </h1>
                <p className="text-[12px] mb-2 opacity-90 whitespace-nowrap">
                  Realize sua gestão educacional com o Mapear.
                </p>
                <p className="text-[13px] font-bold" style={{ color: colors.primary.extraLight }}>
                  {getFormattedDate()}
                </p>
              </div>
            </div>

            {/* Sticky Search & Tools Container */}
            <div className={`sticky top-0 z-30 -mx-4 px-4 pt-3 pb-2 flex flex-col gap-3 transition-colors ${
              isDarkMode ? 'bg-neutral-7' : 'bg-neutral-0'
            }`}>
              {/* Search Input */}
              <div>
                <Input
                  iconLeft={<Search className="text-neutral-4" />}
                  placeholder="Pesquise pela plataforma..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  height="48px"
                  className={`!rounded-[8px] ${
                    isDarkMode ? '!bg-neutral-6 !border-neutral-5 !text-white' : '!bg-white !border-neutral-2'
                  }`}
                />
              </div>

              {/* Tools Section Header */}
              <div className="flex items-center justify-between">
                <h2 className={`text-[18px] font-bold ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                  Ferramentas do Mapear
                </h2>
                
                {/* View Mode Toggle */}
                <div className={`flex items-center p-1 rounded-[8px] ${isDarkMode ? 'bg-neutral-6' : 'bg-neutral-1'}`}>
                  <button
                    onClick={() => setMobileViewMode('grid')}
                    className={`p-2 rounded-[6px] transition-colors ${
                      mobileViewMode === 'grid' 
                        ? (isDarkMode ? 'bg-neutral-5 text-white' : 'bg-[#D9F0FC] text-[#008BC9]') 
                        : 'text-neutral-4 hover:text-neutral-6'
                    }`}
                  >
                    <Grid size={20} />
                  </button>
                  <button
                    onClick={() => setMobileViewMode('list')}
                    className={`p-2 rounded-[6px] transition-colors ${
                      mobileViewMode === 'list' 
                        ? (isDarkMode ? 'bg-neutral-5 text-white' : 'bg-[#D9F0FC] text-[#008BC9]') 
                        : 'text-neutral-4 hover:text-neutral-6'
                    }`}
                  >
                    <ListIcon size={20} />
                  </button>
                </div>
              </div>

              {/* Full Width Divider Line */}
              <div className={`-mx-4 border-b ${isDarkMode ? 'border-neutral-6' : 'border-neutral-2'}`} />
            </div>

            {/* Category Header (Only in Grid Mode when not searching) */}
            {!isSearching && mobileViewMode === 'grid' && (
              <div 
                className="cursor-pointer select-none"
                onTouchStart={handleMobileTouchStart}
                onTouchEnd={handleMobileTouchEnd}
              >
                <div key={`mobile-header-${mobileActiveMenuIndex}-${mobileSlideDirection}`} className={mobileSlideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}>
                  <h3 className={`text-[20px] font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                    {mobileActiveData.label}
                  </h3>
                  <p className={`text-[14px] mb-2 ${isDarkMode ? 'text-neutral-4' : 'text-neutral-5'}`}>
                    {mobileActiveData.shortDesc}
                  </p>
                </div>
                
                {/* Pagination Dots */}
                <div className="flex items-center gap-2">
                  {sidebarMenus.map((_, idx) => (
                    <div 
                      key={idx}
                      onClick={() => changeMobileCategory(idx)}
                      className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                        mobileActiveMenuIndex === idx 
                          ? 'w-6 bg-[#008BC9]' 
                          : `w-2 border-2 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-4'} bg-transparent`
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Search Results Header */}
            {isSearching && (
              <div>
                <h3 className={`text-[20px] font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                  Resultados da Busca
                </h3>
                <p className={`text-[14px] ${isDarkMode ? 'text-neutral-4' : 'text-neutral-5'}`}>
                  Exibindo módulos para "{searchQuery}"
                </p>
              </div>
            )}

            {/* Mobile Cards / List Rendering */}
            {mobileViewMode === 'list' && !isSearching ? (
              /* IDEIA 2: LISTAGEM AGRUPADA CONTÍNUA COM TODAS AS 5 CATEGORIAS (GAP 24px E LINHA DIVISÓRIA) */
              <div className="flex flex-col gap-6 pt-2">
                {sidebarMenus.map((menu, menuIndex) => (
                  <React.Fragment key={menu.id}>
                    {menuIndex > 0 && (
                      <div className={`-mx-4 border-b ${isDarkMode ? 'border-neutral-6' : 'border-neutral-2'}`} />
                    )}
                    <div className="flex flex-col gap-3">
                      {/* Header da Categoria */}
                      <div className="flex items-center gap-2.5 pb-1">
                        <div className={`p-1.5 rounded-[6px] ${isDarkMode ? 'bg-neutral-6 text-white' : 'bg-[#E6F0FF] text-[#008BC9]'}`}>
                          {React.cloneElement(menu.icon, { size: 18 })}
                        </div>
                        <div>
                          <h3 className={`text-[15px] font-bold leading-tight ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                            {menu.label}
                          </h3>
                          <p className={`text-[12px] ${isDarkMode ? 'text-neutral-4' : 'text-neutral-5'}`}>
                            {menu.shortDesc}
                          </p>
                        </div>
                      </div>

                      {/* Lista de Itens da Categoria */}
                      <div className="flex flex-col gap-2">
                        {menu.cards.map((card) => (
                          <div
                            key={card.id}
                            onClick={() => navigateTo(card.route || 'dashboard', card.title)}
                            className={`flex items-center p-3 rounded-[8px] border transition-all cursor-pointer ${
                              isDarkMode 
                                ? 'bg-neutral-7 border-neutral-6 hover:bg-neutral-6' 
                                : 'bg-white border-neutral-2 hover:bg-neutral-50'
                            }`}
                          >
                            <div className={`w-9 h-9 flex items-center justify-center mr-3 shrink-0 rounded-[6px] ${
                              isDarkMode ? 'bg-neutral-6 text-neutral-3' : 'bg-neutral-1 text-neutral-6'
                            }`}>
                              {React.cloneElement(card.icon, { size: 18, strokeWidth: 1.5 })}
                            </div>
                            <h4 className={`font-semibold text-[14px] flex-1 ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                              {card.title}
                            </h4>
                            <ChevronRight size={16} className={isDarkMode ? 'text-neutral-5' : 'text-neutral-4'} />
                          </div>
                        ))}
                      </div>
                    </div>
                  </React.Fragment>
                ))}
              </div>
            ) : (
              /* MODO GRID OU BUSCA */
              <div 
                key={`mobile-cards-${mobileActiveMenuIndex}-${mobileSlideDirection}`}
                className={`
                  ${mobileSlideDirection === 'right' ? 'animate-slide-right' : 'animate-slide-left'}
                  ${mobileViewMode === 'grid' 
                    ? 'grid grid-cols-1 gap-3 min-h-[520px] content-start' 
                    : 'flex flex-col gap-3 min-h-[380px] content-start'
                  }
                `}
                onTouchStart={!isSearching ? handleMobileTouchStart : undefined}
                onTouchEnd={!isSearching ? handleMobileTouchEnd : undefined}
              >
                {mobileDisplayedCards.length > 0 ? (
                  mobileDisplayedCards.map((card) => (
                    <div 
                      key={card.id}
                      onClick={() => navigateTo(card.route || 'dashboard', card.title)}
                      className={`
                        group cursor-pointer transition-all duration-300
                        ${mobileViewMode === 'grid' 
                          ? `flex flex-col p-5 rounded-[12px] border hover:shadow-md ${
                              isDarkMode ? 'bg-neutral-7 border-neutral-6 hover:border-primary-base' : 'bg-white border-neutral-2 hover:border-[#008BC9]'
                            }` 
                          : `flex items-center p-3 rounded-[8px] border transition-all ${
                              isDarkMode 
                                ? 'bg-neutral-7 border-neutral-6 hover:bg-neutral-6' 
                                : 'bg-white border-neutral-2 hover:bg-neutral-50'
                            }`
                        }
                      `}
                    >
                      {mobileViewMode === 'grid' ? (
                        <>
                          <div className="flex items-center gap-3 mb-3">
                            <div 
                              className={`
                                w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 transition-transform group-hover:scale-110
                                ${isDarkMode ? 'bg-neutral-6 text-white' : 'bg-neutral-1 text-neutral-6'}
                              `}
                            >
                              {React.cloneElement(card.icon, { size: 20, strokeWidth: 1.5 })}
                            </div>
                            <h4 className={`font-semibold text-[16px] leading-tight ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                              {card.title}
                            </h4>
                          </div>
                          <p className={`text-[13px] leading-relaxed line-clamp-3 ${isDarkMode ? 'text-neutral-4' : 'text-neutral-5'}`}>
                            {card.desc}
                          </p>
                        </>
                      ) : (
                        <>
                          <div 
                            className={`w-9 h-9 flex items-center justify-center mr-3 shrink-0 rounded-[6px] ${
                              isDarkMode ? 'bg-neutral-6 text-neutral-3' : 'bg-neutral-1 text-neutral-6'
                            }`}
                          >
                            {React.cloneElement(card.icon, { size: 18, strokeWidth: 1.5 })}
                          </div>
                          <h4 className={`font-semibold text-[14px] flex-1 ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
                            {card.title}
                          </h4>
                          <ChevronRight size={16} className={isDarkMode ? 'text-neutral-5' : 'text-neutral-4'} />
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <div className={`col-span-full py-12 text-center ${isDarkMode ? 'text-neutral-4' : 'text-neutral-5'}`}>
                    <Search size={40} className="mx-auto mb-4 opacity-20" />
                    <p>Nenhum módulo encontrado.</p>
                  </div>
                )}
              </div>
            )}
          </div>
        </main>
      </div>

      {/* 💻 ORIGINAL DESKTOP LAYOUT (>= 620px) */}
      <div className="hidden min-[620px]:block flex-1 w-full h-full">
        <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[32px] transition-all duration-500" style={{ backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[0] }}>

          {/* ══ ESTILOS DAS ANIMAÇÕES E RESPONSIVIDADE ORIGINAL DESKTOP ══════════════ */}
          <style>{`
            .menu-tab-active {
              background-color: ${isDarkMode ? colors.neutral[7] : colors.neutral[0]};
              z-index: 20;
              transition: all 0.3s ease;
            }
            .menu-tab-inactive {
              background-color: transparent;
              z-index: 10;
              color: ${isDarkMode ? colors.neutral[2] : colors.neutral[6]};
              transition: all 0.3s ease;
            }
            .menu-tab-inactive:hover {
              background-color: ${isDarkMode ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.03)'};
              color: ${colors.primary.base};
            }

            @media (min-width: 1024px) {
              .menu-tab-active {
                border-top: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
                border-bottom: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
                border-left: 4px solid ${colors.primary.base};
                width: calc(100% + 1px);
                box-shadow: ${isDarkMode ? 'none' : '-4px 4px 10px rgba(0,0,0,0.02)'};
              }
              .menu-tab-inactive {
                border-top: 1px solid transparent;
                border-bottom: 1px solid transparent;
                border-left: 4px solid transparent;
                width: 100%;
              }
            }

            @media (max-width: 1023px) {
              .menu-tab-active {
                border-top: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
                border-left: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
                border-right: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
                border-bottom: 4px solid ${colors.primary.base};
                transform: translateY(1px);
                border-radius: 8px 8px 0 0;
                box-shadow: ${isDarkMode ? 'none' : '0 -4px 10px rgba(0,0,0,0.02)'};
              }
              .menu-tab-inactive {
                border-top: 1px solid transparent;
                border-left: 1px solid transparent;
                border-right: 1px solid transparent;
                border-bottom: 4px solid transparent;
              }
            }

            @keyframes slideFromLeftFlow {
              0% { opacity: 0; transform: translateX(-40px) scale(0.98); }
              100% { opacity: 1; transform: translateX(0) scale(1); }
            }
            .card-flow {
              animation: slideFromLeftFlow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
              opacity: 0; 
            }

            @keyframes rippleWave {
              0% { transform: scaleX(0); opacity: 0.8; }
              100% { transform: scaleX(1); opacity: 0; }
            }
            .connection-ripple {
              position: absolute;
              top: 0; left: 0; bottom: 0; width: 100%;
              background: linear-gradient(90deg, rgba(0,139,201,0.1) 0%, transparent 100%);
              transform-origin: left;
              animation: rippleWave 0.8s ease-out forwards;
              pointer-events: none;
              z-index: 1;
            }

            @keyframes pushRight {
              0%, 100% { transform: translateX(0); }
              50% { transform: translateX(4px); }
            }
            .arrow-push {
              animation: pushRight 1.5s infinite ease-in-out;
            }
          `}</style>

          {/* ══ HERO SECTION ORIGINAL DESKTOP ══════════════════════════════════ */}
          <div
            className="relative w-full rounded-[8px] p-[24px] md:p-[40px] overflow-hidden flex flex-col justify-center transition-colors duration-500 shadow-sm"
            style={{
              background: isDarkMode
                ? `linear-gradient(135deg, ${colors.primary.base} 0%, ${colors.primary.dark} 100%)`
                : `linear-gradient(135deg, ${colors.primary.ultraDark} 56%, ${colors.primary.dark} 100%)`,
              minHeight: '140px',
              border: isHighContrast ? '1px solid #FFFFFF' : 'none'
            }}
          >
            <div
              className="absolute right-0 top-0 bottom-0 w-[60%] md:w-[40%] mix-blend-overlay opacity-60 pointer-events-none"
              style={{
                backgroundImage: `url('${import.meta.env.BASE_URL}assets/bg_card_start_screen.png')`,
                backgroundPosition: 'right bottom',
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                maskImage: 'linear-gradient(to right, transparent, black 40%)',
                WebkitMaskImage: 'linear-gradient(to right, transparent, black 40%)'
              }}
            />

            <div className="relative z-10">
              <span className="text-[12px] md:text-[14px] font-medium mb-[4px] block" style={{ color: isDarkMode ? '#FFFFFF' : (isHighContrast ? '#FFFFFF' : colors.neutral[2]) }}>Bem-vinda de volta</span>
              <h2 className="text-[24px] md:text-[32px] font-bold mb-[8px]" style={{ color: isDarkMode ? colors.primary.extraLight : (isHighContrast ? colors.primary.base : colors.neutral[0]) }}>Olá, David Salviano</h2>
              <p className="text-[14px] md:text-[14px] font-medium mb-[6px]" style={{ color: isDarkMode ? '#FFFFFF' : (isHighContrast ? '#FFFFFF' : colors.neutral[2]) }}>Realize sua gestão educacional com o Mapear.</p>
              <p className="text-[13px] md:text-[14px] font-bold" style={{ color: colors.primary.extraLight }}>{getFormattedDate()}</p>
            </div>
          </div>

          {/* ══ SEARCH BAR ORIGINAL DESKTOP ════════════════════════════════════ */}
          <div className="mt-[24px] md:mt-[24px] mb-[24px]">
            <Input
              iconLeft={<Search />}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquise pela plataforma (ex: alunos, notas, avaliações)..."
              className="focus:shadow-md"
              height="48px"
              style={{
                backgroundColor: isDarkMode ? colors.neutral[7] : colors.neutral[0],
                borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2],
                color: isDarkMode ? colors.neutral[0] : colors.neutral[7]
              }}
              iconRight={searchQuery ? (
                <div onClick={() => setSearchQuery('')} className="hover:text-red-500 transition-colors">
                  <X />
                </div>
              ) : null}
            />
          </div>

          {/* ══ PAINEL MASTER-DETAIL ORIGINAL DESKTOP ══════════════════════════ */}
          <div className="w-full flex flex-col lg:flex-row overflow-hidden min-h-[500px] rounded-[8px] border shadow-sm" style={{ borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }}>

            {/* LADO ESQUERDO: MASTER (MENU DE MÓDULOS) */}
            <div
              className={`shrink-0 flex flex-col overflow-visible transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSearching ? 'h-0 opacity-0 lg:w-0 border-r-0 border-b-0' : 'w-full lg:w-[300px] xl:w-[360px] opacity-100 border-b lg:border-b-0 lg:border-r'} relative z-10`}
              style={{ borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2], backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[1] }}
            >
              <div className="flex flex-row lg:flex-col overflow-x-auto lg:overflow-visible hide-scrollbar pt-[16px] lg:pt-[24px] pb-[0px] lg:pb-[24px] px-[8px] lg:px-[0px] items-end lg:items-stretch">

                <h3 className="hidden lg:block text-[20px] font-bold tracking-wider mb-[16px] px-[24px]" style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}>
                  Ferramentas do Mapear
                </h3>

                {sidebarMenus.map((menu) => {
                  const isActive = activeMenu === menu.id;
                  const isHovered = hoveredMenu === menu.id;
                  const labelColor = isActive ? (isDarkMode ? colors.neutral[0] : colors.neutral[7]) : (isHovered ? (isDarkMode ? colors.primary.light : colors.primary.base) : (isDarkMode ? colors.neutral[2] : colors.neutral[6]));
                  const iconColor = isActive ? colors.neutral[0] : (isHovered ? (isDarkMode ? colors.primary.light : colors.primary.base) : (isDarkMode ? colors.neutral[2] : colors.neutral[6]));
                  const iconBg = isActive ? colors.primary.base : 'transparent';

                  return (
                    <button
                      key={menu.id}
                      onClick={() => setActiveMenu && setActiveMenu(menu.id)}
                      onMouseEnter={() => setHoveredMenu(menu.id)}
                      onMouseLeave={() => setHoveredMenu(null)}
                      className={`relative flex items-center gap-[12px] md:gap-[16px] px-[16px] lg:px-[24px] py-[12px] lg:py-[16px] text-left transition-colors overflow-visible group shrink-0 lg:shrink whitespace-nowrap lg:whitespace-normal ${isActive ? 'menu-tab-active' : 'menu-tab-inactive'}`}
                    >
                      <div className={`w-[32px] h-[32px] lg:w-[40px] lg:h-[40px] shrink-0 flex items-center justify-center rounded-[4px] transition-colors ${isActive ? 'shadow-md' : ''}`} style={{ backgroundColor: iconBg, color: iconColor }}>
                        {React.cloneElement(menu.icon, { size: 18, className: "lg:w-6 lg:h-6" })}
                      </div>
                      <div className="flex flex-col justify-center overflow-hidden flex-1">
                        <span className="font-semibold text-[14px] md:text-[16px] truncate transition-colors" style={{ color: labelColor }}>
                          {menu.label}
                        </span>
                        {isActive && <span className="hidden lg:block text-[11px] md:text-[12px] truncate mt-[2px] leading-tight" style={{ color: isDarkMode ? colors.neutral[2] : colors.neutral[5] }}>{menu.shortDesc}</span>}
                      </div>

                      {isActive && <ChevronRight size={20} className="hidden lg:block transition-all opacity-80 arrow-push" style={{ color: colors.neutral[5] }} />}
                    </button>
                  )
                })}
              </div>
            </div>

            {/* LADO DIREITO: DETAIL (CONTEÚDO/CARDS) */}
            <div
              key={`detail-pane-${activeMenu}-${searchQuery}`}
              className="flex-1 p-[24px] md:pt-[32px] md:px-[32px] flex flex-col relative overflow-hidden z-0"
              style={{ backgroundColor: isDarkMode ? colors.neutral[7] : colors.neutral[0] }}
            >
              {!isSearching && <div className="connection-ripple" />}

              {isSearching && (
                <div className="mb-[24px] relative z-10 border-b pb-[16px]" style={{ borderColor: isDarkMode ? colors.neutral[4] : colors.neutral[2] }}>
                  <h3 className="text-[20px] md:text-[24px] font-bold" style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}>
                    Resultados para: <span style={{ color: isDarkMode ? colors.primary.light : colors.primary.base }}>"{searchQuery}"</span>
                  </h3>
                  <p className="text-[14px] mt-1" style={{ color: isDarkMode ? colors.neutral[2] : colors.neutral[5] }}>{desktopDisplayedCards.length} ferramenta(s) encontrada(s).</p>
                </div>
              )}

              {/* Grid de Cards Original Desktop */}
              <div className={`grid gap-[16px] content-start flex-1 relative z-10 ${isSearching ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
                {desktopDisplayedCards.length > 0 ? (
                  desktopDisplayedCards.map((card, index) => {
                    const isFav = favorites.includes(card.id);
                    return (
                      <div
                        key={card.id}
                        className="card-flow p-[20px] rounded-[8px] border transition-all duration-300 flex flex-col group h-full relative cursor-pointer hover:shadow-[0_8px_16px_-6px_rgba(12,99,170,0.2)]"
                        style={{
                          borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2],
                          backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[0],
                          animationDelay: `${index * 80}ms`
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = isDarkMode ? colors.primary.light : colors.primary.base;
                          const iconBox = e.currentTarget.querySelector('.icon-box');
                          const title = e.currentTarget.querySelector('h4');
                          if (iconBox) {
                            iconBox.style.backgroundColor = isDarkMode ? colors.primary.light : `${colors.primary.base}15`;
                            iconBox.style.color = isDarkMode ? colors.primary.dark : colors.primary.base;
                          }
                          if (title) title.style.color = isDarkMode ? colors.primary.light : colors.primary.base;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = isDarkMode ? colors.neutral[5] : colors.neutral[2];
                          const iconBox = e.currentTarget.querySelector('.icon-box');
                          const title = e.currentTarget.querySelector('h4');
                          if (iconBox) {
                            iconBox.style.backgroundColor = isDarkMode ? colors.neutral[5] : colors.neutral[1];
                            iconBox.style.color = isDarkMode ? colors.neutral[0] : colors.neutral[4];
                          }
                          if (title) title.style.color = isDarkMode ? colors.neutral[0] : colors.neutral[7];
                        }}
                        onClick={() => navigateTo(card.route || 'empty-state', card.title)}
                      >
                        <div className="flex justify-between items-start mb-[16px]">
                          <div
                            className="p-[10px] rounded-[8px] transition-colors shadow-sm icon-box"
                            style={{
                              backgroundColor: isDarkMode ? colors.neutral[5] : colors.neutral[1],
                              color: isDarkMode ? colors.neutral[0] : colors.neutral[4]
                            }}
                          >
                            {card.icon}
                          </div>
                        </div>

                        <div className="flex flex-col h-full">
                          <h4 className="text-[16px] font-bold leading-tight mb-[8px] group-hover:text-brand-base transition-colors" title={card.title} style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}>
                            {card.title}
                          </h4>
                          <p className="text-[14px] leading-relaxed mb-[16px] line-clamp-3" style={{ color: isDarkMode ? colors.neutral[2] : colors.neutral[5] }}>
                            {card.desc}
                          </p>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="col-span-full py-[64px] flex flex-col items-center justify-center text-center">
                    <Search size={40} className="mb-[16px] opacity-20" style={{ color: isDarkMode ? colors.neutral[2] : colors.neutral[5] }} />
                    <p className="text-[16px] md:text-[18px] font-semibold" style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}>Nenhuma ferramenta encontrada</p>
                    <p className="text-[14px] md:text-[14px] mt-[8px]" style={{ color: isDarkMode ? colors.neutral[2] : colors.neutral[5] }}>Tente buscar por termos diferentes.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
