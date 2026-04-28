import React, { useState, useEffect } from 'react';
import { Users, ClipboardList, CheckCircle2, XCircle, Save, AlertTriangle, CheckCircle, ChevronRight } from 'lucide-react';
import CascadeSelector from '../ui/CascadeSelector';

const CASCADE_LEVELS = [
  { id: 'estado', title: 'Estados' },
  { id: 'cidade', title: 'Municípios' },
  { id: 'escola', title: 'Escolas' },
  { id: 'turma', title: 'Turmas' },
  { id: 'avaliacao', title: 'Testes' }
];

const db = {
  estados: ['Ceará', 'São Paulo', 'Rio de Janeiro'],
  cidades: {
    'Ceará': ['Fortaleza', 'Sobral', 'Juazeiro do Norte'],
    'São Paulo': ['São Paulo', 'Campinas'],
    'Rio de Janeiro': ['Rio de Janeiro', 'Niterói']
  },
  escolas: {
    'Fortaleza': ['Liceu do Conjunto Ceará', 'EEEP Justiniano de Serpa', 'Colégio Militar de Fortaleza'],
    'Sobral': ['Escola Osmar de Sá', 'Colégio Sobralense'],
    'São Paulo': ['EE Prof. Pedro', 'Colégio Estadual Central']
  },
  turmas: {
    'Liceu do Conjunto Ceará': ['1º Ano A', '1º Ano B', '2º Ano A', '3º Ano C'],
    'EEEP Justiniano de Serpa': ['1º Ano Informática', '2º Ano Enfermagem']
  },
  avaliacoes: {
    '1º Ano A': [
      { id: 'AV01', nome: 'Avaliação Diagnóstica de Matemática' },
      { id: 'AV02', nome: 'Simulado SAEB - Língua Portuguesa' }
    ],
    '1º Ano B': [
      { id: 'AV03', nome: 'Avaliação Somativa - Ciências da Natureza' },
      { id: 'AV04', nome: 'Avaliação Extraordinária de Física Aplicada (Longo)' }
    ],
    '2º Ano A': [
      { id: 'AV05', nome: 'Avaliação de História Contemporânea' }
    ],
    '3º Ano C': [
      { id: 'AV06', nome: 'Simulado ENEM Geral' }
    ],
    '1º Ano Informática': [
      { id: 'AV07', nome: 'Teste de Lógica de Programação' }
    ],
    '2º Ano Enfermagem': [
      { id: 'AV08', nome: 'Teste de Anatomia Básica' }
    ]
  },
  alunos: [
    { id: 101, nome: 'Ana Carolina Pereira', matricula: '2025001' },
    { id: 102, nome: 'Bruno Gomes Silva', matricula: '2025002' },
    { id: 103, nome: 'Carlos Eduardo Santos', matricula: '2025003' },
    { id: 104, nome: 'Diana Vitoria Mendes', matricula: '2025004' },
    { id: 105, nome: 'Eduardo Felipe Alves', matricula: '2025005' },
    { id: 106, nome: 'Fernanda Lima Souza', matricula: '2025006' },
    { id: 107, nome: 'Gabriel Costa e Silva', matricula: '2025007' },
    { id: 108, nome: 'Helena Oliveira', matricula: '2025008' }
  ]
};

