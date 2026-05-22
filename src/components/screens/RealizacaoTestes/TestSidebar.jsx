import React from 'react';
import { ListTodo, BookMarked } from 'lucide-react';

const TestSidebar = ({
  theme = 'light',
  activeTest,
  currentTaskIndex,
  activeItemId,
  answers,
  flags,
  handleToggleFlag,
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
    bg: theme === 'dark' ? 'bg-neutral-6' : 'bg-neutral-0',
    textMain: theme === 'dark' ? 'text-neutral-0' : 'text-neutral-7',
    textMuted: theme === 'dark' ? 'text-neutral-4' : 'text-neutral-5',
    border: theme === 'dark' ? 'border-neutral-5' : 'border-neutral-2',
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
          <h3 className={`font-bold text-[16px] ${t.textMain}`}>
            Mapa de Itens
          </h3>
          <span className="text-[12px] font-bold px-2 py-0.5 rounded-[4px] bg-brand-extraLight text-brand-extraDark dark:bg-brand-extraDark dark:text-brand-light">
            {totalAnswered}/{flatItems.length}
          </span>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 py-4 flex flex-col gap-6">
          {/* Legend Section */}
          <div className="flex flex-col gap-3 px-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-brand-extraDark">
              <ListTodo size={18} className="text-brand-extraDark shrink-0" />
              <span>Orientação de Respostas</span>
            </div>
            
            {/* Legend items aligned horizontally */}
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
              {/* Respondido */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-7">
                <span className="w-3 h-3 rounded-full bg-brand-base border border-brand-extraDark shrink-0" />
                <span>Respondido</span>
              </div>
              {/* Incompleto */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-7">
                <span className="w-3 h-3 rounded-full bg-secondary-base border border-secondary-dark shrink-0" />
                <span>Incompleto</span>
              </div>
              {/* Em Branco */}
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-neutral-7">
                <span className="w-3 h-3 rounded-full bg-neutral-0 border border-neutral-3 shrink-0" />
                <span>Em Branco</span>
              </div>
            </div>
          </div>

          {/* Divider line 100% width, neutral 2 stroke */}
          <div className="h-px w-full bg-neutral-2 dark:bg-neutral-6 shrink-0" />

          {/* Tasks and Questions */}
          <div className="flex flex-col gap-6 px-4">
            {activeTest.tasks.map((task, tIdx) => {
              const taskItems = flatItems.filter(it => it.taskIdx === tIdx);
              return (
                <div key={task.id} className="flex flex-col gap-2">
                  {/* Task Header */}
                  <div className="flex items-center gap-2 text-[13px] font-bold text-brand-extraDark leading-tight">
                    <BookMarked size={16} className="text-brand-extraDark shrink-0" />
                    <span className="truncate font-bold" title={task.title}>{task.title}</span>
                  </div>

                  {/* Question Grid (Now square buttons flex-wrap) */}
                  <div className="flex flex-wrap gap-2 mt-1">
                    {taskItems.map((item) => {
                      const status = getItemStatus(item.id);
                      const isActive = activeItemId === `question-${item.id}`;

                      let itemBgBorderText = '';

                      if (status === 'completed') {
                        // Equivalent to primary solid button style
                        itemBgBorderText = 'bg-brand-base text-white border border-transparent hover:bg-brand-dark';
                      } else if (status === 'partial') {
                        // Incomplete secondary: stroke secondary/base, background secondary/extraLight
                        itemBgBorderText = 'bg-secondary-extraLight border border-secondary-base text-secondary-base hover:bg-secondary-light hover:bg-opacity-[0.2]';
                      } else {
                        // Equivalent to tertiary solid button style
                        itemBgBorderText = 'bg-neutral-0 border border-neutral-3 hover:bg-neutral-2 text-neutral-7 dark:bg-[#151E28] dark:border-gray-800 dark:text-gray-300 dark:hover:bg-gray-800';
                      }

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateToQuestion(item)}
                          className={`
                            w-9 h-9 rounded-[4px] font-bold text-[14px] transition-all duration-120
                            flex items-center justify-center cursor-pointer select-none outline-none
                            ${itemBgBorderText}
                            ${isActive ? 'ring-[3px] ring-brand-dark ring-offset-1 dark:ring-offset-[#151E28]' : ''}
                          `}
                          title={item.title}
                        >
                          {item.number}
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
