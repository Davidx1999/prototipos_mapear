import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  HelpCircle, Sun, Moon, LayoutGrid, Clock, Flag, 
  ChevronLeft, ChevronRight, ChevronDown, CheckCircle2, X, Send,
  BookOpen, Edit2, Info, Search, Calendar, ListTodo, AlertTriangle, ArrowLeft
} from 'lucide-react';

// ============================================================================
// DADOS SIMULADOS (MOCK) - DASHBOARD DE AVALIAÇÕES E TESTE ATIVO
// ============================================================================
const mockAssessments = [
  {
    id: 'MS25245',
    title: 'Cultura, Linguagem e Cotidiano Brasileiro',
    subtitle: 'Brasil em Foco: Cultura, Sociedade, Ciência e Cotidiano',
    status: 'active', 
    startDate: '09 Dez, 25 - 16h',
    endDate: '11 Dez, 25 - 12h',
    totalItems: 12,
    avgTime: '1 Hora(s)',
    progress: 0,
    message: 'Você pode iniciar esta avaliação!'
  },
  {
    id: 'MS25246',
    title: 'Avaliação Formativa 2 - Matemática',
    subtitle: 'Anos Iniciais do Ensino Fundamental',
    status: 'active',
    startDate: '09 Dez, 25 - 16h',
    endDate: '11 Dez, 25 - 12h',
    totalItems: 10,
    avgTime: '3 Hora(s)',
    progress: 34,
    message: 'Você pode continuar esta avaliação!'
  }
];

const mockTest = {
  id: 'AV01',
  title: 'Avaliação Diagnóstica do Mapear - 2026',
  timeLimitSeconds: 5400, 
  tasks: [
    {
      id: 'T1',
      title: 'O Brasil no Dia a Dia: Cultura e Identidade',
      elements: [
        {
          type: 'item',
          data: {
            id: 'I1', number: 1, title: 'Diversidade Cultural Brasileira', type: 'hybrid',
            image: 'https://images.unsplash.com/photo-1516997092306-0e10cc9b4df1?q=80&w=1000&auto=format&fit=crop',
            text: 'O Brasil é marcado por uma grande diversidade cultural. Assinale a alternativa que melhor representa essa diversidade cultural:',
            options: [
              { id: 'A', text: 'Uso de um único ritmo musical tradicional' },
              { id: 'B', text: 'Padronização cultural entre todas as regiões' },
              { id: 'C', text: 'Existência de festas como Frevo, Bumba Meu Boi e Carimbó' },
              { id: 'D', text: 'Exclusividade da cultura europeia' }
            ]
          }
        },
        {
          type: 'item',
          data: {
            id: 'I2', number: 2, title: 'Identidade Nacional', type: 'subjective', image: null,
            text: 'Explique por que a diversidade cultural é considerada uma das principais características da identidade brasileira.',
          }
        },
        {
          type: 'item',
          data: {
            id: 'I3', number: 3, title: 'Futebol como Fenômeno Social', type: 'single_choice',
            image: 'https://images.unsplash.com/photo-1579952363873-27f3bade9f55?q=80&w=1000&auto=format&fit=crop',
            text: 'Qual a principal função social deste esporte em comunidades de baixa renda?',
            options: [
              { id: 'A', text: 'Apenas entretenimento televisivo.' },
              { id: 'B', text: 'Ferramenta de integração e ascensão social.' },
              { id: 'C', text: 'Afastar os jovens da escola.' },
              { id: 'D', text: 'Nenhuma função social específica.' }
            ]
          }
        },
        {
          type: 'item',
          data: {
            id: 'I4', number: 4, title: 'Culinária Regional', type: 'single_choice', image: null,
            text: 'Qual dos pratos abaixo é tipicamente associado à herança africana e muito popular na Bahia?',
            options: [
              { id: 'A', text: 'Churrasco Gaúcho' }, { id: 'B', text: 'Acarajé' },
              { id: 'C', text: 'Pão de Queijo' }, { id: 'D', text: 'Tacacá' }
            ]
          }
        }
      ]
    },
    {
      id: 'T2',
      title: 'Meio Ambiente, Geografia e Sociedade',
      elements: [
        {
          type: 'item', 
          data: {
            id: 'I5', number: 5, title: 'Floresta Amazônica', type: 'single_choice',
            image: 'https://images.unsplash.com/photo-1518182170546-076616fdfa32?q=80&w=1000&auto=format&fit=crop',
            text: 'A Floresta Amazônica tem um papel crucial no planeta. Assinale a correta:',
            options: [
              { id: 'A', text: 'Possui baixa biodiversidade.' },
              { id: 'B', text: 'Influencia o clima do Brasil e do mundo.' },
              { id: 'C', text: 'É um bioma desértico.' },
              { id: 'D', text: 'Localiza-se apenas na região sul.' }
            ]
          }
        },
        {
          type: 'block', 
          context: {
            text: 'O Brasil possui um território extenso e diverso, caracterizado por diferentes paisagens naturais, climas, biomas e formas de ocupação humana. Essas características influenciam diretamente os modos de vida da população, as práticas culturais, as atividades econômicas e a relação das pessoas com o meio ambiente. Compreender essa interação entre espaço geográfico, sociedade e natureza é essencial para desenvolver uma visão crítica sobre diversidade regional e sustentabilidade.',
            image: null
          },
          items: [
            {
              id: 'I6', number: 6, title: 'Biomas Brasileiros', type: 'single_choice', image: null,
              text: 'Com base no texto, qual alternativa apresenta apenas biomas brasileiros?',
              options: [
                { id: 'A', text: 'Amazônia, Pantanal e Cerrado' },
                { id: 'B', text: 'Deserto do Saara, Amazônia e Pampa' },
                { id: 'C', text: 'Tundra, Pantanal e Cerrado' },
                { id: 'D', text: 'Savana Africana e Caatinga' }
              ]
            },
            {
              id: 'I7', number: 7, title: 'Preservação', type: 'hybrid', image: null,
              text: 'A preservação dos biomas descritos no texto base é importante porque:',
              options: [
                { id: 'A', text: 'Dificulta a vida local.' },
                { id: 'B', text: 'Garante a manutenção dos recursos naturais.' },
                { id: 'C', text: 'Impede o desenvolvimento econômico.' },
                { id: 'D', text: 'Afeta apenas áreas rurais.' }
              ]
            },
            {
              id: 'I8', number: 8, title: 'Desenvolvimento Crítico', type: 'subjective', image: null,
              text: 'Utilizando os argumentos do texto, explique como a geografia de uma região pode alterar as práticas culturais do seu povo.'
            }
          ]
        }
      ]
    },
    {
      id: 'T3',
      title: 'Curiosidades Históricas e Geográficas',
      elements: [
        {
          type: 'item',
          data: {
            id: 'I9', number: 9, title: 'Guerra dos Trinta Anos', type: 'single_choice', image: null,
            text: 'A Guerra dos Trinta Anos ocorreu na Europa Central entre 1618 e 1648. Qual alternativa indica a duração correta?',
            options: [
              { id: 'A', text: '25 anos' }, { id: 'B', text: '30 anos' },
              { id: 'C', text: '31 anos' }, { id: 'D', text: '29 anos' }
            ]
          }
        },
        {
          type: 'item',
          data: {
            id: 'I10', number: 10, title: 'A Invenção do Avião', type: 'subjective', image: null,
            text: 'Descreva a importância da invenção do avião no contexto das relações globais do século XX.'
          }
        },
        {
          type: 'item',
          data: {
            id: 'I11', number: 11, title: 'Descobrimento da Penicilina', type: 'hybrid', image: null,
            text: 'Quem foi o cientista responsável pela descoberta acidental da penicilina?',
            options: [
              { id: 'A', text: 'Albert Einstein' }, { id: 'B', text: 'Alexander Fleming' },
              { id: 'C', text: 'Marie Curie' }, { id: 'D', text: 'Louis Pasteur' }
            ]
          }
        },
        {
          type: 'item',
          data: {
            id: 'I12', number: 12, title: 'A Grande Muralha da China', type: 'single_choice', image: null,
            text: 'Qual foi o principal propósito que motivou a construção inicial da Grande Muralha da China?',
            options: [
              { id: 'A', text: 'Proteger o império chinês contra invasões de grupos nômades.' },
              { id: 'B', text: 'Atrair comércio de outras nações asiáticas.' },
              { id: 'C', text: 'Apenas demarcar territórios provinciais.' },
              { id: 'D', text: 'Servir como uma estrada monumental.' }
            ]
          }
        }
      ]
    }
  ]
};

