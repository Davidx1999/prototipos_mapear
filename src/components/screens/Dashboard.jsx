import React from 'react';
import {
  Search, X, Star, Grid, PenTool, LayoutDashboard,
  TrendingUp, CheckSquare, Users, BookOpen,
  ChevronRight, ClipboardList, PieChart, Map, GraduationCap,
  Heart
} from 'lucide-react';
import { sidebarMenus } from '../../data/constants';

// ══ COMPONENTE (PROPOSTA 4: MASTER-DETAIL / PAINEL UNIFICADO) ════
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
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[32px] transition-all duration-300" style={{ backgroundColor: colors.neutral[0] }}>

      {/* ══ ESTILOS DAS ANIMAÇÕES (FIRULAS DE CONEXÃO) ════════════════════════════════ */}
      <style>{`
        /* O Segredo do UX: Aba Contínua que quebra a fronteira visual */
        .menu-tab-active {
          background-color: ${colors.neutral[0]};
          border-top: 1px solid ${colors.neutral[2]};
          border-bottom: 1px solid ${colors.neutral[2]};
          border-left: 4px solid ${colors.primary.base};
          /* O +1px faz com que o botão cubra exatamente a linha de separação! */
          width: calc(100% + 1px);
          z-index: 20;
          box-shadow: -4px 4px 10px rgba(0,0,0,0.02);
        }
        .menu-tab-inactive {
          background-color: transparent;
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
          border-left: 4px solid transparent;
          width: 100%;
          z-index: 10;
          color: ${colors.neutral[6]};
        }
        .menu-tab-inactive:hover {
          background-color: rgba(0,0,0,0.03);
          color: ${colors.primary.base};
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
        className="relative w-full rounded-[12px] p-[24px] md:p-[40px] overflow-hidden flex flex-col justify-center transition-colors duration-500 shadow-sm"
        style={{
          background: `linear-gradient(135deg, ${colors.primary.ultraDark} 56%, ${colors.primary.dark} 100%)`,
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
          <span className="text-[12px] md:text-[14px] font-medium mb-[4px] block" style={{ color: isHighContrast ? '#FFFFFF' : colors.neutral[2] }}>Bem-vinda de volta</span>
          <h2 className="text-[24px] md:text-[32px] font-bold mb-[8px]" style={{ color: isHighContrast ? colors.primary.base : colors.neutral[0] }}>Olá, David Salviano</h2>
          <p className="text-[13px] md:text-[14px] font-medium" style={{ color: isHighContrast ? '#FFFFFF' : colors.neutral[2] }}>Realize sua gestão educacional com o Mapear.</p>
        </div>
      </div>

      {/* ══ SEARCH BAR ══════════════════════════════════════════════════════ */}
      <div className="mt-[24px] md:mt-[32px] mb-[24px] relative w-full group">
        <Search size={20} className="absolute left-[16px] top-1/2 -translate-y-1/2 transition-colors group-focus-within:text-[#008BC9]" style={{ color: colors.neutral[4] }} />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Pesquise pela plataforma (ex: alunos, notas, avaliações)..."
          className="w-full pl-[48px] pr-[48px] py-[14px] md:py-[18px] rounded-[10px] border text-[13px] md:text-[14px] outline-none transition-all duration-300 focus:shadow-md focus:border-[#008BC9] bg-white"
          style={{ borderColor: colors.neutral[3], color: colors.neutral[7] }}
        />
        {searchQuery && <X size={20} className="absolute right-[16px] top-1/2 -translate-y-1/2 cursor-pointer hover:text-red-500 transition-colors" onClick={() => setSearchQuery('')} style={{ color: colors.neutral[5] }} />}
      </div>

      {/* ══ PAINEL MASTER-DETAIL COM CONEXÃO FÍSICA (ABA CONTÍNUA) ══════════════ */}
      <div className="w-full flex flex-col md:flex-row overflow-hidden min-h-[500px] rounded-[12px] border shadow-sm" style={{ borderColor: colors.neutral[2] }}>

        {/* LADO ESQUERDO: MASTER (MENU DE MÓDULOS) */}
        <div
          className={`shrink-0 flex flex-col overflow-visible transition-all duration-500 ease-[cubic-bezier(0.4,0,0.2,1)] ${isSearching ? 'h-0 opacity-0 lg:w-0 border-r-0' : 'w-full lg:w-[360px] opacity-100 border-r'} relative z-10`}
          style={{ borderColor: colors.neutral[2], backgroundColor: colors.neutral[1] }}
        >
          <div className="flex lg:flex-col overflow-x-auto lg:overflow-visible hide-scrollbar py-[24px]">

            <h3 className="hidden lg:block text-[20px] font-bold tracking-wider mb-[16px] px-[24px]" style={{ color: colors.neutral[7] }}>
              Ferramentas do Mapear
            </h3>

            {sidebarMenus.map((menu) => {
              const isActive = activeMenu === menu.id;
              const isHovered = hoveredMenu === menu.id;
              // active: neutral 7 label, neutral 0 icon, primary.base bg
              // inactive: neutral 6 label/icon. hover: primary.base label/icon
              const labelColor = isActive ? colors.neutral[7] : (isHovered ? colors.primary.base : colors.neutral[6]);
              const iconColor = isActive ? colors.neutral[0] : (isHovered ? colors.primary.base : colors.neutral[6]);
              const iconBg = isActive ? colors.primary.base : 'transparent';

              return (
                <button
                  key={menu.id}
                  onClick={() => setActiveMenu(menu.id)}
                  onMouseEnter={() => setHoveredMenu(menu.id)}
                  onMouseLeave={() => setHoveredMenu(null)}
                  className={`relative flex items-center gap-[12px] md:gap-[16px] px-[24px] py-[16px] text-left transition-colors overflow-visible group ${isActive ? 'menu-tab-active' : 'menu-tab-inactive'}`}
                >
                  <div className={`w-[40px] h-[40px] shrink-0 flex items-center justify-center rounded-[6px] transition-colors ${isActive ? 'shadow-md' : ''}`} style={{ backgroundColor: iconBg, color: iconColor }}>
                    {menu.icon}
                  </div>
                  <div className="flex flex-col justify-center overflow-hidden flex-1">
                    <span className="font-semibold text-[14px] md:text-[16px] truncate transition-colors" style={{ color: labelColor }}>
                      {menu.label}
                    </span>
                    {isActive && <span className="hidden lg:block text-[11px] md:text-[12px] truncate mt-[2px] leading-tight" style={{ color: colors.neutral[5] }}>{menu.shortDesc}</span>}
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
          style={{ backgroundColor: colors.neutral[0] }}
        >
          {/* FIRULA: Onda de luz guiando a visão da esquerda para a direita */}
          {!isSearching && <div className="connection-ripple" />}

          {/* Cabeçalho do Conteúdo */}
          {isSearching && (
            <div className="mb-[24px] relative z-10 border-b pb-[16px]" style={{ borderColor: colors.neutral[2] }}>
              <h3 className="text-[20px] md:text-[24px] font-bold" style={{ color: colors.neutral[7] }}>
                Resultados para: <span style={{ color: colors.primary.base }}>"{searchQuery}"</span>
              </h3>
              <p className="text-[14px] mt-1" style={{ color: colors.neutral[5] }}>{displayedCards.length} ferramenta(s) encontrada(s).</p>
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
                    className="card-flow p-[20px] rounded-[10px] border transition-all duration-300 flex flex-col group h-full relative cursor-pointer hover:shadow-[0_8px_16px_-6px_rgba(12,99,170,0.2)] bg-white"
                    style={{
                      borderColor: colors.neutral[2],
                      animationDelay: `${index * 80}ms`
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.borderColor = colors.primary.base}
                    onMouseLeave={(e) => e.currentTarget.style.borderColor = colors.neutral[2]}
                    onClick={() => navigateTo(card.route || 'empty-state', card.title)}
                  >

                    <div className="flex justify-between items-start mb-[16px]">
                      <div className="p-[10px] rounded-[8px] transition-colors group-hover:bg-[#E5F3F9] group-hover:text-[#008BC9] shadow-sm" style={{ backgroundColor: colors.neutral[1] }}>
                        {card.icon}
                      </div>
                      {/* 
                      <button
                        className="p-[4px] z-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavorite(card.id);
                        }}
                        title="Favoritar"
                      >
                        <Heart size={20} className={`transition-colors ${isFav ? 'fill-red-500 text-red-500' : 'text-gray-300 hover:text-red-400'}`} />
                      </button>
                      */}
                    </div>

                    <div className="flex flex-col h-full">
                      <h4 className="text-[16px] font-bold leading-tight mb-[8px] group-hover:text-[#008BC9] transition-colors" title={card.title} style={{ color: colors.neutral[7] }}>
                        {card.title}
                      </h4>
                      <p className="text-[13px] leading-relaxed mb-[16px] line-clamp-3" style={{ color: colors.neutral[5] }}>
                        {card.desc}
                      </p>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-[64px] flex flex-col items-center justify-center text-center">
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
