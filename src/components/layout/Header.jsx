import React from 'react';
import { Menu, Grip, HelpCircle, Accessibility, Contrast, ChevronDown, User, Settings, Bell, LogOut } from 'lucide-react';
import LogoFgv from '../ui/LogoFgv';
import Button from '../ui/Button';
import GripMenu from './GripMenu';
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
    <header className="sticky top-0 z-50 px-[16px] md:px-[32px] py-[12px] md:py-[16px] border-b flex justify-between items-center transition-colors duration-500" style={{ borderColor: colors.neutral[2], backgroundColor: colors.neutral[0] }}>
      <div className="flex items-center gap-[24px] md:gap-[40px]">
        <Menu className="block lg:hidden cursor-pointer" size={24} style={{ color: colors.neutral[7] }} />

        <div className="flex items-center gap-[12px] cursor-pointer" onClick={() => navigateTo('dashboard')}>
          <LogoFgv colors={colors} isHighContrast={isHighContrast} />
        </div>

        {/* Desktop Navigation */}
        {currentScreen === 'acompanhamento' && (
          <nav className="hidden lg:flex items-center gap-[32px] text-[14px] font-bold h-full">
            <span className="cursor-pointer hover:underline" style={{ color: colors.neutral[5] }} onClick={() => navigateTo('dashboard')}>Dashboard</span>
            <span className="cursor-pointer hover:underline" style={{ color: colors.neutral[5] }} onClick={() => navigateTo('generic')}>Módulos</span>
            <span className="cursor-pointer hover:underline" style={{ color: colors.neutral[5] }}>Devolutivas</span>
            <span className="cursor-pointer border-b-2 pb-[4px]" style={{ color: colors.primary.base, borderColor: colors.primary.base }}>Acompanhamento Escolar</span>
          </nav>
        )}
      </div>

      <div className="flex items-center gap-[4px] md:gap-[8px]">
        <div className="flex items-center gap-[4px] md:gap-[8px]">
          <Button 
            variant="text" 
            size="default" 
            className="!normal-case !font-medium hidden md:flex" 
            style={{ color: colors.neutral[6] }}
            onClick={() => navigateTo('help', 'Ajuda e Suporte')}
          >
            <HelpCircle size={18} /> Ajuda
          </Button>

          <div className="relative">
            <Button
              variant="text"
              iconOnly
              size="default"
              onClick={openGripDrawer}
              style={{
                color: colors.neutral[6],
                backgroundColor: isGripOpen ? colors.neutral[3] : 'transparent'
              }}
            >
              <Grip size={20} />
            </Button>

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

          <div className="relative">
            <Button variant="primary" iconOnly size="default" className="md:w-[40px] md:h-[40px] w-[32px] h-[32px]" onClick={() => { setIsA11yOpen(!isA11yOpen); setIsProfileOpen(false); }}><Accessibility className="w-[18px] h-[18px] md:w-[20px] md:h-[20px]" /></Button>
            {isA11yOpen && (
              <div className="absolute top-[100%] right-0 mt-[8px] w-[260px] md:w-[280px] p-[16px] rounded-[8px] shadow-2xl z-[120] flex flex-col gap-[16px] border" style={{ backgroundColor: isHighContrast ? colors.neutral[0] : '#003A79', color: '#FFF', borderColor: colors.neutral[3] }}>
                <div className="flex items-center gap-[12px] cursor-pointer hover:bg-white/10 p-[8px] rounded-[8px] transition-colors"><div className="w-[24px] h-[24px] bg-white rounded-[4px] font-bold text-[12px] flex justify-center items-center" style={{ color: isHighContrast ? '#222' : '#003A79' }}>VL</div><span className="text-[13px] md:text-[14px] font-semibold">Tradutor de VLibras</span></div>
                <hr className="border-white/20" />
                <div className="flex flex-col gap-[12px] px-[8px]">
                  <span className="text-[11px] md:text-[12px] font-semibold opacity-80 uppercase tracking-wider">Tamanho da fonte</span>
                  <div className="flex items-center justify-between gap-[12px]">
                    <button onClick={() => setFontScale(Math.max(1, fontScale - 1))} className="text-[12px] font-bold hover:text-[#94CFEF] transition-colors">A-</button>
                    <div className="flex-1 flex justify-between items-center h-[4px] bg-white/20 rounded-full relative">
                      {[1, 2, 3, 4, 5].map(step => (<div key={step} className={`w-[8px] h-[8px] rounded-full transition-colors z-10 ${fontScale >= step ? 'bg-white' : 'bg-transparent'}`} />))}
                      <div className="absolute left-0 h-full bg-white rounded-full transition-all duration-300" style={{ width: `${(fontScale - 1) * 25}%` }} />
                    </div>
                    <button onClick={() => setFontScale(Math.min(5, fontScale + 1))} className="text-[16px] md:text-[18px] font-bold hover:text-[#94CFEF] transition-colors">A+</button>
                  </div>
                </div>
                <hr className="border-white/20" />
                <div className="flex items-center gap-[12px] cursor-pointer hover:bg-white/10 p-[8px] rounded-[8px] transition-colors" onClick={() => { setIsHighContrast(!isHighContrast); setIsA11yOpen(false); }}><Contrast size={20} /><span className="text-[13px] md:text-[14px] font-semibold">{isHighContrast ? 'Desativar Alto Contraste' : 'Ativar Alto Contraste'}</span></div>
              </div>
            )}
          </div>
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
