
export const mockAvaliacoes = [
  { id: '0018A', title: 'Aplicação Textos Dona Vassoura e Cadê a Água', status: 'Concluído', color: '#1D2432', bg: '#D1FAE5', type1: 'Somativa', type2: 'Correção com IA', tests: 0, dateStart: '28 Out, 2026', dateEnd: '30 Out, 2028' },
  { id: 'APFGVDGPE01', title: 'Avaliação Vincenzo', status: 'Em Andamento', color: '#1D2432', bg: '#FEF3C7', type1: 'Diagnóstica', type2: 'Correção Manual', tests: 15, dateStart: '28 Out, 2026', dateEnd: '30 Out, 2028' },
  { id: '0020A', title: 'Avaliação Matemática 4º e 5º - 01', status: 'Em Andamento', color: '#1D2432', bg: '#FEF3C7', type1: 'Somativa', type2: 'Correção Manual', tests: 221, dateStart: '28 Out, 2026', dateEnd: '30 Out, 2028' },
  { id: 'ID-LONGO-9999', title: 'Avaliação com título extremamente longo para testar a quebra de linha', status: 'Cancelado', color: '#1D2432', bg: '#FEE2E2', type1: 'Formativa', type2: 'Sem Correção', tests: 9999, dateStart: '01 Jan, 2026', dateEnd: '31 Dez, 2026' }
];

export const mockComponentes = [
  { cod: 'MAT', title: 'Matemática' },
  { cod: 'POR', title: 'Língua Portuguesa' }
];

export const mockDominios = [
  { cod: 'REC', title: 'Reconhecer', comp: 'Matemática' },
  { cod: 'APL', title: 'Aplicar', comp: 'Matemática' },
  { cod: 'RAC', title: 'Raciocinar', comp: 'Matemática' }
];

export const mockConhecimentos = [
  { cod: 'MAT.NUM', title: 'Números e Operações', dom: 'Álgebra e Funções', comp: 'Matemática' }
];

export const mockHabilidades = [
  { cod: 'EF03MA01', title: 'Ler, escrever e comparar números naturais até a ordem de dezenas de milhar...', conh: 'Números', domC: 'Aplicar', domR: 'Aritmética', comp: 'Matemática' },
  { cod: 'EF04MA02', title: 'Mostrar proficiência em frações simples...', conh: 'Frações', domC: 'Raciocinar', domR: 'Aritmética', comp: 'Matemática' }
];

export const mockRelacoes = [
  { origem: 'EF03MA01', rel: ['EF04MA01', 'EF05MA02'] }
];

export const mockUsuarios = [
  { id: 1, user: 'salviano', name: 'David Salviano', email: 'davidsalviano@gmail.com', role: 'ADM' },
  { id: 2, user: 'torres.yanna', name: 'Yanna Gonçalves', email: 'yannatorres@gmail.com', role: 'ADM' },
  { id: 3, user: 'user.name.very.long', name: 'Dom Pedro de Alcântara João Carlos', email: 'email.extremamente.longo@instituicao.gov.br', role: 'COORDENADOR' }
];

export const mockTimeline = [
  { month: 'Janeiro', items: [{ type: 'text', content: 'Roberto entrou na turma real 8º ano A' }] },
  {
    month: 'Fevereiro', items: [
      { type: 'text', content: 'Roberto entrou na turma virtual Reforço de Leitura 8º' },
      { type: 'card', title: 'Roberto ficou em 12º na avaliação CEM 8', rank: '12º de 150', score: 85 },
      { type: 'card', title: 'Roberto ficou em 86º no teste de Álgebra Linear', rank: '86º de 150', score: 45 }
    ]
  },
  {
    month: 'Abril', items: [
      { type: 'card', title: 'Roberto ficou em 14º na avaliação Avaliação Conceitual Somativa Inicial', rank: '14º de 150', score: 90 },
      { type: 'card', title: 'Roberto ficou em 28º no teste de Leitura de 10 semanas', rank: '28º de 150', score: 75 }
    ]
  }
];
