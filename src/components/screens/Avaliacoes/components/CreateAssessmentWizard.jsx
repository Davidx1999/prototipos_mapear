import React, { useState } from 'react';
import { X, ChevronRight, ChevronLeft, Check, BookOpen, Puzzle, Brain, Target, Calendar, Cpu, Printer, Monitor, Sparkles } from 'lucide-react';

/**
 * CreateAssessmentWizard — Modal multi-step de criação personalizada de avaliação.
 * 
 * Fundamentação UX:
 * - Teoria da Ação de Norman: Estreita o Golfo de Execução com steps guiados.
 * - H1 Nielsen (Visibilidade do Estado): Barra de progresso mostra step atual.
 * - H5 Nielsen (Prevenção de Erros): Validação por step antes de avançar.
 * - H2 Nielsen (Correspondência com o Mundo Real): Vocabulário pedagógico do dia-a-dia.
 */

const ASSESSMENT_TYPES = [
  { id: 'somativa', label: 'Somativa', icon: Target, desc: 'Avaliação de resultado ao final de um período letivo ou unidade.', color: 'bg-extended-cherry-extraLight border-extended-cherry-light text-extended-cherry-dark' },
  { id: 'diagnostica', label: 'Diagnóstica', icon: Brain, desc: 'Mapeamento inicial de conhecimentos para planejamento pedagógico.', color: 'bg-extended-oliva-extraLight border-extended-oliva-light text-extended-oliva-dark' },
  { id: 'formativa', label: 'Formativa', icon: Sparkles, desc: 'Acompanhamento contínuo durante o processo de ensino-aprendizagem.', color: 'bg-extended-storm-extraLight border-extended-storm-light text-extended-storm-dark' },
];

const CORRECTION_METHODS = [
  { id: 'manual', label: 'Correção Manual', icon: Puzzle, desc: 'Professores e corretores revisam manualmente cada resposta.' },
  { id: 'ia-htr', label: 'Correção com IA (HTR)', icon: Cpu, desc: 'Reconhecimento de escrita manuscrita e agrupamento automático.' },
  { id: 'hibrida', label: 'Híbrida (IA + Manual)', icon: Sparkles, desc: 'IA pré-processa, humanos revisam e validam.' },
];

const APPLICATION_MODES = [
  { id: 'digital', label: 'Digital', icon: Monitor },
  { id: 'impressa', label: 'Impressa', icon: Printer },
  { id: 'hibrida', label: 'Híbrida', icon: Sparkles },
];

