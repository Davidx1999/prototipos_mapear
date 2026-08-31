import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  ArrowLeft, ArrowRight, Check, BookOpen, Search,
  Plus, Trash2, Calendar, FileText, X, AlertTriangle,
  Target, Brain, Sparkles, Cpu, Printer, Monitor, Layers,
  ShieldCheck, Info, Bookmark, BookMarked, BookOpenText, Route, Paperclip, Database,
  ChevronDown, ChevronUp, Eye, School, Network,
  UserCheck, Clock, Wand2, ListChecks, MessageCircle, List, PlusCircle, Loader2
} from 'lucide-react';
import Button from '../../../ui/Button';
import Chips from '../../../ui/Chips';
import MarkdownContextModal from './MarkdownContextModal';
import BancoTarefasHubV2 from '../../BancoTarefas/BancoTarefasHubV2';

/**
 * CreateAssessmentScreen — Fluxo guiado de 4 etapas para planejar, construir e validar avaliações.
 *
 * UI baseada no protótipo HTML aprovado como fonte de verdade.
 * Design System: MAPEAR (Montserrat, brand-*, neutral-*, extended-*)
 *
 * Etapa 1: Identificação e Escopo (Título, Natureza, Alternativas)
 * Etapa 2: Construção (Testes → Tarefas → Itens, BNCC Skills, Markdown)
 * Etapa 3: Configurações de Aplicação e Correção
 * Etapa 4: Revisão Final e Descrição IA
 */

// ─── CONSTANTS ─────────────────────────────────────────────────────────────

const COGNITIVE_PROCESSES = ['Lembrar', 'Compreender', 'Aplicar', 'Analisar', 'Avaliar', 'Criar'];
const RESPONSE_TYPES = ['Múltipla Escolha', 'Resposta Construída', 'Híbrida'];
const MUNICIPALITIES = ['Sobral', 'Fortaleza', 'Caucaia', 'Juazeiro do Norte', 'Maracanaú', 'Crato'];
const YEARS = ['2026', '2025', '2024'];
const GRADES = ['1º Ano - EF', '2º Ano - EF', '3º Ano - EF', '4º Ano - EF', '5º Ano - EF', '6º Ano - EF', '7º Ano - EF', '8º Ano - EF', '9º Ano - EF', '1ª Série - EM', '2ª Série - EM', '3ª Série - EM'];
const SUBJECTS = ['Língua Portuguesa', 'Matemática', 'Ciências da Natureza', 'Ciências Humanas', 'Multidisciplinar'];

const AVAILABLE_SKILLS = [
  // MATEMÁTICA (15)
  { id: 'EF05MA01', desc: 'Ler, escrever e ordenar números naturais até a ordem das centenas de milhar' },
  { id: 'EF05MA02', desc: 'Ler, escrever e comparar números racionais na forma decimal' },
  { id: 'EF05MA03', desc: 'Identificar frações equivalentes em diferentes contextos' },
  { id: 'EF05MA04', desc: 'Identificar frações como partes de inteiros e de conjuntos de elementos' },
  { id: 'EF05MA05', desc: 'Comparar e ordenar frações associadas às ideias de partes de inteiros' },
  { id: 'EF05MA06', desc: 'Associar as representações 10%, 25%, 50%, 75% e 100% à décima parte, quarta parte, metade e três quartas partes' },
  { id: 'EF05MA07', desc: 'Resolver problemas de adição e subtração com números naturais e racionais' },
  { id: 'EF05MA08', desc: 'Resolver problemas de multiplicação e divisão com números naturais' },
  { id: 'EF05MA09', desc: 'Resolver problemas que envolvam partilha de uma quantidade em duas partes desiguais' },
  { id: 'EF05MA10', desc: 'Concluir, por meio de investigações, sobre a equivalência de frações' },
  { id: 'EF05MA11', desc: 'Resolver e elaborar problemas cuja conversão em sentença matemática exija adição ou subtração' },
  { id: 'EF05MA12', desc: 'Resolver e elaborar problemas cuja conversão em sentença exija multiplicação ou divisão' },
  { id: 'EF05MA13', desc: 'Resolver problemas envolvendo grandezas diretamente proporcionais' },
  { id: 'EF05MA14', desc: 'Reconhecer e representar vértices, faces e arestas de prismas e pirâmides' },
  { id: 'EF05MA24', desc: 'Interpretar dados estatísticos apresentados em textos, tabelas e gráficos' },
  // LÍNGUA PORTUGUESA (15)
  { id: 'EF05LP01', desc: 'Grafar palavras utilizando regras de correspondência fonema-grafema' },
  { id: 'EF05LP02', desc: 'Identificar o caráter polissêmico das palavras em contexto de leitura' },
  { id: 'EF05LP03', desc: 'Localizar informações explícitas em textos de diferentes gêneros' },
  { id: 'EF05LP04', desc: 'Inferir o sentido de palavras ou expressões desconhecidas em textos' },
  { id: 'EF05LP05', desc: 'Inferir a intenção do autor com o uso de recursos de persuasão' },
  { id: 'EF05LP06', desc: 'Flexionar, adequadamente, na escrita e na leitura, os verbos em concordância' },
  { id: 'EF05LP07', desc: 'Identificar em textos e usar na produção textual pronomes anafóricos' },
  { id: 'EF05LP08', desc: 'Diferenciar palavras primitivas, derivadas e compostas' },
  { id: 'EF05LP09', desc: 'Ler e compreender, com autonomia, textos instrucionais e de regras de jogo' },
  { id: 'EF05LP10', desc: 'Inferir informações implícitas nos textos lidos' },
  { id: 'EF05LP11', desc: 'Identificar a ideia central do texto, demonstrando compreensão global' },
  { id: 'EF05LP12', desc: 'Agrupar palavras pelo critério de aproximação de significado (sinônimos)' },
  { id: 'EF05LP13', desc: 'Identificar a pontuação e seus efeitos de sentido em textos narrativos' },
  { id: 'EF05LP14', desc: 'Identificar a função sociocomunicativa de diferentes gêneros textuais' },
  { id: 'EF05LP15', desc: 'Distinguir fatos de opiniões/comentários em textos jornalísticos' },
  // CIÊNCIAS (5)
  { id: 'EF05CI01', desc: 'Explorar fenômenos da vida cotidiana que evidenciem propriedades físicas da matéria' },
  { id: 'EF05CI02', desc: 'Aplicar os conhecimentos sobre as mudanças de estado físico da água' },
  { id: 'EF05CI03', desc: 'Selecionar métodos adequados para a separação de misturas' },
  { id: 'EF05CI04', desc: 'Identificar os principais usos da água e formas de sustentabilidade' },
  { id: 'EF05CI05', desc: 'Construir propostas coletivas para o consumo consciente da água e energia' },
  // HISTÓRIA & GEOGRAFIA (5)
  { id: 'EF05HI01', desc: 'Identificar os processos de formação das culturas e dos povos' },
  { id: 'EF05HI02', desc: 'Identificar os mecanismos de organização do poder político em diferentes sociedades' },
  { id: 'EF05HI03', desc: 'Analisar o papel das culturas e das religiões na composição identitária' },
  { id: 'EF05GE01', desc: 'Descrever a dinâmica populacional na unidade da federação em que vive' },
  { id: 'EF05GE02', desc: 'Identificar diferenças étnico-raciais e étnico-culturais e desigualdades sociais' }
];

const DEFAULT_PERFORMANCE_LEVELS = {
  insufficient: 'Não demonstra a habilidade esperada ou apresenta resposta incompatível.',
  partial: 'Demonstra parte do raciocínio, com lacunas conceituais ou procedimentais.',
  sufficient: 'Demonstra a habilidade com resposta adequada aos critérios definidos.'
};

const DEFAULT_ALTERNATIVE_INTENTIONS = {
  A: 'Distrator relacionado a uma leitura inicial do enunciado.',
  B: 'Distrator que revela confusão conceitual comum.',
  C: 'Alternativa correta vinculada à habilidade trabalhada.',
  D: 'Distrator com procedimento incompleto ou generalização indevida.'
};

// ─── SIMPLE MARKDOWN RENDERER ───────────────────────────────────────────────

function renderSimpleMarkdown(md) {
  if (!md) return '';
  let html = md
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/^> (.+)$/gm, '<blockquote>$1</blockquote>')
    .replace(/^- (.+)$/gm, '<li>$1</li>')
    .replace(/^(\d+)\. (.+)$/gm, '<li>$2</li>');
  // Wrap consecutive <li> in <ul>
  html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');
  // Wrap remaining lines in <p>
  html = html.split('\n').map(line => {
    if (line.match(/^<(h[1-3]|ul|ol|li|blockquote|strong|em)/)) return line;
    if (line.trim() === '') return '';
    return `<p>${line}</p>`;
  }).join('\n');
  return html;
}

// ─── COMPONENT ──────────────────────────────────────────────────────────────

