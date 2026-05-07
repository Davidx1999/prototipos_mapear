import React from 'react';
import { CircleCheck, CircleMinus, CircleX, RouteOff, File } from 'lucide-react';
import {
  colGroupsMap,
  colGroups as realColGroups,
  mockStudents as realMockStudents,
  mockCascadeData as realCascadeData
} from './DadosHeatmap';

// --- CORES DO STATUS DO HEATMAP E VALORES PARA CÁLCULO ---
export const getStatusColors = (theme = 'default') => {
  const base = {
    '2': { label: 'Suficiente', val: 2, icon: <CircleCheck size={14} className="text-green-900" /> },
    'suficiente': { label: 'Suficiente', val: 2, icon: <CircleCheck size={14} className="text-green-900" /> },
    '1': { label: 'Parcialmente Suficiente', val: 1, icon: <CircleMinus size={14} className="text-yellow-900" /> },
    'parcialmente': { label: 'Parcialmente Suficiente', val: 1, icon: <CircleMinus size={14} className="text-yellow-900" /> },
    '0': { label: 'Insuficiente', val: 0, icon: <CircleX size={14} className="text-red-900" /> },
    'insuficiente': { label: 'Insuficiente', val: 0, icon: <CircleX size={14} className="text-red-900" /> },
    '-1': { label: 'S/ Conteúdo Relevante', val: -1, icon: <RouteOff size={14} className="text-cyan-800" /> },
    'sem_conteudo': { label: 'S/ Conteúdo Relevante', val: -1, icon: <RouteOff size={14} className="text-cyan-800" /> },
    'null': { label: 'Em Branco', val: null, icon: <File size={14} className="text-gray-500" /> },
    'branco': { label: 'Em Branco', val: null, icon: <File size={14} className="text-gray-500" /> }
  };

  if (theme === 'colorblind') {
    return {
      ...base,
      '2': { ...base['2'], bg: '#0072B2', border: '#005a8d' },
      '1': { ...base['1'], bg: '#F0E442', border: '#d9ce3b' },
      '0': { ...base['0'], bg: '#D55E00', border: '#b34d00' },
      '-1': { ...base['-1'], bg: '#D1D1D1', border: '#B8B8B8' },
      'null': { ...base['null'], bg: '#FFFFFF', border: '#E5E7EB' }
    };
  } else if (theme === 'monochromatic') {
    return {
      ...base,
      '2': { ...base['2'], bg: '#1D4ED8', border: '#1E40AF' },
      '1': { ...base['1'], bg: '#60A5FA', border: '#3B82F6' },
      '0': { ...base['0'], bg: '#DBEAFE', border: '#BFDBFE' },
      '-1': { ...base['-1'], bg: '#F1F5F9', border: '#E2E8F0' },
      'null': { ...base['null'], bg: '#FFFFFF', border: '#E5E7EB' }
    };
  }

  // Default FGV
  return {
    ...base,
    '2': { ...base['2'], bg: '#8CD47E', border: '#6FB963' },
    'suficiente': { ...base['suficiente'], bg: '#8CD47E', border: '#6FB963' },
    '1': { ...base['1'], bg: '#F8D66D', border: '#E5C055' },
    'parcialmente': { ...base['parcialmente'], bg: '#F8D66D', border: '#E5C055' },
    '0': { ...base['0'], bg: '#FF6961', border: '#E0554E' },
    'insuficiente': { ...base['insuficiente'], bg: '#FF6961', border: '#E0554E' },
    '-1': { ...base['-1'], bg: '#B3E6F5', border: '#92C9D9' },
    'sem_conteudo': { ...base['sem_conteudo'], bg: '#B3E6F5', border: '#92C9D9' },
    'null': { ...base['null'], bg: '#FFFFFF', border: '#E5E7EB' },
    'branco': { ...base['branco'], bg: '#FFFFFF', border: '#E5E7EB' }
  };
};

export const getLegendItems = (statusColors) => {
  return [
    statusColors['suficiente'],
    statusColors['parcialmente'],
    statusColors['insuficiente'],
    statusColors['sem_conteudo'],
    statusColors['branco']
  ];
};

export const statusColors = getStatusColors(); // Legacy export for static usage

