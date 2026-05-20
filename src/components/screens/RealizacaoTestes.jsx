import React, { useState, useEffect } from 'react';
import { mockAssessments, generateMockTest, mockTest } from './RealizacaoTestes/mockData';
import Dashboard from './RealizacaoTestes/Dashboard';
import PreTest from './RealizacaoTestes/PreTest';
import TestPlayer from './RealizacaoTestes/TestPlayer';
import Finished from './RealizacaoTestes/Finished';
export default function RealizacaoTestes({ colors, isDarkMode, navigateTo }) {
  // --- ESTADOS GERAIS (FLUXO DE TELAS) ---
  const [currentScreen, setCurrentScreen] = useState('dashboard');

  // Dashboard states
  const [dashboardTab, setDashboardTab] = useState('Ativas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

  const [activeTest, setActiveTest] = useState(mockTest);

  // Test states
  const [theme, setTheme] = useState(isDarkMode ? 'dark' : 'light');
  const [fontSize, setFontSize] = useState(16);
  const [timeRemaining, setTimeRemaining] = useState(mockTest.timeLimitSeconds);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});

  // UI Options
  const [collapseTasks, setCollapseTasks] = useState(true); // Opcional: Modo Foco (Colapsa Tarefas Inativas)
  const [activeItemId, setActiveItemId] = useState(`question-${mockTest.tasks[0].elements[0].data?.id || mockTest.tasks[0].elements[0].items[0]?.id}`);

  // Modais
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showMapModal, setShowMapModal] = useState(false);
  const [showTaskSuccessModal, setShowTaskSuccessModal] = useState(false);
  const [showIncompleteWarning, setShowIncompleteWarning] = useState(false);

  // Sincroniza tema inicial
  useEffect(() => {
    setTheme(isDarkMode ? 'dark' : 'light');
  }, [isDarkMode]);

  // --- EFEITOS (Timer) ---
  useEffect(() => {
    let interval;
    if (currentScreen === 'test' && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
        setTimeSpent(prev => prev + 1);
      }, 1000);
    } else if (currentScreen === 'test' && timeRemaining === 0) {
      handleFinishTest();
    }
    return () => clearInterval(interval);
  }, [currentScreen, timeRemaining]);

  // --- OBSERVER PARA SINCRONIZAÇÃO DE SCROLL (Detecta o item em foco) ---
  useEffect(() => {
    if (currentScreen !== 'test') return;

    // Observer para verificar que item está no campo de visão (Tela Principal)
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const currentId = entry.target.id;
          setActiveItemId(currentId);

          // Auto-scroll da barra inferior (footer) para manter o item centrado
          const activeDash = document.getElementById(`dash-${currentId}`);
          if (activeDash) {
            activeDash.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
          }
        }
      });
    }, { root: null, rootMargin: '-30% 0px -50% 0px', threshold: 0 });

    setTimeout(() => {
      const items = document.querySelectorAll('.question-item');
      items.forEach(item => observer.observe(item));
    }, 100);

    return () => observer.disconnect();
  }, [currentTaskIndex, currentScreen, collapseTasks]);

  // --- FUNÇÕES UTILITÁRIAS ---
  const formatTime = (totalSeconds) => {
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;
    return `${h > 0 ? h.toString().padStart(2, '0') + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const getTaskItems = (task) => {
    let items = [];
    task.elements.forEach(el => {
      if (el.type === 'item') items.push(el.data);
      else if (el.type === 'block') items.push(...el.items);
    });
    return items;
  };

  const isItemComplete = (item) => {
    if (item.type === 'single_choice') return !!answers[`${item.id}_choice`];
    if (item.type === 'subjective') return !!answers[`${item.id}_text`] && answers[`${item.id}_text`].trim() !== '';
    if (item.type === 'hybrid') return !!answers[`${item.id}_choice`] && !!answers[`${item.id}_text`] && answers[`${item.id}_text`].trim() !== '';
    return !!answers[item.id] && answers[item.id].toString().trim() !== '';
  };

  const isTaskComplete = (taskIndex) => {
    const items = getTaskItems(activeTest.tasks[taskIndex]);
    return items.every(item => isItemComplete(item));
  };

  const getTotalItems = () => activeTest.tasks.reduce((acc, t) => acc + getTaskItems(t).length, 0);
  const getTotalAnswered = () => activeTest.tasks.reduce((acc, t) => acc + getTaskItems(t).filter(i => isItemComplete(i)).length, 0);

  // --- HANDLERS ---
  const handleAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }));

  const handleToggleFlag = () => {
    const currentId = activeItemId.replace('question-', '');
    setFlags(prev => ({ ...prev, [currentId]: !prev[currentId] }));
  };

  const handleStartTest = () => {
    const av = mockAssessments.find(a => a.id === selectedAssessmentId) || mockAssessments[0];
    const generated = {
      ...generateMockTest(av.totalItems, av.id),
      id: av.id,
      title: av.title
    };
    setActiveTest(generated);
    setTimeRemaining(generated.timeLimitSeconds);
    setTimeSpent(0);
    setCurrentTaskIndex(0);
    setAnswers({});
    setFlags({});
    setActiveItemId(`question-${generated.tasks[0].elements[0].data?.id || generated.tasks[0].elements[0].items[0]?.id}`);
    setCurrentScreen('test');
    window.scrollTo(0, 0);
  };

  const handleAttemptFinish = () => {
    if (getTotalAnswered() < getTotalItems()) {
      setShowIncompleteWarning(true);
    } else {
      handleFinishTest();
    }
  };

  const handleFinishTest = () => {
    setShowIncompleteWarning(false);
    setCurrentScreen('finished');
  };

  // Navegação Focada na Questão (Prev/Next Item)
  const goPrevItem = () => {
    const flatItems = getTaskItems(activeTest.tasks[currentTaskIndex]);
    const currentIdClean = activeItemId.replace('question-', '');
    let idx = flatItems.findIndex(i => i.id === currentIdClean);
    if (idx === -1) idx = 0;

    if (idx > 0) {
      const prevId = flatItems[idx - 1].id;
      document.getElementById(`question-${prevId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
      setTimeout(() => {
        const prevTaskItems = getTaskItems(activeTest.tasks[currentTaskIndex - 1]);
        const lastId = prevTaskItems[prevTaskItems.length - 1].id;
        document.getElementById(`question-${lastId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }, 100);
    }
  };

  const goNextItem = () => {
    const flatItems = getTaskItems(activeTest.tasks[currentTaskIndex]);
    const currentIdClean = activeItemId.replace('question-', '');
    let idx = flatItems.findIndex(i => i.id === currentIdClean);
    if (idx === -1) idx = 0;

    if (idx < flatItems.length - 1) {
      const nextId = flatItems[idx + 1].id;
      document.getElementById(`question-${nextId}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else if (currentTaskIndex < activeTest.tasks.length - 1) {
      if (isTaskComplete(currentTaskIndex)) {
        setShowTaskSuccessModal(true);
      } else {
        setCurrentTaskIndex(prev => prev + 1);
        setTimeout(() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }, 100);
      }
    }
  };

  const confirmNextTask = () => {
    setShowTaskSuccessModal(false);
    setCurrentTaskIndex(prev => prev + 1);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  const jumpToTask = (taskIndex) => {
    setCurrentTaskIndex(taskIndex);
    setShowMapModal(false);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }, 100);
  };

  // ==========================================================================
  if (currentScreen === 'dashboard') { return <Dashboard colors={colors} mockAssessments={mockAssessments} dashboardTab={dashboardTab} setDashboardTab={setDashboardTab} setSelectedAssessmentId={setSelectedAssessmentId} setCurrentScreen={setCurrentScreen} />; }
  if (currentScreen === 'pre_test') { const assessment = mockAssessments.find(a => a.id === selectedAssessmentId); return <PreTest colors={colors} assessment={assessment} handleStartTest={handleStartTest} setCurrentScreen={setCurrentScreen} />; }
  if (currentScreen === 'test') { return <TestPlayer theme={theme} setTheme={setTheme} activeTest={activeTest} currentTaskIndex={currentTaskIndex} setCurrentTaskIndex={setCurrentTaskIndex} activeItemId={activeItemId} setActiveItemId={setActiveItemId} answers={answers} flags={flags} timeRemaining={timeRemaining} fontSize={fontSize} setFontSize={setFontSize} showMapModal={showMapModal} setShowMapModal={setShowMapModal} showTaskSuccessModal={showTaskSuccessModal} setShowTaskSuccessModal={setShowTaskSuccessModal} showIncompleteWarning={showIncompleteWarning} setShowIncompleteWarning={setShowIncompleteWarning} collapseTasks={collapseTasks} setCollapseTasks={setCollapseTasks} formatTime={formatTime} getTaskItems={getTaskItems} isItemComplete={isItemComplete} isTaskComplete={isTaskComplete} getTotalItems={getTotalItems} getTotalAnswered={getTotalAnswered} handleAnswer={handleAnswer} handleToggleFlag={handleToggleFlag} handleAttemptFinish={handleAttemptFinish} handleFinishTest={handleFinishTest} goPrevItem={goPrevItem} goNextItem={goNextItem} confirmNextTask={confirmNextTask} jumpToTask={jumpToTask} setCurrentScreen={setCurrentScreen} />; }
  if (currentScreen === 'finished') { return <Finished formatTime={formatTime} timeSpent={timeSpent} totalAnswered={getTotalAnswered()} totalItems={getTotalItems()} setCurrentScreen={setCurrentScreen} />; }
  return null;
}