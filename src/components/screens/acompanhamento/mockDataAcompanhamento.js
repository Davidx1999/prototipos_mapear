export const STUDENTS = [
  {
    id: 'anasofia',
    username: 'anasofia.martins',
    name: 'Ana Sofia Martins de Oliveira',
    shortName: 'Ana Sofia Martins...',
    school: 'Escola Municipal José de Alencar',
    grade: '7º ano EF',
    classGroup: 'B',
    status: 'Ativo',
    state: 'CE',
    city: 'Fortaleza',
    year: 2023
  },
  {
    id: 'roberto',
    username: 'roberto.carlos',
    name: 'Roberto Carlos da Silva Júnior Melendez Neto',
    shortName: 'Roberto Carlos...',
    school: 'Liceu do Conjunto Ceará',
    grade: '1º ano',
    classGroup: 'B',
    status: 'Ativo',
    state: 'CE',
    city: 'Fortaleza',
    year: 2023
  },
  {
    id: 'lorem',
    username: 'lorem.ipsum',
    name: 'Lorem Ipsum Dolor',
    shortName: 'Lorem Ipsum Dolor',
    school: 'Liceu do Conjunto Ceará',
    grade: '1º ano',
    classGroup: 'B',
    status: 'Ativo',
    state: 'CE',
    city: 'Fortaleza',
    year: 2023
  }
];

export const YEARS_LIST = [
  'Todos',
  '2015',
  '2016',
  '2017',
  '2018',
  '2019',
  '2020',
  '2021',
  '2022'
];

export const METRIC_INDICATORS = {
  percentage: {
    acertos: { value: '78%', raw: 78, label: 'Percentual de Acertos', tooltip: 'Média de acertos do aluno baseado no cálculo da Teoria Clássica dos Testes (TCT).' },
    avaliacoes: { value: '120', raw: 120, label: 'Avaliações Realizadas', tooltip: 'Quantidade de Avaliações que o(a) aluno(a) realizou na sua trajetória.' },
    itens: { value: '7.000', raw: 7000, label: 'Itens Resolvidos', tooltip: 'Quantidade de Itens respondidos pelo(a) aluno(a) nas avaliações.' },
    intervencoes: { value: '2', raw: 2, label: 'Total de Intervenções', tooltip: 'Quantidade de vezes em que o(a) aluno(a) precisou de intervenções para melhorar o desempenho.' }
  },
  fraction: {
    acertos: { value: '387 / 500', raw: 77.4, label: 'Percentual de Acertos', tooltip: 'Pontuação acumulada do aluno na escala TRI das avaliações realizadas.' },
    avaliacoes: { value: '120 / 144', raw: 83.3, label: 'Avaliações Realizadas', tooltip: 'Avaliações concluídas em relação ao total previsto no currículo escolar.' },
    itens: { value: '5.460 / 7.000', raw: 78.0, label: 'Itens Resolvidos', tooltip: 'Total de itens válidos respondidos em relação aos cadernos distribuídos.' },
    intervencoes: { value: '2 / 5', raw: 40.0, label: 'Total de Intervenções', tooltip: 'Intervenções pedagógicas registradas com acompanhamento ativo.' }
  }
};

export const EVOLUCAO_DATA = {
  Semestre: [
    {
      label: 'Semestre 1 | Janeiro a Junho',
      shortLabel: '1º Semestre',
      leitura: 41.0,
      leituraTurma: 42.5,
      matematica: 61.5,
      matematicaTurma: 67.8
    },
    {
      label: 'Semestre 2 | Julho a Dezembro',
      shortLabel: '2º SEMESTRE',
      leitura: 41.61,
      leituraTurma: 43.17,
      matematica: 76.28,
      matematicaTurma: 86.12
    }
  ],
  Bimestre: [
    {
      label: 'Mar | Abr',
      shortLabel: '1º BIMESTRE | MAR - ABR',
      leitura: 46.0,
      leituraTurma: 40.0,
      matematica: 39.5,
      matematicaTurma: 36.8
    },
    {
      label: 'Mai | Jun',
      shortLabel: '2º BIMESTRE | MAI - JUN',
      leitura: 38.02,
      leituraTurma: 37.17,
      matematica: 78.43,
      matematicaTurma: 81.89
    },
    {
      label: 'Ago | Set',
      shortLabel: '3º BIMESTRE | AGO - SET',
      leitura: 42.1,
      leituraTurma: 44.5,
      matematica: 74.5,
      matematicaTurma: 78.0
    },
    {
      label: 'Out | Nov',
      shortLabel: '4º BIMESTRE | OUT - NOV',
      leitura: 43.8,
      leituraTurma: 46.2,
      matematica: 79.8,
      matematicaTurma: 83.4
    }
  ],
  Ano: [
    { label: 'Jan', shortLabel: 'JAN', leitura: 49.0, leituraTurma: 43.0, matematica: 42.0, matematicaTurma: 38.0 },
    { label: 'Abr', shortLabel: 'ABR', leitura: 44.0, leituraTurma: 41.0, matematica: 39.0, matematicaTurma: 37.0 },
    { label: 'Jun', shortLabel: 'JUN', leitura: 41.0, leituraTurma: 42.0, matematica: 80.0, matematicaTurma: 70.0 },
    { label: 'Jul', shortLabel: 'JUL', leitura: 43.0, leituraTurma: 44.0, matematica: 65.0, matematicaTurma: 68.0 },
    { label: 'Ago', shortLabel: 'AGO', leitura: 40.0, leituraTurma: 42.0, matematica: 68.0, matematicaTurma: 75.0 },
    { label: 'Dez', shortLabel: 'DEZ', leitura: 64.0, leituraTurma: 46.0, matematica: 84.0, matematicaTurma: 77.0 }
  ]
};

export const DOMINIOS_DATA = {
  Cognitivo: [
    { nome: 'Reconhecer', score: 56, color: '#FACC15' },
    { nome: 'Aplicar', score: 83, color: '#4ADE80' },
    { nome: 'Raciocinar', score: 87, color: '#4ADE80' },
    { nome: 'Interpretar', score: 47, color: '#FACC15' }
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
};

export const TESTS_DATA_STANDARD = [
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
];

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

export const TIMELINE_STUDENT_DATA = [
  {
    month: 'Janeiro',
    items: [
      { type: 'text', content: 'Entrou na turma real 7º ano B' }
    ]
  },
  {
    month: 'Fevereiro',
    items: [
      { type: 'text', content: 'Entrou na turma virtual Reforço de Leitura' },
      { type: 'card', title: 'Ficou em 12º na avaliação CEM 8', rank: '12º de 150', scale: 'Larga Escala', score: 85 },
      { type: 'card', title: 'Ficou em 86º no teste de Álgebra Linear', rank: '86º de 150', scale: 'Pequena Escala', score: 45 }
    ]
  },
  {
    month: 'Abril',
    items: [
      { type: 'card', title: 'Ficou em 14º na avaliação Conceitual Somativa Inicial', rank: '14º de 150', scale: 'Larga Escala', score: 90 },
      { type: 'card', title: 'Ficou em 28º no teste de Leitura de 10 semanas', rank: '28º de 150', scale: 'Pequena Escala', score: 75 }
    ]
  },
  {
    month: 'Outubro',
    items: [
      { type: 'card', title: 'Alcançou desempenho Avançado no Simulado Diagnóstico Saeb 2023', rank: '8º de 150', scale: 'Larga Escala', score: 94 }
    ]
  }
];
