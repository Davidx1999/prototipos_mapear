import React, { useState } from 'react';
import { X, Copy, BookOpen, Brain, Target, Star, Layers, CheckCircle2, User, Building2, Plus, ArrowUpRight, Sparkles, FileText, BarChart2 } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';

export default function TaskInspectorDrawer({
  task,
  onClose,
  onInsertInTest,
  onToggleFavorite,
  isFavorite,
  onSubmitForCuration,
  isDarkMode
}) {
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'items' | 'metrics'

  if (!task) return null;

  const cognitiveChip = {
    'Conhecer': 'oliva',
    'Compreender': 'oliva',
    'Aplicar': 'orange',
    'Analisar': 'storm',
    'Avaliar': 'lavender',
    'Criar': 'cherry'
  }[task.cognitiveProcess] || 'oliva';

  return (
    <aside className={`w-[600px] shrink-0 border-l flex flex-col h-full shadow-2xl relative font-['Montserrat',sans-serif] ${
      isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-7'
    }`}>
      {/* Header */}
      <div className={`p-6 border-b shrink-0 ${isDarkMode ? 'border-neutral-5 bg-neutral-7/60' : 'border-neutral-2 bg-neutral-1/40'}`}>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="space-y-1.5 flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              {task.isCurated ? (
                <Chips label="Curado MAPEAR" status="success" variant="dark" iconLeft={<Sparkles size={12} />} />
              ) : (
                <Chips label="Banco Pessoal" status="orange" variant="light" iconLeft={<User size={12} />} />
              )}
              <Chips label={task.subject} status="storm" variant="dark" />
              <Chips label={task.grade} status="neutral" variant="stroked" />
              {task.code && <Chips label={task.code} status="neutral" variant="dark" />}
            </div>

            <h2 className="text-lg font-bold text-neutral-8 dark:text-white leading-snug">{task.title}</h2>
          </div>

          <Button variant="tertiary" appearance="ghost" iconOnly iconLeft={<X size={20} />} onClick={onClose} />
        </div>

        {/* Social Proof & Rating Bar */}
        <div className="flex items-center justify-between text-xs pt-2 border-t border-neutral-2 dark:border-neutral-5 text-neutral-5 dark:text-neutral-4">
          <div className="flex items-center gap-1.5 font-semibold">
            <Star size={14} className="text-extended-orange-base fill-extended-orange-base" />
            <strong className="text-neutral-8 dark:text-white">{task.rating || 4.9}</strong>
            <span>({task.ratingCount || 38} avaliações)</span>
          </div>

          <div className="flex items-center gap-1 font-medium text-brand-500">
            <Building2 size={13} />
            <span>Usada por <strong>{task.networkUsageCount || 42} professores</strong> na rede</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 mt-4 pt-3 border-t border-neutral-2 dark:border-neutral-5">
          {onInsertInTest && (
            <Button
              variant="primary"
              appearance="solid"
              size="md"
              iconLeft={<Plus size={16} />}
              onClick={() => onInsertInTest(task)}
              className="flex-1"
            >
              Inserir no Teste Atual
            </Button>
          )}

          <Button
            variant={isFavorite ? 'secondary' : 'tertiary'}
            appearance="solid"
            size="md"
            iconLeft={<Star size={16} className={isFavorite ? 'fill-brand-500 text-brand-500' : ''} />}
            onClick={() => onToggleFavorite(task.id)}
          >
            {isFavorite ? 'Favoritada' : 'Favoritar'}
          </Button>

          {!task.isCurated && onSubmitForCuration && (
            <Button
              variant="tertiary"
              appearance="solid"
              size="md"
              iconLeft={<Sparkles size={16} />}
              onClick={() => onSubmitForCuration(task)}
            >
              Submeter à Curadoria
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b shrink-0 pl-4 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
        {[
          { id: 'overview', label: 'Visão Geral & Contexto' },
          { id: 'items', label: `Itens (${task.items?.length || 0})` },
          { id: 'metrics', label: 'Métricas da Rede' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-3 text-xs font-bold text-center transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-brand-500 text-brand-500 bg-brand-50/20'
                : 'border-transparent text-neutral-4 hover:text-neutral-6 dark:hover:text-neutral-2'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Body */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6 pb-24">
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Parameters Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-neutral-1 dark:bg-neutral-5/30 border border-neutral-2 dark:border-neutral-5 space-y-1">
                <span className="text-[10px] font-bold text-neutral-4 uppercase tracking-wider block">Processo Cognitivo (Bloom)</span>
                <Chips label={task.cognitiveProcess || 'Compreender'} status={cognitiveChip} variant="dark" iconLeft={<Brain />} />
              </div>
              <div className="p-3.5 rounded-xl bg-neutral-1 dark:bg-neutral-5/30 border border-neutral-2 dark:border-neutral-5 space-y-1">
                <span className="text-[10px] font-bold text-neutral-4 uppercase tracking-wider block">Tipo de Resposta</span>
                <Chips label={task.responseType || 'Múltipla Escolha'} status="neutral" variant="stroked" />
              </div>
            </div>

            {/* Suporte em Markdown (Item Composto / Texto de Leitura) */}
            {task.itemCompostoMarkdown && (
              <div className="p-4 rounded-xl border border-neutral-2 dark:border-neutral-5 bg-neutral-0 dark:bg-neutral-7 space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-brand-500 pb-2 border-b border-neutral-2 dark:border-neutral-5">
                  <FileText size={16} />
                  <span>Suporte / Texto de Leitura (Markdown): {task.itemCompostoTitle}</span>
                </div>
                <div className="text-xs text-neutral-7 dark:text-neutral-2 font-mono whitespace-pre-wrap leading-relaxed bg-neutral-1 dark:bg-neutral-6 p-3 rounded-lg border border-neutral-2 dark:border-neutral-5">
                  {task.itemCompostoMarkdown}
                </div>
              </div>
            )}

            {/* Expectativa de Desempenho */}
            {task.expectation && (
              <div className="p-4 rounded-xl border border-brand-200 bg-brand-50/40 dark:bg-brand-900/10 space-y-1.5">
                <div className="text-xs font-bold text-brand-500 flex items-center gap-1.5">
                  <Target size={15} /> Expectativa Pedagógica de Desempenho
                </div>
                <p className="text-xs text-neutral-7 dark:text-neutral-2 leading-relaxed">
                  {task.expectation}
                </p>
              </div>
            )}
          </div>
        )}

        {activeTab === 'items' && (
          <div className="space-y-4">
            {task.items?.map((item, idx) => (
              <div key={idx} className={`p-4 rounded-xl border space-y-3 ${isDarkMode ? 'bg-neutral-7 border-neutral-5' : 'bg-neutral-1/50 border-neutral-2'}`}>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-neutral-8 dark:text-white flex items-center gap-1.5">
                    <BookOpen size={14} className="text-brand-500" />
                    Item {String(idx + 1).padStart(2, '0')}: {item.title}
                  </span>
                  <Chips label={item.hasAnswer ? 'Gabarito ok' : 'Sem Gabarito'} status={item.hasAnswer ? 'success' : 'error'} variant="dark" />
                </div>

                {item.skill && (
                  <div className="flex items-center gap-2 flex-wrap">
                    <Chips label={item.skill} status="cherry" variant="dark" iconLeft={<Target />} />
                    <span className="text-xs text-neutral-6 dark:text-neutral-3">{item.skillDesc}</span>
                  </div>
                )}

                {item.descriptor && (
                  <div className="text-xs font-mono bg-white dark:bg-neutral-6 p-2 rounded border border-neutral-2 dark:border-neutral-5 text-extended-storm-base font-bold">
                    Descritor: {item.descriptor}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {activeTab === 'metrics' && (
          <div className="space-y-4">
            <div className="p-4 rounded-xl border border-neutral-2 dark:border-neutral-5 bg-neutral-1 dark:bg-neutral-5/30 space-y-3">
              <h4 className="text-xs font-bold text-neutral-8 dark:text-white uppercase tracking-wider flex items-center gap-2">
                <BarChart2 size={16} className="text-brand-500" />
                Métricas de Uso e Precisão na Rede
              </h4>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3 bg-white dark:bg-neutral-6 rounded-lg border border-neutral-2 dark:border-neutral-5">
                  <span className="text-neutral-4 block text-[10px] uppercase font-bold">Provas Aplicadas</span>
                  <strong className="text-lg text-neutral-8 dark:text-white">{task.applicationsCount || 142}</strong>
                </div>
                <div className="p-3 bg-white dark:bg-neutral-6 rounded-lg border border-neutral-2 dark:border-neutral-5">
                  <span className="text-neutral-4 block text-[10px] uppercase font-bold">Taxa Média de Acerto</span>
                  <strong className="text-lg text-semantic-success-dark">76.4%</strong>
                </div>
              </div>

              <div className="text-xs text-neutral-5 dark:text-neutral-4 font-medium pt-2">
                Esta tarefa possui alta taxa de discriminação pedagógica (0.68), recomendada para avaliações somativas e diagnósticas de rede.
              </div>
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
