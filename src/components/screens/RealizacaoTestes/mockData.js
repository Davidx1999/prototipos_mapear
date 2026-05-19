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
  const tasksCount = 4;
  const itemsPerTask = Math.ceil(totalItems / tasksCount);

  let currentItemNumber = 1;

  for (let t = 0; t < tasksCount; t++) {
    const elements = [];
    let itemsInThisTask = 0;

    // 1. Adicionar 2 itens isolados iniciais
    for (let i = 0; i < 2; i++) {
      if (currentItemNumber <= totalItems) {
        elements.push({
          type: 'item',
          data: {
            id: `I${currentItemNumber}`, number: currentItemNumber, title: `Questão Isolada ${currentItemNumber}`, type: 'single_choice',
            text: 'Leia atentamente o enunciado desta questão isolada. Qual das alternativas abaixo apresenta o raciocínio correto para a resolução do problema apresentado?',
            options: [{ id: 'A', text: 'A premissa está correta e a conclusão é válida.' }, { id: 'B', text: 'A premissa é falsa, logo a conclusão é inválida.' }, { id: 'C', text: 'Faltam dados para determinar o resultado.' }, { id: 'D', text: 'A resolução depende de uma variável externa não mencionada.' }]
          }
        });
        currentItemNumber++;
        itemsInThisTask++;
      }
    }

    // 2. Adicionar um Bloco longo (Contexto comum para 6 itens)
    const blockItems = [];
    for (let b = 0; b < 6; b++) {
      if (currentItemNumber <= totalItems && itemsInThisTask < itemsPerTask) {
        blockItems.push({
          id: `I${currentItemNumber}`, number: currentItemNumber, title: `Análise do Texto ${currentItemNumber}`,
          type: currentItemNumber % 5 === 0 ? 'hybrid' : 'single_choice',
          text: currentItemNumber % 5 === 0 ? `Com base no texto base, explique e justifique o fenômeno abordado na questão ${currentItemNumber}.` : `De acordo com o segundo parágrafo do texto base, o que se pode inferir sobre o item ${currentItemNumber}?`,
          options: currentItemNumber % 5 === 0 ? [{ id: 'A', text: 'Fenômeno A' }, { id: 'B', text: 'Fenômeno B' }] : [{ id: 'A', text: 'A inferência é positiva.' }, { id: 'B', text: 'A inferência é neutra.' }, { id: 'C', text: 'O autor não deixa claro.' }, { id: 'D', text: 'A resposta requer análise do contexto global.' }]
        });
        currentItemNumber++;
        itemsInThisTask++;
      }
    }
    if (blockItems.length > 0) {
      elements.push({
        type: 'block',
        context: { text: `Este é o TEXTO BASE para um longo bloco de análise interpretativa. As questões a seguir exigirão que você retorne a este texto para fundamentar suas respostas. O tema central aborda a complexidade das relações socioeconômicas no Brasil contemporâneo, focando na desigualdade de renda e no acesso a tecnologias essenciais no século XXI. É vital observar as entrelinhas e os dados implícitos fornecidos neste parágrafo para a resolução dos itens de ${blockItems[0].number} a ${blockItems[blockItems.length - 1].number}.` },
        items: blockItems
      });
    }

    // 3. Adicionar o restante como itens subjetivos/isolados
    while (itemsInThisTask < itemsPerTask && currentItemNumber <= totalItems) {
      elements.push({
        type: 'item',
        data: {
          id: `I${currentItemNumber}`, number: currentItemNumber, title: `Questão Final da Tarefa ${currentItemNumber}`, type: 'subjective',
          text: `Escreva um parágrafo argumentativo defendendo o seu ponto de vista sobre o tópico abordado no módulo ${t + 1}.`,
        }
      });
      currentItemNumber++;
      itemsInThisTask++;
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
