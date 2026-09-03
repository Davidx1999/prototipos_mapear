export const STUDENTS = [
  {
    id: 'roberto',
    username: 'roberto.carlos',
    name: 'Roberto Carlos da Silva Júnior Melendez Neto',
    nameShort: 'Roberto Carlos da Silv...',
    school: 'EEM José Militão',
    schoolShort: 'EEM José Mi...',
    grade: '7º ano',
    classGroup: 'B',
    status: 'Ativo',
    state: 'CE',
    city: 'Fortaleza',
    year: 2024
  },
  {
    id: 'anasofia',
    username: 'anasofia.martins',
    name: 'Ana Sofia Martins de Oliveira',
    nameShort: 'Ana Sofia Martins...',
    school: 'Escola Municipal José de Alencar',
    schoolShort: 'Escola Mun. J...',
    grade: '7º ano EF',
    classGroup: 'B',
    status: 'Ativo',
    state: 'CE',
    city: 'Fortaleza',
    year: 2024
  },
  {
    id: 'lorem',
    username: 'lorem.ipsum',
    name: 'Lorem Ipsum Dolor',
    nameShort: 'Lorem Ipsum Dolor',
    school: 'EEM José Militão',
    schoolShort: 'EEM José Mi...',
    grade: '1º ano',
    classGroup: 'B',
    status: 'Ativo',
    state: 'CE',
    city: 'Fortaleza',
    year: 2024
  }
];

export const YEARS_LIST = [
  'Todos',
  '2023',
  '2024',
  '2025',
  '2026'
];

// ─────────────────────────────────────────────────────────────────────────────
// INDICADORES DE MÉTRICA POR ANO (Percentual de Acertos, Avaliações, Itens, Intervenções)
// ─────────────────────────────────────────────────────────────────────────────
export const METRIC_INDICATORS_BY_YEAR = {
  '2023': {
    percentage: {
      acertos: { value: '63%', raw: 63, label: 'Percentual de Acertos', tooltip: 'Média de acertos do aluno baseado no cálculo da Teoria Clássica dos Testes (TCT).' },
      avaliacoes: { value: '64', raw: 64, label: 'Avaliações Realizadas', tooltip: 'Quantidade de Avaliações que o(a) aluno(a) realizou na sua trajetória.' },
      itens: { value: '3.200', raw: 3200, label: 'Itens Resolvidos', tooltip: 'Quantidade de Itens respondidos pelo(a) aluno(a) nas avaliações.' },
      intervencoes: { value: '4', raw: 4, label: 'Total de Intervenções', tooltip: 'Quantidade de vezes em que o(a) aluno(a) precisou de intervenções para melhorar o desempenho.' }
    },
    fraction: {
      acertos: { value: '315 / 500', raw: 63.0, label: 'Percentual de Acertos', tooltip: 'Pontuação acumulada do aluno na escala TRI das avaliações realizadas.' },
      avaliacoes: { value: '64 / 90', raw: 71.1, label: 'Avaliações Realizadas', tooltip: 'Avaliações concluídas em relação ao total previsto no currículo escolar.' },
      itens: { value: '160 / 400', raw: 40.0, label: 'Itens Resolvidos', tooltip: 'Total de itens válidos respondidos em relação aos cadernos distribuídos.' },
      intervencoes: { value: '4', raw: 4, label: 'Total de Intervenções', tooltip: 'Intervenções pedagógicas registradas com acompanhamento ativo.' }
    }
  },
  '2024': {
    percentage: {
      acertos: { value: '71%', raw: 71, label: 'Percentual de Acertos', tooltip: 'Média de acertos do aluno baseado no cálculo da Teoria Clássica dos Testes (TCT).' },
      avaliacoes: { value: '88', raw: 88, label: 'Avaliações Realizadas', tooltip: 'Quantidade de Avaliações que o(a) aluno(a) realizou na sua trajetória.' },
      itens: { value: '4.800', raw: 4800, label: 'Itens Resolvidos', tooltip: 'Quantidade de Itens respondidos pelo(a) aluno(a) nas avaliações.' },
      intervencoes: { value: '3', raw: 3, label: 'Total de Intervenções', tooltip: 'Quantidade de vezes em que o(a) aluno(a) precisou de intervenções para melhorar o desempenho.' }
    },
    fraction: {
      acertos: { value: '355 / 500', raw: 71.0, label: 'Percentual de Acertos', tooltip: 'Pontuação acumulada do aluno na escala TRI das avaliações realizadas.' },
      avaliacoes: { value: '88 / 120', raw: 73.3, label: 'Avaliações Realizadas', tooltip: 'Avaliações concluídas em relação ao total previsto no currículo escolar.' },
      itens: { value: '220 / 500', raw: 44.0, label: 'Itens Resolvidos', tooltip: 'Total de itens válidos respondidos em relação aos cadernos distribuídos.' },
      intervencoes: { value: '3', raw: 3, label: 'Total de Intervenções', tooltip: 'Intervenções pedagógicas registradas com acompanhamento ativo.' }
    }
  },
  '2025': {
    percentage: {
      acertos: { value: '78%', raw: 78, label: 'Percentual de Acertos', tooltip: 'Média de acertos do aluno baseado no cálculo da Teoria Clássica dos Testes (TCT).' },
      avaliacoes: { value: '120', raw: 120, label: 'Avaliações Realizadas', tooltip: 'Quantidade de Avaliações que o(a) aluno(a) realizou na sua trajetória.' },
      itens: { value: '7.000', raw: 7000, label: 'Itens Resolvidos', tooltip: 'Quantidade de Itens respondidos pelo(a) aluno(a) nas avaliações.' },
      intervencoes: { value: '2', raw: 2, label: 'Total de Intervenções', tooltip: 'Quantidade de vezes em que o(a) aluno(a) precisou de intervenções para melhorar o desempenho.' }
    },
    fraction: {
      acertos: { value: '387 / 500', raw: 77.4, label: 'Percentual de Acertos', tooltip: 'Pontuação acumulada do aluno na escala TRI das avaliações realizadas.' },
      avaliacoes: { value: '170 / 240', raw: 70.8, label: 'Avaliações Realizadas', tooltip: 'Avaliações concluídas em relação ao total previsto no currículo escolar.' },
      itens: { value: '300 / 800', raw: 37.5, label: 'Itens Resolvidos', tooltip: 'Total de itens válidos respondidos em relação aos cadernos distribuídos.' },
      intervencoes: { value: '2', raw: 2, label: 'Total de Intervenções', tooltip: 'Intervenções pedagógicas registradas com acompanhamento ativo.' }
    }
  },
  '2026': {
    percentage: {
      acertos: { value: '87%', raw: 87, label: 'Percentual de Acertos', tooltip: 'Média de acertos do aluno baseado no cálculo da Teoria Clássica dos Testes (TCT).' },
      avaliacoes: { value: '152', raw: 152, label: 'Avaliações Realizadas', tooltip: 'Quantidade de Avaliações que o(a) aluno(a) realizou na sua trajetória.' },
      itens: { value: '8.900', raw: 8900, label: 'Itens Resolvidos', tooltip: 'Quantidade de Itens respondidos pelo(a) aluno(a) nas avaliações.' },
      intervencoes: { value: '1', raw: 1, label: 'Total de Intervenções', tooltip: 'Quantidade de vezes em que o(a) aluno(a) precisou de intervenções para melhorar o desempenho.' }
    },
    fraction: {
      acertos: { value: '435 / 500', raw: 87.0, label: 'Percentual de Acertos', tooltip: 'Pontuação acumulada do aluno na escala TRI das avaliações realizadas.' },
      avaliacoes: { value: '220 / 260', raw: 84.6, label: 'Avaliações Realizadas', tooltip: 'Avaliações concluídas em relação ao total previsto no currículo escolar.' },
      itens: { value: '380 / 850', raw: 44.7, label: 'Itens Resolvidos', tooltip: 'Total de itens válidos respondidos em relação aos cadernos distribuídos.' },
      intervencoes: { value: '1', raw: 1, label: 'Total de Intervenções', tooltip: 'Intervenções pedagógicas registradas com acompanhamento ativo.' }
    }
  },
  'Todos': {
    percentage: {
      acertos: { value: '75%', raw: 75, label: 'Percentual de Acertos', tooltip: 'Média de acertos do aluno baseado no cálculo da Teoria Clássica dos Testes (TCT).' },
      avaliacoes: { value: '424', raw: 424, label: 'Avaliações Realizadas', tooltip: 'Quantidade total de avaliações realizadas em todos os anos.' },
      itens: { value: '23.900', raw: 23900, label: 'Itens Resolvidos', tooltip: 'Quantidade total de itens respondidos nas avaliações de todos os anos.' },
      intervencoes: { value: '10', raw: 10, label: 'Total de Intervenções', tooltip: 'Quantidade de intervenções acumuladas em toda a trajetória.' }
    },
    fraction: {
      acertos: { value: '373 / 500', raw: 74.6, label: 'Percentual de Acertos', tooltip: 'Pontuação acumulada média do aluno na escala TRI das avaliações realizadas.' },
      avaliacoes: { value: '424 / 580', raw: 73.1, label: 'Avaliações Realizadas', tooltip: 'Total de avaliações concluídas em relação ao total curricular previsto.' },
      itens: { value: '1.060 / 2.550', raw: 41.5, label: 'Itens Resolvidos', tooltip: 'Total de itens válidos respondidos em todos os cadernos distribuídos.' },
      intervencoes: { value: '10', raw: 10, label: 'Total de Intervenções', tooltip: 'Total de intervenções pedagógicas registradas na trajetória.' }
    }
  }
};

