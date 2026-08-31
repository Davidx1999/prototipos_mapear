import React, { useState, useCallback, useEffect } from 'react';
import {
  X, Copy, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle,
  BookOpen, Puzzle, Link2, PenLine, Brain, Target, Play, Calendar,
  Edit3, Trash2, Maximize2, Minimize2, Printer, AppWindow, PanelRight,
  Sparkles, Cpu, MoreVertical, FileText, Info, HelpCircle,
  Building2, Users, GraduationCap
} from 'lucide-react';
import AssessmentPdfModal from './AssessmentPdfModal';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';

const STATUS_HEADER_BG_MAP = {
  'Em edição': 'bg-[#FBBE77]',
  'Programada': 'bg-[#9EC4FA]',
  'Em aplicação': 'bg-[#B3E6F5]',
  'Aplicação encerrada': 'bg-[#FCA5A5]',
  'Em correção': 'bg-[#D9BBFF]',
  'Concluída': 'bg-[#B8EBAD]',
};

const STATUS_CHIP_MAP = {
  'Em edição': 'orange',
  'Programada': 'storm',
  'Em aplicação': 'primary',
  'Aplicação encerrada': 'neutral',
  'Em correção': 'lavender',
  'Concluída': 'success',
};

const TYPE_CHIP_MAP = {
  'Somativa': 'cherry',
  'Diagnóstica': 'oliva',
  'Formativa': 'storm',
};

const COGNITIVE_CHIP_MAP = {
  'Conhecer': 'neutral',
  'Compreender': 'neutral',
  'Aplicar': 'neutral',
  'Analisar': 'neutral',
  'Avaliar': 'neutral',
  'Criar': 'neutral',
};

const STATUS_FLOW = [
  'Em edição',
  'Programada',
  'Em aplicação',
  'Aplicação encerrada',
  'Em correção',
  'Concluída'
];

export default function AvaliacaoInspectorDrawer({
  assessment,
  onClose,
  onDuplicate,
  onEdit,
  onDelete,
  onUpdateStatus,
  isDarkMode,
  setToast,
  isHistoryMode
}) {
  const [activeTab, setActiveTab] = useState('structure');
  const [expandedTests, setExpandedTests] = useState({ 0: true });
  const [drawerWidth, setDrawerWidth] = useState(660);
  const [isResizing, setIsResizing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [displayMode, setDisplayMode] = useState(() => {
    return localStorage.getItem('mapear_assessment_display_mode') || 'modal';
  });
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [isPdfMenuOpen, setIsPdfMenuOpen] = useState(false);
  const [showCopySparkles, setShowCopySparkles] = useState(false);
  const [isMoreMenuOpen, setIsMoreMenuOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem('mapear_assessment_display_mode', displayMode);
  }, [displayMode]);

  const cycleDisplayMode = useCallback(() => {
    setDisplayMode(prev => {
      if (prev === 'modal') return 'fullscreen';
      if (prev === 'fullscreen') return 'sidebar';
      return 'modal';
    });
  }, []);

  // Mouse Drag Resizing Logic for Sidebar
  const startResizing = useCallback((e) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  const stopResizing = useCallback(() => {
    setIsResizing(false);
  }, []);

  const resize = useCallback((e) => {
    if (isResizing) {
      const newWidth = window.innerWidth - e.clientX;
      if (newWidth >= 400 && newWidth <= 900) {
        setDrawerWidth(newWidth);
      }
    }
  }, [isResizing]);

  useEffect(() => {
    if (isResizing) {
      window.addEventListener('mousemove', resize);
      window.addEventListener('mouseup', stopResizing);
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
    } else {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    }
    return () => {
      window.removeEventListener('mousemove', resize);
      window.removeEventListener('mouseup', stopResizing);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
  }, [isResizing, resize, stopResizing]);

  if (!assessment) return null;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(assessment.code);
    setToast && setToast({ type: 'success', message: `Código ${assessment.code} copiado!` });
    setShowCopySparkles(true);
    setTimeout(() => setShowCopySparkles(false), 1500);
  };

  const toggleTest = (idx) => {
    setExpandedTests(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const isTestExpanded = (idx) => expandedTests[idx] !== false;

  const currentStatusIdx = STATUS_FLOW.indexOf(assessment.status);
  const nextStatus = currentStatusIdx >= 0 && currentStatusIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentStatusIdx + 1] : null;
  const prevStatus = currentStatusIdx > 0 ? STATUS_FLOW[currentStatusIdx - 1] : null;

  const statusChip = STATUS_CHIP_MAP[assessment.status] || 'orange';
  const typeChip = TYPE_CHIP_MAP[assessment.type] || 'storm';

  const allItems = [];
  const allTasks = [];
  assessment.testsTree?.forEach(t => t.tasks?.forEach(tf => {
    allTasks.push(tf);
    (tf.items || []).forEach(i => allItems.push(i));
  }));

  const tasksWithCognitive = allTasks.filter(t => t.cognitiveProcess).length;
  const itemsWithSkills = allItems.filter(i => i.skill).length;
  const itemsWithAnswers = allItems.filter(i => i.hasAnswer).length;
  const itemsWithCriteria = allItems.filter(i => i.correctionCriteria).length;
  const itemsWithPerformance = allItems.filter(i => i.performanceLevels || i.alternativeIntentions).length;

  // Diagnostic blockers list with precise item identification (Nielsen #9)
  const preciseBlockers = [];
  if (assessment.testsCount <= 0) preciseBlockers.push('Nenhum Caderno (Teste) cadastrado');
  if (assessment.tasksCount <= 0) preciseBlockers.push('Nenhuma Tarefa associada aos Cadernos');
  if (assessment.itemsCount <= 0) preciseBlockers.push('Nenhum Item cadastrado na avaliação');
  
  // Identify specific items missing data
  allItems.forEach((it, idx) => {
    const itemName = it.title || `Item ${idx + 1}`;
    if (!it.skill) preciseBlockers.push(`${itemName} está sem habilidade BNCC/SAEB associada`);
    if (!it.hasAnswer) preciseBlockers.push(`${itemName} está sem gabarito definido`);
  });

  const blockers = assessment.blockers?.length ? assessment.blockers : preciseBlockers;
  const isBlockedFromAdvancing = (nextStatus === 'Pronta para programar' || nextStatus === 'Programada') && blockers.length > 0;

  const tabs = [
    { id: 'structure', label: 'Hierarquia da Avaliação', count: allItems.length },
    { id: 'pedagogy', label: 'Metadados Pedagógicos', count: allTasks.length },
    { id: 'integrity', label: 'Checklist de Integridade', count: blockers.length > 0 ? blockers.length : null },
    { id: 'classes', label: 'Turmas em Aplicação', count: 8 },
  ];

  const getAsideProps = () => {
    if (displayMode === 'modal') {
      return {
        style: {},
        className: `relative w-full max-w-5xl h-[calc(100vh-120px)] rounded-[8px] border shadow-2xl overflow-hidden font-['Montserrat',sans-serif] ${
          isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
        }`,
        onClick: e => e.stopPropagation()
      };
    }
    if (displayMode === 'fullscreen') {
      return {
        style: { width: '100%' },
        className: `fixed top-[84px] inset-x-0 bottom-0 z-[65] shadow-2xl overflow-hidden font-['Montserrat',sans-serif] ${
          isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
        }`
      };
    }
    return {
      style: { width: drawerWidth },
      className: `absolute right-0 top-0 z-[50] border-l h-full shadow-2xl font-['Montserrat',sans-serif] ${
        isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
      }`
    };
  };

  const asideContent = (
    <aside {...getAsideProps()}>
      {/* Resizer Handle (Sidebar Mode only — posicionado 2px fora da caixa) */}
      {displayMode === 'sidebar' && (
        <div
          onMouseDown={startResizing}
          title="Arraste para ajustar a largura do painel lateral"
          className="absolute top-0 -left-[2px] w-[6px] -translate-x-1/2 h-full cursor-col-resize z-50 group hover:bg-brand-500/30 transition-colors flex items-center justify-center"
        >
          <div className={`w-1 h-12 rounded-full transition-all ${isResizing ? 'bg-brand-500 ring-4 ring-brand-500/20' : 'bg-neutral-3 dark:bg-neutral-6 group-hover:bg-brand-500'}`} />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)}>
          <div className={`max-w-md p-6 rounded-[8px] shadow-2xl border ${isDarkMode ? 'bg-neutral-8 border-neutral-6' : 'bg-white border-neutral-2'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <div className="p-2 rounded-full bg-semantic-error-extraLight text-semantic-error-base shrink-0">
                <AlertTriangle size={20} />
              </div>
              <div>
                <h3 className="font-bold text-sm text-neutral-8 dark:text-white">Excluir Avaliação?</h3>
                <p className="text-xs text-neutral-5 dark:text-neutral-4 mt-1 font-medium leading-relaxed">
                  Tem certeza que deseja mover a avaliação <strong className="text-neutral-8 dark:text-white">"{assessment.title}"</strong> ({assessment.code}) para a lixeira?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="tertiary" appearance="solid" size="xs" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
              <Button variant="destructive" appearance="solid" size="xs" onClick={() => { setConfirmDelete(false); onDelete(assessment.id); }}>Mover para Lixeira</Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col relative">
        <div className="w-full flex flex-col mx-auto" style={{ maxWidth: displayMode === 'fullscreen' ? '85%' : '100%' }}>

          {/* ─── 1. HEADER: Context Code & Grouped Actions Bar ─── */}
          <div className={`p-4 px-6 border-b shrink-0 ${isDarkMode ? 'border-neutral-7 bg-neutral-900/60' : 'border-neutral-2 bg-neutral-50/70'}`}>
            
            {/* Top Row: Context Code (Body S) vs Action Group */}
            <div className="flex items-center justify-between gap-3 mb-3">
              <div className="flex items-center gap-2 truncate">
                <button
                  type="button"
                  className="font-mono text-[14px] leading-[20px] font-bold text-brand-600 dark:text-brand-400 hover:underline inline-flex items-center gap-1.5 cursor-pointer outline-none"
                  onClick={handleCopyCode}
                  title="Clique para copiar o código"
                >
                  <span>{assessment.code}</span>
                  {showCopySparkles ? <CheckCircle2 size={15} className="text-semantic-success-base" /> : <Copy size={13} className="text-neutral-4" />}
                </button>
              </div>

              {/* ─── GROUPED ACTIONS AREA (Separated from Metadata) ─── */}
              <div className="flex items-center gap-1.5 shrink-0">
                {!isHistoryMode && (
                  <Button
                    variant="tertiary"
                    appearance="solid"
                    size="1xs"
                    iconOnly
                    iconLeft={<Edit3 size={15} />}
                    onClick={() => onEdit(assessment)}
                    title="Editar Avaliação"
                  />
                )}

                {/* Advance Status Action */}
                {nextStatus && !isHistoryMode && (
                  <Button
                    variant="primary"
                    appearance="solid"
                    size="1xs"
                    iconRight={<ChevronRight size={14} />}
                    onClick={() => onUpdateStatus(assessment.id, nextStatus)}
                    disabled={isBlockedFromAdvancing}
                    title={isBlockedFromAdvancing ? `Impedido: ${blockers[0]}` : `Avançar para ${nextStatus}`}
                    className="font-bold"
                  >
                    Avançar
                  </Button>
                )}

                {/* PDF Generation Menu */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsPdfMenuOpen(true)}
                  onMouseLeave={() => setIsPdfMenuOpen(false)}
                >
                  <Button
                    variant="tertiary"
                    appearance="solid"
                    size="1xs"
                    iconLeft={<Printer size={15} />}
                    onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                    title="Exportar Cadernos em PDF"
                    className={isPdfMenuOpen ? (isDarkMode ? '!bg-neutral-7' : '!bg-neutral-2') : ''}
                  >
                    PDF
                  </Button>
                  {isPdfMenuOpen && (
                    <div className="absolute right-0 top-full pt-1.5 z-[100]">
                      <div className={`p-1.5 rounded-[8px] shadow-2xl border transition-all flex flex-col min-w-[210px] gap-0.5 ${
                        isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
                      }`}>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-4 px-2 py-1">Exportação</div>
                        <Button
                          variant="tertiary"
                          appearance="ghost"
                          size="1xs"
                          onClick={() => { setIsPdfModalOpen(true); setIsPdfMenuOpen(false); }}
                          className="w-full justify-start !px-2 font-medium"
                        >
                          Avaliação Completa (Todos)
                        </Button>
                        {(assessment.testsTree || []).map((test, idx) => (
                          <Button
                            key={idx}
                            variant="tertiary"
                            appearance="ghost"
                            size="1xs"
                            onClick={() => { setIsPdfModalOpen(true); setIsPdfMenuOpen(false); }}
                            className="w-full justify-start !px-2 text-left font-medium"
                          >
                            <span className="truncate w-full">{test.title}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Display Mode Switcher Menu (Formato Visual com Janelinhas) */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsViewMenuOpen(true)}
                  onMouseLeave={() => setIsViewMenuOpen(false)}
                >
                  <Button
                    variant="tertiary"
                    appearance="solid"
                    size="1xs"
                    iconOnly
                    iconLeft={
                      displayMode === 'modal' ? <AppWindow size={15} /> :
                      displayMode === 'fullscreen' ? <Maximize2 size={15} /> :
                      <PanelRight size={15} />
                    }
                    onClick={cycleDisplayMode}
                    title="Alternar formato de exibição"
                    className={isViewMenuOpen ? (isDarkMode ? '!bg-neutral-7' : '!bg-neutral-2') : ''}
                  />

                  {isViewMenuOpen && (
                    <div className="absolute right-0 top-full pt-1.5 z-[100]">
                      <div className={`p-2.5 rounded-[8px] shadow-2xl border transition-all flex items-center gap-2 ${
                        isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
                      }`}>
                        {[
                          {
                            mode: 'modal',
                            label: 'Modal',
                            svg: (
                              <svg width="68" height="46" viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="52" height="34" rx="4" className="fill-white dark:fill-neutral-8 stroke-neutral-300 dark:stroke-neutral-600" strokeWidth="1.5" />
                                <circle cx="6" cy="6" r="1.5" fill="#F87171" />
                                <circle cx="10.5" cy="6" r="1.5" fill="#FBBF24" />
                                <circle cx="15" cy="6" r="1.5" fill="#34D399" />
                                <rect x="6" y="11" width="42" height="19" rx="3" className="fill-neutral-200 dark:fill-neutral-700 stroke-neutral-300 dark:stroke-neutral-600" strokeWidth="1" />
                              </svg>
                            )
                          },
                          {
                            mode: 'fullscreen',
                            label: 'Tela cheia',
                            svg: (
                              <svg width="68" height="46" viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="52" height="34" rx="4" className="fill-white dark:fill-neutral-8 stroke-neutral-300 dark:stroke-neutral-600" strokeWidth="1.5" />
                                <circle cx="6" cy="6" r="1.5" fill="#F87171" />
                                <circle cx="10.5" cy="6" r="1.5" fill="#FBBF24" />
                                <circle cx="15" cy="6" r="1.5" fill="#34D399" />
                                <rect x="2" y="11" width="50" height="23" rx="0" className="fill-neutral-200 dark:fill-neutral-700 stroke-neutral-300 dark:stroke-neutral-600" strokeWidth="1" />
                              </svg>
                            )
                          },
                          {
                            mode: 'sidebar',
                            label: 'Barra lateral',
                            svg: (
                              <svg width="68" height="46" viewBox="0 0 54 36" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="1" y="1" width="52" height="34" rx="4" className="fill-white dark:fill-neutral-8 stroke-neutral-300 dark:stroke-neutral-600" strokeWidth="1.5" />
                                <circle cx="6" cy="6" r="1.5" fill="#F87171" />
                                <circle cx="10.5" cy="6" r="1.5" fill="#FBBF24" />
                                <circle cx="15" cy="6" r="1.5" fill="#34D399" />
                                <rect x="32" y="11" width="20" height="23" rx="0" className="fill-neutral-200 dark:fill-neutral-700 stroke-neutral-300 dark:stroke-neutral-600" strokeWidth="1" />
                              </svg>
                            )
                          }
                        ].map(item => {
                          const isSelected = displayMode === item.mode;
                          return (
                            <button
                              key={item.mode}
                              onClick={() => { setDisplayMode(item.mode); setIsViewMenuOpen(false); }}
                              className={`flex flex-col items-center gap-1.5 p-2 rounded-[6px] transition-all border outline-none cursor-pointer ${
                                isSelected
                                  ? (isDarkMode ? 'bg-brand-900/30 border-brand-500/50 text-brand-400' : 'bg-brand-50/70 border-brand-300 text-brand-600 shadow-sm')
                                  : (isDarkMode ? 'border-transparent text-neutral-4 hover:bg-neutral-7' : 'border-transparent text-neutral-6 hover:bg-neutral-1')
                              }`}
                            >
                              <div className="shrink-0">{item.svg}</div>
                              <span className={`text-[11px] font-bold ${
                                isSelected
                                  ? (isDarkMode ? 'text-brand-400 font-bold' : 'text-brand-600 font-bold')
                                  : 'text-neutral-6 dark:text-neutral-3'
                              }`}>
                                {item.label}
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* More Options Menu */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsMoreMenuOpen(true)}
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                >
                  <Button
                    variant="tertiary"
                    appearance="solid"
                    size="1xs"
                    iconOnly
                    iconLeft={<MoreVertical size={15} />}
                    title="Mais opções"
                    className={isMoreMenuOpen ? (isDarkMode ? '!bg-neutral-7' : '!bg-neutral-2') : ''}
                  />
                  {isMoreMenuOpen && (
                    <div className="absolute right-0 top-full pt-1.5 z-[100]">
                      <div className={`p-1.5 rounded-[8px] shadow-2xl border transition-all flex flex-col w-36 gap-0.5 ${
                        isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
                      }`}>
                        <Button
                          variant="tertiary"
                          appearance="ghost"
                          size="1xs"
                          iconLeft={<Copy size={13} />}
                          onClick={() => { onDuplicate(assessment); setIsMoreMenuOpen(false); }}
                          className="w-full justify-start !px-2 font-medium"
                        >
                          Duplicar
                        </Button>
                        {!isHistoryMode && (
                          <Button
                            variant="tertiary"
                            appearance="ghost"
                            size="1xs"
                            iconLeft={<Trash2 size={13} className="text-semantic-error-base" />}
                            onClick={() => { setConfirmDelete(true); setIsMoreMenuOpen(false); }}
                            className="w-full justify-start !px-2 text-semantic-error-base hover:!bg-semantic-error-extraLight font-medium"
                          >
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <div className="h-5 w-px bg-neutral-3 dark:bg-neutral-6 mx-0.5" />

                <Button
                  variant="tertiary"
                  appearance="ghost"
                  size="1xs"
                  iconOnly
                  iconLeft={<X size={15} />}
                  onClick={onClose}
                  title="Fechar (Esc)"
                />
              </div>
            </div>

            {/* Assessment Title */}
            <h3 className="font-bold text-base text-neutral-8 dark:text-white leading-snug">
              {assessment.title}
            </h3>

            {/* ─── 2. ASSESSMENT SUMMARY — Vertical Key-Value List ─── */}
            <div className="mt-4 space-y-0 text-xs">

              {/* Row: Status */}
              <div className="flex items-center py-2 border-b border-neutral-2/40 dark:border-neutral-7/40">
                <div className="w-40 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold shrink-0">
                  <Play size={13} className="text-brand-500" />
                  <span>Status</span>
                </div>
                <div className="flex-1">
                  <span className={`inline-flex items-center px-3 py-1 rounded-[6px] text-xs font-bold text-black ${
                    STATUS_HEADER_BG_MAP[assessment.status] || 'bg-neutral-200 text-black'
                  }`}>
                    {assessment.status}
                  </span>
                </div>
              </div>

              {/* Row: Responsável */}
              <div className="flex items-center py-2 border-b border-neutral-2/40 dark:border-neutral-7/40">
                <div className="w-40 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold shrink-0">
                  <Brain size={13} className="text-neutral-5" />
                  <span>Responsável</span>
                </div>
                <div className="flex items-center gap-1.5 text-neutral-8 dark:text-neutral-2 font-semibold flex-1">
                  <div className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold shrink-0">
                    {(assessment.owner || 'P')[0]}
                  </div>
                  <span>{assessment.owner || 'Não atribuído'}</span>
                </div>
              </div>

              {/* Row: Período & Prazos */}
              <div className="flex items-center py-2 border-b border-neutral-2/40 dark:border-neutral-7/40">
                <div className="w-40 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold shrink-0">
                  <Calendar size={13} className="text-neutral-5" />
                  <span>Período & Prazos</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-neutral-8 dark:text-neutral-2 font-semibold flex-1">
                  <span>{assessment.startDate && assessment.endDate ? `${assessment.startDate} a ${assessment.endDate}` : assessment.schoolYear}</span>
                  {assessment.correctionDeadline && (
                    <span className="text-neutral-5 font-medium">· Correção até {assessment.correctionDeadline}</span>
                  )}
                </div>
              </div>

              {/* Row: Natureza & Escala */}
              <div className="flex items-center py-2 border-b border-neutral-2/40 dark:border-neutral-7/40">
                <div className="w-40 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold shrink-0">
                  <Target size={13} className="text-neutral-5" />
                  <span>Natureza & Escala</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap flex-1">
                  <Chips label={assessment.type} status={typeChip} variant="stroked" className="!text-neutral-7 dark:!text-neutral-2" />
                  {assessment.scale && (
                    <span className="text-neutral-8 dark:text-neutral-2 font-semibold">{assessment.scale === 'larga' ? 'Larga escala' : 'Pequena escala'}</span>
                  )}
                </div>
              </div>

              {/* Row: Aplicação / Correção */}
              <div className="flex items-center py-2 border-b border-neutral-2/40 dark:border-neutral-7/40">
                <div className="w-40 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold shrink-0">
                  <Cpu size={13} className="text-neutral-5" />
                  <span>Aplicação / Correção</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-neutral-8 dark:text-neutral-2 font-semibold flex-1">
                  <span>{assessment.correctionMethod || 'Correção Manual'}</span>
                  <span className="text-neutral-4">·</span>
                  <span className="text-neutral-5 font-medium">{assessment.applicationMode || 'Impressa'}</span>
                </div>
              </div>
            </div>
          </div>

          {/* ─── 3. TABS: MAPEAR Standard Tabs ─── */}
          <div className={`flex border-b shrink-0 px-6 gap-6 ${isDarkMode ? 'border-neutral-7 bg-neutral-900/30' : 'border-neutral-2 bg-white'}`}>
            {tabs.map(tab => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-3 text-xs font-semibold transition-all border-b-2 flex items-center gap-1.5 outline-none cursor-pointer ${
                    isActive
                      ? 'border-brand-500 text-brand-600 dark:text-brand-400 font-bold'
                      : 'border-transparent text-neutral-5 dark:text-neutral-4 hover:text-neutral-7 dark:hover:text-neutral-2'
                  }`}
                >
                  <span>{tab.label}</span>
                  {tab.count !== null && tab.count !== undefined && (
                    <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400 font-bold'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-5'
                    }`}>
                      {tab.count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* ─── 4. TAB BODY (Scrollable Container) ─── */}
          <div className="flex-1 p-6 space-y-5 pb-20">

            {/* ════ TAB 1: Hierarquia da Avaliação ════ */}
            {activeTab === 'structure' && (
              <div className="space-y-5">

                {/* ─── Status Alerts & Diagnostic Guidance (Nielsen #1, #9) ─── */}
                <div className="space-y-2.5">
                  {blockers.length > 0 ? (
                    <div className="p-3.5 rounded-[8px] bg-semantic-error-extraLight/40 dark:bg-semantic-error-dark/20 border border-semantic-error-light/80 space-y-1.5">
                      <div className="text-xs font-bold text-semantic-error-dark dark:text-semantic-error-light flex items-center gap-1.5">
                        <AlertTriangle size={14} className="text-semantic-error-base shrink-0" />
                        <span>{blockers.length} impedimento(s) para finalizar a edição e avançar a avaliação:</span>
                      </div>
                      <ul className="pl-5 list-disc space-y-0.5 text-xs text-semantic-error-dark dark:text-semantic-error-light font-medium">
                        {blockers.map((b, idx) => (
                          <li key={idx}>{b}</li>
                        ))}
                      </ul>
                      {assessment.nextStep && (
                        <div className="pt-1 text-[11px] text-neutral-6 dark:text-neutral-4 font-semibold flex items-center gap-1.5">
                          <Info size={13} className="text-neutral-5 shrink-0" />
                          <span><strong>Ação recomendada:</strong> {assessment.nextStep}</span>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-3 rounded-[8px] bg-semantic-success-extraLight/40 dark:bg-semantic-success-dark/20 border border-semantic-success-light/80 text-xs font-semibold text-semantic-success-dark dark:text-semantic-success-light flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={15} className="text-semantic-success-base shrink-0" />
                        <span>Avaliação consistente e validada pedagogicamente. Pronta para alocação.</span>
                      </div>
                      <span className="text-[11px] font-normal text-neutral-6 dark:text-neutral-3">Sem pendências</span>
                    </div>
                  )}
                </div>

                {/* ─── Unified Metrics Cards (Same Design System Surface & Family) ─── */}
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { label: 'Testes (Cadernos)', count: assessment.testsCount, icon: <BookOpen size={16} className="text-neutral-5 dark:text-neutral-4" /> },
                    { label: 'Tarefas Cadastradas', count: assessment.tasksCount, icon: <Puzzle size={16} className="text-neutral-5 dark:text-neutral-4" /> },
                    { label: 'Itens de Avaliação', count: assessment.itemsCount, icon: <PenLine size={16} className="text-neutral-5 dark:text-neutral-4" /> },
                  ].map((metric, mIdx) => (
                    <div
                      key={mIdx}
                      className={`p-3.5 rounded-[8px] border transition-all ${
                        isDarkMode 
                          ? 'bg-neutral-800/60 border-neutral-7 text-white' 
                          : 'bg-neutral-50/80 border-neutral-2 text-neutral-8'
                      }`}
                    >
                      <div className="flex items-center justify-between text-neutral-5 dark:text-neutral-4 mb-1">
                        <span className="text-[11px] font-medium">{metric.label}</span>
                        {metric.icon}
                      </div>
                      <div className="text-xl font-bold text-neutral-8 dark:text-white">
                        {metric.count}
                      </div>
                    </div>
                  ))}
                </div>

                {/* ─── Composition Tree (Clean, Structural Hierarchy without rainbow clutter) ─── */}
                <div className="space-y-3 pt-1">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-6 dark:text-neutral-3 uppercase tracking-wider">
                      Composição dos Cadernos e Itens
                    </h4>
                    <span className="text-[11px] text-neutral-4">
                      Clique para expandir/recolher
                    </span>
                  </div>

                  <div className="space-y-3">
                    {assessment.testsTree?.map((teste, tIdx) => {
                      const isExpanded = isTestExpanded(tIdx);
                      return (
                        <div
                          key={tIdx}
                          className={`rounded-[8px] border transition-all overflow-hidden ${
                            isDarkMode ? 'border-neutral-7 bg-neutral-900/40' : 'border-neutral-2 bg-white'
                          }`}
                        >
                          {/* LEVEL 1: TESTE / CADERNO (Strong Visual Weight) */}
                          <div
                            onClick={() => toggleTest(tIdx)}
                            className={`p-3 px-4 flex items-center justify-between cursor-pointer select-none transition-colors ${
                              isDarkMode ? 'hover:bg-neutral-800/50 bg-neutral-800/20' : 'hover:bg-neutral-50 bg-neutral-50/50'
                            }`}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <span className="text-neutral-4 transition-transform duration-200">
                                {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                              </span>
                              <BookOpen size={16} className="text-brand-500 shrink-0" />
                              <span className="font-bold text-xs text-neutral-8 dark:text-white truncate">
                                {teste.title}
                              </span>
                            </div>
                            <div className="flex items-center gap-2 text-xs font-medium text-neutral-5 dark:text-neutral-4 shrink-0">
                              {teste.subject && <span>{teste.subject}</span>}
                              <span>•</span>
                              <span>{teste.tasks?.length || 0} tarefas</span>
                            </div>
                          </div>

                          {/* LEVEL 2 & 3: TAREFAS E ITENS */}
                          {isExpanded && (
                            <div className="p-3.5 pt-2 pl-6 space-y-3 border-t border-neutral-100 dark:border-neutral-800">
                              {teste.tasks?.map((tf, tfIdx) => (
                                <div key={tfIdx} className="space-y-2.5">

                                  {/* LEVEL 2: TAREFA */}
                                  <div className={`p-3 rounded-[6px] border ${
                                    isDarkMode ? 'bg-neutral-800/40 border-neutral-7' : 'bg-neutral-50/40 border-neutral-2'
                                  }`}>
                                    <div className="flex items-center justify-between gap-2 flex-wrap">
                                      <div className="flex items-center gap-2 font-bold text-xs text-neutral-8 dark:text-white">
                                        <Puzzle size={14} className="text-neutral-5" />
                                        <span>{tf.title}</span>
                                      </div>
                                      <div className="flex items-center gap-1.5 text-[11px] text-neutral-5">
                                        {tf.cognitiveProcess && (
                                          <Chips label={`Cognitivo: ${tf.cognitiveProcess}`} status="neutral" variant="stroked" />
                                        )}
                                        <span className="font-medium">• {tf.items?.length || tf.itemsCount || 0} itens</span>
                                        {tf.responseType && <span className="font-medium">• {tf.responseType}</span>}
                                      </div>
                                    </div>

                                    {/* LEVEL 3: ITEM COMPOSTO (Optional Stimulus Anchor) */}
                                    {tf.hasItemComposto && (
                                      <div className="mt-2 ml-4 p-2 px-2.5 rounded-[4px] bg-neutral-100 dark:bg-neutral-800/80 border border-neutral-200 dark:border-neutral-700 text-xs flex items-center gap-2 text-neutral-7 dark:text-neutral-3">
                                        <Link2 size={13} className="text-neutral-5 shrink-0" />
                                        <span className="font-medium">
                                          Item Composto · <strong className="font-semibold text-neutral-900 dark:text-white">{tf.itemCompostoTitle}</strong>
                                        </span>
                                      </div>
                                    )}

                                    {/* LEVEL 4: ITENS */}
                                    <div className="mt-2.5 space-y-1.5 pl-4">
                                      {(tf.items || []).map((item, iIdx) => {
                                        const isAnswerOk = item.hasAnswer;
                                        return (
                                          <div
                                            key={iIdx}
                                            className={`p-2.5 rounded-[6px] border transition-colors flex items-center justify-between gap-3 ${
                                              isDarkMode 
                                                ? 'bg-neutral-900/60 border-neutral-7 hover:border-neutral-6' 
                                                : 'bg-white border-neutral-200/80 hover:border-neutral-300'
                                            }`}
                                          >
                                            <div className="min-w-0 flex-1 flex items-start gap-2">
                                              <div className="pt-0.5">
                                                <PenLine size={13} className="text-neutral-4" />
                                              </div>
                                              <div className="min-w-0 space-y-0.5">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                  <span className="font-bold text-xs text-neutral-8 dark:text-white">
                                                    {item.title}
                                                  </span>
                                                  {item.skill && (
                                                    <span className="text-[10px] font-mono font-bold px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                                                      {item.skill}
                                                    </span>
                                                  )}
                                                  {item.difficulty && (
                                                    <span className="text-[10px] text-neutral-4">
                                                      Nível: {item.difficulty}
                                                    </span>
                                                  )}
                                                </div>
                                                {item.skillDesc && (
                                                  <p className="text-[11px] text-neutral-6 dark:text-neutral-4 line-clamp-1">
                                                    {item.skillDesc}
                                                  </p>
                                                )}
                                              </div>
                                            </div>

                                            {/* Item Status — Gabarito (Discrete, Neutral Surface) */}
                                            <div className="shrink-0 flex items-center gap-1 text-[10px] font-semibold">
                                              {isAnswerOk ? (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                                                  <CheckCircle2 size={11} className="text-semantic-success-base" />
                                                  Gabarito definido
                                                </span>
                                              ) : (
                                                <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 text-neutral-700 dark:text-neutral-300">
                                                  <AlertTriangle size={11} className="text-semantic-caution-base" />
                                                  Gabarito pendente
                                                </span>
                                              )}
                                            </div>
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* ════ TAB 2: Metadados Pedagógicos ════ */}
            {activeTab === 'pedagogy' && (
              <div className="space-y-5">
                {/* Cognitive Distribution */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-8 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2.5">
                    <Brain size={15} className="text-brand-500" />
                    Processos Cognitivos Mapeados nas Tarefas
                  </h4>
                  <div className="space-y-2">
                    {allTasks.map((tf, idx) => (
                      <div
                        key={idx}
                        className={`p-3 rounded-[8px] border flex items-center justify-between ${
                          isDarkMode ? 'bg-neutral-800/40 border-neutral-7' : 'bg-neutral-50/50 border-neutral-2'
                        }`}
                      >
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <Puzzle size={14} className="text-neutral-5 shrink-0" />
                          <span className="text-xs font-bold text-neutral-8 dark:text-white truncate">{tf.title}</span>
                        </div>
                        {tf.cognitiveProcess ? (
                          <Chips label={tf.cognitiveProcess} status="neutral" variant="stroked" />
                        ) : (
                          <Chips label="Processo pendente" status="neutral" variant="stroked" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Skills and Matrix Details */}
                <div>
                  <h4 className="text-xs font-bold text-neutral-8 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-2.5">
                    <Target size={15} className="text-brand-500" />
                    Matriz de Habilidades BNCC & Sentenças Descritoras
                  </h4>
                  <div className="space-y-2.5">
                    {allItems.map((item, idx) => (
                      <div
                        key={idx}
                        className={`p-3.5 rounded-[8px] border space-y-2 ${
                          isDarkMode ? 'bg-neutral-800/40 border-neutral-7' : 'bg-white border-neutral-2'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-8 dark:text-white flex items-center gap-1.5">
                            <PenLine size={13} className="text-neutral-4" />
                            {item.title}
                          </span>
                          {item.skill ? (
                            <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-700 dark:text-neutral-300 border border-neutral-200 dark:border-neutral-700">
                              {item.skill}
                            </span>
                          ) : (
                            <Chips label="Sem habilidade" status="neutral" variant="stroked" />
                          )}
                        </div>

                        {item.skillDesc && (
                          <p className="text-xs text-neutral-6 dark:text-neutral-3 leading-relaxed">
                            <strong>Habilidade:</strong> {item.skillDesc}
                          </p>
                        )}
                        {item.expectation && (
                          <p className="text-xs text-neutral-6 dark:text-neutral-3">
                            <strong>Expectativa de Aprendizagem:</strong> {item.expectation}
                          </p>
                        )}
                        {item.descriptor && (
                          <div className="text-xs font-mono bg-neutral-100 dark:bg-neutral-900 p-2 rounded-[4px] border border-neutral-200 dark:border-neutral-800 text-neutral-700 dark:text-neutral-300 font-semibold">
                            {item.descriptor}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ════ TAB 3: Checklist de Integridade (Prevenção de Erros / Nielsen #5) ════ */}
            {activeTab === 'integrity' && (
              <div className="space-y-4">
                <div className="p-3 rounded-[8px] bg-neutral-100 dark:bg-neutral-800/60 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-6 dark:text-neutral-3 font-medium flex items-center gap-2">
                  <Info size={14} className="text-brand-500 shrink-0" />
                  <span>Verificação automática de integridade pedagógica, técnica e operacional da avaliação antes de homologar e programar.</span>
                </div>

                <div className="space-y-2.5">
                  {[
                    { ok: assessment.testsCount > 0, label: 'Pelo menos 1 Caderno (Teste) cadastrado', desc: `${assessment.testsCount} caderno(s) encontrado(s)` },
                    { ok: assessment.tasksCount > 0, label: 'Tarefas associadas aos Cadernos', desc: `${assessment.tasksCount} tarefa(s) cadastrada(s)` },
                    { ok: assessment.itemsCount > 0, label: 'Itens distribuídos nas Tarefas', desc: `${assessment.itemsCount} item(ns) encontrado(s)` },
                    { ok: tasksWithCognitive === allTasks.length && allTasks.length > 0, label: 'Todas as Tarefas com Processo Cognitivo definido', desc: `${tasksWithCognitive}/${allTasks.length} tarefas com processo` },
                    { ok: itemsWithSkills === allItems.length && allItems.length > 0, label: 'Todos os Itens mapeados com Habilidades BNCC/SAEB', desc: `${itemsWithSkills}/${allItems.length} itens parametrizados` },
                    { ok: itemsWithAnswers === allItems.length && allItems.length > 0, label: 'Gabarito 100% preenchido', desc: `${itemsWithAnswers}/${allItems.length} gabaritos cadastrados` },
                  ].map((check, idx) => (
                    <div
                      key={idx}
                      className={`p-3.5 rounded-[8px] border flex items-start gap-3 transition-colors ${
                        check.ok
                          ? 'bg-semantic-success-extraLight/40 border-semantic-success-light/80 dark:bg-semantic-success-dark/20'
                          : 'bg-semantic-error-extraLight/40 border-semantic-error-light/80 dark:bg-semantic-error-dark/20'
                      }`}
                    >
                      {check.ok ? (
                        <CheckCircle2 size={18} className="text-semantic-success-base shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle size={18} className="text-semantic-error-base shrink-0 mt-0.5" />
                      )}
                      <div>
                        <div className={`text-xs font-bold ${
                          check.ok ? 'text-semantic-success-dark dark:text-semantic-success-light' : 'text-semantic-error-dark dark:text-semantic-error-light'
                        }`}>
                          {check.label}
                        </div>
                        <div className="text-xs text-neutral-5 dark:text-neutral-4 mt-0.5 font-medium">
                          {check.desc}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ════ TAB 4: Turmas em Aplicação ════ */}
            {activeTab === 'classes' && (
              <div className="space-y-5">
                {/* Resumo de Aplicação / Escopo Geográfico e Institucional */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className={`p-3.5 rounded-[8px] border ${isDarkMode ? 'bg-neutral-800/60 border-neutral-7' : 'bg-neutral-50/80 border-neutral-2'}`}>
                    <div className="flex items-center justify-between text-neutral-5 dark:text-neutral-4 mb-1">
                      <span className="text-[11px] font-medium">Escolas Participantes</span>
                      <Building2 size={16} className="text-neutral-5 dark:text-neutral-4" />
                    </div>
                    <div className="text-xl font-bold text-neutral-8 dark:text-white">4 Escolas</div>
                    <div className="text-[11px] text-neutral-5 mt-0.5">{assessment.municipality || 'Sobral'} • Rede Municipal</div>
                  </div>

                  <div className={`p-3.5 rounded-[8px] border ${isDarkMode ? 'bg-neutral-800/60 border-neutral-7' : 'bg-neutral-50/80 border-neutral-2'}`}>
                    <div className="flex items-center justify-between text-neutral-5 dark:text-neutral-4 mb-1">
                      <span className="text-[11px] font-medium">Turmas Alocadas</span>
                      <Users size={16} className="text-neutral-5 dark:text-neutral-4" />
                    </div>
                    <div className="text-xl font-bold text-neutral-8 dark:text-white">8 Turmas</div>
                    <div className="text-[11px] text-neutral-5 mt-0.5">{assessment.grade || '5º Ano - Ensino Fundamental'}</div>
                  </div>

                  <div className={`p-3.5 rounded-[8px] border ${isDarkMode ? 'bg-neutral-800/60 border-neutral-7' : 'bg-neutral-50/80 border-neutral-2'}`}>
                    <div className="flex items-center justify-between text-neutral-5 dark:text-neutral-4 mb-1">
                      <span className="text-[11px] font-medium">Estudantes Previstos</span>
                      <GraduationCap size={16} className="text-neutral-5 dark:text-neutral-4" />
                    </div>
                    <div className="text-xl font-bold text-neutral-8 dark:text-white">246 Estudantes</div>
                    <div className="text-[11px] text-neutral-5 mt-0.5">Folhas HTR geradas</div>
                  </div>
                </div>

                {/* Lista de Turmas com Status de Aplicação */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-neutral-6 dark:text-neutral-3 uppercase tracking-wider">
                      Detalhamento por Escola e Turma
                    </h4>
                    <span className="text-[11px] text-neutral-4 font-medium">
                      Visão Pedagógica & Gestão de Rede
                    </span>
                  </div>

                  <div className="space-y-2">
                    {[
                      { school: 'EMEF Dom José Tupinambá da Frota', code: 'ESC-001', classRoom: '5º Ano A', shift: 'Manhã', students: 32, teacher: 'Prof. Carlos Eduardo', status: 'Em aplicação', printed: true },
                      { school: 'EMEF Dom José Tupinambá da Frota', code: 'ESC-001', classRoom: '5º Ano B', shift: 'Tarde', students: 30, teacher: 'Profª. Maria Helena', status: 'Em aplicação', printed: true },
                      { school: 'EMEF Maria do Carmo de Andrade', code: 'ESC-002', classRoom: '5º Ano A', shift: 'Manhã', students: 28, teacher: 'Prof. Lucas Mendes', status: 'Programada', printed: true },
                      { school: 'EMEF Maria do Carmo de Andrade', code: 'ESC-002', classRoom: '5º Ano B', shift: 'Tarde', students: 31, teacher: 'Profª. Fernanda Lima', status: 'Programada', printed: false },
                      { school: 'EMEF Vicente Antenor Ferreira Gomes', code: 'ESC-003', classRoom: '5º Ano A', shift: 'Manhã', students: 34, teacher: 'Prof. Ricardo Santos', status: 'Em aplicação', printed: true },
                      { school: 'EMEF Vicente Antenor Ferreira Gomes', code: 'ESC-003', classRoom: '5º Ano B', shift: 'Tarde', students: 29, teacher: 'Profª. Patrícia Gomes', status: 'Programada', printed: true },
                      { school: 'EMEF Professora Elza Goersch', code: 'ESC-004', classRoom: '5º Ano A', shift: 'Manhã', students: 30, teacher: 'Prof. André Silva', status: 'Concluída', printed: true },
                      { school: 'EMEF Professora Elza Goersch', code: 'ESC-004', classRoom: '5º Ano B', shift: 'Tarde', students: 32, teacher: 'Profª. Camila Nogueira', status: 'Concluída', printed: true },
                    ].map((item, cIdx) => (
                      <div
                        key={cIdx}
                        className={`p-3.5 rounded-[8px] border transition-colors flex items-center justify-between gap-4 ${
                          isDarkMode ? 'bg-neutral-800/40 border-neutral-7 hover:border-neutral-6' : 'bg-white border-neutral-2 hover:border-neutral-3'
                        }`}
                      >
                        <div className="min-w-0 flex-1 space-y-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-xs text-neutral-8 dark:text-white truncate">
                              {item.school}
                            </span>
                            <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-6 dark:text-neutral-4 border border-neutral-200 dark:border-neutral-700">
                              {item.classRoom}
                            </span>
                            <span className="text-[11px] text-neutral-4">
                              Turno {item.shift}
                            </span>
                          </div>

                          <div className="text-[11px] text-neutral-5 dark:text-neutral-4 flex items-center gap-2 flex-wrap">
                            <span>Docente: <strong className="text-neutral-7 dark:text-neutral-3">{item.teacher}</strong></span>
                            <span>•</span>
                            <span>{item.students} estudantes alocados</span>
                            <span>•</span>
                            <span>Folhas HTR: {item.printed ? 'Impressas' : 'Pendente impressão'}</span>
                          </div>
                        </div>

                        <div className="shrink-0 flex items-center gap-2">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-[4px] text-[11px] font-bold text-black ${
                            STATUS_HEADER_BG_MAP[item.status] || 'bg-neutral-200 text-black'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {displayMode === 'modal' ? (
        <div
          className="fixed top-[84px] inset-x-0 bottom-0 z-[70] flex justify-center bg-black/60 backdrop-blur-sm px-4 pt-[20px] md:px-8 animate-in fade-in duration-200"
          onClick={onClose}
        >
          {asideContent}
        </div>
      ) : (
        asideContent
      )}

      {isPdfModalOpen && (
        <AssessmentPdfModal
          assessment={assessment}
          onClose={() => setIsPdfModalOpen(false)}
          isDarkMode={isDarkMode}
          allItems={allItems}
          allTasks={allTasks}
        />
      )}
    </>
  );
}
