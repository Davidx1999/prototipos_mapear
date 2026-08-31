import React from 'react';
import { CheckCircle2, Clock, LayoutGrid } from 'lucide-react';
import Button from '../../ui/Button';

export default function Finished({
  formatTime,
  timeSpent,
  totalAnswered,
  totalItems,
  setCurrentScreen
}) {
  return (
    <div className="h-full w-full flex flex-col font-montserrat bg-bg-layout text-textIcon-main overflow-y-auto custom-scrollbar">
      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-slide text-center">
        <div className="w-20 h-20 bg-semantic-success-extraLight dark:bg-semantic-success-dark/30 rounded-full flex items-center justify-center mb-6 text-semantic-success-base">
          <CheckCircle2 size={44} />
        </div>

        <h1 className="text-[26px] md:text-[30px] font-bold text-textIcon-heading mb-2">Avaliação entregue!</h1>
        <p className="text-textIcon-description text-[15px] mb-8 font-medium max-w-[500px]">
          Parabéns por concluir sua avaliação. Suas respostas foram salvas e registradas com sucesso.
        </p>

        <div className="flex gap-8 md:gap-16 mb-10 p-6 md:p-8 bg-bg-container rounded-lg shadow-sm border border-border">
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[24px] md:text-[28px] font-bold text-brand-500">{formatTime(timeSpent)}</span>
            <span className="text-[13px] font-semibold text-textIcon-description flex items-center gap-1.5 uppercase tracking-wide">
              <Clock size={15} /> Tempo utilizado
            </span>
          </div>
          <div className="w-px bg-border"></div>
          <div className="flex flex-col items-center gap-1.5">
            <span className="text-[24px] md:text-[28px] font-bold text-brand-500">{totalAnswered}/{totalItems}</span>
            <span className="text-[13px] font-semibold text-textIcon-description flex items-center gap-1.5 uppercase tracking-wide">
              <LayoutGrid size={15} /> Itens respondidos
            </span>
          </div>
        </div>

        <Button
          onClick={() => setCurrentScreen('dashboard')}
          variant="primary"
          appearance="solid"
          size="lg"
          uppercase={false}
          className="px-8 rounded"
        >
          Voltar para as avaliações
        </Button>
      </div>
    </div>
  );
}

