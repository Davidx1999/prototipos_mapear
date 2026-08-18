import React, { useState, useMemo } from 'react';
import { 
  Search, Compass, Database, User, Sparkles, Star, Grid, List, 
  BookOpen, Brain, Target, Building2, ChevronRight, CheckCircle2, Filter, Layers, Clock
} from 'lucide-react';
import Button from '../../ui/Button';
import Chips from '../../ui/Chips';

import TaskCard from './components/TaskCard';
import TaskRow from './components/TaskRow';
import TaskInspectorDrawer from './components/TaskInspectorDrawer';
import TaskCurationModal from './components/TaskCurationModal';

// ─── RICH MOCK DATA: TAREFAS CURADAS E PESSOAIS ───
const INITIAL_TASKS = [
  {
    id: 'tsk-001',
    code: 'TSK-LP-5EF-001',
    title: 'Compreensão Leitora: Inferência em Poemas Narrativos',
    subject: 'Língua Portuguesa',
    grade: '5º Ano - EF',
    skill: 'EF05LP09',
    skillDesc: 'Inferir informações implícitas em textos poéticos e narrativos',
    cognitiveProcess: 'Analisar',
    responseType: 'Híbrida',
    isCurated: true,
    rating: 4.9,
    ratingCount: 52,
    networkUsageCount: 84,
    expectation: 'Identificar a metáfora central e a intenção do eu-lírico.',
    itemCompostoTitle: 'Poema "A Bailarina"',
    itemCompostoMarkdown: '# A Bailarina\n\nEsta menina tão pequenina\nquer ser **bailarina**.\n\nNão conhece nem *dó* nem *ré*\nmas sabe ficar na ponta do pé.\n\n> Cecília Meireles',
    items: [
      { title: 'Item 01 - Sentido de palavras', skill: 'EF05LP09', skillDesc: 'Inferir palavras', descriptor: 'D3', hasAnswer: true },
      { title: 'Item 02 - Tema central', skill: 'EF05LP09', skillDesc: 'Identificar tema', descriptor: 'D1', hasAnswer: true }
    ]
  },
  {
    id: 'tsk-002',
    code: 'TSK-MAT-9EF-014',
    title: 'Resolução de Problemas com Equações do 2º Grau no Cotidiano',
    subject: 'Matemática',
    grade: '9º Ano - EF',
    skill: 'EF09MA09',
    skillDesc: 'Compreender e aplicar equações do 2º grau',
    cognitiveProcess: 'Aplicar',
    responseType: 'Múltipla Escolha',
    isCurated: true,
    rating: 4.8,
    ratingCount: 41,
    networkUsageCount: 67,
    expectation: 'Modelar situações-problema utilizando a fórmula de Bhaskara.',
    itemCompostoTitle: 'Problema do Terreno Retangular',
    itemCompostoMarkdown: 'Um terreno retangular possui área de **120 m²**. Sabendo que o comprimento excede a largura em **2 metros**, determine as dimensões.',
    items: [
      { title: 'Item 01 - Modelagem da Equação', skill: 'EF09MA09', skillDesc: 'Modelar equação', descriptor: 'D19', hasAnswer: true },
      { title: 'Item 02 - Raízes reais', skill: 'EF09MA09', skillDesc: 'Encontrar raízes', descriptor: 'D19', hasAnswer: true }
    ]
  },
  {
    id: 'tsk-003',
    code: 'TSK-CIEN-4EF-003',
    title: 'Cadeias Alimentares e Transformação de Energia nos Ecossistemas',
    subject: 'Ciências da Natureza',
    grade: '4º Ano - EF',
    skill: 'EF04CI04',
    skillDesc: 'Analisar e construir cadeias alimentares simples',
    cognitiveProcess: 'Compreender',
    responseType: 'Múltipla Escolha',
    isCurated: true,
    rating: 4.7,
    ratingCount: 30,
    networkUsageCount: 45,
    expectation: 'Diferenciar produtores, consumidores e decompositores.',
    items: [
      { title: 'Item 01 - Papel dos Decompositores', skill: 'EF04CI04', skillDesc: 'Decompositores', descriptor: 'D4', hasAnswer: true }
    ]
  },
  {
    id: 'tsk-004',
    code: 'TSK-LP-2EF-008',
    title: 'Localização de Informações Explícitas em Fábulas',
    subject: 'Língua Portuguesa',
    grade: '2º Ano - EF',
    skill: 'EF02LP26',
    skillDesc: 'Ler e compreender fábulas',
    cognitiveProcess: 'Conhecer',
    responseType: 'Resposta Construída',
    isCurated: false,
    rating: 4.5,
    ratingCount: 12,
    networkUsageCount: 18,
    expectation: 'Identificar os personagens e a moral da história.',
    itemCompostoTitle: 'Fábula "A Cigarra e a Formiga"',
    itemCompostoMarkdown: '# A Cigarra e a Formiga\n\nDurante todo o verão, a **Cigarra** cantou enquanto a **Formiga** juntava grãos...',
    items: [
      { title: 'Item 01 - Moral da Fábula', skill: 'EF02LP26', skillDesc: 'Moral da história', descriptor: 'D1', hasAnswer: true }
    ]
  },
  {
    id: 'tsk-005',
    code: 'TSK-MAT-5EF-022',
    title: 'Operações com Números Decimais e Sistema Monetário',
    subject: 'Matemática',
    grade: '5º Ano - EF',
    skill: 'EF05MA07',
    skillDesc: 'Resolver problemas com números decimais no contexto financeiro',
    cognitiveProcess: 'Aplicar',
    responseType: 'Múltipla Escolha',
    isCurated: true,
    rating: 4.95,
    ratingCount: 88,
    networkUsageCount: 112,
    expectation: 'Calcular troco e somar valores com vírgula.',
    items: [
      { title: 'Item 01 - Cálculo de Troco', skill: 'EF05MA07', skillDesc: 'Troco', descriptor: 'D21', hasAnswer: true }
    ]
  }
];

