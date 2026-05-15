import React from 'react';
import { Menu, Grip, HelpCircle, Accessibility, Contrast, ChevronDown, User, Settings, Bell, LogOut, Moon, Sun } from 'lucide-react';
import LogoFgv from '../ui/LogoFgv';
import Button from '../ui/Button';
import GripMenu from './GripMenu';
import AccessibilityMenu from './AccessibilityMenu';
import { sidebarMenus } from '../../data/constants';

const Header = ({
  colors,
  isHighContrast,
  setIsHighContrast,
  currentScreen,
  navigateTo,
  isGripOpen,
  setIsGripOpen,
  gripActiveTab,
  setGripActiveTab,
  isA11yOpen,
  setIsA11yOpen,
  isProfileOpen,
  setIsProfileOpen,
  fontScale,
  setFontScale,
  setIsLoggedIn,
  setUsername,
  setPassword,
  setSearchQuery,
  closeAllDropdowns,
  openGripDrawer,
  isDarkMode,
  setIsDarkMode
}) => {
  const [showLogoutModal, setShowLogoutModal] = React.useState(false);

  const handleLogout = () => {
    closeAllDropdowns();
    setIsLoggedIn(false);
    setUsername('');
    setPassword('');
    setSearchQuery('');
    setFontScale(3);
    setIsHighContrast(false);
    setShowLogoutModal(false);
  };

  return (
    <header className="sticky top-0 z-[1000] px-[16px] md:px-[24px] py-[10px] md:py-[16px] border-b flex justify-between items-center transition-colors duration-500" style={{ borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2], backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[0] }}>
      {/* ══ ESQUERDA: MENU E LOGO ══════════════════════════════════════════ */}
      <div className="flex items-center gap-[12px] md:gap-[24px]">
        <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => navigateTo('dashboard')}>
          <LogoFgv colors={colors} isHighContrast={isHighContrast} isDarkMode={isDarkMode} />
        </div>
      </div>

      {/* ══ DIREITA: AÇÕES E PERFIL ════════════════════════════════════════ */}
      <div className="flex items-center gap-[4px] md:gap-[12px]">
        {/* Ajuda (Apenas Desktop) */}
        <Button
          variant="tertiary"
          appearance="ghost"
          size="md"
          tertiaryTone={isDarkMode ? "low" : "high"}
          iconLeft={<HelpCircle />}
          className={`hidden md:flex ${isDarkMode ? "text-white hover:bg-white/10" : ""}`}
          onClick={() => window.open('https://dev-ajuda.cenpe.ufc.br/guides/practical_guides', '_blank')}
        >
          Ajuda
        </Button>

        {/* Grip Menu */}
        <div className="relative">
          <Button
            variant="tertiary"
            appearance="ghost"
            iconOnly
            size="md"
            selected={isGripOpen}
            tertiaryTone={isDarkMode ? "low" : "high"}
            iconLeft={<Grip color={isGripOpen ? (isDarkMode ? colors.neutral[3] : undefined) : undefined} />}
            onClick={openGripDrawer}
            className={isDarkMode
              ? (isGripOpen ? "!bg-white/20 !text-white" : "text-white hover:!bg-white/10")
              : (isGripOpen ? "" : "hover:!bg-[var(--neutral-2)]")
            }
          />
          <GripMenu
            colors={colors}
            isGripOpen={isGripOpen}
            setIsGripOpen={setIsGripOpen}
            gripActiveTab={gripActiveTab}
            setGripActiveTab={setGripActiveTab}
            currentScreen={currentScreen}
            navigateTo={navigateTo}
            isDarkMode={isDarkMode}
          />
        </div>

        {/* Acessibilidade */}
        <AccessibilityMenu
          colors={colors}
          isHighContrast={isHighContrast}
          setIsHighContrast={setIsHighContrast}
          isA11yOpen={isA11yOpen}
          setIsA11yOpen={setIsA11yOpen}
          setIsProfileOpen={setIsProfileOpen}
          fontScale={fontScale}
          setFontScale={setFontScale}
          isDarkMode={isDarkMode}
        />

        {/* Perfil */}
        <div className="relative ml-[4px] md:ml-[8px]">
          <div
            className={`flex items-center gap-[4px] cursor-pointer p-[2px] md:p-[4px] rounded-full transition-all border hover:shadow-md ${isDarkMode ? 'hover:bg-white/10' : ''}`}
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsA11yOpen(false); }}
            onMouseEnter={(e) => {
              if (!isDarkMode && !isProfileOpen) e.currentTarget.style.backgroundColor = colors.neutral[2];
            }}
            onMouseLeave={(e) => {
              if (!isDarkMode && !isProfileOpen) e.currentTarget.style.backgroundColor = 'transparent';
            }}
            style={{
              backgroundColor: isProfileOpen ? (isDarkMode ? 'rgba(255,255,255,0.2)' : colors.neutral[1]) : 'transparent',
              borderColor: isProfileOpen ? (isDarkMode ? 'rgba(255,255,255,0.3)' : colors.neutral[3]) : 'transparent'
            }}
          >
            <img
              src="https://i.pinimg.com/736x/51/09/b1/5109b1d79c9a9bb693d9464c675248db.jpg"
              alt="Avatar"
              className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] rounded-full object-cover border"
              style={{ borderColor: isDarkMode ? colors.neutral[4] : colors.neutral[2] }}
            />
            <ChevronDown size={14} className={`hidden sm:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[5], marginRight: '4px' }} />
          </div>

          {/* Menu de Perfil Completo */}
          {isProfileOpen && (
            <div className="absolute top-[100%] right-0 mt-[12px] w-[260px] md:w-[280px] border rounded-[12px] shadow-2xl z-[120] flex flex-col overflow-hidden" style={{ backgroundColor: isDarkMode ? colors.neutral[7] : colors.neutral[0], borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }}>
              <div className="px-[20px] py-[16px] border-b flex items-center gap-[12px]" style={{ borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2], backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[1] }}>
                <img src="https://i.pinimg.com/736x/51/09/b1/5109b1d79c9a9bb693d9464c675248db.jpg" alt="Avatar" className="w-[44px] h-[44px] rounded-full object-cover border-2" style={{ borderColor: colors.primary.extraLight }} />
                <div className="flex flex-col overflow-hidden">
                  <span className="block text-[14px] font-bold truncate" style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}>David Salviano</span>
                  <span className="block text-[11px] font-medium truncate" style={{ color: colors.primary.base }}>Gestor Educacional</span>
                </div>
              </div>
              <div className="py-[6px] flex flex-col gap-[2px]">
                <button className="mx-[4px] flex items-center gap-[12px] px-[16px] py-[10px] text-[14px] font-semibold transition-colors rounded-[8px] hover:bg-[var(--neutral-2)]" style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}>
                  <User size={18} /> Meu Perfil
                </button>
                <button
                  onClick={() => setIsDarkMode(!isDarkMode)}
                  className="mx-[4px] flex items-center justify-between px-[16px] py-[10px] text-[14px] font-semibold transition-colors rounded-[8px] hover:bg-[var(--neutral-2)]"
                  style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}
                >
                  <div className="flex items-center gap-[12px]">
                    {isDarkMode ? <Sun size={18} /> : <Moon size={18} />}
                    Modo Escuro
                  </div>
                  <div className={`w-[32px] h-[18px] rounded-full relative transition-colors ${isDarkMode ? 'bg-[#008BC9]' : 'bg-gray-300'}`}>
                    <div className={`absolute top-[2px] w-[14px] h-[14px] rounded-full bg-white transition-all shadow-sm ${isDarkMode ? 'right-[2px]' : 'left-[2px]'}`}></div>
                  </div>
                </button>
              </div>
              <div className="border-t py-[6px]" style={{ borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2] }}>
                <button
                  className="mx-[4px] w-[calc(100%-8px)] flex items-center gap-[12px] px-[16px] py-[10px] text-[14px] font-bold transition-colors rounded-[8px] hover:bg-red-50 text-red-600"
                  onClick={() => { setIsProfileOpen(false); setShowLogoutModal(true); }}
                >
                  <LogOut size={18} /> Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Modal de Confirmação de Logout */}
        {showLogoutModal && (
          <div className="fixed inset-0 z-[2000] flex items-center justify-center p-[16px]">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowLogoutModal(false)}></div>
            <div className="relative bg-white rounded-[16px] shadow-2xl w-full max-w-[400px] overflow-hidden animate-in zoom-in-95 duration-200" style={{ backgroundColor: isDarkMode ? colors.neutral[7] : colors.neutral[0], border: `1px solid ${isDarkMode ? colors.neutral[5] : colors.neutral[2]}` }}>
              <div className="p-[24px] md:p-[32px] flex flex-col items-center text-center">
                <div className="w-[64px] h-[64px] rounded-full bg-red-50 flex items-center justify-center mb-[20px]" style={{ backgroundColor: isDarkMode ? 'rgba(224, 1, 32, 0.1)' : 'rgba(224, 1, 32, 0.05)' }}>
                  <LogOut size={32} className="text-red-600" />
                </div>
                <h3 className="text-[20px] font-bold mb-[12px]" style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[7] }}>Sair da conta</h3>
                <p className="text-[14px] mb-[32px] leading-relaxed" style={{ color: isDarkMode ? colors.neutral[2] : colors.neutral[5] }}>
                  Você tem certeza que deseja encerrar sua sessão? Suas alterações não salvas poderão ser perdidas.
                </p>
                <div className="flex flex-col w-full gap-[8px]">
                  <Button
                    variant="primary"
                    size="md"
                    justify="center"
                    className="w-full !bg-red-600 hover:!bg-red-700 !border-red-600"
                    onClick={handleLogout}
                  >
                    Sim, sair agora
                  </Button>
                  <Button
                    variant="tertiary"
                    appearance="ghost"
                    size="md"
                    justify="center"
                    className="w-full"
                    onClick={() => setShowLogoutModal(false)}
                    style={{ color: isDarkMode ? colors.neutral[0] : colors.neutral[6] }}
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {(isA11yOpen || isProfileOpen) && isGripOpen && (
        <div className="fixed inset-0 z-[110] bg-black/5" onClick={() => { setIsA11yOpen(false); setIsProfileOpen(false); }} />
      )}
    </header>
  );
};

export default Header;