export const METRIC_INDICATORS = METRIC_INDICATORS_BY_YEAR['2024'];

// ─────────────────────────────────────────────────────────────────────────────
// EVOLUÇÃO DO ESTUDANTE POR ANO (Semestre, Bimestre, Ano)
// ─────────────────────────────────────────────────────────────────────────────
export const EVOLUCAO_DATA_BY_YEAR = {
  '2023': {
    Semestre: [
      { label: 'Semestre 1 | Janeiro a Junho', shortLabel: '1º Semestre', leitura: 36.0, leituraTurma: 40.0, matematica: 44.5, matematicaTurma: 48.0 },
      { label: 'Semestre 2 | Julho a Dezembro', shortLabel: '2º Semestre', leitura: 40.5, leituraTurma: 42.0, matematica: 52.0, matematicaTurma: 55.0 }
    ],
    Bimestre: [
      { label: 'Mar | Abr', shortLabel: '1º BIMESTRE | MAR - ABR', leitura: 34.0, leituraTurma: 38.0, matematica: 42.0, matematicaTurma: 46.0 },
      { label: 'Mai | Jun', shortLabel: '2º BIMESTRE | MAI - JUN', leitura: 37.5, leituraTurma: 41.0, matematica: 46.8, matematicaTurma: 49.5 },
      { label: 'Ago | Set', shortLabel: '3º BIMESTRE | AGO - SET', leitura: 39.0, leituraTurma: 41.5, matematica: 50.2, matematicaTurma: 53.0 },
      { label: 'Out | Nov', shortLabel: '4º BIMESTRE | OUT - NOV', leitura: 42.0, leituraTurma: 43.0, matematica: 54.0, matematicaTurma: 57.0 }
    ],
    Ano: [
      { label: 'Mar', shortLabel: 'MAR', leitura: 35.0, leituraTurma: 39.0, matematica: 43.0, matematicaTurma: 47.0 },
      { label: 'Mai', shortLabel: 'MAI', leitura: 37.0, leituraTurma: 40.0, matematica: 46.0, matematicaTurma: 49.0 },
      { label: 'Ago', shortLabel: 'AGO', leitura: 39.0, leituraTurma: 41.0, matematica: 51.0, matematicaTurma: 53.0 },
      { label: 'Out', shortLabel: 'OUT', leitura: 41.0, leituraTurma: 42.0, matematica: 53.0, matematicaTurma: 56.0 },
      { label: 'Nov', shortLabel: 'NOV', leitura: 43.0, leituraTurma: 43.5, matematica: 55.0, matematicaTurma: 58.0 }
    ]
  },
  '2024': {
    Semestre: [
      { label: 'Semestre 1 | Janeiro a Junho', shortLabel: '1º Semestre', leitura: 41.0, leituraTurma: 42.5, matematica: 61.5, matematicaTurma: 67.8 },
      { label: 'Semestre 2 | Julho a Dezembro', shortLabel: '2º Semestre', leitura: 41.61, leituraTurma: 43.17, matematica: 76.28, matematicaTurma: 86.12 }
    ],
    Bimestre: [
      { label: 'Mar | Abr', shortLabel: '1º BIMESTRE | MAR - ABR', leitura: 46.0, leituraTurma: 40.0, matematica: 39.5, matematicaTurma: 36.8 },
      { label: 'Mai | Jun', shortLabel: '2º BIMESTRE | MAI - JUN', leitura: 38.02, leituraTurma: 37.17, matematica: 78.43, matematicaTurma: 81.89 },
      { label: 'Ago | Set', shortLabel: '3º BIMESTRE | AGO - SET', leitura: 42.1, leituraTurma: 44.5, matematica: 74.5, matematicaTurma: 78.0 },
      { label: 'Out | Nov', shortLabel: '4º BIMESTRE | OUT - NOV', leitura: 43.8, leituraTurma: 46.2, matematica: 79.8, matematicaTurma: 83.4 }
    ],
    Ano: [
      { label: 'Jan', shortLabel: 'JAN', leitura: 49.0, leituraTurma: 43.0, matematica: 42.0, matematicaTurma: 38.0 },
      { label: 'Abr', shortLabel: 'ABR', leitura: 44.0, leituraTurma: 41.0, matematica: 39.0, matematicaTurma: 37.0 },
      { label: 'Jun', shortLabel: 'JUN', leitura: 41.0, leituraTurma: 42.0, matematica: 80.0, matematicaTurma: 70.0 },
      { label: 'Jul', shortLabel: 'JUL', leitura: 43.0, leituraTurma: 44.0, matematica: 65.0, matematicaTurma: 68.0 },
      { label: 'Ago', shortLabel: 'AGO', leitura: 40.0, leituraTurma: 42.0, matematica: 68.0, matematicaTurma: 75.0 },
      { label: 'Dez', shortLabel: 'DEZ', leitura: 64.0, leituraTurma: 46.0, matematica: 84.0, matematicaTurma: 77.0 }
    ]
  },
  '2025': {
    Semestre: [
      { label: 'Semestre 1 | Janeiro a Junho', shortLabel: '1º Semestre', leitura: 48.0, leituraTurma: 45.5, matematica: 69.2, matematicaTurma: 66.0 },
      { label: 'Semestre 2 | Julho a Dezembro', shortLabel: '2º Semestre', leitura: 55.4, leituraTurma: 50.1, matematica: 82.0, matematicaTurma: 78.5 }
    ],
    Bimestre: [
      { label: 'Fev | Mar', shortLabel: '1º BIMESTRE | FEV - MAR', leitura: 47.0, leituraTurma: 44.0, matematica: 64.0, matematicaTurma: 62.0 },
      { label: 'Abr | Mai', shortLabel: '2º BIMESTRE | ABR - MAI', leitura: 49.5, leituraTurma: 47.0, matematica: 73.5, matematicaTurma: 70.0 },
      { label: 'Ago | Set', shortLabel: '3º BIMESTRE | AGO - SET', leitura: 53.0, leituraTurma: 49.0, matematica: 80.0, matematicaTurma: 76.5 },
      { label: 'Out | Nov', shortLabel: '4º BIMESTRE | OUT - NOV', leitura: 57.8, leituraTurma: 51.5, matematica: 84.5, matematicaTurma: 80.0 }
    ],
    Ano: [
      { label: 'Fev', shortLabel: 'FEV', leitura: 46.0, leituraTurma: 43.0, matematica: 62.0, matematicaTurma: 60.0 },
      { label: 'Abr', shortLabel: 'ABR', leitura: 48.0, leituraTurma: 46.0, matematica: 68.0, matematicaTurma: 65.0 },
      { label: 'Jun', shortLabel: 'JUN', leitura: 51.0, leituraTurma: 48.0, matematica: 75.0, matematicaTurma: 71.0 },
      { label: 'Ago', shortLabel: 'AGO', leitura: 53.0, leituraTurma: 49.0, matematica: 79.0, matematicaTurma: 75.0 },
      { label: 'Out', shortLabel: 'OUT', leitura: 56.0, leituraTurma: 51.0, matematica: 82.0, matematicaTurma: 78.0 },
      { label: 'Dez', shortLabel: 'DEZ', leitura: 59.0, leituraTurma: 53.0, matematica: 86.0, matematicaTurma: 81.0 }
    ]
  },
  '2026': {
    Semestre: [
      { label: 'Semestre 1 | Janeiro a Junho', shortLabel: '1º Semestre', leitura: 62.5, leituraTurma: 53.0, matematica: 82.0, matematicaTurma: 74.5 },
      { label: 'Semestre 2 | Julho a Dezembro', shortLabel: '2º Semestre', leitura: 72.8, leituraTurma: 59.5, matematica: 91.2, matematicaTurma: 81.0 }
    ],
    Bimestre: [
      { label: 'Jan | Fev', shortLabel: '1º BIMESTRE | JAN - FEV', leitura: 58.0, leituraTurma: 51.0, matematica: 78.0, matematicaTurma: 72.0 },
      { label: 'Abr | Mai', shortLabel: '2º BIMESTRE | ABR - MAI', leitura: 66.5, leituraTurma: 55.0, matematica: 85.5, matematicaTurma: 76.5 },
      { label: 'Jun | Ago', shortLabel: '3º BIMESTRE | JUN - AGO', leitura: 70.0, leituraTurma: 58.0, matematica: 89.0, matematicaTurma: 79.5 },
      { label: 'Out | Dez', shortLabel: '4º BIMESTRE | OUT - DEZ', leitura: 75.5, leituraTurma: 61.0, matematica: 93.4, matematicaTurma: 83.0 }
    ],
    Ano: [
      { label: 'Jan', shortLabel: 'JAN', leitura: 56.0, leituraTurma: 50.0, matematica: 75.0, matematicaTurma: 70.0 },
      { label: 'Mar', shortLabel: 'MAR', leitura: 61.0, leituraTurma: 52.0, matematica: 80.0, matematicaTurma: 73.0 },
      { label: 'Mai', shortLabel: 'MAI', leitura: 67.0, leituraTurma: 55.0, matematica: 86.0, matematicaTurma: 77.0 },
      { label: 'Jul', shortLabel: 'JUL', leitura: 69.0, leituraTurma: 57.0, matematica: 88.0, matematicaTurma: 79.0 },
      { label: 'Set', shortLabel: 'SET', leitura: 72.0, leituraTurma: 59.0, matematica: 91.0, matematicaTurma: 81.0 },
      { label: 'Dez', shortLabel: 'DEZ', leitura: 77.0, leituraTurma: 62.0, matematica: 95.0, matematicaTurma: 83.0 }
    ]
  },
  'Todos': {
    Semestre: [
      { label: 'Média 1º Semestre (2023-2026)', shortLabel: '1º Semestre', leitura: 46.9, leituraTurma: 45.2, matematica: 64.3, matematicaTurma: 64.1 },
      { label: 'Média 2º Semestre (2023-2026)', shortLabel: '2º Semestre', leitura: 52.6, leituraTurma: 48.7, matematica: 75.4, matematicaTurma: 75.2 }
    ],
    Bimestre: [
      { label: 'Média 1º Bimestre', shortLabel: '1º BIMESTRE', leitura: 46.2, leituraTurma: 43.2, matematica: 55.9, matematicaTurma: 54.2 },
      { label: 'Média 2º Bimestre', shortLabel: '2º BIMESTRE', leitura: 47.9, leituraTurma: 45.0, matematica: 71.0, matematicaTurma: 69.5 },
      { label: 'Média 3º Bimestre', shortLabel: '3º BIMESTRE', leitura: 51.0, leituraTurma: 48.2, matematica: 73.4, matematicaTurma: 71.7 },
      { label: 'Média 4º Bimestre', shortLabel: '4º BIMESTRE', leitura: 54.8, leituraTurma: 50.4, matematica: 77.9, matematicaTurma: 75.8 }
    ],
    Ano: [
      { label: '2023', shortLabel: '2023', leitura: 38.2, leituraTurma: 41.0, matematica: 48.2, matematicaTurma: 51.5 },
      { label: '2024', shortLabel: '2024', leitura: 41.3, leituraTurma: 42.8, matematica: 68.9, matematicaTurma: 77.0 },
      { label: '2025', shortLabel: '2025', leitura: 51.7, leituraTurma: 47.8, matematica: 75.6, matematicaTurma: 72.2 },
      { label: '2026', shortLabel: '2026', leitura: 67.6, leituraTurma: 56.2, matematica: 86.6, matematicaTurma: 77.8 }
    ]
  }
};

