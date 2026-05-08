// --- CORES DO STATUS DO HEATMAP E VALORES PARA CÁLCULO ---
// (Mantenha o objeto statusColors e COLOR_PALETTES que já criámos)

// --- 1. MOCK DATA: GRUPOS DE COLUNAS POR CATEGORIA ---

// Mapa de agrupamento: cada chave é um critério de separação
export const colGroupsMap = {

  // 4 domínios da BNCC com 40 itens no total
  'Domínios Cognitivos': [
    {
      title: 'Recuperar Informação',
      cols: Array.from({ length: 8 }, (_, i) => ({ id: `I${i + 1}`, skills: ['Recuperar Informação'] }))
    },
    {
      title: 'Integrar e Interpretar',
      cols: Array.from({ length: 14 }, (_, i) => ({ id: `I${i + 9}`, skills: ['Integrar e Interpretar'] }))
    },
    {
      title: 'Refletir e Avaliar',
      cols: Array.from({ length: 10 }, (_, i) => ({ id: `I${i + 23}`, skills: ['Refletir e Avaliar'] }))
    },
    {
      title: 'Raciocínio Analítico',
      cols: Array.from({ length: 8 }, (_, i) => ({ id: `I${i + 33}`, skills: ['Raciocínio Analítico'] }))
    }
  ],

  // 4 tipos de tarefa com 10 itens cada
  'Tarefas': [
    {
      title: 'Interpretação Textual',
      cols: Array.from({ length: 10 }, (_, i) => ({ id: `I${i + 1}`, skills: ['Interpretação Textual'] }))
    },
    {
      title: 'Análise Crítica',
      cols: Array.from({ length: 10 }, (_, i) => ({ id: `I${i + 11}`, skills: ['Análise Crítica'] }))
    },
    {
      title: 'Resolução de Problemas',
      cols: Array.from({ length: 10 }, (_, i) => ({ id: `I${i + 21}`, skills: ['Resolução de Problemas'] }))
    },
    {
      title: 'Produção de Sentido',
      cols: Array.from({ length: 10 }, (_, i) => ({ id: `I${i + 31}`, skills: ['Produção de Sentido'] }))
    }
  ],

  // 5 domínios de repertório com 8 itens cada
  'Domínios de Repertório': [
    {
      title: 'Léxico e Semântica',
      cols: Array.from({ length: 8 }, (_, i) => ({ id: `I${i + 1}`, skills: ['Léxico e Semântica'] }))
    },
    {
      title: 'Contexto Sociocultural',
      cols: Array.from({ length: 8 }, (_, i) => ({ id: `I${i + 9}`, skills: ['Contexto Sociocultural'] }))
    },
    {
      title: 'Bagagem Científica',
      cols: Array.from({ length: 8 }, (_, i) => ({ id: `I${i + 17}`, skills: ['Bagagem Científica'] }))
    },
    {
      title: 'Expressão Artística',
      cols: Array.from({ length: 8 }, (_, i) => ({ id: `I${i + 25}`, skills: ['Expressão Artística'] }))
    },
    {
      title: 'Argumentação e Retórica',
      cols: Array.from({ length: 8 }, (_, i) => ({ id: `I${i + 33}`, skills: ['Argumentação e Retórica'] }))
    }
  ],

  // 2 grandes eixos de conhecimento com 20 itens cada
  'Conhecimentos': [
    {
      title: 'Linguagens e Ciências Humanas',
      cols: Array.from({ length: 20 }, (_, i) => ({ id: `I${i + 1}`, skills: ['Linguagens e Ciências Humanas'] }))
    },
    {
      title: 'Matemática e Ciências da Natureza',
      cols: Array.from({ length: 20 }, (_, i) => ({ id: `I${i + 21}`, skills: ['Matemática e Ciências da Natureza'] }))
    }
  ]
};