// --- FUNÇÃO PARA DEGRADÊ DE CORES ---
export const getColorFromGradient = (value, isActive = true, theme = 'default') => {
  if (!isActive) return '#E5E7EB';
  if (value === '-' || value === null || isNaN(value)) return '#FFFFFF';

  const points = theme === 'colorblind' ? [
    { val: -1, r: 200, g: 200, b: 200 }, // Cinza (Sem Conteúdo)
    { val: 0, r: 213, g: 94, b: 0 },    // Vermilion (Insuficiente)
    { val: 1, r: 240, g: 228, b: 66 },  // Yellow (Parcialmente)
    { val: 2, r: 0, g: 114, b: 178 }   // Blue (Suficiente)
  ] : [
    { val: -1, r: 179, g: 230, b: 245 },  // Azul (#B3E6F5)
    { val: 0, r: 255, g: 105, b: 97 },   // Vermelho (#FF6961)
    { val: 1, r: 248, g: 214, b: 109 },  // Amarelo (#F8D66D)
    { val: 2, r: 140, g: 212, b: 126 }  // Verde (#8CD47E)
  ];

  // Restringe os valores ao range mínimo e máximo
  const clampedValue = Math.max(points[0].val, Math.min(points[points.length - 1].val, value));

  let lower = points[0];
  let upper = points[points.length - 1];

  for (let i = 0; i < points.length - 1; i++) {
    if (clampedValue >= points[i].val && clampedValue <= points[i + 1].val) {
      lower = points[i];
      upper = points[i + 1];
      break;
    }
  }

  const range = upper.val - lower.val;
  const fraction = range === 0 ? 0 : (clampedValue - lower.val) / range;

  const r = Math.round(lower.r + (upper.r - lower.r) * fraction);
  const g = Math.round(lower.g + (upper.g - lower.g) * fraction);
  const b = Math.round(lower.b + (upper.b - lower.b) * fraction);

  return `rgb(${r}, ${g}, ${b})`;
};

// --- CATEGORIAS E SUB-CATEGORIAS FICTÍCIAS ---
export const GROUPING_NAMES = {
  'Tarefas': ['Interpretação Textual', 'Análise Crítica', 'Resolução de Problemas', 'Produção de Sentido'],
  'Domínios Cognitivos': ['Conhecimento Base', 'Aplicação Prática', 'Raciocínio Analítico', 'Pensamento Sistêmico'],
  'Domínios de Repertório': ['Léxico e Semântica', 'Contexto Sociocultural', 'Bagagem Científica', 'Expressão Artística'],
  'Conhecimentos': ['Linguagens e Códigos', 'Ciências e Lógica', 'Sociedade e Cultura', 'Natureza e Tecnologia']
};

// --- GERAÇÃO DE MOCK DATA DINÂMICO PARA COLUNAS ---
// Usa o mapa completo do DadosHeatmap.js — sem undefined!
export const getDynamicColGroups = (criteria = 'Tarefas') => {
  return colGroupsMap[criteria] || colGroupsMap['Tarefas'];
};

export const colGroups = realColGroups;

export const getMockRows = (level, parentName, totalCols = 40) => {
  // Retorna os dados reais do DadosHeatmap.js adaptados para o número de colunas
  return realMockStudents.map(student => ({
    ...student,
    // Garante que o array de dados tenha o tamanho correto e mapeie os valores para as cores
    data: student.data.slice(0, totalCols)
  }));
};

// --- MOCK DATA: CASCATA INVERTIDA ---
export const devDB = realCascadeData;

export const CASCADE_LEVELS = [
  { id: 'estado', title: 'Estados' },
  { id: 'municipio', title: 'Municípios' },
  { id: 'regional', title: 'Regionais' },
  { id: 'escola', title: 'Escolas' },
  { id: 'turma', title: 'Turmas' },
  { id: 'avaliacao', title: 'Avaliações' },
  { id: 'teste', title: 'Teste' }
];

// Mock de participações para simulação do CascadeSelector
export const participacaoAvaliacaoMock = {
  'Avaliação 1 Lorem ipsum': ['Turma A', 'Turma B', 'Turma C', 'Turma D'],
  'Avaliação 2 Diagnóstica': ['Turma A'],
  'Avaliação Global': ['Turma 1', 'Turma 2'],
  'Avaliação Estadual': ['Turma A'],
  'Avaliação Matemática': ['Turma Tarde', 'Turma Manhã'],
  'Avaliação Ciências': ['Turma Tarde'],
  'Avaliação SARESP': ['Turma 9A']
};

export const testesMock = {
  'Avaliação 1 Lorem ipsum': ['Língua Portuguesa', 'Matemática', 'Ciências'],
  'Avaliação 2 Diagnóstica': ['Entrada', 'Saída'],
  'Avaliação Global': ['Primeiro Bimestre', 'Segundo Bimestre'],
  'Avaliação Estadual': ['Prova Brasil'],
  'Avaliação Matemática': ['Álgebra', 'Geometria'],
  'Avaliação Ciências': ['Biologia', 'Química'],
  'Avaliação SARESP': ['Matemática SP', 'Português SP']
};

// Mock das turmas que não realizaram a avaliação
export const turmasPendentesMock = ['Turma B', 'Turma C', 'Turma 2', 'Turma Manhã'];
