import React from 'react';
import {
  Sun, Moon, LayoutGrid, Clock, Flag,
  ChevronLeft, ChevronRight, CheckCircle2, X, Send,
  BookOpen, AlertTriangle, Minimize2, Maximize2, DoorOpen,
  PanelRightClose, PanelRightOpen, SquareArrowLeft, SquareArrowRight,
  ArrowLeft, ArrowRight, ListTodo, BookMarked
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
      handleAttemptFinish();
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

  const t = {
    bgApp: theme === 'dark' ? 'bg-[#0B121A]' : 'bg-[#FFFFFF]',
    bgHeader: theme === 'dark' ? 'bg-[#151E28]' : 'bg-white',
    bgSubHeader: 'bg-brand-ultraDark',
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

  const currentTask = activeTest.tasks[currentTaskIndex];
  const taskItems = getTaskItems(currentTask);
  const currentItemIdClean = activeItemId.replace('question-', '');

  const isFirstItemOverall = currentTaskIndex === 0 && taskItems[0]?.id === currentItemIdClean;
  const lastTaskIndex = activeTest.tasks.length - 1;
  const lastTaskItems = getTaskItems(activeTest.tasks[lastTaskIndex]);
  const isLastItemOverall = currentTaskIndex === lastTaskIndex && lastTaskItems[lastTaskItems.length - 1]?.id === currentItemIdClean;

  return (
    <div className={`w-full h-full flex flex-col font-['Montserrat',sans-serif] ${t.bgApp} transition-colors duration-300 overflow-hidden relative`}>
      {/* Floating Toggle Button (visible in both states, transitions smoothly) */}
      <div 
        className={`fixed z-[800] ${isDragging ? '' : 'transition-all duration-300'} top-[140px]`}
        style={{ right: showMapModal ? (isMobile ? '320px' : `${sidebarWidth}px`) : '0px' }}
      >
        <button
          onClick={() => setShowMapModal(!showMapModal)}
          className={`
            h-[40px] px-4 flex items-center gap-2 font-bold text-[14px] transition-all duration-150
            bg-brand-ultraDark text-white border border-brand-dark border-r-0
            rounded-l-[8px] cursor-pointer outline-none hover:bg-brand-dark active:scale-[0.97]
            shadow-[0_4px_12px_rgba(0,0,0,0.15)]
          `}
          title={showMapModal ? "Colapsar Mapa de Itens" : "Expandir Mapa de Itens"}
        >
          {showMapModal ? <PanelRightClose size={18} className="text-brand-light" /> : <PanelRightOpen size={18} className="text-brand-light" />}
          <span>Mapa de Itens</span>
        </button>
      </div>

      <TestSubHeader theme={theme} className="bg-brand-ultraDark !border-b-0 shadow-sm shrink-0 z-50 flex flex-col w-full">
        <div className="py-4 flex justify-between items-center px-4 md:px-8 transition-colors duration-300">
          <div className="flex items-center gap-4 overflow-hidden flex-1 mr-4">
            <Button
              variant="secondary"
              appearance="solid"
              size="md"
              iconOnly
              onClick={() => setShowExitWarning(true)}
              title="Sair da Avaliação"
              className="rounded-[4px]"
            >
              <DoorOpen size={20} />
            </Button>
            <span className="text-[14px] md:text-[15px] font-bold text-white truncate" title={activeTest.title}>
              {activeTest.title}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center bg-black/45 rounded-[4px] p-1 shadow-inner hidden md:flex shrink-0 gap-1">
              <Button
                variant="tertiary"
                appearance="ghost"
                size="xs"
                onClick={() => setFontSize(Math.max(14, fontSize - 2))}
                className="text-white hover:bg-white/10 font-bold text-xs rounded-[4px]"
                title="Diminuir fonte"
              >
                A-
              </Button>
              <div className="w-px h-4 bg-gray-600 mx-0.5"></div>
              <Button
                variant="tertiary"
                appearance="ghost"
                size="xs"
                onClick={() => setFontSize(Math.min(24, fontSize + 2))}
                className="text-white hover:bg-white/10 font-bold text-sm rounded-[4px]"
                title="Aumentar fonte"
              >
                A+
              </Button>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-[4px] bg-black/40 text-white font-mono font-bold text-[14px] tracking-widest shadow-inner shrink-0">
              <Clock size={16} className="text-[#94CFEF]" /> {formatTime(timeRemaining)}
            </div>
          </div>
        </div>

        {/* Minimalist Item Map */}
        {!showMapModal && (
          <div className="h-[28px] bg-brand-ultraDark border-t border-b border-brand-dark flex items-center justify-center overflow-x-auto px-4 md:px-8 w-full select-none gap-2 scrollbar-none animate-fade-slide">
            {activeTest.tasks.map((task, taskIdx) => {
              const taskItems = getTaskItems(task);
              return (
                <div key={task.id} className="flex items-center gap-[4px] pr-[8px] border-r border-brand-dark last:border-r-0 h-full shrink-0">
                  {/* Task square */}
                  <div
                    onClick={() => jumpToTask(taskIdx)}
                    className={`w-5 h-5 flex items-center justify-center font-bold text-[11px] rounded-[4px] cursor-pointer transition-colors ${
                      currentTaskIndex === taskIdx
                        ? 'bg-brand-light text-brand-ultraDark'
                        : 'bg-transparent text-brand-light hover:bg-white/10'
                    }`}
                  >
                    {taskIdx + 1}
                  </div>
                  {/* Item markers */}
                  {taskItems.map((item) => {
                    const status = getItemStatus(item.id);
                    const isActiveItem = activeItemId === `question-${item.id}`;
                    
                    let markerClass = '';
                    if (isActiveItem) {
                      markerClass = 'bg-[var(--neutral-0)] border-2 border-brand-base';
                    } else {
                      if (status === 'completed') {
                        markerClass = 'bg-brand-base';
                      } else if (status === 'partial') {
                        markerClass = 'bg-secondary-base';
                      } else {
                        markerClass = 'bg-neutral-3';
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
                        className={`h-[12px] rounded-[999px] cursor-pointer transition-all duration-300 ${
                          isActiveItem ? 'w-[64px]' : 'w-[16px]'
                        } ${markerClass}`}
                        title={`Item ${item.number}`}
                      />
                    );
                  })}
                </div>
              );
            })}
          </div>
        )}
      </TestSubHeader>

      <div className="flex-1 flex overflow-hidden">
        <main id="test-player-main" className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center pt-6 md:pt-8 pb-16 px-4 md:px-8 scroll-smooth relative">
          <div className={`w-full max-w-[800px] flex flex-col transition-all duration-300`} style={{ fontSize: `${fontSize}px` }}>

            {/* Task label + title — scrolls with content */}
            {(() => {
              const taskMatch = currentTask.title.match(/^(Tarefa \d+):\s*(.*)$/i);
              const taskLabel = taskMatch ? taskMatch[1] : `Tarefa ${currentTaskIndex + 1}`;
              const taskSub = taskMatch ? taskMatch[2] : currentTask.title;
              const t2 = { textMain: theme === 'dark' ? 'text-white' : 'text-neutral-7' };
              return (
                <div className="flex flex-col gap-2 mb-[24px]">
                  <div className="flex items-stretch gap-2 animate-fade-slide">
                    <div className="w-[6px] bg-[#008BC9] rounded-sm shrink-0"></div>
                    <div className="flex flex-col justify-center leading-tight">
                      <span className="text-[14px] font-medium text-gray-500 tracking-wider">{taskLabel}</span>
                      <h2 className={`text-[18px] font-semibold ${t2.textMain}`}>{taskSub}</h2>
                    </div>
                  </div>
                  {currentTask.description && (
                    <div className={`w-full px-[20px] pt-[16px] pb-[24px] rounded-[8px] border ${theme === 'dark' ? 'bg-neutral-6 border-neutral-2' : 'bg-neutral-1 border-[var(--neutral-2)]'}`}>
                      <p className={`text-[14px] md:text-[15px] leading-relaxed text-justify ${theme === 'dark' ? 'text-neutral-1' : 'text-neutral-7'}`}>
                        {currentTask.description}
                      </p>
                    </div>
                  )}
                </div>
              );
            })()}

            <div className="flex flex-col gap-10 mb-8">
              {currentTask.elements.map((el, idx) => {
                const renderItem = (item, uniqueKey) => {
                  const itemComplete = isItemComplete(item);
                  const isCurrentFocus = activeItemId === `question-${item.id}`;
                  let cardClass = `${t.cardBg} ${t.cardBorder}`;

                  if (isCurrentFocus) {
                    cardClass = `${t.cardBg} border-[#008BC9] shadow-md ring-2 ${theme === 'dark' ? 'ring-[#003A79]' : 'ring-[#D9F0FC]'}`;
                  }

                  return (
                    <div id={`question-${item.id}`} key={uniqueKey} className={`question-item flex flex-col p-6 md:p-8 rounded-[8px] border-2 shadow-sm transition-all duration-300 ${cardClass} animate-fade-slide`}>
                      <div className="flex justify-between items-end gap-4 pb-2 border-b-2 border-[#008BC9] w-full">
                        <h3 className={`font-bold ${t.textMain} leading-tight flex-1 flex flex-wrap items-baseline gap-2`} style={{ fontSize: '1.1em' }}>
                          <span className={`font-semibold ${theme === 'dark' ? 'text-[#94CFEF]' : 'text-[#0C63AA]'}`}>Item {item.number}.</span>
                          <span className="font-medium">{item.title}</span>
                        </h3>
                        <div className="flex items-center gap-2 mb-0.5 shrink-0">
                          {itemComplete && (
                            <div className="flex items-center gap-1.5 px-3 py-1 bg-[#10B981] text-white rounded-[4px] text-[12px] font-bold shadow-sm shrink-0 animate-fade-slide" style={{ height: '28px' }}>
                              <CheckCircle2 size={14} /> <span className="hidden sm:inline">Respondida</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {item.image && (
                        <div className="w-full overflow-hidden mt-[8px]">
                          <img src={item.image} alt="Imagem da questão" className="w-full max-h-[400px] object-contain" />
                        </div>
                      )}

                      <p className={`${t.textMain} leading-relaxed whitespace-pre-line mt-[8px]`} style={{ fontSize: '1em' }}>{item.text}</p>

                      {item.table && (
                        <div className={`w-full overflow-x-auto mt-[8px] border rounded-[8px] shadow-inner ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
                          <table className="w-full text-left border-collapse">
                            <thead>
                              <tr className={`border-b ${theme === 'dark' ? 'bg-gray-900/50 border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
                                {item.table.headers.map((header, hIdx) => (
                                  <th key={hIdx} className={`px-5 py-3 text-[13px] font-bold uppercase tracking-wider ${theme === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>
                                    {header}
                                  </th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {item.table.rows.map((row, rIdx) => (
                                <tr key={rIdx} className={`border-b last:border-0 transition-colors ${theme === 'dark' ? 'border-gray-800 hover:bg-gray-800/20' : 'border-gray-150 hover:bg-gray-50/55'}`}>
                                  {row.map((cell, cIdx) => (
                                    <td key={cIdx} className={`px-5 py-3 text-[14px] font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                                      {cell}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      )}

                      {item.notice && (
                        <div className={`w-full border-l-4 border-[#008BC9] p-5 rounded-r-[8px] mt-[8px] flex flex-col gap-4 ${theme === 'dark' ? 'bg-[#003A79]/15' : 'bg-[#F0F9FF]'}`}>
                          <p className={`text-[14px] font-semibold leading-relaxed ${theme === 'dark' ? 'text-[#94CFEF]' : 'text-[#003A79]'}`}>
                            {item.notice.text}
                          </p>
                          {item.notice.videoUrl && (
                            <div className={`w-full aspect-video rounded-[8px] overflow-hidden border shadow-sm bg-black ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
                              <iframe
                                src={item.notice.videoUrl}
                                title="YouTube video player"
                                frameBorder="0"
                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                                allowFullScreen
                                className="w-full h-full"
                              ></iframe>
                            </div>
                          )}
                        </div>
                      )}

                      {item.warningBox && (
                        <div className={`w-full flex items-start gap-3 p-4 rounded-[8px] mt-[8px] shadow-inner border ${theme === 'dark'
                          ? 'bg-yellow-950/10 border-yellow-900/30'
                          : 'bg-yellow-50 border-yellow-250'
                          }`}>
                          <AlertTriangle className={`shrink-0 mt-0.5 ${theme === 'dark' ? 'text-yellow-400' : 'text-yellow-600'}`} size={18} />
                          <p className={`text-[14px] font-medium leading-normal ${theme === 'dark' ? 'text-yellow-300' : 'text-yellow-800'}`}>
                            {item.warningBox}
                          </p>
                        </div>
                      )}

                      {(item.type === 'single_choice' || item.type === 'hybrid') && (
                        <div className="flex flex-col gap-4 mt-[16px]">
                          {item.options?.map((opt) => {
                            const isSelected = answers[`${item.id}_choice`] === opt.id || answers[item.id] === opt.id;
                            return (
                              <label key={opt.id} className={`flex items-center gap-4 p-5 rounded-[8px] border-2 cursor-pointer transition-all duration-200 group ${isSelected ? `${t.activeOptionBg} ${t.activeOptionBorder} shadow-md transform scale-[1.01]` : `${t.optionBg} ${t.optionBorder} ${t.optionHover}`}`}>
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
                        <>
                          {item.type === 'hybrid' && (
                            <span className={`font-semibold text-[14px] ${theme === 'dark' ? 'text-neutral-1' : 'text-neutral-7'} mt-[16px]`}>
                              Como você chegou a essa conclusão?
                            </span>
                          )}
                          <Textarea
                            value={item.type === 'hybrid' ? (answers[`${item.id}_text`] || '') : (answers[`${item.id}_text`] || answers[item.id] || '')}
                            onChange={(e) => {
                              if (item.type === 'hybrid') handleAnswer(`${item.id}_text`, e.target.value);
                              else { handleAnswer(`${item.id}_text`, e.target.value); handleAnswer(item.id, e.target.value); }
                            }}
                            placeholder="Digite sua resposta aqui de forma clara..."
                            className={`w-full !p-5 focus:!border-[#008BC9] focus:!ring-4 focus:!ring-[#008BC9]/20 ${item.type === 'hybrid' ? 'mt-[4px]' : 'mt-[16px]'}`}
                            style={{
                              borderColor: (answers[`${item.id}_text`] || answers[item.id]) ? '#008BC9' : (theme === 'dark' ? '#2A3B4C' : '#E5E7EB'),
                              fontSize: '1em',
                              minHeight: '160px'
                            }}
                          />
                        </>
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
                    <div key={`block-${idx}`} className="flex flex-col gap-5 w-full mt-4 animate-fade-slide">
                      <div className="flex flex-col w-full">
                        {/* Header: Textos para os itens de X a Y */}
                        <div className="flex flex-col w-full">
                          <span className={`font-bold text-[14px] md:text-[15px] tracking-wide ${theme === 'dark' ? 'text-[#94CFEF]' : 'text-[#003A79]'}`}>
                            Textos para os Itens de {startNumber} a {endNumber}
                          </span>
                          {/* Divider line 2px thick primary.dark */}
                          <div className={`h-[2px] w-full mt-2 ${theme === 'dark' ? 'bg-[#0C63AA]' : 'bg-[#003A79]'}`}></div>
                        </div>

                        {/* Title of block of items (gap of 8px from header) */}
                        {el.title && (
                          <h4 className={`text-[16px] md:text-[18px] font-bold ${t.textMain} leading-tight mt-[8px]`}>
                            {el.title}
                          </h4>
                        )}

                        {/* Box (gap of 16px from title or header) */}
                        <div className={`flex flex-col gap-4 px-[20px] pt-[16px] pb-[24px] rounded-[8px] border shadow-sm relative overflow-hidden mt-[16px] ${theme === 'dark'
                          ? 'bg-neutral-6 border-neutral-2'
                          : 'bg-neutral-1 border-neutral-2'
                          }`}>
                          {el.context.image && (
                            <div className="w-full overflow-hidden mb-2">
                              <img src={el.context.image} alt="Contexto" className="w-full h-auto max-h-[300px] object-contain mx-auto" />
                            </div>
                          )}
                          <p className={`text-[14px] md:text-[15px] leading-relaxed text-justify ${theme === 'dark' ? 'text-neutral-1' : 'text-neutral-7'}`}>
                            {el.context.text}
                          </p>
                        </div>
                      </div>

                      {/* Items inside the block (no left border line) */}
                      <div className="flex flex-col gap-10 mt-2">
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

      {/* Footer Navigation bar */}
      {(() => {
        const answeredCount = getTotalAnswered();
        const totalCount = getTotalItems();
        const isSubmitDisabled = answeredCount < 2;
        const submitVariant = answeredCount === totalCount ? 'primary' : 'secondary';
        return (
          <div className={`h-[88px] shrink-0 ${theme === 'dark' ? 'bg-[#0B121A]' : 'bg-white'} border-t ${t.border} flex justify-between items-center px-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] transition-colors duration-300 gap-4 z-40`}>
            {/* Left buttons (Anteriores) */}
            <div className="flex-1 flex justify-start items-center gap-3">
              {/* Square Arrow Left - Prev Task */}
              <Button
                variant="secondary"
                appearance="ghost"
                size="lg"
                iconOnly
                onClick={goPrevTask}
                disabled={currentTaskIndex === 0}
                title="Tarefa Anterior"
                className="rounded-[4px]"
              >
                <SquareArrowLeft size={20} />
              </Button>

              {/* Arrow Left + Item Anterior */}
              <Button
                variant="secondary"
                appearance="ghost"
                size="lg"
                onClick={goPrevItem}
                disabled={isFirstItemOverall}
                iconLeft={<ArrowLeft size={20} />}
                className="!px-0 sm:!px-[24px] !w-[48px] sm:!w-auto rounded-[4px]"
                title="Item Anterior"
              >
                <span className="hidden sm:inline">Item Anterior</span>
              </Button>
            </div>

            {/* Middle button (Enviar Teste) */}
            <div className="flex-1 flex justify-center items-center">
              {/* Enviar Teste */}
              <Button
                variant={submitVariant}
                appearance="solid"
                size="lg"
                onClick={onAttemptFinish}
                disabled={isSubmitDisabled}
                className="shadow-md min-w-[160px] rounded-[4px]"
                title="Enviar Teste"
              >
                Enviar Teste
              </Button>
            </div>

            {/* Right buttons (Próximos) */}
            <div className="flex-1 flex justify-end items-center gap-3">
              {/* Arrow Right + Próximo Item */}
              <Button
                variant="secondary"
                appearance="ghost"
                size="lg"
                onClick={goNextItem}
                disabled={isLastItemOverall}
                iconRight={<ArrowRight size={20} />}
                className="!px-0 sm:!px-[24px] !w-[48px] sm:!w-auto rounded-[4px]"
                title="Próximo Item"
              >
                <span className="hidden sm:inline">Próximo Item</span>
              </Button>

              {/* Square Arrow Right - Next Task */}
              <Button
                variant="secondary"
                appearance="ghost"
                size="lg"
                iconOnly
                onClick={goNextTask}
                disabled={currentTaskIndex === activeTest.tasks.length - 1}
                title="Próxima Tarefa"
                className="rounded-[4px]"
              >
                <SquareArrowRight size={20} />
              </Button>
            </div>
          </div>
        );
      })()}

      {/* Warnings & Modals */}
      {showTaskSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className={`w-full max-w-[400px] ${t.cardBg} rounded-[8px] shadow-2xl overflow-hidden flex flex-col p-8 text-center border-t-8 border-[#10B981] relative`}>
            <Button
              variant="tertiary"
              appearance="ghost"
              size="sm"
              iconOnly
              onClick={() => setShowTaskSuccessModal(false)}
              className="absolute top-4 right-4 rounded-[4px] text-gray-500 hover:bg-gray-105"
            >
              <X size={20} />
            </Button>
            <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#10B981]">
              <CheckCircle2 size={40} />
            </div>
            <h3 className={`text-[24px] font-black ${t.textMain} leading-tight mb-2`}>Caderno Concluído!</h3>
            <p className="text-[15px] text-gray-500 mb-8 font-medium">Você respondeu a todas as questões deste caderno com sucesso.</p>
            <Button
              variant="primary"
              appearance="solid"
              size="lg"
              onClick={confirmNextTask}
              className="w-full shadow-lg rounded-[4px]"
            >
              Ir para o Próximo Caderno
            </Button>
          </div>
        </div>
      )}

      {showIncompleteWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className={`w-full max-w-[440px] ${t.cardBg} rounded-[8px] shadow-2xl overflow-hidden flex flex-col p-8 text-center border-t-8 border-[#F59E0B] relative`}>
            <div className="w-20 h-20 bg-[#FEF3C7] rounded-full flex items-center justify-center mx-auto mb-6 text-[#F59E0B]">
              <AlertTriangle size={40} />
            </div>
            <h3 className={`text-[22px] font-black ${t.textMain} leading-tight mb-2`}>Atenção!</h3>
            <p className="text-[15px] text-gray-500 mb-8 font-medium">Você possui <strong className={theme === 'dark' ? 'text-white' : 'text-[#1D2432]'}>{getTotalItems() - getTotalAnswered()} questão(ões)</strong> em branco. Tem certeza que deseja enviar a prova agora?</p>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                appearance="solid"
                size="lg"
                onClick={() => setShowIncompleteWarning(false)}
                className="w-full shadow-md rounded-[4px]"
              >
                Voltar e Responder
              </Button>
              <Button
                variant="tertiary"
                appearance="solid"
                size="lg"
                onClick={handleFinishTest}
                className="w-full rounded-[4px]"
              >
                Enviar Mesmo Assim
              </Button>
            </div>
          </div>
        </div>
      )}

      {showExitWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className={`w-full max-w-[440px] ${t.cardBg} rounded-[8px] shadow-2xl overflow-hidden flex flex-col p-8 text-center border-t-8 border-[#EF4444] relative`}>
            <Button
              variant="tertiary"
              appearance="ghost"
              size="sm"
              iconOnly
              onClick={() => setShowExitWarning(false)}
              className="absolute top-4 right-4 rounded-[4px]"
            >
              <X size={20} />
            </Button>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 ${theme === 'dark' ? 'bg-red-950/50' : 'bg-red-100'}`}>
              <DoorOpen size={40} />
            </div>
            <h3 className={`text-[22px] font-black ${t.textMain} leading-tight mb-2`}>Sair da Avaliação?</h3>
            <p className="text-[15px] text-gray-500 mb-8 font-medium">
              Suas respostas salvas até o momento não serão perdidas. Você poderá continuar a avaliação mais tarde, desde que esteja dentro do prazo de entrega.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                appearance="solid"
                size="lg"
                onClick={() => setShowExitWarning(false)}
                className="w-full shadow-md rounded-[4px]"
              >
                Continuar Avaliação
              </Button>
              <Button
                variant="tertiary"
                appearance="solid"
                size="lg"
                onClick={() => setCurrentScreen('dashboard')}
                className="w-full !border-red-500 !text-red-500 hover:!bg-red-50 dark:hover:!bg-red-950/20 rounded-[4px]"
              >
                Sim, Sair da Prova
              </Button>
            </div>
          </div>
        </div>
      )}

      {showSubmitWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className={`w-full max-w-[440px] ${t.cardBg} rounded-[8px] shadow-2xl overflow-hidden flex flex-col p-8 text-center border-t-8 border-[#008BC9] relative`}>
            <Button
              variant="tertiary"
              appearance="ghost"
              size="sm"
              iconOnly
              onClick={() => setShowSubmitWarning(false)}
              className="absolute top-4 right-4 rounded-[4px]"
            >
              <X size={20} />
            </Button>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#008BC9] ${theme === 'dark' ? 'bg-[#003A79]/30' : 'bg-[#D9F0FC]'}`}>
              <CheckCircle2 size={40} />
            </div>
            <h3 className={`text-[22px] font-black ${t.textMain} leading-tight mb-2`}>Entregar Avaliação?</h3>
            <p className="text-[15px] text-gray-500 mb-8 font-medium">
              Você respondeu a todas as questões desta avaliação. Ao entregar, suas respostas serão registradas e você não poderá mais alterá-las.
            </p>
            <div className="flex flex-col gap-3">
              <Button
                variant="primary"
                appearance="solid"
                size="lg"
                onClick={handleFinishTest}
                className="w-full shadow-md rounded-[4px]"
              >
                Confirmar e Entregar
              </Button>
              <Button
                variant="tertiary"
                appearance="solid"
                size="lg"
                onClick={() => setShowSubmitWarning(false)}
                className="w-full rounded-[4px]"
              >
                Voltar ao Teste
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
