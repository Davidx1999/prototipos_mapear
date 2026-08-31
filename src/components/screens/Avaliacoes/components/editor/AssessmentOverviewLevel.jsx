import React, { useState } from 'react';
import {
  BookMarked,
  Plus,
  ArrowRight,
  Trash2,
  Calendar,
  Sparkles,
  ShieldCheck,
  Brain,
  Sliders,
  Cpu,
  UserCheck
} from 'lucide-react';
import Button from '../../../../ui/Button';
import Tabs from '../../../../ui/Tabs';

const AssessmentOverviewLevel = ({
  assessment,
  onOpenTest,
  onAddTest,
  onDeleteTest,
  onUpdateAssessmentMeta,
  isDarkMode = false
}) => {
  const [activeTab, setActiveTab] = useState('cadernos'); // 'cadernos' | 'configuracoes'
  const tests = assessment?.tests || [];

  // Helper values
  const nature = (assessment?.type || 'Somativa').toUpperCase();
  const numAlternatives = assessment?.optionsCount === '5' || assessment?.optionsCount === 5 ? 5 : 4;
  const correctionType = (assessment?.correctionMethod || '').includes('IA') ? 'IA' : 'MANUAL';

  const cardBg = isDarkMode ? 'bg-neutral-850 border-neutral-700' : 'bg-white border-neutral-200 shadow-xs';
  
  const cardSelectorCls = (selected) =>
    `cursor-pointer transition-all rounded-[8px] border-2 p-4 ${
      selected
        ? 'border-[#0078B0] bg-white dark:bg-neutral-800 ring-2 ring-[#0078B0]/20'
        : isDarkMode
        ? 'border-neutral-700 bg-neutral-900/60 hover:border-neutral-600'
        : 'border-neutral-200 bg-white hover:border-neutral-300'
    }`;

  const inputCls = `w-full px-3.5 h-[38px] border rounded-[6px] text-xs font-medium outline-none transition-all ${
    isDarkMode
      ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#0078B0]'
      : 'bg-white border-neutral-300 text-neutral-800 focus:border-[#0078B0]'
  }`;

  // Tabs padronizadas do Design System
  const tabsList = [
    {
      id: 'cadernos',
      label: `Cadernos de Testes (${tests.length})`,
      icon: <BookMarked size={16} />
    },
    {
      id: 'configuracoes',
      label: 'Configurações da Avaliação',
      icon: <Sliders size={16} />
    }
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-6 py-8 flex flex-col gap-6">
      
      {/* ══════════════════════════════════════════════════════ */}
      {/* HEADER DA AVALIAÇÃO COM METADADOS E ABAS               */}
      {/* ══════════════════════════════════════════════════════ */}
      <div
        className={`p-6 rounded-[8px] border transition-colors flex flex-col gap-5 ${
          isDarkMode
            ? 'bg-neutral-850 border-neutral-700 text-white'
            : 'bg-white border-neutral-200 text-neutral-900 shadow-xs'
        }`}
      >
        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-[#0078B0] bg-[#0078B0]/10 px-2.5 py-0.5 rounded-[4px]">
                {assessment?.code || 'AV-2026'}
              </span>
              <span className="text-xs text-neutral-400 font-medium">
                {assessment?.grade || '5º Ano - EF'} • {assessment?.subject || 'Língua Portuguesa'} • Ano Letivo {assessment?.schoolYear || '2026'}
              </span>
            </div>

            <h1 className="text-xl font-bold tracking-tight text-neutral-900 dark:text-white">
              {assessment?.title || 'Nova Avaliação'}
            </h1>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {activeTab === 'cadernos' && (
              <Button
                variant="primary"
                appearance="solid"
                size="sm"
                iconLeft={<Plus size={14} />}
                onClick={onAddTest}
              >
                Novo Caderno de Teste
              </Button>
            )}
          </div>
        </div>

        {/* Abas Padronizadas: Cadernos de Testes | Configurações da Avaliação */}
        <div className="pt-2 border-t border-neutral-100 dark:border-neutral-700/60">
          <Tabs
            tabs={tabsList}
            activeTab={activeTab}
            onChange={setActiveTab}
            variant="line"
            size="sm"
          />
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTEXTO 1: CADERNOS DE TESTES (ESTRUTURA PEDAGÓGICA)  */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === 'cadernos' && (
        <section className="flex flex-col gap-4 animate-fade-in-up">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-neutral-900 dark:text-white tracking-tight flex items-center gap-2">
                <BookMarked size={18} className="text-[#0078B0]" />
                Cadernos de Testes da Avaliação
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Selecione um caderno para gerenciar suas tarefas e itens pedagógicos.
              </p>
            </div>

            <span className="text-xs font-semibold text-neutral-500">
              {tests.length} {tests.length === 1 ? 'caderno cadastrado' : 'cadernos cadastrados'}
            </span>
          </div>

          {/* Grid de Cadernos de Testes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {tests.map((teste, idx) => {
              const taskCount = teste.tasks?.length || 0;
              const itemCount = (teste.tasks || []).reduce((acc, t) => acc + (t.items?.length || 0), 0);

              return (
                <div
                  key={teste.id || idx}
                  onClick={() => onOpenTest(teste.id)}
                  className={`p-5 rounded-[8px] border transition-all cursor-pointer group flex flex-col justify-between gap-4 ${
                    isDarkMode
                      ? 'bg-neutral-850 border-neutral-700 hover:border-[#0078B0] hover:bg-neutral-800'
                      : 'bg-white border-neutral-200 hover:border-[#0078B0] hover:shadow-xs'
                  }`}
                >
                  <div className="flex flex-col gap-2">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[11px] font-bold text-neutral-500 bg-neutral-100 dark:bg-neutral-800 px-2 py-0.5 rounded-[4px]">
                        {teste.code || `CAD-0${idx + 1}`}
                      </span>
                      <span className="text-xs text-neutral-400 font-medium">
                        {taskCount} {taskCount === 1 ? 'tarefa' : 'tarefas'} • {itemCount} {itemCount === 1 ? 'item' : 'itens'}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-neutral-900 dark:text-white group-hover:text-[#0078B0] transition-colors line-clamp-1">
                      {teste.title}
                    </h3>

                    {/* Tasks Preview */}
                    <div className="flex flex-col gap-1 mt-1">
                      {(teste.tasks || []).slice(0, 3).map((task, tIdx) => (
                        <div key={tIdx} className="flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 truncate">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#0078B0] shrink-0" />
                          <span className="truncate">{task.title}</span>
                        </div>
                      ))}
                      {taskCount > 3 && (
                        <span className="text-[11px] text-neutral-400 italic">
                          + {taskCount - 3} {taskCount - 3 === 1 ? 'outra tarefa...' : 'outras tarefas...'}
                        </span>
                      )}
                      {taskCount === 0 && (
                        <span className="text-xs text-neutral-400 italic">Nenhuma tarefa criada neste teste.</span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-neutral-100 dark:border-neutral-700/60 mt-auto">
                    <span className="text-xs font-bold text-[#0078B0] group-hover:underline flex items-center gap-1">
                      Abrir Caderno <ArrowRight size={13} />
                    </span>

                    {tests.length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteTest(teste.id);
                        }}
                        className="p-1.5 rounded-[4px] text-neutral-400 hover:text-red-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
                        title="Excluir Caderno de Teste"
                      >
                        <Trash2 size={13} />
                      </button>
                    )}
                  </div>
                </div>
              );
            })}

            {/* Adicionar Novo Caderno Box */}
            <button
              type="button"
              onClick={onAddTest}
              className={`p-6 rounded-[8px] border-2 border-dashed transition-all flex flex-col items-center justify-center gap-2.5 min-h-[160px] text-neutral-500 hover:text-[#0078B0] cursor-pointer ${
                isDarkMode
                  ? 'border-neutral-700 hover:border-[#0078B0] bg-neutral-850/40 hover:bg-neutral-800/60'
                  : 'border-neutral-300 hover:border-[#0078B0] bg-neutral-50/50 hover:bg-[#F2FAFE]'
              }`}
            >
              <div className="w-9 h-9 rounded-full bg-white dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 flex items-center justify-center shadow-xs">
                <Plus size={16} className="text-[#0078B0]" />
              </div>
              <span className="text-xs font-bold">Adicionar Novo Caderno de Teste</span>
            </button>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════ */}
      {/* CONTEXTO 2: CONFIGURAÇÕES DA AVALIAÇÃO (INSTRUMENTO)   */}
      {/* ══════════════════════════════════════════════════════ */}
      {activeTab === 'configuracoes' && (
        <div className="flex flex-col gap-6 animate-fade-in-up">
          
          {/* Identificação Pedagógica do Instrumento */}
          <div className={`p-6 md:p-8 rounded-[8px] border space-y-4 ${cardBg}`}>
            <h2 className="text-xs font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 border-b border-neutral-100 dark:border-neutral-700/60 pb-2.5">
              Identificação Pedagógica do Instrumento
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-1">
              <div className="flex flex-col gap-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  Ano Escolar / Etapa
                </label>
                <input
                  type="text"
                  value={assessment?.grade || ''}
                  onChange={e => onUpdateAssessmentMeta?.({ grade: e.target.value })}
                  placeholder="Ex: 5º Ano - Ensino Fundamental"
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  Componente Curricular
                </label>
                <input
                  type="text"
                  value={assessment?.subject || ''}
                  onChange={e => onUpdateAssessmentMeta?.({ subject: e.target.value })}
                  placeholder="Ex: Língua Portuguesa"
                  className={inputCls}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                  Ano Letivo
                </label>
                <input
                  type="text"
                  value={assessment?.schoolYear || '2026'}
                  onChange={e => onUpdateAssessmentMeta?.({ schoolYear: e.target.value })}
                  placeholder="Ex: 2026"
                  className={inputCls}
                />
              </div>
            </div>
          </div>

          {/* ─── 1. NATUREZA DA AVALIAÇÃO ─── */}
          <div className={`p-6 md:p-8 rounded-[8px] border space-y-4 ${cardBg}`}>
            <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
              Natureza da Avaliação <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  key: 'SOMATIVA',
                  label: 'Somativa',
                  desc: 'Avaliação de resultado ao final de um período letivo ou unidade curricular.',
                  icon: ShieldCheck,
                  badgeBg: 'bg-[#E11D48]'
                },
                {
                  key: 'DIAGNOSTICA',
                  label: 'Diagnóstica',
                  desc: 'Mapeamento inicial de aprendizagem para identificação de lacunas.',
                  icon: Brain,
                  badgeBg: 'bg-[#65A30D]'
                },
                {
                  key: 'FORMATIVA',
                  label: 'Formativa',
                  desc: 'Acompanhamento contínuo durante o processo de ensino-aprendizagem.',
                  icon: Sparkles,
                  badgeBg: 'bg-[#0284C7]'
                }
              ].map(opt => {
                const isSelected = nature.startsWith(opt.key.substring(0, 4));
                const IconComp = opt.icon;

                return (
                  <div
                    key={opt.key}
                    onClick={() => onUpdateAssessmentMeta?.({ type: opt.label })}
                    className={cardSelectorCls(isSelected)}
                  >
                    <div className="flex items-start justify-between">
                      <div className={isSelected ? 'text-[#0078B0]' : 'text-neutral-400'}>
                        <IconComp size={22} />
                      </div>
                      <span className={`text-white text-[11px] font-bold px-3 py-0.5 rounded-full ${opt.badgeBg}`}>
                        {opt.label}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-neutral-500 dark:text-neutral-400 mt-3 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ─── 2. QUANTIDADE DE ALTERNATIVAS POR ITEM ─── */}
          <div className={`p-6 md:p-8 rounded-[8px] border space-y-4 ${cardBg}`}>
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300">
                Quantidade de Alternativas por Item <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-neutral-400 mt-0.5">
                Defina se os itens de Múltipla Escolha terão 4 ou 5 opções, conforme a estratégia pedagógica.
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div
                onClick={() => onUpdateAssessmentMeta?.({ optionsCount: 4 })}
                className={`${cardSelectorCls(numAlternatives === 4)} flex items-center gap-4`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    numAlternatives === 4
                      ? 'bg-[#0078B0]/15 text-[#0078B0] dark:bg-[#0078B0]/30'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                  }`}
                >
                  A-D
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    4 Alternativas (A, B, C, D)
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Padrão para Ensino Fundamental e avaliações diretas.
                  </p>
                </div>
              </div>

              <div
                onClick={() => onUpdateAssessmentMeta?.({ optionsCount: 5 })}
                className={`${cardSelectorCls(numAlternatives === 5)} flex items-center gap-4`}
              >
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 ${
                    numAlternatives === 5
                      ? 'bg-[#0078B0]/15 text-[#0078B0] dark:bg-[#0078B0]/30'
                      : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                  }`}
                >
                  A-E
                </div>
                <div>
                  <h3 className="font-bold text-sm text-neutral-900 dark:text-white">
                    5 Alternativas (A, B, C, D, E)
                  </h3>
                  <p className="text-[11px] text-neutral-500 dark:text-neutral-400 mt-0.5">
                    Padrão para Ensino Médio, ENEM e vestibulares.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* ─── 3. CONFIGURAÇÕES DA CORREÇÃO DO INSTRUMENTO ─── */}
          <div className={`p-6 md:p-8 rounded-[8px] border space-y-6 ${cardBg}`}>
            <div className="flex items-center gap-2.5 border-b border-neutral-100 dark:border-neutral-700/60 pb-3">
              <div className="w-7 h-7 rounded-full bg-[#0078B0]/10 text-[#0078B0] flex items-center justify-center">
                <ShieldCheck size={16} />
              </div>
              <h2 className="text-sm font-bold text-neutral-900 dark:text-white">
                Metodologia e Regras de Correção
              </h2>
            </div>

            {/* Metodologia */}
            <div>
              <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-600 dark:text-neutral-300 mb-3">
                Metodologia de Correção
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div
                  onClick={() => onUpdateAssessmentMeta?.({ correctionMethod: 'Manual (Professores)' })}
                  className={`${cardSelectorCls(correctionType === 'MANUAL')} flex items-center gap-4`}
                >
                  <div
                    className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${
                      correctionType === 'MANUAL'
                        ? 'bg-[#0078B0]/15 text-[#0078B0] dark:bg-[#0078B0]/30'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <UserCheck size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      Manual (Professores)
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-4">
                      Correção pedagógica realizada diretamente pelos docentes.
                    </p>
                  </div>
                </div>

                <div
                  onClick={() => onUpdateAssessmentMeta?.({ correctionMethod: 'Assistida por IA' })}
                  className={`${cardSelectorCls(correctionType === 'IA')} flex items-center gap-4`}
                >
                  <div
                    className={`w-10 h-10 rounded-[8px] flex items-center justify-center shrink-0 ${
                      correctionType === 'IA'
                        ? 'bg-[#0078B0]/15 text-[#0078B0] dark:bg-[#0078B0]/30'
                        : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-400'
                    }`}
                  >
                    <Cpu size={20} />
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-neutral-900 dark:text-white">
                      Assistida por IA (HTR)
                    </h4>
                    <p className="text-[11px] text-neutral-500 dark:text-neutral-4">
                      Pré-análise automatizada via inteligência artificial para gabarito e respostas.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Avaliadores e Validadores */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                  Avaliadores por Item
                </label>
                <select
                  value={assessment?.ratersPerItem || '1 Avaliador'}
                  onChange={e => onUpdateAssessmentMeta?.({ ratersPerItem: e.target.value })}
                  className={inputCls}
                >
                  <option value="1 Avaliador">1 Avaliador</option>
                  <option value="2 Avaliadores (Dupla Correção)">2 Avaliadores (Dupla Correção)</option>
                  <option value="3 Avaliadores">3 Avaliadores</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-500 mb-1">
                  Validação de Divergências
                </label>
                <select
                  value={assessment?.validatorsCount || 'Sem Validador'}
                  onChange={e => onUpdateAssessmentMeta?.({ validatorsCount: e.target.value })}
                  className={inputCls}
                >
                  <option value="Sem Validador">Sem Validador Adicional</option>
                  <option value="1 Validador de Divergência">1 Validador Especialista</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssessmentOverviewLevel;