export const EVOLUCAO_DATA = EVOLUCAO_DATA_BY_YEAR['2024'];

// ─────────────────────────────────────────────────────────────────────────────
// DOMÍNIOS COGNITIVOS E DE REPERTÓRIO POR ANO
// ─────────────────────────────────────────────────────────────────────────────
export const DOMINIOS_DATA_BY_YEAR = {
  '2023': {
    CognitivoMatematica: [
      { nome: 'Raciocinar para Matemática', score: 62, color: '#FACC15' },
      { nome: 'Resolver Problemas', score: 58, color: '#FACC15' },
      { nome: 'Reconhecer Conceitos e Fórmulas', score: 45, color: '#FACC15' },
      { nome: 'Aplicar Algoritmos e Métodos', score: 52, color: '#FACC15' }
    ],
    CognitivoLeitura: [
      { nome: 'Raciocinar para Leitura', score: 60, color: '#FACC15' },
      { nome: 'Interpretar e Inferir Sentido', score: 64, color: '#FACC15' },
      { nome: 'Localizar Informações Explícitas', score: 55, color: '#FACC15' },
      { nome: 'Avaliar Recursos Linguísticos', score: 48, color: '#FACC15' }
    ],
    RepertorioMatematica: [
      { nome: 'Álgebra e Funções', score: 42, color: '#FACC15' },
      { nome: 'Geometria e Medidas', score: 58, color: '#FACC15' },
      { nome: 'Estatística e Probabilidade', score: 64, color: '#FACC15' },
      { nome: 'Grandezas e Proporcionalidade', score: 55, color: '#FACC15' }
    ],
    RepertorioLeitura: [
      { nome: 'Produção de Texto', score: 45, color: '#FACC15' },
      { nome: 'Análise Linguística', score: 52, color: '#FACC15' },
      { nome: 'Leitura e Compreensão de Texto', score: 65, color: '#FACC15' },
      { nome: 'Literatura', score: 40, color: '#F87171' }
    ]
  },
  '2024': {
    CognitivoMatematica: [
      { nome: 'Raciocinar para Matemática', score: 74, color: '#4ADE80' },
      { nome: 'Resolver Problemas', score: 70, color: '#4ADE80' },
      { nome: 'Reconhecer Conceitos e Fórmulas', score: 52, color: '#FACC15' },
      { nome: 'Aplicar Algoritmos e Métodos', score: 66, color: '#4ADE80' }
    ],
    CognitivoLeitura: [
      { nome: 'Raciocinar para Leitura', score: 72, color: '#4ADE80' },
      { nome: 'Interpretar e Inferir Sentido', score: 75, color: '#4ADE80' },
      { nome: 'Localizar Informações Explícitas', score: 65, color: '#4ADE80' },
      { nome: 'Avaliar Recursos Linguísticos', score: 58, color: '#FACC15' }
    ],
    RepertorioMatematica: [
      { nome: 'Álgebra e Funções', score: 50, color: '#FACC15' },
      { nome: 'Geometria e Medidas', score: 72, color: '#4ADE80' },
      { nome: 'Estatística e Probabilidade', score: 76, color: '#4ADE80' },
      { nome: 'Grandezas e Proporcionalidade', score: 68, color: '#4ADE80' }
    ],
    RepertorioLeitura: [
      { nome: 'Produção de Texto', score: 55, color: '#FACC15' },
      { nome: 'Análise Linguística', score: 64, color: '#4ADE80' },
      { nome: 'Leitura e Compreensão de Texto', score: 76, color: '#4ADE80' },
      { nome: 'Literatura', score: 46, color: '#FACC15' }
    ]
  },
  '2025': {
    CognitivoMatematica: [
      { nome: 'Raciocinar para Matemática', score: 87, color: '#4ADE80' },
      { nome: 'Resolver Problemas', score: 83, color: '#4ADE80' },
      { nome: 'Reconhecer Conceitos e Fórmulas', score: 56, color: '#FACC15' },
      { nome: 'Aplicar Algoritmos e Métodos', score: 78, color: '#4ADE80' }
    ],
    CognitivoLeitura: [
      { nome: 'Raciocinar para Leitura', score: 85, color: '#4ADE80' },
      { nome: 'Interpretar e Inferir Sentido', score: 88, color: '#4ADE80' },
      { nome: 'Localizar Informações Explícitas', score: 72, color: '#4ADE80' },
      { nome: 'Avaliar Recursos Linguísticos', score: 64, color: '#4ADE80' }
    ],
    RepertorioMatematica: [
      { nome: 'Álgebra e Funções', score: 56, color: '#FACC15' },
      { nome: 'Geometria e Medidas', score: 83, color: '#4ADE80' },
      { nome: 'Estatística e Probabilidade', score: 87, color: '#4ADE80' },
      { nome: 'Grandezas e Proporcionalidade', score: 78, color: '#4ADE80' }
    ],
    RepertorioLeitura: [
      { nome: 'Produção de Texto', score: 64, color: '#4ADE80' },
      { nome: 'Análise Linguística', score: 72, color: '#4ADE80' },
      { nome: 'Leitura e Compreensão de Texto', score: 88, color: '#4ADE80' },
      { nome: 'Literatura', score: 50, color: '#FACC15' }
    ]
  },
  '2026': {
    CognitivoMatematica: [
      { nome: 'Raciocinar para Matemática', score: 94, color: '#4ADE80' },
      { nome: 'Resolver Problemas', score: 91, color: '#4ADE80' },
      { nome: 'Reconhecer Conceitos e Fórmulas', score: 78, color: '#4ADE80' },
      { nome: 'Aplicar Algoritmos e Métodos', score: 88, color: '#4ADE80' }
    ],
    CognitivoLeitura: [
      { nome: 'Raciocinar para Leitura', score: 92, color: '#4ADE80' },
      { nome: 'Interpretar e Inferir Sentido', score: 95, color: '#4ADE80' },
      { nome: 'Localizar Informações Explícitas', score: 86, color: '#4ADE80' },
      { nome: 'Avaliar Recursos Linguísticos', score: 79, color: '#4ADE80' }
    ],
    RepertorioMatematica: [
      { nome: 'Álgebra e Funções', score: 72, color: '#4ADE80' },
      { nome: 'Geometria e Medidas', score: 92, color: '#4ADE80' },
      { nome: 'Estatística e Probabilidade', score: 95, color: '#4ADE80' },
      { nome: 'Grandezas e Proporcionalidade', score: 88, color: '#4ADE80' }
    ],
    RepertorioLeitura: [
      { nome: 'Produção de Texto', score: 78, color: '#4ADE80' },
      { nome: 'Análise Linguística', score: 84, color: '#4ADE80' },
      { nome: 'Leitura e Compreensão de Texto', score: 96, color: '#4ADE80' },
      { nome: 'Literatura', score: 68, color: '#4ADE80' }
    ]
  },
  'Todos': {
    CognitivoMatematica: [
      { nome: 'Raciocinar para Matemática', score: 80, color: '#4ADE80' },
      { nome: 'Resolver Problemas', score: 76, color: '#4ADE80' },
      { nome: 'Reconhecer Conceitos e Fórmulas', score: 58, color: '#FACC15' },
      { nome: 'Aplicar Algoritmos e Métodos', score: 72, color: '#4ADE80' }
    ],
    CognitivoLeitura: [
      { nome: 'Raciocinar para Leitura', score: 78, color: '#4ADE80' },
      { nome: 'Interpretar e Inferir Sentido', score: 82, color: '#4ADE80' },
      { nome: 'Localizar Informações Explícitas', score: 70, color: '#4ADE80' },
      { nome: 'Avaliar Recursos Linguísticos', score: 63, color: '#4ADE80' }
    ],
    RepertorioMatematica: [
      { nome: 'Álgebra e Funções', score: 55, color: '#FACC15' },
      { nome: 'Geometria e Medidas', score: 77, color: '#4ADE80' },
      { nome: 'Estatística e Probabilidade', score: 81, color: '#4ADE80' },
      { nome: 'Grandezas e Proporcionalidade', score: 73, color: '#4ADE80' }
    ],
    RepertorioLeitura: [
      { nome: 'Produção de Texto', score: 61, color: '#4ADE80' },
      { nome: 'Análise Linguística', score: 69, color: '#4ADE80' },
      { nome: 'Leitura e Compreensão de Texto', score: 82, color: '#4ADE80' },
      { nome: 'Literatura', score: 51, color: '#FACC15' }
    ]
  }
};

