import React, { useState } from 'react';
import { 
  Search, 
  SlidersHorizontal,
  ChevronDown, 
  ChevronUp,
  ChevronRight,
  ArrowUp,
  Bot,
  PencilRuler
} from 'lucide-react';
import Breadcrumb from '../ui/Breadcrumb';
import Button from '../ui/Button';
import Input from '../ui/Input';

const mockAvaliacoes = [
  {
    id: 'A0043A',
    titulo: 'Avaliação Matemática 6º e 7º Ano - 04',
    descricao: 'Avaliação bimestral regular para turmas do 6º e 7º ano.',
    natureza: 'Formativa',
    inicio: '13 Set, 2028',
    fim: '15 Set, 2028',
    testes: 1,
    tipo: 'IA',
    status: 'Em Andamento',
    isExpanded: true
  },
  {
    id: 'A0042A',
    titulo: 'Avaliação de Português 8º e 9º Ano',
    descricao: 'Avaliação com foco em interpretação de texto e gramática.',
    natureza: 'Formativa',
    inicio: '10 Set, 2028',
    fim: '12 Set, 2028',
    testes: 2,
    tipo: 'IA',
    status: 'Concluído',
    isExpanded: false
  },
  {
    id: 'A0041A',
    titulo: 'Avaliação de Ciências 4º e 5º Ano',
    descricao: 'Avaliação de ciências sobre ecossistemas.',
    natureza: 'Formativa',
    inicio: '05 Set, 2028',
    fim: '08 Set, 2028',
    testes: 1,
    tipo: 'Manual',
    status: 'Programada',
    isExpanded: false
  },
  {
    id: 'A0040A',
    titulo: 'Avaliação de História 1º Ano',
    descricao: 'Avaliação de história geral.',
    natureza: 'Formativa',
    inicio: '01 Set, 2028',
    fim: '03 Set, 2028',
    testes: 1,
    tipo: 'IA',
    status: 'Concluído',
    isExpanded: false
  },
  {
    id: 'A0039A',
    titulo: 'Avaliação de Geografia 2º Ano',
    descricao: 'Avaliação de geografia focada no clima e relevo.',
    natureza: 'Formativa',
    inicio: '28 Ago, 2028',
    fim: '30 Ago, 2028',
    testes: 1,
    tipo: 'Manual',
    status: 'Concluído',
    isExpanded: false
  }
];

