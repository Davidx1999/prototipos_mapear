import React from 'react';
import { AlertCircle, X } from 'lucide-react';
import Tabs from '../ui/Tabs';
import Breadcrumb from '../ui/Breadcrumb';

// Sub-components
import SaberesDetails from './Saberes/SaberesDetails';
import SaberesFilters from './Saberes/SaberesFilters';
import SaberesTable from './Saberes/SaberesTable';
import SaberesFooter from './Saberes/SaberesFooter';

const Saberes = ({
  colors,
  activeSaberesTab,
  setActiveSaberesTab,
  relationsViewMode,
  setRelationsViewMode,
  isGraphVisible,
  setIsGraphVisible,
  expandedItem,
  setExpandedItem,
  showAlert,
  setShowAlert,
  handleExcluirItem,
  navigateTo
}) => {
  const [searchValue, setSearchValue] = React.useState('');
  const [activeFilters, setActiveFilters] = React.useState({}); // e.g. { comp: 'Matemática' }
  const [currentPage, setCurrentPage] = React.useState(1);

  // Reset page when tab changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [activeSaberesTab]);

  const tabs = [
    'Componentes Curriculares',
    'Domínios Cognitivos',
    'Processos Cognitivos',
    'Domínios de Repertório',
    'Conhecimentos',
    'Habilidades',
    'Relações entre Habilidades'
  ];

  // ══ DETAILS VIEW MODE ════════════════════════════════════════════════════
  if (relationsViewMode === 'details' && activeSaberesTab === 6) {
    return (
      <SaberesDetails
        colors={colors}
        setRelationsViewMode={setRelationsViewMode}
        isGraphVisible={isGraphVisible}
        setIsGraphVisible={setIsGraphVisible}
      />
    );
  }

  // ══ LIST VIEW MODE ═══════════════════════════════════════════════════════
  return (
    <main className="flex-1 w-full animate-fade-slide flex flex-col min-h-screen bg-neutral-0">
      <div className="max-w-[1440px] mx-auto w-full px-[16px] md:px-[32px] py-[24px] md:py-[32px] flex-1 flex flex-col">
        <Breadcrumb
          colors={colors}
          onBack={() => navigateTo('dashboard')}
          paths={[
            { label: 'Início', onClick: () => navigateTo('dashboard') },
            { label: 'Gerenciamento de Matrizes de Saberes' }
          ]}
        />

        <h2 className="text-[22px] md:text-[28px] font-bold mb-[24px] md:mb-[32px]" style={{ color: colors.neutral[7] }}>
          Gerenciamento da Matriz de Saberes
        </h2>

        <div className="sticky top-[52px] md:top-[74px] z-40 bg-neutral-0 pt-[8px] md:pt-[8px] pb-[8px]">
          <Tabs
            tabs={tabs}
            activeTab={activeSaberesTab}
            onChange={(idx) => setActiveSaberesTab(idx)}
            colors={colors}
            fullWidth={true}
            className="mb-[24px]"
          />

          {showAlert && (
            <div className="flex justify-between items-start md:items-center px-[16px] md:px-[24px] py-[12px] md:py-[16px] rounded-[8px] mt-[16px] animate-fade-slide" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}>
              <div className="flex items-start md:items-center gap-[12px] text-[#DC2626] font-medium text-[13px] md:text-[8px]">
                <AlertCircle size={20} className="shrink-0 mt-[2px] md:mt-0" />
                <span>Não é possível excluir o item de código <strong>"REC"</strong>, pois existem vínculos a ele.</span>
              </div>
              <X size={20} className="cursor-pointer text-[#DC2626] hover:opacity-70 shrink-0 ml-[8px]" onClick={() => setShowAlert(false)} />
            </div>
          )}
        </div>

        <SaberesFilters
          colors={colors}
          activeSaberesTab={activeSaberesTab}
          searchValue={searchValue}
          setSearchValue={setSearchValue}
          activeFilters={activeFilters}
          setActiveFilters={setActiveFilters}
        />

        <SaberesTable
          activeSaberesTab={activeSaberesTab}
          colors={colors}
          expandedItem={expandedItem}
          setExpandedItem={setExpandedItem}
          handleExcluirItem={handleExcluirItem}
          setRelationsViewMode={setRelationsViewMode}
          searchValue={searchValue}
          activeFilters={activeFilters}
          currentPage={currentPage}
        />
      </div>

      <SaberesFooter
        colors={colors}
        tabs={tabs}
        activeSaberesTab={activeSaberesTab}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
      />
    </main>
  );
};

export default Saberes;
