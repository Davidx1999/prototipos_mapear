import React, { useState } from 'react';
import {
  FileText,
  BookOpen,
  Search,
  ChevronDown,
  Plus,
  ChevronLeft,
  ChevronRight,
  BaggageClaimIcon,
  Route,
  PencilRuler,
  BookMarked,
  Calendar
} from 'lucide-react';
import Breadcrumb from '../../ui/Breadcrumb';
import Button from '../../ui/Button';
import Input from '../../ui/Input';
import AvaliacoesCard from './AvaliacoesCard';

const MOCK_TAREFAS = [
  { id: 'B0027A', title: 'Banco de Tarefas & Itens de Matemática 5º Ano', status: 'Em Correção', color: 'purple', type: 'Somativa', correction: 'Correção Manual', start: '28 Out, 2026', end: '30 Out, 2028', tests: 3 },
  { id: 'B0028A', title: 'Banco de Questões de Ciências - Caucaia', status: 'Programada', color: 'blue', type: 'Somativa', correction: 'Correção com IA', start: '28 Out, 2026', end: '30 Out, 2028', tests: 8 },
  { id: 'B0018A', title: 'Itens de Leitura e Escrita - Dona Vassoura', status: 'Concluída', color: 'green', type: 'Somativa', correction: 'Correção com IA', start: '28 Out, 2026', end: '30 Out, 2028', tests: 0 },
  { id: 'B0021A', title: 'Banco de Itens de Português 4º e 5º Ano', status: 'Em Andamento', color: 'yellow', type: 'Somativa', correction: 'Correção com IA', start: '28 Out, 2026', end: '30 Out, 2028', tests: 2 },
  { id: 'B0020A', title: 'Banco de Itens de Matemática 4º e 5º - Sobral', status: 'Em Andamento', color: 'yellow', type: 'Somativa', correction: 'Correção Manual', start: '28 Out, 2026', end: '30 Out, 2028', tests: 221 },
  { id: 'B0024A', title: 'Banco de Questões de Português - Sobral 6º e 7º', status: 'Em Correção', color: 'purple', type: 'Somativa', correction: 'Correção Manual', start: '28 Out, 2026', end: '30 Out, 2028', tests: 12 }
];

