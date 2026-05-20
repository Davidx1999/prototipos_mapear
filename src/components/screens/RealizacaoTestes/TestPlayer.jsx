import React from 'react';
import {
  Sun, Moon, LayoutGrid, Clock, Flag,
  ChevronLeft, ChevronRight, CheckCircle2, X, Send,
  BookOpen, AlertTriangle, Minimize2, Maximize2, DoorOpen
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
  setCurrentScreen
}) {
  const [showExitWarning, setShowExitWarning] = React.useState(false);
  const [showSubmitWarning, setShowSubmitWarning] = React.useState(false);

  const onAttemptFinish = () => {
    if (getTotalAnswered() < getTotalItems()) {
      handleAttemptFinish();
    } else {
      setShowSubmitWarning(true);
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
  const isCurrentItemFlagged = flags[currentItemIdClean];

  const isFirstItemOverall = currentTaskIndex === 0 && taskItems[0]?.id === currentItemIdClean;
  const lastTaskIndex = activeTest.tasks.length - 1;
  const lastTaskItems = getTaskItems(activeTest.tasks[lastTaskIndex]);
  const isLastItemOverall = currentTaskIndex === lastTaskIndex && lastTaskItems[lastTaskItems.length - 1]?.id === currentItemIdClean;

  return (
    <div className={`w-full h-[calc(100vh-61px)] md:h-[calc(100vh-73px)] flex flex-col font-['Montserrat',sans-serif] ${t.bgApp} transition-colors duration-300 overflow-hidden`}>
      <div className="shrink-0 z-50 flex flex-col w-full shadow-sm">
        <div className={`py-4 ${t.bgSubHeader} flex justify-between items-center px-4 md:px-8 transition-colors duration-300`}>
          <div className="flex items-center gap-4 overflow-hidden flex-1 mr-4">
            <Button
              variant="secondary"
              appearance="solid"
              iconOnly={true}
              onClick={() => setShowExitWarning(true)}
              title="Sair da Avaliação"
            >
              <DoorOpen size={20} />
            </Button>
            <span className="text-[14px] md:text-[15px] font-bold text-white truncate" title={activeTest.title}>
              {activeTest.title}
            </span>
          </div>

          <div className="flex items-center gap-4 shrink-0">
            <div className="flex items-center bg-black/40 rounded-md p-1 shadow-inner hidden md:flex shrink-0">
              <button onClick={() => setFontSize(Math.max(14, fontSize - 2))} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 font-bold text-sm transition-colors" title="Diminuir fonte">A-</button>
              <div className="w-px h-4 bg-gray-600 mx-1"></div>
              <button onClick={() => setFontSize(Math.min(24, fontSize + 2))} className="w-7 h-7 flex items-center justify-center rounded text-gray-400 hover:text-white hover:bg-white/10 font-bold text-lg transition-colors" title="Aumentar fonte">A+</button>
            </div>

            <button onClick={handleToggleFlag} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors shrink-0 ${isCurrentItemFlagged ? 'bg-yellow-100 text-yellow-700' : 'text-gray-400 hover:text-white hover:bg-white/10'}`} title="Marcar questão atual para revisar depois">
              <Flag size={18} className={isCurrentItemFlagged ? 'fill-current text-yellow-500' : ''} />
              <span className="text-[13px] font-bold hidden md:block">Revisar</span>
            </button>

            <button onClick={() => setShowMapModal(true)} className={`flex items-center gap-2 px-3 py-1.5 rounded-md transition-colors text-gray-400 hover:text-white hover:bg-white/10 shrink-0`} title="Mapa de Itens">
              <LayoutGrid size={18} />
              <span className="hidden md:block text-[13px] font-bold">Mapa de Itens</span>
            </button>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded bg-black/40 text-white font-mono font-bold text-[14px] tracking-widest shadow-inner shrink-0">
              <Clock size={16} className="text-[#94CFEF]" /> {formatTime(timeRemaining)}
            </div>
          </div>
        </div>
      </div>

      <TestSubHeader theme={theme} />

      <div className="flex-1 flex overflow-hidden">
        <main className="flex-1 overflow-y-auto custom-scrollbar flex flex-col items-center pt-6 md:pt-8 pb-16 px-4 md:px-8 scroll-smooth relative">
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
                const cardBgComplete = theme === 'dark' ? 'bg-[#064E3B]/20 border-[#059669]/50' : 'bg-[#F0FDF4] border-[#6EE7B7]';
                let cardClass = itemComplete ? cardBgComplete : `${t.cardBg} ${t.cardBorder}`;

                if (isCurrentFocus && !itemComplete) {
                  cardClass = `${t.cardBg} border-[#008BC9] shadow-md ring-2 ${theme === 'dark' ? 'ring-[#003A79]' : 'ring-[#D9F0FC]'}`;
                }

                return (
                  <div id={`question-${item.id}`} key={uniqueKey} className={`question-item flex flex-col p-6 md:p-8 rounded-[8px] border-2 shadow-sm transition-all duration-300 ${cardClass} animate-fade-slide`}>
                    <div className="flex justify-between items-end gap-4 pb-2 border-b-2 border-[#008BC9] w-full">
                      <h3 className={`font-bold ${t.textMain} leading-tight flex-1 flex flex-wrap items-baseline gap-2`} style={{ fontSize: '1.1em' }}>
                        <span className={`font-semibold ${theme === 'dark' ? 'text-[#94CFEF]' : 'text-[#0C63AA]'}`}>Item {item.number}.</span>
                        <span className="font-medium">{item.title}</span>
                      </h3>
                      {itemComplete && (
                        <div className="flex items-center gap-1.5 px-3 py-1 bg-[#10B981] text-white rounded-full text-[12px] font-bold shadow-sm shrink-0 animate-fade-slide mb-0.5">
                          <CheckCircle2 size={14} /> <span className="hidden sm:inline">Respondida</span>
                        </div>
                      )}
                    </div>

                    {item.image && (
                      <div className="w-full overflow-hidden mt-[8px]">
                        <img src={item.image} alt="Imagem da questão" className="w-full max-h-[400px] object-contain" />
                      </div>
                    )}

                    <p className={`${t.textMain} leading-relaxed whitespace-pre-line mt-[8px]`} style={{ fontSize: '1em' }}>{item.text}</p>

                    {item.table && (
                      <div className={`w-full overflow-x-auto mt-[8px] border rounded-xl shadow-inner ${theme === 'dark' ? 'border-gray-800' : 'border-gray-200'}`}>
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
                      <div className={`w-full border-l-4 border-[#008BC9] p-5 rounded-r-xl mt-[8px] flex flex-col gap-4 ${theme === 'dark' ? 'bg-[#003A79]/15' : 'bg-[#F0F9FF]'}`}>
                        <p className={`text-[14px] font-semibold leading-relaxed ${theme === 'dark' ? 'text-[#94CFEF]' : 'text-[#003A79]'}`}>
                          {item.notice.text}
                        </p>
                        {item.notice.videoUrl && (
                          <div className={`w-full aspect-video rounded-lg overflow-hidden border shadow-sm bg-black ${theme === 'dark' ? 'border-gray-700' : 'border-gray-200'}`}>
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
                      <div className={`w-full flex items-start gap-3 p-4 rounded-lg mt-[8px] shadow-inner border ${theme === 'dark'
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

        <TestSidebar
          theme={theme}
          activeTest={activeTest}
          currentTaskIndex={currentTaskIndex}
          activeItemId={activeItemId}
          answers={answers}
          flags={flags}
          getTaskItems={getTaskItems}
          isItemComplete={isItemComplete}
          jumpToTask={jumpToTask}
          setActiveItemId={setActiveItemId}
        />
      </div>

      <div className={`h-[88px] shrink-0 ${theme === 'dark' ? 'bg-[#0B121A]' : 'bg-white'} border-t ${t.border} flex justify-between items-center px-4 md:px-8 shadow-[0_-10px_30px_rgba(0,0,0,0.08)] transition-colors duration-300`}>
        <div className="flex gap-2 w-auto md:w-[160px] shrink-0">
          <button onClick={goPrevItem} disabled={isFirstItemOverall} className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${isFirstItemOverall ? `opacity-40 cursor-not-allowed text-gray-500 ${theme === 'dark' ? 'bg-[#1D2836]' : 'bg-gray-100'}` : `bg-[#D9F0FC] text-[#008BC9] hover:bg-[#008BC9] hover:text-white shadow-sm`}`} title="Questão Anterior">
            <ChevronLeft size={20} />
          </button>
          <button onClick={goNextItem} disabled={isLastItemOverall} className={`p-3 rounded-xl flex items-center justify-center transition-all duration-200 ${isLastItemOverall ? `opacity-40 cursor-not-allowed text-gray-500 ${theme === 'dark' ? 'bg-[#1D2836]' : 'bg-gray-100'}` : `bg-[#D9F0FC] text-[#008BC9] hover:bg-[#008BC9] hover:text-white shadow-sm`}`} title="Próxima Questão">
            <ChevronRight size={20} />
          </button>
        </div>

        <div id="bottom-progress-bar" className="flex-1 flex items-center justify-center gap-2 md:gap-4 px-2 md:px-4">
          {activeTest.tasks.map((task, idx) => {
            const isCurrentTask = idx === currentTaskIndex;
            const isPastTask = idx < currentTaskIndex;
            const flatItems = getTaskItems(task);
            const isComplete = isTaskComplete(idx);

            if (isCurrentTask) {
              return (
                <div key={task.id} className={`flex items-center p-1.5 rounded-full transition-all duration-300 border-2 border-[#008BC9] ${theme === 'dark' ? 'bg-[#151E28]' : 'bg-white'} shadow-sm`}>
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-[13px] font-bold shadow-sm transition-colors shrink-0 bg-[#008BC9] text-white">
                    {idx + 1}
                  </div>

                  <div className="flex gap-1.5 ml-3 mr-3">
                    {flatItems.map((item) => {
                      const isCurrentItem = activeItemId === `question-${item.id}`;
                      const isAnswered = isItemComplete(item);

                      let dashClass = "h-2.5 rounded-full transition-all duration-300 cursor-pointer shrink-0 ";

                      if (isCurrentItem) {
                        dashClass += "w-8 border-2 border-[#008BC9] bg-transparent";
                      } else if (isAnswered) {
                        dashClass += "w-4 bg-[#008BC9]";
                      } else {
                        dashClass += theme === 'dark' ? "w-4 bg-gray-600" : "w-4 bg-gray-300";
                      }

                      return (
                        <div
                          id={`dash-question-${item.id}`}
                          key={item.id}
                          className={dashClass}
                          onClick={(e) => {
                            e.stopPropagation();
                            setTimeout(() => {
                              document.getElementById(`question-${item.id}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
                            }, 100);
                          }}
                          title={`Ir para Questão ${item.number}`}
                        ></div>
                      )
                    })}
                  </div>
                </div>
              );
            }
            else {
              let btnColorClass = "";
              if (isComplete) {
                btnColorClass = "bg-[#008BC9] text-white border-[#008BC9]";
              } else if (isPastTask) {
                btnColorClass = "bg-[#D9F0FC] text-[#008BC9] border-[#94CFEF]";
              } else {
                btnColorClass = theme === 'dark' ? "bg-gray-800 text-gray-400 border-gray-700" : "bg-gray-100 text-gray-400 border-gray-200";
              }

              return (
                <button
                  key={task.id}
                  onClick={() => { setCurrentTaskIndex(idx); window.scrollTo(0, 0); }}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[13px] font-bold shadow-sm transition-all duration-300 cursor-pointer border-2 hover:scale-105 shrink-0 ${btnColorClass}`}
                  title={isComplete ? `Tarefa ${idx + 1} (Concluída)` : `Ir para Tarefa ${idx + 1}`}
                >
                  {isComplete ? <CheckCircle2 size={16} /> : idx + 1}
                </button>
              );
            }
          })}
        </div>

        <div className="w-auto md:w-[160px] flex justify-end shrink-0 ml-4">
          <button onClick={onAttemptFinish} className={`h-[48px] px-6 md:px-8 rounded-xl font-bold text-[14px] flex items-center justify-center gap-2 transition-all duration-200 shadow-md hover:-translate-y-0.5 bg-[#008BC9] text-white hover:bg-[#003A79]`}>
            <span className="hidden md:block whitespace-nowrap">Enviar Teste</span> <Send size={18} />
          </button>
        </div>
      </div>

      {showMapModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className={`w-full max-w-[800px] rounded-2xl shadow-2xl overflow-hidden flex flex-col ${t.cardBg} border ${t.cardBorder}`}>
            <div className="px-6 md:px-8 py-5 border-b flex justify-between items-center bg-[#001D31] text-white">
              <h3 className={`text-[20px] font-bold flex items-center gap-2`}><LayoutGrid size={22} /> Visão Geral da Prova</h3>
              <div className="flex items-center gap-4">
                <button onClick={() => setCollapseTasks(!collapseTasks)} className="text-[12px] font-bold px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors flex items-center gap-2">
                  {collapseTasks ? <Maximize2 size={14} /> : <Minimize2 size={14} />}
                  <span className="hidden sm:inline">{collapseTasks ? 'Expandir todas as tarefas' : 'Voltar ao Modo Foco'}</span>
                </button>
                <button className={`p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors`} onClick={() => setShowMapModal(false)}><X size={20} /></button>
              </div>
            </div>

            <div className={`px-6 md:px-8 py-4 border-b flex flex-wrap gap-4 md:gap-8 justify-center shrink-0 ${theme === 'dark' ? 'bg-[#0B121A] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <div className={`flex items-center gap-2 text-[13px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="w-5 h-5 rounded border-2 border-[#008BC9] bg-[#008BC9] flex items-center justify-center text-white"><CheckCircle2 size={12} /></div> Respondida
              </div>
              <div className={`flex items-center gap-2 text-[13px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className={`w-5 h-5 rounded border-2 border-gray-300 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`}></div> Em Branco
              </div>
              <div className={`flex items-center gap-2 text-[13px] font-semibold ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                <div className="w-5 h-5 rounded border-2 border-[#008BC9] bg-white relative"><div className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-yellow-400"></div></div> Marcada para revisar
              </div>
            </div>

            <div className="p-6 md:p-8 overflow-y-auto max-h-[50vh] custom-scrollbar flex flex-col gap-10">
              {activeTest.tasks.map((task, tIdx) => {
                const flatItems = getTaskItems(task);
                return (
                  <div key={task.id} className="flex flex-col gap-4">
                    <h4 className={`font-bold text-[15px] ${t.textMain} flex items-center gap-2 pb-2 border-b ${t.border}`}>
                      <span className="bg-[#D9F0FC] text-[#008BC9] px-2 py-0.5 rounded text-[12px]">Caderno {tIdx + 1}</span> {task.title}
                    </h4>
                    <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-4">
                      {flatItems.map((item) => {
                        const isAnswered = isItemComplete(item);
                        const flagColor = flags[item.id];
                        let btnClass = `${t.bgApp} ${t.textMuted} hover:border-[#008BC9] ${theme === 'dark' ? 'border-gray-700' : 'border-gray-300'}`;
                        if (isAnswered) btnClass = 'bg-[#008BC9] border-[#008BC9] text-white shadow-md';

                        return (
                          <button
                            key={item.id}
                            onClick={() => jumpToTask(tIdx)}
                            className={`h-[48px] rounded-xl border-2 flex items-center justify-center text-[15px] font-bold cursor-pointer transition-all relative transform hover:scale-105 ${btnClass}`}
                            title={`Ir para Questão ${item.number}`}
                          >
                            {item.number}
                            {flagColor && <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full border-2 border-white shadow-sm bg-yellow-400"></div>}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              })}
            </div>

            <div className={`px-6 py-5 border-t flex justify-end shrink-0 ${theme === 'dark' ? 'bg-[#0B121A] border-gray-800' : 'bg-gray-50 border-gray-200'}`}>
              <button onClick={() => setShowMapModal(false)} className="bg-[#008BC9] text-white px-8 py-3 rounded-xl font-bold text-[14px] shadow-md hover:bg-[#003A79] transition-colors">VOLTAR À PROVA</button>
            </div>
          </div>
        </div>
      )}

      {showTaskSuccessModal && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className={`w-full max-w-[400px] ${t.cardBg} rounded-2xl shadow-2xl overflow-hidden flex flex-col p-8 text-center border-t-8 border-[#10B981] relative`}>
            <button onClick={() => setShowTaskSuccessModal(false)} className={`absolute top-4 right-4 p-2 rounded-full bg-gray-100 hover:bg-gray-200 text-gray-500`}><X size={20} /></button>
            <div className="w-20 h-20 bg-[#D1FAE5] rounded-full flex items-center justify-center mx-auto mb-6 text-[#10B981]">
              <CheckCircle2 size={40} />
            </div>
            <h3 className={`text-[24px] font-black ${t.textMain} leading-tight mb-2`}>Caderno Concluído!</h3>
            <p className="text-[15px] text-gray-500 mb-8 font-medium">Você respondeu a todas as questões deste caderno com sucesso.</p>
            <button onClick={confirmNextTask} className="w-full py-4 bg-[#008BC9] text-white font-bold rounded-xl shadow-lg hover:bg-[#003A79] transition-colors text-[16px]">
              Ir para o Próximo Caderno
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
            <p className="text-[15px] text-gray-500 mb-8 font-medium">Você possui <strong className={theme === 'dark' ? 'text-white' : 'text-[#1D2432]'}>{getTotalItems() - getTotalAnswered()} questão(ões)</strong> em branco. Tem certeza que deseja enviar a prova agora?</p>
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
      {showExitWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className={`w-full max-w-[440px] ${t.cardBg} rounded-2xl shadow-2xl overflow-hidden flex flex-col p-8 text-center border-t-8 border-[#EF4444] relative`}>
            <button onClick={() => setShowExitWarning(false)} className={`absolute top-4 right-4 p-2 rounded-full text-gray-500 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}><X size={20} /></button>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-red-500 ${theme === 'dark' ? 'bg-red-950/50' : 'bg-red-100'}`}>
              <DoorOpen size={40} />
            </div>
            <h3 className={`text-[22px] font-black ${t.textMain} leading-tight mb-2`}>Sair da Avaliação?</h3>
            <p className="text-[15px] text-gray-500 mb-8 font-medium">
              Suas respostas salvas até o momento não serão perdidas. Você poderá continuar a avaliação mais tarde, desde que esteja dentro do prazo de entrega.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={() => setShowExitWarning(false)} className="w-full py-4 bg-[#008BC9] text-white font-bold rounded-xl shadow-md hover:bg-[#003A79] transition-colors text-[15px]">
                Continuar Avaliação
              </button>
              <button onClick={() => setCurrentScreen('dashboard')} className={`w-full py-4 bg-transparent border-2 border-red-500 text-red-500 font-bold rounded-xl transition-colors text-[15px] ${theme === 'dark' ? 'hover:bg-red-950/20' : 'hover:bg-red-50'}`}>
                Sim, Sair da Prova
              </button>
            </div>
          </div>
        </div>
      )}

      {showSubmitWarning && (
        <div className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center animate-fade-slide p-4">
          <div className={`w-full max-w-[440px] ${t.cardBg} rounded-2xl shadow-2xl overflow-hidden flex flex-col p-8 text-center border-t-8 border-[#008BC9] relative`}>
            <button onClick={() => setShowSubmitWarning(false)} className={`absolute top-4 right-4 p-2 rounded-full text-gray-500 ${theme === 'dark' ? 'hover:bg-white/5' : 'hover:bg-black/5'}`}><X size={20} /></button>
            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 text-[#008BC9] ${theme === 'dark' ? 'bg-[#003A79]/30' : 'bg-[#D9F0FC]'}`}>
              <CheckCircle2 size={40} />
            </div>
            <h3 className={`text-[22px] font-black ${t.textMain} leading-tight mb-2`}>Entregar Avaliação?</h3>
            <p className="text-[15px] text-gray-500 mb-8 font-medium">
              Você respondeu a todas as questões desta avaliação. Ao entregar, suas respostas serão registradas e você não poderá mais alterá-las.
            </p>
            <div className="flex flex-col gap-3">
              <button onClick={handleFinishTest} className="w-full py-4 bg-[#008BC9] text-white font-bold rounded-xl shadow-md hover:bg-[#003A79] transition-colors text-[15px]">
                Confirmar e Entregar
              </button>
              <button onClick={() => setShowSubmitWarning(false)} className={`w-full py-4 bg-transparent border-2 font-bold rounded-xl transition-colors text-[15px] ${theme === 'dark' ? 'border-gray-700 text-gray-400 hover:bg-gray-800' : 'border-gray-300 text-gray-600 hover:bg-gray-50'}`}>
                Voltar ao Teste
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
