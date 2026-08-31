import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Search, Plus, Eye, Sliders, FileText, Filter, X, ChevronDown, Check,
  Layers, Copy, CheckCircle2, Building2, Calendar, AlertTriangle, Archive, Trash2, Edit3
} from 'lucide-react';
import Button from '../../ui/Button';
import Breadcrumb from '../../ui/Breadcrumb';
import Input from '../../ui/Input';
import Tabs from '../../ui/Tabs';
import { defaultColors } from '../../../data/constants';

import AvaliacoesQueueView from './components/AvaliacoesQueueView';
import AvaliacoesKanbanView from './components/AvaliacoesKanbanView';
import AvaliacoesTreeView from './components/AvaliacoesTreeView';
import AvaliacaoInspectorDrawer from './components/AvaliacaoInspectorDrawer';
import CommandPaletteModal from './components/CommandPaletteModal';
import EntityLegendBar from './components/EntityLegendBar';
import CreateAssessmentScreen from './components/CreateAssessmentScreen';
import AvaliacoesTrashModal from './components/AvaliacoesTrashModal';
import AvaliacoesHistoryView from './components/AvaliacoesHistoryView';
import AvaliacoesEditor from './AvaliacoesEditor';

// ─── ENRICHED MOCK DATA INCLUDING HISTORICAL YEARS (2026, 2025, 2024) ───
const INITIAL_ASSESSMENTS = [
  // ── ACTIVE 2026 ──
  {
    id: 'av-001',
    code: 'AV-SOB-2026-0042',
    title: 'Avaliação Formativa 2 – Rede Estadual de Mato Grosso do Sul – Anos Iniciais do Ensino Fundamental (4º e 5º anos): Diagnóstico Pedagógico de Aprendizagens, Habilidades e Competências Curriculares Essenciais com Foco no Monitoramento e no Avanço Escolar Integral',
    schoolYear: '2026',
    municipality: 'Sobral',
    grade: '5º Ano - Ensino Fundamental',
    subject: 'Língua Portuguesa',
    subjectSummary: 'Língua Portuguesa',
    type: 'Somativa',
    scale: 'larga',
    correctionMethod: 'Correção com IA (HTR)',
    applicationMode: 'impressa',
    startDate: '2026-08-18',
    endDate: '2026-08-22',
    correctionDeadline: '2026-09-15',
    status: 'Em edição',
    nextStep: 'Finalizar cadastro de 2 gabaritos pendentes',
    owner: 'Prof. Carlos',
    testsCount: 2, tasksCount: 6, itemsCount: 24,
    testsTree: [
      {
        title: 'Caderno 01 - Leitura e Interpretação',
        subject: 'Língua Portuguesa',
        tasks: [
          {
            title: 'Tarefa 01 - Compreensão Leitora',
            cognitiveProcess: 'Compreender',
            responseType: 'Híbrida',
            knowledgeArea: 'Leitura',
            itemsCount: 4,
            hasItemComposto: true,
            itemCompostoTitle: 'Texto "O Menino e o Rio"',
            itemCompostoMarkdown: '# O Menino e o Rio\n\nEra uma vez um menino que morava nas margens do **Rio Parnaíba**.',
            items: [
              { title: 'Item 01', skill: 'EF05LP09', skillDesc: 'Ler e compreender com autonomia textos instrucionais', expectation: 'Localizar informações explícitas', descriptor: 'D1 - Informação explícita', difficulty: 'Fácil', hasAnswer: true },
              { title: 'Item 02', skill: 'EF05LP10', skillDesc: 'Inferir informações implícitas nos textos lidos', expectation: 'Inferir sentido de palavras', descriptor: 'D3 - Sentido de palavras', difficulty: 'Médio', hasAnswer: true }
            ]
          },
          {
            title: 'Tarefa 02 - Produção Textual',
            cognitiveProcess: 'Criar',
            responseType: 'Resposta Construída',
            knowledgeArea: 'Escrita',
            itemsCount: 2,
            hasItemComposto: false,
            items: [
              { title: 'Item 03', skill: 'EF05LP12', skillDesc: 'Produzir textos com coesão e coerência', expectation: 'Produzir narrativa completa', descriptor: 'D15 - Produção textual', difficulty: 'Difícil', hasAnswer: false },
              { title: 'Item 04', skill: '', skillDesc: '', expectation: '', descriptor: '', difficulty: 'Médio', hasAnswer: false }
            ]
          }
        ]
      },
      {
        title: 'Caderno 02 - Gramática Aplicada',
        subject: 'Língua Portuguesa',
        tasks: [
          {
            title: 'Tarefa 03 - Análise Linguística',
            cognitiveProcess: 'Analisar',
            responseType: 'Múltipla Escolha',
            knowledgeArea: 'Gramática',
            itemsCount: 4,
            hasItemComposto: false,
            items: [
              { title: 'Item 01', skill: 'EF05LP26', skillDesc: 'Identificar classes gramaticais', expectation: 'Identificar substantivos e adjetivos', descriptor: 'D10 - Classes gramaticais', difficulty: 'Fácil', hasAnswer: true },
              { title: 'Item 02', skill: 'EF05LP27', skillDesc: 'Uso de concordância verbal', expectation: 'Concordância sujeito-verbo', descriptor: 'D11 - Concordância', difficulty: 'Médio', hasAnswer: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'av-002',
    code: 'AV-FORT-2026-0018',
    title: 'Avaliação Diagnóstica de Matemática - 9º Ano',
    schoolYear: '2026',
    municipality: 'Fortaleza',
    grade: '9º Ano - Ensino Fundamental',
    subject: 'Matemática',
    subjectSummary: 'Matemática',
    type: 'Diagnóstica',
    scale: 'larga',
    correctionMethod: 'Correção Manual',
    applicationMode: 'impressa',
    startDate: '2026-08-25',
    endDate: '2026-08-29',
    correctionDeadline: '2026-08-30',
    status: 'Em edição',
    nextStep: 'Alocar turmas e definir período de aplicação',
    owner: 'Coord. Helena',
    testsCount: 1, tasksCount: 4, itemsCount: 20,
    testsTree: [
      {
        title: 'Caderno Único - Álgebra e Geometria',
        subject: 'Matemática',
        tasks: [
          {
            title: 'Tarefa 01 - Equações do 2º Grau',
            cognitiveProcess: 'Aplicar',
            responseType: 'Múltipla Escolha',
            knowledgeArea: 'Álgebra',
            itemsCount: 5,
            hasItemComposto: false,
            items: [
              { title: 'Item 01', skill: 'EF09MA09', skillDesc: 'Resolver problemas com equações de 2º grau', expectation: 'Aplicar fórmula de Bhaskara', descriptor: 'D19 - Equação de 2º grau', difficulty: 'Médio', hasAnswer: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'av-003',
    code: 'AV-CAU-2026-0007',
    title: 'Avaliação Formativa de Ciências da Natureza',
    schoolYear: '2026',
    municipality: 'Caucaia',
    grade: '4º Ano - Ensino Fundamental',
    subject: 'Ciências da Natureza',
    subjectSummary: 'Ciências da Natureza',
    type: 'Formativa',
    scale: 'pequena',
    correctionMethod: 'Correção com IA (HTR)',
    applicationMode: 'hibrida',
    startDate: '2026-09-01',
    endDate: '2026-09-05',
    correctionDeadline: '2026-10-05',
    status: 'Programada',
    nextStep: 'Alocar turmas e imprimir folhas de respostas HTR',
    owner: 'Prof. Marina',
    testsCount: 1, tasksCount: 3, itemsCount: 15,
    testsTree: [
      {
        title: 'Caderno de Ciências',
        subject: 'Ciências da Natureza',
        tasks: [
          {
            title: 'Tarefa 01 - Ecossistemas',
            cognitiveProcess: 'Compreender',
            responseType: 'Múltipla Escolha',
            items: [
              { title: 'Item 01', skill: 'EF04CI01', skillDesc: 'Identificar misturas', expectation: 'Classificar materiais', descriptor: 'D1', difficulty: 'Fácil', hasAnswer: true },
              { title: 'Item 02', skill: 'EF04CI02', skillDesc: 'Transformações reversíveis e irreversíveis', expectation: 'Diferenciar processos', descriptor: 'D2', difficulty: 'Médio', hasAnswer: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'av-004',
    code: 'AV-SOB-2026-0055',
    title: 'Avaliação Diagnóstica Geral - Multidisciplinar - 3º Ano',
    schoolYear: '2026',
    municipality: 'Sobral',
    grade: '3º Ano - Ensino Fundamental',
    subject: 'Multidisciplinar',
    subjectSummary: 'Língua Portuguesa, Matemática, Ciências da Natureza',
    type: 'Diagnóstica',
    scale: 'larga',
    correctionMethod: 'Correção com IA (HTR)',
    applicationMode: 'impressa',
    startDate: '2026-09-10',
    endDate: '2026-09-12',
    correctionDeadline: '2026-10-01',
    status: 'Em aplicação',
    nextStep: 'Acompanhar digitação das folhas HTR',
    owner: 'Coord. Fernanda',
    testsCount: 3, tasksCount: 9, itemsCount: 36,
    testsTree: [
      {
        title: 'Teste de Língua Portuguesa', subject: 'Língua Portuguesa', tasks: [
          {
            title: 'Tarefa 01 - Leitura', cognitiveProcess: 'Compreender', responseType: 'Múltipla Escolha', items: [
              { title: 'Item 01', skill: 'EF03LP14', skillDesc: 'Identificar informação em texto', expectation: 'Localizar informação explícita', descriptor: 'D1', difficulty: 'Fácil', hasAnswer: true }
            ]
          }
        ]
      },
      {
        title: 'Teste de Matemática', subject: 'Matemática', tasks: [
          {
            title: 'Tarefa 01 - Números', cognitiveProcess: 'Aplicar', responseType: 'Múltipla Escolha', items: [
              { title: 'Item 01', skill: 'EF03MA05', skillDesc: 'Resolver problemas de adição e subtração', expectation: 'Operar com números naturais', descriptor: 'D7', difficulty: 'Fácil', hasAnswer: true }
            ]
          }
        ]
      },
      {
        title: 'Teste de Ciências', subject: 'Ciências da Natureza', tasks: [
          {
            title: 'Tarefa 01 - Seres Vivos', cognitiveProcess: 'Conhecer', responseType: 'Múltipla Escolha', items: [
              { title: 'Item 01', skill: 'EF03CI04', skillDesc: 'Identificar características de animais', expectation: 'Classificar animais', descriptor: 'D1', difficulty: 'Fácil', hasAnswer: true }
            ]
          }
        ]
      }
    ]
  },
  {
    id: 'av-005',
    code: 'AV-MAR-2026-0012',
    title: 'Avaliação Somativa Bimestral - Matemática - 7º Ano',
    schoolYear: '2026',
    municipality: 'Maracanaú',
    grade: '7º Ano - Ensino Fundamental',
    subject: 'Matemática',
    subjectSummary: 'Matemática',
    type: 'Somativa',
    scale: 'pequena',
    correctionMethod: 'Correção Manual',
    applicationMode: 'digital',
    startDate: '2026-08-11',
    endDate: '2026-08-15',
    correctionDeadline: '2026-08-25',
    status: 'Em correção',
    nextStep: 'Digitação de gabaritos restantes (14/30 turmas)',
    owner: 'Prof. Ricardo',
    testsCount: 1, tasksCount: 5, itemsCount: 25,
    testsTree: [
      {
        title: 'Caderno Único - Proporcionalidade', subject: 'Matemática', tasks: [
          {
            title: 'Tarefa 01 - Razão e Proporção', cognitiveProcess: 'Aplicar', responseType: 'Múltipla Escolha', items: [
              { title: 'Item 01', skill: 'EF07MA17', skillDesc: 'Resolver problemas com proporção', expectation: 'Calcular grandezas proporcionais', descriptor: 'D28', difficulty: 'Médio', hasAnswer: true },
              { title: 'Item 02', skill: 'EF07MA18', skillDesc: 'Regra de três simples', expectation: 'Resolver regra de três', descriptor: 'D29', difficulty: 'Médio', hasAnswer: true }
            ]
          }
        ]
      }
    ]
  },
  // ── HISTORICAL ASSESSMENTS (2025 & 2024) ──
  {
    id: 'av-hist-001',
    code: 'AV-SOB-2025-0102',
    title: 'Avaliação Somativa Final de Língua Portuguesa - 2025',
    schoolYear: '2025',
    municipality: 'Sobral',
    grade: '5º Ano - Ensino Fundamental',
    subject: 'Língua Portuguesa',
    subjectSummary: 'Língua Portuguesa',
    type: 'Somativa',
    scale: 'larga',
    correctionMethod: 'Correção com IA (HTR)',
    applicationMode: 'impressa',
    startDate: '2025-11-03',
    endDate: '2025-11-07',
    correctionDeadline: '2025-11-20',
    status: 'Concluída',
    nextStep: 'Relatórios Históricos Arquivados',
    owner: 'Prof. Carlos',
    testsCount: 2, tasksCount: 6, itemsCount: 24,
    testsTree: []
  },
  {
    id: 'av-hist-002',
    code: 'AV-FORT-2025-0088',
    title: 'Avaliação Diagnóstica de Matemática - 2025',
    schoolYear: '2025',
    municipality: 'Fortaleza',
    grade: '9º Ano - Ensino Fundamental',
    subject: 'Matemática',
    subjectSummary: 'Matemática',
    type: 'Diagnóstica',
    scale: 'larga',
    correctionMethod: 'Correção Manual',
    applicationMode: 'impressa',
    startDate: '2025-03-10',
    endDate: '2025-03-14',
    correctionDeadline: '2025-03-30',
    status: 'Concluída',
    nextStep: 'Relatórios Históricos Arquivados',
    owner: 'Coord. Helena',
    testsCount: 1, tasksCount: 4, itemsCount: 20,
    testsTree: []
  },
  {
    id: 'av-hist-003',
    code: 'AV-JUA-2024-0044',
    title: 'Avaliação de Entrada de Alfabetização - 2024',
    schoolYear: '2024',
    municipality: 'Juazeiro do Norte',
    grade: '2º Ano - Ensino Fundamental',
    subject: 'Língua Portuguesa',
    subjectSummary: 'Língua Portuguesa',
    type: 'Diagnóstica',
    scale: 'pequena',
    correctionMethod: 'Correção Manual',
    applicationMode: 'impressa',
    startDate: '2024-03-04',
    endDate: '2024-03-08',
    correctionDeadline: '2024-04-15',
    status: 'Concluída',
    nextStep: 'Relatórios Históricos Arquivados',
    owner: 'Gestor Lucas',
    testsCount: 1, tasksCount: 3, itemsCount: 12,
    testsTree: []
  }
];

const MUNICIPALITIES = ['Todos os Municípios', 'Sobral', 'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú'];

// Configuração global da porcentagem de largura máxima para leitura centralizada (Editável por humanos no código)
export const CONTENT_MAX_WIDTH_PERCENT = 80;

const getAssessmentBlockers = (assessment) => {
  const tests = assessment.testsTree || [];
  const tasks = tests.flatMap(t => t.tasks || []);
  const items = tasks.flatMap(tf => tf.items || []);
  return [
    tests.length === 0 && 'nenhum teste criado',
    tests.some(t => !(t.tasks || []).length) && 'teste sem tarefas',
    tasks.some(tf => !(tf.items || []).length) && 'tarefa sem itens',
    items.some(item => !item.skill) && 'item sem habilidade associada',
    items.some(item => !item.expectation) && 'item sem expectativa de desempenho',
    assessment.startDate && assessment.endDate && new Date(assessment.endDate) < new Date(assessment.startDate) && 'prazo inválido',
  ].filter(Boolean);
};

const STATUS_HEADER_BG_MAP = {
  'Em edição': 'bg-[#FBBE77]',
  'Programada': 'bg-[#9EC4FA]',
  'Em aplicação': 'bg-[#B3E6F5]',
  'Aplicação encerrada': 'bg-[#FCA5A5]',
  'Em correção': 'bg-[#D9BBFF]',
  'Concluída': 'bg-[#B8EBAD]',
};

const STATUS_OPTIONS = [
  { id: 'Em edição', label: 'Em edição' },
  { id: 'Programada', label: 'Programada' },
  { id: 'Em aplicação', label: 'Em aplicação' },
  { id: 'Aplicação encerrada', label: 'Aplicação encerrada' },
  { id: 'Em correção', label: 'Em correção' },
  { id: 'Concluída', label: 'Concluída' },
];

const SCALE_OPTIONS = [
  { id: 'pequena', label: 'Pequena escala' },
  { id: 'larga', label: 'Larga escala' },
];

const TYPE_OPTIONS = [
  { id: 'Somativa', label: 'Somativa' },
  { id: 'Diagnóstica', label: 'Diagnóstica' },
  { id: 'Formativa', label: 'Formativa' },
];

const SUBJECT_OPTIONS = [
  { id: 'Língua Portuguesa', label: 'Língua Portuguesa' },
  { id: 'Matemática', label: 'Matemática' },
  { id: 'Ciências da Natureza', label: 'Ciências da Natureza' },
  { id: 'Multidisciplinar', label: 'Multidisciplinar' },
];

export default function AvaliacoesHubV2({ colors, navigateTo, isDarkMode, setIsGlobalHeaderHidden }) {
  const [assessments, setAssessments] = useState(INITIAL_ASSESSMENTS);
  const [trashAssessments, setTrashAssessments] = useState([]); // Lixeira

  const [viewMode, setViewMode] = useState('kanban'); // 'kanban' | 'queue' | 'history' | 'editor'
  const [editingAssessment, setEditingAssessment] = useState(null);
  const [selectedMunicipality, setSelectedMunicipality] = useState('Todos os Municípios');
  const [selectedAssessment, setSelectedAssessment] = useState(null);

  // Advanced Filters & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatuses, setSelectedStatuses] = useState([]);
  const [selectedScales, setSelectedScales] = useState([]);
  const [selectedTypes, setSelectedTypes] = useState([]);
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isFilterMenuOpen, setIsFilterMenuOpen] = useState(false);

  const filterPopoverRef = useRef(null);
  const searchInputRef = useRef(null);

  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isTrashOpen, setIsTrashOpen] = useState(false);
  const [confirmAdvance, setConfirmAdvance] = useState(null);
  const [toast, setToast] = useState(null);
  const [yearFilter, setYearFilter] = useState('Todos os Anos Antigos');

  useEffect(() => {
    if (viewMode === 'editor') {
      setIsGlobalHeaderHidden?.(true);
    } else {
      setIsGlobalHeaderHidden?.(false);
    }
  }, [viewMode, setIsGlobalHeaderHidden]);

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3500);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Click outside listener for filter popover
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (filterPopoverRef.current && !filterPopoverRef.current.contains(e.target)) {
        setIsFilterMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const generateAutomaticCode = useCallback((municipality = 'SOB', year = '2026') => {
    const sgl = municipality.substring(0, 3).toUpperCase();
    const yr = year.replace(/[^0-9]/g, '') || '2026';
    const seq = String(Math.floor(Math.random() * 900) + 100).padStart(4, '0');
    return `AV-${sgl}-${yr}-${seq}`;
  }, []);

  // Creation Handler -> Opens the exact same authoring workspace with empty template
  const handleCreateNew = useCallback(() => {
    const newAv = {
      id: `av-${Date.now()}`,
      code: generateAutomaticCode('SOB', '2026'),
      title: 'Nova Avaliação',
      schoolYear: '2026',
      municipality: 'Sobral',
      grade: '5º Ano - Ensino Fundamental',
      subject: 'Língua Portuguesa',
      type: 'Somativa',
      status: 'Em edição',
      tests: [
        {
          id: `teste-${Date.now()}`,
          code: 'CAD-01',
          title: 'Caderno 01',
          tasks: [
            {
              id: `tar-${Date.now()}`,
              code: 'TAR-01',
              title: 'Tarefa 01',
              hasItemComposto: false,
              items: [
                {
                  id: `it-${Date.now()}`,
                  code: 'Item 01',
                  title: 'Item 01',
                  type: 'multipla_escolha',
                  status: 'pendente',
                  enunciado: '',
                  contexto: '',
                  alternativas: [
                    { id: `alt-a-${Date.now()}`, letra: 'A', texto: '', isCorreta: true, analiseDistrator: '' },
                    { id: `alt-b-${Date.now()}`, letra: 'B', texto: '', isCorreta: false, analiseDistrator: '' }
                  ],
                  sentencaDescritora: '',
                  processosCognitivosSentenca: ['Compreender elementos'],
                  rubricas: { insuficiente: '', parcial: '', suficiente: '' },
                  gabarito: 'A'
                }
              ]
            }
          ]
        }
      ]
    };
    setEditingAssessment(newAv);
    setViewMode('editor');
  }, [generateAutomaticCode]);

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      const key = e.key.toLowerCase();

      // Ctrl or Cmd
      if (e.ctrlKey || e.metaKey) {
        if (key === 'k') {
          e.preventDefault();
          setIsCommandPaletteOpen(true);
        } else if (key === '1') {
          e.preventDefault();
          setViewMode('kanban');
        } else if (key === '2') {
          e.preventDefault();
          setViewMode('queue');
        }
      }

      // Alt (for New to avoid Ctrl+N browser conflict)
      if (e.altKey && key === 'n') {
        e.preventDefault();
        handleCreateNew();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [handleCreateNew]);

  const handleStartEdit = useCallback((avToEdit) => {
    setEditingAssessment(avToEdit);
    setViewMode('editor');
  }, []);

  // Delete Action -> Lixeira
  const handleDeleteAssessment = useCallback((avId) => {
    setAssessments(prev => {
      const toDelete = prev.find(a => a.id === avId);
      if (toDelete) {
        setTrashAssessments(t => [{ ...toDelete, deletedAt: new Date().toISOString() }, ...t]);
      }
      return prev.filter(a => a.id !== avId);
    });
    if (selectedAssessment && selectedAssessment.id === avId) {
      setSelectedAssessment(null);
    }
    setToast({ type: 'success', message: `✓ Avaliação movida para a Lixeira (retenção de 90 dias).` });
  }, [selectedAssessment]);

  // Trash Actions
  const handleRestoreFromTrash = useCallback((avId) => {
    setTrashAssessments(prev => {
      const toRestore = prev.find(a => a.id === avId);
      if (toRestore) {
        const restoredAv = { ...toRestore };
        delete restoredAv.deletedAt;
        setAssessments(a => [restoredAv, ...a]);
      }
      return prev.filter(a => a.id !== avId);
    });
    setToast({ type: 'success', message: '✓ Avaliação restaurada da lixeira.' });
  }, []);

  const handlePermanentDelete = useCallback((avId) => {
    setTrashAssessments(prev => prev.filter(a => a.id !== avId));
    setToast({ type: 'success', message: '✓ Avaliação excluída permanentemente.' });
  }, []);

  const handleEmptyTrash = useCallback(() => {
    setTrashAssessments([]);
    setToast({ type: 'success', message: '✓ Lixeira esvaziada.' });
    setIsTrashOpen(false);
  }, []);

  // Duplicate Action
  const handleDuplicateAssessment = useCallback((avToDuplicate) => {
    const newCode = generateAutomaticCode(avToDuplicate.municipality, '2026'); // Sempre clona pro ano atual
    const duplicatedAv = {
      ...avToDuplicate,
      id: `av-${Date.now()}`,
      code: newCode,
      schoolYear: '2026', // Clona para o ativo
      title: `${avToDuplicate.title} (Cópia)`,
      status: 'Em edição',
      nextStep: 'Revisar matrizes antes de programar',
      testsTree: JSON.parse(JSON.stringify(avToDuplicate.testsTree || []))
    };
    setAssessments(prev => [duplicatedAv, ...prev]);
    setSelectedAssessment(duplicatedAv);
    if (viewMode === 'history') setViewMode('queue');
    setToast({ type: 'success', message: `✓ Avaliação clonada para 2026! Código: ${newCode}` });
  }, [generateAutomaticCode, viewMode]);

  const confirmStatusAdvance = () => {
    if (!confirmAdvance) return;
    const targetAssessment = assessments.find(a => a.id === confirmAdvance.id);
    const blockers = getAssessmentBlockers(targetAssessment || {});
    if (confirmAdvance.newStatus === 'Programada' && blockers.length > 0) {
      setToast({ type: 'error', message: `Esta avaliação não pode ser publicada: ${blockers[0]}.` });
      setConfirmAdvance(null);
      return;
    }
    setAssessments(prev =>
      prev.map(a => a.id === confirmAdvance.id ? { ...a, status: confirmAdvance.newStatus, blockers: getAssessmentBlockers(a) } : a)
    );
    if (selectedAssessment && selectedAssessment.id === confirmAdvance.id) {
      setSelectedAssessment(prev => ({ ...prev, status: confirmAdvance.newStatus }));
    }
    setToast({ type: 'success', message: `✓ Estado alterado para "${confirmAdvance.newStatus}"` });
    setConfirmAdvance(null);
  };

  // Filter Handlers
  const handleToggleStatus = (statusId) => {
    setSelectedStatuses(prev => prev.includes(statusId) ? prev.filter(s => s !== statusId) : [...prev, statusId]);
  };

  const handleToggleScale = (scaleId) => {
    setSelectedScales(prev => prev.includes(scaleId) ? prev.filter(s => s !== scaleId) : [...prev, scaleId]);
  };

  const handleToggleType = (typeId) => {
    setSelectedTypes(prev => prev.includes(typeId) ? prev.filter(t => t !== typeId) : [...prev, typeId]);
  };

  const handleToggleSubject = (subjectId) => {
    setSelectedSubjects(prev => prev.includes(subjectId) ? prev.filter(s => s !== subjectId) : [...prev, subjectId]);
  };

  const handleClearAllFilters = () => {
    setSelectedStatuses([]);
    setSelectedScales([]);
    setSelectedTypes([]);
    setSelectedSubjects([]);
  };

  const activeFiltersCount = selectedStatuses.length + selectedScales.length + selectedTypes.length + selectedSubjects.length;

  // Separação Lógica: Ativas (2026) vs Históricas (< 2026)
  const activeAssessments = assessments.filter(a => a.schoolYear === '2026' || a.schoolYear === '2026 (Atual)');
  const historicalAssessments = assessments.filter(a => a.schoolYear !== '2026' && a.schoolYear !== '2026 (Atual)');
  const availableYears = [...new Set(historicalAssessments.map(a => a.schoolYear))].sort((a, b) => b.localeCompare(a));

  // Assessments filtradas por busca e filtros avançados
  const filteredActiveAssessments = activeAssessments.filter(a => {
    if (selectedMunicipality !== 'Todos os Municípios' && a.municipality !== selectedMunicipality) return false;

    // 1. Busca textual (Título, Código, Componente, Município)
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase().trim();
      const matchTitle = (a.title || '').toLowerCase().includes(q);
      const matchCode = (a.code || '').toLowerCase().includes(q);
      const matchSubject = (a.subjectSummary || a.subject || '').toLowerCase().includes(q);
      const matchMunicipality = (a.municipality || '').toLowerCase().includes(q);
      if (!matchTitle && !matchCode && !matchSubject && !matchMunicipality) return false;
    }

    // 2. Status
    if (selectedStatuses.length > 0 && !selectedStatuses.includes(a.status)) return false;

    // 3. Escala
    if (selectedScales.length > 0 && !selectedScales.includes(a.scale)) return false;

    // 4. Natureza da Avaliação
    if (selectedTypes.length > 0 && !selectedTypes.includes(a.type)) return false;

    // 5. Componente Curricular
    if (selectedSubjects.length > 0) {
      const avSubjects = [a.subject, a.subjectSummary].filter(Boolean).join(' ');
      const match = selectedSubjects.some(s => avSubjects.toLowerCase().includes(s.toLowerCase()));
      if (!match) return false;
    }

    return true;
  });

  if (viewMode === 'editor') {
    return (
      <AvaliacoesEditor
        assessment={editingAssessment || selectedAssessment || assessments[0]}
        onBack={() => {
          setIsGlobalHeaderHidden?.(false);
          setEditingAssessment(null);
          setViewMode('kanban');
        }}
        onSaveAssessment={(updatedAv) => {
          setAssessments(prev => {
            const exists = prev.some(a => a.id === updatedAv.id);
            if (exists) {
              return prev.map(a => a.id === updatedAv.id ? { ...a, ...updatedAv } : a);
            }
            return [updatedAv, ...prev];
          });
          setToast({ type: 'success', message: `✓ Avaliação "${updatedAv.title}" salva com sucesso!` });
        }}
        colors={colors}
        isDarkMode={isDarkMode}
      />
    );
  }

  return (
    <div className={`relative flex flex-col flex-1 h-full min-h-0 overflow-hidden font-['Montserrat',sans-serif] ${isDarkMode ? 'bg-neutral-7 text-white' : 'bg-brand-50/20 text-neutral-7'
      }`}>
      {/* Toast Notification */}
      {toast && (
        <div className="fixed top-4 right-4 z-[80] animate-bounce">
          <div className="bg-brand-500 text-white px-5 py-3 rounded-[8px] shadow-2xl font-semibold text-xs flex items-center gap-2 border border-brand-300">
            <CheckCircle2 size={16} />
            <span>{toast.message}</span>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {confirmAdvance && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm" onClick={() => setConfirmAdvance(null)}>
          <div className={`max-w-md p-6 rounded-[8px] shadow-2xl border ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2'}`} onClick={e => e.stopPropagation()}>
            <div className="flex items-start gap-3 mb-4">
              <AlertTriangle size={24} className="text-extended-orange-base shrink-0 mt-0.5" />
              <div>
                <h3 className="font-bold text-sm text-neutral-8 dark:text-white">Confirmar Avanço de Estado</h3>
                <p className="text-xs text-neutral-6 dark:text-neutral-3 mt-1 font-medium">
                  Deseja alterar o estado desta avaliação para <strong className="text-brand-500">"{confirmAdvance.newStatus}"</strong>?
                </p>
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="tertiary" appearance="solid" size="sm" onClick={() => setConfirmAdvance(null)}>Cancelar</Button>
              <Button variant="primary" appearance="solid" size="sm" onClick={confirmStatusAdvance}>Confirmar</Button>
            </div>
          </div>
        </div>
      )}

      {/* ─── TOOLBAR & NAVEGAÇÃO ─── */}
      {!isTrashOpen && (
        <div className={`border-b-2 shrink-0 pt-2.5 pb-0 ${isDarkMode ? 'border-neutral-5 bg-neutral-7/60' : 'border-neutral-2 bg-white/80'}`}>
          <div className="w-full mx-auto px-4 flex flex-col gap-[2px]" style={{ maxWidth: `${CONTENT_MAX_WIDTH_PERCENT}%` }}>

            {/* LINHA 1 (SUPERIOR): Breadcrumb / Título à esquerda + Gestão Secundária (Histórico | Lixeira) à direita */}
            <div className="flex items-center justify-between gap-3">
              {/* Esquerda: Breadcrumb e Título */}
              <div className="flex items-center gap-3">
                <Breadcrumb
                  paths={[{ label: 'Editor de Avaliações' }]}
                  onBack={() => navigateTo('dashboard')}
                  className="mb-0"
                />
              </div>

              {/* Direita: Área Secundária de Gestão [Arquivo Histórico | Lixeira] */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Button
                  variant={viewMode === 'history' ? 'primary' : 'tertiary'}
                  appearance={viewMode === 'history' ? 'solid' : 'ghost'}
                  size="xs"
                  iconLeft={<Archive size={13} />}
                  onClick={() => setViewMode(viewMode === 'history' ? 'kanban' : 'history')}
                  title="Acessar arquivo histórico de avaliações de anos anteriores"
                >
                  Arquivo Histórico
                </Button>

                <div className="h-4 w-px bg-neutral-3 dark:bg-neutral-5 my-auto mx-0.5" />

                <Button
                  variant="tertiary"
                  appearance="ghost"
                  size="xs"
                  iconLeft={<Trash2 size={13} className={trashAssessments.length > 0 ? 'text-semantic-error-base' : 'text-neutral-5'} />}
                  onClick={() => setIsTrashOpen(true)}
                  title="Ver Lixeira de Avaliações Excluídas"
                >
                  Lixeira {trashAssessments.length > 0 && `(${trashAssessments.length})`}
                </Button>
              </div>
            </div>

            {/* LINHA 2 (CONSULTA E VISUALIZAÇÃO):
                Esquerda: Visualização [Kanban | Fila de Foco]
                Direita: Refinamento dos Dados [Filtros] + Busca Direta [Buscar avaliações...]
            */}
            <div className="flex items-end justify-between gap-3 flex-wrap md:flex-nowrap">
              {/* Esquerda: Visualização: Kanban | Fila de Foco */}
              <div className="flex items-center">
                {viewMode !== 'history' ? (
                  <Tabs
                    tabs={[
                      { id: 'kanban', label: 'Kanban', icon: <Sliders /> },
                      { id: 'queue', label: 'Fila de Foco', icon: <Eye /> }
                    ]}
                    activeTab={viewMode}
                    onChange={(tabId) => setViewMode(tabId)}
                    variant="line"
                    size="sm"
                    colors={colors || defaultColors}
                    className="!w-auto !border-b-0"
                  />
                ) : (
                  <div className="flex items-center gap-2 text-xs font-medium flex-wrap pb-2">
                    <span className="text-neutral-5 dark:text-neutral-4 uppercase text-[10px] font-bold tracking-widest mr-1">Filtrar Histórico:</span>
                    <select
                      value={yearFilter}
                      onChange={e => setYearFilter(e.target.value)}
                      className={`px-3 py-1 h-[30px] text-xs font-bold border rounded-[8px] outline-none cursor-pointer transition-colors shadow-sm ${isDarkMode
                        ? 'bg-neutral-8 border-neutral-6 text-neutral-2 hover:bg-neutral-7'
                        : 'bg-white border-neutral-3 text-neutral-7 hover:bg-neutral-1'
                        }`}
                    >
                      <option value="Todos os Anos Antigos">Todos os Anos Antigos</option>
                      {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                  </div>
                )}
              </div>

              {/* Direita: Refinamento dos dados: Filtros + Busca direta dentro de div com py-[4px] px-0 */}
              <div className="flex items-center gap-2 shrink-0 py-[4px] px-0 mb-1">
                {/* Botão e Popover de Filtros */}
                <div className="relative" ref={filterPopoverRef}>
                  <Button
                    variant={activeFiltersCount > 0 ? 'primary' : 'tertiary'}
                    appearance="solid"
                    size="xs"
                    iconLeft={<Filter size={13} />}
                    onClick={() => setIsFilterMenuOpen(!isFilterMenuOpen)}
                    className="font-bold"
                  >
                    <span>Filtros</span>
                    {activeFiltersCount > 0 && (
                      <span className="ml-1 px-1.5 py-0.2 rounded-full bg-white text-brand-700 dark:bg-brand-900 dark:text-brand-200 text-[10px] font-bold">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>

                  {/* Dropdown Popover de Filtros */}
                  {isFilterMenuOpen && (
                    <div className={`absolute right-0 top-full mt-1.5 w-[320px] rounded-[8px] shadow-2xl border p-4 z-[100] animate-in fade-in slide-in-from-top-1 duration-150 ${isDarkMode ? 'bg-neutral-8 border-neutral-6 text-white' : 'bg-white border-neutral-2 text-neutral-8'
                      }`}>
                      <div className="flex items-center justify-between pb-2.5 border-b border-neutral-2 dark:border-neutral-7 mb-3">
                        <div className="flex items-center gap-1.5">
                          <Filter size={13} className="text-brand-500" />
                          <span className="text-xs font-bold uppercase tracking-wider text-neutral-7 dark:text-neutral-2">Filtros</span>
                        </div>
                        {activeFiltersCount > 0 && (
                          <button
                            type="button"
                            onClick={handleClearAllFilters}
                            className="text-[11px] font-semibold text-brand-600 dark:text-brand-400 hover:underline cursor-pointer"
                          >
                            Limpar filtros
                          </button>
                        )}
                      </div>

                      <div className="space-y-4 max-h-[380px] overflow-y-auto pr-0.5">
                        {/* 1. Status */}
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-4 dark:text-neutral-4 mb-1.5 block">
                            Status
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {STATUS_OPTIONS.map(opt => {
                              const isSelected = selectedStatuses.includes(opt.id);
                              const headerBg = STATUS_HEADER_BG_MAP[opt.id] || 'bg-neutral-200';
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleToggleStatus(opt.id)}
                                  className={`px-2.5 py-1 rounded-[6px] text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                                    ? `${headerBg} text-black ring-2 ring-neutral-800/20 shadow-xs border border-transparent`
                                    : 'bg-neutral-1 dark:bg-neutral-7/60 border border-neutral-3/60 dark:border-neutral-6 text-neutral-7 dark:text-neutral-3 hover:bg-neutral-2 dark:hover:bg-neutral-7'
                                    }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center ${isSelected ? 'bg-black border-black text-white' : 'border-neutral-4 bg-white dark:bg-neutral-8'
                                    }`}>
                                    {isSelected && <Check size={10} strokeWidth={3} />}
                                  </div>
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 2. Escala */}
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-4 dark:text-neutral-4 mb-1.5 block">
                            Escala
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {SCALE_OPTIONS.map(opt => {
                              const isSelected = selectedScales.includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleToggleScale(opt.id)}
                                  className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                                    ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                                    : 'bg-neutral-1 dark:bg-neutral-7/60 border-neutral-3/60 dark:border-neutral-6 text-neutral-7 dark:text-neutral-3 hover:bg-neutral-2 dark:hover:bg-neutral-7'
                                    }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center ${isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-neutral-4 bg-white dark:bg-neutral-8'
                                    }`}>
                                    {isSelected && <Check size={10} strokeWidth={3} />}
                                  </div>
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 3. Natureza */}
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-4 dark:text-neutral-4 mb-1.5 block">
                            Natureza
                          </label>
                          <div className="flex flex-wrap gap-1.5">
                            {TYPE_OPTIONS.map(opt => {
                              const isSelected = selectedTypes.includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleToggleType(opt.id)}
                                  className={`px-2.5 py-1 rounded-[6px] text-xs font-semibold border transition-all flex items-center gap-1.5 cursor-pointer ${isSelected
                                    ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                                    : 'bg-neutral-1 dark:bg-neutral-7/60 border-neutral-3/60 dark:border-neutral-6 text-neutral-7 dark:text-neutral-3 hover:bg-neutral-2 dark:hover:bg-neutral-7'
                                    }`}
                                >
                                  <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center ${isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-neutral-4 bg-white dark:bg-neutral-8'
                                    }`}>
                                    {isSelected && <Check size={10} strokeWidth={3} />}
                                  </div>
                                  <span>{opt.label}</span>
                                </button>
                              );
                            })}
                          </div>
                        </div>

                        {/* 4. Componente Curricular */}
                        <div>
                          <label className="text-[10px] font-bold uppercase tracking-wider text-neutral-4 dark:text-neutral-4 mb-1.5 block">
                            Componente Curricular
                          </label>
                          <div className="flex flex-col gap-1">
                            {SUBJECT_OPTIONS.map(opt => {
                              const isSelected = selectedSubjects.includes(opt.id);
                              return (
                                <button
                                  key={opt.id}
                                  type="button"
                                  onClick={() => handleToggleSubject(opt.id)}
                                  className={`px-2.5 py-1.5 rounded-[6px] text-xs font-semibold border transition-all flex items-center justify-between cursor-pointer ${isSelected
                                    ? 'bg-brand-50 dark:bg-brand-900/30 border-brand-500 text-brand-700 dark:text-brand-300 font-bold'
                                    : 'bg-neutral-1 dark:bg-neutral-7/60 border-neutral-3/60 dark:border-neutral-6 text-neutral-7 dark:text-neutral-3 hover:bg-neutral-2 dark:hover:bg-neutral-7'
                                    }`}
                                >
                                  <div className="flex items-center gap-2">
                                    <div className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center ${isSelected ? 'bg-brand-500 border-brand-500 text-white' : 'border-neutral-4 bg-white dark:bg-neutral-8'
                                      }`}>
                                      {isSelected && <Check size={10} strokeWidth={3} />}
                                    </div>
                                    <span>{opt.label}</span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Busca Direta (Search Input) */}
                <div className="w-[210px] sm:w-[250px] md:w-[270px]">
                  <Input
                    ref={searchInputRef}
                    type="text"
                    placeholder="Buscar avaliações..."
                    value={searchQuery}
                    readOnly
                    onClick={() => setIsCommandPaletteOpen(true)}
                    iconLeft={<Search size={15} className="text-neutral-6 dark:text-neutral-4" />}
                    iconRight={
                      <kbd className="font-mono text-[9px] bg-neutral-2 dark:bg-neutral-6 px-1 py-0.5 rounded font-bold text-neutral-6 dark:text-neutral-3">
                        Ctrl+K
                      </kbd>
                    }
                    height="32px"
                    className="!text-xs !bg-white dark:!bg-neutral-8 cursor-pointer"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {isTrashOpen ? (
        <AvaliacoesTrashModal
          isOpen={isTrashOpen}
          onClose={() => setIsTrashOpen(false)}
          trashAssessments={trashAssessments}
          onRestore={handleRestoreFromTrash}
          onPermanentDelete={handlePermanentDelete}
          onEmptyTrash={handleEmptyTrash}
          isDarkMode={isDarkMode}
        />
      ) : (
        <div className="flex-1 flex min-h-0 overflow-hidden relative">
          <div className="flex-1 flex flex-col min-w-0 overflow-hidden w-full">
            {viewMode === 'queue' && (
              <AvaliacoesQueueView assessments={filteredActiveAssessments} onSelectAssessment={setSelectedAssessment} onDuplicate={handleDuplicateAssessment} onUpdateStatus={(id, st) => setConfirmAdvance({ id, newStatus: st })} selectedAssessmentId={selectedAssessment?.id} isDarkMode={isDarkMode} />
            )}
            {viewMode === 'kanban' && (
              <AvaliacoesKanbanView assessments={filteredActiveAssessments} onSelectAssessment={setSelectedAssessment} onDuplicate={handleDuplicateAssessment} onUpdateStatus={(id, st) => setConfirmAdvance({ id, newStatus: st })} onCreateNew={handleCreateNew} selectedAssessmentId={selectedAssessment?.id} isDarkMode={isDarkMode} />
            )}
            {viewMode === 'tree' && (
              <AvaliacoesTreeView assessments={filteredActiveAssessments} onSelectAssessment={setSelectedAssessment} onDuplicate={handleDuplicateAssessment} isDarkMode={isDarkMode} />
            )}
            {viewMode === 'history' && (
              <AvaliacoesHistoryView
                historicalAssessments={historicalAssessments}
                onDuplicateToCurrentYear={handleDuplicateAssessment}
                onSelectAssessment={setSelectedAssessment}
                yearFilter={yearFilter}
                isDarkMode={isDarkMode}
              />
            )}
          </div>

          {selectedAssessment && (
            <AvaliacaoInspectorDrawer
              assessment={selectedAssessment}
              onClose={() => setSelectedAssessment(null)}
              onDuplicate={handleDuplicateAssessment}
              onEdit={handleStartEdit}
              onDelete={handleDeleteAssessment}
              onUpdateStatus={(id, st) => setConfirmAdvance({ id, newStatus: st })}
              isDarkMode={isDarkMode}
              setToast={setToast}
              isHistoryMode={viewMode === 'history'}
            />
          )}
        </div>
      )}

      {/* Command Palette */}
      <CommandPaletteModal isOpen={isCommandPaletteOpen} onClose={() => setIsCommandPaletteOpen(false)} assessments={assessments} onSelectAssessment={setSelectedAssessment} onCreateNew={() => { setIsCommandPaletteOpen(false); handleCreateNew(); }} onDuplicate={handleDuplicateAssessment} onSwitchView={setViewMode} isDarkMode={isDarkMode} />
    </div>
  );
}
