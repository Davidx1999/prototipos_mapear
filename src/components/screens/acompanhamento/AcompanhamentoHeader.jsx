import React, { useState } from 'react';
import {
  ArrowLeft,
  Blocks,
  ChevronRight,
  ChevronDown,
  PanelLeftOpen,
  UserRoundSearch,
  HelpCircle,
  FileDown,
  X
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
    <div className="flex flex-col gap-4 mb-2 select-none">
      {/* ─── BOTÃO VOLTAR + TÍTULO DA SEÇÃO ─── */}
      <div className="flex items-center gap-3">
        <button
          onClick={onBackToDashboard}
          className="w-10 h-10 rounded-[8px] border border-[#CBD5E1] bg-white flex items-center justify-center text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs"
          title="Retornar ao Dashboard"
        >
          <ArrowLeft className="w-5 h-5 text-slate-800 stroke-[2.2]" />
        </button>
        <span className="text-[16px] font-medium text-[#1D2432] tracking-tight">
          Acompanhamento Escolar
        </span>
      </div>

      {/* ─── SUB-NAV TABS: [Estudante] Turmas Escolas Rede (Altura: 48px com Stroke em Estudante e Hover em Turmas) ─── */}
      <div className="flex items-center gap-3">
        {['Estudante', 'Turmas', 'Escolas', 'Rede'].map((tab) => {
          const isActive = activeSubNav === tab;
          return (
            <button
              key={tab}
              onClick={() => setActiveSubNav(tab)}
              className={`h-[48px] px-8 rounded-[6px] text-[16px] font-semibold transition-all flex items-center justify-center cursor-pointer ${
                isActive
                  ? 'bg-[#5AB6E2] text-[#002C5E] border-[1.5px] border-[#001D31] shadow-xs'
                  : 'text-[#002C5E] hover:bg-[#BCE5F8] hover:text-[#002C5E] bg-transparent border-[1.5px] border-transparent'
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* ─── BARRA DE SELEÇÃO / BREADCRUMB (Altura: 40px) ─── */}
      <div className="flex items-center gap-2.5 flex-wrap relative">
        {/* Input Breadcrumb com altura de 40px e fonte body / s (14px) */}
        <div
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-[40px] flex items-center bg-white border border-[#CBD5E1] rounded-[6px] px-3.5 gap-2.5 text-sm text-slate-600 cursor-pointer hover:border-slate-400 transition-colors shadow-2xs"
        >
          <Blocks className="w-5 h-5 text-slate-900 shrink-0 stroke-[2]" />
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 stroke-[2.2]" />
          <span className="font-medium text-[#64748B] shrink-0 text-sm">
            {activeStudent?.schoolShort && activeStudent.schoolShort !== 'Liceu do C...'
              ? activeStudent.schoolShort
              : 'EEM José Mi...'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 stroke-[2.2]" />
          <span className="font-medium text-[#64748B] shrink-0 text-sm">
            {activeStudent.year || '2023'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 stroke-[2.2]" />
          <span className="font-medium text-[#64748B] shrink-0 text-sm">
            Turma {activeStudent.classGroup || 'B'}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-500 shrink-0 stroke-[2.2]" />
          <span className="font-semibold text-[#1D2432] truncate max-w-[240px] text-sm">
            {activeStudent.nameShort || activeStudent.name}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-500 shrink-0 ml-0.5 stroke-[2.2]" />
        </div>

        {/* Dropdown de seleção de Estudante */}
        {isDropdownOpen && (
          <div className="absolute left-0 top-[46px] w-full max-w-md bg-white rounded-[6px] border border-[#CBD5E1] shadow-xl z-50 py-1 text-xs md:text-sm">
            <div className="px-3.5 py-2 text-[11px] uppercase font-bold text-slate-400 border-b border-slate-100 flex items-center justify-between">
              <span>Selecionar Estudante</span>
              <button
                onClick={() => setIsDropdownOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {STUDENTS.map((st) => (
              <button
                key={st.id}
                onClick={() => {
                  setActiveStudent(st);
                  setIsDropdownOpen(false);
                }}
                className={`w-full text-left px-3.5 py-2.5 transition-colors flex items-center justify-between ${st.id === activeStudent.id
                    ? 'bg-[#5AB6E2]/20 font-bold text-[#0078B0]'
                    : 'text-slate-700 hover:bg-slate-50'
                  }`}
              >
                <div className="truncate">
                  <p className="font-semibold text-slate-900">{st.name}</p>
                  <p className="text-[11px] text-slate-400">
                    {st.school} · Série: {st.grade} · Turma: {st.classGroup}
                  </p>
                </div>
                {st.id === activeStudent.id && (
                  <span className="text-[11px] bg-[#5AB6E2] text-[#002C5E] border border-[#001D31] px-2 py-0.5 rounded font-bold">
                    Ativo
                  </span>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Botão Quadrado com ícone PanelLeftOpen (altura: 40px, largura: 40px) */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-[40px] w-[40px] rounded-[6px] bg-[#0078B0] hover:bg-[#006390] text-white flex items-center justify-center transition-colors shadow-2xs shrink-0"
          title="Alternar visualização / Painel"
        >
          <PanelLeftOpen className="w-5 h-5 text-white stroke-[2]" />
        </button>

        {/* Botão PESQUISA RÁPIDA (altura: 40px, body / s medium) */}
        <button
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="h-[40px] px-4 bg-white hover:bg-slate-50 border border-[#CBD5E1] rounded-[6px] flex items-center gap-2 text-sm font-semibold text-[#1D2432] transition-colors shadow-2xs shrink-0"
        >
          <span>PESQUISA RÁPIDA</span>
          <UserRoundSearch className="w-4 h-4 text-[#1D2432] stroke-[2]" />
        </button>

        {/* Ícone de Ajuda (?) */}
        <button
          className="w-10 h-10 flex items-center justify-center text-slate-400 hover:text-slate-600 transition-colors"
          title="Ajuda sobre a busca e navegação"
        >
          <HelpCircle className="w-5 h-5 stroke-[1.8]" />
        </button>
      </div>

      {/* ─── DADOS DO ESTUDANTE + EXPORTAR PARA PDF ─── */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-2">
        <div>
          <h5 className="text-[22px] md:text-[24px] font-semibold text-[#1D2432] tracking-tight leading-tight">
            {activeStudent.name}
          </h5>
          <div className="flex items-center gap-2 mt-2 text-sm text-[#64748B] font-normal flex-wrap">
            <span>
              {activeStudent.school} • Série: {activeStudent.grade} • Turma: {activeStudent.classGroup}
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-[#E2E8F0] text-[#64748B]">
              {activeStudent.status}
            </span>
          </div>
        </div>

        <button
          onClick={onExportPDF}
          className="inline-flex items-center gap-2 text-sm font-semibold text-[#1D2432] hover:text-[#008BC9] transition-colors self-start sm:self-auto py-1"
          title="Exportar relatório para PDF"
        >
          <span>Exportar para PDF</span>
          <FileDown className="w-5 h-5 text-[#1D2432] stroke-[2]" />
        </button>
      </div>
    </div>
  );
}
