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
    <div className={`h-full w-full flex flex-col font-['Montserrat',sans-serif] bg-[#F7F8FA] overflow-y-auto custom-scrollbar`}>

      <div className="flex-1 flex flex-col items-center justify-center p-6 animate-fade-slide text-center">
        <div className="w-32 h-32 bg-[#D1FAE5] rounded-full flex items-center justify-center mb-8 text-[#10B981] shadow-inner">
          <CheckCircle2 size={64} />
        </div>

        <h1 className={`text-[32px] font-black text-[#1D2432] mb-3`}>Avaliação Enviada!</h1>
        <p className={`text-gray-500 text-[16px] mb-12 font-medium`}>Parabéns por concluir sua avaliação. Suas respostas foram salvas com sucesso.</p>

        <div className="flex gap-8 md:gap-16 mb-12 p-8 bg-white rounded-2xl shadow-sm border border-gray-200">
          <div className="flex flex-col items-center gap-2">
            <span className={`text-[28px] font-black text-[#008BC9]`}>{formatTime(timeSpent)}</span>
            <span className={`text-[14px] font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide`}><Clock size={16} /> Tempo de Prova</span>
          </div>
          <div className="w-px bg-gray-200"></div>
          <div className="flex flex-col items-center gap-2">
            <span className={`text-[28px] font-black text-[#008BC9]`}>{totalAnswered}/{totalItems}</span>
            <span className={`text-[14px] font-semibold text-gray-500 flex items-center gap-2 uppercase tracking-wide`}><LayoutGrid size={16} /> Respondidas</span>
          </div>
        </div>

        <Button onClick={() => setCurrentScreen('dashboard')} variant="primary" size="lg" className="px-12 rounded-xl shadow-lg hover:bg-[#003A79]">
          VOLTAR PARA O INÍCIO
        </Button>
      </div>
    </div>
  );
}
