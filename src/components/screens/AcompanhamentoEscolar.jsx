import React, { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import { 
  Search, 
  Download, 
  AlertCircle, 
  TrendingUp, 
  CheckCircle2, 
  MapPin, 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Layers,
  ArrowUpDown,
  BookOpen,
  SlidersHorizontal,
  LayoutDashboard,
  ShieldAlert,
  Users,
  Check,
  RotateCcw,
  Sparkles,
  Award,
  Filter,
  X,
  Globe,
  Building,
  Landmark,
  FileText,
  ClipboardCheck,
  CheckSquare,
  Square,
  Bookmark
} from 'lucide-react';

// ─── DATA ────────────────────────────────────────────────────────────────────

const ESTADOS_DISPONIVEIS = [
  { sigla: 'PI', nome: 'Piauí', capital: 'Teresina', totalEscolas: 136, totalAlunos: 79184 },
  { sigla: 'CE', nome: 'Ceará', capital: 'Fortaleza', totalEscolas: 452, totalAlunos: 215430 },
  { sigla: 'PE', nome: 'Pernambuco', capital: 'Recife', totalEscolas: 385, totalAlunos: 198200 }
];

const ANOS_ESCOLARES = [
  '5º ano EF', '6º ano EF', '7º ano EF', '8º ano EF', '9º ano EF',
  '1ª série EM', '2ª série EM', '3ª série EM'
];

const ANOS_LETIVOS = [2026, 2025, 2024, 2023, 2022];

const ESCOLAS_POOL = {
  PI: [
    { nome: 'EE Deputado Alberto Silva', municipio: 'Batalha', baseScore: 44, partBase: 65 },
    { nome: 'EE Coronel Maria de Lourdes', municipio: 'Piripiri', baseScore: 45, partBase: 66 },
    { nome: 'EE Doutor Matias Olímpio', municipio: 'Valença do Piauí', baseScore: 46, partBase: 74 },
    { nome: 'EE Dom Matias Olímpio', municipio: 'Batalha', baseScore: 46, partBase: 58 },
    { nome: 'EE Professora Alberto Silva', municipio: 'Piripiri', baseScore: 47, partBase: 62 },
    { nome: 'EE Professora Maria de Lourdes', municipio: 'José de Freitas', baseScore: 47, partBase: 96 },
    { nome: 'EE Marechal Maria de Lourdes', municipio: 'Valença do Piauí', baseScore: 48, partBase: 95 },
    { nome: 'CE Senador Tiradentes', municipio: 'Batalha', baseScore: 48, partBase: 65 },
    { nome: 'EE Governador Alberto Silva', municipio: 'Parnaíba', baseScore: 78, partBase: 82 },
    { nome: 'CE Nossa Senhora João Nogueira', municipio: 'Teresina', baseScore: 78, partBase: 75 },
    { nome: 'EE Dom Petrônio Portela', municipio: 'Floriano', baseScore: 77, partBase: 70 },
    { nome: 'EE Professora Cândido Portinari', municipio: 'Teresina', baseScore: 76, partBase: 78 },
    { nome: 'EE Professora Cândido Portinari II', municipio: 'Teresina', baseScore: 75, partBase: 91 },
    { nome: 'CE Nossa Senhora Antônio Freitas', municipio: 'Altos', baseScore: 75, partBase: 73 },
    { nome: 'CE Padre Castro Alves', municipio: 'Parnaíba', baseScore: 75, partBase: 67 },
    { nome: 'CE Padre Rui Barbosa', municipio: 'Teresina', baseScore: 75, partBase: 80 },
    { nome: 'EE Deputado Pinheiro Machado', municipio: 'Parnaíba', baseScore: 61, partBase: 82 },
    { nome: 'CE Getúlio Vargas', municipio: 'Teresina', baseScore: 63, partBase: 79 },
    { nome: 'EE Castelo Branco', municipio: 'Floriano', baseScore: 59, partBase: 71 },
    { nome: 'EE Eurípedes Aguiar', municipio: 'Teresina', baseScore: 68, partBase: 84 },
    { nome: 'CE Dom Severino', municipio: 'Altos', baseScore: 64, partBase: 76 }
  ],
  CE: [
    { nome: 'EEEP Alan Pinho Tabosa', municipio: 'Pentecoste', baseScore: 82, partBase: 95 },
    { nome: 'EEFM Liceu de Sobral', municipio: 'Sobral', baseScore: 79, partBase: 91 },
    { nome: 'EEEP Joaquim Nogueira', municipio: 'Fortaleza', baseScore: 76, partBase: 89 },
    { nome: 'EEMTI Liceu do Conjunto Ceará', municipio: 'Fortaleza', baseScore: 72, partBase: 88 },
    { nome: 'EEFM Justiniano de Serpa', municipio: 'Fortaleza', baseScore: 68, partBase: 84 },
    { nome: 'EEFM Adauto Bezerra', municipio: 'Juazeiro do Norte', baseScore: 64, partBase: 80 },
    { nome: 'EEEP Maria Célia Pinheiro Falcão', municipio: 'Pereiro', baseScore: 88, partBase: 97 },
    { nome: 'EEM Presidente Castelo Branco', municipio: 'Caucaia', baseScore: 42, partBase: 55 },
    { nome: 'EEM Governador Adauto Bezerra', municipio: 'Maracanaú', baseScore: 48, partBase: 63 },
    { nome: 'EEFM Clóvis Beviláqua', municipio: 'Viçosa do Ceará', baseScore: 45, partBase: 59 },
    { nome: 'EEFM Paulo Freire', municipio: 'Maranguape', baseScore: 49, partBase: 61 },
    { nome: 'EEMTI Dona Luiza Távora', municipio: 'Iguatu', baseScore: 50, partBase: 70 },
    { nome: 'EEFM Virgílio Távora', municipio: 'Crato', baseScore: 52, partBase: 73 },
    { nome: 'EEEP Monsenhor Aloísio Pinto', municipio: 'Sobral', baseScore: 85, partBase: 94 }
  ],
  PE: [
    { nome: 'EREM Porto Digital', municipio: 'Recife', baseScore: 84, partBase: 93 },
    { nome: 'EREM Ginásio Pernambucano', municipio: 'Recife', baseScore: 81, partBase: 91 },
    { nome: 'EREM Maria de Souza', municipio: 'Petrolina', baseScore: 75, partBase: 86 },
    { nome: 'EREM Professor João de Barros', municipio: 'Caruaru', baseScore: 69, partBase: 82 },
    { nome: 'EREM Alfredo de Carvalho', municipio: 'Olinda', baseScore: 62, partBase: 78 },
    { nome: 'EREM Olinda Centro', municipio: 'Olinda', baseScore: 58, partBase: 75 },
    { nome: 'Escola Monsenhor Francisco', municipio: 'Paulista', baseScore: 43, partBase: 57 },
    { nome: 'EREM Professor Agamenon Magalhães', municipio: 'Jaboatão dos Guararapes', baseScore: 46, partBase: 60 },
    { nome: 'Escola de Referência Severino Farias', municipio: 'Garanhuns', baseScore: 48, partBase: 64 },
    { nome: 'Escola Técnica Estadual Cícero Dias', municipio: 'Recife', baseScore: 87, partBase: 96 },
    { nome: 'EREM Dom Vital', municipio: 'Recife', baseScore: 51, partBase: 72 }
  ]
};

const BASE_DOMINIOS_DATA = {
  Matemática: [
    { id: 'dm1', nome: 'Álgebra e Funções', baseScoreTCT: 64, baseScoreTRI: 310, habilidades: [
      { cod: 'H01', desc: 'Identificar a lei de formação de uma função afim baseando-se em pontos dados', scoreTCT: 68, scoreTRI: 320 },
      { cod: 'H02', desc: 'Resolver problemas práticos que envolvem sistemas de equações lineares de primeiro grau', scoreTCT: 61, scoreTRI: 295 },
      { cod: 'H03', desc: 'Analisar o comportamento de gráficos de funções de segundo grau e seus vértices', scoreTCT: 63, scoreTRI: 315 }
    ]},
    { id: 'dm2', nome: 'Geometria e Medidas', baseScoreTCT: 64, baseScoreTRI: 305, habilidades: [
      { cod: 'H04', desc: 'Calcular a área de superfícies planas complexas decompostas em figuras simples', scoreTCT: 65, scoreTRI: 310 },
      { cod: 'H05', desc: 'Aplicar as relações métricas do triângulo retângulo em situações cotidianas', scoreTCT: 62, scoreTRI: 298 },
      { cod: 'H06', desc: 'Reconhecer a conservação ou modificação de medidas de perímetro em ampliações', scoreTCT: 65, scoreTRI: 307 }
    ]},
    { id: 'dm3', nome: 'Estatística e Probabilidade', baseScoreTCT: 63, baseScoreTRI: 290, habilidades: [
      { cod: 'H07', desc: 'Interpretar dados sobre distribuição de frequência apresentados em infográficos ou tabelas', scoreTCT: 67, scoreTRI: 310 },
      { cod: 'H08', desc: 'Calcular a probabilidade de eventos aleatórios simples ou independentes sucessivos', scoreTCT: 59, scoreTRI: 270 }
    ]},
    { id: 'dm4', nome: 'Grandezas e Proporcionalidade', baseScoreTCT: 65, baseScoreTRI: 325, habilidades: [
      { cod: 'H09', desc: 'Resolver problemas envolvendo grandezas diretamente ou inversamente proporcionais', scoreTCT: 69, scoreTRI: 340 },
      { cod: 'H10', desc: 'Calcular porcentagens de acréscimo e decréscimo em transações comerciais financeiras', scoreTCT: 61, scoreTRI: 310 }
    ]}
  ],
  Português: [
    { id: 'dp1', nome: 'Procedimentos de Leitura', baseScoreTCT: 71, baseScoreTRI: 345, habilidades: [
      { cod: 'H11', desc: 'Localizar informações explícitas ou implícitas em diversos tipos textuais', scoreTCT: 75, scoreTRI: 360 },
      { cod: 'H12', desc: 'Inferir o sentido de uma palavra ou expressão com base no contexto linguístico', scoreTCT: 67, scoreTRI: 330 }
    ]},
    { id: 'dp2', nome: 'Implicações do Suporte e do Gênero', baseScoreTCT: 68, baseScoreTRI: 330, habilidades: [
      { cod: 'H13', desc: 'Identificar a finalidade e a esfera de circulação de textos de gêneros variados', scoreTCT: 70, scoreTRI: 340 },
      { cod: 'H14', desc: 'Reconhecer o efeito de sentido decorrente da escolha de uma determinada pontuação', scoreTCT: 66, scoreTRI: 320 }
    ]},
    { id: 'dp3', nome: 'Relação entre Textos', baseScoreTCT: 65, baseScoreTRI: 315, habilidades: [
      { cod: 'H15', desc: 'Reconhecer posições distintas ou convergentes sobre o mesmo tema em textos diferentes', scoreTCT: 65, scoreTRI: 315 }
    ]},
    { id: 'dp4', nome: 'Coesão e Coerência no Texto', baseScoreTCT: 67, baseScoreTRI: 325, habilidades: [
      { cod: 'H16', desc: 'Estabelecer relações lógico-discursivas marcadas por conjunções ou pronomes', scoreTCT: 67, scoreTRI: 325 }
    ]}
  ]
};

const CHRONOLOGICAL_EVALS = [
  { id: 'D1', label: 'D1 · Fev', month: 'Fev', titulo: 'Avaliação Diagnóstica e Somativa de Matemática Aplicada: Análise Integrada do Raciocínio Lógico, Resolução de Problemas Complexos, Álgebra e Geometria Voltada para o Desenvolvimento Global de Competências Acadêmicas e Habilidades Cognitivas dos Estudantes', type: 'diagnostica', scale: 'pequena', scaleLabel: 'Pequena Escala', baseTCT: 60, baseTRI: 275, basePart: 75 },
  { id: 'D2', label: 'D2 · Abr', month: 'Abr', titulo: 'Diagnóstica Trimestral', type: 'diagnostica', scale: 'larga', scaleLabel: 'Larga Escala', baseTCT: 60, baseTRI: 275, basePart: 75 },
  { id: 'F1', label: 'F1 · Jun', month: 'Jun', titulo: 'Formativa Semestral', type: 'formativa', scale: 'larga', scaleLabel: 'Larga Escala', baseTCT: 65, baseTRI: 295, basePart: 75 },
  { id: 'D3', label: 'D3 · Ago', month: 'Ago', titulo: 'Diagnóstica Intermediária', type: 'diagnostica', scale: 'pequena', scaleLabel: 'Pequena Escala', baseTCT: 62, baseTRI: 285, basePart: 75 },
  { id: 'D4', label: 'D4 · Out', month: 'Out', titulo: 'Diagnóstica Focal', type: 'diagnostica', scale: 'pequena', scaleLabel: 'Pequena Escala', baseTCT: 64, baseTRI: 290, basePart: 75 },
  { id: 'F3', label: 'F3 · Out', month: 'Out', titulo: 'Formativa Integrada', type: 'formativa', scale: 'larga', scaleLabel: 'Larga Escala', baseTCT: 69, baseTRI: 315, basePart: 74 },
  { id: 'F2', label: 'F2 · Nov', month: 'Nov', titulo: 'Formativa Final', type: 'formativa', scale: 'larga', scaleLabel: 'Larga Escala', baseTCT: 68, baseTRI: 310, basePart: 76 }
];

// ─── INLINE TOAST ────────────────────────────────────────────────────────────

function InlineToast({ message, onDismiss }) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3200);
    return () => clearTimeout(t);
  }, [message, onDismiss]);

  return (
    <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto animate-slide-up">
      <div className="bg-slate-900 text-white pl-4 pr-3 py-2.5 rounded-lg shadow-xl flex items-center gap-3 text-xs font-semibold border border-slate-700/60 max-w-md">
        <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
        <span className="leading-snug">{message}</span>
        <button onClick={onDismiss} className="ml-1 p-0.5 rounded hover:bg-white/10 transition-colors shrink-0">
          <X className="w-3.5 h-3.5 text-slate-400" />
        </button>
      </div>
    </div>
  );
}

