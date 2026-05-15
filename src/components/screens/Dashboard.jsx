import React from 'react';
import {
  Search, X, Star, Grid, PenTool, LayoutDashboard,
  TrendingUp, CheckSquare, Users, BookOpen,
  ChevronRight, ClipboardList, PieChart, Map, GraduationCap,
  Heart
} from 'lucide-react';
import { sidebarMenus } from '../../data/constants';
import Input from '../ui/Input';

// ══ COMPONENTE (PROPOSTA 4: MASTER-DETAIL / PAINEL UNIFICADO) ════
const Dashboard = ({
  colors,
  isHighContrast,
  searchQuery,
  setSearchQuery,
  activeMenu,
  setActiveMenu,
  hoveredMenu,
  navigateTo,
  favorites,
  toggleFavorite,
  isDarkMode
}) => {
  const isSearching = (searchQuery || '').trim().length > 0;
  const allCards = sidebarMenus.flatMap(menu => menu.cards);

  const activeData = sidebarMenus.find(m => m.id === activeMenu) || sidebarMenus[0];

  const displayedCards = isSearching
    ? allCards.filter(card => {
      const term = (searchQuery || '').toLowerCase();
      return card.title.toLowerCase().includes(term) || card.desc.toLowerCase().includes(term) || (card.keywords && card.keywords.some(kw => kw.toLowerCase().includes(term)));
    })
    : activeData?.cards || [];

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[32px] transition-all duration-500" style={{ backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[0] }}>

      {/* ══ ESTILOS DAS ANIMAÇÕES E RESPONSIVIDADE ════════════════════════════════ */}
      <style>{`
        /* O Segredo do UX: Aba Contínua que quebra a fronteira visual */
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

        /* Desktop (lg e acima) */
        @media (min-width: 1024px) {
          .menu-tab-active {
            border-top: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
            border-bottom: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
            border-left: 4px solid ${colors.primary.base};
            /* O +1px faz com que o botão cubra exatamente a linha de separação! */
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

        /* Mobile (abaixo de lg) */
        @media (max-width: 1023px) {
          .menu-tab-active {
            border-top: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
            border-left: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
            border-right: 1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]};
            border-bottom: 4px solid ${colors.primary.base};
            /* Faz com que a aba desça um pixel para cobrir a borda inferior do container */
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

        /* Animação: Cascata vindo da Esquerda (Simula nascer do menu) */
        @keyframes slideFromLeftFlow {
          0% { opacity: 0; transform: translateX(-40px) scale(0.98); }
          100% { opacity: 1; transform: translateX(0) scale(1); }
        }
        .card-flow {
          animation: slideFromLeftFlow 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
          opacity: 0; 
        }

        /* Animação: Onda Azul que guia o olho da esquerda para a direita */
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

        /* Animação: Seta empurrando o conteúdo */
        @keyframes pushRight {
          0%, 100% { transform: translateX(0); }
          50% { transform: translateX(4px); }
        }
        .arrow-push {
          animation: pushRight 1.5s infinite ease-in-out;
        }
      `}</style>

      {/* ══ HERO SECTION ════════════════════════════════════════════════════ */}
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
        {/* Imagem de Fundo (Extrema Direita) */}
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
          <p className="text-[14px] md:text-[14px] font-medium" style={{ color: isDarkMode ? '#FFFFFF' : (isHighContrast ? '#FFFFFF' : colors.neutral[2]) }}>Realize sua gestão educacional com o Mapear.</p>
        </div>
      </div>

      {/* ══ SEARCH BAR ══════════════════════════════════════════════════════ */}
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

      {/* ══ PAINEL MASTER-DETAIL COM CONEXÃO FÍSICA (ABA CONTÍNUA) ══════════════ */}
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
              // active: neutral 7 label, neutral 0 icon, primary.base bg
              // inactive: neutral 6 label/icon. hover: primary.base label/icon
              const labelColor = isActive ? (isDarkMode ? colors.neutral[0] : colors.neutral[7]) : (isHovered ? (isDarkMode ? colors.primary.light : colors.primary.base) : (isDarkMode ? colors.neutral[2] : colors.neutral[6]));
              const iconColor = isActive ? colors.neutral[0] : (isHovered ? (isDarkMode ? colors.primary.light : colors.primary.base) : (isDarkMode ? colors.neutral[2] : colors.neutral[6]));
              const iconBg = isActive ? colors.primary.base : 'transparent';

              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenu(menu.id)}
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

                  {/* FIRULA: A seta empurra levemente na direção do painel da direita */}
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
          {/* FIRULA: Onda de luz guiando a visão da esquerda para a direita */}
          {!isSearching && <div className="connection-ripple" />}

          {/* Cabeçalho do Conteúdo */}
          {isSearching && (
            <div className="mb-[24px] relative z-10 border-b pb-[16px]" style={{ borderColor: isDarkMode ? colors.neutral[4] : colors.neutral[2] }}>
              <h3 className="text-[20px] md:text-[24px] font-bold" style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}>
                Resultados para: <span style={{ color: isDarkMode ? colors.primary.light : colors.primary.base }}>"{searchQuery}"</span>
              </h3>
              <p className="text-[14px] mt-1" style={{ color: isDarkMode ? colors.neutral[2] : colors.neutral[5] }}>{displayedCards.length} ferramenta(s) encontrada(s).</p>
            </div>
          )}

          {/* Grid de Cards */}
          <div className={`grid gap-[16px] content-start flex-1 relative z-10 ${isSearching ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1 md:grid-cols-2 xl:grid-cols-3'}`}>
            {displayedCards.length > 0 ? (
              displayedCards.map((card, index) => {
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
                      <h4 className="text-[16px] font-bold leading-tight mb-[8px] group-hover:text-primary-base transition-colors" title={card.title} style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}>
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
  );
};

export default Dashboard;
