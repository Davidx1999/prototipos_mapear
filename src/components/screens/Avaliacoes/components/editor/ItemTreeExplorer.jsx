import React, { useState } from 'react';
import {
  ChevronDown,
  ChevronRight,
  Plus,
  Search,
  Bookmark,
  BookMarked,
  BookOpenText,
  Route,
  Paperclip,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  Layers,
  Sparkles,
  PanelLeftClose,
  Trash2,
  Copy,
  Edit3
} from 'lucide-react';

const ItemTreeExplorer = ({
  assessment,
  selectedItemId,
  onSelectItem,
  onAddTest,
  onAddTask,
  onAddItem,
  onDeleteNode,
  isOpen,
  onToggleOpen,
  isDarkMode = false
}) => {
  const [treeSearch, setTreeSearch] = useState('');
  const [expandedNodes, setExpandedNodes] = useState(new Set(['teste-1', 'tar-1', 'teste-2', 'tar-3']));

  const toggleNode = (nodeId, e) => {
    e?.stopPropagation();
    setExpandedNodes(prev => {
      const next = new Set(prev);
      if (next.has(nodeId)) {
        next.delete(nodeId);
      } else {
        next.add(nodeId);
      }
      return next;
    });
  };

  // Helper to calculate total items and completed items in assessment
  const allItems = [];
  (assessment?.tests || []).forEach(test => {
    (test.tasks || []).forEach(task => {
      (task.items || []).forEach(item => {
        allItems.push({ ...item, testId: test.id, taskId: task.id });
      });
    });
  });

  const totalItemsCount = allItems.length;
  const completedItemsCount = allItems.filter(i => i.status === 'completo').length;

  if (!isOpen) return null;

  return (
    <aside
      className={`w-[320px] shrink-0 border-r flex flex-col h-full select-none transition-all ${
        isDarkMode ? 'bg-neutral-900 border-neutral-800 text-neutral-200' : 'bg-neutral-50/70 border-neutral-200 text-neutral-800'
      }`}
    >
      {/* Sidebar Header: Assessment Title & Tree Summary */}
      <div
        className={`p-3.5 px-4 border-b flex flex-col gap-2 shrink-0 ${
          isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 min-w-0 flex-1 mr-2">
            <Bookmark size={16} className="text-[#0078B0] shrink-0" />
            <span
              className="text-[13px] font-bold text-neutral-900 dark:text-white truncate"
              title={assessment?.title}
            >
              {assessment?.code || 'AV-2026'}
            </span>
          </div>

          <button
            onClick={onToggleOpen}
            className="w-7 h-7 rounded-[4px] flex items-center justify-center text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0"
            title="Recolher navegação lateral"
          >
            <PanelLeftClose size={16} />
          </button>
        </div>

        <div className="flex items-center justify-between text-[11px] text-neutral-500">
          <span>{assessment?.grade || '5º Ano'} • {assessment?.subject || 'Língua Portuguesa'}</span>
          <span className="font-semibold text-[#0078B0]">
            {completedItemsCount}/{totalItemsCount} concluídos
          </span>
        </div>
      </div>

      {/* Search Filter & Add Actions */}
      <div className="p-3 border-b flex flex-col gap-2 shrink-0 bg-white/40 dark:bg-neutral-900/40">
        <div className="relative w-full">
          <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-neutral-400" />
          <input
            type="text"
            placeholder="Filtrar por item ou BNCC..."
            value={treeSearch}
            onChange={e => setTreeSearch(e.target.value)}
            className={`w-full pl-8 pr-2.5 h-[32px] text-[12px] border rounded-[4px] outline-none transition-colors ${
              isDarkMode
                ? 'bg-neutral-800 border-neutral-700 text-white focus:border-[#0078B0]'
                : 'bg-white border-neutral-200 text-neutral-800 focus:border-[#0078B0]'
            }`}
          />
        </div>

        <div className="flex items-center justify-between pt-0.5 text-[11px] font-semibold text-neutral-500">
          <span className="uppercase tracking-wider text-[10px]">Estrutura da Avaliação</span>
          <button
            onClick={() => onAddTest && onAddTest()}
            className="text-[#0078B0] hover:text-[#005a85] flex items-center gap-1 font-bold cursor-pointer"
            title="Adicionar novo Teste (Caderno)"
          >
            <Plus size={13} /> Novo Teste
          </button>
        </div>
      </div>

      {/* Tree Content Explorer */}
      <div className="flex-1 overflow-y-auto p-2 flex flex-col gap-1 text-[13px]">
        {(assessment?.tests || []).map((test, testIdx) => {
          const isTestExpanded = expandedNodes.has(test.id);

          return (
            <div key={test.id} className="flex flex-col">
              {/* Level 1: TESTE (CADERNO) */}
              <div
                onClick={e => toggleNode(test.id, e)}
                className={`group flex items-center justify-between p-1.5 px-2 rounded-[4px] cursor-pointer hover:bg-neutral-200/50 dark:hover:bg-neutral-800 transition-colors ${
                  isTestExpanded ? 'font-semibold' : 'font-medium'
                }`}
              >
                <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
                  <span className="text-neutral-400 group-hover:text-neutral-700 dark:group-hover:text-neutral-200">
                    {isTestExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                  </span>
                  <BookMarked size={14} className="text-[#0078B0] shrink-0" />
                  <span className="truncate text-[12px] text-neutral-900 dark:text-neutral-100" title={test.title}>
                    {test.code || `Teste ${testIdx + 1}`}: {test.title}
                  </span>
                </div>

                <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 shrink-0">
                  <button
                    onClick={e => {
                      e.stopPropagation();
                      onAddTask && onAddTask(test.id);
                    }}
                    className="p-1 rounded-[4px] hover:bg-neutral-300 dark:hover:bg-neutral-700 text-[#0078B0]"
                    title="Adicionar Tarefa a este Teste"
                  >
                    <Plus size={13} />
                  </button>
                </div>
              </div>

              {/* Level 2: TAREFAS */}
              {isTestExpanded && (
                <div className="flex flex-col pl-3 border-l border-neutral-200 dark:border-neutral-800 ml-2 mt-0.5 gap-0.5">
                  {(test.tasks || []).map((task, taskIdx) => {
                    const isTaskExpanded = expandedNodes.has(task.id);

                    return (
                      <div key={task.id} className="flex flex-col">
                        {/* Tarefa Node */}
                        <div
                          onClick={e => toggleNode(task.id, e)}
                          className="group flex items-center justify-between p-1 px-1.5 rounded-[4px] cursor-pointer hover:bg-neutral-200/40 dark:hover:bg-neutral-800/80 transition-colors"
                        >
                          <div className="flex items-center gap-1 min-w-0 flex-1 mr-1">
                            <span className="text-neutral-400">
                              {isTaskExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                            </span>
                            <BookOpenText size={13} className="text-neutral-500 shrink-0" />
                            <span className="truncate text-[12px] text-neutral-700 dark:text-neutral-300" title={task.title}>
                              {task.code || `Tar ${taskIdx + 1}`}: {task.title}
                            </span>
                          </div>

                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-0.5 shrink-0">
                            <button
                              onClick={e => {
                                e.stopPropagation();
                                onAddItem && onAddItem(test.id, task.id);
                              }}
                              className="p-0.5 rounded-[4px] hover:bg-neutral-300 dark:hover:bg-neutral-700 text-[#0078B0]"
                              title="Adicionar Item a esta Tarefa"
                            >
                              <Plus size={12} />
                            </button>
                          </div>
                        </div>

                        {/* Level 3: ITENS */}
                        {isTaskExpanded && (
                          <div className="flex flex-col pl-3 border-l border-neutral-200 dark:border-neutral-800 ml-2 mt-0.5 gap-0.5">
                            {/* Item Composto Indicator (if present) */}
                            {task.hasItemComposto && task.itemComposto && (
                              <div className="flex items-center gap-1.5 p-1 px-2 text-[11px] font-medium text-neutral-500 italic bg-neutral-100/60 dark:bg-neutral-800/40 rounded-[4px] mb-0.5">
                                <Route size={11} className="text-neutral-400 shrink-0" />
                                <span className="truncate" title={task.itemComposto.title}>
                                  Texto Base: {task.itemComposto.title}
                                </span>
                              </div>
                            )}

                            {(task.items || []).map((item, itemIdx) => {
                              const isSelected = selectedItemId === item.id;
                              const isCompleted = item.status === 'completo';

                              // Filter by search query
                              if (treeSearch) {
                                const q = treeSearch.toLowerCase();
                                const matches =
                                  item.code?.toLowerCase().includes(q) ||
                                  item.title?.toLowerCase().includes(q) ||
                                  item.habilidadeBNCC?.id?.toLowerCase().includes(q) ||
                                  item.enunciado?.toLowerCase().includes(q);
                                if (!matches) return null;
                              }

                              return (
                                <div
                                  key={item.id}
                                  onClick={() => onSelectItem(item.id, test.id, task.id)}
                                  className={`group flex items-center justify-between p-1.5 px-2 rounded-[4px] cursor-pointer transition-all border ${
                                    isSelected
                                      ? isDarkMode
                                        ? 'bg-[#0078B0]/20 border-[#0078B0] text-[#38BDF8] font-bold shadow-xs'
                                        : 'bg-[#F2FAFE] border-[#0078B0] text-[#0078B0] font-bold shadow-xs'
                                      : isDarkMode
                                      ? 'border-transparent hover:bg-neutral-800/80 text-neutral-300'
                                      : 'border-transparent hover:bg-neutral-100 text-neutral-700'
                                  }`}
                                >
                                  <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1">
                                    <div
                                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                                        isCompleted ? 'bg-emerald-500' : 'bg-amber-400'
                                      }`}
                                      title={isCompleted ? 'Item completo' : 'Item em preenchimento'}
                                    />
                                    <span className="truncate text-[12px]">
                                      {item.code || `Item ${itemIdx + 1}`}
                                    </span>
                                    {item.habilidadeBNCC?.id && (
                                      <span className="text-[10px] font-mono px-1 py-0.2 bg-neutral-200/70 dark:bg-neutral-700/80 rounded-[3px] text-neutral-600 dark:text-neutral-300 shrink-0">
                                        {item.habilidadeBNCC.id}
                                      </span>
                                    )}
                                  </div>

                                  <div className="shrink-0 flex items-center text-[10px] text-neutral-400 font-mono">
                                    {isCompleted ? (
                                      <CheckCircle2 size={12} className="text-emerald-600 dark:text-emerald-400" />
                                    ) : (
                                      <span>7/9</span>
                                    )}
                                  </div>
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

      {/* Tree Explorer Footer Info */}
      <div
        className={`p-2.5 px-4 border-t text-[11px] text-neutral-500 flex items-center justify-between shrink-0 ${
          isDarkMode ? 'border-neutral-800 bg-neutral-900' : 'border-neutral-200 bg-white'
        }`}
      >
        <span>Total: {totalItemsCount} Itens</span>
        <span className="text-xs text-neutral-400">Atalhos: ↑ ↓ para navegar</span>
      </div>
    </aside>
  );
};

export default ItemTreeExplorer;
