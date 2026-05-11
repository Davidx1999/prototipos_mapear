
import React from 'react';
import {
  ChevronLeft, ChevronRight, ChevronDown, Search, HelpCircle,
  Building2, FileText, BarChart, BarChart2, Grid
} from 'lucide-react';
import Button from '../ui/Button';
import Breadcrumb from '../ui/Breadcrumb';
import { mockTimeline } from '../../data/mockData';

const Acompanhamento = ({
  colors,
  acompanhamentoTab,
  setAcompanhamentoTab,
  navigateTo
}) => {
  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[32px] animate-fade-slide flex flex-col h-full bg-neutral-0">
      <Breadcrumb
        colors={colors}
        onBack={() => navigateTo('dashboard')}
        paths={[
          { label: 'Início', onClick: () => navigateTo('dashboard') },
          { label: 'Acompanhamento Escolar' }
        ]}
      />

      <h2 className="text-[22px] md:text-[28px] font-bold mb-[8px]" style={{ color: colors.neutral[7] }}>Acompanhamento Escolar</h2>
      <p className="text-[14px] md:text-[14px] mb-[24px] md:mb-[32px]" style={{ color: colors.neutral[5] }}>Para começar, selecione o acompanhamento de notas que deseja realizar entre Alunos ou Escolas.</p>

      <div className="flex flex-col mb-[32px] gap-[12px]">
        <div className="flex gap-[8px] mb-[8px]">
          <Button variant="secondary" size="sm" className="!rounded-full font-bold px-[16px]">Por aluno</Button>
          <Button variant="text" size="sm" className="!rounded-full font-semibold px-[16px]">Por escola</Button>
        </div>
        <label className="text-[12px] font-bold" style={{ color: colors.neutral[7] }}>Escolha um(a) aluno(a) para realizar análise</label>

        <div className="flex items-center gap-[8px] overflow-x-auto hide-scrollbar bg-neutral-0 border p-[8px] rounded-[8px] shadow-sm" style={{ borderColor: colors.neutral[2] }}>
          <div className="flex items-center gap-[8px] px-[8px] border-r" style={{ borderColor: colors.neutral[2] }}>
            <Building2 size={16} style={{ color: colors.neutral[5] }} />
            <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: colors.neutral[7] }}>CE</span>
            <ChevronRight size={14} style={{ color: colors.neutral[4] }} />
          </div>
          <div className="flex items-center gap-[8px] px-[8px] border-r" style={{ borderColor: colors.neutral[2] }}>
            <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: colors.neutral[7] }}>Fortaleza</span>
            <ChevronRight size={14} style={{ color: colors.neutral[4] }} />
          </div>
          <div className="flex items-center gap-[8px] px-[8px] border-r" style={{ borderColor: colors.neutral[2] }}>
            <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: colors.neutral[7] }}>Liceu do Conjunto Ceará</span>
            <ChevronRight size={14} style={{ color: colors.neutral[4] }} />
          </div>
          <div className="flex items-center gap-[8px] px-[8px] border-r" style={{ borderColor: colors.neutral[2] }}>
            <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: colors.neutral[7] }}>2025</span>
            <ChevronRight size={14} style={{ color: colors.neutral[4] }} />
          </div>
          <div className="flex items-center gap-[8px] px-[8px] border-r" style={{ borderColor: colors.neutral[2] }}>
            <span className="text-[14px] font-semibold whitespace-nowrap" style={{ color: colors.neutral[7] }}>Turma B</span>
            <ChevronRight size={14} style={{ color: colors.neutral[4] }} />
          </div>
          <div className="flex items-center gap-[8px] px-[16px] min-w-[200px]">
            <select className="w-full bg-transparent outline-none text-[14px] font-bold appearance-none cursor-pointer" style={{ color: colors.neutral[7] }}>
              <option>Roberto Carlos da Silva Júnior Melendez Neto</option>
            </select>
            <ChevronDown size={14} style={{ color: colors.neutral[6] }} />
          </div>
          <div className="ml-auto flex items-center gap-[8px] shrink-0 pl-[16px]">
            <Button variant="primary" iconOnly size="sm"><Search size={16} /></Button>
            <Button variant="tertiary" size="sm" className="bg-neutral-0"><Search size={14} className="mr-[4px]" /> PESQUISA RÁPIDA</Button>
            <HelpCircle size={20} className="cursor-pointer" style={{ color: colors.neutral[5] }} />
          </div>
        </div>
      </div>

      <div className="mb-[32px]">
        <h3 className="text-[20px] md:text-[24px] font-bold leading-tight flex items-center gap-[12px]" style={{ color: colors.neutral[7] }}>
          Roberto Carlos da Silva Júnior Melendez Neto
        </h3>
        <p className="text-[14px] mt-[4px] flex items-center gap-[8px]" style={{ color: colors.neutral[5] }}>
          Liceu do Conjunto Ceará • Série: 1º ano • Turma: B
          <span className="px-[8px] py-[2px] rounded-full text-[10px] font-bold bg-[#E5E7EB] text-[#374151]">Ativo</span>
        </p>
      </div>

      <div className="sticky top-[64px] md:top-[74px] z-40 bg-neutral-0 pt-[8px] pb-[8px] -mx-[16px] md:-mx-[32px] px-[16px] md:px-[32px] mb-[24px]">
        <div className="flex flex-col md:flex-row md:items-center justify-between border-b gap-[16px] md:gap-0" style={{ borderColor: colors.neutral[2] }}>
          <div className="flex items-center overflow-x-auto hide-scrollbar w-full">
            <div className={`px-[16px] md:px-[24px] py-[12px] font-bold text-[14px] md:text-[14px] cursor-pointer whitespace-nowrap border-b-2 transition-colors ${acompanhamentoTab === 0 ? 'border-primary-base text-primary-base' : 'border-transparent text-neutral-5 hover:text-primary-base'}`} onClick={() => setAcompanhamentoTab(0)}>
              Teoria Clássica dos Testes (TCT)
            </div>
            <div className={`px-[16px] md:px-[24px] py-[12px] font-bold text-[14px] md:text-[14px] cursor-pointer whitespace-nowrap border-b-2 transition-colors ${acompanhamentoTab === 1 ? 'border-primary-base text-primary-base' : 'border-transparent text-neutral-5 hover:text-primary-base'}`} onClick={() => setAcompanhamentoTab(1)}>
              Teoria de Resposta ao Item (TRI)
            </div>
            <div className={`px-[16px] md:px-[24px] py-[12px] font-bold text-[14px] md:text-[14px] cursor-pointer whitespace-nowrap border-b-2 transition-colors ${acompanhamentoTab === 2 ? 'border-primary-base text-primary-base' : 'border-transparent text-neutral-5 hover:text-primary-base'}`} onClick={() => setAcompanhamentoTab(2)}>
              Linha do Tempo
            </div>
          </div>
          <div className="shrink-0 pb-[8px] md:pb-0 flex justify-end w-full md:w-auto">
            <Button variant="tertiary" size="sm" className="bg-neutral-0"><FileText size={16} /> Exportar para PDF</Button>
          </div>
        </div>
      </div>

      {acompanhamentoTab === 0 && (
        <div className="animate-fade-slide">
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-[24px] gap-[16px]">
            <div>
              <span className="text-[12px] font-bold block mb-[8px]" style={{ color: colors.neutral[7] }}>Acompanhamento por ano</span>
              <div className="flex items-center gap-[8px] overflow-x-auto hide-scrollbar">
                {['Todos os anos', '2023', '2024', '2025', '2026', '2027', '2028', '2029'].map(year => (
                  <div key={year} className={`px-[12px] py-[4px] rounded-full text-[12px] font-bold cursor-pointer transition-colors ${year === '2023' ? 'bg-[#94CFEF] text-[#003A79]' : 'bg-transparent text-primary-base hover:bg-[#D9F0FC]'}`}>{year}</div>
                ))}
              </div>
            </div>
            <div className="shrink-0">
              <span className="text-[12px] font-bold block mb-[8px]" style={{ color: colors.neutral[7] }}>Tipo de domínio</span>
              <div className="flex items-center bg-[#E5E7EB] rounded-full p-[2px]">
                <div className="px-[16px] py-[4px] rounded-full text-[12px] font-bold cursor-pointer text-neutral-5 hover:text-neutral-6">Repertório</div>
                <div className="px-[16px] py-[4px] rounded-full text-[12px] font-bold cursor-pointer bg-[#94CFEF] text-[#003A79] shadow-sm">Cognitivo</div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-[16px] mb-[24px]">
            <div className="bg-neutral-0 p-[20px] rounded-[8px] border shadow-sm flex flex-col" style={{ borderColor: colors.neutral[2] }}>
              <div className="flex justify-between items-center mb-[16px]"><span className="text-[14px] font-medium" style={{ color: colors.neutral[5] }}>Percentual de Acertos</span><HelpCircle size={14} style={{ color: colors.neutral[4] }} /></div>
              <span className="text-[28px] font-bold" style={{ color: colors.neutral[7] }}>78%</span>
            </div>
            <div className="bg-neutral-0 p-[20px] rounded-[8px] border shadow-sm flex flex-col" style={{ borderColor: colors.neutral[2] }}>
              <div className="flex justify-between items-center mb-[16px]"><span className="text-[14px] font-medium" style={{ color: colors.neutral[5] }}>Avaliações Realizadas</span><HelpCircle size={14} style={{ color: colors.neutral[4] }} /></div>
              <span className="text-[28px] font-bold" style={{ color: colors.neutral[7] }}>120</span>
            </div>
            <div className="bg-neutral-0 p-[20px] rounded-[8px] border shadow-sm flex flex-col" style={{ borderColor: colors.neutral[2] }}>
              <div className="flex justify-between items-center mb-[16px]"><span className="text-[14px] font-medium" style={{ color: colors.neutral[5] }}>Itens Resolvidos</span><HelpCircle size={14} style={{ color: colors.neutral[4] }} /></div>
              <span className="text-[28px] font-bold" style={{ color: colors.neutral[7] }}>7.000</span>
            </div>
            <div className="bg-neutral-0 p-[20px] rounded-[8px] border shadow-sm flex flex-col" style={{ borderColor: colors.neutral[2] }}>
              <div className="flex justify-between items-center mb-[16px]"><span className="text-[14px] font-medium" style={{ color: colors.neutral[5] }}>Total de Intervenções</span><HelpCircle size={14} style={{ color: colors.neutral[4] }} /></div>
              <span className="text-[28px] font-bold" style={{ color: colors.neutral[7] }}>2</span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-[16px] mb-[24px]">
            <div className="lg:col-span-2 bg-neutral-0 rounded-[8px] border shadow-sm flex flex-col" style={{ borderColor: colors.neutral[2] }}>
              <div className="p-[20px] border-b flex justify-between items-center" style={{ borderColor: colors.neutral[2] }}>
                <h3 className="text-[16px] font-bold" style={{ color: colors.neutral[7] }}>Evolução do Aluno</h3>
                <div className="flex items-center gap-[8px]">
                  <span className="text-[12px] font-medium" style={{ color: colors.neutral[5] }}>Por</span>
                  <span className="text-[14px] font-bold cursor-pointer flex items-center gap-[4px]" style={{ color: colors.primary.base }}>Semestre <ChevronDown size={14} /></span>
                  <HelpCircle size={14} className="ml-[8px]" style={{ color: colors.neutral[4] }} />
                </div>
              </div>
              <div className="p-[24px] flex-1 flex flex-col items-center justify-center relative min-h-[300px]">
                <div className="flex gap-[24px] mb-[32px]">
                  <div className="flex items-center gap-[8px]"><div className="w-[12px] h-[4px] rounded-full bg-[#A855F7]"></div><span className="text-[14px] font-bold text-[#A855F7]">Leitura</span></div>
                  <div className="flex items-center gap-[8px]"><div className="w-[12px] h-[4px] rounded-full bg-[#F59E0B]"></div><span className="text-[14px] font-bold text-[#F59E0B]">Matemática</span></div>
                </div>

                <div className="w-full flex-1 relative flex items-end px-[40px] pt-[20px]">
                  <div className="absolute left-[40px] right-[40px] top-[20%] border-t border-dashed" style={{ borderColor: colors.neutral[2] }}></div>
                  <div className="absolute left-[40px] right-[40px] top-[40%] border-t border-dashed" style={{ borderColor: colors.neutral[2] }}></div>
                  <div className="absolute left-[40px] right-[40px] top-[60%] border-t border-dashed" style={{ borderColor: colors.neutral[2] }}></div>
                  <div className="absolute left-[40px] right-[40px] top-[80%] border-t border-dashed" style={{ borderColor: colors.neutral[2] }}></div>
                  <div className="absolute left-[40px] right-[40px] bottom-[30px] border-t" style={{ borderColor: colors.neutral[3] }}></div>

                  <div className="w-full h-full relative z-10">
                    <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 100 100">
                      <path d="M 25,60 L 75,65" fill="none" stroke="#A855F7" strokeWidth="1.5" />
                      <circle cx="25" cy="60" r="2" fill="white" stroke="#A855F7" strokeWidth="1.5" />
                      <circle cx="75" cy="65" r="2" fill="white" stroke="#A855F7" strokeWidth="1.5" />

                      <path d="M 25,40 L 75,30" fill="none" stroke="#F59E0B" strokeWidth="1.5" />
                      <circle cx="25" cy="40" r="2" fill="white" stroke="#F59E0B" strokeWidth="1.5" />
                      <circle cx="75" cy="30" r="2" fill="white" stroke="#F59E0B" strokeWidth="1.5" />
                    </svg>
                  </div>

                  <div className="absolute bottom-0 w-full flex justify-between px-[20%]">
                    <span className="text-[12px] font-bold" style={{ color: colors.neutral[7] }}>Semestre 1 | Janeiro a Junho</span>
                    <span className="text-[12px] font-bold" style={{ color: colors.neutral[7] }}>Semestre 2 | Julho a Dezembro</span>
                  </div>
                </div>
              </div>
              <div className="p-[16px] border-t bg-[#FDFDFD] flex flex-col sm:flex-row justify-between items-center gap-[16px]" style={{ borderColor: colors.neutral[2] }}>
                <div className="flex items-center gap-[16px]">
                  <div className="flex items-center gap-[6px]"><div className="w-[12px] h-[2px] bg-[#969DA9]"></div><span className="text-[12px] font-medium" style={{ color: colors.neutral[5] }}>Média do Aluno</span></div>
                  <div className="flex items-center gap-[6px]"><div className="w-[12px] h-[2px] border-t-2 border-dashed border-[#969DA9]"></div><span className="text-[12px] font-medium" style={{ color: colors.neutral[5] }}>Média Comparativa</span></div>
                </div>
                <div className="flex items-center gap-[12px]">
                  <span className="text-[14px] font-medium" style={{ color: colors.neutral[6] }}>Ativar comparação por</span>
                  <span className="text-[14px] font-bold cursor-pointer flex items-center gap-[4px] px-[12px] py-[6px] rounded-[4px] border bg-neutral-0" style={{ borderColor: colors.neutral[3] }}>Turma <ChevronDown size={14} /></span>
                </div>
              </div>
            </div>

            <div className="bg-neutral-0 rounded-[8px] border shadow-sm flex flex-col" style={{ borderColor: colors.neutral[2] }}>
              <div className="p-[20px] border-b flex justify-between items-center" style={{ borderColor: colors.neutral[2] }}>
                <h3 className="text-[16px] font-bold" style={{ color: colors.neutral[7] }}>Domínios de Repertório</h3>
                <HelpCircle size={14} style={{ color: colors.neutral[4] }} />
              </div>
              <div className="p-[20px] flex flex-col gap-[24px]">
                <span className="text-[14px] font-bold" style={{ color: colors.neutral[7] }}>Matemática</span>

                <div className="flex flex-col gap-[8px]">
                  <div className="flex justify-between items-center"><span className="text-[14px] font-medium" style={{ color: colors.neutral[6] }}>Reconhecer</span><BarChart size={14} className="text-primary-base" /></div>
                  <div className="flex items-center gap-[12px]">
                    <div className="flex-1 h-[8px] bg-[#FEE2E2] rounded-full overflow-hidden"><div className="h-full bg-[#FACC15]" style={{ width: '56%' }}></div></div>
                    <span className="text-[14px] font-bold">56%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <div className="flex justify-between items-center"><span className="text-[14px] font-medium" style={{ color: colors.neutral[6] }}>Aplicar</span><BarChart size={14} className="text-primary-base" /></div>
                  <div className="flex items-center gap-[12px]">
                    <div className="flex-1 h-[8px] bg-[#E5E7EB] rounded-full overflow-hidden"><div className="h-full bg-[#4ADE80]" style={{ width: '83%' }}></div></div>
                    <span className="text-[14px] font-bold">83%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <div className="flex justify-between items-center"><span className="text-[14px] font-medium" style={{ color: colors.neutral[6] }}>Raciocinar</span><BarChart size={14} className="text-primary-base" /></div>
                  <div className="flex items-center gap-[12px]">
                    <div className="flex-1 h-[8px] bg-[#E5E7EB] rounded-full overflow-hidden"><div className="h-full bg-[#4ADE80]" style={{ width: '87%' }}></div></div>
                    <span className="text-[14px] font-bold">87%</span>
                  </div>
                </div>
                <div className="flex flex-col gap-[8px]">
                  <div className="flex justify-between items-center"><span className="text-[14px] font-medium" style={{ color: colors.neutral[6] }}>Interpretar</span><BarChart size={14} className="text-primary-base" /></div>
                  <div className="flex items-center gap-[12px]">
                    <div className="flex-1 h-[8px] bg-[#E5E7EB] rounded-full overflow-hidden"><div className="h-full bg-[#9CA3AF]" style={{ width: '47%' }}></div></div>
                    <span className="text-[14px] font-bold">47%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-neutral-0 rounded-[8px] border shadow-sm mb-[32px]" style={{ borderColor: colors.neutral[2] }}>
            <div className="p-[20px] border-b flex justify-between items-center" style={{ borderColor: colors.neutral[2] }}>
              <h3 className="text-[16px] font-bold" style={{ color: colors.neutral[7] }}>Testes do Aluno</h3>
              <div className="flex items-center gap-[8px]">
                <BarChart2 size={16} className="text-primary-base" />
                <Grid size={16} className="text-[#969DA9]" />
                <HelpCircle size={14} className="ml-[8px]" style={{ color: colors.neutral[4] }} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x" style={{ borderColor: colors.neutral[2] }}>
              <div className="p-[24px]">
                <span className="text-[14px] font-bold mb-[24px] block" style={{ color: colors.neutral[6] }}>Percentual de Acerto</span>
                <div className="h-[250px] flex items-end justify-between px-[16px] relative">
                  <div className="absolute inset-0 flex flex-col justify-between text-[11px] text-[#969DA9] pointer-events-none pb-[24px]">
                    <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
                  </div>
                  <div className="flex items-end justify-between w-full h-full pl-[24px] pb-[24px]">
                    <div className="w-[12%] bg-[#FACC15] rounded-t-[4px] relative group" style={{ height: '42%' }}><span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T4</span></div>
                    <div className="w-[12%] bg-[#4ADE80] rounded-t-[4px] relative" style={{ height: '75%' }}><span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T5</span></div>
                    <div className="w-[12%] bg-[#4ADE80] rounded-t-[4px] relative" style={{ height: '100%' }}><span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T6</span></div>
                    <div className="w-[12%] bg-[#E5E7EB] rounded-t-[4px] relative" style={{ height: '5%' }}><span className="absolute -bottom-[20px] text-[11px] font-bold text-[#969DA9] w-full text-center">T7</span></div>
                    <div className="w-[12%] bg-[#4ADE80] rounded-t-[4px] relative" style={{ height: '92%' }}><span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T8</span></div>
                    <div className="w-[12%] bg-[#4ADE80] rounded-t-[4px] relative" style={{ height: '95%' }}><span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T9</span></div>
                  </div>
                </div>
                <div className="flex justify-between px-[48px] mt-[8px] text-[11px] font-medium" style={{ color: colors.neutral[5] }}>
                  <span>Mar</span><span>Abr</span>
                </div>
              </div>

              <div className="p-[24px]">
                <span className="text-[14px] font-bold mb-[24px] block" style={{ color: colors.neutral[6] }}>Distribuição de Conceito</span>
                <div className="h-[250px] flex items-end justify-between px-[16px] relative">
                  <div className="absolute inset-0 flex flex-col justify-between text-[11px] text-[#969DA9] pointer-events-none pb-[24px]">
                    <span>100</span><span>75</span><span>50</span><span>25</span><span>0</span>
                  </div>
                  <div className="flex items-end justify-between w-full h-full pl-[24px] pb-[24px]">
                    <div className="w-[12%] h-full flex flex-col justify-end relative">
                      <div className="w-full bg-[#4ADE80] rounded-t-[4px]" style={{ height: '17%' }}></div>
                      <div className="w-full bg-[#FACC15]" style={{ height: '56%' }}></div>
                      <div className="w-full bg-[#EF4444]" style={{ height: '11%' }}></div>
                      <div className="w-full bg-[#94CFEF]" style={{ height: '10%' }}></div>
                      <div className="w-full bg-neutral-0 border border-neutral-2" style={{ height: '6%' }}></div>
                      <span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T4</span>
                    </div>
                    <div className="w-[12%] h-full flex flex-col justify-end relative">
                      <div className="w-full bg-[#4ADE80] rounded-t-[4px]" style={{ height: '83%' }}></div>
                      <div className="w-full bg-[#FACC15]" style={{ height: '9%' }}></div>
                      <div className="w-full bg-[#94CFEF]" style={{ height: '4%' }}></div>
                      <div className="w-full bg-neutral-0 border border-neutral-2" style={{ height: '4%' }}></div>
                      <span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T5</span>
                    </div>
                    <div className="w-[12%] h-full flex flex-col justify-end relative">
                      <div className="w-full bg-[#4ADE80] rounded-t-[4px]" style={{ height: '82%' }}></div>
                      <div className="w-full bg-[#FACC15]" style={{ height: '11%' }}></div>
                      <div className="w-full bg-[#EF4444]" style={{ height: '7%' }}></div>
                      <span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T6</span>
                    </div>
                    <div className="w-[12%] bg-[#E5E7EB] rounded-t-[4px] relative" style={{ height: '5%' }}>
                      <span className="absolute -bottom-[20px] text-[11px] font-bold text-[#969DA9] w-full text-center">T7</span>
                    </div>
                    <div className="w-[12%] h-full flex flex-col justify-end relative">
                      <div className="w-full bg-[#4ADE80] rounded-t-[4px]" style={{ height: '85%' }}></div>
                      <div className="w-full bg-[#FACC15]" style={{ height: '7%' }}></div>
                      <div className="w-full bg-[#EF4444]" style={{ height: '5%' }}></div>
                      <div className="w-full bg-[#94CFEF]" style={{ height: '3%' }}></div>
                      <span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T8</span>
                    </div>
                    <div className="w-[12%] h-full flex flex-col justify-end relative">
                      <div className="w-full bg-[#4ADE80] rounded-t-[4px]" style={{ height: '82%' }}></div>
                      <div className="w-full bg-[#FACC15]" style={{ height: '11%' }}></div>
                      <div className="w-full bg-[#EF4444]" style={{ height: '7%' }}></div>
                      <span className="absolute -bottom-[20px] text-[11px] font-bold text-primary-base w-full text-center">T9</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between px-[48px] mt-[8px] text-[11px] font-medium" style={{ color: colors.neutral[5] }}>
                  <span>Mar</span><span>Abr</span>
                </div>
              </div>
            </div>
            <div className="p-[16px] border-t bg-[#FDFDFD] flex justify-end items-center gap-[12px] rounded-b-[8px]" style={{ borderColor: colors.neutral[2] }}>
              <span className="text-[14px] font-medium" style={{ color: colors.neutral[6] }}>Visualizar Distribuição de Conceito (%)</span>
              <div className="w-[40px] h-[24px] bg-[#008BC9] rounded-full relative cursor-pointer"><div className="absolute right-[2px] top-[2px] w-[20px] h-[20px] bg-neutral-0 rounded-full"></div></div>
            </div>
          </div>

        </div>
      )}

      {acompanhamentoTab === 2 && (
        <div className="animate-fade-slide flex flex-col items-center py-[24px]">
          <div className="flex items-center gap-[40px] mb-[24px]">
            <span className="text-[18px] font-bold text-[#969DA9] cursor-pointer hover:text-primary-base">2022</span>
            <span className="text-[18px] font-bold text-[#969DA9] cursor-pointer hover:text-primary-base">2023</span>
            <span className="text-[18px] font-bold text-[#969DA9] cursor-pointer hover:text-primary-base">2024</span>
            <div className="flex flex-col items-center">
              <span className="text-[28px] font-black text-neutral-6">2025</span>
              <div className="w-full h-[3px] bg-[#008BC9] rounded-full mt-[4px]"></div>
            </div>
          </div>

          <div className="flex items-center gap-[16px] md:gap-[24px] mb-[48px] overflow-x-auto hide-scrollbar w-full justify-center">
            <span className="text-[12px] font-bold text-primary-base flex items-center gap-[4px] cursor-pointer border-b border-primary-base pb-[4px]">Jan <ChevronDown size={14} /></span>
            {['Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'].map(m => (
              <span key={m} className="text-[12px] font-bold text-[#969DA9] cursor-pointer hover:text-primary-base pb-[4px] border-b border-transparent">{m}</span>
            ))}
            <span className="text-[12px] font-bold text-[#969DA9] flex items-center gap-[4px] cursor-pointer pb-[4px] border-b border-transparent">Pós <ChevronDown size={14} /></span>
          </div>

          <div className="relative w-full max-w-[1000px] mx-auto pt-[24px]">
            <div className="absolute top-0 bottom-0 left-[24px] md:left-1/2 w-[2px] bg-[#94CFEF] -translate-x-1/2"></div>

            {mockTimeline.map((monthData, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <div key={idx} className={`relative flex w-full mb-[48px] flex-col md:flex-row ${isLeft ? 'md:flex-row-reverse' : ''} items-start`}>
                  <div className="absolute left-[24px] md:left-1/2 w-[14px] h-[14px] rounded-full bg-[#008BC9] border-[3px] border-white -translate-x-1/2 mt-[2px] z-10 shadow-sm"></div>

                  <div className="hidden md:block md:w-1/2"></div>

                  <div className={`w-full pl-[56px] md:pl-0 md:w-1/2 flex flex-col ${isLeft ? 'md:pr-[40px] md:items-end' : 'md:pl-[40px] md:items-start'}`}>
                    <div className="text-[14px] font-bold text-primary-base mb-[16px]">{monthData.month}</div>

                    <div className={`flex flex-col gap-[16px] w-full md:max-w-[360px]`}>
                      {monthData.items.map((item, itemIdx) => (
                        <div key={itemIdx} className="w-full">
                          {item.type === 'text' && (
                            <div className="bg-neutral-0 border rounded-[8px] p-[12px] shadow-sm text-[14px] font-bold text-neutral-6" style={{ borderColor: colors.neutral[2] }}>
                              {item.content}
                            </div>
                          )}
                          {item.type === 'card' && (
                            <div className="bg-neutral-0 border rounded-[8px] p-[20px] shadow-sm w-full" style={{ borderColor: colors.neutral[2] }}>
                              <div className="flex justify-between items-start mb-[16px]">
                                <span className="text-[12px] font-bold text-primary-base px-[10px] py-[2px] rounded-[4px] border border-[#94CFEF] bg-[#D9F0FC]">{item.rank}</span>
                              </div>
                              <h4 className="text-[14px] font-bold text-neutral-6 mb-[24px] leading-tight text-left">{item.title}</h4>

                              <div className="relative w-full h-[6px] rounded-full bg-gradient-to-r from-red-500 via-yellow-400 to-green-500 mb-[8px]">
                                <div className="absolute top-1/2 -translate-y-1/2 w-[4px] h-[16px] bg-[#1D2432] rounded-full shadow-sm" style={{ left: `${item.score}%` }}></div>
                              </div>
                              <div className="flex justify-end text-[11px] font-bold text-neutral-5">{item.rank}</div>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}

            <div className="relative w-full flex justify-start md:justify-center mt-[-16px]">
              <div className="absolute left-[24px] md:left-1/2 w-[10px] h-[10px] rounded-full bg-[#94CFEF] -translate-x-1/2 z-10"></div>
            </div>
          </div>

          <Button variant="primary" className="mt-[40px] uppercase"><ChevronLeft size={16} /> Retornar para o ano anterior</Button>
        </div>
      )}
    </main>
  );
};

export default Acompanhamento;
