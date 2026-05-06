import React, { useState } from 'react';
import {
  Search, FileText, ChevronLeft, ChevronRight, CheckCircle2,
  Loader2, RefreshCcw, AlertCircle, XCircle, Upload, Info,
  Maximize, ZoomIn, ZoomOut, Bot, Edit2, LayoutDashboard,
  Check, Filter, Download
} from 'lucide-react';
import Button from '../ui/Button';
import CascadeSelector from '../ui/CascadeSelector';
import Input from '../ui/Input';
import Breadcrumb from '../ui/Breadcrumb';
import Chips from '../ui/Chips';
import Tabs from '../ui/Tabs';

const mockUploads = [
  { id: 1, name: 'Ana Júlia da Silva', file: '124894.pdf', date: '18 Dez, 2025', status: 'Em processamento' },
  { id: 2, name: 'Carlos Eduardo Ferreira', file: '124895.pdf', date: '18 Dez, 2025', status: 'Em processamento' },
  { id: 3, name: 'Maria Vitória de Sousa Mendes', file: '124896.pdf', date: '18 Dez, 2025', status: 'Aguardando Validação' },
  { id: 4, name: 'Larissa Beatriz Lima', file: '124897.pdf', date: '18 Dez, 2025', status: 'Não Iniciado' },
  { id: 5, name: 'Lucas Gabriel Rodrigues', file: '124897.pdf', date: '18 Dez, 2025', status: 'Inválido' },
  { id: 6, name: 'Rafaela Cristina dos Santos', file: '124897.pdf', date: '18 Dez, 2025', status: 'Concluído' },
  { id: 7, name: 'Pedro Henrique Almeida', file: '124897.pdf', date: '18 Dez, 2025', status: 'Em processamento' },
  { id: 8, name: 'Emilly Yasmin Costa', file: '124897.pdf', date: '18 Dez, 2025', status: 'Aguardando Validação' },
  { id: 9, name: 'Mateus Vinicius da Rocha', file: '124897.pdf', date: '18 Dez, 2025', status: 'Erro' },
  { id: 10, name: 'Isabelle Mirella Pinto', file: '124897.pdf', date: '18 Dez, 2025', status: 'Não Iniciado' },
  { id: 11, name: 'Kaio André Martins', file: '124897.pdf', date: '18 Dez, 2025', status: 'Concluído' },
  { id: 12, name: 'Luana Rafaelly Barbosa', file: '124897.pdf', date: '18 Dez, 2025', status: 'Em processamento' },
];

