import React from 'react';
import { CircleCheck, CircleMinus, CircleX, RouteOff, File } from 'lucide-react';
import { defaultColors } from '../../../data/constants';
import {
  colGroupsMap,
  colGroups as realColGroups,
  mockStudents as realMockStudents,
  mockCascadeData as realCascadeData
} from './DadosHeatmap';

export const HEATMAP_PALETTES = {
  'default': { label: 'Normal', positive: '#6B8E23', neutral: '#D9B52D', negative: '#C74A3A', info: '#5E4B4E' },
  'protanomaly': { label: 'Red-Weak/Protanomaly', positive: '#0072B2', neutral: '#F0E442', negative: '#CC79A7', info: '#5E4B4E' },
  'deuteranomaly': { label: 'Green-Weak/Deuteranomaly', positive: '#0072B2', neutral: '#F0E442', negative: '#D55E00', info: '#5E4B4E' },
  'tritanomaly': { label: 'Blue-Weak/Tritanomaly', positive: '#009E73', neutral: '#E69F00', negative: '#CC3311', info: '#5E4B4E' },
  'protanopia': { label: 'Red-Blind/Protanopia', positive: '#0072B2', neutral: '#F0E442', negative: '#CC79A7', info: '#5E4B4E' },
  'deuteranopia': { label: 'Green-Blind/Deuteranopia', positive: '#0072B2', neutral: '#F0E442', negative: '#D55E00', info: '#5E4B4E' },
  'tritanopia': { label: 'Blue-Blind/Tritanopia', positive: '#009E73', neutral: '#E69F00', negative: '#CC3311', info: '#5E4B4E' },
  'achromatopsia': { label: 'Monochromacy/Achromatopsia', positive: '#D4D4D4', neutral: '#a1a1a1', negative: '#595959', info: '#262626' },
  'blue_cone_monochromacy': { label: 'Blue Cone Monochromacy', positive: '#DEEBF7', neutral: '#9ECAE1', negative: '#3182BD', info: '#08519C' }
};

export const getStatusColors = (theme = 'default') => {
  // Cores dinâmicas por tema para os ícones e fundos
  const themeColors = HEATMAP_PALETTES[theme] || HEATMAP_PALETTES['default'];


  const base = {
    '2': { label: 'Suficiente', val: 2, icon: <CircleCheck size={20} style={{ color: themeColors.positive }} /> },
    'suficiente': { label: 'Suficiente', val: 2, icon: <CircleCheck size={20} style={{ color: themeColors.positive }} /> },
    '1': { label: 'Parcialmente Suficiente', val: 1, icon: <CircleMinus size={20} style={{ color: themeColors.neutral }} /> },
    'parcialmente': { label: 'Parcialmente Suficiente', val: 1, icon: <CircleMinus size={20} style={{ color: themeColors.neutral }} /> },
    '0': { label: 'Insuficiente', val: 0, icon: <CircleX size={20} style={{ color: themeColors.negative }} /> },
    'insuficiente': { label: 'Insuficiente', val: 0, icon: <CircleX size={20} style={{ color: themeColors.negative }} /> },
    '-1': { label: 'S/ Conteúdo Relevante', val: -1, icon: <RouteOff size={20} style={{ color: themeColors.info }} /> },
    'sem_conteudo': { label: 'S/ Conteúdo Relevante', val: -1, icon: <RouteOff size={20} style={{ color: themeColors.info }} /> },
    'null': { label: 'Em Branco', val: null, icon: <File size={20} className="text-gray-500" /> },
    'branco': { label: 'Em Branco', val: null, icon: <File size={20} className="text-gray-500" /> }
  };

  return {
    ...base,
    '2': { ...base['2'], bg: themeColors.positive, border: 'rgba(0,0,0,0.1)' },
    'suficiente': { ...base['suficiente'], bg: themeColors.positive, border: 'rgba(0,0,0,0.1)' },
    '1': { ...base['1'], bg: themeColors.neutral, border: 'rgba(0,0,0,0.1)' },
    'parcialmente': { ...base['parcialmente'], bg: themeColors.neutral, border: 'rgba(0,0,0,0.1)' },
    '0': { ...base['0'], bg: themeColors.negative, border: 'rgba(0,0,0,0.1)' },
    'insuficiente': { ...base['insuficiente'], bg: themeColors.negative, border: 'rgba(0,0,0,0.1)' },
    '-1': { ...base['-1'], bg: themeColors.info, border: 'rgba(0,0,0,0.1)' },
    'sem_conteudo': { ...base['sem_conteudo'], bg: themeColors.info, border: 'rgba(0,0,0,0.1)' },
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

  // Cores dinâmicas por tema para o degradê
  const themeColors = HEATMAP_PALETTES[theme] || HEATMAP_PALETTES['default'];

  const posRgb = hexToRgb(themeColors.positive);
  const neuRgb = hexToRgb(themeColors.neutral);
  const negRgb = hexToRgb(themeColors.negative);
  const infoRgb = hexToRgb(themeColors.info);

  const points = (theme === 'achromatopsia' || theme === 'blue_cone_monochromacy') ? [
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