const MUNICIPALITIES = ['Sobral', 'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Crato'];
const GRADES = ['1º Ano - EF', '2º Ano - EF', '3º Ano - EF', '4º Ano - EF', '5º Ano - EF', '6º Ano - EF', '7º Ano - EF', '8º Ano - EF', '9º Ano - EF', '1ª Série - EM', '2ª Série - EM', '3ª Série - EM'];
const SUBJECTS = ['Língua Portuguesa', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Multidisciplinar'];

const STEPS = [
  { id: 1, title: 'Identificação & Escopo', desc: 'Defina o nome, tipo e público-alvo da avaliação' },
  { id: 2, title: 'Estrutura de Testes', desc: 'Quantos cadernos (Testes) essa avaliação terá?' },
  { id: 3, title: 'Correção & Aplicação', desc: 'Como a avaliação será aplicada e corrigida?' },
  { id: 4, title: 'Resumo & Confirmação', desc: 'Revise antes de criar' },
];

export default function CreateAssessmentWizard({ isOpen, onClose, onCreateAssessment, generateCode, isDarkMode }) {
  const [currentStep, setCurrentStep] = useState(1);

  // Step 1 fields
  const [title, setTitle] = useState('');
  const [assessmentType, setAssessmentType] = useState('');
  const [municipality, setMunicipality] = useState('Sobral');
  const [grade, setGrade] = useState('');
  const [subject, setSubject] = useState('');

  // Step 2 fields
  const [testsConfig, setTestsConfig] = useState([{ name: 'Caderno 01', description: '' }]);

  // Step 3 fields
  const [correctionMethod, setCorrectionMethod] = useState('');
  const [applicationMode, setApplicationMode] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const generatedCode = generateCode ? generateCode(municipality) : `AV-${municipality.substring(0, 3).toUpperCase()}-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9000) + 1000)}`;

  if (!isOpen) return null;

  const canAdvanceStep1 = title.trim() && assessmentType && municipality && grade && subject;
  const canAdvanceStep2 = testsConfig.length > 0 && testsConfig.every(t => t.name.trim());
  const canAdvanceStep3 = correctionMethod && applicationMode;

  const addTest = () => {
    setTestsConfig(prev => [...prev, { name: `Caderno ${String(prev.length + 1).padStart(2, '0')}`, description: '' }]);
  };

  const removeTest = (idx) => {
    if (testsConfig.length <= 1) return;
    setTestsConfig(prev => prev.filter((_, i) => i !== idx));
  };

  const updateTest = (idx, field, value) => {
    setTestsConfig(prev => prev.map((t, i) => i === idx ? { ...t, [field]: value } : t));
  };

  const handleCreate = () => {
    const typeLabels = { somativa: 'Somativa', diagnostica: 'Diagnóstica', formativa: 'Formativa' };
    const corrLabels = { manual: 'Correção Manual', 'ia-htr': 'Correção com IA (HTR)', hibrida: 'Híbrida (IA + Manual)' };

    onCreateAssessment({
      code: generatedCode,
      title,
      type: typeLabels[assessmentType] || assessmentType,
      municipality,
      grade,
      subject,
      correctionMethod: corrLabels[correctionMethod] || correctionMethod,
      applicationMode,
      startDate,
      endDate,
      testsConfig: testsConfig.map(t => ({ ...t })),
    });

    // Reset
    setCurrentStep(1);
    setTitle('');
    setAssessmentType('');
    setGrade('');
    setSubject('');
    setTestsConfig([{ name: 'Caderno 01', description: '' }]);
    setCorrectionMethod('');
    setApplicationMode('');
    setStartDate('');
    setEndDate('');
    onClose();
  };

  const inputClasses = `w-full px-3.5 h-[42px] border rounded-[8px] text-[13px] outline-none transition-all font-medium ${
    isDarkMode
      ? 'bg-neutral-7 border-neutral-5 text-white focus:border-extended-storm-base focus:ring-2 focus:ring-extended-storm-base/20'
      : 'bg-white border-neutral-2 text-neutral-7 focus:border-extended-storm-base focus:ring-2 focus:ring-extended-storm-base/20'
  }`;

  const selectClasses = `${inputClasses} cursor-pointer appearance-none`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div
        className={`w-full max-w-2xl max-h-[90vh] rounded-[8px] shadow-2xl border overflow-hidden flex flex-col ${
          isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-2 text-neutral-7'
        }`}
        onClick={e => e.stopPropagation()}
      >
        {/* Header with Progress Bar */}
        <div className={`p-5 pb-4 border-b ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-neutral-7 dark:text-white">Criar Nova Avaliação</h2>
              <p className="text-xs text-neutral-4 mt-0.5">Etapa {currentStep} de {STEPS.length} — {STEPS[currentStep - 1].desc}</p>
            </div>
            <button onClick={onClose} className="p-1.5 rounded-[8px] hover:bg-neutral-2 dark:hover:bg-neutral-5 text-neutral-4 transition-colors">
              <X size={20} />
            </button>
          </div>

          {/* Step Progress Bar — H1 Nielsen (Visibilidade do Estado do Sistema) */}
          <div className="flex items-center gap-2">
            {STEPS.map((step, idx) => (
              <div key={step.id} className="flex items-center gap-2 flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div className={`w-full h-1.5 rounded-full transition-all ${
                    currentStep > step.id
                      ? 'bg-extended-storm-base'
                      : currentStep === step.id
                      ? 'bg-extended-storm-light'
                      : isDarkMode ? 'bg-neutral-5' : 'bg-neutral-2'
                  }`} />
                  <span className={`text-[10px] mt-1.5 font-semibold text-center leading-tight ${
                    currentStep >= step.id ? 'text-extended-storm-base' : 'text-neutral-4'
                  }`}>
                    {step.title}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Body — Scrollable */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5">

          {/* ─── STEP 1: Identificação & Escopo ─── */}
          {currentStep === 1 && (
            <div className="space-y-4">
              {/* Código Automático Preview */}
              <div className={`flex items-center gap-3 p-3 rounded-[8px] border ${isDarkMode ? 'bg-neutral-7/50 border-neutral-5' : 'bg-extended-storm-extraLight/50 border-extended-storm-light/40'}`}>
                <span className="text-xs font-bold text-neutral-4 uppercase tracking-wider">Código gerado:</span>
                <span className="font-mono text-sm font-bold text-extended-storm-base bg-white dark:bg-neutral-6 px-3 py-1 rounded-[4px] border border-extended-storm-light/40">
                  {generatedCode}
                </span>
                <span className="text-[10px] text-neutral-4">Padrão AV-[MUNICÍPIO]-[ANO]-[SEQ]</span>
              </div>

              {/* Título */}
              <div>
                <label className="text-xs font-bold text-neutral-6 dark:text-neutral-2 mb-1.5 block">Título da Avaliação *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ex: Avaliação Diagnóstica de Matemática - 5º Ano"
                  className={inputClasses}
                />
              </div>

              {/* Tipo de Avaliação — Cards Visuais */}
              <div>
                <label className="text-xs font-bold text-neutral-6 dark:text-neutral-2 mb-2 block">Tipo de Avaliação *</label>
                <div className="grid grid-cols-3 gap-3">
                  {ASSESSMENT_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => setAssessmentType(t.id)}
                      className={`p-3 rounded-[8px] border-2 text-left transition-all ${
                        assessmentType === t.id
                          ? `${t.color} border-current shadow-md ring-2 ring-current/20`
                          : isDarkMode
                          ? 'border-neutral-5 bg-neutral-7 hover:border-neutral-4'
                          : 'border-neutral-2 bg-white hover:border-neutral-3 hover:shadow-sm'
                      }`}
                    >
                      <t.icon size={20} className={assessmentType === t.id ? '' : 'text-neutral-4'} />
                      <div className="font-bold text-xs mt-2">{t.label}</div>
                      <div className="text-[10px] text-neutral-4 mt-1 leading-tight">{t.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Grid: Município, Ano, Disciplina */}
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-6 dark:text-neutral-2 mb-1.5 block">Município *</label>
                  <select value={municipality} onChange={e => setMunicipality(e.target.value)} className={selectClasses}>
                    {MUNICIPALITIES.map(m => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-6 dark:text-neutral-2 mb-1.5 block">Ano/Etapa *</label>
                  <select value={grade} onChange={e => setGrade(e.target.value)} className={selectClasses}>
                    <option value="">Selecione...</option>
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-6 dark:text-neutral-2 mb-1.5 block">Disciplina *</label>
                  <select value={subject} onChange={e => setSubject(e.target.value)} className={selectClasses}>
                    <option value="">Selecione...</option>
                    {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 2: Estrutura de Testes ─── */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div className={`p-3 rounded-[8px] border flex items-center gap-2 ${isDarkMode ? 'bg-neutral-7/50 border-neutral-5' : 'bg-extended-storm-extraLight/30 border-extended-storm-light/30'}`}>
                <BookOpen size={16} className="text-extended-storm-base" />
                <span className="text-xs text-neutral-6 dark:text-neutral-2">
                  Cada <strong className="text-extended-storm-base">Teste</strong> representa um caderno do estudante. Você poderá adicionar Tarefas e Itens depois.
                </span>
              </div>

              <div className="space-y-3">
                {testsConfig.map((t, idx) => (
                  <div key={idx} className={`p-3 rounded-[8px] border-l-4 border-l-extended-storm-base border border-neutral-2 dark:border-neutral-5 ${isDarkMode ? 'bg-neutral-7' : 'bg-white'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-extended-storm-base flex items-center gap-1.5">
                        <BookOpen size={14} />
                        Teste {String(idx + 1).padStart(2, '0')}
                      </span>
                      {testsConfig.length > 1 && (
                        <button onClick={() => removeTest(idx)} className="text-[10px] text-semantic-error-base hover:underline font-semibold">
                          Remover
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={t.name}
                      onChange={e => updateTest(idx, 'name', e.target.value)}
                      placeholder="Nome do Caderno"
                      className={`${inputClasses} mb-2`}
                    />
                    <input
                      type="text"
                      value={t.description}
                      onChange={e => updateTest(idx, 'description', e.target.value)}
                      placeholder="Descrição breve (opcional)"
                      className={inputClasses}
                    />
                  </div>
                ))}
              </div>

              <button onClick={addTest} className="w-full py-2.5 border-2 border-dashed border-extended-storm-light rounded-[8px] text-xs font-bold text-extended-storm-base hover:bg-extended-storm-extraLight/30 transition-colors flex items-center justify-center gap-1.5">
                + Adicionar Teste (Caderno)
              </button>
            </div>
          )}

          {/* ─── STEP 3: Correção & Aplicação ─── */}
          {currentStep === 3 && (
            <div className="space-y-5">
              {/* Método de Correção */}
              <div>
                <label className="text-xs font-bold text-neutral-6 dark:text-neutral-2 mb-2 block">Método de Correção *</label>
                <div className="space-y-2">
                  {CORRECTION_METHODS.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setCorrectionMethod(m.id)}
                      className={`w-full p-3 rounded-[8px] border-2 text-left flex items-start gap-3 transition-all ${
                        correctionMethod === m.id
                          ? 'border-extended-storm-base bg-extended-storm-extraLight/30 dark:bg-extended-storm-dark/20 shadow-sm'
                          : isDarkMode ? 'border-neutral-5 bg-neutral-7 hover:border-neutral-4' : 'border-neutral-2 bg-white hover:border-neutral-3'
                      }`}
                    >
                      <m.icon size={18} className={correctionMethod === m.id ? 'text-extended-storm-base mt-0.5' : 'text-neutral-4 mt-0.5'} />
                      <div>
                        <div className="font-bold text-xs">{m.label}</div>
                        <div className="text-[10px] text-neutral-4 mt-0.5">{m.desc}</div>
                      </div>
                      {correctionMethod === m.id && <Check size={18} className="text-extended-storm-base ml-auto mt-0.5" />}
                    </button>
                  ))}
                </div>
              </div>

              {/* Modalidade de Aplicação */}
              <div>
                <label className="text-xs font-bold text-neutral-6 dark:text-neutral-2 mb-2 block">Modalidade de Aplicação *</label>
                <div className="grid grid-cols-3 gap-3">
                  {APPLICATION_MODES.map(m => (
                    <button
                      key={m.id}
                      onClick={() => setApplicationMode(m.id)}
                      className={`p-3 rounded-[8px] border-2 text-center transition-all ${
                        applicationMode === m.id
                          ? 'border-extended-storm-base bg-extended-storm-extraLight/30 shadow-sm font-bold'
                          : isDarkMode ? 'border-neutral-5 bg-neutral-7 hover:border-neutral-4' : 'border-neutral-2 bg-white hover:border-neutral-3'
                      }`}
                    >
                      <m.icon size={20} className={`mx-auto ${applicationMode === m.id ? 'text-extended-storm-base' : 'text-neutral-4'}`} />
                      <div className="text-xs mt-1.5 font-semibold">{m.label}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Período */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-neutral-6 dark:text-neutral-2 mb-1.5 block">Data Início (opcional)</label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputClasses} />
                </div>
                <div>
                  <label className="text-xs font-bold text-neutral-6 dark:text-neutral-2 mb-1.5 block">Data Fim (opcional)</label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputClasses} />
                </div>
              </div>
            </div>
          )}

          {/* ─── STEP 4: Resumo & Confirmação ─── */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className={`p-4 rounded-[8px] border-2 border-extended-storm-light/50 ${isDarkMode ? 'bg-neutral-7' : 'bg-extended-storm-extraLight/20'}`}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <span className="font-mono text-xs font-bold text-extended-storm-base bg-white dark:bg-neutral-6 px-2 py-0.5 rounded-[4px] border border-extended-storm-light/40">
                      {generatedCode}
                    </span>
                    <h3 className="font-bold text-base mt-2 text-neutral-7 dark:text-white">{title || '(Sem título)'}</h3>
                  </div>
                  <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${
                    assessmentType === 'somativa' ? 'bg-extended-cherry-extraLight text-extended-cherry-dark' :
                    assessmentType === 'diagnostica' ? 'bg-extended-oliva-extraLight text-extended-oliva-dark' :
                    'bg-extended-storm-extraLight text-extended-storm-dark'
                  }`}>
                    {assessmentType === 'somativa' ? 'Somativa' : assessmentType === 'diagnostica' ? 'Diagnóstica' : 'Formativa'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="flex items-center gap-2"><span className="text-neutral-4 font-semibold">Município:</span> <span className="font-bold">{municipality}</span></div>
                  <div className="flex items-center gap-2"><span className="text-neutral-4 font-semibold">Ano/Etapa:</span> <span className="font-bold">{grade}</span></div>
                  <div className="flex items-center gap-2"><span className="text-neutral-4 font-semibold">Disciplina:</span> <span className="font-bold">{subject}</span></div>
                  <div className="flex items-center gap-2"><span className="text-neutral-4 font-semibold">Correção:</span> <span className="font-bold">{correctionMethod}</span></div>
                  <div className="flex items-center gap-2"><span className="text-neutral-4 font-semibold">Aplicação:</span> <span className="font-bold">{applicationMode}</span></div>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-4 font-semibold">Testes:</span>
                    <span className="font-bold text-extended-storm-base">{testsConfig.length} Caderno(s)</span>
                  </div>
                </div>

                {/* Testes Preview */}
                <div className="mt-3 space-y-1.5">
                  {testsConfig.map((t, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs p-2 rounded-[4px] border-l-4 border-l-extended-storm-base border border-neutral-2 dark:border-neutral-5 bg-white dark:bg-neutral-6">
                      <BookOpen size={14} className="text-extended-storm-base" />
                      <span className="font-semibold">{t.name}</span>
                      {t.description && <span className="text-neutral-4">— {t.description}</span>}
                    </div>
                  ))}
                </div>
              </div>

              {/* Checklist de Validação — H5 Nielsen (Prevenção de Erros) */}
              <div className="space-y-2 text-xs">
                <span className="font-bold text-neutral-6 dark:text-neutral-2">Checklist de Validação</span>
                {[
                  { ok: !!title, label: 'Título definido' },
                  { ok: !!assessmentType, label: 'Tipo de avaliação selecionado' },
                  { ok: !!municipality && !!grade && !!subject, label: 'Município, Ano e Disciplina preenchidos' },
                  { ok: testsConfig.length > 0, label: 'Pelo menos 1 Teste (Caderno) definido' },
                  { ok: !!correctionMethod, label: 'Método de correção definido' },
                ].map((item, idx) => (
                  <div key={idx} className={`flex items-center gap-2 p-2 rounded-[8px] ${item.ok ? 'bg-semantic-success-extraLight/50 text-semantic-success-dark' : 'bg-semantic-error-extraLight/50 text-semantic-error-dark'}`}>
                    <Check size={14} className={item.ok ? 'text-semantic-success-base' : 'text-semantic-error-light'} />
                    <span className="font-medium">{item.label}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className={`p-4 border-t flex items-center justify-between ${isDarkMode ? 'border-neutral-5 bg-neutral-7/40' : 'border-neutral-2 bg-neutral-1/30'}`}>
          <button
            onClick={() => currentStep === 1 ? onClose() : setCurrentStep(prev => prev - 1)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-[8px] text-xs font-semibold text-neutral-5 hover:text-neutral-7 dark:hover:text-white hover:bg-neutral-2 dark:hover:bg-neutral-5 transition-colors"
          >
            <ChevronLeft size={16} />
            {currentStep === 1 ? 'Cancelar' : 'Voltar'}
          </button>

          {currentStep < 4 ? (
            <button
              onClick={() => setCurrentStep(prev => prev + 1)}
              disabled={
                (currentStep === 1 && !canAdvanceStep1) ||
                (currentStep === 2 && !canAdvanceStep2) ||
                (currentStep === 3 && !canAdvanceStep3)
              }
              className="flex items-center gap-1.5 px-5 py-2 rounded-[8px] text-xs font-bold bg-extended-storm-base hover:bg-extended-storm-dark text-white shadow-sm transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Próximo
              <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleCreate}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-[8px] text-xs font-bold bg-extended-storm-base hover:bg-extended-storm-dark text-white shadow-md transition-all"
            >
              <Check size={16} />
              Criar Avaliação
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
