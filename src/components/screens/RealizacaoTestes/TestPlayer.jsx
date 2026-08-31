import React from 'react';
import {
  Clock, DoorOpen, PanelRightClose, PanelRightOpen,
  SquareArrowLeft, SquareArrowRight, ArrowLeft, ArrowRight,
  CheckCircle2, AlertTriangle, X
} from 'lucide-react';

import Button from '../../ui/Button';
import Textarea from '../../ui/Textarea';
import TestSubHeader from './TestSubHeader';
import TestSidebar from './TestSidebar';

export default function TestPlayer({
  theme, setTheme,
  activeTest,
  currentTaskIndex, setCurrentTaskIndex,
  activeItemId, setActiveItemId,
  answers,
  flags,
  timeRemaining,
  fontSize, setFontSize,
  showMapModal, setShowMapModal,
  showTaskSuccessModal, setShowTaskSuccessModal,
  showIncompleteWarning, setShowIncompleteWarning,
  collapseTasks, setCollapseTasks,
  formatTime,
  getTaskItems,
  isItemComplete,
  isTaskComplete,
  getTotalItems,
  getTotalAnswered,
  handleAnswer,
  handleToggleFlag,
  handleAttemptFinish,
  handleFinishTest,
  goPrevItem, goNextItem,
  confirmNextTask, jumpToTask,
  scrollToTop, scrollToQuestion,
  setCurrentScreen
}) {
  const [showExitWarning, setShowExitWarning] = React.useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = React.useState(false);
  const [sidebarWidth, setSidebarWidth] = React.useState(360);
  const [isDragging, setIsDragging] = React.useState(false);
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024);
    };
    checkMobile();
    setSidebarWidth(window.innerWidth >= 1280 ? 420 : 320);
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const flatItems = React.useMemo(() => {
    const items = [];
    let globalIdx = 1;
    activeTest.tasks.forEach((task, tIdx) => {
      const taskItems = getTaskItems(task);
      taskItems.forEach((item) => {
        items.push({
          ...item,
          taskIdx: tIdx,
          globalIndex: globalIdx++,
        });
      });
    });
    return items;
  }, [activeTest, getTaskItems]);

  const getItemStatus = (itemId) => {
    const item = flatItems.find(i => i.id === itemId);
    if (!item) return 'unanswered';

    if (item.type === 'hybrid') {
      const hasChoice = answers[`${itemId}_choice`] || answers[itemId];
      const hasText = answers[`${itemId}_text`] && answers[`${itemId}_text`].trim() !== '';
      if (hasChoice && hasText) return 'completed';
      if (hasChoice || hasText) return 'partial';
      return 'unanswered';
    }

    if (isItemComplete(item)) return 'completed';
    return 'unanswered';
  };

  const onAttemptFinish = () => {
    if (getTotalAnswered() < getTotalItems()) {
      setShowIncompleteWarning(true);
    } else {
      setShowSubmitWarning(true);
    }
  };

  const goPrevTask = () => {
    if (currentTaskIndex > 0) {
      const prevIdx = currentTaskIndex - 1;
      setCurrentTaskIndex(prevIdx);
      const prevTask = activeTest.tasks[prevIdx];
      const items = getTaskItems(prevTask);
      if (items.length > 0) {
        setActiveItemId(`question-${items[0].id}`);
        setTimeout(() => {
          scrollToQuestion(`question-${items[0].id}`);
        }, 150);
      }
    }
  };

  const goNextTask = () => {
    if (currentTaskIndex < activeTest.tasks.length - 1) {
      const nextIdx = currentTaskIndex + 1;
      setCurrentTaskIndex(nextIdx);
      const nextTask = activeTest.tasks[nextIdx];
      const items = getTaskItems(nextTask);
      if (items.length > 0) {
        setActiveItemId(`question-${items[0].id}`);
        setTimeout(() => {
          scrollToQuestion(`question-${items[0].id}`);
        }, 150);
      }
    }
  };

  // Scroll automático após selecionar alternativa (300-500ms)
  const handleSelectChoice = (item, choiceId) => {
    if (item.type === 'hybrid') {
      handleAnswer(`${item.id}_choice`, choiceId);
    } else {
      handleAnswer(`${item.id}_choice`, choiceId);
      handleAnswer(item.id, choiceId);
    }

    // Auto-scroll para o próximo item se não for o último geral e se não for híbrido/subjetivo
    const currentFlatIdx = flatItems.findIndex(i => i.id === item.id);
    if (currentFlatIdx !== -1 && currentFlatIdx < flatItems.length - 1) {
      const nextItem = flatItems[currentFlatIdx + 1];
      // Se o próximo item estiver em outra tarefa
      setTimeout(() => {
        if (nextItem.taskIdx !== currentTaskIndex) {
          setCurrentTaskIndex(nextItem.taskIdx);
          setTimeout(() => {
            setActiveItemId(`question-${nextItem.id}`);
            scrollToQuestion(`question-${nextItem.id}`);
          }, 150);
        } else {
          setActiveItemId(`question-${nextItem.id}`);
          scrollToQuestion(`question-${nextItem.id}`);
        }
      }, 400);
    }
  };

  const currentTask = activeTest.tasks[currentTaskIndex];
  const taskItems = getTaskItems(currentTask);
  const currentItemIdClean = activeItemId.replace('question-', '');

  const isFirstItemOverall = currentTaskIndex === 0 && taskItems[0]?.id === currentItemIdClean;
  const lastTaskIndex = activeTest.tasks.length - 1;
  const lastTaskItems = getTaskItems(activeTest.tasks[lastTaskIndex]);
  const isLastItemOverall = currentTaskIndex === lastTaskIndex && lastTaskItems[lastTaskItems.length - 1]?.id === currentItemIdClean;

  return (
    <div className="w-full h-full flex flex-col font-montserrat bg-bg-layout text-textIcon-main transition-colors duration-300 overflow-hidden relative">

      {/* Header Superior da Realização */}
      <TestSubHeader theme={theme} className="bg-brand-950 !border-b-0 shadow-sm shrink-0 z-50 flex flex-col w-full text-white">
        <div className="py-3.5 flex justify-between items-center px-4 md:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4 overflow-hidden flex-1 mr-4">
            <Button
              variant="tertiary"
              appearance="ghost"
              size="md"
              iconOnly
              onClick={() => setShowExitWarning(true)}
              title="Sair da avaliação"
              className="text-white hover:bg-white/10 rounded"
            >
              <DoorOpen size={20} />
            </Button>
            <span className="text-[14px] md:text-[16px] font-bold text-white truncate" title={activeTest.title}>
              {activeTest.title}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            {/* Controle de Fonte */}
            <div className="flex items-center bg-black/40 rounded p-1 shadow-inner hidden md:flex shrink-0 gap-1 border border-white/10">
              <Button
                variant="tertiary"
                appearance="ghost"
                size="xs"
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className="text-white hover:bg-white/10 font-bold text-xs rounded"
                title="Diminuir fonte"
              >
                A-
              </Button>
              <div className="w-px h-4 bg-white/20 mx-0.5"></div>
              <Button
                variant="tertiary"
                appearance="ghost"
                size="xs"
                onClick={() => setFontSize(Math.min(22, fontSize + 2))}
                className="text-white hover:bg-white/10 font-bold text-sm rounded"
                title="Aumentar fonte"
              >
                A+
              </Button>
            </div>

            {/* Cronômetro */}
            <div className="flex items-center gap-2 px-3.5 py-1.5 rounded bg-black/40 text-white font-mono font-bold text-[14px] tracking-wider shadow-inner shrink-0 border border-white/10">
              <Clock size={16} className="text-brand-300" /> {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Minimalist Item Map - Contagem apenas de itens respondíveis */}
        <div className="h-[28px] bg-brand-900 border-t border-b border-brand-800 flex items-center justify-center overflow-x-auto px-4 md:px-8 w-full select-none gap-2 scrollbar-none animate-fade-slide">
          {activeTest.tasks.map((task, taskIdx) => {
            const tItems = getTaskItems(task);
            return (
              <div key={task.id} className="flex items-center gap-[4px] pr-[8px] border-r border-brand-800 last:border-r-0 h-full shrink-0">
                <div
                  onClick={() => jumpToTask(taskIdx)}
                  className={`w-5 h-5 flex items-center justify-center font-bold text-[11px] rounded cursor-pointer transition-colors ${
                    currentTaskIndex === taskIdx
                      ? 'bg-brand-100 text-brand-900'
                      : 'bg-transparent text-brand-200 hover:bg-white/10'
                  }`}
                  title={task.title}
                >
                  {taskIdx + 1}
                </div>
                {tItems.map((item) => {
                  const status = getItemStatus(item.id);
                  const isActiveItem = activeItemId === `question-${item.id}`;
                  
                  let markerClass = '';
                  if (isActiveItem) {
                    markerClass = 'bg-white border-2 border-brand-400';
                  } else {
                    if (status === 'completed') {
                      markerClass = 'bg-brand-400';
                    } else if (status === 'partial') {
                      markerClass = 'bg-semantic-caution-base';
                    } else {
                      markerClass = 'bg-brand-700/60';
                    }
                  }
                  
                  return (
                    <div
                      key={item.id}
                      onClick={() => {
                        jumpToTask(taskIdx);
                        setTimeout(() => {
                          setActiveItemId(`question-${item.id}`);
                          scrollToQuestion(`question-${item.id}`);
                        }, 100);
                      }}
                      className={`h-[10px] rounded-full cursor-pointer transition-all duration-200 ${
                        isActiveItem ? 'w-[48px]' : 'w-[14px]'
                      } ${markerClass}`}
                      title={`Item ${item.number}`}
                    />
                  );
                })}
              </div>
            );
          })}
        </div>
      </TestSubHeader>

      <div className="flex-1 flex overflow-hidden">
        <main id="test-player-main" className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center pt-6 md:pt-8 pb-16 px-4 md:px-8 scroll-smooth relative">
          <div className="w-full max-w-[800px] flex flex-col transition-all duration-300" style={{ fontSize: `${fontSize}px` }}>

            {/* Cabeçalho da Tarefa Atual */}
            {(() => {
              const taskMatch = currentTask.title.match(/^(Tarefa \d+):\s*(.*)$/i);
              const taskLabel = taskMatch ? taskMatch[1] : `Tarefa ${currentTaskIndex + 1}`;
              const taskSub = taskMatch ? taskMatch[2] : currentTask.title;
              return (
                <div className="flex flex-col gap-2.5 mb-6">
                  <div className="flex items-stretch gap-2.5 animate-fade-slide">
                    <div className="w-[4px] bg-brand-500 rounded-sm shrink-0"></div>
                    <div className="flex flex-col justify-center leading-tight">
                      <span className="text-[13px] font-semibold text-textIcon-description tracking-wider">{taskLabel}</span>
                      <h2 className="text-[18px] font-bold text-textIcon-heading">{taskSub}</h2>
                    </div>
                  </div>
                  {currentTask.description && (
                    <div className="w-full px-5 py-4 rounded-lg border bg-bg-container border-border shadow-sm">
                      <p className="text-[14px] md:text-[15px] leading-relaxed text-textIcon-main text-justify font-normal">
                        {currentTask.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            {/* Renderização de Itens e Blocos */}
            <div className="flex flex-col gap-8 mb-8">
              {currentTask.elements.map((el, idx) => {
                const renderItem = (item, uniqueKey) => {
                  const itemComplete = isItemComplete(item);
                  const isCurrentFocus = activeItemId === `question-${item.id}`;

                  return (
                    <div
                      id={`question-${item.id}`}
                      key={uniqueKey}
                      className={`question-item flex flex-col p-6 md:p-8 rounded-lg border shadow-sm transition-all duration-200 bg-bg-container ${
                        isCurrentFocus ? 'border-brand-500 shadow-md ring-1 ring-brand-500' : 'border-border'
                      } animate-fade-slide`}
                    >
                      {/* Título e identificação do item sempre visíveis como texto limpo e hierarquizado */}
                      <div className="flex justify-between items-baseline gap-4 pb-2.5 border-b border-border w-full">
                        <h3 className="font-bold text-textIcon-heading leading-snug flex-1 flex flex-wrap items-baseline gap-1.5" style={{ fontSize: '1.05em' }}>
                          <span className="font-bold text-brand-700 dark:text-brand-300">Item {item.number}.</span>
                          <span className="font-semibold text-textIcon-heading">{item.title}</span>
                        </h3>
                        {itemComplete && (
                          <div className="flex items-center gap-1.5 px-2.5 py-0.5 bg-semantic-success-extraLight text-semantic-success-dark dark:bg-semantic-success-dark/30 dark:text-semantic-success-light rounded text-[12px] font-bold shrink-0 animate-fade-slide">
                            <CheckCircle2 size={13} /> <span>Respondido</span>
                          </div>
                        )}
                      </div>

                      {/* Imagem posicionada logo abaixo do título */}
                      {item.image && (
                        <div className="w-full overflow-hidden mt-4 rounded border border-border bg-neutral-1 dark:bg-neutral-6/30">
                          <img src={item.image} alt="Imagem do item" className="w-full max-h-[380px] object-contain mx-auto" />
                        </div>
                      )}

                      {/* Descrição / Enunciado com largura útil limitada para legibilidade */}
                      <p className="text-textIcon-main leading-relaxed whitespace-pre-line mt-4 max-w-[760px] font-normal" style={{ fontSize: '1em' }}>
                        {item.text}
                      </p>

                      {/* Tabela do item */}
                      {item.table && (
                        <div className="w-full overflow-x-auto mt-4 border rounded-lg border-border bg-bg-container">
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className="border-b border-border bg-neutral-1 dark:bg-neutral-6/50">
                                {item.table.headers.map((header, hIdx) => (
                                  <th key={hIdx} className="px-4 py-2.5 text-[13px] font-bold uppercase tracking-wider text-textIcon-heading">
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {item.table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className="border-b border-border last:border-0 hover:bg-neutral-1/50 dark:hover:bg-neutral-6/20">
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className="px-4 py-2.5 text-[14px] text-textIcon-main font-medium">
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {/* Aviso / Vídeo do item */}
                      {item.notice && (
                        <div className="w-full border-l-4 border-brand-500 p-4 rounded-r-lg mt-4 flex flex-col gap-3 bg-brand-50 dark:bg-brand-950/40">
                          <p className="text-[14px] font-semibold leading-relaxed text-brand-900 dark:text-brand-200">
                            {item.notice.text}
                          </p>
                          {item.notice.videoUrl && (
                            <div className="w-full aspect-video rounded overflow-hidden border border-border bg-black">
                              <iframe
                                src={item.notice.videoUrl}
                                title="Vídeo do item"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Caixa de Atenção */}
                      {item.warningBox && (
                        <div className="w-full flex items-start gap-3 p-4 rounded-lg mt-4 border bg-semantic-caution-extraLight border-semantic-caution-light text-semantic-caution-dark dark:bg-semantic-caution-dark/20 dark:border-semantic-caution-dark">
                          <AlertTriangle className="shrink-0 mt-0.5 text-semantic-caution-base" size={18} />
                          <p className="text-[14px] font-medium leading-normal">
                            {item.warningBox}
                          </p>
                        </div>
                      )}

                      {/* Alternativas Objetivas */}
                      {(item.type === 'single_choice' || item.type === 'hybrid') && (
                        <div className="flex flex-col gap-2.5 mt-5">
                          {item.options?.map((opt) => {
                            const isSelected = answers[`${item.id}_choice`] === opt.id || answers[item.id] === opt.id;
                            return (
                              <label
                                key={opt.id}
                                className={`
                                  flex items-center gap-3.5 p-4 rounded-lg border cursor-pointer transition-all duration-150 group
                                  ${isSelected
                                    ? 'bg-brand-50 border-brand-500 text-brand-900 dark:bg-brand-950/40 dark:border-brand-400 dark:text-white'
                                    : 'bg-bg-container border-border hover:bg-neutral-1/60 hover:border-brand-300 dark:hover:bg-neutral-6/40 text-textIcon-main'
                                  }
                                `}
                              >
                                {/* Marcador Retangular com Radius do Design System */}
                                <div
                                  className={`
                                    w-7 h-7 rounded flex items-center justify-center shrink-0 font-bold text-[13px] transition-colors border
                                    ${isSelected
                                      ? 'bg-brand-500 text-white border-brand-500'
                                      : 'bg-bg-container text-textIcon-description border-border group-hover:border-brand-500 group-hover:text-brand-500'
                                    }
                                  `}
                                >
                                  {opt.id}
                                </div>
                                <span className="font-medium leading-snug flex-1 text-[0.95em]">
                                  {opt.text}
                                </span>
                                <input
                                  type="radio"
                                  name={`item_${item.id}`}
                                  value={opt.id}
                                  className="hidden"
                                  checked={isSelected}
                                  onChange={() => handleSelectChoice(item, opt.id)}
                                />
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {/* Resposta Descritiva / Textarea */}
                      {(item.type === 'subjective' || item.type === 'hybrid') && (
                        <div className="flex flex-col gap-2 mt-5">
                          {item.type === 'hybrid' && (
                            <label className="font-semibold text-[14px] text-textIcon-heading">
                              Como você chegou a essa conclusão?
                            </label>
                          )}
                          <Textarea
                            value={item.type === 'hybrid' ? (answers[`${item.id}_text`] || '') : (answers[`${item.id}_text`] || answers[item.id] || '')}
                            onChange={(e) => {
                              if (item.type === 'hybrid') handleAnswer(`${item.id}_text`, e.target.value);
                              else { handleAnswer(`${item.id}_text`, e.target.value); handleAnswer(item.id, e.target.value); }
                            }}
                            placeholder="Digite sua resposta aqui de forma clara..."
                            className="bg-bg-container text-[14px] min-h-[160px]"
                            style={{ fontSize: '1em', minHeight: '160px' }}
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
                    <div key={`block-${idx}`} className="flex flex-col gap-4 w-full mt-2 animate-fade-slide">
                      <div className="flex flex-col w-full">
                        {/* Bloco de Contexto NÃO entra na numeração global */}
                        <div className="flex flex-col w-full">
                          <span className="font-bold text-[14px] md:text-[15px] tracking-wide text-brand-700 dark:text-brand-300">
                            Textos para os Itens de {startNumber} a {endNumber}
                          </span>
                          <div className="h-[2px] w-full mt-1.5 bg-brand-700 dark:bg-brand-300"></div>
                        </div>

                        {el.title && (
                          <h4 className="text-[16px] md:text-[18px] font-bold text-textIcon-heading leading-tight mt-3">
                            {el.title}
                          </h4>
                        )}

                        <div className="flex flex-col gap-4 p-5 rounded-lg border shadow-sm relative overflow-hidden mt-3 bg-bg-container border-border">
                          {el.context.image && (
                            <div className="w-full overflow-hidden mb-2 rounded border border-border">
                              <img src={el.context.image} alt="Contexto" className="w-full h-auto max-h-[300px] object-contain mx-auto" />
                            </div>
                          )}
                          <p className="text-[14px] md:text-[15px] leading-relaxed text-justify text-textIcon-main font-normal">
                            {el.context.text}
                          </p>
                        </div>
                      </div>

                      {/* Itens do Bloco */}
                      <div className="flex flex-col gap-8 mt-2">
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

        {showMapModal && (
          <TestSidebar
            theme={theme}
            activeTest={activeTest}
            currentTaskIndex={currentTaskIndex}
            activeItemId={activeItemId}
            answers={answers}
            flags={flags}
            handleToggleFlag={handleToggleFlag}
            getTaskItems={getTaskItems}
            isItemComplete={isItemComplete}
            jumpToTask={jumpToTask}
            setActiveItemId={setActiveItemId}
            setShowMapModal={setShowMapModal}
            scrollToQuestion={scrollToQuestion}
            sidebarWidth={sidebarWidth}
            setSidebarWidth={setSidebarWidth}
            isDragging={isDragging}
            setIsDragging={setIsDragging}
            isMobile={isMobile}
          />
        )}
      </div>

      {/* Footer de Navegação */}
      {(() => {
        const answeredCount = getTotalAnswered();
        const totalCount = getTotalItems();
        const submitVariant = answeredCount === totalCount ? 'primary' : 'secondary';
        return (
          <div className="h-[84px] shrink-0 bg-bg-container border-t border-border flex justify-between items-center px-4 md:px-8 shadow-md transition-colors duration-300 gap-4 z-40">
            {/* Esquerda: Tarefa anterior, Item anterior */}
            <div className="flex-1 flex justify-start items-center gap-2 md:gap-3">
              <Button
                variant="secondary"
                appearance="ghost"
                size="md"
                iconOnly
                onClick={goPrevTask}
                disabled={currentTaskIndex === 0}
                title="Tarefa anterior"
                className="rounded"
              >
                <SquareArrowLeft size={20} />
              </Button>

              <Button
                variant="secondary"
                appearance="ghost"
                size="md"
                uppercase={false}
                onClick={goPrevItem}
                disabled={isFirstItemOverall}
                iconLeft={<ArrowLeft size={18} />}
                className="!px-0 sm:!px-4 !w-[40px] sm:!w-auto rounded"
                title="Item anterior"
              >
                <span className="hidden sm:inline">Item anterior</span>
              </Button>
            </div>

            {/* Centro: Ação secundária Sair da avaliação + Ação principal Entregar avaliação */}
            <div className="flex items-center justify-center gap-3">
              <Button
                variant="tertiary"
                appearance="ghost"
                size="md"
                uppercase={false}
                onClick={() => setShowExitWarning(true)}
                className="rounded hidden sm:flex text-textIcon-description hover:text-textIcon-heading"
                title="Sair da avaliação"
              >
                Sair da avaliação
              </Button>

              <Button
                variant={submitVariant}
                appearance="solid"
                size="md"
                uppercase={false}
                onClick={onAttemptFinish}
                className="min-w-[160px] rounded shadow-sm"
                title="Entregar avaliação"
              >
                Entregar avaliação
              </Button>
            </div>

            {/* Direita: Próximo item, Próxima tarefa */}
            <div className="flex-1 flex justify-end items-center gap-2 md:gap-3">
              <Button
                variant="secondary"
                appearance="ghost"
                size="md"
                uppercase={false}
                onClick={goNextItem}
                disabled={isLastItemOverall}
                iconRight={<ArrowRight size={18} />}
                className="!px-0 sm:!px-4 !w-[40px] sm:!w-auto rounded"
                title="Próximo item"
              >
                <span className="hidden sm:inline">Próximo item</span>
              </Button>

              <Button
                variant="secondary"
                appearance="ghost"
                size="md"
                iconOnly
                onClick={goNextTask}
                disabled={currentTaskIndex === activeTest.tasks.length - 1}
                title="Próxima tarefa"
                className="rounded"
              >
                <SquareArrowRight size={20} />
              </Button>
            </div>
          </div>
        );
      })()}

      {/* Modais Padronizados */}

      {/* Modal: Caderno Concluído */}
      {showTaskSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className="w-full max-w-[420px] bg-bg-container border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col p-6 md:p-8 text-center relative">
            <Button
              variant="tertiary"
              appearance="ghost"
              size="sm"
              iconOnly
              onClick={() => setShowTaskSuccessModal(false)}
              className="absolute top-4 right-4 rounded text-textIcon-description"
              title="Fechar"
            >
              <X size={18} />
            </Button>
            <div className="w-16 h-16 bg-semantic-success-extraLight dark:bg-semantic-success-dark/30 rounded-full flex items-center justify-center mx-auto mb-5 text-semantic-success-base">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-[20px] font-bold text-textIcon-heading leading-tight mb-2">Tarefa concluída!</h3>
            <p className="text-[14px] text-textIcon-description mb-6 font-medium">Você respondeu a todos os itens desta tarefa com sucesso.</p>
            <Button
              variant="primary"
              appearance="solid"
              size="md"
              uppercase={false}
              onClick={confirmNextTask}
              className="w-full rounded"
            >
              Ir para a próxima tarefa
            </Button>
          </div>
        </div>
      )}

      {/* Modal de Entrega: Quando há itens em branco */}
      {showIncompleteWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className="w-full max-w-[440px] bg-bg-container border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col p-6 md:p-8 text-center relative">
            <Button
              variant="tertiary"
              appearance="ghost"
              size="sm"
              iconOnly
              onClick={() => setShowIncompleteWarning(false)}
              className="absolute top-4 right-4 rounded text-textIcon-description"
              title="Fechar"
            >
              <X size={18} />
            </Button>
            <div className="w-16 h-16 bg-semantic-caution-extraLight dark:bg-semantic-caution-dark/30 rounded-full flex items-center justify-center mx-auto mb-5 text-semantic-caution-base">
              <AlertTriangle size={36} />
            </div>
            <h3 className="text-[20px] font-bold text-textIcon-heading leading-tight mb-2">Itens em branco</h3>
            <p className="text-[14px] text-textIcon-description mb-6 font-medium">
              Você possui <strong className="text-textIcon-heading">{getTotalItems() - getTotalAnswered()} item(ns)</strong> em branco. Deseja entregar a avaliação mesmo assim?
            </p>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="primary"
                appearance="solid"
                size="md"
                uppercase={false}
                onClick={() => setShowIncompleteWarning(false)}
                className="w-full rounded"
              >
                Voltar e responder
              </Button>
              <Button
                variant="tertiary"
                appearance="solid"
                size="md"
                uppercase={false}
                onClick={handleFinishTest}
                className="w-full rounded text-textIcon-description"
              >
                Entregar mesmo assim
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Sair da Avaliação */}
      {showExitWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className="w-full max-w-[440px] bg-bg-container border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col p-6 md:p-8 text-center relative">
            <Button
              variant="tertiary"
              appearance="ghost"
              size="sm"
              iconOnly
              onClick={() => setShowExitWarning(false)}
              className="absolute top-4 right-4 rounded text-textIcon-description"
              title="Fechar"
            >
              <X size={18} />
            </Button>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-semantic-error-base bg-semantic-error-extraLight dark:bg-semantic-error-dark/30">
              <DoorOpen size={36} />
            </div>
            <h3 className="text-[20px] font-bold text-textIcon-heading leading-tight mb-2">Sair da avaliação?</h3>
            <p className="text-[14px] text-textIcon-description mb-6 font-medium">
              A avaliação ainda não será entregue. Suas respostas salvas serão preservadas e você poderá continuar posteriormente enquanto houver prazo disponível.
            </p>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="primary"
                appearance="solid"
                size="md"
                uppercase={false}
                onClick={() => setShowExitWarning(false)}
                className="w-full rounded"
              >
                Continuar avaliação
              </Button>
              <Button
                variant="tertiary"
                appearance="solid"
                size="md"
                uppercase={false}
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full rounded text-semantic-error-base hover:bg-semantic-error-extraLight dark:hover:bg-semantic-error-dark/20 border-semantic-error-light"
              >
                Sair da avaliação
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Entrega: Todos os itens respondidos */}
      {showSubmitWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className="w-full max-w-[440px] bg-bg-container border border-border rounded-lg shadow-2xl overflow-hidden flex flex-col p-6 md:p-8 text-center relative">
            <Button
              variant="tertiary"
              appearance="ghost"
              size="sm"
              iconOnly
              onClick={() => setShowSubmitWarning(false)}
              className="absolute top-4 right-4 rounded text-textIcon-description"
              title="Fechar"
            >
              <X size={18} />
            </Button>
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-5 text-brand-500 bg-brand-100 dark:bg-brand-950/40">
              <CheckCircle2 size={36} />
            </div>
            <h3 className="text-[20px] font-bold text-textIcon-heading leading-tight mb-2">Entregar avaliação?</h3>
            <p className="text-[14px] text-textIcon-description mb-6 font-medium">
              Você respondeu a todos os itens desta avaliação. Após a entrega, as respostas serão registradas e não poderão mais ser alteradas.
            </p>
            <div className="flex flex-col gap-2.5">
              <Button
                variant="primary"
                appearance="solid"
                size="md"
                uppercase={false}
                onClick={handleFinishTest}
                className="w-full rounded shadow-sm"
              >
                Confirmar entrega
              </Button>
              <Button
                variant="tertiary"
                appearance="solid"
                size="md"
                uppercase={false}
                onClick={() => setShowSubmitWarning(false)}
                className="w-full rounded"
              >
                Voltar à avaliação
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Botão flutuante para alternar visualização do Mapa de Itens */}
      <div 
        className={`absolute z-[800] ${isDragging ? '' : 'transition-all duration-300'}`}
        style={{ 
          right: showMapModal ? (isMobile ? '320px' : `${sidebarWidth}px`) : '0px',
          top: (isMobile && showMapModal) ? '8px' : '96px'
        }}
      >
        <button
          onClick={() => setShowMapModal(!showMapModal)}
          className={`
            h-[38px] flex items-center transition-all duration-150 cursor-pointer outline-none border-0
            bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700
            rounded-l rounded-r-none shadow-md
            ${showMapModal ? 'w-[38px] justify-center px-0' : 'px-3.5 gap-2 font-semibold text-[13px]'}
          `}
          title={showMapModal ? "Ocultar mapa de itens" : "Exibir mapa de itens"}
        >
          {showMapModal ? (
            <PanelRightClose size={18} />
          ) : (
            <>
              <PanelRightOpen size={18} />
              <span>Mapa de Itens</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}

