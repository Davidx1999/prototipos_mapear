import React, { useState, useRef, useEffect } from 'react';
import {
  ChevronRight,
  ArrowLeft,
  Bookmark,
  BookMarked,
  BookOpenText,
  Paperclip,
  Eye,
  CheckCircle2,
  AlertTriangle,
  ClipboardCheck,
  Edit3,
  Check,
  ArrowRight
} from 'lucide-react';
import Button from '../../../../ui/Button';

/**
 * ContextualBreadcrumb — Cabeçalho persistente do Workspace da Avaliação
 * 
 * Inclui:
 * - Voltar ao Kanban
 * - Código da Avaliação
 * - Nome da Avaliação com edição inline
 * - Drill-down contextual hierárquico
 * - Indicador de salvamento automático
 * - Indicador global e interativo de pendências (com popover de diagnóstico e atalhos)
 * - Prévia e Revisar Avaliação sob demanda
 * - Fechar
 */
const ContextualBreadcrumb = ({
  context, // { level: 'assessment' | 'test' | 'task' | 'item', testId, taskId, itemId }
  assessment,
  currentTest,
  currentTask,
  currentItem,
  pendencies = [],
  onNavigateLevel,
  onOpenPreview,
  onOpenReview,
  onUpdateAssessmentTitle,
  onBackToHub,
  isDarkMode = false
}) => {
  const { level } = context;

  // Inline Title Editing state
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleValue, setTitleValue] = useState(assessment?.title || 'Nova Avaliação');
  const titleInputRef = useRef(null);

  // Pendencies Popover State
  const [isPendenciesOpen, setIsPendenciesOpen] = useState(false);
  const pendenciesPopoverRef = useRef(null);

  useEffect(() => {
    setTitleValue(assessment?.title || 'Nova Avaliação');
  }, [assessment?.title]);

  useEffect(() => {
    if (isEditingTitle && titleInputRef.current) {
      titleInputRef.current.focus();
      titleInputRef.current.select();
    }
  }, [isEditingTitle]);

  // Click outside listener for pendencies popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pendenciesPopoverRef.current && !pendenciesPopoverRef.current.contains(e.target)) {
        setIsPendenciesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    const finalTitle = titleValue.trim() || 'Nova Avaliação';
    setTitleValue(finalTitle);
    if (finalTitle !== assessment?.title) {
      onUpdateAssessmentTitle?.(finalTitle);
    }
  };

  const handleKeyDownTitle = (e) => {
    if (e.key === 'Enter') {
      handleTitleSubmit();
    } else if (e.key === 'Escape') {
      setTitleValue(assessment?.title || 'Nova Avaliação');
      setIsEditingTitle(false);
    }
  };

  const testLabel = currentTest?.title || currentTest?.code || 'Teste';
  const taskLabel = currentTask?.title || currentTask?.code || 'Tarefa';
  const itemLabel = currentItem?.code || currentItem?.title || 'Item';

  const hasPendencies = pendencies.length > 0;

  return (
    <header
      className={`border-b shrink-0 px-6 py-2 transition-colors sticky top-0 z-30 ${
        isDarkMode
          ? 'bg-neutral-850 border-neutral-700 text-white'
          : 'bg-white border-neutral-200 text-neutral-800 shadow-xs'
      }`}
    >
      <div className="max-w-[1440px] mx-auto flex items-center justify-between gap-4">
        
        {/* ─── ESQUERDA: [← Kanban] + Código + Título Inline + Trilha ─── */}
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          {/* Botão Voltar */}
          <button
            type="button"
            onClick={onBackToHub}
            className={`px-2.5 py-1.5 rounded-[4px] border text-xs font-bold transition-colors shrink-0 flex items-center gap-1.5 cursor-pointer ${
              isDarkMode
                ? 'border-neutral-700 hover:bg-neutral-800 text-neutral-300'
                : 'border-neutral-200 hover:bg-neutral-100 text-neutral-700'
            }`}
            title="Voltar ao Kanban de Avaliações"
          >
            <ArrowLeft size={13} />
            <span>Kanban</span>
          </button>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 shrink-0" />

          {/* Código da Avaliação */}
          <span className="font-mono text-[11px] font-bold text-[#0078B0] bg-[#0078B0]/10 px-2 py-0.5 rounded-[4px] shrink-0">
            {assessment?.code || 'AV-2026'}
          </span>

          {/* Nome da Avaliação com Edição Inline */}
          <div className="relative flex items-center min-w-0 max-w-[320px] md:max-w-[420px] group">
            {isEditingTitle ? (
              <div className="flex items-center gap-1 w-full">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={titleValue}
                  onChange={e => setTitleValue(e.target.value)}
                  onBlur={handleTitleSubmit}
                  onKeyDown={handleKeyDownTitle}
                  className={`w-full px-2 py-1 text-xs font-bold rounded-[4px] border outline-none ${
                    isDarkMode
                      ? 'bg-neutral-900 border-[#0078B0] text-white'
                      : 'bg-white border-[#0078B0] text-neutral-900'
                  }`}
                />
                <button
                  type="button"
                  onClick={handleTitleSubmit}
                  className="p-1 rounded bg-[#0078B0] text-white hover:bg-[#0078B0]/90 shrink-0"
                  title="Salvar título"
                >
                  <Check size={12} />
                </button>
              </div>
            ) : (
              <div
                onClick={() => setIsEditingTitle(true)}
                className="flex items-center gap-1.5 px-2 py-1 rounded-[4px] hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer transition-colors truncate max-w-full"
                title="Clique para editar o nome da avaliação"
              >
                <span className="text-xs font-bold text-neutral-900 dark:text-white truncate">
                  {assessment?.title || 'Nova Avaliação'}
                </span>
                <Edit3 size={11} className="text-neutral-400 opacity-0 group-hover:opacity-100 transition-opacity shrink-0" />
              </div>
            )}
          </div>

          {/* Trilha de Navegação Contextual (Drill-down progressivo) */}
          {(level === 'test' || level === 'task' || level === 'item') && (
            <nav aria-label="Navegação hierárquica" className="flex items-center gap-1 text-xs font-semibold overflow-x-auto no-scrollbar py-0.5 min-w-0">
              <ChevronRight size={13} className="text-neutral-300 dark:text-neutral-600 shrink-0" />
              
              {/* Level 1: Retorno à Visão da Avaliação */}
              <button
                type="button"
                onClick={() => onNavigateLevel('assessment')}
                className="text-neutral-500 hover:text-[#0078B0] hover:bg-neutral-100 dark:hover:bg-neutral-800 px-1.5 py-0.5 rounded-[4px] transition-colors shrink-0 text-xs"
                title="Ir para Visão Geral da Avaliação"
              >
                Geral
              </button>

              {/* Level 2: Teste */}
              {currentTest && (
                <>
                  <ChevronRight size={12} className="text-neutral-300 dark:text-neutral-600 shrink-0" />
                  <button
                    type="button"
                    onClick={() => onNavigateLevel('test', { testId: currentTest.id })}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] transition-colors truncate max-w-[140px] text-xs ${
                      level === 'test'
                        ? 'bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-900 dark:text-white cursor-default'
                        : 'text-neutral-500 hover:text-[#0078B0] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <BookMarked size={12} className="text-[#0078B0] shrink-0" />
                    <span className="truncate">{testLabel}</span>
                  </button>
                </>
              )}

              {/* Level 3: Tarefa */}
              {(level === 'task' || level === 'item') && currentTask && (
                <>
                  <ChevronRight size={12} className="text-neutral-300 dark:text-neutral-600 shrink-0" />
                  <button
                    type="button"
                    onClick={() => onNavigateLevel('task', { testId: currentTest?.id, taskId: currentTask.id })}
                    className={`flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] transition-colors truncate max-w-[140px] text-xs ${
                      level === 'task'
                        ? 'bg-neutral-100 dark:bg-neutral-800 font-bold text-neutral-900 dark:text-white cursor-default'
                        : 'text-neutral-500 hover:text-[#0078B0] hover:bg-neutral-100 dark:hover:bg-neutral-800'
                    }`}
                  >
                    <BookOpenText size={12} className="text-[#0078B0] shrink-0" />
                    <span className="truncate">{taskLabel}</span>
                  </button>
                </>
              )}

              {/* Level 4: Item */}
              {level === 'item' && currentItem && (
                <>
                  <ChevronRight size={12} className="text-neutral-300 dark:text-neutral-600 shrink-0" />
                  <div className="flex items-center gap-1 px-1.5 py-0.5 rounded-[4px] bg-[#0078B0]/10 text-[#0078B0] dark:text-[#38BDF8] font-bold truncate max-w-[120px] text-xs">
                    <Paperclip size={12} className="shrink-0" />
                    <span className="truncate">{itemLabel}</span>
                  </div>
                </>
              )}
            </nav>
          )}
        </div>

        {/* ─── DIREITA: Auto-save + Pendências + Prévia + Revisar + Fechar ─── */}
        <div className="flex items-center gap-2.5 shrink-0">
          
          {/* Indicador de Salvamento Automático */}
          <div className="hidden lg:flex items-center gap-1.5 text-[11px] font-medium text-neutral-400">
            <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
            <span>Salvo automaticamente</span>
          </div>

          <div className="h-4 w-px bg-neutral-200 dark:bg-neutral-700 hidden sm:block shrink-0" />

          {/* Indicador Global e Interativo de Pendências */}
          <div className="relative" ref={pendenciesPopoverRef}>
            <button
              type="button"
              onClick={() => setIsPendenciesOpen(!isPendenciesOpen)}
              className={`px-2.5 py-1 rounded-[6px] text-xs font-bold border transition-all flex items-center gap-1.5 cursor-pointer ${
                hasPendencies
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-700 dark:text-amber-300 hover:bg-amber-500/20'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-700 dark:text-emerald-300 hover:bg-emerald-500/20'
              }`}
              title={hasPendencies ? `${pendencies.length} pendências encontradas na avaliação` : 'Nenhuma pendência encontrada'}
            >
              {hasPendencies ? (
                <>
                  <AlertTriangle size={13} className="text-amber-600 dark:text-amber-400 shrink-0" />
                  <span>{pendencies.length} {pendencies.length === 1 ? 'pendência' : 'pendências'}</span>
                </>
              ) : (
                <>
                  <CheckCircle2 size={13} className="text-emerald-600 dark:text-emerald-400 shrink-0" />
                  <span>Sem pendências</span>
                </>
              )}
            </button>

            {/* Popover de Detalhes de Pendências */}
            {isPendenciesOpen && (
              <div className={`absolute right-0 top-full mt-2 w-[340px] rounded-[8px] border shadow-2xl p-3.5 z-[100] animate-in fade-in slide-in-from-top-1 duration-150 ${
                isDarkMode ? 'bg-neutral-850 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
              }`}>
                <div className="flex items-center justify-between pb-2 border-b border-neutral-100 dark:border-neutral-700/80 mb-2.5">
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 flex items-center gap-1.5">
                    <ClipboardCheck size={14} className="text-[#0078B0]" />
                    Pendências de Autoria ({pendencies.length})
                  </span>
                </div>

                {hasPendencies ? (
                  <div className="space-y-1.5 max-h-60 overflow-y-auto pr-0.5">
                    {pendencies.map((pend, pIdx) => (
                      <div
                        key={pIdx}
                        className="p-2 rounded-[6px] bg-neutral-50 dark:bg-neutral-800/80 border border-neutral-200/60 dark:border-neutral-700 flex items-center justify-between gap-2 text-xs"
                      >
                        <div className="min-w-0 flex-1">
                          <span className="font-semibold text-neutral-800 dark:text-neutral-200 block truncate">
                            {pend.message}
                          </span>
                          {pend.location && (
                            <span className="text-[10px] text-neutral-400 truncate block">
                              {pend.location}
                            </span>
                          )}
                        </div>

                        {pend.itemTarget && (
                          <button
                            type="button"
                            onClick={() => {
                              onNavigateLevel('item', pend.itemTarget);
                              setIsPendenciesOpen(false);
                            }}
                            className="p-1 rounded text-[#0078B0] hover:bg-[#0078B0]/10 font-bold text-[11px] flex items-center gap-0.5 shrink-0 cursor-pointer"
                            title="Ir para o item"
                          >
                            Ir <ArrowRight size={11} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-3 text-center text-xs text-emerald-600 dark:text-emerald-400 font-medium">
                    Nenhuma pendência! O instrumento está pronto para ser revisado.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Botão de Prévia */}
          <Button
            variant="tertiary"
            appearance="solid"
            size="xs"
            iconLeft={<Eye size={13} />}
            onClick={onOpenPreview}
          >
            Prévia
          </Button>

          {/* Botão de Revisão da Avaliação sob demanda */}
          <Button
            variant="primary"
            appearance="solid"
            size="xs"
            iconLeft={<ClipboardCheck size={13} />}
            onClick={onOpenReview}
            className="font-bold shadow-xs"
          >
            Revisar Avaliação
          </Button>

          {/* Botão Fechar */}
          <Button
            variant="tertiary"
            appearance="ghost"
            size="xs"
            onClick={onBackToHub}
          >
            Fechar
          </Button>
        </div>
      </div>
    </header>
  );
};

export default ContextualBreadcrumb;
