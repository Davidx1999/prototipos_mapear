import React from 'react';
import { PanelRightClose, ListTodo, BookMarked, Flag } from 'lucide-react';

const TestSidebar = ({
  theme = 'light',
  activeTest,
  currentTaskIndex,
  activeItemId,
  answers,
  flags,
  getTaskItems,
  isItemComplete,
  jumpToTask,
  setActiveItemId,
  setShowMapModal,
}) => {
  // Build flat list of all items with globalIndex and taskIdx
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

  // Get item status for coloring
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

  const navigateToQuestion = (item) => {
    // Jump to the task index
    jumpToTask(item.taskIdx);
    // Focus the question card after task change
    setTimeout(() => {
      setActiveItemId(`question-${item.id}`);
      const el = document.getElementById(`question-${item.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const t = {
    bg: theme === 'dark' ? 'bg-[#151E28]' : 'bg-white',
    textMain: theme === 'dark' ? 'text-white' : 'text-[#1D2432]',
    textMuted: theme === 'dark' ? 'text-gray-400' : 'text-gray-500',
    border: theme === 'dark' ? 'border-gray-800' : 'border-gray-200',
  };

  const totalAnswered = flatItems.filter(item => getItemStatus(item.id) === 'completed').length;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setShowMapModal(false)}
      />

      <aside className={`
        fixed top-0 right-0 z-50 w-[320px] h-full border-l flex flex-col shadow-2xl transition-all duration-300 overflow-y-auto custom-scrollbar
        lg:relative lg:w-[320px] lg:xl:w-[420px] lg:shadow-none lg:z-10
        ${t.bg} ${t.border}
      `}>
        {/* Header */}
        <div className={`p-4 border-b flex justify-between items-center ${t.border}`}>
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-[16px] ${t.textMain}`}>
              Mapa de Questões
            </h3>
            <span className={`text-[12px] font-bold px-2 py-0.5 rounded-full bg-[#D9F0FC] text-[#003A79] dark:bg-[#003A79] dark:text-[#94CFEF]`}>
              {totalAnswered}/{flatItems.length}
            </span>
          </div>
          <button
            onClick={() => setShowMapModal(false)}
            className={`p-1.5 rounded-md hover:bg-gray-150 dark:hover:bg-gray-800 ${t.textMuted} transition-colors`}
            title="Fechar Mapa"
          >
            <PanelRightClose size={20} />
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 p-4 flex flex-col gap-6">
          {/* Legend Section */}
          <div className="flex flex-col gap-3">
            <div className={`flex items-center gap-2 text-[13px] font-bold ${t.textMain}`}>
              <ListTodo size={18} className="text-[#008BC9]" />
              <span>Orientação de Respostas</span>
            </div>
            
            {/* Legend items aligned horizontally */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
              {/* Respondido */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                <span className="w-3 h-3 rounded-full bg-[#008BC9] border border-[#003A79] shrink-0" />
                <span>Respondido</span>
              </div>
              {/* Incompleto */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                <span className="w-3 h-3 rounded-full bg-[#FFD352] border border-[#DC9403] shrink-0" />
                <span>Incompleto</span>
              </div>
              {/* Em Branco */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-gray-500 dark:text-gray-400">
                <span className="w-3 h-3 rounded-full bg-white border border-[#CACDD5] shrink-0" />
                <span>Em Branco</span>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className={`h-px w-full bg-gray-200 dark:bg-gray-800`} />

          {/* Tasks and Questions */}
          <div className="flex flex-col gap-6">
            {activeTest.tasks.map((task, tIdx) => {
              const taskItems = flatItems.filter(it => it.taskIdx === tIdx);
              return (
                <div key={task.id} className="flex flex-col gap-2">
                  {/* Task Header */}
                  <div className={`flex items-center gap-2 text-[13px] font-bold ${t.textMain} leading-tight`}>
                    <BookMarked size={16} className="text-[#008BC9] shrink-0" />
                    <span className="truncate font-semibold" title={task.title}>{task.title}</span>
                  </div>

                  {/* Question Grid */}
                  <div className="grid grid-cols-2 xl:grid-cols-3 gap-2 mt-1">
                    {taskItems.map((item) => {
                      const status = getItemStatus(item.id);
                      const isActive = activeItemId === `question-${item.id}`;
                      const isFlagged = flags[item.id];

                      let btnStyle = '';
                      if (status === 'completed') {
                        btnStyle = 'bg-[#008BC9] text-white border-[#003A79] hover:bg-[#0C63AA]';
                      } else if (status === 'partial') {
                        btnStyle = 'bg-[#FFD352] text-neutral-900 border-[#DC9403] hover:bg-[#FFE082]';
                      } else {
                        // Tertiary style
                        btnStyle = 'bg-white dark:bg-[#151E28] text-gray-700 dark:text-gray-300 border-[#CACDD5] dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800';
                      }

                      return (
                        <button
                          key={item.id}
                          onClick={() => navigateToQuestion(item)}
                          className={`
                            py-2 px-3 rounded-lg border text-[13px] font-bold transition-all duration-150 flex items-center justify-between
                            ${btnStyle}
                            ${isActive ? 'ring-[3px] ring-[#0C63AA] ring-offset-1 dark:ring-offset-[#151E28]' : ''}
                          `}
                          title={item.title}
                        >
                          <span className="truncate">Questão {item.number}</span>
                          {isFlagged && (
                            <Flag size={12} className="shrink-0 text-red-500 ml-1" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </aside>
    </>
  );
};

export default TestSidebar;
