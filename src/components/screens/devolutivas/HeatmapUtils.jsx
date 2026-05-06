import React from 'react';
import { Check, X } from 'lucide-react';

// --- CORES DO STATUS DO HEATMAP E VALORES PARA CÁLCULO ---
export const statusColors = {
  '2': { bg: '#8CD47E', border: '#6FB963', label: 'Suficiente', val: 2, icon: <Check size={14} className="text-green-900" /> },
  '1': { bg: '#F8D66D', border: '#E5C055', label: 'Parcialmente Suficiente', val: 1, icon: <div className="w-[10px] h-[2px] bg-yellow-900 rounded-full"></div> },
  '0': { bg: '#FF6961', border: '#E0554E', label: 'Insuficiente', val: 0, icon: <X size={14} className="text-red-900" /> },
  '-1': { bg: '#B3E6F5', border: '#92C9D9', label: 'Sem Conteúdo Relevante', val: -1, icon: <div className="w-[8px] h-[8px] border-2 border-cyan-800 rounded-full"></div> },
  'null': { bg: '#FFFFFF', border: '#E5E7EB', label: 'Em Branco', val: null, icon: <div className="w-[10px] h-[12px] border border-gray-400 rounded-sm"></div> }
};

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

// --- GERAÇÃO DE MOCK DATA MASSIVO ---
export const colGroups = Array.from({ length: 3 }, (_, gIdx) => ({
  title: gIdx === 0 ? 'Integrar e Interpretar' : (gIdx === 1 ? 'Raciocínio Analítico' : 'Compreensão'),
  cols: Array.from({ length: 10 }, (_, cIdx) => ({
    id: `I${gIdx * 10 + cIdx + 1}`,
    skills: [`H${(cIdx % 10) + 1}`, `H${((cIdx + 1) % 10) + 1}`]
  }))
}));

export const getMockRows = (level, parentName) => {
  // Mock data implementation adjusted for students only
  return Array.from({ length: 20 }, (_, i) => {
    let data = [];
    if (i < 12) {
      data = Array.from({ length: 30 }, () => Math.random() > 0.2 ? 2 : 1);
    } else if (i < 16) {
      data = Array.from({ length: 30 }, () => {
        const r = Math.random();
        return r > 0.3 ? 1 : (r > 0.15 ? 2 : 0);
      });
    } else if (i < 18) {
      data = Array.from({ length: 30 }, () => Math.random() > 0.2 ? 0 : (Math.random() > 0.5 ? 1 : -1));
    } else {
      data = Array.from({ length: 30 }, () => null);
    }
    
    if (i < 18) {
      data = data.map(v => {
        if (Math.random() < 0.05) return null;
        if (Math.random() < 0.05) return -1;
        return v;
      });
    }

    const evalName = typeof parentName === 'object' ? parentName.nome : parentName;
    return {
      name: `Aluno ${i + 1} ${evalName ? `(${evalName})` : ''}`,
      data
    };
  });
};

// --- MOCK DATA: CASCATA INVERTIDA (ESCOLA > AVALIAÇÃO > TURMAS) ---
export const devDB = {
  'Ceará': {
    'Fortaleza': {
      'Regional 1': {
        'Liceu do Conjunto Ceará': {
          'Avaliação 1 Lorem ipsum': ['Turma A', 'Turma B', 'Turma C', 'Turma D'],
          'Avaliação 2 Diagnóstica': ['Turma A', 'Turma B']
        },
        'Colégio da Polícia Militar': {
          'Avaliação 1 Lorem ipsum': ['Turma Única']
        }
      },
      'Regional 2': {
        'EEEP Maria José': {
          'Avaliação Global': ['Turma 1', 'Turma 2']
        }
      }
    },
    'Caucaia': {
      'Regional Caucaia Litoral': {
        'Escola Praia do Cumbuco': {
          'Avaliação Estadual': ['Turma A']
        }
      },
      'Regional Caucaia Sertão': {} 
    },
    'Eusébio': {
      'Regional Sede Eusébio': {
        'Escola Profissionalizante Eusébio': {
          'Avaliação Matemática': ['Turma Tarde', 'Turma Manhã'],
          'Avaliação Ciências': ['Turma Tarde']
        },
        'Colégio Padrão': {} 
      }
    }
  },
  'São Paulo': {
    'São Paulo': {
      'Zona Sul': {
        'Escola Estadual SP': {
          'Avaliação SARESP': ['Turma 9A', 'Turma 9B']
        }
      }
    }
  }
};

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
