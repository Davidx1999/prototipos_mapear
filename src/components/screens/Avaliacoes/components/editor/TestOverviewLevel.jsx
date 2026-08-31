import React from 'react';
import {
  BookOpenText,
  Route,
  Paperclip,
  BookMarked,
  FileText,
  Plus,
  ArrowRight,
  Trash2,
  Edit3,
  Layers,
  CheckCircle2,
  FileCode2,
  Sparkles
} from 'lucide-react';
import Button from '../../../../ui/Button';

const TestOverviewLevel = ({
  test,
  assessment,
  onOpenTask,
  onAddTask,
  onDeleteTask,
  onUpdateTestTitle,
  isDarkMode = false
}) => {
  const tasks = test?.tasks || [];
  const totalItems = tasks.reduce((acc, t) => acc + (t.items?.length || 0), 0);

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-8">
      {/* Test Header */}
      <div
        className={`p-6 rounded-[8px] border transition-colors ${
          isDarkMode
            ? 'bg-neutral-850 border-neutral-700 text-white'
            : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#0078B0] bg-[#0078B0]/10 px-2.5 py-0.5 rounded-[4px]">
                {test?.code || 'CAD-01'}
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                {assessment?.title}
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <Layers size={20} className="text-[#0078B0]" />
              {test?.title || 'Caderno de Teste'}
            </h1>

            <p className="text-xs text-neutral-500 max-w-2xl">
              Organize as tarefas deste caderno por objetivos de aprendizagem, contextos de leitura ou unidades temáticas.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              appearance="solid"
              size="sm"
              iconLeft={<Plus size={14} />}
              onClick={onAddTask}
            >
              Nova Tarefa
            </Button>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700/60">
          <div className="p-3 rounded-[6px] bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">Total de Tarefas</span>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">{tasks.length}</span>
          </div>

          <div className="p-3 rounded-[6px] bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">Total de Itens</span>
            <span className="text-lg font-bold text-[#0078B0] dark:text-[#38BDF8]">{totalItems}</span>
          </div>

          <div className="p-3 rounded-[6px] bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60">
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">Textos Base (Item Composto)</span>
            <span className="text-lg font-bold text-neutral-900 dark:text-white">
              {tasks.filter(t => t.hasItemComposto).length}
            </span>
          </div>
        </div>
      </div>

      {/* Tasks Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <BookOpenText size={18} className="text-[#0078B0]" />
              Tarefas do Caderno
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Cada tarefa agrupa itens que compartilham um mesmo contexto, texto-base ou objetivo pedagógico.
            </p>
          </div>

          <span className="text-xs font-semibold text-neutral-500">
            {tasks.length} {tasks.length === 1 ? 'tarefa cadastrada' : 'tarefas cadastradas'}
          </span>
        </div>

        {/* Tasks List */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tasks.map((task, idx) => {
            const itemCount = task.items?.length || 0;

            return (
              <div
                key={task.id || idx}
                onClick={() => onOpenTask(task.id)}
                className={`p-5 rounded-[8px] border transition-all cursor-pointer group flex flex-col justify-between gap-4 ${
                  isDarkMode
                    ? 'bg-neutral-850 border-neutral-700 hover:border-[#0078B0] hover:bg-neutral-800'
                    : 'bg-white border-neutral-200 hover:border-[#0078B0] hover:shadow-sm'
                }`}
              >
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-[11px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-[4px]">
                      {task.code || `TAR-0${idx + 1}`}
                    </span>
                    
                    {task.hasItemComposto && (
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#0078B0] bg-[#0078B0]/10 px-2 py-0.5 rounded-[4px] flex items-center gap-1">
                        <Route size={10} /> Texto Base Vinculado
                      </span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#0078B0] transition-colors line-clamp-1">
                    {task.title}
                  </h3>

                  {task.hasItemComposto && task.itemComposto?.title && (
                    <p className="text-xs text-neutral-500 dark:text-neutral-400 italic line-clamp-1">
                      Contexto: {task.itemComposto.title}
                    </p>
                  )}

                  {/* Items preview in this task */}
                  <div className="flex flex-col gap-1 mt-2">
                    <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                      Itens desta tarefa ({itemCount})
                    </span>
                    {(task.items || []).map((it, itIdx) => (
                      <div key={itIdx} className="flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-300 py-0.5">
                        <div className="flex items-center gap-1.5 truncate mr-2">
                          <Paperclip size={12} className="text-[#0078B0] shrink-0" />
                          <span className="font-semibold">{it.code || `Item 0${itIdx + 1}`}</span>
                          <span className="text-neutral-400 truncate">• {it.title}</span>
                        </div>
                        {it.habilidadeBNCC?.id && (
                          <span className="font-mono text-[10px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-1.5 py-0.2 rounded shrink-0">
                            {it.habilidadeBNCC.id}
                          </span>
                        )}
                      </div>
                    ))}
                    {itemCount === 0 && (
                      <span className="text-xs text-neutral-400 italic">Nenhum item cadastrado nesta tarefa.</span>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700/60 mt-auto">
                  <span className="text-xs font-bold text-[#0078B0] group-hover:underline flex items-center gap-1">
                    Abrir Tarefa <ArrowRight size={13} />
                  </span>

                  {tasks.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteTask(task.id);
                      }}
                      className="p-1.5 rounded-[4px] text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Excluir Tarefa"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add New Task Box */}
          <button
            type="button"
            onClick={onAddTask}
            className={`p-6 rounded-[8px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2.5 min-h-[160px] text-neutral-500 hover:text-[#0078B0] ${
              isDarkMode
                ? 'border-neutral-700 hover:border-[#0078B0] bg-neutral-850/40 hover:bg-neutral-800/60'
                : 'border-neutral-300 hover:border-[#0078B0] bg-neutral-50/50 hover:bg-[#F2FAFE]'
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-xs">
              <Plus size={16} className="text-[#0078B0]" />
            </div>
            <span className="text-xs font-bold">Adicionar Nova Tarefa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TestOverviewLevel;