// ─── NETWORK CONTEXT BANNER ──────────────────────────────────────────────────

function NetworkContextBanner({ selectedState, onSelect, estados }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const current = estados.find(e => e.sigla === selectedState);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Context Banner Card */}
      <button
        onClick={() => setOpen(!open)}
        className={`w-full flex items-center justify-between gap-4 px-4 py-3 rounded-xl border transition-all duration-200 group ${
          open
            ? 'bg-[#006699]/[0.04] border-[#006699]/30 shadow-md'
            : 'bg-white border-slate-200/80 hover:border-[#006699]/25 hover:shadow-sm'
        }`}
      >
        <div className="flex items-center gap-3.5">
          {/* State Shield */}
          <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-sm font-extrabold tracking-tight transition-all duration-200 ${
            open ? 'bg-[#006699] text-white shadow-md' : 'bg-[#006699]/10 text-[#006699] group-hover:bg-[#006699] group-hover:text-white'
          }`}>
            {current?.sigla}
          </div>

          {/* Network Info */}
          <div className="text-left">
            <div className="flex items-center gap-2">
              <span className="text-sm font-extrabold text-slate-900 tracking-tight">
                Rede Estadual — {current?.nome}
              </span>
              <ChevronDown className={`w-4 h-4 text-[#006699]/60 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
            </div>
            <div className="flex items-center gap-3 mt-0.5">
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Building className="w-3 h-3" />
                {current?.totalEscolas} escolas
              </span>
              <span className="w-px h-3 bg-slate-200" />
              <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                <Users className="w-3 h-3" />
                {current?.totalAlunos.toLocaleString('pt-BR')} alunos
              </span>
            </div>
          </div>
        </div>

        {/* Right side hint */}
        <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-1 rounded-md transition-all ${
          open ? 'bg-[#006699]/10 text-[#006699]' : 'bg-slate-100 text-slate-400 group-hover:bg-[#006699]/10 group-hover:text-[#006699]'
        }`}>
          Alterar rede
        </span>
      </button>

      {/* Popover Dropdown */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-slide-up">
          <div className="px-4 pt-3.5 pb-2">
            <p className="text-[9px] uppercase tracking-wider font-extrabold text-slate-400">Selecionar Rede Estadual</p>
          </div>
          <div className="px-1.5 pb-1.5">
            {estados.map((est) => {
              const isActive = est.sigla === selectedState;
              const coverage = Math.round((est.totalEscolas / 500) * 100);
              return (
                <button
                  key={est.sigla}
                  onClick={() => { onSelect(est.sigla); setOpen(false); }}
                  className={`w-full px-3 py-3 flex items-center justify-between text-left transition-all rounded-lg mx-0 ${
                    isActive ? 'bg-[#006699]/[0.06]' : 'hover:bg-slate-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className={`w-9 h-9 rounded-lg flex items-center justify-center text-[11px] font-extrabold transition-all ${
                      isActive ? 'bg-[#006699] text-white shadow-sm' : 'bg-slate-100 text-slate-500'
                    }`}>
                      {est.sigla}
                    </span>
                    <div>
                      <p className={`text-xs font-bold ${isActive ? 'text-[#006699]' : 'text-slate-700'}`}>{est.nome}</p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <p className="text-[10px] text-slate-400 font-medium">{est.totalEscolas} escolas · {est.totalAlunos.toLocaleString('pt-BR')} alunos</p>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Mini coverage bar */}
                    <div className="w-12 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all ${isActive ? 'bg-[#006699]' : 'bg-slate-300'}`} style={{ width: `${coverage}%` }} />
                    </div>
                    {isActive && <Check className="w-4 h-4 text-[#006699] shrink-0" />}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── CHIP COMPONENTS ───────────────────────────────────────────────────────────

