import React, { useState } from 'react';
import { ChevronDown, ChevronRight, Bookmark, BookMarked, BookOpenText, Route, Paperclip, Brain, Target, Plus, FileText, Eye } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';
import MarkdownContextModal from './MarkdownContextModal';
import { CONTENT_MAX_WIDTH_PERCENT } from '../AvaliacoesHubV2';

/**
 * AvaliacoesTreeView — Visão Tree Explorer com ações completas de hierarquia e leitor/editor de Markdown.
 * 
 * Requisitos atendidos:
 * - Ações diretas na árvore: [+ Tarefa], [+ Item Composto MD], [+ Item]
 * - Suporte a suporte/contexto de leitura em formato Markdown
 * - Chips e Buttons oficiais do sistema
 */

const COGNITIVE_CHIP_MAP = {
  'Conhecer':    'oliva',
  'Compreender': 'oliva',
  'Aplicar':     'orange',
  'Analisar':    'storm',
  'Avaliar':     'lavender',
  'Criar':       'cherry',
};

const STATUS_CHIP_MAP = {
  'Em edição':    'orange',
  'Programada':   'storm',
  'Em aplicação': 'primary',
  'Em correção':  'lavender',
  'Concluída':    'success',
};

export default function AvaliacoesTreeView({ assessments = [], onSelectAssessment, onDuplicate, isDarkMode }) {
  const [expandedNodes, setExpandedNodes] = useState({});
  const [activeMarkdownModal, setActiveMarkdownModal] = useState(null); // { title, content, onSave }

  const toggle = (nodeId) => {
    setExpandedNodes(prev => ({ ...prev, [nodeId]: !prev[nodeId] }));
  };

  const isExpanded = (nodeId) => expandedNodes[nodeId] !== false;

  const handleOpenMarkdownModal = (title, content, onSaveCallback) => {
    setActiveMarkdownModal({
      title: title || 'Suporte de Leitura em Markdown',
      content: content || '# Texto de Leitura\n\nInsira aqui o texto base em Markdown...',
      onSave: onSaveCallback
    });
  };

  return (
    <div className={`flex-1 overflow-y-auto p-6 transition-colors ${
      isDarkMode ? 'bg-neutral-7' : 'bg-brand-50/30'
    }`}>
      <div className="mx-auto w-full space-y-4" style={{ maxWidth: `${CONTENT_MAX_WIDTH_PERCENT}%` }}>
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-neutral-2 dark:border-neutral-5">
        <div>
          <h3 className="font-bold text-base text-neutral-8 dark:text-white">Visão Hierárquica (Tree Explorer)</h3>
          <div className="flex items-center gap-2 mt-1 text-xs font-semibold">
            <span className="text-extended-storm-base flex items-center gap-1"><BookMarked size={13} /> Teste</span>
            <span className="text-neutral-3">→</span>
            <span className="text-extended-orange-base flex items-center gap-1"><BookOpenText size={13} /> Tarefa</span>
            <span className="text-neutral-3">→</span>
            <span className="text-extended-lavender-base flex items-center gap-1"><Route size={13} /> Item Composto (MD)</span>
            <span className="text-neutral-3">(opcional) →</span>
            <span className="text-extended-aqua-base flex items-center gap-1"><Paperclip size={13} /> Item</span>
          </div>
        </div>
        <div className="text-xs text-neutral-5 bg-neutral-1 dark:bg-neutral-5/40 px-3 py-1.5 rounded-[8px] border border-neutral-2 dark:border-neutral-5 font-mono font-bold">
          {assessments.length} Avaliações Exibidas
        </div>
      </div>

      {/* Tree */}
      <div className="space-y-4">
        {assessments.map(av => {
          const avId = av.id;
          const avExpanded = isExpanded(avId);
          const statusChip = STATUS_CHIP_MAP[av.status] || 'orange';

          return (
            <div key={avId} className={`rounded-[8px] border transition-all ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2 shadow-sm'}`}>
              {/* Level 0: Avaliação */}
              <div
                onClick={() => toggle(avId)}
                className={`p-4 flex items-center justify-between cursor-pointer rounded-t-xl transition-colors ${isDarkMode ? 'hover:bg-neutral-5/40' : 'hover:bg-neutral-1/60'}`}
              >
                <div className="flex items-center gap-3 min-w-0 flex-wrap">
                  <span className="p-0.5 text-neutral-4">{avExpanded ? <ChevronDown size={18} /> : <ChevronRight size={18} />}</span>
                  <Chips label={av.code} status="storm" variant="dark" />
                  <span className="font-bold text-base text-neutral-8 dark:text-white truncate">{av.title}</span>
                  <Chips label={av.status} status={statusChip} variant="dark" />
                  {av.schoolYear && <Chips label={av.schoolYear} status="neutral" variant="stroked" />}
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="text-xs text-neutral-5 dark:text-neutral-4 font-semibold hidden md:inline">{av.municipality} • {av.grade}</span>
                  <Button
                    variant="primary"
                    appearance="solid"
                    size="xs"
                    onClick={(e) => { e.stopPropagation(); onSelectAssessment(av); }}
                  >
                    Inspecionar
                  </Button>
                </div>
              </div>

              {/* Level 1: Testes */}
              {avExpanded && (
                <div className="px-4 pb-4 space-y-3">
                  {av.testsTree?.map((teste, tIdx) => {
                    const testId = `${avId}-t-${tIdx}`;
                    const testExpanded = isExpanded(testId);

                    return (
                      <div key={testId} className="ml-5">
                        {/* Teste Row */}
                        <div
                          onClick={() => toggle(testId)}
                          className="border-l-4 border-l-extended-storm-base bg-extended-storm-extraLight/30 dark:bg-extended-storm-dark/10 rounded-r-xl p-3 flex items-center justify-between cursor-pointer hover:bg-extended-storm-extraLight/60 transition-colors"
                        >
                          <div className="flex items-center gap-2 text-xs font-bold text-extended-storm-dark dark:text-extended-storm-light">
                            {testExpanded ? <ChevronDown size={15} /> : <ChevronRight size={15} />}
                            <BookMarked size={16} className="text-extended-storm-base" />
                            <span>{teste.title}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <Chips label={`${teste.tasks?.length || 0} Tarefas`} status="storm" variant="light" />
                            <Button
                              variant="tertiary"
                              appearance="solid"
                              size="xs"
                              iconLeft={<Plus size={12} />}
                              onClick={(e) => {
                                e.stopPropagation();
                                teste.tasks.push({
                                  title: `Nova Tarefa ${teste.tasks.length + 1}`,
                                  cognitiveProcess: 'Compreender',
                                  responseType: 'Múltipla Escolha',
                                  hasItemComposto: false,
                                  items: []
                                });
                                toggle(testId);
                              }}
                            >
                              + Tarefa
                            </Button>
                          </div>
                        </div>

                        {/* Level 2: Tarefas */}
                        {testExpanded && (
                          <div className="ml-6 mt-2 space-y-2">
                            {teste.tasks?.map((tf, tfIdx) => {
                              const taskId = `${testId}-tf-${tfIdx}`;
                              const taskExpanded = isExpanded(taskId);

                              return (
                                <div key={taskId}>
                                  <div
                                    onClick={() => toggle(taskId)}
                                    className="border-l-4 border-l-extended-orange-base bg-extended-orange-extraLight/30 dark:bg-extended-orange-dark/10 rounded-r-xl p-3 cursor-pointer hover:bg-extended-orange-extraLight/60 transition-colors"
                                  >
                                    <div className="flex items-center justify-between">
                                      <div className="flex items-center gap-2 text-xs font-bold text-extended-orange-dark dark:text-extended-orange-light">
                                        {taskExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                                        <BookOpenText size={15} className="text-extended-orange-base" />
                                        <span>{tf.title}</span>
                                      </div>
                                      
                                      <div className="flex items-center gap-2">
                                        <Chips label={`${tf.items?.length || tf.itemsCount || 0} Itens`} status="orange" variant="light" />
                                        <Button
                                          variant="tertiary"
                                          appearance="solid"
                                          size="xs"
                                          iconLeft={<Plus size={11} />}
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            if (!tf.items) tf.items = [];
                                            tf.items.push({
                                              title: `Item ${tf.items.length + 1}`,
                                              skill: 'EF05LP09',
                                              skillDesc: 'Habilidade de Leitura',
                                              expectation: 'Localizar informações no texto',
                                              descriptor: 'D1',
                                              difficulty: 'Médio',
                                              hasAnswer: true
                                            });
                                            toggle(taskId);
                                          }}
                                        >
                                          + Item
                                        </Button>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 mt-2 ml-7 flex-wrap">
                                      {tf.cognitiveProcess && (
                                        <Chips label={`Cognitivo: ${tf.cognitiveProcess}`} status={COGNITIVE_CHIP_MAP[tf.cognitiveProcess] || 'oliva'} variant="dark" iconLeft={<Brain />} />
                                      )}
                                      {tf.responseType && (
                                        <Chips label={tf.responseType} status="neutral" variant="stroked" />
                                      )}
                                    </div>
                                  </div>

                                  {/* Level 3: Item Composto & Itens */}
                                  {taskExpanded && (
                                    <div className="ml-7 mt-2 space-y-2">
                                      {/* Item Composto (Suporte em Markdown) */}
                                      {tf.hasItemComposto ? (
                                        <div
                                          onClick={() => handleOpenMarkdownModal(
                                            tf.itemCompostoTitle,
                                            tf.itemCompostoMarkdown || `# ${tf.itemCompostoTitle}\n\nTexto de leitura em formato Markdown...`,
                                            ({ title: mdTitle, content: mdContent }) => {
                                              tf.itemCompostoTitle = mdTitle;
                                              tf.itemCompostoMarkdown = mdContent;
                                            }
                                          )}
                                          className="border-l-4 border-l-extended-lavender-base bg-extended-lavender-extraLight/40 dark:bg-extended-lavender-dark/10 rounded-r-xl p-3 flex items-center justify-between cursor-pointer hover:bg-extended-lavender-extraLight/70 transition-colors"
                                        >
                                          <div className="flex items-center gap-2 text-xs font-semibold text-extended-lavender-dark dark:text-extended-lavender-light">
                                            <Route size={15} className="text-extended-lavender-base shrink-0" />
                                            <span>Item Composto (Suporte Markdown):</span>
                                            <strong className="text-neutral-8 dark:text-white">{tf.itemCompostoTitle}</strong>
                                          </div>
                                          <Button variant="secondary" appearance="solid" size="xs" iconLeft={<Eye size={12} />}>
                                            Ver/Editar Markdown
                                          </Button>
                                        </div>
                                      ) : (
                                        <Button
                                          variant="tertiary"
                                          appearance="solid"
                                          size="xs"
                                          iconLeft={<FileText size={13} className="text-extended-lavender-base" />}
                                          onClick={() => handleOpenMarkdownModal(
                                            'Novo Texto de Leitura (Item Composto)',
                                            '# Título do Texto\n\nDigite aqui o texto-base em Markdown...',
                                            ({ title: mdTitle, content: mdContent }) => {
                                              tf.hasItemComposto = true;
                                              tf.itemCompostoTitle = mdTitle;
                                              tf.itemCompostoMarkdown = mdContent;
                                            }
                                          )}
                                          className="w-full justify-center"
                                        >
                                          + Adicionar Suporte de Leitura em Markdown
                                        </Button>
                                      )}

                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                        {(tf.items || []).map((item, iIdx) => (
                                          <div
                                            key={iIdx}
                                            className="border-l-4 border-l-extended-aqua-base bg-extended-aqua-extraLight/20 dark:bg-extended-aqua-dark/10 rounded-r-xl p-3 space-y-2 hover:bg-extended-aqua-extraLight/40 transition-colors"
                                          >
                                            <div className="flex items-center justify-between">
                                              <span className="text-xs font-bold text-extended-aqua-dark dark:text-extended-aqua-light flex items-center gap-1.5">
                                                <Paperclip size={13} className="text-extended-aqua-base" />
                                                {item.title}
                                              </span>
                                              <Chips label={item.hasAnswer ? 'Gabarito ok' : 'Pendente'} status={item.hasAnswer ? 'success' : 'error'} variant="dark" />
                                            </div>

                                            {item.skill && (
                                              <div className="flex items-center gap-2 flex-wrap">
                                                <Chips label={item.skill} status="cherry" variant="dark" iconLeft={<Target />} />
                                                {item.difficulty && (
                                                  <Chips label={item.difficulty} status={item.difficulty === 'Fácil' ? 'success' : item.difficulty === 'Médio' ? 'warning' : 'error'} variant="light" />
                                                )}
                                              </div>
                                            )}

                                            {item.expectation && (
                                              <div className="text-[11px] text-neutral-6 dark:text-neutral-3 leading-snug">
                                                <strong>Expectativa:</strong> {item.expectation}
                                              </div>
                                            )}
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>
      </div>

      {/* Markdown Modal */}
      {activeMarkdownModal && (
        <MarkdownContextModal
          isOpen={true}
          onClose={() => setActiveMarkdownModal(null)}
          initialTitle={activeMarkdownModal.title}
          initialContent={activeMarkdownModal.content}
          onSave={({ title: mdTitle, content: mdContent }) => {
            if (activeMarkdownModal.onSave) activeMarkdownModal.onSave({ title: mdTitle, content: mdContent });
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
}
