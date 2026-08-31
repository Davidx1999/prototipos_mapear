import React, { useState } from 'react';
import {
  Paperclip,
  BookOpenText,
  Route,
  BookMarked,
  FileText,
  Plus,
  ArrowRight,
  Trash2,
  Copy,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Edit2,
  Sparkles,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Button from '../../../../ui/Button';
import Chips from '../../../../ui/Chips';

const TaskOverviewLevel = ({
  task,
  test,
  assessment,
  onOpenItem,
  onAddItem,
  onDuplicateItem,
  onDeleteItem,
  onUpdateTask,
  isDarkMode = false
}) => {
  const [isEditingContext, setIsEditingContext] = useState(false);
  const [isEditingExpectation, setIsEditingExpectation] = useState(false);

  const items = task?.items || [];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-8">
      {/* Task Header Card */}
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
                {task?.code || 'TAR-01'}
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                {test?.title} • {assessment?.title}
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white flex items-center gap-2">
              <BookOpenText size={20} className="text-[#0078B0]" />
              {task?.title || 'Tarefa Pedagógica'}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <Button
              variant="primary"
              appearance="solid"
              size="sm"
              iconLeft={<Plus size={14} />}
              onClick={onAddItem}
            >
              Novo Item
            </Button>
          </div>
        </div>

        {/* Expectativa de Desempenho e Texto Base */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-neutral-100 dark:border-neutral-700/60">
          {/* Texto Base / Estímulo Composto */}
          <div className="p-4 rounded-[6px] bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col justify-between gap-2">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 flex items-center gap-1.5">
                  <Route size={12} className="text-[#0078B0]" />
                  Texto Base (Item Composto)
                </span>
                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded ${
                  task?.hasItemComposto
                    ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                    : 'bg-neutral-200/60 text-neutral-500'
                }`}>
                  {task?.hasItemComposto ? 'Ativo' : 'Não vinculado'}
                </span>
              </div>

              {task?.hasItemComposto && task.itemComposto ? (
                <div className="mt-2">
                  <h4 className="text-xs font-bold text-neutral-800 dark:text-neutral-200">
                    {task.itemComposto.title}
                  </h4>
                  <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
                    {task.itemComposto.content?.replace(/[#*`]/g, '')}
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-neutral-400 italic mt-2">
                  Esta tarefa não possui texto base compartilhado. Cada item utilizará seu próprio contexto.
                </p>
              )}
            </div>
          </div>

          {/* Área do Conhecimento / Resumo */}
          <div className="p-4 rounded-[6px] bg-neutral-50 dark:bg-neutral-800/60 border border-neutral-200/60 dark:border-neutral-700/60 flex flex-col justify-between gap-2">
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-500 block">
                Área de Conhecimento & Foco
              </span>
              <p className="text-xs font-semibold text-neutral-800 dark:text-neutral-200 mt-1">
                {task?.focoPedagogico || 'Desenvolvimento de competências leitoras e resolução de problemas estruturados.'}
              </p>
              <span className="text-[11px] text-neutral-500 block mt-1">
                Total de itens vinculados: <strong>{items.length} itens</strong>
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Items Section */}
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
              <Paperclip size={18} className="text-[#0078B0]" />
              Itens desta Tarefa
            </h2>
            <p className="text-xs text-neutral-500 mt-0.5">
              Selecione um item para abrir o workspace de edição focada com todos os critérios pedagógicos.
            </p>
          </div>

          <span className="text-xs font-semibold text-neutral-500">
            {items.length} {items.length === 1 ? 'item cadastrado' : 'itens cadastrados'}
          </span>
        </div>

        {/* Items List */}
        <div className="flex flex-col gap-3">
          {items.map((item, idx) => {
            const hasSkill = Boolean(item.habilidadeBNCC?.id);
            const hasSentence = Boolean(item.sentencaDescritora);
            const hasCognitive = Boolean(item.processosCognitivosSentenca?.length);
            const hasGabarito = Boolean(item.gabarito || item.respostaEsperada);
            const isComplete = hasSkill && hasSentence && hasCognitive && hasGabarito && item.enunciado;

            return (
              <div
                key={item.id || idx}
                onClick={() => onOpenItem(item.id)}
                className={`p-4 px-5 rounded-[8px] border transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  isDarkMode
                    ? 'bg-neutral-850 border-neutral-700 hover:border-[#0078B0] hover:bg-neutral-800'
                    : 'bg-white border-neutral-200 hover:border-[#0078B0] hover:shadow-xs'
                }`}
              >
                <div className="flex items-start md:items-center gap-3.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-full bg-[#0078B0]/10 text-[#0078B0] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 md:mt-0">
                    {String(idx + 1).padStart(2, '0')}
                  </div>

                  <div className="flex flex-col gap-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-bold text-xs text-neutral-900 dark:text-white group-hover:text-[#0078B0] transition-colors">
                        {item.code || `Item 0${idx + 1}`}
                      </span>

                      <span className="text-[11px] font-semibold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.2 rounded-[4px]">
                        {item.type === 'multipla_escolha' && 'Múltipla Escolha'}
                        {item.type === 'resposta_construida' && 'Resposta Construída'}
                        {item.type === 'hibrida' && 'Híbrida'}
                      </span>

                      {item.habilidadeBNCC?.id && (
                        <span className="font-mono text-[11px] font-bold text-[#0078B0] bg-[#0078B0]/10 px-2 py-0.2 rounded-[4px]">
                          {item.habilidadeBNCC.id}
                        </span>
                      )}

                      <span className={`text-[10px] font-bold px-2 py-0.2 rounded-[4px] border ${
                        isComplete
                          ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                          : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                      }`}>
                        {isComplete ? 'Preenchido' : 'Pendente de critérios'}
                      </span>
                    </div>

                    <p className="text-xs text-neutral-600 dark:text-neutral-300 line-clamp-1">
                      {item.enunciado || <span className="italic text-neutral-400">Enunciado ainda não cadastrado...</span>}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 self-end md:self-center">
                  <span className="text-xs font-bold text-[#0078B0] group-hover:underline flex items-center gap-1">
                    Editar Item <ArrowRight size={13} />
                  </span>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDuplicateItem?.(item.id);
                    }}
                    className="p-1.5 rounded-[4px] text-neutral-400 hover:text-[#0078B0] hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                    title="Duplicar Item"
                  >
                    <Copy size={13} />
                  </button>

                  {items.length > 1 && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteItem?.(item.id);
                      }}
                      className="p-1.5 rounded-[4px] text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                      title="Excluir Item"
                    >
                      <Trash2 size={13} />
                    </button>
                  )}
                </div>
              </div>
            );
          })}

          {/* Add New Item Button */}
          <button
            type="button"
            onClick={onAddItem}
            className={`p-4 rounded-[8px] border-2 border-dashed transition-all flex items-center justify-center gap-2 text-neutral-500 hover:text-[#0078B0] ${
              isDarkMode
                ? 'border-neutral-700 hover:border-[#0078B0] bg-neutral-850/40 hover:bg-neutral-800/60'
                : 'border-neutral-300 hover:border-[#0078B0] bg-neutral-50/50 hover:bg-[#F2FAFE]'
            }`}
          >
            <Plus size={16} className="text-[#0078B0]" />
            <span className="text-xs font-bold">Adicionar Novo Item nesta Tarefa</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskOverviewLevel;
