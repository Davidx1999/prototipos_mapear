import React from 'react';
import { Map, X, CheckCircle2 } from 'lucide-react';

/**
 * TestSidebar Component
 * Responsive question map sidebar for the TestPlayer.
 * - Desktop (lg+): Fixed sidebar on the right side
 * - Mobile: Floating button + full-screen drawer
 */
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
}) => {
  const [isDrawerOpen, setIsDrawerOpen] = React.useState(false);

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
      const hasChoice = !!answers[`${itemId}_choice`];
      const hasText = !!answers[`${itemId}_text`] && answers[`${itemId}_text`].trim() !== '';
      if (hasChoice && hasText) return 'completed';
      if (hasChoice || hasText) return 'partial';
      return 'unanswered';
    }

    if (isItemComplete(item)) return 'completed';
    return 'unanswered';
  };

  // Navigate to a question
  const navigateToQuestion = (item) => {
    jumpToTask(item.taskIdx);
    setTimeout(() => {
      setActiveItemId(`question-${item.id}`);
      const el = document.getElementById(`question-${item.id}`);
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 50);
    setIsDrawerOpen(false);
  };

  const t = {
    bg: theme === 'dark' ? 'bg-[#1D2432]' : 'bg-white',
    border: theme === 'dark' ? 'border-transparent' : 'border-[var(--neutral-2)]',
    textMain: theme === 'dark' ? 'text-white' : 'text-[#001D31]',
    textMuted: theme === 'dark' ? 'text-[#CACDD5]' : 'text-[#677080]',
    textAccent: theme === 'dark' ? 'text-[#94CFEF]' : 'text-[#003A79]',
    badgeBg: theme === 'dark' ? 'bg-[#003A79]' : 'bg-[#D9F0FC]',
    badgeText: theme === 'dark' ? 'text-[#94CFEF]' : 'text-[#003A79]',
    taskCardBg: theme === 'dark' ? 'bg-[#0F1113]' : 'bg-[var(--neutral-1)]',
    taskCardBorder: theme === 'dark' ? 'border-[#677080]/15' : 'border-[var(--neutral-2)]/60',
    btnDefault: theme === 'dark'
      ? 'bg-[#1D2432] text-[#CACDD5] border-[#677080]/30'
      : 'bg-white text-[#677080] border-[var(--neutral-2)]',
    divider: theme === 'dark' ? 'border-[#677080]/20' : 'border-[var(--neutral-2)]',
  };

  // The question grid content (shared between desktop and mobile)
  const renderQuestionGrid = () => (
    <div className="space-y-6">
      {activeTest.tasks.map((task, tIdx) => {
        const taskLabel = task.title.match(/^(Tarefa \d+)/i)?.[1] || `Tarefa ${tIdx + 1}`;
        return (
          <div key={task.id} className={`p-4 ${t.taskCardBg} rounded-[8px] border ${t.taskCardBorder}`}>
            <h4 className={`text-[12px] font-bold ${t.textAccent} mb-3 truncate`} title={task.title}>
              {taskLabel}
            </h4>

            <div className="grid grid-cols-4 gap-2">
              {flatItems.filter(it => it.taskIdx === tIdx).map((item) => {
                const status = getItemStatus(item.id);
                const isActiveTask = currentTaskIndex === tIdx;
                const isActive = activeItemId === `question-${item.id}`;

                let btnClass = '';
                if (status === 'completed') {
                  btnClass = theme === 'dark'
                    ? 'bg-green-950/50 text-green-400 border-2 border-green-600'
                    : 'bg-green-100 text-green-700 border-2 border-green-400';
                } else if (status === 'partial') {
                  btnClass = theme === 'dark'
                    ? 'bg-amber-950/50 text-amber-400 border-2 border-amber-600'
                    : 'bg-amber-100 text-amber-700 border-2 border-amber-400';
                } else {
                  btnClass = `${t.btnDefault} border`;
                }

                if (isActive) {
                  btnClass += ' ring-2 ring-[#008BC9]';
                } else if (isActiveTask && status === 'unanswered') {
                  btnClass += theme === 'dark' ? ' ring-1 ring-[#94CFEF]/40' : ' ring-1 ring-[#008BC9]/30';
                }

                return (
                  <button
                    key={item.id}
                    onClick={() => navigateToQuestion(item)}
                    className={`aspect-square rounded-[8px] flex flex-col items-center justify-center font-bold text-[14px] relative transition-all duration-150 hover:scale-105 ${btnClass}`}
                    title={item.title}
                  >
                    {item.globalIndex}
                    {flags[item.id] && (
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full bg-yellow-400 border border-white"></div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );

  // Legend
  const renderLegend = () => (
    <div className={`mt-6 pt-5 border-t ${t.divider} space-y-2`}>
      <div className={`flex items-center gap-2 text-[12px] font-bold ${t.textMuted}`}>
        <div className={`w-3.5 h-3.5 ${theme === 'dark' ? 'bg-green-950/50' : 'bg-green-100'} border border-green-400 rounded-[4px] shrink-0`}></div>
        <span>Questão Respondida</span>
      </div>
      <div className={`flex items-center gap-2 text-[12px] font-bold ${t.textMuted}`}>
        <div className={`w-3.5 h-3.5 ${theme === 'dark' ? 'bg-amber-950/50' : 'bg-amber-100'} border border-amber-400 rounded-[4px] shrink-0`}></div>
        <span>Parcial (falta justificativa)</span>
      </div>
      <div className={`flex items-center gap-2 text-[12px] font-bold ${t.textMuted}`}>
        <div className={`w-3.5 h-3.5 ${theme === 'dark' ? 'bg-[#1D2432]' : 'bg-white'} border ${theme === 'dark' ? 'border-[#677080]' : 'border-[var(--neutral-2)]'} rounded-[4px] shrink-0`}></div>
        <span>Não respondida ainda</span>
      </div>
    </div>
  );

  const totalAnswered = flatItems.filter(item => getItemStatus(item.id) === 'completed').length;

  return (
    <>
      {/* DESKTOP SIDEBAR - Fixed on the right */}
      <aside className={`hidden lg:flex flex-col w-[280px] shrink-0 ${t.bg} rounded-[8px] p-5 border ${t.border} overflow-y-auto custom-scrollbar`}>
        <div className="mb-4 flex items-center justify-between">
          <h3 className={`font-bold text-[16px] ${t.textMain} flex items-center gap-2`}>
            <Map size={18} className="text-[#008BC9]" />
            Mapa de Questões
          </h3>
          <span className={`text-[12px] ${t.badgeBg} ${t.badgeText} px-2 py-0.5 rounded-full font-bold`}>
            {totalAnswered}/{flatItems.length}
          </span>
        </div>

        <p className={`text-[12px] font-medium ${t.textMuted} mb-5`}>
          Navegue livremente por qualquer questão da avaliação:
        </p>

        {renderQuestionGrid()}
        {renderLegend()}
      </aside>

      {/* MOBILE FLOATING BUTTON */}
      <button
        onClick={() => setIsDrawerOpen(true)}
        className="lg:hidden fixed right-4 bottom-4 w-14 h-14 bg-[#008BC9] text-white rounded-full flex items-center justify-center hover:scale-105 active:scale-95 transition-all z-40"
        title="Mapa de Questões"
      >
        <Map size={24} />
      </button>

      {/* MOBILE DRAWER */}
      {isDrawerOpen && (
        <div className="lg:hidden fixed inset-0 z-50 flex justify-end" onClick={() => setIsDrawerOpen(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Drawer panel */}
          <div
            className={`relative w-[300px] ${t.bg} h-full p-5 flex flex-col overflow-y-auto animate-slide-in-right`}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4">
              <h3 className={`font-bold text-[16px] ${t.textMain} flex items-center gap-2`}>
                <Map size={18} className="text-[#008BC9]" />
                Painel de Questões
              </h3>
              <button
                onClick={() => setIsDrawerOpen(false)}
                className={`p-1.5 rounded-[4px] ${theme === 'dark' ? 'hover:bg-[#0F1113]' : 'hover:bg-[var(--neutral-1)]'} ${t.textMuted} transition-colors`}
              >
                <X size={20} />
              </button>
            </div>

            <p className={`text-[12px] font-medium ${t.textMuted} mb-5`}>
              Navegue livremente por qualquer questão:
            </p>

            <div className="flex-1">
              {renderQuestionGrid()}
            </div>

            {renderLegend()}
          </div>
        </div>
      )}
    </>
  );
};

export default TestSidebar;