export default function CarregamentoProvas({ colors, navigateTo }) {
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'validation'
  const [activeTab, setActiveTab] = useState('Processamento');
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Em processamento': return { status: 'primary', variant: 'light', icon: <Loader2 size={14} className="animate-spin" /> };
      case 'Aguardando Validação': return { status: 'wheat', variant: 'light', icon: <RefreshCcw size={14} /> };
      case 'Não Iniciado': return { status: 'neutral', variant: 'light', icon: null };
      case 'Inválido': return { status: 'warning', variant: 'light', icon: <AlertCircle size={14} /> };
      case 'Concluído': return { status: 'success', variant: 'light', icon: <CheckCircle2 size={14} /> };
      case 'Erro': return { status: 'error', variant: 'light', icon: <XCircle size={14} /> };
      default: return { status: 'neutral', variant: 'light', icon: null };
    }
  };

  const handleValidar = (student) => {
    setSelectedStudent(student);
    setViewMode('validation');
  };

  if (viewMode === 'validation') {
    return (
      <div className="flex-1 flex flex-col h-[calc(100vh-72px)] bg-neutral-1 animate-fade-slide overflow-hidden">
        {/* Header de Validação */}
        <div className="h-[72px] bg-white border-b px-[16px] md:px-[32px] flex justify-between items-center shrink-0 z-10 shadow-sm" style={{ borderColor: colors.neutral[2] }}>
          <div className="flex items-center gap-[16px]">
            <Button
              variant="tertiary"
              appearance="ghost"
              iconOnly
              iconLeft={<ChevronLeft size={20} />}
              onClick={() => setViewMode('list')}
            />
            <div>
              <h2 className="text-[16px] md:text-[18px] font-bold text-neutral-7 leading-tight">Validação do Teste</h2>
              <div className="text-[12px] md:text-[13px] text-neutral-5 mt-[2px]">
                Aluno(a): <span className="font-bold text-neutral-7">{selectedStudent?.name}</span> &nbsp;|&nbsp;
                ID: <span className="font-bold text-neutral-7">123456</span>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <Button variant="tertiary" size="md">
              INVALIDAR <XCircle size={16} className="ml-[8px] opacity-60" />
            </Button>
            <Button variant="secondary" size="md" onClick={() => setViewMode('list')}>
              CONCLUIR VALIDAÇÃO <CheckCircle2 size={16} className="ml-[8px]" />
            </Button>
          </div>
        </div>

        {/* Área de Trabalho Dividida */}
        <div className="flex flex-1 overflow-hidden">
          {/* Esquerda: PDF Viewer */}
          <div className="w-1/2 h-full bg-neutral-2 border-r overflow-y-auto custom-scrollbar flex flex-col items-center py-[32px] px-[24px] gap-[24px] relative" style={{ borderColor: colors.neutral[3] }}>
            <div className="w-full max-w-[540px] flex justify-between items-center mb-[-12px]">
              <span className="text-[14px] font-bold text-neutral-6">PDF do Aluno</span>
              <button className="p-[6px] text-neutral-5 hover:text-neutral-7 bg-white rounded shadow-sm"><Maximize size={16} /></button>
            </div>

            {/* Mock PDF Page 1 */}
            <div className="w-full max-w-[540px] bg-white shadow-xl border aspect-[1/1.4] flex flex-col relative shrink-0" style={{ borderColor: colors.neutral[2] }}>
              <div className="px-[24px] py-[16px] flex justify-between items-center border-b" style={{ borderColor: colors.neutral[1] }}>
                <div className="flex items-center gap-[8px]">
                  <div className="w-[20px] h-[20px] bg-primary-base rounded flex items-center justify-center text-white text-[10px] font-bold">M</div>
                  <span className="text-[11px] font-bold text-primary-base tracking-widest">MAPEAR</span>
                </div>
                <span className="text-[11px] font-bold text-neutral-4 tracking-widest">PÁGINA 02</span>
              </div>
              <div className="p-[32px] flex-1 flex flex-col gap-[16px]">
                <div className="w-full bg-primary-extraDark text-white text-center py-[8px] text-[11px] font-bold uppercase tracking-wider rounded-[2px]">Cultura, Linguagem e Cotidiano Brasileiro</div>
                <div className="space-y-[8px]">
                  <span className="text-[10px] font-bold text-primary-base uppercase">Tarefa 1</span>
                  <h4 className="text-[14px] font-bold text-neutral-7">O Brasil no Dia a Dia: Cultura e Identidade</h4>
                  <p className="text-[10px] text-neutral-5 leading-relaxed text-justify opacity-80">O Brasil é marcado por uma grande diversidade cultural, visível nas festas populares, nos esportes, na música e nos hábitos cotidianos. Estas manifestações fazem parte da construção da identidade nacional.</p>
                </div>
                <div className="mt-[16px] border-t pt-[16px]" style={{ borderColor: colors.neutral[1] }}>
                  <div className="flex items-center gap-[8px] mb-[8px]">
                    <span className="text-[11px] font-bold text-primary-base">ITEM 1.</span>
                    <span className="text-[13px] font-bold text-neutral-7">Diversidade Cultural</span>
                  </div>
                  <div className="w-full h-[140px] bg-neutral-1 rounded overflow-hidden mb-[16px] border" style={{ borderColor: colors.neutral[2] }}>
                    <img src="https://images.unsplash.com/photo-1543888365-1d0339d1b09d?q=80&w=800&auto=format&fit=crop" className="w-full h-full object-cover opacity-80" alt="Cultural" />
                  </div>
                  <div className="space-y-[6px]">
                    <div className="flex items-center gap-[10px]"><div className="w-[12px] h-[12px] border border-neutral-7 bg-neutral-7"></div><span className="text-[10px] font-bold text-neutral-7">A. Prática restrita a atletas profissionais</span></div>
                    <div className="flex items-center gap-[10px]"><div className="w-[12px] h-[12px] border border-neutral-7"></div><span className="text-[10px] font-medium text-neutral-5">B. Acesso facilitado e identificação popular</span></div>
                    <div className="flex items-center gap-[10px]"><div className="w-[12px] h-[12px] border border-neutral-7"></div><span className="text-[10px] font-medium text-neutral-5">C. Falta de outros desportos no país</span></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Controles Flutuantes */}
            <div className="fixed bottom-[32px] left-1/4 -translate-x-1/2 flex items-center bg-white rounded-[12px] shadow-2xl border overflow-hidden p-[4px]" style={{ borderColor: colors.neutral[2] }}>
              <button className="p-[12px] hover:bg-neutral-1 text-neutral-5 transition-colors border-r" style={{ borderColor: colors.neutral[1] }}><Maximize size={18} /></button>
              <button className="p-[12px] hover:bg-neutral-1 text-neutral-5 transition-colors border-r" style={{ borderColor: colors.neutral[1] }}><ZoomOut size={18} /></button>
              <button className="p-[12px] hover:bg-neutral-1 text-neutral-5 transition-colors"><ZoomIn size={18} /></button>
            </div>
          </div>

          {/* Direita: HTR Panel */}
          <div className="w-1/2 h-full bg-white overflow-y-auto custom-scrollbar flex flex-col relative">
            <div className="px-[32px] py-[20px] flex justify-between items-center border-b shrink-0 sticky top-0 bg-white/95 backdrop-blur z-20" style={{ borderColor: colors.neutral[1] }}>
              <h3 className="text-[16px] font-bold text-neutral-7">Transcrição HTR</h3>
              <div className="flex items-center gap-[12px]">
                <span className="text-[12px] font-bold text-primary-base">Aguardando...</span>
                <div className="w-[16px] h-[16px] rounded-full border-2 border-neutral-2 border-t-primary-base animate-spin"></div>
              </div>
            </div>

            <div className="p-[32px] flex-1 flex flex-col gap-[32px]">
              <div className="flex justify-between items-center">
                <h2 className="text-[20px] font-bold text-neutral-7">Questão Aberta #06</h2>
                <Button variant="tertiary" appearance="ghost" size="sm">Indicar no PDF</Button>
              </div>

              {/* Recorte da Resposta */}
              <div className="space-y-[12px]">
                <span className="text-[14px] font-bold text-neutral-6">Imagem Detectada:</span>
                <div className="w-full border-2 border-dashed rounded-[12px] p-[16px] bg-neutral-1 relative overflow-hidden" style={{ borderColor: colors.neutral[2] }}>
                  <div className="w-full border bg-white p-[12px] relative h-[100px]" style={{ borderColor: colors.neutral[3] }}>
                    <div className="absolute top-1/3 left-0 w-full h-[1px] bg-neutral-2"></div>
                    <div className="absolute top-2/3 left-0 w-full h-[1px] bg-neutral-2"></div>
                    <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/d/d4/Lorem_ipsum_handwritten.svg/800px-Lorem_ipsum_handwritten.svg.png" className="absolute inset-0 w-full h-full object-contain opacity-40 p-[8px]" alt="Handwriting" />
                  </div>
                  {/* Bounding Box UI */}
                  <div className="absolute inset-[10px] border-2 border-primary-base rounded-[4px] pointer-events-none opacity-60">
                    <div className="absolute -top-[4px] -left-[4px] w-[8px] h-[8px] bg-primary-base rounded-full"></div>
                    <div className="absolute -top-[4px] -right-[4px] w-[8px] h-[8px] bg-primary-base rounded-full"></div>
                    <div className="absolute -bottom-[4px] -left-[4px] w-[8px] h-[8px] bg-primary-base rounded-full"></div>
                    <div className="absolute -bottom-[4px] -right-[4px] w-[8px] h-[8px] bg-primary-base rounded-full"></div>
                  </div>
                </div>
              </div>

              {/* Transcrição Editável */}
              <div className="space-y-[12px] border-t pt-[24px]" style={{ borderColor: colors.neutral[1] }}>
                <div className="flex justify-between items-center">
                  <span className="text-[14px] font-bold text-neutral-6">Resultado do HTR:</span>
                  <Chips
                    label="INTELIGÊNCIA ARTIFICIAL"
                    variant="stroked"
                    status="warning"
                    iconLeft={<Bot size={14} />}
                  />
                </div>
                <textarea
                  className="w-full min-h-[160px] p-[20px] border rounded-[12px] text-[15px] text-neutral-7 outline-none focus:border-primary-base focus:ring-4 focus:ring-primary-base/5 resize-none leading-relaxed transition-all"
                  style={{ borderColor: colors.neutral[3], backgroundColor: colors.neutral[0] }}
                  defaultValue="Leitura ilógica dolorosa sem mentalidade consequente amplamente de elite, sem dó e claro, tempo para todos os brasileiros."
                />
                <span className="text-[11px] font-medium text-neutral-4">Ajuste a pontuação e ortografia se necessário para corresponder ao manuscrito.</span>
              </div>
            </div>

            {/* Navegação de Questões */}
            <div className="p-[32px] bg-white border-t mt-auto shrink-0 flex justify-between items-center sticky bottom-0 z-20" style={{ borderColor: colors.neutral[2] }}>
              <Button variant="tertiary" size="lg" className="w-[160px]">
                <ChevronLeft size={20} className="mr-[8px]" /> ANTERIOR
              </Button>
              <Button variant="primary" size="lg" className="w-[160px]">
                PRÓXIMO <ChevronRight size={20} className="ml-[8px]" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 w-full bg-neutral-1 min-h-screen">
      <main className="max-w-[1200px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[40px] flex flex-col min-h-full">

        {/* Breadcrumb e Título */}
        <Breadcrumb
          colors={colors}
          onBack={() => navigateTo('dashboard')}
          paths={[
            { label: 'Início', onClick: () => navigateTo('dashboard') },
            { label: 'Carregamento de Provas' }
          ]}
        />

        <div className="mb-[32px] animate-fade-slide">
          <h1 className="text-[28px] md:text-[36px] font-black text-neutral-7 leading-tight mb-[8px]">Carregamento de Provas</h1>
          <p className="text-[15px] text-neutral-5 max-w-[700px]">Selecione o contexto da turma e realize o upload dos arquivos PDF para processamento e correção automática via HTR.</p>
        </div>

        {/* Context Selector (Cascade) */}
        <div className="mb-[32px] animate-fade-slide relative" style={{ animationDelay: '100ms', zIndex: 500 }}>
          <CascadeSelector
            colors={colors}
            levels={[
              { id: 'regional', title: 'Regional' },
              { id: 'municipio', title: 'Município' },
              { id: 'escola', title: 'Escola' },
              { id: 'turma', title: 'Turma' }
            ]}
            db={() => ['Ceará', 'Fortaleza', 'EEM Liceu do Conjunto Ceará', 'Turma 9A']}
          />
        </div>

        <Tabs
          colors={colors}
          tabs={[
            { id: 'Upload', label: 'Upload' },
            { id: 'Processamento', label: 'Processamento' }
          ]}
          activeTab={activeTab}
          onChange={(id) => setActiveTab(id)}
          className="mb-[32px]"
        />

        {/* Toolbar de Processamento */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-[16px] mb-[24px] animate-fade-slide">
          <div className="flex flex-col gap-[4px]">
            <h3 className="text-[18px] font-bold text-neutral-7">Fila de Processamento</h3>
            <div className="flex items-center gap-[12px] text-[12px] font-bold text-neutral-5">
              <span className="text-neutral-7">85 ARQUIVOS</span>
              <div className="w-[1px] h-[12px] bg-neutral-3"></div>
              <span className="text-green-600">58 CONCLUÍDOS</span>
              <div className="w-[1px] h-[12px] bg-neutral-3"></div>
              <span className="text-amber-600">7 PENDENTES</span>
            </div>
          </div>
          <div className="flex items-center gap-[12px]">
            <div className="relative">
              <Search size={16} className="absolute left-[12px] top-1/2 -translate-y-1/2 text-neutral-4" />
              <input
                type="text"
                placeholder="Buscar aluno..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-[40px] pl-[36px] pr-[16px] border rounded-[8px] text-[14px] outline-none w-full md:w-[240px] transition-all focus:border-primary-base focus:ring-4 focus:ring-primary-base/5"
                style={{ borderColor: colors.neutral[3], backgroundColor: colors.neutral[0] }}
              />
            </div>
            <Button variant="tertiary" size="md"><Download size={16} /></Button>
            <Button variant="secondary" size="md">PROCESSAR <RefreshCcw size={16} className="ml-[8px]" /></Button>
          </div>
        </div>

        {/* Tabela Customizada */}
        <div className="bg-white border rounded-[16px] overflow-hidden shadow-sm animate-fade-slide" style={{ borderColor: colors.neutral[2] }}>
          <div className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr] gap-[16px] px-[24px] py-[16px] bg-neutral-1 border-b text-[12px] font-black text-neutral-5 uppercase tracking-widest" style={{ borderColor: colors.neutral[2] }}>
            <div>Nome do Estudante</div>
            <div>Arquivo PDF</div>
            <div>Data Upload</div>
            <div className="text-right">Status / Ação</div>
          </div>
          <div className="divide-y" style={{ borderColor: colors.neutral[1] }}>
            {mockUploads.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase())).map((row) => {
              const statusStyle = getStatusStyle(row.status);
              return (
                <div key={row.id} className="grid grid-cols-[2fr_1.5fr_1fr_1.5fr] gap-[16px] px-[24px] py-[18px] items-center text-[14px] hover:bg-neutral-1/50 transition-colors">
                  <div className="font-bold text-neutral-7 truncate">{row.name}</div>
                  <div className="flex items-center gap-[8px] text-primary-base font-bold cursor-pointer hover:underline truncate">
                    <FileText size={16} /> {row.file}
                  </div>
                  <div className="text-neutral-5 font-medium">{row.date}</div>
                  <div className="flex items-center justify-end gap-[12px]">
                    <Chips
                      label={row.status}
                      variant={statusStyle.variant}
                      status={statusStyle.status}
                      iconLeft={statusStyle.icon}
                    />
                    {row.status === 'Aguardando Validação' && (
                      <Button
                        variant="tertiary"
                        size="sm"
                        onClick={() => handleValidar(row)}
                        className="!px-[12px] !h-[28px]"
                      >
                        VALIDAR
                      </Button>
                    )}
                    {row.status === 'Erro' && (
                      <div className="flex items-center gap-[4px]">
                        <Button variant="tertiary" appearance="ghost" iconOnly size="xs"><RefreshCcw size={14} /></Button>
                        <Button variant="secondary" appearance="ghost" iconOnly size="xs"><Upload size={14} /></Button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-[24px] flex justify-between items-center text-[12px] font-bold text-neutral-4">
          <span>Mostrando {mockUploads.length} registros</span>
          <div className="flex items-center gap-[8px]">
            <button className="w-[32px] h-[32px] flex items-center justify-center rounded border bg-white border-neutral-2 text-neutral-3">1</button>
            <button className="w-[32px] h-[32px] flex items-center justify-center rounded border bg-neutral-1 border-neutral-2 text-neutral-7">2</button>
            <button className="w-[32px] h-[32px] flex items-center justify-center rounded border bg-white border-neutral-2 text-neutral-3">3</button>
          </div>
        </div>

      </main>
    </div>
  );
}
