// ============================================================================
// DADOS SIMULADOS (MOCK) - DASHBOARD DE AVALIAÇÕES E TESTE ATIVO
// ============================================================================
export const mockAssessments = [
  {
    id: 'CG-BR-001/2026',
    title: 'Cultura, Linguagem e Cotidiano Brasileiro',
    subtitle: 'Brasil em Foco: Cultura, Sociedade, Ciência e Cotidiano',
    status: 'active',
    startDate: '09 Dez, 25 - 16h',
    endDate: '18 Dez, 26 - 18h',
    totalItems: 45,
    avgTime: '3 Hora(s)',
    progress: 0,
    message: 'Você pode iniciar esta avaliação!'
  },
  {
    id: 'MS25245',
    title: 'Simulado Extenso - Avaliação de 56 Itens',
    subtitle: 'Simulado Geral: Matemática, Linguagens e Ciências',
    status: 'active',
    startDate: '09 Dez, 25 - 16h',
    endDate: '11 Dez, 25 - 12h',
    totalItems: 56,
    avgTime: '4 Hora(s)',
    progress: 0,
    message: 'Você pode iniciar esta avaliação!'
  },
  {
    id: 'MS25246',
    title: 'Avaliação Formativa 2 - Matemática',
    subtitle: 'Anos Iniciais do Ensino Fundamental',
    status: 'active',
    startDate: '09 Dez, 25 - 16h',
    endDate: '11 Dez, 25 - 12h',
    totalItems: 12,
    avgTime: '3 Hora(s)',
    progress: 34,
    message: 'Você pode continuar esta avaliação!'
  }
];

// GERADOR DINÂMICO PARA ITENS
export const generateMockTest = (totalItems = 56) => {
  const tasks = [];
  const tasksCount = 3;
  const itemsPerTask = Math.ceil(totalItems / tasksCount);

  let currentItemNumber = 1;

  for (let t = 0; t < tasksCount; t++) {
    const elements = [];
    // Always create 4 items per task
    for (let i = 0; i < 4; i++) {
      elements.push({
        type: 'item',
        data: {
          id: `I${currentItemNumber}`,
          number: currentItemNumber,
          title: `Questão ${currentItemNumber} (Tarefa ${t + 1})`,
          type: 'single_choice',
          text: `Leia a questão ${currentItemNumber}. Qual a alternativa correta?`,
          options: [
            { id: 'A', text: 'Alternativa A' },
            { id: 'B', text: 'Alternativa B' },
            { id: 'C', text: 'Alternativa C' },
            { id: 'D', text: 'Alternativa D' }
          ]
        }
      });
      currentItemNumber++;
    }

    tasks.push({
      id: `T${t + 1}`,
      title: `Caderno ${t + 1} - Conhecimentos Aplicados`,
      elements
    });
  }

  return {
    id: 'AV_56',
    title: 'Simulado Extenso - Avaliação de 56 Itens',
    timeLimitSeconds: 14400, // 4 horas
    tasks
  };
};

export const mockTest = generateMockTest(56);
export const MARKER_COLORS = ['#EF4444', '#FACC15', '#4ADE80', '#3B82F6', '#2DD4BF', '#F472B6'];
