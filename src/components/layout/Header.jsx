import React from 'react';
import { Menu, Grip, HelpCircle, Accessibility, Contrast, ChevronDown, User, Settings, Bell, LogOut } from 'lucide-react';
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
  setCurrentScreen,
  closeAllDropdowns,
  openGripDrawer
}) => {
  return (
    <header className="sticky top-0 z-[1000] px-[16px] md:px-[24px] py-[10px] md:py-[16px] border-b flex justify-between items-center transition-colors duration-500" style={{ borderColor: colors.neutral[2], backgroundColor: colors.neutral[0] }}>
      {/* ══ ESQUERDA: MENU E LOGO ══════════════════════════════════════════ */}
      <div className="flex items-center gap-[12px] md:gap-[24px]">
        <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => navigateTo('dashboard')}>
          <LogoFgv colors={colors} isHighContrast={isHighContrast} />
        </div>
      </div>

      {/* ══ DIREITA: AÇÕES E PERFIL ════════════════════════════════════════ */}
      <div className="flex items-center gap-[4px] md:gap-[12px]">
        {/* Ajuda (Apenas Desktop) */}
        <Button
          variant="tertiary"
          appearance="ghost"
          size="md"
          tertiaryTone="high"
          iconLeft={<HelpCircle />}
          className="hidden md:flex"
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
            tertiaryTone="high"
            iconLeft={<Grip />}
            onClick={openGripDrawer}
            className={isGripOpen ? 'bg-[var(--neutral-3)]' : ''}
          />
          <GripMenu
            colors={colors}
            isGripOpen={isGripOpen}
            setIsGripOpen={setIsGripOpen}
            gripActiveTab={gripActiveTab}
            setGripActiveTab={setGripActiveTab}
            currentScreen={currentScreen}
            navigateTo={navigateTo}
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
        />

        {/* Perfil */}
        <div className="relative ml-[4px] md:ml-[8px]">
          <div
            className="flex items-center gap-[4px] cursor-pointer p-[2px] md:p-[4px] rounded-full transition-all border hover:shadow-sm"
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsA11yOpen(false); }}
            style={{
              backgroundColor: isProfileOpen ? colors.neutral[1] : 'transparent',
              borderColor: isProfileOpen ? colors.neutral[3] : 'transparent'
            }}
          >
            <img
              src="https://i.pinimg.com/736x/51/09/b1/5109b1d79c9a9bb693d9464c675248db.jpg"
              alt="Avatar"
              className="w-[32px] h-[32px] md:w-[40px] md:h-[40px] rounded-full object-cover border"
              style={{ borderColor: colors.neutral[2] }}
            />
            <ChevronDown size={14} className={`hidden sm:block transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} style={{ color: colors.neutral[5], marginRight: '4px' }} />
          </div>

          {/* Menu de Perfil Completo */}
          {isProfileOpen && (
            <div className="absolute top-[100%] right-0 mt-[12px] w-[260px] md:w-[280px] border rounded-[12px] shadow-2xl z-[120] flex flex-col overflow-hidden" style={{ backgroundColor: colors.neutral[0], borderColor: colors.neutral[2] }}>
              <div className="px-[20px] py-[16px] border-b flex items-center gap-[12px]" style={{ borderColor: colors.neutral[2], backgroundColor: colors.neutral[1] }}>
                <img src="https://i.pinimg.com/736x/51/09/b1/5109b1d79c9a9bb693d9464c675248db.jpg" alt="Avatar" className="w-[44px] h-[44px] rounded-full object-cover border-2" style={{ borderColor: colors.primary.extraLight }} />
                <div className="flex flex-col overflow-hidden">
                  <span className="block text-[14px] font-bold truncate" style={{ color: colors.neutral[7] }}>David Salviano</span>
                  <span className="block text-[11px] font-medium truncate" style={{ color: colors.primary.base }}>Gestor Educacional</span>
                </div>
              </div>
              <div className="py-[6px] flex flex-col gap-[2px]">
                <button className="mx-[4px] flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] font-semibold transition-colors rounded-[8px] hover:bg-[var(--neutral-2)]" style={{ color: colors.neutral[7] }}>
                  <User size={18} /> Meu Perfil
                </button>
              </div>
              <div className="border-t py-[6px]" style={{ borderColor: colors.neutral[2] }}>
                <button
                  className="mx-[4px] w-[calc(100%-8px)] flex items-center gap-[12px] px-[16px] py-[10px] text-[13px] font-bold transition-colors rounded-[8px] hover:bg-red-50 text-red-600"
                  onClick={() => { closeAllDropdowns(); setIsLoggedIn(false); setUsername(''); setPassword(''); setSearchQuery(''); setFontScale(3); setIsHighContrast(false); setCurrentScreen('dashboard'); }}
                >
                  <LogOut size={18} /> Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {(isA11yOpen || isProfileOpen) && isGripOpen && (
        <div className="fixed inset-0 z-[110] bg-black/5" onClick={() => { setIsA11yOpen(false); setIsProfileOpen(false); }} />
      )}
    </header>
  );
};

export default Header;
