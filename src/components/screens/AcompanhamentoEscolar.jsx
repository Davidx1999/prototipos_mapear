import React, { useState, useRef, useMemo } from 'react';
import {
  Star, School, Bot, Edit3, Trash2, ArrowLeft, ChevronLeft, ChevronRight,
  CheckCircle2, AlertTriangle, Info, X, TrendingUp, RefreshCw, BarChart3,
  Activity, Download, Share2, Clipboard, Sparkles, Network, School as SchoolFlag,
  UserCheck, AlertCircle, FileText, ChevronDown
} from 'lucide-react';
import Button from '../ui/Button';
import Toast from '../ui/Toast';

// Sub-componentes do módulo Acompanhamento Escolar
import Timeline from './acompanhamentoEscolar/Timeline';
import StorytellingBox from './acompanhamentoEscolar/StorytellingBox';
import MetricCards from './acompanhamentoEscolar/MetricCards';
import TurmasGrid from './acompanhamentoEscolar/TurmasGrid';
import MatchMomentumChart from './acompanhamentoEscolar/MatchMomentumChart';

// ══ CONFIGURAÇÕES DE TURMAS ══
const series = ["1em", "2em", "3em"];
const letters = ["A", "B", "C", "D", "E", "F", "G", "H"];
const years = Array.from({ length: 2026 - 2011 + 1 }, (_, i) => 2011 + i);

