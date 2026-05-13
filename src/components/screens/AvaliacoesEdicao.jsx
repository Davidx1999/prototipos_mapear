import React, { useState } from 'react';
import AvaliacoesList from './Avaliacoes/AvaliacoesList';
import AvaliacoesEditor from './Avaliacoes/AvaliacoesEditor';

// Mock Data para a Listagem
const MOCK_AVALIACOES = [
  { id: '0018A', title: 'Aplicação Textos Dona Vassoura e Cadê a Água', status: 'Concluído', color: 'green', type: 'Somativa', correction: 'Correção com IA', start: '28 Out, 2026', end: '30 Out, 2028', tests: 0 },
  { id: '0021A', title: 'Avaliação Português 4º e 5º - 01', status: 'Em Andamento', color: 'yellow', type: 'Somativa', correction: 'Correção com IA', start: '28 Out, 2026', end: '30 Out, 2028', tests: 2 },
  { id: '0020A', title: 'Avaliação Matemática 4º e 5º - 01', status: 'Em Andamento', color: 'yellow', type: 'Somativa', correction: 'Correção Manual', start: '28 Out, 2026', end: '30 Out, 2028', tests: 22 },
  { id: 'APCENPE01', title: 'Avaliação Vincenzo', status: 'Em Andamento', color: 'yellow', type: 'Diagnóstica', correction: 'Correção Manual', start: '28 Out, 2026', end: '30 Out, 2028', tests: 15 },
  { id: '0022A', title: 'Aplicação Teste Múltipla Escolha', status: 'Programada', color: 'blue', type: 'Formativa', correction: 'Correção com IA', start: '28 Out, 2026', end: '30 Out, 2028', tests: 7 },
  { id: '0023A', title: 'Avaliação FGV Matemática 01', status: 'Concluído', color: 'green', type: 'Diagnóstica', correction: 'Correção com IA', start: '28 Out, 2026', end: '30 Out, 2028', tests: 11 },
  { id: '0024A', title: 'Avaliação Matemática 01 - 8º ano - Sobral', status: 'Em Correção', color: 'purple', type: 'Somativa', correction: 'Correção Manual', start: '28 Out, 2026', end: '30 Out, 2028', tests: 12 },
  { id: '0025A', title: 'Avaliação Sobral 12/2024 - 6º e 7º - 01', status: 'Concluído', color: 'green', type: 'Somativa', correction: 'Correção com IA', start: '28 Out, 2026', end: '30 Out, 2028', tests: 9 }
];

const AvaliacoesEdicao = ({ colors, navigateTo, isDarkMode }) => {
  const [view, setView] = useState('list'); // 'list' | 'edit'
  const [selectedAvaliacao, setSelectedAvaliacao] = useState(null);

  const handleOpenEdit = (av) => {
    setSelectedAvaliacao(av);
    setView('edit');
  };

  return (
    <div className={`flex flex-col flex-1 font-['Montserrat',sans-serif] ${isDarkMode ? 'bg-neutral-7 text-white' : 'bg-neutral-0 text-neutral-7'}`}>
      {view === 'list' ? (
        <AvaliacoesList
          assessments={MOCK_AVALIACOES}
          onEdit={handleOpenEdit}
          colors={colors}
          navigateTo={navigateTo}
          isDarkMode={isDarkMode}
        />
      ) : (
        <AvaliacoesEditor
          assessment={selectedAvaliacao}
          onBack={() => setView('list')}
          colors={colors}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default AvaliacoesEdicao;
