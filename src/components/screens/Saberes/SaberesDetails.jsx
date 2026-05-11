import React from 'react';
import { ChevronLeft, Search, Eye, EyeOff, Trash2 } from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const SaberesDetails = ({
  colors,
  setRelationsViewMode,
  isGraphVisible,
  setIsGraphVisible
}) => {
  return (
    <main className="flex-1 w-full animate-fade-slide flex flex-col min-h-screen bg-neutral-0">
      <div className="max-w-[1440px] mx-auto w-full px-[16px] md:px-[32px] py-[24px] md:py-[32px] flex-1 flex flex-col">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-[32px] gap-[16px]">
          <h2 className="text-[22px] md:text-[28px] font-bold" style={{ color: colors.neutral[7] }}>H1.S1 Leitura</h2>
          <div className="flex gap-[16px] w-full md:w-auto">
            <Button variant="tertiary" onClick={() => setRelationsViewMode('list')} className="flex-1 md:flex-none">
              <ChevronLeft size={18} /> <span className="hidden sm:inline">Voltar</span>
            </Button>
            <Button variant="outlined" onClick={() => setIsGraphVisible(!isGraphVisible)} className="flex-1 md:flex-none">
              {isGraphVisible ? <EyeOff size={18} /> : <Eye size={18} />}
              <span className="hidden sm:inline">{isGraphVisible ? 'Esconder Gráfico' : 'Mostrar Gráfico'}</span>
            </Button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-[24px] lg:gap-[40px] mb-[40px]">
          <div className="flex-1 flex flex-col gap-[16px]">
            <div><strong style={{ color: colors.neutral[7] }}>Área de Conhecimento:</strong> <span style={{ color: colors.neutral[5] }}>Português</span></div>
            <div><strong style={{ color: colors.neutral[7] }}>Conhecimento:</strong> <span style={{ color: colors.neutral[5] }}>S1 Pragmática</span></div>
            <p className="leading-relaxed mt-[8px]" style={{ color: colors.neutral[6] }}>
              Compreender o sentido pragmático da leitura em contextos diversificados. Identificar como o autor emprega estratégias linguísticas para gerar efeitos de sentido específicos no leitor, observando as entrelinhas.
            </p>
          </div>
          {isGraphVisible && (
            <div className="w-full max-w-[300px] h-[300px] rounded-full border-[12px] shrink-0 mx-auto lg:mx-0 flex items-center justify-center relative animate-fade-slide" style={{ borderColor: '#4ADE80' }}>
              <div className="absolute top-[30%] left-[20%] w-[12px] h-[12px] rounded-full bg-[#EC4899]"></div>
              <div className="absolute bottom-[20%] right-[30%] w-[12px] h-[12px] rounded-full border-[3px] border-[#3B82F6] bg-neutral-0"></div>
              <span className="font-bold text-neutral-5">Gráfico Mockup</span>
            </div>
          )}
        </div>

        <h3 className="text-[16px] md:text-[18px] font-bold mb-[16px]" style={{ color: colors.neutral[7] }}>Filtrar Destino</h3>
        <div className="flex flex-col gap-[12px] mb-[24px]">
          <Input
            iconLeft={<Search />}
            placeholder="Pesquise por título do destino"
          />
          <select className="w-full px-[16px] py-[10px] rounded-[8px] border outline-none bg-neutral-0" style={{ borderColor: colors.neutral[3] }}>
            <option>Escolha as relações</option>
          </select>
        </div>

        <div className="bg-neutral-0 rounded-[8px] border overflow-hidden flex-1 shadow-sm mb-[24px]" style={{ borderColor: colors.neutral[2] }}>
          <div className="w-full">
            <div className="grid grid-cols-[1fr_40px] md:grid-cols-[1fr_1fr_60px] gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[12px] font-bold uppercase tracking-wide bg-neutral-1 text-neutral-5">
              <div>Título do Destino</div>
              <div className="hidden md:block">Conhecimento do Destino</div>
              <div></div>
            </div>
            <div className="grid grid-cols-[1fr_40px] md:grid-cols-[1fr_1fr_60px] gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[14px] md:text-[14px] text-neutral-6 items-center">
              <div className="font-medium truncate" title="H2.S1 Interpretação">H2.S1 Interpretação</div>
              <div className="hidden md:block truncate" title="Pragmática">Pragmática</div>
              <div className="flex justify-end"><Button variant="tertiary" iconOnly size="sm"><Trash2 size={16} /></Button></div>
            </div>
            <div className="grid grid-cols-[1fr_40px] md:grid-cols-[1fr_1fr_60px] gap-[16px] px-[16px] sm:px-[24px] py-[12px] text-[14px] md:text-[14px] text-neutral-6 items-center">
              <div className="font-medium truncate" title="H1.S6 Gramática">H1.S6 Gramática</div>
              <div className="hidden md:block truncate" title="Pragmática">Pragmática</div>
              <div className="flex justify-end"><Button variant="tertiary" iconOnly size="sm"><Trash2 size={16} /></Button></div>
            </div>
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 w-full bg-white border-t z-50 px-[16px] md:px-[32px] py-[16px] md:py-[24px]" style={{ borderColor: colors.neutral[2] }}>
        <div className="max-w-[1440px] mx-auto flex justify-between items-center">
          <span className="text-[12px] md:text-[14px]" style={{ color: colors.neutral[5] }}>1 a 2 de 2 registros</span>
          <Button variant="primary" size="default" className="uppercase tracking-wide">Gerenciar Relações</Button>
        </div>
      </div>
    </main>
  );
};

export default SaberesDetails;
