import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, ShieldCheck, Info } from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';

export default function TaskCurationModal({
  isOpen,
  onClose,
  task,
  onSubmitSuccess,
  isDarkMode
}) {
  const [justification, setJustification] = useState('');
  const [submitted, setSubmitted] = useState(false);

  if (!isOpen || !task) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      onSubmitSuccess(task.id);
      setSubmitted(false);
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm font-['Montserrat',sans-serif]">
      <div className={`w-full max-w-lg rounded-2xl shadow-2xl border overflow-hidden ${
        isDarkMode ? 'bg-neutral-7 border-neutral-5' : 'bg-white border-neutral-2'
      }`}>
        {/* Header */}
        <div className={`flex items-center justify-between p-5 border-b shrink-0 ${
          isDarkMode ? 'border-neutral-5 bg-neutral-6' : 'border-neutral-2 bg-neutral-1/50'
        }`}>
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-brand-50 text-brand-500 dark:bg-brand-900/30">
              <Sparkles size={20} />
            </div>
            <div>
              <h3 className="text-base font-bold text-neutral-8 dark:text-white">Submeter para Curadoria MAPEAR</h3>
              <p className="text-xs text-neutral-5 dark:text-neutral-4">Disponibilize sua tarefa para toda a rede municipal.</p>
            </div>
          </div>
          <Button variant="tertiary" appearance="ghost" iconOnly iconLeft={<X size={18} />} onClick={onClose} />
        </div>

        {/* Form Body */}
        {submitted ? (
          <div className="p-8 text-center space-y-3">
            <CheckCircle2 size={48} className="text-semantic-success-base mx-auto animate-bounce" />
            <h4 className="text-base font-bold text-neutral-8 dark:text-white">Submissão Enviada com Sucesso!</h4>
            <p className="text-xs text-neutral-5 dark:text-neutral-4">
              A equipe de curadoria pedagógica revisará sua tarefa em até 48h. Você receberá uma notificação assim que for homologada!
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            <div className="p-3.5 rounded-xl border border-brand-200 bg-brand-50/30 dark:bg-brand-900/10 space-y-1">
              <span className="text-[10px] font-bold text-brand-500 uppercase tracking-wider block">Tarefa Selecionada</span>
              <div className="text-xs font-bold text-neutral-8 dark:text-white">{task.title}</div>
              <div className="flex items-center gap-2 mt-1">
                <Chips label={task.subject} status="storm" variant="dark" />
                <Chips label={task.grade} status="neutral" variant="stroked" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-neutral-7 dark:text-neutral-2 mb-1.5 block">
                Justificativa Pedagógica ou Relevância para a Rede
              </label>
              <textarea
                value={justification}
                onChange={e => setJustification(e.target.value)}
                placeholder="Ex: Esta tarefa foi testada com 4 turmas do 5º Ano apresentando excelente discriminação para a Habilidade EF05LP09..."
                rows={4}
                className={`w-full p-3 text-xs border rounded-xl outline-none font-medium ${
                  isDarkMode
                    ? 'bg-neutral-6 border-neutral-5 text-white focus:border-brand-500'
                    : 'bg-white border-neutral-3 text-neutral-8 focus:border-brand-500'
                }`}
              />
            </div>

            <div className="p-3 rounded-lg bg-neutral-1 dark:bg-neutral-5/30 text-neutral-5 dark:text-neutral-4 text-[11px] font-medium flex items-start gap-2">
              <ShieldCheck size={16} className="text-brand-500 shrink-0 mt-0.5" />
              <span>
                Tarefas curadas recebem o selo institucional **Curado MAPEAR** e geram métricas de impacto para o seu perfil pedagógico.
              </span>
            </div>

            <div className="pt-2 flex justify-end gap-2">
              <Button variant="tertiary" appearance="solid" size="md" onClick={onClose} type="button">
                Cancelar
              </Button>
              <Button variant="primary" appearance="solid" size="md" iconLeft={<Sparkles size={16} />} type="submit">
                Enviar para Curadoria
              </Button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
