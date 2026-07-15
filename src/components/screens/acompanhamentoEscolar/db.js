// ══ CONFIGURAÇÕES DE TURMAS ══
export const series = ["1em", "2em", "3em"];
export const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
export const years = Array.from({ length: 2026 - 2011 + 1 }, (_, i) => 2011 + i);

// Coleção estruturada de dados históricos determinísticos (2011 a 2026)
export const HISTORICO_DATA_GENERATOR = (yearStr) => {
  const year = parseInt(yearStr);
  const seed = (year - 2011) * 3;
  const suf = Math.min(85, Math.max(50, 58 + (seed % 17) + Math.sin(year) * 4));
  const part = Math.min(98, Math.max(78, 85 + (seed % 11)));
  const risk = Math.max(3, 15 - (seed % 9));

  const prevYear = year - 1;
  const prevSuf = Math.min(85, Math.max(50, 58 + ((prevYear - 2011) * 3 % 17) + Math.sin(prevYear) * 4));
  const diff = (suf - prevSuf).toFixed(1);
  const indicator = diff >= 0 ? `+${diff}% vs ${prevYear}` : `${diff}% vs ${prevYear}`;
  const indicatorClass = diff >= 0 ? "text-emerald-600 dark:text-emerald-450" : "text-rose-605 dark:text-rose-455";

  return {
    suf: Math.round(suf),
    part: Math.round(part),
    risk: Math.round(risk),
    indicator: indicator,
    indicatorClass: indicatorClass
  };
};

// Base de dados de Storytelling Contextual
export const STORYTELLING_DATABASE = {
  rede: {
    titulo: "Consolidação Curricular Geral da Rede",
    corpo: "Análise agregada para acompanhamento das trilhas de aprendizagem. No ano selecionado, o Liceu do Conjunto Ceará manteve-se no cluster de alta proficiência do distrito.",
    actions: (year) => [
      { label: "Analisar Distribuição Geográfica", actionType: "toast", payload: `Gerando dados de mapas do ano ${year}...` }
    ]
  },
  diretor: {
    titulo: "Liceu do Conjunto Ceará: Visão da Unidade Escolar",
    corpo: "Seu principal ponto de ação reside no acompanhamento das turmas de retaguarda. No ano escolhido, as avaliações formativas apontaram desvios sazonais em Língua Portuguesa no 3º EM D que requerem acompanhamento focado.",
    actions: (year) => [
      { label: "Investigar Turma 3D em Língua Portuguesa", actionType: "navigate", payload: { view: "detalhe-turma", serie: "3em", letra: "D" } },
      { label: "Investigar Turma 2C em Matemática", actionType: "navigate", payload: { view: "detalhe-turma", serie: "2em", letra: "C" } }
    ]
  },
  professor: {
    titulo: "Painel do Docente: Planejamento Didático Sincronizado",
    corpo: "Acompanhe as habilidades críticas para direcionar suas sequências didáticas e aulas de reforço. O nivelamento sistemático reverteu os baixos índices históricos.",
    actions: (year) => [
      { label: "Acessar Banco de Itens Recomendados", actionType: "toast", payload: `Redirecionando ao Banco de Tarefas de ${year}...` }
    ]
  }
};

