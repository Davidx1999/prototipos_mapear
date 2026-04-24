
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
import Saberes from './components/screens/Saberes';
import Curriculos from './components/screens/Curriculos';
import AvaliacoesLista from './components/screens/AvaliacoesLista';
import Usuarios from './components/screens/Usuarios';
import Acompanhamento from './components/screens/Acompanhamento';

export default function MapearApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  
  const [activeMenu, setActiveMenu] = useState('curriculos'); 
  const [hoveredMenu, setHoveredMenu] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isA11yOpen, setIsA11yOpen] = useState(false);
  const [isAppDrawerOpen, setIsAppDrawerOpen] = useState(false);
  const [drawerActiveCat, setDrawerActiveCat] = useState('curriculos');

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

  const colors = isHighContrast ? highContrastColors : defaultColors;

  useEffect(() => {
    const link = document.createElement('link');
    link.href = 'https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap';
    link.rel = 'stylesheet';
    document.head.appendChild(link);
    return () => {
      try {
        document.head.removeChild(link);
      } catch (e) {}
    };
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    if (username === 'david.salviano' && password === 'David@123.') {
      setLoginError('');
      setIsLoggedIn(true);
    } else {
      setLoginError('Usuário ou senha incorretos.');
    }
  };

  const closeAllDropdowns = () => {
    setIsProfileOpen(false);
    setIsA11yOpen(false);
    setIsAppDrawerOpen(false);
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
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
    let targetCat = drawerActiveCat;
    if (currentScreen === 'saberes' || currentScreen === 'curriculos') targetCat = 'curriculos';
    else if (currentScreen === 'avaliacoes') targetCat = 'avaliacoes';
    else if (currentScreen === 'acompanhamento') targetCat = 'analise';
    else if (currentScreen === 'usuarios') targetCat = 'administracao';
    else targetCat = activeMenu;

    setDrawerActiveCat(targetCat);
    setIsAppDrawerOpen(!isAppDrawerOpen);
    setIsA11yOpen(false);
    setIsProfileOpen(false);
  };

  if (!isLoggedIn) {
    return (
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
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col transition-colors duration-500" style={{ backgroundColor: colors.neutral[0], fontFamily: 'Montserrat, sans-serif' }}>
      <Header 
        colors={colors}
        isHighContrast={isHighContrast}
        setIsHighContrast={setIsHighContrast}
        currentScreen={currentScreen}
        navigateTo={navigateTo}
        isAppDrawerOpen={isAppDrawerOpen}
        setIsAppDrawerOpen={setIsAppDrawerOpen}
        drawerActiveCat={drawerActiveCat}
        setDrawerActiveCat={setDrawerActiveCat}
        isA11yOpen={isA11yOpen}
        setIsA11yOpen={setIsA11yOpen}
        isProfileOpen={isProfileOpen}
        setIsProfileOpen={setIsProfileOpen}
        fontScale={fontScale}
        setFontScale={setFontScale}
        setIsLoggedIn={setIsLoggedIn}
        setUsername={setUsername}
        setPassword={setPassword}
        setSearchQuery={setSearchQuery}
        setCurrentScreen={setCurrentScreen}
        closeAllDropdowns={closeAllDropdowns}
        openGripDrawer={openGripDrawer}
      />

      <div className="flex-1 flex flex-col transition-all duration-300" style={{ zoom: 1 + (fontScale - 3) * 0.06 }} onClick={() => { if(isAppDrawerOpen || isA11yOpen || isProfileOpen) closeAllDropdowns(); }}>
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
          <AvaliacoesLista 
            colors={colors}
            navigateTo={navigateTo}
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
      </div>

      {currentScreen === 'dashboard' && (
        <Footer 
          colors={colors}
          isHighContrast={isHighContrast}
        />
      )}
    </div>
  );
}