function SelectChip({ label, value, onChange, options, icon: Icon, widthClass = "w-auto" }) {
  return (
    <div className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-bold cursor-pointer group shadow-sm bg-white border-slate-200 hover:border-slate-300 ${widthClass}`}>
      {Icon && <Icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#006699] transition-colors shrink-0" />}
      <span className="text-slate-400 font-semibold whitespace-nowrap">{label}:</span>
      <span className="text-slate-600 truncate">{value}</span>
      <ChevronDown className="w-3 h-3 text-slate-400 ml-1 shrink-0 group-hover:text-slate-600" />
      <select 
        value={value} 
        onChange={onChange}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
      >
        {options.map(opt => (
          <option key={opt.value || opt} value={opt.value || opt}>
            {opt.label || opt}
          </option>
        ))}
      </select>
    </div>
  );
}

function ButtonChip({ label, value, icon: Icon, onClick, active, widthClass = "w-auto" }) {
  return (
    <button 
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border transition-all text-xs font-bold shadow-sm focus:outline-none ${widthClass} ${
        active ? 'border-[#006699]/30 bg-[#006699]/[0.04] text-[#006699]' : 'border-slate-200 hover:border-slate-300 bg-white text-slate-600 hover:text-slate-800'
      }`}
    >
      {Icon && <Icon className={`w-3.5 h-3.5 shrink-0 ${active ? 'text-[#006699]' : 'text-slate-400'}`} />}
      <span className={`font-semibold whitespace-nowrap ${active ? 'text-[#006699]/70' : 'text-slate-400'}`}>{label}:</span>
      <span className="truncate">{value}</span>
      <ChevronDown className={`w-3 h-3 ml-1 shrink-0 transition-transform ${active ? 'rotate-180 text-[#006699]' : 'text-slate-400'}`} />
    </button>
  );
}

