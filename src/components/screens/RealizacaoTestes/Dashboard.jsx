import React from 'react';
import { Search, ListTodo, BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react';
import Tabs from '../../ui/Tabs';
import Input from '../../ui/Input';

export default function Dashboard({ 
  colors, 
  mockAssessments, 
  dashboardTab, 
  setDashboardTab, 
  setSelectedAssessmentId, 
  setCurrentScreen,
  searchQuery,
  setSearchQuery
}) {
  const [localSearch, setLocalSearch] = React.useState(searchQuery || '');

  const handleSearchChange = (e) => {
    const val = e.target.value;
    setLocalSearch(val);
    if (setSearchQuery) setSearchQuery(val);
  };

  const statusMap = { 'Ativas': 'active', 'Realizadas': 'completed', 'Expiradas': 'expired' };
  const query = (searchQuery !== undefined ? searchQuery : localSearch).toLowerCase().trim();

  const filteredAssessments = mockAssessments.filter(a => {
    const matchesTab = a.status === statusMap[dashboardTab];
    if (!matchesTab) return false;
    if (!query) return true;
    const titleMatch = (a.title || '').toLowerCase().includes(query);
    const idMatch = (a.id || '').toLowerCase().includes(query);
    const subtitleMatch = (a.subtitle || '').toLowerCase().includes(query);
    return titleMatch || idMatch || subtitleMatch;
  });

  return (
    <div className="h-full w-full flex flex-col font-montserrat text-textIcon-main bg-bg-layout relative overflow-y-auto custom-scrollbar">
      <div
        className="absolute top-0 right-0 w-[450px] h-[450px] pointer-events-none opacity-80"
        style={{
          backgroundImage: `url('${import.meta.env.BASE_URL}assets/bg_realizacao_testes.png')`,
          backgroundPosition: 'right top',
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          transform: 'translate(2%, -24%)',
          zIndex: 0
        }}
      />
      <main className="flex-1 w-full py-4 md:py-10 animate-fade-slide relative z-10">
        <div className="max-w-[1200px] w-full mx-auto px-4 md:px-10 flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
          <h1 className="text-[24px] md:text-[28px] font-bold text-textIcon-heading">Olá, David!</h1>
          <div className="w-full md:w-[350px]">
            <Input
              type="text"
              placeholder="Pesquisar avaliação..."
              value={searchQuery !== undefined ? searchQuery : localSearch}
              onChange={handleSearchChange}
              iconLeft={<Search />}
              height="44px"
              className="bg-bg-container text-[14px]"
            />
          </div>
        </div>

        <div className="w-full mb-6">
          <div className="max-w-[1200px] w-full mx-auto px-4 md:px-10">
            <Tabs
              tabs={[
                { id: 'Ativas', label: 'Ativas' },
                { id: 'Realizadas', label: 'Realizadas' },
                { id: 'Expiradas', label: 'Expiradas' }
              ]}
              activeTab={dashboardTab}
              onChange={setDashboardTab}
              colors={colors}
              variant="line"
            />
          </div>
        </div>

        <div className="max-w-[1200px] w-full mx-auto px-4 md:px-10 flex flex-col gap-4 pb-12">
          {filteredAssessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center bg-bg-container rounded-lg border border-border">
              <ListTodo size={48} className="text-textIcon-placeholder mb-4" />
              <h2 className="text-[18px] font-bold text-textIcon-heading">
                {query ? 'Nenhuma avaliação encontrada' : `Nenhuma avaliação ${dashboardTab.toLowerCase()}`}
              </h2>
              <p className="text-[14px] text-textIcon-description mt-2">
                {query ? 'Tente buscar por outro termo ou código.' : 'Você não possui avaliações nesta categoria no momento.'}
              </p>
            </div>
          ) : (
            filteredAssessments.map(av => (
              <div
                key={av.id}
                onClick={() => { setSelectedAssessmentId(av.id); setCurrentScreen('pre_test'); window.scrollTo(0, 0); }}
                className="bg-bg-container border border-border rounded-lg p-5 md:p-6 shadow-sm hover:shadow-md hover:border-brand-500 cursor-pointer transition-all flex flex-col md:flex-row gap-4 md:gap-6 relative group"
              >
                <div className={`w-[48px] h-[48px] rounded-lg flex items-center justify-center shrink-0 ${
                  av.status === 'expired' 
                    ? 'bg-semantic-error-base' 
                    : (av.status === 'completed' ? 'bg-semantic-success-base' : 'bg-brand-500')
                }`}>
                  <BookOpen size={24} className="text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-[12px] font-semibold text-textIcon-description mb-1">{av.id} • {av.subtitle}</div>
                  <h3 className="text-[16px] md:text-[18px] font-bold text-textIcon-heading mb-4 pr-6">{av.title}</h3>
                  {av.status === 'active' && av.progress > 0 && (
                    <div className="w-full h-2 bg-neutral-2 dark:bg-neutral-6 rounded-full mb-4 overflow-hidden">
                      <div className="h-full bg-brand-500 rounded-full" style={{ width: `${av.progress}%` }}></div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 md:gap-6 text-[12px] md:text-[13px] text-textIcon-description font-medium mt-auto">
                    <div className="flex items-center gap-1.5"><Calendar size={14} /> {av.startDate}</div>
                    <div className="flex items-center gap-1.5"><Clock size={14} /> {av.endDate}</div>
                  </div>
                </div>
                <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  <ChevronRight size={24} className="text-brand-500" />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