const CorrecaoAvaliacoes = ({ colors, navigateTo, isDarkMode }) => {
  const [avaliacoes, setAvaliacoes] = useState(mockAvaliacoes);
  const [searchTerm, setSearchTerm] = useState('');

  const toggleExpand = (id) => {
    setAvaliacoes(avaliacoes.map(av => 
      av.id === id ? { ...av, isExpanded: !av.isExpanded } : av
    ));
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Em Andamento':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#FFF8E6] text-[#B77F00]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#B77F00]"></span>
            {status}
          </span>
        );
      case 'Concluído':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E8F8EE] text-[#008A3D]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#008A3D]"></span>
            {status}
          </span>
        );
      case 'Programada':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-[#E6F0FF] text-[#0055FF]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#0055FF]"></span>
            {status}
          </span>
        );
      default:
        return null;
    }
  };

  const getTypeIcon = (tipo) => {
    if (tipo === 'IA') {
      return (
        <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#E6F0FF] text-[#0055FF]" title="Correção com IA">
          <Bot size={16} />
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#FFF0E6] text-[#FF5500]" title="Correção Manual">
        <PencilRuler size={16} />
      </div>
    );
  };


  return (
    <div className={`flex flex-col flex-1 h-full relative ${isDarkMode ? 'bg-neutral-7' : 'bg-neutral-0'}`}>
      <div className="flex-1 overflow-auto px-[80px] pt-[24px] pb-[40px] flex flex-col">
        {/* Breadcrumb */}
        <Breadcrumb
          colors={colors}
          onBack={() => navigateTo('dashboard')}
          paths={[
            { label: 'Tela Inicial', onClick: () => navigateTo('dashboard') },
            { label: 'Avaliações' }
          ]}
          className="!mb-4"
        />

        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className={`text-[24px] font-bold ${isDarkMode ? 'text-white' : 'text-neutral-8'}`}>
            Avaliações
          </h1>
        </div>

        {/* Filters using Design System Input & Button components */}
        <div className="flex items-center gap-3 mb-6 w-full">
          <div className="flex-[1.5] min-w-0">
            <Input
              placeholder="Pesquise por Código/Título"
              iconLeft={<Search />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              height="40px"
              className={isDarkMode ? '!bg-neutral-6 !border-neutral-5 !text-white' : '!bg-white'}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <Input
              placeholder="Tipo de Correção"
              iconRight={<ChevronDown className="text-neutral-4" />}
              readOnly
              height="40px"
              className={`cursor-pointer ${isDarkMode ? '!bg-neutral-6 !border-neutral-5 !text-neutral-2' : '!bg-white'}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <Input
              placeholder="Filtrar por Status"
              iconRight={<ChevronDown className="text-neutral-4" />}
              readOnly
              height="40px"
              className={`cursor-pointer ${isDarkMode ? '!bg-neutral-6 !border-neutral-5 !text-neutral-2' : '!bg-white'}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <Input
              placeholder="Data de Início"
              iconRight={<ChevronDown className="text-neutral-4" />}
              readOnly
              height="40px"
              className={`cursor-pointer ${isDarkMode ? '!bg-neutral-6 !border-neutral-5 !text-neutral-2' : '!bg-white'}`}
            />
          </div>

          <div className="flex-1 min-w-0">
            <Input
              placeholder="Data de Fim"
              iconRight={<ChevronDown className="text-neutral-4" />}
              readOnly
              height="40px"
              className={`cursor-pointer ${isDarkMode ? '!bg-neutral-6 !border-neutral-5 !text-neutral-2' : '!bg-white'}`}
            />
          </div>

          <Button
            variant="primary"
            appearance="solid"
            size="md"
            iconOnly={true}
            iconLeft={<Search size={18} />}
            className="!h-[40px] !w-[40px] rounded-[4px] shadow-sm shrink-0"
            style={{ backgroundColor: colors?.primary?.base || '#0055FF' }}
          />
          <Button
            variant="tertiary"
            appearance="solid"
            size="md"
            iconOnly={true}
            iconLeft={<SlidersHorizontal size={18} className="text-[#0055FF]" />}
            className="!h-[40px] !w-[40px] rounded-[4px] shadow-sm !bg-[#E6F0FF] hover:!bg-[#D0E2FF] shrink-0"
          />
        </div>

        {/* Table with radius 8px */}
        <div className={`flex flex-col border rounded-[8px] overflow-hidden ${
          isDarkMode ? 'border-neutral-6 bg-neutral-7' : 'border-neutral-2 bg-white'
        }`}>
          {/* Table Header */}
          <div className={`flex items-center px-4 py-3 border-b text-xs font-bold uppercase tracking-wider ${
            isDarkMode ? 'border-neutral-6 bg-neutral-6 text-neutral-3' : 'border-neutral-2 bg-[#F8F9FA] text-neutral-5'
          }`}>
            <div className="w-[40px]"></div>
            <div className="w-[100px]">Código</div>
            <div className="flex-1 flex items-center gap-1 cursor-pointer">
              Título
              <ArrowUp size={14} className="text-primary-base" />
            </div>
            <div className="w-[120px]">Natureza</div>
            <div className="w-[110px]">Início</div>
            <div className="w-[110px]">Fim</div>
            <div className="w-[120px]">Nº de Teste(s)</div>
            <div className="w-[80px]">Tipo</div>
            <div className="w-[140px]">Status Geral</div>
            <div className="w-[40px]"></div>
          </div>

          {/* Table Body */}
          <div className="flex flex-col">
            {avaliacoes.map((av, index) => (
              <React.Fragment key={av.id}>
                {/* Main Row */}
                <div 
                  className={`flex items-center px-4 py-4 border-b group hover:bg-neutral-50 transition-colors ${
                    isDarkMode ? 'border-neutral-6 hover:bg-neutral-6/50 text-neutral-2' : 'border-neutral-2 text-neutral-7'
                  } ${av.isExpanded ? (isDarkMode ? 'bg-neutral-6/30' : 'bg-neutral-50') : ''}`}
                >
                  <div className="w-[40px] flex justify-start">
                    <button 
                      onClick={() => toggleExpand(av.id)}
                      className="p-1 rounded hover:bg-neutral-200 text-neutral-4 transition-colors"
                    >
                      {av.isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </button>
                  </div>
                  <div className="w-[100px] text-sm font-medium">{av.id}</div>
                  <div className={`flex-1 text-sm ${av.isExpanded ? 'font-bold' : 'font-semibold'}`}>
                    {av.titulo}
                  </div>
                  <div className="w-[120px] text-sm">{av.natureza}</div>
                  <div className="w-[110px] text-sm">{av.inicio}</div>
                  <div className="w-[110px] text-sm">{av.fim}</div>
                  <div className="w-[120px] text-sm text-center pr-8">{av.testes}</div>
                  <div className="w-[80px]">
                    {getTypeIcon(av.tipo)}
                  </div>
                  <div className="w-[140px]">
                    {getStatusBadge(av.status)}
                  </div>
                  <div className="w-[40px] flex justify-end">
                    <button className="p-1 rounded hover:bg-neutral-200 text-neutral-4 transition-colors">
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {av.isExpanded && (
                  <div className={`flex px-4 py-3 border-b ${
                    isDarkMode ? 'border-neutral-6 bg-neutral-7' : 'border-neutral-2 bg-white'
                  }`}>
                    {/* Gray left border indicator */}
                    <div className="w-[4px] rounded-full bg-neutral-3 mr-[36px] ml-[18px]"></div>
                    <div className={`flex-1 text-sm ${isDarkMode ? 'text-neutral-3' : 'text-neutral-5'}`}>
                      {av.descricao}
                    </div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CorrecaoAvaliacoes;
