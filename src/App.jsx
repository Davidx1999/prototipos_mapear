
import React, { useState, useEffect } from 'react';
import './App.css';

// Data
import { defaultColors, highContrastColors } from './data/constants';

// Layout
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';

// Screens
import Login from './components/screens/Login';
import Dashboard from './components/screens/Dashboard';
import Saberes from './components/screens/Saberes.jsx';
import Curriculos from './components/screens/Curriculos.jsx';
import AvaliacoesEdicao from './components/screens/AvaliacoesEdicao';
import Usuarios from './components/screens/Usuarios';
import Acompanhamento from './components/screens/Acompanhamento';
import Devolutivas from './components/screens/Devolutivas';
import RegistroPresenca from './components/screens/RegistroPresenca';
import CarregamentoProvas from './components/screens/CarregamentoProvas';
import GenericModulePage from './components/screens/GenericModulePage';
import EmptyStatePage from './components/screens/EmptyStatePage';

// UI
import Toast from './components/ui/Toast';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    this.setState({ error, errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ padding: '20px', backgroundColor: '#FEE2E2', color: '#991B1B', margin: '20px', borderRadius: '8px' }}>
          <h2>Algo deu errado na renderização desta tela.</h2>
          <details style={{ whiteSpace: 'pre-wrap', marginTop: '10px' }}>
            {this.state.error && this.state.error.toString()}
            <br />
            {this.state.errorInfo && this.state.errorInfo.componentStack}
          </details>
          <button 
            onClick={() => { this.setState({ hasError: false }); window.location.hash = '#/dashboard'; }}
            style={{ marginTop: '20px', padding: '8px 16px', backgroundColor: '#991B1B', color: 'white', borderRadius: '4px' }}
          >
            Voltar ao Dashboard
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function MapearApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeModuleName, setActiveModuleName] = useState('');

  const [activeMenu, setActiveMenu] = useState('curriculos');
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isGripOpen, setIsGripOpen] = useState(false);
  const [gripActiveTab, setGripActiveTab] = useState('curriculos');

  const [activeSaberesTab, setActiveSaberesTab] = useState(0);
  const [activeCurriculosTab, setActiveCurriculosTab] = useState(0);
  const [expandedUser, setExpandedUser] = useState(1);
  const [expandedItem, setExpandedItem] = useState(null);
  const [relationsViewMode, setRelationsViewMode] = useState('list');
  const [isGraphVisible, setIsGraphVisible] = useState(true);

  const [acompanhamentoTab, setAcompanhamentoTab] = useState(0);

  const [fontScale, setFontScale] = useState(3);
  const [isHighContrast, setIsHighContrast] = useState(false);
  const [showAlert, setShowAlert] = useState(false);

  const [favorites, setFavorites] = useState(['card-saberes', 'card-relatorios']);
  const [toast, setToast] = useState(null);

  const toggleFavorite = (cardId) => {
    setFavorites(prev => {
      if (prev.includes(cardId)) {
        return prev.filter(id => id !== cardId);
      }
      return [...prev, cardId];
    });
  };

  const colors = isHighContrast ? highContrastColors : defaultColors;

  // Carregamento de fontes (apenas uma vez)
  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      try { document.head.removeChild(link); } catch (e) { }
    };
  }, []);

  // Sincronização de Roteamento via Hash
  useEffect(() => {
    const handleHashSync = () => {
      // Se não estiver logado, limpa o hash (atendendo ao pedido de reset no refresh)
      if (!isLoggedIn) {
        if (window.location.hash && window.location.hash !== '#/') {
          window.location.hash = '#/';
        }
        setCurrentScreen('dashboard');
        return;
      }

      const hash = window.location.hash.replace('#/', '').replace('#', '');
      if (hash) {
        setCurrentScreen(hash);
      } else {
        setCurrentScreen('dashboard');
      }
    };

    window.addEventListener('hashchange', handleHashSync);
    handleHashSync(); // Sync inicial
    
    return () => window.removeEventListener('hashchange', handleHashSync);
  }, [isLoggedIn]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'user.test' && password === 'User@123') {
      setLoginError('');
      setIsLoggedIn(true);
      // Ao logar, se não houver hash, define como dashboard
      if (!window.location.hash || window.location.hash === '#') {
        window.location.hash = '#/dashboard';
      }
    } else {
      setLoginError('Usuário ou senha incorretos.');
      setToast({
        type: 'warning',
        title: 'Falha no Login',
        message: 'Usuário ou senha incorretos. Verifique seus dados e tente novamente.',
        actionLabel: 'Recuperar Senha',
        onAction: () => console.log('Recuperar senha')
      });
    }
  };

  const closeAllDropdowns = () => {
    setIsProfileOpen(false);
    setIsA11yOpen(false);
    setIsGripOpen(false);
  };

  const navigateTo = (screen, moduleName = '') => {
    setActiveModuleName(moduleName);
    setCurrentScreen(screen);
    // Atualiza a URL para refletir a página atual
    window.location.hash = `#/${screen}`;
    
    setShowAlert(false);
    setExpandedItem(null);
    closeAllDropdowns();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleExcluirItem = (cod) => {
    if (cod === 'REC') {
      setShowAlert(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const openGripDrawer = () => {
    let targetCat = gripActiveTab;
    if (currentScreen === 'saberes' || currentScreen === 'curriculos') targetCat = 'curriculos';
    else if (currentScreen === 'avaliacoes') targetCat = 'avaliacoes';
    else if (currentScreen === 'acompanhamento') targetCat = 'analise';
    else if (currentScreen === 'usuarios') targetCat = 'administracao';
    else targetCat = activeMenu;

    setGripActiveTab(targetCat);
    setIsGripOpen(!isGripOpen);
    setIsA11yOpen(false);
    setIsProfileOpen(false);
  };

  const cssVars = {
    '--primary-ultra-dark': colors.primary.ultraDark,
    '--primary-extra-dark': colors.primary.extraDark,
    '--primary-dark': colors.primary.dark,
    '--primary-base': colors.primary.base,
    '--primary-light': colors.primary.light,
    '--primary-extra-light': colors.primary.extraLight,
    '--neutral-7': colors.neutral[7],
    '--neutral-6': colors.neutral[6],
    '--neutral-5': colors.neutral[5],
    '--neutral-4': colors.neutral[4],
    '--neutral-3': colors.neutral[3],
    '--neutral-2': colors.neutral[2],
    '--neutral-1': colors.neutral[1],
    '--neutral-0': colors.neutral[0],
    '--font-scale': `${1 + (fontScale - 3) * 0.1}`
  };

  const appStyle = {
    backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[0],
    fontFamily: 'Montserrat, sans-serif',
    zoom: 1 + (fontScale - 3) * 0.1,
    ...cssVars
  };

  if (!isLoggedIn) {
    return (
      <div style={appStyle}>
        <Login
          colors={colors}
          isHighContrast={isHighContrast}
          setIsHighContrast={setIsHighContrast}
          username={username}
          setUsername={setUsername}
          password={password}
          setPassword={setPassword}
          showPassword={showPassword}
          setShowPassword={setShowPassword}
          loginError={loginError}
          handleLogin={handleLogin}
          setIsLoggedIn={setIsLoggedIn}
          setCurrentScreen={setCurrentScreen}
          isDarkMode={isDarkMode}
        />
      </div>
    );
  }

  return (
    <div className={`flex flex-col transition-all duration-500 ${isDarkMode ? 'dark-mode' : ''} ${currentScreen === 'devolutivas' ? 'h-screen overflow-hidden' : 'min-h-screen'}`} style={appStyle}>
      <Header
        colors={colors}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        currentScreen={currentScreen}
        navigateTo={navigateTo}
        isGripOpen={isGripOpen}
        setIsGripOpen={setIsGripOpen}
        gripActiveTab={gripActiveTab}
        setGripActiveTab={setGripActiveTab}
        isA11yOpen={isA11yOpen}
        setIsA11yOpen={setIsA11yOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        fontScale={fontScale}
        setFontScale={setFontScale}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        setIsLoggedIn={setIsLoggedIn}
        setUsername={setUsername}
        setPassword={setPassword}
        setSearchQuery={setSearchQuery}
        setCurrentScreen={setCurrentScreen}
        closeAllDropdowns={closeAllDropdowns}
        openGripDrawer={openGripDrawer}
      />

      <div className={`flex-1 flex flex-col transition-all duration-300 ${currentScreen === 'devolutivas' ? 'overflow-hidden' : ''}`} onClick={() => { if (isGripOpen || isA11yOpen || isProfileOpen) closeAllDropdowns(); }}>
        <ErrorBoundary>
          {currentScreen === 'dashboard' && (
          <Dashboard
            colors={colors}
            isHighContrast={isHighContrast}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            activeMenu={activeMenu}
            setActiveMenu={setActiveMenu}
            hoveredMenu={hoveredMenu}
            setHoveredMenu={setHoveredMenu}
            navigateTo={navigateTo}
            favorites={favorites}
            toggleFavorite={toggleFavorite}
            isDarkMode={isDarkMode}
          />
        )}
        {currentScreen === 'acompanhamento' && (
          <Acompanhamento
            colors={colors}
            acompanhamentoTab={acompanhamentoTab}
            setAcompanhamentoTab={setAcompanhamentoTab}
            navigateTo={navigateTo}
          />
        )}
        {currentScreen === 'devolutivas' && (
          <Devolutivas
            colors={colors}
            navigateTo={navigateTo}
            isDarkMode={isDarkMode}
          />
        )}
        {currentScreen === 'saberes' && (
          <Saberes
            colors={colors}
            activeSaberesTab={activeSaberesTab}
            setActiveSaberesTab={setActiveSaberesTab}
            relationsViewMode={relationsViewMode}
            setRelationsViewMode={setRelationsViewMode}
            isGraphVisible={isGraphVisible}
            setIsGraphVisible={setIsGraphVisible}
            expandedItem={expandedItem}
            setExpandedItem={setExpandedItem}
            showAlert={showAlert}
            setShowAlert={setShowAlert}
            handleExcluirItem={handleExcluirItem}
            navigateTo={navigateTo}
          />
        )}
        {currentScreen === 'curriculos' && (
          <Curriculos
            colors={colors}
            activeCurriculosTab={activeCurriculosTab}
            setActiveCurriculosTab={setActiveCurriculosTab}
            expandedItem={expandedItem}
            setExpandedItem={setExpandedItem}
            navigateTo={navigateTo}
          />
        )}
        {currentScreen === 'avaliacoes' && (
          <AvaliacoesEdicao
            colors={colors}
            navigateTo={navigateTo}
            isDarkMode={isDarkMode}
          />
        )}
        {currentScreen === 'usuarios' && (
          <Usuarios
            colors={colors}
            expandedUser={expandedUser}
            setExpandedUser={setExpandedUser}
            navigateTo={navigateTo}
          />
        )}
        {currentScreen === 'registro-presenca' && (
          <RegistroPresenca
            colors={colors}
            navigateTo={navigateTo}
          />
        )}
        {currentScreen === 'carregamento-provas' && (
          <CarregamentoProvas
            colors={colors}
            navigateTo={navigateTo}
          />
        )}
        {currentScreen === 'generic' && (
          <GenericModulePage
            colors={colors}
            navigateTo={navigateTo}
          />
        )}
        {(currentScreen === 'empty-state' || currentScreen === 'help') && (
          <EmptyStatePage
            colors={colors}
            navigateTo={navigateTo}
            title={activeModuleName}
          />
        )}
        </ErrorBoundary>
      </div>

      {currentScreen === 'dashboard' && (
        <Footer
          colors={colors}
          isHighContrast={isHighContrast}
          isDarkMode={isDarkMode}
        />
      )}
      {toast && (
        <div className="fixed top-6 right-6 z-[9999] w-full max-w-[400px]">
          <Toast 
            {...toast} 
            colors={colors} 
            onClose={() => setToast(null)} 
          />
        </div>
      )}
    </div>
  );
}
