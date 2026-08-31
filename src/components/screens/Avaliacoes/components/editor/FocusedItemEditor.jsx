import React, { useState, useMemo } from 'react';
import {
  FileText,
  BookOpen,
  Route,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  Eye,
  Trash2,
  Copy,
  ChevronDown,
  ChevronUp,
  Plus,
  X,
  Bold,
  Italic,
  List,
  Image as ImageIcon,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  Check,
  Link,
  Info
} from 'lucide-react';
import {
  COGNITIVE_PROCESSES,
  RESPONSE_TYPES
} from './mockAssessmentData';
import PedagogicalSkillSelectorModal from './PedagogicalSkillSelectorModal';
import Button from '../../../../ui/Button';

const FocusedItemEditor = ({
  item,
  task,
  test,
  assessment,
  onUpdateItem,
  onDuplicateItem,
  onDeleteItem,
  onAddItemToTask,
  onSelectOtherItem,
  onOpenPreview,
  isDarkMode = false
}) => {
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [activeTabContexto, setActiveTabContexto] = useState(task?.hasItemComposto ? 'composto' : 'item');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiToast, setAiToast] = useState(null);

  // Local task items for lateral task navigation
  const taskItems = task?.items || [item];
  const currentTaskItemIndex = taskItems.findIndex(i => i.id === item?.id);
  const safeIndex = currentTaskItemIndex >= 0 ? currentTaskItemIndex : 0;

  // Safe item values with defaults
  const itemType = item?.type || 'multipla_escolha';
  const alternativas = item?.alternativas || [];

  // Calculate mandatory completed fields
  const completionStats = useMemo(() => {
    const requiredFields = [
      { id: 'enunciado', filled: Boolean(item?.enunciado?.trim()) },
      { id: 'habilidade', filled: Boolean(item?.habilidadeBNCC?.id) },
      { id: 'sentencaDescritora', filled: Boolean(item?.sentencaDescritora?.trim()) },
      { id: 'processosCognitivos', filled: Boolean(item?.processosCognitivosSentenca?.length) }
    ];

    if (itemType === 'multipla_escolha' || itemType === 'hibrida') {
      const hasAlternativas = alternativas.length >= 2;
      const hasCorrect = alternativas.some(a => a.isCorreta);
      const allTextFilled = alternativas.length > 0 && alternativas.every(a => Boolean(a.texto?.trim()));
      requiredFields.push({ id: 'alternativas', filled: hasAlternativas && allTextFilled });
      requiredFields.push({ id: 'gabarito', filled: hasCorrect });
    }

    if (itemType === 'resposta_construida' || itemType === 'hibrida') {
      requiredFields.push({ id: 'respostaEsperada', filled: Boolean(item?.respostaEsperada?.trim()) });
      requiredFields.push({ id: 'rubricaSuficiente', filled: Boolean(item?.rubricas?.suficiente?.trim()) });
    }

    const total = requiredFields.length;
    const filledCount = requiredFields.filter(f => f.filled).length;
    const isComplete = filledCount === total;

    return { total, filledCount, isComplete };
  }, [item, itemType, alternativas]);

  // Item Field Updaters
  const handleFieldChange = (field, value) => {
    onUpdateItem?.({ [field]: value });
  };

  const handleRubricaChange = (level, text) => {
    onUpdateItem?.({
      rubricas: {
        ...(item?.rubricas || {}),
        [level]: text
      }
    });
  };

  const handleToggleCognitiveProcess = (process) => {
    const currentList = item?.processosCognitivosSentenca || [];
    const exists = currentList.includes(process);
    const updated = exists
      ? currentList.filter(p => p !== process)
      : [...currentList, process];
    onUpdateItem?.({ processosCognitivosSentenca: updated });
  };

  const handleAlternativaTextChange = (altId, newText) => {
    const updated = alternativas.map(alt =>
      alt.id === altId ? { ...alt, texto: newText } : alt
    );
    onUpdateItem?.({ alternativas: updated });
  };

  const handleAlternativaDistratorChange = (altId, newDistrator) => {
    const updated = alternativas.map(alt =>
      alt.id === altId ? { ...alt, analiseDistrator: newDistrator } : alt
    );
    onUpdateItem?.({ alternativas: updated });
  };

  const handleSetCorrectAlternativa = (altId) => {
    const updated = alternativas.map(alt => ({
      ...alt,
      isCorreta: alt.id === altId
    }));
    const correctLetter = alternativas.find(a => a.id === altId)?.letra || 'A';
    onUpdateItem?.({ alternativas: updated, gabarito: correctLetter });
  };

  const handleAddAlternativa = () => {
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const nextLetter = letters[alternativas.length] || `Opção ${alternativas.length + 1}`;
    const newAlt = {
      id: `alt-${Date.now()}`,
      letra: nextLetter,
      texto: '',
      isCorreta: false,
      analiseDistrator: ''
    };
    onUpdateItem?.({ alternativas: [...alternativas, newAlt] });
  };

  const handleRemoveAlternativa = (altId) => {
    if (alternativas.length <= 2) return;
    const filtered = alternativas.filter(a => a.id !== altId);
    const letters = ['A', 'B', 'C', 'D', 'E', 'F'];
    const reindexed = filtered.map((alt, idx) => ({
      ...alt,
      letra: letters[idx] || String(idx + 1)
    }));
    onUpdateItem?.({ alternativas: reindexed });
  };

  // AI Fill Simulation
  const handleAIAssist = () => {
    setIsAiLoading(true);
    setTimeout(() => {
      setIsAiLoading(false);
      onUpdateItem?.({
        enunciado: item?.enunciado || 'Com base na leitura atenta do texto narrativo, identifique o motivo central que orientou as ações do personagem protagonista no desfecho da história.',
        sentencaDescritora: item?.sentencaDescritora || 'Inferir a relação de causalidade entre as motivações do protagonista e os eventos decisivos do enredo em narrativas literárias ficcionais.',
        processosCognitivosSentenca: item?.processosCognitivosSentenca?.length ? item.processosCognitivosSentenca : ['Compreender elementos', 'Conjecturar / Inferir'],
        respostaEsperada: item?.respostaEsperada || 'O protagonista agiu motivado pelo desejo de desvendar a mensagem secreta encontrada no rio.',
        rubricas: {
          insuficiente: item?.rubricas?.insuficiente || 'O estudante não reconhece a motivação ou cita elementos irrelevantes.',
          parcial: item?.rubricas?.parcial || 'O estudante identifica a ação, mas não articula a justificativa causal.',
          suficiente: item?.rubricas?.suficiente || 'O estudante articula claramente a causa e a consequência da decisão do protagonista.'
        },
        orientacaoCorrecao: item?.orientacaoCorrecao || 'Validar se o estudante vinculou a pista textual ao desfecho narrativo.'
      });
      setAiToast('Campos pedagógicos preenchidos com sugestões estruturadas pela IA!');
      setTimeout(() => setAiToast(null), 3500);
    }, 1000);
  };

  return (
    <div className="max-w-[1300px] mx-auto px-6 py-6 flex flex-col gap-6">
      {/* Toast Notification */}
      {aiToast && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce">
          <div className="bg-[#0078B0] text-white px-4 py-2.5 rounded-[6px] shadow-lg text-xs font-bold flex items-center gap-2">
            <Sparkles size={14} />
            <span>{aiToast}</span>
          </div>
        </div>
      )}

      {/* Main Container: Local Task Items Column (Left) + Editorial Workspace (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* ─── NAVEGAÇÃO LOCAL ENTRE ITENS DA MESMA TAREFA (3 cols) ─── */}
        <aside
          className={`lg:col-span-3 rounded-[8px] border p-4 flex flex-col gap-3 sticky top-[60px] ${
            isDarkMode
              ? 'bg-neutral-850 border-neutral-700 text-white'
              : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
          }`}
        >
          <div className="border-b border-neutral-100 dark:border-neutral-700/60 pb-2.5 flex items-center justify-between">
            <div>
              <span className="font-bold text-xs text-neutral-900 dark:text-white block truncate">
                {task?.title || 'Tarefa Atual'}
              </span>
              <span className="text-[11px] text-neutral-400 font-medium">
                {taskItems.length} {taskItems.length === 1 ? 'item nesta tarefa' : 'itens nesta tarefa'}
              </span>
            </div>
          </div>

          {/* Item List inside this task */}
          <div className="flex flex-col gap-1">
            {taskItems.map((tItem, idx) => {
              const isSelected = tItem.id === item?.id;
              const hasContent = Boolean(tItem.enunciado && tItem.habilidadeBNCC?.id);

              return (
                <button
                  key={tItem.id || idx}
                  type="button"
                  onClick={() => onSelectOtherItem(tItem.id)}
                  className={`w-full text-left px-3 py-2 rounded-[6px] text-xs font-semibold flex items-center justify-between transition-all border ${
                    isSelected
                      ? 'bg-[#0078B0]/10 border-[#0078B0] text-[#0078B0] dark:text-[#38BDF8] font-bold shadow-xs'
                      : isDarkMode
                      ? 'border-transparent hover:bg-neutral-800 text-neutral-300'
                      : 'border-transparent hover:bg-neutral-50 text-neutral-700'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isSelected ? 'bg-[#0078B0]' : hasContent ? 'bg-emerald-500' : 'bg-neutral-300 dark:bg-neutral-600'
                    }`} />
                    <span className="truncate">{tItem.code || `Item 0${idx + 1}`}</span>
                  </div>

                  <span className="text-[11px] font-mono shrink-0 ml-1">
                    {hasContent ? (
                      <span className="text-emerald-600 dark:text-emerald-400">✓</span>
                    ) : isSelected ? (
                      <span className="text-[#0078B0]">●</span>
                    ) : null}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Add Item Button in this task */}
          <button
            type="button"
            onClick={onAddItemToTask}
            className="w-full mt-2 py-2 border border-dashed border-neutral-300 dark:border-neutral-700 hover:border-[#0078B0] rounded-[6px] text-xs font-bold text-neutral-500 hover:text-[#0078B0] flex items-center justify-center gap-1.5 transition-colors"
          >
            <Plus size={13} />
            <span>+ Novo Item</span>
          </button>
        </aside>

        {/* ─── WORKSPACE EDITORIAL FOCADO (9 cols) ─── */}
        <div className="lg:col-span-9 flex flex-col gap-6">
          
          {/* Header Controls of Current Item */}
          <div
            className={`p-4 px-6 rounded-[8px] border transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
              isDarkMode
                ? 'bg-neutral-850 border-neutral-700 text-white'
                : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-sm font-bold text-neutral-900 dark:text-white">
                {item?.code || `Item 0${safeIndex + 1}`}
              </span>

              {/* Sequential Navigator */}
              <div className="flex items-center gap-1.5 text-xs text-neutral-500 font-semibold">
                <button
                  type="button"
                  disabled={safeIndex === 0}
                  onClick={() => onSelectOtherItem(taskItems[safeIndex - 1]?.id)}
                  className={`p-1 rounded border transition-colors ${
                    safeIndex > 0
                      ? 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 cursor-pointer'
                      : 'border-transparent text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                  }`}
                  title="Item Anterior"
                >
                  <ArrowLeft size={13} />
                </button>

                <span>
                  Item {safeIndex + 1} de {taskItems.length}
                </span>

                <button
                  type="button"
                  disabled={safeIndex >= taskItems.length - 1}
                  onClick={() => onSelectOtherItem(taskItems[safeIndex + 1]?.id)}
                  className={`p-1 rounded border transition-colors ${
                    safeIndex < taskItems.length - 1
                      ? 'border-neutral-200 dark:border-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-200 cursor-pointer'
                      : 'border-transparent text-neutral-300 dark:text-neutral-600 cursor-not-allowed'
                  }`}
                  title="Próximo Item"
                >
                  <ArrowRight size={13} />
                </button>
              </div>

              {/* Response Type Selector Buttons */}
              <div className="flex items-center p-0.5 rounded-[6px] bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700">
                {RESPONSE_TYPES.map(rt => {
                  const isSelected = itemType === rt.id;
                  return (
                    <button
                      key={rt.id}
                      type="button"
                      onClick={() => handleFieldChange('type', rt.id)}
                      className={`px-2.5 py-1 rounded-[4px] text-xs font-semibold transition-all ${
                        isSelected
                          ? 'bg-white dark:bg-neutral-700 text-[#0078B0] dark:text-[#38BDF8] font-bold shadow-xs'
                          : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white'
                      }`}
                    >
                      {rt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex items-center gap-2.5 flex-wrap">
              {/* Completion Indicator */}
              <span
                className={`text-[11px] font-bold px-2.5 py-0.5 rounded-[4px] border ${
                  completionStats.isComplete
                    ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                    : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                }`}
              >
                {completionStats.filledCount} de {completionStats.total} campos preenchidos
              </span>

              {/* AI Assistant */}
              <Button
                variant="tertiary"
                appearance="solid"
                size="xs"
                iconLeft={<Sparkles size={12} className="text-[#0078B0]" />}
                onClick={handleAIAssist}
                disabled={isAiLoading}
              >
                {isAiLoading ? 'Preenchendo...' : 'Sugerir c/ IA'}
              </Button>

              {/* Duplicate */}
              <button
                type="button"
                onClick={() => onDuplicateItem?.(item?.id)}
                className={`p-1.5 rounded-[4px] border transition-colors text-neutral-500 hover:text-[#0078B0] ${
                  isDarkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-200 hover:bg-neutral-100'
                }`}
                title="Duplicar este Item"
              >
                <Copy size={13} />
              </button>

              {/* Delete */}
              {taskItems.length > 1 && (
                <button
                  type="button"
                  onClick={() => onDeleteItem?.(item?.id)}
                  className={`p-1.5 rounded-[4px] border transition-colors text-neutral-400 hover:text-red-500 ${
                    isDarkMode ? 'border-neutral-700 hover:bg-neutral-800' : 'border-neutral-200 hover:bg-neutral-100'
                  }`}
                  title="Excluir este Item"
                >
                  <Trash2 size={13} />
                </button>
              )}
            </div>
          </div>

          {/* ══════════════════════════════════════════════════════ */}
          {/* BLOCO 1: CONTEÚDO DO ITEM                             */}
          {/* ══════════════════════════════════════════════════════ */}
          <section
            className={`p-6 rounded-[8px] border transition-colors ${
              isDarkMode
                ? 'bg-neutral-850 border-neutral-700 text-white'
                : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-neutral-100 dark:border-neutral-700/60">
              <span className="w-5 h-5 rounded-full bg-[#0078B0] text-white flex items-center justify-center text-[10px] font-bold">1</span>
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                Conteúdo e Estímulo do Item
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Enunciado Principal */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Enunciado Principal <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">Formulação direta e contextualizada</span>
                </div>

                <div className={`border rounded-[6px] overflow-hidden ${
                  isDarkMode ? 'border-neutral-700 bg-neutral-900' : 'border-neutral-300 bg-white'
                }`}>
                  <div className={`p-1.5 px-2.5 border-b flex items-center gap-1 flex-wrap ${
                    isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
                  }`}>
                    <button type="button" className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300" title="Negrito">
                      <Bold size={13} />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300" title="Itálico">
                      <Italic size={13} />
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300" title="Lista">
                      <List size={13} />
                    </button>
                    <div className="h-3 w-px bg-neutral-300 dark:bg-neutral-600 my-auto mx-1" />
                    <button type="button" className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-1 text-[11px] font-semibold" title="Inserir Imagem">
                      <ImageIcon size={13} className="text-[#0078B0]" /> Imagem
                    </button>
                    <button type="button" className="p-1 rounded hover:bg-neutral-200 dark:hover:bg-neutral-700 text-neutral-600 dark:text-neutral-300 flex items-center gap-1 text-[11px] font-semibold" title="Inserir Link">
                      <Link size={13} /> Link
                    </button>
                  </div>

                  <textarea
                    rows={4}
                    value={item?.enunciado || ''}
                    onChange={e => handleFieldChange('enunciado', e.target.value)}
                    placeholder="Digite a formulação da questão para o estudante..."
                    className={`w-full p-3 text-xs leading-relaxed outline-none resize-y ${
                      isDarkMode ? 'bg-neutral-900 text-white' : 'bg-white text-neutral-800'
                    }`}
                  />
                </div>
              </div>

              {/* Contexto / Texto de Apoio */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Contexto / Estímulo
                  </label>

                  {task?.hasItemComposto && (
                    <div className="flex items-center gap-1 bg-neutral-100 dark:bg-neutral-800 p-0.5 rounded-[4px] text-[11px]">
                      <button
                        type="button"
                        onClick={() => setActiveTabContexto('composto')}
                        className={`px-2 py-0.5 rounded-[3px] font-bold transition-colors ${
                          activeTabContexto === 'composto'
                            ? 'bg-white dark:bg-neutral-700 text-[#0078B0] shadow-xs'
                            : 'text-neutral-500'
                        }`}
                      >
                        Texto Base da Tarefa
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTabContexto('item')}
                        className={`px-2 py-0.5 rounded-[3px] font-bold transition-colors ${
                          activeTabContexto === 'item'
                            ? 'bg-white dark:bg-neutral-700 text-[#0078B0] shadow-xs'
                            : 'text-neutral-500'
                        }`}
                      >
                        Contexto Específico
                      </button>
                    </div>
                  )}
                </div>

                {activeTabContexto === 'composto' && task?.hasItemComposto ? (
                  <div className="p-3.5 rounded-[6px] bg-neutral-50 dark:bg-neutral-800/70 border border-neutral-200 dark:border-neutral-700 text-xs text-neutral-700 dark:text-neutral-300 flex flex-col gap-1">
                    <span className="font-bold text-[#0078B0] flex items-center gap-1.5">
                      <Route size={13} /> {task.itemComposto?.title || 'Texto Base Vinculado'}
                    </span>
                    <p className="text-neutral-500 line-clamp-3 text-[11px] italic mt-0.5">
                      {task.itemComposto?.content?.replace(/[#*`]/g, '')}
                    </p>
                  </div>
                ) : (
                  <input
                    type="text"
                    value={item?.contexto || ''}
                    onChange={e => handleFieldChange('contexto', e.target.value)}
                    placeholder="Texto de apoio complementar, fonte bibliográfica, gráfico ou poema..."
                    className={`w-full px-3.5 h-[38px] text-xs border rounded-[6px] outline-none ${
                      isDarkMode
                        ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#0078B0]'
                        : 'bg-white border-neutral-300 text-neutral-800 focus:border-[#0078B0]'
                    }`}
                  />
                )}
              </div>

              {/* Alternativas com Análise de Distrator Extensa */}
              {(itemType === 'multipla_escolha' || itemType === 'hibrida') && (
                <div className="flex flex-col gap-3 pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 block">
                        Alternativas e Análise Pedagógica de Distratores <span className="text-red-500">*</span>
                      </label>
                      <span className="text-[11px] text-neutral-400">
                        Marque a letra correspondente ao Gabarito Oficial e detalhe a análise de cada opção.
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={handleAddAlternativa}
                      className="text-xs font-bold text-[#0078B0] hover:underline flex items-center gap-1"
                    >
                      <Plus size={13} /> Adicionar Alternativa
                    </button>
                  </div>

                  <div className="flex flex-col gap-4">
                    {alternativas.map((alt) => (
                      <div
                        key={alt.id}
                        className={`p-4 rounded-[6px] border transition-all flex flex-col gap-3 ${
                          alt.isCorreta
                            ? 'bg-[#F2FAFE] dark:bg-[#0078B0]/15 border-[#0078B0]'
                            : isDarkMode
                            ? 'bg-neutral-900/60 border-neutral-700'
                            : 'bg-neutral-50/50 border-neutral-200'
                        }`}
                      >
                        {/* Alternative Row */}
                        <div className="flex items-center gap-3">
                          <button
                            type="button"
                            onClick={() => handleSetCorrectAlternativa(alt.id)}
                            className={`w-7 h-7 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 transition-colors ${
                              alt.isCorreta
                                ? 'border-[#0078B0] bg-[#0078B0] text-white shadow-xs'
                                : 'border-neutral-300 dark:border-neutral-600 bg-white dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:border-[#0078B0]'
                            }`}
                            title={alt.isCorreta ? 'Gabarito Oficial' : 'Clique para marcar como Gabarito'}
                          >
                            {alt.letra}
                          </button>

                          <input
                            type="text"
                            value={alt.texto || ''}
                            onChange={e => handleAlternativaTextChange(alt.id, e.target.value)}
                            placeholder={`Texto da alternativa ${alt.letra}...`}
                            className={`flex-1 px-3.5 h-[36px] text-xs border rounded-[4px] outline-none ${
                              isDarkMode
                                ? 'bg-neutral-850 border-neutral-700 text-white focus:border-[#0078B0]'
                                : 'bg-white border-neutral-300 text-neutral-800 focus:border-[#0078B0]'
                            }`}
                          />

                          {alt.isCorreta && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-[#0078B0] bg-[#0078B0]/10 px-2 py-0.5 rounded-[4px] shrink-0">
                              Gabarito Oficial
                            </span>
                          )}

                          {alternativas.length > 2 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveAlternativa(alt.id)}
                              className="p-1.5 rounded text-neutral-400 hover:text-red-500 shrink-0"
                              title="Remover Alternativa"
                            >
                              <Trash2 size={14} />
                            </button>
                          )}
                        </div>

                        {/* Extended Pedagogical Distractor Analysis */}
                        <div className="pl-10 flex flex-col gap-1">
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-400">
                            {alt.isCorreta ? 'Justificativa do Gabarito Oficial' : `Análise do Distrator ${alt.letra} (Hipótese de Erro do Estudante)`}
                          </label>
                          <textarea
                            rows={2}
                            value={alt.analiseDistrator || ''}
                            onChange={e => handleAlternativaDistratorChange(alt.id, e.target.value)}
                            placeholder={
                              alt.isCorreta
                                ? 'Descreva os passos cognitivos que comprovam o acerto com base no texto/problema...'
                                : `Explique a hipótese de raciocínio incompleto ou equívoco conceitual associado ao distrator ${alt.letra}...`
                            }
                            className={`w-full p-2.5 text-xs leading-relaxed border rounded-[4px] outline-none ${
                              isDarkMode
                                ? 'bg-neutral-900 border-neutral-750 text-neutral-200 focus:border-[#0078B0]'
                                : 'bg-white border-neutral-250 text-neutral-700 focus:border-[#0078B0]'
                            }`}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Resposta Esperada (se Resposta Construída ou Híbrida) */}
              {(itemType === 'resposta_construida' || itemType === 'hibrida') && (
                <div className="flex flex-col gap-1.5 pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Padrão de Resposta Esperada (Espelho de Correção) <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    rows={3}
                    value={item?.respostaEsperada || ''}
                    onChange={e => handleFieldChange('respostaEsperada', e.target.value)}
                    placeholder="Descreva o padrão ideal da resposta do estudante para orientar os avaliadores e calibração de IA..."
                    className={`w-full p-3 text-xs leading-relaxed border rounded-[6px] outline-none ${
                      isDarkMode
                        ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#0078B0]'
                        : 'bg-white border-neutral-300 text-neutral-800 focus:border-[#0078B0]'
                    }`}
                  />
                </div>
              )}
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════ */}
          {/* BLOCO 2: ALINHAMENTO PEDAGÓGICO                       */}
          {/* ══════════════════════════════════════════════════════ */}
          <section
            className={`p-6 rounded-[8px] border transition-colors ${
              isDarkMode
                ? 'bg-neutral-850 border-neutral-700 text-white'
                : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-neutral-100 dark:border-neutral-700/60">
              <span className="w-5 h-5 rounded-full bg-[#0078B0] text-white flex items-center justify-center text-[10px] font-bold">2</span>
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                Alinhamento Pedagógico e Matriz de Referência
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Habilidade BNCC */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Habilidade Avaliada (BNCC) <span className="text-red-500">*</span>
                  </label>

                  <button
                    type="button"
                    onClick={() => setIsSkillModalOpen(true)}
                    className="text-xs font-bold text-[#0078B0] hover:underline flex items-center gap-1"
                  >
                    <Plus size={13} /> {item?.habilidadeBNCC?.id ? 'Alterar Habilidade' : 'Vincular Habilidade'}
                  </button>
                </div>

                {item?.habilidadeBNCC?.id ? (
                  <div className="p-3.5 rounded-[6px] border border-[#0078B0]/30 bg-[#F2FAFE] dark:bg-[#0078B0]/10 flex items-start justify-between gap-3">
                    <div className="flex items-start gap-2.5">
                      <span className="font-mono text-xs font-bold text-[#0078B0] bg-white dark:bg-neutral-800 px-2 py-0.5 rounded border border-[#0078B0]/20 shrink-0 mt-0.5">
                        {item.habilidadeBNCC.id}
                      </span>
                      <p className="text-xs text-neutral-800 dark:text-neutral-200 leading-relaxed font-medium">
                        {item.habilidadeBNCC.desc}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleFieldChange('habilidadeBNCC', null)}
                      className="p-1 text-neutral-400 hover:text-red-500 shrink-0"
                      title="Desvincular habilidade"
                    >
                      <X size={14} />
                    </button>
                  </div>
                ) : (
                  <div
                    onClick={() => setIsSkillModalOpen(true)}
                    className="p-4 rounded-[6px] border-2 border-dashed border-neutral-300 dark:border-neutral-700 text-center cursor-pointer hover:border-[#0078B0] transition-colors"
                  >
                    <span className="text-xs text-neutral-400 italic">
                      Nenhuma habilidade BNCC vinculada a este item. Clique para selecionar.
                    </span>
                  </div>
                )}
              </div>

              {/* Sentença Descritora (Extensa) */}
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Sentença Descritora <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">Descrição pedagógica completa da evidência esperada</span>
                </div>

                <textarea
                  rows={3}
                  value={item?.sentencaDescritora || ''}
                  onChange={e => handleFieldChange('sentencaDescritora', e.target.value)}
                  placeholder="Descreva a evidência pedagógica completa (ex: Localizar e recuperar informações explícitas em textos narrativos ficcionais, identificando personagens, tempo, espaço e ações...)"
                  className={`w-full p-3 text-xs leading-relaxed border rounded-[6px] outline-none ${
                    isDarkMode
                      ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#0078B0]'
                      : 'bg-white border-neutral-300 text-neutral-800 focus:border-[#0078B0]'
                  }`}
                />
              </div>

              {/* Processos Cognitivos da Sentença Descritora (Múltipla Seleção) */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                    Processos Cognitivos Relacionados à Sentença Descritora <span className="text-red-500">*</span>
                  </label>
                  <span className="text-[11px] text-neutral-400">Selecione todos os processos aplicáveis</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {COGNITIVE_PROCESSES.map((process) => {
                    const isSelected = (item?.processosCognitivosSentenca || []).includes(process);

                    return (
                      <button
                        key={process}
                        type="button"
                        onClick={() => handleToggleCognitiveProcess(process)}
                        className={`px-3 py-1.5 rounded-[6px] text-xs font-semibold transition-all border flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-[#0078B0] text-white border-[#0078B0] shadow-xs'
                            : isDarkMode
                            ? 'bg-neutral-900 border-neutral-700 text-neutral-300 hover:bg-neutral-800'
                            : 'bg-white border-neutral-300 text-neutral-700 hover:bg-neutral-50'
                        }`}
                      >
                        {isSelected && <Check size={12} className="shrink-0" />}
                        <span>{process}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ══════════════════════════════════════════════════════ */}
          {/* BLOCO 3: CRITÉRIOS DE AVALIAÇÃO & RUBRICAS            */}
          {/* ══════════════════════════════════════════════════════ */}
          <section
            className={`p-6 rounded-[8px] border transition-colors ${
              isDarkMode
                ? 'bg-neutral-850 border-neutral-700 text-white'
                : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
            }`}
          >
            <div className="flex items-center gap-2 mb-5 pb-3 border-b border-neutral-100 dark:border-neutral-700/60">
              <span className="w-5 h-5 rounded-full bg-[#0078B0] text-white flex items-center justify-center text-[10px] font-bold">3</span>
              <h2 className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
                Critérios de Avaliação, Rubricas e Orientações
              </h2>
            </div>

            <div className="flex flex-col gap-6">
              {/* Padrões de Desempenho em 3 Níveis */}
              <div className="flex flex-col gap-2">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  Padrões de Desempenho (Rubricas em 3 Níveis)
                </label>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
                  {/* Insuficiente */}
                  <div className="p-3.5 rounded-[6px] border border-l-4 border-neutral-200 dark:border-neutral-700 border-l-red-500 bg-neutral-50/40 dark:bg-neutral-900/40 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-red-600 uppercase tracking-wider">
                      Insuficiente (Nível 0)
                    </span>
                    <textarea
                      rows={3}
                      value={item?.rubricas?.insuficiente || ''}
                      onChange={e => handleRubricaChange('insuficiente', e.target.value)}
                      placeholder="Critérios que caracterizam o não alcance da evidência esperada..."
                      className="w-full p-2 text-xs border rounded-[4px] bg-white dark:bg-neutral-850 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white outline-none resize-none"
                    />
                  </div>

                  {/* Parcialmente Suficiente */}
                  <div className="p-3.5 rounded-[6px] border border-l-4 border-neutral-200 dark:border-neutral-700 border-l-amber-500 bg-neutral-50/40 dark:bg-neutral-900/40 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider">
                      Parcialmente Suficiente (Nível 1)
                    </span>
                    <textarea
                      rows={3}
                      value={item?.rubricas?.parcial || ''}
                      onChange={e => handleRubricaChange('parcial', e.target.value)}
                      placeholder="Critérios de domínio em desenvolvimento..."
                      className="w-full p-2 text-xs border rounded-[4px] bg-white dark:bg-neutral-850 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white outline-none resize-none"
                    />
                  </div>

                  {/* Suficiente */}
                  <div className="p-3.5 rounded-[6px] border border-l-4 border-neutral-200 dark:border-neutral-700 border-l-emerald-500 bg-neutral-50/40 dark:bg-neutral-900/40 flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">
                      Suficiente (Nível 2)
                    </span>
                    <textarea
                      rows={3}
                      value={item?.rubricas?.suficiente || ''}
                      onChange={e => handleRubricaChange('suficiente', e.target.value)}
                      placeholder="Critérios de alcance pleno e domínio da habilidade..."
                      className="w-full p-2 text-xs border rounded-[4px] bg-white dark:bg-neutral-850 border-neutral-300 dark:border-neutral-700 text-neutral-800 dark:text-white outline-none resize-none"
                    />
                  </div>
                </div>
              </div>

              {/* Orientações Técnicas para a Equipe de Correção */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  Orientações Técnicas para a Equipe de Correção
                </label>
                <input
                  type="text"
                  value={item?.orientacaoCorrecao || ''}
                  onChange={e => handleFieldChange('orientacaoCorrecao', e.target.value)}
                  placeholder="Instruções para corretores humanos, termos-chave para IA ou regras de validação..."
                  className={`w-full px-3.5 h-[38px] text-xs border rounded-[6px] outline-none ${
                    isDarkMode
                      ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#0078B0]'
                      : 'bg-white border-neutral-300 text-neutral-800 focus:border-[#0078B0]'
                  }`}
                />
              </div>
            </div>
          </section>

        </div>
      </div>

      {/* Modal de Seleção de Habilidades BNCC */}
      <PedagogicalSkillSelectorModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSelectSkill={(selectedSkill) => {
          handleFieldChange('habilidadeBNCC', selectedSkill);
          setIsSkillModalOpen(false);
        }}
        currentSkillId={item?.habilidadeBNCC?.id}
        isDarkMode={isDarkMode}
      />
    </div>
  );
};

export default FocusedItemEditor;
