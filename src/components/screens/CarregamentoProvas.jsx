import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Search, FileText, ChevronLeft, ChevronRight, CheckCircle2,
  Loader2, RefreshCcw, AlertCircle, XCircle, Camera, Check,
  Bot, X, ArrowLeft, LogOut, Upload, LayoutList
} from 'lucide-react';
import Button from '../ui/Button';
import CascadeSelector from '../ui/CascadeSelector';
import Input from '../ui/Input';
import Chips from '../ui/Chips';
import Callout from '../ui/Callout';
import Textarea from '../ui/Textarea';

export default function CarregamentoProvas({ colors, navigateTo }) {
  // Theme Colors fallback
  const themeColors = colors || {
    primary: {
      ultraDark: '#002244',
      extraDark: '#003A79',
      dark: '#006199',
      base: '#008BC9',
      light: '#E6F6FC',
      extraLight: '#B3E6F5'
    },
    neutral: {
      0: '#ffffff',
      1: '#f8fafc',
      2: '#f1f5f9',
      3: '#e2e8f0',
      4: '#94a3b8',
      5: '#64748b',
      6: '#334155',
      7: '#0f172a'
    }
  };

  // State Machine Steps for Mobile: 'home' | 'class' | 'students' | 'scan' | 'validation'
  const [step, setStep] = useState('home');

  // Responsive mode flags
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [isSimulatedMobile, setIsSimulatedMobile] = useState(false);

  // Hook for window resize to detect true mobile
  useEffect(() => {
    const checkMobile = () => setIsMobileDevice(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop uploads list & uploading simulator state
  const [desktopUploads, setDesktopUploads] = useState([
    { id: 101, name: 'lote_final_matematica_9A.pdf', size: '14.2 MB', date: 'Hoje, 10:24', totalSheets: 25, successSheets: 25, status: 'Concluído' },
    { id: 102, name: 'lote_redacao_1EM_A.pdf', size: '28.1 MB', date: 'Ontem, 16:45', totalSheets: 32, successSheets: 30, status: 'Erro', errorDetails: '2 páginas ilegíveis (Carlos Eduardo Ferreira, Larissa Beatriz Lima).' },
    { id: 103, name: 'lote_ciencias_9B_recuperacao.pdf', size: '8.4 MB', date: '18 Dez, 2025', totalSheets: 10, successSheets: 10, status: 'Concluído' }
  ]);
  const [isDesktopUploading, setIsDesktopUploading] = useState(false);
  const [activeErrorBatch, setActiveErrorBatch] = useState(null);

  // Class Selection Selections
  const [classSelections, setClassSelections] = useState([]);

  // Students Directory
  const [students, setStudents] = useState([
    { id: 1, name: 'Ana Júlia da Silva', status: 'Pendente', file: null, date: '-', textMockup: 'O Brasil é marcado por uma grande diversidade cultural, visível nas festas populares.' },
    { id: 2, name: 'Carlos Eduardo Ferreira', status: 'Pendente', file: null, date: '-', textMockup: 'A culinária típica do país é extremamente rica, variando desde o acarajé ao churrasco.' },
    { id: 3, name: 'Maria Vitória de Sousa Mendes', status: 'Aguardando Validação', file: '124896.pdf', date: '18 Dez, 2025', textMockup: 'Leitura ilógica dolorosa sem mentalidade consequente amplamente de elite...' },
    { id: 4, name: 'Larissa Beatriz Lima', status: 'Pendente', file: null, date: '-', textMockup: 'Manifestações tradicionais brasileiras mostram a força da herança cultural.' },
    { id: 5, name: 'Lucas Gabriel Rodrigues', status: 'Pendente', file: null, date: '-', textMockup: 'O futebol é considerado uma paixão que une diferentes famílias brasileiras.' },
    { id: 6, name: 'Rafaela Cristina dos Santos', status: 'Concluído', file: '124897.pdf', date: '18 Dez, 2025', textMockup: 'A música brasileira expressa de forma singular o cotidiano das nossas comunidades.' },
    { id: 7, name: 'Pedro Henrique Almeida', status: 'Pendente', file: null, date: '-', textMockup: 'A capoeira mistura dança e artes marciais com enorme expressão regional.' },
    { id: 8, name: 'Emilly Yasmin Costa', status: 'Aguardando Validação', file: '124898.pdf', date: '18 Dez, 2025', textMockup: 'O Carnaval é uma das principais marcas da festividade e do turismo no país.' },
    { id: 9, name: 'Mateus Vinicius da Rocha', status: 'Em Processamento', file: '124899.pdf', date: '18 Dez, 2025', textMockup: 'Diferentes lendas e contos populares enriquecem a literatura do folclore.' },
    { id: 10, name: 'Isabelle Mirella Pinto', status: 'Pendente', file: null, date: '-', textMockup: 'Artesanato local reflete a identidade criativa de cada estado visitado.' },
  ]);

  const [studentSearchQuery, setStudentSearchQuery] = useState('');
  const [studentFilter, setStudentFilter] = useState('Todos');

  // Scanning State
  const [activeStudent, setActiveStudent] = useState(null);
  const [isScanLoading, setIsScanLoading] = useState(false);
  const [scanLoadingText, setScanLoadingText] = useState('');

  // Validation State
  const [validationText, setValidationText] = useState('');

  // Notification Toast
  const [toast, setToast] = useState(null);

  // Auto-dismiss Toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  // Cascade selector mock database
  const cascadeDb = (levelIndex, currentSelections) => {
    switch (levelIndex) {
      case 0: // Regional
        return [
          "SEFOR 1 - Fortaleza",
          "CREDE 01 - Maracanaú",
          "CREDE 02 - Itapipoca",
          "CREDE 03 - Acaraú"
        ];
      case 1: // Município
        const reg = currentSelections[0];
        if (!reg) return [];
        if (reg.includes("Fortaleza")) return ["Fortaleza"];
        if (reg.includes("Maracanaú")) return ["Maracanaú", "Maranguape", "Pacatuba"];
        if (reg.includes("Itapipoca")) return ["Itapipoca", "Amontada", "Trairi"];
        return ["Município A", "Município B"];
      case 2: // Escola
        const mun = currentSelections[1];
        if (!mun) return [];
        if (mun === "Fortaleza") {
          return [
            "EEM Liceu do Conjunto Ceará",
            "EEFM Adauto Bezerra",
            "EEM Justiniano de Serpa"
          ];
        }
        if (mun === "Maracanaú") {
          return ["EEFM Tenente Mário Lima", "EEM Ubaldina Guerreiro"];
        }
        return [`Escola Estadual de ${mun}`, `Colégio Municipal de ${mun}`];
      case 3: // Turma
        const esc = currentSelections[2];
        if (!esc) return [];
        return [
          "Turma 9º Ano A",
          "Turma 9º Ano B",
          "Turma 1º Ano Ensino Médio A",
          "Turma 2º Ano Ensino Médio B"
        ];
      default:
        return [];
    }
  };

  // Actions
  const handleStartScan = (student) => {
    setActiveStudent(student);
    setStep('scan');
  };

  const handleCaptureImage = () => {
    setIsScanLoading(true);
    setScanLoadingText('Enviando imagem...');
    
    setTimeout(() => {
      setScanLoadingText('Processando HTR...');
      
      setTimeout(() => {
        setIsScanLoading(false);
        setValidationText(activeStudent.textMockup);
        setStep('validation');
      }, 1500);
    }, 1000);
  };

  const handleStartValidation = (student) => {
    setActiveStudent(student);
    setValidationText(student.textMockup || '');
    setStep('validation');
  };

  const handleConfirmTranscription = () => {
    // Update student status
    setStudents(prev => prev.map(s => 
      s.id === activeStudent.id 
        ? { ...s, status: 'Concluído', file: `${124800 + s.id}.pdf`, date: 'Hoje', textMockup: validationText }
        : s
    ));
    setToast(`Prova de ${activeStudent.name.split(" ")[0]} confirmada!`);
    setStep('students');
  };

  const handleInvalidateTranscription = () => {
    setStudents(prev => prev.map(s => 
      s.id === activeStudent.id 
        ? { ...s, status: 'Pendente', file: null, date: '-' }
        : s
    ));
    setToast(`Prova de ${activeStudent.name.split(" ")[0]} invalidada.`);
    setStep('students');
  };

  // Rendering Helpers
  const renderMobileHeader = (title, onBack = null) => {
    return (
      <div className="h-[56px] border-b flex items-center justify-between px-[16px] shrink-0 bg-white/95 backdrop-blur z-30" style={{ borderColor: themeColors.neutral[2] }}>
        <div className="flex items-center gap-[8px]">
          {onBack ? (
            <Button
              variant="tertiary"
              appearance="ghost"
              iconOnly={true}
              size="sm"
              onClick={onBack}
            >
              <ChevronLeft size={20} />
            </Button>
          ) : (
            <div className="w-[32px] h-[32px] rounded-full bg-[#E6F6FC] flex items-center justify-center text-[#008BC9] font-bold text-[14px]">
              M
            </div>
          )}
          <span className="text-[16px] font-bold text-neutral-800 tracking-tight" style={{ color: themeColors.neutral[7] }}>
            {title}
          </span>
        </div>
        <div className="flex items-center gap-[8px]">
          <div className="w-[32px] h-[32px] rounded-full bg-neutral-200 border border-neutral-300 flex items-center justify-center text-[12px] font-bold text-neutral-6 shadow-sm">
            JD
          </div>
        </div>
      </div>
    );
  };

  const handleSimulateDesktopUpload = () => {
    if (isDesktopUploading) return;
    setIsDesktopUploading(true);

    const newId = Date.now();
    const newFile = {
      id: newId,
      name: 'lote_diagnostico_portugues_9A.pdf',
      size: '18.7 MB',
      date: 'Hoje, agora',
      totalSheets: 20,
      successSheets: 0,
      status: 'Processando'
    };

    setDesktopUploads(prev => [newFile, ...prev]);
    setToast(`Enviando lote de português...`);

    setTimeout(() => {
      setDesktopUploads(prev => prev.map(f =>
        f.id === newId
          ? { ...f, status: 'Concluído', successSheets: 20 }
          : f
      ));
      setIsDesktopUploading(false);
      setToast(`Processamento concluído: 20 provas importadas!`);
    }, 2500);
  };

  const renderMobileHome = () => {
    return (
      <div className="flex-1 flex flex-col justify-between p-[24px] bg-neutral-0 animate-fade-slide">
        <div className="flex-1 flex flex-col justify-start gap-[24px]">
          <div className="flex items-center gap-[12px] border-b pb-[16px]" style={{ borderColor: themeColors.neutral[2] }}>
            <div className="p-2 bg-[#E6F6FC] rounded-xl border border-[#B3E6F5]">
              <img src="assets/fgv_logo.png" alt="FGV Logo" className="h-[28px] object-contain" />
            </div>
            <div>
              <h1 className="text-[16px] font-black tracking-tight text-neutral-7 leading-tight" style={{ color: themeColors.neutral[7] }}>
                Carregamento Móvel
              </h1>
              <p className="text-[11px] font-bold text-neutral-4 uppercase tracking-wider">
                Mapear Scanner
              </p>
            </div>
          </div>

          <div className="p-[16px] rounded-2xl bg-neutral-1 border flex flex-col gap-[12px]" style={{ borderColor: themeColors.neutral[2] }}>
            <h2 className="text-[15px] font-bold text-neutral-7" style={{ color: themeColors.neutral[7] }}>
              Escaneamento por Aluno
            </h2>
            <p className="text-[12px] text-neutral-5 leading-relaxed">
              Ideal para quando você precisa digitalizar as provas individualmente na sala de aula ou para estudantes faltosos.
            </p>

            <div className="grid grid-cols-3 gap-[8px] mt-[4px]">
              <div className="bg-white p-3 rounded-lg border text-center" style={{ borderColor: themeColors.neutral[2] }}>
                <span className="text-[18px] font-bold text-brand-base" style={{ color: themeColors.primary.base }}>10</span>
                <span className="text-[9px] text-neutral-4 uppercase font-bold block mt-[2px]">Alunos</span>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center" style={{ borderColor: themeColors.neutral[2] }}>
                <span className="text-[18px] font-bold text-amber-500">2</span>
                <span className="text-[9px] text-neutral-4 uppercase font-bold block mt-[2px]">Validar</span>
              </div>
              <div className="bg-white p-3 rounded-lg border text-center" style={{ borderColor: themeColors.neutral[2] }}>
                <span className="text-[18px] font-bold text-green-600">2</span>
                <span className="text-[9px] text-neutral-4 uppercase font-bold block mt-[2px]">Concluído</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-[12px] mt-[8px]">
            <h3 className="text-[11px] font-bold uppercase tracking-wider text-neutral-4">Como funciona:</h3>
            <div className="flex flex-col gap-[10px]">
              <div className="flex gap-[12px] items-start">
                <div className="w-[20px] h-[20px] rounded-full bg-brand-light text-brand-base font-bold text-[11px] flex items-center justify-center shrink-0">1</div>
                <p className="text-[12px] text-neutral-6 leading-relaxed">Selecione a Regional, Município, Escola e a Turma ativa.</p>
              </div>
              <div className="flex gap-[12px] items-start">
                <div className="w-[20px] h-[20px] rounded-full bg-brand-light text-brand-base font-bold text-[11px] flex items-center justify-center shrink-0">2</div>
                <p className="text-[12px] text-neutral-6 leading-relaxed">Selecione o aluno e aponte a câmera para a folha de respostas.</p>
              </div>
              <div className="flex gap-[12px] items-start">
                <div className="w-[20px] h-[20px] rounded-full bg-brand-light text-brand-base font-bold text-[11px] flex items-center justify-center shrink-0">3</div>
                <p className="text-[12px] text-neutral-6 leading-relaxed">Confirme a transcrição automática gerada pela nossa IA Mapear.</p>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-[16px] border-t" style={{ borderColor: themeColors.neutral[2] }}>
          <Button
            variant="primary"
            size="lg"
            className="w-full font-bold"
            onClick={() => setStep('class')}
          >
            INICIAR ESCANEAMENTO
          </Button>
          <p className="text-[11px] text-neutral-4 text-center mt-[12px] font-medium">
            Desenvolvido por FGV Mapear © 2026
          </p>
        </div>
      </div>
    );
  };

  const renderClassSelection = () => {
    const isReady = classSelections[3] && classSelections[3].length > 0;

    return (
      <div className="flex-1 flex flex-col bg-neutral-0 animate-fade-slide">
        {renderMobileHeader("Carregamento", () => setStep('home'))}

        <div className="flex-1 overflow-y-auto p-[20px] flex flex-col gap-[20px]">
          <div>
            <h2 className="text-[18px] font-bold text-neutral-7" style={{ color: themeColors.neutral[7] }}>
              Selecionar Turma
            </h2>
            <p className="text-[13px] text-neutral-5 mt-[2px]">
              Selecione o nível de ensino e a turma para carregar as provas.
            </p>
          </div>

          <div className="relative mt-[8px]">
            <span className="text-[12px] font-bold text-neutral-5 block mb-[6px]">Contexto Escolar</span>
            <CascadeSelector
              colors={themeColors}
              levels={[
                { id: 'regional', title: 'Regional' },
                { id: 'municipio', title: 'Município' },
                { id: 'escola', title: 'Escola' },
                { id: 'turma', title: 'Turma' }
              ]}
              db={cascadeDb}
              onConfirm={(selections) => {
                setClassSelections(selections);
              }}
              initialSelections={classSelections}
            />
          </div>

          {classSelections.length > 0 && (
            <div className="mt-4 p-[14px] bg-[#E6F6FC]/25 rounded-[8px] border border-[#B3E6F5] flex flex-col gap-[6px]">
              <span className="text-[11px] font-bold text-[#008BC9] uppercase tracking-wider">Contexto Selecionado</span>
              <div className="text-[13px] text-neutral-7 space-y-[4px]">
                <p><strong>Regional:</strong> {classSelections[0]}</p>
                {classSelections[1] && <p><strong>Município:</strong> {classSelections[1]}</p>}
                {classSelections[2] && <p><strong>Escola:</strong> {classSelections[2]}</p>}
                {classSelections[3] && classSelections[3].length > 0 && (
                  <p><strong>Turma(s):</strong> {classSelections[3].join(", ")}</p>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-[20px] border-t bg-neutral-0" style={{ borderColor: themeColors.neutral[2] }}>
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            disabled={!isReady}
            onClick={() => setStep('students')}
          >
            PROSSEGUIR PARA ALUNOS
          </Button>
        </div>
      </div>
    );
  };

  const renderStudents = () => {
    const filteredStudents = students.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(studentSearchQuery.toLowerCase());
      if (studentFilter === 'Todos') return matchesSearch;
      if (studentFilter === 'Pendente') return matchesSearch && s.status === 'Pendente';
      if (studentFilter === 'Aguardando Validação') return matchesSearch && s.status === 'Aguardando Validação';
      if (studentFilter === 'Concluído') return matchesSearch && (s.status === 'Concluído' || s.status === 'Em Processamento');
      return matchesSearch;
    });

    const getStatusChip = (status) => {
      switch (status) {
        case 'Pendente':
          return <Chips label="Pendente" status="neutral" variant="light" />;
        case 'Aguardando Validação':
          return <Chips label="Validação" status="warning" variant="light" />;
        case 'Em Processamento':
          return <Chips label="Processando" status="primary" variant="light" iconLeft={<Loader2 size={12} className="animate-spin" />} />;
        case 'Concluído':
          return <Chips label="Concluído" status="success" variant="light" iconLeft={<CheckCircle2 size={12} />} />;
        default:
          return <Chips label={status} status="neutral" variant="light" />;
      }
    };

    return (
      <div className="flex-1 flex flex-col bg-neutral-0 animate-fade-slide">
        {renderMobileHeader("Alunos", () => setStep('class'))}
        
        {/* Selected Context Bar */}
        <div className="px-[16px] py-[10px] bg-neutral-1 border-b flex items-center justify-between gap-[12px] shrink-0" style={{ borderColor: themeColors.neutral[2] }}>
          <div className="truncate">
            <span className="text-[11px] font-bold text-neutral-4 block uppercase leading-none">Turma Ativa</span>
            <span className="text-[13px] font-bold text-neutral-7 truncate block mt-[2px]">
              {classSelections[2]} &bull; {classSelections[3]?.join(", ")}
            </span>
          </div>
          <Button
            variant="tertiary"
            appearance="link"
            size="xs"
            onClick={() => setStep('class')}
            className="shrink-0"
          >
            Alterar
          </Button>
        </div>

        {/* Search and Filters */}
        <div className="p-[16px] border-b flex flex-col gap-[12px] shrink-0" style={{ borderColor: themeColors.neutral[2] }}>
          <Input
            placeholder="Buscar aluno..."
            value={studentSearchQuery}
            onChange={(e) => setStudentSearchQuery(e.target.value)}
            iconLeft={<Search size={16} />}
            iconRight={studentSearchQuery ? <X size={16} onClick={() => setStudentSearchQuery('')} /> : null}
            height="38px"
          />

          <div className="flex items-center gap-[6px] overflow-x-auto hide-scrollbar whitespace-nowrap py-[2px]">
            {['Todos', 'Pendente', 'Aguardando Validação', 'Concluído'].map(filterId => {
              const label = filterId === 'Todos' ? 'Todos' : filterId === 'Aguardando Validação' ? 'Validação' : filterId === 'Pendente' ? 'Pendentes' : 'Concluídos';
              const isActive = studentFilter === filterId;
              return (
                <button
                  key={filterId}
                  onClick={() => setStudentFilter(filterId)}
                  className={`px-[12px] py-[6px] rounded-full text-[12px] font-bold transition-all border shrink-0 ${
                    isActive
                      ? 'bg-brand-base text-white border-brand-base'
                      : 'bg-neutral-0 text-neutral-5 border-neutral-300 hover:bg-neutral-100'
                  }`}
                  style={{
                    backgroundColor: isActive ? themeColors.primary.base : themeColors.neutral[0],
                    borderColor: isActive ? themeColors.primary.base : themeColors.neutral[3],
                    color: isActive ? themeColors.neutral[0] : themeColors.neutral[5]
                  }}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>

        {/* Students List */}
        <div className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[10px] bg-neutral-1">
          {filteredStudents.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-[40px] text-center gap-[8px]">
              <div className="w-[48px] h-[48px] rounded-full bg-neutral-2 flex items-center justify-center text-neutral-4">
                <Search size={20} />
              </div>
              <p className="text-[14px] font-bold text-neutral-6">Nenhum aluno encontrado</p>
              <p className="text-[12px] text-neutral-4">Verifique a busca ou troque o filtro ativo.</p>
            </div>
          ) : (
            filteredStudents.map(student => (
              <div
                key={student.id}
                className="bg-white border rounded-[12px] p-[14px] flex justify-between items-center gap-[12px] hover:shadow-md transition-all duration-200"
                style={{ borderColor: themeColors.neutral[2] }}
              >
                <div className="flex-1 min-w-0">
                  <h4 className="text-[14px] font-bold text-neutral-7 truncate">
                    {student.name}
                  </h4>
                  <div className="flex items-center gap-[8px] mt-[4px]">
                    <span className="text-[11px] text-neutral-4 font-semibold">ID: 00{student.id}</span>
                    {getStatusChip(student.status)}
                  </div>
                </div>
                
                <div className="shrink-0">
                  {student.status === 'Pendente' && (
                    <Button
                      variant="primary"
                      size="sm"
                      onClick={() => handleStartScan(student)}
                      className="!h-[32px] !px-[12px]"
                      iconLeft={<Camera size={14} />}
                    >
                      ESCANEAR
                    </Button>
                  )}
                  {student.status === 'Aguardando Validação' && (
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => handleStartValidation(student)}
                      className="!h-[32px] !px-[12px]"
                    >
                      VALIDAR
                    </Button>
                  )}
                  {student.status === 'Em Processamento' && (
                    <div className="w-[32px] h-[32px] flex items-center justify-center">
                      <Loader2 size={18} className="animate-spin text-brand-base" />
                    </div>
                  )}
                  {student.status === 'Concluído' && (
                    <div className="w-[32px] h-[32px] rounded-full bg-green-50 border border-green-200 flex items-center justify-center text-green-600 shadow-sm">
                      <Check size={18} strokeWidth={2.5} />
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    );
  };

  const renderScan = () => {
    return (
      <div className="flex-1 flex flex-col bg-neutral-900 animate-fade-slide text-white overflow-hidden relative select-none">
        {/* Header */}
        <div className="h-[56px] border-b border-white/10 flex items-center justify-between px-[16px] shrink-0 bg-neutral-900/90 z-30">
          <Button
            variant="tertiary"
            appearance="ghost"
            iconOnly={true}
            size="sm"
            onClick={() => setStep('students')}
            className="!text-white hover:!bg-white/10"
          >
            <ChevronLeft size={20} />
          </Button>
          <span className="text-[14px] font-bold tracking-tight">
            Scanner de Provas
          </span>
          <div className="w-[32px] h-[32px]"></div>
        </div>

        {/* Viewfinder Area */}
        <div className="flex-1 relative flex flex-col items-center justify-center p-[24px]">
          <div className="w-full max-w-[280px] aspect-[1/1.4] border-2 border-dashed border-white/30 rounded-[12px] relative flex flex-col items-center justify-center bg-neutral-800/20 overflow-hidden">
            
            <div className="absolute top-[12px] left-[12px] w-[20px] h-[20px] border-t-4 border-l-4 border-[#008BC9]"></div>
            <div className="absolute top-[12px] right-[12px] w-[20px] h-[20px] border-t-4 border-r-4 border-[#008BC9]"></div>
            <div className="absolute bottom-[12px] left-[12px] w-[20px] h-[20px] border-b-4 border-l-4 border-[#008BC9]"></div>
            <div className="absolute bottom-[12px] right-[12px] w-[20px] h-[20px] border-b-4 border-r-4 border-[#008BC9]"></div>
            
            <div className="w-[85%] h-[80%] border border-white/10 bg-white/5 p-4 flex flex-col gap-2 rounded select-none pointer-events-none">
              <div className="h-[8px] bg-white/20 rounded w-1/3 mb-2"></div>
              <div className="h-[6px] bg-white/10 rounded w-full"></div>
              <div className="h-[6px] bg-white/10 rounded w-[90%]"></div>
              
              <div className="flex-1 border border-white/10 border-dashed rounded mt-4 p-2 flex flex-col justify-between">
                <div className="h-[10px] bg-white/15 rounded w-1/2"></div>
                <div className="h-[30px] w-full border border-white/5 bg-white/5 rounded flex items-center justify-center">
                  <span className="font-serif italic text-white/40 text-[11px]">Escrita Detectada</span>
                </div>
              </div>
            </div>

            <div 
              className="absolute left-0 w-full h-[3px] bg-[#008BC9] opacity-75 shadow-[0_0_8px_#008BC9]"
              style={{
                animation: 'scanlineMove 2.5s linear infinite',
              }}
            />
          </div>

          <div className="absolute bottom-[24px] left-[16px] right-[16px] bg-black/60 backdrop-blur rounded-[8px] p-3 text-center border border-white/10">
            <p className="text-[12px] text-white/90 font-medium">
              Alinhe a folha de respostas de {activeStudent?.name.split(" ")[0]} e aperte o botão.
            </p>
          </div>
        </div>

        {/* Capture Shutter Bar */}
        <div className="h-[120px] bg-neutral-950 flex items-center justify-around px-[24px] shrink-0">
          <div className="w-[48px]"></div>
          
          <button
            onClick={handleCaptureImage}
            className="w-[72px] h-[72px] rounded-full bg-white border-[4px] border-neutral-800 flex items-center justify-center transition-transform active:scale-95 focus:outline-none"
          >
            <div className="w-[56px] h-[56px] rounded-full bg-white hover:bg-neutral-100 transition-colors flex items-center justify-center">
              <Camera size={28} className="text-neutral-900" />
            </div>
          </button>

          <div className="w-[48px]"></div>
        </div>

        {/* Loading Overlay */}
        {isScanLoading && (
          <div className="absolute inset-0 bg-neutral-950/80 backdrop-blur flex flex-col items-center justify-center z-50 p-[24px] text-center gap-[16px]">
            <div className="w-[56px] h-[56px] rounded-full border-4 border-white/10 border-t-[#008BC9] animate-spin"></div>
            <div>
              <h4 className="text-[16px] font-black text-white">{scanLoadingText}</h4>
              <p className="text-[12px] text-white/60 mt-[4px]">Não feche o aplicativo ou afaste a câmera.</p>
            </div>
          </div>
        )}

        <style>{`
          @keyframes scanlineMove {
            0% { top: 0%; }
            50% { top: 100%; }
            100% { top: 0%; }
          }
        `}</style>
      </div>
    );
  };

  const renderValidation = () => {
    return (
      <div className="flex-1 flex flex-col bg-neutral-0 animate-fade-slide">
        {renderMobileHeader("Validar HTR", () => setStep('students'))}
        
        <div className="flex-1 overflow-y-auto p-[16px] flex flex-col gap-[16px] bg-neutral-1">
          <div className="bg-white border rounded-[12px] p-[14px]" style={{ borderColor: themeColors.neutral[2] }}>
            <span className="text-[11px] font-bold text-neutral-4 uppercase leading-none block">Estudante</span>
            <h3 className="text-[16px] font-black text-neutral-7 mt-[4px]">
              {activeStudent?.name}
            </h3>
            <div className="flex items-center justify-between gap-[12px] mt-[10px] pt-[10px] border-t" style={{ borderColor: themeColors.neutral[1] }}>
              <span className="text-[12px] font-medium text-neutral-5">ID: 00{activeStudent?.id}</span>
              <Chips label="BAIXA CONFIANÇA" status="warning" variant="stroked" iconLeft={<Bot size={12} />} />
            </div>
          </div>

          <div className="bg-white border rounded-[12px] p-[14px]" style={{ borderColor: themeColors.neutral[2] }}>
            <span className="text-[11px] font-bold text-neutral-4 uppercase leading-none block mb-[10px]">Imagem Capturada</span>
            
            <div className="w-full bg-[#FAF7F2] border border-[#E9E3D5] rounded-[8px] p-[16px] min-h-[90px] flex items-center justify-center font-serif text-[16px] text-neutral-6 italic tracking-wider select-none relative overflow-hidden" style={{ fontFamily: 'Georgia, serif' }}>
              <div className="absolute top-[8px] right-[8px] text-[10px] font-mono bg-yellow-100 text-yellow-800 px-2 py-0.5 rounded border border-yellow-200">
                Crop Item 1
              </div>
              <span className="leading-relaxed text-center">
                {activeStudent?.textMockup || "Brasil é um país de muitas diversidades"}
              </span>
            </div>
          </div>

          <Callout
            colors={themeColors}
            type="caution"
            title="Possível Rasura"
            description="A IA identificou um risco de sobreposição de escrita no final da linha. Corrija o texto abaixo se necessário."
          />

          <div className="bg-white border rounded-[12px] p-[14px] flex flex-col gap-[10px]" style={{ borderColor: themeColors.neutral[2] }}>
            <Textarea
              label="Transcrição da IA"
              value={validationText}
              onChange={(e) => setValidationText(e.target.value)}
              helperText="Compare a transcrição acima com a imagem capturada e faça os ajustes necessários."
              rows={4}
            />
          </div>
        </div>

        <div className="p-[16px] border-t bg-white flex gap-[12px] shrink-0" style={{ borderColor: themeColors.neutral[2] }}>
          <Button
            variant="tertiary"
            size="lg"
            className="flex-1 font-bold"
            onClick={handleInvalidateTranscription}
          >
            INVALIDAR
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1 font-bold"
            onClick={handleConfirmTranscription}
          >
            CONFIRMAR
          </Button>
        </div>
      </div>
    );
  };

  const renderDesktopDashboard = () => {
    const totalProcessed = desktopUploads.reduce((acc, u) => acc + (u.status === 'Concluído' ? u.successSheets : 0), 0);
    const totalProcessing = desktopUploads.filter(u => u.status === 'Processando').length;
    const totalWithErrors = desktopUploads.filter(u => u.status === 'Erro').length;
    const isContextReady = classSelections[3] && classSelections[3].length > 0;

    return (
      <div className="w-full max-w-[1280px] mx-auto px-4 md:px-8 py-6 flex flex-col gap-6 animate-fade-slide">
        
        {/* Desktop Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-neutral-200">
          <div>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#E6F6FC] rounded-xl border border-[#B3E6F5] shrink-0">
                <img src="assets/fgv_logo.png" alt="FGV Logo" className="h-[32px] object-contain" />
              </div>
              <div>
                <h1 className="text-[24px] font-black tracking-tight text-neutral-800" style={{ color: themeColors.neutral[7] }}>
                  Carregamento de Provas
                </h1>
                <p className="text-[13px] text-neutral-5 font-semibold">
                  Selecione o contexto escolar e faça o carregamento das provas em lote ou individualmente.
                </p>
              </div>
            </div>
          </div>
          
          <Button
            variant="primary"
            appearance="solid"
            size="md"
            onClick={() => {
              setIsSimulatedMobile(true);
              setStep('home');
            }}
            iconLeft={<Camera size={18} />}
          >
            SIMULADOR MOBILE (SCANNER)
          </Button>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl border flex items-center justify-between shadow-sm" style={{ borderColor: themeColors.neutral[2] }}>
            <div>
              <span className="text-[12px] font-bold text-neutral-4 uppercase tracking-wider block">Total Digitalizado</span>
              <span className="text-[28px] font-black text-neutral-800 block mt-1" style={{ color: themeColors.neutral[7] }}>
                {totalProcessed}
              </span>
              <span className="text-[12px] text-neutral-5 block mt-1">Provas importadas com sucesso</span>
            </div>
            <div className="w-[48px] h-[48px] rounded-full bg-green-50 text-green-600 flex items-center justify-center border border-green-200">
              <CheckCircle2 size={24} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border flex items-center justify-between shadow-sm" style={{ borderColor: themeColors.neutral[2] }}>
            <div>
              <span className="text-[12px] font-bold text-neutral-4 uppercase tracking-wider block">Em Processamento</span>
              <span className="text-[28px] font-black text-neutral-800 block mt-1" style={{ color: themeColors.neutral[7] }}>
                {totalProcessing}
              </span>
              <span className="text-[12px] text-neutral-5 block mt-1">Lotes na fila de HTR automático</span>
            </div>
            <div className={`w-[48px] h-[48px] rounded-full bg-blue-50 text-blue-600 flex items-center justify-center border border-blue-200 ${totalProcessing > 0 ? 'animate-pulse' : ''}`}>
              <Loader2 size={24} className={totalProcessing > 0 ? 'animate-spin' : ''} />
            </div>
          </div>

          <div className="bg-white p-5 rounded-2xl border flex items-center justify-between shadow-sm" style={{ borderColor: themeColors.neutral[2] }}>
            <div>
              <span className="text-[12px] font-bold text-neutral-4 uppercase tracking-wider block">Arquivos com Erro</span>
              <span className="text-[28px] font-black text-red-600 block mt-1">
                {totalWithErrors}
              </span>
              <span className="text-[12px] text-neutral-5 block mt-1">Lotes necessitando ajuste manual</span>
            </div>
            <div className="w-[48px] h-[48px] rounded-full bg-red-50 text-red-600 flex items-center justify-center border border-red-200">
              <AlertCircle size={24} />
            </div>
          </div>
        </div>

        {/* Content Body Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          {/* Left Column: Context Card */}
          <div className="lg:col-span-4 bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-4" style={{ borderColor: themeColors.neutral[2] }}>
            <div>
              <h2 className="text-[18px] font-bold text-neutral-800" style={{ color: themeColors.neutral[7] }}>
                1. Contexto Escolar
              </h2>
              <p className="text-[13px] text-neutral-5 mt-1">
                Selecione o nível e a turma para carregar os lotes de arquivos correspondentes.
              </p>
            </div>

            <div className="w-full">
              <CascadeSelector
                colors={themeColors}
                levels={[
                  { id: 'regional', title: 'Regional' },
                  { id: 'municipio', title: 'Município' },
                  { id: 'escola', title: 'Escola' },
                  { id: 'turma', title: 'Turma' }
                ]}
                db={cascadeDb}
                onConfirm={(selections) => {
                  setClassSelections(selections);
                }}
                initialSelections={classSelections}
              />
            </div>

            {classSelections.length > 0 ? (
              <div className="p-4 bg-[#E6F6FC]/25 rounded-xl border border-[#B3E6F5] flex flex-col gap-2 mt-2">
                <span className="text-[11px] font-bold text-[#008BC9] uppercase tracking-wider block font-black">Contexto Ativo</span>
                <div className="text-[13px] text-neutral-7 space-y-1">
                  <p><strong>Regional:</strong> {classSelections[0]}</p>
                  {classSelections[1] && <p><strong>Município:</strong> {classSelections[1]}</p>}
                  {classSelections[2] && <p><strong>Escola:</strong> {classSelections[2]}</p>}
                  {classSelections[3] && classSelections[3].length > 0 && (
                    <p><strong>Turma(s):</strong> {classSelections[3].join(", ")}</p>
                  )}
                </div>
              </div>
            ) : (
              <div className="p-4 bg-neutral-50 rounded-xl border border-dashed flex flex-col items-center justify-center text-center py-6 text-neutral-4 mt-2" style={{ borderColor: themeColors.neutral[3] }}>
                <LayoutList size={24} className="mb-2 text-neutral-4" />
                <span className="text-[12px] font-medium">Nenhum contexto selecionado</span>
              </div>
            )}
          </div>

          {/* Right Column: Upload batches card */}
          <div className="lg:col-span-8 bg-white p-6 rounded-2xl border shadow-sm flex flex-col gap-6" style={{ borderColor: themeColors.neutral[2] }}>
            <div>
              <h2 className="text-[18px] font-bold text-neutral-800" style={{ color: themeColors.neutral[7] }}>
                2. Carregamento em Lote (PDF)
              </h2>
              <p className="text-[13px] text-neutral-5 mt-1">
                Envie o arquivo PDF com as provas escaneadas da turma selecionada. O processador HTR do Mapear fará a indexação automática dos alunos.
              </p>
            </div>

            {/* Dashed Dropzone Simulation */}
            <div
              onClick={isContextReady ? handleSimulateDesktopUpload : undefined}
              className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center text-center transition-all ${
                isContextReady
                  ? 'border-brand-base hover:bg-[#E6F6FC]/10 cursor-pointer bg-neutral-0 active:scale-[0.99]'
                  : 'border-neutral-300 bg-neutral-50 text-neutral-400 cursor-not-allowed opacity-60'
              }`}
              style={{
                borderColor: isContextReady ? themeColors.primary.base : themeColors.neutral[3]
              }}
            >
              <div className={`w-[56px] h-[56px] rounded-full flex items-center justify-center mb-3 ${
                isContextReady ? 'bg-brand-light text-brand-base' : 'bg-neutral-2 text-neutral-4'
              }`} style={{
                backgroundColor: isContextReady ? themeColors.primary.light : themeColors.neutral[2],
                color: isContextReady ? themeColors.primary.base : themeColors.neutral[4]
              }}>
                {isDesktopUploading ? (
                  <Loader2 size={24} className="animate-spin" />
                ) : (
                  <Upload size={24} />
                )}
              </div>
              
              {isContextReady ? (
                <>
                  <h4 className="text-[15px] font-bold text-neutral-800" style={{ color: themeColors.neutral[7] }}>
                    {isDesktopUploading ? 'Processando arquivo...' : 'Arraste e solte o arquivo PDF aqui ou clique para procurar'}
                  </h4>
                  <p className="text-[12px] text-neutral-5 mt-1 max-w-sm mx-auto">
                    Suporta arquivos PDF de até 50MB. Certifique-se de que a resolução das páginas seja de pelo menos 150 DPI.
                  </p>
                </>
              ) : (
                <>
                  <h4 className="text-[15px] font-bold text-neutral-4">
                    Envio de Arquivos Desabilitado
                  </h4>
                  <p className="text-[12px] text-neutral-4 mt-1 max-w-sm mx-auto">
                    Por favor, selecione um contexto escolar válido (incluindo pelo menos uma turma) no painel ao lado.
                  </p>
                </>
              )}
            </div>

            {/* List of processed/uploaded batches */}
            <div className="flex flex-col gap-3">
              <h3 className="text-[14px] font-bold text-neutral-800" style={{ color: themeColors.neutral[7] }}>
                Histórico de Envio da Turma
              </h3>

              <div className="border rounded-xl overflow-hidden bg-white" style={{ borderColor: themeColors.neutral[2] }}>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-neutral-50 text-[11px] font-bold text-neutral-5 uppercase tracking-wider border-b" style={{ borderColor: themeColors.neutral[2], backgroundColor: themeColors.neutral[1] }}>
                        <th className="px-6 py-3.5">Arquivo</th>
                        <th className="px-6 py-3.5">Páginas/Lote</th>
                        <th className="px-6 py-3.5">Enviado em</th>
                        <th className="px-6 py-3.5">Status</th>
                        <th className="px-6 py-3.5 text-right">Ações</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y" style={{ borderColor: themeColors.neutral[2] }}>
                      {desktopUploads.map((row) => {
                        return (
                          <tr key={row.id} className="hover:bg-neutral-50/50 transition-colors text-[13px]">
                            <td className="px-6 py-4 font-semibold text-neutral-7 truncate max-w-[200px]" style={{ color: themeColors.neutral[7] }}>
                              <div className="flex items-center gap-2">
                                <FileText size={16} className="text-brand-base shrink-0" style={{ color: themeColors.primary.base }} />
                                <span className="truncate" title={row.name}>{row.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-medium text-neutral-6">
                              {row.status === 'Processando' ? (
                                <span className="text-neutral-4 italic">Indexando...</span>
                              ) : (
                                <span>{row.successSheets} de {row.totalSheets}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-neutral-5">
                              {row.date}
                            </td>
                            <td className="px-6 py-4">
                              {row.status === 'Concluído' ? (
                                <Chips label="Concluído" status="success" variant="light" iconLeft={<CheckCircle2 size={12} />} />
                              ) : row.status === 'Processando' ? (
                                <Chips label="Processando" status="primary" variant="light" iconLeft={<Loader2 size={12} className="animate-spin" />} />
                              ) : (
                                <Chips label="Erro Leitura" status="error" variant="light" iconLeft={<XCircle size={12} />} />
                              )}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {row.status === 'Erro' ? (
                                <Button
                                  variant="tertiary"
                                  size="sm"
                                  className="!px-3 !h-[28px] !text-[12px] font-bold"
                                  onClick={() => setActiveErrorBatch(row)}
                                >
                                  VER ERROS
                                </Button>
                              ) : row.status === 'Concluído' ? (
                                <span className="text-[12px] font-semibold text-green-600">Importado</span>
                              ) : (
                                <span className="text-[12px] font-semibold text-neutral-4">Aguarde...</span>
                              )}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

          </div>

        </div>

      </div>
    );
  };

  const renderActiveStep = () => {
    switch (step) {
      case 'home':
        return renderMobileHome();
      case 'class':
        return renderClassSelection();
      case 'students':
        return renderStudents();
      case 'scan':
        return renderScan();
      case 'validation':
        return renderValidation();
      default:
        return renderMobileHome();
    }
  };

  const isMobileView = isMobileDevice || isSimulatedMobile;

  if (!isMobileView) {
    return (
      <div className="flex-1 w-full bg-neutral-1 flex flex-col justify-start">
        {renderDesktopDashboard()}
        
        {/* HTR error details modal */}
        {activeErrorBatch && createPortal(
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[9999] flex items-center justify-center p-4 animate-fade-in"
            onClick={() => setActiveErrorBatch(null)}
          >
            <div
              className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md border border-gray-200 animate-scale-up"
              onClick={e => e.stopPropagation()}
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <span className="text-[11px] font-bold text-red-600 uppercase tracking-wider block font-black">Erro no Processamento</span>
                  <h3 className="text-[18px] font-black text-gray-900 mt-1">Erros de Leitura HTR</h3>
                </div>
                <button
                  onClick={() => setActiveErrorBatch(null)}
                  className="p-1 rounded-full hover:bg-neutral-100 transition-colors"
                >
                  <X size={20} className="text-neutral-500" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-3 bg-neutral-50 rounded-lg border text-[13px] text-neutral-6" style={{ borderColor: themeColors.neutral[2] }}>
                  <p><strong>Lote:</strong> {activeErrorBatch.name}</p>
                  <p className="mt-1"><strong>Data:</strong> {activeErrorBatch.date}</p>
                </div>

                <div className="p-4 bg-red-50/50 rounded-lg border border-red-100 flex gap-3">
                  <AlertCircle size={20} className="text-red-600 shrink-0 mt-[2px]" />
                  <div className="text-[13px] text-neutral-7">
                    <p className="font-bold text-red-800">Inconsistência Detectada</p>
                    <p className="mt-1 text-neutral-6 leading-relaxed">
                      {activeErrorBatch.errorDetails}
                    </p>
                  </div>
                </div>

                <p className="text-neutral-6 text-[13px] leading-relaxed">
                  Estas folhas de respostas apresentaram rasuras ou baixa qualidade de imagem que impediram o reconhecimento automático. Você pode escaneá-las manualmente usando um smartphone ou simulador mobile.
                </p>
              </div>

              <div className="flex gap-3">
                <Button
                  variant="tertiary"
                  size="md"
                  className="flex-1 font-bold"
                  onClick={() => setActiveErrorBatch(null)}
                >
                  FECHAR
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  className="flex-1 font-bold"
                  onClick={() => {
                    setActiveErrorBatch(null);
                    setIsSimulatedMobile(true);
                    setStep('students');
                    setStudentFilter('Pendente');
                  }}
                  iconLeft={<Camera size={16} />}
                >
                  CORRIGIR NO CELULAR
                </Button>
              </div>
            </div>
          </div>,
          document.body
        )}
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-neutral-1 flex flex-col justify-start items-center py-0 md:py-[32px] px-0 md:px-[16px]">
      
      {/* Top Desktop Navigation Header (Only visible on simulated mobile) */}
      {isSimulatedMobile && !isMobileDevice && (
        <div className="w-full max-w-[420px] mb-4 flex justify-between items-center px-4 shrink-0">
          <Button
            variant="tertiary"
            appearance="ghost"
            size="sm"
            onClick={() => {
              setIsSimulatedMobile(false);
            }}
            iconLeft={<ArrowLeft size={16} />}
          >
            Voltar ao Dashboard
          </Button>
          <span className="text-[12px] font-bold text-neutral-5">Modo Mobile Simulado</span>
        </div>
      )}

      {isMobileDevice ? (
        // True Mobile Device: No shell bezel, just fill screen
        <div className="w-full h-full min-h-screen bg-white flex flex-col relative overflow-hidden">
          <div className="flex-1 flex flex-col overflow-hidden h-full">
            <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
              {renderActiveStep()}

              {/* Toast overlay */}
              {toast && (
                <div className="absolute top-[80px] left-[16px] right-[16px] z-50 animate-fade-slide">
                  <div className="bg-neutral-800 text-white rounded-lg p-3 shadow-lg flex items-center justify-between border border-neutral-700">
                    <span className="text-[12px] font-bold">{toast}</span>
                    <button onClick={() => setToast(null)} className="text-white/60 hover:text-white"><X size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        // Desktop Simulation: Render in phone shell frame
        <div 
          className="w-full h-[780px] max-w-[412px] bg-white flex flex-col relative border-[10px] border-neutral-800 rounded-[40px] shadow-2xl overflow-hidden" 
          style={{ 
            borderColor: themeColors.neutral[6],
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)'
          }}
        >
          {/* Notch / Speaker */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[140px] h-[28px] bg-neutral-800 rounded-b-[20px] z-50 flex items-center justify-center">
            <div className="w-[40px] h-[3px] bg-neutral-900 rounded-full mb-[2px]"></div>
            <div className="w-[6px] h-[6px] bg-neutral-900 rounded-full ml-[6px] mb-[2px]"></div>
          </div>

          {/* App content inside device wrapper */}
          <div className="flex-1 flex flex-col overflow-hidden h-full pt-[24px]">
            {/* Status bar simulator */}
            <div className="h-[24px] bg-neutral-800 text-white text-[11px] px-[24px] flex justify-between items-center shrink-0 select-none font-mono">
              <span>18:17</span>
              <div className="flex items-center gap-[4px]">
                <span>5G</span>
                <div className="w-[18px] h-[10px] border border-white rounded-[2px] p-[1px] flex items-center">
                  <div className="w-full h-full bg-white rounded-[1px]"></div>
                </div>
              </div>
            </div>
            
            {/* Screen area */}
            <div className="flex-1 flex flex-col overflow-hidden relative bg-white">
              {renderActiveStep()}

              {/* Toast overlay */}
              {toast && (
                <div className="absolute top-[80px] left-[16px] right-[16px] z-50 animate-fade-slide">
                  <div className="bg-neutral-800 text-white rounded-lg p-3 shadow-lg flex items-center justify-between border border-neutral-700">
                    <span className="text-[12px] font-bold">{toast}</span>
                    <button onClick={() => setToast(null)} className="text-white/60 hover:text-white"><X size={14} /></button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