export const DOMINIOS_DATA = DOMINIOS_DATA_BY_YEAR['2024'];

// ─────────────────────────────────────────────────────────────────────────────
// TESTES DO ESTUDANTE POR ANO
// ─────────────────────────────────────────────────────────────────────────────
export const TESTS_DATA_BY_YEAR = {
  '2023': [
    { id: 'T1', score: 45, month: 'Mar', monthGroup: 'Mar', empty: false, concept: { green: 20, yellow: 45, red: 25, blue: 10, white: 0 } },
    { id: 'T2', score: 55, month: 'Mar', monthGroup: 'Mar', empty: false, concept: { green: 35, yellow: 40, red: 20, blue: 5, white: 0 } },
    { id: 'T3', score: 0, month: 'Mai', monthGroup: 'Mai', empty: true, concept: { green: 0, yellow: 0, red: 0, blue: 0, white: 0 } },
    { id: 'T4', score: 62, month: 'Mai', monthGroup: 'Mai', empty: false, concept: { green: 45, yellow: 35, red: 15, blue: 5, white: 0 } },
    { id: 'T5', score: 68, month: 'Ago', monthGroup: 'Ago', empty: false, concept: { green: 55, yellow: 25, red: 15, blue: 5, white: 0 } },
    { id: 'T6', score: 58, month: 'Ago', monthGroup: 'Ago', empty: false, concept: { green: 40, yellow: 40, red: 15, blue: 5, white: 0 } },
    { id: 'T7', score: 72, month: 'Nov', monthGroup: 'Nov', empty: false, concept: { green: 65, yellow: 20, red: 10, blue: 5, white: 0 } },
    { id: 'T8', score: 70, month: 'Nov', monthGroup: 'Nov', empty: false, concept: { green: 60, yellow: 25, red: 10, blue: 5, white: 0 } }
  ],
  '2024': [
    { id: 'T4', score: 42, month: 'Mar', monthGroup: 'Mar', empty: false, concept: { green: 17, yellow: 56, red: 11, blue: 10, white: 6 } },
    { id: 'T5', score: 75, month: 'Mar', monthGroup: 'Mar', empty: false, concept: { green: 83, yellow: 9, red: 0, blue: 4, white: 4 } },
    { id: 'T6', score: 100, month: 'Mar', monthGroup: 'Mar', empty: false, concept: { green: 82, yellow: 11, red: 7, blue: 0, white: 0 } },
    { id: 'T7', score: 0, month: 'Abr', monthGroup: 'Abr', empty: true, concept: { green: 0, yellow: 0, red: 0, blue: 0, white: 0 } },
    { id: 'T8', score: 92, month: 'Abr', monthGroup: 'Abr', empty: false, concept: { green: 85, yellow: 7, red: 5, blue: 3, white: 0 } },
    { id: 'T9', score: 95, month: 'Abr', monthGroup: 'Abr', empty: false, concept: { green: 82, yellow: 11, red: 7, blue: 0, white: 0 } },
    { id: 'T13', score: 85, month: 'Ago', monthGroup: 'Ago', empty: false, concept: { green: 74, yellow: 18, red: 4, blue: 0, white: 4 } },
    { id: 'T14', score: 0, month: 'Ago', monthGroup: 'Ago', empty: true, concept: { green: 0, yellow: 0, red: 0, blue: 0, white: 0 } },
    { id: 'T15', score: 85, month: 'Ago', monthGroup: 'Ago', empty: false, concept: { green: 87, yellow: 10, red: 3, blue: 0, white: 0 } },
    { id: 'T16', score: 95, month: 'Out', monthGroup: 'Out', empty: false, concept: { green: 85, yellow: 12, red: 3, blue: 0, white: 0 } },
    { id: 'T17', score: 92, month: 'Out', monthGroup: 'Out', empty: false, concept: { green: 86, yellow: 11, red: 3, blue: 0, white: 0 } },
    { id: 'T18', score: 92, month: 'Out', monthGroup: 'Out', empty: false, concept: { green: 84, yellow: 11, red: 5, blue: 0, white: 0 } }
  ],
  '2025': [
    { id: 'T1', score: 65, month: 'Fev', monthGroup: 'Fev', empty: false, concept: { green: 55, yellow: 30, red: 10, blue: 5, white: 0 } },
    { id: 'T2', score: 72, month: 'Fev', monthGroup: 'Fev', empty: false, concept: { green: 65, yellow: 25, red: 8, blue: 2, white: 0 } },
    { id: 'T3', score: 78, month: 'Abr', monthGroup: 'Abr', empty: false, concept: { green: 72, yellow: 18, red: 6, blue: 4, white: 0 } },
    { id: 'T4', score: 82, month: 'Abr', monthGroup: 'Abr', empty: false, concept: { green: 78, yellow: 15, red: 5, blue: 2, white: 0 } },
    { id: 'T5', score: 85, month: 'Jun', monthGroup: 'Jun', empty: false, concept: { green: 82, yellow: 12, red: 4, blue: 2, white: 0 } },
    { id: 'T6', score: 80, month: 'Jun', monthGroup: 'Jun', empty: false, concept: { green: 75, yellow: 18, red: 5, blue: 2, white: 0 } },
    { id: 'T7', score: 0, month: 'Ago', monthGroup: 'Ago', empty: true, concept: { green: 0, yellow: 0, red: 0, blue: 0, white: 0 } },
    { id: 'T8', score: 88, month: 'Ago', monthGroup: 'Ago', empty: false, concept: { green: 85, yellow: 10, red: 3, blue: 2, white: 0 } },
    { id: 'T9', score: 86, month: 'Out', monthGroup: 'Out', empty: false, concept: { green: 84, yellow: 11, red: 3, blue: 2, white: 0 } },
    { id: 'T10', score: 92, month: 'Out', monthGroup: 'Out', empty: false, concept: { green: 90, yellow: 7, red: 2, blue: 1, white: 0 } },
    { id: 'T11', score: 90, month: 'Dez', monthGroup: 'Dez', empty: false, concept: { green: 88, yellow: 8, red: 2, blue: 2, white: 0 } },
    { id: 'T12', score: 94, month: 'Dez', monthGroup: 'Dez', empty: false, concept: { green: 92, yellow: 5, red: 2, blue: 1, white: 0 } }
  ],
  '2026': [
    { id: 'T1', score: 78, month: 'Jan', monthGroup: 'Jan', empty: false, concept: { green: 75, yellow: 15, red: 5, blue: 5, white: 0 } },
    { id: 'T2', score: 84, month: 'Jan', monthGroup: 'Jan', empty: false, concept: { green: 80, yellow: 15, red: 3, blue: 2, white: 0 } },
    { id: 'T3', score: 88, month: 'Fev', monthGroup: 'Fev', empty: false, concept: { green: 85, yellow: 10, red: 3, blue: 2, white: 0 } },
    { id: 'T4', score: 92, month: 'Fev', monthGroup: 'Fev', empty: false, concept: { green: 90, yellow: 7, red: 2, blue: 1, white: 0 } },
    { id: 'T5', score: 95, month: 'Abr', monthGroup: 'Abr', empty: false, concept: { green: 92, yellow: 5, red: 2, blue: 1, white: 0 } },
    { id: 'T6', score: 90, month: 'Abr', monthGroup: 'Abr', empty: false, concept: { green: 88, yellow: 8, red: 3, blue: 1, white: 0 } },
    { id: 'T7', score: 98, month: 'Mai', monthGroup: 'Mai', empty: false, concept: { green: 96, yellow: 3, red: 1, blue: 0, white: 0 } },
    { id: 'T8', score: 94, month: 'Jun', monthGroup: 'Jun', empty: false, concept: { green: 92, yellow: 5, red: 2, blue: 1, white: 0 } },
    { id: 'T9', score: 96, month: 'Ago', monthGroup: 'Ago', empty: false, concept: { green: 94, yellow: 4, red: 1, blue: 1, white: 0 } },
    { id: 'T10', score: 100, month: 'Dez', monthGroup: 'Dez', empty: false, concept: { green: 98, yellow: 2, red: 0, blue: 0, white: 0 } }
  ]
};