// Retrocompatibilidade: colGroups padrão aponta para Domínios Cognitivos
export const colGroups = colGroupsMap['Domínios Cognitivos'];


// --- 2. MOCK DATA: ALUNOS E DESEMPENHO ---
const baseStatusKeys = ['suficiente', 'parcialmente', 'insuficiente', 'sem_conteudo', 'branco'];

// Função auxiliar para gerar um padrão de respostas aleatório, mas realista
const generateAnswers = (bias = 'random') => {
  return Array.from({ length: 40 }, () => {
    const rand = Math.random();
    if (bias === 'good') {
      if (rand < 0.6) return 'suficiente';
      if (rand < 0.9) return 'parcialmente';
      return 'insuficiente';
    } else if (bias === 'bad') {
      if (rand < 0.5) return 'insuficiente';
      if (rand < 0.8) return 'parcialmente';
      if (rand < 0.9) return 'sem_conteudo';
      return 'suficiente';
    } else if (bias === 'empty') {
      return 'branco'; // Aluno que faltou ou entregou em branco
    }
    return baseStatusKeys[Math.floor(Math.random() * baseStatusKeys.length)];
  });
};

export const mockStudents = [
  // --- 9º ANO A (Desempenho Misto) ---
  { name: 'Ana Júlia da Silva', turma: '9º Ano A', data: generateAnswers('good') },
  { name: 'Carlos Eduardo Ferreira', turma: '9º Ano A', data: generateAnswers() },
  { name: 'Maria Vitória de Souza Mendes', turma: '9º Ano A', data: generateAnswers('good') },
  { name: 'Lucas Gabriel Rodrigues', turma: '9º Ano A', data: generateAnswers('bad') },
  { name: 'Henrique Santos (Faltou)', turma: '9º Ano A', data: generateAnswers('empty') },
  { name: 'Larissa Beatriz Lima', turma: '9º Ano A', data: generateAnswers() },
  { name: 'Pedro Henrique Almeida', turma: '9º Ano A', data: generateAnswers('good') },
  { name: 'Emilly Yasmin Costa', turma: '9º Ano A', data: generateAnswers('bad') },

  // --- 9º ANO B (Desempenho Geral Bom) ---
  { name: 'Rafaela Cristina dos Santos', turma: '9º Ano B', data: generateAnswers('good') },
  { name: 'Mateus Vinicius da Rosa', turma: '9º Ano B', data: generateAnswers('good') },
  { name: 'Isabelle Mirella Pinto', turma: '9º Ano B', data: generateAnswers('good') },
  { name: 'Kaio André Martins', turma: '9º Ano B', data: generateAnswers() },
  { name: 'Luana Rafaelly Barbosa', turma: '9º Ano B', data: generateAnswers('good') },
  { name: 'Natália Lorena Gomes', turma: '9º Ano B', data: generateAnswers('good') },
  { name: 'Bruno Cauã Carvalho', turma: '9º Ano B', data: generateAnswers('good') },
  { name: 'Taina Kelly Moura', turma: '9º Ano B', data: generateAnswers('empty') },

  // --- 9º ANO C (Desempenho com Dificuldades) ---
  { name: 'Gustavo Emanuel Teixeira', turma: '9º Ano C', data: generateAnswers('bad') },
  { name: 'Yuri Matheus Nascimento', turma: '9º Ano C', data: generateAnswers('bad') },
  { name: 'Samara Letícia Paiva', turma: '9º Ano C', data: generateAnswers('bad') },
  { name: 'Wesley Ramon Araújo', turma: '9º Ano C', data: generateAnswers() },
  { name: 'Caio Fernando Gomes', turma: '9º Ano C', data: generateAnswers('bad') },
  { name: 'Bárbara Evelyn Castro', turma: '9º Ano C', data: generateAnswers('bad') },
  { name: 'Marcos Vinícius Lima', turma: '9º Ano C', data: generateAnswers('empty') },
  { name: 'Sophia Vitória Moura', turma: '9º Ano C', data: generateAnswers('bad') },
];