function YearSelector({ anos, selectedYear, onChange }) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide shrink-0 w-full md:w-auto relative touch-pan-x">
      {anos.map(y => (
        <button
          key={y}
          onClick={() => onChange(y)}
          className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all whitespace-nowrap shrink-0 border select-none ${
            y === selectedYear
              ? 'bg-[#006699] text-white border-[#006699] shadow-sm'
              : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
          }`}
        >
          {y}
        </button>
      ))}
    </div>
  );
}

// ─── EVALUATIONS POPOVER ─────────────────────────────────────────────────────

function EvaluationsPopover({ evalsList, selectedEvals, toggleEval, selectAll, escalaFiltro, setEscalaFiltro }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const activeCount = evalsList.filter(e => selectedEvals[e.id]).length;

  return (
    <div className="relative w-full" ref={ref}>
      {/* Trigger Box matching Mockup */}
      <div 
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between border border-slate-300 rounded-lg px-3.5 py-2 bg-white shadow-2xs hover:border-slate-400 cursor-pointer transition-all min-h-[40px]"
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <Bookmark className="w-4 h-4 text-slate-500 shrink-0" />
          <span className="text-xs font-bold text-slate-700 truncate">
            ({activeCount}) Avaliações Selecionadas
          </span>
        </div>
        <div className="flex items-center gap-1.5 shrink-0 ml-2">
          <button 
            type="button"
            onClick={(e) => { e.stopPropagation(); selectAll(false); }}
            title="Limpar seleção"
            className="p-0.5 hover:bg-slate-100 rounded text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
          <ChevronDown className={`w-4 h-4 text-slate-600 transition-transform ${open ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Popover */}
      {open && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl border border-slate-200 shadow-2xl z-50 overflow-hidden animate-slide-up w-full min-w-[320px] max-w-[520px]">
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-slate-50/80">
            <div className="flex bg-slate-200/50 p-0.5 rounded-lg border border-slate-200/60">
              {[
                { key: 'todas', label: 'Todas' },
                { key: 'larga', label: 'Larga' },
                { key: 'pequena', label: 'Pequena' }
              ].map(opt => (
                <button key={opt.key} onClick={(e) => { e.stopPropagation(); setEscalaFiltro(opt.key); }}
                  className={`px-2.5 py-1 text-[9px] font-bold rounded-md transition-all ${
                    escalaFiltro === opt.key 
                      ? 'bg-white text-slate-800 shadow-sm' 
                      : 'text-slate-500 hover:text-slate-700'
                  }`}>
                  {opt.label}
                </button>
              ))}
            </div>
            <button 
              onClick={(e) => { e.stopPropagation(); selectAll(); }} 
              className={`text-[9px] font-bold px-2.5 py-1.5 rounded-md transition-all ${
                activeCount === evalsList.length && evalsList.length > 0
                  ? 'text-slate-600 hover:text-red-600 bg-slate-200/50 hover:bg-red-50'
                  : 'text-[#006699] hover:text-[#004d73] bg-[#006699]/[0.08] hover:bg-[#006699]/[0.15]'
              }`}
            >
              {activeCount === evalsList.length && evalsList.length > 0 ? 'Remover Todas' : 'Selecionar Todas'}
            </button>
          </div>

          {/* List */}
          <div className="max-h-[360px] overflow-y-auto p-2 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
            {evalsList.map((ev) => {
              const isActive = selectedEvals[ev.id];
              return (
                <button
                  key={ev.id}
                  onClick={(e) => { e.stopPropagation(); toggleEval(ev.id); }}
                  className={`w-full flex items-start gap-3 p-3 rounded-xl text-left transition-all mb-1 last:mb-0 group ${
                    isActive ? 'bg-[#006699]/[0.04] border border-[#006699]/30 shadow-sm' : 'bg-transparent border border-transparent hover:bg-slate-50 hover:border-slate-200/80'
                  }`}
                >
                  <div className="pt-0.5">
                    {isActive 
                      ? <CheckSquare className="w-4 h-4 text-[#006699]" />
                      : <Square className="w-4 h-4 text-slate-300 group-hover:text-slate-400 transition-colors" />
                    }
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-[11px] font-extrabold ${isActive ? 'text-[#006699]' : 'text-slate-500'}`}>
                        {ev.id}
                      </span>
                      <span className="text-[9px] font-bold text-slate-400">• {ev.month}</span>
                      <span className={`text-[7px] font-extrabold px-1.5 py-0.5 rounded-sm ${
                        isActive ? 'bg-[#006699] text-white' : 'bg-slate-100 text-slate-400'
                      }`}>
                        {ev.scale === 'larga' ? 'LE' : 'PE'}
                      </span>
                    </div>
                    <p className={`text-[10px] leading-relaxed font-semibold pr-2 ${
                      isActive ? 'text-slate-800' : 'text-slate-500 group-hover:text-slate-600'
                    }`}>
                      {ev.titulo}
                    </p>
                  </div>
                </button>
              );
            })}
            {evalsList.length === 0 && (
              <div className="p-4 text-center text-xs text-slate-400 font-medium">Nenhuma avaliação encontrada para este filtro.</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────

const AcompanhamentoEscolar = ({ colors, navigateTo, isDarkMode }) => {
  // Default to first available state — no gate screen
  const [selectedState, setSelectedState] = useState('PI'); 
  const [anoLetivo, setAnoLetivo] = useState(2026);
  const [anoEscolar, setAnoEscolar] = useState('9º ano EF');
  const [componente, setComponente] = useState('Matemática');
  const [metrica, setMetrica] = useState('TCT'); 
  const [visualizarPor, setVisualizarPor] = useState('Escola'); 
  const [escalaFiltro, setEscalaFiltro] = useState('todas');
  
  const [selectedEvals, setSelectedEvals] = useState({
    'D1': true, 'D2': true, 'F1': true, 'D3': true, 'D4': true, 'F3': true, 'F2': true
  });
  
  const [bottomTab, setBottomTab] = useState('Destaques');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('score');
  const [sortAsc, setSortAsc] = useState(false);

  const [expandedDominios, setExpandedDominios] = useState({});
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = useCallback((message) => {
    setToastMessage(message);
  }, []);

  const dismissToast = useCallback(() => setToastMessage(null), []);

  // ─── DERIVED STATE ─────────────────────────────────────────────────────────

  const displayedEvalsList = useMemo(() => {
    if (escalaFiltro === 'todas') return CHRONOLOGICAL_EVALS;
    return CHRONOLOGICAL_EVALS.filter(ev => ev.scale === escalaFiltro);
  }, [escalaFiltro]);

  const activeEvalsCount = useMemo(() => {
    return displayedEvalsList.filter(ev => selectedEvals[ev.id]).length;
  }, [displayedEvalsList, selectedEvals]);

  const handleToggleEval = (id) => {
    const nextState = { ...selectedEvals, [id]: !selectedEvals[id] };
    const anyActiveDisplayed = displayedEvalsList.some(ev => nextState[ev.id]);
    if (!anyActiveDisplayed) {
      showToast("Selecione ao menos 1 avaliação.");
      return;
    }
    setSelectedEvals(nextState);
  };

  const handleSelectAllEvals = () => {
    const nextState = { ...selectedEvals };
    const allSelected = displayedEvalsList.every(ev => nextState[ev.id]);
    
    if (allSelected) {
      displayedEvalsList.forEach(ev => { nextState[ev.id] = false; });
    } else {
      displayedEvalsList.forEach(ev => { nextState[ev.id] = true; });
    }
    setSelectedEvals(nextState);
  };

  const handleToggleDominio = (id) => {
    setExpandedDominios(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const stateMeta = useMemo(() => {
    return ESTADOS_DISPONIVEIS.find(e => e.sigla === selectedState) || ESTADOS_DISPONIVEIS[0];
  }, [selectedState]);

  const calculatedModifiers = useMemo(() => {
    let multiplier = 1.0;
    if (selectedState === 'CE') multiplier += 0.08; 
    if (selectedState === 'PE') multiplier += 0.04;
    if (anoLetivo === 2026) multiplier += 0.02;
    if (anoLetivo === 2024) multiplier -= 0.03;
    if (anoLetivo === 2022) multiplier -= 0.06;
    if (anoEscolar.includes('5º')) multiplier += 0.05;
    if (anoEscolar.includes('3ª')) multiplier -= 0.04;
    if (componente === 'Português') multiplier += 0.03;
    if (escalaFiltro === 'larga') multiplier += 0.03;
    if (escalaFiltro === 'pequena') multiplier -= 0.02;
    const selectedKeys = displayedEvalsList.filter(ev => selectedEvals[ev.id]).map(ev => ev.id);
    let evalsSum = 0;
    selectedKeys.forEach(k => {
      if (k.startsWith('F')) evalsSum += 0.015;
      if (k.startsWith('D')) evalsSum -= 0.005;
    });
    return multiplier + evalsSum;
  }, [selectedState, anoLetivo, anoEscolar, componente, selectedEvals, escalaFiltro, displayedEvalsList]);

  const calculatedAcertosMedios = useMemo(() => Math.min(96, Math.max(25, Math.round(64 * calculatedModifiers))), [calculatedModifiers]);
  const calculatedProficienciaMedia = useMemo(() => Math.min(480, Math.max(120, Math.round(295 * calculatedModifiers))), [calculatedModifiers]);
  const calculatedParticipacao = useMemo(() => {
    const base = 75 + (activeEvalsCount - displayedEvalsList.length) * 2.2;
    return Math.min(99, Math.max(30, Math.round(base * (calculatedModifiers * 0.98))));
  }, [activeEvalsCount, displayedEvalsList, calculatedModifiers]);
  const calculatedEscolasAvaliadas = useMemo(() => Math.round(stateMeta.totalEscolas * (calculatedParticipacao / 100)), [stateMeta, calculatedParticipacao]);
  const calculatedProvasRealizadas = useMemo(() => {
    const divider = displayedEvalsList.length || 1;
    const baseRatio = (calculatedParticipacao / 100) * (activeEvalsCount / divider);
    return Math.round(stateMeta.totalAlunos * baseRatio);
  }, [stateMeta, calculatedParticipacao, activeEvalsCount, displayedEvalsList]);

  const processedSchools = useMemo(() => {
    const pool = ESCOLAS_POOL[selectedState] || [];
    return pool.map((sc, index) => {
      const tctScore = Math.min(100, Math.max(15, Math.round(sc.baseScore * calculatedModifiers)));
      const triScore = Math.min(500, Math.max(80, Math.round((sc.baseScore * 4.6) * calculatedModifiers)));
      const participation = Math.min(100, Math.max(20, Math.round(sc.partBase * (calculatedModifiers * 0.96))));
      let conceito = 'Parcial';
      if (metrica === 'TCT') {
        if (tctScore >= 70) conceito = 'Suficiente';
        else if (tctScore < 50) conceito = 'Insuficiente';
      } else {
        if (triScore >= 350) conceito = 'Suficiente';
        else if (triScore < 250) conceito = 'Insuficiente';
      }
      return { id: `school-${index}`, nome: sc.nome, municipio: sc.municipio, scoreTCT: tctScore, scoreTRI: triScore, score: metrica === 'TCT' ? tctScore : triScore, participacao: participation, conceito };
    });
  }, [selectedState, calculatedModifiers, metrica]);

  const processedMunicipios = useMemo(() => {
    const munsMap = {};
    processedSchools.forEach(sc => {
      if (!munsMap[sc.municipio]) munsMap[sc.municipio] = { nome: sc.municipio, totalScoreTCT: 0, totalScoreTRI: 0, totalPart: 0, count: 0 };
      munsMap[sc.municipio].totalScoreTCT += sc.scoreTCT;
      munsMap[sc.municipio].totalScoreTRI += sc.scoreTRI;
      munsMap[sc.municipio].totalPart += sc.participacao;
      munsMap[sc.municipio].count += 1;
    });
    return Object.keys(munsMap).map((mName, idx) => {
      const e = munsMap[mName];
      const avgTCT = Math.round(e.totalScoreTCT / e.count), avgTRI = Math.round(e.totalScoreTRI / e.count), avgPart = Math.round(e.totalPart / e.count);
      let conceito = 'Parcial';
      if (metrica === 'TCT') { if (avgTCT >= 70) conceito = 'Suficiente'; else if (avgTCT < 50) conceito = 'Insuficiente'; }
      else { if (avgTRI >= 350) conceito = 'Suficiente'; else if (avgTRI < 250) conceito = 'Insuficiente'; }
      return { id: `mun-${idx}`, nome: e.nome, municipio: null, scoreTCT: avgTCT, scoreTRI: avgTRI, score: metrica === 'TCT' ? avgTCT : avgTRI, participacao: avgPart, conceito };
    });
  }, [processedSchools, metrica]);

  const activeRecords = useMemo(() => visualizarPor === 'Escola' ? processedSchools : processedMunicipios, [visualizarPor, processedSchools, processedMunicipios]);

  const conceptStats = useMemo(() => {
    const total = activeRecords.length || 1;
    const insuf = activeRecords.filter(i => i.conceito === 'Insuficiente').length;
    const suf = activeRecords.filter(i => i.conceito === 'Suficiente').length;
    const parc = activeRecords.filter(i => i.conceito === 'Parcial').length;
    return { insuficienteCount: insuf, insuficientePerc: Math.round((insuf / total) * 100), parcialCount: parc, parcialPerc: Math.round((parc / total) * 100), suficienteCount: suf, suficientePerc: Math.round((suf / total) * 100) };
  }, [activeRecords]);

  const topPerformers = useMemo(() => [...activeRecords].sort((a, b) => b.score - a.score).slice(0, 8), [activeRecords]);
  const bottomPerformers = useMemo(() => [...activeRecords].sort((a, b) => a.score - b.score).slice(0, 8), [activeRecords]);

  const filteredFullList = useMemo(() => {
    const searched = activeRecords.filter(item => {
      const n = (item.nome || '').toLowerCase().includes(searchTerm.toLowerCase());
      const m = (item.municipio || '').toLowerCase().includes(searchTerm.toLowerCase());
      return n || m;
    });
    return searched.sort((a, b) => {
      let valA = a[sortField], valB = b[sortField];
      if (typeof valA === 'string') return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
      return sortAsc ? valA - valB : valB - valA;
    });
  }, [activeRecords, searchTerm, sortField, sortAsc]);

  const processedMatriz = useMemo(() => {
    return (BASE_DOMINIOS_DATA[componente] || []).map(dom => {
      const adjustedDomTCT = Math.min(100, Math.max(15, Math.round(dom.baseScoreTCT * calculatedModifiers)));
      const adjustedDomTRI = Math.min(500, Math.max(100, Math.round(dom.baseScoreTRI * calculatedModifiers)));
      const habs = dom.habilidades.map(hab => {
        const ht = Math.min(100, Math.max(15, Math.round(hab.scoreTCT * calculatedModifiers)));
        const hr = Math.min(500, Math.max(100, Math.round(hab.scoreTRI * calculatedModifiers)));
        return { ...hab, scoreTCT: ht, scoreTRI: hr, score: metrica === 'TCT' ? ht : hr };
      });
      return { ...dom, scoreTCT: adjustedDomTCT, scoreTRI: adjustedDomTRI, score: metrica === 'TCT' ? adjustedDomTCT : adjustedDomTRI, habilidades: habs };
    });
  }, [componente, calculatedModifiers, metrica]);

  const handleExportPDF = () => {
    showToast("Gerando relatório PDF...");
    setTimeout(() => window.print(), 1200);
  };

  // ─── RENDER ────────────────────────────────────────────────────────────────

  return (
    <div className="flex-1 w-full max-w-[1440px] mx-auto px-4 md:px-8 py-6 pb-16 select-none" style={{ fontFamily: 'Montserrat, sans-serif' }}>
      
      {/* Inline toast */}
      {toastMessage && <InlineToast message={toastMessage} onDismiss={dismissToast} />}

      {/* ─── HEADER: Title & Network Banner ──── */}
      <div className="flex flex-col gap-4 mb-4">
        {/* Breadcrumbs & Title */}
        <div>
          <p className="text-xs text-slate-400 font-medium mb-1">
            <span className="text-[#0284C7] hover:underline cursor-pointer">Tela Inicial</span> / Acompanhamento Escolar
          </p>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">
            Acompanhamento Escolar
          </h1>
        </div>

        {/* Network Context Box matching user mockup */}
        <div className="bg-slate-50/80 rounded-xl border border-slate-200/80 p-3.5 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[#70C0E8] text-white font-extrabold text-xs flex items-center justify-center shadow-2xs">
              {selectedState || 'PI'}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-bold text-slate-800">
                  Rede Estadual do {ESTADOS_DISPONIVEIS.find(e => e.sigla === selectedState)?.nome || 'Piauí'}
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium">
                {ESTADOS_DISPONIVEIS.find(e => e.sigla === selectedState)?.totalEscolas || 136} Escolas · {(ESTADOS_DISPONIVEIS.find(e => e.sigla === selectedState)?.totalAlunos || 79174).toLocaleString('pt-BR')} Estudantes
              </p>
            </div>
          </div>

          <NetworkContextBanner 
            selectedState={selectedState} 
            onSelect={(s) => { setSelectedState(s); showToast(`Rede alterada: ${ESTADOS_DISPONIVEIS.find(e => e.sigla === s)?.nome}`); }}
            estados={ESTADOS_DISPONIVEIS}
          />
        </div>

        {/* Sub-header Tabs & PDF Export */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200 pb-2 gap-3 mt-1">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMetrica('TCT')}
              className={`text-xs font-bold pb-2.5 -mb-2.5 transition-all ${
                metrica === 'TCT'
                  ? 'text-[#0284C7] border-b-2 border-[#0284C7]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Teoria Clássica dos Testes (TCT)
            </button>
            <button
              onClick={() => setMetrica('TRI')}
              className={`text-xs font-bold pb-2.5 -mb-2.5 transition-all ${
                metrica === 'TRI'
                  ? 'text-[#0284C7] border-b-2 border-[#0284C7]'
                  : 'text-slate-500 hover:text-slate-700'
              }`}
            >
              Teoria de Resposta ao Item (TRI)
            </button>
          </div>

          <button
            onClick={handleExportPDF}
            className="text-xs font-bold text-slate-600 hover:text-slate-900 flex items-center gap-1.5 transition-colors self-end sm:self-auto"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Exportar para PDF
          </button>
        </div>
      </div>

      {/* ─── FILTERS SECTION (Matching Mockup) ─── */}
      <section className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs mb-6">
        
        {/* ROW 1: Anos | Componentes | Etapa */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end mb-5">
          
          {/* Acompanhamento por ano */}
          <div className="lg:col-span-5">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Acompanhamento por ano
            </label>
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
              <button
                onClick={() => setAnoLetivo(null)}
                className={`text-xs font-bold px-2.5 py-1 rounded-md transition-all whitespace-nowrap ${
                  anoLetivo === null
                    ? 'bg-[#70C0E8] text-white shadow-2xs'
                    : 'text-[#0284C7] hover:bg-sky-50'
                }`}
              >
                Todos
              </button>
              {[2023, 2024, 2025, 2026, 2027, 2028].map(y => (
                <button
                  key={y}
                  onClick={() => setAnoLetivo(y)}
                  className={`text-xs font-bold px-3 py-1 rounded-md transition-all whitespace-nowrap ${
                    anoLetivo === y
                      ? 'bg-[#70C0E8] text-white shadow-2xs'
                      : 'text-[#0284C7] hover:bg-sky-50'
                  }`}
                >
                  {y}
                </button>
              ))}
            </div>
          </div>

          {/* Componentes Curriculares */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Componentes Curriculares
            </label>
            <div className="relative flex items-center justify-between border border-slate-300 rounded-lg px-3.5 py-2 bg-white shadow-2xs hover:border-slate-400">
              <BookOpen className="w-4 h-4 text-slate-500 mr-2.5 shrink-0 pointer-events-none" />
              <select
                value={componente}
                onChange={(e) => setComponente(e.target.value)}
                className="w-full text-xs font-bold text-slate-700 bg-transparent cursor-pointer outline-none appearance-none pr-8"
              >
                <option value="Língua Portuguesa">Língua Portuguesa</option>
                <option value="Matemática">Matemática</option>
              </select>
              <div className="flex items-center gap-1 absolute right-3 pointer-events-none text-slate-400">
                <X className="w-3.5 h-3.5 pointer-events-auto cursor-pointer hover:text-slate-600" onClick={(e) => { e.stopPropagation(); setComponente('Língua Portuguesa'); }} />
                <ChevronDown className="w-4 h-4 text-slate-600 ml-0.5" />
              </div>
            </div>
          </div>

          {/* Etapa do Ensino */}
          <div className="lg:col-span-3">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Etapa do Ensino
            </label>
            <div className="relative flex items-center justify-between border border-slate-300 rounded-lg px-3.5 py-2 bg-white shadow-2xs hover:border-slate-400">
              <Users className="w-4 h-4 text-slate-500 mr-2.5 shrink-0 pointer-events-none" />
              <select
                value={anoEscolar}
                onChange={(e) => setAnoEscolar(e.target.value)}
                className="w-full text-xs font-bold text-slate-700 bg-transparent cursor-pointer outline-none appearance-none pr-8"
              >
                {ANOS_ESCOLARES.map(g => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
              <div className="flex items-center gap-1 absolute right-3 pointer-events-none text-slate-400">
                <X className="w-3.5 h-3.5 pointer-events-auto cursor-pointer hover:text-slate-600" onClick={(e) => { e.stopPropagation(); setAnoEscolar('9º ano EF'); }} />
                <ChevronDown className="w-4 h-4 text-slate-600 ml-0.5" />
              </div>
            </div>
          </div>

        </div>

        {/* ROW 2: Avaliações | Agrupar por */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-end">
          
          {/* Avaliações */}
          <div className="lg:col-span-8">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Avaliações
            </label>
            <EvaluationsPopover 
              evalsList={displayedEvalsList}
              selectedEvals={selectedEvals}
              toggleEval={handleToggleEval}
              selectAll={handleSelectAllEvals}
              escalaFiltro={escalaFiltro}
              setEscalaFiltro={setEscalaFiltro}
            />
          </div>

          {/* Agrupar por */}
          <div className="lg:col-span-4">
            <label className="block text-xs font-bold text-slate-800 mb-2">
              Agrupar por
            </label>
            <div className="flex items-center gap-3 py-1">
              <button
                onClick={() => setVisualizarPor('Escola')}
                className={`text-xs font-bold px-4 py-2 rounded-lg transition-all ${
                  visualizarPor === 'Escola'
                    ? 'bg-[#70C0E8] text-white shadow-2xs'
                    : 'text-[#0284C7] hover:underline'
                }`}
              >
                Escola
              </button>
              <button
                onClick={() => setVisualizarPor('Município')}
                className={`text-xs font-bold px-2 py-2 transition-all ${
                  visualizarPor === 'Município'
                    ? 'bg-[#70C0E8] text-white rounded-lg px-4 shadow-2xs'
                    : 'text-[#0284C7] hover:underline'
                }`}
              >
                Gerência Regional de Educação
              </button>
            </div>
          </div>

        </div>

      </section>

      {/* ─── KPI CARDS ───────────────────────────────────────────────────── */}
      <section className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-5">
        
        {/* KPI 1: Score */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-sky-500/5 rounded-full translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-500" />
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">
            {metrica === 'TCT' ? 'Acertos Médios' : 'Proficiência Média'}
          </p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-extrabold text-slate-900 transition-all duration-300">
              {metrica === 'TCT' ? `${calculatedAcertosMedios}%` : calculatedProficienciaMedia}
            </span>
            <span className="text-[9px] text-slate-400 font-bold uppercase">{metrica}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{componente} · {anoEscolar}</p>
        </div>

        {/* KPI 2: Participação */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-amber-500/5 rounded-full translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-500" />
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Participação</p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className={`text-2xl font-extrabold transition-all duration-300 ${calculatedParticipacao < 75 ? 'text-amber-600' : 'text-slate-900'}`}>
              {calculatedParticipacao}%
            </span>
          </div>
          {calculatedParticipacao < 75 && (
            <p className="text-[9px] text-amber-600 font-semibold mt-1.5 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Abaixo do limiar
            </p>
          )}
          {calculatedParticipacao >= 75 && (
            <p className="text-[10px] text-slate-400 mt-1.5 font-medium">Dentro do esperado</p>
          )}
        </div>

        {/* KPI 3: Escolas */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-emerald-500/5 rounded-full translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-500" />
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Escolas Avaliadas</p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-2xl font-extrabold text-slate-900 transition-all duration-300">{calculatedEscolasAvaliadas}</span>
            <span className="text-[10px] text-slate-400 font-semibold">de {stateMeta.totalEscolas}</span>
          </div>
          <div className="w-full bg-slate-100 h-1 rounded-full mt-2.5 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full transition-all duration-500" style={{ width: `${(calculatedEscolasAvaliadas / stateMeta.totalEscolas) * 100}%` }} />
          </div>
        </div>

        {/* KPI 4: Provas */}
        <div className="bg-white rounded-xl border border-slate-200/80 p-4 hover:shadow-md transition-shadow relative overflow-hidden group">
          <div className="absolute right-0 top-0 w-20 h-20 bg-sky-500/5 rounded-full translate-x-6 -translate-y-6 group-hover:scale-110 transition-transform duration-500" />
          <p className="text-[9px] font-extrabold text-slate-400 uppercase tracking-wider">Provas Realizadas</p>
          <div className="flex items-baseline gap-1.5 mt-1.5">
            <span className="text-xl font-extrabold text-slate-900 transition-all duration-300">{calculatedProvasRealizadas.toLocaleString('pt-BR')}</span>
            <span className="text-[10px] text-slate-400 font-semibold">de {stateMeta.totalAlunos.toLocaleString('pt-BR')}</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-1.5 font-medium">{(calculatedProvasRealizadas / stateMeta.totalAlunos * 100).toFixed(0)}% da base</p>
        </div>
      </section>

      {/* ─── CHART: Aplicações no Ano ─────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Aplicações no ano</h3>
            <p className="text-[10px] text-slate-400 font-medium">{activeEvalsCount} de {displayedEvalsList.length} avaliações ativas</p>
          </div>
          {escalaFiltro !== 'todas' && (
            <span className="bg-slate-100 text-slate-500 font-bold text-[9px] px-2 py-0.5 rounded uppercase tracking-wider">
              {escalaFiltro === 'larga' ? 'Larga Escala' : 'Pequena Escala'}
            </span>
          )}
        </div>

        <div className="relative w-full py-2">
          <div className="h-[220px] w-full flex items-end justify-between relative mt-6 px-4 border-b border-slate-200 border-l border-slate-100">
            {/* Grid lines */}
            {(metrica === 'TCT' ? [0, 25, 50, 75, 100] : [0, 125, 250, 375, 500]).map((level) => (
              <div key={level} className="absolute left-0 right-0 border-t border-slate-100/70 pointer-events-none flex items-center"
                style={{ bottom: `${metrica === 'TCT' ? level : (level / 500) * 100}%` }}>
                <span className="text-[8px] font-bold text-slate-300 -ml-9 bg-white px-0.5 rounded">
                  {metrica === 'TCT' ? `${level}%` : level}
                </span>
              </div>
            ))}

            {/* Bars */}
            {displayedEvalsList.map((ev) => {
              const isActive = selectedEvals[ev.id];
              const rawScore = metrica === 'TCT' ? ev.baseTCT : ev.baseTRI;
              const computedScore = isActive ? Math.round(rawScore * calculatedModifiers) : 0;
              const computedPart = isActive ? Math.round(ev.basePart * (calculatedModifiers * 0.95)) : 0;
              const heightPct = metrica === 'TCT' ? computedScore : (computedScore / 500) * 100;

              let barColor = 'bg-slate-200';
              if (isActive) {
                if (metrica === 'TCT') {
                  barColor = computedScore >= 70 ? 'bg-emerald-500' : computedScore >= 50 ? 'bg-amber-500' : 'bg-rose-500';
                } else {
                  barColor = computedScore >= 350 ? 'bg-emerald-500' : computedScore >= 250 ? 'bg-amber-500' : 'bg-rose-500';
                }
              }

              return (
                <div key={ev.id} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group relative px-0.5">
                  {/* Tooltip on hover */}
                  {isActive && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 absolute -top-11 bg-slate-900 text-white text-[9px] py-1 px-2 rounded shadow-lg pointer-events-none whitespace-nowrap z-20">
                      <p className="font-bold">{ev.label}</p>
                      <p>{metrica}: {computedScore}{metrica === 'TCT' ? '%' : ''} · Part: {computedPart}%</p>
                    </div>
                  )}

                  {isActive ? (
                    <span className="text-[9px] font-extrabold text-slate-600">{computedScore}{metrica === 'TCT' ? '%' : ''}</span>
                  ) : (
                    <span className="text-[8px] font-bold text-slate-300">—</span>
                  )}

                  <div className="w-full max-w-[44px] bg-slate-100 rounded-t-md flex items-end justify-center overflow-hidden h-[150px]">
                    <div className={`w-full transition-all duration-500 ease-out rounded-t-md ${barColor}`}
                      style={{ height: isActive ? `${heightPct}%` : '3px' }} />
                  </div>

                  <div className="text-center">
                    <p className={`text-[10px] font-bold ${isActive ? 'text-slate-700' : 'text-slate-300'}`}>{ev.id}</p>
                    <p className="text-[8px] text-slate-400 font-medium">{ev.month}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── DISTRIBUIÇÃO POR CONCEITO (Sutil & Compacto) ───────────────────── */}
      <div className="bg-slate-50/80 border border-slate-200/80 rounded-xl px-4 py-3 mb-5 flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-2xs">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-xs font-bold text-slate-800">Distribuição por Conceito</span>
          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">
            · {visualizarPor}s
          </span>
        </div>

        {/* Compact Bar + Inline Badges */}
        <div className="flex items-center gap-4 flex-1 max-w-xl">
          <div className="flex-1 bg-slate-200/80 h-2.5 rounded-full overflow-hidden flex shadow-inner">
            <div className="bg-emerald-500 h-full transition-all duration-300" style={{ width: `${conceptStats.suficientePerc}%` }} title={`Suficiente: ${conceptStats.suficienteCount} (${conceptStats.suficientePerc}%)`} />
            <div className="bg-amber-500 h-full transition-all duration-300" style={{ width: `${conceptStats.parcialPerc}%` }} title={`Parcial: ${conceptStats.parcialCount} (${conceptStats.parcialPerc}%)`} />
            <div className="bg-rose-500 h-full transition-all duration-300" style={{ width: `${conceptStats.insuficientePerc}%` }} title={`Insuficiente: ${conceptStats.insuficienteCount} (${conceptStats.insuficientePerc}%)`} />
          </div>

          <div className="flex items-center gap-3 text-xs font-bold shrink-0">
            <span className="flex items-center gap-1.5 text-emerald-800 text-[11px] bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
              Suficiente <span className="font-extrabold ml-0.5">{conceptStats.suficientePerc}%</span> <span className="text-emerald-600/80 font-medium text-[10px]">({conceptStats.suficienteCount})</span>
            </span>
            <span className="flex items-center gap-1.5 text-amber-800 text-[11px] bg-amber-50 border border-amber-200/60 px-2 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Parcial <span className="font-extrabold ml-0.5">{conceptStats.parcialPerc}%</span> <span className="text-amber-600/80 font-medium text-[10px]">({conceptStats.parcialCount})</span>
            </span>
            <span className="flex items-center gap-1.5 text-rose-800 text-[11px] bg-rose-50 border border-rose-200/60 px-2 py-0.5 rounded-md">
              <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
              Insuficiente <span className="font-extrabold ml-0.5">{conceptStats.insuficientePerc}%</span> <span className="text-rose-600/80 font-medium text-[10px]">({conceptStats.insuficienteCount})</span>
            </span>
          </div>
        </div>
      </div>

      {/* ─── MATRIZ DE DOMÍNIOS ────────────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm mb-5">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-800">Desempenho por Domínio — {componente}</h3>
            <p className="text-[10px] text-slate-400 font-medium">Expanda para ver habilidades</p>
          </div>
          <span className="bg-slate-100 text-slate-600 text-[9px] font-bold px-2 py-0.5 rounded uppercase">{metrica}</span>
        </div>

        <div className="space-y-2">
          {processedMatriz.map((dom) => {
            const isExpanded = expandedDominios[dom.id];
            return (
              <div key={dom.id} className="border border-slate-200/80 rounded-xl overflow-hidden bg-white transition-all">
                <button onClick={() => handleToggleDominio(dom.id)}
                  className="w-full p-3.5 flex items-center justify-between bg-slate-50/50 hover:bg-slate-100/50 transition-colors text-left">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold text-[10px]">
                      {dom.id.toUpperCase()}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800">{dom.nome}</h4>
                      <p className="text-[9px] text-slate-400 font-medium">{dom.habilidades.length} habilidades</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-sm font-extrabold text-slate-900">{dom.score}{metrica === 'TCT' ? '%' : ''}</span>
                    </div>
                    <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                  </div>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ease-out ${isExpanded ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}>
                  <div className="p-3.5 border-t border-slate-100 bg-white space-y-2">
                    {dom.habilidades.map((hab) => (
                      <div key={hab.cod} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                        <div className="flex items-start gap-2">
                          <span className="bg-sky-600 text-white text-[9px] font-extrabold px-1.5 py-0.5 rounded uppercase shrink-0 mt-0.5">{hab.cod}</span>
                          <p className="text-[11px] font-medium text-slate-600 leading-snug">{hab.desc}</p>
                        </div>
                        <div className="flex items-center gap-2.5 shrink-0 self-end sm:self-auto">
                          <div className="w-20 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div className={`h-full rounded-full transition-all duration-500 ${hab.score >= (metrica === 'TCT' ? 70 : 350) ? 'bg-emerald-500' : hab.score >= (metrica === 'TCT' ? 50 : 250) ? 'bg-amber-500' : 'bg-rose-500'}`}
                              style={{ width: metrica === 'TCT' ? `${hab.score}%` : `${(hab.score / 500) * 100}%` }} />
                          </div>
                          <span className="text-xs font-extrabold text-slate-800 w-9 text-right">{hab.score}{metrica === 'TCT' ? '%' : ''}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ─── DESTAQUES E LISTA COMPLETA ─────────────────────────────────────── */}
      <section className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg">
            {['Destaques', 'Lista Completa'].map(tab => (
              <button key={tab} onClick={() => setBottomTab(tab)}
                className={`px-3.5 py-1.5 rounded-md text-[11px] font-bold transition-all ${
                  bottomTab === tab ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'
                }`}>
                {tab === 'Lista Completa' ? `${tab} (${activeRecords.length})` : `Destaques da Rede`}
              </button>
            ))}
          </div>

          {bottomTab === 'Lista Completa' && (
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input type="text" placeholder={`Buscar ${visualizarPor.toLowerCase()}...`}
                value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 text-[11px] font-semibold text-slate-700 py-1.5 pl-8 pr-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-1 focus:ring-sky-500" />
            </div>
          )}
        </div>

        {bottomTab === 'Destaques' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* Top */}
            <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/60">
              <h4 className="text-[10px] font-extrabold text-emerald-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <Award className="w-3.5 h-3.5 text-emerald-600" /> Maiores Rendimentos
              </h4>
              <div className="space-y-2">
                {topPerformers.map((item, idx) => (
                  <div key={item.id} className="bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[9px] flex items-center justify-center">{idx + 1}</span>
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">{item.nome}</p>
                        {item.municipio && <p className="text-[9px] text-slate-400 font-medium">{item.municipio}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-extrabold text-emerald-700">{item.score}{metrica === 'TCT' ? '%' : ''}</span>
                      <p className="text-[8px] text-slate-400 font-semibold">{item.participacao}% part.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom */}
            <div className="bg-slate-50/70 rounded-xl p-4 border border-slate-200/60">
              <h4 className="text-[10px] font-extrabold text-rose-800 uppercase tracking-wider flex items-center gap-1.5 mb-3">
                <AlertCircle className="w-3.5 h-3.5 text-rose-600" /> Atenção / Intervenção
              </h4>
              <div className="space-y-2">
                {bottomPerformers.map((item, idx) => (
                  <div key={item.id} className="bg-white p-2.5 rounded-lg border border-slate-200/80 flex items-center justify-between hover:shadow-sm transition-shadow">
                    <div className="flex items-center gap-2.5">
                      <span className="w-5 h-5 rounded-full bg-rose-100 text-rose-800 font-extrabold text-[9px] flex items-center justify-center">{idx + 1}</span>
                      <div>
                        <p className="text-[11px] font-bold text-slate-800">{item.nome}</p>
                        {item.municipio && <p className="text-[9px] text-slate-400 font-medium">{item.municipio}</p>}
                      </div>
                    </div>
                    <div className="text-right">
                      <span className="text-[11px] font-extrabold text-rose-700">{item.score}{metrica === 'TCT' ? '%' : ''}</span>
                      <p className="text-[8px] text-slate-400 font-semibold">{item.participacao}% part.</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50 text-[9px] uppercase tracking-wider font-extrabold text-slate-500">
                  <th onClick={() => { if (sortField === 'nome') setSortAsc(!sortAsc); else { setSortField('nome'); setSortAsc(true); } }} className="py-2.5 px-3 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">{visualizarPor}<ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  {visualizarPor === 'Escola' && <th className="py-2.5 px-3">Município</th>}
                  <th onClick={() => { if (sortField === 'score') setSortAsc(!sortAsc); else { setSortField('score'); setSortAsc(false); } }} className="py-2.5 px-3 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">{metrica}<ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th onClick={() => { if (sortField === 'participacao') setSortAsc(!sortAsc); else { setSortField('participacao'); setSortAsc(false); } }} className="py-2.5 px-3 cursor-pointer hover:text-slate-800">
                    <div className="flex items-center gap-1">Part.<ArrowUpDown className="w-3 h-3" /></div>
                  </th>
                  <th className="py-2.5 px-3">Conceito</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-[11px] font-semibold text-slate-700">
                {filteredFullList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-2.5 px-3 font-bold text-slate-800">{item.nome}</td>
                    {visualizarPor === 'Escola' && <td className="py-2.5 px-3 text-slate-500">{item.municipio}</td>}
                    <td className="py-2.5 px-3 font-extrabold text-slate-900">{item.score}{metrica === 'TCT' ? '%' : ''}</td>
                    <td className="py-2.5 px-3">{item.participacao}%</td>
                    <td className="py-2.5 px-3">
                      <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${
                        item.conceito === 'Suficiente' ? 'bg-emerald-100 text-emerald-800' 
                        : item.conceito === 'Parcial' ? 'bg-amber-100 text-amber-800' 
                        : 'bg-rose-100 text-rose-800'
                      }`}>{item.conceito}</span>
                    </td>
                  </tr>
                ))}
                {filteredFullList.length === 0 && (
                  <tr><td colSpan={5} className="py-6 text-center text-slate-400 font-medium text-xs">Nenhum resultado para "{searchTerm}".</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default AcompanhamentoEscolar;