export const TESTS_DATA_STANDARD = TESTS_DATA_BY_YEAR['2024'];

export const TESTS_DATA_EXTENDED = [
  { id: 'T1', score: 38, month: 'Jan', monthGroup: 'Jan', empty: false, concept: { green: 10, yellow: 35, red: 45, blue: 10, white: 0 } },
  { id: 'T2', score: 58, month: 'Jan', monthGroup: 'Jan', empty: false, concept: { green: 25, yellow: 50, red: 15, blue: 10, white: 0 } },
  { id: 'T3', score: 48, month: 'Mar', monthGroup: 'Mar', empty: false, concept: { green: 20, yellow: 45, red: 25, blue: 10, white: 0 } },
  { id: 'T4', score: 0, month: 'Mar', monthGroup: 'Mar', empty: true, concept: { green: 0, yellow: 0, red: 0, blue: 0, white: 0 } },
  { id: 'T5', score: 75, month: 'Mar', monthGroup: 'Mar', empty: false, concept: { green: 75, yellow: 15, red: 10, blue: 0, white: 0 } },
  { id: 'T6', score: 68, month: 'Mar', monthGroup: 'Mar', empty: false, concept: { green: 70, yellow: 20, red: 10, blue: 0, white: 0 } },
  { id: 'T7', score: 95, month: 'Abr', monthGroup: 'Abr', empty: false, concept: { green: 90, yellow: 8, red: 2, blue: 0, white: 0 } },
  { id: 'T8', score: 78, month: 'Abr', monthGroup: 'Abr', empty: false, concept: { green: 78, yellow: 15, red: 7, blue: 0, white: 0 } },
  { id: 'T9', score: 90, month: 'Jun', monthGroup: 'Jun', empty: false, concept: { green: 88, yellow: 8, red: 4, blue: 0, white: 0 } },
  { id: 'T10', score: 95, month: 'Jun', monthGroup: 'Jun', empty: false, concept: { green: 92, yellow: 5, red: 3, blue: 0, white: 0 } },
  { id: 'T11', score: 65, month: 'Jun', monthGroup: 'Jun', empty: false, concept: { green: 65, yellow: 25, red: 10, blue: 0, white: 0 } },
  { id: 'T12', score: 98, month: 'Jun', monthGroup: 'Jun', empty: false, concept: { green: 95, yellow: 3, red: 2, blue: 0, white: 0 } },
  { id: 'T13', score: 75, month: 'Ago', monthGroup: 'Ago', empty: false, concept: { green: 75, yellow: 15, red: 5, blue: 5, white: 0 } },
  { id: 'T14', score: 28, month: 'Ago', monthGroup: 'Ago', empty: false, concept: { green: 10, yellow: 20, red: 60, blue: 10, white: 0 } },
  { id: 'T15', score: 75, month: 'Ago', monthGroup: 'Ago', empty: false, concept: { green: 75, yellow: 18, red: 7, blue: 0, white: 0 } },
  { id: 'T16', score: 98, month: 'Out', monthGroup: 'Out', empty: false, concept: { green: 95, yellow: 3, red: 2, blue: 0, white: 0 } },
  { id: 'T17', score: 88, month: 'Out', monthGroup: 'Out', empty: false, concept: { green: 88, yellow: 8, red: 4, blue: 0, white: 0 } },
  { id: 'T18', score: 86, month: 'Out', monthGroup: 'Out', empty: false, concept: { green: 86, yellow: 10, red: 4, blue: 0, white: 0 } },
  { id: 'T19', score: 92, month: 'Dez', monthGroup: 'Dez', empty: false, concept: { green: 90, yellow: 7, red: 3, blue: 0, white: 0 } },
  { id: 'T20', score: 95, month: 'Dez', monthGroup: 'Dez', empty: false, concept: { green: 92, yellow: 5, red: 3, blue: 0, white: 0 } }
];

