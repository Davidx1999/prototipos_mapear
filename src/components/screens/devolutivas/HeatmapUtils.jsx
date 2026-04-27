import React from 'react';
import { Check, X } from 'lucide-react';

// --- CORES DO STATUS DO HEATMAP E VALORES PARA CÁLCULO ---
export const statusColors = {
  suficiente: { bg: '#8CD47E', border: '#6FB963', label: 'Suficiente', val: 100, icon: <Check size={14} className="text-green-900" /> },
  parcialmente: { bg: '#F8D66D', border: '#E5C055', label: 'Parcialmente Suficiente', val: 50, icon: <div className="w-[10px] h-[2px] bg-yellow-900 rounded-full"></div> },
  insuficiente: { bg: '#FF6961', border: '#E0554E', label: 'Insuficiente', val: 0, icon: <X size={14} className="text-red-900" /> },
  sem_conteudo: { bg: '#B3E6F5', border: '#92C9D9', label: 'Sem Conteúdo Relevante', val: 25, icon: <div className="w-[8px] h-[8px] border-2 border-cyan-800 rounded-full"></div> },
  branco: { bg: '#FFFFFF', border: '#E5E7EB', label: 'Em Branco', val: 0, icon: <div className="w-[10px] h-[12px] border border-gray-400 rounded-sm"></div> }
};

// --- FUNÇÃO PARA DEGRADÊ DE CORES ---
export const getColorFromGradient = (value, isActive = true, theme = 'default') => {
  if (!isActive) return '#E5E7EB';
  if (value === '-' || value === null || isNaN(value)) return '#FFFFFF';

  const points = theme === 'colorblind' ? [
    { val: 0, r: 255, g: 255, b: 255 },   // Branco
    { val: 25, r: 200, g: 200, b: 200 }, // Cinza
    { val: 50, r: 213, g: 94, b: 0 },    // Vermilion
    { val: 75, r: 240, g: 228, b: 66 },  // Yellow
    { val: 100, r: 0, g: 114, b: 178 }   // Blue
  ] : [
    { val: 0, r: 255, g: 255, b: 255 },   // Branco
    { val: 25, r: 179, g: 230, b: 245 },  // Azul (#B3E6F5)
    { val: 50, r: 255, g: 105, b: 97 },   // Vermelho (#FF6961)
    { val: 75, r: 248, g: 214, b: 109 },  // Amarelo (#F8D66D)
    { val: 100, r: 140, g: 212, b: 126 }  // Verde (#8CD47E)
  ];

  let lower = points[0];
  let upper = points[points.length - 1];

  for (let i = 0; i < points.length - 1; i++) {
    if (value >= points[i].val && value <= points[i + 1].val) {
      lower = points[i];
      upper = points[i + 1];
      break;
    }
  }

  const range = upper.val - lower.val;
  const fraction = range === 0 ? 0 : (value - lower.val) / range;

  const r = Math.round(lower.r + (upper.r - lower.r) * fraction);
  const g = Math.round(lower.g + (upper.g - lower.g) * fraction);
  const b = Math.round(lower.b + (upper.b - lower.b) * fraction);

  return `rgb(${r}, ${g}, ${b})`;
};

// --- GERAÇÃO DE MOCK DATA MASSIVO ---
export const baseStatusKeys = ['suficiente', 'parcialmente', 'insuficiente', 'sem_conteudo', 'branco'];

export const colGroups = Array.from({ length: 4 }, (_, gIdx) => ({
  title: gIdx % 2 === 0 ? 'Integrar e Interpretar' : 'Raciocínio Analítico',
  cols: Array.from({ length: 10 }, (_, cIdx) => ({
    id: `I${gIdx * 10 + cIdx + 1}`,
    skills: [`H${(cIdx % 10) + 1}`, `H${((cIdx + 1) % 10) + 1}`]
  }))
}));

export const getMockRows = (level, parentName) => {
  if (level === 0) return ['Minas Gerais', 'Ceará', 'São Paulo'].map(name => ({ name, data: Array.from({ length: 40 }, () => baseStatusKeys[Math.floor(Math.random() * 5)]) }));
  if (level === 1) return ['Teófilo Otoni', 'Belo Horizonte', 'Contagem', 'Uberlândia'].map(name => ({ name, data: Array.from({ length: 40 }, () => baseStatusKeys[Math.floor(Math.random() * 5)]) }));
  if (level === 2) return ['Escola Estadual Dr. João', 'Colégio Alpha', 'Escola Municipal Central'].map(name => ({ name, data: Array.from({ length: 40 }, () => baseStatusKeys[Math.floor(Math.random() * 5)]) }));
  if (level === 3) return ['Turma 101', 'Turma 102', 'Turma 103'].map(name => ({ name, data: Array.from({ length: 40 }, () => baseStatusKeys[Math.floor(Math.random() * 5)]) }));
  return Array.from({ length: 20 }, (_, i) => ({
    name: i === 2 ? 'Henrique Santos' : `Aluno ${i + 1} Sobrenome Completo`,
    data: i === 2
      ? Array.from({ length: 40 }, () => 'branco')
      : Array.from({ length: 40 }, () => baseStatusKeys[Math.floor(Math.random() * baseStatusKeys.length)])
  }));
};

// Mock DB for CascadeSelector
export const devDB = {
  estados: ['Ceará', 'Minas Gerais', 'São Paulo'],
  cidades: { 'Ceará': ['Sobral', 'Fortaleza'], 'Minas Gerais': ['Teófilo Otoni', 'Belo Horizonte'] },
  escolas: { 'Sobral': ['Escola Osmar de Sá', 'Colégio Sant’Ana'], 'Teófilo Otoni': ['Escola Estadual', 'Colégio Alpha'] },
  turmas: { 'Escola Osmar de Sá': ['Turma A', 'Turma B'], 'Escola Estadual': ['Turma 101', 'Turma 102'] },
  avaliacoes: { 'Turma A': [{ id: 'av1', nome: 'Brasil em Foco: Cultura e Sociedade' }, { id: 'av2', nome: 'Matemática Básica' }] }
};

export const CASCADE_LEVELS = [
  { id: 'estado', title: 'Estado' },
  { id: 'cidade', title: 'Município' },
  { id: 'escola', title: 'Escola' },
  { id: 'turma', title: 'Turma' },
  { id: 'avaliacao', title: 'Avaliação' }
];
