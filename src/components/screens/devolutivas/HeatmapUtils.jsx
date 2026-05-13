import React from 'react';
import { CircleCheck, CircleMinus, CircleX, RouteOff, File } from 'lucide-react';
import { defaultColors } from '../../../data/constants';
import {
  colGroupsMap,
  colGroups as realColGroups,
  mockStudents as realMockStudents,
  mockCascadeData as realCascadeData
} from './DadosHeatmap';

// --- CORES DO STATUS DO HEATMAP ---
// Forçando o uso dos hexadecimais específicos em todas as referências
const POSITIVE_COLOR = '#8CD47E';
const NEUTRAL_COLOR = '#F8D66D';
const NEGATIVE_COLOR = '#FF6961';
const INFO_COLOR = '#B3E6F5';

export const getStatusColors = (theme = 'default') => {
  const base = {
    '2': { label: 'Suficiente', val: 2, icon: <CircleCheck size={20} className="text-green-900" /> },
    'suficiente': { label: 'Suficiente', val: 2, icon: <CircleCheck size={20} className="text-green-900" /> },
    '1': { label: 'Parcialmente Suficiente', val: 1, icon: <CircleMinus size={20} className="text-yellow-900" /> },
    'parcialmente': { label: 'Parcialmente Suficiente', val: 1, icon: <CircleMinus size={20} className="text-yellow-900" /> },
    '0': { label: 'Insuficiente', val: 0, icon: <CircleX size={20} className="text-red-900" /> },
    'insuficiente': { label: 'Insuficiente', val: 0, icon: <CircleX size={20} className="text-red-900" /> },
    '-1': { label: 'S/ Conteúdo Relevante', val: -1, icon: <RouteOff size={20} className="text-cyan-800" /> },
    'sem_conteudo': { label: 'S/ Conteúdo Relevante', val: -1, icon: <RouteOff size={20} className="text-cyan-800" /> },
    'null': { label: 'Em Branco', val: null, icon: <File size={20} className="text-gray-500" /> },
    'branco': { label: 'Em Branco', val: null, icon: <File size={20} className="text-gray-500" /> }
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

  // Default FGV - Usando as cores específicas solicitadas pelo usuário
  return {
    ...base,
    '2': { ...base['2'], bg: POSITIVE_COLOR, border: 'rgba(0,0,0,0.1)' },
    'suficiente': { ...base['suficiente'], bg: POSITIVE_COLOR, border: 'rgba(0,0,0,0.1)' },
    '1': { ...base['1'], bg: NEUTRAL_COLOR, border: 'rgba(0,0,0,0.1)' },
    'parcialmente': { ...base['parcialmente'], bg: NEUTRAL_COLOR, border: 'rgba(0,0,0,0.1)' },
    '0': { ...base['0'], bg: NEGATIVE_COLOR, border: 'rgba(0,0,0,0.1)' },
    'insuficiente': { ...base['insuficiente'], bg: NEGATIVE_COLOR, border: 'rgba(0,0,0,0.1)' },
    '-1': { ...base['-1'], bg: INFO_COLOR, border: 'rgba(0,0,0,0.1)' },
    'sem_conteudo': { ...base['sem_conteudo'], bg: INFO_COLOR, border: 'rgba(0,0,0,0.1)' },
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

export const statusColors = getStatusColors();

// Helper function to convert hex to rgb object for the gradient points
const hexToRgb = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return { r, g, b };
};

// --- FUNÇÃO PARA DEGRADÊ DE CORES ---
export const getColorFromGradient = (value, isActive = true, theme = 'default') => {
  if (!isActive) return '#E5E7EB';
  if (value === '-' || value === null || isNaN(value)) return '#FFFFFF';

  const posRgb = hexToRgb(POSITIVE_COLOR);
  const neuRgb = hexToRgb(NEUTRAL_COLOR);
  const negRgb = hexToRgb(NEGATIVE_COLOR);
  const infoRgb = hexToRgb(INFO_COLOR);

  const points = theme === 'colorblind' ? [
    { val: -1, r: 200, g: 200, b: 200 },
    { val: 0, r: 213, g: 94, b: 0 },
    { val: 1, r: 240, g: 228, b: 66 },
    { val: 2, r: 0, g: 114, b: 178 }
  ] : theme === 'monochromatic' ? [
    { val: -1, r: 241, g: 245, b: 249 },
    { val: 0, r: 219, g: 234, b: 254 },
    { val: 1, r: 96, g: 165, b: 250 },
    { val: 2, r: 29, g: 78, b: 216 }
  ] : [
    { val: -1, ...infoRgb },
    { val: 0, ...negRgb },
    { val: 50, ...neuRgb },
    { val: 100, ...posRgb }
  ];

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

export const SKILL_DETAILS = {
  'Interpretação Textual': { code: 'H1', description: 'Capacidade de compreender o sentido global de textos de diferentes gêneros.' },
  'Análise Crítica': { code: 'H2', description: 'Avaliação de argumentos e posicionamentos presentes no discurso.' },
  'Resolução de Problemas': { code: 'H3', description: 'Aplicação de estratégias lógicas para solucionar desafios complexos.' },
  'Produção de Sentido': { code: 'H4', description: 'Construção de significados a partir da relação entre texto e contexto.' },
  'Conhecimento Base': { code: 'C1', description: 'Domínio dos conceitos fundamentais da área de conhecimento.' },
  'Aplicação Prática': { code: 'C2', description: 'Uso de conhecimentos teóricos em situações do cotidiano.' },
  'Raciocínio Analítico': { code: 'C3', description: 'Decomposição de problemas em partes menores para análise detalhada.' },
  'Pensamento Sistêmico': { code: 'C4', description: 'Visão holística das interrelações entre diferentes elementos.' },
  'Léxico e Semântica': { code: 'R1', description: 'Uso adequado do vocabulário e compreensão de significados.' },
  'Contexto Sociocultural': { code: 'R2', description: 'Conhecimento das influências sociais e culturais na comunicação.' },
  'Bagagem Científica': { code: 'R3', description: 'Fundamentação técnica e científica aplicada ao raciocínio.' },
  'Expressão Artística': { code: 'R4', description: 'Criatividade e domínio de linguagens estéticas e simbólicas.' },
  'Linguagens e Códigos': { code: 'K1', description: 'Sistemas de comunicação e suas regras de funcionamento.' },
  'Ciências e Lógica': { code: 'K2', description: 'Método científico e estruturação do pensamento lógico.' },
  'Sociedade e Cultura': { code: 'K3', description: 'Organização social e manifestações culturais humanas.' },
  'Natureza e Tecnologia': { code: 'K4', description: 'Interação humana com o meio ambiente e ferramentas tecnológicas.' }
};

export const GROUPING_NAMES = {
  'Tarefas': ['Interpretação Textual', 'Análise Crítica', 'Resolução de Problemas', 'Produção de Sentido'],
  'Domínios Cognitivos': ['Conhecimento Base', 'Aplicação Prática', 'Raciocínio Analítico', 'Pensamento Sistêmico'],
  'Domínios de Repertório': ['Léxico e Semântica', 'Contexto Sociocultural', 'Bagagem Científica', 'Expressão Artística'],
  'Conhecimentos': ['Linguagens e Códigos', 'Ciências e Lógica', 'Sociedade e Cultura', 'Natureza e Tecnologia']
};

export const getDynamicColGroups = (criteria = 'Tarefas') => {
  return colGroupsMap[criteria] || colGroupsMap['Tarefas'];
};

export const colGroups = realColGroups;

export const getMockRows = (level, parentName, totalCols = 40) => {
  return realMockStudents.map(student => ({
    ...student,
    data: student.data.slice(0, totalCols)
  }));
};

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

export const turmasPendentesMock = ['Turma B', 'Turma C', 'Turma 2', 'Turma Manhã'];