export default function CreateAssessmentScreen({ onBack, onCreateAssessment, initialData = null, generateCode, isDarkMode }) {
  const isEditing = !!initialData;
  const [currentStep, setCurrentStep] = useState(1);

  // ── Step 1: Identification ──
  const [title, setTitle] = useState(initialData?.title || '');
  const [nature, setNature] = useState(
    initialData?.type?.toLowerCase() === 'diagnóstica' ? 'DIAGNOSTICA' :
      initialData?.type?.toLowerCase() === 'formativa' ? 'FORMATIVA' : 'SOMATIVA'
  );
  const [numAlternatives, setNumAlternatives] = useState(4);
  const [schoolYear, setSchoolYear] = useState(initialData?.schoolYear || '2026');
  const [municipality, setMunicipality] = useState(initialData?.municipality || 'Sobral');
  const [grade, setGrade] = useState(initialData?.grade || '5º Ano - EF');

  // ── Step 2: Construction ──
  const [testsConfig, setTestsConfig] = useState(
    initialData?.testsTree?.length ? initialData.testsTree.map(t => ({
      name: t.title,
      subject: t.subject || initialData?.subject || 'Língua Portuguesa',
      tasks: t.tasks ? t.tasks.map(tf => ({
        title: tf.title,
        cognitiveProcess: tf.cognitiveProcess || 'Compreender',
        responseType: tf.responseType || 'Múltipla Escolha',
        hasItemComposto: !!tf.hasItemComposto,
        itemCompostoTitle: tf.itemCompostoTitle || '',
        itemCompostoMarkdown: tf.itemCompostoMarkdown || '',
        items: tf.items ? tf.items.map(it => ({
          ...it,
          skills: it.skills || (it.skill ? [it.skill] : []),
          correctionCriteria: it.correctionCriteria || '',
          performanceLevels: { ...DEFAULT_PERFORMANCE_LEVELS, ...(it.performanceLevels || {}) },
          alternativeIntentions: { ...DEFAULT_ALTERNATIVE_INTENTIONS, ...(it.alternativeIntentions || {}) }
        })) : []
      })) : []
    })) : [{
      name: 'Teste de Língua Portuguesa',
      subject: 'Língua Portuguesa',
      tasks: [{
        title: 'Tarefa 01 - Compreensão Leitora',
        cognitiveProcess: 'Compreender',
        responseType: 'Múltipla Escolha',
        hasItemComposto: true,
        itemCompostoTitle: 'Texto "O Menino e o Rio"',
        itemCompostoMarkdown: '# O Menino e o Rio\n\nEra uma vez um menino que morava nas margens do **Rio Parnaíba**.',
        items: [
          { title: 'Item 01', skills: ['EF05LP09'], descriptor: 'D1 - Informação explícita', expectation: 'Localizar informações explícitas', cognitiveProcess: 'Compreender', difficulty: 'Fácil', hasAnswer: true, correctionCriteria: 'Considerar evidências explícitas localizadas no texto.', performanceLevels: DEFAULT_PERFORMANCE_LEVELS, alternativeIntentions: DEFAULT_ALTERNATIVE_INTENTIONS },
          { title: 'Item 02', skills: ['EF05LP10'], descriptor: 'D3 - Sentido de palavras', expectation: 'Inferir sentido de palavras', cognitiveProcess: 'Compreender', difficulty: 'Médio', hasAnswer: true, correctionCriteria: 'Verificar inferência coerente com o contexto.', performanceLevels: DEFAULT_PERFORMANCE_LEVELS, alternativeIntentions: DEFAULT_ALTERNATIVE_INTENTIONS }
        ]
      }]
    }]
  );

  // ── Step 3: Configuration ──
  const [scale, setScale] = useState(initialData?.scale || 'LARGA');
  const [correctionType, setCorrectionType] = useState(
    initialData?.correctionMethod?.includes('IA') ? 'IA' : 'MANUAL'
  );
  const [applicationMode, setApplicationMode] = useState(initialData?.applicationMode || 'impressa');
  const [startDate, setStartDate] = useState(initialData?.startDate || '');
  const [endDate, setEndDate] = useState(initialData?.endDate || '');
  const [duration, setDuration] = useState('');
  const [correctionDeadline, setCorrectionDeadline] = useState(initialData?.correctionDeadline || '');

  // ── Step 4 ──
  const [aiDescription, setAiDescription] = useState(initialData?.aiDescription || '');

  // ── Modal States ──
  const [markdownModalTarget, setMarkdownModalTarget] = useState(null);
  const [bancoModalTargetTestIdx, setBancoModalTargetTestIdx] = useState(null);
  const [deleteModal, setDeleteModal] = useState(null); // { type, title, msg, onConfirm }
  const [skillsModal, setSkillsModal] = useState(null); // { tIdx, tfIdx, iIdx }
  const [skillsSearch, setSkillsSearch] = useState('');
  const [skillsSelection, setSkillsSelection] = useState([]);
  const [impedimentsOpen, setImpedimentsOpen] = useState(false);

  // Expanded test/task states
  const [expandedTests, setExpandedTests] = useState({});
  const [expandedTasks, setExpandedTasks] = useState({});
  const [expandedItems, setExpandedItems] = useState({});
  const [activeItemPath, setActiveItemPath] = useState({ tIdx: 0, tfIdx: 0, iIdx: 0 });
  const [openSectionsStep2, setOpenSectionsStep2] = useState({
    conteudo: true,
    classificacao: true,
    criterios: true
  });

  // ── AI Fill Simulation State ──
  const [aiFillingItem, setAiFillingItem] = useState(null); // `${tIdx}-${tfIdx}-${iIdx}`
  const [aiToast, setAiToast] = useState(null);

  // ── Internal Markdown Modal State ──
  const [internalMdModal, setInternalMdModal] = useState(null); // { tIdx, tfIdx, title, content }
  const [mdTitle, setMdTitle] = useState('');
  const [mdContent, setMdContent] = useState('');

  // ── Computed Values ──
  const generatedCode = initialData?.code || (generateCode ? generateCode(municipality, schoolYear) : `AV-${municipality.substring(0, 3).toUpperCase()}-${schoolYear}-${String(Math.floor(Math.random() * 9000) + 1000)}`);
  const totalTasks = testsConfig.reduce((sum, t) => sum + (t.tasks?.length || 0), 0);
  const totalItems = testsConfig.reduce(
    (sum, t) => sum + (t.tasks || []).reduce((taskSum, tf) => taskSum + (tf.items?.length || 0), 0), 0
  );

  // ── Validation / Impediments ──
  const impediments = useMemo(() => {
    const list = [];
    if (!title) list.push({ label: 'Título da avaliação não definido', step: 1 });
    if (!nature) list.push({ label: 'Natureza da avaliação não selecionada', step: 1 });
    if (testsConfig.length === 0) list.push({ label: 'Nenhum teste criado', step: 2 });
    const testsWithoutTasks = testsConfig.filter(t => !t.tasks?.length);
    if (testsWithoutTasks.length > 0) list.push({ label: `${testsWithoutTasks.length} teste(s) sem tarefas`, step: 2 });
    const tasksWithoutItems = testsConfig.flatMap(t => (t.tasks || []).filter(tf => !tf.items?.length));
    if (tasksWithoutItems.length > 0) list.push({ label: `${tasksWithoutItems.length} tarefa(s) sem itens`, step: 2 });
    const itemsWithoutSkills = testsConfig.flatMap(t => (t.tasks || []).flatMap(tf => (tf.items || []).filter(it => !it.skills || it.skills.length === 0)));
    if (itemsWithoutSkills.length > 0) list.push({ label: `${itemsWithoutSkills.length} item(ns) sem habilidade vinculada`, step: 2 });
    if (!correctionDeadline) list.push({ label: 'Prazo de correção não definido', step: 3 });
    if (startDate && endDate && new Date(endDate) < new Date(startDate)) list.push({ label: 'Prazo de aplicação inválido', step: 3 });
    return list;
  }, [title, nature, testsConfig, correctionDeadline, startDate, endDate]);

  const isValid = impediments.length === 0;

  // ─── OPERATIONS ───────────────────────────────────────────────────────────

  const addTest = () => {
    const nextNum = testsConfig.length + 1;
    setTestsConfig(prev => [...prev, {
      name: `Teste ${String(nextNum).padStart(2, '0')}`,
      subject: 'Matemática',
      tasks: [{
        title: 'Tarefa 01 - Bloco Principal',
        cognitiveProcess: 'Compreender',
        responseType: 'Múltipla Escolha',
        hasItemComposto: false,
        itemCompostoTitle: '',
        itemCompostoMarkdown: '',
        items: [{ title: 'Item 01', skills: [], descriptor: '', expectation: '', cognitiveProcess: 'Compreender', difficulty: 'Médio', hasAnswer: false, correctionCriteria: '', performanceLevels: DEFAULT_PERFORMANCE_LEVELS, alternativeIntentions: DEFAULT_ALTERNATIVE_INTENTIONS }]
      }]
    }]);
  };

  const removeTest = (tIdx) => {
    if (testsConfig.length <= 1) return;
    setDeleteModal({
      title: 'Remover Caderno de Teste',
      msg: 'Tem certeza que deseja remover este Caderno de Teste e todas as suas tarefas? Esta ação não poderá ser desfeita.',
      onConfirm: () => {
        setTestsConfig(prev => prev.filter((_, i) => i !== tIdx));
        setDeleteModal(null);
      }
    });
  };

  const addTask = (tIdx) => {
    setTestsConfig(prev => prev.map((teste, i) => {
      if (i !== tIdx) return teste;
      const nextNum = (teste.tasks?.length || 0) + 1;
      return {
        ...teste,
        tasks: [...(teste.tasks || []), {
          title: `Tarefa ${String(nextNum).padStart(2, '0')} - Nova Tarefa`,
          cognitiveProcess: 'Aplicar',
          responseType: 'Múltipla Escolha',
          hasItemComposto: false,
          itemCompostoTitle: '',
          itemCompostoMarkdown: '',
          items: [{ title: 'Item 01', skills: [], descriptor: '', expectation: '', cognitiveProcess: 'Aplicar', difficulty: 'Médio', hasAnswer: false, correctionCriteria: '', performanceLevels: DEFAULT_PERFORMANCE_LEVELS, alternativeIntentions: DEFAULT_ALTERNATIVE_INTENTIONS }]
        }]
      };
    }));
  };

  const removeTask = (tIdx, tfIdx) => {
    setDeleteModal({
      title: 'Remover Tarefa',
      msg: 'Tem certeza que deseja remover esta Tarefa e seus itens vinculados?',
      onConfirm: () => {
        setTestsConfig(prev => prev.map((teste, i) => {
          if (i !== tIdx) return teste;
          return { ...teste, tasks: teste.tasks.filter((_, j) => j !== tfIdx) };
        }));
        setDeleteModal(null);
      }
    });
  };

  const addItem = (tIdx, tfIdx) => {
    setTestsConfig(prev => prev.map((teste, i) => {
      if (i !== tIdx) return teste;
      return {
        ...teste,
        tasks: teste.tasks.map((tf, j) => {
          if (j !== tfIdx) return tf;
          const nextNum = (tf.items?.length || 0) + 1;
          return {
            ...tf,
            items: [...(tf.items || []), {
              title: `Item ${String(nextNum).padStart(2, '0')}`,
              skills: [],
              descriptor: '',
              expectation: '',
              cognitiveProcess: tf.cognitiveProcess || 'Compreender',
              difficulty: 'Médio',
              hasAnswer: false,
              correctionCriteria: '',
              performanceLevels: DEFAULT_PERFORMANCE_LEVELS,
              alternativeIntentions: DEFAULT_ALTERNATIVE_INTENTIONS
            }]
          };
        })
      };
    }));
  };

  const removeItem = (tIdx, tfIdx, iIdx) => {
    setDeleteModal({
      title: 'Remover Item de Avaliação',
      msg: 'Tem certeza que deseja remover este Item da tarefa?',
      onConfirm: () => {
        setTestsConfig(prev => prev.map((teste, i) => {
          if (i !== tIdx) return teste;
          return {
            ...teste,
            tasks: teste.tasks.map((tf, j) => {
              if (j !== tfIdx) return tf;
              return { ...tf, items: tf.items.filter((_, k) => k !== iIdx) };
            })
          };
        }));
        setDeleteModal(null);
      }
    });
  };

  const updateTaskField = (tIdx, tfIdx, field, value) => {
    setTestsConfig(prev => prev.map((teste, i) => {
      if (i !== tIdx) return teste;
      return { ...teste, tasks: teste.tasks.map((tf, j) => j === tfIdx ? { ...tf, [field]: value } : tf) };
    }));
  };

  const updateItemField = (tIdx, tfIdx, iIdx, field, value) => {
    setTestsConfig(prev => prev.map((teste, i) => {
      if (i !== tIdx) return teste;
      return {
        ...teste,
        tasks: teste.tasks.map((tf, j) => {
          if (j !== tfIdx) return tf;
          return { ...tf, items: tf.items.map((it, k) => k === iIdx ? { ...it, [field]: value } : it) };
        })
      };
    }));
  };

  const removeSkillFromItem = (tIdx, tfIdx, iIdx, skillId) => {
    setDeleteModal({
      title: 'Desvincular Habilidade',
      msg: `Tem certeza que deseja desvincular a habilidade ${skillId} deste item?`,
      onConfirm: () => {
        updateItemField(tIdx, tfIdx, iIdx, 'skills',
          (testsConfig[tIdx]?.tasks[tfIdx]?.items[iIdx]?.skills || []).filter(s => s !== skillId)
        );
        setDeleteModal(null);
      }
    });
  };

  // ── Skills Modal Logic ──
  const openSkillsModal = (tIdx, tfIdx, iIdx) => {
    const currentSkills = testsConfig[tIdx]?.tasks[tfIdx]?.items[iIdx]?.skills || [];
    setSkillsSelection([...currentSkills]);
    setSkillsSearch('');
    setSkillsModal({ tIdx, tfIdx, iIdx });
  };

  const saveSkillsSelection = () => {
    if (!skillsModal) return;
    updateItemField(skillsModal.tIdx, skillsModal.tfIdx, skillsModal.iIdx, 'skills', skillsSelection);
    setSkillsModal(null);
  };

  const filteredSkills = useMemo(() => {
    if (!skillsSearch) return AVAILABLE_SKILLS;
    const q = skillsSearch.toLowerCase();
    return AVAILABLE_SKILLS.filter(s => s.id.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q));
  }, [skillsSearch]);

  // ── AI Item Fill Mock ──
  const handleFillAI = (tIdx, tfIdx, iIdx) => {
    const itemKey = `${tIdx}-${tfIdx}-${iIdx}`;
    setAiFillingItem(itemKey);

    setTimeout(() => {
      setTestsConfig(prev => prev.map((teste, i) => {
        if (i !== tIdx) return teste;
        return {
          ...teste,
          tasks: teste.tasks.map((tf, j) => {
            if (j !== tfIdx) return tf;
            return {
              ...tf,
              items: tf.items.map((it, k) => {
                if (k !== iIdx) return it;
                return {
                  ...it,
                  statement: 'Com base no texto de apoio, identifique a tese principal sustentada pelo autor acerca do papel da tecnologia na transformação das práticas pedagógicas contemporâneas.',
                  expectedAnswer: 'O estudante deve demonstrar a compreensão de que a tecnologia atua como um recurso dinamizador do aprendizado, exigindo intencionalidade pedagógica e mediação ativa do professor.',
                  pedagogicalComments: 'Avaliadores devem atentar se a resposta distingue claramente o mero uso instrumental de ferramentas digitais da integração metodológica intencional.',
                  cognitiveProcess: 'Analisar',
                  descriptor: 'Identificação da tese central em texto opinativo-argumentativo sobre tecnologia educacional.',
                  skills: it.skills?.length > 0 ? it.skills : ['EM13LPT01', 'EM13LPT02'],
                  performanceLevels: {
                    insufficient: 'Não identifica a tese principal do texto ou confunde-a com opiniões secundárias trazidas pelo autor.',
                    partial: 'Identifica parcialmente a tese central, mas apresenta fragilidades na articulação com os argumentos de suporte.',
                    sufficient: 'Identifica com precisão a tese principal e explicita a relação de sustentação dos argumentos centrais.'
                  },
                  alternativeIntentions: {
                    A: 'Distrator: Afirma que a tecnologia substitui a função docente, hipótese refutada pelo texto.',
                    B: 'Gabarito Correto: Expressa com exatidão a síntese argumentativa apresentada no segundo parágrafo.',
                    C: 'Distrator: Foca exclusivamente nos aspectos econômicos das ferramentas digitais.',
                    D: 'Distrator: Confunde a introdução do tema com a conclusão do autor.'
                  }
                };
              })
            };
          })
        };
      }));

      // Expand item to display generated data
      setExpandedItems(prev => ({ ...prev, [itemKey]: true }));
      setAiFillingItem(null);
      setAiToast('Item preenchido com sucesso via Inteligência Artificial!');
      setTimeout(() => setAiToast(null), 4000);
    }, 2500);
  };

  // ── Internal Markdown Editor ──
  const openInternalMdModal = (tIdx, tfIdx, iIdx = null, field = 'itemCompostoMarkdown') => {
    const task = testsConfig[tIdx]?.tasks[tfIdx];
    const item = iIdx !== null ? task?.items[iIdx] : null;
    let title = '';
    let content = '';

    if (iIdx !== null && item) {
      if (field.startsWith('perf-')) {
        const perfKey = field.split('-')[1];
        title = `Rubrica: ${perfKey === 'insufficient' ? 'Insuficiente' : perfKey === 'partial' ? 'Parcialmente Suficiente' : 'Suficiente'}`;
        content = item.performanceLevels?.[perfKey] || '';
      } else if (field.startsWith('alt-')) {
        const altLetter = field.split('-')[1];
        title = `Intenção e Análise - Alternativa ${altLetter}`;
        content = item.alternativeIntentions?.[altLetter] || '';
      } else {
        title = field === 'descriptor' ? 'Sentença Descritora' : `Item: ${field}`;
        content = item[field] || '';
      }
    } else if (task) {
      if (field === 'expectation') {
        title = 'Expectativa de Desempenho';
        content = task.expectation || '';
      } else if (field === 'context') {
        title = 'Contexto da Tarefa';
        content = task.context || '';
      } else {
        title = task.itemCompostoTitle || '';
        content = task.itemCompostoMarkdown || '';
      }
    }

    setMdTitle(title);
    setMdContent(content);
    setInternalMdModal({ tIdx, tfIdx, iIdx, field });
  };

  const saveInternalMdModal = () => {
    if (!internalMdModal) return;
    const { tIdx, tfIdx, iIdx, field } = internalMdModal;

    if (iIdx !== null) {
      if (field.startsWith('perf-')) {
        const perfKey = field.split('-')[1];
        const task = testsConfig[tIdx]?.tasks[tfIdx];
        const item = task?.items[iIdx];
        if (item) {
          updateItemField(tIdx, tfIdx, iIdx, 'performanceLevels', { ...item.performanceLevels, [perfKey]: mdContent });
        }
      } else if (field.startsWith('alt-')) {
        const altLetter = field.split('-')[1];
        const task = testsConfig[tIdx]?.tasks[tfIdx];
        const item = task?.items[iIdx];
        if (item) {
          updateItemField(tIdx, tfIdx, iIdx, 'alternativeIntentions', { ...item.alternativeIntentions, [altLetter]: mdContent });
        }
      } else {
        updateItemField(tIdx, tfIdx, iIdx, field, mdContent);
      }
    } else {
      if (field === 'expectation' || field === 'context') {
        updateTaskField(tIdx, tfIdx, field, mdContent);
      } else {
        updateTaskField(tIdx, tfIdx, 'hasItemComposto', true);
        updateTaskField(tIdx, tfIdx, 'itemCompostoTitle', mdTitle);
        updateTaskField(tIdx, tfIdx, 'itemCompostoMarkdown', mdContent);
      }
    }

    setInternalMdModal(null);
  };

  // ── Banco de Tarefas ──
  const handleInsertTaskFromBank = (task) => {
    if (bancoModalTargetTestIdx === null) return;
    setTestsConfig(prev => prev.map((teste, i) => {
      if (i !== bancoModalTargetTestIdx) return teste;
      return {
        ...teste,
        tasks: [...(teste.tasks || []), {
          title: task.title,
          cognitiveProcess: task.cognitiveProcess || 'Compreender',
          responseType: task.responseType || 'Múltipla Escolha',
          hasItemComposto: !!task.itemCompostoMarkdown,
          itemCompostoTitle: task.itemCompostoTitle || '',
          itemCompostoMarkdown: task.itemCompostoMarkdown || '',
          items: task.items ? task.items.map(it => ({
            ...it,
            skills: it.skills || (it.skill ? [it.skill] : []),
            correctionCriteria: it.correctionCriteria || '',
            performanceLevels: { ...DEFAULT_PERFORMANCE_LEVELS, ...(it.performanceLevels || {}) },
            alternativeIntentions: { ...DEFAULT_ALTERNATIVE_INTENTIONS, ...(it.alternativeIntentions || {}) }
          })) : []
        }]
      };
    }));
    setBancoModalTargetTestIdx(null);
  };

  // ── AI Description Generation ──
  const generateDescriptionAI = () => {
    const natureLabels = { DIAGNOSTICA: 'diagnóstica', FORMATIVA: 'formativa', SOMATIVA: 'somativa' };
    const taskTitles = testsConfig.flatMap(t => (t.tasks || []).map(tf => tf.title)).filter(Boolean).slice(0, 4);
    const allSkills = testsConfig.flatMap(t => (t.tasks || []).flatMap(tf => (tf.items || []).flatMap(it => it.skills || [])));
    const uniqueSkills = [...new Set(allSkills)];
    const subjectList = [...new Set(testsConfig.map(t => t.subject).filter(Boolean))].join(', ');
    setAiDescription(
      `Avaliação ${natureLabels[nature] || nature} planejada para ${grade}, com ${testsConfig.length} teste(s) em ${subjectList || 'componentes a definir'}. A composição contempla ${totalTasks} tarefa(s) e ${totalItems} item(ns), incluindo ${taskTitles.join(', ') || 'tarefas a definir'}. As habilidades trabalhadas incluem ${uniqueSkills.slice(0, 6).join(', ') || 'habilidades a vincular'}, com ${correctionType === 'IA' ? 'correção apoiada por IA' : 'correção manual'}.`
    );
  };

  // ── Finish / Save ──
  const handleFinish = () => {
    const typeLabels = { SOMATIVA: 'Somativa', DIAGNOSTICA: 'Diagnóstica', FORMATIVA: 'Formativa' };
    const corrLabels = { MANUAL: 'Correção Manual', IA: 'Correção com IA (HTR)' };
    const primarySubject = testsConfig[0]?.subject || 'Multidisciplinar';
    const subjectSummary = [...new Set(testsConfig.map(t => t.subject).filter(Boolean))].join(', ') || primarySubject;

    onCreateAssessment({
      id: initialData?.id,
      code: generatedCode,
      title: title || `Avaliação ${typeLabels[nature] || nature} - ${grade}`,
      type: typeLabels[nature] || nature,
      schoolYear,
      municipality,
      grade,
      subject: primarySubject,
      subjectSummary,
      scale: scale.toLowerCase(),
      correctionMethod: corrLabels[correctionType] || correctionType,
      applicationMode,
      startDate,
      endDate,
      correctionDeadline,
      aiDescription,
      testsCount: testsConfig.length,
      tasksCount: totalTasks,
      itemsCount: totalItems,
      status: initialData?.status || 'Em edição',
      nextStep: initialData?.nextStep || 'Adicionar Tarefas e Itens aos Testes criados',
      blockers: impediments.map(i => i.label),
      testsTree: testsConfig.map(t => ({
        title: t.name,
        subject: t.subject,
        tasks: t.tasks.map(tf => ({
          title: tf.title,
          cognitiveProcess: tf.cognitiveProcess,
          responseType: tf.responseType,
          hasItemComposto: tf.hasItemComposto,
          itemCompostoTitle: tf.itemCompostoTitle,
          itemCompostoMarkdown: tf.itemCompostoMarkdown,
          itemsCount: tf.items?.length || 0,
          items: tf.items ? tf.items.map(it => ({
            ...it,
            skill: it.skills?.[0] || '',
            skillDesc: AVAILABLE_SKILLS.find(s => s.id === it.skills?.[0])?.desc || ''
          })) : []
        }))
      }))
    });
  };

  // ── Navigation ──
  const goToStep = (step) => {
    setCurrentStep(step);
  };

  // ── Style helpers ──
  const cardBg = isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-white border-neutral-2 shadow-sm';
  const inputCls = `w-full px-4 py-2.5 border rounded-[8px] text-sm outline-none transition-all font-medium ${isDarkMode
    ? 'bg-neutral-7 border-neutral-5 text-white focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
    : 'bg-neutral-1 border-neutral-3 text-neutral-6 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/20'
    }`;
  const cardSelectorCls = (selected) => `cursor-pointer transition-all rounded-[8px] border-2 ${selected
    ? 'border-brand-500 bg-brand-50 dark:bg-brand-900/30 ring-2 ring-brand-500/20'
    : isDarkMode
      ? 'border-neutral-5 bg-neutral-7 hover:border-neutral-4'
      : 'border-neutral-2 bg-white hover:border-neutral-3'
    }`;

  // ─── PIPELINE BAR ──────────────────────────────────────────────────────────

  const pipelineSteps = [
    { id: 1, label: 'Identificação' },
    { id: 2, label: 'Construção' },
    { id: 3, label: 'Configurações' },
    { id: 4, label: 'Revisão Final' }
  ];

  const renderPipeline = () => (
    <div className="flex items-center justify-between relative">
      {/* Background track */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-0.5 bg-neutral-2 dark:bg-neutral-5 -z-10" />
      {/* Progress fill */}
      <div
        className="absolute left-0 top-1/2 -translate-y-1/2 h-0.5 bg-brand-500 -z-10 transition-all duration-500"
        style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
      />
      {pipelineSteps.map(step => {
        const isCompleted = step.id < currentStep;
        const isCurrent = step.id === currentStep;

        const indicatorClasses = isCompleted
          ? `w-8 h-8 rounded-full border-2 border-brand-500 bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400 flex items-center justify-center text-xs font-bold transition-all`
          : isCurrent
            ? `w-8 h-8 rounded-full border-2 border-brand-500 bg-brand-500 text-white shadow-sm shadow-brand-500/20 flex items-center justify-center text-xs font-bold transition-all`
            : `w-8 h-8 rounded-full border-2 ${isDarkMode ? 'border-neutral-5 bg-neutral-6 text-neutral-4' : 'border-neutral-3 bg-white text-neutral-4'} flex items-center justify-center text-xs font-bold transition-all group-hover:border-neutral-4 dark:group-hover:border-neutral-4`;

        const labelClasses = isCompleted
          ? 'text-[11px] font-bold text-brand-600 dark:text-brand-400 uppercase tracking-wider'
          : isCurrent
            ? 'text-[11px] font-bold text-brand-700 dark:text-brand-300 uppercase tracking-wider'
            : 'text-[11px] font-semibold text-neutral-4 uppercase tracking-wider group-hover:text-neutral-5 dark:group-hover:text-neutral-3';

        return (
          <button
            key={step.id}
            id={`pipe-${step.id}`}
            onClick={() => goToStep(step.id)}
            className={`flex flex-col items-center gap-1.5 px-2 group ${isDarkMode ? 'bg-neutral-6' : 'bg-white'}`}
          >
            <div id={`pipe-indicator-${step.id}`} className={indicatorClasses}>
              {isCompleted ? <Check size={14} /> : step.id}
            </div>
            <span id={`pipe-label-${step.id}`} className={labelClasses}>
              {step.label}
            </span>
          </button>
        );
      })}
    </div>
  );

  // ─── RENDER ────────────────────────────────────────────────────────────────

  const altLabels = numAlternatives === 4 ? ['A', 'B', 'C', 'D'] : ['A', 'B', 'C', 'D', 'E'];

  return (
    <div className={`flex flex-col flex-1 h-full min-h-0 overflow-hidden font-['Montserrat',sans-serif] ${isDarkMode ? 'bg-neutral-7 text-white' : 'bg-neutral-1 text-neutral-7'
      }`}>
      {/* ═══ HEADER ═══ */}
      <header className={`border-b shrink-0 sticky top-0 z-20 backdrop-blur-md ${isDarkMode ? 'border-neutral-5 bg-neutral-6/95' : 'border-neutral-2 bg-white/95'
        }`}>
        <div className="w-[80vw] mx-auto">
          {/* Top row */}
          <div className="flex items-center justify-between h-16 mb-2">
            <div className="flex items-center gap-3">
              <Button variant="tertiary" appearance="solid" size="sm" iconLeft={<ArrowLeft size={16} />} onClick={onBack}>
                Voltar
              </Button>
              <div className="h-5 w-px bg-neutral-3 dark:bg-neutral-5" />
              <div>
                <h1 className="text-base font-bold tracking-tight text-neutral-6 dark:text-white flex items-center gap-2">
                  <Layers size={18} className="text-brand-500" />
                  {isEditing ? `Editando: ${generatedCode}` : 'Criar Avaliação'}
                </h1>
              </div>
              <Chips label="Editor de Avaliações" status="neutral" variant="light" />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => setImpedimentsOpen(!impedimentsOpen)}
                className="relative p-2 text-neutral-4 hover:text-semantic-error-base transition-colors"
                title="Pendências"
              >
                <AlertTriangle size={18} />
                {impediments.length > 0 && (
                  <span className="absolute top-0 right-0 bg-semantic-error-base text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {impediments.length}
                  </span>
                )}
              </button>
              <div className={`text-xs px-2.5 py-1.5 rounded-[8px] border flex items-center gap-1.5 ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-neutral-3' : 'bg-neutral-1 border-neutral-2 text-neutral-4'}`}>
                <span className="w-1.5 h-1.5 rounded-full bg-semantic-caution-base animate-pulse" />
                Rascunho
              </div>
            </div>
          </div>

          {/* Pipeline */}
          <div className="pb-3">
            {renderPipeline()}
          </div>
        </div>
      </header>

      {/* ═══ MAIN CONTENT ═══ */}
      <main className="flex-1 overflow-y-auto pb-20">
        <div className="w-[80vw] mx-auto py-8">

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 1: IDENTIFICAÇÃO E ESCOPO             */}
          {/* ═══════════════════════════════════════════ */}
          {currentStep === 1 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-bold text-neutral-6 dark:text-white tracking-tight">O que vamos avaliar?</h1>
                <p className="text-sm text-neutral-4">Defina o título principal, a finalidade e a estrutura das alternativas da avaliação.</p>
              </div>

              {/* Título */}
              <div className={`p-8 rounded-[8px] border space-y-4 ${cardBg}`}>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-5 dark:text-neutral-3">
                  Título da Avaliação <span className="text-semantic-error-base">*</span>
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className={`w-full px-5 py-4 rounded-[8px] border text-lg font-medium transition-all ${isDarkMode
                    ? 'bg-neutral-7 border-neutral-5 text-white focus:ring-2 focus:ring-brand-500 focus:border-brand-500'
                    : 'bg-neutral-1 border-neutral-3 text-neutral-6 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 shadow-inner'
                    }`}
                  placeholder="Ex: Avaliação Diagnóstica de Início de Ano - 2026"
                />
              </div>

              {/* Natureza */}
              <div className={`p-8 rounded-[8px] border space-y-4 ${cardBg}`}>
                <label className="block text-xs font-bold uppercase tracking-wider text-neutral-5 dark:text-neutral-3">
                  Natureza da Avaliação <span className="text-semantic-error-base">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {[
                    { key: 'SOMATIVA', label: 'Somativa', desc: 'Avaliação de resultado ao final de um período letivo ou unidade curricular.', icon: ShieldCheck, bg: 'bg-[#e91e63]' },
                    { key: 'DIAGNOSTICA', label: 'Diagnóstica', desc: 'Mapeamento inicial de aprendizagem para identificação de lacunas.', icon: Brain, bg: 'bg-[#8bc34a]' },
                    { key: 'FORMATIVA', label: 'Formativa', desc: 'Acompanhamento contínuo durante o processo de ensino-aprendizagem.', icon: Sparkles, bg: 'bg-[#0d6efd]' },
                  ].map(opt => (
                    <div
                      key={opt.key}
                      onClick={() => setNature(opt.key)}
                      className={`cursor-pointer transition-all rounded-[8px] border-2 p-4 flex flex-col gap-3 ${nature === opt.key
                        ? 'border-brand-500 bg-white ring-2 ring-brand-500/20'
                        : isDarkMode ? 'border-neutral-5 bg-neutral-7 hover:border-neutral-4' : 'border-neutral-2 bg-white hover:border-neutral-3'
                        }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className={`text-xl ${nature === opt.key ? 'text-brand-500' : 'text-neutral-4'}`}>
                          <opt.icon size={22} />
                        </div>
                        <span className={`text-white text-[11px] font-bold px-3 py-1 rounded-full ${opt.bg}`}>
                          {opt.label}
                        </span>
                      </div>
                      <p className={`text-xs font-medium ${isDarkMode ? 'text-neutral-3' : 'text-slate-500'}`}>{opt.desc}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Alternativas */}
              <div className={`p-8 rounded-[8px] border space-y-4 ${cardBg}`}>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-neutral-5 dark:text-neutral-3">
                    Quantidade de Alternativas por Item <span className="text-semantic-error-base">*</span>
                  </label>
                  <p className="text-xs text-neutral-4 mt-0.5">Defina se os itens de Múltipla Escolha terão 4 ou 5 opções, conforme a estratégia da escola.</p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div
                    onClick={() => setNumAlternatives(4)}
                    className={`${cardSelectorCls(numAlternatives === 4)} p-4 flex items-center gap-4`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${numAlternatives === 4 ? 'bg-brand-100 text-brand-500' : 'bg-neutral-2 dark:bg-neutral-5 text-neutral-4'
                      }`}>A-D</div>
                    <div>
                      <h3 className="font-bold text-sm text-neutral-6 dark:text-white">4 Alternativas (A, B, C, D)</h3>
                      <p className="text-[11px] text-neutral-4 mt-0.5">Padrão para Ensino Fundamental e avaliações diretas.</p>
                    </div>
                  </div>
                  <div
                    onClick={() => setNumAlternatives(5)}
                    className={`${cardSelectorCls(numAlternatives === 5)} p-4 flex items-center gap-4`}
                  >
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${numAlternatives === 5 ? 'bg-extended-lavender-extraLight text-extended-lavender-dark' : 'bg-neutral-2 dark:bg-neutral-5 text-neutral-4'
                      }`}>A-E</div>
                    <div>
                      <h3 className="font-bold text-sm text-neutral-6 dark:text-white">5 Alternativas (A, B, C, D, E)</h3>
                      <p className="text-[11px] text-neutral-4 mt-0.5">Padrão para Ensino Médio, ENEM e vestibulares.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button variant="primary" appearance="solid" size="lg" iconRight={<ArrowRight size={18} />} onClick={() => goToStep(2)}>
                  Avançar para Construção
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 2: CONSTRUÇÃO DOS TESTES & ITENS       */}
          {/* ═══════════════════════════════════════════ */}
          {currentStep === 2 && (() => {
            // Find active item
            const currentTest = testsConfig[activeItemPath.tIdx] || testsConfig[0];
            const currentTask = currentTest?.tasks?.[activeItemPath.tfIdx] || currentTest?.tasks?.[0];
            const currentItem = currentTask?.items?.[activeItemPath.iIdx] || currentTask?.items?.[0];

            // Flat list of items for sequential navigation
            const flatItems = [];
            testsConfig.forEach((teste, tIdx) => {
              (teste.tasks || []).forEach((task, tfIdx) => {
                (task.items || []).forEach((item, iIdx) => {
                  flatItems.push({ tIdx, tfIdx, iIdx, testName: teste.name, taskTitle: task.title, item });
                });
              });
            });

            const currentFlatIndex = flatItems.findIndex(
              fi => fi.tIdx === activeItemPath.tIdx && fi.tfIdx === activeItemPath.tfIdx && fi.iIdx === activeItemPath.iIdx
            );
            const safeFlatIndex = currentFlatIndex >= 0 ? currentFlatIndex : 0;

            const handlePrev = () => {
              if (safeFlatIndex > 0) {
                const prev = flatItems[safeFlatIndex - 1];
                setActiveItemPath({ tIdx: prev.tIdx, tfIdx: prev.tfIdx, iIdx: prev.iIdx });
              }
            };

            const handleNext = () => {
              if (safeFlatIndex < flatItems.length - 1) {
                const next = flatItems[safeFlatIndex + 1];
                setActiveItemPath({ tIdx: next.tIdx, tfIdx: next.tfIdx, iIdx: next.iIdx });
              }
            };

            // Calculate item completion count
            const requiredFieldsCount = 6;
            const filledCount = (currentItem?.statement ? 1 : 0) +
              (currentItem?.skills?.length ? 1 : 0) +
              (currentItem?.descriptor ? 1 : 0) +
              (currentItem?.cognitiveProcess || currentTask?.cognitiveProcess ? 1 : 0) +
              (currentItem?.hasAnswer || currentItem?.expectedAnswer ? 1 : 0) +
              (currentItem?.performanceLevels?.sufficient ? 1 : 0);

            const isItemComplete = filledCount >= 5;

            return (
              <section id="step-2" className="space-y-6 step-transition">
                {/* Step 2 Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4 dark:border-neutral-700">
                  <div>
                    <h1 className="text-2xl font-bold text-neutral-900 dark:text-white tracking-tight">
                      Construção da Avaliação
                    </h1>
                    <p className="text-xs text-neutral-500 mt-0.5">
                      Navegue pela árvore hierárquica e realize a autoria focada de cada Item com seus critérios pedagógicos.
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      appearance="solid"
                      size="sm"
                      iconLeft={<Database size={13} />}
                      onClick={() => setBancoModalTargetTestIdx(activeItemPath.tIdx)}
                    >
                      Importar do Banco
                    </Button>
                    <Button
                      variant="primary"
                      appearance="solid"
                      size="sm"
                      iconLeft={<Plus size={13} />}
                      onClick={addTest}
                    >
                      Novo Teste (Caderno)
                    </Button>
                  </div>
                </div>

                {/* 2-Column Split Workspace */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px] items-start">
                  
                  {/* LEFT COLUMN: Tree Explorer (4 cols) */}
                  <div
                    className={`lg:col-span-4 rounded-[8px] border overflow-hidden flex flex-col max-h-[750px] shadow-xs ${
                      isDarkMode ? 'bg-neutral-850 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-800'
                    }`}
                  >
                    {/* Tree Header */}
                    <div className={`p-3.5 px-4 border-b flex items-center justify-between shrink-0 ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <div className="flex items-center gap-2">
                        <Bookmark size={16} className="text-[#0078B0]" />
                        <span className="text-xs font-bold uppercase tracking-wider">Estrutura da Avaliação</span>
                      </div>
                      <span className="text-[11px] font-bold text-[#0078B0] bg-[#0078B0]/10 px-2 py-0.5 rounded-[4px]">
                        {flatItems.length} Itens
                      </span>
                    </div>

                    {/* Tree Content List */}
                    <div className="flex-1 overflow-y-auto p-3 flex flex-col gap-2 divide-y divide-neutral-100 dark:divide-neutral-700/50">
                      {testsConfig.map((teste, tIdx) => {
                        const isTestActive = activeItemPath.tIdx === tIdx;
                        return (
                           <div key={tIdx} className="pt-2 first:pt-0 flex flex-col gap-1.5">
                            {/* Teste Node */}
                            <div className="flex items-center justify-between p-1.5 px-2 rounded-[4px] bg-neutral-100/70 dark:bg-neutral-800 font-bold text-xs">
                              <div className="flex items-center gap-1.5 min-w-0 flex-1 mr-1 truncate">
                                <BookMarked size={13} className="text-[#0078B0] shrink-0" />
                                <span className="truncate">{teste.name || `Teste 0${tIdx + 1}`}</span>
                              </div>
                              <div className="flex items-center gap-1 shrink-0">
                                <button
                                  onClick={() => addTask(tIdx)}
                                  className="p-1 rounded-[3px] text-[#0078B0] hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                  title="Adicionar Tarefa"
                                >
                                  <Plus size={12} />
                                </button>
                                {testsConfig.length > 1 && (
                                  <button
                                    onClick={() => removeTest(tIdx)}
                                    className="p-1 rounded-[3px] text-neutral-400 hover:text-red-500"
                                    title="Excluir Teste"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* Tarefas Nodes */}
                            <div className="pl-3 border-l border-neutral-200 dark:border-neutral-700 ml-2 flex flex-col gap-1.5">
                              {(teste.tasks || []).map((task, tfIdx) => {
                                return (
                                  <div key={tfIdx} className="flex flex-col gap-1">
                                    <div className="flex items-center justify-between p-1 px-1.5 rounded-[4px] hover:bg-neutral-100 dark:hover:bg-neutral-800 text-xs font-semibold text-neutral-700 dark:text-neutral-300">
                                      <div className="flex items-center gap-1 min-w-0 flex-1 mr-1 truncate">
                                        <BookOpenText size={12} className="text-neutral-500 shrink-0" />
                                        <span className="truncate">{task.title || `Tarefa ${tfIdx + 1}`}</span>
                                      </div>
                                      <button
                                        onClick={() => addItem(tIdx, tfIdx)}
                                        className="p-0.5 rounded-[3px] text-[#0078B0] hover:bg-neutral-200 dark:hover:bg-neutral-700"
                                        title="Adicionar Item a esta Tarefa"
                                      >
                                        <Plus size={11} />
                                      </button>
                                    </div>

                                    {/* Itens Nodes */}
                                    <div className="pl-3 border-l border-neutral-200 dark:border-neutral-700 ml-2 flex flex-col gap-0.5">
                                      {(task.items || []).map((it, iIdx) => {
                                        const isSelected =
                                          activeItemPath.tIdx === tIdx &&
                                          activeItemPath.tfIdx === tfIdx &&
                                          activeItemPath.iIdx === iIdx;
                                        const hasSkill = it.skills && it.skills.length > 0;

                                        return (
                                          <div
                                            key={iIdx}
                                            onClick={() => setActiveItemPath({ tIdx, tfIdx, iIdx })}
                                            className={`p-1.5 px-2 rounded-[4px] cursor-pointer flex items-center justify-between text-xs transition-all border ${
                                              isSelected
                                                ? 'bg-[#F2FAFE] dark:bg-[#0078B0]/20 border-[#0078B0] text-[#0078B0] dark:text-[#38BDF8] font-bold shadow-xs'
                                                : 'border-transparent hover:bg-neutral-100 dark:hover:bg-neutral-800 text-neutral-700 dark:text-neutral-300'
                                            }`}
                                          >
                                            <div className="flex items-center gap-1.5 min-w-0 flex-1 truncate mr-1">
                                              <span className={`w-1.5 h-1.5 rounded-full ${hasSkill ? 'bg-emerald-500' : 'bg-amber-400'}`} />
                                              <span className="truncate">Item {String(iIdx + 1).padStart(2, '0')}</span>
                                              {hasSkill && (
                                                <span className="font-mono text-[10px] bg-neutral-200/70 dark:bg-neutral-700 px-1 rounded-[3px]">
                                                  {it.skills[0]}
                                                </span>
                                              )}
                                            </div>
                                            {isSelected && <Check size={12} className="text-[#0078B0] shrink-0" />}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                );
                              })}
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Tree Footer */}
                    <div className={`p-3 border-t text-[11px] text-neutral-500 flex items-center justify-between shrink-0 ${
                      isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
                    }`}>
                      <span>Total de Cadernos: {testsConfig.length}</span>
                      <button onClick={addTest} className="text-[#0078B0] font-bold hover:underline">
                        + Novo Teste
                      </button>
                    </div>
                  </div>

                  {/* RIGHT COLUMN: Focused Item Editor (8 cols) */}
                  <div
                    className={`lg:col-span-8 rounded-[8px] border overflow-hidden shadow-xs flex flex-col ${
                      isDarkMode ? 'bg-neutral-850 border-neutral-700 text-white' : 'bg-white border-neutral-200 text-neutral-900'
                    }`}
                  >
                    {currentItem ? (
                      <div className="flex flex-col">
                        {/* Item Focused Header */}
                        <div
                          className={`p-4 px-6 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-3 shrink-0 ${
                            isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50/70 border-neutral-200'
                          }`}
                        >
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-[16px] font-bold tracking-tight">
                              Item {String(activeItemPath.iIdx + 1).padStart(2, '0')}
                            </span>
                            <span className="text-xs text-neutral-500 font-medium">
                              ({currentTask?.title} • {currentTest?.name})
                            </span>

                            {/* Response Type */}
                            <div className="relative">
                              <select
                                value={currentItem.type || 'Múltipla Escolha'}
                                onChange={e => updateItemField(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'type', e.target.value)}
                                className={`text-[12px] font-semibold h-[30px] pl-2 pr-7 border rounded-[4px] outline-none appearance-none cursor-pointer ${
                                  isDarkMode
                                    ? 'bg-neutral-900 border-neutral-700 text-white focus:border-[#0078B0]'
                                    : 'bg-white border-neutral-300 text-neutral-800 focus:border-[#0078B0]'
                                }`}
                              >
                                {RESPONSE_TYPES.map(rt => (
                                  <option key={rt.label} value={rt.label}>{rt.label}</option>
                                ))}
                              </select>
                              <ChevronDown size={13} className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-400" />
                            </div>
                          </div>

                          {/* Completion & AI Actions */}
                          <div className="flex items-center gap-3">
                            <span className={`text-[11px] font-bold px-2 py-0.5 rounded-[4px] border ${
                              isItemComplete
                                ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800'
                                : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800'
                            }`}>
                              {filledCount} de {requiredFieldsCount} campos preenchidos
                            </span>

                            {aiFillingItem === `${activeItemPath.tIdx}-${activeItemPath.tfIdx}-${activeItemPath.iIdx}` ? (
                              <Button variant="primary" appearance="solid" size="xs" disabled iconLeft={<Loader2 size={12} className="animate-spin" />}>
                                Gerando...
                              </Button>
                            ) : (
                              <Button
                                variant="tertiary"
                                appearance="solid"
                                size="xs"
                                iconLeft={<Sparkles size={12} className="text-[#0078B0]" />}
                                onClick={() => handleFillAI(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx)}
                              >
                                Preencher c/ IA
                              </Button>
                            )}
                          </div>
                        </div>

                        {/* Item Structured 3 Sections */}
                        <div className="p-6 flex flex-col gap-6">

                          {/* ─── 1. CONTEÚDO ─── */}
                          <div className={`border rounded-[8px] overflow-hidden ${isDarkMode ? 'border-neutral-700 bg-neutral-900/50' : 'border-neutral-200 bg-white'}`}>
                            <div
                              onClick={() => setOpenSectionsStep2(prev => ({ ...prev, conteudo: !prev.conteudo }))}
                              className={`p-3 px-4 border-b flex items-center justify-between cursor-pointer select-none ${
                                isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#0078B0] text-white flex items-center justify-center text-[10px] font-bold">1</span>
                                <h3 className="text-[13px] font-bold">Conteúdo do Item</h3>
                              </div>
                              <span className="text-neutral-400">
                                {openSectionsStep2.conteudo ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </span>
                            </div>

                            {openSectionsStep2.conteudo && (
                              <div className="p-4 flex flex-col gap-4">
                                {/* Enunciado Principal */}
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-6 dark:text-neutral-3">
                                      Enunciado Principal <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                      onClick={() => openInternalMdModal(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'statement')}
                                      className="text-xs font-bold text-[#0078B0] hover:underline flex items-center gap-1"
                                    >
                                      <FileText size={12} /> Abrir Editor Markdown
                                    </button>
                                  </div>
                                  <textarea
                                    rows={3}
                                    value={currentItem.statement || ''}
                                    onChange={e => updateItemField(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'statement', e.target.value)}
                                    placeholder="Digite a formulação clara da questão..."
                                    className={`w-full p-2.5 text-xs leading-relaxed border rounded-[4px] outline-none ${
                                      isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white focus:border-[#0078B0]' : 'bg-white border-neutral-300 text-neutral-800 focus:border-[#0078B0]'
                                    }`}
                                  />
                                </div>

                                {/* Contexto da Tarefa / Item */}
                                <div className="flex flex-col gap-1.5">
                                  <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-6 dark:text-neutral-3">
                                    Contexto / Texto de Apoio
                                  </label>
                                  {currentTask?.hasItemComposto && currentTask?.itemCompostoMarkdown ? (
                                    <div className="p-2.5 rounded-[4px] bg-neutral-50 dark:bg-neutral-800 border text-xs text-neutral-600 dark:text-neutral-300">
                                      <span className="font-bold block mb-1">Texto Base da Tarefa: {currentTask.itemCompostoTitle}</span>
                                      <p className="line-clamp-2 italic">{currentTask.itemCompostoMarkdown}</p>
                                    </div>
                                  ) : (
                                    <input
                                      type="text"
                                      value={currentTask?.context || ''}
                                      onChange={e => updateTaskField(activeItemPath.tIdx, activeItemPath.tfIdx, 'context', e.target.value)}
                                      placeholder="Texto de apoio, gráfico ou poema..."
                                      className={`w-full px-3 h-[36px] text-xs border rounded-[4px] outline-none ${
                                        isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-800'
                                      }`}
                                    />
                                  )}
                                </div>

                                {/* Alternativas (se Múltipla Escolha) */}
                                {(currentItem.type || 'Múltipla Escolha') === 'Múltipla Escolha' && (
                                  <div className="flex flex-col gap-2 pt-2 border-t dark:border-neutral-700">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-6 dark:text-neutral-3">
                                      Alternativas e Análise de Distratores ({numAlternatives} Alternativas)
                                    </label>
                                    <div className="space-y-2">
                                      {altLabels.map(letter => (
                                        <div key={letter} className="flex items-center gap-2 p-2 rounded-[4px] border border-neutral-200 dark:border-neutral-700 bg-neutral-50/40 dark:bg-neutral-800/40">
                                          <div className="w-6 h-6 rounded-full bg-white dark:bg-neutral-700 border flex items-center justify-center font-bold text-xs shrink-0">
                                            {letter}
                                          </div>
                                          <input
                                            type="text"
                                            value={currentItem.alternativeIntentions?.[letter] || ''}
                                            onChange={e => updateItemField(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'alternativeIntentions', {
                                              ...(currentItem.alternativeIntentions || {}),
                                              [letter]: e.target.value
                                            })}
                                            placeholder={`Texto e justificativa pedagógica da alternativa ${letter}...`}
                                            className={`flex-1 px-2.5 h-[32px] text-xs border rounded-[4px] ${
                                              isDarkMode ? 'bg-neutral-900 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-800'
                                            }`}
                                          />
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {/* Resposta Esperada (se Discursiva / Híbrida) */}
                                {(currentItem.type === 'Resposta Construída' || currentItem.type === 'Híbrida') && (
                                  <div className="flex flex-col gap-1.5 pt-2 border-t dark:border-neutral-700">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-6 dark:text-neutral-3">
                                      Resposta Esperada (Padrão de Correção)
                                    </label>
                                    <textarea
                                      rows={2}
                                      value={currentItem.expectedAnswer || ''}
                                      onChange={e => updateItemField(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'expectedAnswer', e.target.value)}
                                      placeholder="Expectativa de resposta para orientar os corretores e calibração de IA..."
                                      className={`w-full p-2.5 text-xs border rounded-[4px] outline-none ${
                                        isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-800'
                                      }`}
                                    />
                                  </div>
                                )}
                              </div>
                            )}
                          </div>

                          {/* ─── 2. CLASSIFICAÇÃO PEDAGÓGICA ─── */}
                          <div className={`border rounded-[8px] overflow-hidden ${isDarkMode ? 'border-neutral-700 bg-neutral-900/50' : 'border-neutral-200 bg-white'}`}>
                            <div
                              onClick={() => setOpenSectionsStep2(prev => ({ ...prev, classificacao: !prev.classificacao }))}
                              className={`p-3 px-4 border-b flex items-center justify-between cursor-pointer select-none ${
                                isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#0078B0] text-white flex items-center justify-center text-[10px] font-bold">2</span>
                                <h3 className="text-[13px] font-bold">Classificação Pedagógica</h3>
                              </div>
                              <span className="text-neutral-400">
                                {openSectionsStep2.classificacao ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </span>
                            </div>

                            {openSectionsStep2.classificacao && (
                              <div className="p-4 flex flex-col gap-4">
                                {/* Habilidades BNCC */}
                                <div className="flex flex-col gap-1.5">
                                  <div className="flex items-center justify-between">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-6 dark:text-neutral-3">
                                      Habilidades Avaliadas (BNCC) <span className="text-red-500">*</span>
                                    </label>
                                    <button
                                      onClick={() => openSkillsModal(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx)}
                                      className="text-xs font-bold text-[#0078B0] hover:underline flex items-center gap-1"
                                    >
                                      <Plus size={12} /> Vincular Habilidades
                                    </button>
                                  </div>

                                  <div className="p-2.5 rounded-[4px] border border-neutral-200 dark:border-neutral-700 flex items-center justify-between bg-neutral-50/50 dark:bg-neutral-800/50">
                                    {currentItem.skills && currentItem.skills.length > 0 ? (
                                      <div className="flex flex-wrap gap-1.5">
                                        {currentItem.skills.map(skillId => (
                                          <span key={skillId} className="inline-flex items-center gap-1 text-[11px] font-mono font-bold text-[#0078B0] bg-[#0078B0]/10 px-2 py-0.5 rounded-[4px]">
                                            {skillId}
                                            <button onClick={() => removeSkillFromItem(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, skillId)} className="text-neutral-400 hover:text-red-500">
                                              <X size={11} />
                                            </button>
                                          </span>
                                        ))}
                                      </div>
                                    ) : (
                                      <span className="text-xs italic text-neutral-400">Nenhuma habilidade vinculada</span>
                                    )}
                                  </div>
                                </div>

                                {/* Processos Cognitivos e Sentença Descritora */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-6 dark:text-neutral-3">
                                      Processo Cognitivo (Bloom)
                                    </label>
                                    <select
                                      value={currentItem.cognitiveProcess || currentTask?.cognitiveProcess || 'Compreender'}
                                      onChange={e => updateItemField(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'cognitiveProcess', e.target.value)}
                                      className={`px-3 h-[36px] text-xs border rounded-[4px] outline-none ${
                                        isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-800'
                                      }`}
                                    >
                                      {COGNITIVE_PROCESSES.map(pc => <option key={pc} value={pc}>{pc}</option>)}
                                    </select>
                                  </div>

                                  <div className="flex flex-col gap-1.5">
                                    <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-6 dark:text-neutral-3">
                                      Sentença Descritora (Matriz)
                                    </label>
                                    <input
                                      type="text"
                                      value={currentItem.descriptor || ''}
                                      onChange={e => updateItemField(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'descriptor', e.target.value)}
                                      placeholder="Ex: D1 - Localizar informação explícita"
                                      className={`px-3 h-[36px] text-xs border rounded-[4px] outline-none ${
                                        isDarkMode ? 'bg-neutral-800 border-neutral-700 text-white' : 'bg-white border-neutral-300 text-neutral-800'
                                      }`}
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                          {/* ─── 3. CRITÉRIOS DE AVALIAÇÃO & RUBRICAS ─── */}
                          <div className={`border rounded-[8px] overflow-hidden ${isDarkMode ? 'border-neutral-700 bg-neutral-900/50' : 'border-neutral-200 bg-white'}`}>
                            <div
                              onClick={() => setOpenSectionsStep2(prev => ({ ...prev, criterios: !prev.criterios }))}
                              className={`p-3 px-4 border-b flex items-center justify-between cursor-pointer select-none ${
                                isDarkMode ? 'bg-neutral-800 border-neutral-700' : 'bg-neutral-50 border-neutral-200'
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <span className="w-5 h-5 rounded-full bg-[#0078B0] text-white flex items-center justify-center text-[10px] font-bold">3</span>
                                <h3 className="text-[13px] font-bold">Critérios de Avaliação e Rubricas</h3>
                              </div>
                              <span className="text-neutral-400">
                                {openSectionsStep2.criterios ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                              </span>
                            </div>

                            {openSectionsStep2.criterios && (
                              <div className="p-4 flex flex-col gap-4">
                                <label className="text-[11px] font-bold uppercase tracking-wider text-neutral-6 dark:text-neutral-3">
                                  Padrões de Desempenho (3 Níveis)
                                </label>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                                  <div className="p-3 rounded-[4px] border border-red-200 dark:border-red-900/40 bg-red-50/20 dark:bg-red-950/10 flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-red-600 uppercase">Insuficiente</span>
                                    <textarea
                                      rows={2}
                                      value={currentItem.performanceLevels?.insufficient || ''}
                                      onChange={e => updateItemField(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'performanceLevels', {
                                        ...(currentItem.performanceLevels || {}),
                                        insufficient: e.target.value
                                      })}
                                      placeholder="Critérios de erro..."
                                      className="w-full p-2 text-xs border rounded-[4px] bg-white dark:bg-neutral-800"
                                    />
                                  </div>

                                  <div className="p-3 rounded-[4px] border border-amber-200 dark:border-amber-900/40 bg-amber-50/20 dark:bg-amber-950/10 flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-amber-600 uppercase">Parcial</span>
                                    <textarea
                                      rows={2}
                                      value={currentItem.performanceLevels?.partial || ''}
                                      onChange={e => updateItemField(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'performanceLevels', {
                                        ...(currentItem.performanceLevels || {}),
                                        partial: e.target.value
                                      })}
                                      placeholder="Critérios de domínio parcial..."
                                      className="w-full p-2 text-xs border rounded-[4px] bg-white dark:bg-neutral-800"
                                    />
                                  </div>

                                  <div className="p-3 rounded-[4px] border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/20 dark:bg-emerald-950/10 flex flex-col gap-1.5">
                                    <span className="text-[10px] font-bold text-emerald-600 uppercase">Suficiente</span>
                                    <textarea
                                      rows={2}
                                      value={currentItem.performanceLevels?.sufficient || ''}
                                      onChange={e => updateItemField(activeItemPath.tIdx, activeItemPath.tfIdx, activeItemPath.iIdx, 'performanceLevels', {
                                        ...(currentItem.performanceLevels || {}),
                                        sufficient: e.target.value
                                      })}
                                      placeholder="Critérios de alcance pleno..."
                                      className="w-full p-2 text-xs border rounded-[4px] bg-white dark:bg-neutral-800"
                                    />
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>

                        </div>

                        {/* Sequential Navigation inside Step 2 */}
                        <div className={`p-4 px-6 border-t flex items-center justify-between gap-4 shrink-0 ${
                          isDarkMode ? 'bg-neutral-800/80 border-neutral-700' : 'bg-neutral-50/60 border-neutral-200'
                        }`}>
                          <button
                            type="button"
                            onClick={handlePrev}
                            disabled={safeFlatIndex === 0}
                            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-semibold border flex items-center gap-1.5 ${
                              safeFlatIndex > 0 ? 'border-neutral-300 text-neutral-700 hover:bg-neutral-100 cursor-pointer' : 'opacity-40 cursor-not-allowed'
                            }`}
                          >
                            <ArrowLeft size={13} /> Item anterior
                          </button>

                          <span className="text-xs font-bold text-neutral-600 dark:text-neutral-300">
                            Item {safeFlatIndex + 1} de {flatItems.length}
                          </span>

                          <button
                            type="button"
                            onClick={handleNext}
                            disabled={safeFlatIndex >= flatItems.length - 1}
                            className={`px-3.5 py-1.5 rounded-[4px] text-xs font-bold flex items-center gap-1.5 ${
                              safeFlatIndex < flatItems.length - 1
                                ? 'bg-[#0078B0] text-white hover:bg-[#006899] cursor-pointer'
                                : 'opacity-40 bg-neutral-300 text-neutral-500 cursor-not-allowed'
                            }`}
                          >
                            Próximo item <ArrowRight size={13} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="p-12 text-center text-neutral-400">
                        <BookOpen size={36} className="mx-auto mb-2 opacity-30" />
                        <p className="text-sm font-semibold">Nenhum item cadastrado nesta tarefa.</p>
                        <Button variant="primary" appearance="solid" size="xs" onClick={() => addItem(activeItemPath.tIdx, activeItemPath.tfIdx)} className="mt-3">
                          + Adicionar Primeiro Item
                        </Button>
                      </div>
                    )}
                  </div>

                </div>

                {/* Step 2 Global Navigation Buttons */}
                <div className="flex justify-between pt-6 border-t dark:border-neutral-700">
                  <button
                    onClick={() => goToStep(1)}
                    className="bg-white dark:bg-neutral-800 border border-neutral-300 dark:border-neutral-600 text-neutral-700 dark:text-neutral-200 font-semibold px-6 py-2.5 rounded-[6px] hover:bg-neutral-50 transition-all flex items-center gap-2 text-xs"
                  >
                    <ArrowLeft size={15} /> Voltar para Identificação
                  </button>
                  <button
                    onClick={() => goToStep(3)}
                    className="bg-[#0078B0] hover:bg-[#006899] text-white font-bold px-7 py-2.5 rounded-[6px] transition-all shadow-sm flex items-center gap-2.5 text-xs"
                  >
                    <span>Avançar para Configurações (Etapa 3)</span>
                    <ArrowRight size={15} />
                  </button>
                </div>
              </section>
            );
          })()}

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 3: CONFIGURAÇÕES DE APLICAÇÃO          */}
          {/* ═══════════════════════════════════════════ */}
          {currentStep === 3 && (
            <div className="space-y-8 animate-fade-in-up">
              <div className="text-center space-y-2 mb-8">
                <h1 className="text-2xl font-bold text-neutral-6 dark:text-white tracking-tight">Configurações de Aplicação e Correção</h1>
                <p className="text-sm text-neutral-4">Defina como esta avaliação será aplicada aos estudantes e metodologias de avaliação.</p>
              </div>

              {/* Application Settings */}
              <div className={`p-8 rounded-[8px] border space-y-8 ${cardBg}`}>
                <div className={`flex items-center gap-3 border-b pb-4 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
                  <div className="w-8 h-8 rounded-full bg-brand-50 dark:bg-brand-900/30 text-brand-500 flex items-center justify-center">
                    <Calendar size={16} />
                  </div>
                  <h2 className="text-base font-bold text-neutral-6 dark:text-white">Configurações da Aplicação</h2>
                </div>

                {/* Scale */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-5 dark:text-neutral-3 mb-3">Escopo de Aplicação</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div onClick={() => setScale('PEQUENA')} className={`${cardSelectorCls(scale === 'PEQUENA')} p-4 flex items-center gap-4`}>
                      <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${scale === 'PEQUENA' ? 'bg-brand-100 text-brand-500' : 'bg-neutral-2 dark:bg-neutral-5 text-neutral-4'}`}>
                        <School size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-6 dark:text-white">Pequena Escala</h4>
                        <p className="text-xs text-neutral-4">Turmas específicas.</p>
                      </div>
                    </div>
                    <div onClick={() => setScale('LARGA')} className={`${cardSelectorCls(scale === 'LARGA')} p-4 flex items-center gap-4`}>
                      <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${scale === 'LARGA' ? 'bg-brand-100 text-brand-500' : 'bg-neutral-2 dark:bg-neutral-5 text-neutral-4'}`}>
                        <Network size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-6 dark:text-white">Larga Escala</h4>
                        <p className="text-xs text-neutral-4">Rede padronizada.</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Schedule */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-5 dark:text-neutral-3 mb-3">Cronograma e Duração</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div>
                      <label className="block text-xs font-semibold text-neutral-5 dark:text-neutral-3 mb-1">Data de Início</label>
                      <input type="datetime-local" value={startDate} onChange={e => setStartDate(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-5 dark:text-neutral-3 mb-1">Data de Término</label>
                      <input type="datetime-local" value={endDate} onChange={e => setEndDate(e.target.value)} className={inputCls} />
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-neutral-5 dark:text-neutral-3 mb-1">Tempo de Prova (minutos)</label>
                      <input type="number" value={duration} onChange={e => setDuration(e.target.value)} placeholder="Ex: 120" className={inputCls} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Correction Settings */}
              <div className={`p-8 rounded-[8px] border space-y-8 ${cardBg}`}>
                <div className={`flex items-center gap-3 border-b pb-4 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
                  <div className="w-8 h-8 rounded-full bg-extended-lavender-extraLight dark:bg-extended-lavender-dark/20 text-extended-lavender-base flex items-center justify-center">
                    <ShieldCheck size={16} />
                  </div>
                  <h2 className="text-base font-bold text-neutral-6 dark:text-white">Configurações da Correção</h2>
                </div>

                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-neutral-5 dark:text-neutral-3 mb-3">Metodologia</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div onClick={() => setCorrectionType('MANUAL')} className={`${cardSelectorCls(correctionType === 'MANUAL')} p-4 flex items-center gap-4`}>
                      <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${correctionType === 'MANUAL' ? 'bg-neutral-2 dark:bg-neutral-5 text-neutral-6' : 'bg-neutral-2 dark:bg-neutral-5 text-neutral-4'}`}>
                        <UserCheck size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-6 dark:text-white">Manual (Professores)</h4>
                        <p className="text-[11px] text-neutral-4">Correção humana padrão.</p>
                      </div>
                    </div>
                    <div onClick={() => setCorrectionType('IA')} className={`${cardSelectorCls(correctionType === 'IA')} p-4 flex items-center gap-4`}>
                      <div className={`w-10 h-10 rounded-[8px] flex items-center justify-center ${correctionType === 'IA' ? 'bg-extended-lavender-extraLight text-extended-lavender-dark' : 'bg-neutral-2 dark:bg-neutral-5 text-neutral-4'}`}>
                        <Cpu size={20} />
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-neutral-6 dark:text-white">Assistida por IA</h4>
                        <p className="text-[11px] text-neutral-4">Pré-análise via inteligência artificial.</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-5 dark:text-neutral-3 mb-1">Prazo Limite p/ Correção</label>
                    <input type="date" value={correctionDeadline} onChange={e => setCorrectionDeadline(e.target.value)} className={inputCls} />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-5 dark:text-neutral-3 mb-1">Avaliadores por Item</label>
                    <select className={inputCls}>
                      <option>1 Avaliador</option>
                      <option>2 Avaliadores (Dupla Correção)</option>
                      <option>3 Avaliadores</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-5 dark:text-neutral-3 mb-1">Quantidade de Validadores</label>
                    <select className={inputCls}>
                      <option>Sem Validador</option>
                      <option>1 Validador de Divergência</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className={`flex justify-between pt-8 border-t ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
                <Button variant="tertiary" appearance="solid" size="md" iconLeft={<ArrowLeft size={16} />} onClick={() => goToStep(2)}>
                  Voltar
                </Button>
                <Button variant="primary" appearance="solid" size="md" iconRight={<ArrowRight size={16} />} onClick={() => goToStep(4)}>
                  Avançar para Revisão Final
                </Button>
              </div>
            </div>
          )}

          {/* ═══════════════════════════════════════════ */}
          {/* STEP 4: REVISÃO FINAL E DESCRIÇÃO IA       */}
          {/* ═══════════════════════════════════════════ */}
          {currentStep === 4 && (() => {
            const allSkills = testsConfig.flatMap(t => (t.tasks || []).flatMap(tf => (tf.items || []).flatMap(it => it.skills || [])));
            const uniqueSkills = [...new Set(allSkills)];
            const natureLabels = { DIAGNOSTICA: 'Diagnóstica', FORMATIVA: 'Formativa', SOMATIVA: 'Somativa' };

            return (
              <div className="space-y-8 animate-fade-in-up">
                <div className="text-center space-y-2 mb-8">
                  <h1 className="text-2xl font-bold text-neutral-6 dark:text-white tracking-tight">Revisão e Finalização</h1>
                  <p className="text-sm text-neutral-4">Revise os dados, gere a descrição pedagógica e libere a avaliação.</p>
                </div>

                {/* Summary Dashboard */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Natureza', value: natureLabels[nature] || '-' },
                    { label: 'Testes', value: testsConfig.length },
                    { label: 'Tarefas', value: totalTasks },
                    { label: 'Itens totais', value: totalItems },
                  ].map((m, idx) => (
                    <div key={idx} className={`p-5 rounded-[8px] border text-center ${cardBg}`}>
                      <div className="text-xs text-neutral-4 uppercase tracking-wider font-bold mb-1">{m.label}</div>
                      <div className="text-2xl font-bold text-brand-800 dark:text-brand-300">{m.value}</div>
                    </div>
                  ))}
                </div>

                {/* AI Description */}
                <div className={`p-8 rounded-[8px] border space-y-4 ${isDarkMode ? 'bg-extended-lavender-dark/10 border-extended-lavender-dark/30' : 'bg-extended-lavender-extraLight/20 border-extended-lavender-light/50'}`}>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <div>
                      <h3 className="font-bold text-neutral-6 dark:text-white flex items-center gap-2">
                        <Sparkles size={18} className="text-extended-lavender-base" /> Resumo Pedagógico da Avaliação
                      </h3>
                      <p className="text-xs text-neutral-4 mt-1">A IA do MAPEAR analisa o conteúdo real e as habilidades para elaborar a síntese oficial.</p>
                    </div>
                    <Button variant="primary" appearance="solid" size="sm" iconRight={<Sparkles size={14} />} onClick={generateDescriptionAI}>
                      Gerar Descrição com IA
                    </Button>
                  </div>
                  <textarea
                    value={aiDescription}
                    onChange={e => setAiDescription(e.target.value)}
                    rows={4}
                    className={`w-full p-4 rounded-[8px] border text-sm leading-relaxed ${isDarkMode
                      ? 'bg-neutral-7 border-neutral-5 text-white focus:ring-2 focus:ring-brand-500'
                      : 'bg-white border-neutral-3 text-neutral-6 focus:ring-2 focus:ring-brand-500'
                      }`}
                    placeholder="A descrição detalhada será gerada aqui com base na estrutura criada..."
                  />
                </div>

                {/* Validation Box */}
                <div className={`p-6 rounded-[8px] border ${impediments.length > 0
                  ? 'bg-extended-orange-extraLight/40 border-extended-orange-light dark:bg-extended-orange-dark/20'
                  : 'bg-semantic-success-extraLight/40 border-semantic-success-light dark:bg-semantic-success-dark/20'
                  } space-y-3`}>
                  <div className="text-sm font-bold text-neutral-6 dark:text-white flex items-center gap-2">
                    {impediments.length > 0
                      ? <><AlertTriangle size={18} className="text-extended-orange-base" /> Esta avaliação possui pendências</>
                      : <><Check size={18} className="text-semantic-success-base" /> Avaliação pronta para aplicar</>
                    }
                  </div>
                  {impediments.length > 0 ? (
                    <div className="space-y-2">
                      {impediments.map((imp, idx) => (
                        <button
                          key={idx}
                          onClick={() => goToStep(imp.step)}
                          className={`w-full text-left p-3 rounded-[8px] border flex items-center justify-between text-xs font-semibold transition-all hover:bg-white dark:hover:bg-neutral-6 ${isDarkMode ? 'border-neutral-5 bg-neutral-7' : 'border-neutral-2 bg-white'}`}
                        >
                          <span>⚠ {imp.label}</span>
                          <span className="text-brand-500 shrink-0">Ir para etapa {imp.step} →</span>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-semantic-success-dark dark:text-semantic-success-light">
                      <div>✓ Avaliação {natureLabels[nature]?.toLowerCase()}</div>
                      <div>✓ {testsConfig.length} teste(s)</div>
                      <div>✓ {totalTasks} tarefa(s)</div>
                      <div>✓ {totalItems} item(ns)</div>
                      <div>✓ {uniqueSkills.length} habilidades BNCC</div>
                      <div>✓ Correção {correctionType === 'IA' ? 'por IA' : 'manual'}</div>
                    </div>
                  )}
                </div>

                <div className={`flex justify-between pt-8 border-t ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
                  <Button variant="tertiary" appearance="solid" size="md" iconLeft={<ArrowLeft size={16} />} onClick={() => goToStep(3)}>
                    Voltar
                  </Button>
                  <Button
                    variant="primary"
                    appearance="solid"
                    size="lg"
                    iconLeft={<Check size={18} />}
                    onClick={handleFinish}
                    disabled={!isValid}
                  >
                    {isEditing ? 'Salvar Alterações' : 'Finalizar Avaliação'}
                  </Button>
                </div>
              </div>
            );
          })()}

        </div>
      </main>

      {/* ═══ IMPEDIMENTS DRAWER ═══ */}
      <div className={`fixed top-[84px] h-[calc(100vh-84px)] right-0 w-full sm:w-96 shadow-2xl z-50 transform transition-transform duration-300 ease-in-out border-l flex flex-col ${impedimentsOpen ? 'translate-x-0' : 'translate-x-full'
        } ${isDarkMode ? 'bg-neutral-7 border-neutral-5' : 'bg-white border-neutral-2'}`}>
        <div className={`p-4 flex items-center justify-between shrink-0 ${isDarkMode ? 'bg-neutral-6' : 'bg-neutral-6'}`}>
          <div className="flex items-center gap-2 text-white">
            <AlertTriangle size={16} className="text-semantic-caution-base" />
            <h3 className="font-bold text-sm">Pendências Normativas</h3>
          </div>
          <button onClick={() => setImpedimentsOpen(false)} className="text-neutral-3 hover:text-white p-1">
            <X size={18} />
          </button>
        </div>
        <div className={`p-4 flex-1 overflow-y-auto space-y-3 ${isDarkMode ? 'bg-neutral-7' : 'bg-neutral-1'}`}>
          {impediments.length === 0 ? (
            <div className="text-center py-8 text-neutral-4">
              <Check size={32} className="mx-auto mb-2 text-semantic-success-base" />
              <p className="text-sm font-semibold">Nenhuma pendência encontrada!</p>
            </div>
          ) : (
            impediments.map((imp, idx) => (
              <button
                key={idx}
                onClick={() => { goToStep(imp.step); setImpedimentsOpen(false); }}
                className={`w-full text-left p-3 rounded-[8px] border flex items-start gap-2.5 text-xs font-semibold transition-all hover:shadow-sm ${isDarkMode ? 'border-neutral-5 bg-neutral-6 hover:bg-neutral-5' : 'border-neutral-2 bg-white hover:bg-neutral-1'}`}
              >
                <AlertTriangle size={14} className="text-semantic-caution-base shrink-0 mt-0.5" />
                <div>
                  <p className="text-neutral-6 dark:text-neutral-2">{imp.label}</p>
                  <p className="text-[10px] text-brand-500 mt-0.5">Etapa {imp.step} →</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* ═══ DELETE CONFIRMATION MODAL ═══ */}
      {deleteModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-[8px] shadow-2xl w-full max-w-md overflow-hidden flex flex-col ${isDarkMode ? 'bg-neutral-6 border border-neutral-5' : 'bg-white'}`}>
            <div className="p-6 text-center space-y-4">
              <div className="w-14 h-14 bg-semantic-error-extraLight text-semantic-error-base rounded-full flex items-center justify-center mx-auto text-2xl">
                <AlertTriangle size={24} />
              </div>
              <h3 className="text-lg font-bold text-neutral-6 dark:text-white">{deleteModal.title}</h3>
              <p className="text-xs text-neutral-4 leading-relaxed">{deleteModal.msg}</p>
            </div>
            <div className={`p-4 border-t flex justify-end gap-3 ${isDarkMode ? 'border-neutral-5 bg-neutral-7' : 'border-neutral-2 bg-neutral-1'}`}>
              <Button variant="tertiary" appearance="solid" size="sm" onClick={() => setDeleteModal(null)}>Cancelar</Button>
              <Button variant="destructive" appearance="solid" size="sm" iconLeft={<Trash2 size={14} />} onClick={deleteModal.onConfirm}>
                Confirmar Exclusão
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ SKILLS MODAL (BNCC Multi-Select) ═══ */}
      {skillsModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-[8px] shadow-xl w-full max-w-lg overflow-hidden flex flex-col max-h-[80vh] ${isDarkMode ? 'bg-neutral-6 border border-neutral-5' : 'bg-white'}`}>
            <div className={`p-4 border-b flex justify-between items-center ${isDarkMode ? 'border-neutral-5 bg-neutral-7' : 'border-neutral-2 bg-neutral-1'}`}>
              <div>
                <h3 className="font-bold text-neutral-6 dark:text-white text-sm">Vincular Habilidades BNCC</h3>
                <p className="text-[10px] text-neutral-4">Selecione uma ou mais habilidades avaliadas neste Item.</p>
              </div>
              <button onClick={() => setSkillsModal(null)} className="text-neutral-4 hover:text-semantic-error-base"><X size={16} /></button>
            </div>
            <div className={`p-3 border-b ${isDarkMode ? 'border-neutral-5 bg-neutral-7' : 'border-neutral-2 bg-neutral-1'}`}>
              <input
                type="text"
                value={skillsSearch}
                onChange={e => setSkillsSearch(e.target.value)}
                placeholder="Buscar por código ou descrição (ex: EF05MA01)..."
                className={`w-full px-3 py-2 border rounded-[8px] text-xs focus:ring-2 focus:ring-brand-500 outline-none ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-3 text-neutral-6'}`}
              />
            </div>
            <div className="flex-1 overflow-y-auto p-2 space-y-0.5" style={{ maxHeight: '50vh' }}>
              {filteredSkills.map(skill => {
                const isSelected = skillsSelection.includes(skill.id);
                return (
                  <label
                    key={skill.id}
                    className={`flex items-start gap-2.5 p-2.5 rounded-[4px] cursor-pointer transition-colors text-xs ${isSelected
                      ? isDarkMode ? 'bg-brand-900/30' : 'bg-brand-50'
                      : isDarkMode ? 'hover:bg-neutral-5' : 'hover:bg-neutral-1'
                      }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => {
                        setSkillsSelection(prev =>
                          prev.includes(skill.id)
                            ? prev.filter(s => s !== skill.id)
                            : [...prev, skill.id]
                        );
                      }}
                      className="mt-0.5 accent-brand-500"
                    />
                    <div>
                      <span className="font-mono font-bold text-brand-500">{skill.id}</span>
                      <span className="text-neutral-5 dark:text-neutral-3 ml-2">{skill.desc}</span>
                    </div>
                  </label>
                );
              })}
            </div>
            <div className={`p-4 border-t flex justify-end gap-2 ${isDarkMode ? 'border-neutral-5 bg-neutral-7' : 'border-neutral-2 bg-neutral-1'}`}>
              <Button variant="primary" appearance="solid" size="sm" onClick={saveSkillsSelection}>
                Confirmar Seleção ({skillsSelection.length})
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ INTERNAL MARKDOWN EDITOR MODAL ═══ */}
      {internalMdModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className={`rounded-[8px] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col h-[85vh] ${isDarkMode ? 'bg-neutral-6 border border-neutral-5' : 'bg-white'}`}>
            {/* Header */}
            <div className={`p-4 border-b flex justify-between items-center shrink-0 ${isDarkMode ? 'border-neutral-5 bg-neutral-6' : 'border-neutral-2 bg-neutral-6'}`}>
              <div className="flex items-center gap-2 text-white">
                <FileText size={16} className="text-brand-300" />
                <div>
                  <h3 className="font-bold text-sm">Editor Pedagógico Markdown</h3>
                  <p className="text-[10px] text-neutral-3">Digite no lado esquerdo para ver a renderização formatada no lado direito em tempo real.</p>
                </div>
              </div>
              <button onClick={() => setInternalMdModal(null)} className="text-neutral-3 hover:text-white p-1"><X size={18} /></button>
            </div>

            {/* Title Field */}
            <div className={`p-4 border-b flex flex-col gap-1.5 ${isDarkMode ? 'border-neutral-5 bg-neutral-7' : 'border-neutral-2 bg-neutral-1'}`}>
              <label className="block text-xs font-bold text-neutral-5 dark:text-neutral-3 uppercase tracking-wider">
                Título Curto do Conteúdo <span className="text-semantic-error-base">*</span>
              </label>
              <input
                type="text"
                value={mdTitle}
                onChange={e => setMdTitle(e.target.value)}
                className={`w-full px-3 py-2 border rounded-[8px] text-xs font-medium focus:ring-2 focus:ring-brand-500 outline-none ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-white border-neutral-3 text-neutral-6'}`}
                placeholder="Ex: Relação entre linguagem verbal e visual..."
              />
              <p className="text-[10px] text-neutral-4">Este título funcionará como identificação rápida na tela principal do editor.</p>
            </div>

            {/* Split View */}
            <div className={`flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x overflow-hidden ${isDarkMode ? 'divide-neutral-5 bg-neutral-7' : 'divide-neutral-2 bg-neutral-1'}`}>
              {/* Editor */}
              <div className={`flex flex-col h-full p-3 ${isDarkMode ? 'bg-neutral-7' : 'bg-white'}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-4 mb-2 flex items-center justify-between">
                  <span>Editor Markdown</span>
                  <span className="text-[9px] text-neutral-4 font-normal"># Título, **negrito**, *itálico*, - lista</span>
                </div>
                <textarea
                  value={mdContent}
                  onChange={e => setMdContent(e.target.value)}
                  className={`w-full flex-1 p-3 border rounded-[8px] font-mono text-xs resize-none focus:ring-2 focus:ring-brand-500 outline-none ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-white' : 'bg-neutral-1 border-neutral-2 text-neutral-6'}`}
                  placeholder="Escreva aqui o conteúdo pedagógico completo em Markdown..."
                />
              </div>

              {/* Preview */}
              <div className={`flex flex-col h-full p-3 ${isDarkMode ? 'bg-neutral-6' : 'bg-neutral-1'}`}>
                <div className="text-[10px] font-bold uppercase tracking-wider text-neutral-4 mb-2 flex items-center gap-1">
                  <Eye size={12} /> Visualização em Tempo Real
                </div>
                <div
                  className={`w-full flex-1 p-4 border rounded-[8px] overflow-y-auto text-xs leading-relaxed ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-neutral-2' : 'bg-white border-neutral-2 text-neutral-6'}`}
                  dangerouslySetInnerHTML={{ __html: renderSimpleMarkdown(mdContent) }}
                />
              </div>
            </div>

            {/* Footer */}
            <div className={`p-4 border-t flex justify-end gap-3 shrink-0 ${isDarkMode ? 'border-neutral-5 bg-neutral-6' : 'border-neutral-2 bg-white'}`}>
              <Button variant="tertiary" appearance="solid" size="sm" onClick={() => setInternalMdModal(null)}>Cancelar</Button>
              <Button variant="primary" appearance="solid" size="sm" iconLeft={<Check size={14} />} onClick={saveInternalMdModal}>
                Salvar Conteúdo
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ═══ BANCO DE TAREFAS MODAL ═══ */}
      {bancoModalTargetTestIdx !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm font-['Montserrat',sans-serif]">
          <div className={`w-full max-w-6xl h-[90vh] rounded-[8px] shadow-2xl border flex flex-col overflow-hidden relative ${isDarkMode ? 'bg-neutral-7 border-neutral-5' : 'bg-white border-neutral-2'
            }`}>
            <div className="flex items-center justify-between p-4 px-6 border-b shrink-0 bg-brand-500 text-white">
              <div className="flex items-center gap-2">
                <Database size={20} />
                <span className="font-bold text-sm">Selecione uma Tarefa do Banco para Importar</span>
              </div>
              <Button variant="tertiary" appearance="ghost" iconOnly iconLeft={<X size={18} className="text-white" />} onClick={() => setBancoModalTargetTestIdx(null)} />
            </div>
            <div className="flex-1 min-h-0 overflow-hidden">
              <BancoTarefasHubV2
                onInsertTaskInCurrentTest={handleInsertTaskFromBank}
                isEmbeddedMode={true}
                isDarkMode={isDarkMode}
              />
            </div>
          </div>
        </div>
      )}

      {/* AI Toast Notification */}
      {aiToast && (
        <div className="fixed bottom-6 right-6 z-50 bg-neutral-1 dark:bg-neutral-8 text-neutral-8 dark:text-white px-5 py-3.5 rounded-[12px] shadow-2xl border border-neutral-3 dark:border-neutral-5 flex items-center gap-3 animate-bounce">
          <div className="w-8 h-8 rounded-full bg-neutral-2 dark:bg-neutral-7 text-neutral-6 dark:text-neutral-3 flex items-center justify-center shrink-0 border border-neutral-3 dark:border-neutral-6">
            <Sparkles size={16} />
          </div>
          <div>
            <div className="text-xs font-bold text-neutral-8 dark:text-white">Preenchimento Concluído</div>
            <div className="text-[11px] text-neutral-5 dark:text-neutral-4">{aiToast}</div>
          </div>
        </div>
      )}
    </div>
  );
}