// --- 3. MOCK DATA: CASCATA DE CONTEXTO (ÁRVORE COMPLEXA) ---
export const mockCascadeData = {
  'Ceará': {
    'Fortaleza': {
      'Regional 1': {
        'Liceu do Conjunto Ceará': {
          '9º Ano A': {
            'Brasil em Foco: Cultura, Sociedade, Ciência e Cotidiano': ['Prova 1', 'Prova 2'],
            'Avaliação formativa 2 - Mato Grosso do Sul - quarto e quinto anos': ['Caderno MS'],
            'Avaliação formativa - Piauí - Agosto de 2025': ['Prova PI'],
            'Avaliação teste interno Avaliação teste interno Avaliação teste interno Avaliação teste interno Avaliação teste interno Avaliação teste interno Avaliação teste interno Avaliação teste interno Avaliação teste interno Avaliação teste interno Avaliação teste': ['Teste'],
            'Avaliação Diagnóstica 2026.1': ['Caderno 1 - Linguagens', 'Caderno 2 - Matemática'],
            'Simulado SPAECE': ['Prova Única']
          },
          '9º Ano B': {
            'Brasil em Foco: Cultura, Sociedade, Ciência e Cotidiano': ['Prova 1'],
            'Avaliação Diagnóstica 2026.1': ['Caderno 1 - Linguagens', 'Caderno 2 - Matemática'],
            'Simulado SPAECE': ['Prova Única']
          },
          '9º Ano C': {
            'Avaliação Diagnóstica 2026.1': ['Caderno 1 - Linguagens'],
            'Simulado SPAECE': ['Prova Única']
          },
          '7º Ano A': {
            'Brasil em Foco: Cultura, Sociedade, Ciência e Cotidiano': ['Prova 1'],
            'Avaliação formativa 2 - Mato Grosso do Sul - quarto e quinto anos': ['Caderno MS'],
            'Avaliação Diagnóstica 2026.1': ['Caderno 1', 'Caderno 2'],
            'Simulado SPAECE': ['Português']
          },
          '7º Ano B': {
            'Avaliação Diagnóstica 2026.1': ['Caderno 1', 'Caderno 2'],
            'Simulado SPAECE': ['Matemática']
          },
          '7º Ano C': {
            'Avaliação Diagnóstica 2026.1': ['Caderno 1', 'Caderno 2']
          }
        },
        'EMTI Filgueiras Lima': {
          '8º Ano Único': {
            'Avaliação Formativa BIM 1': ['Matemática e Ciências', 'Português e História']
          }
        }
      },
      'Regional 2': {
        'EEEP Maria José': {
          '1ª Série Informática': {
             'Avaliação Global': ['Ciências da Natureza']
          }
        },
        'Escola Municipal Rachel Viana': {} // Sem turmas cadastradas
      }
    },
    'Caucaia': {
      'Distrito Sede': {
        'EEF Branca de Neve': {
          '9º Ano Matutino': {
            'Prova Brasil - Preparatório': ['Matemática', 'Português']
          }
        }
      },
      'Distrito Jurema': {} // Sem escolas
    },
    'Eusébio': {
      'Sede Eusébio': {
        'Escola Profissionalizante Eusébio': {
          'Turma Tarde': { 'Avaliação de Nivelamento': ['Prova de Exatas'] },
          'Turma Manhã': { 'Avaliação de Nivelamento': ['Prova de Exatas'] }
        },
        'Colégio Padrão': {} 
      }
    }
  },
  'São Paulo': {
    'São Paulo': {
      'Zona Sul': {
        'Escola Estadual SP': {
          'Turma 9A': { 'Avaliação SARESP': ['Matemática', 'Ciências'] },
          'Turma 9B': { 'Avaliação SARESP': ['Matemática', 'Ciências'] }
        }
      }
    }
  }
};