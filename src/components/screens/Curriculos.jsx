
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import Button from '../ui/Button';
import Tabs from '../ui/Tabs';
import Breadcrumb from '../ui/Breadcrumb';
import { mockDominios } from '../../data/mockData';

const Curriculos = ({ 
  colors, 
  activeCurriculosTab, 
  setActiveCurriculosTab, 
  expandedItem, 
  setExpandedItem, 
  navigateTo 
}) => {
  const tabs = ['Componentes Curriculares', 'Matrizes Curriculares', 'Habilidades dos Currículos'];

  return (
    <main className="flex-1 w-full animate-fade-slide flex flex-col min-h-screen bg-neutral-0">
      <div className="max-w-[1440px] mx-auto w-full px-[16px] md:px-[32px] py-[24px] md:py-[32px] flex-1 flex flex-col">
        <Breadcrumb 
          colors={colors}
          onBack={() => navigateTo('dashboard')}
          paths={[
            { label: 'Início', onClick: () => navigateTo('dashboard') },
            { label: 'Gerenciamento de Matrizes Curriculares' }
          ]}
        />

        <h2 className="text-[22px] md:text-[28px] font-bold mb-[24px] md:mb-[32px]" style={{ color: colors.neutral[7] }}>Gerenciamento de Matrizes Curriculares</h2>

        <div className="sticky top-[64px] md:top-[74px] z-40 bg-neutral-0 pt-[8px] md:pt-[16px] pb-[8px] mb-[16px] md:mb-[24px]">
          <Tabs tabs={tabs} activeTab={activeCurriculosTab} onChange={setActiveCurriculosTab} colors={colors} fullWidth={true} />
        </div>

        <div className="flex flex-col mb-[16px] md:mb-[24px] gap-[16px]">
          <div className="flex items-center gap-[8px] md:gap-[16px] w-full">
             <div className="relative flex-1">
               <Search size={16} className="absolute left-[16px] top-1/2 -translate-y-1/2" style={{ color: colors.neutral[4] }} />
               <input type="text" placeholder="Pesquise pelo código ou título" className="w-full pl-[40px] pr-[16px] py-[10px] md:py-[12px] rounded-[8px] border text-[13px] md:text-[14px] outline-none transition-colors focus:border-primary-base" style={{ borderColor: colors.neutral[3] }} />
             </div>
             <Button variant="primary" iconOnly size="default"><Search size={20} /></Button>
          </div>
          <div className="flex gap-[8px] overflow-x-auto hide-scrollbar w-full justify-end">
            <div className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[8px] border cursor-pointer bg-neutral-0 text-[12px] font-semibold hover:bg-neutral-1 whitespace-nowrap shrink-0" style={{ borderColor: colors.neutral[3], color: colors.neutral[6] }}><Filter size={14} /> Comp. Curricular <ChevronDown size={14} /></div>
          </div>
        </div>

        <div className="bg-neutral-0 rounded-[8px] border overflow-hidden flex-1 shadow-sm mb-[24px] md:mb-[32px]" style={{ borderColor: colors.neutral[2] }}>
          <div className="w-full">
            <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[16px] border-b text-[12px] font-bold uppercase tracking-wide bg-neutral-1 text-neutral-5">
              <div className="w-[24px] shrink-0"></div>
              <div className="w-[60px] sm:w-[80px] shrink-0">Código</div>
              <div className="flex-1 min-w-0">Título</div>
              <div className="flex-1 min-w-0 hidden md:block">Comp. Curricular</div>
              <div className="w-[80px] shrink-0"></div>
            </div>
            
            {mockDominios.map((m) => (
              <React.Fragment key={m.cod}>
                <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[13px] md:text-[14px] text-neutral-6">
                  <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
                    <ChevronDown size={18} className={`transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
                  </div>
                  <div className="w-[60px] sm:w-[80px] shrink-0 font-medium text-neutral-5 truncate" title={m.cod}>{m.cod}</div>
                  <div className="flex-1 min-w-0 font-bold truncate" title={m.title}>{m.title}</div>
                  <div className="flex-1 min-w-0 hidden md:block truncate" title={m.comp}>{m.comp}</div>
                  <div className="w-[80px] shrink-0 flex justify-end gap-[4px] md:gap-[8px]">
                    <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14}/></Button>
                    <Button variant="tertiary" iconOnly size="sm"><Trash2 size={14}/></Button>
                  </div>
                </div>
                {expandedItem === m.cod && (
                  <div className="px-[48px] sm:px-[64px] py-[16px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
                    <h4 className="font-bold text-[14px] text-neutral-6 mb-[8px]">{m.title}</h4>
                    <div className="md:hidden flex flex-col gap-[8px] text-[13px] text-neutral-5">
                      <div><strong>Comp. Curricular:</strong> {m.comp}</div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="sticky bottom-0 w-full bg-white border-t z-50 px-[16px] md:px-[32px] py-[16px] md:py-[24px]" style={{ borderColor: colors.neutral[2] }}>
        <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-[16px] md:gap-0">
          <div className="flex flex-col sm:flex-row items-center gap-[8px] sm:gap-[16px] w-full md:w-auto order-2 md:order-1">
            <span className="text-[12px] md:text-[13px]" style={{ color: colors.neutral[5] }}>1 a 10 de 115 registros</span>
            <div className="flex items-center gap-[8px]">
              <Button variant="tertiary" iconOnly size="sm"><ChevronLeft size={16} /></Button>
              <span className="text-[12px] md:text-[13px] font-medium">Página <input type="text" defaultValue="1" className="w-[32px] md:w-[40px] text-center border rounded-[4px] mx-[4px] py-[2px] md:py-[4px] outline-none focus:border-primary-base transition-colors" style={{ borderColor: colors.neutral[3] }} /> de 12</span>
              <Button variant="tertiary" iconOnly size="sm"><ChevronRight size={16} /></Button>
            </div>
          </div>
          <Button variant="primary" size="default" className="w-full md:w-auto uppercase tracking-wide order-1 md:order-2">
            Adicionar Item
          </Button>
        </div>
      </div>
    </main>
  );
};

export default Curriculos;