// ══ BANCO DE DADOS DE INSIGHTS DA IA POR AVALIAÇÃO ══
export const AVALIACOES_INSIGHTS = {
  '0': {
    titulo: "Avaliação Diagnóstica (Março)",
    insights: [
      {
        padrao: "Dificuldade com números grandes (Ordem de grandeza)",
        alunos: 12,
        pct: 18.7,
        prioridade: "Alta",
        habilidades: ["S01.H11", "S01.H12", "S01.H16"],
        itens: 4,
        desc: "Os alunos demonstram barreira no processo de transição do sistema numérico decimal ao operar com valores de grandeza superior a milhares.",
        resposta: "Responde 20 em vez de 2025.",
        rec: "Iniciar intervenções focalizadas em arredondamentos e cálculo mental por meio de decomposição por ordens decimais.",
        turmasDist: [
          { nome: "3A", valor: 2 },
          { nome: "3B", valor: 1 },
          { nome: "3C", valor: 0 },
          { nome: "3D", valor: 9 }
        ]
      },
      {
        padrao: "Ausência de justificativa lógica ou argumentativa",
        alunos: 8,
        pct: 12.6,
        prioridade: "Alta",
        habilidades: ["S02.H22", "S04.H14"],
        itens: 5,
        desc: "Estudantes conseguem assinalar ou computar o resultado numérico final correto, mas falham por não conseguir elaborar a justificativa matemática correspondente.",
        resposta: "Responde 2020 mas deixa a folha de cálculos em branco.",
        rec: "Incorporar rotinas estruturadas de 'resposta + argumentação' valorizando o raciocínio algébrico nas sequências didáticas diárias.",
        turmasDist: [
          { nome: "3A", valor: 1 },
          { nome: "3B", valor: 3 },
          { nome: "3C", valor: 2 },
          { nome: "3D", valor: 2 }
        ]
      }
    ]
  },
  '1': {
    titulo: "Avaliação Formativa 1 (Maio)",
    insights: [
      {
        padrao: "Leitura incorreta de escala em gráficos",
        alunos: 14,
        pct: 21.8,
        prioridade: "Alta",
        habilidades: ["S10.H02", "S01.H12"],
        itens: 3,
        desc: "Lê o valor do eixo errado ou ignora que a escala não começa em zero — a resposta parte de uma leitura equivocada do gráfico.",
        resposta: "O consumo dobrou (Truncou em 200).",
        rec: "Leitura comparada de gráficos com e sem eixo truncado; estimativa antes da leitura.",
        turmasDist: [
          { nome: "3A", valor: 3 },
          { nome: "3B", valor: 4 },
          { nome: "3C", valor: 2 },
          { nome: "3D", valor: 5 }
        ]
      },
      {
        padrao: "Confusão entre proporcionalidade direta e inversa",
        alunos: 10,
        pct: 15.6,
        prioridade: "Alta",
        habilidades: ["S04.H07", "S04.H14"],
        itens: 4,
        desc: "Aplica regra de três direta em situações inverses (mais torneiras → menos tempo), montando a proporção sem analisar a relação entre as grandezas.",
        resposta: "12 horas (Dobrou o tempo ao dobrar as torneiras).",
        rec: "Classificar a relação (direta/inversa) antes de calcular, com verificação de plausibilidade.",
        turmasDist: [
          { nome: "3A", valor: 2 },
          { nome: "3B", valor: 2 },
          { nome: "3C", valor: 3 },
          { nome: "3D", valor: 3 }
        ]
      }
    ]
  },
  '2': {
    titulo: "Simulado SAEB (Junho)",
    insights: [
      {
        padrao: "Interpretação de enunciados longos",
        alunos: 16,
        pct: 25.0,
        prioridade: "Alta",
        habilidades: ["L02.H04", "S04.H14"],
        itens: 5,
        desc: "Abandona ou responde parcialmente itens com enunciado acima de ~80 palavras — extrai dados numéricos sem compreender o que é pedido.",
        resposta: "75% (Usou os dois primeiros números e ignorou a exclusão final).",
        rec: "Estratégias de leitura ativa: sublinhar a pergunta e as condições antes de calcular.",
        turmasDist: [
          { nome: "3A", valor: 4 },
          { nome: "3B", valor: 5 },
          { nome: "3C", valor: 3 },
          { nome: "3D", valor: 4 }
        ]
      },
      {
        padrao: "Erros de arredondamento em porcentagem",
        alunos: 11,
        pct: 17.2,
        prioridade: "Média",
        habilidades: ["S04.H21", "S01.H16"],
        itens: 3,
        desc: "Arredonda valores intermediários antes do fim do cálculo, acumulando erro no resultado percentual final.",
        resposta: "18% (Arredondou 0,1666... para 0,17 no meio do cálculo).",
        rec: "Utilizar frações nos cálculos intermediários ou manter 4 casas decimais.",
        turmasDist: [
          { nome: "3A", valor: 2 },
          { nome: "3B", valor: 3 },
          { nome: "3C", valor: 3 },
          { nome: "3D", valor: 3 }
        ]
      }
    ]
  }
};

// ══ ALUNOS EM RISCO ══
export const RISK_STUDENTS = [
  { nome: "Aluno #1042", turma: "3D", dominios: 3, part: 67, conceito: "ins" },
  { nome: "Aluno #0977", turma: "3D", dominios: 3, part: 58, conceito: "ins" },
  { nome: "Aluno #1105", turma: "3B", dominios: 2, part: 90, conceito: "ins" },
  { nome: "Aluno #0864", turma: "3D", dominios: 2, part: 45, conceito: "sem" },
  { nome: "Aluno #1230", turma: "3A", dominios: 2, part: 82, conceito: "ins" }
];