const AvaliacoesList = ({
  assessments,
  onEdit,
  colors,
  navigateTo,
  isDarkMode,
  initialSubTab = 'avaliacoes'
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState(initialSubTab);

  React.useEffect(() => {
    setActiveSubTab(initialSubTab);
  }, [initialSubTab]);

  const handleTabClick = (tab) => {
    setActiveSubTab(tab);
    navigateTo(tab === 'avaliacoes' ? 'avaliacoes' : 'banco-tarefas');
  };

  // Busca em tempo real
  const filteredAssessments = assessments.filter(av =>
    av.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    av.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredTarefas = MOCK_TAREFAS.filter(t =>
    t.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const itemsToRender = activeSubTab === 'avaliacoes' ? filteredAssessments : filteredTarefas;

  return (
    <div className={`flex flex-col flex-1 h-full relative ${isDarkMode ? 'bg-neutral-7' : 'bg-neutral-0'}`}>
      {/* Área Rolável de Conteúdo */}
      <div className="flex-1 overflow-auto px-[80px] pt-[24px] pb-[80px] flex flex-col">
        <Breadcrumb
          colors={colors}
          onBack={() => navigateTo('dashboard')}
          paths={[
            { label: 'Tela Inicial', onClick: () => navigateTo('dashboard') },
            { label: activeSubTab === 'avaliacoes' ? 'Avaliações' : 'Banco De Tarefas & Itens' }
          ]}
          className="!mb-0"
        />

        {/* Barra Superior com Pesquisa Acoplada */}
        <div className="flex flex-col md:flex-row justify-between md:items-end gap-4 pb-0 mt-[16px]">
          <div className="flex items-center h-full gap-2">
            <Button
              variant="tertiary"
              appearance={activeSubTab === 'avaliacoes' ? 'solid' : 'ghost'}
              selected={activeSubTab === 'avaliacoes'}
              uppercase={false}
              iconLeft={<FileText />}
              onClick={() => handleTabClick('avaliacoes')}
              className={`!font-bold font-montserrat flex items-center gap-2 !h-[40px] rounded-[4px] ${activeSubTab === 'avaliacoes' ? 'shadow-sm' : '!text-[var(--color-neutral-5)] hover:!text-[var(--color-neutral-7)]'
                }`}
            >
              Avaliações
            </Button>
            <Button
              variant="tertiary"
              appearance={activeSubTab === 'banco-tarefas' ? 'solid' : 'ghost'}
              selected={activeSubTab === 'banco-tarefas'}
              uppercase={false}
              iconLeft={<BookOpen />}
              onClick={() => handleTabClick('banco-tarefas')}
              className={`!font-bold font-montserrat flex items-center gap-2 !h-[40px] rounded-[4px] ${activeSubTab === 'banco-tarefas' ? 'shadow-sm' : '!text-[var(--color-neutral-5)] hover:!text-[var(--color-neutral-7)]'
                }`}
            >
              Banco De Tarefas & Itens
            </Button>
          </div>
          <div className="w-full md:w-[350px]">
            <div className="flex w-full items-center">
              <Input
                placeholder="Pesquise por código ou título"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="!rounded-r-none !border-r-0"
                style={{
                  backgroundColor: isDarkMode ? colors.neutral[6] : colors.neutral[0],
                  borderColor: isDarkMode ? colors.neutral[5] : colors.neutral[2],
                  color: isDarkMode ? colors.neutral[0] : colors.neutral[7]
                }}
                height="40px"
                fullWidth={true}
              />
              <Button
                variant="primary"
                appearance="solid"
                size="md"
                iconOnly={true}
                iconLeft={<Search />}
                className="!rounded-l-none !h-[40px] !w-[40px]"
                style={{ backgroundColor: colors.primary.base }}
              />
            </div>
          </div>
        </div>

        {/* Filtros da Listagem com Ícones Correspondentes do Print */}
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 mt-[16px]">
          <h1 className={`text-[22px] font-semibold ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>
            {activeSubTab === 'avaliacoes' ? 'Avaliações Disponíveis' : 'Banco De Tarefas & Itens Disponíveis'}
          </h1>
          <div className="flex flex-wrap items-center gap-2">
            <button className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[14px] font-semibold shadow-sm transition-colors ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-neutral-2 hover:bg-neutral-5' : 'bg-neutral-0 border-neutral-2 text-neutral-6 hover:bg-neutral-1'}`}>
              <BaggageClaimIcon size={16} /> Status <ChevronDown size={16} style={{ color: colors.primary.base }} />
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[14px] font-semibold shadow-sm transition-colors ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-neutral-2 hover:bg-neutral-5' : 'bg-neutral-0 border-neutral-2 text-neutral-6 hover:bg-neutral-1'}`}>
              <Route size={16} /> Natureza <ChevronDown size={16} style={{ color: colors.primary.base }} />
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[14px] font-semibold shadow-sm transition-colors ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-neutral-2 hover:bg-neutral-5' : 'bg-neutral-0 border-neutral-2 text-neutral-6 hover:bg-neutral-1'}`}>
              <PencilRuler size={16} /> Correção <ChevronDown size={16} style={{ color: colors.primary.base }} />
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[14px] font-semibold shadow-sm transition-colors ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-neutral-2 hover:bg-neutral-5' : 'bg-neutral-0 border-neutral-2 text-neutral-6 hover:bg-neutral-1'}`}>
              <BookMarked size={16} /> Testes <ChevronDown size={16} style={{ color: colors.primary.base }} />
            </button>
            <button className={`flex items-center gap-2 px-4 py-2 border rounded-full text-[14px] font-semibold shadow-sm transition-colors ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-neutral-2 hover:bg-neutral-5' : 'bg-neutral-0 border-neutral-2 text-neutral-6 hover:bg-neutral-1'}`}>
              <Calendar size={16} /> Periodo da Avaliação <ChevronDown size={16} style={{ color: colors.primary.base }} />
            </button>
          </div>
        </div>

        {/* Linha Divisória que cobre 100% da viewport */}
        <div className={`border-b w-auto mx-[-80px] mt-[8px] mb-0 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'
          }`} />

        {/* Ordenar por alinhado à direita acima do grid de cards */}
        <div className="flex justify-end mt-[8px] mb-0">
          <div className={`text-[14px] font-bold flex items-center gap-2 ${isDarkMode ? 'text-neutral-3' : 'text-neutral-5'}`}>
            <span>Ordenar por</span>
            <Button
              variant="primary"
              appearance="link"
              size="sm"
              iconRight={<ChevronDown size={14} />}
              onClick={() => console.log('Ordenar')}
              className="!p-0 !h-auto !font-bold font-montserrat flex items-center gap-1"
            >
              Mais recentes
            </Button>
          </div>
        </div>

        {/* GRID DE CARDS */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 mt-[8px] pb-6">
          {itemsToRender.map(av => (
            <AvaliacoesCard
              key={av.id}
              assessment={av}
              onEdit={onEdit}
              colors={colors}
              isDarkMode={isDarkMode}
            />
          ))}
        </div>
      </div>

      {/* Barra Inferior Fixada na base da tela */}
      <div className={`sticky bottom-0 z-30 w-full px-6 md:px-10 py-4 border-t flex flex-col sm:flex-row justify-between items-center gap-6 shadow-[0_-4px_12px_rgba(0,0,0,0.03)] ${isDarkMode ? 'bg-neutral-7 border-neutral-5' : 'bg-neutral-0 border-[#DEE1E8]'
        }`}>
        {/* Paginação à esquerda */}
        <div className={`flex flex-wrap items-center gap-4 text-[14px] ${isDarkMode ? 'text-neutral-3' : 'text-[var(--color-neutral-5)]'}`}>
          <span>1 a {itemsToRender.length} de {itemsToRender.length} registros</span>
          <div className="flex items-center gap-2">
            <button className={`w-[32px] h-[32px] flex items-center justify-center border rounded transition-colors ${isDarkMode ? 'border-neutral-5 bg-neutral-6 hover:bg-neutral-5 text-neutral-2' : 'border-neutral-2 bg-neutral-0 hover:bg-neutral-1 text-neutral-6'
              }`}>
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1.5">
              <span>Página</span>
              <div className={`w-[40px] h-[32px] flex items-center justify-center border rounded font-semibold text-center text-[14px] ${isDarkMode ? 'border-neutral-5 bg-neutral-6 text-white' : 'border-neutral-2 bg-neutral-0 text-neutral-7'
                }`}>
                1
              </div>
              <span>de 1</span>
            </div>
            <button className={`w-[32px] h-[32px] flex items-center justify-center border rounded transition-colors ${isDarkMode ? 'border-neutral-5 bg-neutral-6 hover:bg-neutral-5 text-neutral-2' : 'border-neutral-2 bg-neutral-0 hover:bg-neutral-1 text-neutral-6'
              }`}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>

        {/* Botão de Criação à direita */}
        <Button
          variant="primary"
          appearance="solid"
          size="md"
          iconLeft={<Plus />}
          className="uppercase font-bold tracking-wide rounded-[4px] px-[20px] shadow-sm shrink-0 sm:ml-auto"
          style={{ backgroundColor: colors.primary.base }}
        >
          {activeSubTab === 'avaliacoes' ? 'Criar Nova Avaliação' : 'Criar Novo Banco de Tarefas'}
        </Button>
      </div>
    </div>
  );
};

export default AvaliacoesList;
