import React, { useState, useCallback, useEffect } from 'react';
import { X, Copy, ChevronRight, ChevronDown, CheckCircle2, AlertTriangle, BookOpen, Puzzle, Link2, PenLine, Brain, Target, Play, Calendar, Edit3, Trash2, Maximize2, Minimize2, Printer, AppWindow, PanelRight, Sparkles, Cpu, MoreVertical } from 'lucide-react';
import AssessmentPdfModal from './AssessmentPdfModal';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';

/**
 * AvaliacaoInspectorDrawer — Painel Inspector Lateral com Redimensionamento por Mouse (col-resize)
 * 
 * Requisitos atendidos:
 * - Redimensionamento manual via mouse (largura dinâmica entre 380px e 850px)
 * - Scroll vertical totalmente livre e fluido (`min-h-0 overflow-y-auto pb-24`)
 * - Botão de Editar Avaliação
 * - Botão de Excluir Avaliação com confirmação
 */

const STATUS_CHIP_MAP = {
  'Em edição': 'orange',
  'Programada': 'storm',
  'Em aplicação': 'primary',
  'Em correção': 'lavender',
  'Concluída': 'success',
};

const TYPE_CHIP_MAP = {
  'Somativa': 'cherry',
  'Diagnóstica': 'oliva',
  'Formativa': 'storm',
};

const COGNITIVE_CHIP_MAP = {
  'Conhecer': 'oliva',
  'Compreender': 'oliva',
  'Aplicar': 'orange',
  'Analisar': 'storm',
  'Avaliar': 'lavender',
  'Criar': 'cherry',
};

const STATUS_FLOW = ['Em edição', 'Programada', 'Em aplicação', 'Em correção', 'Concluída'];

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
  const [expandedTests, setExpandedTests] = useState({});
  const [drawerWidth, setDrawerWidth] = useState(640);
  const [isResizing, setIsResizing] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [displayMode, setDisplayMode] = useState(() => {
    return localStorage.getItem('mapear_assessment_display_mode') || 'sidebar';
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
      if (prev === 'sidebar') return 'fullscreen';
      if (prev === 'fullscreen') return 'modal';
      return 'sidebar';
    });
  }, []);

  // Mouse Drag Resizing Logic
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
      if (newWidth >= 380 && newWidth <= 850) {
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
  const nextStatus = currentStatusIdx < STATUS_FLOW.length - 1 ? STATUS_FLOW[currentStatusIdx + 1] : null;
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
  const blockers = assessment.blockers?.length ? assessment.blockers : [
    assessment.testsCount <= 0 && 'nenhum teste criado',
    assessment.tasksCount <= 0 && 'tarefa sem itens',
    assessment.itemsCount <= 0 && 'nenhum item criado',
    itemsWithSkills < allItems.length && 'item sem habilidade associada',
    itemsWithCriteria < allItems.length && 'item sem critérios de correção',
    assessment.startDate && assessment.endDate && new Date(assessment.endDate) < new Date(assessment.startDate) && 'prazo inválido',
  ].filter(Boolean);

  const tabs = [
    { id: 'structure', label: 'Hierarquia da Avaliação' },
    { id: 'pedagogy', label: 'Metadados Pedagógicos' },
    { id: 'integrity', label: 'Checklist de Integridade' },
  ];

  const getAsideProps = () => {
    if (displayMode === 'modal') {
      return {
        style: {},
        className: `relative w-full max-w-5xl h-[calc(100vh-132px)] rounded-[8px] border shadow-2xl overflow-hidden font-['Montserrat',sans-serif] ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-7'
          }`,
        onClick: e => e.stopPropagation()
      };
    }
    if (displayMode === 'fullscreen') {
      return {
        style: { width: '100%' },
        className: `fixed top-[84px] inset-x-0 bottom-0 z-[65] shadow-2xl overflow-hidden font-['Montserrat',sans-serif] ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-7'
          }`
      };
    }
    return {
      style: { width: drawerWidth },
      className: `absolute right-0 top-0 z-[50] border-l h-full shadow-2xl overflow-hidden font-['Montserrat',sans-serif] ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-7'
        }`
    };
  };

  const asideContent = (
    <aside {...getAsideProps()}>
      {/* Resizer Handle — Mouse Drag */}
      {displayMode === 'sidebar' && (
        <div
          onMouseDown={startResizing}
          title="Arraste para ajustar a largura do painel lateral"
          className="absolute top-0 left-0 w-2 h-full cursor-col-resize z-50 group hover:bg-brand-500/30 transition-colors flex items-center justify-center"
        >
          <div className={`w-1 h-12 rounded-full transition-all ${isResizing ? 'bg-brand-500 ring-4 ring-brand-500/20' : 'bg-neutral-3 dark:bg-neutral-5 group-hover:bg-brand-500'}`} />
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmDelete && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setConfirmDelete(false)}>
          <div className={`max-w-md p-6 rounded-[8px] shadow-2xl border ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={24} className="text-semantic-error-base shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-neutral-8 dark:text-white">Excluir Avaliação?</h3>
                <p className="text-xs text-neutral-5 dark:text-neutral-4 mt-1 font-medium leading-relaxed">
                  Tem certeza que deseja excluir permanentemente a avaliação <strong className="text-neutral-8 dark:text-white">"{assessment.title}"</strong> ({assessment.code})? Esta ação não poderá ser desfeita.
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="tertiary" appearance="solid" size="sm" onClick={() => setConfirmDelete(false)}>Cancelar</Button>
              <Button variant="primary" appearance="solid" size="sm" onClick={() => { setConfirmDelete(false); onDelete(assessment.id); }}>Sim, Excluir</Button>
            </div>
          </div>
        </div>
      )}

      <div className="w-full h-full overflow-y-auto overflow-x-hidden flex flex-col relative">
        <div className="w-full flex flex-col mx-auto" style={{ maxWidth: displayMode === 'fullscreen' ? '80%' : '100%' }}>

          {/* ClickUp Style Header & Breadcrumbs */}
          <div className={`p-4 px-5 border-b shrink-0 ${isDarkMode ? 'border-neutral-5 bg-neutral-7/60' : 'border-neutral-2 bg-neutral-1/40'}`}>
            {/* Top bar: Breadcrumbs & Action icons */}
            <div className="flex items-center justify-between gap-2 mb-2">
              <div className="text-[11px] font-semibold text-neutral-4 dark:text-neutral-4 flex items-center gap-1.5 truncate">
                <span>Avaliações</span>
                <span>/</span>
                <span className="font-bold text-neutral-7 dark:text-neutral-2">{assessment.municipality} ({assessment.schoolYear})</span>
                <span>/</span>
                <span
                  className="font-mono text-brand-500 font-bold cursor-pointer hover:underline flex items-center gap-1"
                  onClick={handleCopyCode}
                  title="Copiar código"
                >
                  {assessment.code}
                  {showCopySparkles && <CheckCircle2 size={12} className="text-green-500 shrink-0" />}
                </span>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {/* Menu Gerar PDF */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsPdfMenuOpen(true)}
                  onMouseLeave={() => setIsPdfMenuOpen(false)}
                >
                  <Button
                    variant="tertiary"
                    appearance="ghost"
                    size="xs"
                    iconLeft={<Printer size={13} />}
                    onClick={() => setIsPdfMenuOpen(!isPdfMenuOpen)}
                    title="Gerar PDF"
                    className={isPdfMenuOpen ? (isDarkMode ? '!bg-neutral-7' : '!bg-neutral-2') : ''}
                  >
                    PDF
                  </Button>
                  {isPdfMenuOpen && (
                    <div className="absolute right-0 top-full pt-1.5 z-[100]">
                      <div className={`p-1.5 rounded-[8px] shadow-2xl border transition-all flex flex-col min-w-[200px] gap-0.5 ${isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
                        }`}>
                        <div className="text-[10px] uppercase font-bold tracking-wider text-neutral-5 dark:text-neutral-4 px-2 py-1">Gerar PDF</div>
                        <Button
                          variant="tertiary"
                          appearance="ghost"
                          size="xs"
                          onClick={() => { setIsPdfModalOpen(true); setIsPdfMenuOpen(false); }}
                          className="w-full justify-start !px-2"
                        >
                          Avaliação Completa
                        </Button>
                        {(assessment.testsTree || []).map((test, idx) => (
                          <Button
                            key={idx}
                            variant="tertiary"
                            appearance="ghost"
                            size="xs"
                            onClick={() => { setIsPdfModalOpen(true); setIsPdfMenuOpen(false); }}
                            className="w-full justify-start !px-2 text-left"
                          >
                            <span className="truncate w-full">{test.title}</span>
                          </Button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* View Switcher Menu */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsViewMenuOpen(true)}
                  onMouseLeave={() => setIsViewMenuOpen(false)}
                >
                  <Button
                    variant="tertiary"
                    appearance="ghost"
                    size="xs"
                    iconOnly
                    iconLeft={
                      displayMode === 'modal' ? <AppWindow size={15} /> :
                        displayMode === 'fullscreen' ? <Maximize2 size={15} /> :
                          <PanelRight size={15} />
                    }
                    onClick={cycleDisplayMode}
                    title="Formato de Exibição (Modal, Tela Cheia, Barra Lateral)"
                    className={isViewMenuOpen ? (isDarkMode ? '!bg-neutral-7' : '!bg-neutral-2') : ''}
                  />

                  {isViewMenuOpen && (
                    <div className="absolute right-0 top-full pt-1.5 z-[100]">
                      <div className={`p-2 rounded-[8px] shadow-2xl border transition-all flex gap-1 ${isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
                        }`}>
                        {[
                          {
                            mode: 'modal', label: 'Modal',
                            svg: <svg width="60" height="42" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="38" height="26" rx="3" className="fill-white dark:fill-neutral-8 stroke-neutral-2 dark:stroke-neutral-5" strokeWidth="2" /><circle cx="5" cy="5" r="1" fill="#F87171" /><circle cx="8" cy="5" r="1" fill="#FBBF24" /><circle cx="11" cy="5" r="1" fill="#34D399" /><rect x="4" y="9" width="32" height="15" rx="2" className="fill-neutral-2 dark:fill-neutral-6 stroke-neutral-3 dark:stroke-neutral-5" strokeWidth="1" /></svg>
                          },
                          {
                            mode: 'fullscreen', label: 'Tela cheia',
                            svg: <svg width="60" height="42" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="38" height="26" rx="3" className="fill-white dark:fill-neutral-8 stroke-neutral-2 dark:stroke-neutral-5" strokeWidth="2" /><circle cx="5" cy="5" r="1" fill="#F87171" /><circle cx="8" cy="5" r="1" fill="#FBBF24" /><circle cx="11" cy="5" r="1" fill="#34D399" /><rect x="1" y="9" width="38" height="18" rx="0" className="fill-neutral-2 dark:fill-neutral-6 stroke-neutral-3 dark:stroke-neutral-5" strokeWidth="1" /></svg>
                          },
                          {
                            mode: 'sidebar', label: 'Barra lateral',
                            svg: <svg width="60" height="42" viewBox="0 0 40 28" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="1" y="1" width="38" height="26" rx="3" className="fill-white dark:fill-neutral-8 stroke-neutral-2 dark:stroke-neutral-5" strokeWidth="2" /><circle cx="5" cy="5" r="1" fill="#F87171" /><circle cx="8" cy="5" r="1" fill="#FBBF24" /><circle cx="11" cy="5" r="1" fill="#34D399" /><rect x="25" y="9" width="14" height="18" rx="0" className="fill-neutral-2 dark:fill-neutral-6 stroke-neutral-3 dark:stroke-neutral-5" strokeWidth="1" /></svg>
                          }
                        ].map(item => (
                          <button
                            key={item.mode}
                            onClick={() => { setDisplayMode(item.mode); setIsViewMenuOpen(false); }}
                            className={`flex flex-col items-center gap-1.5 p-2 rounded-[4px] transition-all border outline-none ${displayMode === item.mode
                              ? (isDarkMode ? 'bg-brand-900/30 border-brand-500/50' : 'bg-brand-50 border-brand-200/60')
                              : (isDarkMode ? 'border-transparent hover:bg-neutral-7' : 'border-transparent hover:bg-neutral-1')
                              }`}
                          >
                            {item.svg}
                            <span className={`text-[10px] font-bold ${displayMode === item.mode ? 'text-brand-600 dark:text-brand-400' : 'text-neutral-5 dark:text-neutral-4'}`}>
                              {item.label}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* More Actions Menu */}
                <div
                  className="relative"
                  onMouseEnter={() => setIsMoreMenuOpen(true)}
                  onMouseLeave={() => setIsMoreMenuOpen(false)}
                >
                  <Button
                    variant="tertiary"
                    appearance="ghost"
                    size="xs"
                    iconOnly
                    iconLeft={<MoreVertical size={15} />}
                    title="Mais ações"
                    className={isMoreMenuOpen ? (isDarkMode ? '!bg-neutral-7' : '!bg-neutral-2') : ''}
                  />
                  {isMoreMenuOpen && (
                    <div className="absolute right-0 top-full pt-1.5 z-[100]">
                      <div className={`p-1.5 rounded-[8px] shadow-2xl border transition-all flex flex-col w-36 gap-0.5 ${isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
                        }`}>
                        <Button
                          variant="tertiary"
                          appearance="ghost"
                          size="xs"
                          iconLeft={<Copy size={13} />}
                          onClick={() => { onDuplicate(assessment); setIsMoreMenuOpen(false); }}
                          className="w-full justify-start !px-2"
                        >
                          Duplicar
                        </Button>
                        {!isHistoryMode && (
                          <Button
                            variant="tertiary"
                            appearance="ghost"
                            size="xs"
                            iconLeft={<Trash2 size={13} className="text-semantic-error-base" />}
                            onClick={() => { setConfirmDelete(true); setIsMoreMenuOpen(false); }}
                            className="w-full justify-start !px-2 text-semantic-error-base hover:text-semantic-error-dark hover:bg-semantic-error-extraLight/50"
                          >
                            Excluir
                          </Button>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                <Button variant="tertiary" appearance="ghost" size="xs" iconOnly iconLeft={<X size={15} />} onClick={onClose} />
              </div>
            </div>

            {/* Title */}
            <h3 className="font-bold text-base text-neutral-8 dark:text-white leading-snug">{assessment.title}</h3>

            {/* ClickUp Style AI Assistant Prompt Bar */}
            <div className={`mt-3 p-2 px-3 rounded-[8px] border flex items-center justify-between text-xs font-semibold ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-neutral-2' : 'bg-brand-50/50 border-brand-200 text-neutral-7'
              }`}>
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-brand-500 shrink-0" />
                <span className="text-[11px]">Pergunte à IA sobre o plano pedagógico desta avaliação</span>
              </div>
              <Button
                variant="secondary"
                appearance="solid"
                size="xs"
                onClick={() => setToast && setToast({ type: 'info', message: '💡 IA analisando matriz da avaliação...' })}
              >
                Analisar com IA
              </Button>
            </div>

            {/* ClickUp Style Key-Value Metadata Grid */}
            <div className="mt-4 space-y-2 text-xs">
              {/* Row: Status */}
              <div className="flex items-center py-1 border-b border-neutral-2/40 dark:border-neutral-5/40">
                <div className="w-36 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold">
                  <Play size={13} className="text-brand-500" />
                  <span>Status</span>
                </div>
                <div className="flex items-center gap-2 flex-1 flex-wrap">
                  <Chips label={assessment.status} status={statusChip} variant="dark" />
                  {nextStatus && (
                    <Button
                      variant="primary"
                      appearance="solid"
                      size="xs"
                      iconRight={<ChevronRight size={13} />}
                      onClick={() => onUpdateStatus(assessment.id, nextStatus)}
                      disabled={nextStatus === 'Programada' && blockers.length > 0}
                    >
                      Avançar p/ {nextStatus}
                    </Button>
                  )}
                </div>
              </div>

              {/* Row: Responsável */}
              <div className="flex items-center py-1 border-b border-neutral-2/40 dark:border-neutral-5/40">
                <div className="w-36 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold">
                  <Brain size={13} className="text-extended-orange-base" />
                  <span>Responsável</span>
                </div>
                <div className="flex items-center gap-2 text-neutral-8 dark:text-neutral-2 font-semibold text-xs">
                  <span className="w-5 h-5 rounded-full bg-brand-500 text-white flex items-center justify-center text-[10px] font-bold">
                    {(assessment.owner || 'P')[0]}
                  </span>
                  <span>{assessment.owner || 'Prof. Responsável'}</span>
                </div>
              </div>

              {/* Row: Período & Prazos */}
              <div className="flex items-center py-1 border-b border-neutral-2/40 dark:border-neutral-5/40">
                <div className="w-36 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold">
                  <Calendar size={13} className="text-extended-storm-base" />
                  <span>Período & Prazos</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-xs">
                  <span className="font-semibold text-neutral-8 dark:text-white">
                    {assessment.startDate && assessment.endDate ? `${assessment.startDate} a ${assessment.endDate}` : assessment.schoolYear}
                  </span>
                  {assessment.correctionDeadline && (
                    <Chips label={`Correção até ${assessment.correctionDeadline}`} status="orange" variant="light" />
                  )}
                </div>
              </div>

              {/* Row: Natureza & Escala */}
              <div className="flex items-center py-1 border-b border-neutral-2/40 dark:border-neutral-5/40">
                <div className="w-36 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold">
                  <Target size={13} className="text-extended-aqua-base" />
                  <span>Natureza & Escala</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                  <Chips label={assessment.type} status={typeChip} variant="dark" />
                  {assessment.scale && (
                    <Chips label={assessment.scale === 'larga' ? 'Larga escala' : 'Pequena escala'} status="storm" variant="light" />
                  )}
                </div>
              </div>

              {/* Row: Aplicação & Correção */}
              <div className="flex items-center py-1 border-b border-neutral-2/40 dark:border-neutral-5/40">
                <div className="w-36 text-neutral-5 dark:text-neutral-4 flex items-center gap-1.5 text-[11px] font-bold">
                  <Cpu size={13} className="text-extended-lavender-base" />
                  <span>Aplicação / Correção</span>
                </div>
                <div className="flex items-center gap-2 flex-wrap text-xs font-semibold">
                  <span className="text-neutral-8 dark:text-white">{assessment.correctionMethod || 'Correção Manual'}</span>
                  <span>•</span>
                  <span className="text-neutral-5">{assessment.applicationMode || 'Impressa'}</span>
                </div>
              </div>

              {/* Row: Ações do Card */}
              {!isHistoryMode && (
                <div className="flex items-center pt-2 gap-2">
                  <Button variant="secondary" appearance="solid" size="xs" iconLeft={<Edit3 size={13} />} onClick={() => onEdit(assessment)}>
                    Editar Avaliação
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className={`flex border-b shrink-0 px-4 py-1 gap-1 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
            {tabs.map(tab => (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? 'primary' : 'tertiary'}
                appearance={activeTab === tab.id ? 'solid' : 'ghost'}
                size="xs"
                onClick={() => setActiveTab(tab.id)}
                className="flex-1 justify-center font-bold"
              >
                {tab.label}
              </Button>
            ))}
          </div>

          {/* Tab Body — Free Scrollable Container */}
          <div className="flex-1 p-6 space-y-4 pb-24 pl-6">

            {/* ─── TAB: Hierarquia da Avaliação ─── */}
            {activeTab === 'structure' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  {blockers.length > 0 && (
                    <div className="col-span-2 p-3.5 rounded-[8px] bg-extended-orange-extraLight/50 dark:bg-extended-orange-dark/20 border border-extended-orange-light/60 space-y-2">
                      <div className="text-[10px] font-bold text-extended-orange-dark dark:text-extended-orange-light uppercase tracking-wider flex items-center gap-1">
                        <AlertTriangle size={12} className="text-extended-orange-base" /> Esta avaliação não pode ser publicada
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {blockers.map((blocker, idx) => (
                          <Chips key={idx} label={blocker} status="orange" variant="light" />
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="p-3.5 rounded-[8px] bg-extended-orange-extraLight/50 border border-extended-orange-base/30 space-y-1">
                    <div className="text-[10px] font-bold text-extended-orange-dark uppercase tracking-wider flex items-center gap-1">
                      <Play size={12} /> Próximo Passo
                    </div>
                    <div className="text-xs font-bold text-neutral-8 dark:text-white leading-snug">{assessment.nextStep}</div>
                  </div>
                </div>

                {/* Counts grid */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="p-3.5 rounded-[8px] bg-extended-storm-extraLight/40 border border-extended-storm-base/30 text-center">
                    <div className="text-2xl font-bold text-extended-storm-base">{assessment.testsCount}</div>
                    <div className="mt-1 flex justify-center">
                      <Chips label="Testes" status="storm" variant="light" iconLeft={<BookOpen />} />
                    </div>
                  </div>
                  <div className="p-3.5 rounded-[8px] bg-extended-orange-extraLight/40 border border-extended-orange-base/30 text-center">
                    <div className="text-2xl font-bold text-extended-orange-base">{assessment.tasksCount}</div>
                    <div className="mt-1 flex justify-center">
                      <Chips label="Tarefas" status="orange" variant="light" iconLeft={<Puzzle />} />
                    </div>
                  </div>
                  <div className="p-3.5 rounded-[8px] bg-extended-aqua-extraLight/40 border border-extended-aqua-base/30 text-center">
                    <div className="text-2xl font-bold text-extended-aqua-base">{assessment.itemsCount}</div>
                    <div className="mt-1 flex justify-center">
                      <Chips label="Itens" status="aqua" variant="light" iconLeft={<PenLine />} />
                    </div>
                  </div>
                </div>

                {/* Detailed Tree */}
                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-neutral-5 dark:text-neutral-3 uppercase tracking-wider">Composição Detalhada dos Cadernos</h4>
                  {assessment.testsTree?.map((teste, tIdx) => (
                    <div key={tIdx} className="space-y-2">
                      <div
                        onClick={() => toggleTest(tIdx)}
                        className="border-l-4 border-l-extended-storm-base bg-extended-storm-extraLight/30 dark:bg-extended-storm-dark/20 rounded-r-xl p-3 cursor-pointer hover:bg-extended-storm-extraLight/60 transition-colors flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-extended-storm-dark dark:text-extended-storm-light flex items-center gap-2">
                          {isTestExpanded(tIdx) ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                          <BookOpen size={15} className="text-extended-storm-base" />
                          {teste.title}
                        </span>
                        <div className="flex items-center gap-2">
                          {teste.subject && <Chips label={teste.subject} status="storm" variant="light" />}
                          <Chips label={`${teste.tasks?.length || 0} Tarefas`} status="storm" variant="dark" />
                        </div>
                      </div>

                      {isTestExpanded(tIdx) && teste.tasks?.map((tf, tfIdx) => (
                        <div key={tfIdx} className="ml-5 space-y-2">
                          <div className="border-l-4 border-l-extended-orange-base bg-extended-orange-extraLight/30 dark:bg-extended-orange-dark/10 rounded-r-xl p-3">
                            <div className="text-xs font-bold text-extended-orange-dark dark:text-extended-orange-light flex items-center gap-2">
                              <Puzzle size={14} className="text-extended-orange-base" />
                              {tf.title}
                            </div>
                            <div className="flex items-center gap-2 mt-2 ml-6 flex-wrap">
                              {tf.cognitiveProcess && (
                                <Chips label={`Cognitivo: ${tf.cognitiveProcess}`} status={COGNITIVE_CHIP_MAP[tf.cognitiveProcess] || 'oliva'} variant="dark" iconLeft={<Brain />} />
                              )}
                              <Chips label={`${tf.itemsCount} Itens`} status="orange" variant="light" />
                              {tf.responseType && <Chips label={tf.responseType} status="neutral" variant="stroked" />}
                            </div>
                          </div>

                          {tf.hasItemComposto && (
                            <div className="ml-5 border-l-4 border-l-extended-lavender-base bg-extended-lavender-extraLight/30 dark:bg-extended-lavender-dark/10 rounded-r-xl p-2.5 text-xs font-semibold text-extended-lavender-dark dark:text-extended-lavender-light flex items-center gap-2">
                              <Link2 size={14} className="text-extended-lavender-base" />
                              Item Composto (Markdown): <strong className="text-neutral-8 dark:text-white">{tf.itemCompostoTitle}</strong>
                            </div>
                          )}

                          <div className="ml-5 grid grid-cols-1 gap-2">
                            {(tf.items || []).map((item, iIdx) => (
                              <div key={iIdx} className="border-l-4 border-l-extended-aqua-base bg-extended-aqua-extraLight/20 dark:bg-extended-aqua-dark/10 rounded-r-xl p-3 space-y-2">
                                <div className="flex items-center justify-between text-xs">
                                  <span className="font-bold text-extended-aqua-dark dark:text-extended-aqua-light flex items-center gap-1.5">
                                    <PenLine size={13} className="text-extended-aqua-base" />
                                    {item.title}
                                  </span>
                                  <Chips label={item.hasAnswer ? 'Gabarito ok' : 'Sem Gabarito'} status={item.hasAnswer ? 'success' : 'error'} variant="dark" />
                                </div>
                                {item.skill && (
                                  <div className="text-xs text-neutral-7 dark:text-neutral-3 pt-1 flex items-center gap-2 flex-wrap">
                                    <Chips label={item.skill} status="cherry" variant="dark" iconLeft={<Target />} />
                                    <span>{item.skillDesc}</span>
                                  </div>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ─── TAB: Metadados Pedagógicos ─── */}
            {activeTab === 'pedagogy' && (
              <div className="space-y-6">
                <div>
                  <h4 className="text-xs font-bold text-neutral-8 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Brain size={16} className="text-extended-oliva-base" />
                    Processos Cognitivos Registrados nas Tarefas
                  </h4>
                  <div className="space-y-2">
                    {allTasks.map((tf, idx) => (
                      <div key={idx} className="p-3 rounded-[8px] bg-neutral-1 dark:bg-neutral-5/20 border border-neutral-2 dark:border-neutral-5 flex items-center justify-between">
                        <div className="flex items-center gap-2 min-w-0 pr-2">
                          <Puzzle size={15} className="text-extended-orange-base shrink-0" />
                          <span className="text-xs font-bold text-neutral-8 dark:text-white truncate">{tf.title}</span>
                        </div>
                        {tf.cognitiveProcess ? (
                          <Chips label={tf.cognitiveProcess} status={COGNITIVE_CHIP_MAP[tf.cognitiveProcess] || 'oliva'} variant="dark" />
                        ) : (
                          <Chips label="Pendente" status="error" variant="dark" />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-neutral-8 dark:text-white uppercase tracking-wider flex items-center gap-2 mb-3">
                    <Target size={16} className="text-extended-cherry-base" />
                    Matriz de Habilidades, Expectativas e Sentenças Descritoras
                  </h4>
                  <div className="space-y-3">
                    {allItems.map((item, idx) => (
                      <div key={idx} className="p-4 rounded-[8px] bg-neutral-1 dark:bg-neutral-5/20 border border-neutral-2 dark:border-neutral-5 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-bold text-neutral-8 dark:text-white flex items-center gap-1.5">
                            <PenLine size={14} className="text-extended-aqua-base" />
                            {item.title}
                          </span>
                          {item.skill && (
                            <Chips label={item.skill} status="cherry" variant="dark" iconLeft={<Target />} />
                          )}
                        </div>
                        {item.skillDesc && (
                          <p className="text-xs text-neutral-7 dark:text-neutral-3 leading-relaxed">
                            <strong>Descrição BNCC:</strong> {item.skillDesc}
                          </p>
                        )}
                        {item.expectation && (
                          <p className="text-xs text-neutral-7 dark:text-neutral-3">
                            <strong>Expectativa de Aprendizagem:</strong> {item.expectation}
                          </p>
                        )}
                        {item.descriptor && (
                          <div className="text-xs font-mono bg-white dark:bg-neutral-6 p-2 rounded-[4px] border border-neutral-2 dark:border-neutral-5 text-extended-storm-base font-bold">
                            {item.descriptor}
                          </div>
                        )}
                        {item.correctionCriteria && (
                          <p className="text-xs text-neutral-7 dark:text-neutral-3">
                            <strong>Critérios de correção:</strong> {item.correctionCriteria}
                          </p>
                        )}
                        {(item.performanceLevels || item.alternativeIntentions) && (
                          <div className="flex items-center gap-2 flex-wrap">
                            {item.performanceLevels && <Chips label="Padrões de desempenho" status="oliva" variant="light" />}
                            {item.alternativeIntentions && <Chips label="Intenção por alternativa" status="storm" variant="light" />}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* ─── TAB: Checklist de Integridade ─── */}
            {activeTab === 'integrity' && (
              <div className="space-y-4">
                <div className="p-3 rounded-[8px] bg-neutral-1 dark:bg-neutral-5/30 border border-neutral-2 dark:border-neutral-5 text-xs text-neutral-6 dark:text-neutral-3 font-medium">
                  Verificação automática de integridade pedagógica e técnica da avaliação antes da homologação.
                </div>

                <div className="space-y-3">
                  {[
                    { ok: assessment.testsCount > 0, label: 'Pelo menos 1 Caderno (Teste) cadastrado', desc: `${assessment.testsCount} caderno(s) encontrado(s)` },
                    { ok: assessment.tasksCount > 0, label: 'Tarefas associadas aos Cadernos', desc: `${assessment.tasksCount} tarefa(s) cadastrada(s)` },
                    { ok: assessment.itemsCount > 0, label: 'Itens distribuídos nas Tarefas', desc: `${assessment.itemsCount} item(ns) encontrado(s)` },
                    { ok: tasksWithCognitive === allTasks.length && allTasks.length > 0, label: 'Todas as Tarefas com Processo Cognitivo associado', desc: `${tasksWithCognitive}/${allTasks.length} tarefas com processo definido` },
                    { ok: itemsWithSkills === allItems.length && allItems.length > 0, label: 'Todos os Itens mapeados com Habilidades BNCC/SAEB', desc: `${itemsWithSkills}/${allItems.length} itens parametrizados` },
                    { ok: itemsWithCriteria === allItems.length && allItems.length > 0, label: 'Critérios de correção definidos por Item', desc: `${itemsWithCriteria}/${allItems.length} itens com critérios` },
                    { ok: itemsWithPerformance === allItems.length && allItems.length > 0, label: 'Padrões de desempenho ou intenção por alternativa definidos', desc: `${itemsWithPerformance}/${allItems.length} itens com padrão pedagógico` },
                    { ok: itemsWithAnswers === allItems.length && allItems.length > 0, label: 'Gabarito 100% preenchido', desc: `${itemsWithAnswers}/${allItems.length} gabaritos cadastrados` },
                  ].map((check, idx) => (
                    <div key={idx} className={`p-4 rounded-[8px] border flex items-start gap-3 ${check.ok
                      ? 'bg-semantic-success-extraLight/40 border-semantic-success-light dark:bg-semantic-success-dark/20'
                      : 'bg-semantic-error-extraLight/40 border-semantic-error-light dark:bg-semantic-error-dark/20'
                      }`}>
                      {check.ok
                        ? <CheckCircle2 size={20} className="text-semantic-success-base shrink-0 mt-0.5" />
                        : <AlertTriangle size={20} className="text-semantic-error-base shrink-0 mt-0.5" />
                      }
                      <div>
                        <div className={`text-xs font-bold ${check.ok ? 'text-semantic-success-dark dark:text-semantic-success-light' : 'text-semantic-error-dark dark:text-semantic-error-light'}`}>{check.label}</div>
                        <div className="text-xs text-neutral-5 dark:text-neutral-3 mt-0.5 font-medium">{check.desc}</div>
                      </div>
                    </div>
                  ))}
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
          className="fixed top-[84px] inset-x-0 bottom-0 z-[70] flex justify-center bg-black/60 backdrop-blur-sm px-4 pt-[24px] md:px-8 animate-in fade-in duration-200"
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