export const HEATMAP_DATA = {
  leitura: {
    columns: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10'],
    rows: [
      { id: 'Pro', label: 'Pro', title: 'Produção de Texto', cells: [50, 0, 25, 75, 0, 75, 75, 75, 75, 75] },
      { id: 'Lin', label: 'Lin', title: 'Análise Linguística', cells: [10, 25, 50, 65, 100, 85, 85, 85, 85, 85] },
      { id: 'Lei', label: 'Lei', title: 'Leitura e Compreensão', cells: [60, 65, 55, 0, 95, 25, 25, 25, 25, 25] },
      { id: 'Lit', label: 'Lit', title: 'Literatura', cells: [50, 10, 60, 95, 25, 95, 95, 95, 95, 95] }
    ]
  },
  matematica: {
    columns: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6'],
    rows: [
      { id: 'Alg', label: 'Alg', title: 'Álgebra e Funções', cells: [55, 0, 25, 75, 0, 75] },
      { id: 'Geo', label: 'Geo', title: 'Geometria e Medidas', cells: [15, 25, 50, 65, 95, 85] },
      { id: 'Est', label: 'Est', title: 'Estatística e Probabilidade', cells: [60, 65, 55, 0, 95, 25] },
      { id: 'Pro', label: 'Pro', title: 'Grandezas e Proporcionalidade', cells: [50, 10, 60, 95, 25, 95] }
    ]
  }
};