const MARKER_COLORS = ['#EF4444', '#FACC15', '#4ADE80', '#3B82F6', '#2DD4BF', '#F472B6'];

const RealizacaoTestes = ({ colors, isDarkMode, navigateTo }) => {
  // --- ESTADOS GERAIS (FLUXO DE TELAS) ---
  const [currentScreen, setCurrentScreen] = useState('dashboard');
  
  // Dashboard states
  const [dashboardTab, setDashboardTab] = useState('Ativas');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(null);

  // Test states
  const [theme, setTheme] = useState(isDarkMode ? 'dark' : 'light'); 
  const [fontSize, setFontSize] = useState(16); 
  const [timeRemaining, setTimeRemaining] = useState(mockTest.timeLimitSeconds);
  const [timeSpent, setTimeSpent] = useState(0);
  const [currentTaskIndex, setCurrentTaskIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [flags, setFlags] = useState({});

  // UI Test States
  const [showFontMenu, setShowFontMenu] = useState(false);
  const [showMarkerMenu, setShowMarkerMenu] = useState(false);
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
    const items = getTaskItems(mockTest.tasks[taskIndex]);
    return items.every(item => isItemComplete(item));
  };

  const getTotalItems = () => mockTest.tasks.reduce((acc, t) => acc + getTaskItems(t).length, 0);
  const getTotalAnswered = () => mockTest.tasks.reduce((acc, t) => acc + getTaskItems(t).filter(i => isItemComplete(i)).length, 0);

  // --- HANDLERS ---
  const handleAnswer = (key, value) => setAnswers(prev => ({ ...prev, [key]: value }));
  
  const handleFlag = (itemId, color) => {
    setFlags(prev => {
      const newFlags = { ...prev };
      if (newFlags[itemId] === color) delete newFlags[itemId]; 
      else newFlags[itemId] = color;
      return newFlags;
    });
    setShowMarkerMenu(false);
  };

  const handleStartTest = () => {
    setCurrentScreen('test');
    window.scrollTo(0,0);
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

  // Navegação no Teste
  const goNextTask = () => {
    if (currentTaskIndex < mockTest.tasks.length - 1) {
      if (isTaskComplete(currentTaskIndex)) setShowTaskSuccessModal(true);
      else { setCurrentTaskIndex(prev => prev + 1); window.scrollTo(0,0); }
    }
  };

  const confirmNextTask = () => {
    setShowTaskSuccessModal(false);
    setCurrentTaskIndex(prev => prev + 1);
    window.scrollTo(0,0);
  };

  const goPrevTask = () => {
    if (currentTaskIndex > 0) {
      setCurrentTaskIndex(prev => prev - 1);
      window.scrollTo(0,0);
    }
  };

  const jumpToTask = (taskIndex) => {
    setCurrentTaskIndex(taskIndex);
    setShowMapModal(false);
    window.scrollTo(0,0);
  };

  // ==========================================================================
  // COMPONENTES DE RENDERIZAÇÃO DE TELAS
  // ==========================================================================

  // --- 1. DASHBOARD ---
  const renderDashboard = () => {
    const statusMap = { 'Ativas': 'active', 'Realizadas': 'completed', 'Expiradas': 'expired' };
    const filteredAssessments = mockAssessments.filter(a => a.status === statusMap[dashboardTab]);

    return (
      <div className="flex-1 bg-[#F7F8FA] flex flex-col font-['Montserrat',sans-serif] text-[#1D2432]">
        <main className="flex-1 max-w-[1200px] w-full mx-auto p-4 md:p-10 animate-fade-slide">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
            <h1 className="text-[24px] md:text-[28px] font-bold text-[#1D2432]">Olá, David!</h1>
            <div className="relative w-full md:w-[350px]">
              <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input type="text" placeholder="Pesquisar avaliação..." className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#008BC9] shadow-sm" />
            </div>
          </div>

          <div className="mb-6 border-b border-gray-200 flex overflow-x-auto hide-scrollbar">
            {['Ativas', 'Realizadas', 'Expiradas'].map(tab => (
              <button key={tab} onClick={() => setDashboardTab(tab)} className={`px-5 py-3 font-bold text-[14px] border-b-2 transition-colors whitespace-nowrap ${dashboardTab === tab ? 'border-[#008BC9] text-[#008BC9]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                {tab}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-4 pb-12">
            {filteredAssessments.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                 <ListTodo size={48} className="text-gray-300 mb-4" />
                 <h2 className="text-[18px] font-bold text-[#1D2432]">Nenhuma avaliação {dashboardTab.toLowerCase()}</h2>
                 <p className="text-[14px] text-gray-500 mt-2">Você não possui avaliações nesta categoria no momento.</p>
              </div>
            ) : (
              filteredAssessments.map(av => (
                <div key={av.id} onClick={() => { setSelectedAssessmentId(av.id); setCurrentScreen('pre_test'); window.scrollTo(0,0); }} className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#008BC9] cursor-pointer transition-all flex flex-col md:flex-row gap-4 md:gap-6 relative group">
                   <div className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0 ${av.status === 'expired' ? 'bg-[#EF4444]' : (av.status === 'completed' ? 'bg-[#10B981]' : 'bg-[#008BC9]')}`}>
                      <BookOpen size={24} className="text-white" />
                   </div>
                   <div className="flex flex-col flex-1">
                      <div className="text-[12px] font-semibold text-gray-500 mb-1">{av.id} • {av.subtitle}</div>
                      <h3 className="text-[16px] md:text-[18px] font-bold text-[#1D2432] mb-4 pr-6">{av.title}</h3>
                      {av.status === 'active' && av.progress > 0 && (
                         <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                            <div className="h-full bg-[#008BC9] rounded-full" style={{ width: `${av.progress}%` }}></div>
                         </div>
                      )}
                      <div className="flex items-center gap-4 md:gap-6 text-[12px] md:text-[13px] text-gray-500 font-medium mt-auto">
                         <div className="flex items-center gap-1.5"><Calendar size={14} /> {av.startDate}</div>
                         <div className="flex items-center gap-1.5"><Clock size={14} /> {av.endDate}</div>
                      </div>
                   </div>
                   <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                      <ChevronRight size={24} className="text-[#008BC9]" />
                   </div>
                </div>
              ))
            )}
          </div>
        </main>
      </div>
    );
  };

  // --- 2. TELA DE REGRAS E INFO (PRE-TEST) ---
  const renderPreTest = () => {
    const av = mockAssessments.find(a => a.id === selectedAssessmentId) || mockAssessments[0];
    let btnText = av.status === 'active' && av.progress > 0 ? 'CONTINUAR AVALIAÇÃO' : 'INICIAR AVALIAÇÃO';

    return (
      <div className="flex-1 bg-[#F7F8FA] flex flex-col font-['Montserrat',sans-serif] text-[#1D2432]">
        <main className="flex-1 max-w-[900px] w-full mx-auto p-4 md:p-10 animate-fade-slide">
          <button onClick={() => setCurrentScreen('dashboard')} className="mb-6 flex items-center gap-2 text-gray-500 hover:text-gray-800 font-bold text-[14px] transition-colors">
            <ArrowLeft size={18} /> Voltar para o Início
          </button>

          <div className="bg-[#001D31] rounded-2xl p-6 md:p-10 shadow-lg mb-8 relative overflow-hidden">
             <div className="absolute right-0 top-0 bottom-0 w-1/2 opacity-10 pointer-events-none">
               <svg viewBox="0 0 500 200" preserveAspectRatio="none" className="w-full h-full"><path d="M0,200 C100,100 200,0 500,0" fill="none" stroke="#FFFFFF" strokeWidth="2" /><path d="M40,200 C140,100 240,0 500,40" fill="none" stroke="#FFFFFF" strokeWidth="2" /></svg>
             </div>
             <div className="relative z-10">
               <div className="flex items-center gap-2 text-[12px] md:text-[13px] font-semibold text-[#94CFEF] mb-3">
                 <BookOpen size={16}/> {av.id} • {av.subtitle}
               </div>
               <h2 className="text-[22px] md:text-[28px] font-bold text-white leading-snug max-w-[90%] md:max-w-[80%]">
                 {av.title}
               </h2>
             </div>
          </div>

          <div className="bg-white rounded-2xl p-6 md:p-8 border border-gray-200 shadow-sm mb-12">
            <h3 className="text-[18px] font-bold text-[#1D2432] mb-6 border-b border-gray-100 pb-4">Informações da Avaliação</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
               <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                 <div className="flex items-center gap-2 text-[13px] font-bold text-gray-500 uppercase tracking-wide"><Calendar size={16} className="text-[#008BC9]"/> Prazo limite</div>
                 <div className="font-bold text-[#1D2432] text-[15px]">{av.endDate}</div>
               </div>
               <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                 <div className="flex items-center gap-2 text-[13px] font-bold text-gray-500 uppercase tracking-wide"><ListTodo size={16} className="text-[#008BC9]"/> Questões</div>
                 <div className="font-bold text-[#1D2432] text-[15px]">{av.totalItems} questões</div>
               </div>
               <div className="flex flex-col gap-1.5 p-4 rounded-xl bg-gray-50 border border-gray-100">
                 <div className="flex items-center gap-2 text-[13px] font-bold text-gray-500 uppercase tracking-wide"><Clock size={16} className="text-[#008BC9]"/> Tempo Estimado</div>
                 <div className="font-bold text-[#1D2432] text-[15px]">{av.avgTime}</div>
               </div>
            </div>

            <div className="flex items-center gap-2 text-[#008BC9] font-bold text-[14px] uppercase tracking-wide mb-4">
              <AlertTriangle size={18} /> Instruções Importantes
            </div>
            
            <ul className="list-none flex flex-col gap-3 text-[14px] md:text-[15px] text-gray-700 leading-relaxed font-medium">
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#008BC9] mt-2 shrink-0"></div> Reserve um ambiente tranquilo e sem distrações.</li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#008BC9] mt-2 shrink-0"></div> O tempo de prova começará a contar assim que clicar em Iniciar.</li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#008BC9] mt-2 shrink-0"></div> Leia com atenção as instruções e enunciados de cada questão.</li>
              <li className="flex items-start gap-3"><div className="w-1.5 h-1.5 rounded-full bg-[#008BC9] mt-2 shrink-0"></div> Ao finalizar todas as tarefas, não se esqueça de clicar em "Enviar" para concluir.</li>
            </ul>
          </div>

          <div className="flex justify-center mb-20">
            <button 
              onClick={handleStartTest}
              disabled={av.status !== 'active'}
              className={`px-12 py-4 rounded-xl font-bold text-[15px] md:text-[16px] uppercase tracking-wide shadow-lg transition-all transform hover:-translate-y-1 w-full md:w-auto ${av.status === 'active' ? 'bg-[#008BC9] text-white hover:bg-[#003A79] hover:shadow-xl' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
            >
              {btnText}
            </button>
          </div>

        </main>
      </div>
    );
  };

  // --- 3. TELA DE REALIZAÇÃO DO TESTE (PLAYER) ---
  const renderTestPlayer = () => {
    // Tema Claro/Escuro Dinâmico 
    const t = {
      bgApp: theme === 'dark' ? 'bg-[#0B121A]' : 'bg-[#F7F8FA]',
      bgHeader: theme === 'dark' ? 'bg-[#151E28]' : 'bg-white',
      bgSubHeader: theme === 'dark' ? 'bg-[#1D2836]' : 'bg-[#1D2432]',
      textMain: theme === 'dark' ? 'text-gray-100' : 'text-[#1D2432]',
      textMuted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
      border: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
      cardBg: theme === 'dark' ? 'bg-[#151E28]' : 'bg-white',
      cardBorder: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
      inputBg: theme === 'dark' ? 'bg-[#0B121A]' : 'bg-[#F7F8FA]',
      optionBg: theme === 'dark' ? 'bg-[#151E28]' : 'bg-white',
      optionBorder: theme === 'dark' ? 'border-gray-700' : 'border-gray-300',
      optionHover: theme === 'dark' ? 'hover:bg-[#1D2836] hover:border-[#008BC9]' : 'hover:bg-[#F0F9FF] hover:border-[#008BC9]',
      activeOptionBg: theme === 'dark' ? 'bg-[#003A79]' : 'bg-[#E0F2FE]',
      activeOptionBorder: 'border-[#008BC9]',
      activeOptionText: theme === 'dark' ? 'text-white' : 'text-[#008BC9]',
    };

    const currentTask = mockTest.tasks[currentTaskIndex];
    const taskItems = getTaskItems(currentTask);
    const firstItemIdOfTask = taskItems[0]?.id;

    return (
      <div className={`fixed inset-0 flex flex-col font-['Montserrat',sans-serif] ${t.bgApp} transition-colors duration-300 z-[60]`}>
        
        {/* Header Principal */}
        <header className={`h-[60px] md:h-[64px] ${t.bgHeader} border-b ${t.border} flex justify-between items-center px-4 md:px-8 shrink-0 z-50 shadow-sm transition-colors duration-300`}>
          <div className="flex items-center gap-3 md:gap-4">
            <img src="https://dgpe.fgv.br/sites/default/files/Marca_DGPE%20%281%29.png" alt="FGV" className={`h-[18px] md:h-[24px] ${theme === 'dark' ? 'brightness-0 invert' : ''}`} />
            <div className="w-px h-6 bg-gray-300 hidden md:block"></div>
            <span className={`font-bold text-[14px] md:text-[18px] tracking-tight ${t.textMain} truncate`}>Realização de Avaliações</span>
          </div>
          
          <div className="flex items-center gap-2 md:gap-6">
            <div className="flex items-center bg-gray-100 dark:bg-gray-800 rounded-lg p-1 mr-2">
              <button 
                onClick={() => setFontSize(Math.max(14, fontSize - 2))} 
                className="w-8 h-8 flex items-center justify-center rounded text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 font-bold text-sm transition-colors"
                title="Diminuir fonte" aria-label="Diminuir tamanho da fonte"
              >A-</button>
              <div className="w-px h-4 bg-gray-300 dark:bg-gray-600 mx-1"></div>
              <button 
                onClick={() => setFontSize(Math.min(24, fontSize + 2))} 
                className="w-8 h-8 flex items-center justify-center rounded text-gray-600 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 font-bold text-lg transition-colors"
                title="Aumentar fonte" aria-label="Aumentar tamanho da fonte"
              >A+</button>
            </div>

            <button 
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')} 
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${t.textMuted} hover:bg-gray-100 dark:hover:bg-gray-800 hover:${t.textMain}`}
              title={theme === 'dark' ? "Ativar Modo Claro" : "Ativar Modo Escuro"}
            >
              {theme === 'dark' ? <Sun size={20}/> : <Moon size={20}/>}
            </button>
          </div>
        </header>

        {/* Sub-Header (Barra de Tarefa - Progresso Contextual) */}
        <div className={`h-[56px] ${t.bgSubHeader} flex justify-between items-center px-4 md:px-8 shrink-0 z-40 transition-colors duration-300 shadow-md`}>
          <div className="flex items-center gap-3 overflow-hidden">
            <button onClick={() => setCurrentScreen('dashboard')} className={`text-gray-400 hover:text-white transition-colors p-1.5 rounded-md hover:bg-white/10`} title="Sair da Avaliação">
              <X size={20} />
            </button>
            <span className={`text-[14px] md:text-[15px] font-bold text-white truncate hidden sm:block`}>
              Tarefa {currentTaskIndex + 1}: {currentTask.title}
            </span>
            <span className={`text-[14px] font-bold text-white truncate sm:hidden`}>
              Tarefa {currentTaskIndex + 1}/{mockTest.tasks.length}
            </span>
          </div>

          <div className="flex items-center gap-3 md:gap-6 shrink-0">
            <div className="relative">
               <button 
                 onClick={() => { setShowMarkerMenu(!showMarkerMenu); setShowFontMenu(false); }} 
                 className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors ${flags[firstItemIdOfTask] ? 'bg-white/20 text-white' : 'text-gray-400 hover:text-white hover:bg-white/10'}`}
                 title="Marcar questão para revisar depois"
               >
                 <Flag size={18} className={flags[firstItemIdOfTask] ? 'fill-current' : ''} style={{ color: flags[firstItemIdOfTask] || 'currentColor' }} />
                 <span className="text-[13px] font-bold hidden md:block">Revisar</span>
               </button>
               
               {showMarkerMenu && (
                  <div className={`absolute top-full right-0 mt-2 w-[220px] rounded-xl shadow-xl border ${t.cardBorder} ${t.cardBg} p-4 z-50 animate-fade-slide`}>
                     <div className="flex justify-between items-center mb-3 border-b pb-2" style={{ borderColor: theme === 'dark' ? '#2A3B4C' : '#E5E7EB' }}>
                       <span className={`text-[13px] font-bold ${t.textMain}`}>Cor do Marcador</span>
                       <X size={16} className={`${t.textMuted} cursor-pointer hover:text-red-500`} onClick={() => setShowMarkerMenu(false)}/>
                     </div>
                     <p className={`text-[11px] mb-3 ${t.textMuted}`}>Use as cores para sinalizar dúvidas e voltar depois.</p>
                     <div className="flex justify-between items-center px-1">
                       {MARKER_COLORS.map(color => (
                         <button 
                           key={color} 
                           onClick={() => handleFlag(firstItemIdOfTask, color)} 
                           className={`w-7 h-7 rounded-full shadow-sm hover:scale-110 transition-transform ${flags[firstItemIdOfTask] === color ? 'ring-2 ring-offset-2 ring-[#008BC9]' : ''}`} 
                           style={{ backgroundColor: color }} 
                           title="Selecionar esta cor"
                         />
                       ))}
                     </div>
                  </div>
               )}
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 text-white font-mono font-bold text-[14px] tracking-widest shadow-inner">
              <Clock size={16} className="text-[#94CFEF]" /> {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* --- CONTEÚDO PRINCIPAL (QUESTÕES E BLOCOS) --- */}
        <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center pt-6 md:pt-10 pb-[100px] px-4 md:px-8">
          <div className={`w-full max-w-[800px] flex flex-col gap-8 md:gap-12 transition-all duration-300`} style={{ fontSize: `${fontSize}px` }}>
             
             {/* CONTEXTO DA TAREFA */}
             {currentTask.context && (
               <div className={`flex flex-col gap-4 p-6 md:p-8 rounded-2xl border ${theme === 'dark' ? 'bg-[#003A79]/20 border-[#003A79]' : 'bg-[#F0F9FF] border-[#BAE6FD]'} animate-fade-slide`}>
                 <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-[#94CFEF]' : 'text-[#008BC9]'} mb-1`}>
                   <BookOpen size={22} className="shrink-0" />
                   <span className="font-bold text-[14px] md:text-[16px] tracking-wide">
                     TEXTO BASE DA TAREFA
                   </span>
                 </div>
                 <p className={`${t.textMain} leading-relaxed text-justify`} style={{ fontSize: '1em' }}>
                   {currentTask.context.text}
                 </p>
                 {currentTask.context.image && (
                   <div className={`w-full rounded-xl overflow-hidden mt-3 border ${t.cardBorder} shadow-sm`}>
                     <img src={currentTask.context.image} alt="Contexto ilustrativo" className="w-full h-auto object-cover" />
                   </div>
                 )}
               </div>
             )}

             {/* RENDERIZAÇÃO DE ELEMENTOS */}
             <div className="flex flex-col gap-10">
                {currentTask.elements.map((el, idx) => {
                  
                  const renderItem = (item, uniqueKey) => {
                    const itemComplete = isItemComplete(item);
                    const cardBgComplete = theme === 'dark' ? 'bg-[#064E3B]/20 border-[#059669]/50' : 'bg-[#F0FDF4] border-[#6EE7B7]';
                    const cardClass = itemComplete ? cardBgComplete : `${t.cardBg} ${t.cardBorder}`;

                    return (
                      <div key={uniqueKey} className={`flex flex-col gap-6 p-6 md:p-8 rounded-2xl border-2 shadow-sm transition-all duration-300 ${cardClass} animate-fade-slide`}>
                        
                        <div className="flex justify-between items-start gap-4">
                          <h3 className={`font-bold ${t.textMain} leading-snug flex-1`} style={{ fontSize: '1.15em' }}>
                            <span className="text-[#008BC9] mr-2">Questão {item.number}.</span>
                            {item.title}
                          </h3>
                          {itemComplete && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#10B981] text-white rounded-full text-[12px] font-bold shadow-sm shrink-0 animate-fade-slide">
                              <CheckCircle2 size={14}/> <span className="hidden sm:inline">Respondida</span>
                            </div>
                          )}
                        </div>

                        {item.image && (
                          <div className={`w-full rounded-xl overflow-hidden border ${t.cardBorder} shadow-sm`}>
                            <img src={item.image} alt="Imagem da questão" className="w-full max-h-[400px] object-contain bg-gray-50" />
                          </div>
                        )}

                        <p className={`${t.textMain} leading-relaxed whitespace-pre-line`} style={{ fontSize: '1em' }}>{item.text}</p>

                        {(item.type === 'single_choice' || item.type === 'hybrid') && (
                          <div className="flex flex-col gap-4 mt-2">
                            {item.options?.map((opt) => {
                              const isSelected = answers[`${item.id}_choice`] === opt.id || answers[item.id] === opt.id;
                              return (
                                <label key={opt.id} className={`flex items-center gap-4 p-5 rounded-xl border-2 cursor-pointer transition-all duration-200 group ${isSelected ? `${t.activeOptionBg} ${t.activeOptionBorder} shadow-md transform scale-[1.01]` : `${t.optionBg} ${t.optionBorder} ${t.optionHover}`}`}>
                                  <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors ${isSelected ? 'border-white bg-[#008BC9]' : 'border-gray-400 bg-white group-hover:border-[#008BC9]'}`}>
                                    <span className={`font-bold text-[14px] ${isSelected ? 'text-white' : 'text-gray-600'}`}>{opt.id}</span>
                                  </div>
                                  <span className={`font-medium leading-snug flex-1 ${isSelected ? t.activeOptionText : t.textMain}`} style={{ fontSize: '1em' }}>
                                    {opt.text}
                                  </span>
                                  <input type="radio" name={`item_${item.id}`} value={opt.id} className="hidden" checked={isSelected}
                                    onChange={() => {
                                      if (item.type === 'hybrid') handleAnswer(`${item.id}_choice`, opt.id);
                                      else { handleAnswer(`${item.id}_choice`, opt.id); handleAnswer(item.id, opt.id); }
                                    }}
                                  />
                                </label>
                              );
                            })}
                          </div>
                        )}

                        {(item.type === 'subjective' || item.type === 'hybrid') && (
                          <div className="w-full flex flex-col gap-3 mt-4">
                            {item.type === 'hybrid' && <span className={`font-bold text-[#008BC9] pt-4 border-t ${t.border}`} style={{ fontSize: '1em' }}>Justifique sua resposta:</span>}
                            <textarea
                              value={item.type === 'hybrid' ? (answers[`${item.id}_text`] || '') : (answers[`${item.id}_text`] || answers[item.id] || '')}
                              onChange={(e) => {
                                if (item.type === 'hybrid') handleAnswer(`${item.id}_text`, e.target.value);
                                else { handleAnswer(`${item.id}_text`, e.target.value); handleAnswer(item.id, e.target.value); }
                              }}
                              placeholder="Digite sua resposta aqui de forma clara..."
                              className={`w-full p-5 rounded-xl border-2 outline-none transition-all resize-y min-h-[160px] ${t.inputBg} ${t.textMain} focus:border-[#008BC9] focus:ring-4 focus:ring-[#008BC9]/20 shadow-inner`}
                              style={{ borderColor: (answers[`${item.id}_text`] || answers[item.id]) ? '#008BC9' : (theme === 'dark' ? '#2A3B4C' : '#E5E7EB'), fontSize: '1em' }}
                            />
                          </div>
                        )}

                      </div>
                    );
                  };

                  if (el.type === 'item') {
                    return renderItem(el.data, `item-${idx}`);
                  } else if (el.type === 'block') {
                    const startNumber = el.items[0]?.number;
                    const endNumber = el.items[el.items.length - 1]?.number;
                    return (
                      <div key={`block-${idx}`} className="flex flex-col gap-8 w-full">
                        <div className={`flex flex-col gap-4 p-6 md:p-8 rounded-2xl border ${theme === 'dark' ? 'bg-[#003A79]/20 border-[#003A79]' : 'bg-[#F0F9FF] border-[#BAE6FD]'} animate-fade-slide relative overflow-hidden`}>
                          <div className="absolute left-0 top-0 bottom-0 w-2 bg-[#008BC9]"></div>
                          <div className={`flex items-center gap-2 ${theme === 'dark' ? 'text-[#94CFEF]' : 'text-[#008BC9]'} mb-1`}>
                            <BookOpen size={22} className="shrink-0" />
                            <span className="font-bold text-[14px] md:text-[16px] uppercase tracking-wide">
                              TEXTO BASE PARA AS QUESTÕES {startNumber} A {endNumber}
                            </span>
                          </div>
                          <p className={`${t.textMain} leading-relaxed text-justify`} style={{ fontSize: '1em' }}>
                            {el.context.text}
                          </p>
                          {el.context.image && (
                            <div className={`w-full rounded-xl overflow-hidden mt-3 border ${t.cardBorder} shadow-sm`}>
                              <img src={el.context.image} alt="Contexto" className="w-full h-auto object-cover" />
                            </div>
                          )}
                        </div>
                        
                        <div className="flex flex-col gap-10">
                          {el.items.map((bItem, bIdx) => renderItem(bItem, `bItem-${idx}-${bIdx}`))}
                        </div>
                      </div>
                    );
                  }
                  return null;
                })}
             </div>

          </div>
        </main>

        {/* --- BOTTOM NAVIGATION --- */}
        <div className={`fixed bottom-0 left-0 w-full h-[80px] ${theme === 'dark' ? 'bg-[#0B121A]' : 'bg-white'} border-t ${t.border} flex justify-between items-center px-4 md:px-8 z-[70] shadow-[0_-10px_30px_rgba(0,0,0,0.08)] transition-colors duration-300`}>
           
           <div className="w-[120px] md:w-[160px]">
             <button 
               onClick={goPrevTask} 
               disabled={currentTaskIndex === 0}
               className={`h-[48px] px-4 md:px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] transition-all duration-200 ${currentTaskIndex === 0 ? `opacity-40 cursor-not-allowed text-gray-500 ${theme==='dark'?'bg-[#1D2836]':'bg-gray-100'}` : `bg-[#D9F0FC] text-[#008BC9] hover:bg-[#008BC9] hover:text-white shadow-sm`}`}
             >
               <ChevronLeft size={20} /> <span className="hidden md:block">Anterior</span>
             </button>
           </div>

           <div className="flex-1 flex flex-col items-center justify-center gap-1">
              <button onClick={() => setShowMapModal(true)} className="flex items-center gap-2 px-6 py-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group">
                 <LayoutGrid size={18} className="text-[#008BC9] group-hover:scale-110 transition-transform"/>
                 <span className={`text-[14px] font-bold ${t.textMain}`}>Visão Geral da Prova</span>
              </button>
              <div className="text-[12px] font-semibold text-gray-500">
                {getTotalAnswered()} de {getTotalItems()} respondidas
              </div>
           </div>

           <div className="w-[120px] md:w-[160px] flex justify-end">
             {currentTaskIndex === mockTest.tasks.length - 1 ? (
               <button 
                 onClick={handleAttemptFinish}
                 className={`h-[48px] px-4 md:px-8 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:-translate-y-0.5 bg-[#008BC9] text-white hover:bg-[#003A79]`}
               >
                 <span className="hidden md:block">Finalizar</span> <Send size={18} />
               </button>
             ) : (
               <button 
                 onClick={goNextTask} 
                 className={`h-[48px] px-4 md:px-6 rounded-xl flex items-center justify-center gap-2 font-bold text-[14px] transition-all duration-200 bg-[#D9F0FC] text-[#008BC9] hover:bg-[#008BC9] hover:text-white shadow-sm`}
               >
                 <span className="hidden md:block">Próximo</span> <ChevronRight size={20} />
               </button>
             )}
           </div>
        </div>

        {/* MODAIS */}
        {showMapModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
            <div className={`w-full max-w-[800px] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${t.cardBg} border ${t.cardBorder}`}>
               <div className="px-6 md:px-8 py-5 border-b flex justify-between items-center bg-[#001D31] text-white">
                 <h3 className={`text-[20px] font-bold flex items-center gap-2`}><LayoutGrid size={22}/> Visão Geral da Prova</h3>
                 <button className={`p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors`} onClick={() => setShowMapModal(false)}><X size={20}/></button>
               </div>
               <div className="px-6 md:px-8 py-4 bg-gray-50 dark:bg-[#0B121A] border-b border-gray-200 dark:border-gray-800 flex flex-wrap gap-4 md:gap-8 justify-center">
                 <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 rounded border-2 border-[#008BC9] bg-[#008BC9] flex items-center justify-center text-white"><CheckCircle2 size={12}/></div> Respondida
                 </div>
                 <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 rounded border-2 border-gray-300 bg-white dark:bg-gray-800"></div> Em Branco
                 </div>
                 <div className="flex items-center gap-2 text-[13px] font-semibold text-gray-600 dark:text-gray-300">
                    <div className="w-5 h-5 rounded border-2 border-[#008BC9] bg-white relative"><div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-[#EF4444]"></div></div> Marcada para revisar
                 </div>
               </div>
               <div className="p-6 md:p-8 overflow-y-auto max-h-[50vh] custom-scrollbar flex flex-col gap-10">
                 {mockTest.tasks.map((task, tIdx) => {
                   const flatItems = getTaskItems(task);
                   return (
                     <div key={task.id} className="flex flex-col gap-4">
                       <h4 className={`font-bold text-[15px] ${t.textMain} flex items-center gap-2 pb-2 border-b ${t.border}`}>
                         <span className="bg-[#D9F0FC] text-[#008BC9] px-2 py-0.5 rounded text-[12px]">Tarefa {tIdx + 1}</span> {task.title}
                       </h4>
                       <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                         {flatItems.map((item) => {
                           const isAnswered = isItemComplete(item);
                           const flagColor = flags[item.id];
                           let btnClass = `${t.bgApp} ${t.textMuted} hover:border-[#008BC9] border-gray-300 dark:border-gray-700`;
                           if (isAnswered) btnClass = 'bg-[#008BC9] border-[#008BC9] text-white shadow-md';
                           return (
                             <button 
                               key={item.id}
                               onClick={() => jumpToTask(tIdx)}
                               className={`h-[48px] rounded-xl border-2 flex items-center justify-center text-[15px] font-bold cursor-pointer transition-all relative transform hover:scale-105 ${btnClass}`}
                               title={`Ir para Questão ${item.number}`}
                             >
                               {item.number}
                               {flagColor && <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm" style={{ backgroundColor: flagColor }}></div>}
                             </button>
                           )
                         })}
                       </div>
                     </div>
                   )
                 })}
               </div>
               <div className="px-6 py-5 border-t flex justify-end bg-gray-50 dark:bg-[#0B121A] dark:border-gray-800">
                 <button onClick={() => setShowMapModal(false)} className="bg-[#008BC9] text-white px-8 py-3 rounded-xl font-bold text-[14px] shadow-md hover:bg-[#003A79] transition-colors">VOLTAR À PROVA</button>
               </div>
            </div>
          </div>
        )}

        {showTaskSuccessModal && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
            <div className={`w-full max-w-[400px] ${t.cardBg} rounded-2xl shadow-2xl overflow-hidden flex flex-col p-8 text-center border-t-8 border-[#10B981] relative`}>
               <button onClick={() => setShowTaskSuccessModal(false)} className={`absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500`}><X size={20}/></button>
               <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#10B981]">
                 <CheckCircle2 size={40} />
               </div>
               <h3 className={`text-[24px] font-black ${t.textMain} leading-tight mb-2`}>Tarefa Concluída!</h3>
               <p className="text-[15px] text-gray-500 mb-8 font-medium">Você respondeu a todas as questões desta seção com sucesso.</p>
               <button onClick={confirmNextTask} className="w-full py-4 bg-[#008BC9] text-white font-bold rounded-xl shadow-lg hover:bg-[#003A79] transition-colors text-[16px]">
                 Ir para a Próxima Tarefa
               </button>
            </div>
          </div>
        )}

        {showIncompleteWarning && (
          <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
            <div className={`w-full max-w-[440px] ${t.cardBg} rounded-2xl shadow-2xl overflow-hidden flex flex-col p-8 text-center border-t-8 border-[#F59E0B] relative`}>
               <div className="w-20 h-20 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-6 text-[#F59E0B]">
                 <AlertTriangle size={40} />
               </div>
               <h3 className={`text-[22px] font-black ${t.textMain} leading-tight mb-2`}>Atenção!</h3>
               <p className="text-[15px] text-gray-500 mb-8 font-medium">Você possui <strong className="text-[#1D2432] dark:text-white">{getTotalItems() - getTotalAnswered()} questão(ões)</strong> em branco. Tem certeza que deseja enviar a prova agora?</p>
               <div className="flex flex-col gap-3">
                 <button onClick={() => setShowIncompleteWarning(false)} className="w-full py-4 bg-[#008BC9] text-white font-bold rounded-xl shadow-md hover:bg-[#003A79] transition-colors text-[15px]">
                   Voltar e Responder
                 </button>
                 <button onClick={handleFinishTest} className="w-full py-4 bg-transparent border-2 border-gray-300 text-gray-600 font-bold rounded-xl hover:bg-gray-50 transition-colors text-[15px]">
                   Enviar Mesmo Assim
                 </button>
               </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  // --- 4. TELA DE FINALIZAÇÃO ---
  const renderFinished = () => {
    return (
      <div className={`flex-1 flex flex-col font-['Montserrat',sans-serif] bg-[#F7F8FA]`}>
        <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-slide text-center">
          <div className="w-32 h-32 bg-[#D1FAE5] rounded-full flex items-center justify-center mb-8 text-[#10B981] shadow-inner">
            <CheckCircle2 size={64} />
          </div>
          <h1 className={`text-[32px] font-black text-[#1D2432] mb-3`}>Avaliação Enviada!</h1>
          <p className={`text-gray-500 text-[16px] mb-12 font-medium`}>Parabéns por concluir sua avaliação. Suas respostas foram salvas com sucesso.</p>
          <div className="flex gap-8 md:gap-16 mb-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
            <div className="flex flex-col items-center gap-2">
              <span className={`text-[28px] font-black text-[#008BC9]`}>{formatTime(timeSpent)}</span>
              <span className={`text-[14px] font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide`}><Clock size={16}/> Tempo de Prova</span>
            </div>
            <div className="w-px bg-gray-200"></div>
            <div className="flex flex-col items-center gap-2">
              <span className={`text-[28px] font-black text-[#008BC9]`}>{getTotalAnswered()}/{getTotalItems()}</span>
              <span className={`text-[14px] font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide`}><LayoutGrid size={16}/> Respondidas</span>
            </div>
          </div>
          <button onClick={() => setCurrentScreen('dashboard')} className="bg-[#008BC9] text-white px-12 py-4 rounded-xl font-bold text-[15px] shadow-lg hover:bg-[#003A79] transition-all transform hover:-translate-y-1 uppercase tracking-wide">
            VOLTAR PARA O INÍCIO
          </button>
        </div>
      </div>
    );
  };

  // --- CONTROLE DE ROTAS ---
  if (currentScreen === 'dashboard') return renderDashboard();
  if (currentScreen === 'pre_test') return renderPreTest();
  if (currentScreen === 'test') return renderTestPlayer();
  if (currentScreen === 'finished') return renderFinished();
  
  return null;
}

export default RealizacaoTestes;
