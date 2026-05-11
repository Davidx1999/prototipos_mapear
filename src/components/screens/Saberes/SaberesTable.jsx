import React from 'react';
import {
  ChevronDown, Edit2, Trash2, AlignLeft, Eye, BookOpen, GitCompare, RefreshCcw
} from 'lucide-react';
import Button from '../../ui/Button';
import {
  mockComponentes, mockDominios, mockConhecimentos, mockHabilidades, mockRelacoes
} from '../../../data/mockData';
import Tooltip from '../../ui/Tooltip';
import InteractiveChip from '../../ui/InteractiveChip';
import Chips from '../../ui/Chips';

const SaberesTable = ({
  activeSaberesTab,
  colors,
  expandedItem,
  setExpandedItem,
  handleExcluirItem,
  setRelationsViewMode,
  searchValue = '',
  activeFilters = {},
  currentPage = 1
}) => {
  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  const getHabilidadeTitle = (code) => {
    return mockHabilidades.find(h => h.cod === code)?.title || "Habilidade não encontrada";
  };

  const filterItem = (item) => {
    const term = searchValue.toLowerCase();
    const matchesSearch = !searchValue ||
      (item.cod && item.cod.toLowerCase().includes(term)) ||
      (item.title && item.title.toLowerCase().includes(term)) ||
      (item.origem && item.origem.toLowerCase().includes(term));

    if (!matchesSearch) return false;

    // Filter by category
    if (activeFilters.comp && item.comp !== activeFilters.comp) return false;
    if (activeFilters.repertorio && (item.dom !== activeFilters.repertorio && item.domR !== activeFilters.repertorio)) return false;
    if (activeFilters.cognitivo && item.domC !== activeFilters.cognitivo) return false;
    if (activeFilters.conhecimento && (item.conh !== activeFilters.conhecimento && item.title !== activeFilters.conhecimento)) return false;

    return true;
  };

  const filteredComponentes = mockComponentes.filter(filterItem).slice(startIndex, endIndex);
  const filteredDominios = mockDominios.filter(filterItem).slice(startIndex, endIndex);
  const filteredConhecimentos = mockConhecimentos.filter(filterItem).slice(startIndex, endIndex);
  const filteredHabilidades = mockHabilidades.filter(filterItem).slice(startIndex, endIndex);
  const filteredRelacoes = mockRelacoes.filter(filterItem).slice(startIndex, endIndex);


  const renderComponentes = () => (
    <div className="w-full">
      <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[12px] font-bold uppercase tracking-wide bg-neutral-1 text-neutral-5">
        <div className="w-[24px] shrink-0"></div><div className="w-[80px] shrink-0">Código</div><div className="flex-1 min-w-0">Título</div><div className="w-[80px] shrink-0"></div>
      </div>
      {filteredComponentes.map((m) => (
        <React.Fragment key={m.cod}>
          {/* Desktop Row */}
          <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[14px] text-neutral-6">
            <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
              <ChevronDown size={18} className={`transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
            </div>
            <div className="w-[80px] shrink-0 font-medium text-neutral-5 truncate" title={m.cod}>{m.cod}</div>
            <div className="flex-1 min-w-0 font-bold truncate" title={m.title}>{m.title}</div>
            <div className="w-[80px] shrink-0 flex justify-end gap-[8px]">
              <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14} /></Button>
            </div>
          </div>

          {/* Mobile Card */}
          <div className="md:hidden flex flex-col border-b p-[16px] gap-[12px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div className="flex items-start gap-[12px] flex-1 min-w-0" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
                <div className={`mt-[2px] shrink-0 transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`}>
                  <ChevronDown size={18} className="text-primary-base" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-neutral-4 uppercase tracking-wider">{m.cod}</span>
                  <h4 className="text-[15px] font-bold text-neutral-7 leading-tight">{m.title}</h4>
                </div>
              </div>
              <div className="flex gap-[8px]">
                <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14} /></Button>
              </div>
            </div>
          </div>

          {expandedItem === m.cod && (
            <div className="px-[24px] md:px-[64px] py-[16px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
              <h4 className="md:hidden font-bold text-[14px] text-neutral-6 mb-[8px]">{m.title}</h4>
              <p className="text-[14px] text-neutral-5">Código Identificador: {m.cod}</p>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderDominios = () => (
    <div className="w-full">
      <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[12px] font-bold uppercase tracking-wide bg-neutral-1 text-neutral-5">
        <div className="w-[24px] shrink-0"></div><div className="w-[80px] shrink-0">Código</div><div className="flex-1 min-w-0">Título</div><div className="flex-1 min-w-0">Comp. Curricular</div><div className="w-[120px] shrink-0"></div>
      </div>
      {filteredDominios.map((m) => (
        <React.Fragment key={m.cod}>
          {/* Desktop Row */}
          <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[14px] text-neutral-6">
            <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
              <ChevronDown size={18} className={`transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
            </div>
            <div className="w-[80px] shrink-0 font-medium text-neutral-5 truncate" title={m.cod}>{m.cod}</div>
            <div className="flex-1 min-w-0 font-bold truncate" title={m.title}>{m.title}</div>
            <div className="flex-1 min-w-0 truncate" title={m.comp}>{m.comp}</div>
            <div className="w-[120px] shrink-0 flex justify-end gap-[8px]">
              <Button variant="tertiary" iconOnly size="sm"><AlignLeft size={14} /></Button>
              <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14} /></Button>
              <Button variant="tertiary" iconOnly size="sm" onClick={() => handleExcluirItem(m.cod)}><Trash2 size={14} /></Button>
            </div>
          </div>

          {/* Mobile Card */}
          <div className="md:hidden flex flex-col border-b p-[16px] gap-[12px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div className="flex items-start gap-[12px] flex-1 min-w-0" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
                <div className={`mt-[2px] shrink-0 transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`}>
                  <ChevronDown size={18} className="text-primary-base" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-neutral-4 uppercase tracking-wider">{m.cod}</span>
                  <h4 className="text-[15px] font-bold text-neutral-7 leading-tight">{m.title}</h4>
                  <span className="text-[12px] text-neutral-5 mt-[2px] truncate">{m.comp}</span>
                </div>
              </div>
              <div className="flex gap-[4px]">
                <Button variant="tertiary" iconOnly size="xs"><AlignLeft size={14} /></Button>
                <Button variant="tertiary" iconOnly size="xs" onClick={() => handleExcluirItem(m.cod)}><Trash2 size={14} /></Button>
              </div>
            </div>
          </div>

          {expandedItem === m.cod && (
            <div className="px-[24px] md:px-[64px] py-[16px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
              <h4 className="md:hidden font-bold text-[14px] text-neutral-6 mb-[12px]">{m.title}</h4>
              <div className="flex flex-col gap-[8px] text-[14px] text-neutral-5">
                <div><strong>Componente Curricular:</strong> {m.comp}</div>
                <div><strong>Código:</strong> {m.cod}</div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderConhecimentos = () => (
    <div className="w-full">
      <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[12px] font-bold uppercase tracking-wide bg-neutral-1 text-neutral-5">
        <div className="w-[24px] shrink-0"></div><div className="w-[80px] shrink-0">Código</div><div className="flex-1 min-w-0">Título</div><div className="flex-1 min-w-0">Dom. Repertório</div><div className="flex-1 min-w-0">Comp. Curricular</div><div className="w-[120px] shrink-0"></div>
      </div>
      {filteredConhecimentos.map((m) => (
        <React.Fragment key={m.cod}>
          {/* Desktop Row */}
          <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[14px] text-neutral-6">
            <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
              <ChevronDown size={18} className={`transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
            </div>
            <div className="w-[80px] shrink-0 font-medium text-neutral-5 truncate" title={m.cod}>{m.cod}</div>
            <div className="flex-1 min-w-0 font-bold truncate" title={m.title}>{m.title}</div>
            <div className="flex-1 min-w-0 truncate" title={m.dom}>{m.dom}</div>
            <div className="flex-1 min-w-0 truncate" title={m.comp}>{m.comp}</div>
            <div className="w-[120px] shrink-0 flex justify-end gap-[8px]">
              <Button variant="tertiary" iconOnly size="sm"><AlignLeft size={14} /></Button>
              <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14} /></Button>
              <Button variant="tertiary" iconOnly size="sm"><Trash2 size={14} /></Button>
            </div>
          </div>

          {/* Mobile Card */}
          <div className="md:hidden flex flex-col border-b p-[16px] gap-[12px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div className="flex items-start gap-[12px] flex-1 min-w-0" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
                <div className={`mt-[2px] shrink-0 transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`}>
                  <ChevronDown size={18} className="text-primary-base" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-neutral-4 uppercase tracking-wider">{m.cod}</span>
                  <h4 className="text-[15px] font-bold text-neutral-7 leading-tight">{m.title}</h4>
                  <span className="text-[12px] text-neutral-5 mt-[2px] truncate">{m.dom}</span>
                </div>
              </div>
              <div className="flex gap-[4px]">
                <Button variant="tertiary" iconOnly size="xs"><AlignLeft size={14} /></Button>
                <Button variant="tertiary" iconOnly size="xs"><Trash2 size={14} /></Button>
              </div>
            </div>
          </div>

          {expandedItem === m.cod && (
            <div className="px-[24px] md:px-[64px] py-[16px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
              <h4 className="md:hidden font-bold text-[14px] text-neutral-6 mb-[8px]">{m.title}</h4>
              <p className="text-[14px] text-neutral-5 mb-[12px]"><strong>Código:</strong> {m.cod}</p>
              <div className="grid grid-cols-1 gap-[8px] text-[14px] text-neutral-5">
                <div><strong>Domínio de Repertório:</strong> {m.dom}</div>
                <div><strong>Componente Curricular:</strong> {m.comp}</div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderHabilidades = () => (
    <div className="w-full">
      <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[12px] font-bold uppercase tracking-wide bg-neutral-1 text-neutral-5">
        <div className="w-[24px] shrink-0"></div><div className="w-[80px] shrink-0">Código</div><div className="flex-[2] min-w-0">Título</div><div className="flex-1 min-w-0">Conhecimento</div><div className="flex-1 min-w-0">Dom. Cog</div><div className="w-[80px] shrink-0"></div>
      </div>
      {filteredHabilidades.map((m) => (
        <React.Fragment key={m.cod}>
          {/* Desktop Row */}
          <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[14px] text-neutral-6">
            <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
              <ChevronDown size={18} className={`transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
            </div>
            <div className="w-[80px] shrink-0 font-bold truncate" title={m.cod}>{m.cod}</div>
            <div className="flex-[2] min-w-0 font-bold truncate" title={m.title}>{m.title}</div>
            <div className="flex-1 min-w-0 truncate" title={m.conh}>{m.conh}</div>
            <div className="flex-1 min-w-0 truncate" title={m.domC}>{m.domC}</div>
            <div className="w-[80px] shrink-0 flex justify-end gap-[8px]">
              <Button variant="tertiary" iconOnly size="sm"><Edit2 size={14} /></Button>
              <Button variant="tertiary" iconOnly size="sm"><Trash2 size={14} /></Button>
            </div>
          </div>

          {/* Mobile Card */}
          <div className="md:hidden flex flex-col border-b p-[16px] gap-[12px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div className="flex items-start gap-[12px] flex-1 min-w-0" onClick={() => setExpandedItem(expandedItem === m.cod ? null : m.cod)}>
                <div className={`mt-[2px] shrink-0 transition-transform ${expandedItem === m.cod ? 'rotate-180' : ''}`}>
                  <ChevronDown size={18} className="text-primary-base" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-neutral-4 uppercase tracking-wider">{m.cod}</span>
                  <h4 className="text-[15px] font-bold text-neutral-7 leading-tight">{m.title}</h4>
                  <span className="text-[12px] text-neutral-5 mt-[2px] truncate">{m.conh}</span>
                </div>
              </div>
              <div className="flex gap-[4px]">
                <Button variant="tertiary" iconOnly size="xs"><Edit2 size={14} /></Button>
                <Button variant="tertiary" iconOnly size="xs"><Trash2 size={14} /></Button>
              </div>
            </div>
          </div>

          {expandedItem === m.cod && (
            <div className="px-[24px] md:px-[64px] py-[24px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
              <h4 className="md:hidden font-bold text-[14px] mb-[16px]" style={{ color: colors.neutral[7] }}>{m.title}</h4>

              <div className="grid grid-cols-2 gap-[16px] mb-[24px] text-[14px] text-neutral-5">
                <div><strong>Código:</strong><br />{m.cod}</div>
                <div><strong>Conhecimento:</strong><br />{m.conh}</div>
                <div><strong>Domínio Cognitivo:</strong><br />{m.domC}</div>
                <div><strong>Domínio Repertório:</strong><br />{m.domR}</div>
                <div><strong>Comp. Curricular:</strong><br />{m.comp}</div>
              </div>

              <div className="flex flex-col gap-[12px] bg-neutral-0 p-[16px] rounded-[8px] border mb-[16px]" style={{ borderColor: colors.neutral[2] }}>
                <div className="flex items-center gap-[8px] text-[14px]"><BookOpen size={16} className="text-primary-base shrink-0" /> <strong className="shrink-0">Ano(s) Escolar(es):</strong> <span className="truncate">6º Ano, 7º Ano, 8º Ano</span></div>
                <div className="flex items-center gap-[8px] text-[14px]"><GitCompare size={16} className="text-[#10B981] shrink-0" /> <strong className="shrink-0">Equivalência(s):</strong> <span className="truncate">BNCC ({m.cod}), SAEB (P0{Math.floor(Math.random() * 9) + 1})</span></div>
                <div className="flex items-center gap-[8px] text-[14px] flex-wrap">
                  <RefreshCcw size={16} className="text-[#8B5CF6] shrink-0" />
                  <strong className="shrink-0">Relação(ções):</strong>
                  <div className="flex flex-wrap gap-[6px]">
                    {mockRelacoes.find(r => r.origem === m.cod)?.rel.map(relCod => (
                      <Tooltip key={relCod} content={getHabilidadeTitle(relCod)}>
                        <Chips
                          label={relCod}
                          status="neutral"
                          variant="stroked"
                          iconLeft={<RefreshCcw />}
                          className="cursor-pointer"
                        />
                      </Tooltip>
                    )) || <span className="text-neutral-4 italic">Nenhuma relação direta</span>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  const renderRelacoes = () => (
    <div className="w-full">
      <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[12px] font-bold uppercase tracking-wide bg-neutral-1 text-neutral-5">
        <div className="w-[24px] shrink-0"></div><div className="w-[140px] shrink-0">Hab. Origem</div><div className="flex-1 min-w-0">Relações</div><div className="w-[80px] shrink-0"></div>
      </div>
      {filteredRelacoes.map((m) => (
        <React.Fragment key={m.origem}>
          {/* Desktop Row */}
          <div className="hidden md:flex items-center gap-[16px] px-[24px] py-[12px] border-b text-[14px] text-neutral-6">
            <div className="w-[24px] shrink-0 flex justify-center cursor-pointer" onClick={() => setExpandedItem(expandedItem === m.origem ? null : m.origem)}>
              <ChevronDown size={18} className={`transition-transform ${expandedItem === m.origem ? 'rotate-180' : ''}`} style={{ color: colors.primary.base }} />
            </div>
            <div className="w-[140px] shrink-0 font-bold truncate" title={m.origem}>{m.origem}</div>
            <div className="flex-1 min-w-0 flex gap-[8px] overflow-hidden">
              {m.rel.map(r => (
                <Tooltip key={r} content={getHabilidadeTitle(r)}>
                  <Chips
                    label={r}
                    status="neutral"
                    variant="stroked"
                    className="cursor-pointer"
                  />
                </Tooltip>
              ))}
            </div>
            <div className="w-[80px] shrink-0 flex justify-end gap-[8px]">
              <Button variant="secondary" iconOnly size="sm" onClick={() => setRelationsViewMode('details')}><Eye size={14} /></Button>
            </div>
          </div>

          {/* Mobile Card */}
          <div className="md:hidden flex flex-col border-b p-[16px] gap-[12px]">
            <div className="flex items-start justify-between gap-[12px]">
              <div className="flex items-start gap-[12px] flex-1 min-w-0" onClick={() => setExpandedItem(expandedItem === m.origem ? null : m.origem)}>
                <div className={`mt-[2px] shrink-0 transition-transform ${expandedItem === m.origem ? 'rotate-180' : ''}`}>
                  <ChevronDown size={18} className="text-primary-base" />
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <span className="text-[11px] font-bold text-neutral-4 uppercase tracking-wider">Origem</span>
                  <h4 className="text-[15px] font-bold text-neutral-7 leading-tight">{m.origem}</h4>
                  <div className="flex gap-[4px] mt-[6px] overflow-x-auto hide-scrollbar">
                    {m.rel.slice(0, 3).map(r => (
                      <Tooltip key={r} content={getHabilidadeTitle(r)}>
                        <Chips
                          label={r}
                          status="neutral"
                          variant="stroked"
                          size="xs"
                          className="scale-[0.85] origin-left cursor-pointer"
                        />
                      </Tooltip>
                    ))}
                    {m.rel.length > 3 && <span className="text-[10px] text-neutral-4 font-bold self-center">+{m.rel.length - 3}</span>}
                  </div>
                </div>
              </div>
              <div className="flex gap-[4px]">
                <Button variant="secondary" iconOnly size="xs" onClick={() => setRelationsViewMode('details')}><Eye size={14} /></Button>
              </div>
            </div>
          </div>

          {expandedItem === m.origem && (
            <div className="px-[24px] md:px-[64px] py-[16px] border-b bg-[#FDFDFD]" style={{ borderColor: colors.neutral[2] }}>
              <h4 className="font-bold text-[14px] mb-[12px]" style={{ color: colors.neutral[5] }}>Habilidades relacionadas à Habilidade de Origem</h4>
              <div className="flex flex-wrap gap-[8px] mb-[16px]">
                {m.rel.map(r => (
                  <Tooltip key={r} content={getHabilidadeTitle(r)}>
                    <Chips
                      label={r}
                      status="neutral"
                      variant="stroked"
                      iconLeft={<GitCompare />}
                      className="cursor-pointer px-[12px] py-[6px] text-[12px]"
                    />
                  </Tooltip>
                ))}
              </div>
            </div>
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="bg-neutral-0 rounded-[8px] border flex-1 shadow-sm mb-[24px] md:mb-[32px] overflow-hidden" style={{ borderColor: colors.neutral[2] }}>
      {activeSaberesTab === 0 && renderComponentes()}
      {(activeSaberesTab >= 1 && activeSaberesTab <= 3) && renderDominios()}
      {activeSaberesTab === 4 && renderConhecimentos()}
      {activeSaberesTab === 5 && renderHabilidades()}
      {activeSaberesTab === 6 && renderRelacoes()}
    </div>
  );
};

export default SaberesTable;