// Coleção estruturada de dados históricos determinísticos (2011 a 2026)
const HISTORICO_DATA_GENERATOR = (yearStr) => {
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
const STORYTELLING_DATABASE = {
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
const AVALIACOES_INSIGHTS = {
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
const RISK_STUDENTS = [
  { nome: "Aluno #1042", turma: "3D", dominios: 3, part: 67, conceito: "ins" },
  { nome: "Aluno #0977", turma: "3D", dominios: 3, part: 58, conceito: "ins" },
  { nome: "Aluno #1105", turma: "3B", dominios: 2, part: 90, conceito: "ins" },
  { nome: "Aluno #0864", turma: "3D", dominios: 2, part: 45, conceito: "sem" },
  { nome: "Aluno #1230", turma: "3A", dominios: 2, part: 82, conceito: "ins" }
];

// ══ ESCALA QUALITATIVA DE CONCEITO ══
const CONCEPT_DATA = {
  suf: { label: "Suficiente", color: "text-emerald-700 bg-emerald-50 border-emerald-100 dark:bg-emerald-955/20 dark:text-emerald-400 dark:border-emerald-900/30" },
  par: { label: "Parcialmente Suficiente", color: "text-amber-700 bg-amber-50 border-amber-100 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30" },
  ins: { label: "Insuficiente", color: "text-rose-700 bg-rose-50 border-rose-100 dark:bg-rose-955/20 dark:text-rose-450 dark:border-rose-900/30" },
  sem: { label: "Sem conteúdo cognitivo", color: "text-slate-500 bg-slate-50 border-slate-100 dark:bg-slate-900 dark:text-slate-400 dark:border-slate-805" }
};

// ══ DETALHAMENTO DE DOMÍNIOS (DRILL DOWN MATRIX) ══
const MATRIX_DRILL = {
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
const YEARS = [2023, 2024, 2025, 2026];
const COMP_COLORS = { "Português · Leitura": "#8b5cf6", "Matemática": "#f59e0b" };
const PORT_DOMAIN_COLORS = {
  "Localização de Informação": "#8b5cf6", "Inferência e Compreensão": "#14b8e0", "Análise e Reflexão": "#e879a0"
};
const DOMAIN_COLORS = {
  "Álgebra e Funções": "#8b5cf6", "Geometria e Medidas": "#14b8e0",
  "Estatística e Probabilidade": "#f59e0b", "Grandezas e Proporcionalidade": "#6cc24a"
};

const ANNUAL_COMP = {
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

const ANNUAL_PORT = {
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

const TRAJ_HAB_PORT = {
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

const ANNUAL_DATA = {
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

const INST_EVENTS = [
  { ano: 2024, mes: "Fev 2024", tipo: "plataforma", titulo: "Adoção da plataforma MAPEAR", detalhe: "Início das avaliações formativas com questões abertas corrigidas por IA." },
  { ano: 2025, mes: "Jan 2025", tipo: "matriz", titulo: "Reformulação da prova de Estatística", detalhe: "Resultados de 2025 marcados como não comparáveis na série." },
  { ano: 2025, mes: "Mar 2025", tipo: "intervencao", titulo: "Intervenção: cálculo mental com milhares", detalhe: "Origem: recomendação da IA. Alvo: Habilidade S01.H16.", resultado: { antes: 61, depois: 72, status: "meta atingida" } },
  { ano: 2026, mes: "Fev 2026", tipo: "intervencao", titulo: "Intervenção: oficina de justificativa matemática", detalhe: "Origem: recomendação da IA. Alvo: Habilidade S04.H14.", resultado: { antes: 38, depois: null, status: "em andamento · reavaliação Ago 2026" } },
];

const SERIE_HAB_OFF = { "1em": -12, "2em": -6, "3em": 0 };
const clampValue = (v, lo = 3, hi = 98) => Math.max(lo, Math.min(hi, v));
function getHabVals(hab, domVals, currentSerie) {
  const off = SERIE_HAB_OFF[currentSerie] || 0;
  const trend = [-9, -6, -3, 0];
  const seed = [...hab.cod].reduce((a, c) => a + c.charCodeAt(0), 0);
  return domVals.map((dv, i) => dv === null ? null : clampValue(hab.pct + off + trend[i] + ((seed + i * 7) % 5) - 2));
}

// ══ CUSTOM GRÁFICO DE TRAJETÓRIA SVG (LONGITUDINAL) ══
const TrajetoriaChart = ({ items, refData, isDarkMode }) => {
  const width = 600;
  const height = 200;
  const paddingLeft = 40;
  const paddingRight = 130; // leaves space for legend/labels next to lines
  const paddingTop = 20;
  const paddingBottom = 30;

  const getX = (idx) => paddingLeft + (idx * (width - paddingLeft - paddingRight)) / 3;
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [20, 40, 60, 80, 100];
  const years = [2023, 2024, 2025, 2026];

  return (
    <svg className="w-full h-full min-h-[180px]" viewBox={`0 0 ${width} ${height}`}>
      {/* Grid Lines */}
      {gridTicks.map((tick) => {
        const y = getY(tick);
        return (
          <g key={tick}>
            <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={isDarkMode ? "#334155" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3,3" />
            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="bold">{tick}%</text>
          </g>
        );
      })}

      {/* X Axis Years */}
      {years.map((yr, idx) => (
        <text key={yr} x={getX(idx)} y={height - 8} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="bold">{yr}</text>
      ))}

      {/* Reference Line (Rede/Geral) */}
      {refData && (() => {
        let refPath = "";
        refData.vals.forEach((val, idx) => {
          if (val === null) return;
          const x = getX(idx);
          const y = getY(val);
          if (refPath === "") refPath += `M ${x} ${y}`;
          else refPath += ` L ${x} ${y}`;
        });
        return (
          <>
            <path d={refPath} fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeDasharray="4,4" />
            {/* Label for Reference line at the end */}
            {refData.vals[3] !== null && (
              <text x={getX(3) + 8} y={getY(refData.vals[3]) + 3} fontSize="9" fill="#94a3b8" fontWeight="bold">
                {refData.label} ({refData.vals[3]}%)
              </text>
            )}
          </>
        );
      })()}

      {/* Item Lines */}
      {items.map((it) => {
        let prevValid = false;
        
        // Build path segments. Since we can have null (gaps), we can draw segment by segment
        const segments = [];
        let currentSegment = [];

        it.vals.forEach((val, idx) => {
          if (val === null) {
            if (currentSegment.length > 0) {
              segments.push(currentSegment);
              currentSegment = [];
            }
          } else {
            currentSegment.push({ x: getX(idx), y: getY(val), val, idx });
          }
        });
        if (currentSegment.length > 0) {
          segments.push(currentSegment);
        }

        const lastValidVal = it.vals.slice().reverse().find(v => v !== null);
        const lastValidIdx = it.vals.lastIndexOf(lastValidVal);

        return (
          <g key={it.nome}>
            {segments.map((seg, sIdx) => {
              let d = "";
              seg.forEach((pt, pIdx) => {
                if (pIdx === 0) d += `M ${pt.x} ${pt.y}`;
                else d += ` L ${pt.x} ${pt.y}`;
              });
              return (
                <path
                  key={sIdx}
                  d={d}
                  fill="none"
                  stroke={it.color}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              );
            })}
            
            {/* Dots and Tooltips */}
            {it.vals.map((val, idx) => {
              if (val === null) return null;
              const x = getX(idx);
              const y = getY(val);
              return (
                <g key={idx} className="group cursor-pointer">
                  <circle cx={x} cy={y} r="4" fill={it.color} stroke={isDarkMode ? "#0f172a" : "#ffffff"} strokeWidth="1.5" className="transition-all hover:scale-150" />
                  <title>{it.nome}: {val}% ({years[idx]})</title>
                </g>
              );
            })}

            {/* Item Label at the end */}
            {lastValidVal !== undefined && (
              <text x={getX(lastValidIdx) + 8} y={getY(lastValidVal) + 3} fontSize="9" fill={it.color} fontWeight="extrabold">
                {it.nome} ({lastValidVal}%)
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
};

// ══ GRÁFICO 1: EVOLUÇÃO DA SÉRIE (LINHA MENSAL - LEITURA X MATEMÁTICA) ══
const EvolucaoSerieChart = ({ isDarkMode, perfValue }) => {
  const width = 500;
  const height = 185;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const baseMath = perfValue || 70;
  const baseRead = Math.min(95, Math.max(30, baseMath - 6));

  const leituraVals = [baseRead - 8, baseRead - 4, baseRead + 12, baseRead - 2, baseRead + 6, baseRead + 1].map(v => Math.min(100, Math.max(0, v)));
  const matematicaVals = [baseMath - 12, baseMath - 6, baseMath + 15, baseMath, baseMath + 8, baseMath + 2].map(v => Math.min(100, Math.max(0, v)));
  const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun"];

  const getX = (idx) => paddingLeft + (idx * (width - paddingLeft - paddingRight)) / (months.length - 1);
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [20, 40, 60, 80, 100];

  let readPath = "";
  let mathPath = "";
  leituraVals.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) readPath += `M ${x} ${y}`;
    else readPath += ` L ${x} ${y}`;
  });
  matematicaVals.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) mathPath += `M ${x} ${y}`;
    else mathPath += ` L ${x} ${y}`;
  });

  return (
    <div className="w-full h-full flex flex-col justify-between">
      <div className="relative flex-1">
        <svg className="w-full h-full min-h-[160px]" viewBox={`0 0 ${width} ${height}`}>
          {/* Grid Lines */}
          {gridTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={isDarkMode ? "#334155" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3,3" />
                <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="bold">{tick}%</text>
              </g>
            );
          })}
          {/* X Labels */}
          {months.map((m, idx) => {
            const x = getX(idx);
            return (
              <text key={m} x={x} y={height - 5} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="semibold">{m}</text>
            );
          })}
          {/* Leitura Line (Purple) */}
          <path d={readPath} fill="none" stroke="#a855f7" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {leituraVals.map((val, idx) => (
            <circle key={`r-${idx}`} cx={getX(idx)} cy={getY(val)} r="3.5" fill={isDarkMode ? "#0f172a" : "#ffffff"} stroke="#a855f7" strokeWidth="2" />
          ))}
          {/* Matemática Line (Amber) */}
          <path d={mathPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {matematicaVals.map((val, idx) => (
            <circle key={`m-${idx}`} cx={getX(idx)} cy={getY(val)} r="3.5" fill={isDarkMode ? "#0f172a" : "#ffffff"} stroke="#f59e0b" strokeWidth="2" />
          ))}
        </svg>
      </div>
      <div className="flex gap-4 justify-center text-[10px] font-bold text-slate-500 uppercase mt-2 border-t pt-2 border-slate-100 dark:border-slate-850">
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-[#a855f7] inline-block"></span> Português · Leitura</span>
        <span className="flex items-center gap-1.5"><span className="w-2.5 h-0.5 bg-[#f59e0b] inline-block"></span> Matemática</span>
      </div>
    </div>
  );
};

// ══ GRÁFICO 2: DESEMPENHO POR TURMA (MÉDIA X BOXPLOT) ══
const DesempenhoTurmaChart = ({ isDarkMode, mode }) => {
  const width = 500;
  const height = 185;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const classes = ["3A", "3B", "3C", "3D"];
  const averages = [80, 74, 82, 68];
  
  const boxplots = [
    { min: 58, q1: 72, median: 81, q3: 88, max: 96 },
    { min: 48, q1: 64, median: 75, q3: 83, max: 94 },
    { min: 62, q1: 76, median: 83, q3: 89, max: 98 },
    { min: 42, q1: 58, median: 69, q3: 78, max: 90 }
  ];

  const getX = (idx) => paddingLeft + ((idx + 0.5) * (width - paddingLeft - paddingRight)) / classes.length;
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [20, 40, 60, 80, 100];
  const barWidth = 36;

  return (
    <svg className="w-full h-full min-h-[160px]" viewBox={`0 0 ${width} ${height}`}>
      {/* Grid Lines */}
      {gridTicks.map((tick) => {
        const y = getY(tick);
        return (
          <g key={tick}>
            <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={isDarkMode ? "#334155" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3,3" />
            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="bold">{tick}%</text>
          </g>
        );
      })}
      {/* X Labels */}
      {classes.map((c, idx) => {
        const x = getX(idx);
        return (
          <text key={c} x={x} y={height - 5} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="semibold">Turma {c}</text>
        );
      })}

      {/* Render average bars */}
      {mode === 'media' && averages.map((avg, idx) => {
        const x = getX(idx) - barWidth / 2;
        const y = getY(avg);
        const barHeight = height - paddingBottom - y;
        const fill = avg >= 70 ? "#10b981" : avg >= 55 ? "#f59e0b" : "#ef4444";
        return (
          <g key={`bar-${idx}`}>
            <rect x={x} y={y} width={barWidth} height={barHeight} fill={fill} rx="2" opacity="0.85" className="hover:opacity-100 transition-opacity cursor-pointer" />
            <text x={getX(idx)} y={y - 4} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#ffffff" : "#1e293b"} fontWeight="bold">{avg}%</text>
          </g>
        );
      })}

      {/* Render box plots */}
      {mode === 'boxplot' && boxplots.map((bp, idx) => {
        const x = getX(idx);
        const boxX = x - barWidth / 2;
        const yMin = getY(bp.min);
        const yMax = getY(bp.max);
        const yQ1 = getY(bp.q1);
        const yQ3 = getY(bp.q3);
        const yMed = getY(bp.median);

        return (
          <g key={`box-${idx}`} className="cursor-pointer hover:opacity-90 transition-opacity">
            {/* Whiskers line */}
            <line x1={x} y1={yMin} x2={x} y2={yMax} stroke={isDarkMode ? "#38bdf8" : "#006699"} strokeWidth="1.5" />
            <line x1={x - 6} y1={yMin} x2={x + 6} y2={yMin} stroke={isDarkMode ? "#38bdf8" : "#006699"} strokeWidth="1.5" />
            <line x1={x - 6} y1={yMax} x2={x + 6} y2={yMax} stroke={isDarkMode ? "#38bdf8" : "#006699"} strokeWidth="1.5" />
            
            {/* Interquartile range box */}
            <rect x={boxX} y={yQ3} width={barWidth} height={Math.max(2, yQ1 - yQ3)} fill={isDarkMode ? "rgba(56, 189, 248, 0.2)" : "rgba(0, 102, 153, 0.15)"} stroke={isDarkMode ? "#38bdf8" : "#006699"} strokeWidth="2" rx="1" />
            
            {/* Median line */}
            <line x1={boxX} y1={yMed} x2={boxX + barWidth} y2={yMed} stroke="#10b981" strokeWidth="2.5" />
          </g>
        );
      })}
    </svg>
  );
};

// ══ GRÁFICO 3: DISTRIBUIÇÃO DE CONCEITO (BARRAS EMPILHADAS) ══
const DistribucaoConceitoChart = ({ isDarkMode }) => {
  const width = 500;
  const height = 185;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 15;
  const paddingBottom = 25;

  const months = ["Jan", "Mar", "Abr", "Jun", "Out"];
  
  const data = [
    { ins: 15, par: 35, suf: 50 },
    { ins: 20, par: 25, suf: 55 },
    { ins: 10, par: 40, suf: 50 },
    { ins: 12, par: 28, suf: 60 },
    { ins: 8,  par: 22, suf: 70 }
  ];

  const getX = (idx) => paddingLeft + ((idx + 0.5) * (width - paddingLeft - paddingRight)) / months.length;
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [25, 50, 75, 100];
  const barWidth = 24;

  return (
    <div className="flex flex-col gap-2 w-full">
      <svg className="w-full h-full min-h-[160px]" viewBox={`0 0 ${width} ${height}`}>
        {/* Grid Lines */}
        {gridTicks.map((tick) => {
          const y = getY(tick);
          return (
            <g key={tick}>
              <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={isDarkMode ? "#334155" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3,3" />
              <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="bold">{tick}%</text>
            </g>
          );
        })}
        {/* X Labels */}
        {months.map((m, idx) => {
          const x = getX(idx);
          return (
            <text key={m} x={x} y={height - 5} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="semibold">{m}</text>
          );
        })}

        {/* Stacked Bars */}
        {data.map((item, idx) => {
          const x = getX(idx) - barWidth / 2;
          
          const hIns = item.ins;
          const yIns = getY(hIns);
          const heightIns = height - paddingBottom - yIns;

          const hPar = item.par;
          const yPar = getY(hIns + hPar);
          const heightPar = yIns - yPar;

          const hSuf = item.suf;
          const ySuf = getY(100);
          const heightSuf = yPar - ySuf;

          return (
            <g key={idx} className="cursor-pointer hover:opacity-95 transition-opacity">
              <rect x={x} y={yIns} width={barWidth} height={Math.max(1, heightIns)} fill="#ef4444" rx="1" />
              <rect x={x} y={yPar} width={barWidth} height={Math.max(1, heightPar)} fill="#f59e0b" rx="1" />
              <rect x={x} y={ySuf} width={barWidth} height={Math.max(1, heightSuf)} fill="#10b981" rx="1" />
            </g>
          );
        })}
      </svg>
      <div className="flex justify-center gap-3 text-[9px] font-bold text-slate-500 uppercase mt-1 border-t pt-2 border-slate-100 dark:border-slate-850">
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-emerald-500 rounded-[2px] inline-block"></span> Suficiente</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-amber-500 rounded-[2px] inline-block"></span> Parcial</span>
        <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 bg-rose-500 rounded-[2px] inline-block"></span> Crítico</span>
      </div>
    </div>
  );
};

// ══ GRÁFICO 4: DETALHE DE DOMÍNIO NO MODAL (2016-2025) ══
const ModalHistoricoChart = ({ isDarkMode }) => {
  const width = 640;
  const height = 180;
  const paddingLeft = 40;
  const paddingRight = 20;
  const paddingTop = 20;
  const paddingBottom = 30;

  const years = ["2016", "2017", "2018", "2019", "2020", "2021", "2022", "2023", "2024", "2025"];
  const currentDomainData = [17, 52, 23, 84, 51, 80, 33, 74, 98, 54];
  const comparativeData =   [25, 45, 30, 75, 58, 70, 42, 60, 90, 68];

  const getX = (idx) => paddingLeft + (idx * (width - paddingLeft - paddingRight)) / (years.length - 1);
  const getY = (val) => height - paddingBottom - (val * (height - paddingTop - paddingBottom)) / 100;

  const gridTicks = [0, 25, 50, 75, 100];

  let currentPath = "";
  let compPath = "";
  currentDomainData.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) currentPath += `M ${x} ${y}`;
    else currentPath += ` L ${x} ${y}`;
  });
  comparativeData.forEach((val, idx) => {
    const x = getX(idx);
    const y = getY(val);
    if (idx === 0) compPath += `M ${x} ${y}`;
    else compPath += ` L ${x} ${y}`;
  });

  return (
    <svg className="w-full h-full" viewBox={`0 0 ${width} ${height}`}>
      {/* Grid Lines */}
      {gridTicks.map((tick) => {
        const y = getY(tick);
        return (
          <g key={tick}>
            <line x1={paddingLeft} y1={y} x2={width - paddingRight} y2={y} stroke={isDarkMode ? "#334155" : "#e2e8f0"} strokeWidth="1" strokeDasharray="3,3" />
            <text x={paddingLeft - 8} y={y + 3} textAnchor="end" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="bold">{tick}%</text>
          </g>
        );
      })}
      {/* X Labels */}
      {years.map((y, idx) => {
        const x = getX(idx);
        return (
          <text key={y} x={x} y={height - 8} textAnchor="middle" fontSize="9" fill={isDarkMode ? "#94a3b8" : "#64748b"} fontWeight="semibold">{y}</text>
        );
      })}
      {/* Comparative average line (gray dashed) */}
      <path d={compPath} fill="none" stroke="#cbd5e1" strokeWidth="1.5" strokeDasharray="4,4" />
      
      {/* Current Domain Line (amber) */}
      <path d={currentPath} fill="none" stroke="#f59e0b" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
      {currentDomainData.map((val, idx) => (
        <circle key={`pt-${idx}`} cx={getX(idx)} cy={getY(val)} r="3.5" fill={isDarkMode ? "#0f172a" : "#ffffff"} stroke="#f59e0b" strokeWidth="2" />
      ))}
    </svg>
  );
};

const AcompanhamentoEscolar = ({ colors, navigateTo, isDarkMode }) => {
  // ══ ESTADOS GERAIS ══
  const [role, setRole] = useState('diretor'); // 'rede' | 'diretor' | 'professor'
  const [year, setYear] = useState('2026'); // Timeline year
  const [currentView, setCurrentView] = useState('dashboard'); // 'dashboard' | 'detalhe-turma' | 'detalhe-disciplina' | 'editor-avaliacao'
  const [selectedTurma, setSelectedTurma] = useState({ serie: '3em', letra: 'D' });
  const [selectedDisciplina, setSelectedDisciplina] = useState('Língua Portuguesa');
  const [favorites, setFavorites] = useState([]);
  
  // Estados de Abas e Sub-abas (index-v4.html design base)
  const [activeTab, setActiveTab] = useState('ano'); // 'ano' | 'trajetoria'
  const [subTab, setSubTab] = useState('panorama'); // 'panorama' | 'diagnostico'
  const [selectedEvaluation, setSelectedEvaluation] = useState('0'); // '0' | '1' | '2'
  const [selectedTurmaFilter, setSelectedTurmaFilter] = useState('all');
  const [activeDomain, setActiveDomain] = useState(null); // Detalhe de domínio para modal
  const [desempenhoMode, setDesempenhoMode] = useState('media'); // 'media' | 'boxplot'
  const [hoveredChartItem, setHoveredChartItem] = useState(null); // Tooltip de hover nos gráficos SVG
  const [interventions, setInterventions] = useState([]);
  const [trajPath, setTrajPath] = useState({ comp: null, dom: null });

  // Custom states for view modifications
  const [isHistoryExpanded, setIsHistoryExpanded] = useState(false);
  const [hoveredMomentum, setHoveredMomentum] = useState(null);

  // Simulation states
  const [isLoading, setIsLoading] = useState(false);
  const [isHeatmapOpen, setIsHeatmapOpen] = useState(false);
  
  // Toast notifications
  const [toast, setToast] = useState(null);

  // Dragging states for timeline
  const timelineRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // ══ HANDLERS DE TOAST ══
  const triggerToast = (msg) => {
    setToast({
      message: msg,
      type: 'info',
      title: 'Notificação MAPEAR'
    });
  };

  // ══ TRAJETÓRIA ESCOLAR MEMO E HANDLERS ══
  const trajData = useMemo(() => {
    const sKey = selectedTurma.serie;
    const comp = ANNUAL_COMP[sKey];
    const lvl = trajPath.dom ? 2 : trajPath.comp ? 1 : 0;

    if (lvl === 0) {
      return {
        lvl,
        colLabel: "Componente",
        title: "Evolução institucional — " + (sKey === "1em" ? "1º Ano EM" : sKey === "2em" ? "2º Ano EM" : "3º Ano EM"),
        desc: "Coorte institucional: a série comparada ano contra ano por componente curricular. Linha pontilhada: média da rede (perfil similar). Clique em um componente para analisar seus domínios.",
        yoyTitle: "Variação ano contra ano — por componente curricular",
        items: Object.entries(comp.components).map(([nome, vals]) => ({ nome, vals, color: COMP_COLORS[nome], drill: true })),
        ref: { label: "Média da rede", vals: comp.rede },
        gapNote: comp.gapNote,
      };
    }

    const isMat = trajPath.comp === "Matemática";
    const domains = isMat ? ANNUAL_DATA[sKey].domains : ANNUAL_PORT[sKey];

    if (lvl === 1) {
      return {
        lvl,
        colLabel: "Domínio",
        title: trajPath.comp + " — evolução por domínio · " + (sKey === "1em" ? "1º EM" : sKey === "2em" ? "2º EM" : "3º EM"),
        desc: "Domínios de repertório de " + trajPath.comp + " ano contra ano. Linha pontilhada: média geral do componente. Clique em um domínio para analisar as habilidades.",
        yoyTitle: "Variação ano contra ano — por domínio",
        items: Object.entries(domains).map(([nome, vals]) => ({ nome, vals, color: (isMat ? DOMAIN_COLORS : PORT_DOMAIN_COLORS)[nome] || "#5c6cf5", drill: true })),
        ref: { label: trajPath.comp + " (geral)", vals: comp.components[trajPath.comp] },
        gapNote: isMat ? ANNUAL_DATA[sKey].gapNote : comp.gapNote,
      };
    }

    const domVals = domains[trajPath.dom];
    const habs = isMat ? MATRIX_DRILL[trajPath.dom].flatMap(k => k.habilidades) : TRAJ_HAB_PORT[trajPath.dom];
    const hasGap = domVals.includes(null);
    const HAB_PALETTE = ["#8b5cf6", "#14b8e0", "#f59e0b", "#6cc24a", "#e05252", "#e879a0", "#5c6cf5", "#0e9cc4"];

    return {
      lvl,
      colLabel: "Habilidade",
      title: trajPath.dom + " — evolução por habilidade · " + (sKey === "1em" ? "1º EM" : sKey === "2em" ? "2º EM" : "3º EM"),
      desc: "Habilidades do domínio " + trajPath.dom + " ano contra ano. Linha pontilhada: média geral do domínio.",
      yoyTitle: "Variação ano contra ano — por habilidade",
      items: habs.map((h, i) => ({ nome: h.cod, sub: h.desc, vals: getHabVals(h, domVals, sKey), color: HAB_PALETTE[i % HAB_PALETTE.length], drill: false })),
      ref: { label: trajPath.dom + " (geral)", vals: domVals },
      gapNote: hasGap ? (isMat ? ANNUAL_DATA[sKey].gapNote : comp.gapNote) : null,
    };
  }, [selectedTurma.serie, trajPath]);

  const handleTrajDrill = (nome) => {
    setTrajPath((prev) => {
      if (!prev.comp) return { comp: nome, dom: null };
      if (!prev.dom) return { comp: prev.comp, dom: nome };
      return prev;
    });
  };

  const handleTrajUp = () => {
    setTrajPath((prev) => {
      if (prev.dom) return { comp: prev.comp, dom: null };
      return { comp: null, dom: null };
    });
  };

  const handleTrajTo = (level) => {
    setTrajPath((prev) => {
      if (level === 0) return { comp: null, dom: null };
      if (level === 1) return { comp: prev.comp, dom: null };
      return prev;
    });
  };

  // ══ SIMULADOR DE CARREGAMENTO ══
  const simulateLoading = (callback) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      callback();
    }, 550);
  };

  // ══ NAVEGAÇÃO DE FLUXO LINEAR ══
  const handleNavigate = (targetView, forceSerie = null, forceLetra = null, forceDiscipline = null) => {
    simulateLoading(() => {
      setCurrentView(targetView);
      if (forceSerie && forceLetra) {
        setSelectedTurma({ serie: forceSerie, letra: forceLetra });
      }
      if (forceDiscipline) {
        setSelectedDisciplina(forceDiscipline);
      }
    });
  };

  const navigateBack = () => {
    if (currentView === "detalhe-turma") {
      handleNavigate("dashboard");
    } else if (currentView === "detalhe-disciplina") {
      handleNavigate("detalhe-turma");
    } else if (currentView === "editor-avaliacao") {
      handleNavigate("detalhe-disciplina");
    }
  };

  // Changing role
  const changeRole = (newRole) => {
    setRole(newRole);
    triggerToast(`Visão alterada para ${newRole === 'rede' ? 'Rede / Gestor' : newRole === 'diretor' ? 'Diretor Escolar' : 'Professor'}`);
  };

  // Changing timeline year
  const changeYear = (newYear) => {
    simulateLoading(() => {
      setYear(newYear);
    });
  };

  // Toggle favorite status
  const toggleFavorite = (e, serie, letra) => {
    e.stopPropagation();
    const key = `${letra}`; // simplified favorite identifier
    const fullKey = `${serie}:${letra}`;
    setFavorites((prev) => {
      const idx = prev.indexOf(fullKey);
      if (idx > -1) {
        const next = [...prev];
        next.splice(idx, 1);
        triggerToast(`Turma ${letra.toUpperCase()} removida dos favoritos.`);
        return next;
      } else {
        triggerToast(`Turma ${letra.toUpperCase()} favoritada com sucesso!`);
        return [...prev, fullKey];
      }
    });
  };

  // ══ TIMELINE EVENT HANDLERS ══
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - timelineRef.current.offsetLeft);
    setScrollLeft(timelineRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - timelineRef.current.offsetLeft;
    const walk = (x - startX) * 1.5;
    timelineRef.current.scrollLeft = scrollLeft - walk;
  };

  // ══ METRIC CALCULATIONS ══
  const currentMetrics = useMemo(() => HISTORICO_DATA_GENERATOR(year), [year]);

  const storytelling = useMemo(() => {
    const meta = STORYTELLING_DATABASE[role];
    return {
      titulo: meta.titulo,
      corpo: meta.corpo,
      actions: meta.actions(year)
    };
  }, [role, year]);

  // Dynamic class data generator based on series, letter and timeline year
  const getTurmaData = (serie, letra) => {
    const serieFactor = series.indexOf(serie) * 4;
    const letraFactor = letters.indexOf(letra) * 2;
    const yearInt = parseInt(year);

    let perf = Math.min(96, Math.max(48, 65 + (yearInt % 5) + serieFactor - letraFactor));
    let status = "suf";
    let trend = "estavel";

    if (perf < 55) {
      status = "ins";
      trend = "decrescimo";
    } else if (perf < 70) {
      status = "par";
      trend = "estavel";
    } else {
      trend = "acrescimo";
    }

    let momentumSeries = [];
    if (trend === "acrescimo") {
      momentumSeries = [perf - 12, perf - 7, perf - 3, perf + 2, perf];
    } else if (trend === "decrescimo") {
      momentumSeries = [perf + 10, perf + 5, perf + 1, perf - 4, perf];
    } else {
      momentumSeries = [perf - 2, perf + 3, perf - 1, perf + 1, perf];
    }
    momentumSeries = momentumSeries.map(v => Math.min(100, Math.max(0, v)));

    return { perf, status, trend, momentumSeries };
  };

  const activeTurmaData = useMemo(() => {
    return getTurmaData(selectedTurma.serie, selectedTurma.letra);
  }, [selectedTurma, year]);

  // ══ CHARTS SVG RENDERING ══

  // Historical SVG Line Chart (16 points: 2011 to 2026)
  const renderHistoricoChart = () => {
    const width = 640;
    const height = 180;
    const paddingLeft = 45;
    const paddingRight = 20;
    const paddingTop = 15;
    const paddingBottom = 30;

    const dataPoints = years.map((y) => HISTORICO_DATA_GENERATOR(y.toString()));
    const getX = (idx) => paddingLeft + (idx * (width - paddingLeft - paddingRight)) / (years.length - 1);
    const getY = (val) => height - paddingBottom - ((val - 40) * (height - paddingTop - paddingBottom)) / 60;

    const gridTicks = [40, 60, 80, 100];

    // Suficiência path
    let sufPath = "";
    let sufAreaPath = `M ${getX(0)} ${getY(40)}`;
    dataPoints.forEach((pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.suf);
      if (idx === 0) {
        sufPath += `M ${x} ${y}`;
      } else {
        sufPath += ` L ${x} ${y}`;
      }
      sufAreaPath += ` L ${x} ${y}`;
    });
    sufAreaPath += ` L ${getX(years.length - 1)} ${getY(40)} Z`;

    // Participação path
    let partPath = "";
    dataPoints.forEach((pt, idx) => {
      const x = getX(idx);
      const y = getY(pt.part);
      if (idx === 0) {
        partPath += `M ${x} ${y}`;
      } else {
        partPath += ` L ${x} ${y}`;
      }
    });

    return (
      <div className="relative w-full h-[180px] overflow-x-auto no-scrollbar">
        <svg className="min-w-[600px] w-full h-full" viewBox={`0 0 ${width} ${height}`}>
          {/* Horizontal Grid lines */}
          {gridTicks.map((tick) => {
            const y = getY(tick);
            return (
              <g key={tick}>
                <line
                  x1={paddingLeft}
                  y1={y}
                  x2={width - paddingRight}
                  y2={y}
                  stroke={isDarkMode ? "#334155" : "#e2e8f0"}
                  strokeWidth="1"
                  strokeDasharray="3,3"
                />
                <text
                  x={paddingLeft - 8}
                  y={y + 3}
                  textAnchor="end"
                  fontSize="9"
                  fill={isDarkMode ? "#94a3b8" : "#64748b"}
                  fontWeight="bold"
                >
                  {tick}%
                </text>
              </g>
            );
          })}

          {/* X Axis Labels */}
          {years.map((y, idx) => {
            if (idx % 2 !== 0 && idx !== years.length - 1) return null;
            const x = getX(idx);
            return (
              <text
                key={y}
                x={x}
                y={height - 6}
                textAnchor="middle"
                fontSize="9"
                fill={isDarkMode ? "#94a3b8" : "#64748b"}
                fontWeight="semibold"
              >
                {y}
              </text>
            );
          })}

          {/* Area Fill */}
          <path
            d={sufAreaPath}
            fill={isDarkMode ? "rgba(56, 189, 248, 0.04)" : "rgba(0, 102, 153, 0.03)"}
          />

          {/* Participação Line */}
          <path
            d={partPath}
            fill="none"
            stroke={isDarkMode ? "#64748b" : "#94a3b8"}
            strokeWidth="1.2"
            strokeDasharray="4,4"
          />

          {/* Suficiência Line */}
          <path
            d={sufPath}
            fill="none"
            stroke={isDarkMode ? "#38bdf8" : "#006699"}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Point Markers */}
          {dataPoints.map((pt, idx) => {
            const x = getX(idx);
            const y = getY(pt.suf);
            const isCurrentYear = years[idx].toString() === year;
            return (
              <g key={idx} className="group cursor-pointer" onClick={() => changeYear(years[idx].toString())}>
                <circle
                  cx={x}
                  cy={y}
                  r={isCurrentYear ? "5" : "3"}
                  fill={isCurrentYear ? (isDarkMode ? "#38bdf8" : "#006699") : (isDarkMode ? "#0f172a" : "#ffffff")}
                  stroke={isDarkMode ? "#38bdf8" : "#006699"}
                  strokeWidth={isCurrentYear ? "1" : "2"}
                  className="transition-all duration-150 group-hover:scale-125"
                />
              </g>
            );
          })}
        </svg>
      </div>
    );
  };

  // Sparkline Match Momentum SVG inside class cards
  const renderMatchMomentum = (momentumSeries) => {
    const target = 70;
    const width = 62;
    const height = 24;
    const centerY = height / 2;
    const barWidth = 4;
    const gap = 3;
    const maxDiff = 30;

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="opacity-95 shrink-0 select-none">
        <line x1="2" y1={centerY} x2={width - 2} y2={centerY} stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" />
        {momentumSeries.map((val, idx) => {
          const diff = val - target;
          const x = 4 + idx * (barWidth + gap);
          let barHeight = (Math.abs(diff) / maxDiff) * (height / 2 - 2);
          if (barHeight < 1.5 && diff !== 0) barHeight = 1.5;
          if (barHeight > (height / 2 - 2)) barHeight = height / 2 - 2;

          const y = diff >= 0 ? centerY - barHeight : centerY;
          const color = diff >= 0 ? '#10b981' : '#ef4444';

          return (
            <rect
              key={idx}
              x={x}
              y={y}
              width={barWidth}
              height={barHeight}
              fill={color}
              rx="1"
            />
          );
        })}
      </svg>
    );
  };

  // Seletor de turma com dropdown no topo do detalhe da turma
  const handleDropdownTurmaChange = (e) => {
    const [s, l] = e.target.value.split(":");
    handleNavigate("detalhe-turma", s, l);
  };

  const navigateTurmaPrevNext = (dir) => {
    let currentSIndex = series.indexOf(selectedTurma.serie);
    let currentLIndex = letters.indexOf(selectedTurma.letra);

    if (dir === "next") {
      currentLIndex++;
      if (currentLIndex >= letters.length) {
        currentLIndex = 0;
        currentSIndex = (currentSIndex + 1) % series.length;
      }
    } else {
      currentLIndex--;
      if (currentLIndex < 0) {
        currentLIndex = letters.length - 1;
        currentSIndex = currentSIndex - 1 < 0 ? series.length - 1 : currentSIndex - 1;
      }
    }
    handleNavigate("detalhe-turma", series[currentSIndex], letters[currentLIndex]);
  };

  return (
    <div className={`flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 flex flex-col h-full ${isDarkMode ? 'bg-slate-955 text-slate-100' : 'bg-white text-slate-800'}`}>
      
      {/* Seletor de Papéis (Nivelamento Cognitivo da Interface) */}
      <div className="flex justify-end mb-4 shrink-0">
        <div className={`flex items-center gap-1 p-1 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-slate-105 border-slate-200'}`}>
          <span className="text-[10px] font-bold text-slate-500 px-2 uppercase select-none">Visão:</span>
          {['rede', 'diretor', 'professor'].map(r => (
            <Button
              key={r}
              onClick={() => changeRole(r)}
              variant="tertiary"
              appearance={role === r ? 'solid' : 'ghost'}
              size="xs"
              uppercase={false}
              className="!h-7"
            >
              {r === 'rede' ? 'Rede / Gestor' : r === 'diretor' ? 'Diretor Escolar' : 'Professor'}
            </Button>
          ))}
        </div>
      </div>

      {/* BREADCRUMBS ESTILO BASE (Nielsen Feedback) */}
      <div className="text-[11px] text-slate-400 dark:text-slate-500 mb-2 flex items-center gap-1 select-none">
        <span className="cursor-pointer hover:underline hover:text-[#006699]" onClick={() => triggerToast('Visão regional - CE')}>CE</span>
        <span>›</span>
        <span className="cursor-pointer hover:underline hover:text-[#006699]" onClick={() => triggerToast('Fortaleza')}>Fortaleza</span>
        <span>›</span>
        <span className="font-bold text-slate-650 dark:text-slate-350">Liceu do Conjunto Ceará</span>
      </div>

      {/* HEADER PRINCIPAL DO DESIGN BASE */}
      <header className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-855 mb-4 shrink-0">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 dark:text-white">Liceu do Conjunto Ceará</h1>
          <span className="px-2.5 py-0.5 text-[9px] bg-emerald-50 dark:bg-emerald-955/20 text-emerald-600 dark:text-emerald-400 font-extrabold rounded-full border border-emerald-100 dark:border-emerald-900/30">Ativo</span>
        </div>

        {/* Seletores e Escopo */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Seletor "Por Aluno" e "Por Escola" */}
          <div className="flex gap-1 bg-slate-100 dark:bg-slate-900 p-1 rounded-[4px] border border-slate-205 dark:border-slate-800 items-center">
            <Button
              onClick={() => {
                triggerToast("Redirecionando para o painel de Acompanhamento Individualizado do Aluno...");
                navigateTo('acompanhamento');
              }}
              variant="tertiary"
              appearance="ghost"
              size="xs"
              uppercase={true}
              className="!h-7 text-slate-550 hover:text-slate-900 dark:hover:text-white"
            >
              Por aluno
            </Button>
            <Button
              onClick={() => triggerToast("Já visualizando escopo: Escola")}
              variant="primary"
              appearance="solid"
              size="xs"
              uppercase={true}
              className="!h-7"
            >
              Por escola
            </Button>
          </div>

          <div className="h-6 w-px bg-slate-200 dark:bg-slate-850 hidden md:block"></div>

          {/* Filtros em Cascata */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            <label className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500">
              Série:
              <select
                value={selectedTurma.serie}
                onChange={(e) => {
                  setSelectedTurma(prev => ({ ...prev, serie: e.target.value }));
                  triggerToast(`Filtrando dados para a série: ${e.target.value.toUpperCase()}`);
                }}
                className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1 text-xs text-[#006699] dark:text-sky-400 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="1em">1º Ano EM</option>
                <option value="2em">2º Ano EM</option>
                <option value="3em">3º Ano EM</option>
              </select>
            </label>

            <label className="flex items-center gap-1.5 text-slate-450 dark:text-slate-500">
              Ano Letivo:
              <select
                value={year}
                onChange={(e) => changeYear(e.target.value)}
                className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1 text-xs text-[#006699] dark:text-sky-400 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
              >
                <option value="2024">2024</option>
                <option value="2025">2025</option>
                <option value="2026">2026</option>
              </select>
            </label>
          </div>
        </div>
      </header>

      {/* ABAS DO DESIGN BASE */}
      {currentView === 'dashboard' && (
        <div className="flex gap-6 border-b border-slate-200 dark:border-slate-850 mb-5 shrink-0">
          <button
            onClick={() => setActiveTab('ano')}
            className={`pb-3 border-b-2 text-xs font-bold transition-all text-left flex flex-col gap-0.5 ${
              activeTab === 'ano'
                ? 'border-[#006699] dark:border-sky-400 text-slate-900 dark:text-white'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
            }`}
          >
            <span>Visão Geral do Ano</span>
            <span className="text-[10px] font-normal lowercase text-slate-400">avaliações e testes do ano letivo</span>
          </button>
          <button
            onClick={() => setActiveTab('trajetoria')}
            className={`pb-3 border-b-2 text-xs font-bold transition-all text-left flex flex-col gap-0.5 ${
              activeTab === 'trajetoria'
                ? 'border-[#006699] dark:border-sky-400 text-slate-900 dark:text-white'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-350'
            }`}
          >
            <span>Trajetória da Escola</span>
            <span className="text-[10px] font-normal lowercase text-slate-400">progresso institucional · ano contra ano</span>
          </button>
        </div>
      )}

      {/* ══ LOADING SPINNER OVERLAY ══ */}
      {isLoading && (
        <div className="fixed inset-0 bg-white/70 dark:bg-slate-955/70 z-50 flex flex-col items-center justify-center">
          <div className="border-2 border-slate-200 dark:border-slate-800 border-t-2 border-t-[#006699] dark:border-t-sky-400 rounded-full w-8 h-8 animate-spin"></div>
          <p className="text-xs font-semibold text-slate-650 dark:text-slate-400 mt-3">Sincronizando dados pedagógicos...</p>
        </div>
      )}

      {/* ======================================================== */}
      {/* ══ VISTA 1: DASHBOARD GERAL (Nível 1 do Funil) ══ */}
      {/* ======================================================== */}
      {currentView === 'dashboard' && (
        <div className="flex flex-col gap-6 animate-fade-slide">
          
          {/* SELEÇÃO DE ABAS SECUNDÁRIAS (SUBNAV - APENAS NA VISÃO DO ANO) */}
          {activeTab === 'ano' && (
            <div className="subnav flex gap-2 bg-slate-100 dark:bg-slate-900 p-1 rounded-[6px] w-max border border-slate-205 dark:border-slate-800 shrink-0">
              <Button
                onClick={() => setSubTab('panorama')}
                variant="tertiary"
                appearance={subTab === 'panorama' ? 'solid' : 'ghost'}
                size="sm"
                uppercase={false}
                className="!font-bold !h-7"
              >
                Panorama
              </Button>
              <Button
                onClick={() => setSubTab('diagnostico')}
                variant="tertiary"
                appearance={subTab === 'diagnostico' ? 'solid' : 'ghost'}
                size="sm"
                uppercase={false}
                className="!font-bold !h-7"
              >
                Diagnóstico das Respostas
              </Button>
            </div>
          )}

          {/* ================= TAB 1: VISÃO GERAL DO ANO ================= */}
          {activeTab === 'ano' && (
            <>
              {/* --- SUB-TAB: PANORAMA --- */}
              {subTab === 'panorama' && (
                <div className="flex flex-col gap-6 animate-fade-slide">
                  {/* Superior Numeric Cards (Saúde da Escola) */}
                  <div className={`rounded-[4px] border p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    {/* Card 1: Percentual de Acertos */}
                    <div className="flex flex-col justify-between">
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide">
                        <span>Percentual de Acertos</span>
                        <Info className="w-3.5 h-3.5 text-slate-350 dark:text-slate-655" />
                      </div>
                      <div className="mt-2.5 flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-slate-800 dark:text-white">{currentMetrics.suf}%</span>
                      </div>
                      <span className={`text-[10px] font-bold mt-1 ${currentMetrics.indicatorClass}`}>
                        {currentMetrics.indicator}
                      </span>
                    </div>

                    {/* Card 2: Avaliações Realizadas */}
                    <div className="flex flex-col justify-between border-t sm:border-t-0 sm:border-l pt-4 sm:pt-0 sm:pl-6" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide">
                        <span>Avaliações Realizadas</span>
                        <Info className="w-3.5 h-3.5 text-slate-350 dark:text-slate-655" />
                      </div>
                      <div className="mt-2.5">
                        <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                          {Math.round(currentMetrics.part * 1.35)}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-slate-450 dark:text-slate-500 mt-1">
                        Saeb + Formativas
                      </span>
                    </div>

                    {/* Card 3: Itens Resolvidos */}
                    <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide">
                        <span>Itens Resolvidos</span>
                        <Info className="w-3.5 h-3.5 text-slate-350 dark:text-slate-655" />
                      </div>
                      <div className="mt-2.5">
                        <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                          7.000
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-600 mt-1">
                        +14% vs rede
                      </span>
                    </div>

                    {/* Card 4: Total de Intervenções */}
                    <div className="flex flex-col justify-between border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6" style={{ borderColor: isDarkMode ? '#1e293b' : '#f1f5f9' }}>
                      <div className="flex justify-between items-center text-[10px] font-bold text-slate-455 dark:text-slate-500 uppercase tracking-wide">
                        <span>Total de Intervenções</span>
                        <Info className="w-3.5 h-3.5 text-slate-350 dark:text-slate-655" />
                      </div>
                      <div className="mt-2.5">
                        <span className="text-2xl font-extrabold text-slate-800 dark:text-white">
                          {interventions.length + 2}
                        </span>
                      </div>
                      <span className="text-[10px] font-bold text-amber-600 mt-1">
                        {interventions.length} novas registradas
                      </span>
                    </div>
                  </div>

                  {/* Matriz de Saúde das 24 Turmas */}
                  <TurmasGrid
                    series={series}
                    letters={letters}
                    getTurmaData={getTurmaData}
                    favorites={favorites}
                    toggleFavorite={toggleFavorite}
                    handleNavigate={handleNavigate}
                    renderMatchMomentum={renderMatchMomentum}
                    isDarkMode={isDarkMode}
                    colors={colors}
                  />

                  {/* GRÁFICOS DO PANORAMA */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico 1: Evolução da Série */}
                    <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Evolução Curricular da Série ({year})</h4>
                        <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 mb-4">Média mensal dos estudantes nos dois componentes curriculares.</p>
                      </div>
                      <div className="h-48">
                        <EvolucaoSerieChart isDarkMode={isDarkMode} perfValue={currentMetrics.suf} />
                      </div>
                    </div>

                    {/* Gráfico 2: Domínios de Repertório */}
                    <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Domínios de Repertório</h4>
                        <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 mb-4">Matemática — Clique em um domínio para abrir o histórico e habilidades.</p>
                      </div>
                      <div className="space-y-3.5">
                        {[
                          { name: "Álgebra e Funções", pct: 56, color: "bg-amber-500", rawPct: 56.6, maior: 98, menor: 17 },
                          { name: "Geometria e Medidas", pct: 83, color: "bg-emerald-500", rawPct: 83, maior: 85, menor: 42 },
                          { name: "Estatística e Probabilidade", pct: 87, color: "bg-emerald-500", rawPct: 87, maior: 89, menor: 65 },
                          { name: "Grandezas e Proporcionalidade", pct: 78, color: "bg-emerald-500", rawPct: 78, maior: 80, menor: 50 }
                        ].map((dom) => (
                          <div
                            key={dom.name}
                            onClick={() => setActiveDomain({ name: dom.name, media: dom.pct, atual: dom.pct, maior: dom.maior, menor: dom.menor })}
                            className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950 p-2 rounded-[4px] transition-all border border-transparent hover:border-slate-200 dark:hover:border-slate-850"
                          >
                            <div className="flex justify-between items-center text-xs mb-1.5">
                              <span className="font-semibold text-slate-700 dark:text-slate-350 group-hover:text-[#006699] dark:group-hover:text-sky-400 transition-colors">{dom.name}</span>
                              <span className="font-bold text-slate-800 dark:text-slate-200">{dom.pct}% <i className="fa-solid fa-chart-simple text-[#006699] dark:text-sky-400 ml-1 opacity-75 group-hover:opacity-100 transition-opacity"></i></span>
                            </div>
                            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-[4px] h-2">
                              <div className={`${dom.color} h-2 rounded-[4px] transition-all duration-500`} style={{ width: `${dom.pct}%` }}></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Gráfico 3: Desempenho por Turma */}
                    <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                      <div className="flex justify-between items-center mb-4">
                        <div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Desempenho por Turma</h4>
                          <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1">Comparação de médias ou dispersão (Boxplot) das turmas.</p>
                        </div>
                        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-0.5 rounded-[4px] border border-slate-200 dark:border-slate-800">
                          <Button
                            onClick={() => setDesempenhoMode('media')}
                            variant="primary"
                            appearance={desempenhoMode === 'media' ? 'solid' : 'ghost'}
                            size="xs"
                            uppercase={true}
                            className="!h-6"
                          >
                            Média
                          </Button>
                          <Button
                            onClick={() => setDesempenhoMode('boxplot')}
                            variant="primary"
                            appearance={desempenhoMode === 'boxplot' ? 'solid' : 'ghost'}
                            size="xs"
                            uppercase={true}
                            className="!h-6"
                          >
                            Box plot
                          </Button>
                        </div>
                      </div>
                      <div className="h-48">
                        <DesempenhoTurmaChart isDarkMode={isDarkMode} mode={desempenhoMode} />
                      </div>
                      <div className="text-[10px] text-slate-450 mt-3 pt-2 border-t border-slate-100 dark:border-slate-850">
                        * Média resume o aproveitamento. O Box plot exibe valores Mínimo, Q1, Mediana, Q3 e Máximo.
                      </div>
                    </div>

                    {/* Gráfico 4: Distribuição de Conceito */}
                    <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Distribuição de Conceito (%)</h4>
                        <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 mb-4">Percentual histórico de estudantes por conceito de saúde escolar.</p>
                      </div>
                      <div className="h-48">
                        <DistribucaoConceitoChart isDarkMode={isDarkMode} />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* --- SUB-TAB: DIAGNÓSTICO DAS RESPOSTAS --- */}
              {subTab === 'diagnostico' && (
                <div className="flex flex-col gap-6 animate-fade-slide">
                  {/* Caixa de IA e Lista de Insights */}
                  <div className={`rounded-[4px] border p-5 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-100 dark:border-slate-850 pb-4 mb-4">
                      <div>
                        <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide flex items-center gap-1.5">
                          <Bot className="w-4 h-4 text-[#006699] dark:text-sky-400" />
                          Diagnóstico de Respostas por Inteligência Artificial
                        </h3>
                        <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light mt-0.5">Defasagens e padrões de erros mapeados a partir de questões discursivas.</p>
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Avaliação:</label>
                        <select
                          value={selectedEvaluation}
                          onChange={(e) => {
                            setSelectedEvaluation(e.target.value);
                            triggerToast(`Carregando diagnósticos da ${e.target.value === '0' ? 'Avaliação Diagnóstica' : e.target.value === '1' ? 'Avaliação Formativa 1' : 'Simulado SAEB'}...`);
                          }}
                          className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1 text-xs font-semibold text-slate-705 dark:text-slate-305 bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
                        >
                          <option value="0">Avaliação Diagnóstica (Março)</option>
                          <option value="1">Avaliação Formativa 1 (Maio)</option>
                          <option value="2">Simulado SAEB (Junho)</option>
                        </select>
                      </div>
                    </div>

                    {/* Lista de Insights */}
                    <div className="space-y-3">
                      {AVALIACOES_INSIGHTS[selectedEvaluation].insights.map((ins, idx) => {
                        const isExpanded = activeDomain?.name === ins.padrao;
                        return (
                          <div key={idx} className={`border rounded-[4px] overflow-hidden text-xs transition-colors ${isDarkMode ? 'border-slate-800 bg-slate-900/40' : 'border-slate-200 bg-slate-50/20'}`}>
                            {/* Cabeçalho */}
                            <div
                              onClick={() => {
                                if (activeDomain?.name === ins.padrao) setActiveDomain(null);
                                else setActiveDomain({ name: ins.padrao });
                              }}
                              className="flex justify-between items-center p-3 px-4 hover:bg-slate-50 dark:hover:bg-slate-950 cursor-pointer transition-colors select-none"
                            >
                              <div className="flex items-center gap-3">
                                <span className={`w-2.5 h-2.5 rounded-full ${ins.prioridade === 'Alta' ? 'bg-rose-500 animate-pulse' : 'bg-amber-500'}`}></span>
                                <span className="font-bold text-slate-850 dark:text-slate-200">{ins.padrao}</span>
                              </div>
                              <div className="flex items-center gap-3">
                                <span className="text-[10px] font-bold text-slate-450 bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-[2px]">{ins.alunos} estudantes impactados</span>
                                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${activeDomain?.name === ins.padrao ? 'rotate-180' : ''}`} />
                              </div>
                            </div>

                            {/* Corpo Expansível */}
                            {activeDomain?.name === ins.padrao && (
                              <div className="p-4 border-t border-slate-100 dark:border-slate-850 bg-white dark:bg-slate-950 text-xs space-y-4 animate-fade-slide">
                                <p className="text-slate-600 dark:text-slate-400 leading-relaxed font-light">{ins.desc}</p>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-[4px] border border-slate-150 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Resposta Típica Analisada</span>
                                    <p className="text-slate-700 dark:text-slate-350 italic font-medium">"{ins.resposta}"</p>
                                  </div>
                                  <div className="bg-slate-50 dark:bg-slate-900 p-3 rounded-[4px] border border-slate-150 dark:border-slate-800">
                                    <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wide block mb-1">Recomendação Didática da IA</span>
                                    <p className="text-[#006699] dark:text-sky-400 font-semibold">{ins.rec}</p>
                                  </div>
                                </div>

                                <div className="flex flex-wrap items-center gap-4 pt-3 border-t border-slate-100 dark:border-slate-850 text-slate-500 dark:text-slate-400">
                                  <span className="text-[10px] font-bold uppercase">Impacto por Turmas:</span>
                                  <div className="flex flex-wrap gap-4">
                                    {ins.turmasDist.map(td => (
                                      <span key={td.nome} className="text-[11px] font-semibold">{td.nome}: <strong className="text-slate-800 dark:text-white">{td.valor} Alunos</strong></span>
                                    ))}
                                  </div>
                                </div>

                                <div className="flex flex-wrap justify-between items-center pt-3 border-t border-slate-100 dark:border-slate-850 text-[10px] font-extrabold text-[#006699] dark:text-sky-400 uppercase gap-3">
                                  <div className="flex gap-4">
                                    <Button
                                      onClick={() => {
                                        triggerToast(`Intervenção para "${ins.padrao}" registrada no diário de classe.`);
                                        setInterventions(prev => [...prev, ins.padrao]);
                                      }}
                                      variant="tertiary"
                                      appearance="ghost"
                                      size="sm"
                                      iconLeft={<CheckCircle2 className="text-emerald-600" />}
                                      className="!text-emerald-600 hover:!bg-emerald-50 dark:hover:!bg-emerald-950/20"
                                    >
                                      Aceitar e registrar intervenção
                                    </Button>
                                    <Button
                                      onClick={() => {
                                        navigateTo('devolutivas', 'Devolutivas', {
                                          serie: selectedTurma.serie,
                                          letra: selectedTurma.letra,
                                          diagnostico: ins.padrao
                                        });
                                      }}
                                      variant="tertiary"
                                      appearance="ghost"
                                      size="sm"
                                      iconLeft={<TrendingUp className="text-rose-550" />}
                                      className="!text-rose-550 hover:!bg-rose-50 dark:hover:!bg-rose-955/20"
                                    >
                                      Ver respostas
                                    </Button>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Tabela de Alunos em Risco */}
                  <div className={`rounded-[4px] border p-5 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                    <div className="flex justify-between items-center mb-4">
                      <div>
                        <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Estudantes sob Monitoramento Próximo</h4>
                        <p className="text-[11px] text-slate-450 dark:text-slate-400 font-light mt-0.5">Desempenho abaixo do básico em 2 ou mais domínios curriculares.</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Filtrar Turma:</label>
                        <select
                          value={selectedTurmaFilter}
                          onChange={(e) => setSelectedTurmaFilter(e.target.value)}
                          className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1 text-xs font-semibold bg-white dark:bg-slate-900 focus:outline-none cursor-pointer"
                        >
                          <option value="all">Todas as turmas</option>
                          <option value="3A">Turma 3A</option>
                          <option value="3B">Turma 3B</option>
                          <option value="3C">Turma 3C</option>
                          <option value="3D">Turma 3D</option>
                        </select>
                        <Button
                          onClick={() => triggerToast("Exportando lista de monitoramento (.csv)...")}
                          variant="tertiary"
                          appearance="solid"
                          size="xs"
                          iconLeft={<Download />}
                          uppercase={true}
                          className="!h-7"
                        >
                          Exportar Lista
                        </Button>
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                            <th className="py-2.5 px-3">Estudante</th>
                            <th className="py-2.5 px-3">Turma</th>
                            <th className="py-2.5 px-3 text-center">Domínios Críticos</th>
                            <th className="py-2.5 px-3 text-center">Taxa de Participação</th>
                            <th className="py-2.5 px-3">Conceito Escolar</th>
                            <th className="py-2.5 px-3 text-right">Ação</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-300 font-medium">
                          {RISK_STUDENTS.filter(s => selectedTurmaFilter === 'all' || s.turma === selectedTurmaFilter).map((stu, sIdx) => {
                            const conc = CONCEPT_DATA[stu.conceito];
                            return (
                              <tr key={sIdx} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/30">
                                <td className="py-2.5 px-3 font-semibold text-slate-900 dark:text-white">{stu.nome}</td>
                                <td className="py-2.5 px-3">Turma {stu.turma}</td>
                                <td className="py-2.5 px-3 text-center text-rose-600 dark:text-rose-400 font-bold">{stu.dominios}</td>
                                <td className="py-2.5 px-3 text-center">{stu.part}%</td>
                                <td className="py-2.5 px-3">
                                  <span className={`px-2.5 py-0.5 text-[9px] font-bold border rounded-[2px] ${conc.color}`}>
                                    {conc.label}
                                  </span>
                                </td>
                                <td className="py-2.5 px-3 text-right">
                                  <Button
                                    onClick={() => triggerToast(`Abrindo perfil histórico e de tentativas do ${stu.nome}.`)}
                                    variant="tertiary"
                                    appearance="ghost"
                                    size="xs"
                                    uppercase={false}
                                    iconRight={<ChevronRight className="w-3.5 h-3.5" />}
                                    className="text-slate-700 dark:text-slate-350"
                                  >
                                    Acompanhar Estudante
                                  </Button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ================= TAB 2: TRAJETÓRIA DA ESCOLA ================= */}
          {activeTab === 'trajetoria' && (
            <div className="flex flex-col gap-6 animate-fade-slide">
              
              {/* Timeline Longitudinal Slider */}
              <div className={`border rounded-[4px] p-4 flex flex-col items-start gap-4 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                <Timeline
                  years={years}
                  year={year}
                  changeYear={changeYear}
                  isDarkMode={isDarkMode}
                />
              </div>

              {/* Breadcrumbs e Botão de Navegação Up */}
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-900 p-3 rounded-[4px] border border-slate-200 dark:border-slate-800">
                <div className="text-xs font-semibold text-slate-650 dark:text-slate-400">
                  {trajData.lvl === 0 ? (
                    <span>Componentes curriculares · clique nos cartões ou nas linhas da tabela para aprofundar</span>
                  ) : trajData.lvl === 1 ? (
                    <span>
                      <span className="cursor-pointer hover:underline text-[#006699] dark:text-sky-400" onClick={() => handleTrajTo(0)}>Componentes</span>
                      {' › '}
                      <strong className="text-slate-900 dark:text-white">{trajPath.comp}</strong>
                      <span className="text-slate-400 dark:text-slate-500 font-normal"> · domínios</span>
                    </span>
                  ) : (
                    <span>
                      <span className="cursor-pointer hover:underline text-[#006699] dark:text-sky-400" onClick={() => handleTrajTo(0)}>Componentes</span>
                      {' › '}
                      <span className="cursor-pointer hover:underline text-[#006699] dark:text-sky-400" onClick={() => handleTrajTo(1)}>{trajPath.comp}</span>
                      {' › '}
                      <strong className="text-slate-900 dark:text-white">{trajPath.dom}</strong>
                      <span className="text-slate-400 dark:text-slate-500 font-normal"> · habilidades</span>
                    </span>
                  )}
                </div>
                {trajData.lvl > 0 && (
                  <Button
                    onClick={handleTrajUp}
                    variant="tertiary"
                    appearance="solid"
                    size="sm"
                    iconLeft={<ArrowLeft />}
                  >
                    Voltar Nível
                  </Button>
                )}
              </div>

              {/* KPIs de Trajetória */}
              {(() => {
                const isLvl2 = trajData.lvl === 2;
                if (!isLvl2) {
                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {trajData.items.map((it) => {
                        const lastVal = it.vals[it.vals.length - 1];
                        const firstVal = it.vals[0];
                        const delta = lastVal !== null && firstVal !== null ? lastVal - firstVal : 0;
                        return (
                          <div
                            key={it.nome}
                            onClick={() => it.drill && handleTrajDrill(it.nome)}
                            className={`p-4 rounded-[4px] border shadow-xs cursor-pointer hover:border-slate-350 dark:hover:border-slate-700 transition-all ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}
                          >
                            <span className="text-[9px] font-bold text-slate-450 dark:text-slate-500 uppercase tracking-wide block mb-1">{it.nome}</span>
                            <p className="text-lg font-extrabold text-slate-800 dark:text-white">{lastVal === null ? '—' : `${lastVal}%`}</p>
                            <span className={`text-[10px] font-bold ${delta >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
                              {delta >= 0 ? '+' : ''}{delta} p.p. desde 2023
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  );
                } else {
                  const ranked = [...trajData.items].map(it => {
                    const last = it.vals.filter(x => x !== null);
                    const delta = last.length > 1 ? last[last.length - 1] - last[0] : 0;
                    const lastVal = last.length ? last[last.length - 1] : 0;
                    return { ...it, delta, lastVal };
                  }).sort((a, b) => b.delta - a.delta);
                  const best = ranked[0] || { nome: '—', delta: 0 };
                  const worst = ranked[ranked.length - 1] || { nome: '—', delta: 0 };
                  const refLast = trajData.ref.vals[trajData.ref.vals.length - 1];
                  const refFirst = trajData.ref.vals[0];
                  const refDelta = refLast !== null && refFirst !== null ? refLast - refFirst : 0;

                  return (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Habilidades</span>
                        <p className="text-lg font-extrabold text-slate-800 dark:text-white">{trajData.items.length}</p>
                        <span className="text-[10px] text-slate-500 font-bold truncate block">{trajPath.dom}</span>
                      </div>
                      <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Domínio em 2026</span>
                        <p className="text-lg font-extrabold text-slate-800 dark:text-white">{refLast}%</p>
                        <span className={`text-[10px] font-bold ${refDelta >= 0 ? 'text-emerald-600' : 'text-rose-605 dark:text-rose-455'}`}>
                          {refDelta >= 0 ? '+' : ''}{refDelta} p.p. desde 2023
                        </span>
                      </div>
                      <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Maior Avanço</span>
                        <p className="text-lg font-extrabold text-slate-800 dark:text-white">{best.nome}</p>
                        <span className="text-[10px] text-emerald-600 font-bold">
                          +{best.delta} p.p. desde 2023
                        </span>
                      </div>
                      <div className={`p-4 rounded-[4px] border ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                        <span className="text-[9px] font-bold text-slate-455 uppercase tracking-wide block mb-1">Menor Avanço</span>
                        <p className="text-lg font-extrabold text-slate-800 dark:text-white">{worst.nome}</p>
                        <span className={`text-[10px] font-bold ${worst.delta >= 0 ? 'text-emerald-650' : 'text-rose-605 dark:text-rose-455'}`}>
                          {worst.delta >= 0 ? '+' : ''}{worst.delta} p.p. desde 2023
                        </span>
                      </div>
                    </div>
                  );
                }
              })()}

              {/* Gráfico de Tendência Histórica & Cronologia */}
              <div className={`rounded-[4px] border p-5 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Lado Esquerdo: Gráfico */}
                  <div className="lg:col-span-2 flex flex-col justify-between">
                    <div>
                      <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide mb-1">{trajData.title}</h3>
                      <p className="text-xs text-slate-450 dark:text-slate-400 font-light mb-4" dangerouslySetInnerHTML={{ __html: trajData.desc }} />
                    </div>
                    <div className="h-56">
                      <TrajetoriaChart items={trajData.items} refData={trajData.ref} isDarkMode={isDarkMode} />
                    </div>
                    {trajData.gapNote && (
                      <div className="text-[10px] text-slate-400 mt-4 border-t pt-2 border-slate-100 dark:border-slate-850">
                        * {trajData.gapNote}
                      </div>
                    )}
                  </div>

                  {/* Lado Direito: Cronologia de Eventos Pedagógicos */}
                  <div className="lg:col-span-1 border-t lg:border-t-0 lg:border-l pt-4 lg:pt-0 lg:pl-6 flex flex-col" style={{ borderColor: isDarkMode ? colors?.neutral?.[5] || '#1E293B' : '#F1F5F9' }}>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider mb-4">Cronologia de Eventos</h4>
                    <div className="space-y-4 overflow-y-auto max-h-[250px] pr-2">
                      {INST_EVENTS.map((evt, idx) => (
                        <div key={idx} className="flex gap-3 items-start text-xs animate-fade-slide">
                          <span className="w-14 font-bold text-slate-455 dark:text-slate-500 text-right shrink-0">{evt.mes}</span>
                          <div className={`p-2.5 rounded-[4px] border flex-1 ${
                            evt.tipo === 'intervencao' 
                              ? (evt.resultado?.status === 'meta atingida' 
                                  ? 'bg-emerald-50/20 dark:bg-emerald-950/10 border-emerald-150 dark:border-emerald-900/30' 
                                  : 'bg-amber-50/20 dark:bg-amber-955/10 border-amber-150 dark:border-amber-900/30')
                              : 'bg-slate-50 dark:bg-slate-900 border-slate-150 dark:border-slate-800'
                          }`}>
                            <span className="font-bold text-slate-800 dark:text-white block text-[11px]">{evt.titulo}</span>
                            <span className="text-slate-500 dark:text-slate-400 font-light block mt-0.5 text-[10px]">{evt.detalhe}</span>
                            {evt.resultado && (
                              <span className={`text-[9px] font-bold block mt-1.5 flex items-center gap-1 ${
                                evt.resultado.status === 'meta atingida' ? 'text-emerald-600 dark:text-emerald-450' : 'text-amber-600 dark:text-amber-450'
                              }`}>
                                <CheckCircle2 className="w-3 h-3 text-current" /> {evt.resultado.status.toUpperCase()} (Antes: {evt.resultado.antes}% {evt.resultado.depois ? `| Depois: ${evt.resultado.depois}%` : ''})
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Variação Ano contra Ano (YoY) */}
              <div className={`rounded-[4px] border p-5 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                <div className="mb-4">
                  <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wide mb-1">{trajData.yoyTitle}</h3>
                  <p className="text-xs text-slate-450 dark:text-slate-400 font-light">Variações maiores que 2 p.p. representam alterações estruturais. Variações menores são flutuações estatísticas estáveis. n/c = não comparável.</p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-[10px]">
                        <th className="py-2.5 px-3 text-slate-455">{trajData.colLabel}</th>
                        <th className="py-2.5 px-3 text-center">2023</th>
                        <th className="py-2.5 px-3 text-center">23→24</th>
                        <th className="py-2.5 px-3 text-center">2024</th>
                        <th className="py-2.5 px-3 text-center">24→25</th>
                        <th className="py-2.5 px-3 text-center">2025</th>
                        <th className="py-2.5 px-3 text-center">25→26</th>
                        <th className="py-2.5 px-3 text-center">2026</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 text-slate-700 dark:text-slate-350 font-semibold">
                      {trajData.items.map((it, iIdx) => (
                        <tr
                          key={iIdx}
                          onClick={() => it.drill && handleTrajDrill(it.nome)}
                          className={`hover:bg-slate-50/50 dark:hover:bg-slate-900/30 ${it.drill ? 'cursor-pointer' : ''}`}
                        >
                          <td className="py-3 px-3">
                            {it.drill ? (
                              <div className="flex items-center gap-1 text-[#006699] dark:text-sky-400 font-bold">
                                <span>{it.nome}</span>
                                <ChevronRight className="w-3.5 h-3.5 text-current" />
                              </div>
                            ) : (
                              <div>
                                <span className="font-extrabold text-[#006699] dark:text-sky-400 block">{it.nome}</span>
                                <span className="text-[10px] text-slate-500 font-light block mt-0.5">{it.sub}</span>
                              </div>
                            )}
                          </td>
                          
                          {/* 2023 */}
                          <td className="py-3 px-3 text-center">{it.vals[0] === null ? '—' : `${it.vals[0]}%`}</td>

                          {/* 23 -> 24 delta */}
                          <td className="py-3 px-3 text-center">
                            {(() => {
                              const v = it.vals[1];
                              const prev = it.vals[0];
                              if (v === null || prev === null) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-400 dark:bg-slate-800 rounded">n/c</span>;
                              const d = v - prev;
                              if (Math.abs(d) <= 2) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-450 dark:bg-slate-855 rounded">≈</span>;
                              return (
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${d > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-600'}`}>
                                  {d > 0 ? '+' : ''}{d}
                                </span>
                              );
                            })()}
                          </td>

                          {/* 2024 */}
                          <td className="py-3 px-3 text-center">{it.vals[1] === null ? '—' : `${it.vals[1]}%`}</td>

                          {/* 24 -> 25 delta */}
                          <td className="py-3 px-3 text-center">
                            {(() => {
                              const v = it.vals[2];
                              const prev = it.vals[1];
                              if (v === null || prev === null) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-400 dark:bg-slate-800 rounded">n/c</span>;
                              const d = v - prev;
                              if (Math.abs(d) <= 2) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-450 dark:bg-slate-855 rounded font-normal">≈</span>;
                              return (
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${d > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/20' : 'bg-rose-50 text-rose-600'}`}>
                                  {d > 0 ? '+' : ''}{d}
                                </span>
                              );
                            })()}
                          </td>

                          {/* 2025 */}
                          <td className="py-3 px-3 text-center font-normal text-slate-400">{it.vals[2] === null ? '—' : `${it.vals[2]}%`}</td>

                          {/* 25 -> 26 delta */}
                          <td className="py-3 px-3 text-center">
                            {(() => {
                              const v = it.vals[3];
                              const prev = it.vals[2];
                              if (v === null || prev === null) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-100 text-slate-400 dark:bg-slate-800 rounded">n/c</span>;
                              const d = v - prev;
                              if (Math.abs(d) <= 2) return <span className="px-1.5 py-0.5 text-[9px] font-bold bg-slate-50 text-slate-450 dark:bg-slate-855 rounded font-normal">≈</span>;
                              return (
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold rounded ${d > 0 ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-955/20' : 'bg-rose-50 text-rose-600'}`}>
                                  {d > 0 ? '+' : ''}{d}
                                </span>
                              );
                            })()}
                          </td>

                          {/* 2026 */}
                          <td className="py-3 px-3 text-center font-bold text-slate-900 dark:text-white">{it.vals[3] === null ? '—' : `${it.vals[3]}%`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

        </div>
      )}

      {/* ======================================================== */}
      {/* ══ VISTA 2: DETALHE DA TURMA (Nível 2 do Funil) ══ */}
      {/* ======================================================== */}
      {currentView === 'detalhe-turma' && (
        <div className="flex flex-col gap-6 animate-fade-slide">
          
          {/* Top Back and Navigation Row */}
          <div className={`border p-4 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <Button
                variant="tertiary"
                appearance="solid"
                size="sm"
                iconLeft={<ArrowLeft />}
                onClick={navigateBack}
              >
                Voltar
              </Button>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <span className="text-[9px] font-bold text-[#006699] dark:text-sky-400 uppercase tracking-wide block">Painel de Acompanhamento</span>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  {selectedTurma.serie === "1em" ? "1º Ano EM" : selectedTurma.serie === "2em" ? "2º Ano EM" : "3º Ano EM"} - Turma {selectedTurma.letra}
                </h3>
              </div>
            </div>

            {/* Quick Class Selector Switchers */}
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-semibold text-slate-500">Mudar Turma:</span>
              <Button
                onClick={() => navigateTurmaPrevNext('prev')}
                variant="tertiary"
                appearance="solid"
                size="sm"
                iconOnly={true}
                iconLeft={<ChevronLeft />}
                className="!p-1 !h-8 !w-8"
              />
              
              <select
                value={`${selectedTurma.serie}:${selectedTurma.letra}`}
                onChange={handleDropdownTurmaChange}
                className="border border-slate-205 dark:border-slate-800 rounded-[4px] px-2.5 py-1 text-xs font-semibold text-slate-705 dark:text-slate-305 bg-white dark:bg-slate-900 focus:outline-none"
              >
                {series.map(s => (
                  letters.map(l => (
                    <option key={`${s}:${l}`} value={`${s}:${l}`}>
                      {s === "1em" ? "1º EM" : s === "2em" ? "2º EM" : "3º EM"} - Turma {l}
                    </option>
                  ))
                ))}
              </select>

              <Button
                onClick={() => navigateTurmaPrevNext('next')}
                variant="tertiary"
                appearance="solid"
                size="sm"
                iconOnly={true}
                iconLeft={<ChevronRight />}
                className="!p-1 !h-8 !w-8"
              />
            </div>
          </div>

          <div className="flex flex-col gap-6">
            {/* KPIs strip */}
            <div className={`rounded-[4px] p-5 border grid grid-cols-1 md:grid-cols-3 gap-4 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-[4px] border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Aproveitamento</span>
                <p className="text-xl font-bold text-slate-800 dark:text-white">{activeTurmaData.perf}%</p>
                <p className="text-[10px] text-slate-500 mt-1">Média curricular atual</p>
              </div>
              
              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-[4px] border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Status de Atenção</span>
                <span className={`px-2 py-0.5 text-[9px] font-bold rounded-[2px] uppercase inline-block mt-0.5 ${
                  activeTurmaData.status === 'ins' 
                    ? 'bg-rose-50 text-rose-700 border border-rose-100 dark:bg-rose-955/20 dark:text-rose-450 dark:border-rose-900/30' 
                    : activeTurmaData.status === 'par'
                      ? 'bg-amber-50 text-amber-700 border border-amber-100 dark:bg-amber-955/20 dark:text-amber-400 dark:border-amber-900/30'
                      : 'bg-emerald-50 text-emerald-700 border border-emerald-100 dark:bg-emerald-955/20 dark:text-emerald-450 dark:border-emerald-900/30'
                }`}>
                  {activeTurmaData.status === 'ins' ? 'CRÍTICO' : activeTurmaData.status === 'par' ? 'PARCIAL' : 'SUFICIENTE'}
                </span>
                <p className="text-[10px] text-slate-500 mt-2">Classificação de risco</p>
              </div>

              <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-[4px] border border-slate-100 dark:border-slate-850">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide block mb-1">Foco Crítico</span>
                <p className="text-xs font-bold text-rose-605 dark:text-rose-455 truncate mt-0.5">
                  {activeTurmaData.status === 'suf' ? 'Nenhum Alerta Crítico' : 'Interpretação Textual'}
                </p>
                <p className="text-[10px] text-slate-500 mt-2">Maior foco de desvio</p>
              </div>
            </div>

            {/* Tomada de Decisão Card - Div em linha, pequeno e não tão chamativo */}
            <div className={`p-4 rounded-[4px] border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-slate-50 border-slate-200'}`}>
              <div className="flex items-center gap-3">
                <div className="bg-rose-500/10 text-rose-500 p-2 rounded-[4px] border border-rose-500/20 flex items-center justify-center shrink-0">
                  <Activity className="w-4 h-4 text-rose-500 animate-pulse" />
                </div>
                <div>
                  <span className="font-bold uppercase text-[9px] text-rose-600 block">Tomada de decisão imediata</span>
                  <p className="text-slate-600 dark:text-slate-350">
                    Gargalo de rendimento identificado no descritor de <strong className="text-slate-900 dark:text-white">{activeTurmaData.status === 'suf' ? 'Matriz Geral' : 'Álgebra e Funções'}</strong>.
                  </p>
                </div>
              </div>
              <Button
                onClick={() => {
                  navigateTo('devolutivas', 'Devolutivas', {
                    serie: selectedTurma.serie,
                    letra: selectedTurma.letra,
                    disciplina: selectedDisciplina
                  });
                }}
                variant="primary"
                appearance="solid"
                size="sm"
                iconRight={<ChevronRight />}
                uppercase={true}
                className="w-full md:w-auto"
              >
                Acompanhar no Mapa de Calor
              </Button>
            </div>

            {/* Detailed Class Momentum Chart */}
            <div className={`rounded-[4px] p-5 border shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
              <div className="mb-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-205 text-xs uppercase tracking-wide flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4 text-[#006699] dark:text-sky-400" />
                  Evolução do Class Momentum
                </h4>
                <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1">
                  Desvio de proficiência da turma em relação à meta (70%). Passe o mouse nas barras para inspecionar eventos.
                </p>
              </div>
              <MatchMomentumChart
                currentPerf={activeTurmaData.perf}
                isDarkMode={isDarkMode}
              />
            </div>

            {/* GRÁFICOS DO DETALHE DA TURMA */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 1: Evolução da Turma */}
              <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Evolução do Rendimento</h4>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 mb-4">Acompanhamento mensal da turma em Leitura e Matemática.</p>
                </div>
                <div className="h-44">
                  <EvolucaoSerieChart isDarkMode={isDarkMode} perfValue={activeTurmaData.perf} />
                </div>
              </div>

              {/* Card 2: Domínios de Repertório da Turma */}
              <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Domínios de Repertório</h4>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 mb-4">Matemática — Clique no domínio para abrir o histórico temporal.</p>
                </div>
                <div className="space-y-3">
                  {[
                    { name: "Álgebra e Funções", pct: Math.round(activeTurmaData.perf * 0.8), color: "bg-amber-500", maior: 90, menor: 20 },
                    { name: "Geometria e Medidas", pct: Math.round(activeTurmaData.perf * 1.1), color: "bg-emerald-500", maior: 95, menor: 35 },
                    { name: "Estatística e Probabilidade", pct: Math.round(activeTurmaData.perf * 1.15), color: "bg-emerald-500", maior: 98, menor: 45 },
                    { name: "Grandezas e Proporcionalidade", pct: Math.round(activeTurmaData.perf * 0.95), color: "bg-emerald-500", maior: 92, menor: 30 }
                  ].map((dom) => (
                    <div
                      key={dom.name}
                      onClick={() => setActiveDomain({ name: dom.name, media: dom.pct, atual: dom.pct, maior: dom.maior, menor: dom.menor })}
                      className="group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-950 p-1.5 rounded-[4px] transition-all"
                    >
                      <div className="flex justify-between items-center text-xs mb-1">
                        <span className="font-semibold text-slate-700 dark:text-slate-350 group-hover:text-[#006699] dark:group-hover:text-sky-400 transition-colors">{dom.name}</span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">{Math.min(100, dom.pct)}%</span>
                      </div>
                      <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-[4px] h-1.5">
                        <div className={`${dom.color} h-1.5 rounded-[4px]`} style={{ width: `${Math.min(100, dom.pct)}%` }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Card 3: Distribuição de Rendimento por Meses (Boxplot) */}
              <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Distribuição por Meses (Boxplot)</h4>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 mb-4">Mediana e intervalo interquartil de dispersão das notas.</p>
                </div>
                <div className="h-44">
                  <DesempenhoTurmaChart isDarkMode={isDarkMode} mode="boxplot" />
                </div>
              </div>

              {/* Card 4: Distribuição de Conceito */}
              <div className={`rounded-[4px] border p-5 shadow-xs flex flex-col justify-between ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
                <div>
                  <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide">Distribuição de Conceito (%)</h4>
                  <p className="text-[11px] text-slate-450 dark:text-slate-400 mt-1 mb-4">Percentual de estudantes por conceito de saúde escolar.</p>
                </div>
                <div className="h-44">
                  <DistribucaoConceitoChart isDarkMode={isDarkMode} />
                </div>
              </div>
            </div>

            {/* Disciplines Mapped */}
            <div className={`rounded-[4px] p-5 border shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wide mb-3">Selecione uma Disciplina para Investigar</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                
                {/* Português */}
                <div
                  onClick={() => handleNavigate('detalhe-disciplina', null, null, 'Língua Portuguesa')}
                  className="border border-slate-202 dark:border-slate-800 p-4 rounded-[4px] cursor-pointer hover:border-[#006699] dark:hover:border-sky-400 hover:bg-slate-50/50 dark:hover:bg-slate-855/50 transition-all flex justify-between items-center group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Língua Portuguesa</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Média: <strong className="text-rose-600 dark:text-rose-455">46% (Abaixo do esperado)</strong>
                    </p>
                  </div>
                  <div className="text-[#006699] dark:text-sky-400 text-xs font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    Aprofundar <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Matemática */}
                <div
                  onClick={() => handleNavigate('detalhe-disciplina', null, null, 'Matemática')}
                  className="border border-slate-202 dark:border-slate-800 p-4 rounded-[4px] cursor-pointer hover:border-[#006699] dark:hover:border-sky-400 hover:bg-slate-50/50 dark:hover:bg-slate-855/50 transition-all flex justify-between items-center group"
                >
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-350">Matemática</span>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">
                      Média: <strong className="text-emerald-600 dark:text-emerald-455">74% (Suficiente)</strong>
                    </p>
                  </div>
                  <div className="text-[#006699] dark:text-sky-400 text-xs font-bold flex items-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity">
                    Aprofundar <ChevronRight className="w-3.5 h-3.5" />
                  </div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* ══ VISTA 3: DETALHE DA DISCIPLINA (Nível 3) ══ */}
      {/* ======================================================== */}
      {currentView === 'detalhe-disciplina' && (
        <div className="flex flex-col gap-6 animate-fade-slide">
          
          <div className={`border p-4 rounded-[4px] flex items-center justify-between shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <Button
                variant="tertiary"
                appearance="solid"
                size="sm"
                iconLeft={<ArrowLeft />}
                onClick={navigateBack}
              >
                Voltar
              </Button>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <span className="text-[9px] font-bold text-[#006699] dark:text-sky-400 uppercase tracking-wide block">Aprofundamento Pedagógico</span>
                <h3 className="text-sm font-bold text-slate-950 dark:text-white">
                  {selectedDisciplina} — {selectedTurma.serie === "1em" ? "1º Ano EM" : selectedTurma.serie === "2em" ? "2º Ano EM" : "3º Ano EM"} Turma {selectedTurma.letra} ({year})
                </h3>
              </div>
            </div>
          </div>

          {/* Subtheme Analysis */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Bloco Leitura (Consolidado) */}
            <div className={`rounded-[4px] p-5 border flex flex-col justify-between shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-bold text-emerald-800 bg-emerald-50 dark:bg-emerald-955/20 dark:text-emerald-400 px-2 py-0.5 rounded-[2px] border border-emerald-100 dark:border-emerald-900/30">ÓTIMO DESEMPENHO</span>
                  <span className="text-base font-bold text-emerald-600 dark:text-emerald-450">82% acertos</span>
                </div>
                <h4 className="text-xs font-bold text-slate-850 dark:text-slate-250 mb-1.5">Componente: Leitura Crítica</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Os estudantes demonstram facilidade para decodificar textos curtos, localizar informações explícitas e identificar o tema central em narrativas diretas.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-855 flex items-center gap-2 text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Domínio amplamente consolidado na turma.
              </div>
            </div>

            {/* Bloco Interpretação (Defasagem) */}
            <div className={`rounded-[4px] p-5 border flex flex-col justify-between shadow-xs ${isDarkMode ? 'bg-rose-955/10 border-rose-900/30' : 'bg-rose-50/15 border-rose-200'}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[9px] font-bold text-rose-855 bg-rose-50 dark:bg-rose-955/40 dark:text-rose-350 px-2 py-0.5 rounded-[2px] border border-rose-100 dark:border-rose-900/30">DEFASAGEM IDENTIFICADA</span>
                  <span className="text-base font-bold text-rose-600 dark:text-rose-455">42% acertos</span>
                </div>
                <h4 className="text-xs font-bold text-slate-855 dark:text-slate-255 mb-1.5">Componente: Interpretação Textual & Inferência</h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  O gargalo da média de Língua Portuguesa concentra-se na inferência de sentido figurado, ironias e na intertextualidade entre textos longos.
                </p>
              </div>
              <div className="mt-4 pt-3 border-t border-rose-100 dark:border-rose-900/20 flex items-center gap-2 text-[10px] text-rose-600 dark:text-rose-400 font-bold animate-pulse">
                <AlertCircle className="w-3.5 h-3.5" /> Interpretação Textual está derrubando a média da turma.
              </div>
            </div>

          </div>

          {/* Detailed Skills Mapping */}
          <div className={`rounded-[4px] p-5 border shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
            <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide mb-4">Mapeamento de Habilidades do Componente Crítico</h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Consolidadas */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-emerald-700 dark:text-emerald-450 flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" /> Consolidadas (3)
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-2.5 rounded-[4px] flex justify-between items-center">
                    <span>H1. Identificar tese e argumento em editoriais simples</span>
                    <span className="text-emerald-600 font-bold">85%</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-2.5 rounded-[4px] flex justify-between items-center">
                    <span>H4. Diferenciar fato de opinião em textos jornalísticos</span>
                    <span className="text-emerald-600 font-bold">81%</span>
                  </div>
                  <div className="bg-slate-50 dark:bg-slate-950 border border-slate-100 dark:border-slate-850 p-2.5 rounded-[4px] flex justify-between items-center">
                    <span>H5. Reconhecer o gênero e finalidade de cartazes</span>
                    <span className="text-emerald-600 font-bold">89%</span>
                  </div>
                </div>
              </div>

              {/* Habilidades Críticas */}
              <div className="space-y-3">
                <h5 className="text-xs font-bold text-rose-700 dark:text-rose-455 flex items-center gap-1">
                  <AlertCircle className="w-4 h-4 text-rose-500" /> Defasagem Severa (7)
                </h5>
                <div className="space-y-1.5 text-xs">
                  <div className="bg-rose-500/5 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-950/30 p-2.5 rounded-[4px] flex justify-between items-center">
                    <span className="font-medium text-rose-850 dark:text-rose-300">H2. Inferir efeitos de humor e ironia em crônicas</span>
                    <span className="text-rose-600 font-bold">34%</span>
                  </div>
                  <div className="bg-rose-500/5 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-950/30 p-2.5 rounded-[4px] flex justify-between items-center">
                    <span className="font-medium text-rose-850 dark:text-rose-300">H3. Identificar intertextualidade entre poemas</span>
                    <span className="text-rose-600 font-bold">29%</span>
                  </div>
                  <div className="bg-rose-500/5 dark:bg-rose-955/10 border border-rose-100 dark:border-rose-955/30 p-2.5 rounded-[4px] flex justify-between items-center">
                    <span className="font-medium text-rose-850 dark:text-rose-300">H6. Reconhecer recursos persuasivos em ensaios</span>
                    <span className="text-rose-600 font-bold">40%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA do Loop Pedagógico */}
            <div className="mt-8 pt-5 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="bg-sky-50 dark:bg-slate-800 text-[#006699] dark:text-sky-400 p-2.5 rounded-[4px] border border-sky-100 dark:border-slate-750">
                  <Sparkles className="w-5 h-5 animate-pulse" />
                </div>
                <div>
                  <h5 className="text-xs font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wide">Próximo Passo Recomendado por IA</h5>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                    Podemos criar uma avaliação de reforço estruturada sob medida com foco unicamente das 7 habilidades de interpretação com defasagem.
                  </p>
                </div>
              </div>
              <button
                onClick={() => handleNavigate('editor-avaliacao')}
                className="px-5 py-2.5 bg-[#006699] hover:bg-[#004d73] text-white text-xs font-bold uppercase tracking-wider rounded-[4px] transition-all flex items-center gap-2 shadow-sm shrink-0"
              >
                <Bot className="w-4 h-4" /> Gerar Avaliação de Reforço com IA
              </button>
            </div>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* ══ VISTA 4: EDITOR DE AVALIAÇÃO COM IA (Nível 4) ══ */}
      {/* ======================================================== */}
      {currentView === 'editor-avaliacao' && (
        <div className="flex flex-col gap-6 animate-fade-slide">
          
          <div className={`border p-4 rounded-[4px] flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
            <div className="flex items-center gap-3">
              <Button
                variant="tertiary"
                appearance="solid"
                size="sm"
                iconLeft={<ArrowLeft />}
                onClick={navigateBack}
              >
                Voltar
              </Button>
              <div className="h-5 w-px bg-slate-200 dark:bg-slate-800"></div>
              <div>
                <span className="text-[9px] font-bold text-emerald-605 uppercase tracking-wide block">Geração de Item Integrada</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">Editor de Avaliações × Assistente IA</h3>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Foco em: <strong>Interpretação Textual</strong>
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Coluna Esquerda: AI Panel */}
            <div className="bg-slate-900 text-white p-5 rounded-[4px] flex flex-col justify-between min-h-[440px] shadow-md border border-slate-800">
              <div>
                <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                  <span className="text-xs font-bold text-sky-400 uppercase tracking-wide flex items-center gap-1.5">
                    <Bot className="w-4 h-4 text-sky-400" /> ASSISTENTE IA DE CRIAÇÃO
                  </span>
                  <span className="text-[9px] text-slate-400">Status: Ativo</span>
                </div>

                <div className="space-y-4 text-xs leading-relaxed">
                  <p className="text-slate-355 font-light">
                    Olá! Analisei as lacunas do 3º EM D em Interpretação Textual e selecionei as tarefas mais adequadas do nosso banco de itens.
                  </p>
                  <div className="bg-slate-800/60 p-3 rounded-[4px] border border-slate-800 space-y-2">
                    <p className="font-semibold text-sky-300">Estrutura Recomendada:</p>
                    <ul className="space-y-1 text-slate-400 pl-4 list-disc font-light">
                      <li><strong>Tarefa 1:</strong> Cadê a Água (H2)</li>
                      <li><strong>Tarefa 2:</strong> Curupira e Amigos (H3)</li>
                      <li><strong>Bloco de Itens:</strong> Inferências de Crônica</li>
                    </ul>
                  </div>

                  <div className="flex items-center gap-2 text-emerald-400 bg-emerald-500/10 p-2 rounded-[4px] border border-emerald-500/20">
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                    <span>Tarefas mapeadas ao currículo!</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 space-y-2">
                 <Button
                   onClick={() => triggerToast("IA está reorganizando o banco de itens...")}
                   variant="secondary"
                   appearance="solid"
                   size="sm"
                   iconLeft={<RefreshCw />}
                   uppercase={true}
                   className="w-full"
                 >
                   Regenerar Estrutura
                 </Button>
              </div>
            </div>

            {/* Coluna Direita: Item Preview */}
            <div className={`lg:col-span-2 rounded-[4px] border p-6 flex flex-col justify-between min-h-[440px] shadow-xs ${isDarkMode ? 'bg-slate-900 border-slate-850' : 'bg-white border-slate-200'}`}>
              <div>
                <div className="flex justify-between items-center border-b pb-3 mb-5" style={{ borderColor: isDarkMode ? colors.neutral[5] : '#F1F5F9' }}>
                  <div>
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-205 uppercase tracking-wide">Estrutura Básica da Prova de Reforço</h4>
                    <p className="text-[11px] text-slate-400 mt-1">Questões selecionadas automaticamente com foco na defasagem.</p>
                  </div>
                  <span className="text-xs text-slate-500">Mapeamento: <strong>3 itens selecionados</strong></span>
                </div>

                <div className="space-y-3">
                  {/* Item 1 */}
                  <div className={`border rounded-[4px] p-4 flex justify-between items-start ${isDarkMode ? 'bg-slate-950 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                    <div className="pr-4">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tarefa 1 • Habilidade H2</span>
                      <h5 className="text-xs font-bold text-slate-850 dark:text-slate-250 mt-1">Exame Texto "Cadê a Água"</h5>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Leitura crítica baseada em inferência estrutural e decodificação analítica.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="tertiary"
                        appearance="ghost"
                        size="xs"
                        iconOnly={true}
                        iconLeft={<Edit3 />}
                        onClick={() => triggerToast("Editando tarefa...")}
                        className="text-slate-400 hover:text-slate-650"
                      />
                      <Button
                        variant="destructive"
                        appearance="ghost"
                        size="xs"
                        iconOnly={true}
                        iconLeft={<Trash2 />}
                        onClick={() => triggerToast("Excluindo tarefa...")}
                        className="text-rose-500 hover:text-rose-700"
                      />
                    </div>
                  </div>

                  {/* Item 2 */}
                  <div className={`border rounded-[4px] p-4 flex justify-between items-start ${isDarkMode ? 'bg-slate-955 border-slate-800' : 'bg-slate-50/50 border-slate-200'}`}>
                    <div className="pr-4">
                      <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Tarefa 2 • Habilidade H3</span>
                      <h5 className="text-xs font-bold text-slate-855 dark:text-slate-255 mt-1">Exame Texto "Curupira e Amigos"</h5>
                      <p className="text-xs text-slate-500 mt-1 leading-relaxed">Análise de intertextualidade literária e sentido figurado.</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="tertiary"
                        appearance="ghost"
                        size="xs"
                        iconOnly={true}
                        iconLeft={<Edit3 />}
                        onClick={() => triggerToast("Editando tarefa...")}
                        className="text-slate-400 hover:text-slate-650"
                      />
                      <Button
                        variant="destructive"
                        appearance="ghost"
                        size="xs"
                        iconOnly={true}
                        iconLeft={<Trash2 />}
                        onClick={() => triggerToast("Excluindo tarefa...")}
                        className="text-rose-500 hover:text-rose-700"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="border-t pt-5 mt-6 flex flex-col sm:flex-row items-center justify-between gap-4" style={{ borderColor: isDarkMode ? colors.neutral[5] : '#F1F5F9' }}>
                <Button
                  onClick={navigateBack}
                  variant="tertiary"
                  appearance="solid"
                  size="md"
                  uppercase={true}
                >
                  Cancelar
                </Button>
                <div className="flex gap-3 w-full sm:w-auto">
                  <Button
                    onClick={() => triggerToast("Criando versão editável no seu espaço de trabalho!")}
                    variant="secondary"
                    appearance="solid"
                    size="md"
                    uppercase={true}
                    className="flex-1 sm:flex-none"
                  >
                    Criar versão editável
                  </Button>
                  <Button
                    onClick={() => {
                      triggerToast("Avaliação atribuída e sincronizada ao diário de classe.");
                      handleNavigate("detalhe-disciplina");
                    }}
                    variant="primary"
                    appearance="solid"
                    size="md"
                    iconRight={<Share2 />}
                    uppercase={true}
                    className="flex-1 sm:flex-none"
                  >
                    Utilizar avaliação original
                  </Button>
                </div>
              </div>
            </div>
          </div>

        </div>
      )}

      {/* ══ DOMÍNIO DRILL-DOWN OVERLAY MODAL ══ */}
      {activeDomain && activeDomain.media !== undefined && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 animate-fade-in">
          <div className={`w-full max-w-[800px] rounded-[6px] border shadow-2xl flex flex-col max-h-[90vh] overflow-hidden ${isDarkMode ? 'bg-slate-900 border-slate-800' : 'bg-white border-slate-200'}`}>
            {/* Header */}
            <div className="flex justify-between items-center p-4 border-b border-slate-200 dark:border-slate-800 shrink-0">
              <div>
                <span className="text-[10px] font-bold text-[#006699] dark:text-sky-400 uppercase tracking-wide">Foco no Domínio de Aprendizagem</span>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">{activeDomain.name}</h3>
              </div>
              <Button
                onClick={() => setActiveDomain(null)}
                variant="tertiary"
                appearance="ghost"
                size="sm"
                iconOnly={true}
                iconLeft={<X />}
              />
            </div>

            {/* Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 text-xs">
              {/* KPIs de Domínio */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-[4px] border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Média de Proficiência</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">{activeDomain.media}%</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-[4px] border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Maior Nota</span>
                  <span className="text-lg font-bold text-emerald-600 dark:text-emerald-450">{activeDomain.maior}%</span>
                </div>
                <div className="p-3 bg-slate-50 dark:bg-slate-950 rounded-[4px] border border-slate-200 dark:border-slate-800">
                  <span className="text-[9px] font-bold text-slate-400 uppercase block mb-1">Menor Nota</span>
                  <span className="text-lg font-bold text-rose-600 dark:text-rose-450">{activeDomain.menor}%</span>
                </div>
              </div>

              {/* Histórico Temporal Multianual */}
              <div className="space-y-2">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Histórico Temporal Multianual (2016-2025)</h4>
                <p className="text-[11px] text-slate-450 dark:text-slate-400">Progresso do domínio analisado ano contra ano.</p>
                <div className="h-44 border border-slate-100 dark:border-slate-800 rounded-[4px] p-2 bg-slate-50/50 dark:bg-slate-955/30">
                  <ModalHistoricoChart isDarkMode={isDarkMode} />
                </div>
              </div>

              {/* Detalhe de Habilidades (Drill Down) */}
              <div className="space-y-3">
                <h4 className="font-bold text-slate-800 dark:text-slate-200 uppercase tracking-wider text-[10px]">Detalhamento por Habilidades (Matriz de Referência)</h4>
                <div className="border border-slate-200 dark:border-slate-800 rounded-[4px] overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-450 font-bold uppercase tracking-wider text-[9px]">
                        <th className="py-2 px-3">Código/Habilidade</th>
                        <th className="py-2 px-3 text-center">Itens</th>
                        <th className="py-2 px-3 text-center">Alunos</th>
                        <th className="py-2 px-3 text-right">Percentil Médio</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 dark:divide-slate-850 font-semibold text-slate-700 dark:text-slate-300">
                      {(MATRIX_DRILL[activeDomain.name] || []).map((row, rIdx) => (
                        <tr key={rIdx} className="hover:bg-slate-50 dark:hover:bg-slate-900/30">
                          <td className="py-2 px-3">
                            <span className="font-extrabold text-[#006699] dark:text-sky-400 block">{row.code}</span>
                            <span className="text-[10px] text-slate-500 font-light block">{row.desc}</span>
                          </td>
                          <td className="py-2 px-3 text-center">{row.itens}</td>
                          <td className="py-2 px-3 text-center">{row.alunos}</td>
                          <td className="py-2 px-3 text-right font-extrabold text-slate-900 dark:text-white">{row.perc}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Action Footer */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex justify-end gap-3 shrink-0">
              <Button
                onClick={() => {
                  triggerToast(`Imprimindo relatório para ${activeDomain.name}...`);
                }}
                variant="tertiary"
                appearance="solid"
                size="md"
                uppercase={true}
              >
                Gerar PDF
              </Button>
              <Button
                onClick={() => setActiveDomain(null)}
                variant="primary"
                appearance="solid"
                size="md"
                uppercase={true}
              >
                Fechar
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ══ TOAST NOTIFICATION SYSTEM ══ */}
      {toast && (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-[100] min-w-[320px] max-w-[480px]">
          <Toast
            type={toast.type}
            title={toast.title}
            message={toast.message}
            onClose={() => setToast(null)}
            colors={colors}
            duration={3000}
          />
        </div>
      )}

    </div>
  );
};

export default AcompanhamentoEscolar;