const SUBJECTS = ['Todos os Componentes', 'Língua Portuguesa', 'Matemática', 'Ciências da Natureza'];
const GRADES = ['Todas as Séries', '2º Ano - EF', '4º Ano - EF', '5º Ano - EF', '9º Ano - EF'];
const BLOOM_PROCESSES = ['Todos os Processos', 'Conhecer', 'Compreender', 'Aplicar', 'Analisar', 'Avaliar', 'Criar'];

export default function BancoTarefasHubV2({
  onInsertTaskInCurrentTest = null,
  isEmbeddedMode = false,
  isDarkMode = false
}) {
  const [tasks, setTasks] = useState(INITIAL_TASKS);
  const [favorites, setFavorites] = useState(['tsk-001', 'tsk-005']);
  
  const [activeTab, setActiveTab] = useState('discovery'); // 'discovery' | 'catalog' | 'personal' | 'curation'
  const [displayMode, setDisplayMode] = useState('grid'); // 'grid' | 'list'
  const [selectedTask, setSelectedTask] = useState(null);
  const [curationModalTask, setCurationModalTask] = useState(null);

  // Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('Todos os Componentes');
  const [selectedGrade, setSelectedGrade] = useState('Todas as Séries');
  const [selectedBloom, setSelectedBloom] = useState('Todos os Processos');

  const toggleFavorite = (taskId) => {
    setFavorites(prev =>
      prev.includes(taskId) ? prev.filter(id => id !== taskId) : [...prev, taskId]
    );
  };

  const handleSubmitForCurationSuccess = (taskId) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: 'Em Curadoria' } : t));
  };

  // Filtered Task Computations
  const filteredTasks = useMemo(() => {
    return tasks.filter(t => {
      if (selectedSubject !== 'Todos os Componentes' && t.subject !== selectedSubject) return false;
      if (selectedGrade !== 'Todas as Séries' && t.grade !== selectedGrade) return false;
      if (selectedBloom !== 'Todos os Processos' && t.cognitiveProcess !== selectedBloom) return false;
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        return (
          t.title.toLowerCase().includes(q) ||
          t.skill?.toLowerCase().includes(q) ||
          t.subject.toLowerCase().includes(q) ||
          t.code?.toLowerCase().includes(q)
        );
      }
      return true;
    });
  }, [tasks, selectedSubject, selectedGrade, selectedBloom, searchQuery]);

  const curatedTasks = useMemo(() => filteredTasks.filter(t => t.isCurated), [filteredTasks]);
  const personalTasks = useMemo(() => filteredTasks.filter(t => !t.isCurated), [filteredTasks]);
  const favoriteTasks = useMemo(() => tasks.filter(t => favorites.includes(t.id)), [tasks, favorites]);

  return (
    <div className={`flex flex-col flex-1 h-full min-h-0 overflow-hidden font-['Montserrat',sans-serif] ${
      isDarkMode ? 'bg-neutral-7 text-white' : 'bg-neutral-0 text-neutral-7'
    }`}>
      {/* Top Header */}
      <header className={`p-4 px-6 border-b flex flex-wrap items-center justify-between gap-3 shrink-0 ${
        isDarkMode ? 'border-neutral-5 bg-neutral-6' : 'border-neutral-2 bg-white'
      }`}>
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-900/30">
            <Database size={24} />
          </div>
          <div>
            <h1 className="text-lg font-bold tracking-tight flex items-center gap-2">
              Banco de Tarefas Reutilizáveis
              <Chips label="Acervo Curado MAPEAR" status="success" variant="dark" />
            </h1>
            <p className="text-xs text-neutral-5 dark:text-neutral-4 font-medium">
              Repositório institucional de tarefas, matrizes e contextos em Markdown para reutilização rápida.
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="flex items-center gap-3 flex-1 max-w-lg">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-4" />
            <input
              type="text"
              placeholder="Buscar por habilidade (ex: EF05LP09), palavra-chave..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className={`w-full pl-9 pr-4 h-[40px] text-xs font-medium border rounded-xl outline-none transition-all ${
                isDarkMode
                  ? 'bg-neutral-7 border-neutral-5 text-white focus:border-brand-500'
                  : 'bg-neutral-1 border-neutral-3 text-neutral-8 focus:border-brand-500'
              }`}
            />
          </div>
        </div>
      </header>

      {/* Tabs & View Switcher */}
      <div className={`px-6 py-3 border-b flex flex-wrap items-center justify-between gap-4 shrink-0 ${
        isDarkMode ? 'border-neutral-5 bg-neutral-7/60' : 'border-neutral-2 bg-neutral-1/40'
      }`}>
        <div className="flex items-center gap-1 p-1 bg-neutral-2/60 dark:bg-neutral-5/40 rounded-lg text-xs font-bold">
          {[
            { id: 'discovery', label: 'Descoberta & Recomendados', icon: Compass },
            { id: 'catalog', label: `Catálogo Geral (${curatedTasks.length})`, icon: Database },
            { id: 'personal', label: `Meu Banco & Favoritas (${personalTasks.length + favoriteTasks.length})`, icon: User },
            { id: 'curation', label: 'Central de Curadoria', icon: Sparkles },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-3.5 py-2 rounded-md flex items-center gap-2 transition-all ${
                activeTab === tab.id
                  ? 'bg-white dark:bg-neutral-7 text-brand-500 shadow-sm font-bold'
                  : 'text-neutral-5 dark:text-neutral-3 hover:text-neutral-8 dark:hover:text-white'
              }`}
            >
              <tab.icon size={15} />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Filters & Grid/List Mode */}
        {activeTab !== 'discovery' && (
          <div className="flex items-center gap-3">
            <select
              value={selectedSubject}
              onChange={e => setSelectedSubject(e.target.value)}
              className={`px-3 h-[34px] text-xs font-bold border rounded-lg outline-none ${
                isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-3 text-neutral-8'
              }`}
            >
              {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select
              value={selectedGrade}
              onChange={e => setSelectedGrade(e.target.value)}
              className={`px-3 h-[34px] text-xs font-bold border rounded-lg outline-none ${
                isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-3 text-neutral-8'
              }`}
            >
              {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
            </select>

            <div className="flex items-center border rounded-lg overflow-hidden border-neutral-3 dark:border-neutral-5">
              <button
                onClick={() => setDisplayMode('grid')}
                className={`p-2 transition-colors ${displayMode === 'grid' ? 'bg-brand-500 text-white' : 'text-neutral-5 hover:bg-neutral-2'}`}
                title="Modo Grade"
              >
                <Grid size={15} />
              </button>
              <button
                onClick={() => setDisplayMode('list')}
                className={`p-2 transition-colors ${displayMode === 'list' ? 'bg-brand-500 text-white' : 'text-neutral-5 hover:bg-neutral-2'}`}
                title="Modo Lista"
              >
                <List size={15} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Main Workspace Body */}
      <div className="flex-1 flex min-h-0 overflow-hidden relative">
        <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-8 pb-32">

          {/* ─── TAB: DESCOBERTA & RECOMENDADOS (Spotify/Netflix style) ─── */}
          {activeTab === 'discovery' && (
            <div className="space-y-8 max-w-7xl mx-auto">
              
              {/* Hero Banner */}
              <div className="p-6 rounded-2xl bg-gradient-to-r from-brand-600 via-brand-500 to-extended-storm-base text-white shadow-xl relative overflow-hidden flex items-center justify-between">
                <div className="space-y-2 max-w-xl z-10">
                  <Chips label="Sugestões Inteligentes da Rede" status="storm" variant="dark" iconLeft={<Sparkles size={12} />} />
                  <h2 className="text-xl font-bold tracking-tight">Tarefas Mais Utilizadas em Sobral neste Semestre</h2>
                  <p className="text-xs text-brand-100 font-medium leading-relaxed">
                    Tarefas curadas com altíssimo índice de discriminação pedagógica e prontas para importação em 1 clique.
                  </p>
                </div>
                <Button
                  variant="tertiary"
                  appearance="solid"
                  size="md"
                  onClick={() => setActiveTab('catalog')}
                  className="shrink-0 z-10"
                >
                  Explorar Todo o Acervo →
                </Button>
              </div>

              {/* Shelf 1: Recomendadas em Alta */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-8 dark:text-white flex items-center gap-2">
                      <Sparkles size={18} className="text-extended-orange-base" />
                      Em Alta na Sua Rede Municipal
                    </h3>
                    <p className="text-xs text-neutral-5 dark:text-neutral-4">Tarefas adicionadas em mais de 50 avaliações recentes.</p>
                  </div>
                  <button onClick={() => setActiveTab('catalog')} className="text-xs font-bold text-brand-500 hover:underline flex items-center gap-1">
                    Ver todas <ChevronRight size={14} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {tasks.slice(0, 3).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onSelect={setSelectedTask}
                      onInsert={onInsertTaskInCurrentTest}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(task.id)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>

              {/* Shelf 2: Tarefas com Suporte em Markdown */}
              <div className="space-y-3 pt-4 border-t border-neutral-2 dark:border-neutral-5">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base font-bold text-neutral-8 dark:text-white flex items-center gap-2">
                      <BookOpen size={18} className="text-extended-storm-base" />
                      Com Textos-Base e Suportes em Markdown
                    </h3>
                    <p className="text-xs text-neutral-5 dark:text-neutral-4">Poemas, fábulas e problemas contextualizados prontos para uso.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tasks.filter(t => t.itemCompostoMarkdown).map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onSelect={setSelectedTask}
                      onInsert={onInsertTaskInCurrentTest}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(task.id)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>

            </div>
          )}

          {/* ─── TAB: CATÁLOGO GERAL ─── */}
          {activeTab === 'catalog' && (
            <div className="max-w-7xl mx-auto space-y-4">
              <div className="flex items-center justify-between text-xs text-neutral-5 dark:text-neutral-4 font-bold uppercase tracking-wider">
                <span>Mostrando {curatedTasks.length} tarefas curadas no acervo</span>
              </div>

              {displayMode === 'grid' ? (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {curatedTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onSelect={setSelectedTask}
                      onInsert={onInsertTaskInCurrentTest}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(task.id)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              ) : (
                <div className="space-y-2">
                  {curatedTasks.map(task => (
                    <TaskRow
                      key={task.id}
                      task={task}
                      onSelect={setSelectedTask}
                      onInsert={onInsertTaskInCurrentTest}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(task.id)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ─── TAB: MEU BANCO & FAVORITAS ─── */}
          {activeTab === 'personal' && (
            <div className="max-w-7xl mx-auto space-y-6">
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-neutral-8 dark:text-white flex items-center gap-2">
                  <Star size={16} className="text-extended-orange-base fill-extended-orange-base" />
                  Minhas Tarefas Favoritas ({favoriteTasks.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onSelect={setSelectedTask}
                      onInsert={onInsertTaskInCurrentTest}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={true}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>

              <div className="space-y-3 pt-6 border-t border-neutral-2 dark:border-neutral-5">
                <h3 className="text-sm font-bold text-neutral-8 dark:text-white flex items-center gap-2">
                  <User size={16} className="text-brand-500" />
                  Tarefas do Meu Banco Pessoal ({personalTasks.length})
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {personalTasks.map(task => (
                    <TaskCard
                      key={task.id}
                      task={task}
                      onSelect={setSelectedTask}
                      onInsert={onInsertTaskInCurrentTest}
                      onToggleFavorite={toggleFavorite}
                      isFavorite={favorites.includes(task.id)}
                      isDarkMode={isDarkMode}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─── TAB: CENTRAL DE CURADORIA ─── */}
          {activeTab === 'curation' && (
            <div className="max-w-4xl mx-auto space-y-6">
              <div className="p-6 rounded-2xl border border-neutral-2 dark:border-neutral-5 bg-neutral-1/40 dark:bg-neutral-6 space-y-4">
                <div className="flex items-center gap-3">
                  <Sparkles size={24} className="text-brand-500" />
                  <div>
                    <h3 className="text-base font-bold text-neutral-8 dark:text-white">Central de Curadoria Pedagógica</h3>
                    <p className="text-xs text-neutral-5 dark:text-neutral-4">Acompanhe o status de homologação das suas tarefas submetidas para o acervo municipal.</p>
                  </div>
                </div>

                <div className="space-y-3 pt-3">
                  {tasks.map(t => (
                    <div key={t.id} className="p-4 rounded-xl border bg-white dark:bg-neutral-7 border-neutral-2 dark:border-neutral-5 flex items-center justify-between">
                      <div>
                        <div className="text-xs font-bold text-neutral-8 dark:text-white">{t.title}</div>
                        <div className="text-[11px] text-neutral-5 mt-0.5">{t.subject} • {t.grade}</div>
                      </div>
                      <Chips
                        label={t.isCurated ? 'Homologada / Curada' : t.status || 'Rascunho Pessoal'}
                        status={t.isCurated ? 'success' : 'orange'}
                        variant="dark"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Task Inspector Drawer */}
        {selectedTask && (
          <TaskInspectorDrawer
            task={selectedTask}
            onClose={() => setSelectedTask(null)}
            onInsertInTest={onInsertTaskInCurrentTest}
            onToggleFavorite={toggleFavorite}
            isFavorite={favorites.includes(selectedTask.id)}
            onSubmitForCuration={setCurationModalTask}
            isDarkMode={isDarkMode}
          />
        )}
      </div>

      {/* Curation Modal */}
      {curationModalTask && (
        <TaskCurationModal
          isOpen={true}
          onClose={() => setCurationModalTask(null)}
          task={curationModalTask}
          onSubmitSuccess={handleSubmitForCurationSuccess}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