// ─────────────────────────────────────────────────────────────────────────────
// LINHA DO TEMPO: DADOS, MESES E EVENTOS ESPECÍFICOS POR ANO
// ─────────────────────────────────────────────────────────────────────────────
export const TIMELINE_DATA_BY_YEAR = {
  2023: {
    year: 2023,
    months: ['Mar', 'Jun', 'Nov'],
    prevYearText: 'No ano anterior...',
    prevYearSummary: {
      target: 'Desempenho no 5º Ano do Ensino Fundamental',
      concept: 'Parcialmente Suficiente',
      segments: { branco: 8, azul: 12, vermelho: 30, amarelo: 35, verde: 15 }
    },
    sections: [
      {
        id: 'timeline-mar',
        month: 'março',
        side: 'right',
        events: [
          {
            type: 'text',
            text: 'Roberto transferido para a EEM José Militão 6º ano B'
          },
          {
            type: 'evaluation',
            target: 'Desempenho Inicial de Roberto',
            title: 'Avaliação Diagnóstica de Entrada Saeb 2023',
            scale: 'Larga Escala',
            concept: 'Insuficiente',
            barType: 'hibrido',
            segments: { branco: 5, azul: 10, vermelho: 55, amarelo: 20, verde: 10 }
          }
        ]
      },
      {
        id: 'timeline-jun',
        month: 'junho',
        side: 'left',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho no 1º Semestre de Roberto',
            title: 'Conselho de Classe e Avaliação Semestral',
            scale: 'Larga Escala',
            concept: 'Parcialmente Suficiente',
            barType: 'hibrido',
            segments: { branco: 4, azul: 6, vermelho: 25, amarelo: 45, verde: 20 }
          }
        ]
      },
      {
        id: 'timeline-nov',
        month: 'novembro',
        side: 'right',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho Final de Roberto no 6º ano',
            title: 'Avaliação Formativa de Fechamento de Ciclo',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 3, azul: 5, vermelho: 12, amarelo: 20, verde: 60 }
          }
        ]
      }
    ],
    nextYearPreview: 'no começo de 2024...'
  },

  2024: {
    year: 2024,
    months: ['Fev', 'Mai', 'Ago', 'Dez'],
    prevYearText: 'No ano anterior...',
    prevYearSummary: {
      target: 'Desempenho em 2023 de Roberto',
      concept: 'Parcialmente Suficiente',
      segments: { branco: 6, azul: 8, vermelho: 22, amarelo: 40, verde: 24 }
    },
    sections: [
      {
        id: 'timeline-fev',
        month: 'fevereiro',
        side: 'right',
        events: [
          {
            type: 'text',
            text: 'Roberto entrou na turma virtual Reforço de Leitura 7º B'
          },
          {
            type: 'evaluation',
            target: 'Desempenho Inicial em Leitura de Roberto',
            title: 'Avaliação Diagnóstica de Entrada - Língua Portuguesa',
            scale: 'Pequena Escala',
            concept: 'Parcialmente Suficiente',
            barType: 'hibrido',
            segments: { branco: 5, azul: 8, vermelho: 20, amarelo: 47, verde: 20 }
          }
        ]
      },
      {
        id: 'timeline-mai',
        month: 'maio',
        side: 'left',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho em Matemática Básica de Roberto',
            title: 'Simulado Múltipla Escolha - Geometria e Álgebra',
            scale: 'Pequena Escala',
            concept: 'Correto',
            barType: 'multipla_escolha',
            segments: { branco: 5, vermelho: 22, verde: 73 }
          }
        ]
      },
      {
        id: 'timeline-ago',
        month: 'agosto',
        side: 'right',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho em Agosto de Roberto',
            title: 'Avaliação Formativa Intermediária 2',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 4, azul: 6, vermelho: 15, amarelo: 20, verde: 55 }
          }
        ]
      },
      {
        id: 'timeline-dez',
        month: 'dezembro',
        side: 'left',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho Final de Roberto no 7º ano',
            title: 'Avaliação Somativa Final do 7º ano',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 3, azul: 5, vermelho: 12, amarelo: 15, verde: 65 }
          }
        ]
      }
    ],
    nextYearPreview: 'no começo de 2025...'
  },

  2025: {
    year: 2025,
    months: ['Jan', 'Mar', 'Jun', 'Set', 'Dez'],
    prevYearText: 'No ano anterior...',
    prevYearSummary: {
      target: 'Desempenho em 2024 de Roberto',
      concept: 'Suficiente',
      segments: { branco: 4, azul: 6, vermelho: 14, amarelo: 22, verde: 54 }
    },
    sections: [
      {
        id: 'timeline-jan',
        month: 'janeiro',
        side: 'right',
        events: [
          {
            type: 'text',
            text: 'Roberto entrou na turma real 8º ano A'
          },
          {
            type: 'evaluation',
            target: 'Desempenho Geral de Roberto',
            title: 'Avaliação Conceitual Somativa de Entrada',
            scale: 'Pequena Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 4, azul: 5, vermelho: 12, amarelo: 18, verde: 61 }
          }
        ]
      },
      {
        id: 'timeline-mar',
        month: 'março',
        side: 'left',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho em Março de Roberto',
            title: 'Avaliação Formativa Diagnóstica Estadual',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 3, azul: 4, vermelho: 10, amarelo: 16, verde: 67 }
          }
        ]
      },
      {
        id: 'timeline-jun',
        month: 'junho',
        side: 'right',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho no 1º Semestre de Roberto',
            title: 'Conselho de Classe e Fechamento Semestral',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 3, azul: 4, vermelho: 9, amarelo: 14, verde: 70 }
          }
        ]
      },
      {
        id: 'timeline-set',
        month: 'setembro',
        side: 'left',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho em Raciocínio Lógico',
            title: 'Simulado Múltipla Escolha - Olimpíada de Matemática',
            scale: 'Pequena Escala',
            concept: 'Correto',
            barType: 'multipla_escolha',
            segments: { branco: 3, vermelho: 15, verde: 82 }
          }
        ]
      },
      {
        id: 'timeline-dez',
        month: 'dezembro',
        side: 'right',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho Final no 8º ano de Roberto',
            title: 'Avaliação Somativa Anual Saeb 2025',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 2, azul: 3, vermelho: 8, amarelo: 12, verde: 75 }
          }
        ]
      }
    ],
    nextYearPreview: 'no começo de 2026...'
  },

  2026: {
    year: 2026,
    months: ['Jan', 'Fev', 'Abr', 'Mai', 'Jun', 'Ago', 'Dez'],
    prevYearText: 'No ano anterior...',
    prevYearSummary: {
      target: 'Desempenho em 2025 de Roberto',
      concept: 'Suficiente',
      segments: { branco: 5, azul: 5, vermelho: 15, amarelo: 25, verde: 50 }
    },
    sections: [
      {
        id: 'timeline-jan',
        month: 'janeiro',
        side: 'left',
        events: [
          {
            type: 'text',
            text: 'Roberto entrou na turma real 9º ano B'
          },
          {
            type: 'evaluation',
            target: 'Desempenho Geral de Roberto',
            title: 'Avaliação Conceitual Somativa Inicial',
            scale: 'Pequena Escala',
            concept: 'Parcialmente Suficiente',
            barType: 'hibrido',
            segments: { branco: 5, azul: 8, vermelho: 12, amarelo: 55, verde: 20 }
          }
        ]
      },
      {
        id: 'timeline-fev',
        month: 'fevereiro',
        side: 'right',
        events: [
          {
            type: 'text',
            text: 'Roberto entrou na turma virtual Reforço de Cultura 6º'
          },
          {
            type: 'evaluation',
            target: 'Desempenho Geral de Roberto',
            title: 'Avaliação Conceitual Somativa Inicial',
            scale: 'Pequena Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 3, azul: 5, vermelho: 10, amarelo: 18, verde: 64 },
            expandable: true,
            subtests: [
              {
                id: 'T07',
                title: 'Tabuada de 7 somativa',
                scale: 'Pequena Escala',
                concept: 'Parcialmente Suficiente',
                barType: 'hibrido',
                segments: { branco: 5, azul: 8, vermelho: 12, amarelo: 55, verde: 20 }
              },
              {
                id: 'T08',
                title: 'Tabuada de 8 somativa',
                scale: 'Pequena Escala',
                concept: 'Suficiente',
                barType: 'hibrido',
                segments: { branco: 5, azul: 10, vermelho: 3, amarelo: 12, verde: 70 }
              }
            ]
          }
        ]
      },
      {
        id: 'timeline-abr',
        month: 'abril',
        side: 'left',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho em Abril de Roberto',
            title: 'Avaliação Formativa Intermediária 1',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 4, azul: 6, vermelho: 15, amarelo: 25, verde: 50 }
          }
        ]
      },
      {
        id: 'timeline-mai',
        month: 'maio',
        side: 'right',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho em Maio de Roberto',
            title: 'Simulado Múltipla Escolha - Matemática Básica',
            scale: 'Pequena Escala',
            concept: 'Correto',
            barType: 'multipla_escolha',
            segments: { branco: 5, vermelho: 20, verde: 75 }
          }
        ]
      },
      {
        id: 'timeline-jun',
        month: 'junho',
        side: 'left',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho no 1º Semestre de Roberto',
            title: 'Conselho de Classe e Fechamento do 1º Semestre',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 3, azul: 5, vermelho: 12, amarelo: 20, verde: 60 }
          }
        ]
      },
      {
        id: 'timeline-ago',
        month: 'agosto',
        side: 'right',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho em Agosto de Roberto',
            title: 'Avaliação Diagnóstica de Retorno - 2º Semestre',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 4, azul: 7, vermelho: 11, amarelo: 18, verde: 60 }
          }
        ]
      },
      {
        id: 'timeline-dez',
        month: 'dezembro',
        side: 'left',
        events: [
          {
            type: 'evaluation',
            target: 'Desempenho Final de Roberto',
            title: 'Avaliação Somativa Final Saeb 2026',
            scale: 'Larga Escala',
            concept: 'Suficiente',
            barType: 'hibrido',
            segments: { branco: 2, azul: 4, vermelho: 10, amarelo: 14, verde: 70 }
          }
        ]
      }
    ],
    nextYearPreview: 'no começo do ano posterior...'
  }
};