export default function RegistroPresenca({ colors, navigateTo }) {
  const [filters, setFilters] = useState({
    estado: '',
    cidade: '',
    escola: '',
    turma: '',
    avaliacaoId: '',
    avaliacaoNome: ''
  });
  const [presenceList, setPresenceList] = useState({});
  const [isSaved, setIsSaved] = useState(false);

  const handleCascadeConfirm = (selections) => {
    const av = selections[4];
    setFilters({
      estado: selections[0] || '',
      cidade: selections[1] || '',
      escola: selections[2] || '',
      turma: selections[3] || '',
      avaliacaoId: av ? av.id : '',
      avaliacaoNome: av ? av.nome : ''
    });
    setPresenceList({});
    setIsSaved(false);
  };

  const setPresence = (studentId, status) => {
    setPresenceList(prev => ({
      ...prev,
      [studentId]: status
    }));
  };

  const savePresence = () => {
    const totalAlunos = db.alunos.length;
    const marcados = Object.keys(presenceList).length;

    if (marcados < totalAlunos) {
      alert(`Atenção: Você preencheu ${marcados} de ${totalAlunos} presenças. Por favor, verifique a lista completa antes de salvar.`);
      return;
    }

    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 3000);
  };

  const presencas = Object.values(presenceList).filter(s => s === 'presente').length;
  const faltas = Object.values(presenceList).filter(s => s === 'ausente').length;
  const allMarked = db.alunos.length > 0 && Object.keys(presenceList).length === db.alunos.length;

  return (
    <div className="flex-1 w-full bg-[#F7F8FA] min-h-screen">
      <main className="max-w-[1000px] mx-auto px-[16px] md:px-[32px] py-[24px] md:py-[40px] pb-[160px] md:pb-[100px]">

        <div className="mb-[24px] md:mb-[32px] animate-fade-slide">
          <span className="text-[12px] md:text-[13px] font-bold text-[#008BC9] tracking-widest uppercase">Aplicação em Andamento</span>
          <h1 className="text-[24px] md:text-[32px] font-black text-neutral-700 mt-[4px] md:mt-[8px] leading-tight font-montserrat">Registro de Presença</h1>
        </div>

        {/* SELETOR EM CASCATA */}
        <div className="mb-[32px]">
          <CascadeSelector
            db={db}
            levels={CASCADE_LEVELS}
            colors={colors}
            onConfirm={handleCascadeConfirm}
          />
        </div>

        {/* Toast Sucesso Flutuante */}
        {isSaved && (
          <div className="fixed top-[80px] md:top-[100px] left-1/2 -translate-x-1/2 z-[60] bg-neutral-700 text-white px-[24px] py-[14px] rounded-[8px] md:rounded-full shadow-2xl flex items-center gap-[12px] animate-fade-slide w-[90%] md:w-auto justify-center max-w-[400px]">
            <CheckCircle className="text-green-400 w-[20px] h-[20px]" />
            <span className="font-bold text-[14px] md:text-[15px]">Chamada enviada com sucesso!</span>
          </div>
        )}

        {/* LISTA DE ALUNOS */}
        <div id="student-list-container">
          {!filters.avaliacaoId ? (
            <div className="bg-white rounded-[8px] border border-neutral-200 py-[48px] px-[24px] flex flex-col items-center justify-center text-center shadow-sm">
              <div className="w-[64px] h-[64px] rounded-full bg-neutral-100 flex items-center justify-center mb-[16px]">
                <ClipboardList className="text-neutral-400 w-[32px] h-[32px]" />
              </div>
              <h3 className="text-[18px] md:text-[20px] font-bold text-neutral-700 mb-[8px]">Nenhuma lista ativa</h3>
              <p class="text-[14px] text-neutral-600 max-w-[400px] leading-relaxed">Utilize o seletor acima para encontrar a escola, turma e a avaliação correspondente para carregar a lista de presença.</p>
            </div>
          ) : (
            <div className="bg-white rounded-[8px] border border-neutral-200 shadow-sm overflow-hidden animate-fade-slide mb-[24px]">
              <div className="p-[20px] md:p-[24px] border-b border-neutral-200 flex flex-col md:flex-row justify-between md:items-center gap-[16px] bg-white">
                <div>
                  <h2 className="text-[18px] md:text-[20px] font-bold text-neutral-700 flex items-center gap-[8px]">
                    <Users className="text-[#008BC9] w-[22px] h-[22px]" /> Lista de Chamada
                  </h2>
                  <p className="text-[13px] text-neutral-600 mt-[6px] leading-tight">Alocados para: <strong className="text-[#003A79]">{filters.avaliacaoNome}</strong></p>
                </div>

                <div className="flex items-center gap-[12px] w-full md:w-auto">
                  <div className="flex-1 md:flex-none flex flex-col items-center px-[16px] py-[8px] bg-green-50 rounded-[8px] border border-green-100">
                    <span className="text-[10px] md:text-[11px] font-bold text-green-700 uppercase">Presentes</span>
                    <span className="text-[20px] md:text-[24px] font-black text-green-600 leading-tight">{presencas}</span>
                  </div>
                  <div className="flex-1 md:flex-none flex flex-col items-center px-[16px] py-[8px] bg-red-50 rounded-[8px] border border-red-100">
                    <span className="text-[10px] md:text-[11px] font-bold text-red-700 uppercase">Faltas</span>
                    <span className="text-[20px] md:text-[24px] font-black text-red-600 leading-tight">{faltas}</span>
                  </div>
                </div>
              </div>

              <div className="flex flex-col divide-y divide-neutral-200">
                {db.alunos.map((aluno, index) => {
                  const status = presenceList[aluno.id];
                  return (
                    <div key={aluno.id} className="flex flex-col lg:flex-row lg:items-center justify-between p-[16px] md:p-[20px] gap-[12px] md:gap-[16px] hover:bg-neutral-50 transition-colors">
                      <div className="flex items-center gap-[12px] md:gap-[16px]">
                        <div className="font-bold text-neutral-400 text-[12px] md:text-[14px] w-[24px] text-center">{String(index + 1).padStart(2, '0')}</div>
                        <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-neutral-200 flex items-center justify-center text-[13px] md:text-[14px] font-bold text-neutral-600 shrink-0">
                          {aluno.nome.charAt(0)}
                        </div>
                        <div className="flex flex-col">
                          <span className="font-bold text-neutral-700 text-[14px] md:text-[15px] leading-tight">{aluno.nome}</span>
                          <span className="text-[12px] text-neutral-500 font-medium mt-[2px]">Matrícula: {aluno.matricula}</span>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 lg:flex gap-[8px] w-full lg:w-auto mt-[4px] lg:mt-0">
                        <label className="cursor-pointer w-full lg:w-[130px]">
                          <input
                            type="radio"
                            name={`presence_${aluno.id}`}
                            className="hidden"
                            value="ausente"
                            checked={status === 'ausente'}
                            onChange={() => setPresence(aluno.id, 'ausente')}
                          />
                          <div className={`flex items-center justify-center gap-[6px] h-[48px] md:h-[40px] rounded-[4px] border font-bold text-[13px] md:text-[14px] transition-all ${status === 'ausente' ? 'bg-red-500 text-white border-red-500 shadow-md' : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-100'}`}>
                            <XCircle size={18} /> Falta
                          </div>
                        </label>
                        <label className="cursor-pointer w-full lg:w-[130px]">
                          <input
                            type="radio"
                            name={`presence_${aluno.id}`}
                            className="hidden"
                            value="presente"
                            checked={status === 'presente'}
                            onChange={() => setPresence(aluno.id, 'presente')}
                          />
                          <div className={`flex items-center justify-center gap-[6px] h-[48px] md:h-[40px] rounded-[4px] border font-bold text-[13px] md:text-[14px] transition-all ${status === 'presente' ? 'bg-green-500 text-white border-green-500 shadow-md' : 'bg-white border-neutral-300 text-neutral-600 hover:bg-neutral-100'}`}>
                            <CheckCircle2 size={18} /> Presente
                          </div>
                        </label>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* FOOTER FIXO */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white border-t border-neutral-200 p-[16px] pb-[calc(16px+env(safe-area-inset-bottom))] md:px-[32px] md:py-[20px] flex flex-col md:flex-row justify-between md:items-center gap-[12px] md:gap-[16px] z-30 shadow-[0_-10px_15px_-3px_rgba(0,0,0,0.05)] transition-transform duration-500 ${filters.avaliacaoId ? 'translate-y-0' : 'translate-y-full'}`}>
        <div className="flex items-center w-full md:w-auto">
          {allMarked ? (
            <div className="flex items-center gap-[8px] text-green-700 bg-green-50 px-[16px] py-[10px] md:py-[8px] rounded-[8px] md:rounded-full border border-green-200 w-full md:w-auto justify-center">
              <CheckCircle size={18} />
              <span className="text-[13px] md:text-[14px] font-bold">Todos os alunos verificados</span>
            </div>
          ) : (
            <div className="flex items-center gap-[8px] text-amber-700 bg-amber-50 px-[16px] py-[10px] md:py-[8px] rounded-[8px] md:rounded-full border border-amber-200 w-full md:w-auto justify-center">
              <AlertTriangle size={18} />
              <span className="text-[13px] md:text-[14px] font-bold truncate">Pendências na lista de chamada</span>
            </div>
          )}
        </div>

        <button
          className="bg-[#008BC9] text-white px-[32px] h-[48px] md:h-[44px] w-full md:w-auto rounded-[4px] font-bold text-[14px] hover:bg-[#003A79] transition-colors flex items-center justify-center gap-[8px] shadow-md shrink-0"
          onClick={savePresence}
        >
          <Save size={18} />
          Salvar e Enviar Chamada
        </button>
      </div>
    </div>
  );
}
