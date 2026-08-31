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
  sidebarWidth,
  setSidebarWidth,
  isDragging,
  setIsDragging,
  isMobile,
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

  // Mouse drag logic for resizing
  const handleMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  React.useEffect(() => {
    if (!isDragging) return;

    const handleMouseMove = (e) => {
      const newWidth = window.innerWidth - e.clientX;
      // Constrain sidebar width between 280px and 50% of screen width (up to 600px)
      const maxWidth = Math.min(600, window.innerWidth * 0.5);
      const constrainedWidth = Math.max(280, Math.min(maxWidth, newWidth));
      setSidebarWidth(constrainedWidth);
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, setSidebarWidth, setIsDragging]);

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
    jumpToTask(item.taskIdx);
    setTimeout(() => {
      setActiveItemId(`question-${item.id}`);
      const el = document.getElementById(`question-${item.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 150);
  };

  const totalAnswered = flatItems.filter(item => getItemStatus(item.id) === 'completed').length;

  return (
    <>
      {/* Mobile backdrop */}
      <div
        className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
        onClick={() => setShowMapModal(false)}
      />

      <aside 
        style={{ width: isMobile ? undefined : `${sidebarWidth}px` }}
        className={`
          fixed top-0 right-0 z-50 w-[320px] max-w-[calc(100vw-16px)] h-full border-l flex flex-col shadow-xl overflow-y-auto custom-scrollbar
          lg:relative lg:shadow-none lg:z-10
          ${isDragging ? '' : 'transition-all duration-300'}
          bg-bg-container border-border
        `}
      >
        {/* Resize Handle (desktop only) */}
        {!isMobile && (
          <div
            onMouseDown={handleMouseDown}
            className="absolute left-0 top-0 bottom-0 w-[10px] -ml-[5px] cursor-col-resize z-[60] group flex items-center justify-center select-none"
          >
            <div className="w-[2px] h-full bg-transparent group-hover:bg-brand-500/40 group-active:bg-brand-500 transition-colors duration-150" />
            <div className="absolute top-1/2 -translate-y-1/2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 group-active:opacity-100 transition-opacity duration-150 pointer-events-none">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500/60" />
              <div className="w-1.5 h-1.5 rounded-full bg-brand-500/60" />
            </div>
          </div>
        )}

        {/* Header */}
        <div className="p-4 border-b border-border flex justify-between items-center bg-bg-container">
          <h3 className="font-bold text-[15px] text-textIcon-heading">
            Mapa de Itens
          </h3>
          <span className="text-[12px] font-bold px-2.5 py-0.5 rounded bg-brand-100 text-brand-800 dark:bg-brand-900 dark:text-brand-200">
            {totalAnswered}/{flatItems.length} respondidos
          </span>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 py-4 flex flex-col gap-6">
          {/* Legend Section */}
          <div className="flex flex-col gap-3 px-4">
            <div className="flex items-center gap-2 text-[13px] font-bold text-textIcon-heading">
              <ListTodo size={16} className="text-brand-500 shrink-0" />
              <span>Status das respostas</span>
            </div>
            
            <div className="flex flex-wrap gap-x-4 gap-y-2 items-center">
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-textIcon-description">
                <span className="w-3 h-3 rounded-sm bg-brand-500 shrink-0" />
                <span>Respondido</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-textIcon-description">
                <span className="w-3 h-3 rounded-sm bg-semantic-caution-base shrink-0" />
                <span>Incompleto</span>
              </div>
              <div className="flex items-center gap-1.5 text-[12px] font-medium text-textIcon-description">
                <span className="w-3 h-3 rounded-sm bg-bg-container border border-border shrink-0" />
                <span>Em branco</span>
              </div>
            </div>
          </div>

          <div className="h-px w-full bg-border shrink-0" />

          {/* Tasks and Items */}
          <div className="flex flex-col gap-6 px-4">
            {activeTest.tasks.map((task, tIdx) => {
              const taskItems = flatItems.filter(it => it.taskIdx === tIdx);
              return (
                <div key={task.id} className="flex flex-col gap-2.5">
                  <div className="flex items-center gap-2 text-[13px] font-bold text-textIcon-heading leading-tight">
                    <BookMarked size={16} className="text-brand-500 shrink-0" />
                    <span className="truncate font-semibold" title={task.title}>{task.title}</span>
                  </div>

                  <div className="flex flex-wrap gap-2 mt-1">
                    {taskItems.map((item) => {
                      const status = getItemStatus(item.id);
                      const isActive = activeItemId === `question-${item.id}`;

                      let itemBgBorderText = '';

                      if (status === 'completed') {
                        itemBgBorderText = 'bg-brand-500 text-white border-transparent hover:bg-brand-600';
                      } else if (status === 'partial') {
                        itemBgBorderText = 'bg-semantic-caution-light border-semantic-caution-base text-semantic-caution-dark hover:bg-semantic-caution-base/20';
                      } else {
                        itemBgBorderText = 'bg-bg-container border-border hover:bg-neutral-1 text-textIcon-main dark:hover:bg-neutral-6';
                      }

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => navigateToQuestion(item)}
                          className={`
                            w-9 h-9 rounded font-bold text-[13px] transition-all duration-150 border
                            flex items-center justify-center cursor-pointer select-none outline-none
                            ${itemBgBorderText}
                            ${isActive ? 'ring-2 ring-brand-500 ring-offset-2 dark:ring-offset-neutral-7' : ''}
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

