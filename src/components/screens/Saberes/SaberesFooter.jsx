import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Button from '../../ui/Button';

import { 
  mockComponentes, 
  mockDominios, 
  mockConhecimentos, 
  mockHabilidades, 
  mockRelacoes 
} from '../../../data/mockData';

const SaberesFooter = ({ colors, tabs, activeSaberesTab, currentPage, setCurrentPage }) => {
  const getCounts = () => {
    switch(activeSaberesTab) {
      case 0: return mockComponentes.length;
      case 1: case 2: case 3: return mockDominios.length;
      case 4: return mockConhecimentos.length;
      case 5: return mockHabilidades.length;
      case 6: return mockRelacoes.length;
      default: return 0;
    }
  };

  const total = getCounts();
  const itemsPerPage = 10;
  const totalPages = Math.ceil(total / itemsPerPage);
  
  const from = total === 0 ? 0 : (currentPage - 1) * itemsPerPage + 1;
  const to = Math.min(currentPage * itemsPerPage, total);

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePageInput = (e) => {
    const val = parseInt(e.target.value);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setCurrentPage(val);
    }
  };

  return (
    <div className="sticky bottom-0 w-full bg-white border-t z-50 px-[16px] md:px-[32px] py-[16px] md:py-[24px]" style={{ borderColor: colors.neutral[2] }}>
      <div className="max-w-[1440px] mx-auto flex flex-col md:flex-row justify-between items-center gap-[20px] md:gap-0">
        <div className="flex flex-col sm:flex-row items-center gap-[12px] sm:gap-[16px] w-full md:w-auto order-2 md:order-1">
          <span className="text-[12px] md:text-[13px] font-medium" style={{ color: colors.neutral[5] }}>
            Exibindo {from} a {to} de {total} registros
          </span>
          <div className="flex items-center gap-[12px]">
            <Button 
              variant="tertiary" 
              iconOnly 
              size="sm" 
              onClick={handlePrev}
              disabled={currentPage === 1}
            >
              <ChevronLeft size={16} />
            </Button>
            <div className="flex items-center text-[12px] md:text-[13px] font-bold text-neutral-6">
              Página 
              <input 
                type="text" 
                value={currentPage}
                onChange={handlePageInput}
                className="w-[36px] h-[36px] text-center border rounded-[4px] mx-[8px] outline-none focus:border-primary-base transition-colors" 
                style={{ borderColor: colors.neutral[3] }} 
              /> 
              de {totalPages}
            </div>
            <Button 
              variant="tertiary" 
              iconOnly 
              size="sm" 
              onClick={handleNext}
              disabled={currentPage === totalPages || totalPages === 0}
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
        <Button variant="primary" size="lg" className="w-full md:w-auto uppercase tracking-wider font-bold shadow-sm order-1 md:order-2">
          Adicionar {tabs[activeSaberesTab].split(' ')[0]}
        </Button>
      </div>
    </div>
  );
};

export default SaberesFooter;
