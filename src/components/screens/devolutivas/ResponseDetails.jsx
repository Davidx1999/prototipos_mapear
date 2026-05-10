import React, { useState, useRef, useMemo, useEffect } from 'react';
import { 
  HelpCircle, 
  LayoutDashboard, 
  ChevronRight, 
  ChevronDown, 
  Users, 
  Paperclip,
  ArrowLeft
} from 'lucide-react';
import CascadeSelector from '../../ui/CascadeSelector';
import Chips from '../../ui/Chips';

export default function ResponseDetails({ 
  navPath, 
  handleContextChange, 
  colors, 
  navLevel, 
  db, 
  levels,
  students = [],
  colGroups = [],
  statusColors = {},
  initialSelection = null
}) {
  // --- ESTADOS DA VISÃO DE DETALHES ---
  const [detTurma, setDetTurma] = useState(initialSelection?.turma || navPath[4] || '');
  const [detAluno, setDetAluno] = useState(initialSelection?.studentName || '');
  const [detQuestao, setDetQuestao] = useState(initialSelection?.questaoId || '');
  const [isDetAccordionOpen, setIsDetAccordionOpen] = useState(true);
  const [detAccordionTab, setDetAccordionTab] = useState('Enunciado');

  // Sincroniza se a seleção inicial mudar via props (deep link vindo do heatmap)
  useEffect(() => {
    if (initialSelection) {
      if (initialSelection.turma) setDetTurma(initialSelection.turma);
      if (initialSelection.studentName) setDetAluno(initialSelection.studentName);
      if (initialSelection.questaoId) setDetQuestao(initialSelection.questaoId);
    }
  }, [initialSelection]);

  // Derivados
  const groupedStudents = useMemo(() => {
    const groups = {};
    students.forEach(s => {
      if (!groups[s.turma]) groups[s.turma] = [];
      groups[s.turma].push(s);
    });
    return groups;
  }, [students]);

  // Prepara dados e status do Aluno selecionado para a View de Detalhes
  const getSelectedStudentStatus = () => {
    if (!detAluno || !detQuestao) return null;
    const student = students.find(s => s.name === detAluno);
    if (!student) return null;
    
    let colIndex = -1;
    for (const group of colGroups) {
      const c = group.cols.find(c => c.id === detQuestao);
      if (c) { 
        colIndex = c.originalIndex; 
        break; 
      }
    }
    
    if (colIndex === -1) return null;
    
    const val = student.data[colIndex];
    return statusColors[val];
  };

  const studentStatus = getSelectedStudentStatus();

  return (
    <main className="flex-1 overflow-y-auto bg-neutral-0 custom-scrollbar">
      <div className="max-w-[1200px] mx-auto p-6 md:p-10 flex flex-col gap-8 animate-fade-in">
                {/* Secção Contexto (Substitui Sidebar) */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <label className="text-[14px] font-bold text-neutral-7 flex items-center gap-2">
              Seleção de Contexto 
              <HelpCircle size={14} className="text-neutral-4" />
            </label>
          </div>
          
          <div className="w-full md:max-w-[48%]">
            <CascadeSelector
              navPath={navPath}
              handleContextChange={handleContextChange}
              colors={colors}
              navLevel={navLevel}
              db={db}
              levels={levels}
              variant="full"
            />
          </div>
        </div>

        <div className="h-px bg-neutral-2 w-full"></div>

        {/* Secção Visão Geral e Filtros */}
        <div className="flex flex-col gap-2">
          <h2 className="text-[18px] font-bold text-neutral-8">Visão Geral</h2>
          <p className="text-[14px] text-neutral-5 font-medium">
            Resumo dos dados das células, informações relevantes e padrões identificados.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Turma */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-neutral-7 uppercase tracking-wider">Turma</label>
            <div className="relative group">
              <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-4 group-focus-within:text-[#008BC9] transition-colors" />
              <select 
                value={detTurma} 
                onChange={(e) => { setDetTurma(e.target.value); setDetAluno(''); setDetQuestao(''); }}
                className="w-full pl-10 pr-10 py-2.5 border border-neutral-3 rounded-lg text-[13px] font-semibold text-neutral-7 outline-none appearance-none cursor-pointer focus:border-[#008BC9] focus:ring-4 focus:ring-[#008BC9]/5 shadow-sm bg-white transition-all"
              >
                <option value="">Escolha uma turma...</option>
                {Object.keys(groupedStudents).map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-4 pointer-events-none" />
            </div>
          </div>

          {/* Aluno */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-neutral-7 uppercase tracking-wider">Aluno</label>
            <div className="relative group">
              <Users size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-4 group-focus-within:text-[#008BC9] transition-colors" />
              <select 
                value={detAluno} 
                onChange={(e) => setDetAluno(e.target.value)}
                disabled={!detTurma}
                className="w-full pl-10 pr-10 py-2.5 border border-neutral-3 rounded-lg text-[13px] font-semibold text-neutral-7 outline-none appearance-none cursor-pointer focus:border-[#008BC9] focus:ring-4 focus:ring-[#008BC9]/5 shadow-sm bg-white disabled:bg-neutral-1 disabled:text-neutral-4 transition-all"
              >
                <option value="">Escolha um aluno...</option>
                {detTurma && groupedStudents[detTurma]?.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-4 pointer-events-none" />
            </div>
          </div>

          {/* Questão */}
          <div className="flex flex-col gap-2">
            <label className="text-[12px] font-bold text-neutral-7 uppercase tracking-wider">Questão</label>
            <div className="relative group">
              <Paperclip size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-4 group-focus-within:text-[#008BC9] transition-colors" />
              <select 
                value={detQuestao} 
                onChange={(e) => setDetQuestao(e.target.value)}
                className="w-full pl-10 pr-10 py-2.5 border border-neutral-3 rounded-lg text-[13px] font-semibold text-neutral-7 outline-none appearance-none cursor-pointer focus:border-[#008BC9] focus:ring-4 focus:ring-[#008BC9]/5 shadow-sm bg-white transition-all"
              >
                <option value="">Escolha uma questão...</option>
                {colGroups.flatMap(g => g.cols).map(c => (
                  <option key={c.id} value={c.id}>{c.id}</option>
                ))}
              </select>
              <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-4 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Accordion Enunciado */}
        <div className="w-full border border-neutral-2 rounded-xl overflow-hidden shadow-md bg-white">
          <div className="flex flex-col md:flex-row bg-neutral-1 border-b border-neutral-2">
            <div 
              className="px-6 py-4 shrink-0 flex items-center justify-center cursor-pointer hover:bg-neutral-2 transition-colors border-r border-neutral-2"
              onClick={() => setIsDetAccordionOpen(!isDetAccordionOpen)}
            >
              <ChevronDown size={20} className={`text-neutral-5 transition-transform duration-300 ${isDetAccordionOpen ? 'rotate-180' : ''}`} />
            </div>
            {['Enunciado', 'Padrões de Desempenho', 'Soluções e Comentários'].map(tab => (
              <div 
                key={tab}
                onClick={() => { setDetAccordionTab(tab); setIsDetAccordionOpen(true); }}
                className={`flex-1 px-6 py-4 text-[13px] font-bold text-center cursor-pointer transition-all ${detAccordionTab === tab && isDetAccordionOpen ? 'bg-white border-b-2 border-[#008BC9] text-[#008BC9]' : 'text-neutral-5 hover:bg-white hover:text-neutral-8 border-b-2 border-transparent'}`}
              >
                {tab}
              </div>
            ))}
          </div>
          
          {isDetAccordionOpen && (
            <div className="p-8 md:p-10 bg-white text-[14px] text-neutral-7 leading-relaxed min-h-[250px] animate-fade-in">
              {detQuestao ? (
                detAccordionTab === 'Enunciado' ? (
                  <div className="flex flex-col gap-6">
                    <div className="prose prose-sm max-w-none text-neutral-7">
                      <p className="font-medium text-[15px]">Considere a seguinte situação problema:</p>
                      <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                      <p>Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                    </div>
                    <div className="w-full max-w-[500px] aspect-video bg-neutral-1 border border-neutral-2 rounded-xl mt-4 flex items-center justify-center relative overflow-hidden group shadow-inner">
                      <img 
                        src="https://images.unsplash.com/photo-1453728013993-6d66e9c9123a?auto=format&fit=crop&q=80&w=800" 
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        alt="Ilustração da Questão"
                      />
                      <div className="absolute inset-0 bg-black/5 group-hover:bg-transparent transition-colors"></div>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-4 items-center justify-center h-full py-10">
                    <div className="w-12 h-12 rounded-full bg-[#D9F0FC] flex items-center justify-center text-[#008BC9] mb-2">
                      <HelpCircle size={24} />
                    </div>
                    <p className="font-bold text-neutral-8">Conteúdo de {detAccordionTab}</p>
                    <p className="text-neutral-5 max-w-md text-center">Informações detalhadas sobre a questão {detQuestao} e os critérios de avaliação aplicados.</p>
                  </div>
                )
              ) : (
                 <div className="h-full flex flex-col items-center justify-center text-neutral-4 italic py-20 gap-3">
                   <div className="w-16 h-16 rounded-full bg-neutral-1 flex items-center justify-center">
                     <Paperclip size={32} />
                   </div>
                   Selecione uma questão para visualizar o enunciado completo.
                 </div>
              )}
            </div>
          )}
        </div>

        {/* Áreas de Resposta - Layout Vertical conforme pedido */}
        <div className="flex flex-col gap-8">
          {/* Resposta Significativa Primeiro */}
          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-bold text-neutral-8 px-1 uppercase tracking-wide">Resposta Significativa</span>
            <div className="w-full bg-white border border-neutral-2 rounded-xl p-8 relative min-h-[120px] flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
              {(!detAluno || !detQuestao) ? (
                <span className="text-neutral-3 text-[14px] italic text-center">Nenhum(a) aluno(a) escolhido(a) para visualização.</span>
              ) : (
                <>
                  <span className="absolute top-4 left-4 text-[11px] font-bold text-neutral-4 uppercase tracking-widest">Padrão Esperado:</span>
                  <p className="text-[15px] font-medium text-neutral-8 leading-relaxed italic border-l-4 border-[#008BC9] pl-4 py-1 mt-4">
                    "Não, nenhum porque o cálculo precisa do denominador comum e a resposta correta para a operação seria 7/6."
                  </p>
                  <div className="absolute top-4 right-4">
                    <Chips 
                      label={statusColors.parcialmente?.label || 'Parcialmente'}
                      status="warning"
                      variant="light"
                      iconLeft={statusColors.parcialmente?.icon}
                    />
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Resposta do Aluno Segundo */}
          <div className="flex flex-col gap-4">
            <span className="text-[14px] font-bold text-neutral-8 px-1 uppercase tracking-wide">Resposta do Aluno</span>
            <div className="w-full bg-white border border-neutral-2 rounded-xl p-8 relative min-h-[120px] flex flex-col justify-center shadow-sm hover:shadow-md transition-shadow">
              {(!detAluno || !detQuestao) ? (
                <span className="text-neutral-3 text-[14px] italic text-center">Nenhum(a) aluno(a) escolhido(a) para visualização.</span>
              ) : (
                <>
                  <span className="absolute top-4 left-4 text-[11px] font-bold text-neutral-4 uppercase tracking-widest">Produção do Aluno:</span>
                  <p className="text-[15px] font-medium text-neutral-8 leading-relaxed italic border-l-4 border-neutral-3 pl-4 py-1 mt-4">
                    "Não."
                  </p>
                  {studentStatus && (
                    <div className="absolute top-4 right-4">
                      <Chips 
                        label={studentStatus.label}
                        status={
                          studentStatus.label.includes('Suficiente') && !studentStatus.label.includes('Parcialmente') ? 'success' :
                          studentStatus.label.includes('Parcialmente') ? 'warning' :
                          studentStatus.label.includes('Insuficiente') ? 'error' : 'neutral'
                        }
                        variant="light"
                        iconLeft={studentStatus.icon}
                      />
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Secções em Texto Corrido - Listadas e Soltas */}
        <div className="flex flex-col gap-12 mt-4 text-[14px] text-neutral-7 leading-relaxed">
           
           {/* Análise */}
           <div className="flex flex-col gap-4">
             <h4 className="text-[16px] font-bold text-neutral-9 flex items-center gap-2">
               <div className="w-2 h-6 bg-[#008BC9] rounded-full"></div>
               Análise da Resposta do Aluno
             </h4>
             {(!detAluno || !detQuestao) ? (
                <p className="text-neutral-4 italic">Selecione os filtros acima para gerar a análise.</p>
             ) : (
                <div className="prose prose-sm max-w-none text-neutral-7">
                  <p>O aluno demonstra um entendimento inicial do conceito de adição de frações, reconhecendo que o procedimento apresentado na questão está incorreto. A maioria dos estudantes percebe que a simples soma dos numeradores e denominadores não é o método adequado para a adição de frações, especialmente quando os denominadores são diferentes. Entretanto, a justificativa para essa incorreção, na maioria das vezes, carece de precisão matemática ou apresenta inconsistências na aplicação de outros métodos, como o MMC (Mínimo Múltiplo Comum) ou o "método da borboleta" (multiplicação cruzada). Isso sugere uma compreensão superficial dos conceitos subjacentes à operação com frações, indicando a necessidade de aprofundamento e consolidação do conhecimento.</p>
                </div>
             )}
           </div>

           {/* Habilidades Grid */}
           <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
             <div className="flex flex-col gap-4">
               <h4 className="text-[15px] font-bold text-neutral-9 uppercase tracking-wide border-b border-neutral-2 pb-2">Habilidades Evidenciadas</h4>
               {(!detAluno || !detQuestao) ? (
                  <p className="text-neutral-4 italic">Nenhum(a) aluno(a) escolhido(a).</p>
               ) : (
                  <ul className="flex flex-col gap-6">
                    <li className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-[11px] shrink-0 shadow-sm">H1</div>
                      <p className="text-[14px]"><span className="font-bold text-neutral-8">S01.H1</span> Os estudantes demonstram reconhecer os números naturais presentes nas frações, embora ainda não os utilizem corretamente na operação de adição.</p>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-10 h-10 rounded-full bg-[#E0F2FE] text-[#0369A1] flex items-center justify-center font-bold text-[11px] shrink-0 shadow-sm">H7</div>
                      <p className="text-[14px]"><span className="font-bold text-neutral-8">S01.H7</span> Implicitamente, ao reconhecerem a necessidade de denominadores iguais para a adição, os estudantes demonstram uma compreensão inicial da comparação de números.</p>
                    </li>
                  </ul>
               )}
             </div>

             <div className="flex flex-col gap-4">
               <h4 className="text-[15px] font-bold text-neutral-9 uppercase tracking-wide border-b border-neutral-2 pb-2">Reforço Necessário</h4>
               {(!detAluno || !detQuestao) ? (
                  <p className="text-neutral-4 italic">Nenhum(a) aluno(a) escolhido(a).</p>
               ) : (
                  <div className="space-y-6">
                    <div className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></div>
                      <p className="text-[14px]"><span className="font-bold text-neutral-8">Compreensão conceitual:</span> É fundamental aprofundar a compreensão do significado da adição de frações, explorando representações gráficas.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></div>
                      <p className="text-[14px]"><span className="font-bold text-neutral-8">Domínio de métodos:</span> O MMC e o "método da borboleta" precisam ser trabalhados com maiorênfase, focando na justificativa.</p>
                    </div>
                    <div className="flex gap-3 items-start">
                      <div className="w-2 h-2 rounded-full bg-red-400 mt-2 shrink-0"></div>
                      <p className="text-[14px]"><span className="font-bold text-neutral-8">Linguagem matemática:</span> Incentivar o uso de termos corretos e a construção de justificativas precisas.</p>
                    </div>
                  </div>
               )}
             </div>
           </div>

           {/* Sugestões */}
           <div className="flex flex-col gap-6">
             <h4 className="text-[16px] font-bold text-neutral-9 border-b border-neutral-2 pb-2">Sugestões para o Professor</h4>
             {(!detAluno || !detQuestao) ? (
                <p className="text-neutral-4 italic">Nenhum(a) aluno(a) escolhido(a).</p>
             ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {[
                    "Utilizar materiais concretos como barras de frações ou círculos fracionados.",
                    "Desenhar as frações em retângulos ou círculos para visualizar denominadores iguais.",
                    "Jogos de dominós de frações ou cartas com diferentes representações.",
                    "Apresentar problemas do cotidiano que envolvam a adição de frações.",
                    "Propor a análise de resoluções incorretas para identificar erros."
                  ].map((sug, i) => (
                    <div key={i} className="flex items-start gap-3 p-4 rounded-xl hover:bg-neutral-1 transition-colors">
                      <div className="w-6 h-6 rounded-lg bg-green-100 text-green-700 flex items-center justify-center shrink-0">
                        <ChevronRight size={14} />
                      </div>
                      <p className="text-[13px] font-medium text-neutral-7 leading-relaxed">{sug}</p>
                    </div>
                  ))}
                </div>
             )}
           </div>

        </div>
      </div>
    </main>
  );
}
