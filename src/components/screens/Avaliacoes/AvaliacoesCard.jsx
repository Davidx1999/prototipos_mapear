import React from 'react';
import { MoreVertical, BookOpen, BookCheck } from 'lucide-react';
import Chips from '../../ui/Chips';

const AvaliacoesCard = ({ assessment, onEdit, colors, isDarkMode }) => {
  const getStatus = (color) => {
    switch (color) {
      case 'green': return 'success';
      case 'yellow': return 'warning';
      case 'blue': return 'primary';
      case 'purple': return 'lavender';
      default: return 'neutral';
    }
  };

  return (
    <div 
      className={`group rounded-xl border p-5 flex flex-col shadow-sm hover:shadow-md transition-all duration-300 relative cursor-pointer ${
        isDarkMode ? 'bg-neutral-6 border-neutral-5 hover:border-primary-base' : 'bg-neutral-0 border-neutral-2 hover:border-primary-base'
      }`}
      onClick={() => onEdit(assessment)}
    >
      <div className="flex justify-between items-start mb-[16px]">
        <Chips 
          label={assessment.status} 
          status={getStatus(assessment.color)} 
          variant="light"
        />
        <button 
          className={`p-1 rounded-md transition-colors ${isDarkMode ? 'hover:bg-neutral-5 text-neutral-4 hover:text-white' : 'hover:bg-neutral-1 text-neutral-4 hover:text-neutral-7'}`}
          onClick={(e) => { e.stopPropagation(); /* Menu logic */ }}
        >
          <MoreVertical size={16} />
        </button>
      </div>

      <span className="text-[12px] font-bold mb-1" style={{ color: colors.primary.base }}>{assessment.id}</span>
      <h3 className={`font-bold text-[15px] leading-tight mb-4 min-h-[44px] group-hover:text-primary-base transition-colors ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>
        {assessment.title}
      </h3>
      
      <div className="flex items-center gap-2 mb-4">
        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${isDarkMode ? 'bg-neutral-5 text-neutral-2' : 'bg-neutral-1 text-neutral-6'}`}>{assessment.type}</span>
        <span className={`px-2.5 py-1 rounded text-[10px] font-bold ${isDarkMode ? 'bg-neutral-5 text-neutral-2' : 'bg-neutral-1 text-neutral-6'}`}>{assessment.correction}</span>
      </div>

      <div className={`flex justify-between items-center text-[11px] mb-6 ${isDarkMode ? 'text-neutral-3' : 'text-neutral-5'}`}>
        <div className="flex flex-col gap-0.5"><span className="font-semibold">Data de Início</span><span>{assessment.start}</span></div>
        <div className="flex flex-col gap-0.5"><span className="font-semibold">Data de Fim</span><span>{assessment.end}</span></div>
      </div>

      <div className={`mt-auto border-t pt-4 flex justify-between items-center ${isDarkMode ? 'border-neutral-5' : 'border-neutral-1'}`}>
        <button className="text-[13px] font-bold flex items-center gap-1.5 hover:underline" style={{ color: colors.primary.base }}>
           <BookOpen size={16}/> Ver Conteúdo
        </button>
        <span className={`text-[12px] font-semibold flex items-center gap-1 ${isDarkMode ? 'text-neutral-4' : 'text-neutral-4'}`}>
           <BookCheck size={14}/> {assessment.tests > 0 ? `${assessment.tests} Teste(s)` : 'Sem Testes'}
        </span>
      </div>
    </div>
  );
};

export default AvaliacoesCard;
