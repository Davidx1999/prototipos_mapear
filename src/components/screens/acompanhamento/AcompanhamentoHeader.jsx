import React, { useState } from 'react';
import {
  ArrowLeft,
  User,
  XCircle,
  LayoutGrid,
  HelpCircle,
  FileDown,
  ChevronDown
} from 'lucide-react';
import { STUDENTS } from './mockDataAcompanhamento';

export default function AcompanhamentoHeader({
  activeStudent,
  setActiveStudent,
  activeMainTab,
  setActiveMainTab,
  activeSubNav,
  setActiveSubNav,
  onBackToDashboard,
  onExportPDF
}) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="flex flex-col gap-3.5 mb-2 select-none">
      {/* ─── BOTÃO VOLTAR + TÍTULO DA SEÇÃO ─── */}
      <div className="flex items-center gap-2.5">
        <button
          onClick={onBackToDashboard}
          className="w-7 h-7 rounded-[4px] border border-slate-300 bg-white flex items-center justify-center text-slate-700 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Retornar ao Dashboard"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-700" />
        </button>
        <span className="text-sm font-semibold text-slate-800">
          Acompanhamento Escolar
        </span>
      </div>

      {/* ─── SUB-NAV TABS: [Estudante] Turmas Escolas Rede ─── */}
      <div className="flex items-center gap-4 text-xs font-bold mt-0.5">
        <button
          onClick={() => setActiveSubNav('Estudante')}
          className={`px-4 py-1.5 rounded-[4px] transition-all ${
            activeSubNav === 'Estudante'
              ? 'bg-[#489EEA] text-white shadow-2xs'
              : 'text-[#0078B0] hover:text-[#005580]'
          }`}
        >
          Estudante
        </button>

        {['Turmas', 'Escolas', 'Rede'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveSubNav(tab)}
            className={`transition-colors px-1 py-1 ${
              activeSubNav === tab
                ? 'text-[#005580] underline font-extrabold'
                : 'text-[#0078B0] hover:text-[#005580]'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ─── LINHA DE BUSCA / SELETOR: [ 👤 anasofia.martins ⓧ ] [ PESQUISA DIRECIONADA ⊞ ] (?) ─── */}
      <div className="flex items-center gap-2.5 flex-wrap mt-0.5">
        {/* Campo de Input com usuário */}
        <div className="relative w-full max-w-sm">
          <div
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className="flex items-center justify-between px-3 py-1.5 bg-white border border-slate-300 rounded-[6px] text-xs text-slate-700 cursor-pointer hover:border-slate-400 transition-colors"
          >
            <div className="flex items-center gap-2 truncate">
              <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="font-normal text-slate-700">
                {activeStudent.username || 'anasofia.martins'}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <XCircle className="w-3.5 h-3.5 text-slate-400 hover:text-slate-600" />
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          {/* Menu Dropdown para alternar estudantes das imagens */}
          {isDropdownOpen && (
            <div className="absolute left-0 top-full mt-1 w-full bg-white rounded-[6px] border border-slate-300 shadow-xl z-50 py-1 text-xs">
              <div className="px-3 py-1.5 text-[10px] uppercase font-bold text-slate-400 border-b border-slate-100">
                Alternar Estudante
              </div>
              {STUDENTS.map((st) => (
                <button
                  key={st.id}
                  onClick={() => {
                    setActiveStudent(st);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 transition-colors flex items-center justify-between ${
                    st.id === activeStudent.id
                      ? 'bg-[#489EEA]/10 font-bold text-[#0078B0]'
                      : 'text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  <div className="truncate">
                    <p className="font-semibold">{st.name}</p>
                    <p className="text-[10px] text-slate-400">{st.username} · {st.school}</p>
                  </div>
                  {st.id === activeStudent.id && (
                    <span className="text-[9px] bg-[#489EEA] text-white px-1.5 py-0.5 rounded font-bold">
                      Ativo
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Botão PESQUISA DIRECIONADA (fundo azul claro, texto azul, sem borda) */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-[#D9F0FC] text-[#0078B0] hover:bg-[#c6e6f9] text-xs font-bold rounded-[6px] uppercase tracking-tight transition-colors"
        >
          <span>PESQUISA DIRECIONADA</span>
          <LayoutGrid className="w-3.5 h-3.5 text-[#0078B0]" />
        </button>

        {/* Ícone de Ajuda (?) */}
        <button
          className="text-slate-400 hover:text-slate-600 transition-colors p-1"
          title="Ajuda sobre a busca"
        >
          <HelpCircle className="w-4 h-4" />
        </button>
      </div>

      {/* ─── DADOS DO ESTUDANTE + EXPORTAR PARA PDF ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mt-2">
        <div>
          <h2 className="text-xl md:text-[22px] font-bold text-slate-900 tracking-tight leading-tight">
            {activeStudent.name}
          </h2>
          <div className="flex items-center gap-2 mt-1 text-xs text-slate-500 font-medium flex-wrap">
            <span>
              {activeStudent.school} • Série: {activeStudent.grade} • Turma: {activeStudent.classGroup}
            </span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#E5E7EB] text-[#6B7280]">
              {activeStudent.status}
            </span>
          </div>
        </div>

        <button
          onClick={onExportPDF}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-800 hover:text-[#008BC9] transition-colors self-start sm:self-auto py-1"
          title="Exportar relatório para PDF"
        >
          <span>Exportar para PDF</span>
          <FileDown className="w-4 h-4 text-slate-700" />
        </button>
      </div>

      {/* ─── ABAS: [Resultados] [Linha do Tempo] COM LINHA DIVISÓRIA COMPLETA ─── */}
      <div className="flex items-center gap-8 border-b border-slate-200 mt-2 w-full">
        <button
          onClick={() => setActiveMainTab('resultados')}
          className={`text-xs font-bold pb-2 -mb-[1px] transition-all ${
            activeMainTab === 'resultados'
              ? 'text-[#008BC9] border-b-2 border-[#008BC9]'
              : 'text-slate-700 hover:text-[#008BC9] border-b-2 border-transparent'
          }`}
        >
          Resultados
        </button>

        <button
          onClick={() => setActiveMainTab('linha-do-tempo')}
          className={`text-xs font-bold pb-2 -mb-[1px] transition-all ${
            activeMainTab === 'linha-do-tempo'
              ? 'text-[#008BC9] border-b-2 border-[#008BC9]'
              : 'text-slate-700 hover:text-[#008BC9] border-b-2 border-transparent'
          }`}
        >
          Linha do Tempo
        </button>
      </div>
    </div>
  );
}
