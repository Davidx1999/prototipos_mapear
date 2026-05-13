import React from 'react';
import { 
  ArrowLeft, FileText, BookOpen, Search, ChevronDown, 
  Paperclip, Plus, Edit3, Trash2, Image as ImageIcon, 
  CheckSquare, Check 
} from 'lucide-react';
import Button from '../../ui/Button';
import Input from '../../ui/Input';

const AvaliacoesEditor = ({ 
  assessment, 
  onBack, 
  colors, 
  isDarkMode 
}) => {
  const primaryBase = colors.primary.base;
  const primaryExtraLight = colors.primary.extraLight;

  return (
    <div className="flex-1 flex overflow-hidden">
       
       {/* SIDEBAR ÁRVORE */}
       <aside className={`w-[300px] border-r flex flex-col shrink-0 ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
         <div className={`p-4 border-b flex items-center gap-3 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-1'}`}>
           <Button
             variant="tertiary"
             iconOnly
             size="sm"
             iconLeft={<ArrowLeft />}
             onClick={onBack}
             className={isDarkMode ? 'text-neutral-2 hover:bg-neutral-5 border-neutral-5' : ''}
           />
           <div className="flex flex-col overflow-hidden">
             <span className={`text-[10px] font-bold uppercase truncate ${isDarkMode ? 'text-neutral-4' : 'text-neutral-4'}`}>Voltando para listagem</span>
             <span className={`text-[12px] font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-7'}`} title={assessment.title}>{assessment.title}</span>
           </div>
         </div>
         
         <div className={`flex items-center gap-4 px-4 pt-4 border-b ${isDarkMode ? 'border-neutral-5' : 'border-neutral-1'}`}>
           <button className="text-[13px] font-bold pb-2 flex items-center gap-2" style={{ color: primaryBase, borderBottom: `3px solid ${primaryBase}` }}><FileText size={14}/> Avaliação</button>
           <button className={`text-[13px] font-bold pb-2 flex items-center gap-2 transition-colors ${isDarkMode ? 'text-neutral-3 hover:text-white' : 'text-neutral-4 hover:text-neutral-6'}`}><BookOpen size={14}/> Banco</button>
         </div>

         <div className="p-4 flex flex-col gap-4 overflow-y-auto">
            <Input 
              placeholder="Pesquisar..." 
              iconLeft={<Search />} 
              size="sm"
              height="32px"
              className={isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-neutral-1'}
            />
            
            {/* Tree Mock */}
            <div className={`flex flex-col gap-1 text-[12px] font-semibold ${isDarkMode ? 'text-neutral-2' : 'text-neutral-6'}`}>
               <div className={`flex items-center gap-1.5 p-1.5 rounded cursor-pointer ${isDarkMode ? 'hover:bg-neutral-5' : 'hover:bg-neutral-1'}`}>
                  <ChevronDown size={14}/> <FileText size={14} style={{ color: primaryBase }}/> <span>Prova Brasil 2026</span>
               </div>
               <div className={`flex flex-col pl-4 gap-1 border-l ml-3.5 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
                  <div className={`flex items-center gap-1.5 p-1.5 rounded cursor-pointer ${isDarkMode ? 'hover:bg-neutral-5' : 'hover:bg-neutral-1'}`}>
                    <ChevronDown size={14}/> <BookOpen size={14} className="text-neutral-4"/> <span>Caderno A</span>
                  </div>
                  <div className={`flex flex-col pl-4 gap-1 border-l ml-3 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
                     <div className={`flex items-center gap-1.5 p-1.5 rounded cursor-pointer border`} style={{ backgroundColor: isDarkMode ? '#003A79' : primaryExtraLight, color: isDarkMode ? '#FFFFFF' : '#003A79', borderColor: isDarkMode ? primaryBase : '#94CFEF' }}>
                       <Paperclip size={14}/> <span>Item 01</span>
                     </div>
                     <div className={`flex items-center gap-1.5 p-1.5 rounded cursor-pointer transition-colors ${isDarkMode ? 'hover:bg-neutral-5 text-neutral-4' : 'hover:bg-neutral-1 text-neutral-4'}`}>
                       <Paperclip size={14}/> <span>Item 02</span>
                     </div>
                     <div className={`flex items-center gap-1.5 p-1.5 rounded cursor-pointer border border-dashed transition-colors ${isDarkMode ? 'hover:bg-neutral-5 text-neutral-3' : 'hover:bg-neutral-1'}`} style={{ borderColor: primaryBase, color: primaryBase }}>
                       <Plus size={14}/> Adicionar novo Item
                     </div>
                  </div>
               </div>
            </div>
         </div>
       </aside>

       {/* ÁREA PRINCIPAL DO EDITOR */}
       <main className={`flex-1 overflow-y-auto relative flex flex-col ${isDarkMode ? 'bg-neutral-7' : 'bg-neutral-0'}`}>
          
          <div className="max-w-[800px] w-full mx-auto p-8 flex flex-col gap-6 pb-32">
             
             <div className={`flex justify-between items-center border-b pb-4 ${isDarkMode ? 'border-neutral-5' : 'border-neutral-2'}`}>
                <div className="flex flex-col gap-1">
                  <span className={`text-[12px] font-semibold uppercase tracking-wider ${isDarkMode ? 'text-neutral-4' : 'text-neutral-4'}`}>Prova Brasil 2026 / Caderno A</span>
                  <h2 className={`text-[22px] font-bold ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>Item 01: Interpretação de Imagem</h2>
                </div>
                <div className="flex gap-2">
                   <button className={`w-8 h-8 rounded border flex items-center justify-center shadow-sm transition-colors ${isDarkMode ? 'bg-neutral-6 border-neutral-5 text-neutral-2 hover:bg-neutral-5' : 'bg-neutral-0 border-neutral-2 text-neutral-4 hover:bg-neutral-1'}`}><Edit3 size={14}/></button>
                   <button className={`w-8 h-8 rounded border flex items-center justify-center shadow-sm transition-colors ${isDarkMode ? 'bg-neutral-6 border-red-900/30 text-red-500 hover:bg-red-900/20' : 'bg-neutral-0 border-red-200 text-red-500 hover:bg-red-50'}`}><Trash2 size={14}/></button>
                </div>
             </div>

             {/* ENUNCIADO */}
             <div className={`border rounded-xl overflow-hidden shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
                <div className={`px-5 py-3 border-b flex justify-between items-center ${isDarkMode ? 'bg-neutral-5/50 border-neutral-5' : 'bg-neutral-1 border-neutral-1'}`}>
                   <h3 className={`font-bold text-[13px] flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-neutral-6'}`}><FileText size={16} style={{ color: primaryBase }}/> Enunciado do Item</h3>
                   <button className="text-[11px] font-bold flex items-center gap-1" style={{ color: primaryBase }}><Edit3 size={12}/> Editar Enunciado</button>
                </div>
                <div className={`p-5 flex flex-col gap-4 text-[13px] leading-relaxed ${isDarkMode ? 'text-neutral-2' : 'text-neutral-6'}`}>
                   <p>Observe atentamente a imagem abaixo, que retrata uma cena do cotidiano. Com base nos elementos visuais, no contexto implícito e nas expressões das personagens, responda à questão formulada a seguir.</p>
                   <div className={`w-full max-w-[300px] h-[200px] border rounded flex items-center justify-center relative overflow-hidden ${isDarkMode ? 'bg-neutral-7 border-neutral-5' : 'bg-neutral-1 border-neutral-2'}`}>
                      <ImageIcon size={32} className={isDarkMode ? 'text-neutral-5' : 'text-neutral-3'}/>
                      {/* Placeholder image */}
                      <img src="https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&q=80&w=600" className="absolute inset-0 w-full h-full object-cover opacity-90" alt="Exemplo" />
                   </div>
                   <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-neutral-7'}`}>Pergunta: Qual a relação entre a atitude da menina e o cenário descrito?</p>
                </div>
             </div>

             {/* RESPOSTA */}
             <div className={`border rounded-xl overflow-hidden shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
                <div className={`px-5 py-3 border-b flex justify-between items-center ${isDarkMode ? 'bg-neutral-5/50 border-neutral-5' : 'bg-neutral-1 border-neutral-1'}`}>
                   <h3 className={`font-bold text-[13px] flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-neutral-6'}`}><CheckSquare size={16} style={{ color: primaryBase }}/> Tipo de Resposta</h3>
                </div>
                <div className="p-5 flex flex-col gap-2">
                   <label className={`text-[11px] font-bold uppercase ${isDarkMode ? 'text-neutral-4' : 'text-neutral-4'}`}>Formato</label>
                   <div className="relative w-full max-w-[300px]">
                     <select className={`w-full px-3 py-2 border rounded text-[13px] font-semibold outline-none appearance-none cursor-pointer focus:border-primary-base transition-colors ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'bg-neutral-0 border-neutral-3 text-neutral-6'}`}>
                       <option>Questão Aberta (Texto)</option>
                       <option>Múltipla Escolha</option>
                       <option>Verdadeiro ou Falso</option>
                     </select>
                     <ChevronDown size={16} className={`absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none ${isDarkMode ? 'text-neutral-4' : 'text-neutral-4'}`} />
                   </div>
                </div>
             </div>

             {/* PADRÕES DE DESEMPENHO */}
             <div className={`border rounded-xl overflow-hidden shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
                <div className={`px-5 py-3 border-b flex justify-between items-center ${isDarkMode ? 'bg-neutral-5/50 border-neutral-5' : 'bg-neutral-1 border-neutral-1'}`}>
                   <h3 className={`font-bold text-[13px] flex items-center gap-2 ${isDarkMode ? 'text-white' : 'text-neutral-6'}`}><Check size={16} className="text-green-600"/> Padrão de Desempenho Esperado</h3>
                </div>
                <div className="p-5">
                   <textarea 
                     rows="4"
                     className={`w-full p-3 border rounded text-[13px] outline-none focus:border-primary-base resize-none transition-colors ${isDarkMode ? 'bg-neutral-7 border-neutral-5 text-white' : 'border-neutral-3 text-neutral-6'}`}
                     defaultValue="O aluno deve ser capaz de identificar que a menina demonstra empatia ao ajudar o animal, correlacionando essa ação com a chuva forte evidenciada no plano de fundo."
                   ></textarea>
                </div>
             </div>

             {/* HABILIDADES */}
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className={`border rounded-xl overflow-hidden shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
                   <div className={`px-5 py-3 border-b flex justify-between items-center ${isDarkMode ? 'bg-neutral-5/50 border-neutral-5' : 'bg-neutral-1 border-neutral-1'}`}>
                      <h3 className={`font-bold text-[13px] ${isDarkMode ? 'text-white' : 'text-neutral-6'}`}>Habilidades Evidenciadas</h3>
                   </div>
                   <div className="p-5 flex flex-col gap-3">
                      {['H1. Localizar informação explícita', 'H3. Inferir o sentido de uma palavra'].map(h => (
                        <label key={h} className={`flex items-center gap-2 text-[12px] cursor-pointer ${isDarkMode ? 'text-neutral-2' : 'text-neutral-6'}`}>
                          <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-base" /> {h}
                        </label>
                      ))}
                      <button className="text-[11px] font-bold flex items-center gap-1 w-max mt-2" style={{ color: primaryBase }}><Plus size={14}/> Adicionar Habilidade</button>
                   </div>
                </div>
                <div className={`border rounded-xl overflow-hidden shadow-sm ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
                   <div className={`px-5 py-3 border-b flex justify-between items-center ${isDarkMode ? 'bg-neutral-5/50 border-neutral-5' : 'bg-neutral-1 border-neutral-1'}`}>
                      <h3 className={`font-bold text-[13px] ${isDarkMode ? 'text-white' : 'text-neutral-6'}`}>Habilidades a Reforçar</h3>
                   </div>
                   <div className="p-5 flex flex-col gap-3">
                      <label className={`flex items-center gap-2 text-[12px] cursor-pointer ${isDarkMode ? 'text-neutral-2' : 'text-neutral-6'}`}>
                        <input type="checkbox" defaultChecked className="w-4 h-4 rounded text-primary-base" /> H5. Interpretar com auxílio de material gráfico
                      </label>
                      <label className={`flex items-center gap-2 text-[12px] cursor-pointer ${isDarkMode ? 'text-neutral-2' : 'text-neutral-6'}`}>
                        <input type="checkbox" className="w-4 h-4 rounded text-primary-base" /> H7. Identificar o tema do texto
                      </label>
                      <button className="text-[11px] font-bold flex items-center gap-1 w-max mt-2" style={{ color: primaryBase }}><Plus size={14}/> Adicionar Habilidade</button>
                   </div>
                </div>
             </div>
          </div>
          
          {/* BOTÃO FLUTUANTE DE AÇÃO */}
          <div className={`absolute bottom-0 left-0 right-0 border-t p-4 px-8 flex items-center gap-4 justify-start z-10 shadow-[0_-4px_15px_rgba(0,0,0,0.05)] ${isDarkMode ? 'bg-neutral-6 border-neutral-5' : 'bg-neutral-0 border-neutral-2'}`}>
             <Button
               variant="primary"
               onClick={() => {}}
               className="px-8 py-2.5"
             >
               SALVAR E CONTINUAR
             </Button>
             <Button
               variant="tertiary"
               onClick={onBack}
               className={`px-6 py-2.5 ${isDarkMode ? 'text-neutral-2 hover:bg-neutral-5 border-neutral-5' : ''}`}
             >
               CANCELAR
             </Button>
          </div>

       </main>
    </div>
  );
};

export default AvaliacoesEditor;
