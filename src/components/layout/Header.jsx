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
    <header className="sticky top-0 z-50 px-[16px] md:px-[32px] lg:px-[24px] xl:px-[32px] py-[12px] md:py-[16px] border-b flex justify-between items-center transition-colors duration-500" style={{ borderColor: colors.neutral[2], backgroundColor: colors.neutral[0] }}>
      <div className="flex items-center gap-[24px] md:gap-[40px]">
        <Menu className="block lg:hidden cursor-pointer" size={24} style={{ color: colors.neutral[7] }} />

        <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => navigateTo('dashboard')}>
          <LogoFgv colors={colors} isHighContrast={isHighContrast} />
        </div>

      </div>

      <div className="flex items-center gap-[4px] md:gap-[8px]">
        <div className="flex items-center gap-[4px] md:gap-[8px]">
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
        </div>

        <div className="relative flex items-center gap-[16px]">
          {/* Botão de Perfil Simplificado (Apenas Foto e Ícone) */}
          <div
            className="flex items-center gap-[8px] cursor-pointer p-[4px] md:p-[6px] rounded-full transition-colors border"
            onClick={() => { setIsProfileOpen(!isProfileOpen); setIsA11yOpen(false); }}
            style={{ backgroundColor: isProfileOpen ? colors.neutral[1] : 'transparent', borderColor: isProfileOpen ? colors.neutral[3] : 'transparent' }}
          >
            <img src="https://i.pinimg.com/736x/51/09/b1/5109b1d79c9a9bb693d9464c675248db.jpg" alt="Avatar" className="w-[32px] h-[32px] md:w-[36px] md:h-[36px] rounded-full object-cover" />
            <ChevronDown size={16} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} style={{ color: colors.neutral[5], marginRight: '4px' }} />
          </div>

          {/* Menu de Perfil Completo (Dropdown Rico) */}
          {isProfileOpen && (
            <div className="absolute top-[100%] right-0 mt-[12px] w-[280px] border rounded-[12px] shadow-2xl z-[120] flex flex-col overflow-hidden" style={{ backgroundColor: colors.neutral[0], borderColor: colors.neutral[2] }}>

              {/* Cabeçalho do Dropdown (Info do Utilizador) */}
              <div className="px-[20px] py-[16px] border-b flex items-center gap-[12px]" style={{ borderColor: colors.neutral[2], backgroundColor: colors.neutral[1] }}>
                <img src="https://i.pinimg.com/736x/51/09/b1/5109b1d79c9a9bb693d9464c675248db.jpg" alt="Avatar" className="w-[48px] h-[48px] rounded-full object-cover border-2" style={{ borderColor: colors.primary.extraLight }} />
                <div className="flex flex-col overflow-hidden">
                  <span className="block text-[15px] font-bold truncate" style={{ color: colors.neutral[7] }}>David Salviano</span>
                  <span className="block text-[12px] font-medium truncate" style={{ color: colors.primary.base }}>Gestor Educacional</span>
                  <span className="block text-[11px] truncate mt-[2px]" style={{ color: colors.neutral[5] }}>david.oliveira@fgv.br</span>
                </div>
              </div>

              {/* Links de Ação Rápida */}
              <div className="py-[8px] flex flex-col gap-[4px]">
                <button
                  className="mx-[4px] flex items-center gap-[12px] px-[16px] py-[10px] text-[14px] font-medium transition-colors rounded-[8px] hover:bg-[var(--neutral-2)]"
                  style={{ color: colors.neutral[7] }}
                >
                  <User size={18} style={{ color: colors.neutral[7] }} /> Meu Perfil
                </button>
              </div>

              {/* Rodapé (Saída/Logout) */}
              <div className="border-t py-[8px]" style={{ borderColor: colors.neutral[2] }}>
                <button
                  className="mx-[4px] w-[calc(100%-8px)] flex items-center gap-[12px] px-[16px] py-[10px] text-[14px] font-medium transition-colors rounded-[8px] hover:bg-[var(--neutral-2)]"
                  style={{ color: colors.neutral[7] }}
                  onClick={() => { closeAllDropdowns(); setIsLoggedIn(false); setUsername(''); setPassword(''); setSearchQuery(''); setFontScale(3); setIsHighContrast(false); setCurrentScreen('dashboard'); }}
                >
                  <LogOut size={18} /> Sair da conta
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop secundário para bloquear interação com GripMenu quando Dropdowns do Header estiverem abertos */}
      {(isA11yOpen || isProfileOpen) && isGripOpen && (
        <div
          className="fixed inset-0 z-[110] bg-black/5"
          onClick={() => { setIsA11yOpen(false); setIsProfileOpen(false); }}
        />
      )}
    </header>
  );
};

export default Header;
