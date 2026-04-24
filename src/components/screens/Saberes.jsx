
import React from 'react';
import { 
  ChevronLeft, ChevronRight, ChevronDown, Search, Filter, 
  Edit2, Trash2, AlignLeft, Eye, EyeOff, AlertCircle, BookOpen, GitCompare, RefreshCcw 
} from 'lucide-react';
import Button from '../ui/Button';
import ScrollableTabs from '../ui/ScrollableTabs';
import { mockComponentes, mockDominios, mockConhecimentos, mockHabilidades, mockRelacoes } from '../../data/mockData';

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
  const tabs = ['Componentes Curriculares', 'Domínios Cognitivos', 'Processos Cognitivos', 'Domínios de Repertório', 'Conhecimentos', 'Habilidades', 'Relações entre Habilidades'];

  if (relationsViewMode === 'details' && activeSaberesTab === 6) {
    return (
      <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[32px] animate-fade-slide flex flex-col h-full bg-white">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-[32px] gap-[16px]">
          <h2 className="text-[22px] md:text-[28px] font-bold" style={{ color: colors.neutral[7] }}>H1.S1 Leitura</h2>
          <div className="flex gap-[16px] w-full md:w-auto">
            <Button variant="tertiary" onClick={() => setRelationsViewMode('list')} className="flex-1 md:flex-none">
              <ChevronLeft size={18}/> <span className="hidden sm:inline">Voltar</span>
            </Button>
            <Button variant="outlined" onClick={() => setIsGraphVisible(!isGraphVisible)} className="flex-1 md:flex-none">
              {isGraphVisible ? <EyeOff size={18}/> : <Eye size={18}/>}
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
               <div className="absolute bottom-[20%] right-[30%] w-[12px] h-[12px] rounded-full border-[3px] border-[#3B82F6] bg-white"></div>
               <span className="font-bold text-[#677080]">Gráfico Mockup</span>
            </div>
          )}
        </div>

        <h3 className="text-[16px] md:text-[18px] font-bold mb-[16px]" style={{ color: colors.neutral[7] }}>Filtrar Destino</h3>
        <div className="flex flex-col sm:flex-row gap-[16px] mb-[24px]">
          <input type="text" placeholder="Pesquise por título do destino" className="flex-1 px-[16px] py-[10px] rounded-[8px] border outline-none" style={{ borderColor: colors.neutral[3] }} />
          <select className="flex-1 px-[16px] py-[10px] rounded-[8px] border outline-none bg-white" style={{ borderColor: colors.neutral[3] }}>
            <option>Escolha as relações</option>
          </select>
        </div>

        <div className="bg-white rounded-[12px] border overflow-hidden flex-1 shadow-sm mb-[24px]" style={{ borderColor: colors.neutral[2] }}>
          <div className="w-full">
            <div className="grid grid-cols-[1fr_40px] md:grid-cols-[1fr_1fr_60px] gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[12px] font-bold uppercase tracking-wide bg-[#F7F8FA] text-[#677080]">
              <div>Título do Destino</div>
              <div className="hidden md:block">Conhecimento do Destino</div>
              <div></div>
            </div>
            <div className="grid grid-cols-[1fr_40px] md:grid-cols-[1fr_1fr_60px] gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[13px] md:text-[14px] text-[#1D2432] items-center">
              <div className="font-medium truncate" title="H2.S1 Interpretação">H2.S1 Interpretação</div>
              <div className="hidden md:block truncate" title="Pragmática">Pragmática</div>
              <div className="flex justify-end"><Button variant="tertiary" iconOnly size="sm"><Trash2 size={16}/></Button></div>
            </div>
            <div className="grid grid-cols-[1fr_40px] md:grid-cols-[1fr_1fr_60px] gap-[16px] px-[16px] sm:px-[24px] py-[12px] text-[13px] md:text-[14px] text-[#1D2432] items-center">
              <div className="font-medium truncate" title="H1.S6 Gramática">H1.S6 Gramática</div>
              <div className="hidden md:block truncate" title="Pragmática">Pragmática</div>
              <div className="flex justify-end"><Button variant="tertiary" iconOnly size="sm"><Trash2 size={16}/></Button></div>
            </div>
          </div>
        </div>
        
        <div className="flex justify-between items-center mt-auto pt-[24px] border-t" style={{ borderColor: colors.neutral[2] }}>
          <span className="text-[12px] md:text-[13px]" style={{ color: colors.neutral[5] }}>1 a 2 de 2 registros</span>
          <Button variant="primary" size="default" className="uppercase tracking-wide">Gerenciar Relações</Button>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 w-full max-w-[1440px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[32px] animate-fade-slide flex flex-col h-full bg-white">
      <div className="flex items-center gap-[8px] mb-[16px] md:mb-[24px] overflow-x-auto hide-scrollbar whitespace-nowrap">
        <Button variant="tertiary" iconOnly size="sm" onClick={() => navigateTo('dashboard')}><ChevronLeft size={16}/></Button>
        <span className="text-[13px] md:text-[14px] font-medium cursor-pointer hover:underline shrink-0" onClick={() => navigateTo('dashboard')} style={{ color: colors.primary.base }}>Início</span>
        <span className="text-[13px] md:text-[14px] font-medium shrink-0" style={{ color: colors.neutral[4] }}>/ Gerenciamento de Matrizes de Saberes</span>
      </div>

      <h2 className="text-[22px] md:text-[28px] font-bold mb-[24px] md:mb-[32px]" style={{ color: colors.neutral[7] }}>Gerenciamento da Matriz de Saberes</h2>

      <div className="sticky top-[58px] md:top-[74px] z-40 bg-white pt-[8px] md:pt-[16px] pb-[8px] -mx-[16px] md:-mx-[32px] px-[16px] md:px-[32px] mb-[16px] md:mb-[24px]">
        <ScrollableTabs tabs={tabs} activeTab={activeSaberesTab} onTabClick={setActiveSaberesTab} colors={colors} />
        {showAlert && (
          <div className="flex justify-between items-start md:items-center px-[16px] md:px-[24px] py-[12px] md:py-[16px] rounded-[8px] mt-[16px] animate-fade-slide" style={{ backgroundColor: '#FEE2E2', border: '1px solid #FCA5A5' }}>
            <div className="flex items-start md:items-center gap-[12px] text-[#DC2626] font-medium text-[13px] md:text-[14px]">
              <AlertCircle size={20} className="shrink-0 mt-[2px] md:mt-0" />
              <span>Não é possível excluir o item de código <strong>"REC"</strong>, pois existem vínculos a ele.</span>
            </div>
            <X size={20} className="cursor-pointer text-[#DC2626] hover:opacity-70 shrink-0 ml-[8px]" onClick={() => setShowAlert(false)} />
          </div>
        )}
      </div>

      <div className="flex flex-col mb-[16px] md:mb-[24px] gap-[12px]">
        {activeSaberesTab !== 6 && (
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-[12px]">
            <div className="flex items-center gap-[8px] md:gap-[16px] w-full">
               <input type="text" placeholder="Pesquise pelo código ou título" className="flex-1 px-[16px] py-[10px] md:py-[12px] rounded-[8px] border text-[13px] md:text-[14px] outline-none transition-colors focus:border-[#008BC9]" style={{ borderColor: colors.neutral[3] }} />
               <Button variant="primary" iconOnly size="default"><Search size={20} /></Button>
            </div>
            {activeSaberesTab > 0 && (
              <div className="flex gap-[8px] overflow-x-auto hide-scrollbar w-full md:w-auto justify-start md:justify-end">
                <div className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[8px] border cursor-pointer bg-white text-[12px] font-semibold hover:bg-gray-50 whitespace-nowrap shrink-0" style={{ borderColor: colors.neutral[3], color: colors.neutral[6] }}><Filter size={14} /> Comp. Curricular <ChevronDown size={14} /></div>
                {(activeSaberesTab === 4 || activeSaberesTab === 5) && <div className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[8px] border cursor-pointer bg-white text-[12px] font-semibold hover:bg-gray-50 whitespace-nowrap shrink-0" style={{ borderColor: colors.neutral[3], color: colors.neutral[6] }}><Filter size={14} /> Dom. Repertório <ChevronDown size={14} /></div>}
                {activeSaberesTab === 5 && (
                  <>
                    <div className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[8px] border cursor-pointer bg-white text-[12px] font-semibold hover:bg-gray-50 whitespace-nowrap shrink-0" style={{ borderColor: colors.neutral[3], color: colors.neutral[6] }}><Filter size={14} /> Dom. Cognitivo <ChevronDown size={14} /></div>
                    <div className="flex items-center gap-[8px] px-[12px] py-[6px] rounded-[8px] border cursor-pointer bg-white text-[12px] font-semibold hover:bg-gray-50 whitespace-nowrap shrink-0" style={{ borderColor: colors.neutral[3], color: colors.neutral[6] }}><Filter size={14} /> Conhecimento <ChevronDown size={14} /></div>
                  </>
                )}
              </div>
            )}
          </div>
        )}
        {activeSaberesTab === 6 && (
          <div className="flex gap-[16px] w-full flex-col md:flex-row">
            <div className="flex-1 flex flex-col gap-[8px]">
              <label className="text-[12px] font-bold" style={{ color: colors.neutral[7] }}>Filtrar por Habilidade Origem</label>
              <select className="w-full px-[16px] py-[10px] rounded-[8px] border text-[13px] outline-none bg-white"><option>Selecione</option></select>
            </div>
            <div className="flex-1 flex flex-col gap-[8px]">
              <label className="text-[12px] font-bold" style={{ color: colors.neutral[7] }}>Filtrar por Habilidade Destino</label>
              <select className="w-full px-[16px] py-[10px] rounded-[8px] border text-[13px] outline-none bg-white"><option>Selecione</option></select>
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-[12px] border flex-1 shadow-sm mb-[24px] md:mb-[32px] overflow-hidden" style={{ borderColor: colors.neutral[2] }}>
        {activeSaberesTab === 0 && (
          <div className="w-full">
            <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[11px] md:text-[12px] font-bold uppercase tracking-wide bg-[#F7F8FA] text-[#677080]">
              <div className="w-[24px] shrink-0"></div><div className="w-[80px] shrink-0">Código</div><div className="flex-1 min-w-0">Título</div><div className="w-[40px] md:w-[80px] shrink-0"></div>
            </div>
            {mockComponentes.map((m) => (
              <React.Fragment key={m.cod}>
                <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[13px] md:text-[14px] text-[#1D2432]">
                  <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
                    <ChevronDown size={18} className={`transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
                  </div>
                  <div className="w-[80px] shrink-0 font-medium text-[#677080] truncate" title={m.cod}>{m.cod}</div>
                  <div className="flex-1 min-w-0 font-bold truncate" title={m.title}>{m.title}</div>
                  <div className="w-[40px] md:w-[80px] shrink-0 flex justify-end gap-[4px] md:gap-[8px]">
                    <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14}/></Button>
                  </div>
                </div>
                {expandedItem === m.cod && (
                  <div className="px-[48px] sm:px-[64px] py-[16px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
                    <h4 className="font-bold text-[14px] text-[#1D2432] mb-[8px]">{m.title}</h4>
                    <p className="text-[13px] text-[#677080]">Código Identificador: {m.cod}</p>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {(activeSaberesTab >= 1 && activeSaberesTab <= 3) && (
          <div className="w-full">
            <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[11px] md:text-[12px] font-bold uppercase tracking-wide bg-[#F7F8FA] text-[#677080]">
              <div className="w-[24px] shrink-0"></div><div className="w-[60px] sm:w-[80px] shrink-0">Código</div><div className="flex-1 min-w-0">Título</div><div className="flex-1 min-w-0 hidden md:block">Comp. Curricular</div><div className="w-[120px] shrink-0"></div>
            </div>
            {mockDominios.map((m) => (
              <React.Fragment key={m.cod}>
                <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[13px] md:text-[14px] text-[#1D2432]">
                  <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
                    <ChevronDown size={18} className={`transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
                  </div>
                  <div className="w-[60px] sm:w-[80px] shrink-0 font-medium text-[#677080] truncate" title={m.cod}>{m.cod}</div>
                  <div className="flex-1 min-w-0 font-bold truncate" title={m.title}>{m.title}</div>
                  <div className="flex-1 min-w-0 hidden md:block truncate" title={m.comp}>{m.comp}</div>
                  <div className="w-[120px] shrink-0 flex justify-end gap-[4px] md:gap-[8px]">
                    <Button variant="tertiary" iconOnly size="sm"><AlignLeft size={14}/></Button>
                    <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14}/></Button>
                    <Button variant="tertiary" iconOnly size="sm" onClick={() => handleExcluirItem(m.cod)}><Trash2 size={14}/></Button>
                  </div>
                </div>
                {expandedItem === m.cod && (
                  <div className="px-[48px] sm:px-[64px] py-[16px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
                    <h4 className="font-bold text-[14px] text-[#1D2432] mb-[12px]">{m.title}</h4>
                    <div className="md:hidden flex flex-col gap-[8px] text-[13px] text-[#677080]">
                      <div><strong>Comp. Curricular:</strong> {m.comp}</div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {activeSaberesTab === 4 && (
          <div className="w-full">
            <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[11px] md:text-[12px] font-bold uppercase tracking-wide bg-[#F7F8FA] text-[#677080]">
              <div className="w-[24px] shrink-0"></div><div className="w-[80px] shrink-0 hidden sm:block">Código</div><div className="flex-1 min-w-0">Título</div><div className="flex-1 min-w-0 hidden lg:block">Dom. Repertório</div><div className="flex-1 min-w-0 hidden md:block">Comp. Curricular</div><div className="w-[120px] shrink-0"></div>
            </div>
            {mockConhecimentos.map((m) => (
              <React.Fragment key={m.cod}>
                <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[13px] md:text-[14px] text-[#1D2432]">
                  <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
                    <ChevronDown size={18} className={`transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
                  </div>
                  <div className="w-[80px] shrink-0 font-medium text-[#677080] truncate hidden sm:block" title={m.cod}>{m.cod}</div>
                  <div className="flex-1 min-w-0 font-bold truncate" title={m.title}>{m.title}</div>
                  <div className="flex-1 min-w-0 hidden lg:block truncate" title={m.dom}>{m.dom}</div>
                  <div className="flex-1 min-w-0 hidden md:block truncate" title={m.comp}>{m.comp}</div>
                  <div className="w-[120px] shrink-0 flex justify-end gap-[4px] md:gap-[8px]">
                    <Button variant="tertiary" iconOnly size="sm"><AlignLeft size={14}/></Button>
                    <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14}/></Button>
                    <Button variant="tertiary" iconOnly size="sm"><Trash2 size={14}/></Button>
                  </div>
                </div>
                {expandedItem === m.cod && (
                  <div className="px-[48px] sm:px-[64px] py-[16px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
                    <h4 className="font-bold text-[14px] text-[#1D2432] mb-[8px]">{m.title}</h4>
                    <p className="text-[13px] text-[#677080] mb-[12px]"><strong>Código:</strong> {m.cod}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-[12px] text-[13px] text-[#677080]">
                      <div className="lg:hidden"><strong>Domínio de Repertório:</strong><br/>{m.dom}</div>
                      <div className="md:hidden"><strong>Componente Curricular:</strong><br/>{m.comp}</div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {activeSaberesTab === 5 && (
          <div className="w-full">
            <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[11px] md:text-[12px] font-bold uppercase tracking-wide bg-[#F7F8FA] text-[#677080]">
              <div className="w-[24px] shrink-0"></div><div className="w-[80px] shrink-0 hidden sm:block">Código</div><div className="flex-[2] min-w-0">Título</div><div className="flex-1 min-w-0 hidden lg:block">Conhecimento</div><div className="flex-1 min-w-0 hidden xl:block">Dom. Cog</div><div className="w-[80px] shrink-0"></div>
            </div>
            {mockHabilidades.map((m) => (
              <React.Fragment key={m.cod}>
                <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[13px] md:text-[14px] text-[#1D2432]">
                  <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
                    <ChevronDown size={18} className={`transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
                  </div>
                  <div className="w-[80px] shrink-0 font-bold truncate hidden sm:block" title={m.cod}>{m.cod}</div>
                  <div className="flex-[2] min-w-0 font-bold truncate" title={m.title}>{m.title}</div>
                  <div className="flex-1 min-w-0 hidden lg:block truncate" title={m.conh}>{m.conh}</div>
                  <div className="flex-1 min-w-0 hidden xl:block truncate" title={m.domC}>{m.domC}</div>
                  <div className="w-[80px] shrink-0 flex justify-end gap-[4px] md:gap-[8px]">
                    <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14}/></Button>
                    <Button variant="tertiary" iconOnly size="sm"><Trash2 size={14}/></Button>
                  </div>
                </div>
                {expandedItem === m.cod && (
                  <div className="px-[48px] sm:px-[64px] py-[24px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
                    <h4 className="font-bold text-[14px] mb-[16px]" style={{ color: colors.neutral[7] }}>{m.title}</h4>
                    
                    <div className="xl:hidden grid grid-cols-2 md:grid-cols-4 gap-[16px] mb-[24px] text-[13px] text-[#677080]">
                       <div className="sm:hidden"><strong>Código:</strong><br/>{m.cod}</div>
                       <div className="lg:hidden"><strong>Conhecimento:</strong><br/>{m.conh}</div>
                       <div><strong>Domínio Cognitivo:</strong><br/>{m.domC}</div>
                       <div><strong>Domínio Repertório:</strong><br/>{m.domR}</div>
                       <div><strong>Comp. Curricular:</strong><br/>{m.comp}</div>
                    </div>

                    <div className="flex flex-col gap-[12px] bg-white p-[16px] rounded-[8px] border mb-[16px]" style={{ borderColor: colors.neutral[2] }}>
                      <div className="flex items-center gap-[8px] text-[13px]"><BookOpen size={16} className="text-[#008BC9] shrink-0"/> <strong className="shrink-0">Ano(s) Escolar(es):</strong> <span className="truncate">3º Ano, 4º Ano</span></div>
                      <div className="flex items-center gap-[8px] text-[13px]"><GitCompare size={16} className="text-[#10B981] shrink-0"/> <strong className="shrink-0">Equivalência(s):</strong> <span className="truncate">BNCC (EF03MA01), SAEB (D01)</span></div>
                      <div className="flex items-center gap-[8px] text-[13px] flex-wrap"><RefreshCcw size={16} className="text-[#8B5CF6] shrink-0"/> <strong className="shrink-0">Relação(ções):</strong> <span className="bg-[#EDE9FE] text-[#8B5CF6] px-[8px] py-[2px] rounded-[4px] font-semibold text-[11px]">EF04MA02</span> <span className="bg-[#EDE9FE] text-[#8B5CF6] px-[8px] py-[2px] rounded-[4px] font-semibold text-[11px]">EF05MA01</span></div>
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {activeSaberesTab === 6 && (
          <div className="w-full">
            <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[11px] md:text-[12px] font-bold uppercase tracking-wide bg-[#F7F8FA] text-[#677080]">
              <div className="w-[24px] shrink-0"></div><div className="w-[100px] sm:w-[140px] shrink-0">Hab. Origem</div><div className="flex-1 min-w-0 hidden sm:block">Relações</div><div className="w-[80px] shrink-0"></div>
            </div>
            {mockRelacoes.map((m) => (
              <React.Fragment key={m.origem}>
                <div className="flex items-center gap-[8px] sm:gap-[16px] px-[16px] sm:px-[24px] py-[12px] border-b text-[13px] md:text-[14px] text-[#1D2432]">
                  <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.origem ? null : m.origem)}>
                    <ChevronDown size={18} className={`transition-transform ${expandedItem === m.origem ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
                  </div>
                  <div className="w-[100px] sm:w-[140px] shrink-0 font-bold truncate" title={m.origem}>{m.origem}</div>
                  <div className="flex-1 min-w-0 hidden sm:flex gap-[8px] overflow-hidden">
                    {m.rel.map(r => <span key={r} className="bg-[#D9F0FC] text-[#008BC9] px-[8px] py-[2px] rounded-[4px] font-semibold text-[11px] shrink-0">{r}</span>)}
                  </div>
                  <div className="w-[80px] shrink-0 flex justify-end gap-[4px] md:gap-[8px]">
                    <Button variant="tertiary" iconOnly size="sm" className="hidden md:flex"><Edit2 size={14}/></Button>
                    <Button variant="secondary" iconOnly size="sm" onClick={() => setRelationsViewMode('details')}><Eye size={14}/></Button>
                  </div>
                </div>
                {expandedItem === m.origem && (
                  <div className="px-[48px] sm:px-[64px] py-[16px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
                    <h4 className="font-bold text-[13px] mb-[12px]" style={{ color: colors.neutral[5] }}>Habilidades relacionadas à Habilidade de Origem</h4>
                    <div className="flex flex-wrap gap-[8px] mb-[16px]">
                      {m.rel.map(r => <span key={r} className="border px-[12px] py-[4px] rounded-[4px] font-semibold text-[12px] shadow-sm bg-white">{r}</span>)}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row justify-between items-center mt-auto pt-[16px] md:pt-[24px] border-t gap-[16px] md:gap-0" style={{ borderColor: colors.neutral[2] }}>
        <div className="flex flex-col sm:flex-row items-center gap-[8px] sm:gap-[16px] w-full md:w-auto order-2 md:order-1">
          <span className="text-[12px] md:text-[13px]" style={{ color: colors.neutral[5] }}>1 a 10 de 231 registros</span>
          <div className="flex items-center gap-[8px]">
            <Button variant="tertiary" iconOnly size="sm"><ChevronLeft size={16} /></Button>
            <span className="text-[12px] md:text-[13px] font-medium">Página <input type="text" defaultValue="1" className="w-[32px] md:w-[40px] text-center border rounded-[4px] mx-[4px] py-[2px] md:py-[4px]" style={{ borderColor: colors.neutral[3] }} /> de 88</span>
            <Button variant="tertiary" iconOnly size="sm"><ChevronRight size={16} /></Button>
          </div>
        </div>
        <Button variant="primary" size="default" className="w-full md:w-auto uppercase tracking-wide order-1 md:order-2">
          Adicionar {tabs[activeSaberesTab].split(' ')[0]}
        </Button>
      </div>
    </main>
  );
};

export default Saberes;
