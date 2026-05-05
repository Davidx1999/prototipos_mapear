
import React from 'react';
import { ChevronLeft, MoreVertical, BookOpen, BookCheck } from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import Chips from '../ui/Chips';
import { mockAvaliacoes } from '../../data/mockData';

const AvaliacoesLista = ({ colors, navigateTo }) => {  
  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[32px] animate-fade-slide flex flex-col h-full bg-neutral-0">
      <Breadcrumb 
        colors={colors}
        onBack={() => navigateTo('dashboard')}
        paths={[
          { label: 'Início', onClick: () => navigateTo('dashboard') },
          { label: 'Edição de Avaliações' }
        ]}
      />
      <h2 className="text-[22px] md:text-[28px] font-bold mb-[24px] md:mb-[32px]" style={{ color: colors.neutral[7] }}>Editor de Avaliações</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-[16px] md:gap-[24px] mb-[32px]">
        {mockAvaliacoes.map((item, idx) => (
          <div key={idx} className="rounded-[8px] p-[16px] md:p-[20px] flex flex-col border shadow-sm hover:shadow-md transition-shadow bg-neutral-0" style={{ borderColor: colors.neutral[2] }}>
            <div className="flex justify-between items-start mb-[16px]">
              <Chips label={item.status} status={item.status === 'Em Andamento' ? 'primary' : item.status === 'Concluído' ? 'success' : 'neutral'} variant="light" />
              <MoreVertical size={20} className="cursor-pointer" style={{ color: colors.neutral[4] }} />
            </div>
            <span className="text-[11px] md:text-[12px] font-bold mb-[4px] truncate" title={item.id} style={{ color: colors.primary.base }}>{item.id}</span>
            <h3 className="text-[14px] md:text-[15px] font-bold leading-tight mb-[16px] line-clamp-2 h-[38px]" title={item.title} style={{ color: colors.neutral[7] }}>{item.title}</h3>
            <div className="mt-auto pt-[16px] border-t flex justify-between items-center" style={{ borderColor: colors.neutral[2] }}><div className="flex items-center gap-[6px] font-bold text-[12px] md:text-[13px] cursor-pointer hover:underline" style={{ color: colors.primary.base }}><BookOpen size={16} /> Ver Conteúdo</div><span className="text-[11px] md:text-[12px] font-semibold" style={{ color: colors.neutral[5] }}><BookCheck size={14} className="inline mr-[4px]" /> {item.tests} Teste(s)</span></div>
          </div>
        ))}
      </div>
    </main>
  );
};

export default AvaliacoesLista;
