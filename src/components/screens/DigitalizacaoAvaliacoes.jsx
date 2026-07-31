import React, { useState, useEffect, useRef, useCallback } from 'react';
import { ArrowLeft, X } from 'lucide-react';
import Button from '../ui/Button';

// Sub-components
import StepEscolas from './digitalizacaoAvaliacoes/StepEscolas';
import StepAvaliacoes from './digitalizacaoAvaliacoes/StepAvaliacoes';
import StepTestes from './digitalizacaoAvaliacoes/StepTestes';
import StepTurmas from './digitalizacaoAvaliacoes/StepTurmas';
import StepEstudantes from './digitalizacaoAvaliacoes/StepEstudantes';
import StepScanner from './digitalizacaoAvaliacoes/StepScanner';
import DesktopDashboard from './digitalizacaoAvaliacoes/DesktopDashboard';
import DigitalizacaoModals from './digitalizacaoAvaliacoes/DigitalizacaoModals';

export default function DigitalizacaoAvaliacoes({ colors, navigateTo, setIsGlobalHeaderHidden }) {
  // Theme Colors fallback
  const themeColors = colors || {
    primary: {
      ultraDark: '#002244',
      extraDark: '#003A79',
      dark: '#006199',
      base: '#008BC9',
      light: '#E6F6FC',
      extraLight: '#B3E6F5'
    },
    neutral: {
      0: '#ffffff',
      1: '#f8fafc',
      2: '#f1f5f9',
      3: '#e2e8f0',
      4: '#94a3b8',
      5: '#64748b',
      6: '#334155',
      7: '#0f172a'
    }
  };

  // State Machine Steps for Mobile: 'escolas' | 'avaliacoes' | 'testes' | 'turmas' | 'estudantes' | 'scanner'
  const [step, setStep] = useState('escolas');

  // Selections state
  const [selectedSchool, setSelectedSchool] = useState('EEM Liceu do Conjunto Ceará');
  const [selectedEvaluation, setSelectedEvaluation] = useState('Brasil em Foco: Cultura, Sociedade, Ciência e Cotidiano');
  const [selectedTest, setSelectedTest] = useState('Cultura, Linguagem e Cotidiano Brasileiro');
  const [selectedClass, setSelectedClass] = useState('3º Ano EM, Turma C');

  // Search queries
  const [schoolSearch, setSchoolSearch] = useState('');
  const [evaluationSearch, setEvaluationSearch] = useState('');
  const [testSearch, setTestSearch] = useState('');
  const [classSearch, setClassSearch] = useState('');
  const [studentSearch, setStudentSearch] = useState('');

  // Toggle filter for pending students only
  const [onlyPendingFilter, setOnlyPendingFilter] = useState(false);

  // Inline Info Callout Banners visibility state
  const [showInfoBannerAvaliacoes, setShowInfoBannerAvaliacoes] = useState(true);
  const [showInfoBannerTestes, setShowInfoBannerTestes] = useState(true);

  // Responsive mode flags
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isSimulatedMobile, setIsSimulatedMobile] = useState(true);

  // Profile Drawer Modal state
  const [isProfileDrawerOpen, setIsProfileDrawerOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hideTutorial, setHideTutorial] = useState(false);

  // Active student for modals and scanner
  const [activeStudent, setActiveStudent] = useState(null);

  // Modal visibility states
  const [showUploadOptionsModal, setShowUploadOptionsModal] = useState(false);
  const [showConcluidoHelpModal, setShowConcluidoHelpModal] = useState(false);
  const [showErroHelpModal, setShowErroHelpModal] = useState(false);
  const [showPdfViewerModal, setShowPdfViewerModal] = useState(false);
  const [showScannerTutorialModal, setShowScannerTutorialModal] = useState(false);
  const [showDeletePageModal, setShowDeletePageModal] = useState(false);
  const [showAddPageModal, setShowAddPageModal] = useState(false);
  const [showMissingPagesModal, setShowMissingPagesModal] = useState(false);

  // Scanner state
  const [scannerPages, setScannerPages] = useState([
    { id: 1, isIllegible: false },
    { id: 2, isIllegible: true }
  ]);
  const [activePageIndex, setActivePageIndex] = useState(0);
  const [hasConfirmedMissingPages, setHasConfirmedMissingPages] = useState(false);

  // Toast notification
  const [toast, setToast] = useState(null);

  // Desktop uploads list & uploading simulator state
  const [desktopUploads, setDesktopUploads] = useState([
    { id: 101, name: 'lote_final_matematica_9A.pdf', size: '14.2 MB', date: 'Hoje, 10:24', totalSheets: 25, successSheets: 25, status: 'Concluído' },
    { id: 102, name: 'lote_redacao_1EM_A.pdf', size: '28.1 MB', date: 'Ontem, 16:45', totalSheets: 32, successSheets: 30, status: 'Erro', errorDetails: '2 páginas ilegíveis (Carlos Eduardo Ferreira, Larissa Beatriz Lima).' },
    { id: 103, name: 'lote_ciencias_9B_recuperacao.pdf', size: '8.4 MB', date: '18 Dez, 2025', totalSheets: 10, successSheets: 10, status: 'Concluído' }
  ]);
  const [isDesktopUploading, setIsDesktopUploading] = useState(false);
  const [activeErrorBatch, setActiveErrorBatch] = useState(null);

  // Class Selection Selections for Desktop Cascade
  const [classSelections, setClassSelections] = useState([
    "SEFOR 1 - Fortaleza",
    "Fortaleza",
    "EEM Liceu do Conjunto Ceará",
    ["3º Ano EM, Turma C"]
  ]);

  // Hook for window resize to detect true mobile
  useEffect(() => {
    const checkMobile = () => setIsMobileDevice(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Auto-dismiss Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Mock Database of Students with 4 Statuses
  const [students, setStudents] = useState([
    { id: 1, username: 'ana.beatriz67', name: 'Ana Beatriz Silva Almeida Rocha', status: 'sem anexo', file: null, errorDetails: null },
    { id: 2, username: 'lopes.bibi', name: 'Bianca Lopes Martins Almeida Freitas', status: 'enviado', file: 'avaliacao_bianca_lopes.pdf', errorDetails: null },
    { id: 3, username: 'enzovirguline', name: 'Enzo Henrique Pereira da Silva Rocha', status: 'sem anexo', file: null, errorDetails: null },
    { id: 4, username: 'carlos.eduardo', name: 'Carlos Eduardo Ferreira da Silva', status: 'concluído', file: 'avaliacao_carlos_eduardo.pdf', errorDetails: null },
    { id: 5, username: 'larissa.lima', name: 'Larissa Beatriz Lima', status: 'erro', file: null, errorDetails: 'Página 1 com sombra sobre o cabeçalho e folha cortada na margem inferior. Recomendamos refazer a captura.' },
    { id: 6, username: 'lucas.rodrigues', name: 'Lucas Gabriel Rodrigues', status: 'sem anexo', file: null, errorDetails: null },
    { id: 7, username: 'maria.vitoria', name: 'Maria Vitória de Sousa Mendes', status: 'enviado', file: 'avaliacao_maria_vitoria.pdf', errorDetails: null },
    { id: 8, username: 'pedro.almeida', name: 'Pedro Henrique Almeida', status: 'concluído', file: 'avaliacao_pedro_henrique.pdf', errorDetails: null }
  ]);

  // Mock lists
  const schoolsList = [
    'EMF Professor José Militão de Albuquerque',
    'EEFM José de Alencar',
    'EEM Liceu do Conjunto Ceará',
    'EEFM Presidente Humberto Castelo Branco',
    'EEMTI Maria Dolores Petrolini',
    'EEFM Estado do Maranhão',
    'EEMTI Governador Adauto Bezerra',
    'EEFM Parque Presidente Vargas'
  ];

  const evaluationsList = [
    'Avaliação formativa - Ensino Médio - Piauí',
    'Avaliação formativa 2026.1 - Mato Grosso - Oitavo ano',
    'Avaliação formativa 2026.1 - Mato Grosso do Sul - Sétimo ano',
    'Brasil em Foco: Cultura, Sociedade, Ciência e Cotidiano',
    'Avaliação formativa 2 - Mato Grosso do Sul - quarto e quinto anos'
  ];

  const testsList = [
    'Avaliação Diagnóstica de Língua Portuguesa e Leitura Crítica para o Ensino Fundamental',
    'Matemática Aplicada: Resolução de Problemas Complexos e Raciocínio Lógico Quantitativo',
    'Ciências da Natureza e Suas Tecnologias: Física, Química e Biologia no Cotidiano Social',
    'História e Geografia do Brasil: Construção da Identidade, Sociedade, Espaço e Cidadania',
    'Cultura, Língua Portuguesa, Literatura Contemporânea e Produção Textual Avançada',
    'Educação Financeira, Estatística Básica, Análise de Dados e Interpretação de Gráficos',
    'Avaliação de Habilidades Socioemocionais, Pensamento Crítico e Competências Cidadãs',
    'Língua Estrangeira Moderna (Inglês): Compreensão Leitora, Vocabulário e Gramática Aplicada',
    'Tecnologia, Inovação Digital, Mídias de Comunicação e Cultura Redes na Sociedade Atual',
    'Estudos de Meio Ambiente, Sustentabilidade Ecológica, Biodiversidade e Cidadania Global'
  ];

  const classesList = [
    '2º Ano EM, Turma A',
    '2º Ano EM, Turma C',
    '3º Ano EM, Turma B',
    '3º Ano EM, Turma C',
    '3º Ano EM, Turma D'
  ];

  // Status Action Handlers
  const handleOpenUploadOptions = (student) => {
    setActiveStudent(student);
    setShowUploadOptionsModal(true);
  };

  const handleOpenConcluidoHelp = (student) => {
    setActiveStudent(student);
    setShowConcluidoHelpModal(true);
  };

  const handleOpenErroHelp = (student) => {
    setActiveStudent(student);
    setShowErroHelpModal(true);
  };

  const handleOpenPdfViewer = (student) => {
    setActiveStudent(student);
    setShowPdfViewerModal(true);
  };

  const handleChooseScannerEditor = () => {
    setShowUploadOptionsModal(false);
    if (!hideTutorial) {
      setShowScannerTutorialModal(true);
    } else {
      setStep('scanner');
    }
  };

  const handleDirectPdfUpload = () => {
    setShowUploadOptionsModal(false);
    if (!activeStudent) return;

    setToast(`Enviando PDF de ${activeStudent.name.split(' ')[0]}...`);
    setTimeout(() => {
      setStudents(prev => prev.map(s =>
        s.id === activeStudent.id
          ? { ...s, status: 'enviado', file: `avaliacao_${s.username}.pdf`, errorDetails: null }
          : s
      ));
      setToast(`PDF de ${activeStudent.name.split(' ')[0]} enviado com sucesso!`);
    }, 1200);
  };

  const handleFinishScannerUpload = () => {
    if (scannerPages.length < 2 && !hasConfirmedMissingPages) {
      setShowMissingPagesModal(true);
      return;
    }

    if (activeStudent) {
      setStudents(prev => prev.map(s =>
        s.id === activeStudent.id
          ? { ...s, status: 'enviado', file: `avaliacao_${s.username}.pdf`, errorDetails: null }
          : s
      ));
      setToast(`Avaliação de ${activeStudent.name.split(' ')[0]} enviada!`);
    }
    setStep('estudantes');
  };

  // Cascade selector database
  const cascadeDb = (levelIndex, currentSelections) => {
    switch (levelIndex) {
      case 0:
        return [
          "SEFOR 1 - Fortaleza",
          "CREDE 01 - Maracanaú",
          "CREDE 02 - Itapipoca",
          "CREDE 03 - Acaraú"
        ];
      case 1:
        const reg = currentSelections[0];
        if (!reg) return [];
        if (reg.includes("Fortaleza")) return ["Fortaleza"];
        if (reg.includes("Maracanaú")) return ["Maracanaú", "Maranguape"];
        return ["Município A", "Município B"];
      case 2:
        const mun = currentSelections[1];
        if (!mun) return [];
        if (mun === "Fortaleza") {
          return [
            "EEM Liceu do Conjunto Ceará",
            "EEFM Adauto Bezerra",
            "EEM Justiniano de Serpa"
          ];
        }
        return [`Escola Estadual de ${mun}`, `Colégio Municipal de ${mun}`];
      case 3:
        return [
          "Turma 9º Ano A",
          "Turma 9º Ano B",
          "3º Ano EM, Turma C",
          "Turma 2º Ano EM B"
        ];
      default:
        return [];
    }
  };

  const handleSimulateDesktopUpload = () => {
    if (isDesktopUploading) return;
    setIsDesktopUploading(true);

    const newId = Date.now();
    const newFile = {
      id: newId,
      name: 'lote_diagnostico_portugues_9A.pdf',
      size: '18.7 MB',
      date: 'Hoje, agora',
      totalSheets: 20,
      successSheets: 0,
      status: 'Processando'
    };

    setDesktopUploads(prev => [newFile, ...prev]);
    setToast(`Enviando lote de português...`);

    setTimeout(() => {
      setDesktopUploads(prev => prev.map(f =>
        f.id === newId
          ? { ...f, status: 'Concluído', successSheets: 20 }
          : f
      ));
      setIsDesktopUploading(false);
      setToast(`Processamento concluído: 20 provas importadas!`);
    }, 2500);
  };

  // Mobile Header Autohide on Scroll
  const [isHeaderHidden, setIsHeaderHidden] = useState(false);
  const lastScrollTopRef = useRef(0);
  const isHeaderHiddenRef = useRef(false);

  const handleMobileScroll = useCallback((e) => {
    // If e.target is window/document, use window.scrollY, else use e.target.scrollTop
    const currentScrollTop = e && e.target && e.target.scrollTop !== undefined 
      ? e.target.scrollTop 
      : window.scrollY;
    
    const lastScroll = lastScrollTopRef.current;

    if (currentScrollTop > 30 && currentScrollTop > lastScroll + 5) {
      if (!isHeaderHiddenRef.current) {
        isHeaderHiddenRef.current = true;
        setIsHeaderHidden(true);
        if (setIsGlobalHeaderHidden) setIsGlobalHeaderHidden(true);
      }
    } else if (currentScrollTop < lastScroll - 5 || currentScrollTop <= 10) {
      if (isHeaderHiddenRef.current) {
        isHeaderHiddenRef.current = false;
        setIsHeaderHidden(false);
        if (setIsGlobalHeaderHidden) setIsGlobalHeaderHidden(false);
      }
    }
    lastScrollTopRef.current = currentScrollTop;
  }, [setIsGlobalHeaderHidden]);

  // Listen to window scroll for real mobile devices
  useEffect(() => {
    if (!isMobileDevice) return;
    
    const handleWindowScroll = () => {
      handleMobileScroll({ target: null }); 
    };

    window.addEventListener('scroll', handleWindowScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleWindowScroll);
  }, [isMobileDevice, handleMobileScroll]);

  // Reset header state when step changes
  useEffect(() => {
    isHeaderHiddenRef.current = false;
    setIsHeaderHidden(false);
    if (setIsGlobalHeaderHidden) setIsGlobalHeaderHidden(false);
    lastScrollTopRef.current = 0;
  }, [step, setIsGlobalHeaderHidden]);

  // Render Mobile Steps Router
  const renderActiveStep = () => {
    switch (step) {
      case 'escolas':
        return (
          <StepEscolas
            themeColors={themeColors}
            schoolSearch={schoolSearch}
            setSchoolSearch={setSchoolSearch}
            schoolsList={schoolsList}
            setSelectedSchool={setSelectedSchool}
            setStep={setStep}
            handleMobileScroll={handleMobileScroll}
            isHeaderHidden={isHeaderHidden}
          />
        );
      case 'avaliacoes':
        return (
          <StepAvaliacoes
            themeColors={themeColors}
            selectedSchool={selectedSchool}
            evaluationSearch={evaluationSearch}
            setEvaluationSearch={setEvaluationSearch}
            evaluationsList={evaluationsList}
            setSelectedEvaluation={setSelectedEvaluation}
            setStep={setStep}
            showInfoBannerAvaliacoes={showInfoBannerAvaliacoes}
            setShowInfoBannerAvaliacoes={setShowInfoBannerAvaliacoes}
            handleMobileScroll={handleMobileScroll}
            isHeaderHidden={isHeaderHidden}
          />
        );
      case 'testes':
        return (
          <StepTestes
            themeColors={themeColors}
            selectedEvaluation={selectedEvaluation}
            testSearch={testSearch}
            setTestSearch={setTestSearch}
            testsList={testsList}
            setSelectedTest={setSelectedTest}
            setStep={setStep}
            showInfoBannerTestes={showInfoBannerTestes}
            setShowInfoBannerTestes={setShowInfoBannerTestes}
            handleMobileScroll={handleMobileScroll}
            isHeaderHidden={isHeaderHidden}
          />
        );
      case 'turmas':
        return (
          <StepTurmas
            themeColors={themeColors}
            selectedTest={selectedTest}
            classSearch={classSearch}
            setClassSearch={setClassSearch}
            classesList={classesList}
            setSelectedClass={setSelectedClass}
            setStep={setStep}
            handleMobileScroll={handleMobileScroll}
            isHeaderHidden={isHeaderHidden}
          />
        );
      case 'estudantes':
        return (
          <StepEstudantes
            themeColors={themeColors}
            selectedTest={selectedTest}
            selectedClass={selectedClass}
            studentSearch={studentSearch}
            setStudentSearch={setStudentSearch}
            onlyPendingFilter={onlyPendingFilter}
            setOnlyPendingFilter={setOnlyPendingFilter}
            students={students}
            setStep={setStep}
            handleOpenUploadOptions={handleOpenUploadOptions}
            handleOpenConcluidoHelp={handleOpenConcluidoHelp}
            handleOpenErroHelp={handleOpenErroHelp}
            handleOpenPdfViewer={handleOpenPdfViewer}
            handleMobileScroll={handleMobileScroll}
            isHeaderHidden={isHeaderHidden}
          />
        );
      case 'scanner':
        return (
          <StepScanner
            themeColors={themeColors}
            activeStudent={activeStudent}
            scannerPages={scannerPages}
            setScannerPages={setScannerPages}
            activePageIndex={activePageIndex}
            setActivePageIndex={setActivePageIndex}
            setShowAddPageModal={setShowAddPageModal}
            setShowDeletePageModal={setShowDeletePageModal}
            handleFinishScannerUpload={handleFinishScannerUpload}
            setStep={setStep}
            setToast={setToast}
          />
        );
      default:
        return null;
    }
  };

  const isMobileView = isMobileDevice || isSimulatedMobile;

  return (
    <div className="flex-1 w-full bg-white flex flex-col justify-start items-center py-0 md:py-[24px] px-0 md:px-[16px] min-h-screen font-['Montserrat',sans-serif]">
      {/* Top Navigation Bar on Desktop Mode Simulator */}
      {isSimulatedMobile && !isMobileDevice && (
        <div className="w-full max-w-[420px] mb-3 flex justify-between items-center px-4 shrink-0">
          <Button
            variant="tertiary"
            appearance="ghost"
            size="sm"
            onClick={() => setIsSimulatedMobile(false)}
            iconLeft={<ArrowLeft size={16} />}
          >
            Voltar ao Dashboard
          </Button>
          <span className="text-[12px] font-bold text-neutral-5 font-mono">Modo Mobile Simulado</span>
        </div>
      )}

      {/* RENDER DESKTOP DASHBOARD OR MOBILE CONTAINER */}
      {!isMobileView ? (
        <DesktopDashboard
          themeColors={themeColors}
          setIsSimulatedMobile={setIsSimulatedMobile}
          setStep={setStep}
          desktopUploads={desktopUploads}
          isDesktopUploading={isDesktopUploading}
          setActiveErrorBatch={setActiveErrorBatch}
          classSelections={classSelections}
          setClassSelections={setClassSelections}
          cascadeDb={cascadeDb}
          handleSimulateDesktopUpload={handleSimulateDesktopUpload}
        />
      ) : (
        <div className={`w-full ${isMobileDevice ? '' : 'h-[780px] max-w-[412px] rounded-[38px] border-[8px] border-neutral-800 shadow-2xl overflow-hidden'} bg-white flex flex-col relative`}>
          {/* Simulated Mobile Notch / Status Bar */}
          {!isMobileDevice && (
            <div className="h-[28px] bg-neutral-900 text-white text-[11px] px-[20px] flex justify-between items-center shrink-0 select-none z-50">
              <span className="font-bold">09:41</span>
              <div className="w-[80px] h-[14px] bg-neutral-800 rounded-b-md mx-auto"></div>
              <div className="flex items-center gap-[4px]">
                <span className="text-[10px]">5G</span>
                <div className="w-[16px] h-[9px] border border-white rounded-[2px] p-[1px] flex items-center">
                  <div className="w-full h-full bg-white rounded-[1px]"></div>
                </div>
              </div>
            </div>
          )}

          {/* Mobile Screen Area */}
          <div 
            className={`flex-1 flex flex-col relative bg-white ${!isMobileDevice ? 'overflow-y-auto overflow-x-hidden' : ''}`}
            onScroll={!isMobileDevice ? handleMobileScroll : undefined}
          >
            {renderActiveStep()}

            {/* Toast overlay */}
            {toast && (
              <div className="absolute top-[68px] left-[16px] right-[16px] z-[90] animate-fade-slide">
                <div className="bg-neutral-800 text-white rounded-xl p-3 shadow-xl flex items-center justify-between border border-neutral-700">
                  <span className="text-[12px] font-bold">{toast}</span>
                  <button onClick={() => setToast(null)} className="text-white/60 hover:text-white"><X size={14} /></button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Interactive Modals and Portals */}
      <DigitalizacaoModals
        showUploadOptionsModal={showUploadOptionsModal}
        setShowUploadOptionsModal={setShowUploadOptionsModal}
        activeStudent={activeStudent}
        handleChooseScannerEditor={handleChooseScannerEditor}
        handleDirectPdfUpload={handleDirectPdfUpload}
        
        showConcluidoHelpModal={showConcluidoHelpModal}
        setShowConcluidoHelpModal={setShowConcluidoHelpModal}
        
        showErroHelpModal={showErroHelpModal}
        setShowErroHelpModal={setShowErroHelpModal}
        handleOpenUploadOptions={handleOpenUploadOptions}
        
        showPdfViewerModal={showPdfViewerModal}
        setShowPdfViewerModal={setShowPdfViewerModal}
        
        showScannerTutorialModal={showScannerTutorialModal}
        setShowScannerTutorialModal={setShowScannerTutorialModal}
        hideTutorial={hideTutorial}
        setHideTutorial={setHideTutorial}
        setStep={setStep}
        
        showDeletePageModal={showDeletePageModal}
        setShowDeletePageModal={setShowDeletePageModal}
        scannerPages={scannerPages}
        setScannerPages={setScannerPages}
        activePageIndex={activePageIndex}
        setActivePageIndex={setActivePageIndex}
        setToast={setToast}
        
        showMissingPagesModal={showMissingPagesModal}
        setShowMissingPagesModal={setShowMissingPagesModal}
        hasConfirmedMissingPages={hasConfirmedMissingPages}
        setHasConfirmedMissingPages={setHasConfirmedMissingPages}
        handleFinishScannerUpload={handleFinishScannerUpload}
        
        showAddPageModal={showAddPageModal}
        setShowAddPageModal={setShowAddPageModal}
        
        isProfileDrawerOpen={isProfileDrawerOpen}
        setIsProfileDrawerOpen={setIsProfileDrawerOpen}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        selectedSchool={selectedSchool}
        selectedClass={selectedClass}
      />
    </div>
  );
}
