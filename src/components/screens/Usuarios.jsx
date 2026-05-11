
import React from 'react';
import { ChevronLeft, ChevronRight, ChevronDown, Search, Edit2, Trash2, Users as UsersIcon } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Breadcrumb from '../ui/Breadcrumb';
import { mockUsuarios } from '../../data/mockData';

const Usuarios = ({
  colors,
  expandedUser,
  setExpandedUser,
  navigateTo
}) => {
  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[32px] animate-fade-slide flex flex-col h-full bg-neutral-0">
      <Breadcrumb
        colors={colors}
        onBack={() => navigateTo('dashboard')}
        paths={[
          { label: 'Início', onClick: () => navigateTo('dashboard') },
          { label: 'Gerenciamento de Usuários' }
        ]}
      />
      <h2 className="text-[22px] md:text-[28px] font-bold mb-[24px] md:mb-[32px]" style={{ color: colors.neutral[7] }}>Gerenciamento de Usuários</h2>

      <div className="flex flex-col gap-[12px] mb-[24px] md:mb-[32px]">
        <div className="flex items-center gap-[8px] md:gap-[16px] w-full">
          <Input
            iconLeft={<Search />}
            placeholder="Pesquise por nome, sobrenome ou email"
          />
          <Button variant="primary" iconOnly size="default"><Search size={20} /></Button>
        </div>
        <div className="flex gap-[8px] md:gap-[12px] w-full justify-end overflow-x-auto hide-scrollbar pb-[4px]">
          <div className="relative w-[180px] shrink-0">
            <select className="w-full px-[16px] py-[8px] rounded-[8px] border text-[12px] font-semibold outline-none appearance-none bg-neutral-0 truncate focus:border-primary-base cursor-pointer hover:bg-neutral-1" style={{ borderColor: colors.neutral[3], color: colors.neutral[6] }}><option>Filtrar por Perfil</option></select>
            <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: colors.neutral[6] }} />
          </div>
          <div className="relative w-[180px] shrink-0">
            <select className="w-full px-[16px] py-[8px] rounded-[8px] border text-[12px] font-semibold outline-none appearance-none bg-neutral-0 truncate focus:border-primary-base cursor-pointer hover:bg-neutral-1" style={{ borderColor: colors.neutral[3], color: colors.neutral[6] }}><option>Filtrar por Escola</option></select>
            <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: colors.neutral[6] }} />
          </div>
          <div className="relative w-[180px] shrink-0">
            <select className="w-full px-[16px] py-[8px] rounded-[8px] border text-[12px] font-semibold outline-none appearance-none bg-neutral-0 truncate focus:border-primary-base cursor-pointer hover:bg-neutral-1" style={{ borderColor: colors.neutral[3], color: colors.neutral[6] }}><option>Filtrar por Turma</option></select>
            <ChevronDown size={14} className="absolute right-[12px] top-1/2 -translate-y-1/2 pointer-events-none" style={{ color: colors.neutral[6] }} />
          </div>
        </div>
      </div>

      <div className="bg-neutral-0 rounded-[8px] border overflow-hidden flex-1 shadow-sm mb-[24px] md:mb-[32px]" style={{ borderColor: colors.neutral[2] }}>
        <div className="w-full">
          <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[16px] border-b text-[12px] font-bold uppercase tracking-wide bg-neutral-1 text-neutral-5">
            <div className="w-[24px] shrink-0"></div>
            <div className="w-[100px] sm:w-[140px] shrink-0 flex items-center gap-[4px] hidden md:flex">Usuário <ChevronDown size={14} className="rotate-180" /></div>
            <div className="flex-1 min-w-0">Nome</div>
            <div className="flex-1 min-w-0 hidden md:block">Email</div>
            <div className="w-[100px] shrink-0 hidden md:block">Perfil</div>
            <div className="w-[80px] shrink-0"></div>
          </div>

          <div className="flex flex-col">
            {mockUsuarios.map((u) => (
              <React.Fragment key={u.id}>
                <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[16px] border-b text-[14px] md:text-[14px] text-neutral-6">
                  <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedUser(expandedUser === u.id ? null : u.id)}>
                    <ChevronDown size={18} className={`transition-transform ${expandedUser === u.id ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
                  </div>
                  <div className="w-[100px] sm:w-[140px] shrink-0 hidden md:block font-medium truncate" title={u.user}>{u.user}</div>
                  <div className="flex-1 min-w-0 font-bold truncate" title={u.name}>{u.name}</div>
                  <div className="flex-1 min-w-0 hidden md:block truncate" title={u.email}>{u.email}</div>
                  <div className="w-[100px] shrink-0 hidden md:block font-medium truncate" title={u.role}>{u.role}</div>
                  <div className="w-[80px] shrink-0 flex justify-end gap-[4px] md:gap-[8px]">
                    <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14} /></Button>
                    <Button variant="tertiary" iconOnly size="sm"><Trash2 size={14} /></Button>
                  </div>
                </div>

                {expandedUser === u.id && (
                  <div className="px-[48px] sm:px-[64px] py-[16px] md:py-[24px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
                    <div className="md:hidden flex flex-col gap-[8px] mb-[16px] text-[14px] text-neutral-5">
                      <div><strong>Usuário:</strong> {u.user}</div>
                      <div><strong>Email:</strong> {u.email}</div>
                      <div><strong>Perfil:</strong> {u.role}</div>
                    </div>
                    <div className="flex items-center gap-[12px] md:gap-[16px] mb-[16px] flex-wrap">
                      <span className="text-[12px] md:text-[14px] font-bold" style={{ color: colors.neutral[7] }}>Legenda:</span>
                      <span className="px-[12px] py-[4px] rounded-full text-[10px] md:text-[11px] font-bold border whitespace-nowrap" style={{ borderColor: '#10B981', color: '#10B981' }}>Turma Real</span>
                      <span className="px-[12px] py-[4px] rounded-full text-[10px] md:text-[11px] font-bold border whitespace-nowrap" style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}>Turma Virtual</span>
                    </div>
                    <div className="flex items-center gap-[12px] md:gap-[16px] flex-wrap">
                      <span className="flex items-center gap-[8px] text-[12px] md:text-[14px] font-bold" style={{ color: colors.neutral[5] }}><UsersIcon size={16} /> Turmas</span>
                      <span className="px-[12px] py-[4px] rounded-full text-[11px] md:text-[12px] font-semibold border whitespace-nowrap" style={{ borderColor: '#10B981', color: '#10B981' }}>3º Ano - T (2025)</span>
                      <span className="px-[12px] py-[4px] rounded-full text-[11px] md:text-[12px] font-semibold border whitespace-nowrap" style={{ borderColor: '#8B5CF6', color: '#8B5CF6' }}>Reforço de Matemática 3º ANO (2025)</span>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-auto pt-[16px] md:pt-[24px] border-t flex-wrap gap-[16px] md:gap-0" style={{ borderColor: colors.neutral[2] }}>
        <div className="flex flex-col sm:flex-row items-center gap-[8px] sm:gap-[16px] w-full md:w-auto order-2 md:order-1">
          <span className="text-[12px] md:text-[14px]" style={{ color: colors.neutral[5] }}>1 a 10 de 231 registros</span>
          <div className="flex items-center gap-[8px]">
            <Button variant="tertiary" iconOnly size="sm"><ChevronLeft size={16} /></Button>
            <span className="text-[12px] md:text-[14px] font-medium">Página <input type="text" defaultValue="1" className="w-[32px] md:w-[40px] text-center border rounded-[4px] mx-[4px] py-[2px] md:py-[4px] outline-none focus:border-primary-base transition-colors" style={{ borderColor: colors.neutral[3] }} /> de 24</span>
            <Button variant="tertiary" iconOnly size="sm"><ChevronRight size={16} /></Button>
          </div>
        </div>
        <Button variant="primary" size="default" className="w-full md:w-auto uppercase tracking-wide order-1 md:order-2">
          Adicionar Usuários
        </Button>
      </div>
    </main>
  );
};

export default Usuarios;
