import React from 'react';
import { MoreVertical, BookOpen, BookMarked, CheckCircle2, Clock, Calendar, PencilRuler } from 'lucide-react';
import Chips from '../../ui/Chips';
import Button from '../../ui/Button';

const AvaliacoesCard = ({ assessment, onEdit, colors, isDarkMode }) => {
  const getStatusConfig = (statusName) => {
    switch (statusName) {
      case 'Concluído':
      case 'Concluída':
        return {
          label: 'Concluída',
          status: 'success',
          icon: <CheckCircle2 />
        };
      case 'Em Andamento':
        return {
          label: 'Em Andamento',
          status: 'warning',
          icon: <Clock />
        };
      case 'Programada':
        return {
          label: 'Programada',
          status: 'info',
          icon: <Calendar />
        };
      case 'Em Correção':
        return {
          label: 'Em Correção',
          status: 'lavender',
          icon: <PencilRuler />
        };
      default:
        return {
          label: statusName,
          status: 'neutral',
          icon: null
        };
    }
  };

  const statusConfig = getStatusConfig(assessment.status);

  return (
    <div 
      className={`group rounded-[8px] border p-[24px] flex flex-col shadow-sm hover:shadow-[0_8px_24px_-8px_rgba(0,139,201,0.25)] transition-all duration-300 relative cursor-pointer ${
        isDarkMode 
          ? 'bg-neutral-6 border-neutral-5 hover:border-[var(--color-brand-500)]' 
          : 'bg-neutral-0 border-neutral-2 hover:border-[var(--color-brand-500)]'
      }`}
      onClick={() => onEdit(assessment)}
    >
      <div className="flex justify-between items-center mb-[18px]">
        <Chips 
          label={statusConfig.label} 
          status={statusConfig.status} 
          variant="light"
          iconLeft={statusConfig.icon}
          className="!border-transparent !text-[14px]"
        />
        <Button
          variant="tertiary"
          appearance="ghost"
          iconOnly
          size="sm"
          iconLeft={<MoreVertical size={18} />}
          onClick={(e) => { e.stopPropagation(); /* Menu logic */ }}
        />
      </div>

      <span className="text-[14px] font-semibold mb-[6px]" style={{ color: colors.primary.base }}>{assessment.id}</span>
      <h3 className={`font-semibold text-[18px] md:text-[20px] leading-[26px] mb-[16px] min-h-[52px] line-clamp-2 transition-colors ${
        isDarkMode ? 'text-white group-hover:text-[var(--color-brand-300)]' : 'text-[var(--color-neutral-6)] group-hover:text-[var(--color-brand-500)]'
      }`}>
        {assessment.title}
      </h3>
      
      <div className="flex items-center gap-[8px] mb-[20px]">
        <Chips label={assessment.type} status="neutral" variant="light" className="!border-transparent !text-[14px]" />
        <Chips label={assessment.correction} status="neutral" variant="light" className="!border-transparent !text-[14px]" />
      </div>

      <div className={`flex flex-wrap gap-x-[24px] gap-y-[4px] text-[14px] mb-[20px] ${isDarkMode ? 'text-neutral-3' : 'text-[var(--color-neutral-5)]'}`}>
        <div>
          <span>Data de Início </span>
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[var(--color-neutral-7)]'}`}>{assessment.start}</span>
        </div>
        <div>
          <span>Data de Fim </span>
          <span className={`font-semibold ${isDarkMode ? 'text-white' : 'text-[var(--color-neutral-7)]'}`}>{assessment.end}</span>
        </div>
      </div>

      <div className={`border-t mb-[16px] ${isDarkMode ? 'border-neutral-5' : 'border-[#DEE1E8]'}`} />

      <div className="mt-auto flex justify-between items-center h-[40px]">
        {/* Contador de testes pela esquerda usando neutral 5 */}
        <span className={`text-[14px] font-semibold flex items-center gap-[6px] ${isDarkMode ? 'text-neutral-3' : 'text-[var(--color-neutral-5)]'}`}>
           <BookMarked size={16}/> {assessment.tests > 0 ? `${assessment.tests} Teste(s)` : 'Sem Testes'}
        </span>

        {/* Ver Conteúdo como primary ghost button alinhado pela direita */}
        <Button
          variant="primary"
          appearance="ghost"
          size="sm"
          iconLeft={<BookOpen />}
          onClick={(e) => { e.stopPropagation(); onEdit(assessment); }}
          className="!font-bold font-montserrat"
        >
          Ver Conteúdo
        </Button>
      </div>
    </div>
  );
};

export default AvaliacoesCard;
