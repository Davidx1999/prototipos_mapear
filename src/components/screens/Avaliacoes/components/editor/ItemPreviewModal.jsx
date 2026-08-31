import React, { useState } from 'react';
import { X, Eye, Printer, CheckCircle2, BookOpen, Sparkles, Layers } from 'lucide-react';

const ItemPreviewModal = ({
  isOpen,
  onClose,
  item,
  taskContext,
  assessmentMeta,
  isDarkMode = false
}) => {
  const [previewMode, setPreviewMode] = useState('student'); // 'student' | 'teacher'

  if (!isOpen || !item) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-['Montserrat',sans-serif]">
      <div
        className={`w-full max-w-3xl rounded-[8px] border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${
          isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
        }`}
      >
        {/* Modal Header */}
        <div
          className={`p-4 px-6 border-b flex items-center justify-between shrink-0 ${
            isDarkMode ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-neutral-50/80'
          }`}
        >
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-[4px] bg-[#0078B0]/10 text-[#0078B0] flex items-center justify-center">
              <Eye size={18} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-[15px] font-bold">
                  Prévia de Impressão e Aplicação
                </h2>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded-[4px] bg-neutral-200 dark:bg-neutral-700 text-neutral-700 dark:text-neutral-300">
                  {item.code || 'Item'}
                </span>
              </div>
              <p className="text-[12px] text-neutral-500">
                {assessmentMeta?.title || 'Avaliação Somativa'} • {assessmentMeta?.grade || '5º Ano'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* View Mode Toggle */}
            <div className="flex items-center p-0.5 rounded-[4px] bg-neutral-200 dark:bg-neutral-700 text-xs font-semibold">
              <button
                type="button"
                onClick={() => setPreviewMode('student')}
                className={`px-3 py-1 rounded-[4px] transition-all ${
                  previewMode === 'student'
                    ? 'bg-white dark:bg-neutral-800 text-[#0078B0] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Visão do Estudante
              </button>
              <button
                type="button"
                onClick={() => setPreviewMode('teacher')}
                className={`px-3 py-1 rounded-[4px] transition-all ${
                  previewMode === 'teacher'
                    ? 'bg-white dark:bg-neutral-800 text-[#0078B0] shadow-xs'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-neutral-900'
                }`}
              >
                Gabarito & Critérios
              </button>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-[4px] flex items-center justify-center text-neutral-400 hover:text-neutral-700 hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Modal Body - Paper Simulation */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 bg-neutral-100 dark:bg-neutral-900 flex justify-center">
          <div
            className={`w-full max-w-2xl border rounded-[8px] p-6 md:p-8 shadow-sm flex flex-col gap-6 ${
              isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-900'
            }`}
          >
            {/* Caderno Simulated Header */}
            <div className="pb-4 border-b border-dashed border-neutral-300 dark:border-neutral-700 flex items-center justify-between text-xs text-neutral-500">
              <span className="font-semibold uppercase tracking-wider">
                {assessmentMeta?.municipality || 'Sobral'} • Caderno Oficial MAPEAR
              </span>
              <span>{item.type === 'multipla_escolha' ? 'Múltipla Escolha' : item.type === 'resposta_construida' ? 'Resposta Construída' : 'Híbrida'}</span>
            </div>

            {/* Context / Stimulus Text (if present in task or item) */}
            {(taskContext?.itemComposto?.content || item.contexto) && (
              <div
                className={`p-4 rounded-[6px] border text-xs leading-relaxed ${
                  isDarkMode ? 'bg-neutral-900/50 border-neutral-700 text-neutral-300' : 'bg-neutral-50 border-neutral-200 text-neutral-700'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold mb-2 text-neutral-600 dark:text-neutral-400 uppercase tracking-wider text-[10px]">
                  <BookOpen size={13} />
                  <span>Texto de Apoio / Estímulo</span>
                </div>
                <div className="whitespace-pre-line font-serif text-[13px] leading-relaxed">
                  {taskContext?.itemComposto?.content || item.contexto}
                </div>
              </div>
            )}

            {/* Item Enunciado */}
            <div className="flex flex-col gap-3">
              <div className="flex items-start gap-2.5">
                <span className="font-bold text-sm text-[#0078B0] shrink-0 pt-0.5">
                  {item.code || 'Item 01'}.
                </span>
                <p className="text-[14px] leading-relaxed font-medium whitespace-pre-line flex-1">
                  {item.enunciado || 'Enunciado principal da questão...'}
                </p>
              </div>
            </div>

            {/* Item Answers / Options */}
            {item.type === 'multipla_escolha' || item.type === 'hibrida' ? (
              <div className="flex flex-col gap-2.5 pl-6">
                {(item.alternativas || []).map((alt) => {
                  const isCorrect = alt.isCorreta;
                  const showTeacherHighlight = previewMode === 'teacher' && isCorrect;

                  return (
                    <div
                      key={alt.id || alt.letra}
                      className={`p-3 rounded-[6px] border flex items-start gap-3 transition-all ${
                        showTeacherHighlight
                          ? isDarkMode
                            ? 'bg-emerald-950/40 border-emerald-700 text-emerald-100'
                            : 'bg-emerald-50/80 border-emerald-400 text-emerald-900'
                          : isDarkMode
                          ? 'border-neutral-700 bg-neutral-800/40'
                          : 'border-neutral-200 bg-white'
                      }`}
                    >
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center font-bold text-xs shrink-0 mt-0.5 ${
                          showTeacherHighlight
                            ? 'border-emerald-600 bg-emerald-600 text-white'
                            : 'border-neutral-400 text-neutral-600 dark:text-neutral-400'
                        }`}
                      >
                        {alt.letra}
                      </div>

                      <div className="flex-1 text-[13px] leading-relaxed">
                        <span>{alt.texto || `Alternativa ${alt.letra}`}</span>

                        {previewMode === 'teacher' && (
                          <div className="mt-2 pt-2 border-t border-dashed border-neutral-200 dark:border-neutral-700 text-[11px] flex flex-col gap-0.5">
                            <span className="font-semibold text-neutral-500">
                              {isCorrect ? 'Gabarito Oficial' : 'Diagnóstico do Distrator'}:
                            </span>
                            <p className="text-neutral-600 dark:text-neutral-400 italic">
                              {alt.analiseDistrator || 'Nenhuma justificativa pedagógica cadastrada.'}
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : null}

            {/* Constructed Response Box Simulation */}
            {(item.type === 'resposta_construida' || item.type === 'hibrida') && (
              <div className="flex flex-col gap-2 pl-6">
                <span className="text-xs font-semibold text-neutral-500 uppercase tracking-wider">
                  Espaço para Resposta do Estudante:
                </span>
                <div className="border border-neutral-300 dark:border-neutral-700 rounded-[6px] p-3 bg-neutral-50/50 dark:bg-neutral-900/30 flex flex-col gap-4">
                  <div className="border-b border-dashed border-neutral-300 dark:border-neutral-700 h-6" />
                  <div className="border-b border-dashed border-neutral-300 dark:border-neutral-700 h-6" />
                  <div className="border-b border-dashed border-neutral-300 dark:border-neutral-700 h-6" />
                  <div className="border-b border-dashed border-neutral-300 dark:border-neutral-700 h-6" />
                </div>

                {previewMode === 'teacher' && (
                  <div className="mt-3 p-3 rounded-[6px] bg-[#F2FAFE] dark:bg-sky-950/40 border border-[#B3E6F5] dark:border-sky-800 text-xs">
                    <span className="font-bold text-[#0078B0] dark:text-sky-300 block mb-1">
                      Modelo de Resposta Esperada:
                    </span>
                    <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                      {item.respostaEsperada || 'Não informada.'}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Teacher Criteria Panel */}
            {previewMode === 'teacher' && (
              <div className="mt-4 pt-4 border-t border-neutral-200 dark:border-neutral-700 flex flex-col gap-3 text-xs">
                <div className="grid grid-cols-2 gap-3 bg-neutral-50 dark:bg-neutral-900/60 p-3 rounded-[6px] border border-neutral-200 dark:border-neutral-700">
                  <div>
                    <span className="text-neutral-500 block font-semibold">Habilidade BNCC:</span>
                    <span className="font-bold text-[#0078B0]">
                      {item.habilidadeBNCC?.id} - {item.habilidadeBNCC?.desc}
                    </span>
                  </div>
                  <div>
                    <span className="text-neutral-500 block font-semibold">Processo Cognitivo / Matriz:</span>
                    <span className="font-bold text-neutral-800 dark:text-neutral-200">
                      {item.processoCognitivo} • {item.sentencaDescritora || 'D1'}
                    </span>
                  </div>
                </div>

                {item.rubricas && (
                  <div className="flex flex-col gap-1.5">
                    <span className="font-bold text-neutral-700 dark:text-neutral-300">Padrões de Desempenho (Rubricas):</span>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                      <div className="p-2.5 rounded-[4px] border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                        <span className="font-bold text-red-600 block text-[11px]">Nível 0: Insuficiente</span>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">{item.rubricas.insuficiente}</p>
                      </div>
                      <div className="p-2.5 rounded-[4px] border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                        <span className="font-bold text-amber-600 block text-[11px]">Nível 1: Parcial</span>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">{item.rubricas.parcial}</p>
                      </div>
                      <div className="p-2.5 rounded-[4px] border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-800">
                        <span className="font-bold text-emerald-600 block text-[11px]">Nível 2: Suficiente</span>
                        <p className="text-[11px] text-neutral-600 dark:text-neutral-400 mt-1">{item.rubricas.suficiente}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div
          className={`p-4 px-6 border-t flex items-center justify-between shrink-0 ${
            isDarkMode ? 'border-neutral-700 bg-neutral-800' : 'border-neutral-200 bg-neutral-50/50'
          }`}
        >
          <span className="text-[12px] text-neutral-500">
            Formato: Diagramação Padrão A4 MAPEAR
          </span>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => window.print()}
              className={`px-4 py-2 text-[13px] font-semibold rounded-[4px] border flex items-center gap-1.5 transition-colors ${
                isDarkMode
                  ? 'border-neutral-600 text-neutral-300 hover:bg-neutral-700'
                  : 'border-neutral-300 text-neutral-700 hover:bg-neutral-100'
              }`}
            >
              <Printer size={14} /> Imprimir / PDF
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2 text-[13px] font-bold rounded-[4px] bg-[#0078B0] text-white hover:bg-[#006899] transition-colors"
            >
              Fechar Prévia
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ItemPreviewModal;
