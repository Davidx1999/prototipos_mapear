import React from 'react';
import { FileText, BookOpen, Search, Filter, ChevronDown } from 'lucide-react';
import Breadcrumb from '../../ui/Breadcrumb';
import Input from '../../ui/Input';
import AvaliacoesCard from './AvaliacoesCard';

const AvaliacoesList = ({ 
  assessments, 
  onEdit, 
  colors, 
  navigateTo, 
  isDarkMode 
}) => {
  return (
    <div className={`flex-1 overflow-auto p-6 md:p-10 flex flex-col gap-6 ${isDarkMode ? 'bg-neutral-7' : 'bg-neutral-0'}`}>
       <Breadcrumb 
         colors={colors}
         onBack={() => navigateTo('dashboard')}
         paths={[
           { label: 'Tela Inicial', onClick: () => navigateTo('dashboard') },
           { label: 'Avaliações' }
         ]}
       />

       <div className={`flex flex-col md:flex-row justify-between md:items-end gap-4 border-b pb-4 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
          <div className="flex items-end h-full gap-6">
             <button className="text-[15px] font-bold pb-2 flex items-center gap-2" style={{ color: colors.primary.base, borderBottom: `3px solid ${colors.primary.base}` }}>
                <FileText size={16}/> Avaliações
             </button>
             <button className={`text-[15px] font-bold pb-2 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-neutral-3 hover:text-white' : 'text-neutral-5 hover:text-neutral-7'}`}>
                <BookOpen size={16}/> Banco de Tarefas & Itens
             </button>
          </div>
          <div className="w-full md:w-[350px]">
             <Input 
               placeholder="Pesquise por código ou título" 
               iconLeft={<Search />}
               iconRight={<div className="w-8 h-8 bg-primary-base rounded flex items-center justify-center text-white"><Search size={16}/></div>}
               className={isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : ''}
               height="40px"
             />
          </div>
       </div>

       <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <h1 className={`text-[20px] font-bold ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>Avaliações Disponíveis</h1>
          <div className="flex flex-wrap items-center gap-2">
             {['Status', 'Natureza', 'Correção', 'Testes', 'Período'].map(filter => (
                <button key={filter} className={`flex items-center gap-1.5 px-3 py-1.5 border rounded text-[12px] font-semibold shadow-sm transition-colors ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-neutral-2 hover:bg-neutral-5' : 'bg-neutral-0 border-neutral-2 text-neutral-6 hover:bg-neutral-1'}`}>
                   <Filter size={12}/> {filter} <ChevronDown size={14}/>
                </button>
             ))}
             <div className={`text-[12px] font-bold ml-4 flex items-center gap-2 cursor-pointer hover:text-primary-base ${isDarkMode ? 'text-neutral-3' : 'text-neutral-5'}`}>
                Ordenar por <span style={{ color: colors.primary.base }}>Mais recentes</span> <ChevronDown size={14}/>
             </div>
          </div>
       </div>

       {/* GRID DE CARDS */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-10">
          {assessments.map(av => (
            <AvaliacoesCard 
              key={av.id} 
              assessment={av} 
              onEdit={onEdit} 
              colors={colors} 
              isDarkMode={isDarkMode} 
            />
          ))}
       </div>
    </div>
  );
};

export default AvaliacoesList;