// ══ ESCALA QUALITATIVA DE CONCEITO ══
export const CONCEPT_DATA = {
  suf: { label: "Suficiente", color: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-900/30" },
  par: { label: "Parcialmente Suficiente", color: "text-amber-700 bg-amber-50 border-amber-100 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30" },
  ins: { label: "Insuficiente", color: "text-rose-700 bg-rose-50 border-rose-100 dark:bg-rose-955/20 dark:text-rose-450 dark:border-rose-900/30" },
  sem: { label: "Sem conteúdo cognitivo", color: "text-slate-500 bg-slate-50 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-805" }
};

// ══ DETALHAMENTO DE DOMÍNIOS (DRILL DOWN MATRIX) ══
export const MATRIX_DRILL = {
  "Álgebra e Funções": [
    { nome: "Números e Operações", pct: 52, habilidades: [
      { cod: "S01.H11", desc: "Compor e decompor números naturais em ordens decimais (potências de dez)", pct: 44, alunos: 74, itens: 4 },
      { cod: "S01.H12", desc: "Ordenar e comparar números naturais na representação decimal ou na reta numérica", pct: 51, alunos: 65, itens: 3 },
      { cod: "S01.H16", desc: "Comparar, aproximar, arredondar ou estimar números naturais", pct: 48, alunos: 69, itens: 2 },
    ]},
    { nome: "Múltiplos e Divisibilidade", pct: 46, habilidades: [
      { cod: "S02.H22", desc: "Reconhecer múltiplos e divisores usando critérios de divisibilidade", pct: 38, alunos: 82, itens: 6 },
      { cod: "S02.H27", desc: "Aplicar procedimentos e algoritmos de divisão, corretos e justificados", pct: 55, alunos: 59, itens: 3 },
    ]},
    { nome: "Funções", pct: 67, habilidades: [
      { cod: "S05.H08", desc: "Reconhecer função afim e sua representação gráfica", pct: 70, alunos: 40, itens: 3 },
      { cod: "S05.H12", desc: "Modelar situações com funções de 1º grau", pct: 63, alunos: 49, itens: 2 },
    ]},
  ],
  "Geometria e Medidas": [
    { nome: "Figuras Planas", pct: 85, habilidades: [
      { cod: "S07.H04", desc: "Calcular área e perímetro de figuras planas", pct: 87, alunos: 17, itens: 4 },
      { cod: "S07.H09", desc: "Aplicar relações métricas no triângulo retângulo", pct: 82, alunos: 24, itens: 3 },
    ]},
    { nome: "Grandezas Geométricas", pct: 80, habilidades: [
      { cod: "S08.H03", desc: "Resolver problemas envolvendo volume de sólidos", pct: 80, alunos: 26, itens: 2 },
    ]},
  ],
  "Estatística e Probabilidade": [
    { nome: "Leitura de Dados", pct: 90, habilidades: [
      { cod: "S10.H02", desc: "Interpretar tabelas e gráficos estatísticos", pct: 91, alunos: 12, itens: 3 },
    ]},
    { nome: "Probabilidade", pct: 83, habilidades: [
      { cod: "S10.H11", desc: "Calcular probabilidade de eventos simples", pct: 83, alunos: 22, itens: 2 },
    ]},
  ],
  "Grandezas e Proporcionalidade": [
    { nome: "Razão e Proporção", pct: 74, habilidades: [
      { cod: "S04.H14", desc: "Justificar procedimentos envolvendo razões e proporções", pct: 68, alunos: 42, itens: 4 },
      { cod: "S04.H07", desc: "Resolver problemas de proporcionalidade direta e inversa", pct: 79, alunos: 28, itens: 3 },
    ]},
    { nome: "Porcentagem", pct: 82, habilidades: [
      { cod: "S04.H21", desc: "Resolver problemas envolvendo porcentagem e acréscimos", pct: 82, alunos: 23, itens: 2 },
    ]},
  ],
};

// Database objects for school trajectory (longitudinal coorte)
export const YEARS = [2023, 2024, 2025, 2026];
export const COMP_COLORS = { "Português · Leitura": "#8b5cf6", "Matemática": "#f59e0b" };
export const PORT_DOMAIN_COLORS = {
  "Localização de Informação": "#8b5cf6", "Inferência e Compreensão": "#14b8e0", "Análise e Reflexão": "#e879a0"
};
export const DOMAIN_COLORS = {
  "Álgebra e Funções": "#8b5cf6", "Geometria e Medidas": "#14b8e0",
  "Estatística e Probabilidade": "#f59e0b", "Grandezas e Proporcionalidade": "#6cc24a"
};

export const ANNUAL_COMP = {
  "1em": {
    components: {
      "Português · Leitura": [48, 52, 58, 61],
      "Matemática":          [43, 47, 54, 58],
    },
    rede: [51, 53, 56, 58],
    gapNote: null,
  },
  "2em": {
    components: {
      "Português · Leitura": [56, 59, 63, 66],
      "Matemática":          [52, 55, 61, 65],
    },
    rede: [55, 57, 60, 63],
    gapNote: null,
  },
  "3em": {
    components: {
      "Português · Leitura": [53, 57, null, 62],
      "Matemática":          [58, 62, 68, 74],
    },
    rede: [58, 60, 64, 67],
    gapNote: "Português · Leitura: instrumento de avaliação reformulado em 2025 — resultado não comparável omitido do gráfico (gap intencional).",
  },
};

export const ANNUAL_PORT = {
  "1em": {
    "Localização de Informação": [56, 60, 66, 69],
    "Inferência e Compreensão":  [47, 51, 57, 61],
    "Análise e Reflexão":        [41, 45, 51, 54],
  },
  "2em": {
    "Localização de Informação": [63, 66, 70, 74],
    "Inferência e Compreensão":  [54, 57, 62, 66],
    "Análise e Reflexão":        [50, 53, 58, 59],
  },
  "3em": {
    "Localização de Informação": [61, 65, null, 71],
    "Inferência e Compreensão":  [51, 55, null, 60],
    "Análise e Reflexão":        [46, 50, null, 55],
  },
};

export const TRAJ_HAB_PORT = {
  "Localização de Informação": [
    { cod: "L01.H02", desc: "Localizar informação explícita em textos de gêneros variados", pct: 74 },
    { cod: "L01.H05", desc: "Identificar o tema central de um texto", pct: 68 },
    { cod: "L01.H09", desc: "Reconhecer elementos da narrativa (tempo, espaço, personagens)", pct: 71 },
  ],
  "Inferência e Compreensão": [
    { cod: "L02.H04", desc: "Inferir informação implícita a partir de pistas textuais", pct: 58 },
    { cod: "L02.H07", desc: "Inferir o sentido de palavra ou expressão pelo contexto", pct: 63 },
    { cod: "L02.H11", desc: "Estabelecer relações de causa e consequência entre partes do texto", pct: 56 },
  ],
  "Análise e Reflexão": [
    { cod: "L03.H03", desc: "Distinguir fato de opinião em textos argumentativos", pct: 54 },
    { cod: "L03.H08", desc: "Identificar efeitos de sentido de recursos expressivos (ironia, humor)", pct: 49 },
    { cod: "L03.H12", desc: "Avaliar argumentos e posicionamento do autor", pct: 52 },
  ],
};

export const ANNUAL_DATA = {
  "1em": {
    domains: {
      "Álgebra e Funções": [42,45,52,55], "Geometria e Medidas": [58,60,67,71],
      "Estatística e Probabilidade": [50,53,null,64], "Grandezas e Proporcionalidade": [55,57,61,66],
    },
    rede: [51,53,56,58],
    gapNote: "Estatística e Probabilidade: matriz curricular mudou in 2025 — resultados não comparáveis omitidos (gap intencional).",
  },
  "2em": {
    domains: {
      "Álgebra e Funções": [46,48,54,58], "Geometria e Medidas": [62,65,71,76],
      "Estatística e Probabilidade": [55,59,63,70], "Grandezas e Proporcionalidade": [58,60,66,71],
    },
    rede: [55,57,60,63],
    gapNote: null,
  },
  "3em": {
    domains: {
      "Álgebra e Funções": [48,50,54,56], "Geometria e Medidas": [68,72,79,83],
      "Estatística e Probabilidade": [63,67,null,87], "Grandezas e Proporcionalidade": [60,65,72,78],
    },
    rede: [58,60,64,67],
    gapNote: "Estatística e Probabilidade: prova reformulada em 2025 — resultado não comparável omitido do gráfico (gap intencional).",
  },
};

export const INST_EVENTS = [
  { ano: 2024, mes: "Fev 2024", tipo: "plataforma", titulo: "Adoção da plataforma MAPEAR", detalhe: "Início das avaliações formativas com questões abertas corrigidas por IA." },
  { ano: 2025, mes: "Jan 2025", tipo: "matriz", titulo: "Reformulação da prova de Estatística", detalhe: "Resultados de 2025 marcados como não comparáveis na série." },
  { ano: 2025, mes: "Mar 2025", tipo: "intervencao", titulo: "Intervenção: cálculo mental com milhares", detalhe: "Origem: recomendação da IA. Alvo: Habilidade S01.H16.", resultado: { antes: 61, depois: 72, status: "meta atingida" } },
  { ano: 2026, mes: "Fev 2026", tipo: "intervencao", titulo: "Intervenção: oficina de justificativa matemática", detalhe: "Origem: recomendação da IA. Alvo: Habilidade S04.H14.", resultado: { antes: 38, depois: null, status: "em andamento · reavaliação Ago 2026" } },
];

const SERIE_HAB_OFF = { "1em": -12, "2em": -6, "3em": 0 };
const clampValue = (v, lo = 3, hi = 98) => Math.max(lo, Math.min(hi, v));
export function getHabVals(hab, domVals, currentSerie) {
  const off = SERIE_HAB_OFF[currentSerie] || 0;
  const trend = [-9, -6, -3, 0];
  const seed = [...hab.cod].reduce((a, c) => a + c.charCodeAt(0), 0);
  return domVals.map((dv, i) => dv === null ? null : clampValue(hab.pct + off + trend[i] + ((seed + i * 7) % 5) - 2));
}
