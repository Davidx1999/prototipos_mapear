import React from 'react';
import { Search, ListTodo, BookOpen, Calendar, Clock, ChevronRight } from 'lucide-react';

export default function Dashboard({ 
  colors, 
  mockAssessments, 
  dashboardTab, 
  setDashboardTab, 
  setSelectedAssessmentId, 
  setCurrentScreen 
}) {
  const statusMap = { 'Ativas': 'active', 'Realizadas': 'completed', 'Expiradas': 'expired' };
  const filteredAssessments = mockAssessments.filter(a => a.status === statusMap[dashboardTab]);

  return (
    <div className="min-h-screen flex flex-col font-['Montserrat',sans-serif] text-[#1D2432] relative overflow-hidden" style={{ backgroundColor: colors.neutral[0] }}>
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
          <h1 className="text-[24px] md:text-[28px] font-bold text-[#1D2432]">Olá, David!</h1>
          <div className="relative w-full md:w-[350px]">
            <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input type="text" placeholder="Pesquisar avaliação..." className="w-full pl-10 pr-10 py-3 bg-white border border-gray-300 rounded-lg text-[14px] outline-none focus:border-[#008BC9] shadow-sm" />
          </div>
        </div>

        <div className="w-full border-b border-gray-200 mb-6">
          <div className="max-w-[1200px] w-full mx-auto px-4 md:px-10 flex overflow-x-auto hide-scrollbar">
            {['Ativas', 'Realizadas', 'Expiradas'].map(tab => (
              <button key={tab} onClick={() => setDashboardTab(tab)} className={`px-5 py-3 font-bold text-[14px] border-b-2 -mb-[1px] transition-colors whitespace-nowrap ${dashboardTab === tab ? 'border-[#008BC9] text-[#008BC9]' : 'border-transparent text-gray-500 hover:text-gray-800'}`}>
                {tab}
              </button>
            ))}
          </div>
        </div>

        <div className="max-w-[1200px] w-full mx-auto px-4 md:px-10 flex flex-col gap-4 pb-12">
          {filteredAssessments.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <ListTodo size={48} className="text-gray-300 mb-4" />
              <h2 className="text-[18px] font-bold text-[#1D2432]">Nenhuma avaliação {dashboardTab.toLowerCase()}</h2>
              <p className="text-[14px] text-gray-500 mt-2">Você não possui avaliações nesta categoria no momento.</p>
            </div>
          ) : (
            filteredAssessments.map(av => (
              <div key={av.id} onClick={() => { setSelectedAssessmentId(av.id); setCurrentScreen('pre_test'); window.scrollTo(0, 0); }} className="bg-white border border-gray-200 rounded-xl p-5 md:p-6 shadow-sm hover:shadow-md hover:border-[#008BC9] cursor-pointer transition-all flex flex-col md:flex-row gap-4 md:gap-6 relative group">
                <div className={`w-[48px] h-[48px] rounded-xl flex items-center justify-center shrink-0 ${av.status === 'expired' ? 'bg-[#EF4444]' : (av.status === 'completed' ? 'bg-[#10B981]' : 'bg-[#008BC9]')}`}>
                  <BookOpen size={24} className="text-white" />
                </div>
                <div className="flex flex-col flex-1">
                  <div className="text-[12px] font-semibold text-gray-500 mb-1">{av.id} • {av.subtitle}</div>
                  <h3 className="text-[16px] md:text-[18px] font-bold text-[#1D2432] mb-4 pr-6">{av.title}</h3>
                  {av.status === 'active' && av.progress > 0 && (
                    <div className="w-full h-2 bg-gray-100 rounded-full mb-4 overflow-hidden">
                      <div className="h-full bg-[#008BC9] rounded-full" style={{ width: `${av.progress}%` }}></div>
                    </div>
                  )}
                  <div className="flex items-center gap-4 md:gap-6 text-[12px] md:text-[13px] text-gray-500 font-medium mt-auto">
                    <div className="flex items-center gap-1.5"><Calendar size={14} /> {av.startDate}</div>
                    <div className="flex items-center gap-1.5"><Clock size={14} /> {av.endDate}</div>
                  </div>
                </div>
                <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity hidden sm:block">
                  <ChevronRight size={24} className="text-[#008BC9]" />
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
